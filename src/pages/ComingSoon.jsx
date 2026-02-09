import { useNavigate, useLocation } from 'react-router-dom';

/**
 * COMING SOON PAGE
 *
 * Placeholder page for features under development
 */
const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract feature name from path
  const getFeatureName = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    // Convert kebab-case to Title Case
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center !px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center !mb-6">
          <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 !mb-3">
          {getFeatureName()}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 !mb-2">Coming Soon</p>

        {/* Description */}
        <p className="text-sm text-gray-500 !mb-8">
          We're working hard to bring you this feature. Check back soon!
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center !gap-4">
          <button
            onClick={() => navigate(-1)}
            className="!px-6 !py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/clients')}
            className="!px-6 !py-3 bg-brand text-white rounded-xl hover:bg-brand-600 transition-colors text-sm font-medium"
          >
            Go to Clients
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="!mt-12 !pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400 !mb-4">Development Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-brand h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
