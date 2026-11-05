<<<<<<< HEAD
// controllers/task.controller.js
const { v4: uuidv4 } = require('uuid');
const { isOverdue, enrichTask, isPastDate } = require('../utils/helper');
const {
  hasPermission,
  isEligibleAssignee
} = require('../utils/permissions');
const { planHasFeature } = require('../utils/plans');

const taskRepo = require('../repositories/task.repo');
const userRepo = require('../repositories/user.repo');
=======
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const { isOverdue, enrichTask, isPastDate } = require("../utils/helper");
const { hasPermission, isEligibleAssignee } = require("../utils/permissions");
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

<<<<<<< HEAD
    const employee = await userRepo.findById(assignedTo);
    const activeCount = employee ? await taskRepo.countActiveFor(assignedTo) : 0;

    if (!isEligibleAssignee(employee, activeCount, req.user)) {
      return res.status(400).json({
        message: 'Assignee must be an active user with fewer than 3 active tasks'
      });
    }
    if (isPastDate(dueDate)) {
      return res.status(400).json({ message: 'Due date cannot be earlier than today' });
=======
    const employee = db.get("users").find({ id: assignedTo }).value();
    const tasks = db.get("tasks").value();

    if (!isEligibleAssignee(employee, tasks, req.user)) {
      return res.status(400).json({
        message:
          "Assignee must be an active user with fewer than 3 active tasks",
      });
    }
    if (isPastDate(dueDate)) {
      return res
        .status(400)
        .json({ message: "Due date cannot be earlier than today" });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    }

    const task = {
      id: uuidv4(),
      title,
<<<<<<< HEAD
      description: description || '',
=======
      description: description || "",
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      assignedTo,
      assignedToName: employee.name,
      assignedBy: req.user.id,
      assignedByName: req.user.name,
<<<<<<< HEAD
      status: 'pending',
      dueDate,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const created = await taskRepo.create(task);
    res.status(201).json({ message: 'Task created', task: enrichTask(created) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
      status: "pending",
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.get("tasks").push(task).write();
    res.status(201).json({ message: "Task created", task: enrichTask(task) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const getTasks = async (req, res) => {
  try {
<<<<<<< HEAD
    const canSeeAll =
      hasPermission(req.user, 'task:view:all') &&
      (req.user.role === 'admin' || planHasFeature(req.user, 'task:view:all'));

    const tasks = canSeeAll
      ? await taskRepo.listAll()
      : await taskRepo.listByAssignee(req.user.id);

    res.json({ tasks: tasks.map(enrichTask) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    const all = db.get("tasks").value();
    const visible = hasPermission(req.user, "task:view:all")
      ? all
      : all.filter((t) => t.assignedTo === req.user.id);
    res.json({ tasks: visible.map(enrichTask) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const getTaskById = async (req, res) => {
  try {
<<<<<<< HEAD
    const task = await taskRepo.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const canSeeAll =
      hasPermission(req.user, 'task:view:all') &&
      (req.user.role === 'admin' || planHasFeature(req.user, 'task:view:all'));

    if (!canSeeAll && String(task.assignedTo) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    res.json({ task: enrichTask(task) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    const task = db.get("tasks").find({ id: req.params.id }).value();
    if (!task) return res.status(404).json({ message: "Task not found" });

    const canViewAll = hasPermission(req.user, "task:view:all");
    if (!canViewAll && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    res.json({ task: enrichTask(task) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const updateTask = async (req, res) => {
  try {
<<<<<<< HEAD
    const task = await taskRepo.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.status === 'completed')
      return res.status(400).json({ message: 'Completed tasks cannot be edited' });
    if (isOverdue(task))
      return res.status(400).json({ message: 'Overdue tasks cannot be edited' });

    const { title, description, assignedTo, dueDate } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    if (assignedTo !== undefined && String(assignedTo) !== String(task.assignedTo)) {
      const employee = await userRepo.findById(assignedTo);
      const activeCount = employee ? await taskRepo.countActiveFor(assignedTo) : 0;
      if (!isEligibleAssignee(employee, activeCount, req.user)) {
        return res.status(400).json({
          message: 'Assignee must be an active user with fewer than 3 active tasks'
        });
      }
      updates.assignedTo = assignedTo;
      updates.assignedToName = employee.name;
      updates.requiresReassignment = false;
=======
    const task = db.get("tasks").find({ id: req.params.id }).value();
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.status === "completed")
      return res
        .status(400)
        .json({ message: "Completed tasks cannot be edited" });
    if (isOverdue(task))
      return res
        .status(400)
        .json({ message: "Overdue tasks cannot be edited" });

    const { title, description, assignedTo, dueDate } = req.body;
    const updates = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    if (
      assignedTo !== undefined &&
      String(assignedTo) !== String(task.assignedTo)
    ) {
      const employee = db.get("users").find({ id: assignedTo }).value();
      const tasks = db.get("tasks").value();

      if (!isEligibleAssignee(employee, tasks, req.user)) {
        return res.status(400).json({
          message:
            "Assignee must be an active user with fewer than 3 active tasks",
        });
      }

      updates.assignedTo = assignedTo;
      updates.assignedToName = employee.name;
      updates.requiresReassignment = false;
    } else if (assignedTo !== undefined) {
      updates.assignedTo = assignedTo;
      const emp = db.get("users").find({ id: assignedTo }).value();
      if (emp) updates.assignedToName = emp.name;
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    }

    if (dueDate !== undefined) {
      if (isPastDate(dueDate)) {
<<<<<<< HEAD
        return res.status(400).json({ message: 'Due date cannot be earlier than today' });
=======
        return res
          .status(400)
          .json({ message: "Due date cannot be earlier than today" });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      }
      updates.dueDate = dueDate;
    }

<<<<<<< HEAD
    const updated = await taskRepo.updateFields(req.params.id, updates);
    res.json({ message: 'Task updated', task: enrichTask(updated) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    db.get("tasks").find({ id: req.params.id }).assign(updates).write();
    const updated = db.get("tasks").find({ id: req.params.id }).value();
    res.json({ message: "Task updated", task: enrichTask(updated) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const updateTaskStatus = async (req, res) => {
  try {
<<<<<<< HEAD
    const task = await taskRepo.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const hasAny =
      hasPermission(req.user, 'task:status:update:any') &&
      (req.user.role === 'admin' || planHasFeature(req.user, 'task:status:update:any'));

    const ownsIt = String(task.assignedTo) === String(req.user.id);
    const hasOwn = hasPermission(req.user, 'task:status:update:own') && ownsIt;

    if (!hasAny && !hasOwn) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Completed tasks cannot change status' });
    }

    const updates = { status: req.body.status };

    const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';
    if (comment) {
      const entry = {
        id: uuidv4(),
        by: req.user.id,
        byName: req.user.name,
        role: req.user.role,
        text: comment.slice(0, 500),
        statusAtTime: req.body.status,
        createdAt: new Date().toISOString()
      };
      const existing = Array.isArray(task.comments) ? task.comments : [];
      updates.comments = [...existing, entry];
    }

    const updated = await taskRepo.updateFields(req.params.id, updates);
    res.json({ message: 'Task status updated', task: enrichTask(updated) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const task = await taskRepo.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const canSeeAll =
      hasPermission(req.user, 'task:view:all') &&
      (req.user.role === 'admin' || planHasFeature(req.user, 'task:view:all'));

    if (!canSeeAll && String(task.assignedTo) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const entry = {
      id: uuidv4(),
      by: req.user.id,
      byName: req.user.name,
      role: req.user.role,
      text: text.slice(0, 500),
      statusAtTime: task.status,
      createdAt: new Date().toISOString()
    };

    const existing = Array.isArray(task.comments) ? task.comments : [];
    const updated = await taskRepo.updateFields(req.params.id, {
      comments: [...existing, entry]
    });

    res.json({ message: 'Comment added', task: enrichTask(updated) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    const task = db.get("tasks").find({ id: req.params.id }).value();
    if (!task) return res.status(404).json({ message: "Task not found" });

    const canUpdateAny = hasPermission(req.user, "task:status:update:any");
    const canUpdateOwn =
      hasPermission(req.user, "task:status:update:own") &&
      String(task.assignedTo) === String(req.user.id);

    if (!canUpdateAny && !canUpdateOwn) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    if (task.status === "completed") {
      return res
        .status(400)
        .json({ message: "Completed tasks cannot change status" });
    }

    db.get("tasks")
      .find({ id: req.params.id })
      .assign({ status: req.body.status, updatedAt: new Date().toISOString() })
      .write();

    const updated = db.get("tasks").find({ id: req.params.id }).value();
    res.json({ message: "Task status updated", task: enrichTask(updated) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const deleteTask = async (req, res) => {
  try {
<<<<<<< HEAD
    const task = await taskRepo.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.status === 'completed')
      return res.status(400).json({ message: 'Completed tasks cannot be deleted' });
    if (isOverdue(task))
      return res.status(400).json({ message: 'Overdue tasks cannot be deleted' });

    await taskRepo.remove(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    const task = db.get("tasks").find({ id: req.params.id }).value();
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.status === "completed")
      return res
        .status(400)
        .json({ message: "Completed tasks cannot be deleted" });

    if (isOverdue(task) && !hasPermission(req.user, "task:update")) {
      return res
        .status(400)
        .json({ message: "Overdue tasks cannot be deleted" });
    }

    db.get("tasks").remove({ id: req.params.id }).write();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const searchTasks = async (req, res) => {
  try {
    const { query, status, assignedTo, from, to } = req.query;
<<<<<<< HEAD

    const canSeeAll =
      hasPermission(req.user, 'task:view:all') &&
      (req.user.role === 'admin' || planHasFeature(req.user, 'task:view:all'));

    const tasks = await taskRepo.search({
      q: query,
      status,
      assignedTo: canSeeAll ? assignedTo : null,
      from,
      to,
      restrictToUser: canSeeAll ? null : req.user.id
    });

    res.json({ tasks: tasks.map(enrichTask) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    let tasks = db.get("tasks").value();

    if (!hasPermission(req.user, "task:view:all")) {
      tasks = tasks.filter((t) => t.assignedTo === req.user.id);
    }

    if (query) {
      const q = query.toLowerCase().trim();
      tasks = tasks.filter(
        (t) =>
          (t.title || "").toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q) ||
          (t.assignedToName || "").toLowerCase().includes(q),
      );
    }
    if (status) tasks = tasks.filter((t) => t.status === status);
    if (assignedTo && hasPermission(req.user, "task:view:all")) {
      tasks = tasks.filter((t) => t.assignedTo === assignedTo);
    }
    if (from) tasks = tasks.filter((t) => t.dueDate && t.dueDate >= from);
    if (to) tasks = tasks.filter((t) => t.dueDate && t.dueDate <= to);

    res.json({ tasks: tasks.map(enrichTask) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const getAssignableEmployees = async (req, res) => {
  try {
<<<<<<< HEAD
    const users = await userRepo.listAll();
    const ids = users.map((u) => u.id);
    const counts = await taskRepo.countActiveByUserIds(ids);

    const eligible = users
      .filter((u) => isEligibleAssignee(u, counts[u.id] || 0, req.user))
=======
    const users = db.get("users").value();
    const tasks = db.get("tasks").value();

    const eligible = users
      .filter((u) => isEligibleAssignee(u, tasks, req.user))
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
<<<<<<< HEAD
        activeTaskCount: counts[u.id] || 0
=======
        activeTaskCount: tasks.filter(
          (t) =>
            t.assignedTo === u.id &&
            (t.status === "pending" || t.status === "in-progress"),
        ).length,
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      }));

    res.json({ employees: eligible });
  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
<<<<<<< HEAD
  addComment,
  deleteTask,
  searchTasks,
  getAssignableEmployees
};
=======
  deleteTask,
  searchTasks,
  getAssignableEmployees,
};
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
