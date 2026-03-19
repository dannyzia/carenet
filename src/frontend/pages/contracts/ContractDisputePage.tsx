import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft, AlertTriangle, MessageSquare, Shield, Clock, CheckCircle,
  Send, FileText, User, Loader2, Scale, Eye, Paperclip,
} from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { useDisputeList, useDisputeDetail } from "@/frontend/hooks/useDisputes";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import type { ContractDispute, DisputeMessage } from "@/backend/models";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  open: { color: "#E8A838", bg: "#FFB54D20", label: "Open" },
  under_review: { color: "#3B82F6", bg: "#3B82F620", label: "Under Review" },
  mediation: { color: "#7B5EA7", bg: "#8082ED20", label: "Mediation" },
  resolved: { color: "#5FB865", bg: "#7CE57720", label: "Resolved" },
  closed: { color: "#848484", bg: "#84848420", label: "Closed" },
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  low: { color: "#5FB865", bg: "#7CE57720" },
  medium: { color: "#E8A838", bg: "#FFB54D20" },
  high: { color: "#EF4444", bg: "#EF444420" },
};

const ROLE_COLORS: Record<string, string> = {
  guardian: "#5FB865",
  agency: "#00897B",
  caregiver: "#DB869A",
  admin: "#7B5EA7",
  system: "#848484",
};

export default function ContractDisputePage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.contractDispute", "Contract Dispute"));

  const { id } = useParams();
  if (id) return <DisputeDetail disputeId={id} />;
  return <DisputeList />;
}

