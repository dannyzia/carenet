/**
 * Schedule Domain Models
 * Unified daily task / to-do system for all roles.
 */

export type TaskType = "event" | "task";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskCreatorRole = "caregiver" | "guardian" | "agency" | "patient" | "admin";

export interface DailyTask {
  id: string;
  type: TaskType;
  title: string;
  details: string;
  time: string;
  date: string;
  patientId?: string;
  patientName?: string;
  caregiverId?: string;
  caregiverName?: string;
  guardianId?: string;
  agencyId?: string;
  status: TaskStatus;
  completedAt?: string;
  completionNote?: string;
  completionPhotoUrl?: string;
  createdBy: string;
  createdByRole: TaskCreatorRole;
  createdAt: string;
}
