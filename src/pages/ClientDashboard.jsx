import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import ClientHeader from '../components/client/ClientHeader';
import MetricCard from '../components/dashboard/MetricCard';
import TaxObligationRow from '../components/client/TaxObligationRow';
import TaxBreakdownChart from '../components/client/TaxBreakdownChart';
import { getClientById } from '../data/clientsData';

/**
 * CLIENT DASHBOARD PAGE
 *
 * Individual client dashboard with tax obligations and metrics
 */
const ClientDashboard = () => {
  const { clientId } = useParams();

  // Get client data from shared data source
  const client = getClientById(clientId);

  // Handle client not found
  if (!client) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 !mb-2">Client Not Found</h1>
          <p className="text-gray-500">The client you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Key metrics
  const metrics = [
    {
      iconType: 'calendar',
      title: 'Tax Due This Month',
      value: '₦24.8M',
      bgColor: 'bg-blue-50',
    },
    {
      iconType: 'check',
      title: 'Filings Completed',
      value: '8',
      bgColor: 'bg-green-50',
    },
    {
      iconType: 'progress',
      title: 'Filings in Progress',
      value: '3',
      bgColor: 'bg-orange-50',
    },
  ];

  // Tax obligations
  const taxObligations = [
    {
      taxType: 'Companies Income Tax (CIT)',
      description: 'FY 2024 Annual Returns',
      dueDate: 'Feb 28',
      amount: '₦2.0M',
      status: 'Pending',
    },
    {
      taxType: 'Withholding Tax (WHT)',
      description: 'January 2026 Remittance',
      dueDate: 'Feb 21',
      amount: '₦280K',
      status: 'Completed',
    },
    {
      taxType: 'Pay As You Earn (PAYE)',
      description: 'January 2026 Monthly Filing',
      dueDate: 'Feb 10',
      amount: '₦120K',
      status: 'In Progress',
    },
    {
      taxType: 'Pay As You Earn (PAYE)',
      description: 'January 2026 Monthly Filing',
      dueDate: 'Feb 10',
      amount: '₦120K',
      status: 'In Progress',
    },
    {
      taxType: 'Pay As You Earn (PAYE)',
      description: 'January 2026 Monthly Filing',
      dueDate: 'Feb 10',
      amount: '₦120K',
      status: 'In Progress',
    },
  ];

  // Tax breakdown data
  const taxBreakdown = [
    { label: 'CIT', amount: 2400000, color: '#6366f1' }, // Blue
    { label: 'VAT', amount: 600000, color: '#10b981' }, // Green
    { label: 'WHT', amount: 400000, color: '#f97316' }, // Orange
    { label: 'PAYE', amount: 200000, color: '#ec4899' }, // Pink
  ];

  const totalTax = taxBreakdown.reduce((sum, item) => sum + item.amount, 0);

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
