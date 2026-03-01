import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitEmailSignup } from '../services/onboardingApi';
import logo from '../assets/Logo.png';

/**
 * EMAIL SIGNUP PAGE
 *
 * First step before onboarding - user enters email to receive verification
 */
function EmailSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await submitEmailSignup(email);

      if (response.status) {
        setSuccess(true);
        // Navigate to email verification after a short delay
        setTimeout(() => {
          navigate('/signup/verify');
        }, 2000);
      } else {
        setError(response.message || 'Failed to send verification email');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Email signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="FileAm Finance" className="h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to FileAm
          </h1>
          <p className="text-sm text-gray-600">
            Start your consultant onboarding journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!success ? (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Get Started
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Enter your email to begin the onboarding process
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                  />
                </div>

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
                  disabled={isLoading || !email}
                  className="w-full px-4 py-3 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isLoading ? 'Sending...' : 'Continue'}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-6">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Sent!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We've sent a verification email to <strong>{email}</strong>
              </p>
              <p className="text-xs text-gray-500">
                Redirecting you to verification...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-brand hover:text-brand/80 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailSignup;
