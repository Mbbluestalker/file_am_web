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

const FilingChecklist = ({ items, expandedItems, onToggleItem, vatResults, documents }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors" onClick={() => onToggleItem(item.id)}>
          <StatusIcon status={item.status} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
          </div>
          <svg className={`w-5 h-5 text-gray-400 shrink-0 transition-transform mt-0.5 ${expandedItems[item.id] ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {expandedItems[item.id] && (
          <div className="border-t border-gray-100 px-5 pb-4 pt-4 space-y-3">
            {item.complianceRequirement && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide mb-1">Compliance Requirement</p>
                    <p className="text-xs font-medium text-orange-800">{item.complianceRequirement}</p>
                  </div>
                </div>
              </div>
            )}

            {item.id === 'vatCalc' && vatResults && (
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

            {item.id === 'invoices' && documents?.length > 0 && (
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

            {item.completedAt && (
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-teal-600 font-medium">
                  Completed {item.completedAt}{item.completedBy ? ` by ${item.completedBy}` : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default FilingChecklist;
