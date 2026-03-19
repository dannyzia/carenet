import type {
  BillingInvoice, BillingOverviewData, BillingStats, PaymentProof,
} from "@/backend/models";

// ─── Payment Proofs ───
export const MOCK_PAYMENT_PROOFS: PaymentProof[] = [
  {
    id: "PP-001", invoiceId: "INV-2026-0042",
    submittedBy: { id: "g1", name: "Rashed Hossain", role: "Guardian" },
    receivedBy: { id: "a1", name: "HealthCare Pro BD", role: "Agency" },
    amount: 21919, method: "bkash", referenceNumber: "TXN8A4F2K9X01",
    screenshotUrl: null, notes: "Paid via bKash personal account ending in 7890",
    status: "pending", submittedAt: "Mar 15, 2026 2:30 PM",
    verifiedAt: null, verifiedByName: null, rejectionReason: null,
  },
  {
    id: "PP-002", invoiceId: "INV-2026-0038",
    submittedBy: { id: "g1", name: "Rashed Hossain", role: "Guardian" },
    receivedBy: { id: "a1", name: "HealthCare Pro BD", role: "Agency" },
    amount: 15400, method: "nagad", referenceNumber: "NGD7B2E1M5P03",
    screenshotUrl: null, notes: "Nagad transfer from 0181X account",
    status: "verified", submittedAt: "Mar 10, 2026 11:00 AM",
    verifiedAt: "Mar 10, 2026 4:15 PM", verifiedByName: "Admin Karim", rejectionReason: null,
  },
  {
    id: "PP-003", invoiceId: "INV-2026-0035",
    submittedBy: { id: "g2", name: "Fatima Rahman", role: "Guardian" },
    receivedBy: { id: "a2", name: "MedPro Healthcare", role: "Agency" },
    amount: 8500, method: "bank_transfer", referenceNumber: "NPSB-2026031212345",
    screenshotUrl: null, notes: "Bank transfer from DBBL account",
    status: "rejected", submittedAt: "Mar 8, 2026 9:00 AM",
    verifiedAt: "Mar 9, 2026 10:00 AM", verifiedByName: "Agency Admin",
    rejectionReason: "Reference number does not match our records. Please resubmit with correct reference.",
  },
  {
    id: "PP-004", invoiceId: "INV-2026-0045",
    submittedBy: { id: "a1", name: "HealthCare Pro BD", role: "Agency" },
    receivedBy: { id: "cg1", name: "Dr. Rahat Khan", role: "Caregiver" },
    amount: 12000, method: "bkash", referenceNumber: "TXN9C5G3H7Y02",
    screenshotUrl: null, notes: "Monthly payout for March shifts",
    status: "pending", submittedAt: "Mar 16, 2026 10:00 AM",
    verifiedAt: null, verifiedByName: null, rejectionReason: null,
  },
  {
    id: "PP-005", invoiceId: "INV-2026-0040",
    submittedBy: { id: "g1", name: "Rashed Hossain", role: "Guardian" },
    receivedBy: { id: "a1", name: "HealthCare Pro BD", role: "Agency" },
    amount: 18200, method: "rocket", referenceNumber: "RKT4D6F8J2K04",
    screenshotUrl: null, notes: "",
    status: "verified", submittedAt: "Mar 12, 2026 3:45 PM",
    verifiedAt: "Mar 12, 2026 6:00 PM", verifiedByName: "Admin Karim", rejectionReason: null,
  },
];

