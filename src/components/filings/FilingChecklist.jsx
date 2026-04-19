import { formatCurrency, formatDate } from '../../utils/format';

const StatusIcon = ({ status }) => {
  if (status === 'complete') {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full border-2 border-orange-400 flex items-center justify-center shrink-0">
      <div className="w-2 h-2 rounded-full bg-orange-400" />
    </div>
  );
};

// API item keys that trigger extra contextual sections when expanded
const VAT_RELATED_KEYS = new Set(['vat_state_of_operation', 'vat_registration_number']);
const EVIDENCE_VAULT_KEYS = new Set(['filing_evidence_vault', 'period_sales_invoiced', 'period_expenses_receipted']);

const FilingChecklist = ({ items, expandedItems, onToggleItem, vatResults, documents }) => (
  <div className="space-y-3">
    {items.map((item) => {
      const showVatBreakdown = VAT_RELATED_KEYS.has(item.id) && vatResults;
      const showLinkedEvidence = EVIDENCE_VAULT_KEYS.has(item.id) && documents?.length > 0;
      const expanded = expandedItems[item.id];
      return (
        <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors" onClick={() => onToggleItem(item.id)}>
            <StatusIcon status={item.status} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
            </div>
            <svg className={`w-5 h-5 text-gray-400 shrink-0 transition-transform mt-0.5 ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {expanded && (
            <div className="border-t border-gray-100 px-5 pb-4 pt-4 space-y-3">
              {showVatBreakdown && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">VAT Breakdown</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Output VAT', value: vatResults.totalVatCollected ?? vatResults.outputVat },
                      { label: 'Input VAT', value: vatResults.totalVatPaid ?? vatResults.inputVat },
                      { label: 'Net VAT Payable', value: vatResults.netVatPayable },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                        <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                        <p className="text-sm font-bold text-gray-900">{value != null ? formatCurrency(value) : '—'}</p>
                      </div>
                    ))}
                  </div>
                  {vatResults.vatRate != null && (
                    <p className="text-[10px] text-gray-400 mt-2">Standard rate applied: {vatResults.vatRate}%</p>
                  )}
                </div>
              )}

              {showLinkedEvidence && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Linked Evidence</p>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{doc.documentName}</p>
                            <p className="text-[10px] text-gray-400">{doc.category} · {formatDate(doc.dateUploaded)}</p>
                          </div>
                        </div>
                        {doc.fileUrl ? (
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="shrink-0 ml-2">
                            <svg className="w-4 h-4 text-gray-400 hover:text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-[10px] text-gray-300 ml-2 shrink-0">No file</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!showVatBreakdown && !showLinkedEvidence && (
                <p className="text-xs text-gray-400">No additional details available for this item.</p>
              )}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default FilingChecklist;
