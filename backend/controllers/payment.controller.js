// controllers/payment.controller.js
const PDFDocument = require('pdfkit');
const stripe = require('../config/stripe');
const { reconcileUser } = require('../utils/reconcile');
const {
  getSignupPriceId,
  getSubscriptionPriceId,
  getEffectivePlan,
  getPublicCatalog,
  isSubscriptionPlan
} = require('../utils/plans');
const {
  isSubscriptionActive,
  canStartFreshCheckout,
  subscriptionStateLabel
} = require('../utils/subscription');

const userRepo = require('../repositories/user.repo');
const paymentRepo = require('../repositories/payment.repo');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function ensureStripeCustomer(user) {
  if (user.stripeCustomerId) {
    try {
      const existing = await stripe.customers.retrieve(user.stripeCustomerId);
      if (!existing.deleted) return existing;
    } catch (_) {}
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user.id, role: user.role }
  });

  await userRepo.updateFields(user.id, { stripeCustomerId: customer.id });
  return customer;
}

const getCatalog = (req, res) => {
  res.json({
    catalog: getPublicCatalog(),
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null
  });
};

const createSignupCheckout = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admins do not require signup payment' });
    }
    if (user.signupPaid) {
      return res.status(400).json({ message: 'Signup already completed' });
    }

    const priceId = getSignupPriceId(user.role);
    if (!priceId) {
      return res.status(500).json({ message: `Signup price not configured for role: ${user.role}` });
    }

    const customer = await ensureStripeCustomer(user);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      payment_intent_data: {
        metadata: { userId: user.id, type: 'signup', role: user.role }
      },
      metadata: { userId: user.id, type: 'signup', role: user.role },
      success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=signup`,
      cancel_url: `${FRONTEND_URL}/checkout/cancel?type=signup`
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('createSignupCheckout error:', err);
    res.status(500).json({ message: 'Failed to create signup checkout', error: err.message });
  }
};

const createSubscriptionCheckout = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admins already have full access' });
    }
    if (!user.signupPaid) {
      return res.status(400).json({ message: 'Complete signup payment first' });
    }

    const plan = String(req.body.plan || '').toLowerCase();
    if (!isSubscriptionPlan(user.role, plan)) {
      return res.status(400).json({
        message: user.role === 'employee'
          ? 'Only the Pro plan is available for employees.'
          : 'Invalid plan. Must be lite or pro.'
      });
    }

    const sub = user.subscription;
    const state = subscriptionStateLabel(sub);

    if (sub?.plan === plan && isSubscriptionActive(sub) && !sub.cancelAtPeriodEnd) {
      return res.json({
        message: `You are already on the ${plan} plan.`,
        mode: 'noop',
        state
      });
    }

    const priceId = getSubscriptionPriceId(user.role, plan);
    if (!priceId) {
      return res.status(500).json({ message: `Price not configured for ${user.role}/${plan}` });
    }

    const customer = await ensureStripeCustomer(user);
    const allowFresh = canStartFreshCheckout(sub);

    if (!allowFresh && sub?.stripeSubscriptionId) {
      try {
        const portal = await stripe.billingPortal.sessions.create({
          customer: customer.id,
          return_url: `${FRONTEND_URL}/checkout/success?type=portal`,
          flow_data: {
            type: 'subscription_update',
            subscription_update: { subscription: sub.stripeSubscriptionId },
            after_completion: {
              type: 'redirect',
              redirect: { return_url: `${FRONTEND_URL}/checkout/success?type=portal` }
            }
          }
        });
        return res.json({ url: portal.url, mode: 'portal', state });
      } catch (portalErr) {
        console.warn('Portal flow failed, using plain portal:', portalErr.message);
        const portal = await stripe.billingPortal.sessions.create({
          customer: customer.id,
          return_url: `${FRONTEND_URL}/checkout/success?type=portal`
        });
        return res.json({ url: portal.url, mode: 'portal', state });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { userId: user.id, plan, role: user.role }
      },
      metadata: { userId: user.id, type: 'subscription', plan, role: user.role },
      success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
      cancel_url: `${FRONTEND_URL}/checkout/cancel?type=subscription`
    });

    res.json({ url: session.url, sessionId: session.id, mode: 'checkout' });
  } catch (err) {
    console.error('createSubscriptionCheckout error:', err);
    res.status(500).json({ message: 'Failed to create subscription checkout', error: err.message });
  }
};

const openBillingPortal = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const customer = await ensureStripeCustomer(user);
    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${FRONTEND_URL}/checkout/success?type=portal`
    });

    res.json({ url: portal.url });
  } catch (err) {
    console.error('openBillingPortal error:', err);
    res.status(500).json({ message: 'Failed to open billing portal', error: err.message });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) {
      return res.status(200).json({
        ready: false,
        signupPaid: false,
        plan: 'none',
        subscriptionState: 'none',
        subscription: null,
        lastReconcileAt: null,
        reason: 'user_not_found'
      });
    }

    const effectivePlan = getEffectivePlan(user);
    const signupPaid = !!user.signupPaid;
    const sub = user.subscription || null;
    const state = subscriptionStateLabel(sub);
    const subscriptionActive = sub && (sub.status === 'active' || sub.status === 'trialing');

    const ready =
      signupPaid ||
      effectivePlan === 'pro' ||
      effectivePlan === 'lite' ||
      subscriptionActive;

    res.json({
      ready,
      signupPaid,
      role: user.role,
      plan: effectivePlan,
      subscriptionState: state,
      subscription: sub,
      lastReconcileAt: user.lastReconcileAt || null,
      checkedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('getPaymentStatus error:', err);
    res.status(200).json({
      ready: false,
      signupPaid: false,
      plan: 'none',
      subscriptionState: 'none',
      subscription: null,
      lastReconcileAt: null,
      reason: 'server_error',
      error: err.message
    });
  }
};

