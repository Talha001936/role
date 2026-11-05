// cron/reconcileJob.js — safety net
const cron = require('node-cron');
const { reconcileUser } = require('../utils/reconcile');
const userRepo = require('../repositories/user.repo');

const CRON_EXPRESSION = '0 */6 * * *';
const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

function isStale(user) {
  const last = user.lastReconcileAt
    ? new Date(user.lastReconcileAt).getTime()
    : 0;
  return Date.now() - last > STALE_AFTER_MS;
}

function startReconcileJob() {
  cron.schedule(CRON_EXPRESSION, async () => {
    try {
      const users = await userRepo.listWithStripe();
      const targets = users.filter(
        (u) => u.role !== 'admin' && isStale(u)
      );

      if (targets.length === 0) return;

      let changed = 0;

      for (const user of targets) {
        try {
          const result = await reconcileUser(user.id, { silent: true });
          if (result.changed) changed++;
          await userRepo.updateFields(user.id, {
            lastReconcileAt: new Date().toISOString()
          });
        } catch (err) {
          console.error(`[cron] ${user.id}: ${err.message}`);
        }
      }

      if (changed > 0) {
        console.log(`[cron] reconciled ${targets.length} users, ${changed} updated`);
      }
    } catch (err) {
      console.error('[cron] job failed:', err.message);
    }
  });
}

module.exports = { startReconcileJob };