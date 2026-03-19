/**
 * Upload Domain Models
 * Types for file upload infrastructure, document categories, and expiry tracking.
 */

/** Supported document categories for caregiver verification */
export type DocumentCategory =
  | "nid"
  | "education"
  | "training"
  | "police_verification"
  | "medical_license"
  | "profile_selfie"
  | "medical_document"
  | "incident_photo"
  | "other";

/** How the file was captured */
export type CaptureMethod = "camera" | "file" | "drag_drop";

/** Upload lifecycle status */
export type UploadStatus = "idle" | "uploading" | "processing" | "completed" | "failed";

/** A single uploaded file record */
export interface UploadedFile {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: DocumentCategory;
  captureMethod: CaptureMethod;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedByRole: string;
  uploadedAt: string;
  status: UploadStatus;
  errorMessage?: string;
}

/** Tracks upload progress for the UI */
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: UploadStatus;
  errorMessage?: string;
}

/** State managed by the useFileUpload hook */
export interface FileUploadState {
  uploads: UploadProgress[];
  completedFiles: UploadedFile[];
  isUploading: boolean;
}

/** Document expiry alert for caregiver dashboard widget */
export interface DocumentExpiryAlert {
  documentId: string;
  documentName: string;
  category: DocumentCategory;
  expiryDate: string;
  daysUntilExpiry: number;
  severity: "expired" | "critical" | "warning" | "info";
}
