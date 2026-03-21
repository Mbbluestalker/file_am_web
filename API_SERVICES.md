# API Services Documentation

This document describes the reorganized API service layer for FileAm Web Application.

## Overview

The API services have been reorganized into separate, purpose-specific modules for better maintainability and code organization. All services are located in `src/services/`.

## Structure

```
src/services/
├── apiConfig.js              # Base API configuration & request handler
├── authApi.js                # Authentication & password recovery
├── clientApi.js              # Client management & business profiles
├── taxApi.js                 # Tax computation & VAT calculations (NEW)
├── consultantOnboardingApi.js # Consultant onboarding steps
├── onboardingApi.js          # Legacy file (will be deprecated)
└── index.js                  # Central export point
```

## Import Patterns

### Option 1: Named imports (Recommended)
```javascript
import { login, logout } from '../services/authApi';
import { getClients, getClientById } from '../services/clientApi';
import { getTaxSummary, calculateVat } from '../services/taxApi';
```

### Option 2: Via index file
```javascript
import { login, getClients, getTaxSummary } from '../services';
```

### Option 3: Default object imports
```javascript
import authApi from '../services/authApi';
import clientApi from '../services/clientApi';
import taxApi from '../services/taxApi';

// Usage
await authApi.login(email, password);
await clientApi.getClients();
await taxApi.getTaxSummary(clientId);
```

---

## API Services Reference

### 1. apiConfig.js

Base configuration and shared utilities.

**Exports:**
- `BASE_URL` - API base URL
- `API_VERSION` - API version number
- `getAccessToken()` - Get stored access token
- `makeRequest(endpoint, method, data, customHeaders)` - Generic API request handler
- `uploadFile(file)` - Upload media files

**Example:**
```javascript
import { makeRequest, uploadFile } from '../services/apiConfig';

// Custom API call
const response = await makeRequest('/api/v1/custom-endpoint', 'POST', data);

// Upload file
const fileResult = await uploadFile(myFile);
```

---

### 2. authApi.js

Authentication and account management.

#### Functions

##### `login(email, password)`
Authenticate user and store tokens.

**Returns:** `{ status, message, data: { accessToken, refreshToken, user, ... } }`

**Example:**
```javascript
import { login } from '../services/authApi';

try {
  const result = await login('user@example.com', 'password123');
  console.log('Logged in:', result.data.user);
  // Tokens are automatically stored in localStorage
} catch (error) {
  console.error('Login failed:', error.message);
}
```

##### `logout()`
Clear all authentication data from localStorage.

```javascript
import { logout } from '../services/authApi';

logout(); // Clears all tokens and user data
```

##### `forgotPassword(email)`
Send password reset code to email.

##### `resetPassword(email, code, newPassword)`
Reset password using verification code.

##### `submitEmailSignup(email)`
Submit email for signup (pre-onboarding).

##### `verifyEmail({ email, code, invitationId, companyId })`
Verify email with 6-digit code.

##### `setPassword({ password, firstName, lastName })`
Set password and complete account creation.

---

### 3. clientApi.js

Client management, business profiles, and invitations.

#### Client Management

##### `getClients()`
Fetch all clients for authenticated consultant.

**Returns:** `{ status, message, data: [{ id, businessName, email, ... }] }`

**Example:**
```javascript
import { getClients } from '../services/clientApi';

const response = await getClients();
const clients = response.data;
```

##### `getClientById(clientId)`
Fetch single client by ID.

```javascript
import { getClientById } from '../services/clientApi';

const response = await getClientById('client-uuid');
const client = response.data;
```

#### Business Profiles

##### `getBusinessProfile(companyId)`
Get business profile for a client.

##### `updateBusinessProfile(companyId, profileData)`
Update business profile.

**Example:**
```javascript
import { updateBusinessProfile } from '../services/clientApi';

await updateBusinessProfile('company-id', {
  businessType: 'Limited Liability Company',
  industry: 'Technology',
  // ... other profile fields
});
```

##### `getBusinessTypes()`
Get available business types for dropdown.

##### `getIndustries()`
Get available industries for dropdown.

#### Invitations

##### `searchBusinesses(query)`
Search for existing businesses on FileAm.

**Example:**
```javascript
import { searchBusinesses } from '../services/clientApi';

const results = await searchBusinesses('TechCorp');
```

##### `sendBusinessInvitation(invitationData)`
Invite a new business to join FileAm.

