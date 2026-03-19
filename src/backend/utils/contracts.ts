/**
 * CareNet Contract & Negotiation System
 * ──────────────────────────────────────
 * eBay-style offer/acceptance flow:
 * 1. A service listing has a listed price (in CarePoints)
 * 2. Either party can make an offer (counter-offer)
 * 3. The other party can Accept, Reject, or Counter
 * 4. Once accepted, a Contract is created
 *
 * Two contract types:
 *   - Guardian <-> Agency  (for patient care placement)
 *   - Agency <-> Caregiver (for caregiver assignment)
 */

export type ContractType = "guardian_agency" | "agency_caregiver";
export type ContractStatus = "draft" | "offered" | "negotiating" | "accepted" | "active" | "completed" | "cancelled" | "disputed";
export type OfferStatus = "pending" | "accepted" | "rejected" | "countered" | "expired" | "withdrawn";

export interface NegotiationOffer {
  id: string;
  contractId: string;
  offeredBy: string;        // userId
  offeredByName: string;
  offeredByRole: "guardian" | "agency" | "caregiver";
  pointsPerDay: number;     // Daily rate in CarePoints
  totalPoints: number;      // Total contract value
  durationDays: number;
  message: string;
  status: OfferStatus;
  createdAt: string;
  respondedAt?: string;
  responseMessage?: string;
}

export interface CareContract {
  id: string;
  type: ContractType;
  status: ContractStatus;

  // Parties
  partyA: {
    id: string;
    name: string;
    role: "guardian" | "agency";
    avatar?: string;
  };
  partyB: {
    id: string;
    name: string;
    role: "agency" | "caregiver";
    avatar?: string;
  };

  // Service details
  patientName?: string;
  serviceType: string;
  description: string;

  // Financial terms (in CarePoints)
  listedPrice: number;
  agreedPrice: number;
  durationDays: number;
  totalValue: number;

  // Platform fees
  partyAFeePercent: number;
  partyBFeePercent: number;
  partyAFee: number;
  partyBFee: number;
  platformRevenue: number;

  // Dates
  startDate: string;
  endDate: string;
  createdAt: string;
  acceptedAt?: string;

  // Negotiation history
  offers: NegotiationOffer[];
  currentOffer?: NegotiationOffer;
}

/* ─── Mock Data ─── */

export const MOCK_OFFERS: NegotiationOffer[] = [
  {
    id: "OFF-001",
    contractId: "CTR-2026-0001",
    offeredBy: "guardian-1",
    offeredByName: "Rashed Hossain",
    offeredByRole: "guardian",
    pointsPerDay: 8000,
    totalPoints: 224000,
    durationDays: 28,
    message: "I'd like to negotiate a lower daily rate for a full month engagement. My father needs consistent care and I can commit to 28 days.",
    status: "countered",
    createdAt: "2026-03-01T10:30:00Z",
    respondedAt: "2026-03-01T14:15:00Z",
    responseMessage: "Thank you for the offer. Our standard rate for elderly care is 10,000 CP/day. We can offer 9,200 CP/day for a 28-day commitment.",
  },
  {
    id: "OFF-002",
    contractId: "CTR-2026-0001",
    offeredBy: "agency-1",
    offeredByName: "HealthCare Pro BD",
    offeredByRole: "agency",
    pointsPerDay: 9200,
    totalPoints: 257600,
    durationDays: 28,
    message: "We can offer 9,200 CP/day for a 28-day commitment with our senior caregiver Karim Uddin. This includes daily vitals monitoring.",
    status: "countered",
    createdAt: "2026-03-01T14:15:00Z",
    respondedAt: "2026-03-02T09:00:00Z",
    responseMessage: "Can we meet in the middle at 8,500 CP/day?",
  },
  {
    id: "OFF-003",
    contractId: "CTR-2026-0001",
    offeredBy: "guardian-1",
    offeredByName: "Rashed Hossain",
    offeredByRole: "guardian",
    pointsPerDay: 8500,
    totalPoints: 238000,
    durationDays: 28,
    message: "Can we meet in the middle at 8,500 CP/day? I'll also leave a review after the service.",
    status: "accepted",
    createdAt: "2026-03-02T09:00:00Z",
    respondedAt: "2026-03-02T11:30:00Z",
    responseMessage: "Accepted! We'll assign Karim Uddin starting March 5th.",
  },
];

