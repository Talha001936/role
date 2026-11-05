// // scripts/migrate-to-pg.js
// require('dotenv').config();
// const fs = require('fs');
// const path = require('path');
// const { pool } = require('../config/db');

// async function run() {
//   const dbPath = path.join(__dirname, '../data/db.json');
//   if (!fs.existsSync(dbPath)) {
//     console.error('❌ data/db.json not found');
//     process.exit(1);
//   }
//   const raw = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
//   const client = await pool.connect();

//   try {
//     await client.query('BEGIN');

//     // Users
//     for (const u of raw.users || []) {
//       const sub = u.subscription || {};
//       await client.query(
//         `INSERT INTO users
//          (id, name, email, password, role, status, signup_paid, plan,
//           stripe_customer_id, token_version, last_reconcile_at, created_at,
//           sub_plan, sub_status, sub_stripe_id, sub_current_period_end, sub_cancel_at_period_end)
//          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
//          ON CONFLICT (id) DO NOTHING`,
//         [
//           u.id,
//           u.name,
//           u.email,
//           u.password,
//           u.role,
//           u.status || 'active',
//           !!u.signupPaid,
//           u.plan || 'none',
//           u.stripeCustomerId || null,
//           u.tokenVersion || 0,
//           u.lastReconcileAt ? new Date(u.lastReconcileAt) : null,
//           u.createdAt ? new Date(u.createdAt) : new Date(),
//           sub.plan || 'none',
//           sub.status || 'inactive',
//           sub.stripeSubscriptionId || null,
//           sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null,
//           !!sub.cancelAtPeriodEnd
//         ]
//       );
//     }
//     console.log(`✅ users migrated: ${(raw.users || []).length}`);

//     // Tasks
//     for (const t of raw.tasks || []) {
//       await client.query(
//         `INSERT INTO tasks
//          (id, title, description, assigned_to, assigned_to_name,
//           assigned_by, assigned_by_name, status, due_date,
//           requires_reassignment, comments, created_at, updated_at)
//          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
//          ON CONFLICT (id) DO NOTHING`,
//         [
//           t.id,
//           t.title,
//           t.description || '',
//           t.assignedTo || null,
//           t.assignedToName || null,
//           t.assignedBy || null,
//           t.assignedByName || null,
//           t.status || 'pending',
//           t.dueDate ? new Date(t.dueDate) : null,
//           !!t.requiresReassignment,
//           JSON.stringify(t.comments || []),
//           t.createdAt ? new Date(t.createdAt) : new Date(),
//           t.updatedAt ? new Date(t.updatedAt) : new Date()
//         ]
//       );
//     }
//     console.log(`✅ tasks migrated: ${(raw.tasks || []).length}`);

//     // Payments
//     for (const p of raw.payments || []) {
//       await client.query(
//         `INSERT INTO payments
//          (id, user_id, type, plan, amount, currency, status,
//           stripe_event_id, stripe_session_id, stripe_subscription_id, created_at)
//          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
//          ON CONFLICT (id) DO NOTHING`,
//         [
//           p.id,
//           p.userId,
//           p.type,
//           p.plan || null,
//           p.amount || 0,
//           p.currency || 'usd',
//           p.status,
//           p.stripeEventId || null,
//           p.stripeSessionId || null,
//           p.stripeSubscriptionId || null,
//           p.createdAt ? new Date(p.createdAt) : new Date()
//         ]
//       );
//     }
//     console.log(`✅ payments migrated: ${(raw.payments || []).length}`);

//     // Webhook events
//     for (const e of raw.webhookEvents || []) {
//       await client.query(
//         `INSERT INTO webhook_events (id, type, user_id, received_at)
//          VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`,
//         [
//           e.id,
//           e.type,
//           e.userId || null,
//           e.receivedAt ? new Date(e.receivedAt) : new Date()
//         ]
//       );
//     }
//     console.log(`✅ webhook events migrated: ${(raw.webhookEvents || []).length}`);

//     // Reset codes
//     for (const r of raw.resetCodes || []) {
//       await client.query(
//         `INSERT INTO reset_codes (email, code, expires_at, verified, attempts, created_at)
//          VALUES ($1,$2,$3,$4,$5,$6)
//          ON CONFLICT (email) DO UPDATE SET
//            code = EXCLUDED.code,
//            expires_at = EXCLUDED.expires_at,
//            verified = EXCLUDED.verified,
//            attempts = EXCLUDED.attempts,
//            created_at = EXCLUDED.created_at`,
//         [r.email, r.code, r.expiresAt, !!r.verified, r.attempts || 0, r.createdAt || Date.now()]
//       );
//     }
//     console.log(`✅ reset codes migrated: ${(raw.resetCodes || []).length}`);

//     await client.query('COMMIT');
//     console.log('\n🎉 Migration complete');
//   } catch (e) {
//     await client.query('ROLLBACK');
//     console.error('❌ Migration failed:', e.message);
//     throw e;
//   } finally {
//     client.release();
//     await pool.end();
//   }
// }

// run().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });