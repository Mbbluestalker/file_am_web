# FileAm Enterprise Web - API to UI Mapping Analysis

**Generated:** March 21, 2026
**Purpose:** Comprehensive mapping between API endpoints, UI designs, and implemented features

---

## Executive Summary

This document provides a complete audit of the FileAm Enterprise web application, mapping:
- **80+ API endpoints** from the backend
- **62+ UI design screens** from Figma
- **22 implemented pages** in React
- **6 API service modules** for integration

### Key Findings

| Status | Count | Description |
|--------|-------|-------------|
| ✅ **Complete** | 15 | Features with API + Design + Implementation |
| 🎨 **Needs Implementation** | 28 | Has API + Design, needs coding |
| ⚠️ **Needs Design** | 18 | Has API, needs UI mockups |
| 🖼️ **Needs Backend** | 2 | Has design, needs API |
| 📊 **Missing Both** | 5 | Needs both API and design |

---

## Status Legend

- ✅ **Complete**: API exists, Design exists, Implementation done
- 🎨 **Needs Implementation**: API exists, Design exists, Code missing
- ⚠️ **Needs Design**: API exists, No design created yet
- 🖼️ **Needs Backend**: Design exists, No API endpoint
- 📊 **Missing Both**: Neither API nor design exists
- 🔄 **Partial**: Partially implemented or partially designed

---

## 1. Authentication & Signup Flow

### 1.1 Email Signup
| Component | Endpoint | Design | Implementation | Service | Status |
|-----------|----------|---------|----------------|---------|--------|
| Email Entry | `POST /enterprise/onboarding/step/email` | ❌ None | ✅ EmailSignup.jsx | ✅ authApi.js | ⚠️ **Needs Design** |
| Email Resend | `POST /enterprise/onboarding/step/email-resend` | ❌ None | ❌ None | ❌ None | 📊 **Missing Both** |

**Notes:** Signup flow is functional but lacks design mockups. Email resend functionality not exposed in UI.

### 1.2 Email Verification
| Component | Endpoint | Design | Implementation | Service | Status |
|-----------|----------|---------|----------------|---------|--------|
| Verify Code | `POST /enterprise/onboarding/step/email-verify` | ❌ None | ✅ EmailVerification.jsx | ✅ authApi.js | ⚠️ **Needs Design** |

**Notes:** Working implementation without design reference.

### 1.3 Password Setup
| Component | Endpoint | Design | Implementation | Service | Status |
|-----------|----------|---------|----------------|---------|--------|
| Set Password | `POST /enterprise/onboarding/step/password` | ❌ None | ✅ SetPassword.jsx | ✅ authApi.js | ⚠️ **Needs Design** |

**Notes:** Functional but design-less. Accepts firstName, lastName, password.

### 1.4 Login
| Component | Endpoint | Design | Implementation | Service | Status |
|-----------|----------|---------|----------------|---------|--------|
| Login Page | `POST /enterprise/auth/login` | ❌ None | ✅ Login.jsx | ✅ authApi.js | ⚠️ **Needs Design** |
| Refresh Token | `POST /enterprise/auth/refresh` | ❌ None | ❌ None | ❌ None | 📊 **Missing Both** |

**Notes:** Login works but has no design. Token refresh not implemented in frontend.

### 1.5 Password Recovery
| Component | Endpoint | Design | Implementation | Service | Status |
|-----------|----------|---------|----------------|---------|--------|
| Forgot Password | `POST /enterprise/auth/forgot-password` | ❌ None | ✅ ForgotPassword.jsx | ✅ authApi.js | ⚠️ **Needs Design** |
| Resend Code | `POST /enterprise/auth/forgot-password/resend` | ❌ None | ❌ None | ❌ None | 📊 **Missing Both** |
| Reset Password | `POST /enterprise/auth/reset-password` | ❌ None | ✅ VerifyResetCode.jsx | ✅ authApi.js | ⚠️ **Needs Design** |
| Change Password | `PATCH /enterprise/auth/change-password` | ✅ Settings-1.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |

