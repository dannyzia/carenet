import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import { FileCheck, Eye, CheckCircle, XCircle, RefreshCw, Clock, User, Filter, FileText, MessageSquare } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { agencyService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useAriaToast } from "@/frontend/hooks/useAriaToast";
import type { DocumentVerificationItem } from "@/backend/models";
import { useTranslation } from "react-i18next";

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: "var(--cn-amber)", bg: "rgba(245,158,11,0.1)", label: "Pending" },
  approved: { color: "var(--cn-green)", bg: "rgba(95,184,101,0.1)", label: "Approved" },
  rejected: { color: "var(--cn-red)", bg: "rgba(239,68,68,0.1)", label: "Rejected" },
  resubmit_requested: { color: "var(--cn-blue)", bg: "rgba(2,136,209,0.1)", label: "Resubmit" },
};

export default function DocumentVerificationPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.documentVerification", "Document Verification"));

  const toast = useAriaToast();
  const { data: queue, loading } = useAsyncData(() => agencyService.getVerificationQueue());
  if (loading || !queue) return <PageSkeleton cards={4} />;
  return <VerificationContent initialQueue={queue} />;
}

function VerificationContent({ initialQueue }: { initialQueue: DocumentVerificationItem[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [filter, setFilter] = useState("all");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  const filtered = filter === "all" ? queue : queue.filter(d => d.status === filter);
  const pendingCount = queue.filter(d => d.status === "pending").length;

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (action === "approve") {
      await agencyService.verifyDocument(id, reviewNote);
      setQueue(prev => prev.map(d => d.id === id ? { ...d, status: "approved" as const, reviewNote, reviewedAt: new Date().toISOString() } : d));
      toast.success("Document approved");
    } else {
      await agencyService.rejectDocument(id, reviewNote);
      setQueue(prev => prev.map(d => d.id === id ? { ...d, status: "rejected" as const, reviewNote, reviewedAt: new Date().toISOString() } : d));
      toast.error("Document rejected");
    }
    setReviewingId(null);
    setReviewNote("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl" style={{ color: cn.textHeading }}>Document Verification</h1>
        <p className="text-sm mt-0.5" style={{ color: cn.textSecondary }}>{pendingCount} documents awaiting review</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="finance-card p-3 text-center cursor-pointer" onClick={() => setFilter(key)}>
            <p className="text-lg" style={{ color: cfg.color }}>{queue.filter(d => d.status === key).length}</p>
            <p className="text-xs" style={{ color: cn.textSecondary }}>{cfg.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 shrink-0" style={{ color: cn.textSecondary }} />
        {[{ value: "all", label: "All" }, ...Object.entries(statusConfig).map(([value, cfg]) => ({ value, label: cfg.label }))].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap" style={{
              background: filter === f.value ? cn.pinkBg : cn.bgInput,
              color: filter === f.value ? cn.pink : cn.textSecondary,
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(doc => {
          const cfg = statusConfig[doc.status] || statusConfig.pending;
          const reviewing = reviewingId === doc.id;
          return (
            <div key={doc.id} className="finance-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {doc.thumbnailUrl ? (
                    <img src={doc.thumbnailUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: cn.bgInput }}>
                      <FileText className="w-5 h-5" style={{ color: cn.textSecondary }} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm" style={{ color: cn.textHeading }}>{doc.documentName}</p>
                    <p className="text-xs" style={{ color: cn.textSecondary }}>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{doc.caregiverName} · {doc.category}</span>
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: cn.textSecondary }}>
                      <Clock className="w-3 h-3" />{new Date(doc.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
              </div>

              {doc.status === "pending" && !reviewing && (
                <div className="flex gap-2">
                  <button onClick={() => setReviewingId(doc.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs text-white" style={{ background: cn.green }}>
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => setReviewingId(doc.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs text-white bg-red-500">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button className="px-3 py-2 rounded-lg text-xs" style={{ background: cn.bgInput, color: cn.textSecondary }}>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {reviewing && (
                <div className="space-y-2 pt-2" style={{ borderTop: `1px solid ${cn.border}` }}>
                  <textarea value={reviewNote} onChange={e => setReviewNote(e.target.value)}
                    rows={2} placeholder="Add a review note (optional)..."
                    className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} />
                  <div className="flex gap-2">
                    <button onClick={() => handleAction(doc.id, "approve")} className="flex-1 py-2 rounded-lg text-xs text-white" style={{ background: cn.green }}>
                      <CheckCircle className="w-3.5 h-3.5 inline mr-1" />Approve
                    </button>
                    <button onClick={() => handleAction(doc.id, "reject")} className="flex-1 py-2 rounded-lg text-xs text-white bg-red-500">
                      <XCircle className="w-3.5 h-3.5 inline mr-1" />Reject
                    </button>
                    <button onClick={() => { setReviewingId(null); setReviewNote(""); }} className="px-3 py-2 rounded-lg text-xs" style={{ color: cn.textSecondary }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {doc.reviewNote && (
                <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: cn.bgInput }}>
                  <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: cn.textSecondary }} />
                  <p className="text-xs" style={{ color: cn.textSecondary }}>{doc.reviewNote}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}