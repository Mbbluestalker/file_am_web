import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '../services/onboardingApi';

/**
 * PROTECTED ROUTE COMPONENT
 *
 * Checks if user is authenticated before allowing access to route
 * Redirects to login page if no access token is found
 * Redirects to onboarding if consultant onboarding is incomplete
 */
const ProtectedRoute = ({ children }) => {
  const accessToken = getAccessToken();
  const location = useLocation();

  if (!accessToken) {
    // No access token - redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check onboarding status
  const onboardingComplete = localStorage.getItem('enterpriseOnboardingComplete');
  const isOnboardingRoute = location.pathname === '/onboarding';

  // If onboarding is incomplete and user is not on onboarding page, redirect to onboarding
  if (onboardingComplete === 'false' && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding is complete and user tries to access onboarding page, redirect to dashboard
  if (onboardingComplete === 'true' && isOnboardingRoute) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and on correct route - render the protected content
  return children;
};

export default ProtectedRoute;
