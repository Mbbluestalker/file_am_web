import { useState } from 'react';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import ClientCard from '../components/clients/ClientCard';
import { clients } from '../data/clientsData';

/**
 * CLIENTS PAGE
 *
 * Displays list of clients with search functionality
 */
const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
          <div className="!mb-8">
            <h1 className="text-3xl font-bold text-gray-900 !mb-2">Clients</h1>
            <p className="text-sm text-gray-500">
              Select a client to view their tax dashboard and manage compliance
            </p>
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
    </div>
  );
};

export default Clients;
