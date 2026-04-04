/**
 * TAB BAR
 *
 * Props:
 * - tabs (Array<{ id, label }>) — tab definitions
 * - activeTab (string) — currently active tab id
 * - onTabChange (function) — called with tab id
 * - activeClass (string) — override active tab style
 */
const TabBar = ({
  tabs,
  activeTab,
  onTabChange,
  activeClass = 'bg-gray-900 text-white',
}) => (
  <div className="flex gap-1">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === tab.id ? activeClass : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default TabBar;
