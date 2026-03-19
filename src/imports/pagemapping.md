# Page Mapping - CareNet 2 Frontend to Backend Connections

This document maps every frontend page to its corresponding backend service files and describes what each page does.

## Format: Page | Frontend File Path | Backend Service File Path | Function Description

---

## PUBLIC PAGES (No Authentication Required)

### Marketing & Information Pages
HomePage | `src/frontend/pages/public/HomePage.tsx` | N/A | Landing page with feature overview, testimonials, and call-to-action buttons
AboutPage | `src/frontend/pages/public/AboutPage.tsx` | N/A | Company information, mission, team, and organizational details
FeaturesPage | `src/frontend/pages/public/FeaturesPage.tsx` | N/A | Detailed feature list with interactive demonstrations and comparison table
PricingPage | `src/frontend/pages/public/PricingPage.tsx` | N/A | Service pricing tiers, feature comparison, and subscription options
ContactPage | `src/frontend/pages/public/ContactPage.tsx` | N/A | Contact form, office locations, and support contact information
PrivacyPage | `src/frontend/pages/public/PrivacyPage.tsx` | N/A | Privacy policy and data handling practices
TermsPage | `src/frontend/pages/public/TermsPage.tsx` | N/A | Terms of service and usage agreements
MarketplacePage | `src/frontend/pages/public/MarketplacePage.tsx` | `src/backend/services/marketplace.service.ts` | Browse available services, caregivers, and agencies without auth
GlobalSearchPage | `src/frontend/pages/public/GlobalSearchPage.tsx` | `src/backend/services/search.service.ts` | Search across all content types (caregivers, services, articles)
AgencyDirectoryPage | `src/frontend/pages/public/AgencyDirectoryPage.tsx` | `src/backend/services/agency.service.ts` | Browse and contact registered healthcare agencies

### Authentication Pages
LoginPage | `src/frontend/pages/auth/LoginPage.tsx` | `src/backend/services/auth.service.ts`, `src/backend/store/auth/` | Multi-step login with MFA support, role selection, and demo accounts
RegisterPage | `src/frontend/pages/auth/RegisterPage.tsx` | `src/backend/services/auth.service.ts` | User registration with role-specific forms and validation
ForgotPasswordPage | `src/frontend/pages/auth/ForgotPasswordPage.tsx` | `src/backend/services/auth.service.ts` | Password reset request with email verification
ResetPasswordPage | `src/frontend/pages/auth/ResetPasswordPage.tsx` | `src/backend/services/auth.service.ts` | Password reset completion with token validation
MFASetupPage | `src/frontend/pages/auth/MFASetupPage.tsx` | `src/backend/services/auth.service.ts` | Two-factor authentication setup with QR codes
MFAVerifyPage | `src/frontend/pages/auth/MFAVerifyPage.tsx` | `src/backend/services/auth.service.ts` | Two-factor authentication verification
VerificationResultPage | `src/frontend/pages/auth/VerificationResultPage.tsx` | `src/backend/services/auth.service.ts` | Email verification result display

---

## AUTHENTICATED PAGES (Role-Based Access)

### Shared Pages (All Authenticated Users)
DashboardPage | `src/frontend/pages/shared/DashboardPage.tsx` | Role-specific services | Dynamic dashboard showing role-appropriate metrics and actions
SettingsPage | `src/frontend/pages/shared/SettingsPage.tsx` | `src/backend/services/[userRole].service.ts`, `src/backend/services/upload.service.ts` | User profile management, preferences, document uploads
NotificationsPage | `src/frontend/pages/shared/NotificationsPage.tsx` | `src/backend/services/notification.service.ts`, `src/backend/services/realtime.ts` | Real-time notification center with push notification integration
MessagesPage | `src/frontend/pages/shared/MessagesPage.tsx` | `src/backend/services/message.service.ts`, `src/backend/services/realtime.ts` | Real-time messaging system with offline queue support

---

## CAREGIVER PAGES

### Caregiver Dashboard & Overview
CaregiverDashboardPage | `src/frontend/pages/caregiver/CaregiverDashboardPage.tsx` | `src/backend/services/caregiver.service.ts` | Overview of earnings, job stats, upcoming schedule, and performance metrics
CaregiverJobsPage | `src/frontend/pages/caregiver/CaregiverJobsPage.tsx` | `src/backend/services/caregiver.service.ts` | Browse available jobs, filter by location/pay/type, manage applications
CaregiverJobDetailPage | `src/frontend/pages/caregiver/CaregiverJobDetailPage.tsx` | `src/backend/services/caregiver.service.ts` | Detailed job view with requirements, patient info, and application process
JobApplicationDetailPage | `src/frontend/pages/caregiver/JobApplicationDetailPage.tsx` | `src/backend/services/caregiver.service.ts`, `src/backend/services/schedule.service.ts` | View and manage submitted job applications with status tracking

