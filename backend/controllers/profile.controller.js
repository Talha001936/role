
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { sanitizeUser } = require('../utils/helper');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const getProfile = (req, res) => {
  const user = db.get('users').find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: sanitizeUser(user) });
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword } = req.body;
    const users = db.get('users').value();
    const me = db.get('users').find({ id: req.user.id }).value();
    if (!me) return res.status(404).json({ message: 'User not found' });

    const updates = {};

    if (name !== undefined) updates.name = name;

    if (email !== undefined) {
      const nextEmail = normalizeEmail(email);
      const currentEmail = normalizeEmail(me.email);

      // Only treat as a change when the email actually differs
      if (nextEmail !== currentEmail) {
        if (users.some(u => normalizeEmail(u.email) === nextEmail && u.id !== req.user.id)) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required to change email' });
        }
        const ok = await bcrypt.compare(currentPassword, me.password);
        if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

        updates.email = nextEmail;
      }
    }

    db.get('users').find({ id: req.user.id }).assign(updates).write();
    const updated = db.get('users').find({ id: req.user.id }).value();
    res.json({ message: 'Profile updated', user: sanitizeUser(updated) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProfile, updateProfile };