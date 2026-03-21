/**
 * DASHBOARD API SERVICE
 *
 * Handles dashboard-related API endpoints including:
 * - Global dashboard metrics
 * - Recent activity
 * - Analytics overview
 */

import { makeRequest, API_VERSION } from './apiConfig';

// ============================================
// DASHBOARD
// ============================================

/**
 * GET GLOBAL DASHBOARD
 * Fetch global dashboard metrics and overview data
 * Returns: Total clients, tax due, savings, alerts, recent activity
 */
export const getGlobalDashboard = async () => {
  const response = await makeRequest(
    `/api/v${API_VERSION}/enterprise/dashboard`,
    'GET'
  );
  return response;
};

// ============================================
// EXPORTS
// ============================================

export default {
  getGlobalDashboard,
};
