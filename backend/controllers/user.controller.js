const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { sanitizeUser } = require('../utils/helper');

const ACTIVE_STATUSES = ['pending', 'in-progress'];

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const getActiveTasksFor = (userId) =>
  db.get('tasks')
    .value()
    .filter(
      (t) => String(t.assignedTo) === String(userId) && ACTIVE_STATUSES.includes(t.status)
    );


const createUser = async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const email = normalizeEmail(req.body.email);

    const exists = db.get('users')
      .value()
      .some((u) => normalizeEmail(u.email) === email);

    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: role || 'employee',
      status: 'active',
      tokenVersion: 0,
      createdAt: new Date().toISOString()
    };
    db.get('users').push(user).write();
    res.status(201).json({ message: 'User created', user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getUsers = async (req, res) => {
  try {
    const users = db.get('users').value().map(sanitizeUser);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = db.get('users')
      .filter((u) =>
        (u.role === 'employee' || u.role === 'manager') &&
        u.status === 'active'
      )
      .value()
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status
      }));
    res.json({ employees });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query, status, role } = req.query;
    let users = db.get('users').value();

    if (query) {
      const q = query.toLowerCase().trim();
      users = users.filter(
        (u) =>
          (u.name || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q)
      );
    }
    if (status) users = users.filter((u) => u.status === status);
    if (role) users = users.filter((u) => u.role === role);

    res.json({ users: users.map(sanitizeUser) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getBlockingTasks = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const user = db.get('users').find({ id: req.params.id }).value();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const activeTasks = getActiveTasksFor(user.id);
    res.json({
      user: { id: user.id, name: user.name, role: user.role, status: user.status },
      count: activeTasks.length,
      tasks: activeTasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        dueDate: t.dueDate,
        assignedBy: t.assignedBy,
        assignedByName: t.assignedByName
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateUserStatus = async (req, res) => {
  try {
    const user = db.get('users').find({ id: req.params.id }).value();
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own status' });
    }

    const { status } = req.body;

    if (status === 'deactivated') {
      const activeTasks = getActiveTasksFor(user.id);
      if (activeTasks.length > 0) {
        return res.status(400).json({
          message: `Cannot deactivate. ${activeTasks.length} active task(s) must be reassigned or completed first.`,
          blockingTasks: activeTasks.map((t) => ({
            id: t.id, title: t.title, status: t.status, dueDate: t.dueDate
          }))
        });
      }

      db.get('tasks')
        .filter((t) => String(t.assignedTo) === String(user.id))
        .each((t) => {
          t.requiresReassignment = true;
        })
        .write();
    }

    if (status === 'active') {
      db.get('tasks')
        .filter((t) => String(t.assignedTo) === String(user.id))
        .each((t) => {
          delete t.requiresReassignment;
        })
        .write();
    }

    db.get('users').find({ id: req.params.id }).assign({ status }).write();
    res.json({
      message: `User ${status === 'active' ? 'activated' : 'deactivated'}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = db.get('users').find({ id: req.params.id }).value();
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const activeTasks = getActiveTasksFor(user.id);
    if (activeTasks.length > 0) {
      return res.status(400).json({
        message: `Cannot delete. ${activeTasks.length} active task(s) must be reassigned or completed first.`,
        blockingTasks: activeTasks.map((t) => ({
          id: t.id, title: t.title, status: t.status, dueDate: t.dueDate
        }))
      });
    }

    db.get('tasks')
      .filter((t) => String(t.assignedTo) === String(user.id))
      .each((t) => {
        t.requiresReassignment = true;
        t.assignedToName = `${t.assignedToName || user.name} (deleted)`;
      })
      .write();

    db.get('resetCodes').remove({ email: user.email }).write();
    db.get('users').remove({ id: req.params.id }).write();

    res.json({
      message: 'User deleted. Existing tasks were preserved and flagged for reassignment.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getEmployees,
  searchUsers,
  getBlockingTasks,
  updateUserStatus,
  deleteUser
};