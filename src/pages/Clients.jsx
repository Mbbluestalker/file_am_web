import { useState } from 'react';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import ClientCard from '../components/clients/ClientCard';
import AddBusinessOwnerModal from '../components/modals/AddBusinessOwnerModal';
import { clients } from '../data/clientsData';

/**
 * CLIENTS PAGE
 *
 * Displays list of clients with search functionality
 */
const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {/* Client Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 !gap-6">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} {...client} />
            ))}
          </div>

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <div className="text-center !py-12">
              <p className="text-gray-500">No clients found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Business Owner Modal */}
      <AddBusinessOwnerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Clients;
