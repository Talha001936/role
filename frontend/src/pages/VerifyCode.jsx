import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography } from '@mui/material';
import { useAuth } from '../context/authcontext';

const CODE_TTL = 60;

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyCode, forgotPassword } = useAuth();
  const email = location.state?.email;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CODE_TTL);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (!email) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [email]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    const result = await verifyCode(email, code);
    setLoading(false);
    if (result.success) navigate('/reset-password', { state: { email, code } });
  };

  const resend = async () => {
    setResending(true);
    const result = await forgotPassword(email);
    setResending(false);
    if (result.success) {
      setSecondsLeft(CODE_TTL);
      setCode('');
    }
  };

  if (!email) return null;
  const expired = secondsLeft === 0;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420, borderRadius: 3,
          backgroundColor: 'rgba(23,26,33,0.7)', backdropFilter: 'blur(12px)'
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>Verify Code</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Enter the 6-digit code sent to
        </Typography>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 3 }}>{email}</Typography>

        <form onSubmit={submit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="6-Digit Code" value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required fullWidth autoFocus disabled={expired}
              inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: 22, letterSpacing: 6 } }}
            />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color={expired ? 'error.main' : 'text.secondary'} fontWeight={600}>
                {expired ? 'Code expired' : `Expires in ${formatTime(secondsLeft)}`}
              </Typography>
            </Box>
            <Button type="submit" variant="contained" size="large"
              disabled={loading || code.length !== 6 || expired} fullWidth sx={{ py: 1.3 }}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button type="button" variant="text" onClick={resend}
              disabled={!expired || resending} fullWidth>
              {resending ? 'Sending...' : 'Resend code'}
            </Button>
            <Button
              type="button"
              variant="text"
              onClick={() => navigate('/login')}
              fullWidth
            >
              Back to Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default VerifyCode;