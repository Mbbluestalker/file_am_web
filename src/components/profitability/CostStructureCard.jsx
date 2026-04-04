import { formatCurrencyShort } from '../../utils/format';

const CostStructureCard = ({ items = [] }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h4 className="text-sm font-bold text-gray-900 mb-4">Revenue vs Cost Structure</h4>
    <div className="space-y-3">
      {items.map((row) => (
        <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
          <span className="text-sm text-gray-600">{row.label}</span>
          <span className={`text-sm font-semibold ${row.color}`}>{formatCurrencyShort(row.amount)}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CostStructureCard;