export const MOCK_CONTRACTS: CareContract[] = [
  {
    id: "CTR-2026-0001",
    type: "guardian_agency",
    status: "active",
    partyA: { id: "guardian-1", name: "Rashed Hossain", role: "guardian" },
    partyB: { id: "agency-1", name: "HealthCare Pro BD", role: "agency" },
    patientName: "Abdul Rahman",
    serviceType: "Elderly Care",
    description: "24/7 elderly care for Abdul Rahman, including daily vitals monitoring, medication management, and mobility assistance.",
    listedPrice: 10000,
    agreedPrice: 8500,
    durationDays: 28,
    totalValue: 238000,
    partyAFeePercent: 2.5,
    partyBFeePercent: 2.5,
    partyAFee: 5950,
    partyBFee: 5950,
    platformRevenue: 11900,
    startDate: "2026-03-05",
    endDate: "2026-04-01",
    createdAt: "2026-03-02T11:30:00Z",
    acceptedAt: "2026-03-02T11:30:00Z",
    offers: MOCK_OFFERS,
  },
  {
    id: "CTR-2026-0002",
    type: "guardian_agency",
    status: "negotiating",
    partyA: { id: "guardian-2", name: "Tahmid Khan", role: "guardian" },
    partyB: { id: "agency-2", name: "CareFirst Bangladesh", role: "agency" },
    patientName: "Rahela Begum",
    serviceType: "Post-Surgery Recovery",
    description: "Post-surgery home care for Rahela Begum after hip replacement. Includes wound care, physiotherapy exercises, and medication.",
    listedPrice: 12000,
    agreedPrice: 0,
    durationDays: 14,
    totalValue: 0,
    partyAFeePercent: 2.5,
    partyBFeePercent: 2.5,
    partyAFee: 0,
    partyBFee: 0,
    platformRevenue: 0,
    startDate: "2026-03-20",
    endDate: "2026-04-02",
    createdAt: "2026-03-14T08:00:00Z",
    offers: [
      {
        id: "OFF-010",
        contractId: "CTR-2026-0002",
        offeredBy: "guardian-2",
        offeredByName: "Tahmid Khan",
        offeredByRole: "guardian",
        pointsPerDay: 9000,
        totalPoints: 126000,
        durationDays: 14,
        message: "Looking for post-surgery care for my mother. Offering 9,000 CP/day for 2 weeks.",
        status: "pending",
        createdAt: "2026-03-14T08:00:00Z",
      },
    ],
  },
  {
    id: "CTR-2026-0003",
    type: "agency_caregiver",
    status: "active",
    partyA: { id: "agency-1", name: "HealthCare Pro BD", role: "agency" },
    partyB: { id: "caregiver-1", name: "Karim Uddin", role: "caregiver" },
    patientName: "Abdul Rahman",
    serviceType: "Elderly Care Assignment",
    description: "Assignment for Abdul Rahman care placement. Includes daily vitals, medication management.",
    listedPrice: 5000,
    agreedPrice: 4800,
    durationDays: 28,
    totalValue: 134400,
    partyAFeePercent: 2.5,
    partyBFeePercent: 2.5,
    partyAFee: 3360,
    partyBFee: 3360,
    platformRevenue: 6720,
    startDate: "2026-03-05",
    endDate: "2026-04-01",
    createdAt: "2026-03-03T09:00:00Z",
    acceptedAt: "2026-03-03T10:00:00Z",
    offers: [
      {
        id: "OFF-020",
        contractId: "CTR-2026-0003",
        offeredBy: "agency-1",
        offeredByName: "HealthCare Pro BD",
        offeredByRole: "agency",
        pointsPerDay: 4500,
        totalPoints: 126000,
        durationDays: 28,
        message: "We have a 28-day elderly care assignment. Offering 4,500 CP/day.",
        status: "countered",
        createdAt: "2026-03-03T09:00:00Z",
        respondedAt: "2026-03-03T09:30:00Z",
        responseMessage: "I'd prefer 4,800 CP/day given the 24/7 nature of this assignment.",
      },
      {
        id: "OFF-021",
        contractId: "CTR-2026-0003",
        offeredBy: "caregiver-1",
        offeredByName: "Karim Uddin",
        offeredByRole: "caregiver",
        pointsPerDay: 4800,
        totalPoints: 134400,
        durationDays: 28,
        message: "I'd prefer 4,800 CP/day given the 24/7 nature of this assignment. I have 5 years of elderly care experience.",
        status: "accepted",
        createdAt: "2026-03-03T09:30:00Z",
        respondedAt: "2026-03-03T10:00:00Z",
        responseMessage: "Agreed. Starting March 5th.",
      },
    ],
  },
  {
    id: "CTR-2026-0004",
    type: "agency_caregiver",
    status: "offered",
    partyA: { id: "agency-2", name: "CareFirst Bangladesh", role: "agency" },
    partyB: { id: "caregiver-2", name: "Fatema Akter", role: "caregiver" },
    serviceType: "Pediatric Night Care",
    description: "Night-shift pediatric care, 8PM-8AM for special needs child.",
    listedPrice: 6000,
    agreedPrice: 0,
    durationDays: 30,
    totalValue: 0,
    partyAFeePercent: 2.5,
    partyBFeePercent: 2.5,
    partyAFee: 0,
    partyBFee: 0,
    platformRevenue: 0,
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    createdAt: "2026-03-15T14:00:00Z",
    offers: [
      {
        id: "OFF-030",
        contractId: "CTR-2026-0004",
        offeredBy: "agency-2",
        offeredByName: "CareFirst Bangladesh",
        offeredByRole: "agency",
        pointsPerDay: 5500,
        totalPoints: 165000,
        durationDays: 30,
        message: "Night-shift pediatric care needed. Offering 5,500 CP/day for 30 days.",
        status: "pending",
        createdAt: "2026-03-15T14:00:00Z",
      },
    ],
  },
  {
    id: "CTR-2026-0005",
    type: "guardian_agency",
    status: "completed",
    partyA: { id: "guardian-1", name: "Rashed Hossain", role: "guardian" },
    partyB: { id: "agency-1", name: "HealthCare Pro BD", role: "agency" },
    patientName: "Abdul Rahman",
    serviceType: "Physiotherapy",
    description: "10-session physiotherapy package for post-stroke recovery.",
    listedPrice: 3000,
    agreedPrice: 2800,
    durationDays: 10,
    totalValue: 28000,
    partyAFeePercent: 2.5,
    partyBFeePercent: 2.5,
    partyAFee: 700,
    partyBFee: 700,
    platformRevenue: 1400,
    startDate: "2026-02-01",
    endDate: "2026-02-10",
    createdAt: "2026-01-28T10:00:00Z",
    acceptedAt: "2026-01-28T12:00:00Z",
    offers: [],
  },
];

