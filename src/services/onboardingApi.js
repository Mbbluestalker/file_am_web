/**
 * ONBOARDING API SERVICE
 *
 * Handles all API calls for the consultant onboarding process
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-v2.fileam.app';
const API_VERSION = '1'; // Update this if API version changes

/**
 * LOGIN
 * Authenticate user with email and password
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v${API_VERSION}/enterprise/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    // Store tokens and user data
    if (result.data?.accessToken) {
      localStorage.setItem('accessToken', result.data.accessToken);
    }
    if (result.data?.refreshToken) {
      localStorage.setItem('refreshToken', result.data.refreshToken);
    }
    if (result.data?.user) {
      localStorage.setItem('userData', JSON.stringify(result.data.user));
    }

    // Store onboarding status
    if (result.data?.enterpriseOnboardingComplete !== undefined) {
      localStorage.setItem('enterpriseOnboardingComplete', String(result.data.enterpriseOnboardingComplete));
    }
    if (result.data?.enterpriseOnboardingStep) {
      localStorage.setItem('enterpriseOnboardingStep', result.data.enterpriseOnboardingStep);
    }

    // Store consultant onboarding token if present
    if (result.data?.consultantOnboardingToken) {
      localStorage.setItem('consultantOnboardingToken', result.data.consultantOnboardingToken);
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * LOGOUT
 * Clear local storage and logout user
 */
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('enterpriseOnboardingStep');
  localStorage.removeItem('enterpriseOnboardingComplete');
  localStorage.removeItem('consultantOnboardingToken');
  console.log('User logged out successfully');
};

/**
 * FORGOT PASSWORD
 * Send password reset code to email
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v${API_VERSION}/enterprise/auth/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    // Store email for next steps
    localStorage.setItem('resetPasswordEmail', email);

    return result;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};


/**
 * RESET PASSWORD
 * Reset password with verified code
 */
export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v${API_VERSION}/enterprise/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    // Clear reset-related data
    localStorage.removeItem('resetPasswordEmail');
    localStorage.removeItem('resetToken');

    return result;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * EMAIL SIGNUP (Pre-onboarding)
 * Send verification email before starting onboarding
 */
export const submitEmailSignup = async (email) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v${API_VERSION}/enterprise/onboarding/step/email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    // Store email for next steps
    localStorage.setItem('signupEmail', email);

    return result;
  } catch (error) {
    console.error('Email signup error:', error);
    throw error;
  }
};

/**
 * VERIFY EMAIL
 * Verify the 6-digit code sent to email
 * Returns accessToken that will be used for password setup
 */
export const verifyEmail = async ({ email, code, invitationId, companyId }) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v${API_VERSION}/enterprise/onboarding/step/email-verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          invitationId: invitationId || '',
          companyId: companyId || ''
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    // Store onboardingToken for password setup step
    if (result.data?.onboardingToken) {
      localStorage.setItem('signupAccessToken', result.data.onboardingToken);
    }

    // Store email if provided
    if (result.data?.email) {
      localStorage.setItem('signupEmail', result.data.email);
    }

    return result;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

/**
 * SET PASSWORD
 * Set password and complete account creation
 * Requires accessToken from email verification step
 */
export const setPassword = async ({ password, firstName, lastName }) => {
  const accessToken = localStorage.getItem('signupAccessToken');

  if (!accessToken) {
    throw new Error('Access token not found. Please verify your email first.');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/v${API_VERSION}/enterprise/onboarding/step/password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          password,
          firstName,
          lastName
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    // Store the main access and refresh tokens for authenticated sessions
    if (result.data?.accessToken) {
      localStorage.setItem('accessToken', result.data.accessToken);
    }
    if (result.data?.refreshToken) {
      localStorage.setItem('refreshToken', result.data.refreshToken);
    }

    // Store user data
    if (result.data?.user) {
      localStorage.setItem('userData', JSON.stringify(result.data.user));
    }

    // Store onboarding status
    if (result.data?.enterpriseOnboardingStep) {
      localStorage.setItem('enterpriseOnboardingStep', result.data.enterpriseOnboardingStep);
    }
    if (result.data?.enterpriseOnboardingComplete !== undefined) {
      localStorage.setItem('enterpriseOnboardingComplete', String(result.data.enterpriseOnboardingComplete));
    }

    // Clear signup-related data from localStorage
    localStorage.removeItem('signupAccessToken');
    localStorage.removeItem('signupUserData');
    localStorage.removeItem('signupEmail');

    return result;
  } catch (error) {
    console.error('Set password error:', error);
    throw error;
  }
};

/**
 * Get stored access token
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Make API request with proper headers
 */
const makeRequest = async (endpoint, method = 'GET', data = null) => {
  const accessToken = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
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
 * STEP 1: Firm Identity & Legal Structure
 * Now uses accessToken from password setup
 */
export const submitStep1 = async (data) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/step/1`,
    'POST',
    data
  );
  return response;
};

/**
 * STEP 2: Partners & Ownership Structure
 */
export const submitStep2 = async (data) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/step/2`,
    'POST',
    data
  );
  return response;
};

/**
 * STEP 3: Additional Partner Details
 */
export const submitStep3 = async (data) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/step/3`,
    'POST',
    data
  );
  return response;
};

/**
 * STEP 4: Scope of Practice & Expertise
 */
export const submitStep4 = async (data) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/step/4`,
    'POST',
    data
  );
  return response;
};

/**
 * STEP 5: Subscription & Service Calendar
 */
