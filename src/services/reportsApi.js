import { makeRequest, API_VERSION } from './apiConfig';

export const listReports = async (clientId, page = 1, limit = 20) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports?page=${page}&limit=${limit}`,
    'GET'
  );
};

export const getTaxesSummary = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/taxes-summary`,
    'GET'
  );
};

export const getVatPaymentReport = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/vat-payment`,
    'GET'
  );
};

export const getCitReport = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/cit`,
    'GET'
  );
};

export const getWhtReport = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/wht`,
    'GET'
  );
};

export const getTaxWithholdingReport = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/tax-withholding`,
    'GET'
  );
};

export const getPayeReport = async (clientId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/paye`,
    'GET'
  );
};

export const downloadReportPdf = async (clientId, reportId) => {
  return makeRequest(
    `/api/v${API_VERSION}/enterprise/clients/${clientId}/reports/${reportId}/download`,
    'GET'
  );
};
