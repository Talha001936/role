// utils/paymentHelpers.js
const userRepo = require('../repositories/user.repo');
const paymentRepo = require('../repositories/payment.repo');

async function applySubscription(userId, sub, planHint) {
  const plan =
    planHint ||
    sub.metadata?.plan ||
    sub.items?.data?.[0]?.price?.metadata?.plan ||
    'lite';

  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  await userRepo.updateSubscription(userId, {
    plan,
    status: sub.status,
    stripeSubscriptionId: sub.id,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: !!sub.cancel_at_period_end
  });

  return { plan, periodEnd };
}

async function logPayment({
  userId,
  type,
  amount,
  currency,
  status,
  stripeEventId,
  stripeSessionId,
  stripeSubscriptionId,
  plan
}) {
  if (type === 'subscription' && stripeSubscriptionId) {
    const exists = await paymentRepo.findBySubscriptionId(stripeSubscriptionId);
    if (exists) return exists;
  }
  if (stripeSessionId) {
    const exists = await paymentRepo.findBySessionId(stripeSessionId);
    if (exists) return exists;
  }
  if (stripeEventId) {
    const exists = await paymentRepo.findByEventId(stripeEventId);
    if (exists) return exists;
  }

  const entry = {
    id: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    type,
    amount: amount || 0,
    currency: currency || 'usd',
    status,
    stripeEventId: stripeEventId || null,
    stripeSessionId: stripeSessionId || null,
    stripeSubscriptionId: stripeSubscriptionId || null,
    plan: plan || null,
    createdAt: new Date().toISOString()
  };

  await paymentRepo.create(entry);
  return entry;
}

module.exports = { applySubscription, logPayment };