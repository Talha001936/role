
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { requirePermission } = require('../middleware/permission.middleware');
const validate = require('../middleware/validate.middleware');
const { updateProfileSchema } = require('../validations/profile.validation');
const { getProfile, updateProfile } = require('../controllers/profile.controller');

const ALL_ROLES = ['admin', 'manager', 'employee'];

router.use(auth);

router.get('/',
  requireRole(...ALL_ROLES),
  requirePermission('profile:view'),
  getProfile
);

router.put('/',
  requireRole(...ALL_ROLES),
  requirePermission('profile:update'),
  validate(updateProfileSchema),
  updateProfile
);

module.exports = router;