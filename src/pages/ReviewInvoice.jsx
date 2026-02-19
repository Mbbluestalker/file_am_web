import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getClientById } from '../data/clientsData';

/**
 * REVIEW INVOICE PAGE
 *
 * Detailed invoice review with AI-extracted fields
 * Tax impact summary, compliance checks, and audit trail
 */
const ReviewInvoice = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = getClientById(clientId);

  // Sample extracted invoice data
  const invoiceData = {
    id: 'INV-2026-002',
    date: '8 Feb 2026',
    invoiceNumber: 'ZTS/2026/0234',
    vendor: 'Zenith Tech Services',
    amount: 8750000,
    vat: 656250,
    totalAmount: 9406250,
    status: 'needs-review',
    uploadMethod: 'PDF Upload',
    confidence: 76,
    description: 'IT infrastructure upgrade and cloud migration services for Q1 2026',
    paymentTerms: 'Net 30 days',
    dueDate: '10 Mar 2026',
    currency: 'NGN',
  };

  // Editable fields state
  const [formData, setFormData] = useState({
    invoiceNumber: invoiceData.invoiceNumber,
    date: invoiceData.date,
    vendor: invoiceData.vendor,
    amount: invoiceData.amount,
    vat: invoiceData.vat,
    description: invoiceData.description,
    paymentTerms: invoiceData.paymentTerms,
    dueDate: invoiceData.dueDate,
  });

  // Tax impact data
  const taxImpact = {
    vatPayable: 656250,
    withholdingTax: 437500,
    netTaxImpact: 218750,
    deductible: true,
  };

  // Compliance checks
  const complianceChecks = [
    { id: 1, label: 'Valid VAT registration number', status: 'passed', confidence: 95 },
    { id: 2, label: 'Invoice format compliance', status: 'passed', confidence: 98 },
    { id: 3, label: 'Vendor name match', status: 'warning', confidence: 76 },
    { id: 4, label: 'Amount calculation verified', status: 'passed', confidence: 92 },
  ];

  // Audit trail
  const auditTrail = [
    {
      id: 1,
      action: 'Document uploaded',
      user: 'Victor Asugba',
      timestamp: '8 Feb 2026, 2:34 PM',
      type: 'upload',
    },
    {
      id: 2,
      action: 'AI extraction completed',
      user: 'System',
      timestamp: '8 Feb 2026, 2:34 PM',
      type: 'processing',
    },
    {
      id: 3,
      action: 'Flagged for review - Low confidence on vendor match',
      user: 'System',
      timestamp: '8 Feb 2026, 2:34 PM',
      type: 'flag',
    },
  ];

  if (!client) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Client Not Found</h1>
          <p className="text-gray-500">The client you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleApprove = () => {
    // Handle approval logic
    navigate(`/clients/${clientId}/financials`);
  };

  const handleReject = () => {
    // Handle rejection logic
    navigate(`/clients/${clientId}/financials`);
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getComplianceIcon = (status) => {
    if (status === 'passed') {
      return (
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const getAuditIcon = (type) => {
    if (type === 'upload') {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
            <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
          </svg>
        </div>
      );
    }
    if (type === 'processing') {
      return (
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 7.5h-9v9h9v-9z" />
            <path
              fillRule="evenodd"
              d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar clientId={clientId} activePage="financials" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header hideLogo={true} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-10 py-8">
            {/* Back Button and Header */}
            <button
              onClick={() => navigate(`/clients/${clientId}/financials`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Invoices</span>
            </button>

            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Invoice</h1>
                <p className="text-sm text-gray-500">
                  Verify AI-extracted data and approve for tax computation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReject}
                  className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                >
                  Approve Invoice
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Invoice Details */}
              <div className="col-span-2 space-y-6">
                {/* Invoice Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Invoice Details</h2>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Invoice Number */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                        Invoice Number
                      </label>
                      <input
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                        Invoice Date
                      </label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    {/* Vendor */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Vendor Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.vendor}
                          onChange={(e) => handleInputChange('vendor', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span className="text-xs text-orange-600 font-medium">Low confidence - verify</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                        Amount (Excl. VAT)
                      </label>
                      <input
                        type="text"
                        value={formatCurrency(formData.amount)}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    {/* VAT */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">VAT (7.5%)</label>
                      <input
                        type="text"
                        value={formatCurrency(formData.vat)}
                        onChange={(e) => handleInputChange('vat', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Payment Terms */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                        Payment Terms
                      </label>
                      <input
                        type="text"
                        value={formData.paymentTerms}
                        onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Due Date</label>
                      <input
                        type="text"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Compliance Checks */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Compliance Checks</h2>
                  <div className="space-y-4">
                    {complianceChecks.map((check) => (
                      <div key={check.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getComplianceIcon(check.status)}
                          <span className="text-sm text-gray-900">{check.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                check.confidence >= 90
                                  ? 'bg-green-500'
                                  : check.confidence >= 75
                                  ? 'bg-orange-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${check.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 w-10">{check.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Audit Trail</h2>
                  <div className="space-y-4">
                    {auditTrail.map((entry, index) => (
                      <div key={entry.id} className="flex gap-4">
                        <div className="relative">
                          {getAuditIcon(entry.type)}
                          {index < auditTrail.length - 1 && (
                            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium text-gray-900 mb-1">{entry.action}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{entry.user}</span>
                            <span>•</span>
                            <span>{entry.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Tax Impact Summary */}
              <div className="col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Tax Impact Summary</h2>

                  <div className="space-y-4 mb-6">
                    {/* Total Invoice Amount */}
                    <div className="pb-4 border-b border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase mb-2">Total Invoice Amount</div>
                      <div className="text-2xl font-bold text-gray-900">{formatCurrency(invoiceData.totalAmount)}</div>
                    </div>

                    {/* VAT Payable */}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700">VAT Payable</span>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(taxImpact.vatPayable)}</span>
                    </div>

                    {/* Withholding Tax */}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700">Withholding Tax (5%)</span>
                      <span className="text-sm font-semibold text-red-600">
                        -{formatCurrency(taxImpact.withholdingTax)}
                      </span>
                    </div>

                    {/* Net Tax Impact */}
                    <div className="flex items-center justify-between py-3 border-t border-gray-200">
                      <span className="text-sm font-semibold text-gray-900">Net Tax Impact</span>
                      <span className="text-lg font-bold text-teal-600">{formatCurrency(taxImpact.netTaxImpact)}</span>
                    </div>
                  </div>

                  {/* Deductibility Badge */}
                  {taxImpact.deductible && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-green-900">Tax Deductible</span>
                      </div>
                      <p className="text-xs text-green-700">
                        This expense qualifies for tax deduction under business operating expenses
                      </p>
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
