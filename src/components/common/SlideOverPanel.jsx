/**
 * SLIDE OVER PANEL
 * Right-side drawer with backdrop overlay.
 *
 * Props:
 * - open (boolean)
 * - onClose (function)
 * - title (string)
 * - children (ReactNode)
 * - width (string) — Tailwind width class
 */
const SlideOverPanel = ({ open, onClose, title, children, width = 'w-96' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div className={`${width} bg-white h-full shadow-xl overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlideOverPanel;
