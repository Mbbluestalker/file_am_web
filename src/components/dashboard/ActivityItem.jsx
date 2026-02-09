/**
 * ACTIVITY ITEM COMPONENT
 *
 * Displays a single activity entry with icon, company name, action description, and timestamp
 */
const ActivityItem = ({ iconType, company, action, timestamp }) => {
  const getIcon = () => {
    switch (iconType) {
      case 'document':
        return {
          icon: (
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          bg: 'bg-orange-50'
        };
      case 'check':
        return {
          icon: (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bg: 'bg-blue-50'
        };
      case 'message':
        return {
          icon: (
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
          bg: 'bg-orange-50'
        };
      default:
        return {
          icon: null,
          bg: 'bg-gray-50'
        };
    }
  };

  const { icon, bg } = getIcon();

  return (
    <div className="flex items-center justify-between !py-5 !px-6 hover:bg-gray-50 transition-colors">
      {/* Left side: Icon and content */}
      <div className="flex items-center !gap-3">
        {/* Icon */}
        <div className={`${bg} !p-2.5 rounded-lg flex-shrink-0`}>
          {icon}
        </div>

        {/* Company and Action */}
        <div className="flex flex-col !gap-1">
          <h4 className="text-sm font-semibold text-gray-900">{company}</h4>
          <p className="text-sm text-gray-400">{action}</p>
        </div>
      </div>

      {/* Right side: Timestamp */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{timestamp}</span>
      </div>
    </div>
  );
};

export default ActivityItem;
