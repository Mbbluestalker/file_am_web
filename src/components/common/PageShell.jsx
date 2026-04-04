import Header from '../layout/Header';
import Sidebar from '../client/Sidebar';

/**
 * PAGE SHELL
 * Wraps the recurring Sidebar + Header + main content layout.
 *
 * Props:
 * - clientId (string) — passed to Sidebar
 * - children (ReactNode) — main content
 * - hideSidebar (boolean) — hide sidebar (e.g. Dashboard)
 * - bgColor (string) — main area bg, defaults to 'bg-gray-50'
 */
const PageShell = ({ clientId, children, hideSidebar = false, bgColor = 'bg-gray-50' }) => (
  <div className="h-screen bg-white flex overflow-hidden">
    {!hideSidebar && <Sidebar clientId={clientId} />}
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header hideLogo={!hideSidebar} />
      <main className={`flex-1 overflow-y-auto ${bgColor}`}>
        {children}
      </main>
    </div>
  </div>
);

export default PageShell;
