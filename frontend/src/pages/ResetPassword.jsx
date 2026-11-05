import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { useAuth } from '../context/authcontext';
import { useToast } from '../context/toastcontext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  const toast = useToast();
  const email = location.state?.email;
  const code = location.state?.code;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);

  useEffect(() => {
    if (!email || !code) navigate('/forgot-password', { replace: true });
  }, [email, code, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    const result = await resetPassword(email, code, newPassword);
    setLoading(false);
    if (result.success) navigate('/login');
  };

  if (!email || !code) return null;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Set New Password</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose a strong password for <strong>{email}</strong>
        </Typography>
        <form onSubmit={submit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField label="New Password" type={showPw ? 'text' : 'password'} value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required fullWidth autoFocus helperText="Minimum 8 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(!showPw)} edge="end" size="small">
                      {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }} />
            <TextField label="Confirm New Password" type={showCPw ? 'text' : 'password'} value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCPw(!showCPw)} edge="end" size="small">
                      {showCPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }} />
            <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth sx={{ py: 1.3 }}>
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;