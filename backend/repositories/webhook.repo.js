// repositories/webhook.repo.js
const { query } = require('../config/db');

const findById = async (id) => {
  const { rows } = await query('SELECT * FROM webhook_events WHERE id = $1', [id]);
  return rows[0] || null;
};

const create = async (e) => {
  await query(
    'INSERT INTO webhook_events (id, type, user_id, received_at) VALUES ($1,$2,$3,$4)',
    [e.id, e.type, e.userId || null, new Date()]
  );
};

const remove = async (id) => {
  await query('DELETE FROM webhook_events WHERE id = $1', [id]);
};

module.exports = { findById, create, remove };