/**
 * Backup / Standby Caregiver Service (Phase 6)
 * No dedicated backup tables in DB yet — uses mock data with Supabase-ready structure.
 */
import type { BackupAssignment, ShiftReassignment, StandbySlot } from "@/backend/models";
import { MOCK_BACKUP_ASSIGNMENTS, MOCK_SHIFT_REASSIGNMENTS, MOCK_STANDBY_POOL } from "@/backend/api/mock";
import { USE_SUPABASE, sbWrite, sb, currentUserId } from "./_sb";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const backupService = {
  async getBackupAssignments(): Promise<BackupAssignment[]> {
    // TODO: backup_assignments table
    await delay();
    return MOCK_BACKUP_ASSIGNMENTS;
  },

  async getReassignmentHistory(): Promise<ShiftReassignment[]> {
    // TODO: shift_reassignments table
    await delay();
    return MOCK_SHIFT_REASSIGNMENTS;
  },

  async getStandbyPool(): Promise<StandbySlot[]> {
    // TODO: standby_pool table
    await delay();
    return MOCK_STANDBY_POOL;
  },

  async reassignShift(shiftId: string, toCaregiverId: string, reason: string): Promise<ShiftReassignment> {
    if (USE_SUPABASE) {
      return sbWrite(async () => {
        // Update shift caregiver
        const { data: shift } = await sb().from("shifts").select("caregiver_id").eq("id", shiftId).single();
        await sb().from("shifts").update({ caregiver_id: toCaregiverId }).eq("id", shiftId);
        return {
          id: `sr-${crypto.randomUUID().slice(0, 8)}`,
          shiftId,
          fromCaregiverId: shift?.caregiver_id || "unknown",
          fromCaregiverName: "Previous Caregiver",
          toCaregiverId,
          toCaregiverName: "Selected Backup",
          reason,
          reassignedBy: "Agency Admin",
          reassignedAt: new Date().toISOString(),
          status: "pending" as const,
        };
      });
    }
    await delay(400);
    return {
      id: `sr-${crypto.randomUUID().slice(0, 8)}`,
      shiftId,
      fromCaregiverId: "cg-current",
      fromCaregiverName: "Current Caregiver",
      toCaregiverId,
      toCaregiverName: "Selected Backup",
      reason,
      reassignedBy: "Agency Admin",
      reassignedAt: new Date().toISOString(),
      status: "pending",
    };
  },

  async assignBackup(placementId: string, caregiverId: string, priority: number): Promise<void> {
    await delay(300);
  },

  async removeBackup(placementId: string, caregiverId: string): Promise<void> {
    await delay(200);
  },
};