### Scheduling & Time Management
CaregiverSchedulePage | `src/frontend/pages/caregiver/CaregiverSchedulePage.tsx` | `src/backend/services/schedule.service.ts`, `src/backend/services/caregiver.service.ts` | Calendar view of assignments, availability management, shift preferences
ShiftDetailPage | `src/frontend/pages/caregiver/ShiftDetailPage.tsx` | `src/backend/services/schedule.service.ts`, `src/backend/services/patient.service.ts` | Detailed shift information with patient details and care instructions
CaregiverShiftPlannerPage | `src/frontend/pages/caregiver/CaregiverShiftPlannerPage.tsx` | `src/backend/services/schedule.service.ts` | Advanced scheduling tool for planning availability and preferences
ShiftCheckInPage | `src/frontend/pages/caregiver/ShiftCheckInPage.tsx` | `src/backend/services/schedule.service.ts`, `src/backend/services/geolocation.service.ts` | GPS-enabled check-in/out system with photo verification

### Patient Care & Medical
CaregiverAssignedPatientsPage | `src/frontend/pages/caregiver/CaregiverAssignedPatientsPage.tsx` | `src/backend/services/caregiver.service.ts`, `src/backend/services/patient.service.ts` | List of assigned patients with care plans and contact information
CaregiverCareLogPage | `src/frontend/pages/caregiver/CaregiverCareLogPage.tsx` | `src/backend/services/patient.service.ts`, `src/backend/services/caregiver.service.ts` | Daily care activity logging with photo and note attachments
CaregiverPrescriptionPage | `src/frontend/pages/caregiver/CaregiverPrescriptionPage.tsx` | `src/backend/services/patient.service.ts`, `src/backend/services/schedule.service.ts` | Medication management and prescription tracking
CaregiverMedSchedulePage | `src/frontend/pages/caregiver/CaregiverMedSchedulePage.tsx` | `src/backend/services/patient.service.ts`, `src/backend/services/schedule.service.ts` | Medication administration schedule with reminders
CaregiverCareNotesPage | `src/frontend/pages/caregiver/CaregiverCareNotesPage.tsx` | `src/backend/services/patient.service.ts` | Patient care notes and observations with time tracking
IncidentReportPage | `src/frontend/pages/caregiver/IncidentReportPage.tsx` | `src/backend/services/caregiver.service.ts`, `src/backend/services/support.service.ts` | Incident reporting system with categorization and evidence upload
HandoffNotesPage | `src/frontend/pages/caregiver/HandoffNotesPage.tsx` | `src/backend/services/caregiver.service.ts` | Shift handover notes for continuity of care

### Professional Development & Compliance
CaregiverDocumentsPage | `src/frontend/pages/caregiver/CaregiverDocumentsPage.tsx` | `src/backend/services/upload.service.ts` | Document management for certifications, licenses, and compliance
TrainingPortalPage | `src/frontend/pages/caregiver/TrainingPortalPage.tsx` | `src/backend/services/caregiver.service.ts` | Training modules and certification tracking
SkillsAssessmentPage | `src/frontend/pages/caregiver/SkillsAssessmentPage.tsx` | `src/backend/services/caregiver.service.ts`, `src/backend/services/marketplace.service.ts` | Skill evaluation and competency assessments
CaregiverPortfolioPage | `src/frontend/pages/caregiver/PortfolioEditorPage.tsx` | `src/backend/services/upload.service.ts`, `src/backend/services/caregiver.service.ts` | Professional portfolio builder with media uploads
CaregiverReviewsPage | `src/frontend/pages/caregiver/CaregiverReviewsPage.tsx` | `src/backend/services/caregiver.service.ts` | View and respond to patient/guardian reviews
ReferenceManagerPage | `src/frontend/pages/caregiver/ReferenceManagerPage.tsx` | `src/backend/services/caregiver.service.ts` | Professional reference management and verification

