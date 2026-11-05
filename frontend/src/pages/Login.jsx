import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Link, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/authcontext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const result = await login(form.email.trim(), form.password);
    setLoading(false);

    if (result.success) {
<<<<<<< HEAD
      if (result.requiresPayment) {
        navigate('/pricing', { replace: true });
        return;
      }
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      const u = result.user;
      const base = u.role === 'admin' ? 'admin' : u.role === 'manager' ? 'manager' : 'user';
      navigate(`/${base}/${u.id}/dashboard`, { replace: true });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
<<<<<<< HEAD
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
=======
      <Paper elevation={0} sx={{
        p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 420, borderRadius: 3,
        backgroundColor: 'rgba(23,26,33,0.7)', backdropFilter: 'blur(12px)'
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{
            fontWeight: 800, letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #7c8cf8, #b388ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
            Task Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sign in to your account
          </Typography>
        </Box>
        <form onSubmit={submit} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField label="Email" name="email" type="email"
              value={form.email} onChange={change}
              error={!!errors.email} helperText={errors.email}
              fullWidth autoFocus />
            <TextField label="Password" name="password"
              type={showPw ? 'text' : 'password'}
              value={form.password} onChange={change}
              error={!!errors.password} helperText={errors.password}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(!showPw)} edge="end" size="small">
                      {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }} />
            <Button type="submit" variant="contained" size="large"
              disabled={loading} fullWidth sx={{ mt: 1, py: 1.3 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </form>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Link component={RouterLink} to="/register" variant="body2">Create account</Link>
          <Link component={RouterLink} to="/forgot-password" variant="body2">Forgot password?</Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;