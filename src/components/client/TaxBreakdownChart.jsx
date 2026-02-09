/**
 * TAX BREAKDOWN CHART COMPONENT
 *
 * Displays tax breakdown with donut chart and legend
 * Note: This is a simplified version. For production, consider using a chart library like Chart.js or Recharts
 */
const TaxBreakdownChart = ({ data, total }) => {
  // Calculate percentages and angles for donut chart
  const chartData = data.map((item, index) => {
    const percentage = (item.amount / total) * 100;
    return {
      ...item,
      percentage,
    };
  });

  // Simple CSS-based donut chart using conic-gradient
  const getGradientString = () => {
    let currentAngle = 0;
    const gradients = chartData.map((item) => {
      const startAngle = currentAngle;
      const endAngle = currentAngle + (item.percentage * 3.6); // Convert percentage to degrees
      currentAngle = endAngle;
      return `${item.color} ${startAngle}deg ${endAngle}deg`;
    });
    return gradients.join(', ');
  };

  const formatCurrency = (amount) => {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 !p-6">
      <h3 className="text-lg font-bold text-gray-900 !mb-6">Tax Breakdown by Type</h3>

      <div className="flex flex-col items-center !gap-6">
        {/* Donut Chart */}
        <div className="relative">
          <div
            className="w-48 h-48 rounded-full"
            style={{
              background: `conic-gradient(${getGradientString()})`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(total)}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex flex-col !gap-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between !gap-4">
              <div className="flex items-center !gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
          <div className="!pt-2 border-t border-gray-200 flex items-center justify-between !gap-4">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxBreakdownChart;
