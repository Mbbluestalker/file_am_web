import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';
import { getFilingReport } from '../services/filingsApi';

const FilingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  const [expandedItems, setExpandedItems] = useState({ invoices: true });
  const [filingReport, setFilingReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilingReport = async () => {
      if (!defaultClientId || !id) return;
      try {
        setIsLoading(true);
        const response = await getFilingReport(defaultClientId, id);
        if (response?.status && response.data) {
          setFilingReport(response.data);
        }
      } catch (err) {
        console.error('Filing report fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilingReport();
  }, [defaultClientId, id]);

  const fallbackFiling = {
    title: 'VAT Return - January 2026',
    subtitle: 'Review checklist and resolve blockers before submission',
    readiness: 43,
    period: 'January 2026',
    dueDate: '21 February 2026',
    lastUpdated: '2026-02-11 14:30',
    updatedBy: 'System',
  };

  const fallbackChecklist = [
    {
      id: 'invoices',
      title: 'All invoices uploaded and verified',
      subtitle: 'Upload and review all sales and purchase invoices for the filing period',
      status: 'complete',
      complianceRequirement: 'VATA Section 10 - All VAT invoices must be properly documented',
      linkedEvidence: ['INV-2026-001', 'INV-2026-002', 'INV-2026-003'],
      completedAt: '2026-02-11 14:30',
      completedBy: 'John Okeke',
    },
    {
      id: 'vatCalc',
      title: 'VAT calculation verified',
      subtitle: 'Confirm all VAT amounts calculated correctly at standard rate (7.5%)',
      status: 'complete',
      complianceRequirement: 'VATA Section 4 - Standard rate of 7.5% applies',
      linkedEvidence: ['Tax Computation Sheet'],
      completedAt: '2026-02-11 15:00',
      completedBy: 'System',
    },
    {
      id: 'inputVat',
      title: 'Input VAT reconciliation complete',
      subtitle: 'Reconcile all input VAT claims with supporting vendor invoices',
      status: 'pending',
      complianceRequirement: 'VATA Section 16 - Input tax deductibility requirements',
      linkedEvidence: [],
      completedAt: null,
      completedBy: null,
    },
  ];

  const filing = filingReport
    ? {
        title: filingReport.title || `${filingReport.taxType} Return - ${filingReport.periodLabel}`,
        subtitle: filingReport.description || 'Review checklist and resolve blockers before submission',
        readiness: filingReport.readiness || 0,
        period: filingReport.periodLabel || filingReport.period || '—',
        dueDate: filingReport.dueDate ? new Date(filingReport.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—',
        lastUpdated: filingReport.updatedAt ? new Date(filingReport.updatedAt).toLocaleString('en-GB') : '—',
        updatedBy: filingReport.updatedBy || 'System',
      }
    : fallbackFiling;

  const checklistItems = filingReport?.checklist || fallbackChecklist;

  const toggleItem = (itemId) =>
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));

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

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar clientId={defaultClientId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hideLogo={true} />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <svg className="animate-spin h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <>
              {/* Black header */}
              <div className="bg-gray-900 text-white px-10 py-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/filings')}
                    className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-xl font-bold">{filing.title}</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{filing.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="flex">
                {/* Main Content */}
                <div className="flex-1 px-10 py-8 min-w-0">
                  {/* Readiness Score */}
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-lg font-bold text-gray-900">Readiness Score</h2>
                    <span
                      className={`px-3 py-0.5 rounded text-sm font-bold ${
                        filing.readiness >= 80
                          ? 'bg-green-100 text-green-700'
                          : filing.readiness >= 50
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {filing.readiness}%
                    </span>
                  </div>

                  {/* Financial Data */}
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Financial Data</h3>

                  <div className="space-y-3">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {/* Item header */}
                        <button
                          className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                          onClick={() => toggleItem(item.id)}
                        >
                          <StatusIcon status={item.status} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
                          </div>
                          <svg
                            className={`w-5 h-5 text-gray-400 shrink-0 transition-transform mt-0.5 ${expandedItems[item.id] ? 'rotate-90' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Expanded content */}
                        {expandedItems[item.id] && (
                          <div className="border-t border-gray-100 px-5 pb-4 pt-4 space-y-3">
                            {/* Compliance Requirement */}
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

                            {/* Linked Evidence */}
                            {item.linkedEvidence && item.linkedEvidence.length > 0 && (
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Linked Evidence</p>
                                <div className="space-y-2">
                                  {item.linkedEvidence.map((ev, i) => (
                                    <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                      <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <span className="text-xs font-medium text-gray-800">{ev}</span>
                                      </div>
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Completed timestamp */}
                            {item.completedAt && (
                              <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xs text-teal-600 font-medium">
                                  Completed {item.completedAt} by {item.completedBy}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-72 bg-white border-l border-gray-200 px-6 py-8 shrink-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-5">Filing Summary</h3>

                  <div className="space-y-5">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Filing Period</p>
                      <p className="text-sm font-semibold text-gray-900">{filing.period}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Due Date</p>
                      <p className="text-sm font-semibold text-gray-900">{filing.dueDate}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Last Updated</p>
                      <p className="text-sm font-semibold text-gray-900">{filing.lastUpdated}</p>
                      <p className="text-xs text-gray-400 mt-0.5">by {filing.updatedBy}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
                    <button
                      onClick={() => navigate(`/filings/${id}/submit`)}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Proceed to Submit
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default FilingDetail;
