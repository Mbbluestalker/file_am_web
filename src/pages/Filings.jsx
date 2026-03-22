import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';
import { getFilings, getFilingsSummary } from '../services/filingsApi';

const Filings = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026
  const [filings, setFilings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  useEffect(() => {
    const fetchFilings = async () => {
      if (!defaultClientId) return;
      try {
        setIsLoading(true);
        const [filingsResponse] = await Promise.all([
          getFilings(defaultClientId, 1, 50),
          getFilingsSummary(defaultClientId).catch(() => null),
        ]);
        if (filingsResponse?.status && filingsResponse.data) {
          const list = filingsResponse.data.data || filingsResponse.data.filings || filingsResponse.data;
          setFilings(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error('Filings fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilings();
  }, [defaultClientId]);

  const fallbackFilings = [
    { id: 1, taxType: 'VAT', period: 'January 2026', dueDate: '21 Feb 2026', daysRemaining: 10, status: 'ready', readiness: 98, riskLevel: 'low', lastUpdated: '2026-02-11 14:30', updatedBy: 'System' },
    { id: 2, taxType: 'VAT', period: 'February 2026', dueDate: '21 Mar 2026', daysRemaining: 38, status: 'in-progress', readiness: 67, riskLevel: 'medium', lastUpdated: '2026-02-11 09:15', updatedBy: 'John Okeke' },
    { id: 3, taxType: 'VAT', period: 'December 2025', dueDate: '21 Jan 2026', daysRemaining: null, status: 'submitted', readiness: 100, riskLevel: 'low', lastUpdated: '2026-01-20 16:45', updatedBy: 'System' },
  ];

  const mapApiFilings = (list) =>
    list.map((f) => {
      const status = f.status === 'submitted' || f.status === 'paid' ? 'submitted' : f.status === 'overdue' ? 'in-progress' : 'ready';
      const due = f.dueDate ? new Date(f.dueDate) : null;
      const days = due ? Math.ceil((due - new Date()) / 86400000) : null;
      return {
        id: f.id,
        taxType: f.taxType || 'VAT',
        period: f.periodLabel || f.period || '',
        dueDate: due ? due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
        daysRemaining: days && days > 0 ? days : null,
        status,
        readiness: status === 'submitted' ? 100 : status === 'in-progress' ? 67 : 95,
        riskLevel: status === 'in-progress' ? 'medium' : 'low',
        lastUpdated: f.updatedAt ? new Date(f.updatedAt).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '') : '—',
        updatedBy: f.updatedBy || 'System',
      };
    });

  const displayFilings = filings.length > 0 ? mapApiFilings(filings) : fallbackFilings;

  // Calendar
  const getDaysInMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Hardcoded marked dates for demo (Feb 2026)
  const markedDates = { 11: 'today', 21: 'submitted' };

  const navigateMonth = (dir) =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir));

  const getStatusBadges = (filing) => {
    const badges = [];
    if (filing.status === 'submitted') {
      badges.push(
        <span key="s" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Submitted
        </span>
      );
    } else if (filing.status === 'ready') {
      badges.push(
        <span key="r" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
          Ready to File
        </span>
      );
    } else {
      badges.push(
        <span key="ip" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          In Progress
        </span>
      );
    }
    if (filing.riskLevel === 'low') {
      badges.push(
        <span key="lr" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-green-700 border border-green-300">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Low Risk
        </span>
      );
    } else if (filing.riskLevel === 'medium') {
      badges.push(
        <span key="mr" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
          Medium Risk
        </span>
      );
    }
    return badges;
  };

  const getReadinessColor = (r) => {
    if (r >= 90) return 'bg-green-500';
    if (r >= 60) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={defaultClientId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="px-10 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Filings</h1>
              <p className="text-sm text-gray-500">
                Manage VAT filings, track compliance deadlines, and monitor submission status
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <div className="flex gap-6">
                {/* Calendar */}
                <div className="flex-1">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between px-6 py-5">
                      <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigateMonth(-1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigateMonth(1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 px-6 mb-2">
                      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                        <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 px-6 pb-4">
                      {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                        <div key={`e-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const mark = markedDates[day];
                        const isToday = mark === 'today';
                        const hasSubmitted = mark === 'submitted';

                        return (
                          <div key={day} className="flex flex-col items-center py-1">
                            <div
                              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer
                                ${isToday ? 'border-2 border-orange-400 text-orange-600 font-semibold' : 'border border-gray-100 text-gray-700 hover:bg-gray-50'}
                              `}
                            >
                              {day}
                            </div>
                            {hasSubmitted && (
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-0.5" />
                            )}
                            {!hasSubmitted && <div className="h-2" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend — black bar */}
                    <div className="bg-gray-900 px-6 py-4 flex items-center gap-8">
                      {[
                        { color: 'bg-green-500', label: 'Submitted' },
                        { color: 'bg-red-500', label: 'Overdue' },
                        { color: 'bg-blue-500', label: 'In Progress' },
                        { color: 'bg-orange-400', label: 'Today' },
                      ].map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                          <span className="text-xs text-gray-300">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filings List */}
                <div className="w-96">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                      <h2 className="text-base font-semibold text-gray-900">All Filings</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {displayFilings.map((filing) => (
                        <div
                          key={filing.id}
                          onClick={() => navigate(`/filings/${filing.id}`)}
                          className="px-6 py-5 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          {/* Title row */}
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{filing.taxType} Return</p>
                              <p className="text-xs text-gray-400 mt-0.5">Period: {filing.period}</p>
                            </div>
                            <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1.5 my-2.5">
                            {getStatusBadges(filing)}
                          </div>

                          {/* Due Date + Readiness */}
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Due Date</p>
                              <p className="text-xs font-semibold text-gray-800">
                                {filing.dueDate}
                                {filing.daysRemaining != null && (
                                  <span className="font-normal text-gray-400 ml-1">({filing.daysRemaining} days)</span>
                                )}
                              </p>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Readiness</p>
                                <p className="text-xs font-semibold text-gray-800">{filing.readiness}%</p>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${getReadinessColor(filing.readiness)}`}
                                  style={{ width: `${filing.readiness}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Last updated */}
                          <p className="text-[10px] text-gray-400">
                            Last updated {filing.lastUpdated} by {filing.updatedBy}
                          </p>
                        </div>
                      ))}

                      {displayFilings.length === 0 && (
                        <div className="px-6 py-12 text-center">
                          <p className="text-sm text-gray-400">No filings found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Filings;
