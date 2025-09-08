import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const navLinks = [
  {
    label: "Buy Cars",
    dropdown: ["All Inventory", "Luxury Cars", "Sports Cars", "Classic Cars", "SUVs", "Certified Pre-Owned"]
  },
  {
    label: "Auctions",
    dropdown: ["Live Auctions", "Ending Soon", "Recently Sold", "Auction Calendar"]
  },
  {
    label: "Sell Your Car",
    dropdown: ["Submit for Auction", "Instant Sell", "Get Valuation", "Seller Dashboard"]
  },
  {
    label: "Promo Deals",
    badge: "HOT",
    dropdown: ["Daily Deals", "Giveaways", "Maintenance Specials"]
  }
];

const DesktopNav = () => {
  return (
    <nav className="hidden md:flex items-center space-x-2">
      {navLinks.map((link) => (
        <div key={link.label} className="group relative">
          <button className="p-2 font-semibold text-neutral-metallic-silver hover:text-white transition-colors flex items-center space-x-1 rounded-md hover:bg-white/10">
            <span>{link.label}</span>
            <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
            {link.badge && (
              <span className="ml-2 bg-secondary-sunset-orange text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                {link.badge}
              </span>
            )}
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 origin-top scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-primary-deep-blue/80 backdrop-blur-lg shadow-2xl rounded-lg overflow-hidden border border-glass">
              <div className="p-2">
                {link.dropdown.map((item) => (
                  <Link key={item} to="#" className="block px-4 py-2 text-white rounded-md hover:bg-primary-electric-cyan/20 transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
};

export default DesktopNav;
