# FileAm Finance - Web Application

A comprehensive React-based tax compliance and accounting management platform for Nigerian tax consultants and their clients.

## Project Overview

**FileAm Finance** is a modern web application built to streamline tax compliance, client management, financial tracking, and regulatory filings for tax consulting firms in Nigeria. The platform features a multi-step consultant onboarding process, client dashboard, tax computation tools, and compliance management.

### Key Features

- Multi-step consultant onboarding (7 steps + review)
- Client management and dashboard
- Tax computation and filings management
- Business profile and financial tracking
- Evidence vault for document management
- Authentication flow with email verification
- Password recovery system
- Protected routes with JWT-based authentication

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| Vite | 7.2.4 | Build tool and dev server |
| React Router DOM | 7.13.0 | Client-side routing |
| Redux Toolkit | 2.11.2 | State management |
| Axios | 1.13.5 | HTTP client |
| Tailwind CSS | 4.1.18 | Utility-first CSS framework |
| Lucide React | 0.575.0 | Icon library |

## Project Structure

```
file_am_web/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, logos, and static files
│   ├── components/           # React components (29 files)
│   │   ├── common/          # Reusable UI components
│   │   │   ├── AlertBanner.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── TextInput.jsx
│   │   ├── layout/          # Layout components
│   │   │   └── Header.jsx
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── MetricCard.jsx
│   │   │   └── ActivityItem.jsx
│   │   ├── onboarding/      # Onboarding flow components
│   │   │   ├── StepProgressSidebar.jsx
│   │   │   ├── StepWrapper.jsx
│   │   │   └── steps/       # Individual onboarding steps
│   │   │       ├── FirmIdentityStep.jsx
│   │   │       ├── PartnersOwnershipStep.jsx
│   │   │       ├── AdditionalPartnersStep.jsx
│   │   │       ├── ScopeOfPracticeStep.jsx
│   │   │       ├── SubscriptionStep.jsx
│   │   │       ├── PaymentSetupStep.jsx
│   │   │       ├── ComplianceStep.jsx
│   │   │       └── ReviewActivateStep.jsx
│   │   ├── client/          # Client-specific components
│   │   │   ├── ClientHeader.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaxBreakdownChart.jsx
│   │   │   └── TaxObligationRow.jsx
│   │   ├── businessProfile/ # Business profile components
│   │   │   └── SystemEvaluation.jsx
│   │   ├── modals/          # Modal dialogs
│   │   │   ├── ProcessingDocumentModal.jsx
│   │   │   ├── UploadInvoiceModal.jsx
│   │   │   └── AddBusinessOwnerModal.jsx
│   │   ├── clients/         # Client management
│   │   │   └── ClientCard.jsx
│   │   ├── ProtectedRoute.jsx  # Route authentication wrapper
│   │   ├── TokenDebugger.jsx   # Development token debugger
│   │   └── Toast.jsx           # Toast notification component
│   ├── pages/                # Page components (21 files)
│   │   ├── auth/            # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── EmailSignup.jsx
│   │   │   ├── EmailVerification.jsx
│   │   │   ├── SetPassword.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── VerifyResetCode.jsx
│   │   ├── dashboard/       # Main application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── ClientDashboard.jsx
│   │   │   ├── BusinessProfile.jsx
│   │   │   ├── TaxComputation.jsx
│   │   │   ├── Financials.jsx
│   │   │   ├── ReviewInvoice.jsx
│   │   │   ├── Filings.jsx
│   │   │   ├── FilingDetail.jsx
│   │   │   ├── SubmitVATReturn.jsx
│   │   │   ├── PaymentConfirmation.jsx
│   │   │   ├── EvidenceVault.jsx
│   │   │   └── DocumentDetail.jsx
│   │   ├── Onboarding.jsx   # Multi-step onboarding
│   │   └── ComingSoon.jsx   # Placeholder for future features
│   ├── services/            # API services
│   │   ├── api.js          # Base API configuration
│   │   └── onboardingApi.js # Onboarding and auth API calls
│   ├── store/              # Redux store
│   │   ├── api/           # RTK Query API slices
│   │   ├── slices/        # Redux slices
│   │   └── store.js       # Store configuration
│   ├── utils/             # Utility functions
│   │   ├── constants.js   # Application constants
│   │   └── tokenUtils.js  # Token management utilities
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React Context providers
│   ├── data/              # Mock/static data
│   │   └── clientsData.js
│   ├── App.jsx            # Root component with routing
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles with Tailwind
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── vercel.json            # Vercel deployment config
```

