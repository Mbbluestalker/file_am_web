import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/onboardingApi';
import Logo from '../../assets/Logo.png';

/**
 * HEADER COMPONENT
 *
 * Main navigation header with logo and menu items
 */
const Header = ({ hideLogo = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    // Check if we're on the exact path or any sub-path
    if (path === '/clients') {
      return location.pathname === path || location.pathname.startsWith('/clients/');
    }
    if (path === '/filings') {
      return location.pathname === path || location.pathname.startsWith('/filings/');
    }
    if (path === '/reports') {
      return location.pathname === path;
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="!px-8 flex items-center justify-between">
        {!hideLogo && (
          <>
            {/* Logo */}
            <Link to="/" className="flex items-center !py-4 !pr-20">
              <img src={Logo} alt="FileAm Finance" className="h-9" />
            </Link>

            {/* Divider */}
            <div className="!h-16 w-px bg-gray-200 !mr-12"></div>
          </>
        )}

        {/* Navigation */}
        <nav className={`flex items-center !gap-8 flex-1 !py-4 ${hideLogo ? '!pl-4' : ''}`}>
          <Link
            to="/clients"
            className={`flex items-center gap-2 transition-colors relative ${
              isActive('/clients')
                ? 'text-brand'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {isActive('/clients') && (
              <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-brand"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium">Clients</span>
          </Link>

          <Link
            to="/filings"
            className={`flex items-center gap-2 transition-colors relative ${
              isActive('/filings')
                ? 'text-brand'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {isActive('/filings') && (
              <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-brand"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-sm font-medium">Filings</span>
          </Link>

          <Link to="/taxgpt" className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">TaxGPT</span>
          </Link>

          <Link
            to="/reports"
            className={`flex items-center gap-2 transition-colors relative ${
              isActive('/reports')
                ? 'text-brand'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {isActive('/reports') && (
              <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-brand"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium">Reports</span>
          </Link>

          <Link to="/compliance" className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Compliance</span>
          </Link>

          <Link to="/settings" className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>

        {/* Notification Bell & Logout */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
