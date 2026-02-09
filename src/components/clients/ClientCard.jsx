import { Link } from 'react-router-dom';

/**
 * CLIENT CARD COMPONENT
 *
 * Displays a single client card with logo, risk status, and filing information
 */
const ClientCard = ({
  id,
  name,
  registrationNumber,
  logo,
  riskLevel,
  vatStatus,
  nextFiling,
}) => {
  const getRiskBadge = () => {
    if (riskLevel === 'low') {
      return (
        <div className="flex items-center !gap-1.5 !px-3 !py-1.5 bg-green-50 text-green-700 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium">Low Risk</span>
        </div>
      );
    }
    return (
      <div className="flex items-center !gap-1.5 !px-3 !py-1.5 bg-red-50 text-red-700 rounded-full">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-medium">High Risk</span>
      </div>
    );
  };

  const getVatStatusColor = () => {
    if (vatStatus === 'Registered') return 'bg-gray-100 text-gray-700';
    if (vatStatus === 'Pending') return 'bg-orange-50 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <Link
      to={`/clients/${id}`}
      className="block bg-white rounded-2xl border border-gray-200 !p-6 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      {/* Header with Logo and Risk Badge */}
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
        {getRiskBadge()}
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
        <div className="flex flex-col !gap-1">
          <span className="text-xs text-gray-400">VAT</span>
          <span className={`text-xs font-medium !px-2.5 !py-1 rounded ${getVatStatusColor()}`}>
            {vatStatus}
          </span>
        </div>
        {nextFiling && (
          <div className="flex flex-col !gap-1">
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
