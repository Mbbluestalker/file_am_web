/**
 * AUTHENTICATION API SERVICE
 *
 * Handles all authentication and onboarding related endpoints including:
 * - Login/Logout
 * - Password recovery
 * - Email verification
 * - Consultant onboarding
 */

import { BASE_URL, API_VERSION, getAccessToken } from './apiConfig';

// ============================================
// AUTHENTICATION
// ============================================

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

// ============================================
// PASSWORD RECOVERY
// ============================================

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

// ============================================
// SIGNUP & EMAIL VERIFICATION
// ============================================

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

// ============================================
// EXPORTS
// ============================================

export { getAccessToken };

export default {
  // Authentication
  login,
  logout,
  getAccessToken,

  // Password Recovery
  forgotPassword,
  resetPassword,

  // Signup & Verification
  submitEmailSignup,
  verifyEmail,
  setPassword,
};
