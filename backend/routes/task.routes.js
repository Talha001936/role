
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { requirePermission, requireAnyPermission } = require('../middleware/permission.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createTaskSchema, updateTaskSchema, updateTaskStatusSchema
} = require('../validations/task.validation');

const ALL_ROLES = ['admin', 'manager', 'employee'];
const MANAGERS_AND_ADMIN = ['admin', 'manager'];

router.use(auth);

router.post('/',
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission('task:create'),
  validate(createTaskSchema),
  taskController.createTask
);

router.get('/',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:view:own', 'task:view:all'),
  taskController.getTasks
);

router.get('/search',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:view:own', 'task:view:all'),
  taskController.searchTasks
);

router.get('/assignable',
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission('task:create'),
  taskController.getAssignableEmployees
);

router.get('/:id',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:view:own', 'task:view:all'),
  taskController.getTaskById
);

router.put('/:id',
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission('task:update'),
  validate(updateTaskSchema),
  taskController.updateTask
);

router.patch('/:id/status',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:status:update:own', 'task:status:update:any'),
  validate(updateTaskStatusSchema),
  taskController.updateTaskStatus
);

router.delete('/:id',
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission('task:delete'),
  taskController.deleteTask
);

module.exports = router;