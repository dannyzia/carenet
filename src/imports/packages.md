# THE FINAL VERSION

## **Unified Care Contract Format (UCCF v1.0)**

This is your **source of truth**. Everything else (forms, UI, API) derives from this.

---

# 1. ROOT STRUCTURE

```yaml
UCCF:
  meta
  party
  care_subject
  care_needs
  staffing
  schedule
  services
  medical
  logistics
  equipment
  pricing
  sla
  compliance
  exclusions
  add_ons
```

---

# 2. FIELD-BY-FIELD (CLEAN + NON-REDUNDANT)

---

## 2.1 META (system control)

```yaml
meta:
  type: request | offer
  title
  category:
    - elderly
    - post_surgery
    - chronic
    - critical
    - baby
    - disability
  location:
    city
    area
    address_optional
  start_date
  duration_type: short | monthly | long_term
```

---

## 2.2 PARTY (who is posting)

```yaml
party:
  role: patient | agency
  name
  contact_phone
  contact_whatsapp
  organization_name (if agency)
  service_area (if agency)
```

---

## 2.3 CARE SUBJECT (standardized patient profile)

```yaml
care_subject:
  age
  gender
  condition_summary
  mobility:
    independent | assisted | bedridden
  cognitive:
    normal | impaired | unconscious
  risk_level:
    low | medium | high
```

---

## 2.4 MEDICAL (separate from general care — critical separation)

```yaml
medical:
  diagnosis
  comorbidities
  devices:
    - oxygen
    - catheter
    - feeding_tube
    - ventilator
  procedures_required:
    - injection
    - IV
    - suction
    - wound_care
  medication_complexity:
    low | medium | high
```

---

## 2.5 CARE NEEDS (WHAT needs to be done)

```yaml
care_needs:
  ADL:
    bathing: yes/no
    feeding: oral/tube
    toileting: assisted/full
    mobility_support: yes/no
  monitoring:
    vitals: yes/no
    continuous_supervision: yes/no
  companionship: yes/no
```

---

## 2.6 STAFFING (WHO will do it)

```yaml
staffing:
  caregiver_count
  nurse_count
  required_level:
    L1: caregiver
    L2: trained caregiver
    L3: nurse
    L4: ICU nurse
  gender_preference
  experience_years
  certifications_required:
    - BNMC
    - CPR
```

---

## 2.7 SCHEDULE (WHEN)

```yaml
schedule:
  hours_per_day: 8 | 12 | 24
  shift_type:
    day | night | rotational
  staff_pattern:
    single | double | rotational_team
```

---

## 2.8 SERVICES (STANDARDIZED CHECKLIST)

This replaces all messy tables you saw.

```yaml
services:
  personal_care:
    - bathing
    - grooming
    - toileting
  medical_support:
    - medication
    - vitals
    - wound_care
  household_support:
    - patient_laundry
    - meal_prep
  advanced_care:
    - NG_tube
    - suction
    - oxygen
  coordination:
    - doctor_visit
    - hospital_support
```

---

## 2.9 LOGISTICS (real-world constraints)

```yaml
logistics:
  location_type:
    home | hospital
  accommodation_provided: yes/no
  food_provided: yes/no
  travel_distance_km
```

---

## 2.10 EQUIPMENT

```yaml
equipment:
  required:
    - hospital_bed
    - oxygen
    - monitor
  provider:
    patient | agency | mixed
```

---

## 2.11 PRICING (dual-mode)

### Patient side:

```yaml
pricing:
  budget_min
  budget_max
  preferred_model:
    monthly | daily | hourly
```

### Agency side:

```yaml
pricing:
  base_price
  pricing_model:
    monthly | daily | hourly
  included_hours
  overtime_rate
  extra_charges:
    - night
    - emergency
    - transport
```

---

## 2.12 SLA (your competitive advantage)

```yaml
sla:
  replacement_time_hours
  emergency_response_minutes
  attendance_guarantee_percent
  reporting_frequency:
    daily | weekly
```

---

## 2.13 COMPLIANCE (trust layer)

```yaml
compliance:
  background_verified: yes/no
  medical_fit: yes/no
  contract_required: yes/no
  trial_available: yes/no
```

---

## 2.14 EXCLUSIONS (prevents disputes)

```yaml
exclusions:
  - heavy_household_work
  - non_patient_tasks
  - high_risk_procedures
```

---

## 2.15 ADD-ONS (monetization)

