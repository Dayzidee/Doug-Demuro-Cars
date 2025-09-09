import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';

interface HeaderControlsProps {
    isAuthenticated: boolean;
    hasAdminAccess: boolean;
}

const HeaderControls: React.FC<HeaderControlsProps> = ({ isAuthenticated, hasAdminAccess }) => {
    return (
        <div className="flex items-center space-x-4">
            {/* Desktop Auth Links */}
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

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden">
              <MobileNav isAuthenticated={isAuthenticated} hasAdminAccess={hasAdminAccess} />
            </div>
        </div>
    );
};

export default HeaderControls;
