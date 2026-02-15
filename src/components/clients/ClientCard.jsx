import { Link } from 'react-router-dom';

/**
 * CLIENT CARD COMPONENT
 *
 * Displays a single client card with logo, approval status, and filing information
 */
const ClientCard = ({
  id,
  name,
  registrationNumber,
  logo,
  approvalStatus,
  vatStatus,
  nextFiling,
}) => {
  const getStatusBadge = () => {
    if (approvalStatus === 'active') {
      return (
        <div className="flex items-center !gap-1.5 !px-3 !py-1.5 bg-green-50 text-green-700 rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Active</span>
        </div>
      );
    }
    return (
      <div className="flex items-center !gap-1.5 !px-3 !py-1.5 bg-orange-50 text-orange-700 rounded-full">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-medium">Pending Approval</span>
      </div>
    );
  };

  const getVatStatusColor = () => {
    if (vatStatus === 'Registered') return 'bg-gray-50 text-gray-700';
    if (vatStatus === 'Pending') return 'bg-orange-50 text-orange-700';
    return 'bg-gray-50 text-gray-700';
  };

  return (
    <Link
      to={`/clients/${id}`}
      className="block bg-white rounded-2xl border border-gray-200 !p-6 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      {/* Header with Status Badge */}
      <div className="flex items-start justify-between !mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {logo ? (
            <img src={logo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-lg font-semibold">
              {name.charAt(0)}
            </span>
          )}
        </div>
        {getStatusBadge()}
      </div>

      {/* Company Info */}
      <div className="!mb-6">
        <div className="flex items-start justify-between !gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 !mb-1 truncate">
              {name}
            </h3>
            <p className="text-sm text-gray-400">{registrationNumber}</p>
          </div>
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 !mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex items-center !gap-3">
        <div className="flex flex-col !gap-1 !px-2.5 !py-2 rounded bg-vat-bg">
          <span className="text-xs text-gray-400">VAT</span>
          <span className={`text-xs font-medium ${vatStatus === 'Pending' ? 'text-orange-700' : 'text-gray-700'}`}>
            {vatStatus}
          </span>
        </div>
        {nextFiling && (
          <div className="flex flex-col !gap-1 !px-2.5 !py-2 rounded bg-filing-bg">
            <span className="text-xs text-gray-400">Next Filing</span>
            <span className="text-xs font-medium text-gray-700">
              {nextFiling}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ClientCard;
