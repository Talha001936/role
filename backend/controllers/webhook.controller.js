// // controllers/webhook.controller.js
// const stripe = require('../config/stripe');
// const { reconcileUser } = require('../utils/reconcile');

// const userRepo = require('../repositories/user.repo');
// const webhookRepo = require('../repositories/webhook.repo');

// const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// const HANDLED_EVENTS = new Set([
//   'checkout.session.completed',
//   'customer.subscription.created',
//   'customer.subscription.updated',
//   'customer.subscription.deleted',
//   'invoice.paid',
//   'invoice.payment_succeeded',
//   'invoice.payment_failed'
// ]);

// async function handleStripeWebhook(req, res) {
//   let event;

//   console.log('\n========== STRIPE WEBHOOK RECEIVED ==========');
//   console.log('[webhook] Timestamp:', new Date().toISOString());
//   console.log('[webhook] Method/URL:', req.method, req.originalUrl);
//   console.log('[webhook] Headers:', {
//     'stripe-signature': req.headers['stripe-signature'] ? 'present' : 'MISSING',
//     'content-type': req.headers['content-type'],
//     'content-length': req.headers['content-length']
//   });

//   if (!WEBHOOK_SECRET) {
//     console.error('[webhook] STRIPE_WEBHOOK_SECRET is not configured!');
//     return res.status(503).send('Webhook secret not configured');
//   }

//   if (!req.rawBody || req.rawBody.length === 0) {
//     console.error('[webhook] rawBody is empty or missing');
//     return res.status(400).send('Webhook Error: Empty body');
//   }

//   console.log('[webhook] Raw body size:', req.rawBody.length, 'bytes');

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.rawBody,
//       req.headers['stripe-signature'],
//       WEBHOOK_SECRET
//     );
//     console.log('[webhook] Signature verified ✓');
//   } catch (err) {
//     console.error('[webhook] Signature verification FAILED:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   console.log('[webhook] Event ID:', event.id);
//   console.log('[webhook] Event Type:', event.type);
//   console.log('[webhook] Event Created:', new Date(event.created * 1000).toISOString());
//   console.log('[webhook] Livemode:', event.livemode);

//   if (!HANDLED_EVENTS.has(event.type)) {
//     console.log('[webhook] Unhandled event type, ignoring →', event.type);
//     console.log('=============================================\n');
//     return res.json({ received: true, ignored: true, type: event.type });
//   }

//   const alreadySeen = await webhookRepo.findById(event.id);
//   if (alreadySeen) {
//     console.log('[webhook] Duplicate event — already processed. ID:', event.id);
//     console.log('=============================================\n');
//     return res.json({ received: true, duplicate: true });
//   }

//   const userId = await resolveUserId(event.data.object);
//   console.log('[webhook] Resolved userId:', userId || 'NULL');

//   if (!userId) {
//     console.warn('[webhook] No userId resolved. Data keys:', Object.keys(event.data.object || {}));
//     console.warn('[webhook] metadata:', JSON.stringify(event.data.object?.metadata || {}, null, 2));
//   }

//   await webhookRepo.create({
//     id: event.id,
//     type: event.type,
//     userId: userId || null
//   });
//   console.log('[webhook] Event recorded in DB');

//   if (userId) {
//     console.log('[webhook] Starting reconcile for user:', userId);
//     try {
//       const result = await reconcileUser(userId, { silent: false });
//       console.log('[webhook] Reconcile result:', JSON.stringify(result));
//     } catch (err) {
//       await webhookRepo.remove(event.id);
//       console.error(`[webhook] Reconcile FAILED for ${userId}:`, err.message);
//       console.error(err.stack);
//       return res.status(500).json({ error: 'Reconcile failed' });
//     }
//   }

//   console.log('[webhook] Completed successfully ✓');
//   console.log('=============================================\n');
//   res.json({ received: true });
// }

// async function resolveUserId(obj) {
//   if (!obj) return null;

//   if (obj.metadata?.userId) {
//     console.log('[resolveUserId] metadata.userId:', obj.metadata.userId);
//     return obj.metadata.userId;
//   }

//   const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;

//   if (customerId) {
//     console.log('[resolveUserId] Looking up customerId:', customerId);
//     const user = await userRepo.findByStripeCustomer(customerId);
//     if (user) {
//       console.log('[resolveUserId] Found user by customerId:', user.id);
//       return user.id;
//     }
//     console.log('[resolveUserId] No user for customerId:', customerId);
//   }

