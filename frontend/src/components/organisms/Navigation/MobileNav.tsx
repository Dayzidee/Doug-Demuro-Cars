import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
    {
      label: "Buy Cars",
      path: "/inventory",
      dropdown: ["All Inventory", "Luxury Cars", "Sports Cars", "Classic Cars", "SUVs", "Certified Pre-Owned"]
    },
    {
      label: "Auctions",
      path: "/auctions",
      dropdown: ["Live Auctions", "Ending Soon", "Recently Sold", "Auction Calendar"]
    },
    {
      label: "Promo Deals",
      path: "/promos",
      badge: "HOT",
      dropdown: ["Daily Deals", "Giveaways", "Maintenance Specials"]
    }
  ];

interface MobileNavProps {
    isAuthenticated: boolean;
    hasAdminAccess: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isAuthenticated, hasAdminAccess }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      <button onClick={toggleMenu} className="text-white z-50 relative">
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className={`fixed inset-0 bg-primary-deep-blue/90 backdrop-blur-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-10">
            <nav className="flex flex-col items-center space-y-6 text-center">
                {navLinks.map((link) => (
                <div key={link.label} className="w-full">
                    <Link to={link.path} onClick={toggleMenu} className="text-2xl font-heading text-white mb-2 pb-2 border-b-2 border-primary-electric-cyan/50 w-full text-center">
                        {link.label}
                    </Link>
                    <div className="flex flex-col space-y-3 mt-3">
                        {link.dropdown.map((item) => (
                            <Link key={item} to="#" onClick={toggleMenu} className="text-lg text-neutral-metallic-silver hover:text-white transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
                ))}
            </nav>
            {/* Auth Links for Mobile */}
            <div className="flex flex-col items-center space-y-4 pt-8 border-t border-glass w-4/5">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={toggleMenu} className="text-xl font-semibold text-white">Dashboard</Link>
                    {hasAdminAccess && (
                        <Link to="/admin/promotions" onClick={toggleMenu} className="text-xl font-semibold text-white">Admin</Link>
                    )}
                  </>
                ) : (
                  <Link to="/login" onClick={toggleMenu} className="text-xl font-semibold text-white">Login</Link>
                )}
                <Link to="/sell" onClick={toggleMenu} className="text-xl font-semibold bg-secondary-gradient rounded-md text-white px-6 py-3 mt-4">Sell Your Car</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
