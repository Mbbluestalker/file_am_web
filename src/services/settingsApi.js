/**
 * SETTINGS API SERVICE
 *
 * Handles settings-related API endpoints including:
 * - Profile management
 * - Consultant business settings
 * - Notification preferences
 * - Password management
 * - Team management
 */

import { makeRequest, API_VERSION } from './apiConfig';

// ============================================
// PROFILE MANAGEMENT
// ============================================

/**
 * GET PROFILE
 * Fetch consultant profile information
 */
export const getProfile = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/profile`,
    'GET'
  );
  return response;
};

/**
 * UPDATE PROFILE
 * Update consultant profile information
 * @param {Object} profileData - Profile fields (firstName, lastName, organizationName, etc.)
 */
export const updateProfile = async (profileData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/profile`,
    'PUT',
    profileData
  );
  return response;
};

// ============================================
// CONSULTANT BUSINESS SETTINGS
// ============================================

/**
 * GET CONSULTANT BUSINESS
 * Fetch consultant business/firm details
 */
export const getConsultantBusiness = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/consultant-business`,
    'GET'
  );
  return response;
};

/**
 * UPDATE CONSULTANT BUSINESS
 * Update consultant business/firm details
 * @param {Object} businessData - Business fields (firmName, businessStructure, rcNumber, etc.)
 */
export const updateConsultantBusiness = async (businessData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/consultant-business`,
    'PUT',
    businessData
  );
  return response;
};

// ============================================
// NOTIFICATION SETTINGS
// ============================================

/**
 * GET NOTIFICATION SETTINGS
 * Fetch notification preferences
 */
export const getNotificationSettings = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/notification-settings`,
    'GET'
  );
  return response;
};

/**
 * UPDATE NOTIFICATION SETTINGS
 * Update notification preferences
 * @param {Object} settings - Notification settings (taxDeadline, filingConfirmations, etc.)
 */
export const updateNotificationSettings = async (settings) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/notification-settings`,
    'PUT',
    settings
  );
  return response;
};

// ============================================
// PASSWORD MANAGEMENT
// ============================================

/**
 * CHANGE PASSWORD
 * Change user password
 * @param {Object} passwordData - Password data (currentPassword, newPassword)
 */
export const changePassword = async (passwordData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/auth/change-password`,
    'PATCH',
    passwordData
  );
  return response;
};

// ============================================
// TEAM MANAGEMENT
// ============================================

/**
 * INVITE TEAM MEMBER
 * Send invitation to a new team member
 * @param {Object} inviteData - Invitation data (name, email, role)
 */
export const inviteTeamMember = async (inviteData) => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/team/invitations`,
    'POST',
    inviteData
  );
  return response;
};

/**
 * GET TEAM INVITATIONS
 * Fetch list of pending invitations
 */
export const getTeamInvitations = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/team/invitations`,
    'GET'
  );
  return response;
};

/**
 * GET TEAM MEMBERS
 * Fetch list of active team members
 */
export const getTeamMembers = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/team/members`,
    'GET'
  );
  return response;
};

// ============================================
// EXPORTS
// ============================================

export default {
  getProfile,
  updateProfile,
  getConsultantBusiness,
  updateConsultantBusiness,
  getNotificationSettings,
  updateNotificationSettings,
  changePassword,
  inviteTeamMember,
  getTeamInvitations,
  getTeamMembers,
};
