const requireReconcileSecret = (req, res, next) => {
  const expected = process.env.RECONCILE_SECRET;
  if (!expected) {
    return res.status(503).json({ message: 'Scheduled reconcile not configured' });
  }
  const provided = req.headers['x-reconcile-secret'];
  if (!provided || provided !== expected) {
    return res.status(401).json({ message: 'Invalid reconcile secret' });
  }
  next();
};

module.exports = requireReconcileSecret;