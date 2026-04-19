import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import { getAllClientsFromStorage } from '../utils/clientStorage';
import {
  listReports,
  getTaxesSummary,
  getVatPaymentReport,
  getCitReport,
  getWhtReport,
  getTaxWithholdingReport,
  getPayeReport,
  downloadReportPdf,
} from '../services/reportsApi';
import { exportAllReports } from '../services/taxApi';

const ReportIcon = ({ kind }) => {
  const common = 'w-8 h-8';
  if (kind === 'chart') return (
    <svg className={`${common} text-teal-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17V11m5 6V7m5 10v-4M3 21h18M3 3h18" />
    </svg>
  );
  if (kind === 'clipboard') return (
    <svg className={`${common} text-amber-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6m-6 4h6" />
    </svg>
  );
  if (kind === 'building') return (
    <svg className={`${common} text-slate-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14M3 21h18M8 10h.01M8 14h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M10 21v-4h4v4" />
    </svg>
  );
  if (kind === 'briefcase') return (
    <svg className={`${common} text-amber-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  if (kind === 'document') return (
    <svg className={`${common} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
  if (kind === 'people') return (
    <svg className={`${common} text-indigo-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
  return null;
};

const REPORT_TYPES = [
  {
    id: 'taxes-summary',
    title: 'Taxes Summary',
    description: 'A consolidated overview of all tax obligations, liabilities, and payments.',
    icon: 'chart',
  },
  {
    id: 'vat-payments',
    title: 'VAT Payments Report',
    description: 'Track VAT collected, VAT paid, and payment history for each filing period.',
    icon: 'clipboard',
  },
  {
    id: 'cit-computation',
    title: 'CIT Computation Report',
    description: 'Breakdown of CIT calculations including taxable profit, adjustments, & final liability.',
    icon: 'building',
  },
  {
    id: 'wht-report',
    title: 'WHT Report',
    description: 'Summary of withholding tax credits deducted and applied across transactions.',
    icon: 'briefcase',
  },
  {
    id: 'tax-withholding',
    title: 'Tax Withholding Report',
    description: 'Comprehensive record of taxes withheld from vendors, suppliers, & other transactions.',
    icon: 'document',
  },
  {
    id: 'paye-computation',
    title: 'PAYE Computation Report',
    description: 'Payroll tax calculations showing employee deductions & employer obligations',
    icon: 'people',
  },
];

// Maps API reportType string → modal type ID
const REPORT_TYPE_TO_ID = {
  'VAT Return Summary': 'vat-payments',
  'Taxes Summary': 'taxes-summary',
  'CIT Computation': 'cit-computation',
  'WHT Report': 'wht-report',
  'Tax Withholding': 'tax-withholding',
  'PAYE Computation': 'paye-computation',
};

// Format "2026-02" → "February 2026"
const formatPeriodLabel = (label) => {
  if (!label) return '—';
  const [year, month] = label.split('-');
  if (!year || !month) return label;
  return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

const formatDate = (str) => {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const COMPLIANCE_NOTE = 'This report has been generated in accordance with FIRS guidelines and Nigerian tax regulations. All figures are subject to audit verification.';

const ReportModal = ({ reportId, apiData, isLoading, clientName, onClose }) => {
  const reportType = REPORT_TYPES.find((r) => r.id === reportId);
  if (!reportType) return null;

  const transformer = REPORT_TRANSFORMERS[reportId];
  const transformed = apiData && transformer ? transformer(apiData) : null;

  const hasData = !isLoading && transformed && (
    (transformed.metrics && transformed.metrics.length > 0) ||
    (transformed.breakdown && transformed.breakdown.length > 0)
  );

  const periodLabel = apiData?.period
    ? formatPeriodLabel(apiData.period)
    : apiData?.periodLabel
    ? formatPeriodLabel(apiData.periodLabel)
    : '—';
  const generatedLabel = apiData?.generatedAt
    ? formatDate(apiData.generatedAt)
    : formatDate(new Date().toISOString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 shrink-0">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{reportType.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 ml-4 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Client: {clientName || '—'} &bull; Period: {periodLabel} &bull; Generated: {generatedLabel}
          </p>
        </div>

        <div className="h-px bg-gray-200 shrink-0" />

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="animate-spin h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : !hasData ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-700 mb-1">No report data available</p>
              <p className="text-xs text-gray-400">This report has no data for the selected period or client.</p>
            </div>
          ) : (<>
          {/* Summary */}
          {transformed.metrics && transformed.metrics.length > 0 && (<>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-3 gap-3 mb-2">
              {transformed.metrics.slice(0, 3).map((metric) => (
                <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{metric.label}</p>
                  <p className={`text-xl font-bold ${metric.green ? 'text-green-600' : 'text-gray-900'}`}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
            {transformed.metrics[3] && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    {transformed.metrics[3].label}
                  </p>
                  <p className={`text-xl font-bold ${transformed.metrics[3].green ? 'text-green-600' : 'text-gray-900'}`}>
                    {transformed.metrics[3].value}
                  </p>
                </div>
              </div>
            )}
          </>)}

          {/* Detailed Breakdown */}
          {transformed.breakdown && transformed.breakdown.length > 0 && (
            <>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="grid grid-cols-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Description</span>
                  <span className="text-sm font-semibold text-gray-700 text-right">Amount</span>
                </div>
                {transformed.breakdown.map((row, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-2 px-4 py-3 ${idx < transformed.breakdown.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <span className="text-sm text-gray-700">{row.description}</span>
                    <span className="text-sm text-gray-900 text-right">{row.amount}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Compliance Note */}
          <div className="bg-gray-50 rounded-lg px-4 py-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">Compliance Note:</span> {COMPLIANCE_NOTE}
            </p>
          </div>
          </>)}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 shrink-0 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            disabled={!hasData}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const fmt = (n) => `₦${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Transforms raw API response data → { metrics, breakdown } for the modal
const REPORT_TRANSFORMERS = {
  'taxes-summary': (d) => ({
    metrics: [
      { label: 'TOTAL TAX LIABILITY', value: fmt(d.totalTaxLiability) },
      { label: 'VAT PAYABLE', value: fmt(d.vatPayable) },
      { label: 'CIT PAYABLE', value: fmt(d.citPayable) },
      { label: 'WHT COLLECTED', value: fmt(d.whtCollected) },
    ],
    breakdown: Object.entries(d.breakdown || {}).map(([description, amount]) => ({
      description,
      amount: fmt(amount),
    })),
  }),
  'paye-computation': (d) => ({
    metrics: [
      { label: 'PAYE AMOUNT', value: fmt(d.payeAmount) },
      { label: 'PENSION', value: fmt(d.breakdown?.pension?.amount) },
      { label: 'DUE DATE', value: d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
      { label: 'STATUS', value: d.breakdown?.paye?.status || '—' },
    ],
    breakdown: [
      { description: 'PAYE', amount: fmt(d.breakdown?.paye?.amount) },
      { description: 'Pension (Employee 8% + Employer 10%)', amount: fmt(d.breakdown?.pension?.amount) },
    ],
  }),
  'tax-withholding': (d) => ({
    metrics: [
      { label: 'TOTAL WHT COLLECTED', value: fmt(d.totalWhtCollected) },
      { label: 'NUMBER OF PERIODS', value: String(d.breakdown?.length ?? '—') },
      { label: 'COMPLIANCE RATE', value: '—' },
      { label: 'REMITTANCE STATUS', value: '—' },
    ],
    breakdown: (d.breakdown || []).map((row) => ({
      description: `Period: ${row.period}`,
      amount: fmt(row.amount),
    })),
  }),
  'wht-report': (d) => ({
    metrics: [
      { label: 'TOTAL WHT COLLECTED', value: fmt(d.totalWhtCollected) },
      { label: 'NUMBER OF PERIODS', value: String(d.breakdown?.length ?? '—') },
      { label: 'COMPLIANCE RATE', value: '—' },
      { label: 'REMITTANCE STATUS', value: '—' },
    ],
    breakdown: (d.breakdown || []).map((row) => ({
      description: `Period: ${row.period}`,
      amount: fmt(row.amount),
    })),
  }),
  'cit-computation': (d) => ({
    metrics: [
      { label: 'NET PROFIT', value: fmt(d.netProfit) },
      { label: 'TAX ADJUSTMENTS', value: fmt(d.taxAdjustments) },
      { label: 'ADJUSTED PROFIT', value: fmt(d.adjustedProfit) },
      { label: `CIT DUE (${d.citRate}%)`, value: fmt(d.citPayable) },
    ],
    breakdown: [
      { description: 'Annualized Profit', amount: fmt(d.breakdown?.annualizedProfit) },
      { description: 'Monthly Profit', amount: fmt(d.breakdown?.monthlyProfit) },
      { description: 'Estimated Annual CIT', amount: fmt(d.breakdown?.estimatedAnnualCit) },
      { description: `CIT Rate`, amount: `${d.breakdown?.citRate ?? d.citRate}%` },
    ],
  }),
  'vat-payments': (d) => ({
    metrics: [
      { label: 'TOTAL VAT COLLECTED', value: fmt(d.totalVatCollected) },
      { label: 'TOTAL VAT PAID', value: fmt(d.totalVatPaid) },
      { label: 'NET VAT PAYABLE', value: fmt(d.netVatPayable) },
      { label: 'FILING STATUS', value: d.filingStatus || '—', green: !!d.filingStatus },
    ],
    breakdown: [
      { description: 'Output VAT on Sales', amount: fmt(d.breakdown?.outputVatOnSales) },
      { description: 'Input VAT on Purchases', amount: fmt(d.breakdown?.inputVatOnPurchases) },
      { description: 'VAT on Imported Services', amount: fmt(d.breakdown?.vatOnImportedServices) },
      { description: 'VAT Adjustments', amount: fmt(d.breakdown?.vatAdjustment) },
    ],
  }),
};

// Map report type id to API fetcher
const REPORT_FETCHERS = {
  'taxes-summary': getTaxesSummary,
  'vat-payments': getVatPaymentReport,
  'cit-computation': getCitReport,
  'wht-report': getWhtReport,
  'tax-withholding': getTaxWithholdingReport,
  'paye-computation': getPayeReport,
};

const Reports = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  const clients = getAllClientsFromStorage();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  useEffect(() => {
    if (!selectedClientId) {
      setRecentReports([]);
      return;
    }
    const fetchRecentReports = async () => {
      setRecentLoading(true);
      try {
        const res = await listReports(selectedClientId);
        if (res?.status && res.data) {
          const list = res.data.data || res.data.reports || res.data;
          setRecentReports(Array.isArray(list) ? list : []);
        } else {
          setRecentReports([]);
        }
      } catch {
        setRecentReports([]);
      } finally {
        setRecentLoading(false);
      }
    };
    fetchRecentReports();
  }, [selectedClientId]);

  const [downloadingId, setDownloadingId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleExportAll = async () => {
    if (!selectedClientId) {
      toast.error('Select a client first');
      return;
    }
    setExporting(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const dateFrom = `${year}-01-01`;
      const dateTo = `${year}-12-31`;
      await exportAllReports(selectedClientId, dateFrom, dateTo);
      toast.success('Export started');
    } catch (err) {
      console.error('Export all reports failed:', err);
      toast.error(err?.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = async (reportId) => {
    if (!reportId || !selectedClientId) return;
    setDownloadingId(reportId);
    try {
      const res = await downloadReportPdf(selectedClientId, reportId);
      if (!res?.status) {
        toast.error(res?.message || 'Report not available for download', { duration: 4000 });
        return;
      }
      const url = res?.data?.url || res?.url;
      if (url) {
        window.open(url, '_blank');
        toast.success('Download started');
      } else {
        toast.error('No download link available');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to download report', { duration: 4000 });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenModal = async (reportTypeId) => {
    if (!selectedClientId) {
      toast.error('Select a client first');
      return;
    }
    setActiveModal(reportTypeId);
    setModalData(null);
    setModalLoading(true);
    try {
      const fetcher = REPORT_FETCHERS[reportTypeId];
      if (!fetcher) {
        toast.error('Report type not supported');
        return;
      }
      const res = await fetcher(selectedClientId);
      if (res?.status && res.data) {
        setModalData(res.data);
      } else {
        toast.error(res?.message || 'Failed to load report');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to load report');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-16 py-10">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
            <p className="text-sm text-gray-500">Generate and download tax compliance reports</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Client Selector */}
            <div className="relative">
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
              >
                {clients.length === 0 && <option value="">No clients</option>}
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <button
              disabled
              title="Date range filtering coming soon"
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-400 bg-white cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date Range
            </button>
            <button
              onClick={handleExportAll}
              disabled={exporting || !selectedClientId}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              {exporting ? 'Exporting…' : 'Export All'}
            </button>
          </div>
        </div>

        {/* Report Type Cards */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {REPORT_TYPES.map((report) => (
            <button
              key={report.id}
              onClick={() => handleOpenModal(report.id)}
              className="bg-gray-50 rounded-xl p-6 text-left hover:bg-gray-100 transition-colors"
            >
              <div className="mb-8">
                <ReportIcon kind={report.icon} />
              </div>
              <p className="text-base font-semibold text-gray-900 mb-2">{report.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{report.description}</p>
            </button>
          ))}
        </div>

        {/* Recently Generated */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recently Generated</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 px-6 py-3 bg-gray-50 border-b border-gray-200">
              {['Report Name', 'Client', 'Period', 'Generated', 'Action'].map((col) => (
                <span key={col} className="text-xs font-semibold text-gray-500">{col}</span>
              ))}
            </div>
            {recentLoading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : recentReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-gray-500">No reports generated yet</p>
              </div>
            ) : (
              recentReports.map((row, idx) => {
                const modalTypeId = REPORT_TYPE_TO_ID[row.reportType] || null;
                return (
                <div
                  key={row.id || idx}
                  className={`grid grid-cols-5 items-center px-6 py-4 ${idx < recentReports.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <span className="text-sm text-gray-900">{row.reportType}</span>
                  <span className="text-sm text-gray-400">{row.clientName || selectedClient?.name || '—'}</span>
                  <span className="text-sm text-gray-600">{formatPeriodLabel(row.periodLabel)}</span>
                  <span className="text-sm text-gray-600">{formatDate(row.generatedAt)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => modalTypeId && handleOpenModal(modalTypeId)}
                      disabled={!modalTypeId}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(row.id)}
                      disabled={downloadingId === row.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-teal-600 rounded-md text-xs font-medium text-teal-600 hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === row.id ? (
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                      Download
                    </button>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {activeModal && (
        <ReportModal
          reportId={activeModal}
          apiData={modalData}
          isLoading={modalLoading}
          clientName={selectedClient?.name}
          onClose={() => { setActiveModal(null); setModalData(null); }}
        />
      )}
    </div>
  );
};

export default Reports;