## API Integration

### Base Configuration

**API Base URL:** `https://api-v2.fileam.app`
**API Version:** `v1`

### Authentication Flow

The application uses JWT-based authentication with the following flow:

1. **Email Signup** → `/api/v1/enterprise/onboarding/step/email`
2. **Email Verification** → `/api/v1/enterprise/onboarding/step/email-verify`
3. **Set Password** → `/api/v1/enterprise/onboarding/step/password`
4. **Login** → `/api/v1/enterprise/auth/login`

### Token Management

Tokens are stored in localStorage:
- `accessToken` - Primary authentication token
- `refreshToken` - Token refresh mechanism
- `userData` - User profile information
- `enterpriseOnboardingComplete` - Onboarding status flag
- `enterpriseOnboardingStep` - Current onboarding step

### Onboarding API Endpoints

The consultant onboarding process consists of 7 steps plus activation:

| Step | Endpoint | Purpose |
|------|----------|---------|
| 1 | `/api/v1/enterprise/consultant-onboarding/step/1` | Firm Identity & Legal Structure |
| 2 | `/api/v1/enterprise/consultant-onboarding/step/2` | Partners & Ownership Structure |
| 3 | `/api/v1/enterprise/consultant-onboarding/step/3` | Additional Partner Details |
| 4 | `/api/v1/enterprise/consultant-onboarding/step/4` | Scope of Practice & Expertise |
| 5 | `/api/v1/enterprise/consultant-onboarding/step/5` | Subscription & Service Calendar |
| 6 | `/api/v1/enterprise/consultant-onboarding/step/6` | Payment Collection Setup |
| 7 | `/api/v1/enterprise/consultant-onboarding/step/7` | Compliance & Verification |
| Activate | `/api/v1/enterprise/consultant-onboarding/activate` | Account Activation |

### Supporting Endpoints

- **Get Profile:** `/api/v1/enterprise/consultant-onboarding/profile` (GET)
- **Get Status:** `/api/v1/enterprise/consultant-onboarding/status` (GET)
- **Upload Media:** `/api/v1/media/upload` (POST, multipart/form-data)
- **Save Draft:** `/api/v1/enterprise/consultant-onboarding/draft` (POST)

### Password Recovery

1. **Forgot Password** → `/api/v1/enterprise/auth/forgot-password`
2. **Reset Password** → `/api/v1/enterprise/auth/reset-password`

## Routing Structure

### Public Routes
- `/login` - User login
- `/signup` - Email signup
- `/signup/verify` - Email verification
- `/signup/password` - Password setup
- `/forgot-password` - Password recovery initiation
- `/forgot-password/verify` - Reset code verification

### Protected Routes (requires authentication)

All routes below require a valid `accessToken` in localStorage. Unauthenticated users are redirected to `/login`.

#### Onboarding
- `/onboarding` - Multi-step consultant onboarding

#### Dashboard & Clients
- `/` - Main dashboard
- `/clients` - Client list
- `/clients/:clientId` - Client dashboard
- `/clients/:clientId/business-profile` - Business profile
- `/clients/:clientId/tax-computation` - Tax computation
- `/clients/:clientId/financials` - Financial overview
- `/clients/:clientId/financials/review/:invoiceId` - Invoice review

#### Filings
- `/filings` - Filings list
- `/filings/:id` - Filing details
- `/filings/:id/submit` - Submit VAT return
- `/filings/:id/confirmation` - Payment confirmation

#### Evidence Vault
- `/evidence-vault` - Document vault
- `/evidence-vault/:id` - Document details

#### Coming Soon
- `/taxgpt` - Tax GPT feature
- `/reports` - Reports module
- `/compliance` - Compliance dashboard
- `/settings` - Settings page
- `/clients/:clientId/profitability` - Client profitability
- `/clients/:clientId/filings` - Client filings
- `/clients/:clientId/evidence-vault` - Client evidence vault

