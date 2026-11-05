import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Paper, Typography, Button, Stack, Chip, Divider,
  Grid, CircularProgress
} from '@mui/material';
import { CheckCircle as CheckIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAuth } from '../context/authcontext';
import { useBilling } from '../context/billingcontext';

const formatMoney = (cents, currency = 'usd') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0
  }).format(cents / 100);

const FeatureRow = ({ included = true, children }) => (
  <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ py: 0.5 }}>
    {included
      ? <CheckIcon fontSize="small" sx={{ color: 'success.main', mt: 0.4 }} />
      : <CancelIcon fontSize="small" sx={{ color: 'text.disabled', mt: 0.4 }} />}
    <Typography variant="body2" sx={{ color: included ? 'text.primary' : 'text.disabled' }}>
      {children}
    </Typography>
  </Stack>
);

const buildDashboardPath = (user) => {
  if (!user) return '/login';
  const base = user.role === 'admin'
    ? 'admin'
    : user.role === 'manager' ? 'manager' : 'user';
  return `/${base}/${user.id}/dashboard`;
};

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, fetchMe } = useAuth();
  const { catalog, fetchCatalog, startSignupCheckout, startSubscriptionCheckout, loading } = useBilling();
  const [fetching, setFetching] = useState(true);
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    (async () => { await fetchCatalog(); setFetching(false); })();
  }, [fetchCatalog]);

  useEffect(() => {
    if (searchParams.get('refresh') === '1') fetchMe();
  }, [searchParams, fetchMe]);

  const role = user?.role || searchParams.get('role');
  const signupPaid = user?.signupPaid;

  const handleSignup = async () => {
    setSignupLoading(true);
    await startSignupCheckout();
    setSignupLoading(false);
  };

  const handleSubscribe = async (plan) => {
    await startSubscriptionCheckout(plan);
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else if (user) navigate(buildDashboardPath(user));
    else navigate('/login');
  };

  const goDashboard = () => {
    if (user) navigate(buildDashboardPath(user));
    else navigate('/login');
  };

  if (fetching || !catalog) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  }

  // ── Signup payment gate ────────────────────────────────────────
  if (!signupPaid && role !== 'admin') {
    const signupPrice = formatMoney(catalog.signup[role]?.amount || 0);
    return (
      <Box sx={{ maxWidth: 640, mx: 'auto', py: 6, px: 2 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Activate your account</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          One-time signup fee for the <strong>{role}</strong> account.
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={700}>Signup fee</Typography>
              <Typography variant="body2" color="text.secondary">One-time · lifetime base access</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800}>{signupPrice}</Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" size="large" fullWidth sx={{ py: 1.5 }}
            onClick={handleSignup} disabled={signupLoading || loading}>
            {signupLoading || loading ? 'Redirecting to Stripe...' : `Pay ${signupPrice}`}
          </Button>
        </Paper>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button variant="text" onClick={goBack}>Go back</Button>
        </Stack>
      </Box>
    );
  }

  const currentPlan = user?.plan;
  const liteAmount = catalog.manager?.lite?.amount || 0;
  const proAmount = catalog[role]?.pro?.amount || 0;
  const isManager = role === 'manager';

  return (
    <Box sx={{ maxWidth: isManager ? 1100 : 720, mx: 'auto', py: 6, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Plans</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {isManager
          ? 'Choose Lite for team tasks, or Pro for the full manager toolkit.'
          : 'Upgrade to Pro to unlock all features for your role.'}
      </Typography>

      <Grid container spacing={3}>
        {/* Signup (included) */}
        <Grid item xs={12} md={isManager ? 4 : 6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Typography variant="h6" fontWeight={700}>Signup</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Base access</Typography>
            <Divider sx={{ my: 2 }} />
            <FeatureRow>Dashboard</FeatureRow>
            <FeatureRow>Profile settings</FeatureRow>
            <FeatureRow>View own tasks</FeatureRow>
            <FeatureRow>Update own task status</FeatureRow>
            {isManager && (
              <>
                <FeatureRow included={false}>Create tasks</FeatureRow>
                <FeatureRow included={false}>View all tasks</FeatureRow>
                <FeatureRow included={false}>view users</FeatureRow>
              </>
            )}
            <Button variant="outlined" fullWidth sx={{ mt: 3 }} disabled>
              {currentPlan === 'signup' ? 'Current plan' : 'Included'}
            </Button>
          </Paper>
        </Grid>

        {/* Lite — managers only */}
        {isManager && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="h6" fontWeight={700}>Lite</Typography>
              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
                <Typography variant="h4" fontWeight={800}>{formatMoney(liteAmount)}</Typography>
                <Typography variant="body2" color="text.secondary">/ month</Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <FeatureRow>Everything in Signup</FeatureRow>
              <FeatureRow>Create tasks</FeatureRow>
              <FeatureRow>View & search all tasks</FeatureRow>
              <FeatureRow included={false}>Edit / delete tasks</FeatureRow>
              <FeatureRow included={false}>view users</FeatureRow>
              <Button
                variant={currentPlan === 'lite' ? 'outlined' : 'contained'}
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => handleSubscribe('lite')}
                disabled={currentPlan === 'lite' || loading}
              >
                {currentPlan === 'lite' ? 'Current plan' : 'Upgrade to Lite'}
              </Button>
            </Paper>
          </Grid>
        )}

        {/* Pro */}
        <Grid item xs={12} md={isManager ? 4 : 6}>
          <Paper
            sx={{
              p: 3, borderRadius: 2, height: '100%',
              border: '2px solid', borderColor: 'primary.main',
              position: 'relative'
            }}
          >
            <Chip label="Recommended" color="primary" size="small"
              sx={{ position: 'absolute', top: -12, right: 16 }} />
            <Typography variant="h6" fontWeight={700}>Pro</Typography>
            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
              <Typography variant="h4" fontWeight={800}>{formatMoney(proAmount)}</Typography>
              <Typography variant="body2" color="text.secondary">/ month</Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <FeatureRow>Everything in {isManager ? 'Lite' : 'Signup'}</FeatureRow>
            <FeatureRow>Edit / delete tasks</FeatureRow>
            <FeatureRow>Comments viewing</FeatureRow>
            {isManager && <FeatureRow>view users</FeatureRow>}
            <Button
              variant={currentPlan === 'pro' ? 'outlined' : 'contained'}
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => handleSubscribe('pro')}
              disabled={currentPlan === 'pro' || loading}
            >
              {currentPlan === 'pro' ? 'Current plan' : 'Upgrade to Pro'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="text" onClick={goBack}>Go back</Button>
        {user && <Button variant="text" onClick={goDashboard}>Go to dashboard</Button>}
      </Stack>
    </Box>
  );
};

export default Pricing;