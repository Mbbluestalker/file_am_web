/**
 * STEP WRAPPER COMPONENT
 *
 * Reusable wrapper for onboarding steps with error handling and loading states
 */
function StepWrapper({
  children,
  error,
  isLoading,
  onBack,
  onSaveDraft,
  onSubmit,
  submitLabel = 'Save & Continue',
  showBack = false,
  title,
  description
}) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-12 py-6">
        <div className="flex justify-end">
          <span className="text-sm text-gray-500">Account Setup</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-12 py-8">
        <div className="max-w-4xl">
          {/* Title */}
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-gray-500">{description}</p>
              )}
            </div>
          )}

          {/* Children Content */}
          {children}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200 px-12 py-6">
        <div className="max-w-4xl flex justify-between">
          {showBack ? (
            <button
              onClick={onBack}
              disabled={isLoading}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3">
            {onSaveDraft && (
              <button
                onClick={onSaveDraft}
                disabled={isLoading}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save as Draft
              </button>
            )}
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Saving...' : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepWrapper;
