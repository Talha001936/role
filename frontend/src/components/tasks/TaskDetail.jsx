import {
  Dialog, DialogTitle, DialogContent, DialogActions,
<<<<<<< HEAD
  Button, Typography, Box, Chip, Divider, Stack
} from '@mui/material';
import TaskComments from './TaskComments';
=======
  Button, Typography, Box, Chip, Divider
} from '@mui/material';
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

const statusColors = { pending: 'warning', 'in-progress': 'info', completed: 'success' };

const TaskDetail = ({ open, onClose, task, employees = [] }) => {
  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Title</Typography>
            <Typography variant="body1">{task.title}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary">Description</Typography>
<<<<<<< HEAD
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {task.description || 'No description'}
            </Typography>
=======
            <Typography variant="body1">{task.description || 'No description'}</Typography>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
          </Box>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary">Assigned To</Typography>
            <Typography variant="body1">
              {task.assignedToName
<<<<<<< HEAD
                || employees.find((e) => e.id === task.assignedTo)?.name
=======
                || employees.find(e => e.id === task.assignedTo)?.name
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
                || 'Unknown'}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={task.status} color={statusColors[task.status]} size="small" />
            </Box>
          </Box>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary">Due Date</Typography>
            <Typography variant="body1">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary">Created</Typography>
<<<<<<< HEAD
            <Typography variant="body1">
              {new Date(task.createdAt).toLocaleString()}
            </Typography>
          </Box>

          <Divider />
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Comments ({(task.comments || []).length})
              </Typography>
            </Stack>
            <TaskComments comments={task.comments || []} />
=======
            <Typography variant="body1">{new Date(task.createdAt).toLocaleString()}</Typography>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetail;