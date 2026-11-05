import {
  Dialog, DialogTitle, DialogContent, DialogActions,
<<<<<<< HEAD
  Button, Typography, Box, Chip, Stack, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
=======
  Button, Typography, Box, Chip, Divider, Stack, Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
import { useAuth } from '../../context/authcontext';

const statusColors = { pending: 'warning', 'in-progress': 'info', completed: 'success' };

const BlockingTasksDialog = ({ open, onClose, userName, tasks = [] }) => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { user } = useAuth();

  const goToTasks = () => {
    const base = user?.role === 'admin'
      ? 'admin'
      : user?.role === 'manager' ? 'manager' : 'user';
=======
  const params = useParams();
  const { user } = useAuth();

  const goToTasks = () => {
    const base = user?.role === 'admin' ? 'admin' : user?.role === 'manager' ? 'manager' : 'user';
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    navigate(`/${base}/${user.id}/tasks`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cannot complete this action</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>{userName}</strong> has {tasks.length} active task{tasks.length === 1 ? '' : 's'}.
          Reassign or complete them first.
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
<<<<<<< HEAD
          Blocking tasks:
=======
          blocking tasks:
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 260, overflowY: 'auto' }}>
          {tasks.map((t) => (
            <Box key={t.id} sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.08)' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography variant="body2" fontWeight={600} sx={{ flexGrow: 1 }}>
                  {t.title}
                </Typography>
                <Chip size="small" label={t.status} color={statusColors[t.status] || 'default'} />
              </Stack>
              {t.dueDate && (
                <Typography variant="caption" color="text.secondary">
                  Due: {new Date(t.dueDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={goToTasks}>
          Go to Tasks
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockingTasksDialog;