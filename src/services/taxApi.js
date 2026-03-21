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

import { makeRequest, API_VERSION } from './apiConfig';

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

/**
 * UPDATE TAX ASSUMPTIONS
 * Update tax assumptions for a client
 * @param {string} clientId - The client/company ID
 * @param {Object} assumptions - Tax assumptions data
 */
export const updateTaxAssumptions = async (clientId, assumptions) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/tax-computation/assumptions`,
    'PUT',
    assumptions
  );
  return response;
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
  updateTaxAssumptions,
};
