<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Layout from '../components/common/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyCode from '../pages/VerifyCode';
<<<<<<< HEAD
import ResetPassword from '../pages/ResetPassword';
=======
import ResetPassword from '../pages/ResetPassord';
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
import ChangePassword from '../pages/ChangePassword';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Users from '../pages/Users';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
<<<<<<< HEAD
import Pricing from '../pages/Pricing';
import CheckoutSuccess from '../pages/CheckoutSuccess';
import CheckoutCancel from '../pages/CheckoutCancel';
import Payments from '../pages/admin/Payments';
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
import { useAuth } from '../context/authcontext';
import Loading from '../components/common/Loading';

const roleBase = (role) =>
<<<<<<< HEAD
  role === 'admin' ? 'admin' : role === 'manager' ? 'manager' : 'user';

const ScopeGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const { userId, adminId, managerId } = useParams();
  const urlId = adminId || userId || managerId;

  if (loading) return <Loading fullScreen message="Loading..." />;
  if (!user) return <Navigate to="/login" replace />;

=======
  role === 'admin' ? 'admin' : role === 'manager' ? 'manager' : 'employee';
const ScopeGuard = ({ children }) => {
  const { user } = useAuth();
  const { userId, adminId, managerId } = useParams();
  const urlId = adminId || userId || managerId;

  if (!user) return null;
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  if (urlId && String(urlId) !== String(user.id)) {
    return <Unauthorized reason="scope" />;
  }
  return children;
};

<<<<<<< HEAD
const PlanGuard = ({ requirePlan = 'pro', children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading fullScreen message="Loading..." />;
  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = user.role === 'admin';
  const plan = user.plan;
  const ok =
    isAdmin || plan === 'pro' ||
    (requirePlan === 'lite' && plan === 'lite');

  if (!ok) return <Unauthorized reason="plan" />;
  return children;
};

=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
const LegacyRedirect = ({ to }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading fullScreen message="Loading..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${roleBase(user.role)}/${user.id}/${to}`} replace />;
};

<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
const ScopedLayout = ({ allowedRoles }) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    <ScopeGuard>
      <Layout />
    </ScopeGuard>
  </ProtectedRoute>
);

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/verify-code" element={<VerifyCode />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

<<<<<<< HEAD
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/checkout/cancel" element={<CheckoutCancel />} />

=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    <Route
      path="/user/:userId"
      element={<ScopedLayout allowedRoles={['admin', 'manager', 'employee']} />}
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<ChangePassword />} />
    </Route>

    <Route
      path="/manager/:managerId"
      element={<ScopedLayout allowedRoles={['admin', 'manager']} />}
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="tasks" element={<Tasks />} />
<<<<<<< HEAD
      <Route
        path="users"
        element={
          <PlanGuard requirePlan="pro">
            <Users />
          </PlanGuard>
        }
      />
=======
      <Route path="users" element={<Users />} />
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<ChangePassword />} />
    </Route>

    <Route
      path="/admin/:adminId"
      element={<ScopedLayout allowedRoles={['admin']} />}
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="users" element={<Users />} />
<<<<<<< HEAD
      <Route path="payments" element={<Payments />} />
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<ChangePassword />} />
    </Route>

    <Route path="/" element={<LegacyRedirect to="dashboard" />} />
    <Route path="/dashboard" element={<LegacyRedirect to="dashboard" />} />
    <Route path="/tasks" element={<LegacyRedirect to="tasks" />} />
<<<<<<< HEAD
=======
    <Route path="/users" element={<LegacyRedirect to="users" />} />
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    <Route path="/profile" element={<LegacyRedirect to="profile" />} />
    <Route path="/change-password" element={<LegacyRedirect to="change-password" />} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);