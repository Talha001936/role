// repositories/resetCode.repo.js
const { query } = require('../config/db');

const mapRow = (r) => {
  if (!r) return null;
  return {
    email: r.email,
    code: r.code,
    expiresAt: Number(r.expires_at),
    verified: r.verified,
    attempts: r.attempts,
    createdAt: Number(r.created_at)
  };
};

const findByEmail = async (email) => {
  const { rows } = await query('SELECT * FROM reset_codes WHERE email = $1', [email]);
  return mapRow(rows[0]);
};

const upsert = async (entry) => {
  await query(
    `INSERT INTO reset_codes (email, code, expires_at, verified, attempts, created_at)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (email) DO UPDATE SET
       code = EXCLUDED.code,
       expires_at = EXCLUDED.expires_at,
       verified = EXCLUDED.verified,
       attempts = EXCLUDED.attempts,
       created_at = EXCLUDED.created_at`,
    [
      entry.email,
      entry.code,
      entry.expiresAt,
      !!entry.verified,
      entry.attempts || 0,
      entry.createdAt || Date.now()
    ]
  );
};

const update = async (email, fields) => {
  const colMap = {
    verified: 'verified',
    attempts: 'attempts',
    code: 'code',
    expiresAt: 'expires_at'
  };
  const cols = [];
  const vals = [];
  let i = 1;
  for (const [k, v] of Object.entries(fields)) {
    if (!colMap[k]) continue;
    cols.push(`${colMap[k]} = $${i++}`);
    vals.push(v);
  }
  if (!cols.length) return;
  vals.push(email);
  await query(`UPDATE reset_codes SET ${cols.join(', ')} WHERE email = $${i}`, vals);
};

const remove = async (email) => {
  await query('DELETE FROM reset_codes WHERE email = $1', [email]);
};

const removeExpired = async (now) => {
  await query('DELETE FROM reset_codes WHERE expires_at < $1', [now]);
};

module.exports = { findByEmail, upsert, update, remove, removeExpired };