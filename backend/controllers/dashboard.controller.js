<<<<<<< HEAD
// controllers/dashboard.controller.js
const userRepo = require('../repositories/user.repo');
const taskRepo = require('../repositories/task.repo');
const paymentRepo = require('../repositories/payment.repo');
const { getEffectivePlan } = require('../utils/plans');

const getVisibility = (user) => {
  const plan = getEffectivePlan(user);
  const isAdmin = user.role === 'admin';
  const isManager = user.role === 'manager';
  const isPaid = plan === 'lite' || plan === 'pro';

  const seesAllTasks = isAdmin || (isManager && isPaid);
  const seesUsers = isAdmin || (isManager && plan === 'pro');

  return { plan, isAdmin, isManager, seesAllTasks, seesUsers };
};

const computePaymentStats = (payments) => {
  let succeeded = 0;
  let failed = 0;
  let pending = 0;
  let revenueCents = 0;

  for (const p of payments) {
    if (p.status === 'succeeded') {
      succeeded++;
      revenueCents += p.amount || 0;
    } else if (p.status === 'failed') {
      failed++;
    } else if (p.status === 'pending') {
      pending++;
    }
  }

  return {
    totalPayments: payments.length,
    succeeded,
    failed,
    pending,
    revenueCents,
    currency: 'usd'
  };
};

const computePaymentChart = (payments) => {
  const days = [];
  const succeededSeries = [];
  const failedSeries = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

    let succ = 0;
    let fail = 0;
    for (const p of payments) {
      const createdAt = p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt || '');
      if (!createdAt.startsWith(dateStr)) continue;
      if (p.status === 'succeeded') succ++;
      else if (p.status === 'failed') fail++;
    }
    succeededSeries.push(succ);
    failedSeries.push(fail);
  }

  return {
    labels: days,
    datasets: [
      {
        label: 'Succeeded',
        data: succeededSeries,
        backgroundColor: 'rgba(34, 197, 94, 0.6)'
      },
      {
        label: 'Failed',
        data: failedSeries,
        backgroundColor: 'rgba(239, 68, 68, 0.6)'
      }
    ]
  };
};

const getDashboardStats = async (req, res) => {
  try {
    const users = await userRepo.listAll();
    const tasks = await taskRepo.listAll();
    const vis = getVisibility(req.user);

    let stats;

    if (vis.seesAllTasks) {
      stats = {
        scope: 'all',
        plan: vis.plan,
        totalTasks: tasks.length,
        pendingTasks: tasks.filter((t) => t.status === 'pending').length,
        inProgressTasks: tasks.filter((t) => t.status === 'in-progress').length,
        completedTasks: tasks.filter((t) => t.status === 'completed').length,
        overdueTasks: tasks.filter((t) => {
          if (!t.dueDate || t.status === 'completed') return false;
          const due = new Date(t.dueDate);
          due.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return due < today;
        }).length
      };

      if (vis.seesUsers) {
        const teamUsers = users.filter((u) => u.role !== 'admin');
        stats.totalUsers = teamUsers.length;
        stats.activeUsers = teamUsers.filter((u) => u.status === 'active').length;
        stats.employeeCount = users.filter((u) => u.role === 'employee').length;
        stats.managerCount = users.filter((u) => u.role === 'manager').length;
      }
    } else {
      const myTasks = tasks.filter((t) => String(t.assignedTo) === String(req.user.id));
      const overdue = myTasks.filter((t) => {
        if (!t.dueDate || t.status === 'completed') return false;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return due < today;
      }).length;

      stats = {
        scope: 'own',
        plan: vis.plan,
        totalTasks: myTasks.length,
        pendingTasks: myTasks.filter((t) => t.status === 'pending').length,
        inProgressTasks: myTasks.filter((t) => t.status === 'in-progress').length,
        completedTasks: myTasks.filter((t) => t.status === 'completed').length,
        overdueTasks: overdue
      };
    }

    if (vis.isAdmin) {
      const payments = await paymentRepo.listAll();
      stats.paymentStats = computePaymentStats(payments);
    }

=======
const db = require('../config/db');
const { hasPermission } = require('../utils/permissions');

const getDashboardStats = async (req, res) => {
  try {
    const users = db.get('users').value();
    const tasks = db.get('tasks').value();

    let stats;
    if (hasPermission(req.user, 'task:view:all')) {
      const totalUsers = users.filter(u => u.role === 'employee').length;
      const activeUsers = users.filter(u => u.role === 'employee' && u.status === 'active').length;
      const totalTasks = tasks.length;
      stats = {
        totalUsers, activeUsers, totalTasks,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
        completedTasks: tasks.filter(t => t.status === 'completed').length
      };
    } else {
      const myTasks = tasks.filter(t => t.assignedTo === req.user.id);
      stats = {
        totalTasks: myTasks.length,
        pendingTasks: myTasks.filter(t => t.status === 'pending').length,
        inProgressTasks: myTasks.filter(t => t.status === 'in-progress').length,
        completedTasks: myTasks.filter(t => t.status === 'completed').length
      };
    }

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getChartData = async (req, res) => {
  try {
<<<<<<< HEAD
    const users = await userRepo.listAll();
    const tasks = await taskRepo.listAll();
    const vis = getVisibility(req.user);

    const days = [];
    const taskCounts = [];
    const userCounts = [];
=======
    const users = db.get('users').value();
    const tasks = db.get('tasks').value();
    const canViewAll = hasPermission(req.user, 'task:view:all');

    const days = [], taskCounts = [], userCounts = [];
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

<<<<<<< HEAD
      if (vis.seesAllTasks) {
        taskCounts.push(
          tasks.filter((t) => {
            const c = t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt || '');
            return c.startsWith(dateStr);
          }).length
        );
      } else {
        taskCounts.push(
          tasks.filter((t) => {
            const c = t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt || '');
            return String(t.assignedTo) === String(req.user.id) && c.startsWith(dateStr);
          }).length
        );
      }

      if (vis.seesUsers) {
        userCounts.push(
          users.filter((u) => {
            const c = u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt || '');
            return c.startsWith(dateStr);
          }).length
        );
      } else {
=======
      if (canViewAll) {
        taskCounts.push(tasks.filter(t => t.createdAt.startsWith(dateStr)).length);
        userCounts.push(users.filter(u => u.createdAt.startsWith(dateStr)).length);
      } else {
        taskCounts.push(
          tasks.filter(t => t.assignedTo === req.user.id && t.createdAt.startsWith(dateStr)).length
        );
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        userCounts.push(0);
      }
    }

<<<<<<< HEAD
    const datasets = [
      {
        label: vis.seesAllTasks ? 'All Tasks' : 'My Tasks',
        data: taskCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ];

    if (vis.seesUsers) {
      datasets.push({
        label: 'New Users',
        data: userCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      });
    }

    res.json({
      labels: days,
      datasets,
      scope: vis.seesAllTasks ? 'all' : 'own',
      plan: vis.plan
=======
    res.json({
      labels: days,
      datasets: [
        { label: 'Tasks', data: taskCounts, backgroundColor: 'rgba(54, 162, 235, 0.6)' },
        ...(canViewAll ? [{
          label: 'Users', data: userCounts, backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }] : [])
      ]
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

<<<<<<< HEAD
const getPaymentChartData = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    const payments = await paymentRepo.listAll();
    res.json(computePaymentChart(payments));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats, getChartData, getPaymentChartData };
=======
module.exports = { getDashboardStats, getChartData };
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
