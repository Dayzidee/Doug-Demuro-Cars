import { Link, NavLink } from 'react-router-dom';
import { Home, Search, Heart, User, GitCompareArrows } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/inventory', label: 'Search', icon: Search },
  { href: '/compare', label: 'Compare', icon: GitCompareArrows },
  { href: '/dashboard/watchlist', label: 'Watchlist', icon: Heart },
  { href: '/dashboard', label: 'Account', icon: User },
];

const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary-deep-blue/80 backdrop-blur-lg border-t border-glass z-40">
      <div className="container mx-auto flex justify-around h-16">
        {navItems.map(({ href, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={href}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center pt-2 w-full text-xs transition-colors ${
                isActive
                  ? 'text-primary-electric-cyan'
                  : 'text-neutral-metallic-silver hover:text-white'
              }`
            }
          >
            <Icon size={22} />
            <span className="mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