## State Management

### Redux Store Configuration

Store located at `src/store/store.js` with the following setup:

```javascript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // Reducers can be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
```

**Note:** Currently, the store has no reducers configured. State management can be extended by:
1. Creating slices in `src/store/slices/`
2. Creating RTK Query APIs in `src/store/api/`
3. Registering them in the store configuration

### Local State Management

Most components use React's `useState` and `useEffect` hooks for local state management. The onboarding flow maintains state across steps using a parent state object in `Onboarding.jsx`.

## Styling

### Tailwind CSS Configuration

The application uses Tailwind CSS v4 with custom theme extensions:

```javascript
// tailwind.config.js
{
  colors: {
    'brand': {
      DEFAULT: '#006F6F',
      50: '#E6F5F5',
      // ... gradient scale 100-900
    },
    'success': {
      DEFAULT: '#91D6A8',
      bg: '#004617',
      text: '#91D6A8',
    },
    'vat-bg': '#FFF6ED',
    'filing-bg': '#F9F9F9',
  }
}
```

### Color Palette

- **Primary Brand Color:** Teal (`#006F6F`)
- **Success Color:** Green (`#91D6A8`)
- **Layout:** Uses responsive Tailwind utility classes
- **Typography:** Default Tailwind font stack

### Common Patterns

- Cards: `bg-white rounded-xl shadow-lg p-6`
- Buttons: `bg-brand text-white rounded-lg hover:bg-brand/90`
- Inputs: `border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand`

## Development

### Prerequisites
- Node.js (recommended: v18+)
- npm or yarn

### Installation

```bash
cd file_am_web
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api-v2.fileam.app
```

**Note:** The API base URL is currently hardcoded in `src/services/onboardingApi.js` as `https://api-v2.fileam.app`. Consider moving this to environment variables for flexibility.

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Key Components

### ProtectedRoute Component

`src/components/ProtectedRoute.jsx`

Wraps protected routes and checks for valid authentication:

```javascript
const ProtectedRoute = ({ children }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

### Onboarding Flow

`src/pages/Onboarding.jsx`

Multi-step wizard with 8 total steps (7 data collection + 1 review):

1. Firm Identity & Legal Structure
2. Partners & Ownership Structure
3. Additional Partner Details
4. Scope of Practice & Expertise
5. Subscription & Service Calendar
6. Payment Collection Setup
7. Compliance & Verification
8. Review & Activate

Each step component:
- Receives data from parent state
- Validates input
- Calls appropriate API endpoint
- Triggers navigation to next step

### Dashboard Page

`src/pages/Dashboard.jsx`

Main landing page after login featuring:
- Key metrics cards (Total Clients, Tax Due, Potential Savings, Compliance Alerts)
- Recent activity feed
- Navigation header

## Architecture Patterns

### Component Organization

1. **Common Components** (`src/components/common/`)
   - Reusable UI elements
   - Exported from `index.js` for easy imports

2. **Feature Components** (`src/components/[feature]/`)
   - Feature-specific components grouped by domain
   - Examples: `onboarding/`, `client/`, `dashboard/`

3. **Page Components** (`src/pages/`)
   - Top-level route components
   - Compose smaller components

### API Service Layer

All API calls are centralized in `src/services/`:

- `api.js` - Base API configuration with generic request handler
- `onboardingApi.js` - Authentication and onboarding-specific endpoints

**Benefits:**
- Centralized error handling
- Consistent authentication header management
- Easy to mock for testing

### Authentication Flow

1. User enters email → stores in localStorage
2. Verifies email code → receives `onboardingToken`
3. Sets password → receives `accessToken` and `refreshToken`
4. Access token used for all authenticated requests
5. Token checked by `ProtectedRoute` on navigation

## Common Development Tasks

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`:
   ```javascript
   <Route path="/your-path" element={
     <ProtectedRoute>
       <YourPage />
     </ProtectedRoute>
   } />
   ```

### Adding a New API Endpoint

1. Add function in `src/services/onboardingApi.js`:
   ```javascript
   export const yourEndpoint = async (data) => {
     const response = await makeRequest(
       `/api/v1/your/endpoint`,
       'POST',
       data
     );
     return response;
   };
   ```

