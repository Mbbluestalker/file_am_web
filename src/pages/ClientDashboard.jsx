import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import ClientHeader from '../components/client/ClientHeader';
import MetricCard from '../components/dashboard/MetricCard';
import TaxObligationRow from '../components/client/TaxObligationRow';
import TaxBreakdownChart from '../components/client/TaxBreakdownChart';
import { getClientDashboard } from '../services/clientApi';

/**
 * CLIENT DASHBOARD PAGE
 *
 * Individual client dashboard with tax obligations and metrics
 */
const ClientDashboard = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch client data from localStorage and dashboard data from API
  useEffect(() => {
    const fetchClientDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get client basic info from localStorage
        const storedClients = localStorage.getItem('clientsData');
        if (storedClients) {
          const clients = JSON.parse(storedClients);
          const foundClient = clients.find((c) => c.id === clientId);
          setClient(foundClient || null);
        }

        // Fetch dashboard data from API
        const response = await getClientDashboard(clientId);

        if (response.status && response.data) {
          setDashboardData(response.data);
        } else {
          throw new Error('Failed to load client dashboard data');
        }
      } catch (err) {
        console.error('Client dashboard fetch error:', err);
        setError(err.message || 'Failed to load client dashboard');
        // Continue with fallback data
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDashboard();
  }, [clientId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  // Client not found state
  if (!isLoading && !client) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 !mb-2">Client Not Found</h1>
          <p className="text-gray-500 mb-4">
            The client you're looking for doesn't exist or hasn't been loaded yet.
          </p>
          <button
            onClick={() => window.location.href = '/clients'}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return `₦${amount.toLocaleString()}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Fallback metrics
  const fallbackMetrics = [
    {
      iconType: 'calendar',
      title: 'Tax Due This Month',
      value: '₦0',
      bgColor: 'bg-blue-50',
    },
    {
      iconType: 'check',
      title: 'Filings Completed',
      value: '0',
      bgColor: 'bg-green-50',
    },
    {
      iconType: 'progress',
      title: 'Filings in Progress',
      value: '0',
      bgColor: 'bg-orange-50',
    },
  ];

  // Map API data to metrics
  const metrics = dashboardData ? [
    {
      iconType: 'calendar',
      title: 'Tax Due This Month',
      value: formatCurrency(dashboardData.metricData?.taxDueThisMonth),
      bgColor: 'bg-blue-50',
    },
    {
      iconType: 'check',
      title: 'Filings Completed',
      value: dashboardData.metricData?.filingsCompleted?.toString() || '0',
      bgColor: 'bg-green-50',
    },
    {
      iconType: 'progress',
      title: 'Filings in Progress',
      value: dashboardData.metricData?.filingInProgress?.toString() || '0',
      bgColor: 'bg-orange-50',
    },
  ] : fallbackMetrics;

  // Map API tax obligations
  const taxObligations = dashboardData?.taxObligations || [];

  // Build tax breakdown from taxBreakdownByType
  const taxBreakdown = dashboardData?.taxBreakdownByType ? [
    { label: 'CIT', amount: dashboardData.taxBreakdownByType.CIT || 0, color: '#6366f1' },
    { label: 'VAT', amount: dashboardData.taxBreakdownByType.VAT || 0, color: '#10b981' },
    { label: 'WHT', amount: dashboardData.taxBreakdownByType.WHT || 0, color: '#f97316' },
    { label: 'PAYE', amount: dashboardData.taxBreakdownByType.PAYE || 0, color: '#ec4899' },
  ].filter(item => item.amount > 0) : []; // Only show categories with amounts

  const totalTax = dashboardData?.taxBreakdownByType?.total || taxBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar clientId={clientId} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header hideLogo={true} />

        {/* Page Content */}
        <main className="flex-1 !px-10 !py-8 overflow-y-auto">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">Unable to load live client dashboard data</p>
                  <p className="text-xs text-yellow-700 mt-1">Showing limited data. {error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs font-medium text-yellow-700 hover:text-yellow-800 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Client Header */}
          <ClientHeader
            name={client.name}
            logo={client.logo}
            vatRequired={client.vatRequired}
          />

          {/* Key Metrics */}
          <section className="!mb-10">
            <h2 className="text-xl font-bold text-gray-900 !mb-6">
              Key Metrics and Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 !gap-5">
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
          </section>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 !gap-6">
            {/* Tax Obligations */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="!px-6 !py-5 border-b border-gray-200">
                  <div className="flex items-center !gap-2">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900">Tax Obligations</h3>
                  </div>
                </div>

                {/* Table Header */}
                <div className="flex items-center !gap-6 !py-3 !px-6 bg-gray-50 border-b border-gray-200">
                  <div className="w-5"></div>
                  <div className="flex-1 text-xs font-semibold text-gray-500 uppercase">Tax Type</div>
                  <div className="w-24 text-xs font-semibold text-gray-500 uppercase">Due Date</div>
                  <div className="w-32 text-xs font-semibold text-gray-500 uppercase">Amount</div>
                  <div className="w-32 text-xs font-semibold text-gray-500 uppercase">Status</div>
                </div>

                {/* Table Rows */}
                {taxObligations.map((obligation, index) => (
                  <TaxObligationRow key={index} {...obligation} />
                ))}
              </div>
            </div>

            {/* Tax Breakdown Chart */}
            <div className="lg:col-span-1">
              <TaxBreakdownChart data={taxBreakdown} total={totalTax} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
