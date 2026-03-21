/**
 * CLIENT STORAGE UTILITY
 *
 * Helper functions for managing client data in localStorage
 */

/**
 * Get client data from localStorage by ID
 * @param {string} clientId - The client/company ID
 * @returns {Object|null} Client data or null if not found
 */
export const getClientFromStorage = (clientId) => {
  const storedClients = localStorage.getItem('clientsData');
  if (storedClients) {
    try {
      const clients = JSON.parse(storedClients);
      return clients.find((c) => c.id === clientId) || null;
    } catch (err) {
      console.error('Error parsing clients data:', err);
      return null;
    }
  }
  return null;
};

/**
 * Get all clients from localStorage
 * @returns {Array} Array of clients or empty array
 */
export const getAllClientsFromStorage = () => {
  const storedClients = localStorage.getItem('clientsData');
  if (storedClients) {
    try {
      return JSON.parse(storedClients);
    } catch (err) {
      console.error('Error parsing clients data:', err);
      return [];
    }
  }
  return [];
};