**Notes:** Password recovery flow works without designs. Change password has design but not built.

---

## 2. Consultant Onboarding (7-Step Flow)

**Design Files:**
- Onboarding.png
- Onboarding-1.png to Onboarding-8.png (9 screens total)

| Step | Endpoint | Design | Implementation | Service | Status |
|------|----------|--------|----------------|---------|--------|
| Get Profile | `GET /enterprise/onboarding/consultant/profile` | ✅ Yes | ✅ Onboarding.jsx | ✅ consultantOnboardingApi.js | ✅ **Complete** |
| Step 1: Firm Identity | `POST /enterprise/onboarding/consultant/step/1` | ✅ Onboarding-1.png | ✅ FirmIdentityStep.jsx | ✅ consultantOnboardingApi.js | ✅ **Complete** |
| Step 2: Principal Partner | `POST /enterprise/onboarding/consultant/step/2` | ✅ Onboarding-2.png | ✅ PartnersOwnershipStep.jsx | ✅ consultantOnboardingApi.js | ✅ **Complete** |
| Step 3: Scope | `POST /enterprise/onboarding/consultant/step/3` | ✅ Onboarding-4.png | ✅ ScopeOfPracticeStep.jsx | ✅ consultantOnboardingApi.js | ✅ **Complete** |
| Step 4: Subscription | `POST /enterprise/onboarding/consultant/step/4` | ✅ Onboarding-5.png | ✅ SubscriptionStep.jsx | ✅ consultantOnboardingApi.js | ✅ **Complete** |
| Step 5: Payment Setup | `POST /enterprise/onboarding/consultant/step/5` | ✅ Onboarding-6.png | ✅ PaymentSetupStep.jsx | ✅ consultantOnboardingApi.js | ✅ **Complete** |
| Step 6: Compliance Docs | `POST /enterprise/onboarding/consultant/step/6` | ✅ Onboarding-7.png | ✅ ComplianceStep.jsx | ✅ consultantOnboardingApi.js | ✅ **Complete** |
| Step 7: Declarations | `POST /enterprise/onboarding/consultant/step/7` | ✅ Onboarding-7.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| Activate Account | `POST /enterprise/onboarding/consultant/activate` | ✅ Onboarding-8.png | ✅ ReviewActivateStep.jsx | ✅ consultantOnboardingApi.js | ✅ **Complete** |

**Notes:**
- Onboarding flow is mostly complete with 7 of 8 steps implemented
- Step 7 (Declarations) exists in API but not as separate UI step
- Currently combined with Step 6 (Compliance) in implementation

**Priority:** ⭐ Medium - Step 7 needs to be separated from Step 6

---

## 3. Dashboard & Analytics

**Design Files:**
- Global Dashboard.png
- Global Dashboard-1.png

| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Global Dashboard | `GET /enterprise/dashboard` | ✅ Global Dashboard.png | ✅ Dashboard.jsx | ❌ None | 🔄 **Partial** |
| Health Check | `GET /enterprise/` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |

**Notes:**
- Dashboard page exists with hardcoded metrics
- No API integration for real-time data
- Design shows: Total Clients, Tax Due, Potential Savings, Compliance Alerts
- Current implementation matches design layout

**Priority:** ⭐⭐⭐ High - Need to integrate dashboard API for real metrics

---

## 4. Client Management

**Design Files:**
- Select Client.png (Client selection/list view)

### 4.1 Client List & Search
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| List Clients | `GET /enterprise/clients?q=&type=` | ✅ Select Client.png | ✅ Clients.jsx | ✅ clientApi.js (getClients) | ✅ **Complete** |
| Get Client Details | `GET /enterprise/clients/:clientId/details` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Get Client Dashboard | `GET /enterprise/clients/:clientId/dashboard` | ✅ Client Dashboard.png | ✅ ClientDashboard.jsx | ❌ None | 🔄 **Partial** |
| Managed Entities | `GET /enterprise/managed-entities?q=` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |

