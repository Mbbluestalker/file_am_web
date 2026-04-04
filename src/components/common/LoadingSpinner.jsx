/**
 * LOADING SPINNER
 *
 * Props:
 * - size ('sm' | 'md' | 'lg') — spinner size
 * - fullHeight (boolean) — center vertically in full container
 * - message (string) — optional loading text
 */
const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-10 w-10' };

const LoadingSpinner = ({ size = 'lg', fullHeight = false, message }) => (
  <div className={`flex flex-col items-center justify-center ${fullHeight ? 'h-full' : 'py-20'}`}>
    <svg className={`animate-spin ${sizes[size]} text-teal-600`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    {message && <p className="text-sm text-gray-500 mt-3">{message}</p>}
  </div>
);

export default LoadingSpinner;
