
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const {
  registerSchema, loginSchema, forgotPasswordSchema,
  verifyCodeSchema, changePasswordSchema, resetPasswordSchema
} = require('../validations/auth.validation');

const ALL_ROLES = ['admin', 'manager', 'employee'];


router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-code', validate(verifyCodeSchema), authController.verifyCode);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/logout',auth,requireRole(...ALL_ROLES), authController.logout);
router.get('/me',
  auth,
  requireRole(...ALL_ROLES),
  authController.me
);
router.post('/change-password',
  auth,
  requireRole(...ALL_ROLES),
  validate(changePasswordSchema),
  authController.changePassword
);

module.exports = router;