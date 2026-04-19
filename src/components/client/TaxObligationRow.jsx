import { formatCurrency, formatDate } from '../../utils/format';

const isCompletedStatus = (s) => s === 'Completed' || s === 'Filed';

const TaxObligationRow = ({ taxType, dueDate, amount, status }) => {
  const getStatusBadge = () => {
    if (isCompletedStatus(status)) {
      return (
        <span className="!px-3 !py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
          {status}
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
        {status || 'In Progress'}
      </span>
    );
  };

  const getIcon = () => {
    if (isCompletedStatus(status)) {
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
    <div className="flex items-center !gap-6 !py-5 !px-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="w-5 flex-shrink-0">{getIcon()}</div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900">{taxType}</h4>
      </div>

      <div className="w-24 text-sm text-gray-700">
        {formatDate(dueDate, { day: '2-digit', month: 'short', year: 'numeric' })}
      </div>

      <div className="w-32 text-sm font-semibold text-gray-900">{formatCurrency(amount)}</div>

      <div className="w-32">{getStatusBadge()}</div>
    </div>
  );
};

export default TaxObligationRow;
