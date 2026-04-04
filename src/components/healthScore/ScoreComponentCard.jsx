import { ProgressBar } from '../common';

const ScoreComponentCard = ({ index, label, score, weight, status, statusColor, details, riskFactor, barColor }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">{index}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor}`}>{status}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Weight: {weight}</p>
        </div>
      </div>
      <span className="text-2xl font-bold text-gray-900">{score}<span className="text-sm text-gray-400">/100</span></span>
    </div>
    <div className="mb-4">
      <ProgressBar value={score} color={barColor} height="h-2.5" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Key Factors</p>
        <p className="text-xs text-gray-600">{details}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Risk Factor</p>
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 inline-block">{riskFactor}</p>
      </div>
    </div>
  </div>
);

export default ScoreComponentCard;
