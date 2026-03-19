import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft, Flag, Star, FileText, Clock, CheckCircle, XCircle,
  AlertTriangle, ArrowUpRight, MessageSquare, User, Shield, Loader2,
} from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { moderatorService } from "@/backend/services/moderator.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

const priorityColors: Record<string, { color: string; bg: string }> = {
  low: { color: "#5FB865", bg: "#7CE57720" },
  medium: { color: "#E8A838", bg: "#FFB54D20" },
  high: { color: "#EF4444", bg: "#EF444420" },
};

const typeIcons: Record<string, typeof Flag> = {
  Report: Flag,
  Review: Star,
  Content: FileText,
};

export default function ModeratorQueueDetailPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.moderatorQueueDetail", "Moderator Queue Detail"));

  const { id } = useParams();
  const numId = parseInt(id || "0");
  const { data: item, loading } = useAsyncData(() => moderatorService.getQueueItem(numId));
  const { data: relatedReports } = useAsyncData(() => moderatorService.getRelatedReports(numId));
  const { data: relatedContent } = useAsyncData(() => moderatorService.getRelatedContent(numId));

  const [action, setAction] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  if (loading || !item) return <PageSkeleton cards={4} />;

  const pc = priorityColors[item.priority] || priorityColors.medium;
  const TypeIcon = typeIcons[item.type] || FileText;

  const handleAction = async (act: string) => {
    setProcessing(true);
    setAction(act);
    await new Promise((r) => setTimeout(r, 1000));
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <Link to="/moderator/dashboard" className="inline-flex items-center gap-1 text-sm hover:underline no-underline"
        style={{ color: "#848484" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: pc.bg }}>
              <TypeIcon className="w-6 h-6" style={{ color: pc.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl" style={{ color: "#535353" }}>Queue Item #{item.id}</h1>
                <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: pc.bg, color: pc.color }}>
                  {item.priority}
                </span>
              </div>
              <p className="text-sm" style={{ color: "#848484" }}>{item.type} · Reported {item.time}</p>
            </div>
          </div>
          {!action && (
            <div className="flex gap-2">
              <button onClick={() => handleAction("escalate")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border hover:bg-gray-50"
                style={{ borderColor: "#E5E7EB", color: "#535353" }} disabled={processing}>
                <ArrowUpRight className="w-4 h-4" /> Escalate
              </button>
              <button onClick={() => handleAction("approve")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm"
                style={{ background: "#5FB865" }} disabled={processing}>
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => handleAction("remove")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm"
                style={{ background: "#EF4444" }} disabled={processing}>
                <XCircle className="w-4 h-4" /> Remove
              </button>
            </div>
          )}
        </div>

        {action && (
          <div className="p-4 rounded-xl" style={{ background: action === "approve" ? "#7CE57720" : action === "remove" ? "#EF444420" : "#FFB54D20" }}>
            <div className="flex items-center gap-2">
              {action === "approve" && <CheckCircle className="w-5 h-5" style={{ color: "#5FB865" }} />}
              {action === "remove" && <XCircle className="w-5 h-5" style={{ color: "#EF4444" }} />}
              {action === "escalate" && <ArrowUpRight className="w-5 h-5" style={{ color: "#E8A838" }} />}
              <span className="text-sm" style={{ color: "#535353" }}>
                {action === "approve" ? "Content approved" : action === "remove" ? "Content removed" : "Escalated to admin"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Preview */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="mb-3 flex items-center gap-2" style={{ color: "#535353" }}>
          <MessageSquare className="w-5 h-5" style={{ color: "#7B5EA7" }} />
          Reported Content
        </h2>
        <div className="p-4 rounded-xl border" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
          <p className="text-sm" style={{ color: "#535353" }}>{item.content}</p>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" style={{ color: "#848484" }} />
            <span className="text-xs" style={{ color: "#848484" }}>Reported by: {item.reporter}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: "#848484" }} />
            <span className="text-xs" style={{ color: "#848484" }}>{item.time}</span>
          </div>
        </div>
      </div>

      {/* Moderator Notes */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="mb-3 flex items-center gap-2" style={{ color: "#535353" }}>
          <Shield className="w-5 h-5" style={{ color: "#E8A838" }} />
          Moderator Notes
        </h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Add internal notes about this item..."
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
          style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#535353" }}
        />
        <button className="mt-2 px-4 py-2 rounded-xl text-white text-sm" style={{ background: "#7B5EA7" }}>
          Save Note
        </button>
      </div>

      {/* Related Reports */}
      {relatedReports && relatedReports.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="mb-3 flex items-center gap-2" style={{ color: "#535353" }}>
            <Flag className="w-5 h-5" style={{ color: "#EF4444" }} />
            Related Reports ({relatedReports.length})
          </h2>
          <div className="space-y-2">
            {relatedReports.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#F9FAFB" }}>
                <div>
                  <p className="text-sm" style={{ color: "#535353" }}>{r.desc}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#848484" }}>{r.from} vs {r.against} · {r.date}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px]"
                  style={{ background: priorityColors[r.priority]?.bg, color: priorityColors[r.priority]?.color }}>
                  {r.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Flagged Content */}
      {relatedContent && relatedContent.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="mb-3 flex items-center gap-2" style={{ color: "#535353" }}>
            <AlertTriangle className="w-5 h-5" style={{ color: "#E8A838" }} />
            Related Flagged Content ({relatedContent.length})
          </h2>
          <div className="space-y-2">
            {relatedContent.map((c) => (
              <div key={c.id} className="p-3 rounded-xl" style={{ background: "#F9FAFB" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#F3F4F6", color: "#848484" }}>{c.type}</span>
                  <span className="text-xs" style={{ color: "#848484" }}>{c.target}</span>
                </div>
                <p className="text-sm" style={{ color: "#535353" }}>{c.content}</p>
                <p className="text-xs mt-1" style={{ color: "#848484" }}>Reason: {c.reason} · {c.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
