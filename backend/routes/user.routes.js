
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const { requirePermission } = require("../middleware/permission.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createUserSchema,
  updateUserStatusSchema,
} = require("../validations/user.validation");

const MANAGERS_AND_ADMIN = ["admin", "manager"];
const ADMIN_ONLY = ["admin"];

router.use(auth);

router.get(
  "/",
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission("user:view"),
  userController.getUsers,
);

router.get(
  "/employees",
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission("user:view"),
  userController.getEmployees,
);

router.get(
  "/search",
  requireRole(...MANAGERS_AND_ADMIN),
  requirePermission("user:view"),
  userController.searchUsers,
);

router.post(
  "/",
  requireRole(...ADMIN_ONLY),
  requirePermission("user:create"),
  validate(createUserSchema),
  userController.createUser,
);

router.get(
  "/:id/blocking-tasks",
  requireRole(...ADMIN_ONLY),
  requirePermission("user:view"),
  userController.getBlockingTasks,
);

router.patch(
  "/:id/status",
  requireRole(...ADMIN_ONLY),
  requirePermission("user:status:update"),
  validate(updateUserStatusSchema),
  userController.updateUserStatus,
);

router.delete(
  "/:id",
  requireRole(...ADMIN_ONLY),
  requirePermission("user:delete"),
  userController.deleteUser,
);

module.exports = router;
