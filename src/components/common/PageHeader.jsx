/**
 * PAGE HEADER
 *
 * Props:
 * - title (string)
 * - subtitle (string)
 * - actions (ReactNode) — rendered on the right
 */
const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex items-start justify-between mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

export default PageHeader;
