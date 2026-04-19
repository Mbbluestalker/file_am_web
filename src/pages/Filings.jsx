import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell, PageHeader, LoadingSpinner, EmptyState } from '../components/common';
import FilingsCalendar from '../components/filings/FilingsCalendar';
import FilingCard from '../components/filings/FilingCard';
import { getFilings, getFilingsSummary } from '../services/filingsApi';

const Filings = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [filings, setFilings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilingsLoading, setIsFilingsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!clientId) return;
      try {
        const res = await getFilingsSummary(clientId).catch(() => null);
        if (res?.status && res.data) setSummary(res.data);
      } catch (err) {
        console.error('Summary fetch error:', err);
      }
    };
    fetchSummary();
  }, [clientId]);

  useEffect(() => {
    const fetchFilings = async () => {
      if (!clientId) return;
      try {
        if (!initialLoadDone.current) setIsLoading(true);
        else setIsFilingsLoading(true);
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const dateFrom = new Date(year, month, 1).toISOString().split('T')[0];
        const dateTo = new Date(year, month + 1, 0).toISOString().split('T')[0];
        const res = await getFilings(clientId, 1, 50, dateFrom, dateTo);
        if (res?.status && res.data) {
          const list = res.data.data || res.data.filings || res.data;
          setFilings(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error('Filings fetch error:', err);
      } finally {
        initialLoadDone.current = true;
        setIsLoading(false);
        setIsFilingsLoading(false);
      }
    };
    fetchFilings();
  }, [clientId, currentMonth]);

  const displayFilings = filings.map((f) => {
    const status = f.status === 'submitted' || f.status === 'paid' ? 'submitted' : f.status === 'overdue' ? 'overdue' : 'in-progress';
    const readiness = typeof f.completionPercent === 'number'
      ? f.completionPercent
      : (status === 'submitted' ? 100 : 0);
    const due = f.dueDate ? new Date(f.dueDate) : null;
    const days = due ? Math.ceil((due - new Date()) / 86400000) : null;
    return {
      id: f.id,
      taxType: f.taxType || '—',
      period: f.periodLabel || f.period || '—',
      dueDate: due ? due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
      daysRemaining: days && days > 0 ? days : null,
      status,
      readiness,
      amount: f.amount ?? null,
      completionMet: f.completion?.met ?? null,
      completionTotal: f.completion?.total ?? null,
    };
  });

  // Build marked dates
  const markedDates = {};
  const today = new Date();
  if (today.getFullYear() === currentMonth.getFullYear() && today.getMonth() === currentMonth.getMonth()) {
    markedDates[today.getDate()] = 'today';
  }
  filings.forEach((f) => {
    if (!f.dueDate) return;
    const due = new Date(f.dueDate);
    if (due.getFullYear() === currentMonth.getFullYear() && due.getMonth() === currentMonth.getMonth()) {
      const day = due.getDate();
      if (markedDates[day] === 'today') return;
      markedDates[day] = f.status === 'submitted' || f.status === 'paid' ? 'submitted' : f.status === 'overdue' ? 'overdue' : 'in-progress';
    }
  });

  return (
    <PageShell clientId={clientId}>
      <div className="px-10 py-8">
        <PageHeader title="Filings" subtitle="Manage VAT filings, track compliance deadlines, and monitor submission status" />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex gap-6">
            <div className="flex-1">
              <FilingsCalendar
                currentMonth={currentMonth}
                onNavigateMonth={(dir) => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir))}
                markedDates={markedDates}
                summary={summary}
              />
            </div>

            <div className="w-96">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">All Filings</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {isFilingsLoading && <LoadingSpinner size="sm" />}
                  {!isFilingsLoading && displayFilings.map((filing) => (
                    <FilingCard
                      key={filing.id}
                      filing={filing}
                      onClick={() => navigate(`/clients/${clientId}/filings/${filing.id}`, { state: { filing: filings.find((f) => f.id === filing.id) } })}
                    />
                  ))}
                  {!isFilingsLoading && displayFilings.length === 0 && (
                    <EmptyState message="No filings found" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Filings;
