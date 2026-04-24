import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { uploadInvoice } from '../services/financialsApi';

const STEPS = [
  { id: 1, label: 'Document uploaded' },
  { id: 2, label: 'OCR text extraction' },
  { id: 3, label: 'Parsing invoice structure' },
  { id: 4, label: 'Vendor identification' },
  { id: 5, label: 'Amount & VAT extraction' },
  { id: 6, label: 'Validation & compliance check' },
  { id: 7, label: 'Ready for review' },
];

const PROGRESS_CAP_WHILE_WAITING = 95;
const TICK_MS = 120;
const STEP_MS = 80;

const ProcessingDocument = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { file, fileName } = location.state || {};

  const [progress, setProgress] = useState(0);
  const [apiDone, setApiDone] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const hasStarted = useRef(false);

  // Kick off the real upload + extraction exactly once
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    if (!file || !clientId) {
      setApiError('No file to process. Please upload again.');
      setApiDone(true);
      return;
    }

    uploadInvoice(clientId, file)
      .then((response) => {
        if (response?.errors && response.errors.length > 0) {
          setApiError(`Extraction warnings: ${response.errors.join(', ')}`);
        }
        setApiResult(response || null);
      })
      .catch((err) => {
        setApiError(err?.message || 'Upload failed');
      })
      .finally(() => setApiDone(true));
  }, [file, clientId]);

  // Animate progress while waiting for API
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Hold at the cap until API finishes, then run to 100
        const ceiling = apiDone && !apiError ? 100 : PROGRESS_CAP_WHILE_WAITING;
        if (prev >= ceiling) return prev;
        const step = apiDone ? 4 : 1;
        return Math.min(ceiling, prev + step);
      });
    }, apiDone ? STEP_MS : TICK_MS);
    return () => clearInterval(interval);
  }, [apiDone, apiError]);

  // Navigate on success when both API and animation have finished
  useEffect(() => {
    if (apiError) return;
    if (!apiDone || progress < 100 || !apiResult) return;
    if (!apiResult.documentId) {
      setApiError('Document could not be saved. Please try again.');
      return;
    }
    const timer = setTimeout(() => {
      navigate(`/clients/${clientId}/financials/review/${apiResult.documentId}`, {
        state: {
          fileName: fileName || file?.name,
          transactions: apiResult.transactions,
          count: apiResult.count,
          summary: apiResult.summary,
        },
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [apiDone, progress, apiResult, apiError, navigate, clientId, fileName, file]);

  const getStepStatus = (stepIndex) => {
    if (apiError) {
      // Freeze the last-active step on error
      const remainingSteps = 6;
      const stepProgress = (progress / 100) * remainingSteps;
      const completedCount = Math.floor(stepProgress);
      if (stepIndex === 0) return 'completed';
      const rel = stepIndex - 1;
      if (rel < completedCount) return 'completed';
      if (rel === completedCount) return 'error';
      return 'pending';
    }
    if (progress >= 100) return 'completed';
    const remainingSteps = 6;
    const stepProgress = (progress / 100) * remainingSteps;
    const completedCount = Math.floor(stepProgress);
    if (stepIndex === 0) return 'completed';
    const rel = stepIndex - 1;
    if (rel < completedCount) return 'completed';
    if (rel === completedCount) return 'processing';
    return 'pending';
  };

  const StepIcon = ({ status }) => {
    if (status === 'completed') {
      return (
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
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
    if (status === 'error') {
      return (
        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    return <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0" />;
  };

  const displayName = fileName || file?.name || 'Document';

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
                  <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0z" />
                </svg>
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-2 py-0.5 rounded ${apiError ? 'bg-red-600' : 'bg-teal-600'}`}>
                  {apiError ? 'ERROR' : 'PDF'}
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {apiError ? 'Processing Failed' : 'Processing Document'}
            </h1>
            <p className="text-sm text-gray-500 mb-8 truncate">
              {apiError ? 'We couldn\'t extract invoice data from this file.' : 'AI is extracting and validating invoice data'}
            </p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className={`text-sm font-bold ${apiError ? 'text-red-600' : 'text-teal-600'}`}>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out rounded-full ${apiError ? 'bg-red-500' : 'bg-teal-600'}`}
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
                          : status === 'error'
                          ? 'text-red-700 font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Status banner */}
            {apiError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-left">
                <p className="text-sm font-semibold text-red-800 mb-1">Error</p>
                <p className="text-xs text-red-700">{apiError}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/clients/${clientId}/financials`)}
                    className="px-4 py-2 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back to Financials
                  </button>
                </div>
              </div>
            ) : apiDone && apiResult?.count != null ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
                <p className="text-sm font-semibold text-green-800 mb-1">
                  {apiResult.count} transaction{apiResult.count === 1 ? '' : 's'} extracted
                </p>
                {apiResult.summary && (
                  <p className="text-xs text-green-700">{apiResult.summary}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-4">
                Processing typically takes 5–30 seconds. Do not close this window.
              </p>
            )}

            {/* File name display */}
            <p className="text-xs text-gray-400 truncate">{displayName}</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProcessingDocument;
