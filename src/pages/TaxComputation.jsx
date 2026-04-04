import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PageShell, LoadingSpinner } from '../components/common';
import ClientHeader from '../components/client/ClientHeader';
import VatStatusBanner from '../components/tax/VatStatusBanner';
import TurnoverBarChart from '../components/tax/TurnoverBarChart';
import { getClientFromStorage } from '../utils/clientStorage';
import { getVatComputationStatus, getVatComputationResults, getThresholdStatus, getTaxComputationChart } from '../services/taxApi';

const TaxComputation = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = getClientFromStorage(clientId);

  const [loading, setLoading] = useState(true);
  const [hasVatData, setHasVatData] = useState(false);
  const [thresholdStatus, setThresholdStatus] = useState(null);
  const [computationResults, setComputationResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!clientId) return;
    const fetchTaxData = async () => {
      try {
        setLoading(true);
        const statusResponse = await getVatComputationStatus(clientId);
        const vatDataExists = statusResponse?.data?.hasVatData || false;
        setHasVatData(vatDataExists);

        const thresholdRes = await getThresholdStatus(clientId);
        setThresholdStatus(thresholdRes?.data || null);

        try {
          const chartRes = await getTaxComputationChart(clientId);
          setChartData(chartRes?.data || null);
        } catch (err) { console.error('Chart data error:', err); }

        if (vatDataExists) {
          try {
            const resultsRes = await getVatComputationResults(clientId);
            setComputationResults(resultsRes?.data || null);
          } catch (err) { console.error('Computation results error:', err); }
        }
      } catch (error) {
        console.error('Tax computation error:', error);
        toast.error('Failed to load tax computation data');
      } finally {
        setLoading(false);
      }
    };
    fetchTaxData();
  }, [clientId, currentYear]);

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

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    return `₦${(amount / 1000).toFixed(0)}K`;
  };

  const turnoverData = chartData?.chartSet || [];
  const totalTurnover = chartData?.totalTurnOver || 0;
  const vatThreshold = thresholdStatus?.turnoverThreshold || 25000000;
  const thresholdPercentage = totalTurnover > 0 ? ((totalTurnover / vatThreshold) * 100).toFixed(1) : 0;

  const getStatusBanner = () => {
    const status = thresholdStatus?.status || 'below';
    if (status === 'below') return { color: 'bg-green-900', badge: 'Below VAT Threshold', badgeColor: 'bg-green-100 text-green-700', title: 'This business is not required to charge for VAT', description: thresholdStatus?.message || `The monthly VAT liability is below the ${formatCurrency(vatThreshold)} threshold.` };
    if (status === 'approaching') return { color: 'bg-yellow-900', badge: 'Approaching VAT Threshold', badgeColor: 'bg-orange-100 text-orange-700', title: 'VAT fulfilment may be required soon', description: thresholdStatus?.message || `The monthly VAT liability is approaching the ${formatCurrency(vatThreshold)} threshold.` };
    return { color: 'bg-red-900', badge: 'Above VAT Threshold', badgeColor: 'bg-red-100 text-red-700', title: 'VAT fulfilment is required', description: thresholdStatus?.message || `The monthly VAT liability has exceeded the ${formatCurrency(vatThreshold)} threshold.` };
  };

  const renderEmptyState = (title, desc, extra) => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-32 h-32 mb-8">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <rect x="40" y="80" width="30" height="60" rx="2" fill="#D1D5DB" />
          <rect x="75" y="60" width="30" height="80" rx="2" fill="#9CA3AF" />
          <rect x="110" y="50" width="30" height="90" rx="2" fill="#6B7280" />
          <circle cx="150" cy="80" r="35" stroke="#D1D5DB" strokeWidth="8" fill="none" strokeDasharray="60 160" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 mb-8 max-w-md text-center">{desc}</p>
      {extra}
    </div>
  );

  if (loading) return <PageShell clientId={clientId}><LoadingSpinner fullHeight message="Loading tax computation data..." /></PageShell>;

  const hasChart = chartData?.chartSet?.length > 0;
  const banner = getStatusBanner();

  return (
    <PageShell clientId={clientId} bgColor="bg-white">
      <div className="px-10 py-8">
        {hasChart ? (
          <>
            <ClientHeader name={client.name} logo={client.logo} vatRequired={client.vatRequired} />
            <VatStatusBanner {...banner} onViewBreakdown={() => navigate(`/clients/${clientId}/tax-computation/breakdown`)} />
            <TurnoverBarChart
              data={turnoverData}
              totalTurnover={totalTurnover}
              thresholdPercentage={thresholdPercentage}
              formatCurrency={formatCurrency}
              computationResults={computationResults}
            />
          </>
        ) : !hasVatData ? (
          renderEmptyState(
            'VAT Status Not Determined',
            'To determine whether this business should charge and remit VAT, we need some basic information.',
            <div className="flex gap-4 flex-wrap justify-center">
              <button onClick={() => navigate(`/clients/${clientId}/business-profile`)} className="flex items-center gap-2 px-6 py-3 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors">
                Complete Business Profile
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors">
                Upload Invoices
              </button>
            </div>
          )
        ) : (
          renderEmptyState(
            'Below VAT Threshold',
            thresholdStatus?.message || 'This business\'s monthly VAT liability is currently below the threshold.',
            <>
              <p className="text-gray-900 font-bold text-xl mb-2">{formatCurrency(vatThreshold)}</p>
              <p className="text-gray-600 text-center text-sm">We will monitor the turnover and alert you if VAT registration becomes necessary.</p>
            </>
          )
        )}
      </div>
    </PageShell>
  );
};

export default TaxComputation;