**Example:**
```javascript
import { sendBusinessInvitation } from '../services/clientApi';

await sendBusinessInvitation({
  invitedBusinessName: 'TechCorp Solutions',
  invitedContactName: 'John Doe',
  invitedEmail: 'john@techcorp.com',
  invitedRcNumber: 'RC123456',
  invitedPhone: '+2348012345678',
  stateOfOperation: 'Lagos',
  taxTypesManaged: ['VAT', 'CIT'],
  expiresInHours: 168
});
```

##### `requestClientManagementAccess(requestedUserId)`
Request access to existing business.

##### `acceptTeamInvitation(invitationId)`
Accept team invitation.

#### Financials

##### `getInvoices(companyId, page = 1, limit = 10)`
Get invoices for a client with pagination.

---

### 4. taxApi.js ⭐ NEW

Tax computation, VAT calculations, and threshold monitoring.

#### Tax Configuration

##### `updateTaxConfiguration(clientId, config)`
Configure which tax types apply to a client.

**Example:**
```javascript
import { updateTaxConfiguration } from '../services/taxApi';

await updateTaxConfiguration('client-id', {
  vat: true,
  paye: false,
  wht: true,
  cit: false
});
```

##### `getTaxConfiguration(clientId)`
Get current tax configuration.

#### Tax Summary

##### `getTaxSummary(clientId)`
Get overall tax summary with monthly breakdown.

**Returns:**
```javascript
{
  status: true,
  message: "Tax summary",
  data: {
    totalVatPayable: 356984,
    lastComputation: null,
    monthlyBreakdown: [
      { month: 2, year: 2026, vatPayable: 111688 },
      { month: 1, year: 2026, vatPayable: 71816 },
      // ...
    ]
  }
}
```

**Example:**
```javascript
import { getTaxSummary } from '../services/taxApi';

const summary = await getTaxSummary('client-id');
console.log('Total VAT:', summary.data.totalVatPayable);
console.log('Monthly:', summary.data.monthlyBreakdown);
```

#### VAT Computation

##### `getVatComputationStatus(clientId)`
Check if company has VAT data.

**Returns:** `{ status: true, data: { hasVatData: boolean } }`

##### `calculateVat(clientId, calculationData)`
Calculate VAT for a specific period.

**Example:**
```javascript
import { calculateVat } from '../services/taxApi';

await calculateVat('client-id', {
  vatType: 'standard',
  vatPeriod: '2026-01',
  startDate: '2026-01-01',
  endDate: '2026-01-31'
});
```

##### `getVatComputationResults(clientId)`
Get latest VAT computation results.

#### Threshold Status

##### `getThresholdStatus(clientId)`
Get VAT threshold status (below/approaching/above).

**Returns:**
```javascript
{
  status: true,
  data: {
    id: "uuid",
    companyId: "uuid",
    status: "below", // or "approaching", "above"
    message: "This business turnover...",
    belowThreshold: true,
    turnoverThreshold: 25000000
  }
}
```

**Example:**
```javascript
import { getThresholdStatus } from '../services/taxApi';

const threshold = await getThresholdStatus('client-id');
if (threshold.data.status === 'approaching') {
  alert('Client approaching VAT threshold!');
}
```

#### Tax Chart & Assumptions

##### `getTaxComputationChart(clientId)`
Get monthly turnover chart data.

**Returns:**
```javascript
{
  status: true,
  data: {
    totalTurnOver: 3542766.78,
    chartSet: [
      { month: 1, year: 2026, label: "Jan 2026", amount: 2325637.69 },
      // ... 12 months
    ],
    status: "This business is not required to charge for VAT",
    turnoverStatement: "Turnover (N3,542,766.78) is below N25,000,000 threshold"
  }
}
```

**Example:**
```javascript
import { getTaxComputationChart } from '../services/taxApi';

const chart = await getTaxComputationChart('client-id');
console.log('Total Turnover:', chart.data.totalTurnOver);
console.log('Monthly Data:', chart.data.chartSet);
```

##### `getTaxAssumptions(clientId)`
Get tax assumptions (VAT status, CIT rate, exemptions).

**Returns:**
```javascript
{
  status: true,
  data: {
    vatRegistrationStatus: "Unregistered",
    applicationCitRate: 30,
    msmeExemptionEligible: "No",
    pioneerTaxStatus: "Not Applicable"
  }
}
```

##### `updateTaxAssumptions(clientId, assumptions)`
Update tax assumptions.

---

### 5. consultantOnboardingApi.js

Consultant onboarding process (7 steps + activation).

#### Onboarding Steps

- `submitStep1(data)` - Firm Identity & Legal Structure
- `submitStep2(data)` - Partners & Ownership
- `submitStep3(data)` - Additional Partners
- `submitStep4(data)` - Scope of Practice
- `submitStep5(data)` - Subscription & Service Calendar
- `submitStep6(data)` - Payment Collection Setup
- `submitStep7(data)` - Compliance & Verification