const syncMyPayment = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) {
      return res.status(200).json({
        message: 'User not found',
        changed: false,
        ready: false,
        signupPaid: false,
        plan: 'none',
        subscription: null
      });
    }

    let changed = false;
    let reconcileError = null;

    if (user.stripeCustomerId) {
      try {
        const result = await reconcileUser(user.id, { silent: true });
        changed = !!result.changed;
        await userRepo.updateFields(user.id, {
          lastReconcileAt: new Date().toISOString()
        });
      } catch (recErr) {
        reconcileError = recErr.message;
        console.error('syncMyPayment reconcile error:', recErr.message);
      }
    }

    const fresh = await userRepo.findById(user.id);
    const effectivePlan = getEffectivePlan(fresh);
    const signupPaid = !!fresh.signupPaid;
    const sub = fresh.subscription || null;
    const subscriptionActive = sub && (sub.status === 'active' || sub.status === 'trialing');

    const ready =
      signupPaid ||
      effectivePlan === 'pro' ||
      effectivePlan === 'lite' ||
      subscriptionActive;

    res.json({
      message: changed ? 'State updated from Stripe' : 'No changes needed',
      changed,
      ready,
      signupPaid,
      plan: effectivePlan,
      subscription: sub,
      lastReconcileAt: fresh.lastReconcileAt || null,
      reconcileError
    });
  } catch (err) {
    console.error('syncMyPayment error:', err);
    res.status(200).json({
      message: 'Sync failed, retry will happen',
      changed: false,
      ready: false,
      signupPaid: false,
      plan: 'none',
      subscription: null,
      error: err.message
    });
  }
};

const verifyCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId is required' });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'payment_intent']
    });

    const userId = session.metadata?.userId;
    if (!userId) return res.status(400).json({ message: 'Invalid session metadata' });
    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Session does not belong to you' });
    }

    const isPaid =
      session.payment_status === 'paid' ||
      session.payment_status === 'no_payment_required';

    if (!isPaid) {
      const user = await userRepo.findById(userId);
      return res.json({
        message: 'Payment still processing',
        status: session.payment_status,
        effectivePlan: getEffectivePlan(user)
      });
    }

    const result = await reconcileUser(userId, { silent: true });
    const fresh = await userRepo.findById(userId);

    res.json({
      message: result.changed ? 'Payment confirmed' : 'No state change needed',
      user: fresh,
      effectivePlan: getEffectivePlan(fresh)
    });
  } catch (err) {
    console.error('verifyCheckoutSession error:', err);
    res.status(500).json({ message: 'Failed to verify session', error: err.message });
  }
};

const reconcileUserEndpoint = async (req, res) => {
  try {
    const result = await reconcileUser(req.params.userId);
    res.json({
      message: result.changed ? 'User state synced from Stripe' : 'No changes needed',
      result
    });
  } catch (err) {
    console.error('reconcileUser error:', err);
    res.status(500).json({ message: 'Failed to reconcile user', error: err.message });
  }
};

const reconcileAllEndpoint = async (req, res) => {
  try {
    const users = await userRepo.listWithStripe();
    const CHUNK = 5;
    const results = [];

    for (let i = 0; i < users.length; i += CHUNK) {
      const chunk = users.slice(i, i + CHUNK);
      const chunkResults = await Promise.all(
        chunk.map(async (u) => {
          try {
            return await reconcileUser(u.id, { silent: true });
          } catch (e) {
            return { userId: u.id, error: e.message };
          }
        })
      );
      results.push(...chunkResults);
    }

    const changedCount = results.filter((r) => r.changed).length;
    res.json({
      message: `Reconciled ${users.length} users, ${changedCount} updated`,
      results
    });
  } catch (err) {
    console.error('reconcileAll error:', err);
    res.status(500).json({ message: 'Failed to reconcile', error: err.message });
  }
};

