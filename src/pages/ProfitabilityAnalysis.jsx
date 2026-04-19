import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageShell, PageHeader, TabBar, StatCard, SlideOverPanel } from '../components/common';
import HealthScoreBanner from '../components/profitability/HealthScoreBanner';
import ProfitTrendChart from '../components/profitability/ProfitTrendChart';
import CostStructureCard from '../components/profitability/CostStructureCard';
import ExpenseBreakdownCard from '../components/profitability/ExpenseBreakdownCard';
import ScenarioSimulator from '../components/profitability/ScenarioSimulator';
import { getProfitabilityTrends, getExpenseBreakdown } from '../services/financialsApi';

const DEMO = {
  healthScore: 0,
  revenue: 0,
  expenses: 0,
  netProfit: 0,
  metrics: [
    { label: 'Gross Margin', value: '0%', sub: '—' },
    { label: 'Operating Expense Ratio', value: '0%', sub: '—' },
    { label: 'Revenue', value: '₦0', sub: 'This period' },
    { label: 'Tax Burden Ratio', value: '0%', sub: '—' },
    { label: 'Collection Efficiency', value: '0%', sub: '—' },
  ],
  costStructure: [
    { label: 'Revenue', amount: 0, color: 'text-green-600' },
    { label: 'Total Variable Costs', amount: 0, color: 'text-red-600' },
    { label: 'Total Fixed Costs', amount: 0, color: 'text-red-600' },
    { label: 'Net Profit', amount: 0, color: 'text-green-600' },
  ],
  additionalIndicators: [
    { icon: '₦', label: 'Net Profit Margin', value: '₦0' },
    { icon: '%', label: 'Effective Tax Rate', value: '0%' },
    { icon: 'x', label: 'Revenue Multiplier', value: '0x' },
    { icon: '↑', label: 'Growth Rate', value: '0%' },
  ],
  taxGptInsights: [],
  profitLeaks: [],
  recommendedActions: [],
};

const TABS = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'yearly', label: 'Yearly' },
];

const ProfitabilityAnalysis = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monthly');
  const [showSimulator, setShowSimulator] = useState(false);
  const [simParams, setSimParams] = useState({ revenueIncrease: 10, expenseReduction: 5, employeeCount: 25 });
  const [profitTrends, setProfitTrends] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!clientId) return;
      const [trendsRes, expensesRes] = await Promise.allSettled([
        getProfitabilityTrends(clientId, 2026),
        getExpenseBreakdown(clientId, 2026),
      ]);
      if (trendsRes.status === 'fulfilled' && trendsRes.value?.status && trendsRes.value.data) {
        setProfitTrends(trendsRes.value.data);
      }
      if (expensesRes.status === 'fulfilled' && expensesRes.value?.status && expensesRes.value.data) {
        setExpenses(expensesRes.value.data);
      }
    };
    fetchData();
  }, [clientId]);

  // expenseBreakdown has a backend endpoint — render API data only, let card show empty state
  const expenseData = expenses;

  return (
    <PageShell clientId={clientId}>
      <div className="px-10 py-8">
        <PageHeader
          title="Profitability Analysis"
          subtitle="Track profitability through Q1 to Q4"
          actions={
            <>
              <button
                onClick={() => setShowSimulator(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Open Scenario Simulator
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Generated Reports
              </button>
            </>
          }
        />

        <div className="mb-6">
          <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <HealthScoreBanner
          score={DEMO.healthScore}
          revenue={DEMO.revenue}
          expenses={DEMO.expenses}
          netProfit={DEMO.netProfit}
          onViewAnalysis={() => navigate(`/clients/${clientId}/profitability/health-score`)}
        />

        {/* Key Metrics */}
        <h3 className="text-base font-bold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {DEMO.metrics.map((m) => (
            <StatCard key={m.label} label={m.label} value={m.value} sublabel={m.sub} />
          ))}
        </div>

        {/* Revenue vs Cost Structure + Expense Breakdown */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <CostStructureCard items={DEMO.costStructure} />
          <ExpenseBreakdownCard expenses={expenseData} />
        </div>

        {/* Additional Profitability Indicators */}
        <h3 className="text-base font-bold text-gray-900 mb-4">Additional Profitability Indicators</h3>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {DEMO.additionalIndicators.map((ind) => (
            <div key={ind.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-gray-600">{ind.icon}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{ind.value}</p>
                <p className="text-xs text-gray-500">{ind.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Profit Trend Chart + TaxGPT Insights */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <ProfitTrendChart data={profitTrends} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="text-sm font-bold text-gray-900 mb-4">TaxGPT Insights</h4>
            <div className="space-y-3">
              {DEMO.taxGptInsights.length > 0 ? DEMO.taxGptInsights.map((insight, i) => (
                <div key={i} className={`rounded-lg px-4 py-3 text-sm ${
                  insight.type === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : insight.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}>
                  {insight.title}
                </div>
              )) : <p className="text-sm text-gray-400 text-center py-4">No insights available</p>}
            </div>
          </div>
        </div>

        {/* Profit Leak Detection */}
        <h3 className="text-base font-bold text-gray-900 mb-4">Profit Leak Detection</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          {DEMO.profitLeaks.length > 0 ? (
            <div className="space-y-4">
              {DEMO.profitLeaks.map((leak, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm text-gray-700">{leak.description}</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{leak.impact}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-4">No profit leaks detected</p>}
        </div>

        {/* Recommended Actions */}
        <h3 className="text-base font-bold text-gray-900 mb-4">Recommended Actions</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          {DEMO.recommendedActions.length > 0 ? (
            <div className="space-y-3">
              {DEMO.recommendedActions.map((action, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{action.action}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-green-600">{action.impact}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-4">No recommended actions</p>}
        </div>
      </div>

      <SlideOverPanel open={showSimulator} onClose={() => setShowSimulator(false)} title="Scenario Simulator">
        <ScenarioSimulator
          params={simParams}
          onParamsChange={setSimParams}
          baseRevenue={DEMO.revenue}
          baseExpenses={DEMO.expenses}
          onReset={() => { setSimParams({ revenueIncrease: 10, expenseReduction: 5, employeeCount: 25 }); setShowSimulator(false); }}
        />
      </SlideOverPanel>
    </PageShell>
  );
};

export default ProfitabilityAnalysis;
