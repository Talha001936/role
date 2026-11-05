import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Link } from '@mui/material';
import { useAuth } from '../context/authcontext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const result = await forgotPassword(email.trim());
    setLoading(false);
    if (result.success) navigate('/verify-code', { state: { email: email.trim() } });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420, borderRadius: 3,
          backgroundColor: 'rgba(23,26,33,0.7)', backdropFilter: 'blur(12px)'
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>Forgot Password</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your registered email and we'll send you a 6-digit code.
        </Typography>
        <form onSubmit={submit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Registered Email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required fullWidth autoFocus
            />
            <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth sx={{ py: 1.3 }}>
              {loading ? 'Sending...' : 'Send Code'}
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

export default ForgotPassword;