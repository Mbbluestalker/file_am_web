import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../services/onboardingApi';

/**
 * PROTECTED ROUTE COMPONENT
 *
 * Checks if user is authenticated before allowing access to route
 * Redirects to login page if no access token is found
 */
const ProtectedRoute = ({ children }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    // No access token - redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is authenticated - render the protected content
  return children;
};

export default ProtectedRoute;
