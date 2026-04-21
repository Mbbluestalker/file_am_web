import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PageShell, PageHeader, LoadingSpinner, SearchInput, StatusBadge, EmptyState, ProgressBar } from '../components/common';
import UploadInvoiceModal from '../components/modals/UploadInvoiceModal';
import { formatCurrencyShort } from '../utils/format';
import { getFinancialDocuments } from '../services/financialsApi';

const STATUS_LABEL = {
  clean: 'Clean',
  review: 'Needs Review',
  flagged: 'Flagged',
  pending: 'Pending',
  processed: 'Processed',
  completed: 'Completed',
};

const confidenceColor = (v) => {
  if (v == null) return 'bg-gray-300';
  if (v >= 90) return 'bg-green-500';
  if (v >= 70) return 'bg-orange-400';
  return 'bg-red-400';
};

const shortId = (id) => (id?.length > 8 ? `${id.substring(0, 8)}…` : id || '');

const Financials = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    let cancelled = false;
    const fetchDocuments = async () => {
      try {
        setIsRefetching(true);
        setError(null);
        const res = await getFinancialDocuments(clientId, {
          page,
          limit,
          status: statusFilter,
          q: debouncedSearch || undefined,
        });
        if (cancelled) return;
        if (res.status && res.data) {
          const list = res.data.data || [];
          const transformed = list.map((doc) => ({
            id: doc.id,
            invoiceNumber: doc.invoiceNumber || shortId(doc.id),
            date: doc.documentDate
              ? new Date(doc.documentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : '—',
            vendor: doc.vendor || '—',
            amount: doc.amount != null ? parseFloat(doc.amount) : null,
            status: (doc.documentStatus || 'pending').toLowerCase(),
            uploadMethod: doc.format || '—',
            confidence: doc.confidence != null ? parseFloat(doc.confidence) : null,
            invoiceId: doc.invoiceId || null,
          }));
          setDocuments(transformed);
          setPagination({
            total: res.data.total ?? transformed.length,
            totalPages: res.data.totalPages || 1,
          });
        } else {
          setError('Failed to load documents');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Error fetching documents:', err);
        setError(err.message || 'Failed to load documents');
      } finally {
        if (!cancelled) {
          setIsRefetching(false);
          setIsInitialLoad(false);
        }
      }
    };
    fetchDocuments();
    return () => { cancelled = true; };
  }, [clientId, page, limit, statusFilter, debouncedSearch]);

  const stats = {
    total: pagination.total || documents.length,
    clean: documents.filter((d) => d.status === 'clean').length,
    needsReview: documents.filter((d) => d.status === 'review').length,
    flagged: documents.filter((d) => d.status === 'flagged').length,
  };

  const handleFileSelected = (file) => {
    setShowUploadModal(false);
    navigate(`/clients/${clientId}/financials/processing`, {
      state: { file, fileName: file.name },
    });
  };

  const handleRowClick = (doc) => {
    navigate(`/clients/${clientId}/financials/review/${doc.id}`);
  };

  if (isInitialLoad) return <PageShell clientId={clientId}><LoadingSpinner fullHeight message="Loading documents..." /></PageShell>;

  if (error) {
    return (
      <PageShell clientId={clientId}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Documents</h1>
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
              <option value="review">Needs Review</option>
              <option value="flagged">Flagged</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Document Table */}
        <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-opacity ${isRefetching ? 'opacity-60' : 'opacity-100'}`}>
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Invoice #</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Date</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Vendor</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase">Amount</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Status</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase">Upload Method</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Confidence</div>
          </div>

          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleRowClick(doc)}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="col-span-2 flex items-center gap-2 text-sm text-gray-900">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span title={doc.id}>{doc.invoiceNumber}</span>
              </div>
              <div className="col-span-2 flex items-center text-sm text-gray-700">{doc.date}</div>
              <div className="col-span-2 flex items-center text-sm text-gray-900">{doc.vendor}</div>
              <div className="col-span-1 flex items-center text-sm font-semibold text-gray-900">
                {doc.amount != null ? formatCurrencyShort(doc.amount) : '—'}
              </div>
              <div className="col-span-2 flex items-center">
                <StatusBadge status={doc.status} label={STATUS_LABEL[doc.status] || doc.status} size="md" />
              </div>
              <div className="col-span-1 flex items-center text-sm text-gray-600">{doc.uploadMethod}</div>
              <div className="col-span-2 flex items-center">
                {doc.confidence != null ? (
                  <div className="flex items-center gap-2 w-full">
                    <ProgressBar value={doc.confidence} color={confidenceColor(doc.confidence)} height="h-1.5" />
                    <span className="text-xs font-semibold text-gray-700 w-10 text-right">{Math.round(doc.confidence)}%</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </div>
            </div>
          ))}

          {documents.length === 0 && (
            <EmptyState
              message={
                debouncedSearch || statusFilter !== 'all'
                  ? 'No documents match your filters'
                  : 'No documents found'
              }
            />
          )}
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-xs text-gray-500">
              Showing{' '}
              <span className="font-semibold text-gray-700">
                {(page - 1) * limit + 1}
              </span>
              {' to '}
              <span className="font-semibold text-gray-700">
                {Math.min(page * limit, pagination.total)}
              </span>
              {' of '}
              <span className="font-semibold text-gray-700">{pagination.total}</span> documents
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-xs text-gray-500 px-2">
                Page <span className="font-semibold text-gray-700">{page}</span> of{' '}
                <span className="font-semibold text-gray-700">{pagination.totalPages || 1}</span>
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
                disabled={page >= (pagination.totalPages || 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <UploadInvoiceModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onFileSelected={handleFileSelected} />
    </PageShell>
  );
};

export default Financials;
