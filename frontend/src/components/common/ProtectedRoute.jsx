
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authcontext';
import Loading from './Loading';
import Unauthorized from '../../pages/Unauthorized';

const ProtectedRoute = ({ children, allowedRoles, requiredPermission, requiredAny }) => {
  const { user, can, canAny, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading fullScreen message="Loading..." />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Unauthorized reason="role" />;
  }
  if (requiredPermission && !can(requiredPermission)) {
    return <Unauthorized reason="permission" />;
  }
  if (requiredAny && !canAny(requiredAny)) {
    return <Unauthorized reason="permission" />;
  }

  return children;
};

export default ProtectedRoute;