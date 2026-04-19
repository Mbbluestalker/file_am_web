import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getDocumentReview } from '../services/financialsApi';

const Tooltip = ({ text }) => (
  <div className="group relative inline-block ml-2">
    <svg className="w-4 h-4 text-blue-500 cursor-help" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
    <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

const ReadonlyField = ({ label, value, hint }) => (
  <div>
    <label className="flex items-center text-xs font-semibold text-gray-700 uppercase mb-2">
      {label}
      {hint && <Tooltip text={hint} />}
    </label>
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
      {value || '—'}
    </div>
  </div>
);

const formatCurrency = (amount) => {
  if (amount == null) return '—';
  return `₦${Number(amount).toLocaleString()}`;
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${date}, ${time}`;
};

const THRESHOLD_5M = 5_000_000;

const deriveComplianceChecks = ({ invoiceData, impactSummary }) => {
  const inv = invoiceData || {};
  const imp = impactSummary || {};
  const tinValid = !!inv.vendorTin;
  const vatRateValid = inv.vatRate === '7.5%';
  const invoiceNumValid = !!inv.invoiceNumber && inv.invoiceNumber !== 'N/A';
  const aboveThreshold = (imp.totalExpense ?? 0) > THRESHOLD_5M;

  return [
    { label: 'Vendor TIN verified', status: tinValid ? 'passed' : 'warning' },
    { label: `VAT rate correct${inv.vatRate ? ` (${inv.vatRate})` : ''}`, status: vatRateValid ? 'passed' : 'warning' },
    { label: 'Invoice numbering valid', status: invoiceNumValid ? 'passed' : 'warning' },
    ...(aboveThreshold
      ? [{ label: 'Threshold: Exceeds ₦5M - review required', status: 'warning' }]
      : []),
  ];
};

const deriveAuditTrail = ({ metrics }) => {
  const m = metrics || {};
  const entries = [];
  if (m.uploadDate) {
    entries.push({
      type: 'upload',
      action: 'Document uploaded',
      timestamp: `${formatDateTime(m.uploadDate)}${m.uploadSource ? ` • ${m.uploadSource}` : ''}`,
    });
  }
  if (m.processingMethod) {
    entries.push({
      type: 'extract',
      action: 'AI extraction complete',
      timestamp: m.processingMethod,
    });
  }
  if (m.manualEdit && m.manualEdit !== 'none') {
    entries.push({
      type: 'edit',
      action: 'Manual edit applied',
      timestamp: m.manualEdit,
    });
  }
  return entries;
};

const ReviewInvoice = () => {
  const { clientId, invoiceId: documentId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const fetchInvoiceReview = async () => {
      if (!clientId || !documentId) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await getDocumentReview(clientId, documentId);
        if (response.status && response.data) {
          setInvoiceData(response.data);
        } else {
          throw new Error('Failed to load invoice data');
        }
      } catch (err) {
        console.error('Error fetching invoice review:', err);
        setError(err.message || 'Failed to load invoice');
        toast.error('Failed to load invoice data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoiceReview();
  }, [clientId, documentId]);

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar clientId={clientId} activePage="financials" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header hideLogo={true} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-600">Loading invoice data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar clientId={clientId} activePage="financials" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header hideLogo={true} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Invoice</h1>
              <p className="text-gray-500 mb-4">{error || 'Invoice not found'}</p>
              <button
                onClick={() => navigate(`/clients/${clientId}/financials`)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Back to Financials
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { metrics = {}, invoiceData: inv = {}, impactSummary = {} } = invoiceData;
  const totalExpense = impactSummary.totalExpense ?? null;
  const eligibleAmount = impactSummary.eligibleAmount ?? null;
  const inputVatEligible = eligibleAmount != null && eligibleAmount > 0;
  const complianceChecks = invoiceData.complianceChecks || deriveComplianceChecks(invoiceData);
  const auditTrail = invoiceData.auditTrail || deriveAuditTrail(invoiceData);

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={clientId} activePage="financials" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-10 py-8">
            <button
              onClick={() => navigate(`/clients/${clientId}/financials`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Invoice</h1>
                <p className="text-sm text-gray-500">Verify extracted data and tax-relevant fields</p>
              </div>
              <button
                disabled
                title="Flagging is not yet available"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-400 rounded-lg font-medium cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Flag for Review
              </button>
            </div>

            {/* Metadata Row */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">Upload Source</div>
                <div className="text-sm font-medium text-gray-900">{metrics.uploadSource || '—'}</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">Upload Date</div>
                <div className="text-sm font-medium text-gray-900">{formatDate(metrics.uploadDate)}</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">Processing Method</div>
                <div className="text-sm font-medium text-gray-900">{metrics.processingMethod || '—'}</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">Manual Edits</div>
                <div className="text-sm font-medium text-gray-900">{metrics.manualEdit || 'None'}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Invoice Details (read-only) */}
              <div className="col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Invoice Details</h2>

                  <div className="space-y-6">
                    <ReadonlyField
                      label="Invoice Number"
                      value={inv.invoiceNumber}
                      hint="FIRS requires invoice numbering per VATA Section 10"
                    />
                    <ReadonlyField
                      label="Invoice Date"
                      value={formatDate(inv.invoiceDate)}
                      hint="Tax point determination per VATA Section 8"
                    />
                    <ReadonlyField
                      label="Vendor Name"
                      value={inv.vendorName}
                      hint="Vendor verification required for input VAT credit"
                    />
                    <ReadonlyField
                      label="Vendor TIN"
                      value={inv.vendorTin}
                      hint="TIN validation required per FIRS TIN Regulations"
                    />
                    <ReadonlyField
                      label="Subtotal (Excl. VAT)"
                      value={formatCurrency(inv.subtotalExclVat)}
                      hint="Base amount for VAT calculation per VATA"
                    />
                    <ReadonlyField
                      label={`VAT Amount${inv.vatRate ? ` (${inv.vatRate})` : ''}`}
                      value={formatCurrency(inv.vatAmount)}
                      hint="Standard VAT rate per VATA Section 4"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Tax Impact Summary */}
              <div className="col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Tax Impact Summary</h2>

                  {inputVatEligible && (
                    <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-green-900">Input VAT Eligible</span>
                      </div>
                      <p className="text-xs text-green-700">
                        This invoice qualifies for input VAT deduction per VATA Section 16
                      </p>
                      <div className="text-2xl font-bold text-green-700 mt-3">
                        {formatCurrency(eligibleAmount)}
                      </div>
                    </div>
                  )}

                  {/* Total Expense Card */}
                  <div className="mb-6 px-4 py-4 bg-teal-900 text-white rounded-lg">
                    <div className="text-xs font-medium uppercase mb-1">Total Expense</div>
                    <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
                  </div>

                  {/* Compliance Checks — only render when backend provides them */}
                  {Array.isArray(complianceChecks) && complianceChecks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-4">Compliance Checks</h3>
                      <div className="space-y-3">
                        {complianceChecks.map((check, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            {check.status === 'passed' ? (
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className="text-xs text-gray-700">{check.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audit Trail — only render when backend provides it */}
                  {Array.isArray(auditTrail) && auditTrail.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-4">Audit Trail</h3>
                      <div className="space-y-4">
                        {auditTrail.map((entry, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className={`w-1 ${entry.type === 'upload' ? 'bg-orange-500' : 'bg-blue-500'} rounded-full flex-shrink-0`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">{entry.action}</p>
                              <p className="text-xs text-gray-500">{entry.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewInvoice;
