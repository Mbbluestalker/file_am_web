/**
 * TOKEN UTILITIES
 *
 * Helper functions for JWT token management
 */

/**
 * Decode JWT token payload without verification
 * (Only use for reading non-sensitive data like exp claim)
 */
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 * Returns true if expired, false if still valid
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get token expiration time as a Date object
 */
export const getTokenExpiration = (token) => {
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;

  // Convert exp (seconds) to milliseconds
  return new Date(decoded.exp * 1000);
};

/**
 * Get time remaining until token expires (in milliseconds)
 * Returns negative number if already expired
 */
export const getTimeUntilExpiration = (token) => {
  if (!token) return 0;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return 0;

  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  return expirationTime - currentTime;
};

/**
 * Format time remaining in human-readable format
 * e.g., "2 hours 30 minutes", "45 minutes", "30 seconds"
 */
export const formatTimeRemaining = (milliseconds) => {
  if (milliseconds <= 0) return 'Expired';

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0
      ? `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`
      : `${days} day${days > 1 ? 's' : ''}`;
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`
      : `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`
      : `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  return `${seconds} second${seconds > 1 ? 's' : ''}`;
};

/**
 * Get all decoded token data
 */
export const getTokenInfo = (token) => {
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    decoded,
    isExpired: isTokenExpired(token),
    expiresAt: getTokenExpiration(token),
    timeRemaining: getTimeUntilExpiration(token),
    timeRemainingFormatted: formatTimeRemaining(getTimeUntilExpiration(token)),
  };
};

export default {
  decodeJWT,
  isTokenExpired,
  getTokenExpiration,
  getTimeUntilExpiration,
  formatTimeRemaining,
  getTokenInfo,
};
