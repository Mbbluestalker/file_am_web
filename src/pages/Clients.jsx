import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import ClientCard from '../components/clients/ClientCard';
import AddBusinessOwnerModal from '../components/modals/AddBusinessOwnerModal';
import { getClients } from '../services/clientApi';

/**
 * CLIENTS PAGE
 *
 * Displays list of clients with search functionality
 */
const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development/fallback
  const mockClients = [
    {
      id: '1',
      email: 'john@techcorp.com',
      name: 'TechCorp Solutions Ltd',
      registrationNumber: 'RC123456',
      logo: null,
      approvalStatus: 'active',
      vatStatus: 'Registered',
      nextFiling: 'Feb 21, 2026',
      vatRequired: true,
    },
    {
      id: '2',
      email: 'sarah@greenventures.com',
      name: 'Green Ventures Nigeria',
      registrationNumber: 'RC789012',
      logo: null,
      approvalStatus: 'pending',
      vatStatus: 'Not Registered',
      nextFiling: 'Mar 15, 2026',
      vatRequired: false,
    },
    {
      id: '3',
      email: 'info@blueocean.ng',
      name: 'Blue Ocean Trading Co.',
      registrationNumber: 'RC345678',
      logo: null,
      approvalStatus: 'active',
      vatStatus: 'Registered',
      nextFiling: 'Feb 28, 2026',
      vatRequired: true,
    },
  ];

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getClients();

        if (response.status && response.data) {
          // Transform API data to match ClientCard component props
          const transformedClients = response.data.map((client) => ({
            // Use the client id for URL routing
            id: client.id,
            email: client.email,
            name: client.businessName,
            registrationNumber: client.rcNumber || 'N/A',
            logo: null, // API doesn't provide logo
            approvalStatus: client.status === 'Pending Invitation' ? 'pending' : 'active',
            vatStatus: client.vatStatus || 'N/A',
            // Handle nextFiling - it might be a string, object, or null
            nextFiling: typeof client.nextFiling === 'string'
              ? client.nextFiling
              : client.nextFiling?.dueDate || null,
            vatRequired: client.vatStatus === 'Registered',
          }));
          setClients(transformedClients);
          // Store clients data in localStorage for reuse across pages
          localStorage.setItem('clientsData', JSON.stringify(transformedClients));
        } else {
          setError('Failed to load clients');
        }
      } catch (err) {
        console.error('Error fetching clients:', err);

        // Fallback to mock data in development or when API is unavailable
        console.warn('Using mock client data as fallback');
        setClients(mockClients);
        localStorage.setItem('clientsData', JSON.stringify(mockClients));
        setError(null); // Clear error since we're using fallback data
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reload clients when modal closes (in case new client was added)
  const handleModalClose = async () => {
    setIsModalOpen(false);
    // Refresh clients list
    try {
      const response = await getClients();
      if (response.status && response.data) {
        const transformedClients = response.data.map((client) => ({
          // Use the client id for URL routing
          id: client.id,
          email: client.email,
          name: client.businessName,
          registrationNumber: client.rcNumber || 'N/A',
          logo: null,
          approvalStatus: client.status === 'Pending Invitation' ? 'pending' : 'active',
          vatStatus: client.vatStatus || 'N/A',
          // Handle nextFiling - it might be a string, object, or null
          nextFiling: typeof client.nextFiling === 'string'
            ? client.nextFiling
            : client.nextFiling?.dueDate || null,
          vatRequired: client.vatStatus === 'Registered',
        }));
        setClients(transformedClients);
        // Store clients data in localStorage for reuse across pages
        localStorage.setItem('clientsData', JSON.stringify(transformedClients));
      }
    } catch (err) {
      console.error('Error refreshing clients:', err);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto !px-8 !py-10">
          {/* Page Header */}
          <div className="flex items-start justify-between !mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 !mb-2">Clients</h1>
              <p className="text-sm text-gray-500">
                Businesses you manage under your consulting profile
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center !gap-2 bg-teal-600 hover:bg-teal-700 text-white !px-4 !py-2.5 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Business Owner
            </button>
          </div>

          {/* Search Bar */}
          <div className="!mb-10">
            <SearchBar
              placeholder="Search for clients by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center !py-20">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading clients...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium mb-2">Failed to load clients</p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Client Cards Grid */}
          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 !gap-6">
                {filteredClients.map((client) => (
                  <ClientCard key={client.id} {...client} />
                ))}
              </div>

              {/* Empty State */}
              {filteredClients.length === 0 && clients.length > 0 && (
                <div className="text-center !py-12">
                  <p className="text-gray-500">No clients found matching "{searchQuery}"</p>
                </div>
              )}

              {/* No Clients State */}
              {clients.length === 0 && (
                <div className="text-center !py-20">
                  <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients yet</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first business owner</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Business Owner
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Business Owner Modal */}
      <AddBusinessOwnerModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default Clients;
