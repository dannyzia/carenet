import { useState } from "react";
import { Link } from "react-router";
import {
  Flag, AlertTriangle, CheckCircle2, ArrowUpCircle,
  Plus, Clock, User, Heart, Filter,
} from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { agencyService } from "@/backend/services";
import { cn } from "@/frontend/theme/tokens";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import type { AgencyIncident, IncidentSeverity, IncidentStatus } from "@/backend/models";
import { useTranslation } from "react-i18next";

// ─── Severity config ───
const severityConfig: Record<IncidentSeverity, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical", color: cn.red,   bg: "rgba(239,68,68,0.1)" },
  high:     { label: "High",     color: cn.amber,  bg: cn.amberBg },
  medium:   { label: "Medium",   color: cn.blue,   bg: cn.blueBg },
  low:      { label: "Low",      color: cn.green,  bg: cn.greenBg },
};

// ─── Status config ───
const statusConfig: Record<IncidentStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  "open":      { label: "Open",       color: cn.amber, bg: cn.amberBg,              icon: Clock },
  "in-review": { label: "In Review",  color: cn.blue,  bg: cn.blueBg,               icon: Filter },
  "resolved":  { label: "Resolved",   color: cn.green, bg: cn.greenBg,              icon: CheckCircle2 },
  "escalated": { label: "Escalated",  color: cn.red,   bg: "rgba(239,68,68,0.1)",   icon: ArrowUpCircle },
};

// ─── Filter tab types ───
type StatusFilter   = IncidentStatus | "all";
type SeverityFilter = IncidentSeverity | "all";

const statusTabs:   { key: StatusFilter;   label: string }[] = [
  { key: "all",       label: "All" },
  { key: "open",      label: "Open" },
  { key: "in-review", label: "In Review" },
  { key: "escalated", label: "Escalated" },
  { key: "resolved",  label: "Resolved" },
];

const severityPills: { key: SeverityFilter; label: string }[] = [
  { key: "all",      label: "All Severity" },
  { key: "critical", label: "Critical" },
  { key: "high",     label: "High" },
  { key: "medium",   label: "Medium" },
  { key: "low",      label: "Low" },
];

