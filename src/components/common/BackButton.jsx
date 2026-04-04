/**
 * BACK BUTTON
 *
 * Props:
 * - label (string) — display text
 * - onClick (function)
 */
const BackButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    {label}
  </button>
);

export default BackButton;