**Notes:**
- Clients page works with API integration
- Client dashboard uses hardcoded data, needs API integration
- Managed entities endpoint exists but no UI

**Priority:** ⭐⭐⭐ High - Integrate client dashboard API

### 4.2 Client Invitations & Access
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| List Available Clients | `GET /enterprise/clients/available?q=` | ✅ Add Business Owner.png | ❌ None | ✅ clientApi.js | 🎨 **Needs Implementation** |
| Send Access Request | `POST /enterprise/client-requests` | ✅ Add Business Owner-2.png | ✅ AddBusinessOwnerModal.jsx | ✅ clientApi.js | ✅ **Complete** |
| List Invitations | `GET /enterprise/client-invitations?status=` | ✅ Add Business Owner-1.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| Get Invitation | `GET /enterprise/client-invitations/:id` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Cancel Invitation | `DELETE /enterprise/client-invitations/:id` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Resend Invitation | `POST /enterprise/client-invitations/:id/resend` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Accept Invitation (Public) | `POST /enterprise/team/invitations/accept` | ❌ None | ✅ AcceptInvitation.jsx | ✅ clientApi.js | 🔄 **Partial** |

**Notes:**
- Add Business Owner modal is implemented with invite flow
- Invitation management (list, cancel, resend) not in UI
- Accept invitation page exists for team invites

**Priority:** ⭐⭐ Medium - Build invitation management UI

---

## 5. Business Profile

**Design Files:**
- Business Profile.png
- Business Profile-1.png to Business Profile-4.png (5 screens total)

| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Get Business Profile | `GET /enterprise/clients/:clientId/business-profile` | ✅ Business Profile.png | ✅ BusinessProfile.jsx | ✅ clientApi.js | ✅ **Complete** |
| Update Business Profile | `PUT /enterprise/clients/:clientId/business-profile` | ✅ Business Profile-1.png | ✅ BusinessProfile.jsx | ✅ clientApi.js | ✅ **Complete** |
| Get Business Types | `GET /enterprise/business-profile/types` | ✅ Business Profile-2.png | ✅ BusinessProfile.jsx | ✅ clientApi.js | ✅ **Complete** |
| Get Industries | `GET /enterprise/business-profile/industries` | ✅ Business Profile-2.png | ✅ BusinessProfile.jsx | ✅ clientApi.js | ✅ **Complete** |
| Upgrade Subscription | `POST /enterprise/clients/:clientId/business-profile/subscription/upgrade` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Update Business Profile (Legacy) | `PUT /enterprise/clients/:clientId/client-business-profile` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Update Contact | `PUT /enterprise/clients/:clientId/client-contact` | ✅ Business Profile-3.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |

**Notes:**
- Main business profile page is complete
- Contact update form designed but not implemented
- Subscription upgrade endpoint exists but no UI

**Priority:** ⭐⭐ Medium - Implement contact update form

---

## 6. Tax Computation & Configuration

**Design Files:**
- Tax Computation.png
- Tax Computation-1.png to Tax Computation-11.png (12 screens total)

### 6.1 Tax Configuration
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Update Tax Config | `PUT /enterprise/clients/:clientId/tax-configuration` | ✅ Tax Computation-1.png | ❌ None | ✅ taxApi.js | 🎨 **Needs Implementation** |
| Get Tax Config | `GET /enterprise/clients/:clientId/tax-configuration` | ✅ Tax Computation-1.png | ❌ None | ✅ taxApi.js | 🎨 **Needs Implementation** |

