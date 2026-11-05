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

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getChartData = async (req, res) => {
  try {
    const users = db.get('users').value();
    const tasks = db.get('tasks').value();
    const canViewAll = hasPermission(req.user, 'task:view:all');

    const days = [], taskCounts = [], userCounts = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

      if (canViewAll) {
        taskCounts.push(tasks.filter(t => t.createdAt.startsWith(dateStr)).length);
        userCounts.push(users.filter(u => u.createdAt.startsWith(dateStr)).length);
      } else {
        taskCounts.push(
          tasks.filter(t => t.assignedTo === req.user.id && t.createdAt.startsWith(dateStr)).length
        );
        userCounts.push(0);
      }
    }

    res.json({
      labels: days,
      datasets: [
        { label: 'Tasks', data: taskCounts, backgroundColor: 'rgba(54, 162, 235, 0.6)' },
        ...(canViewAll ? [{
          label: 'Users', data: userCounts, backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }] : [])
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats, getChartData };