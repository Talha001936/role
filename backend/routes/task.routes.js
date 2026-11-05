<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
<<<<<<< HEAD
const requirePlan = require('../middleware/requirePlan.middleware');
const { requireAnyPermission } = require('../middleware/permission.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createTaskSchema, updateTaskSchema, updateTaskStatusSchema, addCommentSchema
=======
const { requirePermission, requireAnyPermission } = require('../middleware/permission.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createTaskSchema, updateTaskSchema, updateTaskStatusSchema
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
} = require('../validations/task.validation');

const ALL_ROLES = ['admin', 'manager', 'employee'];
const MANAGERS_AND_ADMIN = ['admin', 'manager'];

router.use(auth);

<<<<<<< HEAD

router.post('/',
  requireRole(...MANAGERS_AND_ADMIN),
  requireAnyPermission('task:create'),
  requirePlan('task:create'),
  validate(createTaskSchema),
  taskController.createTask
);
=======
router.post('/',
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission('task:create'),
  validate(createTaskSchema),
  taskController.createTask
);

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
router.get('/',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:view:own', 'task:view:all'),
  taskController.getTasks
);
<<<<<<< HEAD
router.get('/search',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:search:own', 'task:search:all', 'task:view:all'),
  requirePlan('task:search:all', 'task:search:own', 'full'),
  taskController.searchTasks
);
router.get('/assignable',
  requireRole(...MANAGERS_AND_ADMIN),
  requireAnyPermission('task:create'),
  requirePlan('task:create'),
=======

router.get('/search',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:view:own', 'task:view:all'),
  taskController.searchTasks
);

router.get('/assignable',
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission('task:create'),
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  taskController.getAssignableEmployees
);

router.get('/:id',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:view:own', 'task:view:all'),
  taskController.getTaskById
);

router.put('/:id',
  requireRole(...MANAGERS_AND_ADMIN),
<<<<<<< HEAD
  requireAnyPermission('task:update'),
  requirePlan('full'),
=======
  requirePermission('task:update'),
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  validate(updateTaskSchema),
  taskController.updateTask
);

router.patch('/:id/status',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:status:update:own', 'task:status:update:any'),
<<<<<<< HEAD
  taskController.updateTaskStatus
);

router.post('/:id/comments',
  requireRole(...ALL_ROLES),
  requireAnyPermission('task:comment', 'task:view:all'),
  requirePlan('full'),
  validate(addCommentSchema),
  taskController.addComment
);

router.delete('/:id',
  requireRole(...MANAGERS_AND_ADMIN),
  requireAnyPermission('task:delete'),
  requirePlan('full'),
=======
  validate(updateTaskStatusSchema),
  taskController.updateTaskStatus
);

router.delete('/:id',
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission('task:delete'),
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  taskController.deleteTask
);

module.exports = router;