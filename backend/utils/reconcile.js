// utils/reconcile.js
const stripe = require('../config/stripe');
const userRepo = require('../repositories/user.repo');
const paymentRepo = require('../repositories/payment.repo');
const { logPayment } = require('./paymentHelpers');

async function reconcileUser(userId, { silent = false } = {}) {
  if (!silent) console.log(`[reconcile] ▶ start userId=${userId}`);

  const user = await userRepo.findById(userId);
  if (!user) {
    if (!silent) console.warn(`[reconcile] user not found: ${userId}`);
    throw new Error('User not found');
  }

  if (!user.stripeCustomerId) {
    if (!silent) console.log(`[reconcile] no stripeCustomerId for ${userId}, skipping`);
    return { userId, changed: false, reason: 'no_stripe_customer' };
  }

  const customerId = user.stripeCustomerId;
  let changed = false;

  if (!silent) console.log(`[reconcile] fetching subscriptions for ${customerId}`);
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 10,
    expand: ['data.items.data.price']
  });

  if (!silent) console.log(`[reconcile] found ${subs.data.length} subscription(s)`);

  const meaningful = subs.data.find((s) =>
    s.status === 'active' || s.status === 'trialing' || s.status === 'past_due'
  );
  const latest = meaningful || subs.data[0];

  if (latest) {
    const price = latest.items?.data?.[0]?.price;
    const rawPlan = latest.metadata?.plan || price?.metadata?.plan || null;
    const resolvedPlan = resolvePlanKey(rawPlan, user.role);

    const next = {
      plan: resolvedPlan,
      status: latest.status,
      stripeSubscriptionId: latest.id,
      currentPeriodEnd: latest.current_period_end
        ? new Date(latest.current_period_end * 1000).toISOString()
        : null,
      cancelAtPeriodEnd: !!latest.cancel_at_period_end
    };

    if (subscriptionDiffers(user.subscription, next)) {
      await userRepo.updateSubscription(userId, next);
      changed = true;
      if (!silent) console.log(`[reconcile] subscription updated for ${userId} → ${resolvedPlan} (${latest.status})`);
    } else if (!silent) {
      console.log(`[reconcile] subscription unchanged for ${userId} (plan=${resolvedPlan})`);
    }

    await ensureSubscriptionPaymentLogged(userId, latest, resolvedPlan);
  } else if (user.subscription?.stripeSubscriptionId) {
    await userRepo.updateSubscription(userId, {
      plan: user.signupPaid ? 'signup' : 'none',
      status: 'canceled',
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false
    });
    changed = true;
    if (!silent) console.log(`[reconcile] cleared canceled subscription for ${userId}`);
  } else if (!silent) {
    console.log(`[reconcile] no subscriptions found for ${userId}`);
  }

  if (!user.signupPaid && user.role !== 'admin') {
    if (!silent) console.log(`[reconcile] checking paid signup session for ${userId}`);
    const paidSignup = await findPaidSignupSession(customerId, userId);
    if (paidSignup) {
      await userRepo.updateFields(userId, { signupPaid: true, status: 'active' });
      await logPayment({
        userId,
        type: 'signup',
        amount: paidSignup.amount_total,
        currency: paidSignup.currency,
        status: 'succeeded',
        stripeEventId: paidSignup.payment_intent?.id || paidSignup.id,
        stripeSessionId: paidSignup.id
      });
      changed = true;
      if (!silent) console.log(`[reconcile] backfilled signup for ${userId}`);
    } else if (!silent) {
      console.log(`[reconcile] no paid signup session found for ${userId}`);
    }
  }

  if (!silent) console.log(`[reconcile] ◀ done userId=${userId} changed=${changed}`);
  return { userId, changed };
}

function resolvePlanKey(rawPlan, role) {
  if (role === 'employee') return 'pro';
  if (rawPlan === 'lite') return 'lite';
  return 'pro';
}

async function ensureSubscriptionPaymentLogged(userId, sub, plan) {
  const existing = await paymentRepo.findBySubscriptionId(sub.id);
  if (existing) return existing;

  const price = sub.items?.data?.[0]?.price;
  const amount = price?.unit_amount ?? 0;
  const currency = price?.currency || 'usd';

  const entry = await logPayment({
    userId,
    type: 'subscription',
    amount,
    currency,
    status: 'succeeded',
    stripeSubscriptionId: sub.id,
    stripeEventId: `sub_backfill_${sub.id}`,
    plan
  });

  console.log(`[reconcile] logged subscription payment for ${userId} (${plan}, ${amount} ${currency})`);
  return entry;
}

function subscriptionDiffers(prev, next) {
  if (!prev) return true;
  return (
    prev.plan !== next.plan ||
    prev.status !== next.status ||
    prev.stripeSubscriptionId !== next.stripeSubscriptionId ||
    String(prev.currentPeriodEnd || '') !== String(next.currentPeriodEnd || '') ||
    !!prev.cancelAtPeriodEnd !== !!next.cancelAtPeriodEnd
  );
}

async function findPaidSignupSession(customerId, userId) {
  try {
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 20,
      expand: ['data.payment_intent']
    });
    return sessions.data.find(
      (s) =>
        s.mode === 'payment' &&
        s.payment_status === 'paid' &&
        s.metadata?.type === 'signup' &&
        String(s.metadata?.userId) === String(userId)
    );
  } catch (e) {
    console.error('[reconcile] signup lookup failed:', e.message);
    return null;
  }
}

module.exports = { reconcileUser };