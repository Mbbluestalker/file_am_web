import { StatusBadge, ProgressBar } from '../common';
import { formatCurrency } from '../../utils/format';

const getReadinessColor = (status, r) => {
  if (status === 'overdue') return 'bg-red-400';
  if (r >= 90) return 'bg-green-500';
  if (r >= 60) return 'bg-orange-400';
  return 'bg-red-400';
};

const statusLabel = (s) =>
  s === 'submitted' ? 'Submitted' : s === 'overdue' ? 'Overdue' : s === 'in-progress' ? 'In Progress' : 'Ready';

const FilingCard = ({ filing, onClick }) => (
  <div onClick={onClick} className="px-6 py-5 hover:bg-gray-50 cursor-pointer transition-colors">
    {/* Title */}
    <div className="flex items-start justify-between mb-1">
      <div>
        <p className="font-semibold text-gray-900 text-sm">{filing.taxType} Return</p>
        <p className="text-xs text-gray-400 mt-0.5">Period: {filing.period}</p>
      </div>
      <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>

    {/* Badge */}
    <div className="flex flex-wrap gap-1.5 my-2.5">
      <StatusBadge status={filing.status} label={statusLabel(filing.status)} size="md" />
    </div>

    {/* Due Date + Amount */}
    <div className="flex items-start justify-between gap-4 mb-2">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Due Date</p>
        <p className="text-xs font-semibold text-gray-800">
          {filing.dueDate}
          {filing.daysRemaining != null && (
            <span className="font-normal text-gray-400 ml-1">({filing.daysRemaining} days)</span>
          )}
        </p>
      </div>
      <div className="min-w-0 text-right">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Amount</p>
        <p className="text-xs font-semibold text-gray-800">
          {filing.amount != null ? formatCurrency(filing.amount) : '—'}
        </p>
      </div>
    </div>

    {/* Readiness */}
    <div className="flex items-center justify-between mb-0.5">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Readiness</p>
      <p className="text-xs font-semibold text-gray-800">{filing.readiness}%</p>
    </div>
    <ProgressBar value={filing.readiness} color={getReadinessColor(filing.status, filing.readiness)} height="h-1.5" />
  </div>
);

export default FilingCard;