```yaml
add_ons:
  - doctor_visit
  - physiotherapy
  - ambulance
  - diagnostics
```

---

# 1) FULL JSON SCHEMA (VALIDATION-READY)

This is strict enough for backend validation (AJV / Zod compatible).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "UnifiedCareContract",
  "type": "object",
  "required": ["meta", "party", "care_subject", "care_needs", "staffing", "schedule", "pricing"],
  "properties": {
    "meta": {
      "type": "object",
      "required": ["type", "title", "location"],
      "properties": {
        "type": { "enum": ["request", "offer"] },
        "title": { "type": "string", "minLength": 5 },
        "category": {
          "type": "array",
          "items": {
            "enum": ["elderly", "post_surgery", "chronic", "critical", "baby", "disability"]
          }
        },
        "location": {
          "type": "object",
          "required": ["city"],
          "properties": {
            "city": { "type": "string" },
            "area": { "type": "string" },
            "address_optional": { "type": "string" }
          }
        },
        "start_date": { "type": "string", "format": "date" },
        "duration_type": { "enum": ["short", "monthly", "long_term"] }
      }
    },

    "party": {
      "type": "object",
      "required": ["role", "contact_phone"],
      "properties": {
        "role": { "enum": ["patient", "agency"] },
        "name": { "type": "string" },
        "organization_name": { "type": "string" },
        "contact_phone": { "type": "string" },
        "contact_whatsapp": { "type": "string" }
      }
    },

    "care_subject": {
      "type": "object",
      "required": ["age", "mobility"],
      "properties": {
        "age": { "type": "integer", "minimum": 0 },
        "gender": { "enum": ["male", "female", "other"] },
        "condition_summary": { "type": "string" },
        "mobility": { "enum": ["independent", "assisted", "bedridden"] },
        "cognitive": { "enum": ["normal", "impaired", "unconscious"] },
        "risk_level": { "enum": ["low", "medium", "high"] }
      }
    },

    "medical": {
      "type": "object",
      "properties": {
        "diagnosis": { "type": "string" },
        "comorbidities": { "type": "array", "items": { "type": "string" } },
        "devices": {
          "type": "array",
          "items": {
            "enum": ["oxygen", "catheter", "feeding_tube", "ventilator"]
          }
        },
        "procedures_required": {
          "type": "array",
          "items": {
            "enum": ["injection", "IV", "suction", "wound_care"]
          }
        },
        "medication_complexity": {
          "enum": ["low", "medium", "high"]
        }
      }
    },

    "care_needs": {
      "type": "object",
      "properties": {
        "ADL": {
          "type": "object",
          "properties": {
            "bathing": { "type": "boolean" },
            "feeding": { "enum": ["oral", "tube"] },
            "toileting": { "enum": ["assisted", "full"] },
            "mobility_support": { "type": "boolean" }
          }
        },
        "monitoring": {
          "type": "object",
          "properties": {
            "vitals": { "type": "boolean" },
            "continuous_supervision": { "type": "boolean" }
          }
        },
        "companionship": { "type": "boolean" }
      }
    },

    "staffing": {
      "type": "object",
      "required": ["required_level"],
      "properties": {
        "caregiver_count": { "type": "integer", "minimum": 0 },
        "nurse_count": { "type": "integer", "minimum": 0 },
        "required_level": { "enum": ["L1", "L2", "L3", "L4"] },
        "gender_preference": { "enum": ["male", "female", "none"] },
        "experience_years": { "type": "integer" }
      }
    },

    "schedule": {
      "type": "object",
      "properties": {
        "hours_per_day": { "enum": [8, 12, 24] },
        "shift_type": { "enum": ["day", "night", "rotational"] },
        "staff_pattern": { "enum": ["single", "double", "rotational_team"] }
      }
    },

    "services": {
      "type": "object",
      "properties": {
        "personal_care": { "type": "array", "items": { "type": "string" } },
        "medical_support": { "type": "array", "items": { "type": "string" } },
        "advanced_care": { "type": "array", "items": { "type": "string" } }
      }
    },

    "logistics": {
      "type": "object",
      "properties": {
        "location_type": { "enum": ["home", "hospital"] },
        "accommodation_provided": { "type": "boolean" },
        "food_provided": { "type": "boolean" }
      }
    },

    "equipment": {
      "type": "object",
      "properties": {
        "required": { "type": "array", "items": { "type": "string" } },
        "provider": { "enum": ["patient", "agency", "mixed"] }
      }
    },

    "pricing": {
      "type": "object",
      "properties": {
        "budget_min": { "type": "number" },
        "budget_max": { "type": "number" },
        "base_price": { "type": "number" },
        "pricing_model": { "enum": ["monthly", "daily", "hourly"] }
      }
    },

    "sla": {
      "type": "object",
      "properties": {
        "replacement_time_hours": { "type": "number" },
        "emergency_response_minutes": { "type": "number" }
      }
    }
  }
}
```

---

# 2) DYNAMIC FORM GENERATOR (LIKE YOUR TENDER ENGINE)

## Core idea

Each section = **independent module**
Each field = **toggleable + rule-driven**

---

## Form Config JSON

```json
{
  "sections": [
    {
      "id": "care_subject",
      "title": "Patient Profile",
      "visible_for": ["request", "offer"],
      "fields": [
        { "key": "age", "type": "number", "required": true },
        { "key": "mobility", "type": "select", "options": ["independent","assisted","bedridden"] },
        { "key": "risk_level", "type": "select" }
      ]
    },
    {
      "id": "medical",
      "title": "Medical Needs",
      "rules": [
        {
          "if": { "staffing.required_level": ["L3","L4"] },
          "then": { "required": true }
        }
      ]
    }
  ]
}
```

---

## Rule Engine Examples

```json
{
  "rules": [
    {
      "if": { "care_subject.mobility": "bedridden" },
      "then": {
        "staffing.required_level": "L2+",
        "care_needs.ADL.toileting": "full"
      }
    },
    {
      "if": { "medical.devices": ["ventilator"] },
      "then": {
        "staffing.required_level": "L4"
      }
    }
  ]
}
```

---

# 3) MATCHING ALGORITHM + SCORING SYSTEM

## Step 1: Hard Filters (binary rejection)

Reject if:

* care_level mismatch
* staffing insufficient
* location out of range
* price outside tolerance

---

## Step 2: Scoring Model (0–100)

```yaml
score =
  (care_match * 30) +
  (staff_match * 25) +
  (medical_match * 20) +
  (price_fit * 15) +
  (sla_score * 10)
