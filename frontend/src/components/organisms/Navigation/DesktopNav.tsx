import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const navLinks = [
  {
    label: "Buy Cars",
    path: "/inventory",
    dropdown: [
      { label: "All Inventory", path: "/inventory" },
      { label: "Luxury Cars", path: "/inventory?category=luxury" },
      { label: "Sports Cars", path: "/inventory?category=sports" },
    ]
  },
  {
    label: "Auctions",
    path: "/auctions",
    dropdown: [
      { label: "Live Auctions", path: "/auctions" },
      { label: "Ending Soon", path: "/auctions?filter=ending-soon" },
    ]
  },
  {
    label: "Sell Your Car",
    path: "/sell",
    dropdown: [
      { label: "Submit for Auction", path: "/sell" },
      { label: "Get Valuation", path: "/sell/valuation" },
    ]
  },
  {
    label: "Promo Deals",
    path: "/promos",
    badge: "HOT",
    dropdown: [
      { label: "Daily Deals", path: "/promos" },
      { label: "Giveaways", path: "/promos/giveaways" },
    ]
  }
];

const DesktopNav = () => {
  return (
    <nav className="hidden md:flex items-center space-x-2">
      {navLinks.map((link) => (
        <div key={link.label} className="group relative">
          <Link to={link.path} className="p-2 font-semibold text-neutral-metallic-silver hover:text-white transition-colors flex items-center space-x-1 rounded-md hover:bg-white/10">
            <span>{link.label}</span>
            <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
            {link.badge && (
              <span className="ml-2 bg-secondary-sunset-orange text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                {link.badge}
              </span>
            )}
          </Link>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 origin-top scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-primary-deep-blue/80 backdrop-blur-lg shadow-2xl rounded-lg overflow-hidden border border-glass">
              <div className="p-2">
                {link.dropdown.map((item) => (
                  <Link key={item.label} to={item.path} className="block px-4 py-2 text-white rounded-md hover:bg-primary-electric-cyan/20 transition-colors">
                    {item.label}
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
