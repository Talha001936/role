// NOTE: this is a permission-check middleware. Verifies req.user has the given permission (one of several). 

const { hasPermission, hasAnyPermission } = require('../utils/permissions');

const requirePermission = (permission) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (!hasPermission(req.user, permission)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

const requireAnyPermission = (...permissions) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (!hasAnyPermission(req.user, permissions)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

module.exports = { requirePermission, requireAnyPermission };