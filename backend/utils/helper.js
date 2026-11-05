<<<<<<< HEAD
// utils/helper.js
=======

const db = require('../config/db');
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
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
<<<<<<< HEAD
  const token = generateToken({
    id: user.id,
    tokenVersion: user.tokenVersion || 0
  });
=======
  const token = generateToken({ id: user.id, tokenVersion: user.tokenVersion || 0 });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
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

<<<<<<< HEAD
const enrichTask = (task) => task;

const isOverdue = (task) => {
  if (!task || !task.dueDate) return false;
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
=======
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
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  return due.getTime() < today.getTime();
};

const sanitizeUser = (user) => {
  if (!user) return null;
<<<<<<< HEAD
  const { password, tokenVersion, stripeCustomerId, ...safe } = user;
=======
  const { password, tokenVersion, ...safe } = user;
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  return safe;
};

module.exports = {
<<<<<<< HEAD
  isPastDate,
  COOKIE_OPTIONS,
  setAuthCookie,
  clearCookie,
  enrichTask,
  isOverdue,
  sanitizeUser
=======
  isPastDate, COOKIE_OPTIONS, setAuthCookie, clearCookie,
  enrichTask, isOverdue, sanitizeUser
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
};