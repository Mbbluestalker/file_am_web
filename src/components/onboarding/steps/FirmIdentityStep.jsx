import { useState } from 'react';
import { submitStep1 } from '../../../services/onboardingApi';

/**
 * FIRM IDENTITY STEP
 *
 * Step 1 of onboarding - Collect firm's legal structure and registration details
 */
function FirmIdentityStep({ data, onNext, onSaveDraft }) {
  const [formData, setFormData] = useState({
    businessStructure: data?.businessStructure || 'Sole Proprietorship',
    firmName: data?.firmName || '',
    registrationType: data?.registrationType || 'RC',
    rcNumber: data?.rcNumber || '',
    yearOfIncorporation: data?.yearOfIncorporation || '',
    countryOfRegistration: data?.countryOfRegistration || 'Nigeria',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user makes changes
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert yearOfIncorporation to number
      const payload = {
        ...formData,
        yearOfIncorporation: parseInt(formData.yearOfIncorporation) || new Date().getFullYear()
      };

      const response = await submitStep1(payload);

      if (response.status) {
        // Pass the API response data to parent
        onNext(response.data);
      } else {
        setError(response.message || 'Failed to save step 1');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Step 1 submission error:', err);
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
              Firm Identity & Legal Structure
            </h1>
            <p className="text-sm text-gray-500">
              Tell us about your firm's legal structure and registration details
            </p>
          </div>

          {/* Business Structure */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Business Structure
            </label>
            <select
              value={formData.businessStructure}
              onChange={(e) => handleChange('businessStructure', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Limited Liability Company">Limited Liability Company</option>
              <option value="Corporation">Corporation</option>
            </select>
          </div>

          {/* Registration Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Registration Details
            </h3>

            {/* Firm Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Firm Name
              </label>
              <input
                type="text"
                value={formData.firmName}
                onChange={(e) => handleChange('firmName', e.target.value)}
                placeholder="Enter your firm's registered name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Registration Type and RC Number */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Registration Type
                </label>
                <input
                  type="text"
                  value={formData.registrationType}
                  onChange={(e) => handleChange('registrationType', e.target.value)}
                  placeholder="RC"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  RC Number
                </label>
                <input
                  type="text"
                  value={formData.rcNumber}
                  onChange={(e) => handleChange('rcNumber', e.target.value)}
                  placeholder="Enter RC number"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Year of Incorporation and Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Year of Incorporation
                </label>
                <select
                  value={formData.yearOfIncorporation}
                  onChange={(e) => handleChange('yearOfIncorporation', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Country of Registration
                </label>
                <input
                  type="text"
                  value={formData.countryOfRegistration}
                  onChange={(e) => handleChange('countryOfRegistration', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-5">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Note:</span> Completing Step 1 creates your account. Activation requires completion of verification steps.
            </p>
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

export default FirmIdentityStep;
