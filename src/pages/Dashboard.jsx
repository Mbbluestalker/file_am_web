import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import MetricCard from '../components/dashboard/MetricCard';
import ActivityItem from '../components/dashboard/ActivityItem';
import { getGlobalDashboard } from '../services/dashboardApi';

/**
 * DASHBOARD PAGE
 *
 * Main dashboard page displaying key metrics and recent activity
 */
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getGlobalDashboard();

        if (response.status && response.data) {
          setDashboardData(response.data);
        } else {
          throw new Error('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Failed to load dashboard');
        // Use fallback mock data on error
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Fallback metrics data (used when API fails or is loading)
  const fallbackMetrics = [
    {
      iconType: 'users',
      title: 'Total Clients',
      value: '132',
      trend: { type: 'positive', text: '+3 this month' },
      bgColor: 'bg-gray-50',
    },
    {
      iconType: 'calendar',
      title: 'Tax Due This Month',
      value: '₦24.8M',
      trend: { type: 'neutral', text: 'Across 18 clients' },
      bgColor: 'bg-blue-50',
    },
    {
      iconType: 'savings',
      title: 'Potential Tax Savings (YTD)',
      value: '₦8.2M',
      trend: { type: 'positive', text: '+₦1.4M' },
      bgColor: 'bg-gray-50',
    },
    {
      iconType: 'shield',
      title: 'Compliance Risk Alerts',
      value: '5',
      trend: { type: 'negative', text: '-2 from last week' },
      bgColor: 'bg-gray-50',
    },
  ];

  // Fallback activities data
  const fallbackActivities = [
    {
      iconType: 'document',
      company: 'Blossom Foods Ltd.',
      action: 'Reviewed tax computation',
      timestamp: '2 hours ago',
    },
    {
      iconType: 'check',
      company: 'TechHub Nigeria',
      action: 'CIT filing completed',
      timestamp: '5 hours ago',
    },
    {
      iconType: 'message',
      company: 'Capital Allowance Query',
      action: 'Greenfield Logistics equipment purchase',
      timestamp: 'Yesterday',
    },
    {
      iconType: 'document',
      company: 'Urban Properties Ltd.',
      action: 'Updated business profile',
      timestamp: 'Yesterday',
    },
    {
      iconType: 'check',
      company: 'Apex Manufacturing',
      action: 'VAT return filed',
      timestamp: '2 days ago',
    },
  ];

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return `₦${amount.toLocaleString()}`;
  };

  // Map API data to component format
  const metrics = dashboardData ? [
    {
      iconType: 'users',
      title: 'Total Clients',
      value: dashboardData.totalClients?.value?.toString() || '0',
      trend: dashboardData.totalClients?.thisWeek
        ? {
            type: dashboardData.totalClients.thisWeek > 0 ? 'positive' : 'neutral',
            text: dashboardData.totalClients.thisWeek > 0
              ? `+${dashboardData.totalClients.thisWeek} this week`
              : 'No new clients this week'
          }
        : { type: 'neutral', text: 'Total active clients' },
      bgColor: 'bg-gray-50',
    },
    {
      iconType: 'calendar',
      title: 'Tax Due This Month',
      value: formatCurrency(dashboardData.taxDueThisMonth?.value),
      trend: dashboardData.taxDueThisMonth?.thisWeek
        ? {
            type: 'neutral',
            text: dashboardData.taxDueThisMonth.thisWeek > 0
              ? `${formatCurrency(dashboardData.taxDueThisMonth.thisWeek)} this week`
              : 'No new obligations this week'
          }
        : { type: 'neutral', text: 'Current month' },
      bgColor: 'bg-blue-50',
    },
    {
      iconType: 'savings',
      title: 'Potential Tax Savings (YTD)',
      value: formatCurrency(dashboardData.potentialTaxSavings?.value),
      trend: dashboardData.potentialTaxSavings?.thisWeek
        ? {
            type: dashboardData.potentialTaxSavings.thisWeek > 0 ? 'positive' : 'neutral',
            text: dashboardData.potentialTaxSavings.thisWeek > 0
              ? `+${formatCurrency(dashboardData.potentialTaxSavings.thisWeek)} this week`
              : 'No change this week'
          }
        : { type: 'positive', text: 'Year to date' },
      bgColor: 'bg-gray-50',
    },
    {
      iconType: 'shield',
      title: 'Compliance Risk Alerts',
      value: dashboardData.complianceRiskAlert?.message
        ? dashboardData.complianceRiskAlert.message.match(/\d+/)?.[0] || '0'
        : '0',
      trend: dashboardData.complianceRiskAlert?.level
        ? {
            type: dashboardData.complianceRiskAlert.level === 'high' ? 'negative' :
                  dashboardData.complianceRiskAlert.level === 'medium' ? 'neutral' : 'positive',
            text: `${dashboardData.complianceRiskAlert.level.toUpperCase()} risk level`
          }
        : { type: 'positive', text: 'All systems normal' },
      bgColor: 'bg-gray-50',
    },
  ] : fallbackMetrics;

  // Map API activities to component format
  const activities = dashboardData?.recentActivities
    ? dashboardData.recentActivities.map(activity => ({
        iconType: 'document', // Default icon, could be dynamic based on activity type
        company: activity.clientName,
        action: activity.activity,
        timestamp: activity.hoursAgo
          ? `${activity.hoursAgo} ${activity.hoursAgo === 1 ? 'hour' : 'hours'} ago`
          : new Date(activity.timestamp).toLocaleString(),
      }))
    : fallbackActivities;

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto !px-8 !py-10">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">Unable to load live dashboard data</p>
                <p className="text-xs text-yellow-700 mt-1">Showing cached data. {error}</p>
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
        {/* Key Metrics Section */}
        <section className="!mb-12">
          <h2 className="text-2xl font-bold text-gray-900 !mb-6">
            Key Metrics and Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 !gap-5">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 !mb-6">Recent Activity</h2>
          <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-200">
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
