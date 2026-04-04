const VatStatusBanner = ({ color, badge, badgeColor, title, description, onViewBreakdown }) => (
  <div className={`${color} text-white rounded-xl p-6 mb-8`}>
    <div className="flex items-start justify-between mb-3">
      <h2 className="text-xl font-bold">{title}</h2>
      <span className={`${badgeColor} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5`}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
        {badge}
      </span>
    </div>
    <p className="text-white text-sm leading-relaxed mb-4">{description}</p>
    {onViewBreakdown && (
      <button onClick={onViewBreakdown} className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
        View Computation Breakdown
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )}
  </div>
);

export default VatStatusBanner;