### Finance & Earnings
CaregiverEarningsPage | `src/frontend/pages/caregiver/CaregiverEarningsPage.tsx` | `src/backend/services/caregiver.service.ts`, `src/backend/services/walletService.ts` | Earnings dashboard with charts and earning history
DailyEarningsDetailPage | `src/frontend/pages/caregiver/DailyEarningsDetailPage.tsx` | `src/backend/services/caregiver.service.ts` | Detailed breakdown of daily earnings by shift/job
PayoutSetupPage | `src/frontend/pages/caregiver/PayoutSetupPage.tsx` | `src/backend/services/walletService.ts`, `src/backend/services/caregiver.service.ts` | Payment method configuration for earnings withdrawals
TaxReportsPage | `src/frontend/pages/caregiver/TaxReportsPage.tsx` | `src/backend/services/caregiver.service.ts` | Tax documentation and yearly earnings reports

### Communication
CaregiverMessagesPage | `src/frontend/pages/caregiver/CaregiverMessagesPage.tsx` | `src/backend/services/message.service.ts`, `src/backend/services/realtime.ts` | Caregiver-specific messaging interface with patients and agencies

---

## GUARDIAN PAGES (Family Members Managing Care)

### Guardian Dashboard & Overview
GuardianDashboardPage | `src/frontend/pages/guardian/GuardianDashboardPage.tsx` | `src/backend/services/guardian.service.ts`, `src/backend/services/patient.service.ts` | Overview of family members, upcoming appointments, and care status
GuardianPatientsPage | `src/frontend/pages/guardian/GuardianPatientsPage.tsx` | `src/backend/services/patient.service.ts`, `src/backend/services/guardian.service.ts` | Manage family members under guardian's care with profiles

### Care Search & Booking
CaregiverSearchPage | `src/frontend/pages/guardian/CaregiverSearchPage.tsx` | `src/backend/services/search.service.ts`, `src/backend/services/caregiver.service.ts` | Search and filter caregivers by location, specialty, availability, and ratings
CaregiverPublicProfilePage | `src/frontend/pages/guardian/CaregiverPublicProfilePage.tsx` | `src/backend/services/caregiver.service.ts`, `src/backend/services/review.service.ts` | Detailed caregiver profiles with ratings, availability, and portfolio
CaregiverComparisonPage | `src/frontend/pages/guardian/CaregiverComparisonPage.tsx` | `src/backend/services/caregiver.service.ts` | Side-by-side caregiver comparison tool
BookingWizardPage | `src/frontend/pages/guardian/BookingWizardPage.tsx` | `src/backend/services/guardian.service.ts`, `src/backend/services/schedule.service.ts`, `src/backend/services/caregiver.service.ts` | Step-by-step care booking process with availability checking
GuardianSchedulePage | `src/frontend/pages/guardian/GuardianSchedulePage.tsx` | `src/backend/services/schedule.service.ts`, `src/backend/services/patient.service.ts` | Family care schedule with appointment management

### Care Management
PatientIntakePage | `src/frontend/pages/guardian/PatientIntakePage.tsx` | `src/backend/services/patient.service.ts`, `src/backend/services/upload.service.ts` | New patient registration with medical history and requirements
CareRequirementsListPage | `src/frontend/pages/guardian/CareRequirementsListPage.tsx` | `src/backend/services/patient.service.ts` | Manage care requirements and preferences for each patient
CareRequirementWizardPage | `src/frontend/pages/guardian/CareRequirementWizardPage.tsx` | `src/backend/services/patient.service.ts` | Guided care requirement setup with medical conditions
CareRequirementDetailPage | `src/frontend/pages/guardian/CareRequirementDetailPage.tsx` | `src/backend/services/patient.service.ts` | Detailed care requirement management and updates

### Financial Management
GuardianPaymentsPage | `src/frontend/pages/guardian/GuardianPaymentsPage.tsx` | `src/backend/services/billing.service.ts`, `src/backend/services/walletService.ts` | Payment methods, billing history, and automatic payment setup
InvoiceDetailPage | `src/frontend/pages/guardian/InvoiceDetailPage.tsx` | `src/backend/services/billing.service.ts` | Detailed invoice view with line items and payment proof submission
BidReviewPage | `src/frontend/pages/guardian/BidReviewPage.tsx` | `src/backend/services/guardian.service.ts`, `src/backend/services/contractService.ts` | Review and accept/reject caregiver bids and proposals