```

---

## Component Scoring

### Care Match

* exact = 1.0
* partial = 0.7
* mismatch = 0

---

### Staffing Match

* exact = 1.0
* overqualified = 0.9
* underqualified = reject

---

### Price Fit

```yaml
if offer_price <= budget_max:
  score = 1
elif within 10%:
  score = 0.7
else:
  score = 0
```

---

### SLA Score

* <6 hr replacement → 1.0
* <24 hr → 0.7
* > 24 hr → 0.4

---

## Final Output

```json
{
  "match_score": 87,
  "status": "strong_match"
}
```

---

# 4) DATABASE DESIGN (RELATIONAL)

## Core Tables

---

## 1. care_contracts

```sql
id (PK)
type (request/offer)
title
category
city
area
start_date
duration_type
created_at
```

---

## 2. care_subject

```sql
id (PK)
contract_id (FK)
age
gender
mobility
cognitive
risk_level
```

---

## 3. medical_details

```sql
id
contract_id
diagnosis
medication_complexity
```

---

## 4. staffing

```sql
id
contract_id
caregiver_count
nurse_count
required_level
```

---

## 5. services

```sql
id
contract_id
service_type (ENUM)
```

---

## 6. pricing

```sql
id
contract_id
budget_min
budget_max
base_price
pricing_model
```

---

## 7. sla

```sql
id
contract_id
replacement_time
response_time
```

---

## 8. matches

```sql
id
request_id
offer_id
score
status
created_at
```

---

Below is a **production-grade specification** for the next three layers. This is aligned to the UCCF model you already have and is designed for **immediate backend implementation**.

---

# 1) API SPEC (~100 ENDPOINTS, ORGANIZED)

You do **not** build 100 random endpoints. You define **domains**.

## API Domains

| Domain         | Purpose               |
| -------------- | --------------------- |
| Auth           | Identity & access     |
| Users          | Profiles              |
| Care Contracts | Core UCCF objects     |
| Matching       | Discovery + scoring   |
| Bidding        | Negotiation           |
| Booking        | Contract finalization |
| Operations     | Care delivery         |
| Payments       | Financial             |
| Reviews        | Trust layer           |
| Admin          | Governance            |

---

## 1.1 AUTH (8 endpoints)

```http
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/verify-otp
POST   /auth/resend-otp
POST   /auth/forgot-password
POST   /auth/reset-password
```

---

## 1.2 USERS (10 endpoints)

```http
GET    /users/me
PUT    /users/me
GET    /users/{id}
GET    /users?role=agency
POST   /users/kyc
GET    /users/{id}/documents
POST   /users/{id}/documents
DELETE /users/{id}/documents/{docId}
GET    /users/{id}/ratings
GET    /users/{id}/history
```

---

## 1.3 CARE CONTRACTS (CORE) (14 endpoints)

```http
POST   /contracts
GET    /contracts/{id}
PUT    /contracts/{id}
DELETE /contracts/{id}

