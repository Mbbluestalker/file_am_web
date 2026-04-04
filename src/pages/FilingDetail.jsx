import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PageShell, LoadingSpinner, ConfirmModal } from '../components/common';
import FilingChecklist from '../components/filings/FilingChecklist';
import FilingSummaryPanel from '../components/filings/FilingSummaryPanel';
import { getAllClientsFromStorage } from '../utils/clientStorage';
import { formatCurrency } from '../utils/format';
import { getFilingReport, submitTaxReturn } from '../services/filingsApi';
import { getEvidenceVaultDocuments } from '../services/evidenceVaultApi';
import { getVatComputationResults } from '../services/taxApi';

const FALLBACK_CHECKLIST = [
  { id: 'invoices', title: 'All invoices uploaded and verified', subtitle: 'Upload and review all sales and purchase invoices for the filing period', status: 'complete', complianceRequirement: 'VATA Section 10 - All VAT invoices must be properly documented', completedAt: '2026-02-11 14:30', completedBy: 'System' },
  { id: 'vatCalc', title: 'VAT calculation verified', subtitle: 'Confirm all VAT amounts calculated correctly at standard rate', status: 'complete', complianceRequirement: 'VATA Section 4 - Standard rate applies to all taxable supplies', completedAt: '2026-02-11 15:00', completedBy: 'System' },
  { id: 'inputVat', title: 'Input VAT reconciliation complete', subtitle: 'Reconcile all input VAT claims with supporting vendor invoices', status: 'pending', complianceRequirement: 'VATA Section 16 - Input tax deductibility requirements', completedAt: null, completedBy: null },
];

const FilingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';
  const rawFiling = location.state?.filing || null;

  const [expandedItems, setExpandedItems] = useState({ invoices: true });
  const [report, setReport] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [vatResults, setVatResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!defaultClientId || !id) return;
      try {
        setIsLoading(true);
        const year = rawFiling?.periodYear;
        const month = rawFiling?.periodMonth;
        const dateFrom = year && month ? new Date(year, month - 1, 1).toISOString().split('T')[0] : '';
        const dateTo = year && month ? new Date(year, month, 0).toISOString().split('T')[0] : '';

        const [reportRes, docsRes, vatRes] = await Promise.allSettled([
          getFilingReport(defaultClientId, id),
          getEvidenceVaultDocuments(defaultClientId, 1, 50, dateFrom, dateTo),
          getVatComputationResults(defaultClientId),
        ]);

        if (reportRes.status === 'fulfilled' && reportRes.value?.status && reportRes.value.data) setReport(reportRes.value.data);
        if (docsRes.status === 'fulfilled' && docsRes.value?.status && docsRes.value.data) {
          const list = docsRes.value.data.data || docsRes.value.data;
          setDocuments(Array.isArray(list) ? list : []);
        }
        if (vatRes.status === 'fulfilled' && vatRes.value?.status && vatRes.value.data) setVatResults(vatRes.value.data);
      } catch (err) {
        console.error('Filing detail fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [defaultClientId, id]);

  const filing = rawFiling ? {
    title: `${rawFiling.taxType} Return - ${rawFiling.periodLabel || ''}`,
    subtitle: 'Review checklist and resolve blockers before submission',
    period: rawFiling.periodLabel || '—',
    dueDate: rawFiling.dueDate ? new Date(rawFiling.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—',
    amount: rawFiling.amount ?? null,
    status: rawFiling.status || '—',
    readiness: report?.readiness ?? 0,
  } : null;

  const checklistItems = report?.checklist || FALLBACK_CHECKLIST;

  const handleSubmit = async () => {
    if (!rawFiling || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const response = await submitTaxReturn(defaultClientId, rawFiling.taxType, {
        periodYear: rawFiling.periodYear,
        periodMonth: rawFiling.periodMonth,
        amount: rawFiling.amount,
        paymentStatus: 'not_paid',
      });
      if (response?.status) {
        navigate(`/filings/${id}/submit`, { state: { filing: rawFiling, submission: response.data } });
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

  return (
    <PageShell clientId={defaultClientId}>
      {isLoading ? (
        <LoadingSpinner fullHeight />
      ) : (
        <>
          {/* Black header */}
          <div className="bg-gray-900 text-white px-10 py-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/filings')} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors shrink-0">
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
            <p className="text-xs text-gray-400 mt-2">This action cannot be undone.</p>
          </>
        }
        confirmLabel={isSubmitting ? 'Submitting...' : 'Yes, Submit'}
        isLoading={isSubmitting}
        variant="warning"
      />
    </PageShell>
  );
};

export default FilingDetail;
