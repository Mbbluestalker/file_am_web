/**
 * PROGRESS BAR
 *
 * Props:
 * - value (number) — 0-100 percentage
 * - color (string) — Tailwind bg class for fill
 * - height (string) — Tailwind height class
 * - showLabel (boolean) — display percentage text
 */
const ProgressBar = ({
  value = 0,
  color = 'bg-teal-500',
  height = 'h-2',
  showLabel = false,
}) => (
  <div className="flex items-center gap-2">
    <div className={`flex-1 ${height} bg-gray-100 rounded-full overflow-hidden`}>
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
    {showLabel && <span className="text-xs font-semibold text-gray-700 w-8 text-right">{value}%</span>}
  </div>
);

export default ProgressBar;