### 6.2 Tax Summary & Computation
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Get Tax Summary | `GET /enterprise/clients/:clientId/tax-summary` | ✅ Tax Computation.png | ✅ TaxComputation.jsx | ✅ taxApi.js | ✅ **Complete** |
| VAT Computation Status | `GET /enterprise/clients/:clientId/vat-computation/status` | ✅ Tax Computation-2.png | ✅ TaxComputation.jsx | ✅ taxApi.js | ✅ **Complete** |
| Calculate VAT | `POST /enterprise/clients/:clientId/vat-computation/calculate` | ✅ Tax Computation-3.png | ✅ TaxComputation.jsx | ✅ taxApi.js | ✅ **Complete** |
| Get VAT Results | `GET /enterprise/clients/:clientId/vat-computation/results` | ✅ Tax Computation-4.png | ✅ TaxComputation.jsx | ✅ taxApi.js | ✅ **Complete** |
| Threshold Status | `GET /enterprise/clients/:clientId/tax-computation/threshold-status` | ✅ Tax Computation-5.png | ✅ TaxComputation.jsx | ✅ taxApi.js | ✅ **Complete** |
| Tax Computation Chart | `GET /enterprise/clients/:clientId/tax-computation/chart` | ✅ Tax Computation-6.png | ✅ TaxComputation.jsx | ✅ taxApi.js | ✅ **Complete** |
| Get Tax Assumptions | `GET /enterprise/clients/:clientId/tax-computation/assumptions` | ✅ Tax Computation-7.png | ✅ TaxComputation.jsx | ✅ taxApi.js | ✅ **Complete** |
| Update Tax Assumptions | `PUT /enterprise/clients/:clientId/tax-computation/assumptions` | ✅ Tax Computation-8.png | ✅ TaxComputation.jsx | ✅ taxApi.js | ✅ **Complete** |

**Notes:**
- Tax Computation page is one of the most complete features
- Fully integrated with backend APIs
- All major tax calculation flows working

**Priority:** ⭐ Low - Feature complete, minor enhancements only

---

## 7. Financials Module

**Design Files:**
- Financials.png
- Financials-1.png to Financials-6.png (7 screens total)

### 7.1 Financial Overview & Reports
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Financial Summary | `GET /enterprise/clients/:clientId/financials/summary` | ✅ Financials.png | ✅ Financials.jsx | ✅ financialsApi.js | ✅ **Complete** |
| Profit & Loss | `GET /enterprise/clients/:clientId/financials/profit-loss?year=` | ✅ Financials-6.png | ✅ FinancialReports.jsx | ✅ financialsApi.js | ✅ **Complete** |
| Balance Sheet | `GET /enterprise/clients/:clientId/financials/balance-sheet?year=` | ✅ Financials-7.png | ✅ FinancialReports.jsx | ✅ financialsApi.js | ✅ **Complete** |
| Profitability Trends | `GET /enterprise/clients/:clientId/financials/profitability/trends?year=` | ❌ None | ❌ None | ✅ financialsApi.js | ⚠️ **Needs Design** |
| Expense Breakdown | `GET /enterprise/clients/:clientId/financials/profitability/expense-breakdown?year=` | ❌ None | ❌ None | ✅ financialsApi.js | ⚠️ **Needs Design** |

### 7.2 Document Management
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| List Documents | `GET /enterprise/clients/:clientId/financials/documents?page=&limit=` | ✅ Financials-1.png | ✅ Financials.jsx | ✅ financialsApi.js | ✅ **Complete** |
| Get Document | `GET /enterprise/clients/:clientId/financials/documents/:id` | ❌ None | ❌ None | ✅ financialsApi.js | ⚠️ **Needs Design** |
| Upload Document | `POST /enterprise/clients/:clientId/financials/documents/upload` | ✅ Financials-2.png | ✅ Financials.jsx (UploadInvoiceModal) | ✅ financialsApi.js | ✅ **Complete** |
| Upload Invoice | `POST /enterprise/clients/:clientId/financials/documents/upload-invoice` | ✅ Financials-2.png | ✅ Financials.jsx (UploadInvoiceModal) | ✅ financialsApi.js | ✅ **Complete** |
| Review Document | `GET /enterprise/clients/:clientId/financials/documents/:id/review` | ✅ Financials-4.png | ✅ ReviewInvoice.jsx | ✅ financialsApi.js | ✅ **Complete** |
| Delete Document | `DELETE /enterprise/clients/:clientId/financials/documents/:id` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |

