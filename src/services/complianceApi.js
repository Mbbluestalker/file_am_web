import { makeRequest, API_VERSION } from './apiConfig';

export const getComplianceStats = async () => {
  return makeRequest(`/api/v${API_VERSION}/enterprise/compliance/stats`, 'GET');
};

export const getComplianceOverview = async () => {
  return makeRequest(`/api/v${API_VERSION}/enterprise/compliance/overview`, 'GET');
};

export const getUpcomingDeadlines = async (limit = 20) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/compliance/upcoming-deadlines?limit=${limit}`,
    'GET'
  );
};
