import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  useParams();

  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  const confirmation = {
    firsReference: 'FIRS/VAT/2026/0234817',
    filingPeriod: 'February 2026',
    paymentDate: '11 February 2026',
    outputVat: 2140000,
    inputVat: 293750,
    netVatPayable: 1846200,
    penalty: 0,
    fine: 0,
    subtotal: 0,
    totalAmountPaid: 1847250,
    paymentMethod: 'Bank Transfer',
    transactionId: 'TIN: 02-FEB-2026-09:27',
    bankName: 'First Bank of Nigeria',
    bankEvidence: 'FBN/VAT/2026021/141729',
    taxpayerName: 'TechVision Solutions Ltd',
    taxpayerTin: '02-082945',
    taxpayerAddress: 'Adebayo & Partners Tax Consultants',
    reviewedBy: 'Adebayo & Partners Tax Consultants',
  };

  const taxBreakdown = [
    { label: 'Output VAT (Sales)', amount: confirmation.outputVat, positive: true },
    { label: 'Input VAT (Purchases)', amount: confirmation.inputVat, positive: false },
    { label: 'Net VAT Payable', amount: confirmation.netVatPayable, positive: true },
    { label: 'Penalty', amount: confirmation.penalty, positive: true },
    { label: 'Fine', amount: confirmation.fine, positive: true },
    { label: 'Subtotal', amount: confirmation.subtotal, positive: true },
  ];

  const supportingDocs = [
    'Bank Payment Receipt',
    'VAT Computation Sheet',
    'Supporting Invoice Bundle',
    'FIRS Acknowledgement',
  ];

  const approvalTrail = [
    { name: 'John Okeke', role: 'Senior Tax Consultant', approvedBy: 'Sarah Adeyemi', approvedRole: 'Managing Partner' },
  ];

  const fmt = (n) => `₦${Math.abs(n).toLocaleString()}.00`;

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={defaultClientId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* Page header */}
          <div className="bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-900">Payment Confirmation Report</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>

          <div className="px-10 py-8">
            <div className="max-w-3xl mx-auto">

              {/* Confirmation Badge */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">TAX PAYMENT CONFIRMATION</h2>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  CONFIRMED
                </span>

                {/* FIRS Reference */}
                <div className="mt-5 inline-block border border-amber-300 bg-amber-50 rounded-xl px-8 py-3">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">FIRS Reference Number</p>
                  <p className="text-base font-bold text-amber-800">{confirmation.firsReference}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Payment Summary</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Federal Inland Revenue Service (FIRS)</p>
                    <p className="text-sm font-semibold text-gray-900">Value Added Tax (VAT)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Filing Period</p>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.filingPeriod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Payment Date</p>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.paymentDate}</p>
                  </div>
                </div>
              </div>

              {/* Tax Computation Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Tax Computation Breakdown</h3>
                <div className="space-y-2">
                  {taxBreakdown.map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-b-0">
                      <span className="text-sm text-gray-600">{row.label}</span>
                      <span className={`text-sm font-medium ${row.positive ? 'text-gray-900' : 'text-red-600'}`}>
                        {row.positive ? fmt(row.amount) : `(${fmt(row.amount)})`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t-2 border-gray-200 flex items-center justify-between bg-green-50 -mx-6 px-6 py-4 rounded-b-xl">
                  <span className="text-base font-bold text-green-900">Total Amount Paid</span>
                  <span className="text-xl font-bold text-green-600">{fmt(confirmation.totalAmountPaid)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Payment Method</p>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Transaction ID</p>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Bank Name</p>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Bank Evidence</p>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.bankEvidence}</p>
                  </div>
                </div>
              </div>

              {/* Party Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Party Information</h3>
                <div className="grid grid-cols-2 gap-x-8">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Taxpayer</p>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.taxpayerName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">TIN: {confirmation.taxpayerTin}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{confirmation.taxpayerAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Reviewed by</p>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.reviewedBy}</p>
                  </div>
                </div>
              </div>

              {/* Supporting Evidence */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Supporting Evidence</h3>
                <div className="space-y-2">
                  {supportingDocs.map((doc) => (
                    <div key={doc} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-800">{doc}</span>
                      </div>
                      <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">View</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Trail */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Approval Trail</h3>
                {approvalTrail.map((trail, i) => (
                  <div key={i} className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{trail.name}</p>
                        <p className="text-xs text-gray-400">{trail.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">approved by</p>
                      <p className="text-sm font-semibold text-gray-900">{trail.approvedBy}</p>
                      <p className="text-xs text-gray-400">{trail.approvedRole}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Official Certification */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Official Certification</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      This payment confirmation has been generated by the Federal Inland Revenue Service (FIRS) and serves as official proof of VAT payment for the specified filing period. This document should be retained for record-keeping purposes in accordance with Section 55 of the VAT Act and FIRS record-keeping guidelines for a minimum period of six (6) years from the date of transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate('/filings')}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Filings
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Report
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
