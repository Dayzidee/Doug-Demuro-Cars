import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Footer from './Footer/Footer';
import { useState, useEffect } from 'react';
import DesktopNav from './Navigation/DesktopNav';
import HeaderControls from './Navigation/HeaderControls';
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

          <div className="hidden md:flex flex-grow justify-center">
            <DesktopNav />
          </div>

          <HeaderControls isAuthenticated={isAuthenticated} hasAdminAccess={hasAdminAccess} />

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
