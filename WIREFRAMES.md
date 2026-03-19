# CareNet — Wireframe Documentation
> **Platform:** CareNet Bangladesh · **Stack:** React + React Router + Capacitor · **Target:** 95%+ Mobile (WebView via Capacitor) · **Design System:** Pink/Green gradient (#DB869A, #5FB865, #7B5EA7, #E8A838) · **Total Pages:** 141 built (117 original + 12 Section 17 additions + 8 Section 18 + 4 additional) · **Build Status:** ✅ 100% Core Complete · **Roadmap:** 14 proposed v2.0 pages (Section 15)

---

## Table of Contents

1. [Global Navigation & Layout](#1-global-navigation--layout)
2. [Public Module](#2-public-module)
3. [Authentication Module](#3-authentication-module)
4. [Caregiver Module](#4-caregiver-module)
5. [Guardian Module](#5-guardian-module)
6. [Patient Module](#6-patient-module)
7. [Agency Module](#7-agency-module)
8. [Admin Module](#8-admin-module)
9. [Moderator Module](#9-moderator-module)
10. [Shop (Merchant) Module](#10-shop-merchant-module)
11. [Shop Front (Customer) Module](#11-shop-front-customer-module)
12. [Community Module](#12-community-module)
13. [Support Module](#13-support-module)
14. [Shared / Utility Pages](#14-shared--utility-pages)
15. [Improvement Areas — Patient Care & Tracking](#15-improvement-areas--patient-care--tracking-enhancements)
16. [Gap Analysis Summary](#16-gap-analysis-summary)
17. [Architectural Alignment — Agency-Mediated Workflow](#17-architectural-alignment--agency-mediated-workflow-corrections)
18. [Spec Compliance Audit — Remaining Gaps & New Pages](#18-spec-compliance-audit--remaining-gaps--new-pages)
19. [Mobile Architecture & Deployment Strategy](#19-mobile-architecture--deployment-strategy)
20. [Mobile-First Optimization Spec](#20-mobile-first-optimization-spec)
21. [Build Status Audit — All Pages](#21-build-status-audit--all-pages)

---

## 1. Global Navigation & Layout

### PublicNavBar *(persistent top bar)*
- **Left:** CareNet logo + wordmark (pink gradient Heart icon)
- **Center (md+):** Nav links — Home · Marketplace · About · Features · Pricing
- **Right:** Notifications bell (badge count) · Settings gear · Theme toggle (sun/moon) · Login button (gradient) · Register button (outline)
- **Mobile:** Hamburger menu collapses center nav into a drawer

### BottomNav *(mobile persistent footer)*
- 5-item tab bar: Home · Search · Messages · Notifications · Profile
- Active tab highlighted with pink gradient underline
- Sticks to bottom on mobile, hidden on desktop

### Layout Component *(wraps all authenticated role pages)*
- **Left Sidebar (desktop):** Role-specific nav links with icons, role badge (Caregiver / Guardian / Admin etc.), user avatar + name, logout link
- **Mobile Sidebar:** Slide-in drawer triggered by menu button in top bar
- **Top Bar (within layout):** Page title area, breadcrumb, role color-coded accent
- **Content Area:** Scrollable main content with `pb-24` bottom padding (space for BottomNav)
- **Role Color Coding:**
  - Caregiver → Pink (#DB869A)
  - Guardian → Green (#5FB865)
  - Patient → Blue (#0288D1)
  - Agency → Teal (#00897B)
  - Admin → Purple (#7B5EA7)
  - Moderator → Amber (#E8A838)
  - Shop → Orange (#E64A19)

---

## 2. Public Module

### 2.1 Home Page
**Route:** `/` or `/home`

**Sections (top → bottom):**
1. **Hero Block** — Pink gradient background (`#FFF5F7`), radial decorative blur circles, centered text:
   - Headline: "CareNet" (5xl–6xl)
   - Subheading: "Quality care, connected"
   - Body copy: Bangladesh trust statement
   - **3 CTA Buttons (stacked on mobile, row on sm+):**
     - `Register` → `/auth/role-selection` (pink gradient)
     - `Job Portal` → `/marketplace` (green gradient)
     - `Care Shop` → `/shop` (orange gradient)
2. **Why CareNet? — Feature Grid (2×2)**
   - Each card: circle icon (pink gradient) + emoji + title + description paragraph
   - Cards: Verified Caregivers · Vetted Agency Network · Real-Time Tracking · Single Integrated Platform
   - Hover: card lifts with shadow
3. **Need Help? — Contact Block**
   - Phone number row: icon + number + `Send SMS` (green gradient button)
   - Email row: icon + address + `Email Now` (pink gradient button)
   - Wrapped in a finance-card (rounded-2xl, soft shadow)

---

### 2.2 About Page
**Route:** `/about`

**Sections:**
1. **Back to Home** — Ghost button top-left
2. **Hero Block** — Pink tinted bg, centered Heart icon (pink gradient circle), "CareNet" headline, tagline, description paragraph
3. **One Platform** — Centered 2-paragraph mission statement
4. **How It Works — 4-card grid** (Patient · Caregiver · Agency · Shop) — each card: emoji + title + description + footer note "All connected through CareNet"
5. **Built on Trust — 3-card row** — Verified Network · Real-Time Tracking · Single Integrated Platform
6. **Built for Everyone — Accordion** — 4 expandable rows (Patients & Families · Caregivers · Agencies · Shops), each expands to show 1–2 sentence value prop; pink border highlight on active
7. **Why CareNet Exists — Story card** — 2 paragraphs in finance-card
8. **Impact Snapshot — 4-stat grid** — 10,000+ professionals · 25+ partners · 98% satisfaction · Award 2024
9. **Core Values — 5-card grid (2×5 on mobile, row on md)** — emoji + title per value
10. **Final CTA** — "Find Care" (pink gradient) + "Join as a Partner" (outline) buttons centered

---

### 2.3 Features Page
**Route:** `/features`

**Layout:** Centered empty state placeholder
- 🐣 Egg hatching emoji
- "Features · Will be hatching soon..."
- Back to Home button (outline)
- *(Planned: full feature breakdown page)*

---

### 2.4 Pricing Page
**Route:** `/pricing`

**Layout:** Centered empty state placeholder
- 🐣 Egg hatching emoji
- "Pricing · Will be hatching soon..."
- Back to Home button (outline)
- *(Planned: tiered pricing plans)*

---

### 2.5 Marketplace / Job Portal
**Route:** `/marketplace`

**Sections:**
1. **Back to Home** button
2. **Header** — "Caregiver Marketplace" h1 + subtitle
3. **Search + Filter Bar** — Search input (icon left) + Filters button (outline, Filter icon)
4. **Results Count** — "X Jobs Found"
5. **Job Listing Cards** *(vertical stack)*:
   - Each card (finance-card, hover shadow):
     - Row 1: Job title + `Verified` green badge (if agency verified)
     - Row 2: Location · Salary · Experience (meta row with icons)
     - Row 3: Description paragraph
     - Row 4: Skill pills (pink tint bg, pink text)
     - Row 5: Agency info (blue-gradient avatar, name, star rating) + `Apply Now` (pink gradient) + `Details` (outline) buttons
   - Live filtering by search query against title/description

---

### 2.6 Contact Page
**Route:** `/contact`

- Contact form with: Name · Email · Subject · Message textarea
- Submit button (pink gradient)
- Contact info sidebar: phone, email, address
- Map placeholder or embedded map

---

### 2.7 Privacy Policy Page
**Route:** `/privacy`

- Legal document layout: sections with headings (h2), body paragraphs
- Table of contents sidebar or anchor nav
- Last updated date

---

### 2.8 Terms of Service Page
**Route:** `/terms`

- Legal document layout: numbered sections, body paragraphs
- "I Agree" CTA at bottom (used in registration flow)

---

### 2.9 Global Search Page
**Route:** `/search`

- Full-width search bar (autofocus)
- Filter tabs: All · Caregivers · Jobs · Products · Articles
- Result cards grouped by type

---

### 2.10 Dashboard (Role Router)
**Route:** `/dashboard`

- Detects logged-in user role and redirects to appropriate role dashboard
- Shows loading spinner while determining role

---

### 2.11 Messages Page (General)
**Route:** `/messages`

- Two-panel layout: conversation list (left) + chat window (right)
- Conversation list: avatar, name, last message preview, timestamp, unread badge
- Chat window: message bubbles (sent right pink, received left gray), text input + send button

---

### 2.12 Notifications Page
**Route:** `/notifications`

**Sections:**
1. **Header** — "Notifications" title + subtitle
2. **Notification List** (finance-card, divide-y):
   - Each item: icon badge (color-coded by type: info=blue, success=green, warning=orange) + title (bold) + message text + timestamp (right-aligned)
   - Types: Job Match · Payment Success · New Message · Schedule Reminder
   - Empty state: centered "No notifications" text

---

### 2.13 Settings Page
**Route:** `/settings`

**Sections:**
1. **Header** — "Settings" h1 + subtitle
2. **Account & Profile group** (finance-card, divide-y):
   - Profile Information (blue icon) → chevron right
   - Security & Password (purple icon) → chevron right
   - Two-Factor Auth (green icon) → chevron right
3. **App Preferences group** (finance-card, divide-y):
   - Notifications (orange icon)
   - Privacy Settings (indigo icon)
   - Language & Region (sky icon)
   - Theme Customization (pink icon)
4. **Support & Legal group**:
   - Help & Support (gray icon)
   - Data Usage (gray icon)
5. **Theme Selector** — 3 toggle buttons (Light / Dark / System), active state with pink border + pink background
6. **Logout Block** — Red-tinted card, LogOut icon, "Confirm Logout" link → `/auth/login`

---

## 3. Authentication Module

### 3.1 Login Page
**Route:** `/auth/login`

**Layout:** Full-screen centered card (max-w-md)
- CareNet logo (Heart icon, pink gradient rounded-2xl)
- "Sign In" heading
- **Form:**
  - Phone number field (Phone icon left)
  - Password field (Lock icon left, Eye/EyeOff toggle right)
  - "Forgot password?" link → `/auth/forgot-password`
  - Submit button (pink→purple gradient)
- Footer: "Don't have an account? Register" → `/auth/role-selection`

---

### 3.2 Role Selection Page
**Route:** `/auth/role-selection`

**Layout:** Full-screen, max-w-2xl centered
1. **Back to Home** ghost button
2. **Header** — Heart icon (pink gradient circle), "Choose Your Role" h1, subtitle
3. **Info banner** — "New registration will guide you through role-specific setup..."
4. **Role Cards** *(vertical stack, each as finance-card)*:
   - Each row: gradient icon square + Title + Description + chevron right
   - 9 roles listed:
     1. Guardian / Family Member (pink gradient)
     2. Caregiving Agency (blue gradient)
     3. Agency Manager (blue gradient)
     4. Caregiver (green gradient)
     5. Patient (purple gradient)
     6. Medical Shop / Pharmacy (teal gradient)
     7. Shop Manager (teal gradient)
     8. Platform Moderator (amber gradient)
     9. Platform Admin (purple gradient)
   - Click → navigates to appropriate dashboard or register route

---

### 3.3 Register Page
**Route:** `/auth/register/:role`

**Layout:** Full-screen centered (max-w-md), 2-step wizard

**Step Indicator:** 2 numbered circles connected by a line; completed step shows CheckCircle; color matches selected role

**Step 1 — Basic Info:**
- Full Name (User icon)
- Phone Number (Phone icon, tel input)
- Password (Lock icon, Eye/EyeOff toggle, minLength=8)
- District / Area (MapPin icon)
- "Continue" button (role-colored gradient)

**Step 2 — Role-Specific Fields (conditional):**
- **Caregiver:** Specialty dropdown + Years of Experience number input
- **Guardian:** Relation to Patient dropdown
- **Patient:** Date of Birth (Calendar icon) + Primary Condition (optional text)
- **Agency:** Agency Name + License/Registration No.
- **Shop:** Shop Name + Product Category dropdown
- Terms of Service checkbox (link to /terms and /privacy)
- Back + Create Account buttons; Create Account disabled until checkbox checked

**Footer:** "Already have an account? Sign In" link

---

### 3.4 Forgot Password Page
**Route:** `/auth/forgot-password`

**State 1 — Phone Input:**
- Back to Login link (ArrowLeft)
- Heart logo (pink gradient)
- "Forgot Password?" heading + instruction text
- Phone number field (Phone icon)
- "Send OTP" button (pink→purple gradient)

**State 2 — OTP Sent Confirmation:**
- Green circle with CheckCircle icon
- "OTP Sent!" heading
- Confirmation text with masked phone number
- "Enter OTP" button → navigates to Reset Password page

**Footer:** "Remember your password? Sign In" link

---

### 3.5 Reset Password Page
**Route:** `/auth/reset-password`

- Back to Login link
- Heart logo
- "Reset Password" heading
- OTP 6-box input row (each box: single digit, keyboard-aware focus progression)
- New Password field
- Confirm Password field
- "Reset Password" submit button
- Resend OTP link

---

### 3.6 MFA Setup Page
**Route:** `/auth/mfa-setup`

**4-step progress bar** (Step circles: Select → Setup → Verify → Done), connected by lines, completed steps colored pink

**Step 1 — Select Method:**
- Heading: "Set Up 2FA"
- 3 radio-style option cards:
  - SMS OTP (Smartphone icon)
  - Authenticator App (Shield icon) + "Recommended" green badge
  - WhatsApp OTP (MessageSquare icon)
- Selected card: pink border + pink tint background
- "Continue" button → ArrowRight

**Step 2 — Setup:**
- *If App:* QR code placeholder grid (5×5 random blocks) + "Or enter key manually" + code block with copy button
- *If SMS/WhatsApp:* Phone icon circle + "OTP sent to +880 1X-XXXX-XXXX"
- "I've Scanned It / Got the OTP" button

**Step 3 — Verify:**
- "Verify Setup" heading
- 6-box OTP input row (auto-focus on fill)
- "Confirm & Enable 2FA" button (disabled until all filled)

**Step 4 — Done:**
- Green CheckCircle icon (large)
- "2FA Enabled!" heading + confirmation text
- "Go to Dashboard" button

**Skip for now** link below card

---

### 3.7 MFA Verify Page
**Route:** `/auth/mfa-verify`

- Back to Login link
- Heart logo + Shield icon (purple tint)
- "Two-Factor Verification" heading + instructions
- 6-box OTP input (numeric, keyboard-aware backspace focus, red border on error)
- Demo hint box: "use code 123456"
- "Verify & Sign In" submit button (disabled while loading)
- Footer links: Resend code · Use backup code

---

### 3.8 Verification Result Page
**Route:** `/auth/verification-result`

- Full-screen centered result screen
- *Success state:* Green checkmark + "Verification Complete" + "Proceed to Dashboard" button
- *Pending state:* Clock icon + "Under Review" message + estimated timeframe
- *Failed state:* Red X + reason + "Re-submit Documents" button

---

## 4. Caregiver Module

### 4.1 Caregiver Dashboard
**Route:** `/caregiver/dashboard`

**Wrapped in `<Layout role="caregiver">`**

**Sections:**
1. **Header Row** — "Good Morning, Karim! 👋" + date subtitle + `View Jobs` (border) + `My Schedule` (pink gradient) buttons
2. **Stats Row (2×2 → 4-col on lg):**
   - Active Jobs (Briefcase, pink)
   - Avg. Rating (Star, amber) + review count
   - This Month Earnings (DollarSign, green) + % change
   - Hours Worked (Clock, purple) + month label
3. **2-column grid (lg:col-span-2 + 1):**
   - **Earnings Area Chart** (recharts AreaChart, pink gradient fill, 6-month data) + badge "+27% this month"
   - **Today's Schedule** — vertical list of time blocks (time + duration / patient + type)
4. **Recent Jobs Table** — Patient · Care Type · Date · Amount · Status columns; status badges (active/completed/cancelled)
5. **Quick Actions 4-grid:**
   - Find New Jobs → `/caregiver/jobs`
   - Check Messages → `/caregiver/messages`
   - Update Availability → `/caregiver/schedule`
   - View Reviews → `/caregiver/reviews`

---

### 4.2 Caregiver Profile Page
**Route:** `/caregiver/profile`

**Sections:**
1. **Profile Header Card** — gradient banner (pink) behind; avatar (letter, 24×24, gradient, rounded-2xl) with camera overlay button; name + Verified badge (green) + title + location/experience/rating meta row; bio text (editable textarea when in edit mode); `Edit Profile` toggle button
2. **Contact Info + Rate cards (2-col):**
   - Contact card: Phone · Email · Location (each with icon in pink-tint square)
   - Rate & Availability card: Daily rate large text + 7-day pill toggles (Mon-Fri = active pink, Sat-Sun = gray)
3. **Skills & Specializations** — Wrapped pill tags (pink border, pink text)
4. **Languages** — Gray pill tags
5. **Save Changes / Cancel buttons** (visible only in edit mode)

---

### 4.3 Caregiver Assigned Patients Page *(New — See Section 17.3.11)*
**Route:** `/caregiver/patients` — Full wireframe in Section 17.3.11

---

### 4.4 Caregiver Structured Care Log Form *(New — See Section 17.3.12)*
**Route:** `/caregiver/care-log/new` — Full wireframe in Section 17.3.12

---

### 4.5 Caregiver Jobs Page *(Renumbered from 4.3)*
**Route:** `/caregiver/jobs`

**Sections:**
1. **Header** — "Find Jobs" + subtitle
2. **Filter Bar (finance-card):**
   - Search input (text)
   - Care Type select dropdown (with Filter icon)
3. **Job Count** — "X jobs found"
4. **Job Cards Grid (1-col → 2-col on lg):**
   - Each card (cn-card-flat, hover shadow):
     - Row 1: Job title + `Urgent` red badge (conditional) + Bookmark toggle
     - Patient name + age
     - Meta: Location · Duration · Budget · Rating (if set)
     - Skill pills (pink-tint)
     - Footer: "Posted X ago" left + `Details` + `Apply Now` buttons right

---

### 4.4 Caregiver Job Detail Page
**Route:** `/caregiver/jobs/:id`

- Back button
- Job title + agency name
- Full description + requirements
- Location map placeholder
- Salary range + experience required
- Patient details section
- Application form: cover letter textarea + availability radio + submit button
- Related jobs sidebar

---

### 4.5 Caregiver Schedule Page
**Route:** `/caregiver/schedule`

**Sections:**
1. **Header Row** — "My Schedule" + `Week` / `List` toggle buttons + `+ Add Slot` button (pink gradient)
2. **Week View** (toggled):
   - Navigation: prev/next week with ChevronLeft/Right + current week label
   - Grid: 8 columns (Time + 7 days) × 12 rows (8 AM–7 PM); min-w-600px with horizontal scroll
   - Color-coded event blocks per cell (event label + patient name, colored bg + left border)
3. **List View** (toggled):
   - Booking cards (each): User avatar square + patient name + care type + time + date + status badge (confirmed=green, pending=amber)
4. **Weekly Availability Panel:**
   - 7 day toggles (Mon–Sun); active = pink border/bg, inactive = gray
   - `Save Availability` button

---

### 4.6 Caregiver Earnings Page
**Route:** `/caregiver/earnings`

**Sections:**
1. **Header** — "Earnings" + `Export` button (Download icon, pink gradient)
2. **Summary Cards (2-col → 4-col):** Available Balance · This Month · Total Earned · Hours This Month
3. **Charts + Withdraw (2-col on lg):**
   - **Earnings vs Withdrawals BarChart** (earned = light pink bars, withdrawn = dark pink bars)
   - **Withdraw Panel:**
     - Gradient card showing balance (big white number)
     - Payment method list (bKash/Nagad/Rocket, primary tagged green)
     - Amount input + `Withdraw Now` button
4. **Transaction History** — list (divide-y): icon (green arrow-in / red arrow-out) + description + date + amount (green/red)

---

### 4.7 Caregiver Messages Page
**Route:** `/caregiver/messages`

- Two-panel: conversation list left + chat window right
- Conversation items: avatar + patient/guardian name + last message snippet + timestamp + unread count badge
- Chat window: message bubbles (pink = sent, gray = received) + time labels + text input + send button

---

### 4.8 Caregiver Reviews Page
**Route:** `/caregiver/reviews`

- **Stats Header:** Average rating (large star display) + total review count + rating distribution bars (5★ to 1★)
- **Review Cards (list):** reviewer name + avatar + date + star rating + comment text
- **Respond button** per review (optional modal)

---

### 4.9 Caregiver Documents Page
**Route:** `/caregiver/documents`

- Document upload sections: NID · Medical Certificate · Training Certificates · Police Clearance
- Each item: document name + status badge (Verified/Pending/Rejected) + upload button + preview thumbnail
- Overall verification status banner (green if all verified)

---

### 4.10 Daily Earnings Detail Page
**Route:** `/caregiver/earnings/daily/:date`

- Date heading
- Itemized list: session name + hours + rate + subtotal
- Total for the day
- Back to Earnings link

---

### 4.11 Job Application Detail Page
**Route:** `/caregiver/jobs/application/:id`

- Application status timeline (Applied → Reviewed → Interview → Accepted/Rejected)
- Job summary card
- Cover letter text
- Interviewer notes (if applicable)
- Withdraw application button

---

### 4.12 Payout Setup Page
**Route:** `/caregiver/payout-setup`

- Add/manage payout accounts (bKash, Nagad, Rocket, Bank)
- Form: account type select + account number + account holder name + verify button
- Linked accounts list with primary/remove actions

---

### 4.13 Portfolio Editor Page
**Route:** `/caregiver/portfolio`

- Rich text or card-based editor
- Add project/case cards: title + care type + duration + outcome
- Drag-to-reorder
- Publish / Save draft buttons

---

### 4.14 Reference Manager Page
**Route:** `/caregiver/references`

- List of professional references: name + relation + phone + email
- Add reference form (bottom or modal)
- Verify reference toggle (sends SMS to referee)

---

### 4.15 Shift Detail Page
**Route:** `/caregiver/schedule/shift/:id`

- Shift header: patient name + date/time
- Check-in / Check-out buttons (with GPS confirmation)
- Care log entry textarea
- Vitals recorded (if applicable)
- Patient notes sidebar

---

### 4.16 Skills Assessment Page
**Route:** `/caregiver/skills-assessment`

- Multi-section quiz per skill category
- Progress bar through questions
- Score result screen with recommendations
- Badge earned display

---

### 4.17 Tax Reports Page
**Route:** `/caregiver/tax-reports`

- Year selector dropdown
- Summary: Total earned · Tax deducted · Net payable
- Monthly breakdown table
- Download TIN certificate / Statement PDF button

---

### 4.18 Training Portal Page
**Route:** `/caregiver/training`

- Course card grid: thumbnail + course name + progress bar + hours + category badge
- Enrolled / Available / Completed tabs
- Course detail modal/page with video embed + quiz

---

## 5. Guardian Module

### 5.1 Guardian Dashboard
**Route:** `/guardian/dashboard`

> **Architectural Note:** Guardian dashboard reflects the agency-mediated workflow. Guardians submit care requirements to agencies — they do not hire caregivers directly.

**Sections:**
1. **Header Row** — "Welcome, Rashed! 👋" + date subtitle + `Submit Care Requirement` button (green gradient)
2. **Alert Banner** — Amber-tinted alert box (AlertCircle icon) with medication reminder text or care requirement status update
3. **Stats (2-col → 4-col):** Patients · Active Placements · This Month Spending · Total Sessions
4. **Active Care Requirements Banner** — Summary of open requirements with status badges (Submitted / Agency Reviewing / Job Created)
5. **2-column grid:**
   - **Monthly Care Spending AreaChart** (green gradient fill, 6-month trend)
   - **Recent Activity Feed** — icon badge (color per type) + text + timestamp (includes requirement updates, placement events, shift completions)
6. **My Patients Panel** — 2-col patient cards: avatar (letter circle) + name + age + condition + assigned agency + caregiver name + placement status badge

---

### 5.2 Agency & Caregiver Search Page *(Revised)*
**Route:** `/guardian/search`

**Sections:**
1. **Green gradient hero header** — "Find a Care Agency" h1 + search input + specialty pills + location filter (See 17.2.2)
2. **Results area (overlapping hero by -mt-12):**
   - Count + Filters button
   - **Agency Cards (primary) + Caregiver Cards (secondary, read-only) — See Section 17.2.2:**
     - Photo (rounded-2xl) + Verified shield overlay
     - Name + type + price-per-hour
     - Rating · Location · Experience meta row
     - Specialty pill tags
     - Chevron right → links to public profile

---

### 5.3 Caregiver Public Profile Page *(See Section 17.2.3 for corrections)*
**Route:** `/guardian/caregiver/:id`

- Large banner + profile photo
- Name + verification badge + rating + review count
- Specialty tags + experience + location
- About section (bio)
- Reviews section (star distribution + review list)
- Availability calendar
- ~~`Book Now` CTA button → BookingWizard~~ **REMOVED — See Section 17.2.3**
- Contact button

---

### 5.4 Caregiver Comparison Page *(See Section 17.2.4 for corrections)*
**Route:** `/guardian/compare`

- Side-by-side comparison table (2–3 caregivers)
- Rows: Price · Rating · Experience · Specialties · Availability · Verified status
- "Select" button per column

---

### 5.5 ~~Booking Wizard Page~~ **REPLACED — See Section 17.3.3 (Care Requirement Wizard)**
**Route:** `/guardian/booking` → **Redirect to** `/guardian/care-requirements/new`

> **DEPRECATED:** This entire section is replaced by the Care Requirement Wizard (Section 17.3.3). The content below is kept for historical reference only.

**~~Pink gradient header~~ with 4-step progress bar** (DEPRECATED)

**Step 1 — Service Details:**
- 2×2 service type grid: Full Day Care · Post-Op Recovery · Daily Check-in · Medical Support
- Each tile: icon square + name + starting price

**Step 2 — Schedule:**
- Date picker card (Calendar icon + large date text)
- Time slot grid: 4 time options as bordered buttons (hover: pink border)

**Step 3 — Patient Info:**
- Pre-selected patient card (pink border, CheckCircle) with name + age + condition
- "+ Add New Patient" dashed-border button

**Step 4 — Payment Summary:**
- Fee breakdown: Service fee + Platform fee → Total (large green)
- Payment method grid: bKash (pre-selected, pink border) + Card

**Navigation:** Back + Next Step / Confirm Booking buttons (Next = pink gradient, full-width)

**Success Screen:** Animated scale-in card, green CheckCircle, booking confirmation message, "Go to Dashboard" button

---

### 5.6 Guardian Schedule Page
**Route:** `/guardian/schedule`

- Calendar view of upcoming care sessions
- Filter by patient
- Session cards: caregiver name + time + care type + status
- Cancel/reschedule action buttons

---

### 5.7 Guardian Patients Page
**Route:** `/guardian/patients`

- Patient list/grid (add, edit, archive)
- Per patient: name + age + condition + assigned caregiver + status
- `+ Add Patient` button → Patient Intake form (modal or route)
- Patient detail drill-down: care history, medical notes, caregiver contact

---

### 5.8 Patient Intake Page
**Route:** `/guardian/patient-intake`

- Multi-step form: Basic Info → Medical History → Emergency Contacts → Preferences
- Fields: name, DOB, gender, conditions, medications, allergies, mobility level, dietary needs
- Upload medical documents
- Submit → assigns patient to guardian profile

---

### 5.9 Guardian Messages Page
**Route:** `/guardian/messages`

- Conversation list (caregivers + agency contacts)
- Chat window with read receipts
- File/document attachment option

---

### 5.10 Guardian Payments Page
**Route:** `/guardian/payments`

- **Balance summary** + payment methods card
- **Active subscriptions** (current caregiver plan)
- **Transaction history table:** date · description · amount · status
- `Pay Invoice` / `Add Card` CTA buttons
- Monthly spending chart (line)

---

### 5.11 Invoice Detail Page
**Route:** `/guardian/payments/invoice/:id`

- Invoice header: invoice number + date + status badge
- Line items: care sessions × rate
- Subtotal + platform fee + total
- Download PDF button
- Pay Now button (if unpaid)

---

### 5.12 Guardian Reviews Page
**Route:** `/guardian/reviews`

- Reviews given (past caregivers) + reviews received (as guardian)
- Star rating + written review per caregiver
- `Write Review` modal: star selector (1–5) + text area + submit

---

### 5.13 Guardian Profile Page
**Route:** `/guardian/profile`

- Profile header: avatar + name + Verified badge + relation/location
- Edit mode toggle
- Contact info (phone, email, address)
- Linked patients section
- Notification preferences

---

### 5.14 Family Hub Page
**Route:** `/guardian/family-hub`

- Overview of all family members under care
- Care summary per patient (caregiver, schedule, next appointment)
- Quick actions: message caregiver, view care log, emergency contact

---

## 6. Patient Module

### 6.1 Patient Dashboard
**Route:** `/patient/dashboard`

**Sections:**
1. **Header** — "Good Morning, Abdul! 👋" + health summary date
2. **Today's Caregiver Banner** — gradient card (pink→green soft), caregiver avatar + name + on-duty hours + green "Active" badge
3. **Today's Vitals (2-col → 4-col grid):**
   - Blood Pressure · Blood Glucose · Pulse Rate · Weight
   - Each stat-card: icon in color-tint circle + value + unit + label + status badge (Normal/High/Borderline) + trend arrow
4. **Today's Medications:**
   - List of medication items: pill emoji + name + time
   - Taken = green tint bg + "✓ Taken" badge
   - Not taken = gray bg + "Mark Taken" blue button
   - "View all" link → `/patient/medical-records`
5. **Quick Access 4-grid:**
   - Care History · Medical Records · My Profile · Emergency (red)

---

### 6.2 Patient Profile Page
**Route:** `/patient/profile`

- Profile header: avatar + name + age + conditions
- Edit mode toggle
- Personal info (DOB, blood type, gender, address)
- Emergency contacts list
- Assigned guardian info
- Medical summary (conditions, allergies)

---

### 6.3 Patient Care History Page
**Route:** `/patient/care-history`

- Timeline or table of past care sessions
- Each entry: caregiver name + date + care type + duration + rating given
- Expandable for notes/log

---

### 6.4 Patient Medical Records Page
**Route:** `/patient/medical-records`

- Document categories: Lab Reports · Prescriptions · Imaging · Discharge Summaries
- Grid of document cards: name + date + type badge + preview/download button
- `Upload Document` button
- Doctor note section

---

### 6.5 Patient Health Report Page
**Route:** `/patient/health-report`

- Date range selector
- Vitals trend charts (line charts: BP, glucose, pulse, weight over time)
- Summary panel: averages + flags (items outside normal range)
- Export as PDF button

---

### 6.6 Vitals Tracking Page
**Route:** `/patient/vitals`

- **Log new reading** form: vital type select + value + time
- **History list** (last 30 entries) with color-coded status
- Line chart for selected vital over chosen period

---

### 6.7 Medication Reminders Page
**Route:** `/patient/medications`

- Medication list: name + dose + frequency + time(s)
- Add/edit/delete medication
- Today's schedule (time-sorted)
- Taken/missed toggle per dose
- Adherence percentage badge (this week/month)

---

### 6.8 Emergency Hub Page
**Route:** `/patient/emergency`

- **Large SOS button** (red gradient, centered, pulse animation)
- Emergency contacts list: name + relation + phone + `Call` button each
- Nearest hospital/clinic list (location-based or static)
- Care instructions / medical summary for first responders
- Share location button

---

### 6.9 Data Privacy Manager Page
**Route:** `/patient/data-privacy`

- Data sharing toggles: allow caregiver access · allow guardian access · analytics opt-out
- Download my data button
- Delete account section (with confirmation step)
- Data retention info

---

## 7. Agency Module

### 7.1 Agency Dashboard
**Route:** `/agency/dashboard`

**Sections:**
1. **Header** — "Agency Dashboard" + "HealthCare Pro BD — March 15"
2. **Stats (2-col → 4-col):** Active Caregivers · Active Clients · Revenue (Mar) · Avg Rating ★
3. **2-column (lg:2+1):**
   - **Monthly Revenue BarChart** (teal bars, 6-month data)
   - **Top Caregivers mini-list** — avatar + name + rating + jobs count + status badge + "View all" link
4. **Quick Action 4-grid:** Requirements Inbox (NEW — see 17.3.7) · Manage Caregivers · Active Placements (NEW — see 17.3.9) · Shift Monitor (NEW — see 17.3.13)

---

### 7.2 Agency Caregivers Page
**Route:** `/agency/caregivers`

- Search + filter (specialty, status)
- Caregiver table: name · specialty · rating · active jobs · status · actions
- `+ Add Caregiver` button
- Actions per row: View Profile · Assign Client · Suspend

---

### 7.3 Agency Clients Page
**Route:** `/agency/clients`

- Client table: patient name · guardian name · care type · start date · assigned caregiver · status
- `+ Add Client` button → Client Intake form

---

### 7.4 Client Intake Page
**Route:** `/agency/client-intake`

- Multi-step intake form: Patient info → Medical history → Service requirements → Caregiver assignment
- Similar to Guardian's Patient Intake but with agency-specific fields (service level, billing tier)

---

### 7.5 Client Care Plan Page
**Route:** `/agency/clients/:id/care-plan`

- Care plan document: goals, interventions, schedule, responsible caregiver
- Edit/approve/version history
- Print/export PDF

---

### 7.6 Agency Payments Page
**Route:** `/agency/payments`

- Revenue summary (monthly/YTD)
- Pending payouts to caregivers
- Invoice list for clients
- Bank/MFS account settings

---

### 7.7 Agency Reports Page
**Route:** `/agency/reports`

- Report type tabs: Performance · Financial · Compliance · Client Satisfaction
- KPI cards per section
- Charts (bar/line)
- Export CSV/PDF

---

### 7.8 Agency Storefront Page
**Route:** `/agency/storefront`

- Public-facing agency profile preview
- About text editor + banner image upload
- Service listing management (add/edit care packages)
- Reviews widget
- Live preview toggle

---

### 7.9 Branch Management Page
**Route:** `/agency/branches`

- List of branches: name + location + manager + caregiver count + status
- `+ Add Branch` button
- Map view (placeholder) of branch locations

---

### 7.10 Staff Attendance Page
**Route:** `/agency/attendance`

- Date picker + caregiver filter
- Attendance grid: caregiver rows × date columns; each cell = Present/Absent/Late badge
- Export attendance sheet button

---

### 7.11 Staff Hiring Page
**Route:** `/agency/hiring`

- Open positions list (title + requirements + applications count)
- `+ Post Position` button
- Applicant cards per position: name + experience + applied date + `Review` button
- Hire/Reject actions

---

### 7.12 Incident Report Wizard Page
**Route:** `/agency/incident-report`

- Multi-step: Incident details → Parties involved → Evidence upload → Review & submit
- Date/time picker + location + incident type + severity
- Narrative text area
- Submit generates incident ID and notifies admin

---

## 8. Admin Module

### 8.1 Admin Dashboard
**Route:** `/admin/dashboard`

**Sections:**
1. **Header** — "Admin Dashboard" + date
2. **Stats (2-col → 4-col):** Total Users · Active Caregivers · Revenue (Mar) · Platform Growth %
3. **Pending Actions 4-grid:** Verifications (amber) · Reports (red) · Disputes (purple) · Withdrawals (green) — each as link to sub-page
4. **Charts 2-col:**
   - **User Growth BarChart** — 3 grouped bars (caregivers/guardians/patients) per month
   - **Monthly Revenue LineChart** — purple line, 6-month data
5. **Distribution + Activity 3-col:**
   - **PieChart (donut)** — user type distribution with legend
   - **Recent Activity Feed (col-span-2)** — icon + text + time, divide-y

---

### 8.2 Admin Users Page
**Route:** `/admin/users`

**Sections:**
1. **Header** — "User Management" + total count + `Export` + `+ Add User` (purple gradient) buttons
2. **Filters (finance-card):** Search input · Role select · Status select
3. **Data Table (finance-card):**
   - Columns: User (avatar + name + verified badge) · Role (color pill) · Phone · Location · Joined · Status (pill) · Actions (3-dot menu)
   - 3-dot menu options: View Profile · Verify User · Suspend · Delete
4. **Pagination:** showing X of Y + page number buttons

---

### 8.3 Admin Verifications Page
**Route:** `/admin/verifications`

- Pending verification queue
- Filters: role type + date + urgency
- Verification cards: user info + submitted documents + `Approve` / `Reject` / `Request More` buttons
- Bulk action toolbar

---

### 8.4 Verification Case Page
**Route:** `/admin/verifications/:id`

- Full verification case detail: user profile + submitted docs
- Document previews (NID, certificates, photos)
- Case history/notes log
- Approve with notes / Reject with reason form
- Escalate to manager option

---

### 8.5 Admin Reports Page
**Route:** `/admin/reports`

- Reports/dispute queue table: ID · type · severity · reporter · status · actions
- Filters: type, status, date range
- Bulk resolve/dismiss actions

---

### 8.6 Dispute Adjudication Page
**Route:** `/admin/disputes/:id`

- Two-party evidence section (guardian side vs. caregiver side)
- Timeline of events
- Mediator notes text area
- Decision: Favor Guardian / Favor Caregiver / Split
- Resolution notification triggers

---

### 8.7 Admin Payments Page
**Route:** `/admin/payments`

- Revenue summary KPI cards
- Pending withdrawal approvals table
- Transaction log with filters (date, type, amount, status)
- Process refund modal

---

### 8.8 Financial Audit Page
**Route:** `/admin/financial-audit`

- Period selector (month/quarter/year)
- Revenue vs. expense breakdown chart
- Detailed line-item ledger
- Export for accounting

---

### 8.9 Admin Settings Page
**Route:** `/admin/settings`

- Platform configuration: commission rates, service fee %, max withdrawal limits
- Feature flag toggles (enable/disable features)
- System email/SMS templates
- Save changes button

---

### 8.10 Policy Manager Page
**Route:** `/admin/policy`

- Policy documents list: Terms of Service · Privacy Policy · Refund Policy · Caregiver Code of Conduct
- Each document: title + version + last updated + `Edit` button
- Rich text editor for policy content

---

### 8.11 Promo Management Page
**Route:** `/admin/promos`

- Active promotions table: code · discount · type · usage count · expiry
- `+ Create Promo` button → form: code + discount type (% or flat) + conditions + expiry date
- Deactivate / extend promo actions

---

### 8.12 CMS Manager Page
**Route:** `/admin/cms`

- Homepage content editor: hero text, banners, featured caregivers
- Blog post management (list with publish/draft/archive)
- FAQ management

---

### 8.13 Support Ticket Detail Page
**Route:** `/admin/tickets/:id`

- Ticket info: submitter, issue type, priority, created date
- Conversation thread (admin ↔ user messages)
- Reply form + send button
- Status update: Open → In Progress → Resolved → Closed
- Assign to agent dropdown

---

### 8.14 Audit Logs Page
**Route:** `/admin/audit-logs`

- Chronological event log table: timestamp · user · action · target · IP address
- Filters: date range, user, action type
- Export CSV

---

### 8.15 System Health Page
**Route:** `/admin/system-health`

- Service status indicators: API · Database · Payments · Notifications · Search
- Uptime percentages (last 30 days)
- Error rate charts (line)
- Recent alerts / incidents list

---

### 8.16 User Inspector Page
**Route:** `/admin/users/:id`

- Full user profile view (admin read-only mode)
- Account activity timeline
- Current jobs/bookings
- Payment history
- Session/device log
- Manual actions: impersonate, reset password, send notification

---

### 8.17 Sitemap Page
**Route:** `/admin/sitemap`

- Visual tree of all platform routes
- Status per route: active, placeholder, disabled
- Link to navigate to any page directly

---

## 9. Moderator Module

### 9.1 Moderator Dashboard
**Route:** `/moderator/dashboard`

**Sections:**
1. **Header** — "Moderator Dashboard" + date
2. **Stats 4-grid (linked to sub-pages):**
   - Pending Reviews (Star, amber) → `/moderator/reviews`
   - Open Reports (Flag, red) → `/moderator/reports`
   - Content Flags (FileText, purple) → `/moderator/content`
   - Resolved Today (CheckCircle, green)
3. **Moderation Queue (finance-card):**
   - Heading + "31 items" red badge
   - Queue items (each in gray bg rounded-xl):
     - Priority icon (colored by low/medium/high) + type badge + priority badge
     - Content summary text
     - Reporter + time
     - Action buttons: `Review` (border) · `Approve` (green) · `Remove` (red)

---

### 9.2 Moderator Reviews Page
**Route:** `/moderator/reviews`

- Pending review approvals list
- Each review: reviewer + target + text + star rating + flags
- Approve / Edit / Remove actions
- Bulk approve option

---

### 9.3 Moderator Reports Page
**Route:** `/moderator/reports`

- Open user reports
- Filters: type (harassment, fraud, spam), priority, date
- Report cards: reporter + target + description + evidence links + action buttons
- Close/Escalate to Admin options

---

### 9.4 Moderator Content Page
**Route:** `/moderator/content`

- Flagged profiles/bios/posts
- Auto-flag vs. user-reported filter
- Content preview + policy violation category
- Remove / Warn user / Dismiss actions

---

## 10. Shop (Merchant) Module

### 10.1 Shop Dashboard
**Route:** `/shop/dashboard`

**Sections:**
1. **Header** — "Shop Dashboard" + store welcome message
2. **Stats 4-grid:** Total Sales · Active Products · New Orders · Total Customers — each with change indicator (green arrow up / red arrow down)
3. **Recent Orders Table (finance-card):**
   - Columns: Order ID · Customer · Product · Amount · Status (color badge) · Date · Actions (3-dot)
   - Status colors: Delivered = green, Processing = blue, Shipped = orange

---

### 10.2 Shop Products Page
**Route:** `/shop/products`

- Search + filter (category, price range, stock status)
- Product cards grid: image thumbnail + name + price + stock count + status badge
- `+ Add Product` → Product Editor
- Edit / Archive / Delete per product

---

### 10.3 Product Editor Page
**Route:** `/shop/products/new` and `/shop/products/:id/edit`

- **Form sections:** Name · Description (rich text) · Category · Price · Sale Price · Stock Quantity · Images (multi-upload) · Tags
- Toggle: Active / Draft / Archived
- Save Draft + Publish buttons

---

### 10.4 Shop Orders Page
**Route:** `/shop/orders`

- Orders table with advanced filter: date range, status, customer
- Order row expandable: items ordered + shipping address + payment method
- Update status dropdown per order
- Print label / Generate invoice buttons

---

### 10.5 Shop Inventory Page
**Route:** `/shop/inventory`

- Inventory table: SKU · Product · Stock · Reorder Level · Supplier · Status
- Low stock warning indicators (red badge)
- `Update Stock` form per item
- Import/export CSV

---

### 10.6 Shop Analytics Page
**Route:** `/shop/analytics`

- Revenue trend chart (line, 6–12 month)
- Top products by sales (bar chart or ranked list)
- Customer demographics (pie chart)
- Order fulfillment time average
- Date range picker

---

### 10.7 Merchant Onboarding Page
**Route:** `/shop/onboarding`

- Multi-step setup: Business Info → Product Catalog → Bank Details → Verification
- Each step: form + save & continue
- Progress stepper (horizontal)
- Completion banner + "Go to Dashboard" CTA

---

### 10.8 Merchant Analytics Page
**Route:** `/shop/merchant-analytics`

- Advanced analytics dashboard for merchant
- Conversion funnel, customer retention, revenue by category
- Comparison vs. previous period toggles
- Export report button

---

### 10.9 Merchant Fulfillment Page
**Route:** `/shop/fulfillment`

- Pending orders to fulfill queue
- Assign courier / mark as dispatched
- Tracking number entry
- Delivery confirmation log

---

## 11. Shop Front (Customer) Module

### 11.1 Product List Page
**Route:** `/shop` or `/shop/products`

**Sections:**
1. **Sticky Top Bar** — "CareNet Shop" + cart icon with badge count
2. **Hero Banner** — full-width pink gradient card: headline + "Get 20% off" promo text + `Shop Now` (white button) + Package illustration
3. **Search + Filter/Sort bar** — search input (large, rounded-2xl) + `Filters` button + `Sort By` dropdown
4. **Category Pills** — horizontal scroll: All · Medical Devices · Mobility · Sleep Aids · Daily Living · Hygiene · Nutrition (active = pink solid button)
5. **Product Grid (1→2→3→4 cols):**
   - Each card (rounded-3xl, hover shadow-xl):
     - Image with hover-scale, Heart wishlist button overlay, "Featured" green badge
     - Category label (xs, uppercase)
     - Product name (bold, truncate)
     - Star rating + review count
     - Price (large bold) + struck-through old price
     - Cart button (green tint, hover = solid green)
6. **Load More** button (outline)

---

### 11.2 Product Details Page
**Route:** `/shop/product/:id`

- Breadcrumb nav
- Product image gallery (main + thumbnails)
- Product name + badge + SKU
- Rating (stars) + review count
- Price + old price + discount badge
- Add to cart / Add to wishlist buttons
- Quantity selector
- Description tab + Specifications tab + Reviews tab
- Related products horizontal scroll

---

### 11.3 Product Category Page
**Route:** `/shop/category/:slug`

- Category header with banner image + name + description
- Filters sidebar: price range · brand · rating
- Product grid (same as ProductListPage grid)

---

### 11.4 Product Reviews Page
**Route:** `/shop/product/:id/reviews`

- Rating summary: average + distribution bars
- Review list: reviewer + date + rating + text + verified purchase badge
- `Write a Review` form at top (star selector + text + submit)

---

### 11.5 Cart Page
**Route:** `/shop/cart`

- Cart item list: image + name + quantity stepper + unit price + line total + remove button
- Order summary panel (sticky right):
  - Subtotal + delivery + discount (promo code input) + total
  - `Checkout` button (green gradient)
- Empty cart illustration + `Continue Shopping` button if cart empty

---

### 11.6 Checkout Page
**Route:** `/shop/checkout`

- **Form (left side):**
  - Shipping address: name + phone + address + district + area
  - Delivery method: Standard (free) / Express (fee)
  - Payment method: bKash / Nagad / Card / Cash on Delivery
- **Order Summary (right side):**
  - Item list + total
  - `Place Order` button

---

### 11.7 Order Success Page
**Route:** `/shop/order-success`

- Large green CheckCircle (animated)
- "Order Placed!" heading + order number
- Estimated delivery date
- `Track Order` + `Continue Shopping` buttons

---

### 11.8 Order Tracking Page
**Route:** `/shop/orders/:id/track`

- Order ID + placed date
- Timeline: Order Placed → Processing → Shipped → Out for Delivery → Delivered
- Current status highlighted in green with active pulsing dot
- Courier name + tracking number (if available)
- Estimated delivery date

---

### 11.9 Customer Order History Page
**Route:** `/shop/orders`

- Order cards list: order number + date + items + total + status badge
- Filter by status tabs: All · Processing · Shipped · Delivered · Cancelled
- Per order: `View Details` + `Reorder` + `Return` buttons

---

### 11.10 Wishlist Page
**Route:** `/shop/wishlist`

- Saved products grid (same card as ProductList)
- Remove from wishlist (Heart icon toggle)
- Add to cart button per item
- Empty wishlist illustration + "Explore Products" CTA

---

## 12. Community Module

### 12.1 Blog List Page
**Route:** `/blog`

**Sections:**
1. **Dark hero header** — "CareNet Blog" pill badge + "Insight into a Healthier Bangladesh" large headline (4xl–6xl) + search input (dark glass)
2. **Main + Sidebar layout (3-col grid):**
   - **Main (col-span-2):**
     - "Latest Insights" heading + filter tab row (General / Nursing / Research / News)
     - Post cards (vertical, full-width): wide aspect-ratio image (rounded-3xl) + category badge overlay + author/date/read time meta row + title (3xl bold) + excerpt + "Read Full Insight" link
   - **Sidebar (col-span-1):**
     - Newsletter sign-up card (dark bg): email input + `Subscribe Now` green button
     - Categories list: name + count
     - Trending Now: 3 mini cards (thumbnail + title + read time)

---

### 12.2 Blog Detail Page
**Route:** `/blog/:id`

- Hero image (full-width, tall aspect ratio)
- Category + author + date + read time bar
- Article body (markdown/rich text)
- Share buttons (WhatsApp, Facebook, copy link)
- Related articles section
- Author bio card

---

### 12.3 Career Page
**Route:** `/careers`

- Hero: "Join the CareNet Team" + subtitle
- Open positions grid: role + department + location + type (full-time/contract)
- Apply modal/link per position
- Culture/values section (photos + text)

---

## 13. Support Module

### 13.1 Help Center Page
**Route:** `/support`

**Sections:**
1. **Green gradient hero header** — "How can we help you?" h1 + large search input (white, shadow-2xl) + topic hashtag pills (#Booking, #Payment etc.)
2. **Category cards grid (4-col, overlapping hero):**
   - Getting Started (blue) · Payments & Fees (orange) · Trust & Safety (green) · Account Settings (pink)
   - Each: large icon + title + "12 Articles"
3. **Main + Sidebar (3-col):**
   - **Popular Articles (col-span-2):** 2-col article card grid (card with chevron right) + "Can't find what you're looking for?" dark card with `Submit a Ticket` + `Chat with Support` buttons
   - **Contact + Status Sidebar:**
     - Contact card: Phone hotline + WhatsApp
     - System status card: API / Payments / Matching — each with green operational dot

---

### 13.2 Contact Us Page
**Route:** `/support/contact`

- Name + Email + Subject + Message textarea form
- Submit button (green gradient)
- Hotline + email + office address sidebar

---

### 13.3 Ticket Submission Page
**Route:** `/support/submit-ticket`

- Issue category dropdown (Booking, Payment, Account, Technical, Other)
- Subject input
- Description textarea
- File attachment (screenshot/document)
- Priority select (Low/Medium/High)
- Submit ticket button
- Ticket confirmation message on success

---

### 13.4 Refund Request Page
**Route:** `/support/refund`

- Order/booking selector (dropdown or search)
- Reason for refund (multi-select checkboxes)
- Additional details textarea
- Evidence upload (optional)
- Submit request button
- Policy summary note

---

## 14. Shared / Utility Pages

### 14.1 404 Not Found Page
**Route:** `*` (catch-all)

- Centered layout
- Large "404" or illustrated error graphic
- "Page Not Found" heading + message
- `Go to Home` button (pink gradient)
- Search bar (optional: find the right page)

---

### 14.2 Global Search Page
**Route:** `/search`

- Full-width autofocus search input
- Result type tabs: All · Caregivers · Jobs · Products · Articles · Agencies
- Each result type has its own card style
- "No results" empty state with suggestions

---

### 14.3 Dashboard (Role Redirect)
**Route:** `/dashboard`

- Spinner/loading screen while role is determined
- Redirects: Caregiver → `/caregiver/dashboard`, Guardian → `/guardian/dashboard`, Patient → `/patient/dashboard`, Agency → `/agency/dashboard`, Admin → `/admin/dashboard`, Moderator → `/moderator/dashboard`, Shop → `/shop/dashboard`

---

## Design System Reference

| Token | Value | Usage |
|---|---|---|
| `--cn-pink` | `#DB869A` | Caregiver accent, primary CTA |
| `--cn-pink-light` | `#FEB4C5` | Caregiver light tint |
| `--cn-green` | `#5FB865` | Guardian accent, success states |
| `--cn-green-light` | `#7CE577` | Guardian light tint |
| `--cn-purple` | `#7B5EA7` | Admin accent, special elements |
| `--cn-amber` | `#E8A838` | Moderator, warning states |
| `--cn-blue` | `#0288D1` | Patient accent |
| `--cn-gradient-caregiver` | Pink radial gradient | Caregiver primary buttons |
| `--cn-gradient-guardian` | Green radial gradient | Guardian primary buttons |
| `--cn-gradient-shop` | Orange radial gradient | Shop primary buttons |

### Card Variants
- **`finance-card`** — White bg, rounded-2xl (or 3xl on newer pages), box-shadow, border-light
- **`cn-card`** — Themed bg-card, border, rounded-xl
- **`cn-card-flat`** — Flat bg variant, border-light, rounded-xl
- **`cn-stat-card`** — White/card bg, padding 5, rounded-xl, shadow-sm

### Badge / Pill Styles
- **`cn-badge`** — Inline-flex, px-2 py-0.5, rounded-full, xs text
- **`badge-pill`** — Same as cn-badge, 0.7rem font

### Status Colors
| Status | Background | Text |
|---|---|---|
| Active / Completed | `#7CE57720` | `#5FB865` |
| Pending | `#FFB54D20` | `#E8A838` |
| Cancelled / Suspended | `#EF444420` | `#EF4444` |
| Verified | `#7CE57720` | `#5FB865` |

### Layout Breakpoints
- Mobile-first: single column stacks
- `sm:` (640px): row/grid layouts begin
- `lg:` (1024px): sidebar + content two-column splits activate
- Sidebar hidden on mobile (slide-in drawer via RootLayout)

---

## 15. Improvement Areas — Patient Care & Tracking Enhancements

> **Status:** Proposed · **Priority:** Ranked by patient safety & care quality impact · **Review Date:** March 16, 2026

---

### 🔴 High-Impact (Core Care & Safety Gaps)

---

#### 15.1 Daily Care Log / Care Diary
**Proposed Routes:** `/patient/care-log` · `/guardian/care-log`

**Problem:** Caregivers can write notes inside Shift Detail, but patients and guardians have **no dedicated page to view a consolidated, chronological daily care log**. This is critical for remote families in Bangladesh who are not physically present.

**Proposed Sections:**
1. **Date Navigator** — Date picker + prev/next day arrows
2. **Timeline Feed** (vertical, timestamped entries):
   - 8:00 AM — Caregiver arrived, checked vitals (BP: 120/80)
   - 8:30 AM — Medication administered (Metformin 500mg)
   - 9:15 AM — Light exercise completed (15 min walk)
   - 12:00 PM — Lunch served, appetite good
   - 3:00 PM — Wound dressing changed, photo attached
   - Each entry: timestamp + icon (color-coded by type) + caregiver name + description + optional attachment (photo/voice note)
3. **Filter Bar** — Filter by activity type (Vitals · Medication · Meal · Exercise · Incident · Note) + caregiver filter
4. **Daily Summary Card** — Auto-generated: vitals count, medications given/missed, total care hours, mood rating
5. **Export / Share** — Download day's log as PDF, share with doctor via secure link

**Entry Types & Icons:**
| Type | Icon | Color |
|------|------|-------|
| Vitals Check | Activity | Blue `#0288D1` |
| Medication | Pill | Green `#5FB865` |
| Meal / Nutrition | UtensilsCrossed | Orange `#E8A838` |
| Exercise / Rehab | Dumbbell | Purple `#7B5EA7` |
| Incident / Alert | AlertTriangle | Red `#EF4444` |
| General Note | FileText | Gray `#6B7280` |
| Photo / Attachment | Camera | Pink `#DB869A` |

---

#### 15.2 Patient Care Plan Page
**Proposed Route:** `/patient/care-plan`

**Problem:** The agency module has `/agency/clients/:id/care-plan`, but **the patient themselves has no view of their own care plan**. Patients and guardians should see goals, interventions, and progress in a clear, motivating layout.

**Proposed Sections:**
1. **Care Plan Header** — Patient name + plan start date + last updated + assigned care team avatars
2. **My Care Team Card** — Assigned caregivers (avatar + name + role + contact), guardian info, agency contact
3. **Goals Section (card list):**
   - Each goal card: goal title + target date + progress bar (%) + status badge (On Track / At Risk / Completed)
   - Short-term goals (this week) + Long-term goals (this month/quarter)
   - Example: "Improve mobility — Walk 15 min daily" → 72% adherence this week
4. **Daily Routine / Interventions Schedule:**
   - Time-sorted list of planned interventions for today
   - Each: time + activity + responsible caregiver + checkbox (done/pending)
5. **Milestones Timeline** — Visual timeline of achieved milestones (e.g., "First unassisted walk — Feb 20", "Blood sugar normalized — Mar 1")
6. **Notes from Care Team** — Recent notes from caregiver/agency about plan adjustments
7. **Print / Export** — Download care plan as PDF for doctor visits

---

#### 15.3 Smart Health Alerts / Alert Rules Engine
**Proposed Routes:** `/guardian/alerts` · `/patient/alerts` · `/caregiver/alerts`

**Problem:** The platform has medication reminders and an emergency SOS button, but **no automated alert system** that triggers notifications based on health data thresholds. This is a major gap for remote patient monitoring.

**Proposed Sections:**
1. **Active Alerts Banner** — Red/amber banner at top showing any currently triggered alerts with quick-action buttons
2. **Alert Rules Manager (Guardian/Admin view):**
   - Rule cards (each): condition description + threshold + notification channel + enabled toggle
   - `+ Create Alert Rule` button → Rule builder form:
     - Trigger type: Vital threshold · Medication missed · Caregiver no-show · Inactivity
     - Condition: "Blood pressure exceeds 140/90" / "Medication not taken by 10:00 AM" / "Caregiver hasn't checked in by scheduled time" / "No activity logged for 4+ hours"
     - Notify: Guardian · Patient · Agency · All
     - Channel: In-app push · SMS · WhatsApp
     - Severity: Info · Warning · Critical
3. **Alert History Log (divide-y list):**
   - Each entry: severity icon (color-coded) + alert description + triggered time + acknowledged by + resolution status
   - Filter by: date range, severity, alert type, acknowledged/unacknowledged
4. **Alert Summary Stats:** Alerts triggered this week · Avg response time · Most common alert type

**Alert Severity Colors:**
| Severity | Icon | Color | Example |
|----------|------|-------|---------|
| Critical | AlertOctagon | Red `#EF4444` | BP > 180/120, caregiver no-show |
| Warning | AlertTriangle | Amber `#E8A838` | Medication 1hr overdue, vitals borderline |
| Info | Info | Blue `#0288D1` | Caregiver checked in, vitals recorded |

---

#### 15.4 Caregiver Arrival / Real-Time Tracking
**Proposed Route:** `/guardian/live-tracking`

**Problem:** The CareNet homepage advertises "Real-Time Tracking" as a core feature, but **no page exists for it**. Guardians need ride-sharing-style visibility into caregiver location and punctuality.

**Proposed Sections:**
1. **Map View (hero, 60vh):**
   - Map showing caregiver's current location pin (animated pulse)
   - Patient's home location pin
   - ETA display (large, overlaying map): "Arriving in ~12 min"
   - Route line (dotted) between caregiver and destination
2. **Caregiver Status Card (overlapping map bottom):**
   - Avatar + name + phone (tap to call) + message button
   - Status badge: En Route / Arrived / On Duty / Shift Ended
   - Shift timer: "On duty for 3h 24m"
3. **Today's Check-in/Check-out Log:**
   - Timeline: Scheduled arrival 8:00 AM → Actual arrival 8:04 AM (green "On Time" badge)
   - Geofenced confirmation: "Checked in within 50m of care location"
4. **Shift History (last 7 days):**
   - Table: Date · Scheduled · Actual Arrival · Actual Departure · Duration · Punctuality badge
5. **Geofence Settings (gear icon):**
   - Set care location address + radius (50m/100m/200m)
   - Toggle: Notify on arrival / Notify on departure

---

#### 15.5 Care Transition / Shift Handoff Page
**Proposed Route:** `/caregiver/handoff` · `/caregiver/handoff/:shiftId`

**Problem:** When caregivers swap shifts, critical patient information can be lost. There is **no formal handoff mechanism** — this is a patient safety concern.

**Proposed Sections:**
1. **Handoff Header** — Outgoing caregiver → Incoming caregiver (avatar + name for both) + patient name + handoff time
2. **Handoff Checklist (checkbox list):**
   - ☑ Medications administered (list with times)
   - ☑ Vitals recorded (last readings displayed)
   - ☑ Meals served (breakfast/lunch/dinner status)
   - ☑ Mobility/exercise completed
   - ☑ Wound care performed (if applicable)
   - ☑ Patient mood/comfort level noted
   - ☑ Equipment/supplies status
3. **Flagged Items (amber section):**
   - Items needing attention: "Patient complained of dizziness at 3 PM", "Low on medication X — needs refill", "Family visit scheduled at 5 PM"
   - Priority indicator per flag
4. **Outgoing Caregiver Notes** — Free-text area for additional context
5. **Incoming Caregiver Acknowledgment:**
   - "I have reviewed the handoff" checkbox + digital signature (name + timestamp)
   - `Accept Handoff` button (disabled until acknowledged)
6. **Handoff History** — List of past handoffs with date, caregivers, completion status, any unresolved flags

---

### 🟠 Medium-Impact (Enhanced Tracking & Monitoring)

---

#### 15.6 Symptom & Pain Journal
**Proposed Route:** `/patient/symptoms`

**Problem:** Vitals tracking covers objective numbers (BP, glucose, pulse), but **subjective symptoms have no tracking mechanism**. This data is extremely valuable for doctor visits and care plan adjustments.

**Proposed Sections:**
1. **Quick Check-in Card (top, gradient bg):**
   - "How are you feeling today?" prompt
   - Mood selector: 5 emoji buttons (Great · Good · Okay · Not Good · Bad)
   - One-tap submission for quick daily log
2. **Log New Symptom Form:**
   - Symptom type: dropdown (Pain · Nausea · Dizziness · Fatigue · Shortness of Breath · Swelling · Other)
   - Pain level: slider 1–10 with color gradient (green to yellow to red)
   - Body location: simplified body map (tappable regions: Head · Chest · Abdomen · Back · Arms · Legs)
   - Duration: "Started X hours/days ago"
   - Notes: free text
   - Trigger: "What were you doing?" (optional)
3. **Daily Wellness Metrics:**
   - Sleep quality: star rating (1-5) + hours slept
   - Appetite: Good / Fair / Poor
   - Energy level: slider 1–10
   - Fluid intake: glass counter (tap to increment)
4. **Symptom History Timeline (scrollable):**
   - Date-grouped entries with symptom type icon + severity color + description
   - Trend indicators: "Pain frequency increased this week"
5. **Trend Charts (recharts):**
   - Pain level over time (line chart)
   - Mood distribution this month (bar chart)
   - Sleep quality trend (area chart)
6. **Export for Doctor** — Generate summary PDF of last 30/90 days for doctor consultation

---

#### 15.7 Wound / Condition Photo Journal
**Proposed Route:** `/patient/photo-journal`

**Problem:** For wound care, post-surgical recovery, and skin conditions, **visual documentation of healing progress is essential** but currently unsupported.

**Proposed Sections:**
1. **Photo Timeline (vertical, date-grouped):**
   - Each entry: date + time + photo thumbnail (tap to enlarge) + caregiver name + notes
   - Photos displayed in consistent aspect ratio for easy comparison
2. **Comparison View:**
   - Side-by-side slider: select two dates to compare (e.g., Day 1 vs. Day 30)
   - Overlay toggle for annotations
3. **Add New Photo:**
   - Camera capture or gallery upload
   - Condition area label (e.g., "Left knee wound", "Surgical site")
   - Status dropdown: Improving / Stable / Worsening / Healed
   - Caregiver notes textarea
4. **Condition Trackers (grouped by condition):**
   - Each condition: name + start date + total photos + latest status badge
   - Progress indicator: photo count per week chart
5. **Share with Doctor** — Generate secure link with selected photos + notes for external sharing

---

#### 15.8 Guardian Live Dashboard
**Proposed Route:** `/guardian/live-monitor`

**Problem:** The existing Guardian Dashboard shows historical stats and summaries. Guardians need a **real-time, at-a-glance monitoring view** — especially for remote family members.

**Proposed Sections:**
1. **Overall Status Banner:**
   - Green: "Everything is on track" (green gradient) — when all vitals normal, meds taken, caregiver present
   - Amber: "Attention needed" (amber gradient) — when medication pending or vitals borderline
   - Red: "Action required" (red gradient) — when alert triggered or caregiver no-show
2. **Current Caregiver Card:**
   - Avatar + name + on-duty since + status (Active / Idle / Break)
   - Last activity: "Recorded vitals 12 min ago"
   - Quick actions: Call · Message
3. **Today's Medication Tracker (progress bar):**
   - "3 of 5 medications taken today" with pill icons (green = taken, gray = pending, red = missed)
   - Next medication: "Metformin 500mg — Due at 2:00 PM"
4. **Latest Vitals Snapshot (2x2 grid):**
   - BP · Glucose · Pulse · Temperature
   - Each: value + status badge (Normal/High/Low) + "recorded X min ago"
   - Tap any to see trend chart
5. **Live Care Log Feed (auto-refresh):**
   - Last 5 care log entries (scrollable)
   - Real-time updates indicator (pulsing green dot)
6. **Today's Schedule Progress:**
   - Planned activities with checkmarks: Morning vitals (done) · Breakfast (done) · Physiotherapy (pending) · Lunch (pending) · Evening medication (pending)
7. **Quick Alert Actions:**
   - "Call Caregiver" button
   - "Send Alert to Agency" button
   - "Emergency SOS" button (red, links to `/patient/emergency`)

---

#### 15.9 Care Quality Scorecard
**Proposed Routes:** `/guardian/care-scorecard` · `/agency/care-scorecard`

**Problem:** There's no aggregated view of **care quality metrics** over time. Guardians and agencies need to track whether the care being delivered is consistent and meeting standards.

**Proposed Sections:**
1. **Overall Quality Score (hero card):**
   - Large circular score indicator (e.g., 87/100) with color (green > 80, amber 60-80, red < 60)
   - Trend arrow: "Up 5 points from last month"
2. **Metric Breakdown (4-col stat cards):**
   - Medication Adherence: 94% (% of doses taken on time)
   - Vitals Recording Consistency: 88% (% of expected recordings completed)
   - Caregiver Punctuality: 96% (% of shifts started within 15 min of schedule)
   - Patient Satisfaction: 4.6/5 (from periodic check-in surveys)
3. **Trend Charts (2-col):**
   - Quality score over time (line chart, 12 weeks)
   - Metric comparison radar chart (adherence, punctuality, satisfaction, vitals, incidents)
4. **Incident Log Summary:**
   - Total incidents this period + breakdown by type
   - Comparison vs. previous period
5. **Period Selector** — This week · This month · Last 3 months · Custom range
6. **Recommendations Panel:**
   - AI-generated suggestions based on scorecard: "Medication adherence dropped on weekends — consider reminder adjustments"
   - Flagged patterns: "Vitals not recorded on 3 consecutive Fridays"

---

#### 15.10 Telehealth / Video Consultation
**Proposed Route:** `/patient/telehealth`

**Problem:** Bangladesh has limited specialist access, especially in rural areas. **Telehealth capability** would dramatically improve care quality by connecting patients with remote doctors.

**Proposed Sections:**
1. **Upcoming Consultations Card:**
   - Next appointment: Doctor name + specialty + date/time + "Join Call" button (active 5 min before)
   - Calendar icon + "Schedule New Consultation" button
2. **Schedule Consultation Form:**
   - Specialty selector (General · Cardiology · Neurology · Orthopedics · Dermatology · Physiotherapy)
   - Preferred date/time slots
   - Reason for visit (brief text)
   - Share vitals: toggle to auto-share latest vitals with doctor
3. **Waiting Room (pre-call state):**
   - Doctor info card + estimated wait time
   - Camera/mic test buttons
   - "Your recent vitals" summary panel (auto-populated from vitals tracking)
4. **In-Call Screen:**
   - Video feed (large) + self-view (small, draggable)
   - Controls: Mute · Video · Share Screen · Share Vitals · End Call
   - Side panel: patient's care plan highlights + latest vitals + medication list (doctor's reference)
5. **Post-Consultation:**
   - Doctor's notes (read-only for patient)
   - Prescription issued (viewable in Medical Records)
   - Follow-up date scheduled
   - "Rate this consultation" star selector
6. **Consultation History:**
   - List: date + doctor + specialty + duration + summary + prescription link

---

### 🟡 Nice-to-Have (Contextual for Bangladesh)

---

#### 15.11 Voice Notes in Care Logs
**Proposed Integration:** Enhancement to Care Log, Messages, Shift Detail

**Problem:** Many elderly patients and some caregivers in Bangladesh may not be fully literate. **Voice note capability** removes the literacy barrier from care documentation.

**Implementation:**
- Record button (microphone icon) on: Care Log entry, Message composer, Shift Detail notes, Symptom Journal
- Playback UI: waveform visualization + play/pause + duration + speed selector (1x/1.5x/2x)
- Auto-transcription (optional, for searchability)
- Voice notes tagged with timestamp + recorder name
- Max duration: 2 minutes per note
- Storage indicator per voice note (file size badge)

---

#### 15.12 Nutrition & Diet Tracker
**Proposed Route:** `/patient/nutrition`

**Problem:** Patient Intake captures dietary needs/restrictions, but there is **no daily tracking** of actual food intake. Nutrition is critical for elderly care and chronic condition management.

**Proposed Sections:**
1. **Today's Meals (card per meal):**
   - Breakfast · Lunch · Dinner · Snacks
   - Each: food items logged + time + portion indicator (Light / Normal / Heavy) + dietary compliance badge (Within plan / Deviation)
   - Logged by: caregiver name
2. **Fluid Intake Tracker:**
   - Glass counter (visual, tap to add) + daily target line
   - Fluid types: Water · Tea · Juice · Oral Supplement
3. **Dietary Restrictions Compliance:**
   - Active restrictions displayed (e.g., "Low Sodium", "Diabetic Diet", "Soft Foods Only")
   - Compliance score: % of meals meeting restrictions this week
4. **Weekly Nutrition Summary (charts):**
   - Meals logged per day (bar chart)
   - Fluid intake trend (line chart)
   - Compliance trend (area chart)
5. **Add Meal Entry Form:**
   - Meal type select + food items (multi-input or common presets for Bangladeshi meals) + time + notes + photo (optional)

---

#### 15.13 Rehabilitation / Exercise Tracker
**Proposed Route:** `/patient/rehab`

**Problem:** For post-operative and physiotherapy patients, **there is no way to track prescribed exercises, monitor adherence, or visualize rehab progress**.

**Proposed Sections:**
1. **Today's Exercise Plan (checklist):**
   - Prescribed exercises with sets/reps/duration
   - Each: exercise name + illustration/icon + instructions + checkbox
   - Completion indicator: "3 of 5 exercises done today"
2. **Exercise Library:**
   - Common rehab exercises with descriptions + simple illustrations
   - Filtered by body region or condition
3. **Progress Charts (recharts):**
   - Exercises completed per day/week (bar chart)
   - Range of motion improvement (line chart, if applicable)
   - Pain during exercise trend (line chart)
4. **Caregiver-Assisted Logging:**
   - Caregiver can log exercises on behalf of patient
   - Difficulty rating per exercise (Easy / Moderate / Difficult / Could Not Complete)
   - Notes: "Patient needed extra support during leg raises"
5. **Weekly Rehab Report:**
   - Adherence percentage + comparison vs. target
   - Improvement notes
   - Shared with physiotherapist / doctor

---

#### 15.14 Family Communication Board
**Proposed Route:** `/guardian/family-board`

**Problem:** Messages are 1:1 conversations. There is **no shared group communication space** focused on a patient where all family members and the care team can post updates.

**Proposed Sections:**
1. **Patient Header** — Patient name + photo + current status badge
2. **Post Feed (reverse-chronological):**
   - Post types: Text Update · Photo · Question · Alert · Milestone
   - Each post: author avatar + name + role badge + timestamp + content + reactions + reply thread
   - Pin important posts to top
3. **Quick Post Composer:**
   - Text input + attachment buttons (photo, document) + post type selector
   - Mention (@) family members or caregivers
4. **Members Panel (sidebar or drawer):**
   - All board members: avatar + name + role (Guardian / Caregiver / Family / Agency) + last active
   - Invite family member button (via phone number or link)
5. **Pinned Info Section:**
   - Emergency contacts (always visible)
   - Current care plan summary
   - Today's caregiver info

---

#### 15.15 Insurance & Coverage Tracker
**Proposed Route:** `/patient/insurance`

**Problem:** There is **no health insurance management feature**. For patients using insurance to cover care costs, tracking claims and coverage is essential.

**Proposed Sections:**
1. **Active Policies Card:**
   - Policy name + provider + policy number + coverage type + valid until
   - Coverage remaining: progress bar (used vs. total)
2. **Claims List (table/cards):**
   - Claim ID · Date · Service · Amount · Status (Submitted / Under Review / Approved / Rejected)
   - `+ Submit New Claim` button
3. **Submit Claim Form:**
   - Service date + type + amount + supporting documents upload + notes
4. **Coverage Summary:**
   - What's covered vs. what's not (checklist)
   - Annual limit + amount used + remaining
   - Co-pay / deductible info
5. **Documents:**
   - Insurance card photo
   - Policy documents
   - Previous claim receipts

---

## 16. Gap Analysis Summary

| Care Area | Current Coverage | Gap | Priority |
|-----------|-----------------|-----|----------|
| **Daily Care Logging** | Caregiver writes in Shift Detail | Patient/Guardian cannot view consolidated log | High |
| **Care Plan Visibility** | Agency-side only (`/agency/clients/:id/care-plan`) | Patient has no view of their own care plan | High |
| **Automated Health Alerts** | Manual medication reminders + SOS button | No threshold-based automated alerts | High |
| **Real-Time Tracking** | Advertised on homepage but no page exists | No live caregiver location/ETA tracking | High |
| **Shift Handoff** | Not addressed | No formal handoff mechanism — patient safety risk | High |
| **Subjective Symptoms** | Not addressed | No pain, mood, or symptom tracking | Medium |
| **Visual Documentation** | Not addressed | No wound/condition photo timeline | Medium |
| **Live Monitoring** | Guardian Dashboard shows historical data | No real-time at-a-glance monitoring view | Medium |
| **Care Quality Metrics** | Not addressed | No aggregated quality scorecard | Medium |
| **Telehealth** | Not addressed | No video consultation — huge need for Bangladesh | Medium |
| **Voice Notes** | Not addressed | Literacy barrier for elderly patients/caregivers | Nice-to-have |
| **Nutrition Tracking** | Dietary needs captured in intake only | No daily meal/fluid tracking | Nice-to-have |
| **Rehab / Exercise** | Not addressed | No exercise prescription or adherence tracking | Nice-to-have |
| **Family Communication** | 1:1 messages only | No shared group board for patient care team | Nice-to-have |
| **Insurance Management** | Not addressed | No policy/claim tracking | Nice-to-have |

---

*Improvement areas documented: March 16, 2026 — CareNet v1.0 care & tracking enhancement roadmap*

---

## 17. Architectural Alignment — Agency-Mediated Workflow Corrections

> **Reference:** System Architecture & Engineering Specification (`/src/imports/System_Architecture_&_Engineering_Specification.md`)
> **Core Principle:** CareNet is an **agency-mediated** platform. Caregivers are NEVER hired directly by guardians. All care flows through agencies because agencies provide: 24/7 caregiver coverage, caregiver replacement during a job, partial payment management (split across multiple caregivers on one placement), payroll, safety verification, and service continuity.
> **Date:** March 16, 2026

---

### 17.1 The Correct Care Delivery Workflow

```
Guardian → submits Care Requirement (describing patient needs)
     ↓
Agency → reviews requirement, creates Job Posting
     ↓
Caregiver → applies to agency-posted Job
     ↓
Agency → interviews, hires Caregiver
     ↓
Agency → creates Placement (service contract with guardian)
     ↓
Agency → assigns Shift(s) to Caregiver within Placement
     ↓
Caregiver → performs Shift, logs Care Activities
     ↓
Guardian → monitors Care via logs, alerts, and placement dashboard
```

**Key rules:**
- Guardian communicates with Agency during requirement/job stage
- Guardian communicates with Caregiver ONLY after placement begins
- Agency can rotate multiple caregivers within one placement (Day 1-3: Caregiver A, Day 4-12: Caregiver B, etc.)
- Payments flow: Guardian → Platform → Agency → Caregiver (agency handles caregiver payroll)

---

### 17.2 Pages Requiring Architectural Correction

#### 17.2.1 Guardian Dashboard (Section 5.1) — CORRECTED
**What changed:**
- `Find Caregiver` button → `Submit Care Requirement` button
- Stats: "Active Caregivers" → "Active Placements"
- Added "Active Care Requirements Banner" showing open requirements with status
- My Patients Panel now shows assigned agency + caregiver name + placement status

#### 17.2.2 Guardian Search Page (Section 5.2) — CORRECTED
**Route:** `/guardian/search`

**What changed:**
- Title: "Find Your Perfect Caregiver" → "Find a Care Agency"
- Primary search results are now **Agency Cards**, not individual caregivers
- Caregivers are browsable in a secondary tab (read-only, no booking)
- Each agency card shows: `View Agency Profile` + `Submit Care Requirement` buttons
- NO direct caregiver hiring from search results

#### 17.2.3 Caregiver Public Profile (Section 5.4) — CORRECTED
**Route:** `/guardian/caregiver/:id`

**What changed:**
- **REMOVED:** `Book Now` CTA button
- **ADDED:** Agency affiliation badge ("Works with: HealthCare Pro BD")
- **ADDED:** `Contact Agency` button (opens message to affiliated agency)
- **ADDED:** `Submit Care Requirement` button (agency pre-selected)
- Availability note changed to: "Availability managed by agency"
- This page is now **read-only for research purposes**

#### 17.2.4 Caregiver Comparison (Section 5.5) — CORRECTED
**Route:** `/guardian/compare`

**What changed:**
- Added "Agency" as a comparison row
- **REMOVED:** "Select" button
- **ADDED:** `Request via Agency` button per column → navigates to care requirement form with agency pre-selected

#### 17.2.5 Booking Wizard (Section 5.6) — REPLACED
**Route:** `/guardian/booking` → **REPLACED BY** `/guardian/care-requirements/new`

**What changed:**
- The entire "Booking Wizard" concept is architecturally incorrect
- Guardians do NOT book caregivers directly
- Replaced with **Care Requirement Wizard** (see Section 17.3.3 below)
- The old route `/guardian/booking` should redirect to `/guardian/care-requirements/new`

#### 17.2.6 Guardian Messages (Section 5.9/renumbered) — CORRECTED
**Route:** `/guardian/messages`

**What changed:**
- Messaging now respects placement-stage rules:
  - Before placement: Guardian can ONLY message Agency
  - After placement active: Guardian can message Agency AND assigned Caregiver
- Conversation list shows: role badge (Agency / Caregiver) per conversation
- Stage indicator: "Requirement Stage" / "Placement Active" badge per conversation

#### 17.2.7 Guardian Payments (Section 5.10/renumbered) — CORRECTED
**Route:** `/guardian/payments`

**What changed:**
- Payments are made to Agency, NOT directly to caregivers
- "Active subscriptions" → "Active Placement Billing"
- Invoice line items reference: Agency name + Placement ID + Period
- Agency handles caregiver payroll internally — guardian does not see caregiver payment split

---

### 17.3 New Pages — Missing from Wireframes (Required by Architecture)

---

#### 17.3.1 Agency Public Profile Page *(New — Guardian-facing)*
**Route:** `/guardian/agency/:id`

**Sections:**
1. **Agency Banner** — Cover image + agency logo (large, rounded-2xl) + Verified Platform Partner badge
2. **Agency Info Card:**
   - Name + tagline + established year
   - Rating (stars) + review count
   - Location(s) served + service area map placeholder
   - Contact: phone + email + WhatsApp
3. **Services Offered (card grid):**
   - Each service: icon + name + description + starting daily rate
   - Examples: Full Day Care, Night Care, Post-Op Recovery, Specialized Medical Care, Respite Care
4. **Our Caregivers (horizontal scroll):**
   - Caregiver mini-cards: photo + name + specialty + rating (read-only browse)
   - "All caregivers are verified and trained by our agency"
5. **Reviews Section:**
   - Average rating + distribution bars (5 to 1 stars)
   - Review cards from guardians (star rating + text + date)
6. **Coverage & Guarantees Card:**
   - 24/7 coverage guarantee badge
   - Caregiver replacement policy
   - Response time SLA
7. **CTA Section:**
   - `Submit Care Requirement` button (green gradient, full-width) → `/guardian/care-requirements/new?agency=:id`
   - "Or call us directly" phone number + WhatsApp link

---

#### 17.3.2 Care Requirements List Page *(New — Guardian)*
**Route:** `/guardian/care-requirements`

**Sections:**
1. **Header** — "My Care Requirements" h1 + subtitle + `+ New Requirement` button (green gradient)
2. **Status Filter Tabs:** All | Draft | Submitted | Agency Reviewing | Job Created | Active Care | Completed | Cancelled
3. **Requirement Cards (vertical stack, finance-card):**
   - Each card:
     - Row 1: Requirement ID (e.g., "CR-2026-0042") + Status badge (color-coded per state machine)
     - Row 2: Patient name + Care type + Agency name
     - Row 3: Schedule summary (start date, duration, shift type)
     - Row 4: Budget range + submitted date
     - Row 5: Latest update note (e.g., "Agency reviewing — estimated response in 12 hours")
     - Actions: `View Details` + `Message Agency` buttons
     - If Draft: `Edit` + `Submit` buttons
     - If Active Care: `View Placement` button

**Care Requirement State Machine:**
```
Draft → Submitted → Agency Reviewing → Job Created → Caregiver Assigned → Active Care → Completed
                                                                                      ↘ Cancelled
```

**Status Badge Colors:**
| Status | Color |
|--------|-------|
| Draft | Gray |
| Submitted | Blue #0288D1 |
| Agency Reviewing | Amber #E8A838 |
| Job Created | Purple #7B5EA7 |
| Caregiver Assigned | Teal #00897B |
| Active Care | Green #5FB865 |
| Completed | Green (darker) |
| Cancelled | Red #EF4444 |

---

#### 17.3.3 Care Requirement Wizard *(New — Replaces Booking Wizard)*
**Route:** `/guardian/care-requirements/new`

> This replaces the former "Booking Wizard" at `/guardian/booking`. Guardians submit care requirements to agencies — they do NOT book caregivers directly.

**Green gradient header** with 5-step progress bar (fill animation on advance)

**Step 1 — Select Agency:**
- If agency pre-selected (from query param), show agency card with green checkmark
- If not, agency search/dropdown with top-rated agencies listed
- Agency card: logo + name + rating + service area + specialty tags
- `Change Agency` link

**Step 2 — Patient Selection:**
- Pre-existing patient cards (selectable, green border on selected) with name + age + condition
- `+ Add New Patient` dashed-border button → inline mini-form or link to `/guardian/patient-intake`
- Selected patient summary displayed

**Step 3 — Care Requirements:**
- Care type selector (2x3 grid): Full Day Care | Night Care | Post-Op Recovery | Daily Check-in | Specialized Medical | Respite Care
- Each tile: icon square + name + description
- Schedule section:
  - Start date picker (Calendar icon)
  - Duration dropdown: 1 week / 2 weeks / 1 month / 3 months / Ongoing
  - Shift preference: Day (8AM-8PM) / Night (8PM-8AM) / 24-Hour / Custom
- Special requirements textarea
- Preferred language dropdown (Bangla / English / Both)

**Step 4 — Budget & Preferences:**
- Budget range: min-max slider or input fields (BDT per day)
- Caregiver gender preference: Any / Male / Female
- Experience level: Any / 1-3 years / 3-5 years / 5+ years
- Additional preferences checkboxes: Cooking | Light housekeeping | Medication management | Mobility assistance | Wound care

**Step 5 — Review & Submit:**
- Full summary card: Agency + Patient + Care type + Schedule + Budget + Preferences
- Terms checkbox: "I understand the agency will review my requirement and propose a care plan"
- `Submit Care Requirement` button (green gradient, full-width)

**Success Screen:** Animated scale-in card, green CheckCircle, "Care Requirement Submitted!" heading, "The agency will review your requirement and contact you within 24-48 hours", requirement ID, `Go to Dashboard` + `View My Requirements` buttons

---

#### 17.3.4 Care Requirement Detail Page *(New — Guardian)*
**Route:** `/guardian/care-requirements/:id`

**Sections:**
1. **Back button** → `/guardian/care-requirements`
2. **Status Banner (full-width):**
   - Current status with large icon + description
   - Status timeline (horizontal stepper): Draft → Submitted → Agency Reviewing → Job Created → Caregiver Assigned → Active Care → Completed
   - Current step highlighted with green, completed steps checked
3. **Requirement Summary Card:**
   - Patient info (name, age, condition)
   - Care type + schedule + duration
   - Budget range
   - Special requirements text
   - Preferences (gender, experience, additional needs)
4. **Agency Response Section (visible after agency reviews):**
   - Agency's proposed care plan summary
   - Proposed caregiver profile(s) — mini card with photo + name + experience + rating
   - Proposed rate (may differ from guardian's budget)
   - `Accept Proposal` (green gradient) / `Request Changes` (outline) / `Decline` (red outline) buttons
5. **Communication Thread:**
   - In-context messages between guardian and agency about this requirement
   - Text input + send button
   - File/document attachment option
6. **Placement Link (visible when Active Care):**
   - "Your care placement is active" green banner → `View Placement Details` button → `/guardian/placements/:id`
7. **Actions:**
   - `Cancel Requirement` (if not yet Active Care)
   - `Edit Requirement` (if Draft or Submitted only)

---

#### 17.3.5 Guardian Placements List Page *(New)*
**Route:** `/guardian/placements`

> **Core Concept:** A placement is the active service contract between guardian and agency. One placement can have MULTIPLE caregivers rotating through shifts. Example: Day 1-3 → Caregiver A, Day 4-12 → Caregiver B, Day 13-30 → Caregiver C. The agency manages rotation — the guardian monitors care quality.

**Sections:**
1. **Header** — "My Placements" h1 + subtitle
2. **Status Filter Tabs:** All | Active | Upcoming | Completed | Cancelled
3. **Placement Cards (vertical stack):**
   - Each card (finance-card, green left border for active):
     - Row 1: Placement ID + Status badge (Active/Upcoming/Completed)
     - Row 2: Patient name + Agency name
     - Row 3: Care type + Start date → End date + Duration
     - Row 4: Current caregiver avatar + name + "On Duty" / "Next Shift" indicator
     - Row 5: Shifts completed / total + progress bar
     - Actions: `View Details` + `View Care Log` + `Message Agency` buttons

---

#### 17.3.6 Guardian Placement Detail Page *(New)*
**Route:** `/guardian/placements/:id`

**Sections:**
1. **Back button** → `/guardian/placements`
2. **Placement Header Card (green gradient border):**
   - Placement ID + Status badge
   - Patient: name + age + condition
   - Agency: name + contact button
   - Duration: Start → End (or "Ongoing")
   - Total cost to date
3. **Current Shift Card (highlighted, pulsing green border if active):**
   - Caregiver: avatar + name + phone + message button
   - Shift: today's date + time range + status (Checked In / Scheduled / Completed)
   - Check-in time + check-out time (if applicable)
   - `View Live Tracking` button (if checked in)
4. **Caregiver Rotation Timeline:**
   - Visual horizontal timeline showing which caregiver covered which dates
   - Example: "Mar 1-3: Karim Ahmed" → "Mar 4-12: Fatima Rahman" → "Mar 13-ongoing: Nadia Begum"
   - Each segment: caregiver mini-avatar + name + dates + shift count + guardian's rating
5. **Shift History Table:**
   - Columns: Date | Caregiver | Shift Time | Check-in | Check-out | Duration | Status | Care Logs
   - Status badges: Completed (green) | Missed (red) | Late (amber) | Replacement (purple)
   - Click row → expand to view shift care logs
6. **Care Log Summary:**
   - Recent 5 care log entries with "View All" link
   - Quick stats: total logs this week, vitals recorded, medications administered
7. **Financial Summary:**
   - Total billed + total paid + outstanding balance
   - Link to `/guardian/payments`
8. **Actions:**
   - `Rate Current Caregiver`
   - `Request Caregiver Change` → notifies agency for replacement
   - `Extend Placement` / `End Placement`
   - `Report Issue` → incident report form

---

#### 17.3.7 Agency Requirements Inbox *(New — Agency Module)*
**Route:** `/agency/requirements`

> **Core page:** This is where agencies receive and review care requirements submitted by guardians. It is the starting point of the agency's workflow.

**Sections:**
1. **Header** — "Requirements Inbox" h1 + unread count badge + subtitle
2. **Status Filter Tabs:** All | New | Under Review | Proposal Sent | Accepted | Declined
3. **Requirement Cards (vertical stack):**
   - Each card (finance-card):
     - Row 1: Requirement ID + "New" badge (if unread) + Priority indicator
     - Row 2: Guardian name + Patient name + Patient age + Condition summary
     - Row 3: Care type + Duration + Shift preference + Budget range
     - Row 4: Location + Special requirements preview (truncated)
     - Row 5: Submitted date + response deadline countdown
     - Actions: `Review & Respond` (teal gradient) + `Message Guardian` (outline)
4. **Quick Stats Bar:** New this week | Avg response time | Conversion rate (accepted/total)

---

#### 17.3.8 Requirement Review & Proposal Page *(New — Agency Module)*
**Route:** `/agency/requirements/:id`

**Sections:**
1. **Back button** → `/agency/requirements`
2. **Requirement Summary (read-only):**
   - Full guardian requirement details (patient, care type, schedule, budget, preferences)
   - Guardian profile mini-card (name, verified badge, previous placements count)
3. **Patient Assessment Section:**
   - Agency supervisor notes textarea
   - Complexity rating: Simple / Moderate / Complex / Critical
   - Additional info needed? → `Request More Info` button (sends message to guardian)
4. **Proposal Builder:**
   - Proposed care plan: select template or build custom
   - Proposed caregiver(s): search + select from agency roster
   - Proposed rate (BDT per day) — with margin calculator
   - Proposed start date + duration
   - Special notes for guardian
5. **Create Job Toggle:**
   - If proposal requires hiring new caregiver: `Create Job Posting` button → creates agency job linked to this requirement
   - If existing caregiver available: skip job, go directly to placement proposal
6. **Actions:**
   - `Send Proposal to Guardian` (teal gradient) → guardian receives in their requirement detail page
   - `Decline Requirement` (with reason) (red outline)
   - `Save as Draft`

---

#### 17.3.9 Agency Placements Management Page *(New — Agency Module)*
**Route:** `/agency/placements`

**Sections:**
1. **Header** — "Placements" h1 + total count + `+ Create Placement` button (teal gradient)
2. **Status Filter Tabs:** All | Active | Upcoming | Completed | Cancelled
3. **Placement Table (finance-card):**
   - Columns: Placement ID | Patient | Guardian | Care Type | Current Caregiver | Start Date | Status | Actions
   - Actions per row: View Detail | Manage Shifts | Replace Caregiver | End Placement
4. **Summary Stats:** Active placements | Avg duration | Shifts this week | Caregiver utilization %

---

#### 17.3.10 Agency Placement Detail & Shift Planner *(New — Agency Module)*
**Route:** `/agency/placements/:id`

**Sections:**
1. **Placement Header:** Patient info + Guardian info + Status + Duration + Financial summary
2. **Shift Planner (calendar view):**
   - Week/month calendar grid showing assigned shifts
   - Color-coded by caregiver (each caregiver = different color)
   - Drag-to-create new shifts
   - Click shift to edit (assign different caregiver, change time)
3. **Caregiver Assignment Panel:**
   - Currently assigned caregiver(s) with shift counts
   - `Assign New Caregiver` button → select from roster or create job
   - `Replace Caregiver` button → reassign upcoming shifts
4. **Shift History:**
   - All completed/missed/late shifts with check-in/check-out times
   - Alerts: missed shifts highlighted in red
5. **Care Quality Indicators:**
   - Care logs submitted per shift (compliance %)
   - Guardian satisfaction rating
   - Incidents reported
6. **Financial:**
   - Billing to guardian (total, paid, outstanding)
   - Payout to caregiver(s) (hours worked x rate, breakdown per caregiver)
   - Agency margin

---

#### 17.3.11 Caregiver Assigned Patients Page *(New — Caregiver Module)*
**Route:** `/caregiver/patients`

> **Missing from wireframes:** The architecture spec lists "Assigned Patients" as a core caregiver module page. Caregivers need to see which patients they are currently assigned to via active placements.

**Sections:**
1. **Header** — "My Patients" h1 + subtitle + active count badge
2. **Patient Cards (vertical stack or 2-col grid):**
   - Each card (finance-card, pink left border):
     - Patient: avatar (letter circle) + name + age + gender
     - Condition summary (pill tags)
     - Agency: name badge
     - Current placement: placement ID + care type + schedule
     - Next shift: date + time + "Starts in X hours"
     - Guardian: name + phone (tap to call, only visible during active placement)
     - Quick actions: `View Care Plan` | `Log Care` | `View History` | `Message Guardian`
3. **Past Patients Tab:**
   - Archived patient cards with: dates served + total shifts + rating received
   - Read-only (no messaging)

---

#### 17.3.12 Caregiver Structured Care Log Form *(New — Caregiver Module)*
**Route:** `/caregiver/care-log/new` (also accessible from Shift Detail)

> **Missing from wireframes:** The architecture spec defines 8 structured care log types (Meal, Medication, Vitals, Exercise, Bathroom, Sleep, Observation, Incident). The current Shift Detail page has only a generic textarea.

**Sections:**
1. **Context Header:** Patient name + Shift ID + Current time
2. **Log Type Selector (grid of tappable tiles):**
   - Meal (UtensilsCrossed, orange)
   - Medication (Pill, green)
   - Vitals (Activity, blue)
   - Exercise (Dumbbell, purple)
   - Bathroom (Droplets, cyan)
   - Sleep (Moon, indigo)
   - Observation (Eye, gray)
   - Incident (AlertTriangle, red)
3. **Type-Specific Form (changes based on selection):**
   - **Meal:** Meal type (Breakfast/Lunch/Dinner/Snack) + Food items + Portion (Light/Normal/Heavy) + Appetite rating + Dietary compliance check
   - **Medication:** Medication name (from patient's list) + Dosage + Route (Oral/Injection/Topical) + Given time + Patient response
   - **Vitals:** BP (systolic/diastolic) + Heart rate + Temperature + SpO2 + Blood glucose + Weight + Respiration rate (all optional, fill what's measured)
   - **Exercise:** Exercise type + Duration + Assisted (yes/no) + Difficulty rating + Patient tolerance
   - **Bathroom:** Type (Urination/Bowel) + Assisted (yes/no) + Notes on any concerns
   - **Sleep:** Hours slept + Quality (Good/Fair/Poor) + Disturbances noted
   - **Observation:** Free text + Mood assessment (emoji selector) + Behavior notes + Comfort level
   - **Incident:** Severity (Minor/Moderate/Severe) + Description + Immediate action taken + Injury (yes/no) + Photos/evidence upload
4. **Common Fields (all types):**
   - Notes textarea
   - Photo/attachment upload (optional)
   - Voice note record button (optional)
5. **Submit:** `Save Care Log` button (pink gradient)
6. **Recent Logs (below form):** Last 3 logs from this shift as preview cards

---

#### 17.3.13 Agency Shift Monitoring Dashboard *(New — Agency Module)*
**Route:** `/agency/shift-monitoring`

> **Missing from wireframes:** The architecture spec lists "Shift Monitoring" as a core agency module. Supervisors need real-time visibility into all active shifts.

**Sections:**
1. **Header** — "Live Shift Monitor" h1 + "X shifts active now" badge
2. **Active Shifts Grid (real-time):**
   - Each card: Caregiver avatar + name + Patient name + Shift time + Status (Checked In/Scheduled/Late)
   - Color border: Green = on time, Amber = within grace period, Red = late/missed
   - Last care log timestamp: "Last activity: 12 min ago"
   - Quick actions: `Call Caregiver` | `View Logs` | `Assign Replacement`
3. **Alerts Panel (sidebar):**
   - Missed shift alerts (red)
   - Late check-in alerts (amber)
   - Incident reports (red)
   - No care log for 2+ hours (amber)
4. **Today's Schedule Overview:**
   - Timeline view: all shifts for today across all placements
   - Gaps highlighted (unassigned time slots)
5. **Stats:** On-time rate today | Active shifts | Upcoming shifts | Incidents today

---

### 17.4 Messaging Rules by Placement Stage

The messaging system must enforce the following rules per the architecture spec:

| Stage | Guardian can message | Caregiver can message |
|-------|---------------------|-----------------------|
| Requirement Stage | Agency ONLY | N/A (not involved yet) |
| Job Stage | Agency ONLY | Agency ONLY |
| Interview Stage | Agency ONLY | Agency (moderated) |
| Placement Active | Agency AND assigned Caregiver | Agency AND assigned Guardian |
| Placement Completed | Agency (for follow-up) | Agency (for follow-up) |

**UI Implementation:**
- Message composer checks placement stage before allowing new conversations
- Conversation list shows role badges (Agency / Caregiver / Guardian)
- Blocked conversations show: "You can message this caregiver after your placement begins"
- Agency staff can see all conversations related to their placements

---

### 17.5 Updated Route Map (Guardian Module)

**Old routes (architecturally incorrect):**
```
/guardian/search          → direct caregiver search with booking
/guardian/booking         → direct caregiver booking wizard
/guardian/caregiver/:id   → profile with "Book Now" button
/guardian/compare         → comparison with "Select" button
```

**New routes (agency-mediated):**
```
/guardian/search                    → agency & caregiver search (agencies primary)
/guardian/agency/:id                → agency public profile (NEW)
/guardian/caregiver/:id             → caregiver profile (READ-ONLY, no booking)
/guardian/compare                   → comparison (research only, "Request via Agency")
/guardian/care-requirements         → care requirements list (NEW)
/guardian/care-requirements/new     → care requirement wizard (REPLACES booking wizard)
/guardian/care-requirements/:id     → requirement detail + agency communication (NEW)
/guardian/placements                → placements list (NEW)
/guardian/placements/:id            → placement detail + shift history + care logs (NEW)
```

**New routes (Agency module additions):**
```
/agency/requirements                → requirements inbox (NEW)
/agency/requirements/:id            → requirement review & proposal builder (NEW)
/agency/placements                  → placement management (NEW)
/agency/placements/:id              → placement detail & shift planner (NEW)
/agency/shift-monitoring            → live shift monitoring dashboard (NEW)
```

**New routes (Caregiver module additions):**
```
/caregiver/patients                 → assigned patients list (NEW)
/caregiver/care-log/new             → structured care log form (NEW)
```

---

### 17.6 Summary of All Changes

| Change Type | Count | Details |
|-------------|-------|---------|
| Pages CORRECTED | 6 | Guardian Dashboard, Search, Caregiver Profile, Comparison, Messages, Payments |
| Pages REPLACED | 1 | Booking Wizard → Care Requirement Wizard |
| Pages ADDED (Guardian) | 5 | Agency Profile, Care Requirements List, Care Requirement Detail, Placements List, Placement Detail |
| Pages ADDED (Agency) | 4 | Requirements Inbox, Requirement Review, Placements Management, Shift Monitoring |
| Pages ADDED (Caregiver) | 2 | Assigned Patients, Structured Care Log Form |
| **Total new pages** | **12** | Bringing estimated total from 117+ to 129+ |

---

*Architectural alignment documented: March 16, 2026 — CareNet v1.0 agency-mediated workflow corrections*

---

*Section 17 documented: March 16, 2026 — CareNet v1.0 agency-mediated workflow corrections*

---

## 18. Spec Compliance Audit — Remaining Gaps & New Pages

> **Reference:** Full audit of `System_Architecture_&_Engineering_Specification.md` (Sections 1–20 + Future Extensions) against all wireframes and built pages.
> **Date:** March 16, 2026
> **Auditor scope:** Every entity, workflow, module listing, and page reference in the 1,763-line spec was cross-referenced.

---

### 18.1 Gap Summary

| # | Gap | Spec Reference | Severity | Resolution |
|---|-----|---------------|----------|------------|
| 1 | **Agency Job Management** — No page for agencies to create/manage jobs from requirements | Sections 7, 13 (Agency: Job Management) | **Critical** | New page: `/agency/jobs` |
| 2 | **Agency Applications Review** — No page for reviewing caregiver applications to agency jobs | Sections 7, 13 (Agency: Applications), Section 14 (caregiver_applications, application_interviews) | **Critical** | New page: `/agency/jobs/:id/applications` |
| 3 | **Public Agency Directory** — No public browsing page for agencies | Section 13 (Public: Agency Directory) | **High** | New page: `/agencies` |
| 4 | **Admin Placement Monitoring** — No admin-level view of all platform placements | Section 13 (Admin: Placement Monitoring) | **High** | New page: `/admin/placement-monitoring` |
| 5 | **Admin Agency Approval** — No dedicated agency approval workflow | Section 13 (Admin: Agency Approval) | **Medium** | New page: `/admin/agency-approvals` |
| 6 | **Agency Payroll & Caregiver Payout** — Payment split (Guardian→Platform→Agency→Caregiver) has no payout management UI | Section 2 (payment flow), Section 14 (placement_contracts) | **Medium** | New page: `/agency/payroll` |
| 7 | **Caregiver Job Marketplace alignment** — CaregiverJobsPage should reflect agency-posted jobs, not direct hiring | Section 7 (Jobs posted by agencies) | **Medium** | Correction to existing page wireframe |
| 8 | **Care Timeline view** — Spec lists "Care Timeline" as Guardian module page | Section 13 (Guardian: Care Timeline) | **Low** | Covered by Placement Detail shift history; add as tab in `/guardian/placements/:id` |

---

### 18.2 New Pages

---

#### 18.2.1 Public Agency Directory *(New — Public Module)*
**Route:** `/agencies`

> **Spec ref:** Section 13 lists "Agency Directory" as a Public module page alongside "Caregiver Directory" and "Medical Shop Marketplace."

**Sections:**
1. **Hero Banner** — "Find a Trusted Care Agency" heading on teal gradient, search bar, location filter
2. **Filter Sidebar/Bar:**
   - Location: District/Area dropdown
   - Specialty: Elder Care / Pediatric / Post-Op / Night Care / Disability / Respite
   - Rating: Minimum star filter (4+, 3+, Any)
   - Verified Only toggle
3. **Agency Cards (grid, 2-col on md+):**
   - Each card (finance-card):
     - Agency logo (letter avatar) + Verified badge
     - Name + tagline + established year
     - Rating (stars) + review count
     - Location + service areas
     - Specialty tags (colored pills)
     - Caregiver count + "years active"
     - `View Profile` → `/guardian/agency/:id` + `Submit Requirement` button
4. **Pagination / Load More**
5. **CTA Banner:** "Are you a care agency? Join CareNet" → `/auth/register?role=agency`

---

#### 18.2.2 Agency Job Management Page *(New — Agency Module)*
**Route:** `/agency/jobs`

> **Spec ref:** Section 7 defines the Job Workflow (Open → Applications Received → Interview → Offer → Filled → Closed). Section 13 lists "Job Management" and "Applications" as core agency module pages.

**Sections:**
1. **Header** — "Job Management" h1 + active job count + `+ Create Job` button (teal gradient)
2. **Status Filter Tabs:** All | Open | Applications Received | Interview | Offer | Filled | Closed
3. **Job Cards (vertical stack):**
   - Each card:
     - Row 1: Job ID + Status badge (color-coded per state machine) + Linked Requirement ID
     - Row 2: Care type + Patient name (anonymized until hire) + Location
     - Row 3: Required skills + Experience level + Shift type + Rate range
     - Row 4: Applications count (badge) + Posted date
     - Actions: `View Applications` + `Edit Job` + `Close Job`
4. **Quick Stats:** Open jobs | Applications this week | Avg time to fill | Fill rate

**Job State Machine:**
```
Open → Applications Received → Interview → Offer → Filled → Closed
```

**Status Badge Colors:**
| Status | Color |
|--------|-------|
| Open | Blue #0288D1 |
| Applications Received | Amber #E8A838 |
| Interview | Purple #7B5EA7 |
| Offer | Teal #00897B |
| Filled | Green #5FB865 |
| Closed | Gray #6B7280 |

---

#### 18.2.3 Agency Job Applications Review Page *(New — Agency Module)*
**Route:** `/agency/jobs/:id/applications`

> **Spec ref:** Section 14 defines `caregiver_applications`, `application_interviews`, `application_notes` tables. The Caregiver Application state machine: Submitted → Reviewed → Interview → Offered → Accepted/Rejected.

**Sections:**
1. **Back button** → `/agency/jobs`
2. **Job Summary Card (read-only):** Job ID + Care type + Required skills + Rate + Linked requirement
3. **Application Pipeline (Kanban or list view):**
   - Columns/Tabs: New | Reviewed | Interview Scheduled | Offered | Hired | Rejected
   - Each application card:
     - Caregiver: avatar + name + rating + experience years
     - Skills match percentage (green/amber/red indicator)
     - Applied date + Last activity
     - Actions: `Review Profile` | `Schedule Interview` | `Send Offer` | `Reject`
4. **Interview Scheduler:**
   - Date/time picker
   - Interview type: In-person / Phone / Video
   - Notes field
5. **Offer Panel:**
   - Proposed rate + Start date + Shift assignment
   - `Send Offer` → caregiver receives notification
6. **Hired → Create Placement:**
   - When caregiver accepts: `Create Placement` button links back to requirement

**Application State Machine:**
```
Submitted → Reviewed → Interview → Offered → Accepted → Placement Created
                                          ↘ Rejected
```

---

#### 18.2.4 Agency Payroll & Payout Page *(New — Agency Module)*
**Route:** `/agency/payroll`

> **Spec ref:** Section 2 defines payment flow: Guardian → Platform → Agency → Caregiver. Agencies handle caregiver payroll. Section 14 defines `placement_contracts` table.

**Sections:**
1. **Header** — "Payroll & Payouts" h1 + Current period indicator (e.g., "March 1-15, 2026")
2. **Financial Overview Cards (4-grid):**
   - Total Received from Guardians (this period)
   - Total Caregiver Payouts (this period)
   - Agency Revenue (margin)
   - Pending Payouts
3. **Caregiver Payout Table:**
   - Columns: Caregiver Name | Placements | Shifts Worked | Hours | Rate | Gross Pay | Deductions | Net Payout | Status
   - Status: Pending / Processing / Paid
   - Actions per row: `View Breakdown` | `Process Payout`
4. **Placement Billing Breakdown:**
   - Per placement: Guardian billed amount | Caregiver payout | Agency margin | Period
5. **Payout History:**
   - Past payouts with date, amount, caregiver, payment method
6. **Actions:**
   - `Process All Pending Payouts` bulk action
   - `Export Payroll Report` (CSV/PDF)
   - `Set Payout Schedule` (weekly / bi-weekly / monthly)

---

#### 18.2.5 Admin Placement Monitoring Page *(New — Admin Module)*
**Route:** `/admin/placement-monitoring`

> **Spec ref:** Section 13 lists "Placement Monitoring" under Admin Module. Section 3 (Super Admin) lists "monitoring placements" as a responsibility.

**Sections:**
1. **Header** — "Placement Monitoring" h1 + "Platform-wide overview"
2. **Stats Dashboard (4-grid):**
   - Active Placements (total across all agencies)
   - Shifts Today (active / scheduled / completed / missed)
   - Incident Rate (this week)
   - Avg Guardian Satisfaction
3. **Placement Table (filterable):**
   - Columns: Placement ID | Agency | Guardian | Patient | Caregiver | Start Date | Status | Shifts Compliance % | Rating
   - Filters: Agency dropdown | Status | Date range | Compliance threshold
   - Click row → expanded detail
4. **Alerts & Flags:**
   - Placements with high missed-shift rate (>10%)
   - Placements with no care logs for 24+ hours
   - Placements with open incident reports
   - Placements approaching end date without renewal
5. **Agency Performance Comparison:**
   - Table: Agency | Active Placements | Avg Rating | On-Time Rate | Incident Rate | Revenue
   - Sortable columns

---

#### 18.2.6 Admin Agency Approvals Page *(New — Admin Module)*
**Route:** `/admin/agency-approvals`

> **Spec ref:** Section 3 (Super Admin): "approving agencies". Section 13 (Admin: Agency Approval).

**Sections:**
1. **Header** — "Agency Approvals" h1 + Pending count badge
2. **Status Tabs:** Pending | Approved | Rejected | Suspended
3. **Agency Application Cards:**
   - Each card:
     - Agency name + Owner name + Registration date
     - Business registration number + Documents uploaded count
     - Location + Service areas + Planned caregiver count
     - Documents: Business license, Tax ID, Insurance certificate (view/download)
     - Actions: `Approve` (green) | `Request More Info` (amber) | `Reject` (red) | `Schedule Inspection`
4. **Approved Agencies Tab:**
   - List with: Active placements | Caregiver count | Rating | Revenue | Compliance status
   - Actions: `View Details` | `Suspend Agency`

---

#### 18.2.7 Caregiver Job Marketplace Correction *(Existing page — Architectural Update)*
**Route:** `/caregiver/jobs` (existing CaregiverJobsPage)

> **Spec ref:** Section 7 — "Jobs are posted by agencies. Caregivers apply. Agencies review and hire." Caregivers NEVER receive direct bookings from guardians.

**Corrections to wireframe/implementation:**
- All jobs shown are **agency-posted** jobs, not direct guardian requests
- Each job card must show: Agency name + Agency rating (prominently)
- Job card should NOT show guardian name or patient name (anonymized until hired)
- Job detail shows: Required skills, Shift schedule, Rate, Agency info
- Application flow: `Apply` → Agency reviews → Interview → Offer → Accept/Decline
- Status tracking: Application status badge per job
- Remove any "direct booking" or "guardian contact" UI elements

---

#### 18.2.8 Agency Incidents Management *(Correction — Existing page)*
**Route:** `/agency/incident-report` (existing IncidentReportWizardPage)

> **Spec ref:** Section 10 (Incident log type), Section 13 (Agency: Incidents), Section 17 (incident.reported event)

**Enhancement needed:**
- Add incident LIST view at `/agency/incidents` showing all reported incidents across placements
- Each incident: Severity + Caregiver + Patient + Placement + Date + Status (Open/Investigating/Resolved)
- The existing wizard is for CREATING incidents; need a management dashboard for VIEWING/RESOLVING
- Link to admin escalation for severe incidents

---

### 18.3 Updated Route Map (Full Platform)

**New routes added in Section 18:**
```
/agencies                           → Public Agency Directory (NEW)
/agency/jobs                        → Agency Job Management (NEW)
/agency/jobs/:id/applications       → Agency Applications Review (NEW)
/agency/payroll                     → Agency Payroll & Payouts (NEW)
/agency/incidents                   → Agency Incidents List (NEW — enhancement)
/admin/placement-monitoring         → Admin Placement Monitoring (NEW)
/admin/agency-approvals             → Admin Agency Approvals (NEW)
```

**Existing page corrections:**
```
/caregiver/jobs                     → Updated: shows agency-posted jobs only
/agency/incident-report             → Enhanced: add list view at /agency/incidents
```

---

### 18.4 Updated Summary

| Change Type | Section 17 | Section 18 | Total |
|-------------|-----------|-----------|-------|
| Pages CORRECTED | 6 | 2 | 8 |
| Pages REPLACED | 1 | 0 | 1 |
| Pages ADDED (Public) | 0 | 1 | 1 |
| Pages ADDED (Guardian) | 5 | 0 | 5 |
| Pages ADDED (Agency) | 4 | 4 | 8 |
| Pages ADDED (Caregiver) | 2 | 0 | 2 |
| Pages ADDED (Admin) | 0 | 2 | 2 |
| **Total new pages** | **12** | **8** | **20** |
| **Estimated total pages** | 129+ | **137+** | **137+** |

---

### 18.5 Spec Coverage Verification

Cross-reference of ALL modules listed in Engineering Spec Section 13:

| Spec Module | Spec Pages | Wireframe Coverage | Status |
|-------------|-----------|-------------------|--------|
| **Public** | Home, Agency Directory, Caregiver Directory, Shop Marketplace | Home ✅, Agency Directory ✅ (18.2.1), Caregiver Directory ✅, Shop ✅ | ✅ Complete |
| **Auth** | Register, Login, Password Reset, Role Selection | All covered ✅ | ✅ Complete |
| **Guardian** | Dashboard, Patients, Care Requirements, Agency Proposals, Care Timeline, Payments, Messages | All covered ✅ (Care Timeline = Placement Detail shift history) | ✅ Complete |
| **Caregiver** | Dashboard, Job Marketplace, Applications, Assigned Patients, Shift Schedule, Care Logs, Messages | All covered ✅ (Job Marketplace corrected in 18.2.7) | ✅ Complete |
| **Agency** | Dashboard, Requirements Inbox, Job Management, Applications, Placements, Caregiver Roster, Shift Monitoring, Incidents, Messages | All covered ✅ (Jobs 18.2.2, Applications 18.2.3, Incidents 18.2.8) | ✅ Complete |
| **Shop** | Products, Orders, Inventory, Analytics, Staff | Products ✅, Orders ✅, Inventory ✅, Analytics ✅, Staff (via Merchant Onboarding) ✅ | ✅ Complete |
| **Admin** | User Management, Agency Approval, Caregiver Verification, Placement Monitoring, Dispute Resolution, Payments, Audit Logs | All covered ✅ (Agency Approval 18.2.6, Placement Monitoring 18.2.5) | ✅ Complete |

**All core modules from the Engineering Spec are now fully covered.**

---

### 18.6 Workflow State Machine Coverage

| Workflow | Spec Section | States Covered in UI | Status |
|----------|-------------|---------------------|--------|
| Care Requirement | §6 | Draft→Submitted→AgencyReviewing→JobCreated→CaregiverAssigned→ActiveCare→Completed→Cancelled | ✅ Complete |
| Job Lifecycle | §7 | Open→ApplicationsReceived→Interview→Offer→Filled→Closed | ✅ Complete (18.2.2) |
| Shift Lifecycle | §9 | Scheduled→CheckedIn→Completed→Missed→Late→Replacement | ✅ Complete |
| Caregiver Application | §14 (state diagram) | Submitted→Reviewed→Interview→Offered→Accepted→Rejected | ✅ Complete (18.2.3) |
| Placement | §8 | Active→Completed→Cancelled (with multi-caregiver rotation) | ✅ Complete |

---

### 18.7 Database Entity → UI Coverage

| DB Table (Spec §14) | UI Page(s) | Status |
|---------------------|-----------|--------|
| users, roles, user_roles | Auth pages, Admin Users | ✅ |
| organizations, organization_users | Agency pages, Shop pages | ✅ |
| guardians, patients | Guardian Patients, Patient Intake | ✅ |
| patient_conditions, patient_medications | Patient Intake, Patient Medical Records | ✅ |
| care_requirements, requirement_notes | Care Requirements List, Wizard, Detail | ✅ |
| agencies, agency_staff | Agency Dashboard, Branch Management | ✅ |
| agency_jobs, job_skills | Agency Job Management (18.2.2) | ✅ |
| caregiver_applications, application_interviews | Applications Review (18.2.3) | ✅ |
| caregivers, caregiver_skills, caregiver_certifications | Caregiver Profile, Skills Assessment, Documents | ✅ |
| care_placements, placement_contracts | Placements pages (Guardian + Agency) | ✅ |
| shifts, shift_assignments, shift_checkins | Shift Monitoring, Shift Detail, Placement Detail | ✅ |
| care_logs (all subtypes) | Caregiver Care Log Form | ✅ |
| conversations, messages | Messages pages (all roles) | ✅ |
| shops, products, orders | Shop module pages | ✅ |
| notifications, audit_logs, support_tickets | Notifications, Audit Logs, Support pages | ✅ |

**All 30+ database tables from the spec now have corresponding UI coverage.**

---

*Section 18 spec compliance audit completed: March 16, 2026 — CareNet v1.0 full specification coverage achieved*

---

*Document generated: March 16, 2026 — CareNet v1.0 wireframe reference*

---

## 19. Mobile Architecture & Deployment Strategy

> **Context:** CareNet Bangladesh will be used 95%+ on mobile devices. This section documents the architectural decision for React Web + Capacitor (WebView) over React Native rewrite, and the deployment strategy.
> **Date:** March 16, 2026

---

### 19.1 Architecture Decision: React Web + Capacitor

**Decision:** Keep the existing React + Tailwind + React Router web application and wrap it with **Capacitor** (by Ionic) for native mobile distribution. Do NOT rewrite in React Native.

**Rationale:**

| Approach | Performance (Budget Android) | Native API Access | Code Reuse | Verdict |
|----------|------------------------------|-------------------|------------|---------|
| Raw WebView wrapper | ❌ Poor — janky scrolling, no native optimizations, WebView bugs on Android 9-10 | ❌ None | 100% | **Avoid** |
| **Capacitor** | ✅ Good — system WebView + native bridge, optimized rendering | ✅ Full — camera, GPS, push, biometrics, filesystem | **100%** | **✅ Best fit** |
| React Native | ✅ Excellent — truly native rendering | ✅ Full | 0% — complete rewrite of 137+ pages | Not practical |
| PWA | ✅ Good — runs in Chrome | ⚠️ Limited — no push on iOS, limited background | 100% | Great companion |

---

### 19.2 Capacitor Plugin Requirements for CareNet

| Feature | CareNet Use Case | Capacitor Plugin |
|---------|-----------------|-----------------|
| **Camera** | Care log photo evidence, incident photos, wound photo journal | `@capacitor/camera` |
| **GPS/Geolocation** | Shift check-in location verification, agency service area | `@capacitor/geolocation` |
| **Push Notifications** | Shift reminders, missed shift alerts, incident alerts, messages | `@capacitor/push-notifications` + Firebase FCM |
| **Biometric Auth** | Quick app unlock for caregivers on duty | `capacitor-native-biometric` |
| **Offline Storage** | Care logs drafted without internet, synced on reconnect | `@capacitor/preferences` + IndexedDB |
| **Phone Dialer** | Quick-call agency/guardian from patient card | `@capacitor/action-sheet` |
| **File Downloads** | Invoice PDFs, care reports, payroll exports | `@capacitor/filesystem` |
| **Status Bar** | Native status bar theming per role module | `@capacitor/status-bar` |
| **Haptics** | Tactile feedback on mobile interactions | `@capacitor/haptics` |
| **App Lifecycle** | Back button handling, foreground/background state | `@capacitor/app` |

---

### 19.3 Bangladesh Mobile Market Considerations

**Target devices:** Budget Android (৳8K-15K) — Samsung Galaxy A03, Xiaomi Redmi 9A, Realme C series
**RAM:** Typically 2-3GB
**OS:** Android 9-12 dominant
**Network:** Patchy 3G/4G, data cost-conscious users

| Factor | Impact | Mitigation |
|--------|--------|------------|
| Low RAM (2-3GB) | WebView can be memory-hungry | Keep bundle small, lazy-load routes, minimal heavy animations |
| Slow/patchy data | Page loads critical | Service worker caching, offline care log drafts, skeleton loaders |
| Android 9-11 WebView | Older rendering engine | Capacitor handles backward compat (Android 5.1+) |
| Battery consciousness | Users aggressively close bg apps | Push notifications (FCM) over polling; batch sync |
| Screen size 5.5"-6.5" | Touch-first required | 48px+ touch targets, bottom nav, swipe gestures |
| Data costs | Users avoid heavy downloads | Compress images, lazy-load offscreen content, PWA caching |

---

### 19.4 Deployment Strategy (3 Phases)

```
Phase 1 (Current):   React Web App → accessible via any mobile browser
Phase 2 (Next):      PWA Mode → add vite-plugin-pwa → installable from Chrome,
                     offline support, no Play Store needed (ideal for BD data costs)
Phase 3 (Launch):    Capacitor APK → Play Store distribution
                     Same codebase, zero rewrite, native features enabled
```

---

### 19.5 Project Structure (with Capacitor)

```
/src/app/                    ← React frontend (137+ pages, unchanged)
│   ├── components/          ← Shared UI components
│   ├── pages/               ← All role module pages
│   ├── theme/               ← Design tokens, ThemeProvider
│   └── routes.ts            ← React Router config
│
/android/                    ← Capacitor Android project (auto-generated)
│   └── app/                 ← Play Store build target
│
/ios/                        ← Capacitor iOS project (future, if needed)
│
/supabase/                   ← Backend (when connected)
│   ├── migrations/          ← PostgreSQL schema from engineering spec
│   ├── functions/           ← Edge Functions (API endpoints)
│   └── seed.sql             ← Mock data
│
/src/imports/                ← Reference docs (spec, wireframes)
│
capacitor.config.ts          ← Capacitor configuration
```

---

*Section 19 documented: March 16, 2026 — CareNet v1.0 mobile architecture decision*

---

## 20. Mobile-First Optimization Spec

> **Context:** With 95%+ mobile usage, every page must be optimized for touch interaction, small screens, and limited bandwidth. This section defines the mobile-first design system overrides and component patterns applied across all 137+ pages.
> **Date:** March 16, 2026

---

### 20.1 Global Mobile Shell

**Bottom Navigation Bar (persistent, 64px tall):**
- Replaces desktop sidebar on screens < 768px
- 5 tabs with icons + labels (role-specific):
  - **Guardian:** Home · Patients · Search · Messages · Profile
  - **Caregiver:** Home · Shifts · Jobs · Messages · Profile
  - **Agency:** Home · Requirements · Placements · Jobs · Profile
  - **Admin:** Home · Users · Placements · Agencies · Profile
- Active tab: filled icon + role gradient underline
- Unread badge (red dot) on Messages tab
- Safe area padding for notch/gesture bar devices
- Backdrop blur glass effect matching desktop sidebar style

**Mobile Header (sticky, 56px):**
- Left: Back arrow (on sub-pages) or hamburger (on root pages)
- Center: Page title (truncated to 20 chars)
- Right: Notification bell (with count badge) + contextual action
- Background: white with subtle bottom shadow

**Pull-to-Refresh:** All list/feed pages support pull-to-refresh gesture

**Safe Areas:** `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` applied to header/bottom nav

---

### 20.2 Touch Target Standards

All interactive elements must meet minimum touch target sizes:

| Element | Minimum Size | Padding | Spacing |
|---------|-------------|---------|---------|
| Buttons (primary) | 48px height | 16px horizontal | 12px between |
| Buttons (secondary) | 44px height | 12px horizontal | 8px between |
| Icon buttons | 44×44px | 10px | 8px between |
| List items (tappable) | 56px min height | 16px | 0 (border divider) |
| Tab bar items | 48×48px tap area | 8px | 0 (fill width) |
| Form inputs | 48px height | 16px horizontal | 12px vertical gap |
| Checkbox/Radio | 44×44px tap area | — | 8px from label |
| Chip/Tag filter | 36px height | 12px horizontal | 8px between |
| Cards (tappable) | Natural height | 16px | 12px between |

---

### 20.3 Responsive Breakpoints

```
Mobile:        < 640px   (primary target — 95% users)
Mobile Large:  640-767px (phablets)
Tablet:        768-1023px (agency supervisors, some admin)
Desktop:       ≥ 1024px  (admin, agency back-office)
```

**Layout behavior:**
- **< 768px:** Bottom nav, single column, stacked cards, mobile header, no sidebar
- **≥ 768px:** Desktop sidebar, multi-column grid, desktop header

---

### 20.4 Mobile-Specific Component Patterns

**Cards:** Full-width on mobile (no horizontal padding gap), rounded-2xl, 16px internal padding

**Tables → Cards:** On mobile, all data tables transform into stacked card lists. Each row becomes a card with key-value pairs stacked vertically.

**Modals → Bottom Sheets:** On mobile, modals slide up from bottom (80% viewport height max), with drag handle and swipe-to-dismiss.

**Filters → Collapsible Panel:** Filter sections collapse into a sticky filter bar with expandable bottom sheet.

**Grid layouts:** 
- 4-col stat grid → 2-col on mobile
- 3-col content grid → 1-col on mobile
- 2-col side-by-side → stacked on mobile

**Forms:**
- Single column always
- Labels above inputs (never inline)
- Large touch-friendly date/time pickers
- Submit button sticky at bottom of viewport

---

### 20.5 Performance Targets (Mobile)

| Metric | Target | Method |
|--------|--------|--------|
| First Contentful Paint | < 2s on 3G | Route-based code splitting, critical CSS inline |
| Time to Interactive | < 4s on 3G | Lazy-load non-visible components |
| Bundle per route | < 50KB gzipped | Dynamic imports for each page |
| Image loading | Lazy + placeholder | Skeleton shimmer until loaded |
| Offline capability | Care log draft + cached pages | Service worker + IndexedDB |
| Memory usage | < 150MB | Virtualize long lists, cleanup on unmount |

---

### 20.6 Pages Requiring Special Mobile Treatment

| Page | Mobile Concern | Solution |
|------|---------------|----------|
| CaregiverSearchPage | Filter + results layout | Sticky filter bar, scrollable results, bottom sheet filters |
| CaregiverComparisonPage | Side-by-side table | Swipeable card comparison (swipe left/right between caregivers) |
| MessagesPage | Desktop split-pane | Full-screen chat list → tap → full-screen conversation (no split) |
| GuardianSchedulePage | Calendar widget | Horizontal scrolling week view, tappable day cells |
| AgencyJobManagementPage | Data table | Card list with status badge, swipe actions |
| AdminPlacementMonitoringPage | Complex table | Filterable card list + expandable detail |
| ShiftMonitoringPage | Real-time grid | Scrollable shift cards with live status indicators |
| CaregiverCareLogPage | Multi-step form | Sticky progress bar, step-by-step wizard, large inputs |

---

### 20.7 Mobile Navigation Hierarchy

```
Bottom Nav (persistent)
│
├── Tab 1: Dashboard (Home)
│   └── Sub-pages: push navigation with back arrow
│
├── Tab 2: Primary Action
│   └── Sub-pages: push navigation
│
├── Tab 3: Search/Browse
│   └── Sub-pages: push navigation
│
├── Tab 4: Messages
│   ├── Chat List (full screen)
│   └── Chat Detail (full screen, back arrow)
│
└── Tab 5: Profile/Settings
    └── Sub-pages: push navigation
```

Each bottom nav tab maintains its own navigation stack. Tapping the same tab scrolls to top / pops to root.

---

*Section 20 documented: March 16, 2026 — CareNet v1.0 mobile-first optimization specification*

---

## 21. Build Status Audit — All Pages

> **Audit Date:** March 16, 2026
> **Method:** Cross-referenced every wireframed page (Sections 1–18) against filesystem (`/src/app/pages/`) and route registry (`/src/app/routes.ts`).
> **Legend:** ✅ = Built & Routed | ⚠️ = Partially Built | ❌ = Not Built | 🔄 = Redirect/Deprecated

---

### 21.1 Public Module (Section 2) — 13 pages

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 1 | Home Page | §2.1 | `/` `/home` | `HomePage.tsx` | ✅ Built |
| 2 | About Page | §2.2 | `/about` | `AboutPage.tsx` | ✅ Built |
| 3 | Features Page | §2.3 | `/features` | `FeaturesPage.tsx` | ✅ Built |
| 4 | Pricing Page | §2.4 | `/pricing` | `PricingPage.tsx` | ✅ Built |
| 5 | Marketplace / Job Portal | §2.5 | `/marketplace` | `MarketplacePage.tsx` | ✅ Built |
| 6 | Contact Page | §2.6 | `/contact` | `ContactPage.tsx` | ✅ Built |
| 7 | Privacy Policy | §2.7 | `/privacy` | `PrivacyPage.tsx` | ✅ Built |
| 8 | Terms of Service | §2.8 | `/terms` | `TermsPage.tsx` | ✅ Built |
| 9 | Global Search | §2.9 | `/global-search` | `GlobalSearchPage.tsx` | ✅ Built |
| 10 | Dashboard (Role Router) | §2.10 | `/dashboard` | `DashboardPage.tsx` | ✅ Built |
| 11 | Messages (General) | §2.11 | `/messages` | `MessagesPage.tsx` | ✅ Built |
| 12 | Notifications | §2.12 | `/notifications` | `NotificationsPage.tsx` | ✅ Built |
| 13 | Settings | §2.13 | `/settings` | `SettingsPage.tsx` | ✅ Built |

**Public Module: 13/13 ✅**

---

### 21.2 Authentication Module (Section 3) — 8 pages

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 14 | Login | §3.1 | `/auth/login` | `LoginPage.tsx` | ✅ Built |
| 15 | Role Selection | §3.2 | `/auth/role-selection` | `RoleSelectionPage.tsx` | ✅ Built |
| 16 | Register | §3.3 | `/auth/register` | `auth/RegisterPage.tsx` | ✅ Built |
| 17 | Forgot Password | §3.4 | `/auth/forgot-password` | `auth/ForgotPasswordPage.tsx` | ✅ Built |
| 18 | Reset Password | §3.5 | `/auth/reset-password` | `auth/ResetPasswordPage.tsx` | ✅ Built |
| 19 | MFA Setup | §3.6 | `/auth/mfa-setup` | `auth/MFASetupPage.tsx` | ✅ Built |
| 20 | MFA Verify | §3.7 | `/auth/mfa-verify` | `auth/MFAVerifyPage.tsx` | ✅ Built |
| 21 | Verification Result | §3.8 | `/auth/verification-result` | `auth/VerificationResultPage.tsx` | ✅ Built |

**Auth Module: 8/8 ✅**

---

### 21.3 Caregiver Module (Section 4 + §17.3.11–12) — 20 pages

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 22 | Dashboard | §4.1 | `/caregiver/dashboard` | `CaregiverDashboardPage.tsx` | ✅ Built |
| 23 | Profile | §4.2 | `/caregiver/profile` | `CaregiverProfilePage.tsx` | ✅ Built |
| 24 | Assigned Patients | §4.3/§17.3.11 | `/caregiver/assigned-patients` | `CaregiverAssignedPatientsPage.tsx` | ✅ Built |
| 25 | Structured Care Log | §4.4/§17.3.12 | `/caregiver/care-log` | `CaregiverCareLogPage.tsx` | ✅ Built |
| 26 | Jobs Page | §4.5 | `/caregiver/jobs` | `CaregiverJobsPage.tsx` | ✅ Built |
| 27 | Job Detail | §4.4(old) | `/caregiver/jobs/:id` | `CaregiverJobDetailPage.tsx` | ✅ Built |
| 28 | Schedule | §4.5(old) | `/caregiver/schedule` | `CaregiverSchedulePage.tsx` | ✅ Built |
| 29 | Earnings | §4.6 | `/caregiver/earnings` | `CaregiverEarningsPage.tsx` | ✅ Built |
| 30 | Messages | §4.7 | `/caregiver/messages` | `CaregiverMessagesPage.tsx` | ✅ Built |
| 31 | Reviews | §4.8 | `/caregiver/reviews` | `CaregiverReviewsPage.tsx` | ✅ Built |
| 32 | Documents | §4.9 | `/caregiver/documents` | `CaregiverDocumentsPage.tsx` | ✅ Built |
| 33 | Daily Earnings Detail | §4.10 | `/caregiver/daily-earnings` | `DailyEarningsDetailPage.tsx` | ✅ Built |
| 34 | Job Application Detail | §4.11 | `/caregiver/job-application/:id` | `JobApplicationDetailPage.tsx` | ✅ Built |
| 35 | Payout Setup | §4.12 | `/caregiver/payout-setup` | `PayoutSetupPage.tsx` | ✅ Built |
| 36 | Portfolio Editor | §4.13 | `/caregiver/portfolio` | `PortfolioEditorPage.tsx` | ✅ Built |
| 37 | Reference Manager | §4.14 | `/caregiver/references` | `ReferenceManagerPage.tsx` | ✅ Built |
| 38 | Shift Detail | §4.15 | `/caregiver/shift/:id` | `ShiftDetailPage.tsx` | ✅ Built |
| 39 | Skills Assessment | §4.16 | `/caregiver/skills-assessment` | `SkillsAssessmentPage.tsx` | ✅ Built |
| 40 | Tax Reports | §4.17 | `/caregiver/tax-reports` | `TaxReportsPage.tsx` | ✅ Built |
| 41 | Training Portal | §4.18 | `/caregiver/training` | `TrainingPortalPage.tsx` | ✅ Built |

**Caregiver Module: 20/20 ✅**

---

### 21.4 Guardian Module (Section 5 + §17.3.1–6) — 20 pages

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 42 | Dashboard | §5.1 | `/guardian/dashboard` | `GuardianDashboardPage.tsx` | ✅ Built |
| 43 | Search (Agency + Caregiver) | §5.2/§17.2.2 | `/guardian/search` | `CaregiverSearchPage.tsx` | ✅ Built |
| 44 | Caregiver Public Profile | §5.3/§17.2.3 | `/guardian/caregiver/:id` | `CaregiverPublicProfilePage.tsx` | ✅ Built |
| 45 | Caregiver Comparison | §5.4/§17.2.4 | `/guardian/caregiver-comparison` | `CaregiverComparisonPage.tsx` | ✅ Built |
| 46 | Booking Wizard (Deprecated) | §5.5/§17.2.5 | `/guardian/booking` | `BookingWizardPage.tsx` | 🔄 Redirect |
| 47 | Schedule | §5.6 | `/guardian/schedule` | `GuardianSchedulePage.tsx` | ✅ Built |
| 48 | Patients | §5.7 | `/guardian/patients` | `GuardianPatientsPage.tsx` | ✅ Built |
| 49 | Patient Intake | §5.8 | `/guardian/patient-intake` | `PatientIntakePage.tsx` | ✅ Built |
| 50 | Messages | §5.9/§17.2.6 | `/guardian/messages` | `GuardianMessagesPage.tsx` | ✅ Built |
| 51 | Payments | §5.10/§17.2.7 | `/guardian/payments` | `GuardianPaymentsPage.tsx` | ✅ Built |
| 52 | Invoice Detail | §5.11 | `/guardian/invoice/:id` | `InvoiceDetailPage.tsx` | ✅ Built |
| 53 | Reviews | §5.12 | `/guardian/reviews` | `GuardianReviewsPage.tsx` | ✅ Built |
| 54 | Profile | §5.13 | `/guardian/profile` | `GuardianProfilePage.tsx` | ✅ Built |
| 55 | Family Hub | §5.14 | `/guardian/family-hub` | `FamilyHubPage.tsx` | ✅ Built |
| 56 | Agency Public Profile | §17.3.1 | `/guardian/agency/:id` | `AgencyPublicProfilePage.tsx` | ✅ Built |
| 57 | Care Requirements List | §17.3.2 | `/guardian/care-requirements` | `CareRequirementsListPage.tsx` | ✅ Built |
| 58 | Care Requirement Wizard | §17.3.3 | `/guardian/care-requirement-wizard` | `CareRequirementWizardPage.tsx` | ✅ Built |
| 59 | Care Requirement Detail | §17.3.4 | `/guardian/care-requirement/:id` | `CareRequirementDetailPage.tsx` | ✅ Built |
| 60 | Placements List | §17.3.5 | `/guardian/placements` | `GuardianPlacementsPage.tsx` | ✅ Built |
| 61 | Placement Detail | §17.3.6 | `/guardian/placement/:id` | `GuardianPlacementDetailPage.tsx` | ✅ Built |

**Guardian Module: 20/20 ✅** (1 deprecated redirect)

---

### 21.5 Patient Module (Section 6) — 9 pages

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 62 | Dashboard | §6.1 | `/patient/dashboard` | `PatientDashboardPage.tsx` | ✅ Built |
| 63 | Profile | §6.2 | `/patient/profile` | `PatientProfilePage.tsx` | ✅ Built |
| 64 | Care History | §6.3 | `/patient/care-history` | `PatientCareHistoryPage.tsx` | ✅ Built |
| 65 | Medical Records | §6.4 | `/patient/medical-records` | `PatientMedicalRecordsPage.tsx` | ✅ Built |
| 66 | Health Report | §6.5 | `/patient/health-report` | `PatientHealthReportPage.tsx` | ✅ Built |
| 67 | Vitals Tracking | §6.6 | `/patient/vitals` | `VitalsTrackingPage.tsx` | ✅ Built |
| 68 | Medication Reminders | §6.7 | `/patient/medications` | `MedicationRemindersPage.tsx` | ✅ Built |
| 69 | Emergency Hub | §6.8 | `/patient/emergency` | `EmergencyHubPage.tsx` | ✅ Built |
| 70 | Data Privacy Manager | §6.9 | `/patient/data-privacy` | `DataPrivacyManagerPage.tsx` | ✅ Built |

**Patient Module: 9/9 ✅**

---

### 21.6 Agency Module (Section 7 + §17.3.7–10, §18.2.2–4,8) — 20 pages

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 71 | Dashboard | §7.1 | `/agency/dashboard` | `AgencyDashboardPage.tsx` | ✅ Built |
| 72 | Caregivers | §7.2 | `/agency/caregivers` | `AgencyCaregiversPage.tsx` | ✅ Built |
| 73 | Clients | §7.3 | `/agency/clients` | `AgencyClientsPage.tsx` | ✅ Built |
| 74 | Client Intake | §7.4 | `/agency/client-intake` | `ClientIntakePage.tsx` | ✅ Built |
| 75 | Client Care Plan | §7.5 | `/agency/care-plan/:id` | `ClientCarePlanPage.tsx` | ✅ Built |
| 76 | Payments | §7.6 | `/agency/payments` | `AgencyPaymentsPage.tsx` | ✅ Built |
| 77 | Reports | §7.7 | `/agency/reports` | `AgencyReportsPage.tsx` | ✅ Built |
| 78 | Storefront | §7.8 | `/agency/storefront` | `AgencyStorefrontPage.tsx` | ✅ Built |
| 79 | Branch Management | §7.9 | `/agency/branches` | `BranchManagementPage.tsx` | ✅ Built |
| 80 | Staff Attendance | §7.10 | `/agency/attendance` | `StaffAttendancePage.tsx` | ✅ Built |
| 81 | Staff Hiring | §7.11 | `/agency/hiring` | `StaffHiringPage.tsx` | ✅ Built |
| 82 | Incident Report Wizard | §7.12 | `/agency/incident-report` | `IncidentReportWizardPage.tsx` | ✅ Built |
| 83 | Requirements Inbox | §17.3.7 | `/agency/requirements-inbox` | `AgencyRequirementsInboxPage.tsx` | ✅ Built |
| 84 | Requirement Review | §17.3.8 | `/agency/requirement-review/:id` | `AgencyRequirementReviewPage.tsx` | ✅ Built |
| 85 | Placements Management | §17.3.9 | `/agency/placements` | `AgencyPlacementsPage.tsx` | ✅ Built |
| 86 | Placement Detail & Shift Planner | §17.3.10 | `/agency/placement/:id` | `AgencyPlacementDetailPage.tsx` | ✅ Built |
| 87 | Shift Monitoring | §17.3.13 | `/agency/shift-monitoring` | `ShiftMonitoringPage.tsx` | ✅ Built |
| 88 | Job Management | §18.2.2 | `/agency/job-management` | `AgencyJobManagementPage.tsx` | ✅ Built |
| 89 | Job Applications Review | §18.2.3 | `/agency/jobs/:id/applications` | `AgencyJobApplicationsPage.tsx` | ✅ Built |
| 90 | Payroll & Payouts | §18.2.4 | `/agency/payroll` | `AgencyPayrollPage.tsx` | ✅ Built |

**Agency Module: 20/20 ✅**

> **Note:** §18.2.8 defined an Agency Incidents List page at `/agency/incidents` — this is an enhancement to the existing Incident Report Wizard, not a separate page file. The wireframe describes adding a list view alongside the existing wizard. This could be built as a tab within the existing `IncidentReportWizardPage.tsx` or as a new page. **Status: Enhancement pending** — tracked in Section 21.10 below.

---

### 21.7 Admin Module (Section 8 + §18.2.5–6) — 19 pages

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 91 | Dashboard | §8.1 | `/admin/dashboard` | `AdminDashboardPage.tsx` | ✅ Built |
| 92 | Users | §8.2 | `/admin/users` | `AdminUsersPage.tsx` | ✅ Built |
| 93 | Verifications | §8.3 | `/admin/verifications` | `AdminVerificationsPage.tsx` | ✅ Built |
| 94 | Verification Case | §8.4 | `/admin/verification-case/:id` | `VerificationCasePage.tsx` | ✅ Built |
| 95 | Reports | §8.5 | `/admin/reports` | `AdminReportsPage.tsx` | ✅ Built |
| 96 | Dispute Adjudication | §8.6 | `/admin/disputes` | `DisputeAdjudicationPage.tsx` | ✅ Built |
| 97 | Payments | §8.7 | `/admin/payments` | `AdminPaymentsPage.tsx` | ✅ Built |
| 98 | Financial Audit | §8.8 | `/admin/financial-audit` | `FinancialAuditPage.tsx` | ✅ Built |
| 99 | Settings | §8.9 | `/admin/settings` | `AdminSettingsPage.tsx` | ✅ Built |
| 100 | Policy Manager | §8.10 | `/admin/policy` | `PolicyManagerPage.tsx` | ✅ Built |
| 101 | Promo Management | §8.11 | `/admin/promos` | `PromoManagementPage.tsx` | ✅ Built |
| 102 | CMS Manager | §8.12 | `/admin/cms` | `CMSManagerPage.tsx` | ✅ Built |
| 103 | Support Ticket Detail | §8.13 | `/admin/support-ticket/:id` | `SupportTicketDetailPage.tsx` | ✅ Built |
| 104 | Audit Logs | §8.14 | `/admin/audit-logs` | `AuditLogsPage.tsx` | ✅ Built |
| 105 | System Health | §8.15 | `/admin/system-health` | `SystemHealthPage.tsx` | ✅ Built |
| 106 | User Inspector | §8.16 | `/admin/user-inspector` | `UserInspectorPage.tsx` | ✅ Built |
| 107 | Sitemap | §8.17 | `/admin/sitemap` | `SitemapPage.tsx` | ✅ Built |
| 108 | Placement Monitoring | §18.2.5 | `/admin/placement-monitoring` | `AdminPlacementMonitoringPage.tsx` | ✅ Built |
| 109 | Agency Approvals | §18.2.6 | `/admin/agency-approvals` | `AdminAgencyApprovalsPage.tsx` | ✅ Built |

**Admin Module: 19/19 ✅**

---

### 21.8 Moderator Module (Section 9) — 4 pages

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 110 | Dashboard | §9.1 | `/moderator/dashboard` | `ModeratorDashboardPage.tsx` | ✅ Built |
| 111 | Reviews | §9.2 | `/moderator/reviews` | `ModeratorReviewsPage.tsx` | ✅ Built |
| 112 | Reports | §9.3 | `/moderator/reports` | `ModeratorReportsPage.tsx` | ✅ Built |
| 113 | Content | §9.4 | `/moderator/content` | `ModeratorContentPage.tsx` | ✅ Built |

**Moderator Module: 4/4 ✅**

---

### 21.9 Shop Module — Merchant (Section 10) + Customer (Section 11) — 19 pages

**Merchant (9 pages):**

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 114 | Shop Dashboard | §10.1 | `/shop/dashboard` | `ShopDashboardPage.tsx` | ✅ Built |
| 115 | Products | §10.2 | `/shop/products` | `ShopProductsPage.tsx` | ✅ Built |
| 116 | Product Editor | §10.3 | `/shop/product-editor` | `ProductEditorPage.tsx` | ✅ Built |
| 117 | Orders | §10.4 | `/shop/orders` | `ShopOrdersPage.tsx` | ✅ Built |
| 118 | Inventory | §10.5 | `/shop/inventory` | `ShopInventoryPage.tsx` | ✅ Built |
| 119 | Analytics | §10.6 | `/shop/analytics` | `ShopAnalyticsPage.tsx` | ✅ Built |
| 120 | Merchant Onboarding | §10.7 | `/shop/onboarding` | `MerchantOnboardingPage.tsx` | ✅ Built |
| 121 | Merchant Analytics | §10.8 | `/shop/merchant-analytics` | `MerchantAnalyticsPage.tsx` | ✅ Built |
| 122 | Merchant Fulfillment | §10.9 | `/shop/fulfillment` | `MerchantFulfillmentPage.tsx` | ✅ Built |

**Customer / Shop Front (10 pages):**

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 123 | Product List | §11.1 | `/shop` | `shop-front/ProductListPage.tsx` | ✅ Built |
| 124 | Product Details | §11.2 | `/shop/product/:id` | `shop-front/ProductDetailsPage.tsx` | ✅ Built |
| 125 | Product Category | §11.3 | `/shop/category/:category` | `shop-front/ProductCategoryPage.tsx` | ✅ Built |
| 126 | Product Reviews | §11.4 | `/shop/product/:id/reviews` | `shop-front/ProductReviewsPage.tsx` | ✅ Built |
| 127 | Cart | §11.5 | `/shop/cart` | `shop-front/CartPage.tsx` | ✅ Built |
| 128 | Checkout | §11.6 | `/shop/checkout` | `shop-front/CheckoutPage.tsx` | ✅ Built |
| 129 | Order Success | §11.7 | `/shop/order-success` | `shop-front/OrderSuccessPage.tsx` | ✅ Built |
| 130 | Order Tracking | §11.8 | `/shop/order-tracking/:id` | `shop-front/OrderTrackingPage.tsx` | ✅ Built |
| 131 | Order History | §11.9 | `/shop/order-history` | `shop-front/CustomerOrderHistoryPage.tsx` | ✅ Built |
| 132 | Wishlist | §11.10 | `/shop/wishlist` | `shop-front/WishlistPage.tsx` | ✅ Built |

**Shop Module (Merchant + Customer): 19/19 ✅**

---

### 21.9b Community Module (Section 12) + Support Module (Section 13) + Utility (Section 14) — 8 pages

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 133 | Blog List | §12.1 | `/community/blog` | `community/BlogListPage.tsx` | ✅ Built |
| 134 | Blog Detail | §12.2 | `/community/blog/:id` | `community/BlogDetailPage.tsx` | ✅ Built |
| 135 | Careers | §12.3 | `/community/careers` | `community/CareerPage.tsx` | ✅ Built |
| 136 | Help Center | §13.1 | `/support/help` | `support/HelpCenterPage.tsx` | ✅ Built |
| 137 | Contact Us | §13.2 | `/support/contact` | `support/ContactUsPage.tsx` | ✅ Built |
| 138 | Ticket Submission | §13.3 | `/support/ticket` | `support/TicketSubmissionPage.tsx` | ✅ Built |
| 139 | Refund Request | §13.4 | `/support/refund` | `support/RefundRequestPage.tsx` | ✅ Built |
| 140 | 404 Not Found | §14.1 | `*` | `NotFoundPage.tsx` | ✅ Built |

**Community + Support + Utility: 8/8 ✅**

---

### 21.9c Section 18 — Agency Directory (Public)

| # | Page | Wireframe | Route | File | Status |
|---|------|-----------|-------|------|--------|
| 141 | Public Agency Directory | §18.2.1 | `/agencies` | `AgencyDirectoryPage.tsx` | ✅ Built |

---

### 21.10 Overall Build Summary

| Module | Wireframed | Built | Status |
|--------|-----------|-------|--------|
| Public (§2) | 13 | 13 | ✅ 100% |
| Auth (§3) | 8 | 8 | ✅ 100% |
| Caregiver (§4 + §17) | 20 | 20 | ✅ 100% |
| Guardian (§5 + §17) | 20 | 20 | ✅ 100% |
| Patient (§6) | 9 | 9 | ✅ 100% |
| Agency (§7 + §17 + §18) | 20 | 20 | ✅ 100% |
| Admin (§8 + §18) | 19 | 19 | ✅ 100% |
| Moderator (§9) | 4 | 4 | ✅ 100% |
| Shop Merchant (§10) | 9 | 9 | ✅ 100% |
| Shop Front (§11) | 10 | 10 | ✅ 100% |
| Community (§12) | 3 | 3 | ✅ 100% |
| Support (§13) | 4 | 4 | ✅ 100% |
| Utility (§14) | 1 | 1 | ✅ 100% |
| Agency Directory (§18) | 1 | 1 | ✅ 100% |
| **TOTAL (Core)** | **141** | **141** | **✅ 100%** |

---

### 21.11 Shared Components Built

| Component | File | Purpose |
|-----------|------|---------|
| Layout | `components/Layout.tsx` | Role sidebar + header + content wrapper |
| PublicNavBar | `components/PublicNavBar.tsx` | Top navbar for public pages |
| BottomNav | `components/BottomNav.tsx` | Mobile role-aware bottom navigation |
| RootLayout | `components/RootLayout.tsx` | Root layout wrapper (PublicNavBar + BottomNav + Outlet) |
| ThemeProvider | `components/ThemeProvider.tsx` | Dark/light mode with localStorage persistence |
| Design Tokens | `theme/tokens.ts` | TypeScript brand colors, role configs, semantic helpers |
| Theme CSS | `styles/theme.css` | CSS custom properties, dark mode, Tailwind v4 mapping |

---

### 21.12 Section 15 — Proposed Improvement Pages (NOT YET BUILT)

> **Status:** These are **proposed future enhancements** from Section 15. They were designed as wireframes but have NOT been committed for v1.0 build. They represent the **v2.0 roadmap**.

| # | Proposed Page | Wireframe | Route | Priority | Status |
|---|--------------|-----------|-------|----------|--------|
| P1 | Daily Care Log / Care Diary | §15.1 | `/patient/care-log` `/guardian/care-log` | 🔴 High | ❌ Not Built |
| P2 | Patient Care Plan (Patient View) | §15.2 | `/patient/care-plan` | 🔴 High | ❌ Not Built |
| P3 | Smart Health Alerts / Alert Rules | §15.3 | `/guardian/alerts` `/patient/alerts` | 🔴 High | ❌ Not Built |
| P4 | Caregiver Live Tracking | §15.4 | `/guardian/live-tracking` | 🔴 High | ❌ Not Built |
| P5 | Care Transition / Shift Handoff | §15.5 | `/caregiver/handoff` | 🔴 High | ❌ Not Built |
| P6 | Symptom & Pain Journal | §15.6 | `/patient/symptoms` | 🟠 Medium | ❌ Not Built |
| P7 | Wound / Photo Journal | §15.7 | `/patient/photo-journal` | 🟠 Medium | ❌ Not Built |
| P8 | Guardian Live Dashboard | §15.8 | `/guardian/live-monitor` | 🟠 Medium | ❌ Not Built |
| P9 | Care Quality Scorecard | §15.9 | `/guardian/care-scorecard` | 🟠 Medium | ❌ Not Built |
| P10 | Telehealth / Video Consultation | §15.10 | `/patient/telehealth` | 🟠 Medium | ❌ Not Built |
| P11 | Nutrition & Diet Tracker | §15.12 | `/patient/nutrition` | 🟡 Nice-to-have | ❌ Not Built |
| P12 | Rehabilitation / Exercise Tracker | §15.13 | `/patient/rehab` | 🟡 Nice-to-have | ❌ Not Built |
| P13 | Family Communication Board | §15.14 | `/guardian/family-board` | 🟡 Nice-to-have | ❌ Not Built |
| P14 | Insurance & Coverage Tracker | §15.15 | `/patient/insurance` | 🟡 Nice-to-have | ❌ Not Built |

**Section 15 Proposed Pages: 0/14 built** — These are roadmap items for v2.0.

---

### 21.13 Minor Enhancements Pending

| Enhancement | Wireframe | Description | Severity |
|-------------|-----------|-------------|----------|
| Agency Incidents List | §18.2.8 | Add list view at `/agency/incidents` alongside existing wizard | Low — wizard exists, list view is an enhancement |
| Voice Notes Integration | §15.11 | Add voice recording to Care Log, Messages, Shift Detail | Low — v2.0 enhancement |

---

### 21.14 Final Verdict

**All 141 core wireframed pages are BUILT and ROUTED.**

The platform is at **100% build completion** for the v1.0 specification (Sections 1–18 of the wireframes). The 14 proposed improvement pages from Section 15 are designated as v2.0 roadmap items and are tracked but not built.

**File count verification:**
- `/src/app/pages/` root: 17 files ✅
- `/src/app/pages/admin/`: 19 files ✅
- `/src/app/pages/agency/`: 20 files ✅
- `/src/app/pages/auth/`: 6 files ✅
- `/src/app/pages/caregiver/`: 20 files ✅
- `/src/app/pages/guardian/`: 20 files ✅
- `/src/app/pages/moderator/`: 4 files ✅
- `/src/app/pages/patient/`: 9 files ✅
- `/src/app/pages/shop/`: 9 files ✅
- `/src/app/pages/shop-front/`: 10 files ✅
- `/src/app/pages/community/`: 3 files ✅
- `/src/app/pages/support/`: 4 files ✅
- **Total page files: 141** ✅

---

*Section 21 build status audit completed: March 16, 2026 — CareNet v1.0: 141/141 core pages built (100%)*
