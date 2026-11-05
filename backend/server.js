<<<<<<< HEAD
// server.js
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
<<<<<<< HEAD
const { pool } = require('./config/db');
const resetRepo = require('./repositories/resetCode.repo');
const { startReconcileJob } = require('./cron/reconcileJob');
=======
const db = require('./config/db');
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const profileRoutes = require('./routes/profile.routes');
<<<<<<< HEAD
const paymentRoutes = require('./routes/payment.routes');
const webhookRoutes = require('./routes/webhook.routes');
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

const app = express();
const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
if (!process.env.FRONTEND_URL) {
  console.warn('FRONTEND_URL not set, defaulting to http://localhost:5173');
}

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  console.log(`[req] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    console.warn(`CORS blocked origin: ${origin}`);
    return cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition', 'Content-Type'],
  maxAge: 86400
}));

// Webhook MUST be before express.json()
app.use('/api/webhooks', webhookRoutes);

app.use(express.json());
app.use(cookieParser());

// Periodic cleanup of expired reset codes
const cleanupInterval = setInterval(async () => {
  try {
    await resetRepo.removeExpired(Date.now());
  } catch (e) {
    console.error('[cleanup] resetCodes error:', e.message);
  }
}, 30000);
=======
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const cleanupInterval = setInterval(() => {
  const now = Date.now();
  const expired = db.get('resetCodes').value().filter(e => now > e.expiresAt);
  if (expired.length > 0) {
    db.get('resetCodes').remove(e => now > e.expiresAt).write();
  }
}, 10000);
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
cleanupInterval.unref();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
<<<<<<< HEAD
app.use('/api/payments', paymentRoutes);
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

<<<<<<< HEAD
=======
// Global error handler
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

<<<<<<< HEAD
async function start() {
  try {
    // Verify DB connection
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected ✓');
  } catch (e) {
    console.error('❌ Cannot connect to PostgreSQL:', e.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Webhook endpoint: POST http://localhost:${PORT}/api/webhooks/stripe`);
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY not set, payment routes will fail.');
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('STRIPE_WEBHOOK_SECRET not set, webhook signature verification will fail.');
    } else {
      console.log('STRIPE_WEBHOOK_SECRET is configured ✓');
    }
    if (process.env.NODE_ENV !== 'test') startReconcileJob();
  });
}

start();
=======
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
