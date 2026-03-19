import { useState } from "react";
import {
  ArrowUpRight, AlertTriangle, Shield, Clock, CheckCircle,
  Search, Flag, Star, FileText, User, MessageSquare, XCircle, Eye,
} from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { moderatorService } from "@/backend/services/moderator.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import type { ModeratorEscalation } from "@/backend/models";
import { useTranslation } from "react-i18next";

const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  low: { color: "#5FB865", bg: "#7CE57720" },
  medium: { color: "#E8A838", bg: "#FFB54D20" },
  high: { color: "#EF4444", bg: "#EF444420" },
  critical: { color: "#DC2626", bg: "#DC262630" },
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: "#E8A838", bg: "#FFB54D20", label: "Pending" },
  in_review: { color: "#3B82F6", bg: "#3B82F620", label: "In Review" },
  resolved: { color: "#5FB865", bg: "#7CE57720", label: "Resolved" },
  dismissed: { color: "#848484", bg: "#84848420", label: "Dismissed" },
};

const SOURCE_ICONS: Record<string, typeof Flag> = {
  report: Flag,
  review: Star,
  content: FileText,
};

export default function ModeratorEscalationsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.moderatorEscalations", "Moderator Escalations"));

  const { data: escalations, loading } = useAsyncData(() => moderatorService.getEscalations());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (loading || !escalations) return <PageSkeleton cards={5} />;

  const filtered = escalations.filter((e) => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && e.status !== filterStatus) return false;
    if (filterPriority !== "all" && e.priority !== filterPriority) return false;
    return true;
  });

  const selected = selectedId ? escalations.find((e) => e.id === selectedId) : null;

  const stats = {
    pending: escalations.filter((e) => e.status === "pending").length,
    inReview: escalations.filter((e) => e.status === "in_review").length,
    critical: escalations.filter((e) => e.priority === "critical" && e.status !== "resolved" && e.status !== "dismissed").length,
    resolved: escalations.filter((e) => e.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl" style={{ color: "#535353" }}>Escalation Queue</h1>
        <p className="text-sm" style={{ color: "#848484" }}>Cases requiring admin review or higher-level intervention</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Pending Review", value: stats.pending, icon: Clock, color: "#E8A838", bg: "#FFB54D20" },
          { label: "In Review", value: stats.inReview, icon: Eye, color: "#3B82F6", bg: "#3B82F620" },
          { label: "Critical", value: stats.critical, icon: AlertTriangle, color: "#DC2626", bg: "#DC262620" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "#5FB865", bg: "#7CE57720" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: s.bg }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <p className="text-2xl" style={{ color: "#535353" }}>{s.value}</p>
              <p className="text-xs" style={{ color: "#848484" }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#848484" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search escalations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: "#E5E7EB", color: "#535353" }} />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: "#E5E7EB", color: "#535353" }}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: "#E5E7EB", color: "#535353" }}>
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-3 space-y-3">
          {filtered.map((e) => {
            const pc = PRIORITY_CONFIG[e.priority];
            const sc = STATUS_CONFIG[e.status];
            const SourceIcon = SOURCE_ICONS[e.sourceType] || FileText;
            const isSelected = selectedId === e.id;

            return (
              <div key={e.id}
                className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-all"
                style={{ borderLeft: `4px solid ${pc.color}`, outline: isSelected ? `2px solid ${pc.color}` : "none" }}
                onClick={() => setSelectedId(isSelected ? null : e.id)}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: pc.bg }}>
                      <SourceIcon className="w-4 h-4" style={{ color: pc.color }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#535353" }}>{e.title}</p>
                      <p className="text-xs" style={{ color: "#848484" }}>{e.id} · {e.sourceType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: pc.bg, color: pc.color }}>
                      {e.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                </div>
                <p className="text-xs line-clamp-2" style={{ color: "#848484" }}>{e.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "#848484" }}>
                  <span>By {e.escalatedBy}</span>
                  <span>{new Date(e.escalatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                  {e.assignedTo && <span>Assigned: {e.assignedTo}</span>}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <p className="text-sm" style={{ color: "#848484" }}>No escalations match your filters</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <EscalationDetail escalation={selected} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center sticky top-6">
              <ArrowUpRight className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: "#848484" }} />
              <p className="text-sm" style={{ color: "#848484" }}>Select an escalation to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EscalationDetail({ escalation }: { escalation: ModeratorEscalation }) {
  const [resolution, setResolution] = useState("");
  const pc = PRIORITY_CONFIG[escalation.priority];
  const sc = STATUS_CONFIG[escalation.status];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-6 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: pc.bg, color: pc.color }}>
            {escalation.priority}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: sc.bg, color: sc.color }}>
            {sc.label}
          </span>
        </div>
        <h2 className="text-lg" style={{ color: "#535353" }}>{escalation.title}</h2>
        <p className="text-xs mt-1" style={{ color: "#848484" }}>{escalation.id} · Source: {escalation.sourceType} #{escalation.sourceId}</p>
      </div>

      <div className="p-4 rounded-xl" style={{ background: "#F9FAFB" }}>
        <p className="text-sm" style={{ color: "#535353" }}>{escalation.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p style={{ color: "#848484" }}>Escalated By</p>
          <p style={{ color: "#535353" }}>{escalation.escalatedBy}</p>
        </div>
        <div>
          <p style={{ color: "#848484" }}>Date</p>
          <p style={{ color: "#535353" }}>{new Date(escalation.escalatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        {escalation.assignedTo && (
          <div>
            <p style={{ color: "#848484" }}>Assigned To</p>
            <p style={{ color: "#535353" }}>{escalation.assignedTo}</p>
          </div>
        )}
        {escalation.resolvedAt && (
          <div>
            <p style={{ color: "#848484" }}>Resolved</p>
            <p style={{ color: "#535353" }}>{new Date(escalation.resolvedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
          </div>
        )}
      </div>

      {escalation.resolution && (
        <div className="p-3 rounded-xl border-l-3" style={{ background: "#7CE57720", borderLeft: "3px solid #5FB865" }}>
          <p className="text-xs" style={{ color: "#5FB865" }}>Resolution</p>
          <p className="text-sm mt-1" style={{ color: "#535353" }}>{escalation.resolution}</p>
        </div>
      )}

      {escalation.status !== "resolved" && escalation.status !== "dismissed" && (
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "#848484" }}>Resolution / Action</label>
          <textarea value={resolution} onChange={(e) => setResolution(e.target.value)}
            rows={3} placeholder="Describe the resolution..."
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
            style={{ borderColor: "#E5E7EB", color: "#535353" }} />
          <div className="flex gap-2 mt-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm"
              style={{ background: "#5FB865" }}>
              <CheckCircle className="w-3.5 h-3.5" /> Resolve
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm"
              style={{ background: "#848484" }}>
              <XCircle className="w-3.5 h-3.5" /> Dismiss
            </button>
            {!escalation.assignedTo && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border"
                style={{ borderColor: "#E5E7EB", color: "#535353" }}>
                <User className="w-3.5 h-3.5" /> Assign
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
