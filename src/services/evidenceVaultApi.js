/**
 * EVIDENCE VAULT API SERVICE
 *
 * Handles evidence vault related API endpoints including:
 * - Document statistics
 * - Document listing and search
 * - Document upload
 * - Document deletion
 */

import { makeRequest, uploadFile as uploadMedia, API_VERSION } from './apiConfig';

// ============================================
// EVIDENCE VAULT STATS
// ============================================

/**
 * GET EVIDENCE VAULT STATS
 * Fetch statistics for the evidence vault
 * @param {string} clientId - The client/company ID
 */
export const getEvidenceVaultStats = async (clientId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/evidence-vault/stats`,
    'GET'
  );
  return response;
};

// ============================================
// DOCUMENT MANAGEMENT
// ============================================

/**
 * LIST EVIDENCE VAULT DOCUMENTS
 * Fetch paginated list of documents in evidence vault
 * @param {string} clientId - The client/company ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @param {string} dateFrom - Start date filter (e.g. "2026-01-01")
 * @param {string} dateTo - End date filter (e.g. "2026-01-31")
 */
export const getEvidenceVaultDocuments = async (clientId, page = 1, limit = 20, dateFrom = '', dateTo = '') => {
  const params = new URLSearchParams({ page, limit });
  if (dateFrom) params.set('dateFrom', dateFrom);
  if (dateTo) params.set('dateTo', dateTo);
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/evidence-vault/documents?${params}`,
    'GET'
  );
  return response;
};

/**
 * UPLOAD DOCUMENT TO EVIDENCE VAULT
 * Upload a new document to the evidence vault
 * @param {string} clientId - The client/company ID
 * @param {File} file - The file to upload
 * @param {Object} metadata - Document metadata (documentName, category, etc.)
 */
export const uploadEvidenceVaultDocument = async (clientId, file, metadata = {}) => {
  // First upload the file to get the URL
  const fileUploadResponse = await uploadMedia(file);

  if (!fileUploadResponse.status) {
    throw new Error('File upload failed');
  }

  // Then create document record in evidence vault
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/evidence-vault/documents/upload`,
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
 * DELETE DOCUMENT FROM EVIDENCE VAULT
 * Delete a document from the evidence vault
 * @param {string} clientId - The client/company ID
 * @param {string} documentId - The document ID to delete
 */
export const deleteEvidenceVaultDocument = async (clientId, documentId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/evidence-vault/documents/${documentId}`,
    'DELETE'
  );
  return response;
};

// ============================================
// EXPORTS
// ============================================

export default {
  getEvidenceVaultStats,
  getEvidenceVaultDocuments,
  uploadEvidenceVaultDocument,
  deleteEvidenceVaultDocument,
};
