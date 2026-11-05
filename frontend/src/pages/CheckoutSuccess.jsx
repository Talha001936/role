import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { useAuth } from '../context/authcontext';
import { useBilling } from '../context/billingcontext';

const MAX_ATTEMPTS = 25;
const POLL_INTERVAL_MS = 1500;
const AUTO_REDIRECT_DELAY_MS = 2500;

const buildDashboardPath = (user) => {
  if (!user) return '/login';
  const base =
    user.role === 'admin' ? 'admin' : user.role === 'manager' ? 'manager' : 'user';
  return `/${base}/${user.id}/dashboard`;
};

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, fetchMe } = useAuth();
  const { getPaymentStatus, syncMyPayment } = useBilling();

  const initialTypeRef = useRef(searchParams.get('type'));

  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Confirming your payment...');
  const [freshUser, setFreshUser] = useState(null);
  const [countdown, setCountdown] = useState(Math.ceil(AUTO_REDIRECT_DELAY_MS / 1000));

  const pollTimerRef = useRef(null);
  const redirectTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let stopped = false;
    let attempts = 0;

    const stop = () => {
      stopped = true;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };

    const finishSuccess = async (msg) => {
      stop();
      const u = await fetchMe();
      if (cancelled) return;
      setFreshUser(u);
      setStatus('success');
      setMessage(msg);
    };

    const tick = async () => {
      if (stopped || cancelled) return;
      attempts++;

      try {
        const res = await getPaymentStatus();
        if (cancelled || stopped) return;

        if (res.success && res.data.ready) {
          await finishSuccess('Payment confirmed. Welcome!');
          return;
        }

        if (attempts === 2 || attempts === 5 || attempts === 9 || attempts % 5 === 0) {
          await syncMyPayment();
          if (cancelled || stopped) return;

          const again = await getPaymentStatus();
          if (cancelled || stopped) return;

          if (again.success && again.data.ready) {
            await finishSuccess('Payment confirmed. Welcome!');
            return;
          }
        }
      } catch (err) {
        console.warn('[checkout] poll attempt failed:', err?.message);
      }

      if (attempts >= MAX_ATTEMPTS) {
        stop();
        if (cancelled) return;
        setStatus('error');
        setMessage('Payment is still processing. Please refresh this page in a moment.');
        return;
      }

      pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    };

    const type = initialTypeRef.current;

    if (type === 'portal') {
      (async () => {
        const u = await fetchMe();
        if (cancelled) return;
        setFreshUser(u);
        setStatus('success');
        setMessage('Billing settings updated.');
      })();
    } else {
      tick();
    }

    return () => {
      cancelled = true;
      stop();
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [getPaymentStatus, syncMyPayment, fetchMe]);

  useEffect(() => {
    if (status !== 'success') return;

    setCountdown(Math.ceil(AUTO_REDIRECT_DELAY_MS / 1000));

    countdownTimerRef.current = setInterval(() => {
      setCountdown((c) => (c > 1 ? c - 1 : 0));
    }, 1000);

    redirectTimerRef.current = setTimeout(() => {
      navigate(buildDashboardPath(freshUser || user), { replace: true });
    }, AUTO_REDIRECT_DELAY_MS);

    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [status, freshUser, user, navigate]);

  const goNow = () => {
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    navigate(buildDashboardPath(freshUser || user), { replace: true });
  };

  const targetPath = buildDashboardPath(freshUser || user);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper sx={{ p: 5, maxWidth: 480, width: '100%', textAlign: 'center', borderRadius: 3 }}>
        {status === 'verifying' && (
          <>
            <CircularProgress sx={{ mb: 3 }} />
            <Typography variant="h6" fontWeight={600}>
              {message}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait, this only takes a moment.
            </Typography>
            <Button
              variant="text"
              size="small"
              sx={{ mt: 3 }}
              onClick={() => navigate(targetPath)}
            >
              Skip and go to dashboard
            </Button>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Payment successful
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              Redirecting to your dashboard in {countdown}s…
            </Typography>
            <Button variant="contained" onClick={goNow} fullWidth sx={{ py: 1.2 }}>
              Go to dashboard now
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
              {message}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/pricing')}
              fullWidth
              sx={{ mb: 1.5 }}
            >
              Back to pricing
            </Button>
            <Button variant="text" onClick={() => navigate(targetPath)} fullWidth>
              Go to dashboard
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CheckoutSuccess;