import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';
import { getFilings, getFilingsSummary } from '../services/filingsApi';

const Filings = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026
  const [filings, setFilings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use first client as default for sidebar navigation
  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';

  // Fetch filings data from API
  useEffect(() => {
    const fetchFilings = async () => {
      if (!defaultClientId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch filings and summary in parallel
        const [filingsResponse, summaryResponse] = await Promise.all([
          getFilings(defaultClientId, 1, 50),
          getFilingsSummary(defaultClientId)
        ]);

        if (filingsResponse.status && filingsResponse.data) {
          // Handle both paginated and non-paginated responses
          const filingsList = filingsResponse.data.data || filingsResponse.data.filings || filingsResponse.data;
          setFilings(Array.isArray(filingsList) ? filingsList : []);
        }

        if (summaryResponse.status && summaryResponse.data) {
          setSummary(summaryResponse.data);
        }
      } catch (err) {
        console.error('Filings fetch error:', err);
        setError(err.message || 'Failed to load filings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilings();
  }, [defaultClientId]);

  // Fallback mock data for filings
  const fallbackFilings = [
    {
      id: 1,
      title: 'VAT Return - February 2026',
      dueDate: '21 March 2026',
      lastUpdated: '2026-03-19 14:30',
      status: 'ready',
      readiness: 98,
      riskLevel: 'low',
    },
    {
      id: 2,
      title: 'VAT Return - January 2026',
      dueDate: '21 February 2026',
      lastUpdated: '2026-02-15 09:22',
      status: 'in-progress',
      readiness: 67,
      riskLevel: 'medium',
    },
    {
      id: 3,
      title: 'VAT Return - December 2025',
      dueDate: '21 January 2026',
      lastUpdated: '2026-01-20 16:45',
      status: 'submitted',
      readiness: 100,
      riskLevel: null,
    },
    {
      id: 4,
      title: 'WHT Return - February 2026',
      dueDate: '21 March 2026',
      lastUpdated: '2026-03-18 11:15',
      status: 'ready',
      readiness: 95,
      riskLevel: 'low',
    },
  ];

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getStatusBadge = (status, readiness, riskLevel) => {
    if (status === 'submitted') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Submitted
        </span>
      );
    }
    if (status === 'ready') {
      return (
        <>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Ready to File
          </span>
          {riskLevel === 'low' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              Low Risk
            </span>
          )}
        </>
      );
    }
    if (status === 'in-progress') {
      return (
        <>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            In Progress
          </span>
          {riskLevel === 'medium' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
              Medium Risk
            </span>
          )}
        </>
      );
    }
  };

  const getProgressColor = (readiness) => {
    if (readiness >= 90) return 'bg-green-500';
    if (readiness >= 70) return 'bg-blue-500';
    if (readiness >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return `₦${Math.round(amount).toLocaleString()}`;
  };

  // Map API status to UI status
  const mapStatus = (apiStatus) => {
    if (apiStatus === 'submitted' || apiStatus === 'paid') return 'submitted';
    if (apiStatus === 'overdue') return 'in-progress'; // Show overdue as in-progress with medium risk
    if (apiStatus === 'pending') return 'ready'; // Show pending as ready to file
    return 'in-progress';
  };

  // Determine risk level based on status and due date
  const getRiskLevel = (status, dueDate) => {
    if (status === 'overdue') return 'medium';
    if (status === 'pending') {
      const due = new Date(dueDate);
      const today = new Date();
      const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 7) return 'medium';
      return 'low';
    }
    return null;
  };

  // Calculate readiness based on status
  const getReadiness = (status) => {
    if (status === 'submitted' || status === 'paid') return 100;
    if (status === 'overdue') return 67;
    if (status === 'pending') return 95;
    return 50;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Mark specific dates
  const markedDates = {
    2: 'submitted', // green
    15: 'overdue', // red
    21: 'in-progress', // blue
    28: 'today', // orange
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction));
  };

  // Transform API data to UI format
  const displayFilings = filings.length > 0
    ? filings.map(filing => {
        const uiStatus = mapStatus(filing.status);
        const riskLevel = getRiskLevel(filing.status, filing.dueDate);
        const readiness = getReadiness(filing.status);

        return {
          id: filing.id,
          title: `${filing.taxType} Return - ${filing.periodLabel}`,
          dueDate: filing.dueDate,
          lastUpdated: filing.updatedAt || filing.createdAt || new Date().toISOString(),
          status: uiStatus,
          readiness: readiness,
          riskLevel: riskLevel,
          amount: filing.amount,
          taxType: filing.taxType,
          periodLabel: filing.periodLabel,
        };
      })
    : fallbackFilings;

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
          <div className="px-10 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Filings</h1>
              <p className="text-sm text-gray-500">
                Manage VAT filings, track compliance deadlines, and monitor submission status
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600">Loading filings...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">Unable to load filings data</p>
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
            )}

            {!isLoading && (
              <>

            {/* Main Content Area */}
            <div className="flex gap-6">
              {/* Calendar Section */}
              <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const status = markedDates[day];
                let dayClass = 'aspect-square flex items-center justify-center rounded-lg text-sm border border-gray-200 hover:border-gray-300 cursor-pointer';

                if (status === 'submitted') {
                  dayClass += ' bg-green-50 border-green-200 text-green-700 font-medium';
                } else if (status === 'overdue') {
                  dayClass += ' bg-red-50 border-red-200 text-red-700 font-medium';
                } else if (status === 'in-progress') {
                  dayClass += ' bg-blue-50 border-blue-200 text-blue-700 font-medium';
                } else if (status === 'today') {
                  dayClass += ' bg-orange-50 border-orange-300 text-orange-700 font-semibold ring-2 ring-orange-200';
                }

                return (
                  <div key={day} className={dayClass}>
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-200 border border-green-300" />
                <span className="text-sm text-gray-600">Submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-200 border border-red-300" />
                <span className="text-sm text-gray-600">Overdue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-200 border border-blue-300" />
                <span className="text-sm text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-200 border border-orange-300 ring-2 ring-orange-100" />
                <span className="text-sm text-gray-600">Today</span>
              </div>
            </div>
              </div>
              </div>

              {/* Filings List Section */}
              <div className="w-96 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Filings</h2>

            <div className="space-y-4">
              {displayFilings.map((filing) => (
                <div
                  key={filing.id}
                  onClick={() => navigate(`/filings/${filing.id}`)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{filing.title || filing.filingName || 'Untitled Filing'}</h3>
                    {filing.status === 'submitted' && (
                      <Calendar className="w-4 h-4 text-green-600" />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {getStatusBadge(filing.status, filing.readiness, filing.riskLevel)}
                  </div>

                  {filing.status !== 'submitted' && (
                    <>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Readiness</span>
                          <span className="font-medium text-gray-700">{filing.readiness || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(filing.readiness || 0)}`}
                            style={{ width: `${filing.readiness || 0}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Due Date</span>
                      <span className="font-medium text-gray-700">{formatDate(filing.dueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated</span>
                      <span className="text-gray-600">{formatDate(filing.lastUpdated || filing.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {displayFilings.length === 0 && (
                <div className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No filings found</p>
                </div>
              )}
                </div>
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Filings;
