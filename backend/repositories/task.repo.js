// repositories/task.repo.js
const { query } = require('../config/db');

const mapRow = (r) => {
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    assignedTo: r.assigned_to,
    assignedToName: r.assigned_to_name,
    assignedBy: r.assigned_by,
    assignedByName: r.assigned_by_name,
    status: r.status,
    dueDate: r.due_date,
    requiresReassignment: r.requires_reassignment,
    comments: Array.isArray(r.comments) ? r.comments : [],
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
};

const listAll = async () => {
  const { rows } = await query('SELECT * FROM tasks ORDER BY created_at DESC');
  return rows.map(mapRow);
};

const listByAssignee = async (userId) => {
  const { rows } = await query(
    'SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows.map(mapRow);
};

const findById = async (id) => {
  const { rows } = await query('SELECT * FROM tasks WHERE id = $1', [id]);
  return mapRow(rows[0]);
};

const countActiveFor = async (userId) => {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS c FROM tasks
     WHERE assigned_to = $1 AND status IN ('pending','in-progress')`,
    [userId]
  );
  return rows[0].c;
};

const countActiveByUserIds = async (userIds) => {
  if (!userIds.length) return {};
  const { rows } = await query(
    `SELECT assigned_to, COUNT(*)::int AS c FROM tasks
     WHERE assigned_to = ANY($1::text[])
       AND status IN ('pending','in-progress')
     GROUP BY assigned_to`,
    [userIds]
  );
  const map = {};
  for (const r of rows) map[r.assigned_to] = r.c;
  return map;
};

const create = async (t) => {
  await query(
    `INSERT INTO tasks
     (id, title, description, assigned_to, assigned_to_name,
      assigned_by, assigned_by_name, status, due_date,
      comments, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      t.id,
      t.title,
      t.description || '',
      t.assignedTo || null,
      t.assignedToName || null,
      t.assignedBy || null,
      t.assignedByName || null,
      t.status || 'pending',
      t.dueDate ? new Date(t.dueDate) : null,
      JSON.stringify(t.comments || []),
      t.createdAt ? new Date(t.createdAt) : new Date(),
      t.updatedAt ? new Date(t.updatedAt) : new Date()
    ]
  );
  return findById(t.id);
};

const updateFields = async (id, fields) => {
  const colMap = {
    title: 'title',
    description: 'description',
    assignedTo: 'assigned_to',
    assignedToName: 'assigned_to_name',
    assignedBy: 'assigned_by',
    assignedByName: 'assigned_by_name',
    status: 'status',
    dueDate: 'due_date',
    requiresReassignment: 'requires_reassignment',
    comments: 'comments'
  };
  const cols = [];
  const vals = [];
  let i = 1;
  for (const [k, v] of Object.entries(fields)) {
    if (!colMap[k]) continue;
    cols.push(`${colMap[k]} = $${i++}`);
    if (k === 'comments') vals.push(JSON.stringify(v));
    else if (k === 'dueDate' && v) vals.push(new Date(v));
    else vals.push(v);
  }
  if (!cols.length) return findById(id);
  cols.push(`updated_at = $${i++}`);
  vals.push(new Date());
  vals.push(id);
  await query(`UPDATE tasks SET ${cols.join(', ')} WHERE id = $${i}`, vals);
  return findById(id);
};

const remove = async (id) => {
  await query('DELETE FROM tasks WHERE id = $1', [id]);
};

const flagForReassignmentByUser = async (userId) => {
  await query(
    `UPDATE tasks SET requires_reassignment = TRUE
     WHERE assigned_to = $1 AND status IN ('pending','in-progress')`,
    [userId]
  );
};

const clearReassignmentFlag = async (userId) => {
  await query(
    `UPDATE tasks SET requires_reassignment = FALSE
     WHERE assigned_to = $1`,
    [userId]
  );
};

const search = async ({ q, status, assignedTo, from, to, restrictToUser }) => {
  const where = [];
  const params = [];
  let i = 1;
  if (restrictToUser) {
    where.push(`assigned_to = $${i++}`);
    params.push(restrictToUser);
  }
  if (q) {
    where.push(
      `(title ILIKE $${i} OR description ILIKE $${i} OR assigned_to_name ILIKE $${i})`
    );
    params.push(`%${q}%`);
    i++;
  }
  if (status) {
    where.push(`status = $${i++}`);
    params.push(status);
  }
  if (assignedTo) {
    where.push(`assigned_to = $${i++}`);
    params.push(assignedTo);
  }
  if (from) {
    where.push(`due_date >= $${i++}`);
    params.push(from);
  }
  if (to) {
    where.push(`due_date <= $${i++}`);
    params.push(to);
  }
  const sql = `SELECT * FROM tasks
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY created_at DESC`;
  const { rows } = await query(sql, params);
  return rows.map(mapRow);
};

module.exports = {
  listAll,
  listByAssignee,
  findById,
  countActiveFor,
  countActiveByUserIds,
  create,
  updateFields,
  remove,
  flagForReassignmentByUser,
  clearReassignmentFlag,
  search,
  mapRow
};