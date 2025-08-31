import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <header className="bg-charcoal text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-heading hover:text-accent-silver transition-colors">
            CarDealer
          </Link>
          <div className="space-x-4">
            <Link to="/" className="p-2 hover:text-accent-silver transition-colors">Home</Link>
            <Link to="/inventory" className="p-2 hover:text-accent-silver transition-colors">Inventory</Link>
            <Link to="/dashboard" className="p-2 hover:text-accent-silver transition-colors">Dashboard</Link>
            <Link to="/login" className="p-2 hover:text-accent-silver transition-colors">Login</Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
