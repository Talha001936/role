import { Paper, Stack, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authcontext';

const UpgradeBanner = ({ requiredFeature, compact = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.role === 'admin') return null;
  if (user.plan === 'pro') return null;

  const isManager = user.role === 'manager';
  const isSignup = user.plan === 'signup';
  const isLite = user.plan === 'lite';

  const target =
    isManager && isSignup ? 'Lite or Pro'
    : 'Pro';

  const message = requiredFeature
    ? `Upgrade to ${target} to use this feature.`
    : isSignup
      ? `Unlock more with ${isManager ? 'Lite or Pro' : 'Pro'}.`
      : 'Unlock the full toolkit with Pro.';

  return (
    <Paper sx={{ p: compact ? 1.5 : 2, mb: 3, borderRadius: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="body2" fontWeight={600}>Upgrade to {target}</Typography>
          {!compact && (
            <Typography variant="caption" color="text.secondary">{message}</Typography>
          )}
        </Box>
        <Button variant="outlined" size={compact ? 'small' : 'medium'} onClick={() => navigate('/pricing')}>
          View plans
        </Button>
      </Stack>
    </Paper>
  );
};

export default UpgradeBanner;