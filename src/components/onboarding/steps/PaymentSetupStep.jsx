import { useState } from 'react';
import { submitStep6 } from '../../../services/onboardingApi';

/**
 * PAYMENT COLLECTION SETUP STEP
 *
 * Step 6 of onboarding - Configure how to collect payments from clients
 */
function PaymentSetupStep({ data, onNext, onBack, onSaveDraft }) {
  const [formData, setFormData] = useState({
    paymentMethod: data?.paymentMethod || 'bank_transfer',
    bankAccountNumber: data?.bankAccountNumber || '',
    warrantApproval: data?.warrantApproval || '',
    selfRemittance: data?.selfRemittance || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const paymentMethods = [
    {
      id: 'bank_transfer',
      icon: '🏦',
      title: 'Bank Transfer',
      description: 'Direct bank deposit'
    },
    {
      id: 'card_payment',
      icon: '💳',
      title: 'Card Payment',
      description: 'Accept card payments'
    },
    {
      id: 'wallet',
      icon: '💼',
      title: 'Digital Wallet',
      description: 'Online wallet payment'
    }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        paymentMethod: formData.paymentMethod,
        bankAccountNumber: formData.bankAccountNumber,
        warrantApproval: formData.warrantApproval || null,
        selfRemittance: formData.selfRemittance || null
      };

      console.log('Submitting Step 6 payload:', payload);

      const response = await submitStep6(payload);

      if (response.status) {
        onNext(response.data);
      } else {
        setError(response.message || 'Failed to save step 6');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Step 6 submission error:', err);
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
              Payment Collection Setup
            </h1>
            <p className="text-sm text-gray-500">
              Configure how you'll collect payments from clients
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Payment Method
            </h3>

            <div className="space-y-2">
              {paymentMethods.map(method => (
                <label
                  key={method.id}
                  className={`
                    flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                    ${formData.paymentMethod === method.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={() => handleChange('paymentMethod', method.id)}
                    className="mt-0.5 w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2.5 flex-1">
                    <div className="text-xl">{method.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{method.title}</div>
                      <div className="text-xs text-gray-500">{method.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Bank Account Details
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Bank Account Number
              </label>
              <input
                type="text"
                value={formData.bankAccountNumber}
                onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                placeholder="Enter 10-digit account number"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Warrant Approval (Optional)
                </label>
                <input
                  type="text"
                  value={formData.warrantApproval}
                  onChange={(e) => handleChange('warrantApproval', e.target.value)}
                  placeholder="Enter warrant details"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Self Remittance (Optional)
                </label>
                <input
                  type="text"
                  value={formData.selfRemittance}
                  onChange={(e) => handleChange('selfRemittance', e.target.value)}
                  placeholder="Enter remittance details"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
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

export default PaymentSetupStep;
