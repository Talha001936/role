<<<<<<< HEAD
// import { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, Button, Box, MenuItem, InputAdornment, IconButton
// } from '@mui/material';
// import {
//   Visibility as VisibilityIcon,
//   VisibilityOff as VisibilityOffIcon
// } from '@mui/icons-material';
// import { useToast } from '../../context/toastcontext';
// import ConfirmDialog from '../common/ConfirmDialog';

// const emptyForm = { name: '', email: '', password: '', role: 'employee' };

// const UserForm = ({ open, onClose, onSubmit }) => {
//   const toast = useToast();
//   const [form, setForm] = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (open) {
//       setForm(emptyForm); setErrors({}); setConfirmOpen(false); setShowPassword(false);
//     }
//   }, [open]);

//   const change = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//     if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = 'Name is required';
//     if (!form.email.trim()) e.email = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
//     if (!form.password) e.password = 'Password is required';
//     else if (form.password.length < 8) e.password = 'Min 8 characters';
//     setErrors(e);
//     if (Object.keys(e).length) { toast.error(Object.values(e)[0]); return false; }
//     return true;
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setConfirmOpen(true);
//   };

//   const doSubmit = async () => {
//     setSubmitting(true);
//     const res = await onSubmit(form);
//     setSubmitting(false);
//     setConfirmOpen(false);
//     if (res?.success !== false) onClose();
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//         <DialogTitle>New User</DialogTitle>
//         <form onSubmit={handleFormSubmit} noValidate>
//           <DialogContent>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
//               <TextField select label="Role" name="role" value={form.role} onChange={change} fullWidth>
//                 <MenuItem value="employee">Employee</MenuItem>
//                 <MenuItem value="manager">Manager</MenuItem>
//               </TextField>
//               <TextField label="Name" name="name" value={form.name} onChange={change}
//                 error={!!errors.name} helperText={errors.name} fullWidth autoFocus />
//               <TextField label="Email" name="email" type="email" value={form.email}
//                 onChange={change} error={!!errors.email} helperText={errors.email} fullWidth />
//               <TextField label="Password" name="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={form.password} onChange={change}
//                 error={!!errors.password}
//                 helperText={errors.password || 'Min 8 characters'}
//                 fullWidth
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
//                         {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
//                       </IconButton>
//                     </InputAdornment>
//                   )
//                 }} />
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={onClose} disabled={submitting}>Cancel</Button>
//             <Button type="submit" variant="contained" disabled={submitting}>
//               {submitting ? 'Creating...' : 'Create User'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       <ConfirmDialog
//         open={confirmOpen}
//         title="Create user?"
//         message={`Create ${form.role} "${form.name}" with email ${form.email}?`}
//         confirmText="Create"
//         confirmColor="primary"
//         loading={submitting}
//         onCancel={() => setConfirmOpen(false)}
//         onConfirm={doSubmit}
//       />
//     </>
//   );
// };

// export default UserForm;
=======
import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, MenuItem, InputAdornment, IconButton
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useToast } from '../../context/toastcontext';
import ConfirmDialog from '../common/ConfirmDialog';

const emptyForm = { name: '', email: '', password: '', role: 'employee' };

const UserForm = ({ open, onClose, onSubmit }) => {
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm); setErrors({}); setConfirmOpen(false); setShowPassword(false);
    }
  }, [open]);

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
    setErrors(e);
    if (Object.keys(e).length) { toast.error(Object.values(e)[0]); return false; }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const doSubmit = async () => {
    setSubmitting(true);
    const res = await onSubmit(form);
    setSubmitting(false);
    setConfirmOpen(false);
    if (res?.success !== false) onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>New User</DialogTitle>
        <form onSubmit={handleFormSubmit} noValidate>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField select label="Role" name="role" value={form.role} onChange={change} fullWidth>
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </TextField>
              <TextField label="Name" name="name" value={form.name} onChange={change}
                error={!!errors.name} helperText={errors.name} fullWidth autoFocus />
              <TextField label="Email" name="email" type="email" value={form.email}
                onChange={change} error={!!errors.email} helperText={errors.email} fullWidth />
              <TextField label="Password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={change}
                error={!!errors.password}
                helperText={errors.password || 'Min 8 characters'}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Create user?"
        message={`Create ${form.role} "${form.name}" with email ${form.email}?`}
        confirmText="Create"
        confirmColor="primary"
        loading={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doSubmit}
      />
    </>
  );
};

export default UserForm;
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
