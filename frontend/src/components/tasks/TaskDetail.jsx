import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, Divider
} from '@mui/material';

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
            <Typography variant="body1">{task.description || 'No description'}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary">Assigned To</Typography>
            <Typography variant="body1">
              {task.assignedToName
                || employees.find(e => e.id === task.assignedTo)?.name
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
            <Typography variant="body1">{new Date(task.createdAt).toLocaleString()}</Typography>
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