
const db = require('../config/db');
const { generateToken } = require('./jwt');

const isPastDate = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
};

const sevenDays = 7 * 24 * 60 * 60 * 1000;

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: sevenDays,
  path: '/',
  secure: process.env.NODE_ENV === 'production'
};

const setAuthCookie = (res, user) => {
  const token = generateToken({ id: user.id, tokenVersion: user.tokenVersion || 0 });
  res.cookie('token', token, COOKIE_OPTIONS);
};

const clearCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production'
  });
};

const enrichTask = (task) => {
  if (!task) return task;
  const users = db.get('users').value();
  const assignedUser = users.find(u => String(u.id) === String(task.assignedTo));
  const assignedByUser = users.find(u => String(u.id) === String(task.assignedBy));
  return {
    ...task,
    assignedToName: task.assignedToName || assignedUser?.name || 'Unknown',
    assignedByName: task.assignedByName || assignedByUser?.name || 'Unknown'
  };
};

const isOverdue = (task) => {
  if (!task.dueDate) return false;
  const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, tokenVersion, ...safe } = user;
  return safe;
};

module.exports = {
  isPastDate, COOKIE_OPTIONS, setAuthCookie, clearCookie,
  enrichTask, isOverdue, sanitizeUser
};