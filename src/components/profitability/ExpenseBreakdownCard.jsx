import { formatCurrencyShort } from '../../utils/format';
import { ProgressBar } from '../common';

const ExpenseBreakdownCard = ({ expenses = [] }) => {
  const total = expenses.reduce((sum, e) => sum + e.total, 0) || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h4 className="text-sm font-bold text-gray-900 mb-4">Expense Breakdown</h4>
      <div className="space-y-4">
        {expenses.map((row) => (
          <div key={row.category}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">{row.category}</span>
              <span className="text-sm font-semibold text-gray-900">{formatCurrencyShort(row.total)}</span>
            </div>
            <ProgressBar value={Math.round((row.total / total) * 100)} />
          </div>
        ))}
        {expenses.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No expense data</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseBreakdownCard;
