import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDashboard from './pages/ClientDashboard';
import BusinessProfile from './pages/BusinessProfile';
import TaxComputation from './pages/TaxComputation';
import Financials from './pages/Financials';
import FinancialReports from './pages/FinancialReports';
import ProcessingDocument from './pages/ProcessingDocument';
import ReviewInvoice from './pages/ReviewInvoice';
import Filings from './pages/Filings';
import FilingDetail from './pages/FilingDetail';
import SubmitVATReturn from './pages/SubmitVATReturn';
import PaymentConfirmation from './pages/PaymentConfirmation';
import EvidenceVault from './pages/EvidenceVault';
import DocumentDetail from './pages/DocumentDetail';
import Settings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import EmailSignup from './pages/EmailSignup';
import EmailVerification from './pages/EmailVerification';
import SetPassword from './pages/SetPassword';
import ForgotPassword from './pages/ForgotPassword';
import VerifyResetCode from './pages/VerifyResetCode';
import AcceptInvitation from './pages/AcceptInvitation';
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
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
          },
          success: {
            iconTheme: {
              primary: '#0d9488',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Signup Flow (Pre-onboarding) */}
        <Route path="/signup" element={<EmailSignup />} />
        <Route path="/signup/verify" element={<EmailVerification />} />
        <Route path="/signup/password" element={<SetPassword />} />

        {/* Forgot Password Flow */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/verify" element={<VerifyResetCode />} />

        {/* Accept Invitation Route */}
        <Route path="/invitations/:invitationId/accept/:code" element={<AcceptInvitation />} />

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

        {/* Financial Reports Route - Protected */}
        <Route path="/clients/:clientId/financials/reports" element={
          <ProtectedRoute>
            <FinancialReports />
          </ProtectedRoute>
        } />

        {/* Processing Document Route - Protected */}
        <Route path="/clients/:clientId/financials/processing" element={
          <ProtectedRoute>
            <ProcessingDocument />
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

        {/* Filings Routes - Protected */}
        <Route path="/filings" element={
          <ProtectedRoute>
            <Filings />
          </ProtectedRoute>
        } />
        <Route path="/filings/:id" element={
          <ProtectedRoute>
            <FilingDetail />
          </ProtectedRoute>
        } />
        <Route path="/filings/:id/submit" element={
          <ProtectedRoute>
            <SubmitVATReturn />
          </ProtectedRoute>
        } />
        <Route path="/filings/:id/confirmation" element={
          <ProtectedRoute>
            <PaymentConfirmation />
          </ProtectedRoute>
        } />

        {/* Evidence Vault Routes - Protected */}
        <Route path="/evidence-vault" element={
          <ProtectedRoute>
            <EvidenceVault />
          </ProtectedRoute>
        } />
        <Route path="/evidence-vault/:id" element={
          <ProtectedRoute>
            <DocumentDetail />
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
            <Settings />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
