// NOTE: Uses clearCookie() helper so cookie-clearing options match the options used when setting the cookie . 
const { verifyToken } = require('../utils/jwt');
const db = require('../config/db');
const { getPermissions } = require('../utils/permissions');
const { clearCookie } = require('../utils/helper');

const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = verifyToken(token);
    const user = db.get('users').find({ id: decoded.id }).value();
    if (!user) {
      clearCookie(res);
      return res.status(401).json({ message: 'User not found' });
    }

    
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
    next();
  } catch (error) {
    clearCookie(res);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;