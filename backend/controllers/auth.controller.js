
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
});

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const findUserByEmail = (email) =>
  db.get("users").find((u) => normalizeEmail(u.email) === normalizeEmail(email)).value();

const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (findUserByEmail(email)) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
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
  }
};

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    const user = findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.status === "deactivated") {
      return res.status(403).json({
        message: "Account is pending admin approval, please contact your admin"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    setAuthCookie(res, user);
    res.json({ message: "Login successful", user: withPermissions(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = (req, res) => {
  clearCookie(res);
  res.json({ message: 'Logout successfully' });
};

const me = (req, res) => {
  const user = db.get("users").find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: withPermissions(user) });
};

const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "This email is not registered" });

    db.get("resetCodes").remove({ email }).write();
    const code = generateCode();
    const expiresAt = Date.now() + 60000;

    db.get("resetCodes").push({
      email, code, expiresAt, verified: false, attempts: 0, createdAt: Date.now()
    }).write();

    try {
      await sendResetCodeEmail(email, code);
    } catch (mailError) {
      console.error("Failed to send email:", mailError.message);
      return res.status(500).json({ message: "Failed to send reset code. Try again later." });
    }

    res.json({
      message: "A 6-digit reset code has been sent to your email. It expires in 60 seconds.",
      email
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyCode = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { code } = req.body;
    const entry = db.get("resetCodes").find({ email }).value();
    if (!entry) return res.status(400).json({ message: "No reset request found. Please request a new code." });

    if (Date.now() > entry.expiresAt) {
      db.get("resetCodes").remove({ email }).write();
      return res.status(400).json({ message: "Code has expired. Please request a new one." });
    }

    if (entry.verified) {
      return res.status(400).json({ message: "Code already verified. Please continue to reset password." });
    }

    if (entry.code !== code) {
      const attempts = (entry.attempts || 0) + 1;
      if (attempts >= MAX_VERIFY_ATTEMPTS) {
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
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { code, newPassword } = req.body;
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const nextTokenVersion = (user.tokenVersion || 0) + 1;

    db.get("users").find({ id: user.id }).assign({
      password: hashedPassword,
      tokenVersion: nextTokenVersion
    }).write();
    db.get("resetCodes").remove({ email }).write();

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = db.get("users").find({ id: req.user.id }).value();
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const nextTokenVersion = (user.tokenVersion || 0) + 1;

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
  }
};

module.exports = {
  register, login, logout, me,
  forgotPassword, verifyCode, resetPassword, changePassword
};