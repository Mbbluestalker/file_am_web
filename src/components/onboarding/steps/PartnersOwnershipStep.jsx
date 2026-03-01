import { useState, useEffect } from 'react';
import { submitStep2 } from '../../../services/onboardingApi';

/**
 * PARTNERS & OWNERSHIP STEP
 *
 * Step 2 of onboarding - Collect principal partner details and qualifications
 */
function PartnersOwnershipStep({ data, onNext, onBack, onSaveDraft }) {
  // Initialize form data from props
  const initializeFormData = (data) => {
    // Handle prefill from API response (data could be from partners[0] or session.partners[0])
    const principalPartner = data?.partners?.[0] || data;

    return {
      partnerCount: data?.numberOfPartners || data?.partnerCount || 1,
      fullName: principalPartner?.fullName || '',
      email: principalPartner?.email || '',
      phone: principalPartner?.phone || '',
      yearsOfExperience: principalPartner?.yearsOfExperience || '',
      certifications: (principalPartner?.certifications || [{ qualificationName: '', issuingBody: '', year: '' }]).map(cert => ({
        qualification: cert.qualificationName || cert.qualification || '',
        issuingBody: cert.issuingBody || '',
        year: cert.year || ''
      }))
    };
  };

  const [formData, setFormData] = useState(initializeFormData(data));

  // Update form data when data prop changes (e.g., when navigating back)
  useEffect(() => {
    setFormData(initializeFormData(data));
  }, [data]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...formData.certifications];
    newCertifications[index][field] = value;
    setFormData(prev => ({
      ...prev,
      certifications: newCertifications
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { qualification: '', issuingBody: '', year: '' }]
    }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Transform certifications to match API format
      const certifications = formData.certifications
        .filter(cert => cert.qualification && cert.issuingBody) // Only include filled certifications
        .map(cert => ({
          qualificationName: cert.qualification,
          issuingBody: cert.issuingBody,
          year: parseInt(cert.year) || new Date().getFullYear()
        }));

      // Build payload matching API spec
      const payload = {
        numberOfPartners: parseInt(formData.partnerCount) || 1,
        principalPartner: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
          certifications: certifications
        }
      };

      console.log('Submitting Step 2 payload:', payload);

      const response = await submitStep2(payload);

      if (response.status) {
        // Pass both the API response data and the numberOfPartners for next step
        onNext({
          ...response.data,
          numberOfPartners: parseInt(formData.partnerCount) || 1,
          partnerCount: parseInt(formData.partnerCount) || 1 // Keep for backwards compatibility
        });
      } else {
        setError(response.message || 'Failed to save step 2');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Step 2 submission error:', err);
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
              Partners & Ownership Structure
            </h1>
            <p className="text-sm text-gray-500">
              Provide information about the firm's partners and their qualifications
            </p>
          </div>

          {/* Number of Partners */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              How many partners are in the firm?
            </label>
            <input
              type="number"
              min="1"
              value={formData.partnerCount}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty string for editing, otherwise parse as number with minimum 1
                handleChange('partnerCount', value === '' ? '' : Math.max(1, parseInt(value) || 1));
              }}
              className="w-48 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Principal Partner Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Principal Partner Details
            </h3>

            {/* Name and Email */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="partner@firm.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Phone and Years of Experience */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
                  placeholder="e.g., 15"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Professional Certifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">
                Professional Certifications
              </h3>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {formData.certifications.map((cert, index) => (
              <div key={index} className="mb-3">
                <div className="text-xs text-gray-600 mb-1.5">Certification #{index + 1}</div>
                <div className="grid grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={cert.qualification}
                    onChange={(e) => handleCertificationChange(index, 'qualification', e.target.value)}
                    placeholder="Qualification Name"
                    className="col-span-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="text"
                    value={cert.issuingBody}
                    onChange={(e) => handleCertificationChange(index, 'issuingBody', e.target.value)}
                    placeholder="Issuing Body"
                    className="col-span-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) => handleCertificationChange(index, 'year', e.target.value)}
                    placeholder="Year"
                    className="col-span-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="col-span-1 text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addCertification}
              className="mt-3 text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-2"
            >
              <span className="text-lg">+</span> Add Another Qualification
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-5">
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
            onClick={onSaveDraft}
            disabled={isLoading}
            className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save as Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PartnersOwnershipStep;