//   if (obj.subscription?.metadata?.userId) return obj.subscription.metadata.userId;
//   if (obj.payment_intent?.metadata?.userId) return obj.payment_intent.metadata.userId;
//   if (obj.object === 'subscription' && obj.metadata?.userId) return obj.metadata.userId;

//   console.log('[resolveUserId] All strategies failed');
//   return null;
// }

// module.exports = { handleStripeWebhook };




const stripe = require('../config/stripe');
const { reconcileUser } = require('../utils/reconcile');

const userRepo = require('../repositories/user.repo');
const webhookRepo = require('../repositories/webhook.repo');

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;


const HANDLED_EVENTS = new Set([
  
  'checkout.session.completed',
  'checkout.session.expired',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',

  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'customer.subscription.trial_will_end',

  'invoice.created',
  'invoice.paid',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'invoice.payment_action_required',
  'invoice.finalized',
  'invoice.marked_uncollectible',
  'invoice.voided',

  
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.canceled'
]);


const NO_RECONCILE_EVENTS = new Set([
  'invoice.created',
  'invoice.finalized',
  'customer.subscription.trial_will_end'
]);

async function handleStripeWebhook(req, res) {
  let event;

  console.log('\n========== STRIPE WEBHOOK RECEIVED ==========');
  console.log('[webhook] Timestamp:', new Date().toISOString());
  console.log('[webhook] Method/URL:', req.method, req.originalUrl);
  console.log('[webhook] Headers:', {
    'stripe-signature': req.headers['stripe-signature'] ? 'present' : 'MISSING',
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length']
  });

  if (!WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not configured!');
    return res.status(503).send('Webhook secret not configured');
  }

  if (!req.rawBody || req.rawBody.length === 0) {
    console.error('[webhook] rawBody is empty or missing');
    return res.status(400).send('Webhook Error: Empty body');
  }

  console.log('[webhook] Raw body size:', req.rawBody.length, 'bytes');

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'],
      WEBHOOK_SECRET
    );
    console.log('[webhook] Signature verified ');
  } catch (err) {
    console.error('[webhook] Signature verification FAILED:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('[webhook] Event ID:', event.id);
  console.log('[webhook] Event Type:', event.type);
  console.log('[webhook] Event Created:', new Date(event.created * 1000).toISOString());
  console.log('[webhook] Livemode:', event.livemode);

  if (!HANDLED_EVENTS.has(event.type)) {
    console.log('[webhook] Unhandled event type, ignoring →', event.type);
    return res.json({ received: true, ignored: true, type: event.type });
  }

  
  const alreadySeen = await webhookRepo.findById(event.id);
  if (alreadySeen) {
    console.log('[webhook] Duplicate event — already processed. ID:', event.id);
    return res.json({ received: true, duplicate: true });
  }


  const userId = await resolveUserId(event.data.object);
  console.log('[webhook] Resolved userId:', userId || 'NULL');

  if (!userId) {
    console.warn('[webhook] No userId resolved. Data keys:', Object.keys(event.data.object || {}));
    console.warn('[webhook] metadata:', JSON.stringify(event.data.object?.metadata || {}, null, 2));
  }

  logEventDetails(event);

  
  await webhookRepo.create({
    id: event.id,
    type: event.type,
    userId: userId || null
  });
  console.log('[webhook] Event recorded in DB');

  
  if (userId && !NO_RECONCILE_EVENTS.has(event.type)) {
    console.log('[webhook] Starting reconcile for user:', userId);
    try {
      const result = await reconcileUser(userId, { silent: false });
      console.log('[webhook] Reconcile result:', JSON.stringify(result));
    } catch (err) {

      await webhookRepo.remove(event.id);
      console.error(`[webhook] Reconcile FAILED for ${userId}:`, err.message);
      console.error(err.stack);
      return res.status(500).json({ error: 'Reconcile failed' });
    }
  } else if (userId && NO_RECONCILE_EVENTS.has(event.type)) {
    console.log('[webhook] Skipping reconcile (info-only event):', event.type);
  }

  console.log('[webhook] Completed successfully ✓');
  res.json({ received: true });
}


function logEventDetails(event) {
  const obj = event.data.object || {};

  switch (event.type) {
    case 'checkout.session.expired':
      console.warn('[webhook:info] ✗ Checkout session EXPIRED', {
        sessionId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
        mode: obj.mode,
        amountTotal: obj.amount_total,
        currency: obj.currency,
        metadata: obj.metadata
      });
      break;

    case 'checkout.session.async_payment_failed':
      console.warn('[webhook:info] ✗ Checkout session ASYNC PAYMENT FAILED', {
        sessionId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
        paymentStatus: obj.payment_status,
        amountTotal: obj.amount_total,
        currency: obj.currency,
        metadata: obj.metadata
      });
      break;

    case 'payment_intent.payment_failed':
      console.warn('[webhook:info] ✗ PaymentIntent FAILED', {
        paymentIntentId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
        amount: obj.amount,
        currency: obj.currency,
        lastPaymentError: obj.last_payment_error?.message || null,
        declineCode: obj.last_payment_error?.decline_code || null,
        code: obj.last_payment_error?.code || null,
        metadata: obj.metadata
      });
      break;

    case 'payment_intent.canceled':
      console.warn('[webhook:info] ✗ PaymentIntent CANCELED', {
        paymentIntentId: obj.id,
        cancellationReason: obj.cancellation_reason,
        metadata: obj.metadata
      });
      break;

    case 'invoice.payment_failed':
      console.warn('[webhook:info] ✗ Invoice PAYMENT FAILED', {
        invoiceId: obj.id,
        subscriptionId: typeof obj.subscription === 'string' ? obj.subscription : obj.subscription?.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
        amountDue: obj.amount_due,
        attemptCount: obj.attempt_count,
        nextPaymentAttempt: obj.next_payment_attempt,
        reason: obj.last_finalization_error?.message
          || obj.charge?.failure_message
          || 'unknown'
      });
      break;

    case 'invoice.payment_action_required':
      console.warn('[webhook:info] ⚠ Invoice requires ACTION (3DS/SCA)', {
        invoiceId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
        hostedInvoiceUrl: obj.hosted_invoice_url
      });
      break;

    case 'invoice.marked_uncollectible':
      console.warn('[webhook:info] ✗ Invoice marked UNCOLLECTIBLE', {
        invoiceId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
        amountDue: obj.amount_due
      });
      break;

    case 'invoice.voided':
      console.warn('[webhook:info] ✗ Invoice VOIDED', {
        invoiceId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id
      });
      break;

    case 'customer.subscription.paused':
      console.warn('[webhook:info] ⏸ Subscription PAUSED', {
        subscriptionId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id
      });
      break;

    case 'customer.subscription.resumed':
      console.log('[webhook:info] ▶ Subscription RESUMED', {
        subscriptionId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id
      });
      break;

    case 'customer.subscription.trial_will_end':
      console.log('[webhook:info]  Subscription trial ending soon', {
        subscriptionId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
        trialEnd: obj.trial_end
      });
      break;

    case 'customer.subscription.deleted':
      console.warn('[webhook:info] ✗ Subscription DELETED', {
        subscriptionId: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id
      });
      break;

    
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
    case 'invoice.paid':
    case 'invoice.payment_succeeded':
    case 'payment_intent.succeeded':
      console.log(`[webhook:info] ✓ ${event.type}`, {
        id: obj.id,
        customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
        amount: obj.amount_total ?? obj.amount ?? obj.amount_paid
      });
      break;

    default:
      break;
  }
}

async function resolveUserId(obj) {
  if (!obj) return null;

  if (obj.metadata?.userId) {
    console.log('[resolveUserId] metadata.userId:', obj.metadata.userId);
    return obj.metadata.userId;
  }

  const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;

  if (customerId) {
    console.log('[resolveUserId] Looking up customerId:', customerId);
    const user = await userRepo.findByStripeCustomer(customerId);
    if (user) {
      console.log('[resolveUserId] Found user by customerId:', user.id);
      return user.id;
    }
    console.log('[resolveUserId] No user for customerId:', customerId);
  }

  if (obj.subscription?.metadata?.userId) return obj.subscription.metadata.userId;
  if (obj.payment_intent?.metadata?.userId) return obj.payment_intent.metadata.userId;
  if (obj.object === 'subscription' && obj.metadata?.userId) return obj.metadata.userId;
  if (obj.object === 'invoice' && obj.subscription_details?.metadata?.userId) {
    return obj.subscription_details.metadata.userId;
  }

  console.log('[resolveUserId] All strategies failed');
  return null;
}

module.exports = { handleStripeWebhook };