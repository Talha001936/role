<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
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
<<<<<<< HEAD
  const planPermissions = session?.user?.planPermissions || [];
  const plan = session?.user?.plan || 'none';
  const billingSyncPending = !!session?.billingSyncPending;
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

  useEffect(() => {
    if (session) hadSessionRef.current = true;
  }, [session]);

  const can = useCallback((perm) => permissions.includes(perm), [permissions]);
<<<<<<< HEAD

  const canAny = useCallback(
    (perms) => perms.some((p) => permissions.includes(p)),
    [permissions]
  );

  const canPlan = useCallback(
    (feat) => planPermissions.includes('full') || planPermissions.includes(feat),
    [planPermissions]
  );

  const canPlanAny = useCallback(
    (feats) =>
      planPermissions.includes('full') ||
      feats.some((f) => planPermissions.includes(f)),
    [planPermissions]
  );
=======
  const canAny = useCallback((perms) => perms.some((p) => permissions.includes(p)), [permissions]);
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

<<<<<<< HEAD
  const isSignupPaid = !!user?.signupPaid;
  const requiresPayment = !isAdmin && !isSignupPaid;
  const isLite = plan === 'lite';
  const isPro = plan === 'pro';
  const isSignupOnly = plan === 'signup';
  const hasPaidPlan = isLite || isPro || isAdmin;

  const persist = useCallback((u, opts = {}) => {
    setSession({
      user: u,
      loggedInAt: Date.now(),
      billingSyncPending: !!opts.billingSyncPending
    });
=======
  const persist = useCallback((u) => {
    setSession({ user: u, loggedInAt: Date.now() });
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  }, [setSession]);

  const fetchMe = useCallback(async (options = {}) => {
    try {
      const res = await authService.getMe(options);
<<<<<<< HEAD
      persist(res.data.user, { billingSyncPending: res.data.billingSyncPending });
      return res.data.user;
    } catch (err) {
      if (err.response?.status !== 402) {
        clearSession();
      }
=======
      persist(res.data.user);
      return res.data.user;
    } catch {
      clearSession();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
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
<<<<<<< HEAD
      return {
        success: true,
        user: res.data.user,
        requiresPayment: res.data.requiresPayment
      };
=======
      return { success: true, user: res.data.user };
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [persist, fetchMe, toast]);

<<<<<<< HEAD
  const register = useCallback(async (name, email, password, role) => {
    try {
      const res = await authService.register(name, email, password, role);
      persist(res.data.user);
      toast.success(res.data.message || 'Account created');
=======
  const register = useCallback(async (name, email, password) => {
    try {
      const res = await authService.register(name, email, password);
      toast.success(res.data.message || 'Registration successful');
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
<<<<<<< HEAD
  }, [persist, toast]);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { }
    try { sessionStorage.clear(); } catch { }
=======
  }, [toast]);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { }
    try { sessionStorage.clear(); } catch {  }
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
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

<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchMe({ skipAuthHandler: true });
  }, [fetchMe]);

  return (
    <AuthContext.Provider value={{
<<<<<<< HEAD
      user, permissions, planPermissions, plan,
      can, canAny, canPlan, canPlanAny,
      loading,
      isAdmin, isManager, isEmployee,
      isSignupPaid, requiresPayment,
      isLite, isPro, isSignupOnly, hasPaidPlan,
      billingSyncPending,
=======
      user, permissions, can, canAny,
      loading, isAdmin, isManager, isEmployee,
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      login, register, logout, fetchMe,
      forgotPassword, verifyCode, resetPassword, changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};