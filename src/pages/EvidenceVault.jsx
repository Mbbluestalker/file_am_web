import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Receipt, File, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';
import { getEvidenceVaultStats, getEvidenceVaultDocuments } from '../services/evidenceVaultApi';

const EvidenceVault = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use first client as default for sidebar navigation
  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch evidence vault data from API
  useEffect(() => {
    const fetchEvidenceVault = async () => {
      if (!defaultClientId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch stats and documents in parallel
        const [statsResponse, docsResponse] = await Promise.all([
          getEvidenceVaultStats(defaultClientId),
          getEvidenceVaultDocuments(defaultClientId, 1, 50)
        ]);

        if (statsResponse.status && statsResponse.data) {
          setStats(statsResponse.data);
        }

        if (docsResponse.status && docsResponse.data) {
          // Handle both paginated and non-paginated responses
          const docsList = docsResponse.data.data || docsResponse.data.documents || docsResponse.data;
          setDocuments(Array.isArray(docsList) ? docsList : []);
        }
      } catch (err) {
        console.error('Evidence Vault fetch error:', err);
        setError(err.message || 'Failed to load evidence vault');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvidenceVault();
  }, [defaultClientId]);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Build categories from stats data
  const categories = [
    {
      id: 'all',
      name: 'All Documents',
      icon: FileText,
      count: stats?.totalDocuments || 0,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'invoices',
      name: 'Invoices',
      icon: Receipt,
      count: stats?.byCategory?.invoices || 0,
      color: 'bg-white border-gray-200'
    },
    {
      id: 'receipts',
      name: 'Receipts',
      icon: Receipt,
      count: stats?.byCategory?.receipts || 0,
      color: 'bg-white border-gray-200'
    },
    {
      id: 'contracts',
      name: 'Contracts',
      icon: File,
      count: stats?.byCategory?.contracts || 0,
      color: 'bg-white border-gray-200'
    },
    {
      id: 'filings',
      name: 'Filings',
      icon: ShieldCheck,
      count: stats?.byCategory?.filings || 0,
      color: 'bg-white border-gray-200'
    },
    {
      id: 'other',
      name: 'Other',
      icon: FileText,
      count: stats?.byCategory?.other || 0,
      color: 'bg-white border-gray-200'
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = (doc.documentName || doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar clientId={defaultClientId} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header hideLogo={true} />

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="px-10 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Evidence Vault</h1>
              <p className="text-sm text-gray-500">Secure document storage for audits</p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600">Loading documents...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">Unable to load evidence vault data</p>
                    <p className="text-xs text-yellow-700 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-xs font-medium text-yellow-700 hover:text-yellow-800 underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {!isLoading && (
              <>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${category.color} border-2 rounded-lg p-4 text-left hover:shadow-sm transition-all ${
                      isSelected ? 'ring-2 ring-brand' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-3xl font-bold text-gray-900">{category.count}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategory === 'all' ? 'All Documents' : categories.find(c => c.id === selectedCategory)?.name} ({filteredDocuments.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => navigate(`/evidence-vault/${doc.id}`)}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{doc.documentName || doc.name || 'Untitled Document'}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">ID:</span> {doc.id}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(doc.uploadedAt || doc.createdAt)}
                            </span>
                            <span className="capitalize">{doc.category || 'Other'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{formatFileSize(doc.fileSize)}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No documents found</p>
                </div>
              )}
            </div>

            {/* Info Banner */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm mb-1">Audit-Ready Storage</h3>
                  <p className="text-sm text-blue-800">
                    All documents are securely stored and organized for easy retrieval during tax audits.
                    Documents are automatically linked to their source transactions.
                  </p>
                </div>
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