// ─── Billing Invoices ───
export const MOCK_BILLING_INVOICES: BillingInvoice[] = [
  {
    id: "INV-2026-0042", type: "service",
    fromParty: { id: "a1", name: "HealthCare Pro BD", role: "Agency" },
    toParty: { id: "g1", name: "Rashed Hossain", role: "Guardian" },
    description: "Home Care — Elderly (March 1-15)", amount: 19200, platformFee: 1060, total: 21919,
    status: "proof_submitted", issuedDate: "Mar 16, 2026", dueDate: "Mar 31, 2026",
    placementId: "PL-2026-0018",
    lineItems: [
      { desc: "Day Shift Care (10 shifts)", qty: "10 shifts", rate: 1200, total: 12000 },
      { desc: "Night Shift Care (5 shifts)", qty: "5 shifts", rate: 1440, total: 7200 },
    ],
    paymentProofs: [MOCK_PAYMENT_PROOFS[0]],
  },
  {
    id: "INV-2026-0045", type: "service",
    fromParty: { id: "a1", name: "HealthCare Pro BD", role: "Agency" },
    toParty: { id: "cg1", name: "Dr. Rahat Khan", role: "Caregiver" },
    description: "Caregiver Payout — March shifts", amount: 12000, platformFee: 0, total: 12000,
    status: "proof_submitted", issuedDate: "Mar 16, 2026", dueDate: "Mar 20, 2026",
    lineItems: [
      { desc: "Day Shift Care (8 shifts × ৳1,500)", qty: "8 shifts", rate: 1500, total: 12000 },
    ],
    paymentProofs: [MOCK_PAYMENT_PROOFS[3]],
  },
  {
    id: "INV-2026-0038", type: "service",
    fromParty: { id: "a1", name: "HealthCare Pro BD", role: "Agency" },
    toParty: { id: "g1", name: "Rashed Hossain", role: "Guardian" },
    description: "Home Care — Elderly (Feb 16-28)", amount: 14000, platformFee: 700, total: 15400,
    status: "verified", issuedDate: "Mar 1, 2026", dueDate: "Mar 15, 2026",
    lineItems: [
      { desc: "Day Shift Care (8 shifts)", qty: "8 shifts", rate: 1200, total: 9600 },
      { desc: "Night Shift Care (3 shifts)", qty: "3 shifts", rate: 1440, total: 4320 },
      { desc: "Supply Fee", qty: "1", rate: 80, total: 80 },
    ],
    paymentProofs: [MOCK_PAYMENT_PROOFS[1]],
  },
  {
    id: "INV-2026-0035", type: "service",
    fromParty: { id: "a2", name: "MedPro Healthcare", role: "Agency" },
    toParty: { id: "g2", name: "Fatima Rahman", role: "Guardian" },
    description: "Post-Surgery Recovery Care — Feb", amount: 8000, platformFee: 400, total: 8500,
    status: "disputed", issuedDate: "Feb 28, 2026", dueDate: "Mar 14, 2026",
    lineItems: [
      { desc: "Post-Op Recovery Care (5 days)", qty: "5 days", rate: 1600, total: 8000 },
    ],
    paymentProofs: [MOCK_PAYMENT_PROOFS[2]],
  },
  {
    id: "INV-2026-0050", type: "service",
    fromParty: { id: "a1", name: "HealthCare Pro BD", role: "Agency" },
    toParty: { id: "g1", name: "Rashed Hossain", role: "Guardian" },
    description: "Home Care — Elderly (March 16-31)", amount: 24000, platformFee: 1200, total: 26400,
    status: "unpaid", issuedDate: "Mar 17, 2026", dueDate: "Apr 1, 2026",
    lineItems: [
      { desc: "Day Shift Care (12 shifts)", qty: "12 shifts", rate: 1200, total: 14400 },
      { desc: "Night Shift Care (6 shifts)", qty: "6 shifts", rate: 1440, total: 8640 },
      { desc: "Medical Supplies", qty: "1 set", rate: 960, total: 960 },
    ],
    paymentProofs: [],
  },
  {
    id: "INV-2026-0040", type: "service",
    fromParty: { id: "a1", name: "HealthCare Pro BD", role: "Agency" },
    toParty: { id: "g1", name: "Rashed Hossain", role: "Guardian" },
    description: "Home Care — Elderly (Feb 1-15)", amount: 16800, platformFee: 840, total: 18200,
    status: "verified", issuedDate: "Feb 16, 2026", dueDate: "Mar 2, 2026",
    lineItems: [
      { desc: "Day Shift Care (8 shifts)", qty: "8 shifts", rate: 1200, total: 9600 },
      { desc: "Night Shift Care (5 shifts)", qty: "5 shifts", rate: 1440, total: 7200 },
    ],
    paymentProofs: [MOCK_PAYMENT_PROOFS[4]],
  },
];

// ─── Stats ───
export const MOCK_BILLING_STATS: BillingStats = {
  totalOutstanding: 48319,
  totalPaid: 55519,
  pendingVerification: 2,
  overdueCount: 1,
};

// ─── Overview ───
export const MOCK_BILLING_OVERVIEW: BillingOverviewData = {
  stats: MOCK_BILLING_STATS,
  invoices: MOCK_BILLING_INVOICES,
  recentProofs: MOCK_PAYMENT_PROOFS,
};
