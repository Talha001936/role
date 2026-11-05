
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import {
  Home as HomeIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../context/authcontext';

const MESSAGES = {
  role: 'Your role does not allow access to this section.',
  permission: 'You do not have the required permission for this action.',
  scope: 'This page belongs to a different user. You cannot view it.',
  default: "You don't have permission to view this page."
};

const Unauthorized = ({ reason = 'default' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleRelogin = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleBackToDashboard = () => {
    if (!user) return navigate('/login', { replace: true });
    const base = user.role === 'admin' ? 'admin' : user.role === 'manager' ? 'manager' : 'user';
    navigate(`/${base}/${user.id}/dashboard`, { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper sx={{ p: 5, maxWidth: 480, width: '100%', textAlign: 'center', borderRadius: 3 }}>
        <Box
          sx={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            p: 2, borderRadius: '50%', backgroundColor: 'rgba(248,113,113,0.15)',
            color: 'error.main', mb: 3
          }}
        >
          <LockIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>Access denied</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {MESSAGES[reason] || MESSAGES.default}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          
          <Button variant="contained" startIcon={<LoginIcon />} onClick={handleRelogin}>
            Log in again
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Unauthorized;