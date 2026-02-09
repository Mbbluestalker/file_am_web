import Header from '../components/layout/Header';
import MetricCard from '../components/dashboard/MetricCard';
import ActivityItem from '../components/dashboard/ActivityItem';

/**
 * DASHBOARD PAGE
 *
 * Main dashboard page displaying key metrics and recent activity
 */
const Dashboard = () => {
  // Key metrics data
  const metrics = [
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

  // Recent activity data
  const activities = [
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

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto !px-8 !py-10">
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
