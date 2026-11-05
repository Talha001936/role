
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';
import { useSession } from './sessioncontext';
import { useToast } from './toastcontext';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const { session, setSession, clearSession } = useSession();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const didFetchRef = useRef(false);
  const hadSessionRef = useRef(false);

  const user = session?.user || null;
  const permissions = session?.user?.permissions || [];

  useEffect(() => {
    if (session) hadSessionRef.current = true;
  }, [session]);

  const can = useCallback((perm) => permissions.includes(perm), [permissions]);
  const canAny = useCallback((perms) => perms.some((p) => permissions.includes(p)), [permissions]);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  const persist = useCallback((u) => {
    setSession({ user: u, loggedInAt: Date.now() });
  }, [setSession]);

  const fetchMe = useCallback(async (options = {}) => {
    try {
      const res = await authService.getMe(options);
      persist(res.data.user);
      return res.data.user;
    } catch {
      clearSession();
      return null;
    } finally {
      setLoading(false);
    }
  }, [persist, clearSession]);

  const login = useCallback(async (email, password) => {
    try {
      const res = await authService.login(email, password);
      persist(res.data.user);
      await fetchMe();
      toast.success(`Welcome back, ${res.data.user.name}`);
      return { success: true, user: res.data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [persist, fetchMe, toast]);

  const register = useCallback(async (name, email, password) => {
    try {
      const res = await authService.register(name, email, password);
      toast.success(res.data.message || 'Registration successful');
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [toast]);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { }
    try { sessionStorage.clear(); } catch {  }
    clearSession();
    toast.info('You have been logged out');
  }, [clearSession, toast]);

  const forgotPassword = useCallback(async (email) => {
    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.data.message || 'Reset code sent');
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset code';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [toast]);

  const verifyCode = useCallback(async (email, code) => {
    try {
      await authService.verifyCode(email, code);
      toast.success('Code verified');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid code';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [toast]);

  const resetPassword = useCallback(async (email, code, newPassword) => {
    try {
      await authService.resetPassword(email, code, newPassword);
      toast.success('Password reset. Please log in.');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Password reset failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [toast]);

  const changePassword = useCallback(async (currentPassword, newPassword, confirmPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword, confirmPassword);
      toast.success('Password changed');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Password change failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [toast]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      const hadSession = hadSessionRef.current;
      clearSession();
      hadSessionRef.current = false;

      const onLoginPage = window.location.pathname === '/login';
      if (hadSession && !onLoginPage) {
        toast.warning('Session expired. Please log in again.');
      }
    });
  }, [clearSession, toast]);


  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchMe({ skipAuthHandler: true });
  }, [fetchMe]);

  return (
    <AuthContext.Provider value={{
      user, permissions, can, canAny,
      loading, isAdmin, isManager, isEmployee,
      login, register, logout, fetchMe,
      forgotPassword, verifyCode, resetPassword, changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};