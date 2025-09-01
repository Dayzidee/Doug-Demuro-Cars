import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminProtectedRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading indicator while checking auth status
    return <div className="text-center p-8">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // Check if the authenticated user has a sufficient role
  const hasAdminRole = user?.role && ['admin', 'manager', 'staff'].includes(user.role);

  if (!hasAdminRole) {
    // If the user is authenticated but doesn't have the right role,
    // redirect them to a safe page like the dashboard.
    // Optionally, you could show a '403 Forbidden' page.
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and has an admin role, render the child route
  return <Outlet />;
};

export default AdminProtectedRoute;