export const submitStep5 = async (data) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/step/5`,
    'POST',
    data
  );
  return response;
};

/**
 * STEP 6: Payment Collection Setup
 */
export const submitStep6 = async (data) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/step/6`,
    'POST',
    data
  );
  return response;
};

/**
 * UPLOAD MEDIA FILE
 * Upload a single file and get back URL
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

/**
 * STEP 7: Compliance & Verification
 * Submit document URLs (files should be uploaded first via uploadFile)
 */
export const submitStep7 = async (data) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/step/7`,
    'POST',
    data
  );
  return response;
};

/**
 * FINAL: Submit/Activate Account
 */
export const activateAccount = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/activate`,
    'POST'
  );

  return response;
};

/**
 * Get current onboarding profile (prefill data)
 */
export const getOnboardingProfile = async () => {
  const accessToken = getAccessToken();

  // If no token, don't even try (new onboarding session)
  if (!accessToken) {
    console.log('No access token found - starting fresh onboarding');
    return { status: false, data: null };
  }

  try {
    console.log('Attempting to fetch profile with access token');

    const response = await axios.get(
      `${BASE_URL}/api/v${API_VERSION}/enterprise/onboarding/consultant/profile`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    console.log('Profile fetch successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error);

    if (error.response) {
      // Server responded with error
      console.log('Server error response:', error.response.status, error.response.data);
      throw new Error(error.response.data.message || `API Error: ${error.response.status}`);
    } else if (error.request) {
      // Request was made but no response
      console.log('No response received from server');
      return { status: false, data: null };
    } else {
      console.log('Request setup error:', error.message);
      throw new Error(error.message);
    }
  }
};

/**
 * Get current onboarding progress/status
 */
export const getOnboardingStatus = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/status`,
    'GET'
  );
  return response;
};

/**
 * Save draft (if API supports it)
 */
export const saveDraft = async (step, data) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/onboarding/consultant/draft`,
    'POST',
    { step, data }
  );
  return response;
};

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
// TAX COMPUTATION API FUNCTIONS
// ============================================

/**
 * GET VAT COMPUTATION STATUS
 * Check if company has any VAT computation data
 * @param {string} companyId - The company ID
 */
export const getVatComputationStatus = async (companyId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/vat-computation/status`,
    'GET'
  );
  return response;
};

/**
 * INITIATE VAT SETUP
 * Initiate VAT setup for first-time users
 * @param {string} companyId - The company ID
 */
export const initiateVatSetup = async (companyId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/vat-computation/initiate-setup`,
    'POST'
  );
  return response;
};

/**
 * GET VAT TYPES
 * Fetch available VAT types for dropdown
 * @param {string} companyId - The company ID
 */
export const getVatTypes = async (companyId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/vat-computation/types`,
    'GET'
  );
  return response;
};

/**
 * GET VAT PERIODS
 * Fetch available VAT periods for dropdown
 * @param {string} companyId - The company ID
 */
export const getVatPeriods = async (companyId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/vat-computation/periods`,
    'GET'
  );
  return response;
};

/**
 * CALCULATE VAT
 * Submit VAT calculation with sales/purchase amounts
 * @param {string} companyId - The company ID
 * @param {Object} calculationData - VAT calculation data
 */
export const calculateVat = async (companyId, calculationData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/vat-computation/calculate`,
    'POST',
    calculationData
  );
  return response;
};

/**
 * GET VAT COMPUTATION RESULTS
 * Get the most recent VAT computation results
 * @param {string} companyId - The company ID
 */
export const getVatComputationResults = async (companyId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/vat-computation/results`,
    'GET'
  );
  return response;
};

/**
 * DOWNLOAD VAT REPORT
 * Generate and download VAT computation report
 * @param {string} companyId - The company ID
 */
export const downloadVatReport = async (companyId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/vat-computation/report/download`,
    'GET'
  );
  return response;
};

/**
 * GET MONTHLY VAT PAYABLE
 * Get monthly VAT payable amounts for a specific year
 * @param {string} companyId - The company ID
 * @param {number} year - The year to fetch data for
 */
export const getMonthlyVatPayable = async (companyId, year) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/tax-computation/vat-payable/monthly?year=${year}`,
    'GET'
  );
  return response;
};

/**
 * GET THRESHOLD STATUS
 * Get whether company is below, approaching, or above VAT threshold
 * @param {string} companyId - The company ID
 */
export const getThresholdStatus = async (companyId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/tax-computation/threshold-status`,
    'GET'
  );
  return response;
};

/**
 * GET THRESHOLD INFO
 * Get threshold amount and educational information
 * @param {string} companyId - The company ID
 */
export const getThresholdInfo = async (companyId) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/company/${companyId}/tax-computation/threshold-info`,
    'GET'
  );
  return response;
};

export default {
  login,
  logout,
  submitStep1,
  submitStep2,
  submitStep3,
  submitStep4,
  submitStep5,
  submitStep6,
  submitStep7,
  uploadFile,
  activateAccount,
  getOnboardingProfile,
  getOnboardingStatus,
  saveDraft,
  getAccessToken,
  searchBusinesses,
  sendBusinessInvitation,
  requestClientManagementAccess,
  acceptTeamInvitation,
  getClients,
  getClientById,
  getBusinessProfile,
  updateBusinessProfile,
  getBusinessTypes,
  getIndustries,
  getInvoices,
  // Tax computation functions
  getVatComputationStatus,
  initiateVatSetup,
  getVatTypes,
  getVatPeriods,
  calculateVat,
  getVatComputationResults,
  downloadVatReport,
  getMonthlyVatPayable,
  getThresholdStatus,
  getThresholdInfo,
};
