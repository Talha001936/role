// utils/plans.js
const SIGNUP_PRICE_IDS = {
  manager: process.env.STRIPE_PRICE_SIGNUP_MANAGER,
  employee: process.env.STRIPE_PRICE_SIGNUP_EMPLOYEE
};

const SUBSCRIPTION_PRICE_IDS = {
  manager: {
    lite: process.env.STRIPE_PRICE_MANAGER_LITE,
    pro: process.env.STRIPE_PRICE_MANAGER_PRO
  },
  employee: {
    pro: process.env.STRIPE_PRICE_EMPLOYEE_PRO
  }
};

const PRICE_AMOUNTS = {
  signup: { manager: 2000, employee: 1500 },
  manager: { lite: 1000, pro: 2500 },
  employee: { pro: 2000 }
};
const getEffectivePlan = (user) => {
  if (!user) return 'none';
  if (user.role === 'admin') return 'admin';
  if (!user.signupPaid) return 'none';

  const sub = user.subscription || {};
  const isActive = sub.status === 'active' || sub.status === 'trialing';
  const notExpired = !sub.currentPeriodEnd
    || new Date(sub.currentPeriodEnd).getTime() > Date.now();

  if (!isActive || !notExpired) return 'signup';

  if (sub.plan === 'pro') return 'pro';
  if (sub.plan === 'lite' && user.role === 'manager') return 'lite';

  return 'signup';
};
const getPlanPermissions = (user) => {
  const plan = getEffectivePlan(user);
  if (plan === 'admin' || plan === 'pro') return ['full'];
  if (plan === 'lite' && user.role === 'manager') {
    return [
      'task:create',
      'task:view:all',
      'task:status:update:own',
      'task:search:all'
    ];
  }
  return [];
};

const planHasFeature = (user, feature) => {
  const perms = getPlanPermissions(user);
  return perms.includes('full') || perms.includes(feature);
};

const getSignupPriceId = (role) => SIGNUP_PRICE_IDS[role];
const getSubscriptionPriceId = (role, plan) =>
  SUBSCRIPTION_PRICE_IDS[role]?.[plan];
const isSubscriptionPlan = (role, plan) => {
  if (plan === 'pro') return true;
  if (plan === 'lite' && role === 'manager') return true;
  return false;
};

const getPublicCatalog = () => ({
  signup: {
    manager: { amount: PRICE_AMOUNTS.signup.manager, currency: 'usd' },
    employee: { amount: PRICE_AMOUNTS.signup.employee, currency: 'usd' }
  },
  manager: {
    lite: { amount: PRICE_AMOUNTS.manager.lite, currency: 'usd', interval: 'month' },
    pro: { amount: PRICE_AMOUNTS.manager.pro, currency: 'usd', interval: 'month' }
  },
  employee: {
    pro: { amount: PRICE_AMOUNTS.employee.pro, currency: 'usd', interval: 'month' }
  }
});

module.exports = {
  getEffectivePlan,
  getPlanPermissions,
  planHasFeature,
  getSignupPriceId,
  getSubscriptionPriceId,
  isSubscriptionPlan,
  getPublicCatalog
};