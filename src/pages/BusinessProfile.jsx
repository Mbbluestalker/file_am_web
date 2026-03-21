import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import ClientHeader from '../components/client/ClientHeader';
import TextInput from '../components/common/TextInput';
import Dropdown from '../components/common/Dropdown';
import AlertBanner from '../components/common/AlertBanner';
import SystemEvaluation from '../components/businessProfile/SystemEvaluation';
import { getBusinessProfile, updateBusinessProfile, getBusinessTypes, getIndustries } from '../services/onboardingApi';

/**
 * BUSINESS PROFILE PAGE
 *
 * Displays and manages business profile information
 */
const BusinessProfile = () => {
  const { clientId } = useParams();
  const [businessProfile, setBusinessProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [industries, setIndustries] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    rcNumber: '',
    industry: '',
    turnoverBand: '',
    vatStatus: '',
    businessType: '',
    registrationDate: '',
    tin: '',
    businessAddress: '',
    phoneNumber: '',
    emailAddress: '',
    website: '',
    subscriptionPlan: '',
    monthlyPayment: '',
    nextRenewalDate: '',
    compliancePercent: 0,
  });

  // Fetch business types and industries on mount
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const [typesResponse, industriesResponse] = await Promise.all([
          getBusinessTypes(),
          getIndustries()
        ]);

        if (typesResponse.status && typesResponse.data) {
          setBusinessTypes(typesResponse.data);
        }

        if (industriesResponse.status && industriesResponse.data) {
          setIndustries(industriesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching dropdown options:', err);
      }
    };

    fetchDropdownOptions();
  }, []);

  // Fetch business profile from API
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getBusinessProfile(clientId);

        if (response.status && response.data) {
          const profile = response.data;
          setBusinessProfile(profile);

          // Update form data with API response
          setFormData({
            businessName: profile.companyName || '',
            rcNumber: profile.tin || '',
            industry: profile.industry || '',
            turnoverBand: determineTurnoverBand(profile.monthlyPayment),
            vatStatus: 'N/A', // API doesn't provide this in business profile
            businessType: profile.businessType || '',
            registrationDate: profile.registrationDate ? profile.registrationDate.split('T')[0] : '',
            tin: profile.tin || '',
            businessAddress: profile.businessAddress || '',
            phoneNumber: profile.phoneNumber || '',
            emailAddress: profile.emailAddress || '',
            website: profile.website || '',
            subscriptionPlan: profile.subscriptionPlan || '',
            monthlyPayment: profile.monthlyPayment ? `₦${profile.monthlyPayment.toLocaleString()}` : '',
            nextRenewalDate: profile.nextRenewalDate ? new Date(profile.nextRenewalDate).toLocaleDateString() : '',
            compliancePercent: profile.compliancePercent || 0,
          });
        } else {
          setError('Failed to load business profile');
        }
      } catch (err) {
        console.error('Error fetching business profile:', err);
        setError(err.message || 'Failed to load business profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [clientId]);

  // Helper function to determine turnover band (placeholder logic)
  const determineTurnoverBand = (monthlyPayment) => {
    // This is a placeholder - adjust logic based on actual business requirements
    if (!monthlyPayment) return '₦0 - ₦10m';
    const annual = monthlyPayment * 12;
    if (annual < 10000000) return '₦0 - ₦10m';
    if (annual < 24000000) return '₦10m - ₦24m';
    if (annual < 50000000) return '₦24m - ₦50m';
    if (annual < 100000000) return '₦50m - ₦100m';
    return '₦100m+';
  };

  // Get client data from localStorage for header
  const getClientFromStorage = () => {
    const storedClients = localStorage.getItem('clientsData');
    if (storedClients) {
      try {
        const clients = JSON.parse(storedClients);
        return clients.find((c) => c.id === clientId);
      } catch (err) {
        console.error('Error parsing clients data:', err);
      }
    }
    return null;
  };

  const client = getClientFromStorage();

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading business profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 !mb-2">Error Loading Profile</h1>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Turnover band options
  const turnoverOptions = [
    { value: '₦0 - ₦10m', label: '₦0 - ₦10m' },
    { value: '₦10m - ₦24m', label: '₦10m - ₦24m' },
    { value: '₦24m - ₦50m', label: '₦24m - ₦50m' },
    { value: '₦50m - ₦100m', label: '₦50m - ₦100m' },
    { value: '₦100m+', label: '₦100m+' },
  ];

  // System evaluation data
  const evaluations = [
    { label: 'VAT Obligation', status: 'Not Required' },
    { label: 'CIT Exemptions', status: 'Not Eligible' },
  ];

  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  // Handle save/update business profile
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Prepare data for API - map form fields back to API format
      const updateData = {
        companyName: formData.businessName,
        businessType: formData.businessType,
        industry: formData.industry,
        registrationDate: formData.registrationDate,
        tin: formData.tin,
        businessAddress: formData.businessAddress,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        website: formData.website,
        logo: businessProfile?.logo || '', // Keep existing logo or empty
      };

      // Filter out empty values - only send non-empty fields
      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const response = await updateBusinessProfile(clientId, filteredData);

      if (response.status) {
        toast.success('Business profile updated successfully!');
        // Update the business profile state with the new data
        if (response.data) {
          setBusinessProfile(response.data);
        }
      } else {
        toast.error(response.message || 'Failed to update business profile');
      }
    } catch (err) {
      console.error('Error updating business profile:', err);
      toast.error(err.message || 'Failed to update business profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar clientId={clientId} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header hideLogo={true} />

        {/* Page Content */}
        <main className="flex-1 !px-10 !py-8 overflow-y-auto">
          {/* Client Header */}
          <ClientHeader
            name={businessProfile?.companyName || client?.name || 'Loading...'}
            logo={businessProfile?.logo || client?.logo}
            vatRequired={client?.vatRequired || false}
          />

          {/* Alert Banner */}
          <div className="!mb-8">
            <AlertBanner
              message="This business crossed the turnover threshold for VAT Registration"
              type="warning"
            />
          </div>

          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 !gap-6 !mb-8">
            {/* Business Name */}
            <TextInput
              label="Business Name"
              value={formData.businessName}
              onChange={handleInputChange('businessName')}
              placeholder="Enter business name"
            />

            {/* Business Type */}
            <Dropdown
              label="Business Type"
              value={formData.businessType}
              onChange={handleInputChange('businessType')}
              options={businessTypes.map(type => ({ value: type, label: type }))}
            />

            {/* RC Number / TIN */}
            <TextInput
              label="TIN"
              value={formData.tin}
              onChange={handleInputChange('tin')}
              placeholder="Enter TIN"
            />

            {/* Industry */}
            <Dropdown
              label="Industry"
              value={formData.industry}
              onChange={handleInputChange('industry')}
              options={industries.map(industry => ({ value: industry, label: industry }))}
            />

            {/* Registration Date */}
            <TextInput
              label="Registration Date"
              value={formData.registrationDate}
              onChange={handleInputChange('registrationDate')}
              placeholder="YYYY-MM-DD"
              type="date"
            />

            {/* Turnover Band */}
            <Dropdown
              label="Turnover Band"
              value={formData.turnoverBand}
              onChange={handleInputChange('turnoverBand')}
              options={turnoverOptions}
            />

            {/* Business Address */}
            <TextInput
              label="Business Address"
              value={formData.businessAddress}
              onChange={handleInputChange('businessAddress')}
              placeholder="Enter business address"
            />

            {/* Phone Number */}
            <TextInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              placeholder="Enter phone number"
            />

            {/* Email Address */}
            <TextInput
              label="Email Address"
              value={formData.emailAddress}
              onChange={handleInputChange('emailAddress')}
              placeholder="Enter email address"
              type="email"
            />

            {/* Website */}
            <TextInput
              label="Website"
              value={formData.website}
              onChange={handleInputChange('website')}
              placeholder="Enter website URL"
            />

            {/* VAT Status */}
            <TextInput
              label="VAT Status"
              value={formData.vatStatus}
              onChange={handleInputChange('vatStatus')}
              placeholder="Enter VAT status"
              disabled={true}
            />
          </div>

          {/* Save Button */}
          <div className="!mb-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center !gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white !px-6 !py-3 rounded-lg font-medium transition-colors"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* System Evaluation */}
          <div className="max-w-2xl">
            <SystemEvaluation evaluations={evaluations} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessProfile;
