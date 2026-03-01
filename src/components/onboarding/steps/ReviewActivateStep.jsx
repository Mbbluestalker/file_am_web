/**
 * REVIEW & ACTIVATE STEP
 *
 * Final step - Review all information and activate account
 */
function ReviewActivateStep({ data, onBack, onEdit, onActivate }) {
  const steps = [
    {
      id: 1,
      title: 'Firm Identity & Legal Structure',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Partners & Ownership',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Scope of Practice & Expertise',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Subscription & Service Calendar',
      status: 'Completed'
    },
    {
      id: 5,
      title: 'Payment Collection Setup',
      status: 'Completed'
    },
    {
      id: 6,
      title: 'Compliance & Verification',
      status: 'Completed'
    }
  ];

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
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Review & Activate
            </h1>
            <p className="text-gray-500">
              Review your information before activating your account
            </p>
          </div>

          {/* Setup Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-6">
              Setup Summary
            </h3>

            <div className="space-y-4">
              {steps.map(step => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{step.title}</div>
                      <div className="text-sm text-gray-500">{step.status}</div>
                    </div>
                  </div>
                  {/* Optionally add edit button */}
                </div>
              ))}
            </div>
          </div>

          {/* Verification in Progress */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Verification in Progress</h4>
                <p className="text-sm text-blue-800">
                  Your documents will be reviewed within 24-48 hours. You'll receive full platform access immediately,
                  with compliance badge pending verification approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200 px-12 py-6">
        <div className="max-w-4xl flex justify-between">
          <button
            onClick={() => onEdit(7)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit Information
          </button>
          <button
            onClick={onActivate}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Activate Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewActivateStep;
