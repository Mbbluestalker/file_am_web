import { useState } from 'react';
import { submitStep4 } from '../../../services/onboardingApi';

/**
 * SCOPE OF PRACTICE STEP
 *
 * Step 4 of onboarding - Define geographical coverage, tax specializations, and client focus
 */
function ScopeOfPracticeStep({ data, onNext, onBack, onSaveDraft }) {
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
    'Abuja' // FCT
  ];

  const taxTypes = [
    { id: 'VAT', label: 'VAT (Value Added Tax)' },
    { id: 'PAYE', label: 'PAYE (Pay As You Earn)' },
    { id: 'WHT', label: 'WHT (Withholding Tax)' },
    { id: 'CIT', label: 'CIT (Company Income Tax)' },
    { id: 'CGT', label: 'CGT (Capital Gains Tax)' },
    { id: 'STAMP', label: 'Stamp Duties' },
    { id: 'EDUCATION', label: 'Education Tax' },
    { id: 'ITF', label: 'ITF Contributions' },
    { id: 'PENSION', label: 'Pension Compliance' },
    { id: 'LOCAL', label: 'Local Government Levies' },
    { id: 'TRANSFER', label: 'Transfer Pricing' },
    { id: 'OTHER', label: 'Other' },
  ];

  const businessSizes = [
    { id: 'Micro', label: 'Micro', revenue: 'Up to ₦10M revenue' },
    { id: 'Small', label: 'Small', revenue: '₦10M - ₦100M revenue' },
    { id: 'Medium', label: 'Medium', revenue: '₦100M - ₦1B revenue' },
    { id: 'Large', label: 'Large', revenue: 'Over ₦1B revenue' },
    { id: 'Multinational', label: 'Multinational', revenue: 'Cross-border entities' },
  ];

  const [formData, setFormData] = useState({
    primaryState: data?.primaryState || 'Lagos',
    additionalStates: data?.additionalStates || [],
    taxTypesSpecializations: data?.taxTypesSpecializations || [],
    businessSizeServed: data?.businessSizeServed || 'Medium',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStateToggle = (state) => {
    setFormData(prev => ({
      ...prev,
      additionalStates: prev.additionalStates.includes(state)
        ? prev.additionalStates.filter(s => s !== state)
        : [...prev.additionalStates, state]
    }));
  };

  const handleTaxTypeToggle = (taxId) => {
    setFormData(prev => ({
      ...prev,
      taxTypesSpecializations: prev.taxTypesSpecializations.includes(taxId)
        ? prev.taxTypesSpecializations.filter(t => t !== taxId)
        : [...prev.taxTypesSpecializations, taxId]
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        primaryState: formData.primaryState,
        additionalStates: formData.additionalStates,
        taxTypesSpecializations: formData.taxTypesSpecializations,
        businessSizeServed: formData.businessSizeServed
      };

      console.log('Submitting Step 4 payload:', payload);

      const response = await submitStep4(payload);

      if (response.status) {
        onNext(response.data);
      } else {
        setError(response.message || 'Failed to save step 4');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Step 4 submission error:', err);
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
              Scope of Practice & Expertise
            </h1>
            <p className="text-sm text-gray-500">
              Define your geographical coverage, tax specializations, and client focus
            </p>
          </div>

          {/* Geographical Coverage */}
          <div className="bg-gray-50 rounded-lg p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">Geographical Coverage</h3>
            </div>

            {/* Primary State */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Primary State
              </label>
              <select
                value={formData.primaryState}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryState: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Additional States */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Additional States (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Select all states where your firm provides services
              </p>
              <div className="grid grid-cols-3 gap-2">
                {nigerianStates.slice(0, 12).map(state => (
                  <label key={state} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.additionalStates.includes(state)}
                      onChange={() => handleStateToggle(state)}
                      className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">{state}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Tax Types & Specializations */}
          <div className="bg-gray-50 rounded-lg p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">Tax Types & Specializations</h3>
            </div>

            <div className="space-y-2">
              {taxTypes.map(tax => (
                <label key={tax.id} className="flex items-center gap-2.5 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.taxTypesSpecializations.includes(tax.id)}
                    onChange={() => handleTaxTypeToggle(tax.id)}
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">{tax.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Business Size Served */}
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">Business Size Served</h3>
            </div>

            <div className="space-y-2">
              {businessSizes.map(size => (
                <label key={size.id} className={`flex items-start gap-2.5 p-3 bg-white border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${formData.businessSizeServed === size.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="businessSizeServed"
                    checked={formData.businessSizeServed === size.id}
                    onChange={() => setFormData(prev => ({ ...prev, businessSizeServed: size.id }))}
                    className="w-3.5 h-3.5 mt-0.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-xs font-medium text-gray-900">{size.label}</div>
                    <div className="text-xs text-gray-500">{size.revenue}</div>
                  </div>
                </label>
              ))}
            </div>
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

export default ScopeOfPracticeStep;
