import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Footer from './Footer/Footer';
import { useState, useEffect } from 'react';
import DesktopNav from './Navigation/DesktopNav';
import MobileNav from './Navigation/MobileNav';
import BottomNav from './Navigation/BottomNav';

export default function Layout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-deep-blue">
        <p className="text-white text-xl">Loading application...</p>
      </div>
    );
  }

  const hasAdminAccess = user?.role && ['admin', 'manager', 'staff'].includes(user.role);

  return (
    <div className="bg-background-primary-gradient text-white min-h-screen flex flex-col">
      <header className={`p-4 sticky top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-primary-deep-blue/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-heading hover:text-secondary-golden-yellow transition-colors flex-shrink-0">
            Doug DeNero Cars & Promos
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-grow justify-center">
            <DesktopNav />
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="p-2 font-semibold hover:text-secondary-golden-yellow transition-colors">Dashboard</Link>
                    {hasAdminAccess && (
                      <Link to="/admin/promotions" className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors">Admin</Link>
                    )}
                  </>
                ) : (
                  <Link to="/login" className="p-2 font-semibold hover:text-secondary-golden-yellow transition-colors">Login</Link>
                )}
                <Link to="/sell" className="p-2 bg-secondary-gradient rounded-md text-white font-bold hover:opacity-90 transition-opacity">Sell Your Car</Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileNav isAuthenticated={isAuthenticated} hasAdminAccess={hasAdminAccess} />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
