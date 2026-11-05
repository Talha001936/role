const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const requireReconcileSecret = require('../middleware/reconcileAuth.middleware');
const { requirePermission } = require('../middleware/permission.middleware');
const paymentController = require('../controllers/payment.controller');

const ALL_ROLES = ['admin', 'manager', 'employee'];
const ADMIN_ONLY = ['admin'];

router.get('/catalog', paymentController.getCatalog);

router.get('/status',
  auth,
  requireRole(...ALL_ROLES),
  paymentController.getPaymentStatus
);

router.post('/sync',
  auth,
  requireRole(...ALL_ROLES),
  paymentController.syncMyPayment
);

router.get('/summary', auth, requireRole(...ALL_ROLES), paymentController.getBillingSummary);
router.post('/signup-checkout', auth, requireRole('manager', 'employee'), paymentController.createSignupCheckout);
router.post('/subscribe', auth, requireRole('manager', 'employee'), paymentController.createSubscriptionCheckout);
router.post('/portal', auth, requireRole(...ALL_ROLES), paymentController.openBillingPortal);
router.post('/verify', auth, requireRole(...ALL_ROLES), paymentController.verifyCheckoutSession);

router.get('/all',
  auth, requireRole(...ADMIN_ONLY),
  requirePermission('payment:view'),
  paymentController.listAllPayments
);

router.get('/all/:id',
  auth, requireRole(...ADMIN_ONLY),
  requirePermission('payment:view'),
  paymentController.getPaymentById
);

router.get('/all/:id/invoice',
  auth, requireRole(...ADMIN_ONLY),
  requirePermission('payment:view'),
  paymentController.downloadInvoice
);

router.post('/reconcile/all',
  auth, requireRole(...ADMIN_ONLY),
  requirePermission('payment:view'),
  paymentController.reconcileAllEndpoint
);

router.post('/reconcile/scheduled',
  requireReconcileSecret,
  paymentController.reconcileAllEndpoint
);

router.post('/reconcile/:userId',
  auth, requireRole(...ADMIN_ONLY),
  requirePermission('payment:view'),
  paymentController.reconcileUserEndpoint
);

module.exports = router;