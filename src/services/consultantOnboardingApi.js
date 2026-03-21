/**
 * CONSULTANT ONBOARDING API SERVICE
 *
 * Handles all consultant onboarding related endpoints
 */

import { makeRequest, uploadFile as uploadMedia, API_VERSION } from './apiConfig';

// ============================================
// ONBOARDING STEPS
// ============================================

/**
 * STEP 1: Firm Identity & Legal Structure
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

// ============================================
// ONBOARDING MANAGEMENT
// ============================================

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
  try {
    const response = await makeRequest(
      `/api/v${API_VERSION}/enterprise/onboarding/consultant/profile`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Profile fetch error:', error);
    return { status: false, data: null };
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

// ============================================
// FILE UPLOAD
// ============================================

/**
 * UPLOAD MEDIA FILE
 * Upload a single file and get back URL
 */
export const uploadFile = uploadMedia;

// ============================================
// EXPORTS
// ============================================

export default {
  // Onboarding Steps
  submitStep1,
  submitStep2,
  submitStep3,
  submitStep4,
  submitStep5,
  submitStep6,
  submitStep7,

  // Onboarding Management
  activateAccount,
  getOnboardingProfile,
  getOnboardingStatus,
  saveDraft,

  // File Upload
  uploadFile,
};
