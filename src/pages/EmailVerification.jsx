import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../services/onboardingApi';
import logo from '../assets/Logo.png';

/**
 * EMAIL VERIFICATION PAGE
 *
 * Step 2 of signup - user enters 6-digit verification code
 */
function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get email from localStorage (set in EmailSignup)
  const email = localStorage.getItem('signupEmail') || '';

  // Get optional invitation/company IDs from URL
  const invitationId = searchParams.get('invitationId') || '';
  const companyId = searchParams.get('companyId') || '';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if no email found
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setCode(value);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyEmail({
        email,
        code,
        invitationId,
        companyId
      });

      if (response.status) {
        // Small delay to ensure localStorage is set before navigation
        setTimeout(() => {
          navigate('/signup/password');
        }, 100);
      } else {
        setError(response.message || 'Invalid verification code');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Email verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    // TODO: Implement resend functionality if API supports it
    console.log('Resend code for:', email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="FileAm Finance" className="h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-600">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent text-center text-2xl font-mono tracking-widest"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            {/* Show invitation info if present */}
            {(invitationId || companyId) && (
              <div className="mb-4 bg-brand/10 border border-brand/20 rounded-lg p-3">
                <p className="text-xs text-brand">
                  <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  You're joining via invitation
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full px-4 py-3 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend Code */}
          <div className="text-center mt-6">
            <button
              onClick={handleResendCode}
              className="text-sm text-brand hover:text-brand/80 font-medium"
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/signup')}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            ← Back to email entry
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
