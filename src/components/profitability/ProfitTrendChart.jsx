const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ProfitTrendChart = ({ data = [] }) => {
  const chartData = data.length > 0
    ? data.map((d) => ({ month: MONTHS[d.month - 1] || '', value: d.value }))
    : MONTHS.map((m) => ({ month: m, value: 0 }));

  const maxVal = Math.max(...chartData.map((d) => Math.abs(d.value)), 1);
  const W = 600;
  const H = 200;
  const hasNeg = chartData.some((d) => d.value < 0);
  const minY = hasNeg ? -maxVal : 0;
  const range = maxVal - minY;

  const path = chartData
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${(i / (chartData.length - 1)) * W},${H - ((d.value - minY) / range) * H}`)
    .join(' ');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h4 className="text-sm font-bold text-gray-900 mb-4">Profit Trend</h4>
      <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line key={pct} x1="0" y1={H - pct * H} x2={W} y2={H - pct * H} stroke="#f3f4f6" strokeWidth="1" />
        ))}
        {hasNeg && (
          <line x1="0" y1={H - ((0 - minY) / range) * H} x2={W} y2={H - ((0 - minY) / range) * H} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
        )}
        <path d={path} fill="none" stroke="#0d9488" strokeWidth="2.5" />
        {chartData.map((d, i) => (
          <circle key={i} cx={(i / (chartData.length - 1)) * W} cy={H - ((d.value - minY) / range) * H} r="3" fill={d.value >= 0 ? '#0d9488' : '#ef4444'} />
        ))}
        {chartData.map((d, i) => (
          <text key={d.month} x={(i / (chartData.length - 1)) * W} y={H + 20} textAnchor="middle" className="fill-gray-400 text-[10px]">
            {d.month}
          </text>
        ))}
      </svg>
      <div className="flex items-center gap-1.5 mt-3">
        <div className="w-3 h-0.5 bg-teal-500 rounded" />
        <span className="text-xs text-gray-500">Profit</span>
      </div>
    </div>
  );
};

export default ProfitTrendChart;
