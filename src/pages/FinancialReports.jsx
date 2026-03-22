import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getClientFromStorage } from '../utils/clientStorage';
import { getProfitLoss, getBalanceSheet } from '../services/financialsApi';

// ─── Demo data for tabs without API endpoints ────────────────────────────────

const CASH_FLOW_DATA = {
  insight: 'Strong operating cash flow generation of ₦11.5M. Your business has healthy cash inflows covering operations and growth.',
  operating: {
    total: 11500000,
    items: [
      { label: 'Customer Payments', description: 'Cash received from sales', amount: 42500000 },
      { label: 'Supplier Payments', description: 'Inventory and supplies', amount: -18200000 },
      { label: 'Salary Payments', description: 'Staff salaries and benefits', amount: -8400000 },
      { label: 'Operating Expenses', description: 'Rent, utilities, software', amount: -3200000 },
      { label: 'Tax Payments', description: 'VAT and WHT paid', amount: -1200000 },
    ],
  },
  investing: {
    total: -4600000,
    items: [
      { label: 'Equipment Purchases', description: 'Machinery and tools', amount: -5800000 },
      { label: 'Asset Sales', description: 'Old equipment sold', amount: 1200000 },
    ],
  },
  financing: {
    total: 4100000,
    items: [
      { label: 'Loans Received', description: 'Bank loan disbursement', amount: 10000000 },
      { label: 'Loan Repayments', description: 'Principal + interest', amount: -3500000 },
      { label: 'Owner Withdrawals', description: 'Dividends paid', amount: -2400000 },
    ],
  },
  netCashPosition: 11000000,
};

const TAX_LIABILITY_DATA = {
  insight: 'Your deductible expenses and capital allowances reduced your taxable profit by ₦4,500, saving ₦1,260. Make sure all WHT certificates are properly filed for credit claims.',
  total: 16973200,
  sections: [
    {
      id: 'vat',
      label: 'Value Added Tax (VAT)',
      badge: 'Current Year',
      badgeColor: 'bg-green-100 text-green-700',
      total: 6420000,
      items: [
        { label: 'Output VAT on Sales', amount: 12000000, positive: true },
        { label: 'Input VAT on Purchases', amount: -6580000, positive: false },
      ],
      dueDate: 'April 21, 2024',
      dueDateColor: 'text-orange-600',
    },
    {
      id: 'paye',
      label: 'Pay As You Earn (PAYE)',
      badge: 'Current Year',
      badgeColor: 'bg-green-100 text-green-700',
      total: 1000000,
      items: [
        { label: 'Employee Tax on Staff', amount: 1000000, positive: true },
      ],
      dueDate: 'April 18, 2024',
      dueDateColor: 'text-orange-600',
    },
    {
      id: 'wht',
      label: 'Withholding Tax (WHT)',
      badge: 'Partially Applied',
      badgeColor: 'bg-blue-100 text-blue-700',
      total: 2140000,
      items: [
        { label: 'WHT on Professional Services', amount: 1200000, positive: true },
        { label: 'WHT on Rent (5%)', amount: 600000, positive: true },
        { label: 'WHT on Surveys (5%)', amount: 340000, positive: true },
      ],
      dueDate: 'April 10, 2024',
      dueDateColor: 'text-orange-600',
    },
    {
      id: 'cit',
      label: 'Companies Income Tax (CIT)',
      badge: 'Computed',
      badgeColor: 'bg-purple-100 text-purple-700',
      total: 4553200,
      items: [
        { label: 'Taxable Profit', amount: 18900000, positive: true },
        { label: 'Tax Rate (25%)', amount: null, isRate: true, rateValue: '25%' },
        { label: 'CIT Liability', amount: 4553200, positive: true },
      ],
      dueDate: 'June 30, 2024',
      dueDateColor: 'text-gray-600',
    },
  ],
  note: 'Note: All tax calculations are based on FIRS guidelines and Nigerian tax regulations. Ensure timely payment to avoid penalties and interest charges.',
};

