/**
 * TAX API SERVICE
 *
 * Handles all tax-related API endpoints including:
 * - Tax configuration
 * - VAT computation
 * - Tax summaries
 * - Threshold status
 * - Tax assumptions
 */

import { makeRequest, API_VERSION, BASE_URL, getAccessToken } from './apiConfig';

// ============================================
// TAX CONFIGURATION
// ============================================

/**
 * UPDATE TAX CONFIGURATION
 * Configure which tax types are applicable for a client
 * @param {string} clientId - The client/company ID
 * @param {Object} config - Tax configuration { vat: boolean, paye: boolean, wht: boolean, cit: boolean }
 */
export const updateTaxConfiguration = async (clientId, config) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/tax-configuration`,
    'PUT',
    config
  );
  return response;
};

/**
 * GET TAX CONFIGURATION
 * Get current tax configuration for a client
 * @param {string} clientId - The client/company ID
 */
export const getTaxConfiguration = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/tax-configuration`,
    'GET'
  );
  return response;
};

// ============================================
// TAX SUMMARY
// ============================================

/**
 * GET TAX SUMMARY
 * Get overall tax summary including total VAT payable and monthly breakdown
 * @param {string} clientId - The client/company ID
 */
export const getTaxSummary = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/tax-summary`,
    'GET'
  );
  return response;
};

// ============================================
// VAT COMPUTATION
// ============================================

/**
 * GET VAT COMPUTATION STATUS
 * Check if company has any VAT computation data
 * @param {string} clientId - The client/company ID
 */
export const getVatComputationStatus = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/vat-computation/status`,
    'GET'
  );
  return response;
};

/**
 * CALCULATE VAT
 * Submit VAT calculation for a specific period
 * @param {string} clientId - The client/company ID
 * @param {Object} calculationData - { vatType: string, vatPeriod: string, startDate: string, endDate: string }
 */
export const calculateVat = async (clientId, calculationData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/vat-computation/calculate`,
    'POST',
    calculationData
  );
  return response;
};

/**
 * GET VAT COMPUTATION RESULTS
 * Get the most recent VAT computation results
 * @param {string} clientId - The client/company ID
 */
export const getVatComputationResults = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/vat-computation/results`,
    'GET'
  );
  return response;
};

// ============================================
// THRESHOLD STATUS
// ============================================

/**
 * GET THRESHOLD STATUS
 * Get whether company is below, approaching, or above VAT threshold
 * @param {string} clientId - The client/company ID
 */
export const getThresholdStatus = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/tax-computation/threshold-status`,
    'GET'
  );
  return response;
};

// ============================================
// TAX COMPUTATION CHART
// ============================================

/**
 * GET TAX COMPUTATION CHART
 * Get monthly turnover data and VAT status
 * @param {string} clientId - The client/company ID
 */
export const getTaxComputationChart = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/tax-computation/chart`,
    'GET'
  );
  return response;
};

// ============================================
// TAX ASSUMPTIONS
// ============================================

/**
 * GET TAX ASSUMPTIONS
 * Get tax assumptions including VAT registration status, CIT rate, etc.
 * @param {string} clientId - The client/company ID
 */
export const getTaxAssumptions = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/tax-computation/assumptions`,
    'GET'
  );
  return response;
};

// ============================================
// COMPUTATION REPORTS
// ============================================

/**
 * GET CIT COMPUTATION REPORT
 * @param {string} clientId
 */
export const getCitReport = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/cit`,
    'GET'
  );
};

/**
 * GET VAT PAYMENT REPORT
 * @param {string} clientId
 */
export const getVatReport = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/vat-payment`,
    'GET'
  );
};

/**
 * GET WHT REPORT
 * @param {string} clientId
 */
export const getWhtReport = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/wht`,
    'GET'
  );
};

/**
 * GET PAYE COMPUTATION REPORT
 * @param {string} clientId
 */
export const getPayeReport = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/paye`,
    'GET'
  );
};

// ============================================
// REPORT EXPORT
// ============================================

/**
 * EXPORT ALL REPORTS (PDF download)
 * @param {string} clientId
 * @param {string} dateFrom  - e.g. "2025-01-01"
 * @param {string} dateTo    - e.g. "2025-12-31"
 * @param {string} reportType - optional, e.g. "cit", "vat", "" for all
 */
export const exportAllReports = async (clientId, dateFrom, dateTo, reportType = '') => {
  const accessToken = getAccessToken();
  const params = new URLSearchParams({ dateFrom, dateTo, reportType });
  const response = await fetch(
    `${BASE_URL}/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/export-all?${params}`,
    { method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!response.ok) throw new Error('Export failed');

  const blob = await response.blob();
  const contentDisposition = response.headers.get('content-disposition');
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || 'tax-report.pdf'
    : 'tax-report.pdf';

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// ============================================
// EXPORTS
// ============================================

export default {
  // Tax Configuration
  updateTaxConfiguration,
  getTaxConfiguration,

  // Tax Summary
  getTaxSummary,

  // VAT Computation
  getVatComputationStatus,
  calculateVat,
  getVatComputationResults,

  // Threshold
  getThresholdStatus,

  // Chart & Assumptions
  getTaxComputationChart,
  getTaxAssumptions,
};
