import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import ClientHeader from '../components/client/ClientHeader';
import { getClientFromStorage } from '../utils/clientStorage';
import {
  getVatComputationStatus,
  getVatComputationResults,
  getThresholdStatus,
  getTaxComputationChart,
} from '../services/taxApi';

/**
 * TAX COMPUTATION PAGE
 *
 * Displays VAT status and rolling 12-month turnover analysis
 */
const TaxComputation = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = getClientFromStorage(clientId);

  // State management
  const [loading, setLoading] = useState(true);
  const [hasVatData, setHasVatData] = useState(false);
  const [thresholdStatus, setThresholdStatus] = useState(null);
  const [computationResults, setComputationResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [currentYear] = useState(new Date().getFullYear());

  // Fetch all data on component mount
  useEffect(() => {
    if (!clientId) return;

    const fetchTaxData = async () => {
      try {
        setLoading(true);

        // 1. Check if VAT data exists
        const statusResponse = await getVatComputationStatus(clientId);
        const vatDataExists = statusResponse?.data?.hasVatData || false;
        setHasVatData(vatDataExists);

        // 2. Get threshold status (below, approaching, above)
        const thresholdStatusResponse = await getThresholdStatus(clientId);
        setThresholdStatus(thresholdStatusResponse?.data || null);

        // 3. Get tax computation chart (12-month turnover data)
        try {
          const chartResponse = await getTaxComputationChart(clientId);
          setChartData(chartResponse?.data || null);
        } catch (err) {
          console.error('Error fetching chart data:', err);
        }

        // 4. If VAT data exists, fetch computation results
        if (vatDataExists) {
          try {
            const resultsResponse = await getVatComputationResults(clientId);
            setComputationResults(resultsResponse?.data || null);
          } catch (err) {
            console.error('Error fetching computation results:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching tax computation data:', error);
        toast.error('Failed to load tax computation data');
      } finally {
        setLoading(false);
      }
    };

    fetchTaxData();
  }, [clientId, currentYear]);

  // Handle initiate VAT setup (navigate to business profile)
  const handleInitiateSetup = () => {
    window.location.href = `/clients/${clientId}/business-profile`;
  };

  // Handle client not found
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

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    return `₦${(amount / 1000).toFixed(0)}K`;
  };

  // Prepare turnover data from chart API
  const turnoverData = chartData?.chartSet || [];
  const totalTurnover = chartData?.totalTurnOver || 0;

  // Get threshold amount (default to 25M as per API response)
  const vatThreshold = thresholdStatus?.turnoverThreshold || 25000000;
  const thresholdPercentage = totalTurnover > 0 ? ((totalTurnover / vatThreshold) * 100).toFixed(1) : 0;

  // Render empty state: Status not determined
  const renderNotDetermined = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-32 h-32 mb-8">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <rect x="40" y="80" width="30" height="60" rx="2" fill="#D1D5DB" />
          <rect x="75" y="60" width="30" height="80" rx="2" fill="#9CA3AF" />
          <rect x="110" y="50" width="30" height="90" rx="2" fill="#6B7280" />
          <circle cx="150" cy="80" r="35" stroke="#D1D5DB" strokeWidth="8" fill="none" strokeDasharray="60 160" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">VAT Status Not Determined</h2>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        To determine whether this business should charge and remit VAT, we need some basic information.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={handleInitiateSetup}
          className="flex items-center gap-2 px-6 py-3 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Complete Business Profile
        </button>
        <button className="flex items-center gap-2 px-6 py-3 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Invoices
        </button>
      </div>
      {chartData?.status && (
        <div className="mt-8 max-w-md text-center">
          <p className="text-sm text-gray-500">{chartData.status}</p>
          {chartData.turnoverStatement && (
            <p className="text-sm text-gray-600 mt-2">{chartData.turnoverStatement}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render below threshold (simple)
  const renderBelowThreshold = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-32 h-32 mb-8">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <rect x="40" y="80" width="30" height="60" rx="2" fill="#D1D5DB" />
          <rect x="75" y="60" width="30" height="80" rx="2" fill="#9CA3AF" />
          <rect x="110" y="50" width="30" height="90" rx="2" fill="#6B7280" />
          <circle cx="150" cy="80" r="35" stroke="#D1D5DB" strokeWidth="8" fill="none" strokeDasharray="60 160" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Below VAT Threshold</h2>
      <p className="text-gray-600 mb-2 max-w-2xl text-center">
        {thresholdStatus?.message || 'This business\'s monthly VAT liability is currently below the threshold.'}
      </p>
      <p className="text-gray-900 font-bold text-xl mb-2">
        {formatCurrency(vatThreshold)}
      </p>
      <p className="text-gray-600 max-w-2xl text-center">
        VAT registration is not currently required.
      </p>
      <p className="text-gray-600 mt-6 max-w-2xl text-center text-sm">
        We will monitor the turnover and alert you if VAT registration becomes necessary in the future
      </p>
    </div>
  );

  // Render turnover chart
  const renderTurnoverChart = () => {
    if (!turnoverData || turnoverData.length === 0) {
      return null;
    }

    const maxAmount = Math.max(...turnoverData.map((d) => d.amount));

    return (
      <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Rolling 12-Month Turnover</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalTurnover)}</div>
            <div className="text-sm text-gray-500">{thresholdPercentage}% of threshold</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${Math.min(parseFloat(thresholdPercentage), 100)}%` }}
          />
        </div>

        {/* Bar chart */}
        <div className="relative h-64 ml-12">
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {turnoverData.map((data, index) => {
              const heightPercentage = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center mb-2" style={{ height: '200px' }}>
                    <div
                      className="w-full bg-blue-900 rounded-t transition-all hover:bg-blue-800"
                      style={{ height: `${heightPercentage}%` }}
                      title={`${data.label}: ${formatCurrency(data.amount)}`}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.label?.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-12 w-10 text-right">
            <span>{formatCurrency(maxAmount)}</span>
            <span>{formatCurrency(maxAmount * 0.8)}</span>
            <span>{formatCurrency(maxAmount * 0.6)}</span>
            <span>{formatCurrency(maxAmount * 0.4)}</span>
            <span>{formatCurrency(maxAmount * 0.2)}</span>
            <span>0</span>
          </div>
        </div>

        {/* Computation Results */}
        {computationResults && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Latest VAT Computation</h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Sales VAT</p>
                <p className="text-xl font-bold text-gray-900">₦{computationResults.salesVat?.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Purchase VAT</p>
                <p className="text-xl font-bold text-gray-900">₦{computationResults.purchaseVat?.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Net VAT Payable</p>
                <p className="text-xl font-bold text-green-600">₦{computationResults.netVatPayable?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get status banner config
  const getStatusBanner = () => {
    const status = thresholdStatus?.status || 'below';

    if (status === 'below') {
      return {
        color: 'bg-green-900',
        badge: 'Below VAT Threshold',
        badgeColor: 'bg-green-100 text-green-700',
        title: 'This business is not required to charge for VAT',
        description: thresholdStatus?.message || `The monthly VAT liability is below the ₦${formatCurrency(vatThreshold)} threshold. You are not currently obligated to charge for Value Added Tax.`,
      };
    } else if (status === 'approaching') {
      return {
        color: 'bg-yellow-900',
        badge: 'Approaching VAT Threshold',
        badgeColor: 'bg-orange-100 text-orange-700',
        title: 'VAT fulfilment may be required soon',
        description: thresholdStatus?.message || `The monthly VAT liability is approaching the ₦${formatCurrency(vatThreshold)} threshold. VAT fulfilment may be required soon.`,
      };
    } else {
      return {
        color: 'bg-red-900',
        badge: 'Above VAT Threshold',
        badgeColor: 'bg-red-100 text-red-700',
        title: 'VAT fulfilment is required',
        description: thresholdStatus?.message || `The monthly VAT liability has exceeded the ₦${formatCurrency(vatThreshold)} threshold.`,
      };
    }
  };

  const statusBanner = getStatusBanner();

  // Loading state
  if (loading) {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        <Sidebar clientId={clientId} activePage="tax-computation" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header hideLogo={true} />
          <main className="flex-1 px-10 py-8 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tax computation data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar clientId={clientId} activePage="tax-computation" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header hideLogo={true} />

        {/* Page Content */}
        <main className="flex-1 px-10 py-8 overflow-y-auto">
          {/* Render based on chart data availability */}

          {/* If we have chart data, show the chart with status banner */}
          {chartData && chartData.chartSet && chartData.chartSet.length > 0 ? (
            <>
              {/* Client Header */}
              <ClientHeader name={client.name} logo={client.logo} vatRequired={client.vatRequired} />

              {/* Status Banner */}
              <div className={`${statusBanner.color} text-white rounded-xl p-6 mb-8`}>
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-bold">{statusBanner.title}</h2>
                  <span className={`${statusBanner.badgeColor} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {statusBanner.badge}
                  </span>
                </div>
                <p className="text-white text-sm leading-relaxed mb-4">{statusBanner.description}</p>
                <button
                  onClick={() => navigate(`/clients/${clientId}/tax-computation/breakdown`)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  View Computation Breakdown
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Turnover Chart */}
              {renderTurnoverChart()}
            </>
          ) : !hasVatData ? (
            /* If no VAT data, show "Not Determined" state */
            renderNotDetermined()
          ) : (
            /* If has VAT data but no chart data, show "Below Threshold" state */
            renderBelowThreshold()
          )}
        </main>
      </div>
    </div>
  );
};

export default TaxComputation;
