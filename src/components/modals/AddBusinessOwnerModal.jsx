import { useState } from 'react';
import { searchBusinesses, sendBusinessInvitation, requestClientManagementAccess } from '../../services/onboardingApi';

/**
 * ADD BUSINESS OWNER MODAL
 *
 * Modal for adding business owners - either by searching existing businesses
 * or inviting new ones
 */
const AddBusinessOwnerModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'invite'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState(''); // 'pending' or 'sent'
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    rcNumber: '',
    contactName: '',
    email: '',
    phone: '',
    state: '',
    taxTypes: [],
  });

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchError('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults(null);

    try {
      const response = await searchBusinesses(searchQuery.trim());

      if (response.status && response.data && response.data.length > 0) {
        // Take the first result
        const business = response.data[0];
        setSearchResults({
          id: business.id,
          userId: business.userId,
          name: business.name,
          rcNumber: business.rcNumber || 'N/A',
          email: business.email,
          tin: business.tin || 'N/A',
          ownerName: business.ownerName,
          state: business.stateOfResidence,
          incomeType: business.incomeType,
          status: 'Active on FileAm',
        });
      } else {
        setSearchError('No businesses found matching your search');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error.message || 'Failed to search businesses. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRequestAccess = async () => {
    setIsSearching(true);
    setSearchError(null);

    try {
      // Use the new client-requests endpoint with userId
      const response = await requestClientManagementAccess(searchResults.userId);

      if (response.status) {
        setShowSuccess(true);
        setSuccessType('pending');
      } else {
        setSearchError(response.message || 'Failed to request management access');
      }
    } catch (error) {
      console.error('Request access error:', error);
      setSearchError(error.message || 'Failed to request management access. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();

    setIsSubmittingInvite(true);
    setInviteError(null);

    try {
      // Prepare invitation data according to API spec
      const invitationData = {
        invitedEmail: formData.email,
        invitedBusinessName: formData.businessName,
        invitedContactName: formData.contactName,
        invitedRcNumber: formData.rcNumber || undefined, // Optional field
        invitedPhone: formData.phone || undefined, // Optional field
        stateOfOperation: formData.state,
        taxTypesManaged: formData.taxTypes,
        expiresInHours: 168, // 7 days default
      };

      const response = await sendBusinessInvitation(invitationData);

      if (response.status) {
        setShowSuccess(true);
        setSuccessType('sent');
      } else {
        setInviteError(response.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Invitation error:', error);
      setInviteError(error.message || 'Failed to send invitation. Please try again.');
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const handleTaxTypeToggle = (type) => {
    setFormData((prev) => ({
      ...prev,
      taxTypes: prev.taxTypes.includes(type)
        ? prev.taxTypes.filter((t) => t !== type)
        : [...prev.taxTypes, type],
    }));
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults(null);
    setIsSearching(false);
    setSearchError(null);
    setIsSubmittingInvite(false);
    setInviteError(null);
    setShowSuccess(false);
    setSuccessType('');
    setFormData({
      businessName: '',
      rcNumber: '',
      contactName: '',
      email: '',
      phone: '',
      state: '',
      taxTypes: [],
    });
    onClose();
  };

  // Success State (Pending Approval or Invitation Sent)
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative shadow-2xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Add Business Owner</h2>

          {/* Tabs */}
          <div className="flex gap-6 mb-8 border-b border-gray-200">
            <button
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'search'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-400'
              }`}
            >
              Search Existing
            </button>
            <button
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'invite'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-400'
              }`}
            >
              Invite New
            </button>
          </div>

          {/* Success Content */}
          <div className="bg-green-50 rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-3">
              {successType === 'pending' ? 'Access Request Sent' : 'Invitation Sent Successfully'}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              {successType === 'pending' ? 'Status: Awaiting Business Owner Approval' : 'Status: Pending Acceptance'}
            </p>
            <p className="text-sm text-gray-600">
              {successType === 'pending'
                ? 'The business owner will receive an email to approve your management access request.'
                : 'The business owner will receive an email invitation to join FileAm.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto p-6 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Business Owner</h2>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('search');
              setSearchResults(null);
              setSearchError(null);
            }}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-400'
            }`}
          >
            Search Existing
          </button>
          <button
            onClick={() => setActiveTab('invite')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'invite'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-400'
            }`}
          >
            Invite New
          </button>
        </div>

        {/* Search Existing Tab */}
        {activeTab === 'search' && (
          <div>
            <form onSubmit={handleSearch}>
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchError(null);
                    }}
                    placeholder="Search by business name, RC number, or email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    disabled={isSearching}
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </form>

            {/* Error Message */}
            {searchError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{searchError}</p>
                </div>
              </div>
            )}

            {!searchResults ? (
              <div className="bg-gray-100 rounded-xl p-16 text-center border border-gray-200">
                <svg
                  className="w-20 h-20 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">
                  Start typing to search for existing businesses on FileAm
                </p>
              </div>
            ) : (
              <div>
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-4">
                    {searchResults.name}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span className="text-gray-700">
                        <span className="font-medium">RC Number:</span> {searchResults.rcNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                      </svg>
                      <span className="text-gray-700">{searchResults.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.562.813 8.25 8.25 0 1016.5 0 .75.75 0 011.562-.813 9.75 9.75 0 11-19.5 0 .75.75 0 01.813-.562zM12 7.5a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V8.25A.75.75 0 0112 7.5z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">
                        <span className="font-medium">TIN:</span> {searchResults.tin}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">
                        <span className="font-medium">Owner:</span> {searchResults.ownerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">
                        <span className="font-medium">State:</span> {searchResults.state}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-600">{searchResults.status}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSearchResults(null)}
                    disabled={isSearching}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back to Search
                  </button>
                  <button
                    onClick={handleRequestAccess}
                    disabled={isSearching}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSearching && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isSearching ? 'Requesting...' : 'Request Management Access'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Invite New Tab */}
        {activeTab === 'invite' && (
          <form onSubmit={handleInviteSubmit}>
            {/* Error Message */}
            {inviteError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{inviteError}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => {
                    setFormData({ ...formData, businessName: e.target.value });
                    setInviteError(null);
                  }}
                  placeholder="Enter business name"
                  required
                  disabled={isSubmittingInvite}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* RC Number */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  RC Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.rcNumber}
                  onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                  placeholder="Enter RC number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm placeholder:text-gray-400"
                />
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Enter contact person name"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm placeholder:text-gray-400"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm placeholder:text-gray-400"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm placeholder:text-gray-400"
                />
              </div>

              {/* State of Operation */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  State of Operation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter state"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm placeholder:text-gray-400"
                />
              </div>

              {/* Tax Types Managed */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tax Types Managed <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['VAT', 'PAYE', 'CIT', 'WHT'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTaxTypeToggle(type)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        formData.taxTypes.includes(type)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmittingInvite}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingInvite || !formData.businessName || !formData.contactName || !formData.email || !formData.state || formData.taxTypes.length === 0}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmittingInvite && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmittingInvite ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBusinessOwnerModal;
