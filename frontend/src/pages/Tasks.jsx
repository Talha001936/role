import { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, Button, TextField, MenuItem, Stack,
  LinearProgress, InputAdornment, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useAuth } from '../context/authcontext';
import { useTasks } from '../context/taskcontext';
import TaskTable from '../components/tasks/TaskTable';
import TaskForm from '../components/tasks/TaskForm';
import TaskDetail from '../components/tasks/TaskDetail';
<<<<<<< HEAD
import StatusCommentDialog from '../components/tasks/StatusCommentDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import UpgradeBanner from '../components/billing/UpgradeBanner';

const Tasks = () => {
  const { user, can, canPlan } = useAuth();
=======
import ConfirmDialog from '../components/common/ConfirmDialog';

const Tasks = () => {
  const { user, can } = useAuth();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  const {
    tasks, assignableEmployees,
    fetchTasks, fetchAssignableEmployees, searchTasks,
    createTask, updateTask, updateTaskStatus, deleteTask
  } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, title: '' });
<<<<<<< HEAD

  const [statusDialog, setStatusDialog] = useState({
    open: false, id: null, next: null, title: '',
    currentStatus: '', requiresComment: false
  });
=======
  const [confirmStatus, setConfirmStatus] = useState({ open: false, id: null, next: null, title: '' });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [searching, setSearching] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

<<<<<<< HEAD
  const canCreate = can('task:create') && canPlan('task:create');
  const canUpdate = can('task:update') && canPlan('full');
  const canDelete = can('task:delete') && canPlan('full');
  const canViewAll = can('task:view:all') && canPlan('task:view:all');
  const canUpdateStatusOwn = can('task:status:update:own');
  const canUpdateStatusAny = can('task:status:update:any') && canPlan('task:status:update:any');
  const canSearch =
    can('task:search:own') ||
    (can('task:search:all') && canPlan('task:search:all')) ||
    (canViewAll);
  const canComment = can('task:comment') && canPlan('full');
=======
  const canCreate = can('task:create');
  const canUpdate = can('task:update');
  const canDelete = can('task:delete');
  const canViewAll = can('task:view:all');
  const canUpdateStatusOwn = can('task:status:update:own');
  const canUpdateStatusAny = can('task:status:update:any');
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    (async () => {
      await fetchTasks();
      if (canCreate || canViewAll) await fetchAssignableEmployees();
      setInitialLoaded(true);
    })();
  }, [fetchTasks, fetchAssignableEmployees, canCreate, canViewAll]);

  const didSearchRef = useRef(false);
  useEffect(() => {
    if (!didSearchRef.current) { didSearchRef.current = true; return; }
<<<<<<< HEAD
    if (!canSearch) return;
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    setSearching(true);
    const t = setTimeout(async () => {
      const hasFilters = query.trim() || statusFilter || assigneeFilter;
      if (hasFilters) await searchTasks(query.trim(), statusFilter, assigneeFilter);
      else await fetchTasks();
      setSearching(false);
    }, 350);
    return () => { clearTimeout(t); setSearching(false); };
<<<<<<< HEAD
  }, [query, statusFilter, assigneeFilter, searchTasks, fetchTasks, canSearch]);

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('');
    setAssigneeFilter('');
  };
=======
  }, [query, statusFilter, assigneeFilter, searchTasks, fetchTasks]);

  const clearFilters = () => { setQuery(''); setStatusFilter(''); setAssigneeFilter(''); };
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  const hasFilters = Boolean(query.trim() || statusFilter || assigneeFilter);

  const handleSubmit = async (payload) => {
    if (selectedTask) return await updateTask(selectedTask.id, payload);
    return await createTask(payload);
  };

  const askDelete = (id) => {
    const t = tasks.find((x) => x.id === id);
    setConfirmDelete({ open: true, id, title: t?.title || '' });
  };
  const applyDelete = async () => {
    const { id } = confirmDelete;
    setConfirmDelete({ open: false, id: null, title: '' });
    await deleteTask(id);
  };

  const askStatusChange = (id, next) => {
    const t = tasks.find((x) => x.id === id);
<<<<<<< HEAD
    setStatusDialog({
      open: true, id, next,
      title: t?.title || '',
      currentStatus: t?.status || '',
      requiresComment: false
    });
  };

  const applyStatusChange = async (comment) => {
    const { id, next } = statusDialog;
    setStatusDialog((s) => ({ ...s, open: false }));
    await updateTaskStatus(id, next, comment);
  };

  const showUpgradeBanner =
    user?.role !== 'admin' && (!canCreate || !canSearch || !canUpdate);

