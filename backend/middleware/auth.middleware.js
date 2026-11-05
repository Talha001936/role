<<<<<<< HEAD
// middleware/auth.middleware.js
const { verifyToken } = require('../utils/jwt');
const userRepo = require('../repositories/user.repo');
const { getPermissions } = require('../utils/permissions');
const { clearCookie } = require('../utils/helper');
const { getEffectivePlan, getPlanPermissions } = require('../utils/plans');

const SYNC_STALE_AFTER_MS = 6 * 60 * 60 * 1000 - 5 * 60 * 1000;

const auth = async (req, res, next) => {
=======
// NOTE: Uses clearCookie() helper so cookie-clearing options match the options used when setting the cookie . 
const { verifyToken } = require('../utils/jwt');
const db = require('../config/db');
const { getPermissions } = require('../utils/permissions');
const { clearCookie } = require('../utils/helper');

const auth = (req, res, next) => {
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = verifyToken(token);
<<<<<<< HEAD
    const user = await userRepo.findById(decoded.id);

=======
    const user = db.get('users').find({ id: decoded.id }).value();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    if (!user) {
      clearCookie(res);
      return res.status(401).json({ message: 'User not found' });
    }

<<<<<<< HEAD
=======
    
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    if ((user.tokenVersion || 0) !== (decoded.tokenVersion || 0)) {
      clearCookie(res);
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    if (user.status === 'deactivated') {
      clearCookie(res);
      return res.status(403).json({ message: 'Account deactivated' });
    }

    req.user = user;
    req.permissions = getPermissions(user.role);
<<<<<<< HEAD
    req.plan = getEffectivePlan(user);
    req.planPermissions = getPlanPermissions(user);
    req.hasPlan = (feature) => req.planPermissions.includes(feature);

    if (user.role !== 'admin' && user.stripeCustomerId) {
      const last = user.lastReconcileAt
        ? new Date(user.lastReconcileAt).getTime()
        : 0;
      req.billingSyncPending = Date.now() - last > SYNC_STALE_AFTER_MS;
    } else {
      req.billingSyncPending = false;
    }

    const isAuthSelfRoute =
      req.originalUrl.startsWith('/api/auth/me') ||
      req.originalUrl.startsWith('/api/auth/logout') ||
      req.originalUrl.startsWith('/api/payments');

    if (user.role !== 'admin' && !user.signupPaid && !isAuthSelfRoute) {
      return res.status(402).json({
        message: 'Signup payment required',
        code: 'SIGNUP_PAYMENT_REQUIRED'
      });
    }

=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    next();
  } catch (error) {
    clearCookie(res);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;