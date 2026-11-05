<<<<<<< HEAD
// utils/permissions.js
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
const rolesData = require('../data/roles.json');

const getPermissions = (role) => rolesData.roles[role] || [];

const hasPermission = (user, permission) => {
  if (!user) return false;
  return getPermissions(user.role).includes(permission);
};

const hasAnyPermission = (user, permissions) =>
  permissions.some((p) => hasPermission(user, p));

const MAX_ACTIVE_TASKS = 3;
<<<<<<< HEAD

=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
const assignableRolesFor = (requesterRole) => {
  if (requesterRole === 'admin') return ['employee', 'manager'];
  if (requesterRole === 'manager') return ['employee'];
  return [];
};

<<<<<<< HEAD
// Pure synchronous check using a pre-computed active task count.
const isEligibleAssignee = (targetUser, activeTaskCount, requester) => {
  if (!targetUser || !requester) return false;
  if (targetUser.id === requester.id) return false;
  if (targetUser.status !== 'active') return false;
  if (!assignableRolesFor(requester.role).includes(targetUser.role)) return false;
  return (activeTaskCount || 0) < MAX_ACTIVE_TASKS;
};

module.exports = {
  getPermissions,
  hasPermission,
  hasAnyPermission,
  isEligibleAssignee,
  assignableRolesFor,
  MAX_ACTIVE_TASKS
=======
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
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
};