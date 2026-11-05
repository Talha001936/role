<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { requirePermission } = require('../middleware/permission.middleware');

const ALL_ROLES = ['admin', 'manager', 'employee'];

router.use(auth);

router.get('/stats',
  requireRole(...ALL_ROLES),
  requirePermission('dashboard:view'),
  dashboardController.getDashboardStats
);

router.get('/chart',
  requireRole(...ALL_ROLES),
  requirePermission('dashboard:view'),
  dashboardController.getChartData
);

<<<<<<< HEAD
router.get('/payment-chart',
  requireRole('admin'),
  dashboardController.getPaymentChartData
);

=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
module.exports = router;