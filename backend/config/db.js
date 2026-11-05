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