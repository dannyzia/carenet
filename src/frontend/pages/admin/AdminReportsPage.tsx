import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import { Flag, CheckCircle, XCircle, Eye, Clock, AlertTriangle } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { adminService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import type { AdminReport } from "@/backend/models";
import { useTranslation } from "react-i18next";

const priorityConfig: Record<string, { color: string; bg: string }> = { low: { color: "#5FB865", bg: "#7CE57720" }, medium: { color: "#E8A838", bg: "#FFB54D20" }, high: { color: "#EF4444", bg: "#EF444420" }, critical: { color: "#7B1F3A", bg: "#DB869A30" } };
const statusConfig: Record<string, { color: string; bg: string; label: string; icon: React.ElementType }> = { open: { color: "#EF4444", bg: "#EF444420", label: "Open", icon: AlertTriangle }, investigating: { color: "#E8A838", bg: "#FFB54D20", label: "Investigating", icon: Clock }, resolved: { color: "#5FB865", bg: "#7CE57720", label: "Resolved", icon: CheckCircle } };

export default function AdminReportsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.adminReports", "Admin Reports"));

  const { data: reports, loading } = useAsyncData(() => adminService.getReports());
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<AdminReport | null>(null);

  if (loading || !reports) return <PageSkeleton cards={4} />;

  const filtered = reports.filter(r => statusFilter === "all" || r.status === statusFilter);

  return (
    <>
      <div className="space-y-5">
        <div><h1 className="text-2xl font-semibold" style={{ color: "#535353" }}>Reports & Disputes</h1><p className="text-sm" style={{ color: "#848484" }}>Manage user-reported issues and platform violations</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[{ label: "Open Reports", value: reports.filter(r => r.status === "open").length, color: "#EF4444", bg: "#EF444420" }, { label: "Investigating", value: reports.filter(r => r.status === "investigating").length, color: "#E8A838", bg: "#FFB54D20" }, { label: "Resolved", value: reports.filter(r => r.status === "resolved").length, color: "#5FB865", bg: "#7CE57720" }, { label: "Critical", value: reports.filter(r => r.priority === "critical").length, color: "#7B1F3A", bg: "#DB869A30" }].map(s => (<div key={s.label} className="stat-card flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}><span className="text-xl font-bold" style={{ color: s.color }}>{s.value}</span></div><p className="text-sm font-medium" style={{ color: "#535353" }}>{s.label}</p></div>))}</div>
        <div className="flex gap-2 flex-wrap">{[["all", "All"], ["open", "Open"], ["investigating", "Investigating"], ["resolved", "Resolved"]].map(([val, label]) => (<button key={val} onClick={() => setStatusFilter(val)} className="px-4 py-2 rounded-lg text-sm transition-all" style={{ background: statusFilter === val ? "#7B5EA7" : "white", color: statusFilter === val ? "white" : "#535353", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>{label}</button>))}</div>
        <div className="space-y-3">{filtered.map(r => { const sc = statusConfig[r.status]; const pc = priorityConfig[r.priority]; const StatusIcon = sc.icon; return (<div key={r.id} className="finance-card p-5"><div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: pc.bg }}><Flag className="w-5 h-5" style={{ color: pc.color }} /></div><div className="flex-1"><div className="flex flex-wrap items-center gap-2 mb-1"><span className="badge-pill" style={{ background: pc.bg, color: pc.color }}>{r.priority}</span><span className="badge-pill" style={{ background: sc.bg, color: sc.color }}><StatusIcon className="w-3 h-3 mr-1" />{sc.label}</span><span className="badge-pill" style={{ background: "#F3F4F6", color: "#848484" }}>{r.type}</span></div><p className="text-sm font-medium" style={{ color: "#535353" }}><span style={{ color: "#DB869A" }}>{r.reporter}</span> reported against <span style={{ color: "#7B5EA7" }}>{r.against}</span></p><p className="text-sm mt-1 leading-snug" style={{ color: "#848484" }}>{r.reason}</p><p className="text-xs mt-2" style={{ color: "#848484" }}>Filed: {r.date}</p></div></div><div className="flex flex-wrap gap-2 shrink-0"><button onClick={() => setSelected(r)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs" style={{ borderColor: "#E5E7EB", color: "#535353" }}><Eye className="w-3 h-3" /> Review</button>{r.status === "open" && (<button className="px-3 py-1.5 rounded-lg text-white text-xs" style={{ background: "#E8A838" }}>Investigate</button>)}{r.status !== "resolved" && (<button className="px-3 py-1.5 rounded-lg text-white text-xs" style={{ background: "#5FB865" }}>Resolve</button>)}</div></div></div>); })}</div>
      </div>
      {selected && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="finance-card p-6 max-w-lg w-full"><div className="flex justify-between mb-4"><h2 className="font-semibold" style={{ color: "#535353" }}>Report #{selected.id} Details</h2><button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded" style={{ color: "#848484" }}>\u2715</button></div><div className="space-y-3 mb-5">{[["Type", selected.type], ["Priority", selected.priority], ["Reporter", selected.reporter], ["Against", selected.against], ["Date Filed", selected.date]].map(([l, v]) => (<div key={l} className="flex justify-between text-sm"><span style={{ color: "#848484" }}>{l}</span><span className="font-medium" style={{ color: "#535353" }}>{v}</span></div>))}</div><div className="p-3 rounded-lg mb-5" style={{ background: "#F9FAFB" }}><p className="text-xs font-medium mb-1" style={{ color: "#848484" }}>Reported Reason</p><p className="text-sm" style={{ color: "#535353" }}>{selected.reason}</p></div><div><label className="block text-sm font-medium mb-2" style={{ color: "#535353" }}>Admin Notes</label><textarea className="w-full p-3 border rounded-lg text-sm outline-none" rows={3} placeholder="Add investigation notes..." style={{ borderColor: "#E5E7EB", color: "#535353" }} /></div><div className="flex gap-3 mt-4"><button className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: "#5FB865" }}>Mark Resolved</button><button className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: "#EF4444" }}>Escalate</button></div></div></div>)}
      <style dangerouslySetInnerHTML={{ __html: ".stat-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1rem; } .finance-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); } .badge-pill { display: inline-flex; align-items: center; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 500; }" }} />
    </>
  );
}