const REVENUE_DATA = {
  insight: 'Product A contributes 44% but only 12% of profit due to high costs. Top 5 customers account for 45% of total revenue - consider diversifying to reduce concentration risk.',
  total: 85600000,
  categories: [
    { label: 'Product Sales', amount: 40800000, change: '+1%', color: 'bg-green-500', widthPct: 48 },
    { label: 'Service Revenue', amount: 20000000, change: '+6.1%', color: 'bg-yellow-400', widthPct: 23 },
    { label: 'Consulting', amount: 20200000, change: null, color: 'bg-blue-500', widthPct: 24 },
    { label: 'Delivery Fees', amount: 4600000, change: null, color: 'bg-purple-500', widthPct: 5 },
  ],
  topCustomers: [
    { name: 'Lagos State Govt', revenue: 12000000, percentage: 25, transactions: 4 },
    { name: 'Dangote Industries', revenue: 8500000, percentage: 14, transactions: 19 },
    { name: 'Access Bank Plc', revenue: 9000000, percentage: 16, transactions: 8 },
    { name: 'MTN Nigeria', revenue: 6400000, percentage: 11, transactions: 6 },
    { name: 'Binoche Nigeria', revenue: 5200000, percentage: 9, transactions: 3 },
  ],
  topStreams: [
    { label: 'Product A', amount: 18400000 },
    { label: 'Product B', amount: 14200000 },
    { label: 'Product C', amount: 10800000 },
    { label: 'Product D', amount: 6248000 },
  ],
};

const EXPENSE_DATA = {
  alert: 'Marketing expenses increased 40% (₦4.2M) compared to last month while revenue grew only 12%. Review ROI on campaigns and consider optimizing spend allocation.',
  total: 45934000,
  categories: [
    { label: 'Inventory', amount: 18200000, change: 12, percentage: 39, color: 'bg-blue-500', warn: false },
    { label: 'Salaries', amount: 12500000, change: 3, percentage: 27, color: 'bg-green-500', warn: false },
    { label: 'Operations', amount: 6334000, change: 5, percentage: 14, color: 'bg-purple-500', warn: false },
    { label: 'Marketing', amount: 4200000, change: 40, percentage: 9, color: 'bg-red-500', warn: true },
    { label: 'Rent', amount: 3500000, change: 0, percentage: 7, color: 'bg-yellow-400', warn: false },
    { label: 'Utilities', amount: 1200000, change: 8, percentage: 3, color: 'bg-gray-400', warn: false },
  ],
  monthlyTrend: [
    { month: 'Oct', amount: 38500000, label: '₦38.5M' },
    { month: 'Nov', amount: 41200000, label: '₦41.2M' },
    { month: 'Dec', amount: 43900000, label: '₦43.9M' },
    { month: 'Jan', amount: 44200000, label: '₦44.2M' },
    { month: 'Feb', amount: 45900000, label: '₦45.9M' },
    { month: 'Mar', amount: 45900000, label: '₦45.9M' },
  ],
  topVendors: [
    { name: 'ABC Suppliers Ltd', category: 'Inventory', amount: 8400000, transactions: 45 },
    { name: 'XYZ Marketing Agency', category: 'Marketing', amount: 4200000, transactions: 12 },
    { name: 'Lagos Property Group', category: 'Rent', amount: 3500000, transactions: 1 },
    { name: 'Payroll Services', category: 'Salaries', amount: 12500000, transactions: 1 },
    { name: 'EKEDC', category: 'Utilities', amount: 850000, transactions: 3 },
  ],
};

