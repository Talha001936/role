import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';
import { useAuth } from '../context/authcontext';

const buildDashboardPath = (user) => {
  if (!user) return '/login';
  const base = user.role === 'admin'
    ? 'admin'
    : user.role === 'manager' ? 'manager' : 'user';
  return `/${base}/${user.id}/dashboard`;
};

const CheckoutCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const type = searchParams.get('type') || 'checkout';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper sx={{ p: 5, maxWidth: 480, width: '100%', textAlign: 'center', borderRadius: 3 }}>
        <CancelIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Payment cancelled
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {type === 'signup'
            ? 'Your account is not yet activated. Complete the signup payment to access the system.'
            : 'No changes were made to your subscription.'}
        </Typography>

        <Stack spacing={1.5}>
          <Button variant="contained" onClick={() => navigate('/pricing')} fullWidth sx={{ py: 1.2 }}>
            Back to pricing
          </Button>
          {user && (
            <Button variant="text" onClick={() => navigate(buildDashboardPath(user))} fullWidth>
              Go to dashboard
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default CheckoutCancel;