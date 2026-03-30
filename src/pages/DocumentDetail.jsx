import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';

const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (str) => {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const DocumentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  const doc = state?.doc || { id };
  const fileUrl = doc.fileUrl || doc.file_url || doc.url || null;
  const docName = doc.documentName || doc.name || 'Document';

  const fields = [
    { label: 'Document ID', value: doc.id || id },
    { label: 'Name', value: docName },
    { label: 'Category', value: doc.category || '—' },
    { label: 'Source', value: doc.source || '—' },
    { label: 'Date', value: formatDate(doc.dateUploaded || doc.uploadedAt || doc.createdAt) },
    { label: 'File Size', value: formatFileSize(doc.fileSize) },
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

            {/* PDF Viewer */}
            <div className="rounded-xl overflow-hidden mb-6 border border-gray-200 bg-gray-50" style={{ height: 480 }}>
              {fileUrl ? (
                <iframe
                  src={fileUrl}
                  title={docName}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-500">{docName}</p>
                  <p className="text-xs text-gray-400 mt-1">Preview not available</p>
                </div>
              )}
            </div>

            {/* Metadata */}
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
              <a
                href={fileUrl || '#'}
                download={docName}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold transition-colors ${
                  fileUrl
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-300 cursor-not-allowed pointer-events-none'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
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
