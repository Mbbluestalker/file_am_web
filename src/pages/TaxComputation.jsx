import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PageShell, LoadingSpinner } from '../components/common';
import ClientHeader from '../components/client/ClientHeader';
import VatStatusBanner from '../components/tax/VatStatusBanner';
import TurnoverBarChart from '../components/tax/TurnoverBarChart';
import { getClientFromStorage } from '../utils/clientStorage';
import {
  getVatComputationStatus,
  getVatComputationResults,
  getThresholdStatus,
  getTaxComputationChart,
  calculateVat,
} from '../services/taxApi';

const formatCurrency = (amount) => {
  if (amount == null) return '—';
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
  return `₦${amount.toLocaleString()}`;
};

const bannerStyles = (status) => {
  if (status === 'approaching') {
    return { color: 'bg-yellow-900', badge: 'Approaching VAT Threshold', badgeColor: 'bg-orange-100 text-orange-700' };
  }
  if (status === 'above') {
    return { color: 'bg-red-900', badge: 'Above VAT Threshold', badgeColor: 'bg-red-100 text-red-700' };
  }
  return { color: 'bg-green-900', badge: 'Below VAT Threshold', badgeColor: 'bg-green-100 text-green-700' };
};

const TaxComputation = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const storedClient = getClientFromStorage(clientId);

  const [loading, setLoading] = useState(true);
  const [hasVatData, setHasVatData] = useState(false);
  const [thresholdStatus, setThresholdStatus] = useState(null);
  const [computationResults, setComputationResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [computing, setComputing] = useState(false);

  const fetchTaxData = async () => {
    try {
      setLoading(true);
      const [statusRes, thresholdRes, chartRes] = await Promise.allSettled([
        getVatComputationStatus(clientId),
        getThresholdStatus(clientId),
        getTaxComputationChart(clientId),
      ]);

      const vatDataExists = statusRes.status === 'fulfilled' && statusRes.value?.data?.hasVatData === true;
      setHasVatData(vatDataExists);
      setThresholdStatus(thresholdRes.status === 'fulfilled' ? thresholdRes.value?.data || null : null);
      setChartData(chartRes.status === 'fulfilled' ? chartRes.value?.data || null : null);

      if (vatDataExists) {
        try {
          const resultsRes = await getVatComputationResults(clientId);
          setComputationResults(resultsRes?.data || null);
        } catch (err) {
          console.error('Computation results error:', err);
        }
      }
    } catch (error) {
      console.error('Tax computation error:', error);
      toast.error('Failed to load tax computation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!clientId) return;
    fetchTaxData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const handleComputeVat = async () => {
    try {
      setComputing(true);
      const now = new Date();
      // Compute for the previous complete calendar month
      const periodDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const year = periodDate.getFullYear();
      const month = periodDate.getMonth();
      const vatPeriod = `${year}-${String(month + 1).padStart(2, '0')}`;
      const startDate = `${vatPeriod}-01`;
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const res = await calculateVat(clientId, {
        vatType: 'standard',
        vatPeriod,
        startDate,
        endDate,
      });

      if (res?.status) {
        toast.success('VAT computed');
        await fetchTaxData();
      } else {
        toast.error(res?.message || 'Failed to compute VAT');
      }
    } catch (err) {
      console.error('VAT compute error:', err);
      toast.error(err?.message || 'Failed to compute VAT');
    } finally {
      setComputing(false);
    }
  };

  if (loading) {
    return <PageShell clientId={clientId}><LoadingSpinner fullHeight message="Loading tax computation data..." /></PageShell>;
  }

  // Show "Not found" only when we have literally nothing to render
  if (!storedClient && !thresholdStatus && !chartData) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Client Not Found</h1>
          <p className="text-gray-500">The client you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const status = thresholdStatus?.status || 'below';
  const turnoverData = chartData?.chartSet || [];
  const totalTurnover = chartData?.totalTurnOver ?? null;
  const vatThreshold = thresholdStatus?.turnoverThreshold ?? null;
  const thresholdPercentage = totalTurnover != null && vatThreshold
    ? ((totalTurnover / vatThreshold) * 100).toFixed(1)
    : 0;

  const styles = bannerStyles(status);
  const banner = {
    ...styles,
    title: chartData?.status || thresholdStatus?.message || '—',
    description: chartData?.turnoverStatement || thresholdStatus?.message || '',
  };

  const needsComputation = (status === 'above' || status === 'approaching') && !hasVatData;

  return (
    <PageShell clientId={clientId} bgColor="bg-white">
      <div className="px-10 py-8">
        <ClientHeader
          name={storedClient?.name || chartData?.businessName || '—'}
          logo={storedClient?.logo}
          vatRequired={status === 'above'}
        />

        <VatStatusBanner
          {...banner}
          onViewBreakdown={() => navigate(`/clients/${clientId}/tax-computation/breakdown`)}
        />

        {turnoverData.length > 0 && (
          <TurnoverBarChart
            data={turnoverData}
            totalTurnover={totalTurnover ?? 0}
            thresholdPercentage={thresholdPercentage}
            formatCurrency={formatCurrency}
            computationResults={computationResults}
          />
        )}

        {/* VAT computation CTA — only when above/approaching threshold and no VAT computed yet */}
        {needsComputation && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-amber-900 mb-1">VAT calculation not yet run</h3>
              <p className="text-xs text-amber-700">
                This business is at or above the VAT threshold. Run a VAT computation for the most recent completed month.
              </p>
            </div>
            <button
              onClick={handleComputeVat}
              disabled={computing}
              className="shrink-0 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {computing ? 'Computing…' : 'Compute VAT'}
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default TaxComputation;
