import { StatusBadge, ProgressBar } from '../common';
import { formatCurrency } from '../../utils/format';

const getReadinessColor = (status, r) => {
  if (status === 'overdue') return 'bg-red-400';
  if (r >= 90) return 'bg-green-500';
  if (r >= 60) return 'bg-orange-400';
  return 'bg-red-400';
};

const statusLabel = (s) =>
  s === 'submitted' ? 'Submitted' : s === 'overdue' ? 'Overdue' : s === 'in-progress' ? 'In Progress' : 'Ready to File';

// Risk level derived from readiness (backend doesn't return a risk field)
const getRiskLevel = (readiness) => {
  if (readiness == null) return null;
  if (readiness >= 80) return { label: 'Low Risk', tone: 'bg-green-50 text-green-700 border-green-200' };
  if (readiness >= 40) return { label: 'Medium Risk', tone: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { label: 'High Risk', tone: 'bg-red-50 text-red-700 border-red-200' };
};

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

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

    {/* Badges */}
    <div className="flex flex-wrap gap-1.5 my-2.5">
      <StatusBadge status={filing.status} label={statusLabel(filing.status)} size="md" />
      {(() => {
        const risk = getRiskLevel(filing.readiness);
        return risk ? (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${risk.tone}`}>
            <ShieldIcon className="w-3 h-3" />
            {risk.label}
          </span>
        ) : null;
      })()}
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
      <p className="text-xs font-semibold text-gray-800">
        {filing.readiness}%
        {filing.completionMet != null && filing.completionTotal != null && (
          <span className="font-normal text-gray-400 ml-1">({filing.completionMet}/{filing.completionTotal})</span>
        )}
      </p>
    </div>
    <ProgressBar value={filing.readiness} color={getReadinessColor(filing.status, filing.readiness)} height="h-1.5" />
  </div>
);

export default FilingCard;
