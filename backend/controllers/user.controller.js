<<<<<<< HEAD
// controllers/user.controller.js
const { sanitizeUser } = require('../utils/helper');
const userRepo = require('../repositories/user.repo');
const taskRepo = require('../repositories/task.repo');

const ACTIVE_STATUSES = ['pending', 'in-progress'];
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const getActiveTasksFor = async (userId) => {
  const tasks = await taskRepo.listByAssignee(userId);
  return tasks.filter((t) => ACTIVE_STATUSES.includes(t.status));
};

const getUsers = async (req, res) => {
  try {
    const users = await userRepo.listAll();
    res.json({ users: users.map(sanitizeUser) });
=======
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
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
<<<<<<< HEAD
    const users = await userRepo.listAll();
    const employees = users
      .filter((u) => (u.role === 'employee' || u.role === 'manager') && u.status === 'active')
=======
    const employees = db.get('users')
      .filter((u) =>
        (u.role === 'employee' || u.role === 'manager') &&
        u.status === 'active'
      )
      .value()
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
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
<<<<<<< HEAD
    let users = await userRepo.listAll();
=======
    let users = db.get('users').value();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

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

<<<<<<< HEAD
const getBlockingTasks = async (req, res) => {
  try {
    const user = await userRepo.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const activeTasks = await getActiveTasksFor(user.id);
=======

const getBlockingTasks = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const user = db.get('users').find({ id: req.params.id }).value();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const activeTasks = getActiveTasksFor(user.id);
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
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

<<<<<<< HEAD
const updateUserStatus = async (req, res) => {
  try {
    const user = await userRepo.findById(req.params.id);
=======

const updateUserStatus = async (req, res) => {
  try {
    const user = db.get('users').find({ id: req.params.id }).value();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own status' });
    }

    const { status } = req.body;

    if (status === 'deactivated') {
<<<<<<< HEAD
      const activeTasks = await getActiveTasksFor(user.id);
=======
      const activeTasks = getActiveTasksFor(user.id);
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      if (activeTasks.length > 0) {
        return res.status(400).json({
          message: `Cannot deactivate. ${activeTasks.length} active task(s) must be reassigned or completed first.`,
          blockingTasks: activeTasks.map((t) => ({
<<<<<<< HEAD
            id: t.id,
            title: t.title,
            status: t.status,
            dueDate: t.dueDate
          }))
        });
      }
      await taskRepo.flagForReassignmentByUser(user.id);
    }

    if (status === 'active') {
      await taskRepo.clearReassignmentFlag(user.id);
    }

    await userRepo.updateFields(req.params.id, { status });
    res.json({ message: `User ${status === 'active' ? 'activated' : 'deactivated'}` });
=======
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
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

<<<<<<< HEAD
const deleteUser = async (req, res) => {
  try {
    const user = await userRepo.findById(req.params.id);
=======

const deleteUser = async (req, res) => {
  try {
    const user = db.get('users').find({ id: req.params.id }).value();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

<<<<<<< HEAD
    const activeTasks = await getActiveTasksFor(user.id);
=======
    const activeTasks = getActiveTasksFor(user.id);
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    if (activeTasks.length > 0) {
      return res.status(400).json({
        message: `Cannot delete. ${activeTasks.length} active task(s) must be reassigned or completed first.`,
        blockingTasks: activeTasks.map((t) => ({
<<<<<<< HEAD
          id: t.id,
          title: t.title,
          status: t.status,
          dueDate: t.dueDate
=======
          id: t.id, title: t.title, status: t.status, dueDate: t.dueDate
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        }))
      });
    }

<<<<<<< HEAD
    await taskRepo.flagForReassignmentByUser(user.id);
    await userRepo.remove(req.params.id);

    res.json({ message: 'User deleted. Active tasks were flagged for reassignment.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserPlan = async (req, res) => {
  try {
    const user = await userRepo.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { plan } = req.body;
    const valid = ['none', 'signup', 'lite', 'pro'];
    if (!valid.includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan' });
    }
    if (plan === 'lite' && user.role !== 'manager') {
      return res.status(400).json({ message: 'Lite plan is only available for managers' });
    }

    const isPro = plan === 'pro';
    const isLite = plan === 'lite';
    const isSignup = plan === 'signup';
    const isPaid = isPro || isLite;

    await userRepo.updateFields(req.params.id, {
      signupPaid: plan !== 'none'
    });

    await userRepo.updateSubscription(req.params.id, {
      plan: isPro ? 'pro' : isLite ? 'lite' : isSignup ? 'signup' : 'none',
      status: plan === 'none' ? 'inactive' : 'active',
      stripeSubscriptionId: isPaid
        ? user.subscription?.stripeSubscriptionId || null
        : null,
      currentPeriodEnd: isPaid
        ? user.subscription?.currentPeriodEnd || null
        : null,
      cancelAtPeriodEnd: false
    });

    res.json({ message: `Plan updated to ${plan}` });
=======
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
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
<<<<<<< HEAD
=======
  createUser,
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  getUsers,
  getEmployees,
  searchUsers,
  getBlockingTasks,
  updateUserStatus,
<<<<<<< HEAD
  deleteUser,
  updateUserPlan
=======
  deleteUser
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
};