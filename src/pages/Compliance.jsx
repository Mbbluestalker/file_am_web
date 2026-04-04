import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { LoadingSpinner, StatusBadge } from '../components/common';
import { formatDate } from '../utils/format';
import { getComplianceStats, getComplianceOverview, getUpcomingDeadlines } from '../services/complianceApi';

const FALLBACK_STATS = { pendingFilings: 0, paymentDues: 0, completedFilings: 0 };
const FALLBACK_ALERTS = [];
const FALLBACK_DEADLINES = [];

const AlertIcon = ({ type }) => {
  if (type === 'overdue') return <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>;
  if (type === 'warning') return <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  return <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

const ALERT_STYLES = {
  overdue: { bg: 'bg-red-50', title: 'text-red-600' },
  warning: { bg: 'bg-amber-50', title: 'text-amber-700' },
  payment: { bg: 'bg-amber-50', title: 'text-amber-700' },
};

const STAT_ICONS = [
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
];

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
          const list = overviewRes.data.alerts || overviewRes.data;
          if (Array.isArray(list) && list.length > 0) setAlerts(list);
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

  const statItems = [
    { label: 'Pending Filings', value: displayStats.pendingFilings ?? displayStats.pending_filings ?? '—' },
    { label: 'Payment Due', value: displayStats.paymentDues ?? displayStats.payment_dues ?? '—' },
    { label: 'Completed Filings', value: displayStats.completedFilings ?? displayStats.completed_filings ?? '—' },
  ];

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <LoadingSpinner fullHeight />
        ) : (
          <div className="flex gap-6 p-8 h-full">
            {/* Left sidebar — Alerts */}
            <div className="w-72 shrink-0">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Compliance Alerts</h2>
              <div className="space-y-3">
                {displayAlerts.map((alert, i) => {
                  const style = ALERT_STYLES[alert.type] || { bg: 'bg-gray-50', title: 'text-gray-700' };
                  return (
                    <div key={i} className={`rounded-xl px-4 py-3 ${style.bg}`}>
                      <div className="flex items-start gap-2">
                        <AlertIcon type={alert.type} />
                        <div>
                          <p className={`text-sm font-semibold ${style.title}`}>{alert.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{alert.subtitle || alert.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {displayAlerts.length === 0 && <p className="text-sm text-gray-400">No alerts</p>}
                <div className="bg-blue-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <span className="font-semibold">Tip:</span> Set up automated reminders to stay ahead of filing deadlines.
                  </p>
                </div>
              </div>
            </div>

            {/* Right main content */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {statItems.map((item, i) => (
                  <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                      {STAT_ICONS[i]}
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_auto] gap-4 px-5 py-3 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-400">Client</span>
                  <span className="text-xs font-medium text-gray-400">Tax Type</span>
                  <span className="text-xs font-medium text-gray-400">Deadline</span>
                  <span className="text-xs font-medium text-gray-400">Status</span>
                  <span className="text-xs font-medium text-gray-400">Action</span>
                </div>
                {displayDeadlines.length === 0 ? (
                  <div className="py-12 text-center"><p className="text-sm text-gray-400">No upcoming deadlines</p></div>
                ) : (
                  displayDeadlines.map((row, idx) => (
                    <div key={row.id || idx} className={`grid grid-cols-[2fr_1fr_1.5fr_1fr_auto] gap-4 items-center px-5 py-4 ${idx < displayDeadlines.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <span className="text-sm text-gray-700">{row.clientName || row.client_name || row.client || '—'}</span>
                      <span className="text-sm text-gray-500">{row.taxType || row.tax_type || '—'}</span>
                      <span className="text-sm text-gray-500">{formatDate(row.deadline || row.dueDate || row.due_date, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <StatusBadge status={(row.status || '').toLowerCase()} label={row.status} size="md" />
                      <button
                        onClick={() => { const fid = row.id || row.filingId; if (fid) navigate(`/filings/${fid}`); }}
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
