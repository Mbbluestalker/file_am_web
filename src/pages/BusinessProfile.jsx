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
import { getIndustries } from '../services/onboardingApi';
import { getClientDetails } from '../services/clientApi';
import { updateTaxConfiguration } from '../services/taxApi';

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
  const [industries, setIndustries] = useState([]);
  const [activeTab, setActiveTab] = useState('identity');
  const [vatThresholdStatus, setVatThresholdStatus] = useState(null);

  const [taxConfig, setTaxConfig] = useState({
    vat: false,
    paye: false,
    wht: false,
    cit: false,
    stampDuties: false,
  });

  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    turnoverBand: '',
    vatStatus: '',
    tin: '',
    businessAddress: '',
    phoneNumber: '',
    emailAddress: '',
    website: '',
    stateOfOperation: '',
    city: '',
  });

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await getIndustries();
        if (res.status && res.data) setIndustries(res.data);
      } catch (err) {
        console.error('Error fetching industries:', err);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getClientDetails(clientId);

        if (response.status && response.data) {
          const { client: clientInfo, business, taxConfiguration, vatThresholdStatus: threshold } = response.data;
          setBusinessProfile(response.data);

          setFormData({
            businessName: business?.name || '',
            industry: business?.industry || '',
            turnoverBand: business?.turnoverBand || '',
            vatStatus: business?.vatStatus || '',
            tin: business?.tin || '',
            businessAddress: business?.streetAddress || '',
            stateOfOperation: business?.stateOfResidence || '',
            city: business?.city || '',
            phoneNumber: clientInfo?.phone || '',
            emailAddress: business?.contactEmail || clientInfo?.email || '',
            website: business?.website || '',
          });

          if (taxConfiguration) {
            setTaxConfig({
              vat: taxConfiguration.vat || false,
              paye: taxConfiguration.paye || false,
              wht: taxConfiguration.wht || false,
              cit: taxConfiguration.cit || false,
              stampDuties: taxConfiguration.stampDuties || false,
            });
          }

          setVatThresholdStatus(threshold || null);
        } else {
          setError('Failed to load business profile');
        }
      } catch (err) {
        console.error('Error fetching client details:', err);
        setError(err.message || 'Failed to load business profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [clientId]);

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

  // System evaluation: only VAT Obligation has a backend source (via threshold status)
  const evaluations = vatThresholdStatus
    ? [{
        label: 'VAT Obligation',
        status: vatThresholdStatus.status === 'above' ? 'Required' : 'Not Required',
      }]
    : [];

  const handleSaveTaxConfig = async () => {
    try {
      setIsSaving(true);
      const response = await updateTaxConfiguration(clientId, taxConfig);
      if (response.status) {
        toast.success('Tax configuration updated');
      } else {
        toast.error(response.message || 'Failed to update tax configuration');
      }
    } catch (err) {
      console.error('Error updating tax configuration:', err);
      toast.error(err.message || 'Failed to update tax configuration');
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
            name={businessProfile?.business?.name || client?.name || 'Loading...'}
            logo={client?.logo}
            vatRequired={vatThresholdStatus?.status === 'above'}
          />

          {/* Alert Banner — only when real threshold data says to */}
          {vatThresholdStatus?.status === 'above' && vatThresholdStatus?.message && (
            <div className="mb-6">
              <AlertBanner message={vatThresholdStatus.message} type="warning" />
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('identity')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'identity'
                    ? 'border-brand text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Business Identity
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'contact'
                    ? 'border-brand text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Contact Information
              </button>
              <button
                onClick={() => setActiveTab('tax')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'tax'
                    ? 'border-brand text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Tax Configuration
              </button>
            </div>
          </div>

          {/* Read-only notice for Identity and Contact tabs */}
          {(activeTab === 'identity' || activeTab === 'contact') && (
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
              <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-600">
                This information is maintained by the client. Changes must be made by the client via their mobile app.
              </p>
            </div>
          )}

          {/* Business Identity Tab */}
          {activeTab === 'identity' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <TextInput
                  label="Business Name"
                  value={formData.businessName}
                  placeholder="—"
                  disabled={true}
                />

                <TextInput
                  label="RC Number / TIN"
                  value={formData.tin}
                  placeholder="—"
                  disabled={true}
                />

                <Dropdown
                  label="Industry"
                  value={formData.industry}
                  options={industries.map(industry => ({ value: industry, label: industry }))}
                  disabled={true}
                />

                <Dropdown
                  label="Turnover Band"
                  value={formData.turnoverBand}
                  options={turnoverOptions}
                  disabled={true}
                />

                <TextInput
                  label="VAT Status"
                  value={formData.vatStatus}
                  placeholder="—"
                  disabled={true}
                />
              </div>

              {evaluations.length > 0 && (
                <div className="max-w-2xl">
                  <SystemEvaluation evaluations={evaluations} />
                </div>
              )}
            </>
          )}

          {/* Contact Information Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <TextInput label="Registered Address" value={formData.businessAddress} placeholder="—" disabled={true} />
              <TextInput label="State of Operation" value={formData.stateOfOperation} placeholder="—" disabled={true} />
              <TextInput label="City" value={formData.city} placeholder="—" disabled={true} />
              <TextInput label="Email" value={formData.emailAddress} placeholder="—" type="email" disabled={true} />
              <TextInput label="Phone Number" value={formData.phoneNumber} placeholder="—" disabled={true} />
              <TextInput label="Website" value={formData.website} placeholder="—" disabled={true} />
            </div>
          )}

          {/* Tax Configuration Tab */}
          {activeTab === 'tax' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* VAT */}
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id="vat"
                  checked={taxConfig.vat}
                  onChange={(e) => setTaxConfig({...taxConfig, vat: e.target.checked})}
                  className="w-4 h-4 rounded accent-brand focus:ring-2 focus:ring-brand mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="vat" className="block text-sm font-medium text-gray-900">
                    Value Added Tax (VAT)
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">7.5% on taxable supplies</p>
                </div>
              </div>

              {/* PAYE */}
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id="paye"
                  checked={taxConfig.paye}
                  onChange={(e) => setTaxConfig({...taxConfig, paye: e.target.checked})}
                  className="w-4 h-4 rounded accent-brand focus:ring-2 focus:ring-brand mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="paye" className="block text-sm font-medium text-gray-900">
                    Pay As You Earn (PAYE)
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">Employee income tax withholding</p>
                </div>
              </div>

              {/* WHT */}
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id="wht"
                  checked={taxConfig.wht}
                  onChange={(e) => setTaxConfig({...taxConfig, wht: e.target.checked})}
                  className="w-4 h-4 rounded accent-brand focus:ring-2 focus:ring-brand mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="wht" className="block text-sm font-medium text-gray-900">
                    Withholding Tax (WHT)
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">Tax withheld at source</p>
                </div>
              </div>

              {/* CIT */}
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id="cit"
                  checked={taxConfig.cit}
                  onChange={(e) => setTaxConfig({...taxConfig, cit: e.target.checked})}
                  className="w-4 h-4 rounded accent-brand focus:ring-2 focus:ring-brand mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="cit" className="block text-sm font-medium text-gray-900">
                    Companies Income Tax (CIT)
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">30% on assessable profits</p>
                </div>
              </div>

              {/* Stamp Duties */}
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id="stampDuties"
                  checked={taxConfig.stampDuties}
                  onChange={(e) => setTaxConfig({...taxConfig, stampDuties: e.target.checked})}
                  className="w-4 h-4 rounded accent-brand focus:ring-2 focus:ring-brand mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="stampDuties" className="block text-sm font-medium text-gray-900">
                    Stamp Duties
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">Tax on instruments</p>
                </div>
              </div>
              <div className="col-span-full flex justify-end mt-2">
                <button
                  onClick={handleSaveTaxConfig}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-brand hover:bg-brand/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving…' : 'Save Tax Configuration'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BusinessProfile;