/* ─── Mock Wallet Data ─── */
export const MOCK_WALLETS = [
  {
    userId: "guardian-1", userRole: "guardian", userName: "Rashed Hossain",
    balance: 84000, pendingDue: 5950, totalEarned: 0, totalSpent: 350000, totalWithdrawn: 0,
    status: "active" as const, feePercent: 2.5, commissionPercent: 0, registrationBonus: 5000, frozenAmount: 0,
  },
  {
    userId: "guardian-2", userRole: "guardian", userName: "Tahmid Khan",
    balance: 156000, pendingDue: 0, totalEarned: 0, totalSpent: 180000, totalWithdrawn: 0,
    status: "active" as const, feePercent: 2.5, commissionPercent: 0, registrationBonus: 5000, frozenAmount: 0,
  },
  {
    userId: "agency-1", userRole: "agency", userName: "HealthCare Pro BD",
    balance: 312000, pendingDue: 9310, totalEarned: 580000, totalSpent: 256000, totalWithdrawn: 120000,
    status: "active" as const, feePercent: 2.5, commissionPercent: 25, registrationBonus: 10000, frozenAmount: 0,
  },
  {
    userId: "agency-2", userRole: "agency", userName: "CareFirst Bangladesh",
    balance: 189000, pendingDue: 4200, totalEarned: 420000, totalSpent: 198000, totalWithdrawn: 80000,
    status: "active" as const, feePercent: 2.5, commissionPercent: 25, registrationBonus: 10000, frozenAmount: 0,
  },
  {
    userId: "caregiver-1", userRole: "caregiver", userName: "Karim Uddin",
    balance: 67200, pendingDue: 3360, totalEarned: 134400, totalSpent: 0, totalWithdrawn: 45000,
    status: "active" as const, feePercent: 2.5, commissionPercent: 25, registrationBonus: 2000, frozenAmount: 0,
  },
  {
    userId: "caregiver-2", userRole: "caregiver", userName: "Fatema Akter",
    balance: 52000, pendingDue: 0, totalEarned: 96000, totalSpent: 0, totalWithdrawn: 30000,
    status: "active" as const, feePercent: 2.5, commissionPercent: 25, registrationBonus: 2000, frozenAmount: 0,
  },
  {
    userId: "caregiver-3", userRole: "caregiver", userName: "Nasrin Begum",
    balance: 32000, pendingDue: 1800, totalEarned: 72000, totalSpent: 0, totalWithdrawn: 25000,
    status: "frozen" as const, feePercent: 2.5, commissionPercent: 25, registrationBonus: 2000, frozenAmount: 8000,
  },
  {
    userId: "shop-1", userRole: "shop", userName: "MedShop BD",
    balance: 128000, pendingDue: 6400, totalEarned: 256000, totalSpent: 0, totalWithdrawn: 100000,
    status: "active" as const, feePercent: 2.5, commissionPercent: 25, registrationBonus: 5000, frozenAmount: 0,
  },
];