// ─── Format ISO timestamp to relative time ───
function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AgencyIncidentsPage() {
  const { t } = useTranslation("common");
  useDocumentTitle(t("pageTitles.incidentManagement", "Incident Management"));

  const [statusFilter,   setStatusFilter]   = useState<StatusFilter>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");

  const { data: incidents, loading } = useAsyncData(() => agencyService.getIncidents());

  if (loading || !incidents) return <PageSkeleton cards={4} />;

  // ─── Derived counts for stat strip ───
  const counts = {
    open:      incidents.filter(i => i.status === "open").length,
    inReview:  incidents.filter(i => i.status === "in-review").length,
    escalated: incidents.filter(i => i.status === "escalated").length,
    resolved:  incidents.filter(i => i.status === "resolved").length,
  };

  // ─── Apply filters ───
  const filtered = incidents.filter(i => {
    const statusMatch   = statusFilter   === "all" || i.status   === statusFilter;
    const severityMatch = severityFilter === "all" || i.severity === severityFilter;
    return statusMatch && severityMatch;
  });

  return (
    <div className="space-y-6">

      {/* ─── Page header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.1)" }}>
            <Flag className="w-5 h-5" style={{ color: cn.red }} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl" style={{ color: cn.text }}>Incident Management</h1>
            <p className="text-sm" style={{ color: cn.textSecondary }}>
              View, manage, and resolve reported incidents
            </p>
          </div>
        </div>
        <Link
          to="/agency/incident-report"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white no-underline"
          style={{ background: "var(--cn-gradient-agency)" }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Report New Incident
        </Link>
      </div>

      {/* ─── Stat strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open",      value: counts.open,      color: cn.amber, bg: cn.amberBg,            icon: Clock },
          { label: "In Review", value: counts.inReview,  color: cn.blue,  bg: cn.blueBg,             icon: Filter },
          { label: "Escalated", value: counts.escalated, color: cn.red,   bg: "rgba(239,68,68,0.1)", icon: ArrowUpCircle },
          { label: "Resolved",  value: counts.resolved,  color: cn.green, bg: cn.greenBg,            icon: CheckCircle2 },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                style={{ background: stat.bg }}>
                <Icon className="w-4 h-4" style={{ color: stat.color }} aria-hidden="true" />
              </div>
              <p className="text-xl" style={{ color: cn.text }}>{stat.value}</p>
              <p className="text-xs" style={{ color: cn.textSecondary }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* ─── Status filter tabs ─── */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {statusTabs.map(tab => {
          const count = tab.key === "all"
            ? incidents.length
            : incidents.filter(i => i.status === tab.key).length;
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className="px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all flex items-center gap-1.5"
              style={{
                background: isActive ? cn.tealBg : "transparent",
                color: isActive ? cn.teal : cn.textSecondary,
              }}
            >
              {tab.label}
              <span className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: isActive ? `${cn.teal}25` : `${cn.textSecondary}18` }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Severity pills ─── */}
      <div className="flex flex-wrap gap-2">
        {severityPills.map(pill => {
          const isActive = severityFilter === pill.key;
          const cfg = pill.key !== "all" ? severityConfig[pill.key] : null;
          return (
            <button
              key={pill.key}
              onClick={() => setSeverityFilter(pill.key)}
              className="px-3 py-1 rounded-full text-xs transition-all border"
              style={{
                background:   isActive && cfg ? cfg.bg    : "transparent",
                color:        isActive && cfg ? cfg.color : cn.textSecondary,
                borderColor:  isActive && cfg ? cfg.color : cn.border,
              }}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* ─── Incident cards ─── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="finance-card p-12 text-center">
            <Flag className="w-10 h-10 mx-auto mb-3" style={{ color: cn.textSecondary }} aria-hidden="true" />
            <p className="text-sm mb-2" style={{ color: cn.text }}>No incidents match your filters</p>
            <button
              onClick={() => { setStatusFilter("all"); setSeverityFilter("all"); }}
              className="text-xs underline"
              style={{ color: cn.teal }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map(incident => {
            const sevCfg = severityConfig[incident.severity];
            const stsCfg = statusConfig[incident.status];
            const StatusIcon = stsCfg.icon;
            const isActionable = incident.status === "open" || incident.status === "in-review";

            return (
              <div
                key={incident.id}
                className="finance-card p-4 sm:p-5 transition-all hover:shadow-md"
                style={{
                  borderLeft: incident.severity === "critical"
                    ? `3px solid ${cn.red}`
                    : incident.severity === "high"
                    ? `3px solid ${cn.amber}`
                    : undefined,
                }}
              >
                {/* Top row — ID + badges */}
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono" style={{ color: cn.textSecondary }}>
                      {incident.id}
                    </span>
                    {/* Severity badge */}
                    <span
                      className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                      style={{ background: sevCfg.bg, color: sevCfg.color }}
                    >
                      <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                      {sevCfg.label}
                    </span>
                  </div>
                  {/* Status badge */}
                  <span
                    className="px-2.5 py-1 rounded-full text-xs flex items-center gap-1"
                    style={{ background: stsCfg.bg, color: stsCfg.color }}
                  >
                    <StatusIcon className="w-3 h-3" aria-hidden="true" />
                    {stsCfg.label}
                  </span>
                </div>

                {/* Title + description */}
                <p className="text-sm mb-1" style={{ color: cn.text, fontWeight: 500 }}>
                  {incident.title}
                </p>
                <p
                  className="text-xs mb-3 line-clamp-2"
                  style={{ color: cn.textSecondary }}
                >
                  {incident.description}
                </p>

                {/* Meta row — reported by, patient, time */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs"
                  style={{ color: cn.textSecondary }}>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" aria-hidden="true" />
                    {incident.reportedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" style={{ color: cn.pink }} aria-hidden="true" />
                    {incident.patientName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {timeAgo(incident.reportedAt)}
                  </span>
                </div>

                {/* Resolution note (if resolved) */}
                {incident.resolutionNote && (
                  <div
                    className="px-3 py-2 rounded-lg text-xs mb-3"
                    style={{ background: cn.greenBg, color: cn.green }}
                  >
                    <span style={{ fontWeight: 500 }}>Resolution: </span>
                    {incident.resolutionNote}
                  </div>
                )}

                {/* Action buttons */}
                <div
                  className="flex items-center gap-2 pt-3 flex-wrap"
                  style={{ borderTop: `1px solid ${cn.border}` }}
                >
                  {incident.status === "open" && (
                    <button
                      onClick={() => agencyService.escalateIncident(incident.id)}
                      className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 border"
                      style={{ borderColor: cn.red, color: cn.red }}
                    >
                      <ArrowUpCircle className="w-3 h-3" aria-hidden="true" />
                      Escalate
                    </button>
                  )}
                  {isActionable && (
                    <button
                      onClick={() => agencyService.resolveIncident(incident.id, "Resolved by agency manager.")}
                      className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                      style={{ background: cn.greenBg, color: cn.green }}
                    >
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      Mark Resolved
                    </button>
                  )}
                  <span className="ml-auto text-xs" style={{ color: cn.textSecondary }}>
                    {incident.placementId && `Placement: ${incident.placementId}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
