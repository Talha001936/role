// middleware/requirePlan.middleware.js
const requirePlan = (...features) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const perms = req.planPermissions || [];
  const ok = perms.includes('full') || features.some((f) => perms.includes(f));

  if (!ok) {
    return res.status(403).json({
      message: 'Your current plan does not include this feature. Please upgrade.',
      code: 'PLAN_UPGRADE_REQUIRED',
      required: features
    });
  }
  next();
};

module.exports = requirePlan;