GET    /contracts?type=request
GET    /contracts?type=offer

POST   /contracts/{id}/publish
POST   /contracts/{id}/unpublish

POST   /contracts/{id}/clone

GET    /contracts/{id}/matches
POST   /contracts/{id}/validate

POST   /contracts/draft
GET    /contracts/drafts
DELETE /contracts/drafts/{id}
```

---

## 1.4 MATCHING ENGINE (10 endpoints)

```http
POST   /matching/run
GET    /matching/{contractId}
GET    /matching/{contractId}/top
POST   /matching/{contractId}/refresh

GET    /matching/{contractId}/explanations
POST   /matching/score

POST   /matching/blacklist
GET    /matching/history
POST   /matching/feedback
```

---

## 1.5 BIDDING SYSTEM (REAL-TIME) (14 endpoints)

```http
POST   /bids
GET    /bids/{id}
GET    /contracts/{id}/bids

POST   /bids/{id}/accept
POST   /bids/{id}/reject
POST   /bids/{id}/counter

POST   /bids/{id}/expire
GET    /bids/user

POST   /bids/{id}/withdraw

POST   /bids/{id}/message
GET    /bids/{id}/messages

POST   /bids/{id}/lock-price
```

---

## 1.6 BOOKINGS (10 endpoints)

```http
POST   /bookings
GET    /bookings/{id}
GET    /bookings/user

POST   /bookings/{id}/confirm
POST   /bookings/{id}/cancel

POST   /bookings/{id}/start
POST   /bookings/{id}/complete

POST   /bookings/{id}/extend
POST   /bookings/{id}/pause
```

---

## 1.7 OPERATIONS (CARE DELIVERY) (10 endpoints)

```http
POST   /operations/check-in
POST   /operations/check-out

POST   /operations/daily-report
GET    /operations/reports/{bookingId}

POST   /operations/incident
GET    /operations/incidents/{bookingId}

POST   /operations/escalate
POST   /operations/replace-staff
```

---

## 1.8 PAYMENTS (8 endpoints)

```http
POST   /payments/initiate
POST   /payments/confirm
GET    /payments/{id}

GET    /payments/history
POST   /payments/refund

POST   /payments/webhook
GET    /payments/invoice/{bookingId}
```

---

## 1.9 REVIEWS (6 endpoints)

```http
POST   /reviews
GET    /reviews/{id}
GET    /users/{id}/reviews

POST   /reviews/{id}/flag
DELETE /reviews/{id}
GET    /reviews/summary/{userId}
```

---

## 1.10 ADMIN (10 endpoints)

```http
GET    /admin/contracts
POST   /admin/contracts/approve

GET    /admin/users
POST   /admin/users/suspend

GET    /admin/reports
GET    /admin/metrics

POST   /admin/matching/tune
```

---

# 2) REAL-TIME BIDDING LAYER

## Core Model

Unlike e-commerce, this is **reverse + hybrid bidding**:

* Patient posts request
* Agencies bid
* Patient can counter
* System can auto-suggest

---

## Bid Object

```json id="bid_model"
{
  "bid_id": "uuid",
  "contract_id": "request_id",
  "agency_id": "user_id",
  "price": 45000,
  "staffing": {
    "caregiver": 1,
    "nurse": 1
  },
  "sla": {
    "replacement_hours": 6
  },
  "status": "pending | accepted | rejected | countered",
  "expires_at": "timestamp"
}
```

---

## Real-Time Flow

### Step 1: Request Posted

→ matching engine triggers
→ top 10 agencies notified

---

### Step 2: Agencies Bid

* push notification
* bid expires in 12–24 hrs

---

### Step 3: Patient Actions

* accept
* reject
* counter

---

### Step 4: Lock

Once accepted:

```yaml id="lock"
status = "locked"
price = immutable
contract = generated
```

---

## Real-Time Tech Stack

* WebSocket (live bids)
* Redis (bid queue + expiry)
* Event bus (Kafka / NATS)

---

## Anti-chaos Rules

* Max 5 active bids per agency per request
* Auto-expire after 24h
* No price change after lock
* Mandatory SLA declaration

---

# 3) CARE LIFECYCLE WORKFLOW

This is where most systems fail.

---

## FULL STATE MACHINE

```yaml id="state_machine"
DRAFT
 → PUBLISHED
 → MATCHED
 → BIDDING
 → LOCKED
 → BOOKED
 → ACTIVE
 → COMPLETED
 → RATED
