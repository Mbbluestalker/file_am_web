import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';

const DocumentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  // Mock document data — replace with API call when endpoint is available
  const doc = {
    id,
    docId: 'DOC-001',
    name: 'Invoice INV-001 - ABC Corp',
    category: 'Invoices',
    source: 'Sales',
    date: '5 Feb 2026',
    fileSize: '245 KB',
  };

  const fields = [
    { label: 'Document ID', value: doc.docId },
    { label: 'Name', value: doc.name },
    { label: 'Category', value: doc.category },
    { label: 'Source', value: doc.source },
    { label: 'Date', value: doc.date },
    { label: 'File Size', value: doc.fileSize },
  ];

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={defaultClientId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 overflow-y-auto bg-white">
          <div className="px-10 py-8">
            {/* Page Header */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Evidence Vault</h1>
              <p className="text-sm text-gray-400">Secure document storage for audits</p>
            </div>

            {/* Back link */}
            <button
              onClick={() => navigate('/evidence-vault')}
              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 mb-6 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>

            {/* Document Details heading */}
            <h2 className="text-xl font-bold text-gray-900 mb-5">Document Details</h2>

            {/* Document Preview */}
            <div className="relative rounded-xl overflow-hidden mb-6 bg-gray-400" style={{ minHeight: 220 }}>
              {/* Background document mock */}
              <div className="absolute inset-0 bg-gray-500 opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white/80">Document Preview</p>
                <p className="text-sm font-semibold text-white mt-0.5">{doc.name}</p>
              </div>
            </div>

            {/* Metadata — vertical list */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
              {fields.map((field, idx) => (
                <div
                  key={field.label}
                  className={`px-5 py-4 ${idx < fields.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <p className="text-xs text-gray-400 mb-1">{field.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{field.value}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentDetail;
