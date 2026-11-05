<<<<<<< HEAD
// // config/db.js
// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const path = require('path');

// const adapter = new FileSync(path.join(__dirname, '../data/db.json'));
// const db = low(adapter);

// db.defaults({
//   users: [],
//   tasks: [],
//   payments: [],
//   webhookEvents: [],
//   resetCodes: []
// }).write();
// let migrated = false;
// db.get('users').value().forEach((u) => {
//   if (typeof u.tokenVersion !== 'number') {
//     db.get('users').find({ id: u.id }).assign({ tokenVersion: 0 }).write();
//     migrated = true;
//   }
// });
// if (migrated) console.log('db migration: initialized tokenVersion on existing users');

// module.exports = db;


// config/db.js
const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      }
);

pool.on('error', (err) => {
  console.error('[pg] unexpected idle client error:', err.message);
});

const query = (text, params) => pool.query(text, params);

const withTransaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = { pool, query, withTransaction };
=======
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, '../data/db.json'));
const db = low(adapter);
db.defaults({ users: [], tasks: [], resetCodes: [] }).write();
let migrated = false;
db.get('users').value().forEach((u) => {
  if (typeof u.tokenVersion !== 'number') {
    db.get('users').find({ id: u.id }).assign({ tokenVersion: 0 }).write();
    migrated = true;
  }
});
if (migrated) console.log('db migration: initialized tokenVersion on existing users');

module.exports = db; 
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
