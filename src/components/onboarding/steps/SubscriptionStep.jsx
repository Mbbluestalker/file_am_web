import { useState } from 'react';
import { submitStep5 } from '../../../services/onboardingApi';

/**
 * SUBSCRIPTION & SERVICE CALENDAR STEP
 *
 * Step 5 of onboarding - Configure billing preferences and compliance reminder schedule
 */
function SubscriptionStep({ data, onNext, onBack, onSaveDraft }) {
  // Initialize from API response if available
  const initialReminders = data?.perFilingReminderConfig || [
    { filing: 'VAT', frequency: 'monthly', reminderDates: [1, 15] },
    { filing: 'PAYE', frequency: 'monthly', reminderDates: [5, 10] },
    { filing: 'WHT', frequency: 'monthly', reminderDates: [] },
    { filing: 'CIT', frequency: 'annual', reminderDates: [] }
  ];

  const [formData, setFormData] = useState({
    billingOption: data?.billingOption || 'annual',
    enableAutomatedComplianceReminders: data?.enableAutomatedComplianceReminders ?? true,
    perFilingReminderConfig: initialReminders
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const billingModels = [
    {
      id: 'monthly',
      title: 'Monthly Subscription',
      description: 'Billed every month'
    },
    {
      id: 'quarterly',
      title: 'Quarterly Retainer',
      description: 'Billed every 3 months'
    },
    {
      id: 'annual',
      title: 'Annual Retainer',
      description: 'Billed once per year'
    },
    {
      id: 'filing',
      title: 'Per Filing',
      description: 'Pay as you file'
    },
    {
      id: 'custom',
      title: 'Custom Arrangement',
      description: 'Tailored billing'
    }
  ];

  const complianceTypes = [
    { id: 'VAT', label: 'VAT', frequency: 'monthly' },
    { id: 'PAYE', label: 'PAYE', frequency: 'monthly' },
    { id: 'WHT', label: 'WHT', frequency: 'monthly' },
    { id: 'CIT', label: 'CIT', frequency: 'annual' }
  ];

  // Reminder dates (day of month, e.g., 1-31)
  const reminderDateOptions = [1, 5, 10, 15, 20, 25, 28];

  const handleBillingModelChange = (modelId) => {
    setFormData(prev => ({
      ...prev,
      billingOption: modelId
    }));
  };

  const handleReminderDateToggle = (filing, date) => {
    setFormData(prev => {
      const newConfig = [...prev.perFilingReminderConfig];
      const filingIndex = newConfig.findIndex(f => f.filing === filing);

      if (filingIndex !== -1) {
        const currentDates = newConfig[filingIndex].reminderDates;
        newConfig[filingIndex] = {
          ...newConfig[filingIndex],
          reminderDates: currentDates.includes(date)
            ? currentDates.filter(d => d !== date)
            : [...currentDates, date].sort((a, b) => a - b)
        };
      }

      return {
        ...prev,
        perFilingReminderConfig: newConfig
      };
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        billingOption: formData.billingOption,
        enableAutomatedComplianceReminders: formData.enableAutomatedComplianceReminders,
        perFilingReminderConfig: formData.perFilingReminderConfig
      };

      console.log('Submitting Step 5 payload:', payload);

      const response = await submitStep5(payload);

      if (response.status) {
        onNext(response.data);
      } else {
        setError(response.message || 'Failed to save step 5');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Step 5 submission error:', err);
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
              Subscription & Service Calendar
            </h1>
            <p className="text-sm text-gray-500">
              Configure your billing preferences and compliance reminder schedule
            </p>
          </div>

          {/* Billing Model Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">Billing Model Selection</h3>
            </div>

            <div className="space-y-2">
              {billingModels.map(model => (
                <label
                  key={model.id}
                  className={`
                    flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                    ${formData.billingOption === model.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="billingOption"
                    value={model.id}
                    checked={formData.billingOption === model.id}
                    onChange={() => handleBillingModelChange(model.id)}
                    className="mt-0.5 w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{model.title}</div>
                    <div className="text-xs text-gray-500">{model.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Compliance Reminder Setup */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <h3 className="text-sm font-medium text-gray-900">Automated Compliance Reminders</h3>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableAutomatedComplianceReminders}
                  onChange={(e) => setFormData(prev => ({ ...prev, enableAutomatedComplianceReminders: e.target.checked }))}
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">Enable</span>
              </label>
            </div>

            {formData.enableAutomatedComplianceReminders && (
              <>
                <p className="text-xs text-gray-500 mb-4">
                  Select reminder dates (day of month) for each filing type. These can be customized per client after activation.
                </p>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Filing Type
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Frequency
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Reminder Dates
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.perFilingReminderConfig.map((config, index) => (
                        <tr key={config.filing}>
                          <td className="px-4 py-3 text-xs font-medium text-gray-900">
                            {config.filing}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 capitalize">
                            {config.frequency}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              {reminderDateOptions.map(date => {
                                const isActive = config.reminderDates.includes(date);

                                return (
                                  <button
                                    key={date}
                                    type="button"
                                    onClick={() => handleReminderDateToggle(config.filing, date)}
                                    className={`
                                      px-2 py-1 text-xs font-medium rounded transition-colors
                                      ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }
                                    `}
                                  >
                                    Day {date}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Note */}
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <span className="font-medium">Note:</span> Reminder dates represent the day of the month when reminders will be sent. These can be customized per client after activation.
                  </p>
                </div>
              </>
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

export default SubscriptionStep;
