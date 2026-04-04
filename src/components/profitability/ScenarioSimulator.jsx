import { formatCurrencyShort } from '../../utils/format';

const PARAMS = [
  { label: 'Revenue Increase %', key: 'revenueIncrease', max: 50, suffix: '%' },
  { label: 'Expense Reduction %', key: 'expenseReduction', max: 30, suffix: '%' },
  { label: 'Employee Count', key: 'employeeCount', max: 100, suffix: '' },
];

const ScenarioSimulator = ({ params, onParamsChange, baseRevenue = 0, baseExpenses = 0, onReset }) => {
  const projectedRevenue = baseRevenue * (1 + params.revenueIncrease / 100);
  const projectedExpenses = baseExpenses * (1 - params.expenseReduction / 100);
  const projectedProfit = projectedRevenue - projectedExpenses;
  const projectedMargin = projectedRevenue ? ((projectedProfit / projectedRevenue) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Adjust Parameters</p>
        {PARAMS.map((p) => (
          <div key={p.key} className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">{p.label}</span>
              <span className="text-sm font-semibold text-gray-900">{params[p.key]}{p.suffix}</span>
            </div>
            <input
              type="range"
              min="0"
              max={p.max}
              value={params[p.key]}
              onChange={(e) => onParamsChange({ ...params, [p.key]: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-teal-600"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Projected Outcomes</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 mb-1">Projected Revenue</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrencyShort(projectedRevenue)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 mb-1">Projected Profit</p>
            <p className="text-sm font-bold text-green-600">{formatCurrencyShort(projectedProfit)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-teal-50 rounded-lg px-4 py-3">
          <span className="text-sm text-teal-700">Projected Margin</span>
          <span className="text-sm font-bold text-teal-700">{projectedMargin}%</span>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
      >
        Reset All Values
      </button>
    </div>
  );
};

export default ScenarioSimulator;
