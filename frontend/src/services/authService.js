<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
<<<<<<< HEAD
  register: (name, email, password, role) =>
    api.post('/auth/register', { name, email, password, role }),
=======
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  logout: () => api.post('/auth/logout'),
  getMe: (options = {}) => api.get('/auth/me', options),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyCode: (email, code) => api.post('/auth/verify-code', { email, code }),
  resetPassword: (email, code, newPassword) =>
    api.post('/auth/reset-password', { email, code, newPassword }),
  changePassword: (currentPassword, newPassword, confirmPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword, confirmPassword })
};