/**
 * ONBOARDING API SERVICE
 *
 * Handles all API calls for the consultant onboarding process
 */

import axios from 'axios';

const BASE_URL = 'https://api-v2.fileam.app';
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
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/step/1`,
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
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/step/2`,
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
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/step/3`,
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
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/step/4`,
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
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/step/5`,
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
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/step/6`,
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
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/step/7`,
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
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/activate`,
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
      `${BASE_URL}/api/v${API_VERSION}/enterprise/consultant-onboarding/profile`,
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
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/status`,
    'GET'
  );
  return response;
};

/**
 * Save draft (if API supports it)
 */
export const saveDraft = async (step, data) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/consultant-onboarding/draft`,
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
};
