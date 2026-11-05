import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
<<<<<<< HEAD
  Box, Paper, TextField, Button, Typography, Link,
  InputAdornment, IconButton, MenuItem, Alert
=======
  Box, Paper, TextField, Button, Typography, Link, InputAdornment, IconButton
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/authcontext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
<<<<<<< HEAD
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', role: 'employee'
  });
=======
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);

<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
<<<<<<< HEAD
    if (!['employee', 'manager'].includes(form.role)) e.role = 'Select a valid role';
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
<<<<<<< HEAD
    const result = await register(form.name.trim(), form.email.trim(), form.password, form.role);
    setLoading(false);
    if (result.success) {
      navigate('/pricing', { replace: true });
    }
  };

  const rolePrices = { employee: '$15', manager: '$20' };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 460, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Choose your role and complete signup payment
          </Typography>
        </Box>

        

        <form onSubmit={submit} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              select label="Role with fee" name="role" value={form.role}
              onChange={change} error={!!errors.role} helperText={errors.role} fullWidth
            >
              <MenuItem value="employee">Employee {rolePrices.employee}</MenuItem>
              <MenuItem value="manager">Manager {rolePrices.manager}</MenuItem>
            </TextField>

=======
    const result = await register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);
    if (result.success) setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 440, borderRadius: 3,
          backgroundColor: 'rgba(23,26,33,0.7)', backdropFilter: 'blur(12px)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800, letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #7c8cf8, #b388ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Join TaskFlow as an employee
          </Typography>
        </Box>

        <form onSubmit={submit} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
            <TextField label="Full Name" name="name" value={form.name} onChange={change}
              error={!!errors.name} helperText={errors.name} fullWidth autoFocus />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={change}
              error={!!errors.email} helperText={errors.email} fullWidth />
            <TextField label="Password" name="password" type={showPw ? 'text' : 'password'}
              value={form.password} onChange={change}
              error={!!errors.password} helperText={errors.password || 'Min 8 characters'}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(!showPw)} edge="end" size="small">
                      {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField label="Confirm Password" name="confirm" type={showCPw ? 'text' : 'password'}
              value={form.confirm} onChange={change}
              error={!!errors.confirm} helperText={errors.confirm} fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCPw(!showCPw)} edge="end" size="small">
                      {showCPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }} />
<<<<<<< HEAD

            <Button type="submit" variant="contained" size="large" disabled={loading}
              fullWidth sx={{ mt: 1, py: 1.3 }}>
              {loading ? 'Creating account...' : 'Continue to payment'}
=======
            <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth sx={{ mt: 1, py: 1.3 }}>
              {loading ? 'Creating account...' : 'Create Account'}
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;