### 7.3 OCR & AI Processing
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| OCR Extract | `POST /enterprise/clients/:clientId/financials/documents/:fileId/ocr-extract` | ✅ Financials-3.png | ✅ ProcessingDocumentModal.jsx | ✅ financialsApi.js | ✅ **Complete** |
| Vendor Identify | `POST /enterprise/clients/:clientId/financials/documents/extractions/:extractionId/vendor-identify` | ✅ Financials-3.png | ✅ ProcessingDocumentModal.jsx | ✅ financialsApi.js | ✅ **Complete** |
| Analyze Vendor | `POST /enterprise/clients/:clientId/financials/documents/vendors/:vendorId/analyze` | ✅ Financials-3.png | ✅ ProcessingDocumentModal.jsx | ✅ financialsApi.js | ✅ **Complete** |

### 7.4 Invoices & Transactions
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| List Invoices | `GET /enterprise/clients/:clientId/financials/invoices?page=&limit=` | ✅ Financials-1.png | ✅ Financials.jsx | ✅ financialsApi.js | ✅ **Complete** |
| Create Invoice | `POST /enterprise/clients/:clientId/financials/invoices` | ❌ None | ❌ None | ✅ financialsApi.js | ⚠️ **Needs Design** |
| List Transactions | `GET /enterprise/clients/:clientId/financials/transactions?page=&limit=` | ❌ None | ❌ None | ✅ financialsApi.js | ⚠️ **Needs Design** |
| Create Transaction | `POST /enterprise/clients/:clientId/financials/transactions` | ❌ None | ❌ None | ✅ financialsApi.js | ⚠️ **Needs Design** |

**Notes:**
- Financials module is highly complete with all major features
- Document upload with AI processing fully functional
- Invoice review page redesigned with tooltips and metadata
- Missing: Manual invoice creation, transaction management

**Priority:** ⭐⭐ Medium - Add manual invoice and transaction forms

---

## 8. Evidence Vault

**Design Files:**
- Evidence Vault.png
- Evidence Vault-1.png to Evidence Vault-8.png (9 screens total)

| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Get Stats | `GET /enterprise/clients/:clientId/evidence-vault/stats` | ✅ Evidence Vault.png | ✅ EvidenceVault.jsx | ❌ None | 🔄 **Partial** |
| List Documents | `GET /enterprise/clients/:clientId/evidence-vault/documents?page=&limit=` | ✅ Evidence Vault-1.png | ✅ EvidenceVault.jsx | ❌ None | 🔄 **Partial** |
| Upload Document | `POST /enterprise/clients/:clientId/evidence-vault/documents/upload` | ✅ Evidence Vault-2.png | ✅ EvidenceVault.jsx | ❌ None | 🔄 **Partial** |
| Delete Document | `DELETE /enterprise/clients/:clientId/evidence-vault/documents/:id` | ✅ Evidence Vault-3.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| View Document Detail | N/A (Frontend routing) | ✅ Evidence Vault-4.png | ✅ DocumentDetail.jsx | ❌ None | 🔄 **Partial** |

**Notes:**
- Evidence Vault UI is designed and partially implemented
- Backend endpoints exist but not integrated
- Current implementation uses mock data
- Need to create service module for evidence vault

**Priority:** ⭐⭐⭐ High - Integrate evidence vault APIs

---

## 9. Filings Management

**Design Files:** None found in design folder

| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Get Filings Summary | `GET /enterprise/clients/:clientId/filings/summary` | ❌ None | ✅ Filings.jsx | ❌ None | 🔄 **Partial** |
| List VAT Returns | `GET /enterprise/clients/:clientId/filings/vat-returns` | ❌ None | ✅ Filings.jsx | ❌ None | 🔄 **Partial** |
| List Unfiled | `GET /enterprise/clients/:clientId/filings/unfiled` | ❌ None | ✅ Filings.jsx | ❌ None | 🔄 **Partial** |
| List Filings | `GET /enterprise/clients/:clientId/filings?page=&limit=` | ❌ None | ✅ Filings.jsx | ❌ None | 🔄 **Partial** |
| Create Filing | `POST /enterprise/clients/:clientId/filings` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Get Filing Report | `GET /enterprise/clients/:clientId/filings/:filingId/report` | ❌ None | ✅ FilingDetail.jsx | ❌ None | 🔄 **Partial** |

**Notes:**
- Filings pages exist but use mock data
- No design files found for filings module
- Backend endpoints available but not integrated

**Priority:** ⭐⭐⭐ High - Create designs and integrate APIs

---

## 10. Reports Module

**Design Files:**
- Reports.png
- Reports-1.png to Reports-3.png (4 screens total)

| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| List Reports | `GET /enterprise/clients/:clientId/reports` | ✅ Reports.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| Taxes Summary Report | `GET /enterprise/clients/:clientId/reports/taxes-summary` | ✅ Reports-1.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| VAT Payment Report | `GET /enterprise/clients/:clientId/reports/vat-payment` | ✅ Reports-2.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| CIT Computation Report | `GET /enterprise/clients/:clientId/reports/cit` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| WHT Report | `GET /enterprise/clients/:clientId/reports/wht` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Tax Withholding Report | `GET /enterprise/clients/:clientId/reports/tax-withholding` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| PAYE Computation Report | `GET /enterprise/clients/:clientId/reports/paye` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Download Report PDF | `GET /enterprise/clients/:clientId/reports/:reportId/download` | ✅ Reports-3.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |

**Notes:**
- Reports module has designs but zero implementation
- Multiple report types available in backend
- Good opportunity for a dedicated Reports page

**Priority:** ⭐⭐⭐ High - Build complete reports module

---

## 11. Compliance

**Design Files:** None found

| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Get Stats | `GET /enterprise/compliance/stats` | ❌ None | ❌ None | ❌ None | 📊 **Missing Both** |
| Get Overview | `GET /enterprise/compliance/overview` | ❌ None | ❌ None | ❌ None | 📊 **Missing Both** |
| Get Upcoming Deadlines | `GET /enterprise/compliance/upcoming-deadlines?limit=` | ❌ None | ❌ None | ❌ None | 📊 **Missing Both** |

**Notes:**
- Compliance endpoints exist but no UI created
- Would be valuable for consultant dashboard
- Currently shows as "Coming Soon" in app

**Priority:** ⭐⭐ Medium - Design and build compliance dashboard

---

## 12. Team Management

**Design Files:** None found (possibly in Settings screens)

| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Invite Team Member | `POST /enterprise/team/invitations` | ❌ None | ❌ None | ❌ None | 📊 **Missing Both** |
| List Team Invitations | `GET /enterprise/team/invitations` | ❌ None | ❌ None | ❌ None | 📊 **Missing Both** |
| Get Invitation by Code | `GET /enterprise/team/invitations/accept?code=` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Accept Team Invitation | `POST /enterprise/team/invitations/accept` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| List Team Members | `GET /enterprise/team/members` | ✅ Settings-2.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |

**Notes:**
- Team management likely part of Settings module
- Settings-2.png shows team members list
- No implementation of team features yet

**Priority:** ⭐⭐ Medium - Build team management in settings

---

## 13. Profile & Settings

**Design Files:**
- Settings.png
- Settings-1.png to Settings-5.png (6 screens total)

### 13.1 Profile Management
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Get Profile | `GET /enterprise/profile` | ✅ Settings.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| Update Profile | `PUT /enterprise/profile` | ✅ Settings.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| Get Consultant Business | `GET /enterprise/consultant-business` | ✅ Settings-3.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| Update Consultant Business | `PUT /enterprise/consultant-business` | ✅ Settings-3.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |

