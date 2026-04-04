import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageShell, BackButton, TabBar } from '../components/common';
import HealthCategoryGrid from '../components/healthScore/HealthCategoryGrid';
import ScoreComponentCard from '../components/healthScore/ScoreComponentCard';

const SCORE = 0;

const HEALTH_CATEGORIES = [
  { label: 'Healthy', range: '80-100', color: 'bg-green-600', desc: 'Your business is financially strong with solid profitability, positive cash flow, and controlled expenses.' },
  { label: 'Stable', range: '60-79', color: 'bg-teal-500', desc: 'Your business is functioning well but has areas that need attention to maintain or improve financial position.' },
  { label: 'At Risk', range: '40-59', color: 'bg-amber-500', desc: 'Your business faces moderate financial pressure. Immediate action is needed to improve cash flow or reduce costs.' },
  { label: 'Failing', range: '0-39', color: 'bg-red-500', desc: 'Your business is in a critical condition. Urgent intervention required to prevent failure.' },
];

const WEIGHTS = [
  { label: 'Profitability Score', weight: 30, color: 'bg-teal-600' },
  { label: 'Cash Flow Score', weight: 20, color: 'bg-green-500' },
  { label: 'Revenue Stability', weight: 15, color: 'bg-blue-500' },
  { label: 'Expense Control', weight: 15, color: 'bg-amber-500' },
  { label: 'Tax Compliance', weight: 10, color: 'bg-purple-500' },
  { label: 'Liquidity Score', weight: 10, color: 'bg-pink-500' },
];

const COMPONENTS = [
  { label: 'Profitability Score', score: 0, weight: '30%', status: '—', statusColor: 'bg-gray-100 text-gray-500', details: 'Net Profit Margin: — | Gross Margin: — | Operating Margin: —', riskFactor: '—', barColor: 'bg-gray-300' },
  { label: 'Cash Flow Score', score: 0, weight: '20%', status: '—', statusColor: 'bg-gray-100 text-gray-500', details: 'Operating Cash Flow: — | Free Cash Flow: —', riskFactor: '—', barColor: 'bg-gray-300' },
  { label: 'Revenue Stability', score: 0, weight: '15%', status: '—', statusColor: 'bg-gray-100 text-gray-500', details: 'Monthly variance: — | Growth trend: — | Seasonality: —', riskFactor: '—', barColor: 'bg-gray-300' },
  { label: 'Expense Control', score: 0, weight: '15%', status: '—', statusColor: 'bg-gray-100 text-gray-500', details: 'OpEx Ratio: — | Variable vs Fixed: — | Cost trend: —', riskFactor: '—', barColor: 'bg-gray-300' },
  { label: 'Tax Compliance', score: 0, weight: '10%', status: '—', statusColor: 'bg-gray-100 text-gray-500', details: 'Filing status: — | Outstanding: — | Penalties: —', riskFactor: '—', barColor: 'bg-gray-300' },
  { label: 'Liquidity Score', score: 0, weight: '10%', status: '—', statusColor: 'bg-gray-100 text-gray-500', details: 'Current Ratio: — | Quick Ratio: — | Cash Reserve: —', riskFactor: '—', barColor: 'bg-gray-300' },
];

const ACTIONS = [];

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'calculation', label: 'Calculation' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'actions', label: 'Actions' },
];

const BusinessHealthScore = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <PageShell clientId={clientId}>
      <div className="px-10 py-8">
        <BackButton label="Back to Profitability Analysis" onClick={() => navigate(`/clients/${clientId}/profitability`)} />

        {/* Header */}
        <div className="flex items-start justify-between mb-8 mt-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Business Health Score</h1>
            <p className="text-sm text-gray-500">A single score that summarizes the financial health of your business</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-bold text-green-500">{SCORE}</span>
            <span className="text-xl text-gray-400 font-medium">/100</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <TabBar
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeClass={activeTab === 'actions' ? 'bg-teal-600 text-white' : 'bg-gray-900 text-white'}
          />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">What This Score Means</h2>
            <p className="text-sm text-gray-500 mb-6">Understanding your Business Health Score and what actions to take at each level</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              The Business Health Score combines <strong>profitability, cash flow, revenue stability, expense control, tax compliance, and liquidity</strong> into
              one number between 0 and 100. It gives you a quick, comprehensive view of your business's financial condition — like a credit score, but
              for your entire business.
            </p>
            <HealthCategoryGrid categories={HEALTH_CATEGORIES} currentScore={SCORE} />
          </div>
        )}

        {/* Calculation Tab */}
        {activeTab === 'calculation' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">How the Score is Calculated</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your Business Health Score is a <strong>weighted average</strong> of six financial components. Each component is scored 0-100, then multiplied by its weight to calculate your final score.
            </p>
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Component Weight Distribution</p>
              <div className="flex h-8 rounded-lg overflow-hidden">
                {WEIGHTS.map((w) => (
                  <div key={w.label} className={`${w.color} flex items-center justify-center`} style={{ width: `${w.weight}%` }}>
                    <span className="text-[10px] font-bold text-white">{w.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Business Health Score Formula</p>
            <div className="grid grid-cols-2 gap-4">
              {WEIGHTS.map((w) => (
                <div key={w.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${w.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{w.weight}%</p>
                      <p className="text-xs text-gray-500">{w.label}</p>
                    </div>
                  </div>
                  <div className={`h-2 w-20 ${w.color} rounded-full opacity-30`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Score Component Breakdown</h2>
            <div className="space-y-6">
              {COMPONENTS.map((comp, i) => (
                <ScoreComponentCard key={comp.label} index={i + 1} {...comp} />
              ))}
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Recommended Actions</h2>
            <p className="text-sm text-gray-500 mb-6">Prioritized steps to improve your business health score</p>
            {ACTIONS.length > 0 ? (
              <div className="space-y-4">
                {ACTIONS.map((a, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-gray-900">{a.action}</h4>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{a.impact}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="text-xs text-gray-500">Related to: {a.related}</span>
                        </div>
                        <p className="text-sm text-gray-500">{a.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400 text-center py-8">No recommended actions available</p>}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default BusinessHealthScore;