```

---

## STATE TRANSITIONS

### 1. Draft → Published

* validation passed

---

### 2. Published → Matched

* matching engine runs

---

### 3. Matched → Bidding

* agencies start bidding

---

### 4. Bidding → Locked

* bid accepted

---

### 5. Locked → Booked

* payment initiated

---

### 6. Booked → Active

* caregiver check-in

---

### 7. Active → Completed

* service duration ends

---

### 8. Completed → Rated

* both parties review

---

## FAILURE STATES (CRITICAL)

```yaml id="failure"
CANCELLED
NO_SHOW
REPLACEMENT_REQUIRED
ESCALATED
REFUNDED
```

---

## OPERATIONAL EVENTS

### During ACTIVE:

* check-in/out (GPS optional)
* daily logs
* incident reports
* emergency escalation
* replacement request

---

## Example Timeline

```text
Day 0: Request posted
Day 1: 5 bids received
Day 2: Bid accepted
Day 3: Booking confirmed
Day 4: Care starts
Day 30: Completed
Day 31: Rating
```

---

# 4) SYSTEM BEHAVIOR (WHAT YOU NOW CONTROL)

You now control:

### Supply

* agencies structured

### Demand

* patients structured

### Market

* bidding layer

### Quality

* SLA + reviews

---

# Bottom line

You’ve now defined:

* Data layer (schema)
* Input layer (forms)
* Intelligence (matching)
* Transaction layer (bidding)
* Execution layer (operations)

That’s a **complete vertical platform architecture**.

---

You’re now at the layer that determines whether this platform **survives real-world usage in Bangladesh**. These three systems are not optional—they are structural.

I’ll define them in **implementation-grade detail**.

---

# 1) FRAUD + TRUST SYSTEM

*(Designed for low-trust, cash-heavy, identity-fragile environments)*

## 1.1 Threat Model (Bangladesh-specific realities)

| Vector                   | Failure Mode                     |
| ------------------------ | -------------------------------- |
| Fake agencies            | No real office, ghost operations |
| Caregiver identity fraud | NID mismatch, impersonation      |
| Attendance fraud         | Check-in without presence        |
| Payment leakage          | Offline deals bypass platform    |
| Collusion                | Fake reviews, staged bookings    |
| Emergency abandonment    | Caregiver disappears mid-shift   |

---

## 1.2 TRUST SCORE ENGINE (Core Mechanism)

Every actor gets a **dynamic trust score (0–100)**.

### Score Inputs

```json
{
  "kyc_verified": 20,
  "nid_match": 15,
  "face_match": 15,
  "background_check": 10,
  "attendance_reliability": 10,
  "completion_rate": 10,
  "review_score": 10,
  "incident_penalty": -20,
  "no_show_penalty": -30
}
```

---

## 1.3 KYC + IDENTITY STACK

### Required Layers

1. **NID Verification** (Bangladesh)
2. Selfie → Face match against ID
3. Phone OTP binding
4. Bank / bKash / Nagad account binding

---

## 1.4 ATTENDANCE FRAUD PREVENTION

### Multi-layer validation

* GPS check-in (radius ≤ 50m)
* Time window enforcement
* Random selfie during shift
* Optional:

  * QR code at patient home
  * BLE beacon (high-trust households)

---

## 1.5 PAYMENT LOCK-IN (ANTI-BYPASS)

Problem:
User + agency agree offline → platform loses revenue.

### Countermeasures:

* Show **masked phone numbers**
* In-app chat only (loggable)
* Penalize off-platform deal detection

### Detection signals:

* sudden chat silence + cancellation
* repeated same pair interactions
* abnormal pricing drop

---

## 1.6 INCIDENT & ESCALATION SYSTEM

```json
{
  "incident_types": [
    "no_show",
    "late_arrival",
    "misconduct",
    "medical_error",
    "abandonment"
  ],
  "severity": "low | medium | high | critical"
}
```

### Auto-actions:

| Severity | Action                        |
| -------- | ----------------------------- |
| Low      | Warning                       |
| Medium   | Score deduction               |
| High     | Temporary suspension          |
| Critical | Immediate block + admin alert |

---

## 1.7 TRUST FLAGS (VISIBLE TO USERS)

Expose selectively:

* Verified ✔
* Background checked ✔
* High reliability ✔
* “Frequent cancellations” ⚠

Transparency builds marketplace discipline.

---

# 2) CAREGIVER WORKFORCE MANAGEMENT

This is where agencies fail operationally. You can outperform them.

---

## 2.1 CORE MODULES

| Module      | Function            |
| ----------- | ------------------- |
| Roster      | Shift assignment    |
| Attendance  | Check-in/out        |
| Replacement | Backup staff        |
| Payroll     | Salary computation  |
| Compliance  | Working hours, rest |

---

## 2.2 ROSTER SYSTEM

### Data Model

```json
{
  "shift_id": "uuid",
  "caregiver_id": "uuid",
  "booking_id": "uuid",
  "start_time": "timestamp",
  "end_time": "timestamp",
  "location": {
    "lat": 23.8,
    "lng": 90.4
  }
}
```

---

## 2.3 SMART ASSIGNMENT LOGIC

When assigning caregiver:

* skill match
* proximity
* availability
* trust score
* fatigue (no >12h continuous work)

---

## 2.4 ATTENDANCE ENGINE

### Events

```yaml
CHECK_IN
BREAK_START
BREAK_END
CHECK_OUT
NO_SHOW
```

---

## 2.5 AUTO-REPLACEMENT ENGINE (CRITICAL)

Trigger if:

* no check-in within 30 min
* emergency flag
* manual request

### Flow:

```text
Detect issue → find nearest available caregiver → notify → auto-assign → notify patient
```

---

## 2.6 PAYROLL SYSTEM

### Inputs

* hours worked
* overtime
* night shifts
* bonuses
* penalties

---

### Payroll Formula

```text
salary = base_rate * hours
        + overtime
        + incentives
        - penalties
