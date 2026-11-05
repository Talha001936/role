<<<<<<< HEAD
// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { generateCode } = require('../utils/codeGenerator');
const { sendResetCodeEmail } = require('../utils/mailer');
const { setAuthCookie, clearCookie, sanitizeUser } = require('../utils/helper');
const { getPermissions } = require('../utils/permissions');
const { getEffectivePlan, getPlanPermissions } = require('../utils/plans');

const userRepo = require('../repositories/user.repo');
const resetRepo = require('../repositories/resetCode.repo');

const MAX_VERIFY_ATTEMPTS = 3;

const withBilling = (user) => ({
  ...sanitizeUser(user),
  permissions: getPermissions(user.role),
  plan: getEffectivePlan(user),
  planPermissions: getPlanPermissions(user),
  signupPaid: !!user.signupPaid
=======

const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const { generateCode } = require("../utils/codeGenerator");
const { sendResetCodeEmail } = require("../utils/mailer");
const { setAuthCookie, clearCookie, sanitizeUser } = require("../utils/helper");
const { getPermissions } = require("../utils/permissions");

const MAX_VERIFY_ATTEMPTS = 3;

const withPermissions = (user) => ({
  ...sanitizeUser(user),
  permissions: getPermissions(user.role)
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
});

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

<<<<<<< HEAD
const register = async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!['manager', 'employee'].includes(role)) {
      return res.status(400).json({ message: 'Role must be manager or employee' });
    }

    const existing = await userRepo.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already registered' });

=======
const findUserByEmail = (email) =>
  db.get("users").find((u) => normalizeEmail(u.email) === normalizeEmail(email)).value();

const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (findUserByEmail(email)) {
      return res.status(400).json({ message: "Email already registered" });
    }

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
<<<<<<< HEAD
      role,
      status: 'pending_payment',
      signupPaid: false,
      plan: 'none',
      subscription: {
        plan: 'none',
        status: 'inactive',
        stripeSubscriptionId: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      },
      stripeCustomerId: null,
      tokenVersion: 0,
      createdAt: new Date().toISOString()
    };
    await userRepo.create(user);
    setAuthCookie(res, user);

    res.status(201).json({
      message: 'Account created. Complete signup payment to activate.',
      requiresPayment: true,
      user: withBilling(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
      role: "employee",
      status: "deactivated",
      tokenVersion: 0,
      createdAt: new Date().toISOString()
    };
    db.get("users").push(user).write();

    res.status(201).json({
      message: "Registration successful. Your account is pending admin approval.",
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
<<<<<<< HEAD
    const user = await userRepo.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.status === 'deactivated') {
      return res.status(403).json({
        message: 'Account is deactivated, please contact your admin'
=======
    const user = findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.status === "deactivated") {
      return res.status(403).json({
        message: "Account is pending admin approval, please contact your admin"
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
<<<<<<< HEAD
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    setAuthCookie(res, user);

    const fresh = await userRepo.findById(user.id);
    res.json({
      message: 'Login successful',
      requiresPayment: user.role !== 'admin' && !user.signupPaid,
      user: withBilling(fresh)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    setAuthCookie(res, user);
    res.json({ message: "Login successful", user: withPermissions(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const logout = (req, res) => {
  clearCookie(res);
  res.json({ message: 'Logout successfully' });
};

<<<<<<< HEAD
const me = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      user: withBilling(user),
      requiresPayment: user.role !== 'admin' && !user.signupPaid,
      billingSyncPending: !!req.billingSyncPending
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
=======
const me = (req, res) => {
  const user = db.get("users").find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: withPermissions(user) });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
};

const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
<<<<<<< HEAD
    const user = await userRepo.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'This email is not registered' });

    const code = generateCode();
    const expiresAt = Date.now() + 60000;

    await resetRepo.upsert({
      email,
      code,
      expiresAt,
      verified: false,
      attempts: 0,
      createdAt: Date.now()
    });
=======
    const user = findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "This email is not registered" });

    db.get("resetCodes").remove({ email }).write();
    const code = generateCode();
    const expiresAt = Date.now() + 60000;

    db.get("resetCodes").push({
      email, code, expiresAt, verified: false, attempts: 0, createdAt: Date.now()
    }).write();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

    try {
      await sendResetCodeEmail(email, code);
    } catch (mailError) {
<<<<<<< HEAD
      console.error('Failed to send email:', mailError.message);
      return res.status(500).json({ message: 'Failed to send reset code. Try again later.' });
    }

    res.json({
      message: 'A 6-digit reset code has been sent to your email. It expires in 60 seconds.',
      email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
      console.error("Failed to send email:", mailError.message);
      return res.status(500).json({ message: "Failed to send reset code. Try again later." });
    }

    res.json({
      message: "A 6-digit reset code has been sent to your email. It expires in 60 seconds.",
      email
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const verifyCode = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { code } = req.body;
<<<<<<< HEAD
    const entry = await resetRepo.findByEmail(email);
    if (!entry) {
      return res.status(400).json({ message: 'No reset request found. Please request a new code.' });
    }

    if (Date.now() > entry.expiresAt) {
      await resetRepo.remove(email);
      return res.status(400).json({ message: 'Code has expired. Please request a new one.' });
    }

    if (entry.verified) {
      return res.status(400).json({ message: 'Code already verified. Please continue to reset password.' });
=======
    const entry = db.get("resetCodes").find({ email }).value();
    if (!entry) return res.status(400).json({ message: "No reset request found. Please request a new code." });

    if (Date.now() > entry.expiresAt) {
      db.get("resetCodes").remove({ email }).write();
      return res.status(400).json({ message: "Code has expired. Please request a new one." });
    }

    if (entry.verified) {
      return res.status(400).json({ message: "Code already verified. Please continue to reset password." });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    }

    if (entry.code !== code) {
      const attempts = (entry.attempts || 0) + 1;
      if (attempts >= MAX_VERIFY_ATTEMPTS) {
<<<<<<< HEAD
        await resetRepo.remove(email);
        return res.status(400).json({ message: 'Too many failed attempts. Please request a new code.' });
      }
      await resetRepo.update(email, { attempts });
      const remaining = MAX_VERIFY_ATTEMPTS - attempts;
      return res.status(400).json({
        message: `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
      });
    }

    await resetRepo.update(email, { verified: true });
    res.json({ message: 'Code verified successfully', email, verified: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
        db.get("resetCodes").remove({ email }).write();
        return res.status(400).json({ message: "Too many failed attempts. Please request a new code." });
      }
      db.get("resetCodes").find({ email }).assign({ attempts }).write();
      const remaining = MAX_VERIFY_ATTEMPTS - attempts;
      return res.status(400).json({
        message: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
      });
    }

    db.get("resetCodes").find({ email }).assign({ verified: true }).write();
    res.json({ message: "Code verified successfully", email, verified: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { code, newPassword } = req.body;
<<<<<<< HEAD
    const entry = await resetRepo.findByEmail(email);
    if (!entry) return res.status(400).json({ message: 'Session expired. Please start over.' });

    if (Date.now() > entry.expiresAt) {
      await resetRepo.remove(email);
      return res.status(400).json({ message: 'Code has expired. Please start over.' });
    }
    if (entry.code !== code || !entry.verified) {
      return res.status(400).json({ message: 'Verification failed. Please start over.' });
    }

    const user = await userRepo.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
=======
    const entry = db.get("resetCodes").find({ email }).value();
    if (!entry) return res.status(400).json({ message: "Session expired. Please start over." });

    if (Date.now() > entry.expiresAt) {
      db.get("resetCodes").remove({ email }).write();
      return res.status(400).json({ message: "Code has expired. Please start over." });
    }
    if (entry.code !== code || !entry.verified) {
      return res.status(400).json({ message: "Verification failed. Please start over." });
    }

    const user = findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const nextTokenVersion = (user.tokenVersion || 0) + 1;

<<<<<<< HEAD
    await userRepo.updateFields(user.id, {
      password: hashedPassword,
      tokenVersion: nextTokenVersion
    });
    await resetRepo.remove(email);

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    db.get("users").find({ id: user.id }).assign({
      password: hashedPassword,
      tokenVersion: nextTokenVersion
    }).write();
    db.get("resetCodes").remove({ email }).write();

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
<<<<<<< HEAD
    const user = await userRepo.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
=======
    const user = db.get("users").find({ id: req.user.id }).value();
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const nextTokenVersion = (user.tokenVersion || 0) + 1;

<<<<<<< HEAD
    await userRepo.updateFields(req.user.id, {
      password: hashedPassword,
      tokenVersion: nextTokenVersion
    });

    const updated = await userRepo.findById(req.user.id);
    setAuthCookie(res, updated);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
=======
    db.get("users").find({ id: req.user.id }).assign({
      password: hashedPassword,
      tokenVersion: nextTokenVersion
    }).write();

    // again issue a fresh cookie so the current session is not logged out
    const updated = db.get("users").find({ id: req.user.id }).value();
    setAuthCookie(res, updated);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }
};

module.exports = {
<<<<<<< HEAD
  register,
  login,
  logout,
  me,
  forgotPassword,
  verifyCode,
  resetPassword,
  changePassword
=======
  register, login, logout, me,
  forgotPassword, verifyCode, resetPassword, changePassword
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
};