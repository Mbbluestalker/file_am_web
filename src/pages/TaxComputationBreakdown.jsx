import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getClientFromStorage } from '../utils/clientStorage';
import { getCitReport, getVatReport, getWhtReport, getPayeReport, exportAllReports, getTaxAssumptions } from '../services/taxApi';

const TABS = [
  { id: 'cit', label: 'CIT' },
  { id: 'vat', label: 'VAT' },
  { id: 'wht', label: 'WHT' },
  { id: 'firs', label: 'PAYE' },
];

const TAB_META = {
  cit:  { title: 'CIT Computation Breakdown',  totalLabel: 'Total Tax Payable (CIT)' },
  vat:  { title: 'VAT Computation Breakdown',  totalLabel: 'Total Tax Payable (VAT)' },
  wht:  { title: 'WHT Computation Breakdown',  totalLabel: 'Total Tax Payable (WHT)' },
  firs: { title: 'PAYE Computation Breakdown', totalLabel: 'Total Tax Payable (PAYE)' },
};

const DEFAULT_ASSUMPTIONS = {
  vatRegistrationStatus: '—',
  applicationCitRate: '—',
  msmeExemptionEligible: false,
  pioneerTaxStatus: '—',
};

const fmtDate = (iso) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return '—'; }
};

// Per-tab row builders — each faithfully mirrors the backend shape for that tax.
// CIT: profit-based with allowances (only tax that fits a full computation cascade).
// VAT: output-minus-input formula.
// WHT: single aggregate with optional period breakdown.
// PAYE: three parallel components (PAYE, contractor WHT, pension).

const buildCitRows = (api) => {
  const netProfit = api.netProfit ?? null;
  const taxAdj = api.taxAdjustments ?? null;
  const adjustedProfit = api.adjustedProfit ?? null;
  const capitalAllowances = api.breakdown?.capitalAllowances ?? 0;
  const lossCarryForward = api.breakdown?.lossCarryForward ?? 0;
  const finalTaxable =
    adjustedProfit != null ? adjustedProfit - capitalAllowances - lossCarryForward : null;
  const citRate = api.citRate ?? null;

  return {
    rows: [
      { label: 'Net Profit Before Tax', amount: netProfit, type: 'normal' },
      { label: 'Tax Adjustments', amount: taxAdj, type: 'normal' },
      { label: 'Adjusted Profit', amount: adjustedProfit, type: 'subtotal' },
      { label: 'Capital Allowances', amount: capitalAllowances, type: 'negative' },
      { label: 'Loss Carry-Forward', amount: lossCarryForward, type: 'negative' },
      { label: 'Final Taxable Profit', amount: finalTaxable, type: 'subtotal' },
      { label: 'Tax Rate Applied', rate: citRate != null ? `${citRate}%` : '—', type: 'rate' },
    ],
    totalAmount: api.citPayable ?? null,
  };
};

const buildVatRows = (api) => {
  const b = api.breakdown || {};
  return {
    rows: [
      { label: 'Output VAT on Sales', amount: b.outputVatOnSales ?? null, type: 'normal' },
      { label: 'Input VAT on Purchases', amount: b.inputVatOnPurchases ?? 0, type: 'negative' },
      { label: 'VAT on Imported Services', amount: b.vatOnImportedServices ?? 0, type: 'normal' },
      { label: 'VAT Adjustment', amount: b.vatAdjustment ?? 0, type: 'normal' },
      { label: 'Net VAT Payable', amount: api.netVatPayable ?? null, type: 'subtotal' },
      { label: 'Filing Status', text: api.filingStatus ?? '—', type: 'text' },
    ],
    totalAmount: api.netVatPayable ?? null,
  };
};

const buildWhtRows = (api) => {
  const breakdown = Array.isArray(api.breakdown) ? api.breakdown : [];
  const total = api.totalWhtCollected ?? 0;

  const row = breakdown.length > 0
    ? {
        label: 'Total WHT Collected',
        amount: total,
        type: 'normal',
        expandable: true,
        subItems: breakdown.map((b) => ({
          label: b.period ? `Period ${b.period}` : (b.label || 'Period'),
          amount: b.amount ?? null,
          negative: false,
        })),
      }
    : { label: 'Total WHT Collected', amount: total, type: 'normal' };

  return { rows: [row], totalAmount: total };
};