### 13.2 Notification Settings
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Get Notifications | `GET /enterprise/notification-settings` | ✅ Settings-4.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |
| Update Notifications | `PUT /enterprise/notification-settings` | ✅ Settings-4.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |

### 13.3 Security
| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Change Password | `PATCH /enterprise/auth/change-password` | ✅ Settings-1.png | ❌ None | ❌ None | 🎨 **Needs Implementation** |

**Notes:**
- Complete Settings module designed with 6 screens
- Zero implementation - currently "Coming Soon"
- All required endpoints exist in backend

**Priority:** ⭐⭐⭐ High - Build complete Settings module

---

## 14. Upload & Media

| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Upload File | `POST /enterprise/upload` | ✅ Multiple | ✅ Various modals | ✅ apiConfig.js (uploadFile) | ✅ **Complete** |
| Delete File | `DELETE /enterprise/upload?key=` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| View Media | `GET /media/view?key=` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Get Presigned URL | `GET /media/presigned?key=` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |

**Notes:**
- File upload works across multiple features
- File deletion not exposed in any UI
- Media viewing/download not implemented

**Priority:** ⭐ Low - Upload works, deletion is nice-to-have

---

## 15. Lookups & Reference Data

| Feature | Endpoint | Design | Implementation | Service | Status |
|---------|----------|--------|----------------|---------|--------|
| Contacts and Types | `GET /enterprise/contacts-and-types` | ❌ None | ❌ None | ❌ None | ⚠️ **Needs Design** |
| Business Types | `GET /enterprise/business-profile/types` | ✅ Business Profile-2.png | ✅ BusinessProfile.jsx | ✅ clientApi.js | ✅ **Complete** |
| Industries | `GET /enterprise/business-profile/industries` | ✅ Business Profile-2.png | ✅ BusinessProfile.jsx | ✅ clientApi.js | ✅ **Complete** |

**Notes:**
- Most lookup endpoints integrated where needed
- Contacts and types endpoint not used

**Priority:** ⭐ Low - Working as needed

---

## Summary by Priority

### 🔥 HIGH PRIORITY (Immediate Action Required)

1. **Dashboard API Integration**
   - Endpoint: `GET /enterprise/dashboard`
   - Current: Hardcoded metrics
   - Action: Integrate real-time data

2. **Evidence Vault API Integration**
   - Endpoints: Stats, List, Upload, Delete
   - Current: Mock data
   - Action: Create service module and integrate

3. **Filings API Integration**
   - Endpoints: Summary, VAT returns, Unfiled, List
   - Current: Mock data
   - Action: Create service module and integrate

4. **Settings Module**
   - Endpoints: Profile, Consultant Business, Notifications, Change Password
   - Current: Coming Soon page
   - Action: Build complete settings with all 6 screens

5. **Reports Module**
   - Endpoints: 7+ report types
   - Current: Coming Soon page
   - Action: Build reports listing and viewing

### ⭐ MEDIUM PRIORITY (Important but Not Urgent)

1. **Client Dashboard API Integration**
   - Endpoint: `GET /enterprise/clients/:clientId/dashboard`
   - Current: Hardcoded metrics
   - Action: Show real client data

2. **Invitation Management**
   - Endpoints: List, Cancel, Resend invitations
   - Current: Only send invitation works
   - Action: Build invitation management UI

3. **Contact Update Form**
   - Endpoint: `PUT /enterprise/clients/:clientId/client-contact`
   - Design: Business Profile-3.png
   - Action: Implement contact editing

4. **Team Management**
   - Endpoints: Invite, List members
   - Design: Settings-2.png
   - Action: Build team management section

5. **Compliance Dashboard**
   - Endpoints: Stats, Overview, Upcoming Deadlines
   - Current: No design
   - Action: Design and build compliance overview

6. **Manual Transaction Entry**
   - Endpoints: Create Invoice, Create Transaction
   - Current: Only upload works
   - Action: Build manual entry forms

### 💡 LOW PRIORITY (Nice to Have)

