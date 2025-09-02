import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const hasAdminAccess = user?.role && ['admin', 'manager', 'staff'].includes(user.role);

  return (
    <header className="bg-primary-deep-blue/80 backdrop-blur-sm text-neutral-metallic-silver sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center p-lg">
        <Link to="/" className="text-2xl font-heading hover:text-secondary-golden-yellow transition-colors">
          Doug DeMuro Cars & Bids
        </Link>
        <nav className="hidden md:flex items-center space-x-md">
          <Link to="/inventory" className="font-accent hover:text-secondary-golden-yellow transition-colors">Buy Cars</Link>
          <Link to="/auctions" className="font-accent hover:text-secondary-golden-yellow transition-colors">Auctions</Link>
          <Link to="/sell" className="font-accent hover:text-secondary-golden-yellow transition-colors">Sell Your Car</Link>
          <Link to="/promos" className="font-accent hover:text-secondary-golden-yellow transition-colors">Promo Deals</Link>
        </nav>
        <div className="hidden md:flex items-center space-x-md">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="font-accent hover:text-secondary-golden-yellow transition-colors">Dashboard</Link>
              {hasAdminAccess && (
                <Link to="/admin/promotions" className="font-accent hover:text-secondary-golden-yellow transition-colors">Admin</Link>
              )}
            </>
          ) : (
            <Link to="/login" className="bg-primary-gradient px-md py-sm rounded-md font-bold hover:opacity-90 transition-opacity">Login</Link>
          )}
        </div>
        <div className="md:hidden">
          {/* Mobile menu button placeholder */}
          <button className="text-neutral-metallic-silver">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
