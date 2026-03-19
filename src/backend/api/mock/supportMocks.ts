import type {
  HelpCenterData, ContactInfo, RefundTransaction, RefundTimelineStep,
} from "@/backend/models";

export const MOCK_HELP_CENTER: HelpCenterData = {
  categories: [
    { id: "getting-started", label: "Getting Started", articles: 12, icon: "BookOpen" },
    { id: "payments", label: "Payments & Billing", articles: 8, icon: "CreditCard" },
    { id: "caregivers", label: "Finding Caregivers", articles: 15, icon: "User" },
    { id: "safety", label: "Safety & Trust", articles: 10, icon: "ShieldCheck" },
    { id: "account", label: "Account & Settings", articles: 6, icon: "Settings" },
    { id: "agencies", label: "Agency Partners", articles: 9, icon: "Building2" },
  ],
  popularArticles: [
    { id: "a1", title: "How to book your first caregiver", views: 4250, category: "Getting Started" },
    { id: "a2", title: "Understanding CareNet Points", views: 3800, category: "Payments" },
    { id: "a3", title: "Verifying your identity (NID)", views: 3100, category: "Safety" },
    { id: "a4", title: "How to leave a review", views: 2400, category: "Getting Started" },
    { id: "a5", title: "Requesting a refund", views: 2100, category: "Payments" },
  ],
};

export const MOCK_CONTACT_INFO: ContactInfo = {
  phone: "+880 9678-CARENET",
  email: "support@carenet.com.bd",
  hours: "Sat-Thu 8:00 AM \u2013 10:00 PM",
  address: "House 42, Road 11, Dhanmondi, Dhaka 1209",
  social: { facebook: "CareNetBD", instagram: "carenet_bd" },
};

export const MOCK_REFUND_TRANSACTIONS: RefundTransaction[] = [
  { id: "TXN-001", type: "service" as const, desc: "HealthCare Pro BD \u2014 Night Shift (Mar 12)", amount: 1440, date: "March 12, 2026", paymentMethod: "bKash", paymentAccount: "0171X-XXXXXX", methodColor: "#D12053" },
  { id: "TXN-002", type: "product" as const, desc: "Medical Supplies Bundle \u2014 MediMart", amount: 3200, date: "March 10, 2026", paymentMethod: "Nagad", paymentAccount: "0181X-XXXXXX", methodColor: "#ED6E1B" },
];

export const MOCK_TICKET_CATEGORIES: string[] = [
  "Payment Issue", "Booking Problem", "Caregiver Complaint",
  "Agency Dispute", "Account Access", "Technical Bug", "Other",
];

export const MOCK_REFUND_TIMELINE: RefundTimelineStep[] = [
  { step: "Request Submitted", time: "Just now", status: "done" as const, desc: "Your refund request has been received" },
  { step: "Under Review", time: "~1-2 hours", status: "active" as const, desc: "Our dispute resolution team is reviewing" },
  { step: "Decision Made", time: "~24-48 hours", status: "pending" as const, desc: "You'll be notified of the outcome" },
  { step: "Refund Processed", time: "~3-5 business days", status: "pending" as const, desc: "Amount credited to original payment method" },
];