const TABS = [
  { id: 'profitLoss', label: 'Profit & Loss' },
  { id: 'balanceSheet', label: 'Balance Sheet' },
  { id: 'cashFlow', label: 'Cash Flow' },
  { id: 'taxLiability', label: 'Tax Liability' },
  { id: 'revenueAnalytics', label: 'Revenue Analytics' },
  { id: 'expenseIntelligence', label: 'Expense Intelligence' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatAmtFull = (amount) => {
  if (amount === null || amount === undefined) return '';
  const abs = Math.abs(amount);
  const str = `₦${abs.toLocaleString()}.00`;
  return amount < 0 ? `(${str})` : str;
};

const isNeg = (amount) => amount < 0;

// ─── Sub-components ───────────────────────────────────────────────────────────

const TaxGptInsight = ({ text }) => (
  <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
      <div className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-xs font-semibold text-green-700">TaxGPT Insight</span>
    </div>
    <p className="text-xs text-gray-700">{text}</p>
  </div>
);

const TaxGptAlert = ({ text }) => (
  <div className="flex items-start gap-3 bg-red-900 rounded-xl px-4 py-3 mb-6">
    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
      <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
      <span className="text-xs font-semibold text-orange-400">TaxGPT Alert!</span>
    </div>
    <p className="text-xs text-gray-200">{text}</p>
  </div>
);

const TaxGptDark = ({ text }) => (
  <div className="flex items-start gap-3 bg-teal-900 rounded-xl px-4 py-3 mb-6">
    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
      <div className="w-2 h-2 rounded-full bg-teal-400" />
      <span className="text-xs font-semibold text-teal-300">TaxGPT Insight</span>
    </div>
    <p className="text-xs text-gray-300">{text}</p>
  </div>
);

const CashFlowSection = ({ title, total, items }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between bg-teal-900 text-white px-5 py-3 rounded-t-xl">
      <span className="text-sm font-semibold uppercase tracking-wide">{title}</span>
      <span className={`text-sm font-bold ${isNeg(total) ? 'text-red-300' : 'text-white'}`}>
        {formatAmtFull(total)}
      </span>
    </div>
    <div className="border border-t-0 border-gray-200 rounded-b-xl">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between px-5 py-3 border-b border-gray-100 last:border-b-0"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-400">{item.description}</p>
          </div>
          <span className={`text-sm font-semibold ${isNeg(item.amount) ? 'text-red-600' : 'text-green-600'}`}>
            {formatAmtFull(item.amount)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const FinancialReports = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = getClientFromStorage(clientId);

  const [activeTab, setActiveTab] = useState('profitLoss');
  const [period, setPeriod] = useState('lastMonth');
  const [isLoading, setIsLoading] = useState(true);
  const [profitLossData, setProfitLossData] = useState(null);
  const [balanceSheetData, setBalanceSheetData] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!clientId) return;
      try {
        setIsLoading(true);
        const currentYear = new Date().getFullYear();
        const [plRes, bsRes] = await Promise.all([
          getProfitLoss(clientId, currentYear).catch(() => null),
          getBalanceSheet(clientId, currentYear).catch(() => null),
        ]);
        if (plRes?.status) setProfitLossData(plRes.data);
        if (bsRes?.status) setBalanceSheetData(bsRes.data);
      } catch (err) {
        console.error('Error fetching financial reports:', err);
        toast.error('Failed to load financial reports');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [clientId, period]);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    const abs = Math.abs(amount);
    return `${amount < 0 ? '-' : ''}₦${abs.toLocaleString()}`;
  };

  const formatPercentage = (val) => {
    if (!val && val !== 0) return '';
    return val > 0 ? `+${val}%` : `${val}%`;
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar clientId={clientId} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header hideLogo={true} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-600">Loading financial reports...</p>
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

  const maxTrendAmount = Math.max(...EXPENSE_DATA.monthlyTrend.map((m) => m.amount));

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={clientId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 px-10 py-8 overflow-y-auto bg-gray-50">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button
              onClick={() => navigate(`/clients/${clientId}/financials`)}
              className="hover:text-gray-700 transition-colors"
            >
              Financials
            </button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Financial Reports</span>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Financial Reports</h1>
            <p className="text-sm text-gray-500">
              Upload and review invoices, receipts, and financial documents for accurate tax computation
            </p>
          </div>

          {/* Tabs + Period */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="lastMonth">Last Month</option>
                <option value="lastQuarter">Last Quarter</option>
                <option value="lastYear">Last Year</option>
                <option value="yearToDate">Year to Date</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* ── PROFIT & LOSS ── */}
          {activeTab === 'profitLoss' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profit & Loss</h2>
                <span className="text-sm text-gray-400">Adjusted</span>
              </div>
              {profitLossData ? (
                <div className="space-y-0">
                  {/* Revenue */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">Revenue</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(profitLossData.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 pl-6 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Sales Income</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400 font-medium">—</span>
                      <span className="text-xs text-gray-300 font-medium w-10 text-right">—</span>
                    </div>
                  </div>
                  {/* Cost of Sales */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">Cost of Sales</span>
                    <span className="font-semibold text-gray-400">—</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 pl-6 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Cost of Goods Sold</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400 font-medium">—</span>
                      <span className="text-xs text-gray-300 font-medium w-10 text-right">—</span>
                    </div>
                  </div>
                  {/* Gross Profit */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">Gross Profit</span>
                    <span className="font-semibold text-gray-400">—</span>
                  </div>
                  {/* Operating Expenses — mapped from API `expenses` */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">Operating Expenses</span>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">{formatCurrency(profitLossData.expenses)}</span>
                      <span className="text-xs text-gray-300 font-medium w-10 text-right">—</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2.5 pl-6 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Salaries & Wages</span>
                    <span className="text-sm text-gray-400">—</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 pl-6 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Office Rent</span>
                    <span className="text-sm text-gray-400">—</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 pl-6 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Travel & Entertainment</span>
                    <span className="text-sm text-gray-400">—</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 pl-6 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Other Expenses</span>
                    <span className="text-sm text-gray-400">—</span>
                  </div>
                  {/* EBITDA */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">EBITDA</span>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-400">—</span>
                      <span className="text-xs text-gray-300 font-medium w-10 text-right">—</span>
                    </div>
                  </div>
                  {/* Other Income */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Other Income</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">—</span>
                      <span className="text-xs text-gray-300 font-medium w-10 text-right">—</span>
                    </div>
                  </div>
                  {/* Net Profit Before Tax */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Net Profit Before Tax</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">—</span>
                      <span className="text-xs text-gray-300 font-medium w-10 text-right">—</span>
                    </div>
                  </div>
                  {/* Income Tax Expense */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-900">Income Tax Expense</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">—</span>
                      <span className="text-xs text-gray-300 font-medium w-10 text-right">—</span>
                    </div>
                  </div>
                  {/* Net Profit After Tax — mapped from API `netProfit` */}
                  <div className="flex items-center justify-between py-3">
                    <span className="font-bold text-gray-900">Net Profit After Tax</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">{formatCurrency(profitLossData.netProfit)}</span>
                      <span className="text-xs text-gray-300 font-medium w-10 text-right">—</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-12">No profit & loss data available</p>
              )}
            </div>
          )}

          {/* ── BALANCE SHEET ── */}
          {activeTab === 'balanceSheet' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              {balanceSheetData ? (
                <div className="space-y-8">
                  {/* ASSETS */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">ASSETS</p>
                    {/* Current Assets */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="font-semibold text-gray-900">Current Assets</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">{formatCurrency(balanceSheetData.assets?.currentAssets)}</span>
                        <span className="text-xs text-gray-300 font-medium w-8 text-right">—</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2.5 pl-8 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Cash and Cash Equivalents</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 pl-8 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Accounts Receivable</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 pl-8 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Inventory</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 pl-8 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Prepayments</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    {/* Fixed Assets */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-900">Fixed Assets</span>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">{formatCurrency(balanceSheetData.assets?.fixedAssets)}</span>
                        <span className="text-xs text-gray-300 font-medium w-8 text-right">—</span>
                      </div>
                    </div>
                    {/* Total Assets */}
                    <div className="flex items-center justify-between py-3 border-b-2 border-gray-300">
                      <span className="font-bold text-gray-900">Total Assets</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">{formatCurrency(balanceSheetData.assets?.total)}</span>
                        <span className="text-xs text-gray-300 font-medium w-8 text-right">—</span>
                      </div>
                    </div>
                  </div>

                  {/* LIABILITIES */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">LIABILITIES</p>
                    {/* Current Liabilities */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="font-semibold text-gray-900">Current Liabilities</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">{formatCurrency(balanceSheetData.liabilities?.currentLiabilities)}</span>
                        <span className="text-xs text-gray-300 font-medium w-8 text-right">—</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2.5 pl-8 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Accounts Payable</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 pl-8 border-b border-gray-100">
                      <span className="text-sm text-gray-500">VAT Payable</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 pl-8 border-b border-gray-100">
                      <span className="text-sm text-gray-500">WHT Payable</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 pl-8 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Accruals</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    {/* Long-term Liabilities */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-900">Long-term Liabilities</span>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">{formatCurrency(balanceSheetData.liabilities?.longTermLiabilities)}</span>
                        <span className="text-xs text-gray-300 font-medium w-8 text-right">—</span>
                      </div>
                    </div>
                    {/* Total Liabilities */}
                    <div className="flex items-center justify-between py-3 border-b-2 border-gray-300">
                      <span className="font-bold text-gray-900">Total Liabilities</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">{formatCurrency(balanceSheetData.liabilities?.total)}</span>
                        <span className="text-xs text-gray-300 font-medium w-8 text-right">—</span>
                      </div>
                    </div>
                  </div>

                  {/* EQUITY */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">EQUITY</p>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="font-medium text-gray-900">Share Capital</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400">—</span>
                        <span className="text-xs text-gray-300 font-medium w-8 text-right">—</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="font-medium text-gray-900">Retained Earnings</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400">—</span>
                        <span className="text-xs text-gray-300 font-medium w-8 text-right">—</span>
                      </div>
                    </div>
                    {/* Total Equity — mapped from API `equity` */}
                    <div className="flex items-center justify-between py-3">
                      <span className="font-bold text-gray-900">Total Equity</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">{formatCurrency(balanceSheetData.equity)}</span>
                        <span className="text-xs text-gray-300 font-medium w-8 text-right">—</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-12">No balance sheet data available</p>
              )}
            </div>
          )}

          {/* ── CASH FLOW ── */}
          {activeTab === 'cashFlow' && (
            <div>
              <TaxGptInsight text={CASH_FLOW_DATA.insight} />

              <CashFlowSection
                title="OPERATING CASH FLOW"
                total={CASH_FLOW_DATA.operating.total}
                items={CASH_FLOW_DATA.operating.items}
              />
              <CashFlowSection
                title="INVESTING CASH FLOW"
                total={CASH_FLOW_DATA.investing.total}
                items={CASH_FLOW_DATA.investing.items}
              />
              <CashFlowSection
                title="FINANCING CASH FLOW"
                total={CASH_FLOW_DATA.financing.total}
                items={CASH_FLOW_DATA.financing.items}
              />

              {/* Net Cash Position */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-lg font-bold text-gray-900">Net Cash Position</span>
                  <span className="ml-auto text-2xl font-bold text-green-600">
                    {formatAmtFull(CASH_FLOW_DATA.netCashPosition)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Operating', value: CASH_FLOW_DATA.operating.total },
                    { label: 'Investing', value: CASH_FLOW_DATA.investing.total },
                    { label: 'Financing', value: CASH_FLOW_DATA.financing.total },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                      <p className={`text-sm font-semibold ${isNeg(item.value) ? 'text-red-600' : 'text-green-600'}`}>
                        {formatAmtFull(item.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAX LIABILITY ── */}
          {activeTab === 'taxLiability' && (
            <div>
              <TaxGptInsight text={TAX_LIABILITY_DATA.insight} />

              {/* Total */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Tax Liability</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₦{TAX_LIABILITY_DATA.total.toLocaleString()}.00
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap text-sm text-gray-500">
                    {TAX_LIABILITY_DATA.sections.map((s) => (
                      <span key={s.id} className="font-semibold text-gray-700">
                        {s.id.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tax Sections */}
              <div className="space-y-4">
                {TAX_LIABILITY_DATA.sections.map((section) => (
                  <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{section.label}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${section.badgeColor}`}>
                          {section.badge}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">
                        ₦{section.total.toLocaleString()}.00
                      </span>
                    </div>
                    <div className="px-5 py-3 space-y-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-gray-600">{item.label}</span>
                          {item.isRate ? (
                            <span className="text-sm font-medium text-gray-900">{item.rateValue}</span>
                          ) : (
                            <span className={`text-sm font-medium ${item.positive ? 'text-gray-900' : 'text-red-600'}`}>
                              {item.positive ? '₦' : '(₦)'}{Math.abs(item.amount).toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-gray-500">Due Date:</span>
                      <span className={`text-xs font-semibold ${section.dueDateColor}`}>{section.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-xs text-gray-400 leading-relaxed bg-white border border-gray-200 rounded-xl px-5 py-4">
                {TAX_LIABILITY_DATA.note}
              </p>
            </div>
          )}

          {/* ── REVENUE ANALYTICS ── */}
          {activeTab === 'revenueAnalytics' && (
            <div>
              <TaxGptDark text={REVENUE_DATA.insight} />

              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                {/* Revenue Total */}
                <p className="text-3xl font-bold text-gray-900 mb-6">
                  ₦{REVENUE_DATA.total.toLocaleString()}.00
                </p>

                {/* Revenue Categories */}
                <div className="space-y-4">
                  {REVENUE_DATA.categories.map((cat, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-800">{cat.label}</span>
                          {cat.change && (
                            <span className="text-xs text-green-600 font-medium">{cat.change}</span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          ₦{cat.amount.toLocaleString()}.00
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cat.color} rounded-full`}
                          style={{ width: `${cat.widthPct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 Customers */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Top 5 Customers by Revenue</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3">Customer</th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-3">Revenue</th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-3">% of Total</th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-3">Transactions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REVENUE_DATA.topCustomers.map((c, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-b-0">
                          <td className="py-3 text-sm font-medium text-gray-900">{c.name}</td>
                          <td className="py-3 text-sm text-gray-700 text-right">₦{c.revenue.toLocaleString()}.00</td>
                          <td className="py-3 text-sm text-gray-500 text-right">{c.percentage}%</td>
                          <td className="py-3 text-sm text-gray-500 text-right">{c.transactions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Revenue Streams */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Top Revenue Streams</h3>
                <div className="grid grid-cols-2 gap-4">
                  {REVENUE_DATA.topStreams.map((s, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                      <p className="text-xl font-bold text-gray-900">₦{s.amount.toLocaleString()}.00</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── EXPENSE INTELLIGENCE ── */}
          {activeTab === 'expenseIntelligence' && (
            <div>
              <TaxGptAlert text={EXPENSE_DATA.alert} />

              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                {/* Total */}
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">TOTAL EXPENSES</p>
                <p className="text-3xl font-bold text-gray-900 mb-6">
                  ₦{EXPENSE_DATA.total.toLocaleString()}.00
                </p>

                {/* Expense categories */}
                <div className="space-y-5">
                  {EXPENSE_DATA.categories.map((cat, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-sm ${cat.color}`} />
                          <span className="text-sm font-medium text-gray-800">
                            {cat.label}
                            {cat.warn && (
                              <span className="ml-1.5 text-orange-500">⚠</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-semibold ${cat.change > 20 ? 'text-red-600' : 'text-green-600'}`}>
                            {cat.change === 0 ? '+0%' : `+${cat.change}%`}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 w-32 text-right">
                            ₦{cat.amount.toLocaleString()}.00
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${cat.color} rounded-full`}
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">{cat.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6-Month Trend */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-6">6-Month Expense Trend</h3>
                <div className="flex items-end justify-between gap-3 h-40">
                  {EXPENSE_DATA.monthlyTrend.map((m, i) => {
                    const heightPct = (m.amount / maxTrendAmount) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">{m.label}</span>
                        <div
                          className="w-full bg-gray-900 rounded-t-sm"
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-xs text-gray-400">{m.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top 5 Vendors */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Top 5 Vendors by Spend</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3">Vendor</th>
                        <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3">Category</th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-3">Amount</th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-3">Transactions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EXPENSE_DATA.topVendors.map((v, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-b-0">
                          <td className="py-3 text-sm font-medium text-gray-900">{v.name}</td>
                          <td className="py-3 text-sm text-gray-400">{v.category}</td>
                          <td className="py-3 text-sm text-gray-700 text-right">₦{v.amount.toLocaleString()}.00</td>
                          <td className="py-3 text-sm text-gray-500 text-right">{v.transactions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FinancialReports;