function DisputeList() {
  const { disputes, loading } = useDisputeList();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (loading) return <PageSkeleton cards={4} />;

  const filtered = statusFilter === "all" ? disputes : disputes.filter((d) => d.status === statusFilter);

  const stats = {
    total: disputes.length,
    active: disputes.filter((d) => !["resolved", "closed"].includes(d.status)).length,
    resolved: disputes.filter((d) => d.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/contracts" className="inline-flex items-center gap-1 text-sm hover:underline no-underline mb-2"
          style={{ color: cn.textSecondary }}>
          <ArrowLeft className="w-4 h-4" /> Back to Contracts
        </Link>
        <h1 className="text-2xl flex items-center gap-2" style={{ color: cn.text }}>
          <Scale className="w-6 h-6" style={{ color: "#7B5EA7" }} />
          Contract Disputes
        </h1>
        <p className="text-sm" style={{ color: cn.textSecondary }}>{stats.total} disputes · {stats.active} active</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Disputes", value: stats.total, icon: Scale, color: "#7B5EA7", bg: "#8082ED20" },
          { label: "Active", value: stats.active, icon: AlertTriangle, color: "#E8A838", bg: "#FFB54D20" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "#5FB865", bg: "#7CE57720" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: s.bg }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <p className="text-2xl" style={{ color: cn.text }}>{s.value}</p>
              <p className="text-xs" style={{ color: cn.textSecondary }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-white shadow-sm w-fit">
        {["all", "open", "under_review", "mediation", "resolved", "closed"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{
              background: statusFilter === s ? cn.bgInput : "transparent",
              color: statusFilter === s ? cn.text : cn.textSecondary,
            }}>
            {s === "all" ? "All" : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((d) => {
          const sc = STATUS_CONFIG[d.status];
          const pc = PRIORITY_CONFIG[d.priority];
          return (
            <Link key={d.id} to={`/contracts/disputes/${d.id}`}
              className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow no-underline"
              style={{ borderLeft: `4px solid ${pc.color}` }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm" style={{ color: cn.text }}>{d.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: pc.bg, color: pc.color }}>
                      {d.priority}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: cn.text }}>{d.reason}</p>
                </div>
                <span className="text-xs shrink-0" style={{ color: cn.textSecondary }}>
                  {new Date(d.filedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p className="text-xs line-clamp-2 mb-2" style={{ color: cn.textSecondary }}>{d.description}</p>
              <div className="flex items-center gap-3 text-xs" style={{ color: cn.textSecondary }}>
                <span>Filed by: {d.filedBy} ({d.filedByRole})</span>
                <span>Against: {d.againstParty}</span>
                <span>Contract: {d.contractId}</span>
                <span className="ml-auto flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {d.messages.length}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DisputeDetail({ disputeId }: { disputeId: string }) {
  const { dispute, loading } = useDisputeDetail(disputeId);
  const [newMessage, setNewMessage] = useState("");

  if (loading || !dispute) return <PageSkeleton cards={4} />;

  const sc = STATUS_CONFIG[dispute.status];
  const pc = PRIORITY_CONFIG[dispute.priority];
  const isActive = !["resolved", "closed"].includes(dispute.status);

  return (
    <div className="space-y-6">
      <Link to="/contracts/disputes" className="inline-flex items-center gap-1 text-sm hover:underline no-underline"
        style={{ color: cn.textSecondary }}>
        <ArrowLeft className="w-4 h-4" /> Back to Disputes
      </Link>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl" style={{ color: cn.text }}>{dispute.id}</h1>
              <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: sc.bg, color: sc.color }}>
                {sc.label}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: pc.bg, color: pc.color }}>
                {dispute.priority}
              </span>
            </div>
            <p className="text-sm" style={{ color: cn.textSecondary }}>
              Contract: <Link to={`/contracts/${dispute.contractId}`} className="hover:underline" style={{ color: cn.pink }}>
                {dispute.contractId}
              </Link>
            </p>
          </div>
        </div>

        <p className="text-sm mb-4" style={{ color: cn.text }}>{dispute.reason}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl" style={{ background: cn.bgInput }}>
            <p className="text-xs mb-2" style={{ color: cn.textSecondary }}>Filed By</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                style={{ background: ROLE_COLORS[dispute.filedByRole] || cn.pink }}>
                {dispute.filedBy.charAt(0)}
              </div>
              <div>
                <p className="text-sm" style={{ color: cn.text }}>{dispute.filedBy}</p>
                <p className="text-xs" style={{ color: cn.textSecondary }}>{dispute.filedByRole}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: cn.bgInput }}>
            <p className="text-xs mb-2" style={{ color: cn.textSecondary }}>Against</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                style={{ background: cn.teal }}>
                {dispute.againstParty.charAt(0)}
              </div>
              <div>
                <p className="text-sm" style={{ color: cn.text }}>{dispute.againstParty}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl" style={{ background: "#F9FAFB" }}>
          <p className="text-sm" style={{ color: cn.text }}>{dispute.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="mb-3 flex items-center gap-2" style={{ color: cn.text }}>
          <Paperclip className="w-5 h-5" style={{ color: cn.amber }} />
          Evidence ({dispute.evidence.length})
        </h2>
        <div className="space-y-2">
          {dispute.evidence.map((ev, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: cn.bgInput }}>
              <FileText className="w-4 h-4 shrink-0" style={{ color: cn.textSecondary }} />
              <span className="text-sm flex-1" style={{ color: cn.text }}>{ev}</span>
              <button className="text-xs px-2 py-1 rounded-lg" style={{ color: cn.pink }}>View</button>
            </div>
          ))}
        </div>
      </div>

      {dispute.resolution && (
        <div className="bg-white rounded-2xl shadow-sm p-5" style={{ borderLeft: "4px solid #5FB865" }}>
          <h2 className="mb-2 flex items-center gap-2" style={{ color: "#5FB865" }}>
            <CheckCircle className="w-5 h-5" />
            Resolution
          </h2>
          <p className="text-sm" style={{ color: cn.text }}>{dispute.resolution}</p>
          {dispute.resolvedAt && (
            <p className="text-xs mt-2" style={{ color: cn.textSecondary }}>
              Resolved on {new Date(dispute.resolvedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="mb-4 flex items-center gap-2" style={{ color: cn.text }}>
          <MessageSquare className="w-5 h-5" style={{ color: "#3B82F6" }} />
          Dispute Thread ({dispute.messages.length} messages)
        </h2>
        <div className="space-y-4">
          {dispute.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {isActive && (
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${cn.borderLight}` }}>
            <div className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={2}
                placeholder="Type your response..."
                className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: cn.border, color: cn.text }}
              />
              <button
                className="self-end px-4 py-3 rounded-xl text-white text-sm shrink-0"
                style={{ background: "var(--cn-gradient-guardian)" }}
                disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: DisputeMessage }) {
  const roleColor = ROLE_COLORS[message.senderRole] || "#848484";

  if (message.isSystemMessage) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="flex-1 h-px" style={{ background: cn.borderLight }} />
        <span className="text-[10px] px-3 py-1 rounded-full shrink-0"
          style={{ background: cn.bgInput, color: cn.textSecondary }}>
          {message.message}
        </span>
        <div className="flex-1 h-px" style={{ background: cn.borderLight }} />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5"
        style={{ background: roleColor }}>
        {message.senderName.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm" style={{ color: cn.text }}>{message.senderName}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px]"
            style={{ background: `${roleColor}20`, color: roleColor }}>
            {message.senderRole}
          </span>
          <span className="text-xs ml-auto" style={{ color: cn.textSecondary }}>
            {new Date(message.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className="p-3 rounded-xl" style={{ background: cn.bgInput }}>
          <p className="text-sm" style={{ color: cn.text }}>{message.message}</p>
        </div>
      </div>
    </div>
  );
}
