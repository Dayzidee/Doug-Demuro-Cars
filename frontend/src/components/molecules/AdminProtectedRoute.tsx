import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminProtectedRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center p-8">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAdminRole = user?.role && ['admin', 'manager', 'staff'].includes(user.role);

  if (!hasAdminRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
