/**
 * useFileUpload — manages file upload state, progress simulation, and service calls.
 */
import { useState, useCallback } from "react";
import type { UploadedFile, DocumentCategory, CaptureMethod, UploadProgress, FileUploadState } from "@/backend/models";
import { uploadService } from "@/backend/services";

export function useFileUpload() {
  const [state, setState] = useState<FileUploadState>({
    uploads: [],
    completedFiles: [],
    isUploading: false,
  });

  const upload = useCallback(async (
    file: File,
    category: DocumentCategory,
    captureMethod: CaptureMethod = "file",
  ): Promise<UploadedFile | null> => {
    const tempId = `temp-${crypto.randomUUID().slice(0, 8)}`;
    const progress: UploadProgress = {
      fileId: tempId,
      fileName: file.name,
      progress: 0,
      status: "uploading",
    };

    setState((prev) => ({
      ...prev,
      uploads: [...prev.uploads, progress],
      isUploading: true,
    }));

    // Simulate progress ticks
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        uploads: prev.uploads.map((u) =>
          u.fileId === tempId
            ? { ...u, progress: Math.min(u.progress + 15 + Math.random() * 20, 90) }
            : u
        ),
      }));
    }, 200);

    try {
      const uploaded = await uploadService.uploadFile(file, category, captureMethod);

      clearInterval(interval);
      setState((prev) => ({
        uploads: prev.uploads.map((u) =>
          u.fileId === tempId ? { ...u, fileId: uploaded.id, progress: 100, status: "completed" } : u
        ),
        completedFiles: [...prev.completedFiles, uploaded],
        isUploading: prev.uploads.filter((u) => u.fileId !== tempId && u.status === "uploading").length > 0,
      }));

      return uploaded;
    } catch (err) {
      clearInterval(interval);
      setState((prev) => ({
        ...prev,
        uploads: prev.uploads.map((u) =>
          u.fileId === tempId
            ? { ...u, status: "failed", errorMessage: err instanceof Error ? err.message : "Upload failed" }
            : u
        ),
        isUploading: prev.uploads.filter((u) => u.fileId !== tempId && u.status === "uploading").length > 0,
      }));
      return null;
    }
  }, []);

  const removeFile = useCallback(async (fileId: string) => {
    await uploadService.deleteFile(fileId);
    setState((prev) => ({
      ...prev,
      uploads: prev.uploads.filter((u) => u.fileId !== fileId),
      completedFiles: prev.completedFiles.filter((f) => f.id !== fileId),
    }));
  }, []);

  const clearCompleted = useCallback(() => {
    setState((prev) => ({
      ...prev,
      uploads: prev.uploads.filter((u) => u.status !== "completed"),
    }));
  }, []);

  return {
    ...state,
    upload,
    removeFile,
    clearCompleted,
  };
}
