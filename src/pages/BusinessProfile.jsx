import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import ClientHeader from '../components/client/ClientHeader';
import TextInput from '../components/common/TextInput';
import Dropdown from '../components/common/Dropdown';
import AlertBanner from '../components/common/AlertBanner';
import SystemEvaluation from '../components/businessProfile/SystemEvaluation';
import { getClientById } from '../data/clientsData';

/**
 * BUSINESS PROFILE PAGE
 *
 * Displays and manages business profile information
 */
const BusinessProfile = () => {
  const { clientId } = useParams();

  // Get client data from shared data source
  const client = getClientById(clientId);

  // Handle client not found
  if (!client) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 !mb-2">Client Not Found</h1>
          <p className="text-gray-500">The client you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Form state - Initialize with client data
  const [formData, setFormData] = useState({
    businessName: client.name,
    rcNumber: client.registrationNumber,
    industry: 'Software',
    turnoverBand: '₦24m - ₦50m',
    vatStatus: client.vatStatus,
  });

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
            name={client.name}
            logo={client.logo}
            vatRequired={client.vatRequired}
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

            {/* RC Number / TIN */}
            <TextInput
              label="RC Number / TIN"
              value={formData.rcNumber}
              onChange={handleInputChange('rcNumber')}
              placeholder="Enter RC number or TIN"
            />

            {/* Industry */}
            <TextInput
              label="Industry"
              value={formData.industry}
              onChange={handleInputChange('industry')}
              placeholder="Enter industry"
            />

            {/* Turnover Band */}
            <Dropdown
              label="Turnover Band"
              value={formData.turnoverBand}
              onChange={handleInputChange('turnoverBand')}
              options={turnoverOptions}
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
