import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getClientFromStorage } from '../utils/clientStorage';
import { getProfitLoss, getBalanceSheet } from '../services/financialsApi';

/**
 * FINANCIAL REPORTS PAGE
 *
 * Displays Profit & Loss and Balance Sheet reports
 * Toggleable tabs with period selection
 */
const FinancialReports = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = getClientFromStorage(clientId);

  // State
  const [activeTab, setActiveTab] = useState('profitLoss'); // 'profitLoss' or 'balanceSheet'
  const [period, setPeriod] = useState('lastMonth');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profitLossData, setProfitLossData] = useState(null);
  const [balanceSheetData, setBalanceSheetData] = useState(null);
  const [adjusted, setAdjusted] = useState(false);

  // Fetch financial reports
  useEffect(() => {
    const fetchReports = async () => {
      if (!clientId) return;

      try {
        setIsLoading(true);
        setError(null);

        const currentYear = new Date().getFullYear();

        // Fetch both reports in parallel
        const [plResponse, bsResponse] = await Promise.all([
          getProfitLoss(clientId, currentYear).catch(err => {
            console.error('Error fetching P&L:', err);
            return null;
          }),
          getBalanceSheet(clientId, currentYear).catch(err => {
            console.error('Error fetching balance sheet:', err);
            return null;
          })
        ]);

        if (plResponse && plResponse.status) {
          setProfitLossData(plResponse.data);
        }

        if (bsResponse && bsResponse.status) {
          setBalanceSheetData(bsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching financial reports:', err);
        setError(err.message || 'Failed to load financial reports');
        toast.error('Failed to load financial reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [clientId, period]);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    const absAmount = Math.abs(amount);
    return `${amount < 0 ? '-' : ''}₦${absAmount.toLocaleString()}`;
  };

  // Format percentage
  const formatPercentage = (percentage) => {
    if (!percentage && percentage !== 0) return '';
    return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar clientId={clientId} activePage="financials" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header hideLogo={true} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar clientId={clientId} activePage="financials" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header hideLogo={true} />

        {/* Page Content */}
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
            <p className="text-sm text-gray-500">
              Upload and review invoices, receipts, and financial documents for accurate tax computation
            </p>
          </div>

          {/* Tabs and Period Selector */}
          <div className="flex items-center justify-between mb-6">
            {/* Tab Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('profitLoss')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'profitLoss'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Profit & Loss
              </button>
              <button
                onClick={() => setActiveTab('balanceSheet')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'balanceSheet'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Balance Sheet
              </button>
            </div>

            {/* Period Dropdown */}
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
              >
                <option value="lastMonth">Last Month</option>
                <option value="lastQuarter">Last Quarter</option>
                <option value="lastYear">Last Year</option>
                <option value="yearToDate">Year to Date</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Report Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            {/* Profit & Loss Tab */}
            {activeTab === 'profitLoss' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Profit & Loss</h2>
                  <span className="text-sm text-gray-500">Adjusted</span>
                </div>

                {profitLossData ? (
                  <div className="space-y-6">
                    {/* Revenue */}
                    <div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900">Revenue</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(profitLossData.revenue)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 pl-6">
                        <span className="text-sm text-gray-600">Sales Income</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-900">{formatCurrency(profitLossData.salesIncome)}</span>
                          <span className="text-xs text-green-600 font-medium">{formatPercentage(profitLossData.salesIncomeChange)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost of Sales */}
                    <div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900">Cost of Sales</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(profitLossData.costOfSales)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 pl-6">
                        <span className="text-sm text-gray-600">Cost of Goods Sold</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-900">{formatCurrency(profitLossData.costOfGoodsSold)}</span>
                          <span className="text-xs text-green-600 font-medium">{formatPercentage(profitLossData.cogsChange)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Gross Profit */}
                    <div className="flex items-center justify-between py-3 border-y border-gray-200 bg-gray-50">
                      <span className="font-semibold text-gray-900">Gross Profit</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(profitLossData.grossProfit)}</span>
                    </div>

                    {/* Operating Expenses */}
                    <div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900">Operating Expenses</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{formatCurrency(profitLossData.operatingExpenses)}</span>
                          <span className="text-xs text-green-600 font-medium">{formatPercentage(profitLossData.opexChange)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {profitLossData.expenseBreakdown?.map((expense, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 pl-6">
                            <span className="text-sm text-gray-600">{expense.label}</span>
                            <span className="text-sm text-gray-900">{formatCurrency(expense.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* EBITDA */}
                    <div className="flex items-center justify-between py-3 border-y border-gray-200 bg-gray-50">
                      <span className="font-semibold text-gray-900">EBITDA</span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{formatCurrency(profitLossData.ebitda)}</span>
                        <span className="text-xs text-green-600 font-medium">{formatPercentage(profitLossData.ebitdaChange)}</span>
                      </div>
                    </div>

                    {/* Other Income */}
                    <div className="flex items-center justify-between py-3">
                      <span className="font-medium text-gray-900">Other Income</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900">{formatCurrency(profitLossData.otherIncome)}</span>
                        <span className="text-xs text-green-600 font-medium">{formatPercentage(profitLossData.otherIncomeChange)}</span>
                      </div>
                    </div>

                    {/* Net Profit Before Tax */}
                    <div className="flex items-center justify-between py-3 border-y border-gray-200">
                      <span className="font-medium text-gray-900">Net Profit Before Tax</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900">{formatCurrency(profitLossData.netProfitBeforeTax)}</span>
                        <span className="text-xs text-green-600 font-medium">{formatPercentage(profitLossData.npbtChange)}</span>
                      </div>
                    </div>

                    {/* Income Tax Expense */}
                    <div className="flex items-center justify-between py-3">
                      <span className="font-medium text-gray-900">Income Tax Expense</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900">{formatCurrency(profitLossData.incomeTaxExpense)}</span>
                        <span className="text-xs text-green-600 font-medium">{formatPercentage(profitLossData.taxChange)}</span>
                      </div>
                    </div>

                    {/* Net Profit After Tax */}
                    <div className="flex items-center justify-between py-4 border-t-2 border-gray-300 bg-teal-50">
                      <span className="font-bold text-gray-900">Net Profit After Tax</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">{formatCurrency(profitLossData.netProfitAfterTax)}</span>
                        <span className="text-xs text-green-600 font-medium">{formatPercentage(profitLossData.npatChange)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">No profit & loss data available</p>
                  </div>
                )}
              </div>
            )}

            {/* Balance Sheet Tab */}
            {activeTab === 'balanceSheet' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Balance Sheet</h2>
                </div>

                {balanceSheetData ? (
                  <div className="space-y-8">
                    {/* ASSETS */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">ASSETS</h3>

                      {/* Current Assets */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="font-semibold text-gray-900">Current Assets</span>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">{formatCurrency(balanceSheetData.currentAssets)}</span>
                            <span className="text-xs text-green-600 font-medium">{formatPercentage(balanceSheetData.currentAssetsChange)}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {balanceSheetData.currentAssetsBreakdown?.map((asset, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 pl-6">
                              <span className="text-sm text-gray-600">{asset.label}</span>
                              <span className="text-sm text-gray-900">{formatCurrency(asset.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fixed Assets */}
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900">Fixed Assets</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{formatCurrency(balanceSheetData.fixedAssets)}</span>
                          <span className="text-xs text-red-600 font-medium">{formatPercentage(balanceSheetData.fixedAssetsChange)}</span>
                        </div>
                      </div>

                      {/* Total Assets */}
                      <div className="flex items-center justify-between py-4 border-y-2 border-gray-300 bg-gray-50 mt-4">
                        <span className="font-bold text-gray-900">Total Assets</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">{formatCurrency(balanceSheetData.totalAssets)}</span>
                          <span className="text-xs text-green-600 font-medium">{formatPercentage(balanceSheetData.totalAssetsChange)}</span>
                        </div>
                      </div>
                    </div>

                    {/* LIABILITIES */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">LIABILITIES</h3>

                      {/* Current Liabilities */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="font-semibold text-gray-900">Current Liabilities</span>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">{formatCurrency(balanceSheetData.currentLiabilities)}</span>
                            <span className="text-xs text-green-600 font-medium">{formatPercentage(balanceSheetData.currentLiabilitiesChange)}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {balanceSheetData.currentLiabilitiesBreakdown?.map((liability, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 pl-6">
                              <span className="text-sm text-gray-600">{liability.label}</span>
                              <span className="text-sm text-gray-900">{formatCurrency(liability.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Long-term Liabilities */}
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-900">Long-term Liabilities</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{formatCurrency(balanceSheetData.longTermLiabilities)}</span>
                          <span className="text-xs text-red-600 font-medium">{formatPercentage(balanceSheetData.longTermLiabilitiesChange)}</span>
                        </div>
                      </div>

                      {/* Total Liabilities */}
                      <div className="flex items-center justify-between py-4 border-y-2 border-gray-300 bg-gray-50 mt-4">
                        <span className="font-bold text-gray-900">Total Liabilities</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">{formatCurrency(balanceSheetData.totalLiabilities)}</span>
                          <span className="text-xs text-green-600 font-medium">{formatPercentage(balanceSheetData.totalLiabilitiesChange)}</span>
                        </div>
                      </div>
                    </div>

                    {/* EQUITY */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">EQUITY</h3>

                      <div className="space-y-3">
                        {/* Share Capital */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="font-medium text-gray-900">Share Capital</span>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-900">{formatCurrency(balanceSheetData.shareCapital)}</span>
                            <span className="text-xs text-gray-600 font-medium">{formatPercentage(balanceSheetData.shareCapitalChange)}</span>
                          </div>
                        </div>

                        {/* Retained Earnings */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="font-medium text-gray-900">Retained Earnings</span>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-900">{formatCurrency(balanceSheetData.retainedEarnings)}</span>
                            <span className="text-xs text-green-600 font-medium">{formatPercentage(balanceSheetData.retainedEarningsChange)}</span>
                          </div>
                        </div>

                        {/* Total Equity */}
                        <div className="flex items-center justify-between py-4 border-t-2 border-gray-300 bg-teal-50">
                          <span className="font-bold text-gray-900">Total Equity</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">{formatCurrency(balanceSheetData.totalEquity)}</span>
                            <span className="text-xs text-green-600 font-medium">{formatPercentage(balanceSheetData.totalEquityChange)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">No balance sheet data available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinancialReports;