```

---

### Output

```json
{
  "caregiver_id": "uuid",
  "total_hours": 220,
  "overtime": 20,
  "penalty": 500,
  "net_pay": 18500
}
```

---

## 2.7 COMPLIANCE CONTROLS

* Max shift length (12h)
* Mandatory rest (8h gap)
* Weekly hour cap

---

# 3) MOBILE APP UX FLOWS

You need **two apps**, not one:

1. Operator App (Agency/Admin)
2. Caregiver App

---

# 3.1 CAREGIVER APP (FIELD APP)

## Core Screens (Minimal but critical)

### 1. Login + KYC

* OTP login
* Face verification

---

### 2. Today’s Shifts

```text
Patient Name
Location
Start Time
Instructions
```

---

### 3. Check-in Screen

* GPS auto-detect
* selfie capture
* “Start Shift”

---

### 4. Active Shift Dashboard

* timer
* tasks checklist
* emergency button

---

### 5. Daily Report

* vitals (optional)
* notes
* photo upload

---

### 6. Check-out

* confirm completion
* optional patient signature

---

### 7. Earnings View

* daily earnings
* pending payouts

---

## UX Constraints

* Works on low-end Android
* Offline-first (sync later)
* Minimal typing (voice optional later)

---

# 3.2 OPERATOR APP (AGENCY SIDE)

## Core Screens

### 1. Dashboard

* active bookings
* no-show alerts
* incidents

---

### 2. Matching + Bidding

* incoming requests
* submit bid

---

### 3. Roster Management

* assign caregiver
* swap shifts

---

### 4. Live Operations

* map view (active caregivers)
* alerts

---

### 5. Incident Control

* escalation actions
* replacement trigger

---

### 6. Payroll Panel

* approve payouts
* export reports

---

# 3.3 PATIENT APP (OPTIONAL BUT STRATEGIC)

You didn’t ask, but skipping this is a mistake.

Core:

* post request
* compare bids
* track caregiver live
* raise issue
* rate

---

# 4) SYSTEM INTEGRATION (HOW IT ALL CONNECTS)

```text
Trust System → filters caregivers
Matching → selects agencies
Bidding → determines price
Roster → assigns caregiver
Attendance → verifies delivery
Payroll → closes loop
Reviews → feeds trust system
```

---

# HARD TRUTH

If you skip:

* trust → platform gets abused
* workforce → service collapses
* UX → nobody uses it

---

