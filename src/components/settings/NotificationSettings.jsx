import { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import { getNotificationSettings, updateNotificationSettings } from '../../services/settingsApi';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    // Email notifications
    taxDeadline: false,
    filingConfirmations: false,
    payersNotifications: false,
    weeklySummary: false,
    // SMS notifications (if available in future)
    filingReminders: false,
    complianceUpdates: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const emailNotifications = [
    {
      id: 'taxDeadline',
      label: 'Tax deadline reminders',
      description: 'Get notified 7, 3, and 1 day before deadlines',
    },
    {
      id: 'filingConfirmations',
      label: 'Filing confirmations',
      description: 'Receive confirmations when filings are submitted',
    },
    {
      id: 'payersNotifications',
      label: 'Payment notifications',
      description: 'Alerts for payment due dates and confirmations',
    },
    {
      id: 'weeklySummary',
      label: 'Weekly summary reports',
      description: 'Summary of clients compliance status every Monday',
    },
  ];

  const smsNotifications = [
    {
      id: 'filingReminders',
      label: 'Urgent deadline alerts',
      description: 'SMS alerts for deadlines within 24 hours',
    },
    {
      id: 'complianceUpdates',
      label: 'Filing status updates',
      description: 'SMS when filing status changes',
    },
  ];

  // Fetch notification settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getNotificationSettings();

        if (response.status && response.data) {
          setSettings({
            taxDeadline: response.data.taxDeadline || false,
            filingConfirmations: response.data.filingConfirmations || false,
            payersNotifications: response.data.payersNotifications || false,
            weeklySummary: response.data.weeklySummary || false,
            filingReminders: response.data.filingReminders || false,
            complianceUpdates: response.data.complianceUpdates || false,
          });
        } else {
          throw new Error('Failed to load notification settings');
        }
      } catch (err) {
        console.error('Notification settings fetch error:', err);
        setError(err.message || 'Failed to load notification settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleCheckboxChange = (settingId) => {
    setSettings((prev) => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
    // Clear messages when user changes settings
    setSuccessMessage('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage('');

      const response = await updateNotificationSettings(settings);

      if (response.status) {
        setSuccessMessage('Notification preferences updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to update notification preferences');
      }
    } catch (err) {
      console.error('Notification settings update error:', err);
      setError(err.message || 'Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Notifications</h2>
        <p className="text-sm text-gray-500">
          Configure how you receive alerts and updates
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Email Notifications</h3>
          <div className="divide-y divide-gray-200">
            {emailNotifications.map((option, index) => (
              <div key={option.id} className={`flex items-start justify-between ${index === 0 ? 'pb-4' : 'py-4'}`}>
                <div className="flex-1">
                  <label htmlFor={option.id} className="block text-sm font-medium text-gray-900">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                </div>
                <div className="flex items-center h-5 ml-4">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={settings[option.id]}
                    onChange={() => handleCheckboxChange(option.id)}
                    className="w-4 h-4 rounded accent-brand focus:ring-2 focus:ring-brand cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6">SMS Notifications</h3>
          <div className="divide-y divide-gray-200">
            {smsNotifications.map((option, index) => (
              <div key={option.id} className={`flex items-start justify-between ${index === 0 ? 'pb-4' : 'py-4'}`}>
                <div className="flex-1">
                  <label htmlFor={option.id} className="block text-sm font-medium text-gray-900">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                </div>
                <div className="flex items-center h-5 ml-4">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={settings[option.id]}
                    onChange={() => handleCheckboxChange(option.id)}
                    className="w-4 h-4 rounded accent-brand focus:ring-2 focus:ring-brand cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;
