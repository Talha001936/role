import { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, Button, Stack, TextField, MenuItem,
  LinearProgress, InputAdornment, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useAuth } from '../context/authcontext';
import { useUsers } from '../context/usercontext';
import UserTable from '../components/users/UserTable';
import UserForm from '../components/users/UserForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import BlockingTasksDialog from '../components/users/BlockingTasksDialog';

const Users = () => {
  const { user, can } = useAuth();
  const {
    users, fetchUsers, searchUsers,
    createUser, updateUserStatus, deleteUser, getBlockingTasks
  } = useUsers();

  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });
  const [confirmStatus, setConfirmStatus] = useState({ open: false, id: null, next: null, name: '' });
  const [blocking, setBlocking] = useState({ open: false, name: '', tasks: [] });

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [searching, setSearching] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const canCreate = can('user:create');
  const canStatus = can('user:status:update');
  const canDelete = can('user:delete');
  const canManage = canStatus || canDelete;

  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    (async () => { await fetchUsers(); setInitialLoaded(true); })();
  }, [fetchUsers]);

  const didSearchRef = useRef(false);
  useEffect(() => {
    if (!didSearchRef.current) { didSearchRef.current = true; return; }
    setSearching(true);
    const t = setTimeout(async () => {
      const hasFilters = query.trim() || statusFilter || roleFilter;
      if (hasFilters) await searchUsers(query.trim(), statusFilter, roleFilter);
      else await fetchUsers();
      setSearching(false);
    }, 350);
    return () => { clearTimeout(t); setSearching(false); };
  }, [query, statusFilter, roleFilter, searchUsers, fetchUsers]);

  const clearFilters = () => { setQuery(''); setStatusFilter(''); setRoleFilter(''); };
  const hasFilters = Boolean(query.trim() || statusFilter || roleFilter);

  
  const askStatusChange = async (id, next) => {
    const target = users.find((u) => u.id === id);

    if (next === 'deactivated') {
      const res = await getBlockingTasks(id);
      if (res.success && res.count > 0) {
        setBlocking({ open: true, name: target?.name || res.user?.name || '', tasks: res.tasks });
        return;
      }
    }
    setConfirmStatus({ open: true, id, next, name: target?.name || '' });
  };

  const applyStatusChange = async () => {
    const { id, next } = confirmStatus;
    setConfirmStatus({ open: false, id: null, next: null, name: '' });
    const result = await updateUserStatus(id, next);


    if (!result.success && result.blockingTasks?.length > 0) {
      const target = users.find((u) => u.id === id);
      setBlocking({ open: true, name: target?.name || '', tasks: result.blockingTasks });
    }
  };

  
  const askDelete = async (id) => {
    const target = users.find((u) => u.id === id);
    const res = await getBlockingTasks(id);
    if (res.success && res.count > 0) {
      setBlocking({ open: true, name: target?.name || res.user?.name || '', tasks: res.tasks });
      return;
    }
    setConfirmDelete({ open: true, id, name: target?.name || '' });
  };

  const applyDelete = async () => {
    const { id } = confirmDelete;
    setConfirmDelete({ open: false, id: null, name: '' });
    const result = await deleteUser(id);
    if (!result.success && result.blockingTasks?.length > 0) {
      const target = users.find((u) => u.id === id);
      setBlocking({ open: true, name: target?.name || '', tasks: result.blockingTasks });
    }
  };

  const handleCreate = async (data) => await createUser(data);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        {canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            New User
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField fullWidth size="small" placeholder="Search by name or email"
          value={query} onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searching ? (
              <InputAdornment position="end"><CircularProgress size={16} thickness={5} /></InputAdornment>
            ) : null
          }} />
        <TextField select size="small" label="Status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="deactivated">Deactivated</MenuItem>
        </TextField>
        <TextField select size="small" label="Role" value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="employee">Employee</MenuItem>
        </TextField>
        {hasFilters && (
          <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearFilters}
            sx={{ whiteSpace: 'nowrap' }}>
            Clear
          </Button>
        )}
      </Stack>

      <Box sx={{ position: 'relative', minHeight: 200 }}>
        {!initialLoaded ? (
          <Box sx={{ pt: 4 }}><LinearProgress /></Box>
        ) : (
          <UserTable
            users={users}
            currentUserId={user?.id}
            canStatus={canStatus}
            canDelete={canDelete}
            showActionsColumn={canManage}
            onStatusChange={askStatusChange}
            onDelete={askDelete}
          />
        )}
      </Box>

      <UserForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} />

      <ConfirmDialog
        open={confirmStatus.open}
        title={confirmStatus.next === 'active' ? 'Activate user?' : 'Deactivate user?'}
        message={
          confirmStatus.next === 'active'
            ? `Activate "${confirmStatus.name}"? They can log in and receive tasks again.`
            : `Deactivate "${confirmStatus.name}"? They will not be able to log in.`
        }
        confirmText={confirmStatus.next === 'active' ? 'Activate' : 'Deactivate'}
        confirmColor={confirmStatus.next === 'active' ? 'primary' : 'warning'}
        onCancel={() => setConfirmStatus({ open: false, id: null, next: null, name: '' })}
        onConfirm={applyStatusChange}
      />

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete user?"
        message={`Delete "${confirmDelete.name}"? Completed tasks will be kept for audit and flagged for reassignment.`}
        confirmText="Delete"
        onCancel={() => setConfirmDelete({ open: false, id: null, name: '' })}
        onConfirm={applyDelete}
      />

      <BlockingTasksDialog
        open={blocking.open}
        onClose={() => setBlocking({ open: false, name: '', tasks: [] })}
        userName={blocking.name}
        tasks={blocking.tasks}
      />
    </Box>
  );
};

export default Users;