/**
 * Mock Upload Data
 */
import type { UploadedFile, DocumentExpiryAlert } from "@/backend/models";

export const MOCK_UPLOADED_FILES: UploadedFile[] = [
  {
    id: "uf-1", fileName: "profile-selfie.jpg", fileSize: 245000, mimeType: "image/jpeg",
    category: "profile_selfie", captureMethod: "camera",
    url: "/mock/selfie-fatima.jpg", thumbnailUrl: "/mock/selfie-fatima-thumb.jpg",
    uploadedBy: "cg-1", uploadedByRole: "caregiver", uploadedAt: "2026-03-10T09:30:00Z", status: "completed",
  },
  {
    id: "uf-2", fileName: "nid-front.jpg", fileSize: 312000, mimeType: "image/jpeg",
    category: "nid", captureMethod: "camera",
    url: "/mock/nid-front.jpg", thumbnailUrl: "/mock/nid-front-thumb.jpg",
    uploadedBy: "cg-1", uploadedByRole: "caregiver", uploadedAt: "2026-03-08T14:15:00Z", status: "completed",
  },
  {
    id: "uf-3", fileName: "nid-back.jpg", fileSize: 298000, mimeType: "image/jpeg",
    category: "nid", captureMethod: "camera",
    url: "/mock/nid-back.jpg", thumbnailUrl: "/mock/nid-back-thumb.jpg",
    uploadedBy: "cg-1", uploadedByRole: "caregiver", uploadedAt: "2026-03-08T14:16:00Z", status: "completed",
  },
  {
    id: "uf-4", fileName: "nursing-diploma.pdf", fileSize: 1524000, mimeType: "application/pdf",
    category: "education", captureMethod: "file",
    url: "/mock/nursing-diploma.pdf",
    uploadedBy: "cg-1", uploadedByRole: "caregiver", uploadedAt: "2026-03-05T10:00:00Z", status: "completed",
  },
  {
    id: "uf-5", fileName: "first-aid-cert.pdf", fileSize: 892000, mimeType: "application/pdf",
    category: "training", captureMethod: "file",
    url: "/mock/first-aid-cert.pdf",
    uploadedBy: "cg-2", uploadedByRole: "caregiver", uploadedAt: "2026-02-20T11:30:00Z", status: "completed",
  },
  {
    id: "uf-6", fileName: "police-clearance.pdf", fileSize: 445000, mimeType: "application/pdf",
    category: "police_verification", captureMethod: "file",
    url: "/mock/police-clearance.pdf",
    uploadedBy: "cg-1", uploadedByRole: "caregiver", uploadedAt: "2026-01-15T08:45:00Z", status: "completed",
  },
];

export const MOCK_DOCUMENT_EXPIRY_ALERTS: DocumentExpiryAlert[] = [
  { documentId: "doc-5", documentName: "First Aid Certificate", category: "training", expiryDate: "2026-03-20", daysUntilExpiry: 3, severity: "critical" },
  { documentId: "doc-6", documentName: "Police Clearance", category: "police_verification", expiryDate: "2026-04-15", daysUntilExpiry: 29, severity: "warning" },
  { documentId: "doc-7", documentName: "Medical License", category: "medical_license", expiryDate: "2026-06-01", daysUntilExpiry: 76, severity: "info" },
  { documentId: "doc-8", documentName: "CPR Training", category: "training", expiryDate: "2026-03-10", daysUntilExpiry: -7, severity: "expired" },
];
