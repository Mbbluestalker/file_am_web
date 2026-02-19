import { useState, useEffect } from 'react';

/**
 * PROCESSING DOCUMENT MODAL
 *
 * Shows AI extraction progress with step-by-step tracking
 * Displays overall confidence and processing status
 */
const ProcessingDocumentModal = ({ isOpen, fileName, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, label: 'Document uploaded', status: 'completed' },
    { id: 2, label: 'OCR text extraction', status: 'pending' },
    { id: 3, label: 'Parsing invoice structure', status: 'pending' },
    { id: 4, label: 'Vendor identification', status: 'pending' },
    { id: 5, label: 'Amount & VAT extraction', status: 'pending' },
    { id: 6, label: 'Validation & compliance check', status: 'pending' },
    { id: 7, label: 'Ready for review', status: 'pending' },
  ];

  const [processSteps, setProcessSteps] = useState(steps);

  useEffect(() => {
    if (!isOpen) {
      // Reset when modal closes
      setProgress(0);
      setCurrentStep(0);
      setProcessSteps(steps);
      return;
    }

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Update current step based on progress
  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * steps.length);
    setCurrentStep(stepIndex);

    // Update step statuses
    setProcessSteps(
      steps.map((step, index) => ({
        ...step,
        status: index < stepIndex ? 'completed' : index === stepIndex ? 'processing' : 'pending',
      }))
    );
  }, [progress]);

  if (!isOpen) return null;

  const getStepIcon = (status) => {
    if (status === 'completed') {
      return (
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    if (status === 'processing') {
      return (
        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      );
    }
    return <div className="w-5 h-5 bg-gray-200 rounded-full" />;
  };

  const overallConfidence = Math.min(progress, 95);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded">PDF</div>
            <h2 className="text-xl font-bold text-gray-900">Processing Document</h2>
          </div>
          <p className="text-sm text-gray-500">AI is extracting and validating invoice data</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-teal-600">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Processing Steps */}
          <div className="space-y-3 mb-6">
            {processSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                {getStepIcon(step.status)}
                <span
                  className={`text-sm ${
                    step.status === 'completed'
                      ? 'text-gray-900 font-medium'
                      : step.status === 'processing'
                      ? 'text-orange-700 font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Confidence Banner */}
          <div
            className={`rounded-lg p-4 ${
              overallConfidence >= 90
                ? 'bg-green-50 border border-green-200'
                : overallConfidence >= 75
                ? 'bg-orange-50 border border-orange-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Overall Confidence: {overallConfidence}%</span>
            </div>
            {progress >= 100 ? (
              <p className="text-xs text-gray-600">
                {overallConfidence >= 90
                  ? 'High confidence extraction - minimal review needed'
                  : 'Extraction complete - please review carefully'}
              </p>
            ) : (
              <p className="text-xs text-gray-400">Processing backend takes 5-10 seconds do not close this window</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingDocumentModal;
