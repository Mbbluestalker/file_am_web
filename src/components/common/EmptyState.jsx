/**
 * EMPTY STATE
 *
 * Props:
 * - message (string) — display text
 * - icon (ReactNode) — optional icon
 * - action (ReactNode) — optional CTA button
 */
const EmptyState = ({ message = 'No data found', icon, action }) => (
  <div className="py-12 text-center">
    {icon && <div className="mb-3 flex justify-center">{icon}</div>}
    <p className="text-sm text-gray-400">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
