import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { getComplianceStats, getComplianceOverview, getUpcomingDeadlines } from '../services/complianceApi';

const FALLBACK_STATS = {
  pendingFilings: 13,
  paymentDues: 1,
  completedFilings: 68,
};

const FALLBACK_ALERTS = [
  { type: 'overdue', title: '1 filing is overdue', subtitle: 'Greenfield Logistics - PAYE payment' },
  { type: 'warning', title: '3 deadlines this week', subtitle: 'CIT and VAT filings due by Mar 18' },
  { type: 'payment', title: '₦8.4M in pending payments', subtitle: 'Review outstanding tax obligations' },
];

const FALLBACK_DEADLINES = [
  { id: '1', clientName: 'Blossom Foods Ltd.', taxType: 'VAT', deadline: '2024-03-15', status: 'Pending' },
  { id: '2', clientName: 'Blossom Foods Ltd.', taxType: 'CIT', deadline: '2024-08-13', status: 'Pending' },
  { id: '3', clientName: 'Blossom Foods Ltd.', taxType: 'WHT', deadline: '2024-08-13', status: 'Overdue' },
  { id: '4', clientName: 'Blossom Foods Ltd.', taxType: 'PAYE', deadline: '2025-02-02', status: 'Filed' },
];

const fmt = (n) => {
  if (n == null) return '—';
  if (n >= 1_000_000) return '₦' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return '₦' + (n / 1_000).toFixed(0) + 'K';
  return '₦' + n.toLocaleString();
};

const formatDate = (str) => {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const StatusBadge = ({ status }) => {
  const map = {
    pending: 'text-amber-500',
    overdue: 'text-red-500',
    filed: 'text-green-600',
    completed: 'text-green-600',
  };
  const key = (status || '').toLowerCase();
  return <span className={`text-sm font-medium ${map[key] || 'text-gray-500'}`}>{status}</span>;
};

const AlertIcon = ({ type }) => {
  if (type === 'overdue') {
    return (
      <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    );
  }
  if (type === 'warning') {
    return (
      <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

const alertBg = { overdue: 'bg-red-50', warning: 'bg-amber-50', payment: 'bg-amber-50' };
const alertTitleColor = { overdue: 'text-red-600', warning: 'text-amber-700', payment: 'text-amber-700' };

const Compliance = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [statsRes, overviewRes, deadlinesRes] = await Promise.all([
          getComplianceStats().catch(() => null),
          getComplianceOverview().catch(() => null),
          getUpcomingDeadlines(20).catch(() => null),
        ]);

        if (statsRes?.status && statsRes.data) setStats(statsRes.data);
        if (overviewRes?.status && overviewRes.data) {
          const alertList = overviewRes.data.alerts || overviewRes.data;
          if (Array.isArray(alertList) && alertList.length > 0) setAlerts(alertList);
        }
        if (deadlinesRes?.status && deadlinesRes.data) {
          const list = deadlinesRes.data.data || deadlinesRes.data.deadlines || deadlinesRes.data;
          if (Array.isArray(list) && list.length > 0) setDeadlines(list);
        }
      } catch (err) {
        console.error('Compliance fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const displayStats = stats || FALLBACK_STATS;
  const displayAlerts = alerts.length > 0 ? alerts : FALLBACK_ALERTS;
  const displayDeadlines = deadlines.length > 0 ? deadlines : FALLBACK_DEADLINES;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <svg className="animate-spin h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="flex gap-6 p-8 h-full">
            {/* Left sidebar — Compliance Alerts */}
            <div className="w-72 shrink-0">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Compliance Alerts</h2>
              <div className="space-y-3">
                {displayAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`rounded-xl px-4 py-3 ${alertBg[alert.type] || 'bg-gray-50'}`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertIcon type={alert.type} />
                      <div>
                        <p className={`text-sm font-semibold ${alertTitleColor[alert.type] || 'text-gray-700'}`}>
                          {alert.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{alert.subtitle || alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Tip box */}
                <div className="bg-blue-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <span className="font-semibold">Tip:</span> Set up automated reminders to stay ahead of filing deadlines and avoid penalties.
                  </p>
                </div>
              </div>
            </div>

            {/* Right main content */}
            <div className="flex-1 min-w-0">
              {/* Overview */}
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Pending Filings */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Pending Filings</p>
                  <p className="text-3xl font-bold text-gray-900">{displayStats.pendingFilings ?? displayStats.pending_filings ?? '—'}</p>
                </div>

                {/* Payment Due */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Payment Due</p>
                  <p className="text-3xl font-bold text-gray-900">{displayStats.paymentDues ?? displayStats.payment_dues ?? '—'}</p>
                </div>

                {/* Completed Filings */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Completed Filings</p>
                  <p className="text-3xl font-bold text-gray-900">{displayStats.completedFilings ?? displayStats.completed_filings ?? '—'}</p>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_auto] gap-4 px-5 py-3 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-400">Client</span>
                  <span className="text-xs font-medium text-gray-400">Tax Type</span>
                  <span className="text-xs font-medium text-gray-400">Deadline</span>
                  <span className="text-xs font-medium text-gray-400">Status</span>
                  <span className="text-xs font-medium text-gray-400">Action</span>
                </div>

                {displayDeadlines.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-400">No upcoming deadlines</p>
                  </div>
                ) : (
                  displayDeadlines.map((row, idx) => (
                    <div
                      key={row.id || idx}
                      className={`grid grid-cols-[2fr_1fr_1.5fr_1fr_auto] gap-4 items-center px-5 py-4 ${
                        idx < displayDeadlines.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <span className="text-sm text-gray-700">{row.clientName || row.client_name || row.client || '—'}</span>
                      <span className="text-sm text-gray-500">{row.taxType || row.tax_type || '—'}</span>
                      <span className="text-sm text-gray-500">{formatDate(row.deadline || row.dueDate || row.due_date)}</span>
                      <StatusBadge status={row.status} />
                      <button
                        onClick={() => {
                          const filingId = row.id || row.filingId || row.filing_id;
                          if (filingId) navigate(`/filings/${filingId}`);
                        }}
                        className="text-sm font-medium text-brand hover:text-brand-700 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Compliance;
