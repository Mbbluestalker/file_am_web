const TurnoverBarChart = ({ data = [], totalTurnover = 0, thresholdPercentage = 0, formatCurrency, computationResults }) => {
  if (!data || data.length === 0) return null;
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-8">
      <div className="flex items-end justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Rolling 12-Month Turnover</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalTurnover)}</div>
          <div className="text-sm text-gray-500">{thresholdPercentage}% of threshold</div>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(parseFloat(thresholdPercentage), 100)}%` }} />
      </div>

      <div className="relative h-64 ml-12">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {data.map((d, i) => {
            const pct = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-end justify-center mb-2" style={{ height: '200px' }}>
                  <div className="w-full bg-blue-900 rounded-t transition-all hover:bg-blue-800" style={{ height: `${pct}%` }} title={`${d.label}: ${formatCurrency(d.amount)}`} />
                </div>
                <span className="text-xs text-gray-600 mt-2">{d.label?.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-12 w-10 text-right">
          {[1, 0.8, 0.6, 0.4, 0.2, 0].map((f) => (
            <span key={f}>{f === 0 ? '0' : formatCurrency(maxAmount * f)}</span>
          ))}
        </div>
      </div>

      {computationResults && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Latest VAT Computation</h4>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Sales VAT</p>
              <p className="text-xl font-bold text-gray-900">₦{computationResults.salesVat?.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Purchase VAT</p>
              <p className="text-xl font-bold text-gray-900">₦{computationResults.purchaseVat?.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Net VAT Payable</p>
              <p className="text-xl font-bold text-green-600">₦{computationResults.netVatPayable?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnoverBarChart;