=======
    setConfirmStatus({ open: true, id, next, title: t?.title || '' });
  };
  const applyStatusChange = async () => {
    const { id, next } = confirmStatus;
    setConfirmStatus({ open: false, id: null, next: null, title: '' });
    await updateTaskStatus(id, next);
  };

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
<<<<<<< HEAD
        <Stack direction="row" spacing={1}>
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={async () => {
                await fetchAssignableEmployees();
                setSelectedTask(null);
                setFormOpen(true);
              }}
            >
              New Task
            </Button>
          )}
        </Stack>
      </Stack>

      {showUpgradeBanner && <UpgradeBanner compact />}

      {canSearch && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth size="small"
            placeholder="Search by title, description, or assignee"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searching ? (
                <InputAdornment position="end"><CircularProgress size={16} thickness={5} /></InputAdornment>
              ) : null
            }}
          />
          <TextField select size="small" label="Status" value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>

          {canViewAll && (
            <TextField select size="small" label="Assignee" value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)} sx={{ minWidth: 180 }}>
              <MenuItem value="">All Assignees</MenuItem>
              {assignableEmployees.map((e) => (
                <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
              ))}
            </TextField>
          )}

          {hasFilters && (
            <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearFilters}
              sx={{ whiteSpace: 'nowrap' }}>
              Clear
            </Button>
          )}
        </Stack>
      )}
=======
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={async () => {
              await fetchAssignableEmployees();
              setSelectedTask(null);
              setFormOpen(true);
            }}
          >
            New Task
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField fullWidth size="small" placeholder="Search by title, description, or assignee"
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
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>

        {canViewAll && (
          <TextField select size="small" label="Assignee" value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="">All Assignees</MenuItem>
            {assignableEmployees.map((e) => (
              <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
            ))}
          </TextField>
        )}

        {hasFilters && (
          <Button variant="outlined" startIcon={<ClearIcon />}
            onClick={clearFilters} sx={{ whiteSpace: 'nowrap' }}>
            Clear
          </Button>
        )}
      </Stack>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

      <Box sx={{ position: 'relative', minHeight: 200 }}>
        {!initialLoaded ? (
          <Box sx={{ pt: 4 }}><LinearProgress /></Box>
        ) : (
          <TaskTable
            tasks={tasks}
            currentUserId={user?.id}
            canUpdate={canUpdate}
            canDelete={canDelete}
            canUpdateStatusOwn={canUpdateStatusOwn}
            canUpdateStatusAny={canUpdateStatusAny}
            employees={assignableEmployees}
            onEdit={async (t) => {
              if (canCreate) await fetchAssignableEmployees();
              setSelectedTask(t);
              setFormOpen(true);
            }}
            onDelete={askDelete}
            onView={(t) => { setSelectedTask(t); setDetailsOpen(true); }}
            onStatusChange={askStatusChange}
          />
        )}
      </Box>

      <TaskForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setSelectedTask(null); }}
        onSubmit={handleSubmit}
        task={selectedTask}
        employees={assignableEmployees}
      />

      <TaskDetail
        open={detailsOpen}
        onClose={() => { setDetailsOpen(false); setSelectedTask(null); }}
        task={selectedTask}
        employees={assignableEmployees}
      />

<<<<<<< HEAD
      <StatusCommentDialog
        open={statusDialog.open}
        onClose={() => setStatusDialog((s) => ({ ...s, open: false }))}
        onConfirm={applyStatusChange}
        taskTitle={statusDialog.title}
        currentStatus={statusDialog.currentStatus}
        nextStatus={statusDialog.next}
        requireComment={statusDialog.requiresComment}
      />

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete task?"
        message={`Delete "${confirmDelete.title}"? This cannot be undone.`}
        confirmText="Delete"
        onCancel={() => setConfirmDelete({ open: false, id: null, title: '' })}
        onConfirm={applyDelete}
      />
=======
      <ConfirmDialog open={confirmDelete.open} title="Delete task?"
        message={`Delete "${confirmDelete.title}"? This cannot be undone.`}
        confirmText="Delete"
        onCancel={() => setConfirmDelete({ open: false, id: null, title: '' })}
        onConfirm={applyDelete} />

      <ConfirmDialog open={confirmStatus.open} title="Change status?"
        message={`Change status of "${confirmStatus.title}" to "${confirmStatus.next}"?`}
        confirmText="Change" confirmColor="primary"
        onCancel={() => setConfirmStatus({ open: false, id: null, next: null, title: '' })}
        onConfirm={applyStatusChange} />
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    </Box>
  );
};

export default Tasks;