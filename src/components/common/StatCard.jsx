/**
 * STAT CARD
 *
 * Props:
 * - label (string) — metric label
 * - value (string|number) — displayed value
 * - sublabel (string) — optional secondary text
 * - icon (ReactNode) — optional icon
 * - isActive (boolean) — highlighted state
 * - onClick (function) — click handler
 */
const StatCard = ({ label, value, sublabel, icon, isActive = false, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-xl border p-4 transition-colors ${
      isActive ? 'border-teal-500 ring-1 ring-teal-500' : 'border-gray-200'
    } ${onClick ? 'cursor-pointer hover:border-gray-300' : ''}`}
  >
    {icon && <div className="mb-2">{icon}</div>}
    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
    {sublabel && <p className="text-[10px] text-gray-400 mt-1">{sublabel}</p>}
  </div>
);

export default StatCard;