#### Onboarding Management

- `activateAccount()` - Final activation
- `getOnboardingProfile()` - Get profile for prefilling
- `getOnboardingStatus()` - Get current progress
- `saveDraft(step, data)` - Save draft

#### File Upload

- `uploadFile(file)` - Upload compliance documents

**Example:**
```javascript
import { submitStep1, uploadFile } from '../services/consultantOnboardingApi';

// Upload document first
const fileResult = await uploadFile(cacDocument);

// Submit step with file URL
await submitStep1({
  firmName: 'Consulting Partners Ltd',
  rcNumber: 'RC123456',
  cacDocumentUrl: fileResult.data.url
});
```

---

## Migration Guide

### Old vs New

**OLD (onboardingApi.js):**
```javascript
import {
  getClients,
  getVatComputationStatus,
  login
} from '../services/onboardingApi';
```

**NEW (Organized):**
```javascript
import { login } from '../services/authApi';
import { getClients } from '../services/clientApi';
import { getVatComputationStatus } from '../services/taxApi';
```

### Files to Update

When migrating existing code, update imports in these files:

1. **Pages:**
   - `src/pages/Clients.jsx` ✅ (Already updated)
   - `src/pages/Login.jsx`
   - `src/pages/TaxComputation.jsx`
   - `src/pages/BusinessProfile.jsx`
   - `src/pages/Onboarding.jsx`

2. **Components:**
   - `src/components/ProtectedRoute.jsx`
   - `src/components/modals/AddBusinessOwnerModal.jsx`

3. **Update pattern:**
   ```javascript
   // Find
   import { functionName } from '../services/onboardingApi';

   // Replace with appropriate new service
   import { functionName } from '../services/authApi';
   // or
   import { functionName } from '../services/clientApi';
   // or
   import { functionName } from '../services/taxApi';
   ```

---

## Best Practices

### Error Handling

All API functions throw errors that should be caught:

```javascript
import { getTaxSummary } from '../services/taxApi';

try {
  const summary = await getTaxSummary(clientId);
  // Handle success
} catch (error) {
  console.error('Failed to fetch tax summary:', error.message);
  // Show user-friendly error
}
```

### Loading States

Always use loading states with API calls:

```javascript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const result = await getTaxSummary(clientId);
    setData(result.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

### Token Management

Tokens are automatically managed by the API services:
- Stored in localStorage on login
- Included in all authenticated requests
- Cleared on logout

Access token is retrieved via `getAccessToken()` from `apiConfig.js`.

---

## Testing API Endpoints

### Using Browser Console

```javascript
// Import service
import { getTaxSummary } from '../services/taxApi';

// Test endpoint
getTaxSummary('client-id')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Common Response Format

All endpoints follow this format:

```javascript
{
  status: true,      // boolean
  message: "...",    // string
  data: { ... }      // object or array
}
```

---

## Environment Configuration

API base URL is configured in `src/services/apiConfig.js`:

```javascript
export const BASE_URL = 'https://api-v2.fileam.app';
export const API_VERSION = '1';
```

For different environments (dev/staging/prod), you can:

1. **Option 1:** Use environment variables
```javascript
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-v2.fileam.app';
```

2. **Option 2:** Create environment-specific config files

---

## Troubleshooting

### Common Issues

1. **"API Request Error: Failed to fetch"**
   - Network issue or API server down
   - Check CORS configuration
   - Verify API base URL

2. **"Access token not found"**
   - User not logged in
   - Token expired
   - localStorage cleared

3. **"API Error: 401"**
   - Invalid or expired token
   - User needs to re-login

### Debug Mode

Add logging to `makeRequest` in `apiConfig.js`:

```javascript
export const makeRequest = async (endpoint, method = 'GET', data = null) => {
  console.log('[API Request]', method, endpoint, data);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json();

    console.log('[API Response]', endpoint, result);
    return result;
  } catch (error) {
    console.error('[API Error]', endpoint, error);
    throw error;
  }
};
```

---

## Roadmap

### Future Enhancements

- [ ] Add request/response interceptors
- [ ] Implement automatic token refresh
- [ ] Add request caching
- [ ] Create React hooks (useClients, useTaxSummary, etc.)
- [ ] Add TypeScript definitions
- [ ] Implement retry logic for failed requests
- [ ] Add request cancellation support

---

## Support

For API-related questions:
1. Check this documentation
2. Review `CLAUDE.md` for project overview
3. Inspect Network tab in browser DevTools
4. Check API response format and error messages

**Last Updated:** 2026-03-20