### Family Coordination
FamilyHubPage | `src/frontend/pages/guardian/FamilyHubPage.tsx` | `src/backend/services/guardian.service.ts`, `src/backend/services/message.service.ts` | Family communication center with shared updates
GuardianPlacementsPage | `src/frontend/pages/guardian/GuardianPlacementsPage.tsx` | `src/backend/services/guardian.service.ts`, `src/backend/services/agency.service.ts` | Active care placements and caregiver assignments
GuardianPlacementDetailPage | `src/frontend/pages/guardian/GuardianPlacementDetailPage.tsx` | `src/backend/services/guardian.service.ts` | Detailed placement management with scheduling and communication
ShiftRatingPage | `src/frontend/pages/guardian/ShiftRatingPage.tsx` | `src/backend/services/guardian.service.ts` | Rate caregiver performance after completed shifts

### Marketplace & Services
GuardianMarketplaceHubPage | `src/frontend/pages/guardian/GuardianMarketplaceHubPage.tsx` | `src/backend/services/marketplace.service.ts`, `src/backend/services/shop.service.ts` | Browse and purchase healthcare products and services
PackageDetailPage | `src/frontend/pages/guardian/PackageDetailPage.tsx` | `src/backend/services/marketplace.service.ts` | View detailed package offerings and make purchases

### Communication
GuardianMessagesPage | `src/frontend/pages/guardian/GuardianMessagesPage.tsx` | `src/backend/services/message.service.ts`, `src/backend/services/realtime.ts` | Guardian-specific messaging with caregivers and agencies

---

## ADMIN PAGES
AdminDashboardPage | `src/frontend/pages/admin/AdminDashboardPage.tsx` | `src/backend/services/admin.service.ts` | System-wide statistics, user management, and platform health

---

## BILLING PAGES
BillingDetailPage | `src/frontend/pages/billing/BillingDetailPage.tsx` | `src/backend/services/billing.service.ts` | User billing overview with upcoming and recent transactions
BillingInvoiceDetailPage | `src/frontend/pages/billing/BillingInvoiceDetailPage.tsx` | `src/backend/services/billing.service.ts` | Detailed invoice view with payment proof submission
SubmitPaymentProofPage | `src/frontend/pages/billing/SubmitPaymentProofPage.tsx` | `src/backend/services/billing.service.ts`, `src/backend/services/upload.service.ts` | Upload payment proof screenshots and reference information
VerifyPaymentPage | `src/frontend/pages/billing/VerifyPaymentPage.tsx` | `src/backend/services/billing.service.ts`, `src/backend/services/notification.service.ts` | Review and verify payment proofs submitted by others

---

## SHOP FRONT PAGES (E-commerce)
ProductListPage | `src/frontend/pages/shop-front/ProductListPage.tsx` | `src/backend/services/shop.service.ts` | Browse all available products with filtering and search
ProductCategoryPage | `src/frontend/pages/shop-front/ProductCategoryPage.tsx` | `src/backend/services/shop.service.ts` | Browse products by category with subcategory navigation
ProductDetailsPage | `src/frontend/pages/shop-front/ProductDetailsPage.tsx` | `src/backend/services/shop.service.ts`, `src/backend/services/review.service.ts` | Detailed product information with reviews and specifications
ProductReviewsPage | `src/frontend/pages/shop-front/ProductReviewsPage.tsx` | `src/backend/services/review.service.ts` | Customer reviews and ratings for products
CartPage | `src/frontend/pages/shop-front/CartPage.tsx` | `src/backend/services/shop.service.ts`, `src/backend/services/walletService.ts` | Shopping cart management with checkout preparation
CheckoutPage | `src/frontend/pages/shop-front/CheckoutPage.tsx` | `src/backend/services/shop.service.ts`, `src/backend/services/walletService.ts` | Order completion with payment processing
OrderSuccessPage | `src/frontend/pages/shop-front/OrderSuccessPage.tsx` | `src/backend/services/shop.service.ts` | Order confirmation and next steps
OrderTrackingPage | `src/frontend/pages/shop-front/OrderTrackingPage.tsx` | `src/backend/services/shop.service.ts` | Real-time order tracking with shipment updates
CustomerOrderHistoryPage | `src/frontend/pages/shop-front/CustomerOrderHistoryPage.tsx` | `src/backend/services/shop.service.ts` | Purchase history and order status tracking
WishlistPage | `src/frontend/pages/shop-front/WishlistPage.tsx` | `src/backend/services/shop.service.ts` | Saved items and favorites management

---

## DEVELOPMENT PAGES
ConnectivityDemoPage | `src/frontend/pages/dev/ConnectivityDemoPage.tsx` | `src/backend/services/_sb.ts`, `src/backend/offline/` | Developer tool for testing offline/online functionality and queue behavior

---

## UTILITY PAGES
NotFoundPage | `src/frontend/pages/public/NotFoundPage.tsx` | N/A | 404 error page with navigation assistance and search