<<<<<<< HEAD
// controllers/profile.controller.js
const bcrypt = require('bcryptjs');
const { sanitizeUser } = require('../utils/helper');
const userRepo = require('../repositories/user.repo');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const getProfile = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
=======

const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { sanitizeUser } = require('../utils/helper');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const getProfile = (req, res) => {
  const user = db.get('users').find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: sanitizeUser(user) });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword } = req.body;
<<<<<<< HEAD
    const me = await userRepo.findById(req.user.id);
=======
    const users = db.get('users').value();
    const me = db.get('users').find({ id: req.user.id }).value();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    if (!me) return res.status(404).json({ message: 'User not found' });

    const updates = {};

    if (name !== undefined) updates.name = name;

    if (email !== undefined) {
      const nextEmail = normalizeEmail(email);
      const currentEmail = normalizeEmail(me.email);

<<<<<<< HEAD
      if (nextEmail !== currentEmail) {
        const existing = await userRepo.findByEmail(nextEmail);
        if (existing && existing.id !== req.user.id) {
=======
      // Only treat as a change when the email actually differs
      if (nextEmail !== currentEmail) {
        if (users.some(u => normalizeEmail(u.email) === nextEmail && u.id !== req.user.id)) {
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
          return res.status(400).json({ message: 'Email already in use' });
        }
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required to change email' });
        }
        const ok = await bcrypt.compare(currentPassword, me.password);
        if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });
<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        updates.email = nextEmail;
      }
    }

<<<<<<< HEAD
    const updated = await userRepo.updateFields(req.user.id, updates);
=======
    db.get('users').find({ id: req.user.id }).assign(updates).write();
    const updated = db.get('users').find({ id: req.user.id }).value();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    res.json({ message: 'Profile updated', user: sanitizeUser(updated) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProfile, updateProfile };