const buildPayeRows = (api) => {
  const b = api.breakdown || {};
  const noteRow = (note) =>
    note ? [{ label: 'Note', text: note, negative: false }] : [];

  return {
    rows: [
      {
        label: 'PAYE',
        amount: b.paye?.amount ?? api.payeAmount ?? null,
        type: 'normal',
        expandable: true,
        subItems: [
          { label: 'Due Date', text: fmtDate(b.paye?.dueDate || api.dueDate), negative: false },
          { label: 'Status', text: b.paye?.status ?? '—', negative: false },
          ...noteRow(b.paye?.note || api.note),
        ],
      },
      {
        label: 'Contractor WHT',
        amount: b.contractorWht?.amount ?? 0,
        type: 'normal',
        expandable: true,
        subItems: [
          { label: 'Status', text: b.contractorWht?.status ?? '—', negative: false },
          ...noteRow(b.contractorWht?.note),
        ],
      },
      {
        label: 'Pension',
        amount: b.pension?.amount ?? 0,
        type: 'normal',
        expandable: true,
        subItems: [
          { label: 'Status', text: b.pension?.status ?? '—', negative: false },
          ...noteRow(b.pension?.note),
        ],
      },
    ],
    totalAmount: api.payeAmount ?? null,
  };
};

const buildRows = (tab, api) => {
  if (!api) return { rows: [], totalAmount: null };
  switch (tab) {
    case 'cit':  return buildCitRows(api);
    case 'vat':  return buildVatRows(api);
    case 'wht':  return buildWhtRows(api);
    case 'firs': return buildPayeRows(api);
    default:     return { rows: [], totalAmount: null };
  }
};

