// repositories/user.repo.js
const { query } = require('../config/db');

const mapRow = (r) => {
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    password: r.password,
    role: r.role,
    status: r.status,
    signupPaid: r.signup_paid,
    plan: r.plan,
    stripeCustomerId: r.stripe_customer_id,
    tokenVersion: r.token_version,
    lastReconcileAt: r.last_reconcile_at,
    createdAt: r.created_at,
    subscription: {
      plan: r.sub_plan,
      status: r.sub_status,
      stripeSubscriptionId: r.sub_stripe_id,
      currentPeriodEnd: r.sub_current_period_end,
      cancelAtPeriodEnd: r.sub_cancel_at_period_end
    }
  };
};

const findById = async (id) => {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return mapRow(rows[0]);
};

const findByEmail = async (email) => {
  const { rows } = await query(
    'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return mapRow(rows[0]);
};

const findByStripeCustomer = async (customerId) => {
  const { rows } = await query(
    'SELECT * FROM users WHERE stripe_customer_id = $1',
    [customerId]
  );
  return mapRow(rows[0]);
};

const listAll = async () => {
  const { rows } = await query('SELECT * FROM users ORDER BY created_at DESC');
  return rows.map(mapRow);
};

const listWithStripe = async () => {
  const { rows } = await query(
    'SELECT * FROM users WHERE stripe_customer_id IS NOT NULL'
  );
  return rows.map(mapRow);
};

const create = async (u) => {
  await query(
    `INSERT INTO users
     (id, name, email, password, role, status,
      signup_paid, plan, stripe_customer_id, token_version, created_at,
      sub_plan, sub_status, sub_stripe_id, sub_current_period_end, sub_cancel_at_period_end)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
    [
      u.id, u.name, u.email, u.password, u.role,
      u.status || 'pending_payment',
      !!u.signupPaid,
      u.plan || 'none',
      u.stripeCustomerId || null,
      u.tokenVersion || 0,
      u.createdAt ? new Date(u.createdAt) : new Date(),
      u.subscription?.plan || 'none',
      u.subscription?.status || 'inactive',
      u.subscription?.stripeSubscriptionId || null,
      u.subscription?.currentPeriodEnd
        ? new Date(u.subscription.currentPeriodEnd)
        : null,
      !!u.subscription?.cancelAtPeriodEnd
    ]
  );
  return findById(u.id);
};

const updateFields = async (id, fields) => {
  const colMap = {
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    status: 'status',
    signupPaid: 'signup_paid',
    plan: 'plan',
    stripeCustomerId: 'stripe_customer_id',
    tokenVersion: 'token_version',
    lastReconcileAt: 'last_reconcile_at'
  };
  const cols = [];
  const vals = [];
  let i = 1;
  for (const [k, v] of Object.entries(fields)) {
    if (!colMap[k]) continue;
    cols.push(`${colMap[k]} = $${i++}`);
    vals.push(v);
  }
  if (!cols.length) return findById(id);
  vals.push(id);
  await query(`UPDATE users SET ${cols.join(', ')} WHERE id = $${i}`, vals);
  return findById(id);
};

const updateSubscription = async (id, sub) => {
  await query(
    `UPDATE users SET
       sub_plan = $1,
       sub_status = $2,
       sub_stripe_id = $3,
       sub_current_period_end = $4,
       sub_cancel_at_period_end = $5
     WHERE id = $6`,
    [
      sub.plan || 'none',
      sub.status || 'inactive',
      sub.stripeSubscriptionId || null,
      sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null,
      !!sub.cancelAtPeriodEnd,
      id
    ]
  );
};

const remove = async (id) => {
  await query('DELETE FROM users WHERE id = $1', [id]);
};

module.exports = {
  findById,
  findByEmail,
  findByStripeCustomer,
  listAll,
  listWithStripe,
  create,
  updateFields,
  updateSubscription,
  remove,
  mapRow
};