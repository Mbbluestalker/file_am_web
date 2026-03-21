/**
 * FINANCIALS API SERVICE
 *
 * Handles all financials-related API endpoints including:
 * - Financial summary & analytics
 * - Profit & loss statements
 * - Balance sheets
 * - Document management
 * - Invoice management
 * - Transactions
 * - OCR extraction & vendor analysis
 */

import { makeRequest, uploadFile as uploadMedia, API_VERSION } from './apiConfig';

// ============================================
// FINANCIAL SUMMARY & ANALYTICS
// ============================================

/**
 * GET FINANCIAL SUMMARY
 * Get overview of financial metrics
 * @param {string} clientId - The company ID
 */
export const getFinancialSummary = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/summary`,
    'GET'
  );
  return response;
};

/**
 * GET PROFIT & LOSS STATEMENT
 * Get profit and loss report for a specific year
 * @param {string} clientId - The company ID
 * @param {number} year - Year for the report (e.g., 2026)
 */
export const getProfitLoss = async (clientId, year = new Date().getFullYear()) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/profit-loss?year=${year}`,
    'GET'
  );
  return response;
};

/**
 * GET BALANCE SHEET
 * Get balance sheet for a specific year
 * @param {string} clientId - The company ID
 * @param {number} year - Year for the report (e.g., 2026)
 */
export const getBalanceSheet = async (clientId, year = new Date().getFullYear()) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/balance-sheet?year=${year}`,
    'GET'
  );
  return response;
};

/**
 * GET PROFITABILITY TRENDS
 * Get monthly profitability trends for charting
 * @param {string} clientId - The company ID
 * @param {number} year - Year for the trends (e.g., 2026)
 */
export const getProfitabilityTrends = async (clientId, year = new Date().getFullYear()) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/profitability/trends?year=${year}`,
    'GET'
  );
  return response;
};

/**
 * GET EXPENSE BREAKDOWN
 * Get expense breakdown by category
 * @param {string} clientId - The company ID
 * @param {number} year - Year for the breakdown (e.g., 2026)
 */
export const getExpenseBreakdown = async (clientId, year = new Date().getFullYear()) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/profitability/expense-breakdown?year=${year}`,
    'GET'
  );
  return response;
};

// ============================================
// DOCUMENTS MANAGEMENT
// ============================================

/**
 * GET FINANCIAL DOCUMENTS
 * Get paginated list of financial documents
 * @param {string} clientId - The company ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 */
export const getFinancialDocuments = async (clientId, page = 1, limit = 20) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents?page=${page}&limit=${limit}`,
    'GET'
  );
  return response;
};

/**
 * GET DOCUMENT BY ID
 * Get single document details
 * @param {string} clientId - The company ID
 * @param {string} documentId - The document ID
 */
export const getDocumentById = async (clientId, documentId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents/${documentId}`,
    'GET'
  );
  return response;
};

/**
 * GET DOCUMENT REVIEW
 * Get document with AI-extracted data for review
 * @param {string} clientId - The company ID
 * @param {string} documentId - The document ID
 */
export const getDocumentReview = async (clientId, documentId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents/${documentId}/review`,
    'GET'
  );
  return response;
};

/**
 * UPLOAD GENERAL DOCUMENT
 * Upload non-invoice documents (receipts, bank statements, etc.)
 * @param {string} clientId - The company ID
 * @param {File} file - The file to upload
 * @param {Object} metadata - Additional document metadata
 */
export const uploadDocument = async (clientId, file, metadata = {}) => {
  // First upload the file to get the URL
  const fileUploadResponse = await uploadMedia(file);

  if (!fileUploadResponse.status) {
    throw new Error('File upload failed');
  }

  // Then create document record with metadata
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents/upload`,
    'POST',
    {
      fileUrl: fileUploadResponse.data.url,
      fileName: file.name,
      fileSize: file.size,
      ...metadata,
    }
  );
  return response;
};

/**
 * UPLOAD INVOICE
 * Upload invoice document
 * @param {string} clientId - The company ID
 * @param {File} file - The invoice file to upload
 * @param {Object} invoiceData - Invoice metadata (invoiceType, period, etc.)
 */
export const uploadInvoice = async (clientId, file, invoiceData = {}) => {
  // First upload the file to get the URL
  const fileUploadResponse = await uploadMedia(file);

  if (!fileUploadResponse.status) {
    throw new Error('File upload failed');
  }

  // Then create invoice record
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents/upload-invoice`,
    'POST',
    {
      fileUrl: fileUploadResponse.data.url,
      fileName: file.name,
      fileSize: file.size,
      ...invoiceData,
    }
  );
  return response;
};

// ============================================
// INVOICE MANAGEMENT
// ============================================

/**
 * GET INVOICES
 * Get paginated list of invoices
 * @param {string} clientId - The company ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 */
export const getInvoices = async (clientId, page = 1, limit = 20) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/invoices?page=${page}&limit=${limit}`,
    'GET'
  );
  return response;
};

/**
 * CREATE INVOICE
 * Create a new invoice manually
 * @param {string} clientId - The company ID
 * @param {Object} invoiceData - Invoice details
 */
export const createInvoice = async (clientId, invoiceData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/invoices`,
    'POST',
    invoiceData
  );
  return response;
};

// ============================================
// TRANSACTIONS
// ============================================

/**
 * GET TRANSACTIONS
 * Get paginated list of transactions
 * @param {string} clientId - The company ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 */
export const getTransactions = async (clientId, page = 1, limit = 20) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/transactions?page=${page}&limit=${limit}`,
    'GET'
  );
  return response;
};

/**
 * CREATE TRANSACTION
 * Create a new transaction manually
 * @param {string} clientId - The company ID
 * @param {Object} transactionData - Transaction details
 */
export const createTransaction = async (clientId, transactionData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/transactions`,
    'POST',
    transactionData
  );
  return response;
};

// ============================================
// OCR EXTRACTION & VENDOR ANALYSIS
// ============================================

/**
 * TRIGGER OCR EXTRACTION
 * Trigger OCR extraction for an uploaded document
 * @param {string} clientId - The company ID
 * @param {string} fileId - The uploaded file ID
 */
export const triggerOcrExtraction = async (clientId, fileId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents/${fileId}/ocr-extract`,
    'POST'
  );
  return response;
};

/**
 * IDENTIFY VENDOR
 * Identify vendor from extraction data
 * @param {string} clientId - The company ID
 * @param {string} extractionId - The extraction ID
 */
export const identifyVendor = async (clientId, extractionId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents/extractions/${extractionId}/vendor-identify`,
    'POST'
  );
  return response;
};

/**
 * ANALYZE VENDOR
 * Analyze vendor details and history
 * @param {string} clientId - The company ID
 * @param {string} vendorId - The vendor ID
 */
export const analyzeVendor = async (clientId, vendorId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents/vendors/${vendorId}/analyze`,
    'POST'
  );
  return response;
};

// ============================================
// EXPORTS
// ============================================

export default {
  // Financial Summary & Analytics
  getFinancialSummary,
  getProfitLoss,
  getBalanceSheet,
  getProfitabilityTrends,
  getExpenseBreakdown,

  // Documents
  getFinancialDocuments,
  getDocumentById,
  getDocumentReview,
  uploadDocument,
  uploadInvoice,

  // Invoices
  getInvoices,
  createInvoice,

  // Transactions
  getTransactions,
  createTransaction,

  // OCR & Vendor Analysis
  triggerOcrExtraction,
  identifyVendor,
  analyzeVendor,
};
