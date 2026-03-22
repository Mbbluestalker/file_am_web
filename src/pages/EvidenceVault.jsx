import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';
import { getEvidenceVaultStats, getEvidenceVaultDocuments } from '../services/evidenceVaultApi';

const CATEGORIES = [
  { id: 'all', name: 'All Documents', metricsKey: 'allDocument' },
  { id: 'invoices', name: 'Invoices', metricsKey: 'invoice' },
  { id: 'receipts', name: 'Receipts', metricsKey: 'receipts' },
  { id: 'vatSchedules', name: 'VAT Schedules', metricsKey: 'vatSchedules' },
  { id: 'filings', name: 'Filings', metricsKey: 'filings' },
  { id: 'whtCerts', name: 'WHT Certs', metricsKey: 'whtCerts' },
];

const FALLBACK_DOCS = [
  { id: 'DOC-001', documentName: 'Invoice INV-001 - Victor Asuquo', category: 'invoices', source: 'Sales', uploadedAt: '2026-02-05', fileSize: 250880 },
  { id: 'DOC-002', documentName: 'Receipt EXP-001 - Office Rent', category: 'receipts', source: 'Expenses', uploadedAt: '2026-02-01', fileSize: 193536 },
  { id: 'DOC-003', documentName: 'VAT Return January 2026', category: 'filings', source: 'Filings', uploadedAt: '2026-02-15', fileSize: 319488 },
  { id: 'DOC-004', documentName: 'VAT Schedule Q1 2026', category: 'vatSchedules', source: 'VAT', uploadedAt: '2026-02-10', fileSize: 102400 },
  { id: 'DOC-005', documentName: 'WHT Certificate - Jan 2026', category: 'whtCerts', source: 'WHT', uploadedAt: '2026-02-08', fileSize: 81920 },
  { id: 'DOC-006', documentName: 'Invoice INV-002 - Zenith Tech', category: 'invoices', source: 'Sales', uploadedAt: '2026-02-12', fileSize: 204800 },
];

const FALLBACK_STATS = {
  metrics: { allDocument: 6, invoice: 2, receipts: 1, vatSchedules: 1, filings: 1, whtCerts: 1 },
};

const EvidenceVault = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  useEffect(() => {
    const fetchData = async () => {
      if (!defaultClientId) return;
      try {
        setIsLoading(true);
        const [statsRes, docsRes] = await Promise.all([
          getEvidenceVaultStats(defaultClientId).catch(() => null),
          getEvidenceVaultDocuments(defaultClientId, 1, 50).catch(() => null),
        ]);
        if (statsRes?.status && statsRes.data) setStats(statsRes.data);
        if (docsRes?.status && docsRes.data) {
          const list = docsRes.data.data || docsRes.data.documents || docsRes.data;
          setDocuments(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error('Evidence Vault fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [defaultClientId]);

  const displayStats = stats || FALLBACK_STATS;
  const displayDocs = documents.length > 0 ? documents : FALLBACK_DOCS;

  const getCategoryCount = (cat) =>
    displayStats.metrics?.[cat.metricsKey] ?? 0;

  // API returns capitalized category names e.g. "Invoices", "Receipts", "Filings"
  // Our category IDs are lowercase e.g. 'invoices', 'receipts', 'filings'
  const normalizeCat = (cat) => (cat || '').toLowerCase().replace(/\s+/g, '');

  const filteredDocs = displayDocs.filter((doc) => {
    const matchesCat = selectedCategory === 'all' || normalizeCat(doc.category) === normalizeCat(selectedCategory);
    const name = (doc.documentName || doc.name || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || (doc.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory);

  const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (str) => {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const DocIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const categoryIcons = {
    all: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
    ),
    invoices: <DocIcon className="w-5 h-5" />,
    receipts: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    vatSchedules: <DocIcon className="w-5 h-5" />,
    filings: <DocIcon className="w-5 h-5" />,
    whtCerts: <DocIcon className="w-5 h-5" />,
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={defaultClientId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 overflow-y-auto bg-white">
          <div className="px-10 py-8">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Evidence Vault</h1>
              <p className="text-sm text-gray-400">Secure document storage for audits</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="relative mb-6">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Category Cards — 2 columns */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    const count = getCategoryCount(cat);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex flex-col p-4 rounded-xl border text-left transition-all ${
                          isActive
                            ? 'border-indigo-300 bg-indigo-50'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className={`mb-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                          {categoryIcons[cat.id]}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{cat.name}</p>
                        <p className={`text-3xl font-bold ${isActive ? 'text-indigo-600' : 'text-gray-900'}`}>
                          {count}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Documents list */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">
                    {activeCategory?.name} ({filteredDocs.length})
                  </h2>

                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {filteredDocs.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-sm text-gray-400">No documents found</p>
                      </div>
                    ) : (
                      filteredDocs.map((doc, idx) => (
                        <div
                          key={doc.id}
                          onClick={() => navigate(`/evidence-vault/${doc.id}`)}
                          className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            idx < filteredDocs.length - 1 ? 'border-b border-gray-100' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{doc.documentName || doc.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">ID: {doc.id}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-gray-400">{formatDate(doc.dateUploaded || doc.uploadedAt || doc.createdAt)}</span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                                  {doc.category || 'Other'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-4">
                            <span className="text-xs text-gray-400">{formatFileSize(doc.fileSize)}</span>
                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Audit-Ready Banner */}
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-700">Audit-Ready Storage</p>
                    <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
                      All documents are securely stored and organized for easy retrieval during tax audits. Documents are automatically linked to their source transactions.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvidenceVault;
