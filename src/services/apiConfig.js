/**
 * API CONFIGURATION
 *
 * Base API configuration and request handler
 */

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-v2.fileam.app';
export const API_VERSION = '1';

/**
 * Get stored access token
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Make API request with proper headers
 * @param {string} endpoint - API endpoint (e.g., '/api/v1/enterprise/clients')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {Object} data - Request body data
 * @param {Object} customHeaders - Additional headers
 * @returns {Promise<Object>} API response
 */
export const makeRequest = async (endpoint, method = 'GET', data = null, customHeaders = {}) => {
  const accessToken = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Add access token to headers using Bearer authentication
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Upload file to media endpoint
 * @param {File} file - File to upload
 * @returns {Promise<Object>} API response with file URL
 */
export const uploadFile = async (file) => {
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/v${API_VERSION}/media/upload`,
      {
        method: 'POST',
        headers,
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

export default {
  BASE_URL,
  API_VERSION,
  getAccessToken,
  makeRequest,
  uploadFile,
};
