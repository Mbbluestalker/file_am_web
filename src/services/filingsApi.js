/**
 * FILINGS API SERVICE
 *
 * Handles filings-related API endpoints including:
 * - Filings summary and statistics
 * - VAT returns listing
 * - Unfiled obligations
 * - Filing creation and management
 * - Filing reports
 */

import { makeRequest, API_VERSION } from './apiConfig';

// ============================================
// FILINGS SUMMARY & STATS
// ============================================

/**
 * GET FILINGS SUMMARY
 * Fetch summary of filings for a client
 * @param {string} clientId - The client/company ID
 */
export const getFilingsSummary = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/filings/summary`,
    'GET'
  );
  return response;
};

/**
 * GET VAT RETURNS
 * Fetch list of VAT returns for a client
 * @param {string} clientId - The client/company ID
 */
export const getVatReturns = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/filings/vat-returns`,
    'GET'
  );
  return response;
};

/**
 * GET UNFILED OBLIGATIONS
 * Fetch list of unfiled tax obligations for a client
 * @param {string} clientId - The client/company ID
 */
export const getUnfiledObligations = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/filings/unfiled`,
    'GET'
  );
  return response;
};

// ============================================
// FILINGS MANAGEMENT
// ============================================

/**
 * LIST FILINGS
 * Fetch paginated list of all filings for a client
 * @param {string} clientId - The client/company ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @param {string} dateFrom - Start date filter (e.g. "2025-01-01")
 * @param {string} dateTo - End date filter (e.g. "2025-01-31")
 */
export const getFilings = async (clientId, page = 1, limit = 20, dateFrom = '', dateTo = '') => {
  const params = new URLSearchParams({ page, limit });
  if (dateFrom) params.set('dateFrom', dateFrom);
  if (dateTo) params.set('dateTo', dateTo);
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/filings?${params}`,
    'GET'
  );
  return response;
};

/**
 * CREATE FILING
 * Create a new filing for a client
 * @param {string} clientId - The client/company ID
 * @param {Object} filingData - Filing details (taxType, periodYear, periodMonth, amount, paymentStatus)
 */
export const createFiling = async (clientId, filingData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/filings`,
    'POST',
    filingData
  );
  return response;
};

/**
 * SUBMIT TAX RETURN
 * Submit a return for a specific tax type (VAT, WHT, CIT, PAYE)
 * @param {string} clientId - The client/company ID
 * @param {string} taxType - Tax type (VAT, WHT, CIT, PAYE)
 * @param {Object} data - { periodYear, periodMonth, amount, paymentStatus, documentUrl }
 */
export const submitTaxReturn = async (clientId, taxType, data) => {
  const type = taxType.toLowerCase();
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/filings/${type}/submit-return`,
    'POST',
    data
  );
  return response;
};

/**
 * GET FILING REPORT
 * Fetch detailed report for a specific filing
 * @param {string} clientId - The client/company ID
 * @param {string} filingId - The filing ID
 */
export const getFilingReport = async (clientId, filingId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/filings/${filingId}/report`,
    'GET'
  );
  return response;
};

// ============================================
// EXPORTS
// ============================================

export default {
  getFilingsSummary,
  getVatReturns,
  getUnfiledObligations,
  getFilings,
  createFiling,
  getFilingReport,
};
