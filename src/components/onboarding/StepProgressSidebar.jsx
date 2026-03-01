import logo from '../../assets/Logo.png';

/**
 * STEP PROGRESS SIDEBAR
 *
 * Shows progress through onboarding steps
 * Displays current step and completed steps
 */
function StepProgressSidebar({ steps, currentStep, isReviewStep }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-5">
      {/* Logo */}
      <div className="mb-8">
        <img src={logo} alt="FileAm Finance" className="h-7" />
      </div>

      {/* Setup Progress Header */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-900">Setup Progress</h3>
      </div>

      {/* Steps List */}
      <div className="space-y-1">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep && !isReviewStep;
          const isCompleted = step.id < currentStep || isReviewStep;

          return (
            <div
              key={step.id}
              className={`
                flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors
                ${isActive ? 'bg-blue-50' : ''}
              `}
            >
              {/* Step Number/Check */}
              <div
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                  ${isActive ? 'bg-blue-600 text-white' : ''}
                  ${isCompleted ? 'bg-blue-600 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-100 text-gray-400' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>

              {/* Step Title */}
              <div
                className={`
                  text-xs flex-1
                  ${isActive ? 'text-gray-900 font-medium' : ''}
                  ${isCompleted ? 'text-gray-600' : ''}
                  ${!isActive && !isCompleted ? 'text-gray-400' : ''}
                `}
              >
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepProgressSidebar;
