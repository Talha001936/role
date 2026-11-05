
const isSubscriptionActive = (sub) => {
  if (!sub) return false;
  if (sub.status !== 'active' && sub.status !== 'trialing') return false;
  if (!sub.currentPeriodEnd) return true;
  const end = new Date(sub.currentPeriodEnd).getTime();
  if (Number.isNaN(end)) return true;
  return end > Date.now();
};

const canStartFreshCheckout = (sub) => {
  if (!sub?.stripeSubscriptionId) return true;
  if (!isSubscriptionActive(sub)) return true;
  if (sub.cancelAtPeriodEnd) return true;
  return false;
};


const subscriptionStateLabel = (sub) => {
  if (!sub?.stripeSubscriptionId) return 'none';
  if (sub.cancelAtPeriodEnd && isSubscriptionActive(sub)) return 'canceling';
  if (sub.status === 'past_due') return 'past_due';
  if (sub.status === 'canceled') return 'canceled';
  if (!isSubscriptionActive(sub)) return 'expired';
  return sub.status; 
};

module.exports = {
  isSubscriptionActive,
  canStartFreshCheckout,
  subscriptionStateLabel
};