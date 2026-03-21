import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Receipt, File, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';

const EvidenceVault = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Use first client as default for sidebar navigation
  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  // Mock data for document categories
  const categories = [
    { id: 'all', name: 'All Documents', icon: FileText, count: 6, color: 'bg-blue-50 border-blue-200' },
    { id: 'invoices', name: 'Invoices', icon: Receipt, count: 1, color: 'bg-white border-gray-200' },
    { id: 'receipts', name: 'Receipts', icon: Receipt, count: 1, color: 'bg-white border-gray-200' },
    { id: 'vat-schedules', name: 'VAT Schedules', icon: Calendar, count: 1, color: 'bg-white border-gray-200' },
    { id: 'filings', name: 'Filings', icon: File, count: 1, color: 'bg-white border-gray-200' },
    { id: 'wht-certs', name: 'WHT Certs', icon: ShieldCheck, count: 1, color: 'bg-white border-gray-200' },
  ];

  // Mock data for documents
  const documents = [
    {
      id: '1',
      name: 'Invoice INV-001 - Victor Asuquo',
      docId: 'DOC-001',
      date: '5 Feb 2026',
      category: 'Sales',
      size: '245 KB',
      type: 'invoices',
    },
    {
      id: '2',
      name: 'Receipt EXP-001 - Office Rent',
      docId: 'DOC-002',
      date: '1 Feb 2026',
      category: 'Expenses',
      size: '189 KB',
      type: 'receipts',
    },
    {
      id: '3',
      name: 'VAT Return January 2026',
      docId: 'DOC-003',
      date: '15 Feb 2026',
      category: 'Filings',
      size: '312 KB',
      type: 'filings',
    },
    {
      id: '4',
      name: 'VAT Schedule Q4 2025',
      docId: 'DOC-004',
      date: '28 Jan 2026',
      category: 'VAT Schedules',
      size: '428 KB',
      type: 'vat-schedules',
    },
    {
      id: '5',
      name: 'WHT Certificate - Supplier Payment',
      docId: 'DOC-005',
      date: '20 Feb 2026',
      category: 'WHT Certs',
      size: '156 KB',
      type: 'wht-certs',
    },
    {
      id: '6',
      name: 'Invoice INV-002 - ABC Corp',
      docId: 'DOC-006',
      date: '10 Feb 2026',
      category: 'Sales',
      size: '198 KB',
      type: 'invoices',
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.docId.toLowerCase().includes(searchQuery.toLowerCase());
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
                          <h3 className="font-medium text-gray-900 mb-1">{doc.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">ID:</span> {doc.docId}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {doc.date}
                            </span>
                            <span>{doc.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{doc.size}</span>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvidenceVault;
