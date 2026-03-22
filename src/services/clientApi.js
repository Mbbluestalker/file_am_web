/**
 * CLIENT API SERVICE
 *
 * Handles all client-related API endpoints including:
 * - Client management
 * - Business profiles
 * - Invitations
 * - Client access requests
 */

import { makeRequest, API_VERSION } from './apiConfig';

// ============================================
// CLIENT MANAGEMENT
// ============================================

/**
 * GET CLIENTS
 * Fetch all clients for the authenticated consultant
 */
export const getClients = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients`,
    'GET'
  );
  return response;
};

/**
 * GET CLIENT BY ID
 * Fetch a single client by their company ID
 * @param {string} clientId - The company ID of the client
 */
export const getClientById = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}`,
    'GET'
  );
  return response;
};

/**
 * GET CLIENT DASHBOARD
 * Fetch dashboard metrics and data for a specific client
 * @param {string} clientId - The company ID of the client
 */
export const getClientDashboard = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/dashboard`,
    'GET'
  );
  return response;
};

// ============================================
// BUSINESS PROFILE
// ============================================

/**
 * GET BUSINESS PROFILE
 * Fetch business profile for a specific company
 * @param {string} companyId - The company ID
 */
export const getBusinessProfile = async (companyId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${companyId}/business-profile`,
    'GET'
  );
  return response;
};

/**
 * UPDATE BUSINESS PROFILE
 * Update business profile for a specific company
 * @param {string} companyId - The company ID
 * @param {Object} profileData - The business profile data to update
 */
export const updateBusinessProfile = async (companyId, profileData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${companyId}/business-profile`,
    'PUT',
    profileData
  );
  return response;
};

/**
 * GET BUSINESS TYPES
 * Fetch available business types
 */
export const getBusinessTypes = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/business-profile/types`,
    'GET'
  );
  return response;
};

/**
 * GET INDUSTRIES
 * Fetch available industries
 */
export const getIndustries = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/business-profile/industries`,
    'GET'
  );
  return response;
};

// ============================================
// BUSINESS SEARCH & INVITATIONS
// ============================================

/**
 * SEARCH BUSINESSES
 * Search for existing businesses on FileAm platform
 * @param {string} query - Search query (business name, RC number, or email)
 */
export const searchBusinesses = async (query) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/businesses?q=${encodeURIComponent(query)}`,
    'GET'
  );
  return response;
};

/**
 * SEND BUSINESS INVITATION
 * Invite a new business to join FileAm and grant management access
 * @param {Object} invitationData - Invitation details
 */
export const sendBusinessInvitation = async (invitationData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/invitation`,
    'POST',
    invitationData
  );
  return response;
};

/**
 * REQUEST CLIENT MANAGEMENT ACCESS
 * Request management access to an existing business on FileAm
 * @param {string} requestedUserId - The userId of the business owner
 */
export const requestClientManagementAccess = async (requestedUserId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/client-requests`,
    'POST',
    { requestedUserId }
  );
  return response;
};

/**
 * ACCEPT TEAM INVITATION
 * Accept a team invitation using invitation ID
 * @param {string} invitationId - The invitation ID from the URL
 */
export const acceptTeamInvitation = async (invitationId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/mobile/consultant-requests/${invitationId}/accept`,
    'POST'
  );
  return response;
};

// ============================================
// FINANCIALS
// ============================================

/**
 * GET INVOICES
 * Fetch invoices for a specific company
 * @param {string} companyId - The company ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 */
export const getInvoices = async (companyId, page = 1, limit = 10) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${companyId}/financials/invoices?page=${page}&limit=${limit}`,
    'GET'
  );
  return response;
};

// ============================================
// EXPORTS
// ============================================

export default {
  // Client Management
  getClients,
  getClientById,
  getClientDashboard,

  // Business Profile
  getBusinessProfile,
  updateBusinessProfile,
  getBusinessTypes,
  getIndustries,

  // Search & Invitations
  searchBusinesses,
  sendBusinessInvitation,
  requestClientManagementAccess,
  acceptTeamInvitation,

  // Financials
  getInvoices,
};