const listAllPayments = async (req, res) => {
  try {
    const all = await paymentRepo.listAll();
    const users = await userRepo.listAll();

    const enriched = all.map((p) => {
      const u = users.find((x) => String(x.id) === String(p.userId));
      return {
        id: p.id,
        userId: p.userId,
        userName: u?.name || 'Unknown',
        userEmail: u?.email || 'Unknown',
        userRole: u?.role || 'Unknown',
        type: p.type,
        plan: p.plan || (p.type === 'signup' ? 'signup' : 'pro'),
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt
      };
    });

    res.json({ payments: enriched, total: enriched.length });
  } catch (err) {
    console.error('listAllPayments error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const p = await paymentRepo.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Payment not found' });

    const u = await userRepo.findById(p.userId);
    res.json({
      payment: {
        id: p.id,
        userId: p.userId,
        userName: u?.name || 'Unknown',
        userEmail: u?.email || 'Unknown',
        userRole: u?.role || 'Unknown',
        userPlan: u ? getEffectivePlan(u) : 'Unknown',
        type: p.type,
        plan: p.plan || (p.type === 'signup' ? 'signup' : 'pro'),
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt,
        stripeSessionId: p.stripeSessionId || null,
        stripeSubscriptionId: p.stripeSubscriptionId || null,
        stripeEventId: p.stripeEventId || null
      }
    });
  } catch (err) {
    console.error('getPaymentById error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const p = await paymentRepo.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Payment not found' });

    const u = await userRepo.findById(p.userId);
    const invoiceNumber = `INV-${String(p.id).slice(-8).toUpperCase()}`;
    const amount = ((p.amount || 0) / 100).toFixed(2);
    const currency = (p.currency || 'usd').toUpperCase();
    const plan = p.plan || (p.type === 'signup' ? 'signup' : 'pro');
    const typeLabel = p.type === 'signup'
      ? 'Signup fee'
      : `Subscription — ${plan.toUpperCase()}`;

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filename = `Invoice_${invoiceNumber}.pdf`;

    const origin = req.headers.origin;
    const allowed = (process.env.FRONTEND_URL || 'http://localhost:5173')
      .split(',').map((s) => s.trim()).filter(Boolean);
    if (origin && allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    doc.pipe(res);

    doc.fillColor('#5B6BF0').fontSize(26).font('Helvetica-Bold').text('TaskFlow', 50, 50);
    doc.fillColor('#111827').fontSize(18).font('Helvetica-Bold')
      .text('INVOICE', 50, 50, { align: 'right' });
    doc.fontSize(10).font('Helvetica').fillColor('#4B5563')
      .text(`Invoice #: ${invoiceNumber}`, 50, 90, { align: 'right' })
      .text(`Date: ${new Date(p.createdAt).toLocaleString('en-GB')}`, 50, 105, { align: 'right' });

    doc.fillColor('#9CA3AF').fontSize(9).font('Helvetica-Bold').text('BILLED TO', 50, 150);
    doc.fillColor('#111827').fontSize(11).font('Helvetica')
      .text(u?.name || 'Unknown', 50, 165)
      .text(u?.email || '—', 50, 180)
      .text(`Role: ${u?.role || '—'}`, 50, 195);

    const tableTop = 260;
    doc.rect(50, tableTop, 495, 24).fill('#EEF0FE');
    doc.fillColor('#5B6BF0').font('Helvetica-Bold').fontSize(10)
      .text('Description', 60, tableTop + 7)
      .text('Amount', 460, tableTop + 7, { width: 80, align: 'right' });

    doc.fillColor('#111827').font('Helvetica').fontSize(11)
      .text(typeLabel, 60, tableTop + 40)
      .text(`${amount} ${currency}`, 460, tableTop + 40, { width: 80, align: 'right' });

    doc.moveTo(50, tableTop + 70).lineTo(545, tableTop + 70).strokeColor('#E5E7EB').stroke();

    doc.font('Helvetica-Bold').fontSize(12)
      .text('Total', 400, tableTop + 85)
      .text(`${amount} ${currency}`, 460, tableTop + 85, { width: 80, align: 'right' });

    doc.font('Helvetica').fontSize(10).fillColor('#4B5563')
      .text(`Status: ${p.status}`, 50, tableTop + 85);

    doc.fontSize(9).fillColor('#9CA3AF')
      .text('Thank you for your business.', 50, 720)
      .text('TaskFlow · Confidential', 50, 735);

    doc.end();
  } catch (err) {
    console.error('downloadInvoice error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate invoice', error: err.message });
    } else {
      try { res.end(); } catch {}
    }
  }
};

const getBillingSummary = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const myPayments = (await paymentRepo.listByUser(user.id)).map((p) => ({
      id: p.id,
      type: p.type,
      plan: p.plan || (p.type === 'signup' ? 'signup' : 'pro'),
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt
    }));

    res.json({
      signupPaid: !!user.signupPaid,
      role: user.role,
      plan: getEffectivePlan(user),
      subscription: user.subscription || null,
      subscriptionState: subscriptionStateLabel(user.subscription),
      canStartFreshCheckout: canStartFreshCheckout(user.subscription),
      payments: myPayments
    });
  } catch (err) {
    console.error('getBillingSummary error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getCatalog,
  createSignupCheckout,
  createSubscriptionCheckout,
  openBillingPortal,
  verifyCheckoutSession,
  getPaymentStatus,
  syncMyPayment,
  reconcileUserEndpoint,
  reconcileAllEndpoint,
  listAllPayments,
  getPaymentById,
  downloadInvoice,
  getBillingSummary
};