import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getClientDetails } from '../services/clientApi';

const SubmitVATReturn = () => {
  const navigate = useNavigate();
  const { id, clientId } = useParams();
  const location = useLocation();

  const rawFiling = location.state?.filing || null;

  const [consultantApproved, setConsultantApproved] = useState(false);
  const [showWhatHappens, setShowWhatHappens] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    const load = async () => {
      try {
        setDetailsLoading(true);
        const res = await getClientDetails(clientId);
        if (res?.status && res.data) setClientDetails(res.data);
      } catch (err) {
        console.error('Client details fetch error:', err);
      } finally {
        setDetailsLoading(false);
      }
    };
    load();
  }, [clientId]);

  const clientAuthorized =
    clientDetails?.filingAuthorization === true ||
    clientDetails?.consultantLink?.filingAuthorization === true;

  const filing = rawFiling
    ? {
        title: `Submit ${rawFiling.taxType} Return - ${rawFiling.periodLabel || ''}`,
        subtitle: 'Review final summary and submit to FIRS TaxPro-Max portal',
        period: rawFiling.periodLabel || '—',
        amount: rawFiling.amount ?? null,
        taxType: rawFiling.taxType,
        periodYear: rawFiling.periodYear,
        periodMonth: rawFiling.periodMonth,
        dueDate: rawFiling.dueDate
          ? new Date(rawFiling.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : '—',
      }
    : null;

  const verificationChecklist = [
    'All invoices uploaded and verified',
    'VAT calculations reviewed and approved',
    'Vendor TINs validated',
    'Supporting documentation attached',
    'Secure computation module complete',
  ];

  const canSubmit = clientAuthorized && consultantApproved;

  const handleSubmit = () => {
    if (!canSubmit) return;
    navigate(`/clients/${clientId}/filings/${id}/confirmation`, { state: { filing: rawFiling } });
  };

  const fmt = (n) =>
    n != null ? `₦${Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '—';

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={clientId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* Black header */}
          <div className="bg-gray-900 text-white px-10 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/clients/${clientId}/filings/${id}`, { state: { filing: rawFiling } })}
                className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors shrink-0"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold">{filing?.title || '—'}</h1>
                <p className="text-sm text-gray-400 mt-0.5">{filing?.subtitle || ''}</p>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 px-10 py-8 min-w-0">
              <div className="max-w-3xl">
                {/* Ready Banner */}
                <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-green-800">
                    <span className="font-bold">Ready for Submission</span> — All pre-submission requirements have been successfully completed
                  </p>
                </div>

                {/* Filing Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4">Filing Summary</h2>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Filing Period</p>
                      <p className="text-sm font-semibold text-gray-900">{filing?.period || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">Due Date</p>
                      <p className="text-sm font-semibold text-gray-900">{filing?.dueDate || '—'}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Amount</p>
                    <p className="text-2xl font-bold text-gray-900">{fmt(filing?.amount)}</p>
                  </div>
                </div>

                {/* Pre-submission Verification */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Pre-submission Verification</h3>
                  <div className="space-y-3">
                    {verificationChecklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Authorization Required */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Authorization Required</h3>
                  <p className="text-xs text-gray-400 mb-5">
                    Before submitting to FIRS, both parties must authorize this filing.
                  </p>
                  <div className="space-y-4">
                    {/* Client Authorization — controlled by backend filingAuthorization flag */}
                    {detailsLoading ? (
                      <div className="border border-gray-200 rounded-xl p-4 text-xs text-gray-400">
                        Checking client authorization…
                      </div>
                    ) : clientAuthorized ? (
                      <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-900">Client Authorization · Granted</p>
                          <p className="text-xs text-green-700 mt-1 leading-relaxed">
                            The client has granted filing authorization to this consultant. You may proceed with FIRS submission.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-900">Client Authorization · Not Granted</p>
                          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                            The client has not yet authorized this consultant to file tax returns on their behalf. Submission is blocked until authorization is granted via the client's mobile app.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Senior Consultant Authorization — consultant-side checkbox */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="consultant"
                          checked={consultantApproved}
                          onChange={() => setConsultantApproved((v) => !v)}
                          className="w-4 h-4 mt-0.5 accent-teal-600 cursor-pointer"
                        />
                        <label htmlFor="consultant" className="cursor-pointer flex-1">
                          <p className="text-sm font-semibold text-gray-900">Senior Consultant Authorization</p>
                          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                            As the supervising tax consultant, I have reviewed this return and confirm that all calculations and supporting documentation comply with the requirements of the relevant tax Act.
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What happens after submission */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
                  <button
                    onClick={() => setShowWhatHappens((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-900">What happens after submission?</span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${showWhatHappens ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showWhatHappens && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <span className="text-sm text-gray-600">Filing is submitted to FIRS TaxPro MaxFile immediately</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <span className="text-sm text-gray-600">Payment of {fmt(filing?.amount)} due by {filing?.dueDate || '—'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <span className="text-sm text-gray-600">All documents archived to FileAm for audit defense</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/clients/${clientId}/filings/${id}`, { state: { filing: rawFiling } })}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Filing
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      canSubmit
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Return to FIRS
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-72 bg-white border-l border-gray-200 px-6 py-8 shrink-0">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Submission Details</h3>
              <p className="text-xs text-gray-400 mb-5">FIRS TaxPro MaxFile</p>

              <div className="border-t border-gray-100 pt-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Useful Links</p>
                <ul className="space-y-2">
                  {['FIRS VAT Guidelines', 'VAT Act (Nigeria)', 'TaxPro MaxFile Portal'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1">
                        {link}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmitVATReturn;
