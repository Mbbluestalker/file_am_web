import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';

const SubmitVATReturn = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  const [authorizations, setAuthorizations] = useState({ client: false, consultant: false });
  const [showWhatHappens, setShowWhatHappens] = useState(false);

  const filing = {
    title: 'Submit VAT Return - January 2026',
    subtitle: 'All pre-submission requirements met. This filing is ready to submit to FIRS.',
    clientName: 'Aflex Manufacturing Ltd',
    filingPeriod: 'January 2026',
    outputVat: 2450000,
    inputVat: 1384409,
    netPayable: 1065591,
  };

  const verificationChecklist = [
    'All invoices uploaded and verified',
    'VAT calculations reviewed and approved',
    'Vendor TINs validated',
    'Supporting documentation attached',
    'Secure computation module complete',
  ];

  const authorizationItems = [
    {
      id: 'client',
      role: 'Client Authorization',
      name: 'John Adeosun, Director Tax Compliance',
      description:
        'I hereby authorize the submission of this VAT return to the Federal Inland Revenue Service (FIRS) on behalf of Aflex Manufacturing Ltd. I confirm that all information provided is accurate and complete.',
    },
    {
      id: 'consultant',
      role: 'Senior Consultant Authorization',
      name: 'Sarah Adeyemi, Managing Partner',
      description:
        'As the supervising tax consultant, I have reviewed this VAT return and confirm that all calculations and supporting documentation comply with the requirements of the VAT Act.',
    },
  ];

  const whatHappensItems = [
    `Filing is submitted to FIRS TaxPro MaxFile immediately`,
    `Payment of ₦${filing.netPayable.toLocaleString()} due by 21 February 2026`,
    `All documents retained for 6 years as per FIRS guidelines`,
  ];

  const sidebarDocs = [
    { name: 'VAT Return (PDF)', size: '2.3 MB' },
    { name: 'Computation Sheet', size: '1.8 MB' },
    { name: 'Print Summary', size: '945 KB' },
  ];

  const canSubmit = authorizations.client && authorizations.consultant;

  const fmt = (n) =>
    `₦${Math.abs(n).toLocaleString()}.00`;

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={defaultClientId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* Black header */}
          <div className="bg-gray-900 text-white px-10 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/filings/${id}`)}
                className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors shrink-0"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold">{filing.title}</h1>
                <p className="text-sm text-gray-400 mt-0.5">{filing.subtitle}</p>
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
                      <p className="text-xs text-gray-400 mb-0.5">Client</p>
                      <p className="text-sm font-semibold text-gray-900">{filing.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">Filing Period</p>
                      <p className="text-sm font-semibold text-gray-900">{filing.filingPeriod}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Output VAT</p>
                      <p className="text-lg font-bold text-gray-900">{fmt(filing.outputVat)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Input VAT</p>
                      <p className="text-lg font-bold text-gray-900">{fmt(filing.inputVat)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Net VAT Payable</p>
                      <p className="text-lg font-bold text-green-600">{fmt(filing.netPayable)}</p>
                    </div>
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
                    Before submitting to FIRS, make sure at least two parties have verified this filing.
                  </p>
                  <div className="space-y-4">
                    {authorizationItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id={item.id}
                            checked={authorizations[item.id]}
                            onChange={() => setAuthorizations((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="w-4 h-4 mt-0.5 accent-teal-600 cursor-pointer"
                          />
                          <label htmlFor={item.id} className="cursor-pointer flex-1">
                            <p className="text-sm font-semibold text-gray-900">{item.role}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.description}</p>
                          </label>
                        </div>
                      </div>
                    ))}
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
                        {whatHappensItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                            <span className="text-sm text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/filings/${id}`)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Filings
                  </button>
                  <button
                    onClick={() => canSubmit && navigate(`/filings/${id}/confirmation`)}
                    disabled={!canSubmit}
                    className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      canSubmit
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit VAT Return to FIRS
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-72 bg-white border-l border-gray-200 px-6 py-8 shrink-0">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Submission Details</h3>
              <p className="text-xs text-gray-400 mb-5">FIRS TaxPro MaxFile Annual</p>

              <div className="space-y-2 mb-6">
                {sidebarDocs.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{doc.name}</p>
                        <p className="text-[10px] text-gray-400">{doc.size}</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                ))}
              </div>

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
