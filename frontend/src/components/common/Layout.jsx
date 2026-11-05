
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Box, IconButton,
  Avatar, Menu, MenuItem, Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/authcontext';
import { useToast } from '../../context/toastcontext';
import ConfirmDialog from './ConfirmDialog';

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
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
    if (current !== scope) {
      navigate(`/${scope}/${user.id}/dashboard`, { replace: true });
    }
  }, [user, scope, location.pathname, navigate]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const doLogout = async () => {
    setConfirmLogout(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `${basePath}/dashboard`, show: can('dashboard:view') },
    { text: 'Tasks', icon: <TaskIcon />, path: `${basePath}/tasks`, show: can('task:view:own') || can('task:view:all') },
    { text: 'Users', icon: <PeopleIcon />, path: `${basePath}/users`, show: can('user:view') }
  ].filter((i) => i.show);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const drawer = (
    <Box>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" noWrap sx={{
          fontWeight: 800, letterSpacing: '-0.02em',
          background: 'linear-gradient(90deg, #7c8cf8, #b388ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          TaskFlow
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={isActive(item.path)}
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
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            {menuItems.find((i) => isActive(i.path))?.text || 'Dashboard'}
          </Typography>
          <IconButton onClick={handleMenuOpen} color="inherit" sx={{ p: 0.5 }}>
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
                <Typography variant="caption" color="text.secondary">
                  {user?.email} · {user?.role}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
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
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" open
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{
        flexGrow: 1, p: { xs: 2, md: 3 },
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        mt: 8, minHeight: '100vh'
      }}>
        <Outlet />
      </Box>

      <ConfirmDialog
        open={confirmLogout}
        title="Log out?"
        message="You will be signed out and all local session data will be cleared."
        confirmText="Log out"
        confirmColor="warning"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={doLogout}
      />
    </Box>
  );
};

export default Layout;