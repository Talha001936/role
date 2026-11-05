
import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Chip, Divider,
  Stack, Avatar, Grid, Alert
} from '@mui/material';
import {
  Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon,
  Email as EmailIcon, Badge as BadgeIcon, VerifiedUser as RoleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/authcontext';
import { useToast } from '../context/toastcontext';
import { profileService } from '../services/profileService';
import Loading from '../components/common/Loading';
import ConfirmDialog from '../components/common/ConfirmDialog';

const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
    <Box sx={{
      p: 1, borderRadius: 1.5,
      backgroundColor: 'rgba(124,140,248,0.12)',
      color: 'primary.main', display: 'flex'
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body1" fontWeight={500}>{value}</Typography>
    </Box>
  </Stack>
);

const Profile = () => {
  const { user, fetchMe } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', currentPassword: '' });
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', currentPassword: '' });
  }, [user]);

  if (!user) return <Loading message="Loading profile..." minHeight="60vh" />;

  const emailChanged = form.email.trim() !== (user.email || '');

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.length < 2) e.name = 'Min 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';

    if (emailChanged && !form.currentPassword) {
      e.currentPassword = 'current password is required to change the email';
    }
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error(Object.values(e)[0]);
      return false;
    }
    return true;
  };

  const handleSaveClick = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const doSave = async () => {
    setLoading(true);
    try {
      const payload = { name: form.name.trim(), email: form.email.trim() };
      if (emailChanged) payload.currentPassword = form.currentPassword;

      await profileService.update(payload);
      await fetchMe();
      toast.success('Profile updated');
      setEditing(false);
      setForm((f) => ({ ...f, currentPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({ name: user.name || '', email: user.email || '', currentPassword: '' });
    setErrors({});
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Profile</Typography>

      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, maxWidth: 720 }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{
            width: 84, height: 84, fontSize: 34, fontWeight: 700,
            background: 'linear-gradient(135deg, #7c8cf8, #b388ff)'
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>{user.name}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              <Chip size="small" label={user.role} color="primary" />
              <Chip
                size="small"
                label={user.status}
                color={user.status === 'active' ? 'success' : 'error'}
              />
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {!editing ? (
          <>
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="Full name" value={user.name} />
            <InfoRow icon={<EmailIcon fontSize="small" />} label="Email" value={user.email} />
            <InfoRow icon={<RoleIcon fontSize="small" />} label="Role" value={user.role} />
            <InfoRow
              icon={<RoleIcon fontSize="small" />}
              label="Member since"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            />

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            </Box>
          </>
        ) : (
          <form onSubmit={handleSaveClick} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name" name="name" value={form.name}
                  onChange={change} error={!!errors.name} helperText={errors.name}
                  fullWidth autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email" name="email" type="email" value={form.email}
                  onChange={change} error={!!errors.email} helperText={errors.email}
                  fullWidth
                />
              </Grid>
              {emailChanged && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 1 }}>
                    Changing your email requires your current password.
                  </Alert>
                  <TextField
                    label="Current Password" name="currentPassword" type="password"
                    value={form.currentPassword} onChange={change}
                    error={!!errors.currentPassword} helperText={errors.currentPassword}
                    fullWidth
                  />
                </Grid>
              )}
            </Grid>
          
            <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
              <Button
                type="submit" variant="contained"
                startIcon={<SaveIcon />} disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined" startIcon={<CancelIcon />}
                onClick={cancelEdit} disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title="Save profile changes?"
        message={
          emailChanged
            ? 'Your email will be updated. You may need to log in again with the new address.'
            : 'Your name will be updated.'
        }
        confirmText="Save"
        confirmColor="primary"
        loading={loading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doSave}
      />
    </Box>
  );
};

export default Profile;