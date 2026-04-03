/**
 * CONFIRM MODAL
 *
 * Reusable confirmation dialog.
 *
 * Props:
 * - open (boolean) — show/hide
 * - onClose () — called on cancel / backdrop click
 * - onConfirm () — called on confirm button click
 * - title (string) — heading text
 * - message (string|ReactNode) — body content
 * - confirmLabel (string) — confirm button text (default: "Confirm")
 * - cancelLabel (string) — cancel button text (default: "Cancel")
 * - isLoading (boolean) — shows spinner on confirm button
 * - variant ("warning"|"danger"|"info") — icon color theme
 */
const iconConfig = {
  warning: { bg: 'bg-amber-100', color: 'text-amber-600' },
  danger: { bg: 'bg-red-100', color: 'text-red-600' },
  info: { bg: 'bg-teal-100', color: 'text-teal-600' },
};

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'warning',
}) => {
  if (!open) return null;

  const icon = iconConfig[variant] || iconConfig.warning;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className={`w-12 h-12 rounded-full ${icon.bg} flex items-center justify-center mx-auto mb-3`}>
            <svg className={`w-6 h-6 ${icon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          {message && (
            <div className="text-sm text-gray-500">{message}</div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
