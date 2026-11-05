const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const { isOverdue, enrichTask, isPastDate } = require("../utils/helper");
const { hasPermission, isEligibleAssignee } = require("../utils/permissions");

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

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
    }

    const task = {
      id: uuidv4(),
      title,
      description: description || "",
      assignedTo,
      assignedToName: employee.name,
      assignedBy: req.user.id,
      assignedByName: req.user.name,
      status: "pending",
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.get("tasks").push(task).write();
    res.status(201).json({ message: "Task created", task: enrichTask(task) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const all = db.get("tasks").value();
    const visible = hasPermission(req.user, "task:view:all")
      ? all
      : all.filter((t) => t.assignedTo === req.user.id);
    res.json({ tasks: visible.map(enrichTask) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = db.get("tasks").find({ id: req.params.id }).value();
    if (!task) return res.status(404).json({ message: "Task not found" });

    const canViewAll = hasPermission(req.user, "task:view:all");
    if (!canViewAll && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    res.json({ task: enrichTask(task) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
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
    }

    if (dueDate !== undefined) {
      if (isPastDate(dueDate)) {
        return res
          .status(400)
          .json({ message: "Due date cannot be earlier than today" });
      }
      updates.dueDate = dueDate;
    }

    db.get("tasks").find({ id: req.params.id }).assign(updates).write();
    const updated = db.get("tasks").find({ id: req.params.id }).value();
    res.json({ message: "Task updated", task: enrichTask(updated) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
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
  }
};

const deleteTask = async (req, res) => {
  try {
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
  }
};

const searchTasks = async (req, res) => {
  try {
    const { query, status, assignedTo, from, to } = req.query;
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
  }
};

const getAssignableEmployees = async (req, res) => {
  try {
    const users = db.get("users").value();
    const tasks = db.get("tasks").value();

    const eligible = users
      .filter((u) => isEligibleAssignee(u, tasks, req.user))
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        activeTaskCount: tasks.filter(
          (t) =>
            t.assignedTo === u.id &&
            (t.status === "pending" || t.status === "in-progress"),
        ).length,
      }));

    res.json({ employees: eligible });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  searchTasks,
  getAssignableEmployees,
};
