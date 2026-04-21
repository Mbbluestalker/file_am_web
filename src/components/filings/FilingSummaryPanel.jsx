import { formatCurrency, formatDate } from '../../utils/format';

const LOCKED_COPY = {
  paid: { title: 'Filed and paid', body: 'This return has been submitted and payment is recorded.' },
  submitted: { title: 'Filed — payment pending', body: 'This return has been submitted. Payment has not yet been recorded.' },
};

const FilingSummaryPanel = ({ filing, report, totalPaid, isLocked, onSubmit, isSubmitting }) => {
  const lockedCopy = isLocked ? LOCKED_COPY[filing?.status] || LOCKED_COPY.submitted : null;

  return (
    <div className="w-72 bg-white border-l border-gray-200 px-6 py-8 shrink-0">
      <h3 className="text-sm font-bold text-gray-900 mb-5">Filing Summary</h3>

      <div className="space-y-5">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Filing Period</p>
          <p className="text-sm font-semibold text-gray-900">{filing?.period || '—'}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Due Date</p>
          <p className="text-sm font-semibold text-gray-900">{filing?.dueDate || '—'}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Amount</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(filing?.amount)}</p>
        </div>
        {totalPaid != null && totalPaid > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Amount Paid</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalPaid)}</p>
          </div>
        )}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</p>
          <p className="text-sm font-semibold text-gray-900 capitalize">{filing?.status || '—'}</p>
        </div>

        {report && (
          <>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Report Type</p>
              <p className="text-sm font-semibold text-gray-900">{report.reportType || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Report Generated</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(report.generatedAt, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Format</p>
              <p className="text-sm font-semibold text-gray-900">{report.format || '—'}</p>
            </div>
            {report.documentUrl && (
              <a href={report.documentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Report
              </a>
            )}
          </>
        )}
      </div>

      <div className="mt-8">
        {isLocked ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start gap-2 mb-1.5">
              <svg className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-gray-900">{lockedCopy.title}</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{lockedCopy.body}</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
            <button
              onClick={onSubmit}
              disabled={!filing || isSubmitting}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Proceed to Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FilingSummaryPanel;
