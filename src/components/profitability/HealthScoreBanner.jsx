import { formatCurrencyShort } from '../../utils/format';

const HealthScoreBanner = ({ score = 0, revenue = 0, expenses = 0, netProfit = 0, revenueTrend, onViewAnalysis }) => {
  const healthLabel = score >= 80 ? 'Healthy' : score >= 60 ? 'Stable' : score >= 40 ? 'At Risk' : 'Failing';
  // Needle angle: maps score 0-100 to angle range for the gauge
  const needleAngle = (score / 100) * 180;
  // Convert to radians for needle endpoint (0° = left, 180° = right)
  const needleRad = ((180 - needleAngle) * Math.PI) / 180;
  const cx = 547.8, cy = 264.7, needleLen = 42;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy - needleLen * Math.sin(needleRad);

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8" style={{ backgroundColor: '#065F46' }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Decorative background SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1110 266" preserveAspectRatio="xMidYMid slice" fill="none">
        <path d="M681.989 -138.533C641.805 -164.303 598.753 -186.919 553.341 -202C557.119 -192.041 560.368 -181.85 563.099 -171.531L561.882 -171.69C562.633 -171.415 563.099 -170.981 563.374 -170.42L563.871 -168.547C564.03 -167.086 563.988 -165.435 564.94 -164.197L564.951 -164.144C588.244 -45.6773 519.147 105.322 419.719 160.386C425.614 169.064 459.353 187.764 464.644 183.827C600.838 82.3356 612.913 -32.8506 610.945 -132.194C620.808 -126.987 630.534 -121.495 640.091 -115.78L642.43 -114.393L642.588 -111.684C652.092 47.4432 588.773 153.57 444.981 222.318L442.716 223.387L440.473 222.286C391.875 198.263 346.95 168.101 313.105 127.314C320.387 79.6052 372.953 14.9849 424.609 12.6143C437.89 -5.77913 439.224 -8.47781 447.627 -29.3582C371.863 -35.0308 309.835 23.0598 282.975 82.3356C274.996 97.9351 268.688 114.222 264 131.102C307.549 195.077 372.9 237.399 442.378 269C625.454 189.32 701.282 57.1902 681.989 -138.533Z" fill="white" />
      </svg>

      <div className="relative p-8">
        {/* Top row: Score left, Revenue cards right */}
        <div className="flex justify-between items-start">
          {/* Left — Score */}
          <div className="flex items-baseline gap-1">
            <span className="text-[120px] font-bold leading-none tracking-tight" style={{ color: '#84BD32' }}>{score}</span>
            <span className="text-4xl font-medium" style={{ color: '#FBFBFB' }}>/100</span>
          </div>

          {/* Right — Link + Revenue cards */}
          <div className="flex flex-col items-end gap-3">
            <button onClick={onViewAnalysis} className="text-xs font-medium transition-colors" style={{ color: '#84BD32' }}>
              View Full Analysis →
            </button>
            <div className="space-y-2 min-w-[310px]">
              <div className="flex items-center justify-between rounded-lg px-5 py-3" style={{ backgroundColor: '#FBFFD6' }}>
                <span className="text-sm text-gray-800">Revenue</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{formatCurrencyShort(revenue)}</span>
                  {revenueTrend && (
                    <span className="text-xs font-semibold flex items-center gap-0.5" style={{ color: '#10B981' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M12.62 2.18L7.66 7.14L4.75 4.22L0.96 8.01" stroke="#10B981" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.12 2.18H12.62V5.68" stroke="#10B981" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {revenueTrend}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg px-5 py-3" style={{ backgroundColor: '#FBFFD6' }}>
                <span className="text-sm text-gray-800">Expenses</span>
                <span className="text-sm font-bold text-gray-900">({formatCurrencyShort(expenses)})</span>
              </div>
              <div className="flex items-center justify-between rounded-lg px-5 py-3" style={{ backgroundColor: '#FBFFD6' }}>
                <span className="text-sm text-gray-800">Net Profit</span>
                <span className="text-sm font-bold text-gray-900">({formatCurrencyShort(netProfit)})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gauge — sits on the bottom edge, centered between score and cards */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/4 w-28">
          <svg viewBox="489 200 118 72" className="w-full">
            <path d="M489.907 264.709C489.907 257.107 491.404 249.579 494.314 242.555C497.223 235.532 501.487 229.15 506.863 223.774L547.798 264.709H489.907Z" fill="#FF5656" />
            <path d="M506.863 223.774C512.238 218.399 518.62 214.134 525.644 211.225L547.798 264.709L506.863 223.774Z" fill="#FF8888" />
            <path d="M525.644 211.225C532.668 208.316 540.195 206.818 547.798 206.818L547.798 264.709L525.644 211.225Z" fill="#FEE114" />
            <path d="M547.798 206.818C555.4 206.818 562.928 208.316 569.952 211.225L547.798 264.709L547.798 206.818Z" fill="#D1D80F" />
            <path d="M569.952 211.225C576.975 214.134 583.357 218.399 588.733 223.774L547.798 264.709L569.952 211.225Z" fill="#84BD32" />
            <path d="M588.733 223.774C594.108 229.15 598.372 235.532 601.282 242.555L547.798 264.709L588.733 223.774Z" fill="#30AD43" />
            <path d="M599.811 265.299C599.811 251.504 594.331 238.274 584.577 228.52C574.823 218.765 561.593 213.285 547.798 213.285C534.003 213.285 520.773 218.765 511.019 228.52C501.264 238.274 495.784 251.504 495.784 265.299L547.798 265.299H599.811Z" fill="url(#gaugeGrad)" />
            <polygon points={`${nx},${ny} ${cx - 3},${cy + 2} ${cx + 3},${cy + 2}`} fill="#323232" />
            <circle cx={cx} cy={cy} r="5" fill="#323232" stroke="white" strokeWidth="1" />
            <defs>
              <linearGradient id="gaugeGrad" x1={cx} y1="213" x2={cx} y2="317" gradientUnits="userSpaceOnUse">
                <stop stopColor="#84BD32" />
                <stop offset="0.49" stopColor="white" />
              </linearGradient>
            </defs>
            {/* Health label near needle tip */}
            <foreignObject x={nx - 30} y={ny - 20} width="60" height="18">
              <div className="flex justify-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold text-white" style={{ backgroundColor: '#84BD32' }}>
                  {healthLabel}
                </span>
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreBanner;
