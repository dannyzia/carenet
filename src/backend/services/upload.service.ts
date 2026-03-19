/**
 * Upload Service — file upload infrastructure
 *
 * In dev mode: stores files as base64 in memory / localStorage.
 * In production: uses Supabase Storage.
 */
import type { UploadedFile, DocumentCategory, CaptureMethod, DocumentExpiryAlert } from "@/backend/models";
import { MOCK_UPLOADED_FILES, MOCK_DOCUMENT_EXPIRY_ALERTS } from "@/backend/api/mock";
import { USE_SUPABASE, sbWrite, sbRead, sb, currentUserId } from "./_sb";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/** In-memory store for dev uploads */
let uploadedFiles: UploadedFile[] = [...MOCK_UPLOADED_FILES];

const BUCKET = "uploads";

export const uploadService = {
  /**
   * Upload a file
   */
  async uploadFile(
    file: File,
    category: DocumentCategory,
    captureMethod: CaptureMethod,
    uploadedBy: string = "current-user",
    uploadedByRole: string = "caregiver",
  ): Promise<UploadedFile> {
    if (USE_SUPABASE) {
      return sbWrite(async () => {
        const userId = await currentUserId();
        const ext = file.name.split(".").pop() || "bin";
        const path = `${userId}/${category}/${Date.now()}.${ext}`;

        const { error: upErr } = await sb().storage.from(BUCKET).upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (upErr) throw upErr;

        const { data: urlData } = sb().storage.from(BUCKET).getPublicUrl(path);
        const url = urlData.publicUrl;

        const uploaded: UploadedFile = {
          id: `uf-${crypto.randomUUID().slice(0, 8)}`,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          category,
          captureMethod,
          url,
          thumbnailUrl: file.type.startsWith("image/") ? url : undefined,
          uploadedBy: userId,
          uploadedByRole,
          uploadedAt: new Date().toISOString(),
          status: "completed",
        };
        return uploaded;
      });
    }

    // Mock mode
    await delay(800 + Math.random() * 400);
    const url = await fileToDataUrl(file);
    const thumbnailUrl = file.type.startsWith("image/") ? url : undefined;

    const uploaded: UploadedFile = {
      id: `uf-${crypto.randomUUID().slice(0, 8)}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      category,
      captureMethod,
      url,
      thumbnailUrl,
      uploadedBy,
      uploadedByRole,
      uploadedAt: new Date().toISOString(),
      status: "completed",
    };

    uploadedFiles.push(uploaded);
    return uploaded;
  },

  /**
   * Capture a photo from camera (delegates to uploadFile after capture)
   */
  async capturePhoto(
    file: File,
    category: DocumentCategory,
    uploadedBy?: string,
    uploadedByRole?: string,
  ): Promise<UploadedFile> {
    return this.uploadFile(file, category, "camera", uploadedBy, uploadedByRole);
  },

  /**
   * Delete a previously uploaded file
   */
  async deleteFile(fileId: string): Promise<void> {
    // In Supabase mode, would also delete from storage bucket
    await delay(200);
    uploadedFiles = uploadedFiles.filter((f) => f.id !== fileId);
  },

  /**
   * Get a file by ID
   */
  async getFile(fileId: string): Promise<UploadedFile | undefined> {
    await delay(100);
    return uploadedFiles.find((f) => f.id === fileId);
  },

  /**
   * Get all uploaded files for a user, optionally filtered by category
   */
  async getFilesByUser(userId: string, category?: DocumentCategory): Promise<UploadedFile[]> {
    await delay(200);
    let files = uploadedFiles.filter((f) => f.uploadedBy === userId);
    if (category) files = files.filter((f) => f.category === category);
    return files;
  },

  /**
   * Get document expiry alerts for a caregiver
   */
  async getExpiringDocuments(daysAhead: number = 90): Promise<DocumentExpiryAlert[]> {
    if (USE_SUPABASE) {
      return sbRead(`expiring-docs:${daysAhead}`, async () => {
        const userId = await currentUserId();
        const { data, error } = await sb().from("caregiver_documents")
          .select("id, name, category, expiry")
          .eq("caregiver_id", userId)
          .not("expiry", "is", null);
        if (error) throw error;
        const now = Date.now();
        return (data || [])
          .map((d: any) => {
            const exp = new Date(d.expiry).getTime();
            const days = Math.ceil((exp - now) / 86400000);
            return {
              documentId: d.id,
              documentName: d.name,
              category: d.category,
              expiryDate: d.expiry,
              daysUntilExpiry: days,
              severity: days <= 0 ? "expired" : days <= 14 ? "critical" : days <= 30 ? "warning" : "info",
            } as DocumentExpiryAlert;
          })
          .filter((a) => a.daysUntilExpiry <= daysAhead);
      });
    }
    await delay(200);
    return MOCK_DOCUMENT_EXPIRY_ALERTS.filter((a) => a.daysUntilExpiry <= daysAhead);
  },
};

/** Convert a File to a data URL (for mock storage) */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
