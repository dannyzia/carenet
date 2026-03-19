/** Shift status lifecycle */
export type ShiftStatus = "scheduled" | "checked-in" | "in-progress" | "checked-out" | "completed" | "cancelled";

/** A single shift record */
export interface Shift {
  id: string;
  caregiverId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ShiftStatus;
  location?: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInGps?: { lat: number; lng: number };
  checkInSelfieUrl?: string;
  checkOutGps?: { lat: number; lng: number };
  checkOutSelfieUrl?: string;
  notes?: string;
}

/** GPS-verified check-in record (Phase 5) */
export interface ShiftCheckIn {
  shiftId: string;
  selfieUrl: string;
  gpsCoords: { lat: number; lng: number };
  timestamp: string;
  verified: boolean;
  distanceFromExpected?: number;
}

/** Incident report (Phase 7) */
export type IncidentType = "fall" | "medication_error" | "behavioral" | "equipment" | "skin_integrity" | "other";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export interface IncidentReport {
  id: string;
  reportedBy: string;
  reporterRole: string;
  type: IncidentType;
  severity: IncidentSeverity;
  patientId: string;
  shiftId?: string;
  description: string;
  immediateAction: string;
  photos: string[];
  gps?: { lat: number; lng: number };
  createdAt: string;
  status: "open" | "under_review" | "resolved" | "escalated" | "closed";
  escalatedTo?: string;
}

/** Handoff note between caregivers (Phase 9) */
export interface HandoffNote {
  id: string;
  fromCaregiverId: string;
  fromCaregiverName: string;
  toCaregiverId: string;
  toCaregiverName: string;
  shiftId: string;
  patientId: string;
  notes: string;
  flaggedItems: string[];
  createdAt: string;
}

/** Shift rating by guardian (Phase 9) */
export interface ShiftRating {
  id: string;
  shiftId: string;
  ratedBy: string;
  ratedByRole: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}