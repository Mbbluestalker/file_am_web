import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import UploadInvoiceModal from '../components/modals/UploadInvoiceModal';
import ProcessingDocumentModal from '../components/modals/ProcessingDocumentModal';
import { getInvoices, getFinancialSummary } from '../services/financialsApi';

/**
 * FINANCIALS PAGE
 *
 * Upload and review invoices, receipts, and financial documents
 */
const Financials = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [financialSummary, setFinancialSummary] = useState(null);

  // Get client from localStorage for header
  const getClientFromStorage = () => {
    const storedClients = localStorage.getItem('clientsData');
    if (storedClients) {
      try {
        const clients = JSON.parse(storedClients);
        return clients.find((c) => c.id === clientId);
      } catch (err) {
        console.error('Error parsing clients data:', err);
      }
    }
    return null;
  };

  const client = getClientFromStorage();

  // Fetch invoices and financial summary from API
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch both invoices and financial summary in parallel
        const [invoicesResponse, summaryResponse] = await Promise.all([
          getInvoices(clientId, pagination.page, pagination.limit),
          getFinancialSummary(clientId).catch(err => {
            console.error('Error fetching financial summary:', err);
            return null; // Continue even if summary fails
          })
        ]);

        // Handle invoices response
        if (invoicesResponse.status && invoicesResponse.data) {
          // Transform API data to match component expectations
          const transformedInvoices = invoicesResponse.data.data.map((invoice) => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            date: new Date(invoice.dateIssued).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            vendor: invoice.clientName,
            amount: parseFloat(invoice.totalAmount),
            status: invoice.paymentStatus.toLowerCase() === 'outstanding' ? 'needs-review' : 'clean',
            uploadMethod: 'PDF Upload', // API doesn't provide this
            confidence: 95, // API doesn't provide this
            dueDate: invoice.dueDate,
            clientEmail: invoice.clientEmail,
            clientAddress: invoice.clientAddress,
            lineItems: invoice.lineItems || [],
          }));

          setInvoices(transformedInvoices);
          setPagination({
            page: invoicesResponse.data.page,
            limit: invoicesResponse.data.limit,
            total: invoicesResponse.data.total,
            totalPages: invoicesResponse.data.totalPages,
          });
        } else {
          setError('Failed to load invoices');
        }

        // Handle financial summary response
        if (summaryResponse && summaryResponse.status && summaryResponse.data) {
          setFinancialSummary(summaryResponse.data);
        }
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError(err.message || 'Failed to load financial data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, [clientId, pagination.page, pagination.limit]);

  // Calculate stats
  const stats = {
    total: pagination.total || invoices.length,
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

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar clientId={clientId} activePage="financials" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header hideLogo={true} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading invoices...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar clientId={clientId} activePage="financials" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header hideLogo={true} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Invoices</h1>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Truncate invoice ID (show first 8 characters)
  const truncateId = (id) => {
    if (!id) return '';
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/clients/${clientId}/financials/reports`)}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Reports
              </button>
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
          </div>

          {/* Financial Summary Cards */}
          {financialSummary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">Total Income</div>
                <div className="text-3xl font-bold text-green-600">
                  ₦{(financialSummary.totalIncome || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">Total Expenses</div>
                <div className="text-3xl font-bold text-red-600">
                  ₦{(financialSummary.totalExpenses || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">Net Profit</div>
                <div className="text-3xl font-bold text-gray-900">
                  ₦{(financialSummary.netProfit || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">Top Vendor</div>
                <div className="text-lg font-bold text-gray-900 truncate">
                  {financialSummary.topVendor || 'N/A'}
                </div>
              </div>
            </div>
          )}

          {/* Document Stats Cards */}
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
                  <span title={invoice.id}>{truncateId(invoice.id)}</span>
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
