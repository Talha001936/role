import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, IconButton, Tooltip, TextField, MenuItem, Stack
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';

const statusColors = { pending: 'warning', 'in-progress': 'info', completed: 'success' };

const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'completed') return false;
  const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
};

const TaskTable = ({
  tasks,
  employees = [],
  currentUserId,
  canUpdate,
  canDelete,
  canUpdateStatusOwn,
  canUpdateStatusAny,
  onEdit,
  onDelete,
  onView,
  onStatusChange
}) => (
  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Assigned To</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
              No tasks found
            </TableCell>
          </TableRow>
        ) : (
          tasks.map((task) => {
            const isFinal = task.status === 'completed';
            const overdue = isOverdue(task);
            const locked = isFinal || overdue;
            const isMine = String(task.assignedTo) === String(currentUserId);

            const canChangeStatus = canUpdateStatusAny || (canUpdateStatusOwn && isMine);
            const ownTaskAsManager = isMine && !canUpdateStatusAny;
            const canEditThis = canUpdate && !locked && !ownTaskAsManager;
            const canDeleteThis = canDelete && !locked && !ownTaskAsManager;

            const assigneeName =
              task.assignedToName
              || employees.find((e) => String(e.id) === String(task.assignedTo))?.name
              || 'Unknown';

            return (
              <TableRow key={task.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>{task.title}</span>
                    {task.requiresReassignment && (
                      <Tooltip title="Assignee was deactivated/deleted. Reassign this task.">
                        <Chip
                          size="small"
                          color="warning"
                          variant="outlined"
                          icon={<WarningIcon fontSize="small" />}
                          label="Needs reassignment"
                        />
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <span>{assigneeName}</span>
                    {task.requiresReassignment && (
                      <Tooltip title="Current assignee is no longer active">
                        <WarningIcon fontSize="small" sx={{ color: 'warning.main' }} />
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  {canChangeStatus && !isFinal ? (
                    <TextField
                      select size="small" value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                      variant="outlined"
                      sx={{
                        minWidth: 150,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: 'rgba(255,255,255,0.03)'
                        }
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              backgroundColor: '#171a21',
                              border: '1px solid rgba(255,255,255,0.08)',
                              '& .MuiMenuItem-root': {
                                color: '#e6e8ef',
                                '&:hover': { backgroundColor: 'rgba(124,140,248,0.15)' },
                                '&.Mui-selected': {
                                  backgroundColor: 'rgba(124,140,248,0.25)',
                                  '&:hover': { backgroundColor: 'rgba(124,140,248,0.35)' }
                                }
                              }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </TextField>
                  ) : (
                    <Chip label={task.status} color={statusColors[task.status]} size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton size="small" onClick={() => onView(task)}>
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {canEditThis && (
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => onEdit(task)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {canDeleteThis && (
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => onDelete(task.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default TaskTable;