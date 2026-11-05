const rolesData = require('../data/roles.json');

const getPermissions = (role) => rolesData.roles[role] || [];

const hasPermission = (user, permission) => {
  if (!user) return false;
  return getPermissions(user.role).includes(permission);
};

const hasAnyPermission = (user, permissions) =>
  permissions.some((p) => hasPermission(user, p));

const MAX_ACTIVE_TASKS = 3;
const assignableRolesFor = (requesterRole) => {
  if (requesterRole === 'admin') return ['employee', 'manager'];
  if (requesterRole === 'manager') return ['employee'];
  return [];
};

const isEligibleAssignee = (targetUser, tasks, requester) => {
  if (!targetUser || !requester) return false;
  if (targetUser.id === requester.id) return false;              
  if (targetUser.status !== 'active') return false;              
  if (!assignableRolesFor(requester.role).includes(targetUser.role)) return false; 

  const activeCount = tasks.filter(
    (t) => t.assignedTo === targetUser.id &&
           (t.status === 'pending' || t.status === 'in-progress')
  ).length;

  return activeCount < MAX_ACTIVE_TASKS;                    
};

module.exports = {
  getPermissions, hasPermission, hasAnyPermission,
  isEligibleAssignee, assignableRolesFor, MAX_ACTIVE_TASKS
};