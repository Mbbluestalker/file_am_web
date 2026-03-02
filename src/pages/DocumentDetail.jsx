import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Share2, FileText } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { clients } from '../data/clientsData';

const DocumentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Use first client as default for sidebar navigation
  const defaultClientId = clients[0]?.id || '1';

  // Mock document data
  const document = {
    id,
    docId: 'DOC-001',
    name: 'Invoice INV-001 - ABC Corp',
    category: 'Invoices',
    source: 'Sales',
    date: '5 Feb 2026',
    fileSize: '245 KB',
    // Document preview placeholder
    preview: {
      type: 'invoice',
      title: 'PAYMENT INSTRUCTION',
      paypalEmail: 'receipt@gmail.com',
      bankTransfer: 'Routing (ABC): 0560120214',
      subtotal: '145.00',
      salesTax: '9.06',
      signature: 'John Smith',
    },
  };

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
              <button
                onClick={() => navigate('/evidence-vault')}
                className="flex items-center gap-2 text-brand hover:text-brand/80 mb-4 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Details</h1>
            </div>

            {/* Document Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gray-100 px-6 py-8 text-center border-b border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm mb-4">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Document Preview</p>
                <p className="font-medium text-gray-900">{document.preview.title}</p>
              </div>

              {/* Preview Content - Simplified document representation */}
              <div className="bg-gray-50 p-8">
                <div className="max-w-2xl mx-auto bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{document.preview.title}</h3>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-gray-700">Paypal email</p>
                        <p className="text-gray-900">{document.preview.paypalEmail}</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700">Bank transfer</p>
                        <p className="text-gray-900">{document.preview.bankTransfer}</p>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4 mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Subtotal</span>
                        <span className="text-gray-900">{document.preview.subtotal}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Sales Tax 6.25%</span>
                        <span className="text-gray-900">{document.preview.salesTax}</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-2">Authorized Signature</p>
                        <p className="text-2xl font-bold italic text-gray-900">{document.preview.signature}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Metadata */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Document ID</p>
                  <p className="font-medium text-gray-900">{document.docId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-medium text-gray-900">{document.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-medium text-gray-900">{document.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Source</p>
                  <p className="font-medium text-gray-900">{document.source}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-900">{document.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">File Size</p>
                  <p className="font-medium text-gray-900">{document.fileSize}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors">
                <Share2 className="w-4 h-4" />
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