const TaxComputationBreakdown = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = getClientFromStorage(clientId);
  const [activeTab, setActiveTab] = useState('cit');
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState({ cit: null, vat: null, wht: null, firs: null });
  const [assumptions, setAssumptions] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [exporting, setExporting] = useState(false);

  const toggleRow = (idx) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => { setExpandedRows({}); }, [activeTab]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [citRes, vatRes, whtRes, payeRes, assumptionsRes] = await Promise.allSettled([
        getCitReport(clientId),
        getVatReport(clientId),
        getWhtReport(clientId),
        getPayeReport(clientId),
        getTaxAssumptions(clientId),
      ]);
      setApiData({
        cit: citRes.status === 'fulfilled' && citRes.value?.status ? citRes.value.data : null,
        vat: vatRes.status === 'fulfilled' && vatRes.value?.status ? vatRes.value.data : null,
        wht: whtRes.status === 'fulfilled' && whtRes.value?.status ? whtRes.value.data : null,
        firs: payeRes.status === 'fulfilled' && payeRes.value?.status ? payeRes.value.data : null,
      });
      if (assumptionsRes.status === 'fulfilled' && assumptionsRes.value?.status) {
        setAssumptions(assumptionsRes.value.data);
      }
      setLoading(false);
    };
    if (clientId) fetchAll();
  }, [clientId]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAllReports(clientId, `${selectedYear}-01-01`, `${selectedYear}-12-31`);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar clientId={clientId} activePage="tax-computation" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header hideLogo={true} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading computation data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Client Not Found</h1>
          <p className="text-gray-500">The client you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => (amount == null ? '—' : `₦${Number(amount).toLocaleString()}`);

  const resolvedAssumptions = assumptions ? {
    vatRegistrationStatus: assumptions.vatRegistrationStatus ?? '—',
    applicationCitRate:    assumptions.applicationCitRate ?? null,
    msmeExemptionEligible: assumptions.msmeExemptionEligible === 'Yes',
    pioneerTaxStatus:      assumptions.pioneerTaxStatus ?? '—',
  } : DEFAULT_ASSUMPTIONS;

  const api = apiData[activeTab];
  const { rows, totalAmount } = buildRows(activeTab, api);
  const data = {
    title: TAB_META[activeTab].title,
    rows,
    total: { label: TAB_META[activeTab].totalLabel, amount: totalAmount },
    assumptions: resolvedAssumptions,
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={clientId} activePage="tax-computation" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-10 py-8">

            {/* Page header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Tax Computation</h1>
                <p className="text-sm text-gray-500">Subtitles tax computation with optimization insights</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="2025">Fiscal Year: 2025</option>
                  <option value="2024">Fiscal Year: 2024</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Period: Full Year</option>
                  <option>Q1</option>
                  <option>Q2</option>
                  <option>Q3</option>
                  <option>Q4</option>
                </select>
              </div>
            </div>

            {/* Tax type tabs */}
            <div className="flex gap-2 mb-6 mt-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-3 gap-6 items-start">

              {/* Left: Breakdown table */}
              <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-bold text-gray-900">{data.title}</h2>
                  <button className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Computation
                  </button>
                </div>

                <div>
                  {data.rows.length === 0 && (
                    <div className="py-10 text-center">
                      <p className="text-sm text-gray-500">
                        No {activeTab.toUpperCase() === 'FIRS' ? 'PAYE' : activeTab.toUpperCase()} computation available for this period.
                      </p>
                    </div>
                  )}
                  {data.rows.map((row, idx) => (
                    <div key={idx}>
                      {/* Main row */}
                      <div
                        className={`flex items-center justify-between py-3.5 border-b border-gray-100 ${
                          row.type === 'subtotal' ? 'bg-gray-50 -mx-6 px-6' : ''
                        } ${row.expandable ? 'cursor-pointer' : ''}`}
                        onClick={() => row.expandable && toggleRow(idx)}
                      >
                        {/* Left: number + label */}
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-gray-500">{idx + 1}</span>
                          </div>
                          <span className={`text-sm ${row.type === 'subtotal' ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {row.label}
                          </span>
                        </div>

                        {/* Right: value + optional chevron */}
                        <div className="flex items-center gap-3">
                          {row.type === 'text' && (
                            <span className="text-sm text-gray-500">{row.text}</span>
                          )}
                          {row.type === 'rate' && (
                            <span className="text-sm font-semibold text-gray-900">{row.rate}</span>
                          )}
                          {(row.type === 'normal' || row.type === 'subtotal') && (
                            <span className={`text-sm font-semibold ${row.type === 'subtotal' ? 'text-gray-900' : 'text-gray-800'}`}>
                              {formatCurrency(row.amount)}
                            </span>
                          )}
                          {row.type === 'negative' && (
                            <span className="text-sm font-semibold text-red-500">
                              {row.amount == null ? '—' : `₦${Number(row.amount).toLocaleString()}`}
                            </span>
                          )}
                          {row.expandable && (
                            <svg
                              className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expandedRows[idx] ? 'rotate-180' : ''}`}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Sub-items */}
                      {row.expandable && expandedRows[idx] && row.subItems?.map((sub, subIdx) => (
                        <div key={subIdx} className="flex items-center justify-between py-2.5 border-b border-gray-50 bg-gray-50 -mx-6 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-6 flex-shrink-0" /> {/* spacer for number alignment */}
                            <span className="text-xs text-gray-500 pl-3">{sub.label}</span>
                          </div>
                          <span className={`text-xs font-medium ${sub.negative ? 'text-red-500' : 'text-gray-700'}`}>
                            {sub.text ?? (sub.amount == null ? '—' : `₦${Number(sub.amount).toLocaleString()}`)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Total row */}
                  <div className="flex items-center justify-between pt-5 mt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-base font-bold text-gray-900">{data.total.label}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(data.total.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Right column: Tax Assumptions + Computation Complete */}
              <div className="col-span-1 flex flex-col gap-4">

                {/* Tax Assumptions card — read-only (backend has no update endpoint yet) */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-5">Tax Assumptions</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        VAT Registration Status
                      </label>
                      <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-100">
                        {data.assumptions.vatRegistrationStatus}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Applicable CIT Rate (%)
                      </label>
                      <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-100">
                        {data.assumptions.applicationCitRate != null ? `${data.assumptions.applicationCitRate}%` : '—'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        MSME Exemption Eligible
                      </label>
                      <div className={`flex items-center justify-between px-3 py-2.5 border rounded-lg ${
                        data.assumptions.msmeExemptionEligible
                          ? 'bg-teal-50 border-teal-300'
                          : 'bg-gray-100 border-gray-200'
                      }`}>
                        <span className="text-sm text-gray-700">
                          {data.assumptions.msmeExemptionEligible ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Pioneer Tax Status
                      </label>
                      <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-100">
                        {data.assumptions.pioneerTaxStatus}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Computation Complete */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Computation Complete</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Review the computation above and proceed to filing when ready.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleExport}
                      disabled={exporting}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exporting ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                      {exporting ? 'Exporting...' : 'Export Report'}
                    </button>
                    <button
                      onClick={() => navigate(`/clients/${clientId}/filings`)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                    >
                      Proceed to Filing
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TaxComputationBreakdown;