### Creating a Redux Slice

1. Create file in `src/store/slices/yourSlice.js`
2. Import and add to store in `src/store/store.js`:
   ```javascript
   import yourReducer from './slices/yourSlice';

   const store = configureStore({
     reducer: {
       yourFeature: yourReducer,
     },
     // ...
   });
   ```

### Adding a Common Component

1. Create component in `src/components/common/YourComponent.jsx`
2. Export from `src/components/common/index.js`:
   ```javascript
   export { default as YourComponent } from './YourComponent';
   ```
3. Import: `import { YourComponent } from '../components/common';`

## Deployment

### Vercel Configuration

The project includes `vercel.json` for deployment:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures client-side routing works correctly on Vercel.

### Build Process

1. Build: `npm run build`
2. Deploy `dist/` directory to your hosting provider
3. Ensure environment variables are configured

## Known Issues & Considerations

1. **CORS in Development:** The API may have CORS restrictions during local development. The onboarding flow handles this gracefully by continuing with an empty form.

2. **Token Storage:** Tokens are stored in localStorage, which is vulnerable to XSS attacks. Consider using httpOnly cookies for production.

3. **Error Handling:** API errors are logged to console but may need more robust user-facing error messages.

4. **Redux State:** The Redux store is configured but currently unused. Most state is managed locally in components.

5. **TypeScript:** The project uses JavaScript. Consider migrating to TypeScript for better type safety.

6. **Testing:** No test files are present. Consider adding Jest + React Testing Library.

## Best Practices

### Code Style

1. **Component Structure:** Keep components small and focused
2. **File Naming:** PascalCase for components, camelCase for utilities
3. **Import Order:** External imports → Internal imports → Styles
4. **Comments:** Add JSDoc comments for functions and components
5. **Error Handling:** Always handle errors in API calls and async operations

### Git Workflow

Current branch: `main`
Recent commits focus on:
- Evidence vault UI
- Filings page design
- Password recovery implementation
- Consultant signup and onboarding
- UI design updates

## Future Enhancements

### Planned Features (marked as "Coming Soon")

- TaxGPT - AI-powered tax assistant
- Reports - Advanced reporting module
- Compliance Dashboard - Regulatory compliance tracking
- Settings - User and firm settings
- Client Profitability Analysis
- Client-specific Filings view
- Client-specific Evidence Vault

### Suggested Improvements

1. **TypeScript Migration:** Add type safety
2. **Unit Tests:** Add Jest + React Testing Library
3. **E2E Tests:** Add Cypress or Playwright
4. **Error Boundaries:** Add React error boundaries
5. **Loading States:** Consistent loading indicators
6. **Toast Notifications:** Implement global toast system
7. **Form Validation:** Add Formik or React Hook Form
8. **API Mocking:** Add MSW for development/testing
9. **Performance:** Code splitting and lazy loading
10. **Accessibility:** Add ARIA labels and keyboard navigation

## Support & Resources

- **Project Structure Doc:** `PROJECT_STRUCTURE.md`
- **README:** `README.md`
- **Environment Template:** `.env.example`

## Developer Notes

### Token Debugger

In development mode, a `TokenDebugger` component is visible showing:
- Access token presence
- Refresh token presence
- User data
- Onboarding status

Located at `src/components/TokenDebugger.jsx`

### API Request Pattern

Standard pattern for authenticated requests:

```javascript
const makeRequest = async (endpoint, method, data) => {
  const accessToken = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  return response.json();
};
```

### File Upload Pattern

For file uploads (e.g., compliance documents):

```javascript
const formData = new FormData();
formData.append('file', file);

const response = await fetch(`${BASE_URL}/api/v1/media/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  body: formData,
});
```

## Component Count Summary

- **Total Components:** 29 files
- **Total Pages:** 21 files
- **Common Components:** 4 (AlertBanner, Dropdown, SearchBar, TextInput)
- **Onboarding Steps:** 8 components
- **Layout Components:** 1 (Header)
- **Dashboard Components:** 2 (MetricCard, ActivityItem)

---

**Last Updated:** 2026-03-06
**Project Version:** 0.0.0
**App Name:** File AM Web
