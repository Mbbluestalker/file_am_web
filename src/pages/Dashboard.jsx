import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { LoadingSpinner } from '../components/common';
import MetricCard from '../components/dashboard/MetricCard';
import ActivityItem from '../components/dashboard/ActivityItem';
import { getGlobalDashboard } from '../services/dashboardApi';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return `₦${amount.toLocaleString()}`;
  };

  const fallbackMetrics = [
    { iconType: 'users', title: 'Total Clients', value: '0', trend: { type: 'neutral', text: '—' }, bgColor: 'bg-gray-50' },
    { iconType: 'calendar', title: 'Tax Due This Month', value: '₦0', trend: { type: 'neutral', text: '—' }, bgColor: 'bg-blue-50' },
    { iconType: 'savings', title: 'Potential Tax Savings (YTD)', value: '₦0', trend: { type: 'neutral', text: '—' }, bgColor: 'bg-gray-50' },
    { iconType: 'shield', title: 'Compliance Risk Alerts', value: '0', trend: { type: 'positive', text: '—' }, bgColor: 'bg-gray-50' },
  ];

  const metrics = dashboardData ? [
    {
      iconType: 'users', title: 'Total Clients',
      value: dashboardData.totalClients?.value?.toString() || '0',
      trend: dashboardData.totalClients?.thisWeek
        ? { type: dashboardData.totalClients.thisWeek > 0 ? 'positive' : 'neutral', text: dashboardData.totalClients.thisWeek > 0 ? `+${dashboardData.totalClients.thisWeek} this week` : 'No new clients this week' }
        : { type: 'neutral', text: 'Total active clients' },
      bgColor: 'bg-gray-50',
    },
    {
      iconType: 'calendar', title: 'Tax Due This Month',
      value: formatCurrency(dashboardData.taxDueThisMonth?.value),
      trend: dashboardData.taxDueThisMonth?.thisWeek
        ? { type: 'neutral', text: dashboardData.taxDueThisMonth.thisWeek > 0 ? `${formatCurrency(dashboardData.taxDueThisMonth.thisWeek)} this week` : 'No new obligations this week' }
        : { type: 'neutral', text: 'Current month' },
      bgColor: 'bg-blue-50',
    },
    {
      iconType: 'savings', title: 'Potential Tax Savings (YTD)',
      value: formatCurrency(dashboardData.potentialTaxSavings?.value),
      trend: dashboardData.potentialTaxSavings?.thisWeek
        ? { type: dashboardData.potentialTaxSavings.thisWeek > 0 ? 'positive' : 'neutral', text: dashboardData.potentialTaxSavings.thisWeek > 0 ? `+${formatCurrency(dashboardData.potentialTaxSavings.thisWeek)} this week` : 'No change this week' }
        : { type: 'positive', text: 'Year to date' },
      bgColor: 'bg-gray-50',
    },
    {
      iconType: 'shield', title: 'Compliance Risk Alerts',
      value: dashboardData.complianceRiskAlert?.message?.match(/\d+/)?.[0] || '0',
      trend: dashboardData.complianceRiskAlert?.level
        ? { type: dashboardData.complianceRiskAlert.level === 'high' ? 'negative' : dashboardData.complianceRiskAlert.level === 'medium' ? 'neutral' : 'positive', text: `${dashboardData.complianceRiskAlert.level.toUpperCase()} risk level` }
        : { type: 'positive', text: 'All systems normal' },
      bgColor: 'bg-gray-50',
    },
  ] : fallbackMetrics;

  const activities = dashboardData?.recentActivities
    ? dashboardData.recentActivities.map((a) => ({
        iconType: 'document',
        company: a.clientName,
        action: a.activity,
        timestamp: a.hoursAgo ? `${a.hoursAgo} ${a.hoursAgo === 1 ? 'hour' : 'hours'} ago` : new Date(a.timestamp).toLocaleString(),
      }))
    : [];

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <Header />
        <LoadingSpinner fullHeight message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto !px-8 !py-10">
          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-yellow-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">Unable to load live dashboard data</p>
                  <p className="text-xs text-yellow-700 mt-1">Showing cached data. {error}</p>
                </div>
                <button onClick={() => window.location.reload()} className="text-xs font-medium text-yellow-700 hover:text-yellow-800 underline">Retry</button>
              </div>
            </div>
          )}

          <section className="!mb-12">
            <h2 className="text-2xl font-bold text-gray-900 !mb-6">Key Metrics and Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 !gap-5">
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 !mb-6">Recent Activity</h2>
            <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-200">
              {activities.length > 0 ? activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              )) : (
                <div className="py-12 text-center text-sm text-gray-400">No recent activity</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
