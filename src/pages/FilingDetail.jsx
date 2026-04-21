import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PageShell, LoadingSpinner, ConfirmModal } from '../components/common';
import FilingChecklist from '../components/filings/FilingChecklist';
import FilingSummaryPanel from '../components/filings/FilingSummaryPanel';
import { formatCurrency } from '../utils/format';
import { getFilingById, getFilingReport, submitTaxReturn } from '../services/filingsApi';
import { getEvidenceVaultDocuments } from '../services/evidenceVaultApi';
import { getVatComputationResults } from '../services/taxApi';

// Filings in these states have already been filed — the submit flow should be locked.
const LOCKED_STATUSES = new Set(['submitted', 'paid']);

// Transform API completion.items → FilingChecklist shape
const toChecklistItems = (items) =>
  (items || []).map((it) => ({
    id: it.key,
    title: it.label,
    status: it.met ? 'complete' : 'pending',
  }));

const FilingDetail = () => {
  const navigate = useNavigate();
  const { id, clientId } = useParams();
  const location = useLocation();
  const seededFiling = location.state?.filing || null;

  const [rawFiling, setRawFiling] = useState(seededFiling);
  const [expandedItems, setExpandedItems] = useState({});
  const [report, setReport] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [vatResults, setVatResults] = useState(null);
  const [isLoading, setIsLoading] = useState(!seededFiling);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      if (!clientId || !id) return;
      try {
        const filingRes = await getFilingById(clientId, id);
        if (cancelled) return;
        if (!filingRes?.status || !filingRes.data) {
          setError(filingRes?.message || 'Filing not found');
          return;
        }
        const fresh = filingRes.data;
        setRawFiling(fresh);

        const year = fresh.periodYear;
        const month = fresh.periodMonth;
        const dateFrom = year && month ? new Date(year, month - 1, 1).toISOString().split('T')[0] : '';
        const dateTo = year && month ? new Date(year, month, 0).toISOString().split('T')[0] : '';

        const [reportRes, docsRes, vatRes] = await Promise.allSettled([
          getFilingReport(clientId, id),
          getEvidenceVaultDocuments(clientId, 1, 50, dateFrom, dateTo),
          getVatComputationResults(clientId),
        ]);
        if (cancelled) return;

        if (reportRes.status === 'fulfilled' && reportRes.value?.status && reportRes.value.data) setReport(reportRes.value.data);
        if (docsRes.status === 'fulfilled' && docsRes.value?.status && docsRes.value.data) {
          const list = docsRes.value.data.data || docsRes.value.data;
          setDocuments(Array.isArray(list) ? list : []);
        }
        if (vatRes.status === 'fulfilled' && vatRes.value?.status && vatRes.value.data) setVatResults(vatRes.value.data);
      } catch (err) {
        if (cancelled) return;
        console.error('Filing detail fetch error:', err);
        setError(err.message || 'Failed to load filing');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [clientId, id]);

  const isLocked = rawFiling ? LOCKED_STATUSES.has((rawFiling.status || '').toLowerCase()) : false;

  const filing = rawFiling ? {
    title: `${rawFiling.taxType} Return - ${rawFiling.periodLabel || ''}`,
    subtitle: isLocked
      ? 'This return has already been filed. Review the submission details below.'
      : 'Review checklist and resolve blockers before submission',
    period: rawFiling.periodLabel || '—',
    dueDate: rawFiling.dueDate ? new Date(rawFiling.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—',
    amount: rawFiling.amount ?? null,
    status: (rawFiling.status || '—').toLowerCase(),
    readiness: report?.readiness ?? rawFiling.completionPercent ?? 0,
  } : null;

  const checklistItems = report?.checklist
    ? report.checklist
    : rawFiling?.completion?.items
    ? toChecklistItems(rawFiling.completion.items)
    : [];

  // Pre-submit blockers = unmet items EXCLUDING the `workflow` category (that item is the act of submitting itself).
  const unmetBlockers = (rawFiling?.completion?.items || []).filter(
    (it) => !it.met && it.category !== 'workflow'
  );

  const handleSubmit = async () => {
    if (!rawFiling || isSubmitting || isLocked) return;
    try {
      setIsSubmitting(true);
      const response = await submitTaxReturn(clientId, rawFiling.taxType, {
        periodYear: rawFiling.periodYear,
        periodMonth: rawFiling.periodMonth,
        amount: rawFiling.amount,
        paymentStatus: 'not_paid',
      });
      if (response?.status) {
        navigate(`/clients/${clientId}/filings/${id}/submit`, { state: { filing: rawFiling, submission: response.data } });
      } else {
        toast.error(response?.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Submit filing error:', err);
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <PageShell clientId={clientId}>
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Filing not found</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => navigate(`/clients/${clientId}/filings`)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Back to Filings
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell clientId={clientId}>
      {isLoading ? (
        <LoadingSpinner fullHeight />
      ) : (
        <>
          {/* Black header */}
          <div className="bg-gray-900 text-white px-10 py-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(`/clients/${clientId}/filings`)} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold">{filing?.title || '—'}</h1>
                <p className="text-sm text-gray-400 mt-0.5">{filing?.subtitle || ''}</p>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 px-10 py-8 min-w-0">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-lg font-bold text-gray-900">Readiness Score</h2>
                <span className={`px-3 py-0.5 rounded text-sm font-bold ${(filing?.readiness ?? 0) >= 80 ? 'bg-green-100 text-green-700' : (filing?.readiness ?? 0) >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                  {filing?.readiness ?? 0}%
                </span>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-4">Financial Data</h3>

              {checklistItems.length > 0 ? (
                <FilingChecklist
                  items={checklistItems}
                  expandedItems={expandedItems}
                  onToggleItem={(itemId) => setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }))}
                  vatResults={vatResults}
                  documents={documents}
                />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-8 text-center">
                  <p className="text-sm text-gray-400">No checklist data available for this filing.</p>
                </div>
              )}
            </div>

            <FilingSummaryPanel
              filing={filing}
              report={report}
              totalPaid={rawFiling?.totalPaid}
              isLocked={isLocked}
              onSubmit={() => setShowConfirm(true)}
              isSubmitting={isSubmitting}
            />
          </div>
        </>
      )}

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => { setShowConfirm(false); handleSubmit(); }}
        title="Confirm Submission"
        message={
          <>
            <p>
              You are about to submit a <span className="font-semibold text-gray-700">{rawFiling?.taxType}</span> return for <span className="font-semibold text-gray-700">{rawFiling?.periodLabel}</span> with an amount of <span className="font-semibold text-gray-700">{formatCurrency(filing?.amount)}</span>.
            </p>
            {unmetBlockers.length > 0 && (
              <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
                <p className="text-xs font-semibold text-orange-900 mb-2">
                  {unmetBlockers.length} checklist {unmetBlockers.length === 1 ? 'item is' : 'items are'} not yet complete:
                </p>
                <ul className="space-y-1">
                  {unmetBlockers.map((it) => (
                    <li key={it.key} className="flex items-start gap-2 text-xs text-orange-800">
                      <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" />
                      </svg>
                      <span>{it.label}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-orange-700 mt-2">
                  You can still submit, but these gaps may need to be resolved for full compliance.
                </p>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">This action cannot be undone.</p>
          </>
        }
        confirmLabel={isSubmitting ? 'Submitting...' : unmetBlockers.length > 0 ? 'Submit Anyway' : 'Yes, Submit'}
        isLoading={isSubmitting}
        variant="warning"
      />
    </PageShell>
  );
};

export default FilingDetail;
