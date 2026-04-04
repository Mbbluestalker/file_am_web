import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PageShell, PageHeader, LoadingSpinner, SearchInput, StatusBadge, EmptyState } from '../components/common';
import UploadInvoiceModal from '../components/modals/UploadInvoiceModal';
import InvoiceDetailModal from '../components/modals/InvoiceDetailModal';
import { formatCurrencyShort } from '../utils/format';
import { getInvoices } from '../services/financialsApi';

const Financials = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailInvoiceId, setDetailInvoiceId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const getClientFromStorage = () => {
    try { return JSON.parse(localStorage.getItem('clientsData') || '[]').find((c) => c.id === clientId); }
    catch { return null; }
  };

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getInvoices(clientId, pagination.page, pagination.limit);
      if (res.status && res.data) {
        const transformed = res.data.data.map((inv) => ({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          date: new Date(inv.dateIssued).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          vendor: inv.clientName,
          amount: parseFloat(inv.totalAmount),
          status: inv.paymentStatus.toLowerCase() === 'outstanding' ? 'needs-review' : 'clean',
          uploadMethod: '—',
          confidence: null,
          dueDate: inv.dueDate,
          clientEmail: inv.clientEmail,
          clientAddress: inv.clientAddress,
          lineItems: inv.lineItems || [],
          financialDocumentId: inv.financialDocumentId || null,
        }));
        setInvoices(transformed);
        setPagination({ page: res.data.page, limit: res.data.limit, total: res.data.total, totalPages: res.data.totalPages });
      } else {
        setError('Failed to load invoices');
      }
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError(err.message || 'Failed to load financial data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, [clientId, pagination.page, pagination.limit]);

  const stats = {
    total: pagination.total || invoices.length,
    clean: invoices.filter((inv) => inv.status === 'clean').length,
    needsReview: invoices.filter((inv) => inv.status === 'needs-review').length,
    flagged: invoices.filter((inv) => inv.status === 'flagged').length,
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || inv.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const truncateId = (id) => (id?.length > 8 ? `${id.substring(0, 8)}...` : id || '');

  const handleUploadComplete = (file, documentId) => {
    setShowUploadModal(false);
    navigate(`/clients/${clientId}/financials/processing`, { state: { documentId, fileName: file.name } });
  };

  const handleInvoiceClick = (invoice) => {
    if (!invoice.financialDocumentId) return;
    navigate(`/clients/${clientId}/financials/review/${invoice.financialDocumentId}`);
  };

  if (isLoading) return <PageShell clientId={clientId}><LoadingSpinner fullHeight message="Loading invoices..." /></PageShell>;

  if (error) {
    return (
      <PageShell clientId={clientId}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Invoices</h1>
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">Retry</button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell clientId={clientId}>
      <div className="px-10 py-8">
        <PageHeader
          title="Financials"
          subtitle="Upload and review invoices, receipts, and financial documents for accurate tax computation"
          actions={
            <>
              <button onClick={() => navigate(`/clients/${clientId}/financials/reports`)} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                View Reports
              </button>
              <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                Upload Invoice
              </button>
            </>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Documents', value: stats.total },
            { label: 'Clean', value: stats.clean },
            { label: 'Needs Review', value: stats.needsReview },
            { label: 'Flagged', value: stats.flagged },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">{s.label}</div>
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search by invoice number or vendor..." />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer">
              <option value="all">All Status</option>
              <option value="clean">Clean</option>
              <option value="needs-review">Needs Review</option>
              <option value="flagged">Flagged</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Invoice #</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Date</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Vendor</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Amount</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Status</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase text-right">Actions</div>
          </div>

          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="col-span-2 flex items-center gap-2 text-sm text-gray-900">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                <span title={invoice.id}>{truncateId(invoice.id)}</span>
              </div>
              <div className="col-span-2 flex items-center text-sm text-gray-700">{invoice.date}</div>
              <div className="col-span-2 flex items-center text-sm text-gray-900">{invoice.vendor}</div>
              <div className="col-span-2 flex items-center text-sm font-semibold text-gray-900">{formatCurrencyShort(invoice.amount)}</div>
              <div className="col-span-2 flex items-center">
                <StatusBadge status={invoice.status} label={invoice.status === 'needs-review' ? 'Needs Review' : invoice.status === 'clean' ? 'Clean' : invoice.status} size="md" />
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button onClick={() => setDetailInvoiceId(invoice.id)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Detail</button>
                {invoice.financialDocumentId && (
                  <button onClick={() => handleInvoiceClick(invoice)} className="px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">Review</button>
                )}
              </div>
            </div>
          ))}

          {filteredInvoices.length === 0 && <EmptyState message="No invoices found" />}
        </div>
      </div>

      <UploadInvoiceModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUploadComplete={handleUploadComplete} />
      <InvoiceDetailModal open={!!detailInvoiceId} onClose={() => setDetailInvoiceId(null)} clientId={clientId} invoiceId={detailInvoiceId} onStatusChange={() => fetchInvoices()} />
    </PageShell>
  );
};

export default Financials;
