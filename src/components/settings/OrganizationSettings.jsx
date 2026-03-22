import { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import { getConsultantBusiness, updateConsultantBusiness } from '../../services/settingsApi';

const OrganizationSettings = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    taxIdentificationNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getConsultantBusiness();

        if (response.status && response.data) {
          setFormData({
            organizationName: response.data.organizationName || response.data.firmName || '',
            taxIdentificationNumber: response.data.taxIdentificationNumber || response.data.tin || '',
            address: response.data.address || '',
            city: response.data.city || '',
            state: response.data.state || '',
            country: response.data.country || response.data.countryOfRegistration || '',
            phoneNumber: response.data.phoneNumber || response.data.phone || '',
          });
        } else {
          throw new Error('Failed to load organization information');
        }
      } catch (err) {
        console.error('Organization fetch error:', err);
        setError(err.message || 'Failed to load organization information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusiness();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user types
    setSuccessMessage('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage('');

      const response = await updateConsultantBusiness(formData);

      if (response.status) {
        setSuccessMessage('Organization information updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to update organization information');
      }
    } catch (err) {
      console.error('Organization update error:', err);
      setError(err.message || 'Failed to update organization information');
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
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Organization</h2>
        <p className="text-sm text-gray-500">
          Manage your organization details and tax information
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

      <form onSubmit={handleSubmit}>
        {/* Company Information Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="space-y-4">
            {/* Organization Name */}
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>

            {/* Tax Identification Number */}
            <div>
              <label htmlFor="taxIdentificationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Tax Identification Number (TIN)
              </label>
              <input
                type="text"
                id="taxIdentificationNumber"
                name="taxIdentificationNumber"
                value={formData.taxIdentificationNumber}
                onChange={handleChange}
                placeholder="e.g., TIN-12345678-0001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>

            {/* City, State, Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationSettings;
