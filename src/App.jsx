import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDashboard from './pages/ClientDashboard';
import BusinessProfile from './pages/BusinessProfile';
import ComingSoon from './pages/ComingSoon';

/**
 * MAIN APP COMPONENT
 *
 * Root component with routing configuration.
 * Add your routes here as you build features.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Route */}
        <Route path="/" element={<Dashboard />} />

        {/* Clients Route */}
        <Route path="/clients" element={<Clients />} />

        {/* Client Dashboard Route */}
        <Route path="/clients/:clientId" element={<ClientDashboard />} />

        {/* Business Profile Route */}
        <Route path="/clients/:clientId/business-profile" element={<BusinessProfile />} />

        {/* Client Sub-Routes - Coming Soon */}
        <Route path="/clients/:clientId/financials" element={<ComingSoon />} />
        <Route path="/clients/:clientId/profitability" element={<ComingSoon />} />
        <Route path="/clients/:clientId/tax-computation" element={<ComingSoon />} />
        <Route path="/clients/:clientId/filings" element={<ComingSoon />} />
        <Route path="/clients/:clientId/evidence-vault" element={<ComingSoon />} />

        {/* Main Navigation Routes - Coming Soon */}
        <Route path="/taxgpt" element={<ComingSoon />} />
        <Route path="/reports" element={<ComingSoon />} />
        <Route path="/compliance" element={<ComingSoon />} />
        <Route path="/settings" element={<ComingSoon />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
