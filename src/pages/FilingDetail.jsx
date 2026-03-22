import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';
import { getFilingReport } from '../services/filingsApi';

const FilingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Use first client as default for sidebar navigation
  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';
  const [expandedSections, setExpandedSections] = useState({
    invoices: true,
    vatCalc: false,
    inputVat: false,
  });

  const [filingReport, setFilingReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filing report from API
  useEffect(() => {
    const fetchFilingReport = async () => {
      if (!defaultClientId || !id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getFilingReport(defaultClientId, id);

        if (response.status && response.data) {
          setFilingReport(response.data);
        } else {
          throw new Error('Failed to load filing report');
        }
      } catch (err) {
        console.error('Filing report fetch error:', err);
        setError(err.message || 'Failed to load filing report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilingReport();
  }, [defaultClientId, id]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Fallback mock data
  const fallbackFiling = {
    id,
    title: 'VAT Return - January 2026',
    subtitle: 'Review checklist and resolve blockers before submission',
    readiness: 43,
    period: 'January 2026',
    dueDate: '21 February 2026',
    lastUpdated: '2026-02-15 09:22',
    updatedBy: 'System',
  };

  const fallbackChecklistItems = [
    {
      id: 'invoices',
      title: 'All invoices uploaded and verified',
      subtitle: 'Upload and review all sales and purchase invoices for the filing period',
      status: 'complete',
      linkedItems: [
        { type: 'invoice', name: 'INV-2026-001', count: 45 },
        { type: 'invoice', name: 'INV-2026-002', count: 32 },
      ],
    },
    {
      id: 'vatCalc',
      title: 'VAT calculation verified',
      subtitle: 'Confirm all VAT amounts calculated correctly at standard rate (7.5%)',
      status: 'complete',
      complianceRequirement: {
        title: 'COMPLIANCE REQUIREMENT',
        section: 'VATA Section 10: Input tax deductibility requirements',
        description:
          'All VAT must be calculated at the standard rate of 7.5% as specified in the VAT Act. Ensure all calculations are accurate and compliant with FIRS guidelines for the reporting period.',
      },
      linkedItems: [
        { type: 'evidence', name: 'VAT Computation Sheet', icon: FileText },
        { type: 'evidence', name: 'Output VAT Summary', icon: FileText },
      ],
    },
    {
      id: 'inputVat',
      title: 'Input VAT reconciliation complete',
      subtitle: 'Reconcile and verify input claims with supporting invoices',
      status: 'pending',
      complianceRequirement: {
        title: 'COMPLIANCE REQUIREMENT',
        section: 'VATA Section 16: Input tax deductibility requirements',
        description:
          'Input VAT claims must be supported by valid tax invoices containing all mandatory information as specified in Section 16 of the VAT Act. Ensure all invoices are properly dated within the filing period and contain accurate supplier TIN details.',
      },
    },
  ];

  // Map API data to component format
  const filing = filingReport ? {
    id: filingReport.id || id,
    title: filingReport.title || `${filingReport.taxType} Return - ${filingReport.periodLabel}` || 'Filing Report',
    subtitle: filingReport.description || 'Review checklist and resolve blockers before submission',
    readiness: filingReport.readiness || 0,
    period: filingReport.periodLabel || filingReport.period || 'N/A',
    dueDate: formatDate(filingReport.dueDate),
    lastUpdated: formatDate(filingReport.lastUpdated || filingReport.updatedAt || filingReport.createdAt),
    updatedBy: filingReport.updatedBy || 'System',
    amount: filingReport.amount,
    taxType: filingReport.taxType,
    status: filingReport.status,
  } : fallbackFiling;

  // Use checklist from API if available, otherwise use fallback
  const checklistItems = filingReport?.checklist || fallbackChecklistItems;

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getStatusIcon = (status) => {
    if (status === 'complete') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (status === 'pending') {
      return <Clock className="w-5 h-5 text-orange-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const canProceed = checklistItems.every((item) => item.status === 'complete');

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar clientId={defaultClientId} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header hideLogo={true} />

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading filing report...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-10">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">Unable to load filing report</p>
                    <p className="text-xs text-yellow-700 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-xs font-medium text-yellow-700 hover:text-yellow-800 underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLoading && (
            <>
          {/* Page Header */}
          <div className="bg-black text-white px-10 py-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-semibold">{filing.title}</h1>
                <p className="text-gray-400 text-sm mt-1">{filing.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* Readiness Score */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Readiness Score</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                  {filing.readiness}%
                </span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${filing.readiness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Financial Data Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Financial Data</h3>

              <div className="space-y-4">
                {checklistItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg">
                    {/* Checklist Item Header */}
                    <div
                      className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleSection(item.id)}
                    >
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                          </div>
                          {expandedSections[item.id] ? (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedSections[item.id] && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        {/* Compliance Requirement */}
                        {item.complianceRequirement && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h5 className="text-xs font-semibold text-orange-800 uppercase tracking-wide">
                                  {item.complianceRequirement.title}
                                </h5>
                                <p className="text-sm font-medium text-orange-900 mt-2">
                                  {item.complianceRequirement.section}
                                </p>
                                <p className="text-sm text-orange-800 mt-2 leading-relaxed">
                                  {item.complianceRequirement.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Linked Items */}
                        {item.linkedItems && item.linkedItems.length > 0 && (
                          <div className="space-y-2">
                            {item.linkedItems.map((linkedItem, idx) => {
                              const Icon = linkedItem.icon || FileText;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {linkedItem.name}
                                    </span>
                                  </div>
                                  {linkedItem.count && (
                                    <span className="text-xs text-gray-500">{linkedItem.count} items</span>
                                  )}
                                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    View
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/filings/${id}/submit`)}
                disabled={!canProceed}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                  canProceed
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Proceed to Submit
              </button>
            </div>
            </div>
            </div>

            {/* Sidebar - Filing Summary */}
            <div className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Filing Summary
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500">Filing Period</p>
              <p className="font-medium text-gray-900 mt-1">{filing.period}</p>
            </div>

            <div>
              <p className="text-gray-500">Due Date</p>
              <p className="font-medium text-gray-900 mt-1">{filing.dueDate}</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-900 mt-1">{filing.lastUpdated}</p>
              <p className="text-gray-500 text-xs mt-1">By {filing.updatedBy}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-2">
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
              Quick Actions
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
