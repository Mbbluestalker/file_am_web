import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getClientById } from '../data/clientsData';
import UploadInvoiceModal from '../components/modals/UploadInvoiceModal';
import ProcessingDocumentModal from '../components/modals/ProcessingDocumentModal';

/**
 * FINANCIALS PAGE
 *
 * Upload and review invoices, receipts, and financial documents
 */
const Financials = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = getClientById(clientId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Sample invoice data
  const invoices = [
    {
      id: 'INV-2026-001',
      date: '5 Feb 2026',
      vendor: 'Lagos Office Supplies Ltd.',
      amount: 2450000,
      status: 'clean',
      uploadMethod: 'PDF Upload',
      confidence: 98,
    },
    {
      id: 'INV-2026-002',
      date: '8 Feb 2026',
      vendor: 'Zenith Tech Services',
      amount: 8750000,
      status: 'needs-review',
      uploadMethod: 'PDF Upload',
      confidence: 76,
    },
    {
      id: 'INV-2026-003',
      date: '8 Feb 2026',
      vendor: 'Zenith Tech Services',
      amount: 8750000,
      status: 'needs-review',
      uploadMethod: 'PDF Upload',
      confidence: 76,
    },
    {
      id: 'INV-2026-004',
      date: '28 Jan 2026',
      vendor: 'Mainland Equipment Rentals',
      amount: 4200000,
      status: 'clean',
      uploadMethod: 'Excel Import',
      confidence: 95,
    },
    {
      id: 'INV-2026-005',
      date: '11 Feb 2026',
      vendor: 'Federal Tax Advisors',
      amount: 6500000,
      status: 'needs-review',
      uploadMethod: 'PDF Upload',
      confidence: 82,
    },
  ];

  // Calculate stats
  const stats = {
    total: invoices.length,
    clean: invoices.filter((inv) => inv.status === 'clean').length,
    needsReview: invoices.filter((inv) => inv.status === 'needs-review').length,
    flagged: invoices.filter((inv) => inv.status === 'flagged').length,
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle client not found
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

  // Format currency
  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (status === 'clean') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
          Clean
        </span>
      );
    }
    if (status === 'needs-review') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
          Needs Review
        </span>
      );
    }
    return null;
  };

  // Handle upload
  const handleUploadComplete = (file) => {
    setUploadedFileName(file.name);
    setShowUploadModal(false);
    setShowProcessingModal(true);
  };

  // Handle processing complete
  const handleProcessingComplete = () => {
    setShowProcessingModal(false);
    // Navigate to review page
    navigate(`/clients/${clientId}/financials/review/INV-2026-002`);
  };

  // Handle invoice click
  const handleInvoiceClick = (invoice) => {
    navigate(`/clients/${clientId}/financials/review/${invoice.id}`);
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
        <main className="flex-1 px-10 py-8 overflow-y-auto bg-gray-50">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Financials</h1>
              <p className="text-sm text-gray-500">
                Upload and review invoices, receipts, and financial documents for accurate tax computation
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Invoice
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">Total Documents</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">Clean</div>
              <div className="text-3xl font-bold text-gray-900">{stats.clean}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">Needs Review</div>
              <div className="text-3xl font-bold text-gray-900">{stats.needsReview}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">Flagged</div>
              <div className="text-3xl font-bold text-gray-900">{stats.flagged}</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by invoice number or vendor..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="clean">Clean</option>
                <option value="needs-review">Needs Review</option>
                <option value="flagged">Flagged</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Invoice #</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Date</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Vendor</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Amount</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Status</div>
              <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase">Upload Method</div>
              <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase">Confidence</div>
            </div>

            {/* Table Rows */}
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                onClick={() => handleInvoiceClick(invoice)}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="col-span-2 flex items-center gap-2 text-sm text-gray-900">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  {invoice.id}
                </div>
                <div className="col-span-2 flex items-center text-sm text-gray-700">{invoice.date}</div>
                <div className="col-span-2 flex items-center text-sm text-gray-900">{invoice.vendor}</div>
                <div className="col-span-2 flex items-center text-sm font-semibold text-gray-900">
                  {formatCurrency(invoice.amount)}
                </div>
                <div className="col-span-2 flex items-center">{getStatusBadge(invoice.status)}</div>
                <div className="col-span-1 flex items-center text-xs text-gray-500">{invoice.uploadMethod}</div>
                <div className="col-span-1 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        invoice.confidence >= 90
                          ? 'bg-green-500'
                          : invoice.confidence >= 75
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${invoice.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8">{invoice.confidence}%</span>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredInvoices.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">No invoices found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <UploadInvoiceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
      />
      <ProcessingDocumentModal
        isOpen={showProcessingModal}
        fileName={uploadedFileName}
        onComplete={handleProcessingComplete}
      />
    </div>
  );
};

export default Financials;
