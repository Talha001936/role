<<<<<<< HEAD
import { useState, useEffect, useRef } from 'react';
=======

import { useState, useEffect } from 'react';
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Box, IconButton,
<<<<<<< HEAD
  Avatar, Menu, MenuItem, Divider, Chip
=======
  Avatar, Menu, MenuItem, Divider
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
<<<<<<< HEAD
  Person as PersonIcon,
  Lock as LockIcon,
  Payment as PaymentIcon
=======
  Lock as LockIcon,
  Person as PersonIcon
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
} from '@mui/icons-material';
import { useAuth } from '../../context/authcontext';
import { useToast } from '../../context/toastcontext';
import ConfirmDialog from './ConfirmDialog';

const drawerWidth = 240;

<<<<<<< HEAD
const planLabel = {
  none: 'Inactive',
  signup: 'Signup',
  lite: 'Lite',
  pro: 'Pro',
  admin: 'Admin'
};

const PUBLIC_PREFIXES = [
  'pricing', 'checkout', 'login', 'register',
  'forgot-password', 'verify-code', 'reset-password', 'unauthorized'
];

=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
<<<<<<< HEAD
  const didNotifySyncRef = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const toast = useToast();

  const { user, can, isAdmin, plan, logout, billingSyncPending } = useAuth();

  const isPro = plan === 'pro';

  const scopeId = params.adminId || params.managerId || params.userId || user?.id;
  const scope = user?.role === 'admin'
    ? 'admin'
    : user?.role === 'manager'
      ? 'manager'
      : 'user';
  const basePath = `/${scope}/${scopeId}`;
  useEffect(() => {
    if (!user) return;
    const current = location.pathname.split('/')[1];
    if (PUBLIC_PREFIXES.includes(current)) return;
=======
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user, can, logout } = useAuth();
  const toast = useToast();

  const scopeId = params.adminId || params.managerId || params.userId || user?.id;
  const scope = user?.role === 'admin' ? 'admin' : user?.role === 'manager' ? 'manager' : 'user';
  const basePath = `/${scope}/${scopeId}`;

  
  useEffect(() => {
    if (!user) return;
    const expected = `/${scope}`;
    const current = location.pathname.split('/')[1];
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    if (current !== scope) {
      navigate(`/${scope}/${user.id}/dashboard`, { replace: true });
    }
  }, [user, scope, location.pathname, navigate]);
<<<<<<< HEAD
  useEffect(() => {
    if (!billingSyncPending) return;
    if (didNotifySyncRef.current) return;
    didNotifySyncRef.current = true;
    
  }, [billingSyncPending, toast]);
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const doLogout = async () => {
    setConfirmLogout(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
<<<<<<< HEAD
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: `${basePath}/dashboard`,
      show: can('dashboard:view')
    },
    {
      text: 'Tasks',
      icon: <TaskIcon />,
      path: `${basePath}/tasks`,
      show: can('task:view:own') || can('task:view:all')
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: `${basePath}/users`,
      // Admin always; managers only on Pro
      show: can('user:view') && (isAdmin || isPro)
    },
    {
      text: 'Payments',
      icon: <PaymentIcon />,
      path: `${basePath}/payments`,
      show: isAdmin
    }
  ].filter((i) => i.show);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');
=======
    { text: 'Dashboard', icon: <DashboardIcon />, path: `${basePath}/dashboard`, show: can('dashboard:view') },
    { text: 'Tasks', icon: <TaskIcon />, path: `${basePath}/tasks`, show: can('task:view:own') || can('task:view:all') },
    { text: 'Users', icon: <PeopleIcon />, path: `${basePath}/users`, show: can('user:view') }
  ].filter((i) => i.show);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

  const drawer = (
    <Box>
      <Toolbar sx={{ px: 2 }}>
<<<<<<< HEAD
        <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
=======
        <Typography variant="h6" noWrap sx={{
          fontWeight: 800, letterSpacing: '-0.02em',
          background: 'linear-gradient(90deg, #7c8cf8, #b388ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
          TaskFlow
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={isActive(item.path)}
<<<<<<< HEAD
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{ borderRadius: 1.5 }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'inherit',
                  minWidth: 40
                }}
              >
=======
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{
                borderRadius: 1.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(124,140,248,0.15)',
                  '&:hover': { backgroundColor: 'rgba(124,140,248,0.2)' }
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit', minWidth: 40 }}>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
<<<<<<< HEAD

      {!isAdmin && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Current plan
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                size="small"
                variant="outlined"
                label={planLabel[plan] || 'Unknown'}
              />
            </Box>
          </Box>
        </>
      )}
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
<<<<<<< HEAD
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
=======
      <AppBar position="fixed"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            {menuItems.find((i) => isActive(i.path))?.text || 'Dashboard'}
          </Typography>
          <IconButton onClick={handleMenuOpen} color="inherit" sx={{ p: 0.5 }}>
<<<<<<< HEAD
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: 'primary.main',
                fontSize: 15,
                fontWeight: 700
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1, minWidth: 240 } }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user?.name}
                </Typography>
=======
            <Avatar sx={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #7c8cf8, #b388ff)',
              fontSize: 15, fontWeight: 700
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1, minWidth: 240 } }}>
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
                <Typography variant="caption" color="text.secondary">
                  {user?.email} · {user?.role}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
<<<<<<< HEAD

            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(`${basePath}/profile`);
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(`${basePath}/change-password`);
              }}
            >
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              Change Password
            </MenuItem>

            {!isAdmin && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate('/pricing');
                }}
              >
                <ListItemIcon>
                  <PaymentIcon fontSize="small" />
                </ListItemIcon>
                Plans & Billing
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                handleMenuClose();
                setConfirmLogout(true);
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
=======
            <MenuItem onClick={() => { handleMenuClose(); navigate(`${basePath}/profile`); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate(`${basePath}/change-password`); }}>
              <ListItemIcon><LockIcon fontSize="small" /></ListItemIcon>
              Change Password
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); setConfirmLogout(true); }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

<<<<<<< HEAD
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
=======
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" open
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
          {drawer}
        </Drawer>
      </Box>

<<<<<<< HEAD
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh'
        }}
      >
=======
      <Box component="main" sx={{
        flexGrow: 1, p: { xs: 2, md: 3 },
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        mt: 8, minHeight: '100vh'
      }}>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        <Outlet />
      </Box>

      <ConfirmDialog
        open={confirmLogout}
        title="Log out?"
<<<<<<< HEAD
        message="You will be signed out."
=======
        message="You will be signed out and all local session data will be cleared."
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        confirmText="Log out"
        confirmColor="warning"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={doLogout}
      />
    </Box>
  );
};

export default Layout;