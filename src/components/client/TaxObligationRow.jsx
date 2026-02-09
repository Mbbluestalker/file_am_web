/**
 * TAX OBLIGATION ROW COMPONENT
 *
 * Displays a single tax obligation entry in the table
 */
const TaxObligationRow = ({ taxType, description, dueDate, amount, status }) => {
  const getStatusBadge = () => {
    if (status === 'Completed') {
      return (
        <span className="!px-3 !py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
          Completed
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span className="!px-3 !py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded">
          Pending
        </span>
      );
    }
    return (
      <span className="!px-3 !py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
        In Progress
      </span>
    );
  };

  const getIcon = () => {
    if (status === 'Completed') {
      return (
        <div className="w-5 h-5 rounded-full border-2 border-green-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
    );
  };

  return (
    <div className="flex items-center !gap-6 !py-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      {/* Icon */}
      <div className="!pl-6">{getIcon()}</div>

      {/* Tax Type */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 !mb-0.5">{taxType}</h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>

      {/* Due Date */}
      <div className="w-24 text-sm text-gray-700">{dueDate}</div>

      {/* Amount */}
      <div className="w-32 text-sm font-semibold text-gray-900">{amount}</div>

      {/* Status */}
      <div className="w-32 !pr-6">{getStatusBadge()}</div>
    </div>
  );
};

export default TaxObligationRow;
