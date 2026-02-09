import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import Avatar from '../../assets/Avatar.png';

/**
 * SIDEBAR COMPONENT
 *
 * Client dashboard sidebar with collapsible sections
 */
const Sidebar = ({ clientId }) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    setup: false,
    analysis: false,
    compliance: false,
  });

  // Auto-open sections based on current route
  useEffect(() => {
    const path = location.pathname;

    // Setup section routes
    if (path.includes('/business-profile') || path.includes('/financials')) {
      setOpenSections(prev => ({ ...prev, setup: true }));
    }

    // Analysis section routes
    if (path.includes('/profitability') || path.includes('/tax-computation')) {
      setOpenSections(prev => ({ ...prev, analysis: true }));
    }

    // Compliance section routes
    if (path.includes('/filings') || path.includes('/evidence-vault')) {
      setOpenSections(prev => ({ ...prev, compliance: true }));
    }
  }, [location.pathname]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 !h-screen flex flex-col overflow-hidden">
      {/* Logo */}
      <Link to="/" className="!px-6 !py-5 flex-shrink-0">
        <img src={Logo} alt="FileAm Finance" className="h-8" />
      </Link>

      {/* Navigation */}
      <div className="flex-1 !py-6 overflow-y-auto">
        {/* Overview */}
        <Link
          to={`/clients/${clientId}`}
          className={`flex items-center !gap-3 !mx-4 !px-4 !py-3 rounded-xl !mb-6 ${
            isActive(`/clients/${clientId}`)
              ? 'bg-brand text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-sm font-semibold">Overview</span>
        </Link>

        {/* SETUP Section */}
        <div className="!mb-6">
          <button
            onClick={() => toggleSection('setup')}
            className="flex items-center justify-between w-full !px-6 !py-2 text-xs font-semibold text-gray-400 uppercase hover:text-gray-600"
          >
            <span>Setup</span>
            <svg
              className={`w-4 h-4 transition-transform ${openSections.setup ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openSections.setup && (
            <div className="!mt-2">
              <Link
                to={`/clients/${clientId}/business-profile`}
                className={`flex items-center !gap-3 !px-6 !py-2.5 text-sm ${
                  isActive(`/clients/${clientId}/business-profile`)
                    ? 'bg-brand text-white !mx-4 rounded-xl'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Business Profile</span>
              </Link>
              <Link
                to={`/clients/${clientId}/financials`}
                className={`flex items-center !gap-3 !px-6 !py-2.5 text-sm ${
                  isActive(`/clients/${clientId}/financials`)
                    ? 'bg-brand text-white !mx-4 rounded-xl'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Financials</span>
              </Link>
            </div>
          )}
        </div>

        {/* ANALYSIS Section */}
        <div className="!mb-6">
          <button
            onClick={() => toggleSection('analysis')}
            className="flex items-center justify-between w-full !px-6 !py-2 text-xs font-semibold text-gray-400 uppercase hover:text-gray-600"
          >
            <span>Analysis</span>
            <svg
              className={`w-4 h-4 transition-transform ${openSections.analysis ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openSections.analysis && (
            <div className="!mt-2">
              <Link
                to={`/clients/${clientId}/profitability`}
                className={`flex items-center !gap-3 !px-6 !py-2.5 text-sm ${
                  isActive(`/clients/${clientId}/profitability`)
                    ? 'bg-brand text-white !mx-4 rounded-xl'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Profitability Analysis</span>
              </Link>
              <Link
                to={`/clients/${clientId}/tax-computation`}
                className={`flex items-center !gap-3 !px-6 !py-2.5 text-sm ${
                  isActive(`/clients/${clientId}/tax-computation`)
                    ? 'bg-brand text-white !mx-4 rounded-xl'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Tax Computation</span>
              </Link>
            </div>
          )}
        </div>

        {/* COMPLIANCE Section */}
        <div className="!mb-6">
          <button
            onClick={() => toggleSection('compliance')}
            className="flex items-center justify-between w-full !px-6 !py-2 text-xs font-semibold text-gray-400 uppercase hover:text-gray-600"
          >
            <span>Compliance</span>
            <svg
              className={`w-4 h-4 transition-transform ${openSections.compliance ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openSections.compliance && (
            <div className="!mt-2">
              <Link
                to={`/clients/${clientId}/filings`}
                className={`flex items-center !gap-3 !px-6 !py-2.5 text-sm ${
                  isActive(`/clients/${clientId}/filings`)
                    ? 'bg-brand text-white !mx-4 rounded-xl'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Filings</span>
              </Link>
              <Link
                to={`/clients/${clientId}/evidence-vault`}
                className={`flex items-center !gap-3 !px-6 !py-2.5 text-sm ${
                  isActive(`/clients/${clientId}/evidence-vault`)
                    ? 'bg-brand text-white !mx-4 rounded-xl'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>Evidence Vault</span>
              </Link>
            </div>
          )}
        </div>

        {/* All Clients Link */}
        <Link
          to="/clients"
          className="flex items-center !gap-2 !px-6 !py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>All Clients</span>
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 flex-shrink-0">
        {/* Support */}
        <button className="flex items-center !gap-3 w-full !px-6 !py-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Support</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center !gap-3 !px-6 !py-4 border-t border-gray-200">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img src={Avatar} alt="Victor Asuquo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Victor Asuquo</p>
            <p className="text-xs text-gray-500 truncate">asuquo@gmail.com</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
