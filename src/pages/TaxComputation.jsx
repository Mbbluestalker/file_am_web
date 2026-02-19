import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import ClientHeader from '../components/client/ClientHeader';
import { getClientById } from '../data/clientsData';

/**
 * TAX COMPUTATION PAGE
 *
 * Displays VAT status and rolling 12-month turnover analysis
 */
const TaxComputation = () => {
  const { clientId } = useParams();
  const client = getClientById(clientId);

  // Get VAT status from client data
  const vatStatus = client?.taxComputationStatus || 'not-determined';

  // Sample turnover data for charts - distribute annual turnover across months
  const generateTurnoverData = (annualTurnover) => {
    if (!annualTurnover) return [];

    // Generate realistic monthly distribution
    const baseMonthly = annualTurnover / 12;
    const variations = [0.9, 0.95, 1.1, 1.3, 1.4, 0.6, 0.65, 1.1, 1.35, 0.3, 0.45, 1.2];

    return [
      { month: 'Jan', amount: Math.round(baseMonthly * variations[0]) },
      { month: 'Feb', amount: Math.round(baseMonthly * variations[1]) },
      { month: 'Mar', amount: Math.round(baseMonthly * variations[2]) },
      { month: 'Apr', amount: Math.round(baseMonthly * variations[3]) },
      { month: 'May', amount: Math.round(baseMonthly * variations[4]) },
      { month: 'June', amount: Math.round(baseMonthly * variations[5]) },
      { month: 'July', amount: Math.round(baseMonthly * variations[6]) },
      { month: 'Aug', amount: Math.round(baseMonthly * variations[7]) },
      { month: 'Sep', amount: Math.round(baseMonthly * variations[8]) },
      { month: 'Oct', amount: Math.round(baseMonthly * variations[9]) },
      { month: 'Nov', amount: Math.round(baseMonthly * variations[10]) },
      { month: 'Dec', amount: Math.round(baseMonthly * variations[11]) },
    ];
  };

  const turnoverData = generateTurnoverData(client?.annualTurnover);
  const totalTurnover = client?.annualTurnover || 0;
  const vatThreshold = 100000000; // N100M
  const thresholdPercentage = ((totalTurnover / vatThreshold) * 100).toFixed(1);

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

  // Render empty state: No filing yet
  const renderNoFiling = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-32 h-32 mb-8">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <rect x="50" y="60" width="100" height="80" rx="4" fill="#E5E7EB" />
          <rect x="60" y="50" width="80" height="90" rx="4" fill="#D1D5DB" />
          <rect x="70" y="70" width="20" height="3" fill="#9CA3AF" />
          <rect x="70" y="80" width="30" height="3" fill="#9CA3AF" />
          <rect x="70" y="90" width="25" height="3" fill="#9CA3AF" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">VAT Eligible — No Filing Yet</h2>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        VAT has been calculated for this period, but no filing has been completed yet.
      </p>
      <div className="flex gap-4">
        <button className="px-6 py-3 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors">
          Start VAT Filing
        </button>
        <button className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
          View VAT Computation
        </button>
      </div>
    </div>
  );

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
        <button className="flex items-center gap-2 px-6 py-3 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors">
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
        <button className="flex items-center gap-2 px-6 py-3 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Contract Information
        </button>
      </div>
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
        This business's turnover in the last 12 months is below
      </p>
      <p className="text-gray-900 font-bold text-xl mb-2">₦25,000,000.</p>
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
              const heightPercentage = (data.amount / maxAmount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center mb-2" style={{ height: '200px' }}>
                    <div
                      className="w-full bg-blue-900 rounded-t transition-all hover:bg-blue-800"
                      style={{ height: `${heightPercentage}%` }}
                      title={`${data.month}: ${formatCurrency(data.amount)}`}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              );
            })}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-12 w-10 text-right">
            <span>1.2M</span>
            <span>800K</span>
            <span>600K</span>
            <span>400K</span>
            <span>200K</span>
            <span>0</span>
          </div>
        </div>
      </div>
    );
  };

  // Get status banner config
  const getStatusBanner = () => {
    if (thresholdPercentage < 80) {
      return {
        color: 'bg-green-900',
        badge: 'Below VAT Threshold',
        badgeColor: 'bg-green-100 text-green-700',
        title: 'This business is not required to charge for VAT',
        description: `The rolling 12-month turnover is below the ₦${(vatThreshold / 1000000).toFixed(0)}M threshold. You are not currently obligated to charge for Value Added Tax.`,
      };
    } else if (thresholdPercentage < 100) {
      return {
        color: 'bg-yellow-900',
        badge: 'Approaching VAT Threshold',
        badgeColor: 'bg-orange-100 text-orange-700',
        title: 'VAT fulfilment may be required soon',
        description: `The total turnover in the last 12 months is ₦${formatCurrency(totalTurnover)}, which is approaching the ₦${(vatThreshold / 1000000).toFixed(0)}M threshold. VAT fulfilment may be required soon`,
      };
    } else {
      return {
        color: 'bg-red-900',
        badge: 'Above VAT Threshold',
        badgeColor: 'bg-red-100 text-red-700',
        title: 'VAT fulfilment is required',
        description: `The rolling 12-month turnover has exceeded the ₦${(vatThreshold / 1000000).toFixed(0)}M threshold.`,
      };
    }
  };

  const statusBanner = getStatusBanner();

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
          {/* Render based on VAT status */}
          {vatStatus === 'no-filing' && renderNoFiling()}
          {vatStatus === 'not-determined' && renderNotDetermined()}
          {vatStatus === 'below-threshold' && renderBelowThreshold()}

          {/* Below threshold with chart, Approaching, or Above */}
          {(vatStatus === 'below-with-chart' || vatStatus === 'approaching' || vatStatus === 'above') && (
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
                <p className="text-white text-sm leading-relaxed">{statusBanner.description}</p>
              </div>

              {/* Turnover Chart */}
              {renderTurnoverChart()}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TaxComputation;