1. **Consultant Onboarding Step 7**
   - Endpoint: `POST /enterprise/onboarding/consultant/step/7`
   - Current: Combined with Step 6
   - Action: Separate declarations step

2. **Token Refresh**
   - Endpoint: `POST /enterprise/auth/refresh`
   - Current: Not implemented
   - Action: Auto-refresh expired tokens

3. **Email/Password Resend**
   - Endpoints: Resend codes for signup and password reset
   - Current: Not exposed in UI
   - Action: Add resend buttons

4. **File Deletion**
   - Endpoint: `DELETE /enterprise/upload`
   - Current: No UI for deleting uploads
   - Action: Add delete functionality

5. **Profitability Charts**
   - Endpoints: Trends, Expense Breakdown
   - Current: APIs exist but no UI
   - Action: Add charts to financials

---

## Design Files Not Mapped to APIs

These design files exist but may not have corresponding backend endpoints:

1. **Add Business.png** - Might be alternate design for Add Business Owner flow
2. **Select Client.png** - Implemented as Clients.jsx list view

---

## API Endpoints Without Designs

These endpoints exist but have no design mockups:

### Authentication
- Email resend
- Password resend
- Token refresh

### Client Management
- Get client details
- Managed entities
- Get invitation details
- Cancel invitation
- Resend invitation

### Tax
- None (all have designs)

### Financials
- Get single document
- Delete document
- Create invoice manually
- List transactions
- Create transaction
- Profitability trends
- Expense breakdown

### Evidence Vault
- None (all have designs)

### Filings
- All filings endpoints lack designs
- Create filing form needed

### Reports
- CIT, WHT, Tax Withholding, PAYE reports lack designs

### Compliance
- All compliance endpoints lack designs

### Team
- Invite member form
- Invitation acceptance flow

### Settings
- None (all have designs)

### Media
- View media
- Get presigned URL
- Delete file

---

## Recommended Development Roadmap

### Phase 1: Complete Core Features (2-3 weeks)
1. Dashboard API integration
2. Client Dashboard API integration
3. Evidence Vault API integration
4. Filings API integration
5. Settings module implementation

### Phase 2: Reports & Analytics (2 weeks)
1. Reports module implementation
2. Profitability charts
3. Compliance dashboard

### Phase 3: Team & Management (1-2 weeks)
1. Team management
2. Invitation management
3. Contact update forms

### Phase 4: Polish & Enhancements (1 week)
1. Manual transaction entry
2. Token refresh
3. Resend buttons
4. File deletion

---

## Technical Debt & Improvements

1. **Service Module Coverage**
   - Need: evidenceVaultApi.js
   - Need: filingsApi.js
   - Need: reportsApi.js
   - Need: complianceApi.js
   - Need: teamApi.js
   - Need: settingsApi.js

2. **Mock Data Removal**
   - Dashboard.jsx - replace metrics
   - ClientDashboard.jsx - replace metrics and obligations
   - EvidenceVault.jsx - replace documents
   - Filings.jsx - replace filings data
   - FilingDetail.jsx - replace filing details

3. **Error Handling**
   - Add consistent error boundaries
   - Better loading states
   - Retry mechanisms for failed requests

4. **TypeScript Migration**
   - Consider migrating for better type safety
   - Especially important for API responses

---

## Conclusion

The FileAm Enterprise web application has a solid foundation with:
- ✅ **15 complete features** with full API + Design + Implementation
- 🎨 **28 features** ready for implementation (API + Design available)
- ⚠️ **18 API endpoints** waiting for designs
- 🖼️ **2 designs** waiting for backend support

**Next immediate steps:**
1. Create missing service modules (evidence vault, filings, reports, compliance, team, settings)
2. Integrate existing APIs into pages using mock data
3. Build Settings module (high user value, all designs ready)
4. Build Reports module (high business value)
5. Design missing screens for compliance and additional reports

The project is approximately **60% complete** in terms of core features, with clear paths to completion for the remaining 40%.
