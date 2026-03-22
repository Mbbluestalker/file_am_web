import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { uploadInvoice } from '../../services/financialsApi';
import toast from 'react-hot-toast';

/**
 * UPLOAD INVOICE MODAL
 *
 * Modal for uploading invoices via drag-and-drop or file selection
 * Supports PDF and Excel files with progress tracking
 */
const UploadInvoiceModal = ({ isOpen, onClose, onUploadComplete }) => {
  const { clientId } = useParams();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('pdf'); // 'pdf' or 'excel'
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !clientId) return;

    try {
      setIsUploading(true);

      // Prepare invoice metadata
      const invoiceData = {
        invoiceType: uploadMethod === 'pdf' ? 'PDF' : 'Excel',
        uploadMethod: uploadMethod.toUpperCase(),
      };

      // Upload invoice to API
      const response = await uploadInvoice(clientId, selectedFile, invoiceData);

      if (response.status) {
        toast.success('Invoice uploaded successfully!');

        const documentId = response.data?.fileId || response.data?.id || null;
        onUploadComplete(selectedFile, documentId);

        // Reset state
        setSelectedFile(null);
        setUploadMethod('pdf');
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload invoice');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadMethod('pdf');
    setIsDragging(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upload Invoice</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Upload Method Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setUploadMethod('pdf')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${
                uploadMethod === 'pdf'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              PDF Upload
            </button>
            <button
              onClick={() => setUploadMethod('excel')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${
                uploadMethod === 'excel'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Excel Import
            </button>
          </div>

          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? 'border-teal-500 bg-teal-50'
                : selectedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {selectedFile ? (
              // File Selected State
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedFile.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {isDragging ? 'Drop file here' : 'Drag and drop your file here'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse from your computer
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept={uploadMethod === 'pdf' ? '.pdf' : '.xlsx,.xls,.csv'}
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="file-upload"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium cursor-pointer transition-colors"
                >
                  Browse Files
                </label>
                <p className="text-xs text-gray-400 mt-3">
                  {uploadMethod === 'pdf' ? 'Supported: PDF files' : 'Supported: Excel files (XLSX, XLS, CSV)'}
                </p>
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">AI-Powered Extraction</h4>
              <p className="text-xs text-blue-700">
                Our AI will automatically extract invoice details, verify vendor information, and check for compliance
                issues. You'll be able to review and approve before final submission.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="px-4 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedFile && !isUploading
                ? 'bg-teal-600 hover:bg-teal-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload & Process'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadInvoiceModal;
