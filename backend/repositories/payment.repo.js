// repositories/payment.repo.js
const { query } = require('../config/db');

const mapRow = (r) => {
  if (!r) return null;
  return {
    id: r.id,
    userId: r.user_id,
    type: r.type,
    plan: r.plan,
    amount: r.amount,
    currency: r.currency,
    status: r.status,
    stripeEventId: r.stripe_event_id,
    stripeSessionId: r.stripe_session_id,
    stripeSubscriptionId: r.stripe_subscription_id,
    createdAt: r.created_at
  };
};

const findBySubscriptionId = async (id) => {
  const { rows } = await query(
    `SELECT * FROM payments
     WHERE stripe_subscription_id = $1 AND type = 'subscription'`,
    [id]
  );
  return mapRow(rows[0]);
};

const findBySessionId = async (id) => {
  const { rows } = await query(
    'SELECT * FROM payments WHERE stripe_session_id = $1',
    [id]
  );
  return mapRow(rows[0]);
};

const findByEventId = async (id) => {
  const { rows } = await query(
    'SELECT * FROM payments WHERE stripe_event_id = $1',
    [id]
  );
  return mapRow(rows[0]);
};

const create = async (p) => {
  await query(
    `INSERT INTO payments
     (id, user_id, type, plan, amount, currency, status,
      stripe_event_id, stripe_session_id, stripe_subscription_id, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      p.id,
      p.userId,
      p.type,
      p.plan || null,
      p.amount || 0,
      p.currency || 'usd',
      p.status,
      p.stripeEventId || null,
      p.stripeSessionId || null,
      p.stripeSubscriptionId || null,
      p.createdAt ? new Date(p.createdAt) : new Date()
    ]
  );
  return p;
};

const listAll = async () => {
  const { rows } = await query('SELECT * FROM payments ORDER BY created_at DESC');
  return rows.map(mapRow);
};

const listByUser = async (userId) => {
  const { rows } = await query(
    'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows.map(mapRow);
};

const findById = async (id) => {
  const { rows } = await query('SELECT * FROM payments WHERE id = $1', [id]);
  return mapRow(rows[0]);
};

module.exports = {
  findBySubscriptionId,
  findBySessionId,
  findByEventId,
  create,
  listAll,
  listByUser,
  findById,
  mapRow
};