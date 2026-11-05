// NOTE: this is a role-check middleware and only verifies that req.user.role is one of
// the allowed roles. Does NOT check permissions. Must run AFTER auth middleware.

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient role' });
  }
  next();
};

module.exports = requireRole;