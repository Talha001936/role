
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

module.exports = router;