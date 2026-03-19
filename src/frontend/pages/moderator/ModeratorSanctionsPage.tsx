import { useState } from "react";
import {
  Shield, AlertTriangle, Ban, VolumeX, Clock, CheckCircle,
  Search, Filter, Plus, User, XCircle, RotateCcw,
} from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { moderatorService } from "@/backend/services/moderator.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import type { ModeratorSanction } from "@/backend/models";
import { useTranslation } from "react-i18next";

const TYPE_CONFIG: Record<string, { icon: typeof Shield; color: string; bg: string; label: string }> = {
  warning: { icon: AlertTriangle, color: "#E8A838", bg: "#FFB54D20", label: "Warning" },
  mute: { icon: VolumeX, color: "#7B5EA7", bg: "#8082ED20", label: "Mute" },
  suspension: { icon: Clock, color: "#EF4444", bg: "#EF444420", label: "Suspension" },
  ban: { icon: Ban, color: "#DC2626", bg: "#DC262620", label: "Permanent Ban" },
};

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  active: { color: "#EF4444", bg: "#EF444420" },
  expired: { color: "#848484", bg: "#84848420" },
  revoked: { color: "#5FB865", bg: "#7CE57720" },
};

export default function ModeratorSanctionsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.moderatorSanctions", "Moderator Sanctions"));

  const { data: sanctions, loading } = useAsyncData(() => moderatorService.getSanctions());
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (loading || !sanctions) return <PageSkeleton cards={5} />;

  const filtered = sanctions.filter((s) => {
    if (search && !s.userName.toLowerCase().includes(search.toLowerCase()) && !s.reason.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && s.type !== filterType) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    active: sanctions.filter((s) => s.status === "active").length,
    warnings: sanctions.filter((s) => s.type === "warning" && s.status === "active").length,
    suspensions: sanctions.filter((s) => s.type === "suspension" && s.status === "active").length,
    bans: sanctions.filter((s) => s.type === "ban" && s.status === "active").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl" style={{ color: "#535353" }}>User Sanctions</h1>
          <p className="text-sm" style={{ color: "#848484" }}>Manage warnings, mutes, suspensions & bans</p>
        </div>
        <button onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm"
          style={{ background: "linear-gradient(135deg, #DB869A, #7B5EA7)" }}>
          <Plus className="w-4 h-4" /> New Sanction
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Sanctions", value: stats.active, icon: Shield, color: "#EF4444", bg: "#EF444420" },
          { label: "Active Warnings", value: stats.warnings, icon: AlertTriangle, color: "#E8A838", bg: "#FFB54D20" },
          { label: "Suspensions", value: stats.suspensions, icon: Clock, color: "#7B5EA7", bg: "#8082ED20" },
          { label: "Permanent Bans", value: stats.bans, icon: Ban, color: "#DC2626", bg: "#DC262620" },
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

      {/* Create Form */}
      {showCreateForm && <CreateSanctionForm onClose={() => setShowCreateForm(false)} />}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#848484" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users or reasons..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: "#E5E7EB", color: "#535353" }}
            />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: "#E5E7EB", color: "#535353" }}>
            <option value="all">All Types</option>
            <option value="warning">Warning</option>
            <option value="mute">Mute</option>
            <option value="suspension">Suspension</option>
            <option value="ban">Ban</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: "#E5E7EB", color: "#535353" }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Sanctions List */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="mb-4" style={{ color: "#535353" }}>
          Sanctions ({filtered.length})
        </h2>
        <div className="space-y-3">
          {filtered.map((s) => (
            <SanctionCard key={s.id} sanction={s} />
          ))}
          {filtered.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: "#848484" }}>No sanctions match your filters</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SanctionCard({ sanction }: { sanction: ModeratorSanction }) {
  const [expanded, setExpanded] = useState(false);
  const tc = TYPE_CONFIG[sanction.type];
  const sc = STATUS_CONFIG[sanction.status];
  const Icon = tc.icon;

  return (
    <div className="p-4 rounded-xl border hover:shadow-sm transition-shadow cursor-pointer"
      style={{ borderColor: "#E5E7EB" }}
      onClick={() => setExpanded(!expanded)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: tc.bg }}>
            <Icon className="w-5 h-5" style={{ color: tc.color }} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm" style={{ color: "#535353" }}>{sanction.userName}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#F3F4F6", color: "#848484" }}>
                {sanction.userRole}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: tc.bg, color: tc.color }}>
                {tc.label}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: sc.bg, color: sc.color }}>
                {sanction.status}
              </span>
            </div>
            <p className="text-sm" style={{ color: "#535353" }}>{sanction.reason}</p>
            <p className="text-xs mt-1" style={{ color: "#848484" }}>
              Issued by {sanction.issuedBy} · {new Date(sanction.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              {sanction.expiresAt && ` · Expires ${new Date(sanction.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
            </p>
          </div>
        </div>
        {sanction.status === "active" && (
          <div className="flex gap-2 shrink-0">
            <button className="px-3 py-1.5 rounded-lg border text-xs hover:bg-gray-50"
              style={{ borderColor: "#E5E7EB", color: "#535353" }}
              onClick={(e) => { e.stopPropagation(); }}>
              <RotateCcw className="w-3 h-3 inline mr-1" /> Revoke
            </button>
          </div>
        )}
      </div>
      {expanded && sanction.notes && (
        <div className="mt-3 p-3 rounded-lg" style={{ background: "#F9FAFB" }}>
          <p className="text-xs" style={{ color: "#848484" }}>
            <span className="opacity-60">Notes:</span> {sanction.notes}
          </p>
        </div>
      )}
    </div>
  );
}

function CreateSanctionForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ userId: "", type: "warning", reason: "", duration: "7", notes: "" });

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="mb-4 flex items-center gap-2" style={{ color: "#535353" }}>
        <Plus className="w-5 h-5" style={{ color: "#7B5EA7" }} />
        Create New Sanction
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "#848484" }}>User ID / Name</label>
          <input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}
            placeholder="Search user..."
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: "#E5E7EB", color: "#535353" }} />
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "#848484" }}>Sanction Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: "#E5E7EB", color: "#535353" }}>
            <option value="warning">Warning</option>
            <option value="mute">Mute</option>
            <option value="suspension">Suspension</option>
            <option value="ban">Permanent Ban</option>
          </select>
        </div>
        {form.type !== "warning" && form.type !== "ban" && (
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "#848484" }}>Duration (days)</label>
            <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: "#E5E7EB", color: "#535353" }} />
          </div>
        )}
        <div className="sm:col-span-2">
          <label className="block text-xs mb-1.5" style={{ color: "#848484" }}>Reason</label>
          <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
            rows={2} placeholder="Describe the violation..."
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
            style={{ borderColor: "#E5E7EB", color: "#535353" }} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs mb-1.5" style={{ color: "#848484" }}>Internal Notes (optional)</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2} placeholder="Internal notes..."
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
            style={{ borderColor: "#E5E7EB", color: "#535353" }} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-6 py-2.5 rounded-xl text-white text-sm"
          style={{ background: "linear-gradient(135deg, #DB869A, #7B5EA7)" }}>
          Issue Sanction
        </button>
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm border"
          style={{ borderColor: "#E5E7EB", color: "#848484" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
