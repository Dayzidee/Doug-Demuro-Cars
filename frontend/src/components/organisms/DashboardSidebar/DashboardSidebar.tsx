import { NavLink } from 'react-router-dom';

const dashboardLinks = [
  { path: '/dashboard', label: 'Overview', exact: true },
  { path: '/dashboard/bids', label: 'My Bids' },
  { path: '/dashboard/watchlist', label: 'Watchlist' },
  { path: '/dashboard/selling', label: 'Selling Center' },
  { path: '/dashboard/settings', label: 'Profile & Settings' },
];

const DashboardSidebar = () => {
  const linkStyles = "block py-sm px-md rounded-lg transition-colors font-medium";
  const activeLinkStyles = "bg-glass text-white shadow-lg";
  const inactiveLinkStyles = "text-neutral-metallic-silver/70 hover:bg-glass/50 hover:text-white";

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24 p-md bg-glass/50 border border-glass rounded-xl">
        <nav className="space-y-sm">
          {dashboardLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.exact} // Use `end` prop for exact matching on the overview link
              className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : inactiveLinkStyles}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
