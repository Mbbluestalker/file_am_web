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

import { makeRequest, uploadFile as uploadMedia, API_VERSION, getAccessToken } from './apiConfig';

const AI_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL || 'https://api.ai.fileam.app';

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
 * Get profit and loss report by year OR by date range.
 * @param {string} clientId - The company ID
 * @param {Object|number} options - Either a year (number) or { year, dateFrom, dateTo }
 *   - dateFrom/dateTo: ISO date strings (YYYY-MM-DD). Takes precedence over year.
 *   - year: Year (e.g., 2026). Used if dateFrom/dateTo are not provided.
 */
export const getProfitLoss = async (clientId, options = {}) => {
  const opts = typeof options === 'number' ? { year: options } : options;
  const { year, dateFrom, dateTo } = opts;

  let query;
  if (dateFrom && dateTo) {
    query = `?dateFrom=${dateFrom}&dateTo=${dateTo}`;
  } else {
    query = `?year=${year || new Date().getFullYear()}`;
  }

  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/profit-loss${query}`,
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
 * Get paginated list of financial documents.
 * @param {string} clientId - The company ID
 * @param {Object|number} options - Either a page number (legacy) or { page, limit, status, q, dateFrom, dateTo }
 *   - status: one of `clean`, `pending`, `processed`, `review`, `flagged` (backend enum)
 *   - q: free-text; backend searches vendor, invoice number, description, document type
 */
export const getFinancialDocuments = async (clientId, options = {}, legacyLimit) => {
  const opts = typeof options === 'number'
    ? { page: options, limit: legacyLimit ?? 20 }
    : options;
  const { page = 1, limit = 20, status, q, dateFrom, dateTo } = opts;

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status && status !== 'all') params.set('status', status);
  if (q) params.set('q', q);
  if (dateFrom) params.set('dateFrom', dateFrom);
  if (dateTo) params.set('dateTo', dateTo);

  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents?${params.toString()}`,
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
 * Upload invoice/receipt file, extract transactions via the AI Transactions API,
 * then persist a financial document record on the backend.
 *
 * Flow: media upload → AI /api/transactions → POST /financials/documents/upload.
 * The backend document id is what the Review page expects on the URL.
 *
 * @param {string} clientId - The company ID (used as user_id for the AI call)
 * @param {File} file - The invoice/receipt file to upload
 * @returns {Promise<Object>} { transactions, count, errors, summary, documentId, fileUrl }
 */
export const uploadInvoice = async (clientId, file) => {
  // Step 1: Upload the file to get a public URL
  const fileUploadResponse = await uploadMedia(file);

  if (!fileUploadResponse.status) {
    throw new Error('File upload failed');
  }

  const fileUrl = fileUploadResponse.data.url;

  const isImage = file.type.startsWith('image/');
  const type = isImage ? 'image' : 'document';

  // Step 2: Send to Transactions API (AI service) for extraction
  const accessToken = getAccessToken();
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const res = await fetch(`${AI_BASE_URL}/api/transactions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      user_id: clientId,
      url: fileUrl,
      type,
    }),
  });

  const ocrResponse = await res.json();

  if (!res.ok) {
    throw new Error(ocrResponse.message || `API Error: ${res.status}`);
  }

  const txn = ocrResponse?.transactions?.[0];
  if (!txn) {
    throw new Error('No transactions could be extracted from this document');
  }

  // Step 3: Persist a backend document record from the extracted fields
  const createResponse = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/documents/upload`,
    'POST',
    {
      documentType: 'Invoice',
      documentDate: typeof txn.date === 'string' ? txn.date.split('T')[0] : txn.date,
      amount: txn.amount,
      currency: txn.currency,
      description: txn.description,
      fileUrl,
    }
  );

  if (!createResponse?.status || !createResponse?.data?.id) {
    throw new Error(createResponse?.message || 'Failed to save document');
  }

  return {
    ...ocrResponse,
    documentId: createResponse.data.id,
    fileUrl,
  };
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

/**
 * GET SINGLE INVOICE
 * @param {string} clientId
 * @param {string} invoiceId
 */
export const getInvoiceById = async (clientId, invoiceId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/invoices/${invoiceId}`,
    'GET'
  );
};

/**
 * UPDATE INVOICE
 * @param {string} clientId
 * @param {string} invoiceId
 * @param {Object} data
 */
export const updateInvoice = async (clientId, invoiceId, data) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/invoices/${invoiceId}`,
    'PUT',
    data
  );
};

/**
 * MARK INVOICE AS PAID
 * @param {string} clientId
 * @param {string} invoiceId
 */
export const markInvoicePaid = async (clientId, invoiceId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/financials/invoices/${invoiceId}/mark-paid`,
    'PATCH',
    {}
  );
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