/* ─── Mock Point Transactions ─── */
export const MOCK_POINT_TRANSACTIONS = [
  { id: "PT-001", walletId: "guardian-1", type: "purchase" as const, amount: 100000, balanceAfter: 184000, description: "Purchased 100,000 CP (\u09F3 10,000)", createdAt: "2026-03-01T10:00:00Z", status: "completed" as const },
  { id: "PT-002", walletId: "guardian-1", type: "contract_payment" as const, amount: -238000, balanceAfter: 84000, description: "Contract CTR-2026-0001 \u2014 Elderly Care (28 days)", counterparty: "HealthCare Pro BD", contractId: "CTR-2026-0001", feeAmount: 5950, createdAt: "2026-03-05T00:00:00Z", status: "completed" as const },
  { id: "PT-003", walletId: "guardian-1", type: "platform_fee" as const, amount: -5950, balanceAfter: 78050, description: "Platform fee 2.5% on CTR-2026-0001", contractId: "CTR-2026-0001", createdAt: "2026-03-05T00:01:00Z", status: "pending" as const },
  { id: "PT-004", walletId: "guardian-1", type: "bonus" as const, amount: 5000, balanceAfter: 189000, description: "Registration welcome bonus", createdAt: "2026-01-15T10:00:00Z", status: "completed" as const },
  { id: "PT-010", walletId: "agency-1", type: "earning" as const, amount: 238000, balanceAfter: 450000, description: "Contract CTR-2026-0001 \u2014 Elderly Care (28 days)", counterparty: "Rashed Hossain", contractId: "CTR-2026-0001", createdAt: "2026-03-05T00:00:00Z", status: "completed" as const },
  { id: "PT-011", walletId: "agency-1", type: "platform_fee" as const, amount: -5950, balanceAfter: 444050, description: "Platform fee 2.5% on CTR-2026-0001", contractId: "CTR-2026-0001", createdAt: "2026-03-05T00:01:00Z", status: "pending" as const },
  { id: "PT-012", walletId: "agency-1", type: "contract_payment" as const, amount: -134400, balanceAfter: 309650, description: "Caregiver payment \u2014 Karim Uddin (CTR-2026-0003)", counterparty: "Karim Uddin", contractId: "CTR-2026-0003", createdAt: "2026-03-05T00:02:00Z", status: "completed" as const },
  { id: "PT-013", walletId: "agency-1", type: "admin_credit" as const, amount: 10000, balanceAfter: 200000, description: "Registration welcome bonus (Admin)", createdAt: "2026-01-10T10:00:00Z", status: "completed" as const },
  { id: "PT-020", walletId: "caregiver-1", type: "earning" as const, amount: 134400, balanceAfter: 134400, description: "Assignment CTR-2026-0003 \u2014 Elderly Care (28 days)", counterparty: "HealthCare Pro BD", contractId: "CTR-2026-0003", createdAt: "2026-03-05T00:02:00Z", status: "completed" as const },
  { id: "PT-021", walletId: "caregiver-1", type: "platform_fee" as const, amount: -3360, balanceAfter: 131040, description: "Platform fee 2.5% on CTR-2026-0003", contractId: "CTR-2026-0003", createdAt: "2026-03-05T00:03:00Z", status: "pending" as const },
  { id: "PT-022", walletId: "caregiver-1", type: "withdrawal" as const, amount: -45000, balanceAfter: 67200, description: "Withdrawal to bKash (01712-XXXXXX)", createdAt: "2026-03-12T14:00:00Z", status: "completed" as const },
  { id: "PT-023", walletId: "caregiver-1", type: "admin_credit" as const, amount: 2000, balanceAfter: 2000, description: "Registration welcome bonus (Admin)", createdAt: "2026-02-01T10:00:00Z", status: "completed" as const },
];
