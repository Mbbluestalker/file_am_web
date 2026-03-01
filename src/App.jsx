import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDashboard from './pages/ClientDashboard';
import BusinessProfile from './pages/BusinessProfile';
import TaxComputation from './pages/TaxComputation';
import Financials from './pages/Financials';
import ReviewInvoice from './pages/ReviewInvoice';
import ComingSoon from './pages/ComingSoon';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import EmailSignup from './pages/EmailSignup';
import EmailVerification from './pages/EmailVerification';
import SetPassword from './pages/SetPassword';
import ProtectedRoute from './components/ProtectedRoute';

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
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Signup Flow (Pre-onboarding) */}
        <Route path="/signup" element={<EmailSignup />} />
        <Route path="/signup/verify" element={<EmailVerification />} />
        <Route path="/signup/password" element={<SetPassword />} />

        {/* Onboarding Route - Protected */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />

        {/* Dashboard Route - Protected */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Clients Route - Protected */}
        <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        } />

        {/* Client Dashboard Route - Protected */}
        <Route path="/clients/:clientId" element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        } />

        {/* Business Profile Route - Protected */}
        <Route path="/clients/:clientId/business-profile" element={
          <ProtectedRoute>
            <BusinessProfile />
          </ProtectedRoute>
        } />

        {/* Tax Computation Route - Protected */}
        <Route path="/clients/:clientId/tax-computation" element={
          <ProtectedRoute>
            <TaxComputation />
          </ProtectedRoute>
        } />

        {/* Financials Route - Protected */}
        <Route path="/clients/:clientId/financials" element={
          <ProtectedRoute>
            <Financials />
          </ProtectedRoute>
        } />

        {/* Review Invoice Route - Protected */}
        <Route path="/clients/:clientId/financials/review/:invoiceId" element={
          <ProtectedRoute>
            <ReviewInvoice />
          </ProtectedRoute>
        } />

        {/* Client Sub-Routes - Coming Soon - Protected */}
        <Route path="/clients/:clientId/profitability" element={
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        } />
        <Route path="/clients/:clientId/filings" element={
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        } />
        <Route path="/clients/:clientId/evidence-vault" element={
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        } />

        {/* Main Navigation Routes - Coming Soon - Protected */}
        <Route path="/taxgpt" element={
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        } />
        <Route path="/compliance" element={
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
