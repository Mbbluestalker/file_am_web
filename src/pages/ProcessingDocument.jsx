import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';

const STEPS = [
  { id: 1, label: 'Document uploaded' },
  { id: 2, label: 'OCR text extraction' },
  { id: 3, label: 'Parsing invoice structure' },
  { id: 4, label: 'Vendor identification' },
  { id: 5, label: 'Amount & VAT extraction' },
  { id: 6, label: 'Validation & compliance check' },
  { id: 7, label: 'Ready for review' },
];

const CONFIDENCE = 92;

const ProcessingDocument = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { documentId } = location.state || {};

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        const targetId = documentId || 'latest';
        navigate(`/clients/${clientId}/financials/review/${targetId}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [progress, clientId, documentId, navigate]);

  const getStepStatus = (stepIndex) => {
    if (progress >= 100) return 'completed';
    // Step 1 (index 0) always completed since upload is done
    // Steps 2-7 (indices 1-6) mapped across 0-100%
    const remainingSteps = 6;
    const stepProgress = (progress / 100) * remainingSteps;
    const completedCount = Math.floor(stepProgress);

    if (stepIndex === 0) return 'completed';
    const relativeIndex = stepIndex - 1; // 0-5 for steps 2-7
    if (relativeIndex < completedCount) return 'completed';
    if (relativeIndex === completedCount) return 'processing';
    return 'pending';
  };

  const StepIcon = ({ status }) => {
    if (status === 'completed') {
      return (
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
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
        <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        </div>
      );
    }
    return <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0" />;
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={clientId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 flex items-center justify-center bg-white">
          <div className="w-full max-w-[520px] px-6 text-center">

            {/* PDF File Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <svg className="w-14 h-18 text-gray-300" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 224H88c30.9 0 56 25.1 56 56s-25.1 56-56 56H80v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm24 80c13.3 0 24-10.7 24-24s-10.7-24-24-24H80v48h8zm72-64c0-8.8 7.2-16 16-16H208c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H176c-8.8 0-16-7.2-16-16V240zm32 112h16c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H192v96zm96-128h48c8.8 0 16 7.2 16 16s-7.2 16-16 16H288v32h40c8.8 0 16 7.2 16 16s-7.2 16-16 16H288v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V240c0-8.8 7.2-16 16-16z"/>
                </svg>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  PDF
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Document</h1>
            <p className="text-sm text-gray-500 mb-8">AI is extracting and validating invoice data</p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-teal-600">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left space-y-4">
              {STEPS.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <div key={step.id} className="flex items-center gap-3">
                    <StepIcon status={status} />
                    <span
                      className={`text-sm ${
                        status === 'completed'
                          ? 'text-gray-900 font-medium'
                          : status === 'processing'
                          ? 'text-orange-700 font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Confidence Banner */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
              <p className="text-sm font-semibold text-green-800 mb-1">
                Overall Confidence: {CONFIDENCE}%
              </p>
              <p className="text-xs text-green-700">
                High confidence extraction - minimal review needed
              </p>
            </div>

            {/* Note */}
            <p className="text-xs text-gray-400">
              Processing typically takes 5-10 seconds. Do not close this window.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProcessingDocument;
