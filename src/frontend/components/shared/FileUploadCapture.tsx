/**
 * FileUploadCapture — camera + file input + drag-drop zone + preview + progress bar
 */
import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Camera, Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import type { DocumentCategory, UploadedFile } from "@/backend/models";
import { useFileUpload } from "@/frontend/hooks/useFileUpload";

interface FileUploadCaptureProps {
  category: DocumentCategory;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onUpload?: (file: UploadedFile) => void;
  onRemove?: (fileId: string) => void;
  label?: string;
  showCamera?: boolean;
}

export function FileUploadCapture({
  category,
  accept = "image/*,application/pdf",
  maxSizeMB = 10,
  multiple = false,
  onUpload,
  onRemove,
  label,
  showCamera = true,
}: FileUploadCaptureProps) {
  const { t } = useTranslation();
  const { uploads, completedFiles, upload, removeFile } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(async (files: FileList | null, captureMethod: "file" | "camera" | "drag_drop" = "file") => {
    if (!files) return;
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxBytes) continue; // silently skip oversized
      const result = await upload(file, category, captureMethod);
      if (result && onUpload) onUpload(result);
      if (!multiple) break;
    }
  }, [upload, category, maxSizeMB, multiple, onUpload]);

  const handleRemove = useCallback(async (fileId: string) => {
    await removeFile(fileId);
    onRemove?.(fileId);
  }, [removeFile, onRemove]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files, "drag_drop");
  }, [handleFiles]);

  return (
    <div className="space-y-3">
      {label && <label className="text-sm text-muted-foreground">{label}</label>}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragOver ? "border-pink-400 bg-pink-50" : "border-gray-300 bg-gray-50/50"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            {t("upload.dragDrop", "Drag & drop files here, or")}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {t("upload.browseFiles", "Browse Files")}
            </button>
            {showCamera && (
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-4 py-2 text-sm border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors flex items-center gap-1"
              >
                <Camera className="w-4 h-4" />
                {t("upload.camera", "Camera")}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {t("upload.maxSize", "Max {{size}}MB", { size: maxSizeMB })}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, "camera")}
        />
      </div>

      {/* Progress bars */}
      {uploads.filter((u) => u.status === "uploading").map((u) => (
        <div key={u.fileId} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
          <FileText className="w-5 h-5 text-gray-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{u.fileName}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-gradient-to-r from-pink-500 to-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${u.progress}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-400">{Math.round(u.progress)}%</span>
        </div>
      ))}

      {/* Failed uploads */}
      {uploads.filter((u) => u.status === "failed").map((u) => (
        <div key={u.fileId} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate text-red-700">{u.fileName}</p>
            <p className="text-xs text-red-500">{u.errorMessage}</p>
          </div>
        </div>
      ))}

      {/* Completed files preview */}
      {completedFiles.length > 0 && (
        <div className="space-y-2">
          {completedFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              {file.thumbnailUrl ? (
                <img src={file.thumbnailUrl} alt="" className="w-10 h-10 rounded object-cover" />
              ) : (
                <FileText className="w-5 h-5 text-green-600 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{file.fileName}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {t("upload.uploaded", "Uploaded")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(file.id)}
                className="p-1 hover:bg-red-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
