import { useState } from 'react';
import { submitStep3 } from '../../../services/onboardingApi';

/**
 * ADDITIONAL PARTNERS STEP
 *
 * Step 3 of onboarding - Collect details for additional partners
 */
function AdditionalPartnersStep({ data, partnerCount, onNext, onBack, onSaveDraft }) {
  // Generate partner slots based on count from previous step (excluding principal partner)
  const additionalPartnersCount = Math.max(0, partnerCount - 1);

  // Handle prefill from API response
  const initialPartners = Array.from({ length: additionalPartnersCount }, (_, i) => {
    const existingPartner = (Array.isArray(data) ? data[i] : data?.additionalPartners?.[i]) || {};

    return {
      name: existingPartner.fullName || existingPartner.partnerName || existingPartner.name || '',
      role: existingPartner.role || 'Partner',
      yearsOfExperience: existingPartner.yearsOfExperience || '',
      certifications: (existingPartner.certifications || [{ qualification: '', issuingBody: '', national: '', year: '' }]).map(cert => ({
        qualification: cert.qualificationName || cert.qualification || '',
        issuingBody: cert.issuingBody || '',
        national: cert.national || '',
        year: cert.year || ''
      }))
    };
  });

  const [partners, setPartners] = useState(initialPartners);
  const [expandedPartner, setExpandedPartner] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePartnerChange = (partnerIndex, field, value) => {
    const newPartners = [...partners];
    newPartners[partnerIndex][field] = value;
    setPartners(newPartners);
  };

  const handleCertificationChange = (partnerIndex, certIndex, field, value) => {
    const newPartners = [...partners];
    newPartners[partnerIndex].certifications[certIndex][field] = value;
    setPartners(newPartners);
  };

  const addCertification = (partnerIndex) => {
    const newPartners = [...partners];
    newPartners[partnerIndex].certifications.push({
      qualification: '',
      issuingBody: '',
      national: '',
      year: ''
    });
    setPartners(newPartners);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Transform partners to match API format
      const additionalPartners = partners.map(partner => ({
        partnerName: partner.name,
        role: partner.role,
        yearsOfExperience: parseInt(partner.yearsOfExperience) || 0,
        certifications: partner.certifications
          .filter(cert => cert.qualification && cert.issuingBody)
          .map(cert => ({
            qualification: cert.qualification,
            issuingBody: cert.issuingBody,
            national: cert.national || null,
            year: parseInt(cert.year) || new Date().getFullYear()
          }))
      }));

      const payload = { additionalPartners };

      console.log('Submitting Step 3 payload:', payload);

      const response = await submitStep3(payload);

      if (response.status) {
        onNext(response.data);
      } else {
        setError(response.message || 'Failed to save step 3');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Step 3 submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePartner = (index) => {
    setExpandedPartner(expandedPartner === index ? null : index);
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
              Additional Partner Details
            </h1>
            <p className="text-sm text-gray-500">
              Provide details for each additional partner in your firm
            </p>
          </div>

          {/* Partners List */}
          <div className="space-y-3">
            {partners.map((partner, partnerIndex) => (
              <div key={partnerIndex} className="bg-white rounded-lg border border-gray-200">
                {/* Partner Header */}
                <button
                  onClick={() => togglePartner(partnerIndex)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Partner {partnerIndex + 1}
                      </div>
                      <div className="text-xs text-gray-500">{partner.role}</div>
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedPartner === partnerIndex ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Partner Details (Expandable) */}
                {expandedPartner === partnerIndex && (
                  <div className="px-4 pb-4 border-t border-gray-200">
                    <div className="pt-4">
                      {/* Partner Name and Role */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1.5">
                            Partner Name
                          </label>
                          <input
                            type="text"
                            value={partner.name}
                            onChange={(e) => handlePartnerChange(partnerIndex, 'name', e.target.value)}
                            placeholder="Enter partner name"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1.5">
                            Role
                          </label>
                          <select
                            value={partner.role}
                            onChange={(e) => handlePartnerChange(partnerIndex, 'role', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="Tax Advisory">Tax Advisory</option>
                            <option value="Compliance">Compliance</option>
                            <option value="Audit">Audit</option>
                            <option value="Consulting">Consulting</option>
                          </select>
                        </div>
                      </div>

                      {/* Years of Experience */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          value={partner.yearsOfExperience}
                          onChange={(e) => handlePartnerChange(partnerIndex, 'yearsOfExperience', e.target.value)}
                          placeholder="e.g., 10"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Professional Certifications */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          Professional Certifications
                        </label>

                        {partner.certifications.map((cert, certIndex) => (
                          <div key={certIndex} className="mb-3">
                            <div className="text-xs text-gray-600 mb-1.5">
                              Certification #{certIndex + 1}
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              <input
                                type="text"
                                value={cert.qualification}
                                onChange={(e) => handleCertificationChange(partnerIndex, certIndex, 'qualification', e.target.value)}
                                placeholder="Qualification"
                                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                              <input
                                type="text"
                                value={cert.issuingBody}
                                onChange={(e) => handleCertificationChange(partnerIndex, certIndex, 'issuingBody', e.target.value)}
                                placeholder="Issuing Body"
                                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                              <select
                                value={cert.national}
                                onChange={(e) => handleCertificationChange(partnerIndex, certIndex, 'national', e.target.value)}
                                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              >
                                <option value="">Select</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="International">International</option>
                              </select>
                              <input
                                type="text"
                                value={cert.year}
                                onChange={(e) => handleCertificationChange(partnerIndex, certIndex, 'year', e.target.value)}
                                placeholder="Year"
                                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addCertification(partnerIndex)}
                          className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                        >
                          <span className="text-base">+</span> Add Certification
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {additionalPartnersCount === 0 && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-500">No additional partners to add based on your selection.</p>
              </div>
            )}
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

export default AdditionalPartnersStep;
