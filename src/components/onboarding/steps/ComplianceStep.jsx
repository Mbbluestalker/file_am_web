import { useState } from 'react';
import { submitStep7, uploadFile } from '../../../services/onboardingApi';

/**
 * COMPLIANCE & VERIFICATION STEP
 *
 * Step 7 of onboarding - Upload required documents and complete verification declarations
 */
function ComplianceStep({ data, onNext, onBack, onSaveDraft }) {
  const [formData, setFormData] = useState({
    cacDocument: data?.cacDocument || null,
    principalPartnerId: data?.principalPartnerId || null,
    professionalCertificate: data?.professionalCertificate || null,
    amlDocument: data?.amlDocument || null,
    firmProfile: data?.firmProfile || null,
    declarationAccuracy: data?.declarationAccuracy ?? false,
    declarationFirsCompliance: data?.declarationFirsCompliance ?? false,
    declarationSuspensionPolicy: data?.declarationSuspensionPolicy ?? false
  });

  // Store uploaded URLs
  const [uploadedUrls, setUploadedUrls] = useState({
    cacDocumentUrl: data?.cacDocumentUrl || null,
    principalPartnerIdUrl: data?.principalPartnerIdUrl || null,
    professionalCertificateUrl: data?.professionalCertificateUrl || null,
    amlDocumentUrl: data?.amlDocumentUrl || null,
    firmProfileUrl: data?.firmProfileUrl || null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [uploadStates, setUploadStates] = useState({
    cacDocument: false,
    principalPartnerId: false,
    professionalCertificate: false,
    amlDocument: false,
    firmProfile: false
  });

  const [uploadingStates, setUploadingStates] = useState({
    cacDocument: false,
    principalPartnerId: false,
    professionalCertificate: false,
    amlDocument: false,
    firmProfile: false
  });

  const documentRequirements = [
    {
      id: 'cacDocument',
      title: 'CAC Document',
      description: 'Corporate Affairs Commission certificate',
      required: true
    },
    {
      id: 'principalPartnerId',
      title: 'Principal Partner ID',
      description: 'Valid government-issued ID',
      required: true
    },
    {
      id: 'professionalCertificate',
      title: 'Professional Certificate',
      description: 'ICAN, CITN, or other relevant certifications',
      required: true
    },
    {
      id: 'amlDocument',
      title: 'AML Document',
      description: 'Anti-Money Laundering compliance document',
      required: true
    },
    {
      id: 'firmProfile',
      title: 'Firm Profile',
      description: 'Company overview document',
      required: false
    }
  ];

  const declarations = [
    {
      id: 'declarationAccuracy',
      text: 'I confirm that all information provided is accurate and complete to the best of my knowledge'
    },
    {
      id: 'declarationFirsCompliance',
      text: 'I agree to conduct all tax services in compliance with FIRS regulations and professional standards'
    },
    {
      id: 'declarationSuspensionPolicy',
      text: 'I acknowledge that FileAm reserves the right to suspend accounts that violate compliance policies'
    }
  ];

  const handleFileUpload = async (docId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Store file in state
    setFormData(prev => ({
      ...prev,
      [docId]: file
    }));

    // Set uploading state
    setUploadingStates(prev => ({
      ...prev,
      [docId]: true
    }));

    try {
      // Upload file immediately
      console.log(`Uploading ${docId}...`);
      const uploadResponse = await uploadFile(file);

      if (uploadResponse.status && uploadResponse.data?.url) {
        // Store the URL
        const urlKey = `${docId}Url`;
        setUploadedUrls(prev => ({
          ...prev,
          [urlKey]: uploadResponse.data.url
        }));

        // Mark as uploaded
        setUploadStates(prev => ({
          ...prev,
          [docId]: true
        }));

        console.log(`${docId} uploaded successfully:`, uploadResponse.data.url);
      } else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (err) {
      console.error(`Error uploading ${docId}:`, err);
      setError(`Failed to upload ${docId}: ${err.message}`);

      // Clear the file on error
      setFormData(prev => ({
        ...prev,
        [docId]: null
      }));
    } finally {
      // Clear uploading state
      setUploadingStates(prev => ({
        ...prev,
        [docId]: false
      }));
    }
  };

  const handleRemoveFile = (docId) => {
    setFormData(prev => ({
      ...prev,
      [docId]: null
    }));
    setUploadStates(prev => ({
      ...prev,
      [docId]: false
    }));
    // Clear the uploaded URL
    const urlKey = `${docId}Url`;
    setUploadedUrls(prev => ({
      ...prev,
      [urlKey]: null
    }));
  };

  const handleDeclarationChange = (declarationId) => {
    setFormData(prev => ({
      ...prev,
      [declarationId]: !prev[declarationId]
    }));
  };

  const handleSubmit = async (saveAsDraft = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build payload with already-uploaded URLs and declarations
      const payload = {
        cacDocumentUrl: uploadedUrls.cacDocumentUrl,
        principalPartnerIdUrl: uploadedUrls.principalPartnerIdUrl,
        professionalCertificateUrl: uploadedUrls.professionalCertificateUrl,
        amlDocumentUrl: uploadedUrls.amlDocumentUrl,
        firmProfileUrl: uploadedUrls.firmProfileUrl,
        declarationAccuracy: formData.declarationAccuracy,
        declarationFirsCompliance: formData.declarationFirsCompliance,
        declarationSuspensionPolicy: formData.declarationSuspensionPolicy,
        saveAsDraft: saveAsDraft
      };

      console.log('Submitting Step 7 with document URLs:', payload);

      const response = await submitStep7(payload);

      if (response.status) {
        onNext(response.data);
      } else {
        setError(response.message || 'Failed to save step 7');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Step 7 submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-end">
          <span className="text-sm text-gray-500">Account Setup</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Compliance & Verification
            </h1>
            <p className="text-sm text-gray-500">
              Upload required documents and complete verification declarations
            </p>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Required Documents
            </h3>

            <div className="space-y-4">
              {documentRequirements.map(doc => (
                <div key={doc.id}>
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <h4 className="text-xs font-medium text-gray-900">
                        {doc.title}
                        {doc.required && <span className="text-red-500">*</span>}
                      </h4>
                      <p className="text-xs text-gray-500">{doc.description}</p>
                    </div>
                  </div>

                  {/* Upload Area */}
                  {uploadingStates[doc.id] ? (
                    <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-blue-300 border-dashed rounded-lg bg-blue-50">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="animate-spin h-6 w-6 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-xs text-blue-700 font-medium">Uploading...</p>
                      </div>
                    </div>
                  ) : !uploadStates[doc.id] ? (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-4 pb-4">
                        <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-1 text-xs text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(doc.id, e)}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="text-xs font-medium text-gray-900">
                            {formData[doc.id]?.name || 'TaxC_Signup.pdf'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(formData[doc.id]?.size / 1024 / 1024).toFixed(2) || '0.13'} MB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(doc.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Declarations */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Declarations
            </h3>

            <div className="space-y-3">
              {declarations.map(declaration => (
                <label
                  key={declaration.id}
                  className="flex items-start gap-2.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData[declaration.id]}
                    onChange={() => handleDeclarationChange(declaration.id)}
                    className="mt-0.5 w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">{declaration.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200 px-8 py-4">
        <div className="max-w-4xl flex justify-end gap-3">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplianceStep;
