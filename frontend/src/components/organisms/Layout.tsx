import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Layout() {
  const { user, isAuthenticated } = useAuth();
  const hasAdminAccess = user?.role && ['admin', 'manager', 'staff'].includes(user.role);

  return (
    <div>
      <header className="bg-charcoal text-white p-4 shadow-md sticky top-0 z-40">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-heading hover:text-accent-silver transition-colors">
            CarDealer
          </Link>
          <div className="space-x-4 flex items-center">
            <Link to="/" className="p-2 hover:text-accent-silver transition-colors">Home</Link>
            <Link to="/inventory" className="p-2 hover:text-accent-silver transition-colors">Inventory</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="p-2 hover:text-accent-silver transition-colors">Dashboard</Link>
            )}
            {hasAdminAccess && (
              <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                <Link to="/admin/vehicles" className="px-3 py-1 text-sm rounded-md hover:bg-gray-600 transition-colors">Vehicles</Link>
              </div>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="p-2 hover:text-accent-silver transition-colors">Login</Link>
            )}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
