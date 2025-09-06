import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Layout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-deep-blue">
        <p className="text-white text-xl">Loading application...</p>
      </div>
    );
  }

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
            <Link to="/sell" className="p-2 bg-secondary-gradient rounded-md text-white font-bold hover:opacity-90 transition-opacity">Sell Your Car</Link>
            <Link to="/gallery" className="p-2 hover:text-accent-silver transition-colors">Gallery</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="p-2 hover:text-accent-silver transition-colors">Dashboard</Link>
            )}
            {hasAdminAccess && (
              <Link to="/admin/promotions" className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors">Admin</Link>
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
