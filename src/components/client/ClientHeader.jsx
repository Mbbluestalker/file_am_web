/**
 * CLIENT HEADER COMPONENT
 *
 * Displays client name, logo, and VAT status badge
 */
const ClientHeader = ({ name, logo, vatRequired }) => {
  return (
    <div className="flex items-center !gap-4 !mb-10">
      {/* Logo */}
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        {logo ? (
          <img src={logo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-2xl font-semibold">
            {name.charAt(0)}
          </span>
        )}
      </div>

      {/* Name and Badge */}
      <div className="flex items-center !gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
        {vatRequired && (
          <div className="flex items-center !gap-1.5 !px-3 !py-1.5 bg-success-bg text-success-text rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">VAT Required</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientHeader;
