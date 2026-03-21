/**
 * API SERVICES INDEX
 *
 * Central export point for all API services
 * Import what you need:
 *
 * import { login, logout } from '@/services';
 * import { getClients } from '@/services';
 * import { getTaxSummary } from '@/services';
 */

// Export all from individual service files
export * from './apiConfig';
export * from './authApi';
export * from './clientApi';
export * from './taxApi';
export * from './financialsApi';
export * from './consultantOnboardingApi';
export * from './dashboardApi';

// Also export default objects for those who prefer that style
export { default as authApi } from './authApi';
export { default as clientApi } from './clientApi';
export { default as taxApi } from './taxApi';
export { default as financialsApi } from './financialsApi';
export { default as consultantOnboardingApi } from './consultantOnboardingApi';
export { default as dashboardApi } from './dashboardApi';
