import { useState, useEffect } from 'react';
import { getTokenInfo } from '../utils/tokenUtils';
import { getAccessToken } from '../services/onboardingApi';

/**
 * TOKEN DEBUGGER COMPONENT
 *
 * Display token information for debugging purposes
 * Shows expiration time, time remaining, and decoded payload
 */
const TokenDebugger = () => {
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    const updateTokenInfo = () => {
      const token = getAccessToken();
      if (token) {
        const info = getTokenInfo(token);
        setTokenInfo(info);
      } else {
        setTokenInfo(null);
      }
    };

    // Update immediately
    updateTokenInfo();

    // Update every second to show live countdown
    const interval = setInterval(updateTokenInfo, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!tokenInfo) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <h3 className="font-semibold mb-2">Token Status</h3>
        <p className="text-sm text-gray-300">No access token found</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-semibold mb-2">Token Status</h3>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-400">Status: </span>
          <span className={tokenInfo.isExpired ? 'text-red-400' : 'text-green-400'}>
            {tokenInfo.isExpired ? 'Expired' : 'Valid'}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Expires at: </span>
          <span className="text-white">
            {tokenInfo.expiresAt?.toLocaleString()}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Time remaining: </span>
          <span className={tokenInfo.isExpired ? 'text-red-400' : 'text-white'}>
            {tokenInfo.timeRemainingFormatted}
          </span>
        </div>

        {/* Optional: Show decoded payload */}
        <details className="mt-2">
          <summary className="cursor-pointer text-gray-400 hover:text-white">
            View token payload
          </summary>
          <pre className="mt-2 bg-gray-900 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(tokenInfo.decoded, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default TokenDebugger;
