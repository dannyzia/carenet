import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import { FileText, Upload, Shield, Clock, CheckCircle, Eye, Trash2, Filter } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { uploadService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { FileUploadCapture } from "@/frontend/components/shared/FileUploadCapture";
import type { UploadedFile, DocumentCategory } from "@/backend/models";
import { useTranslation } from "react-i18next";

const PATIENT_DOC_CATEGORIES: { value: DocumentCategory; label: string; desc: string }[] = [
  { value: "medical_document", label: "Medical Reports", desc: "Lab results, discharge summaries, prescriptions" },
  { value: "nid", label: "Identity Documents", desc: "National ID, passport" },
  { value: "other", label: "Other Documents", desc: "Insurance, consent forms, etc." },
];

export default function PatientDocumentUploadPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.patientDocumentUpload", "Patient Document Upload"));

  const { data: files, loading, refetch } = useAsyncData(() => uploadService.getFilesByUser("patient-current"));
  if (loading) return <PageSkeleton cards={3} />;
  return <PatientDocsContent initialFiles={files || []} onRefresh={refetch} />;
}

function PatientDocsContent({ initialFiles, onRefresh }: { initialFiles: UploadedFile[]; onRefresh: () => void }) {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>("medical_document");
  const [showUpload, setShowUpload] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");

  const handleUpload = (file: UploadedFile) => {
    setFiles(prev => [file, ...prev]);
  };

  const handleRemove = async (fileId: string) => {
    await uploadService.deleteFile(fileId);
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const filtered = filterCat === "all" ? files : files.filter(f => f.category === filterCat);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl" style={{ color: cn.textHeading }}>My Documents</h1>
          <p className="text-sm mt-0.5" style={{ color: cn.textSecondary }}>{files.length} documents uploaded</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm" style={{ background: "var(--cn-gradient-guardian)" }}>
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(59,130,246,0.08)" }}>
        <Shield className="w-5 h-5 mt-0.5" style={{ color: "var(--cn-blue)" }} />
        <div>
          <p className="text-sm" style={{ color: cn.textHeading }}>Your documents are private</p>
          <p className="text-xs" style={{ color: cn.textSecondary }}>Only you and your authorized caregivers can view these documents. You can revoke access anytime from the Data Privacy page.</p>
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="finance-card p-5 space-y-4" style={{ borderLeft: `3px solid ${cn.green}` }}>
          <div>
            <label className="text-sm mb-1.5 block" style={{ color: cn.textHeading }}>Document Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PATIENT_DOC_CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setUploadCategory(cat.value)}
                  className="p-3 rounded-xl border text-left transition-all" style={{
                    borderColor: uploadCategory === cat.value ? cn.green : cn.border,
                    background: uploadCategory === cat.value ? "rgba(95,184,101,0.05)" : cn.bgCard,
                  }}>
                  <p className="text-sm" style={{ color: cn.text }}>{cat.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: cn.textSecondary }}>{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <FileUploadCapture
            category={uploadCategory}
            accept="image/*,application/pdf"
            maxSizeMB={10}
            multiple
            showCamera
            onUpload={handleUpload}
          />
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 shrink-0" style={{ color: cn.textSecondary }} />
        {[{ value: "all", label: "All" }, ...PATIENT_DOC_CATEGORIES].map(cat => (
          <button key={cat.value} onClick={() => setFilterCat(cat.value)}
            className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all" style={{
              background: filterCat === cat.value ? cn.pinkBg : cn.bgInput,
              color: filterCat === cat.value ? cn.pink : cn.textSecondary,
            }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document List */}
      {filtered.length === 0 ? (
        <div className="finance-card p-8 text-center">
          <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: cn.textSecondary }} />
          <p className="text-sm" style={{ color: cn.textSecondary }}>No documents yet. Upload your first document above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(file => (
            <div key={file.id} className="finance-card p-4 flex items-center gap-3">
              {file.thumbnailUrl ? (
                <img src={file.thumbnailUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: cn.bgInput }}>
                  <FileText className="w-5 h-5" style={{ color: cn.textSecondary }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: cn.textHeading }}>{file.fileName}</p>
                <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: cn.textSecondary }}>
                  <span>{formatSize(file.fileSize)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5"><CheckCircle className="w-3 h-3 text-green-500" />{file.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Eye className="w-4 h-4" style={{ color: cn.textSecondary }} /></button>
                <button onClick={() => handleRemove(file.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
