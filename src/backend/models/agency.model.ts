/**
 * Agency Domain Models
 * Types for agency-facing features: placements, payroll, clients, monitoring
 */

// ─── Profile ───
/** Agency profile visible in directory/search */
export interface Agency {
  id: string;
  name: string;
  tagline?: string;
  rating: number;
  reviews: number;
  location: string;
  serviceAreas: string[];
  specialties: string[];
  caregiverCount: number;
  verified: boolean;
  responseTime?: string;
  image?: string;
}

// ─── Placements ───
export interface AgencyPlacement {
  id: string; patient: string; guardian: string; careType: string;
  caregiver: string; startDate: string; status: string;
}

export interface PlacementShift {
  day: string; caregiver: string; time: string; status: string;
}

// ─── Directory ───
export interface DirectoryAgency {
  id: string; name: string; tagline: string; rating: number; reviews: number;
  location: string; areas: string[]; specialties: string[]; caregivers: number;
  years: number; verified: boolean; logo: string;
}

// ─── Payroll ───
export type PayoutStatus = "pending" | "processing" | "paid";

export interface CaregiverPayout {
  name: string; placements: number; shifts: number; hours: number; rate: number;
  gross: number; deductions: number; net: number; status: PayoutStatus;
  method: string; account: string;
}

export interface PayoutHistoryItem {
  date: string; caregiver: string; amount: number; method: string;
  methodColor: string; ref: string; account: string;
}

export interface SettlementPeriod {
  period: string; status: "active" | "settled"; received: number;
  paid: number; pending: number;
}

// ─── Transactions ───
export interface AgencyTransaction {
  id: number; desc: string; amount: string; type: "credit" | "debit";
  date: string; status: string;
}

// ─── Clients ───
export interface AgencyClient {
  id: number; name: string; type: string; patients: string[];
  location: string; since: string; spend: string; status: string;
}

// ─── Reports ───
export interface AgencyMonthlyData { month: string; clients: number; caregivers: number; revenue: number; }
export interface AgencyPerformanceData { month: string; rating: number; }

// ─── Shift Monitoring ───
export interface ActiveShift {
  caregiver: string; patient: string; time: string; checkedIn: string;
  status: string; lastLog: string; placement: string;
}

export interface ShiftAlert { type: string; text: string; time: string; }

// ─── Revenue ───
export interface AgencyRevenuePoint { month: string; amount: number; }

// ─── Job Applications ───
export interface JobApplication {
  id: string; name: string; rating: number; experience: string;
  specialties: string[]; skills: string[]; gender: string; location: string;
  matchScore: number; appliedDate: string; lastActivity: string; status: string;
  certifications: string[]; previousJobs: number; completionRate: number;
}

// ─── Roster ───
export interface RosterCaregiver {
  id: string; name: string; specialty: string; rating: number;
  experience: string; available: boolean;
}

// ─── Service Return Types (untyped methods) ───
export interface RequirementInboxItem {
  id: string; guardianName: string; guardianVerified: boolean; guardianPlacements: number;
  patientName: string; patientAge: number; patientCondition: string;
  careType: string; duration: string; shiftPreference: string;
  budgetMin: number; budgetMax: number; location: string; specialRequirements: string;
  submittedDate: string; submittedAgo: string; responseDeadline: string;
  status: "new" | "under-review" | "proposal-sent" | "accepted" | "declined";
  priority: "urgent" | "normal" | "low";
  isNew: boolean;
}

export interface AgencySettings {
  name: string; email: string; phone: string;
  address: string; license: string; established: number;
  services: string[];
  commissionRate: number; payoutSchedule: "weekly" | "biweekly" | "monthly";
}

export interface StorefrontServiceItem {
  id: string; name: string; price: number; description: string; popular: boolean;
}

export interface StorefrontData {
  agency: { name: string; rating: number; reviews: number; tagline: string };
  services: StorefrontServiceItem[];
}

export interface Branch {
  id: string; name: string; address: string; staff: number; active: boolean;
}

export interface ClientCarePlanData {
  client: { name: string; age: number; condition: string };
  plan: {
    goals: string[];
    schedule: Array<{ day: string; shift: string; caregiver: string; tasks: string[] }>;
    medications: Array<{ name: string; frequency: string }>;
  };
}

export interface StaffAttendanceEntry {
  id: string; name: string; role: string;
  status: "present" | "late" | "absent";
  checkIn: string | null; checkOut: string | null;
}

export interface StaffAttendanceData {
  date: string;
  staff: StaffAttendanceEntry[];
}

export interface StaffHiringPosition {
  id: string; title: string; location: string; applicants: number; posted: string;
}

export interface StaffHiringApplicant {
  id: string; name: string; role: string; experience: string;
  rating: number; status: "interview" | "screening" | "new" | "offer" | "rejected";
}

export interface StaffHiringData {
  openPositions: StaffHiringPosition[];
  recentApplicants: StaffHiringApplicant[];
}

// ─── Document Verification (Phase 3) ───
export type VerificationAction = "approve" | "reject" | "request_resubmit";

export interface DocumentVerificationItem {
  id: string;
  caregiverId: string;
  caregiverName: string;
  documentName: string;
  category: string;
  submittedAt: string;
  fileUrl: string;
  thumbnailUrl?: string;
  status: "pending" | "approved" | "rejected" | "resubmit_requested";
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// ─── Care Plan Templates (Phase 10) ───
export interface CarePlanTemplate {
  id: string;
  name: string;
  condition: string;
  description: string;
  tasks: Array<{ label: string; frequency: string }>;
  medications: Array<{ name: string; dosage: string; frequency: string }>;
  schedule: Array<{ day: string; shift: string; tasks: string[] }>;
}// ─── Incidents ───
export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "in-review" | "resolved" | "escalated";

export interface AgencyIncident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;       // caregiver name
  patientName: string;
  placementId?: string;
  reportedAt: string;       // ISO timestamp
  resolvedAt?: string;
  resolutionNote?: string;
}
