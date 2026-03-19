import { useState, useMemo } from "react";
import { useAdminContracts } from "@/frontend/hooks/useContracts";
import { useDebouncedValue } from "@/frontend/hooks/useDebouncedValue";
import { RealtimeStatusIndicator } from "@/frontend/components/RealtimeStatusIndicator";
import { Link } from "react-router";
import type { CareContract, ContractStatus } from "@/frontend/utils/contracts";
import { ResponsiveTable, type Column } from "@/frontend/components/ResponsiveTable";
import { cn } from "@/frontend/theme/tokens";
import { Search, Handshake, Coins, Shield, CheckCircle, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { formatBDT } from "@/frontend/utils/currency";
import { formatPoints, pointsToBDT } from "@/frontend/utils/points";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

const STATUS_CONFIG: Record<ContractStatus, { color: string; bg: string; label: string }> = {
  draft: { color: "#848484", bg: "#84848420", label: "Draft" }, offered: { color: "#3B82F6", bg: "#3B82F620", label: "Offered" },
  negotiating: { color: "#E8A838", bg: "#FFB54D20", label: "Negotiating" }, accepted: { color: "#5FB865", bg: "#7CE57720", label: "Accepted" },
  active: { color: "#00897B", bg: "#26C6DA20", label: "Active" }, completed: { color: "#7B5EA7", bg: "#8082ED20", label: "Completed" },
  cancelled: { color: "#EF4444", bg: "#EF444420", label: "Cancelled" }, disputed: { color: "#EF4444", bg: "#EF444420", label: "Disputed" },
};

export default function AdminContractsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.adminContracts", "Admin Contracts"));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ContractStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "guardian_agency" | "agency_caregiver">("all");
  const debouncedSearch = useDebouncedValue(search, 300);
  const filterOpts = useMemo(() => ({ status: statusFilter !== "all" ? statusFilter : undefined, type: typeFilter !== "all" ? typeFilter : undefined, search: debouncedSearch || undefined }), [statusFilter, typeFilter, debouncedSearch]);
  const { contracts: allContracts, loading, error, refetch } = useAdminContracts(filterOpts);

  if (loading && allContracts.length === 0) { return (<div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: cn.pink }} /><p className="text-sm" style={{ color: cn.textSecondary }}>Loading contracts...</p></div>); }

  const filtered = allContracts;
  const totalValue = allContracts.reduce((s, c) => s + c.totalValue, 0);
  const totalFees = allContracts.reduce((s, c) => s + c.platformRevenue, 0);
  const activeContracts = allContracts.filter((c) => c.status === "active").length;
  const negotiatingContracts = allContracts.filter((c) => ["negotiating", "offered"].includes(c.status)).length;

  const columns: Column<CareContract>[] = [
    { key: "id", label: "Contract", primary: true, render: (row) => (<div><Link to={`/contracts/${row.id}`} className="text-sm hover:underline" style={{ color: cn.pink }}>{row.id}</Link><p className="text-xs" style={{ color: cn.textSecondary }}>{row.serviceType}</p></div>) },
    { key: "type", label: "Type", hideOnMobile: true, render: (row) => (<span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: cn.bgInput, color: cn.textSecondary }}>{row.type === "guardian_agency" ? "G\u2194A" : "A\u2194C"}</span>) },
    { key: "partyA" as keyof CareContract, label: "Parties", render: (row) => (<div className="flex items-center gap-1 text-xs" style={{ color: cn.text }}>{row.partyA.name.split(" ")[0]}<ArrowRight className="w-3 h-3" style={{ color: cn.textSecondary }} />{row.partyB.name.split(" ")[0]}</div>) },
    { key: "totalValue", label: "Value", render: (row) => (<span className="text-sm" style={{ color: cn.text }}>{row.totalValue > 0 ? formatPoints(row.totalValue, { compact: true }) : "TBD"}</span>) },
    { key: "platformRevenue", label: "Fee", hideOnMobile: true, render: (row) => (<span className="text-xs" style={{ color: cn.purple }}>{row.platformRevenue > 0 ? formatPoints(row.platformRevenue) : "\u2013"}</span>) },
    { key: "status", label: "Status", render: (row) => { const cfg = STATUS_CONFIG[row.status]; return (<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>); } },
    { key: "createdAt", label: "Created", hideOnMobile: true, render: (row) => (<span className="text-xs" style={{ color: cn.textSecondary }}>{new Date(row.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>) },
  ];

  const mobileCard = (row: CareContract) => { const cfg = STATUS_CONFIG[row.status]; return (<Link to={`/contracts/${row.id}`} className="block no-underline space-y-2"><div className="flex items-center justify-between"><div><p className="text-sm" style={{ color: cn.text }}>{row.id}</p><p className="text-xs" style={{ color: cn.textSecondary }}>{row.serviceType}</p></div><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></div><div className="flex items-center gap-1 text-xs" style={{ color: cn.text }}>{row.partyA.name} <ArrowRight className="w-3 h-3" style={{ color: cn.textSecondary }} /> {row.partyB.name}</div><div className="flex items-center justify-between text-xs"><span style={{ color: cn.text }}>{row.totalValue > 0 ? formatPoints(row.totalValue, { compact: true }) : "Negotiating"}</span>{row.platformRevenue > 0 && (<span style={{ color: cn.purple }}>Fee: {formatPoints(row.platformRevenue)}</span>)}</div></Link>); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl" style={{ color: cn.text }}><Handshake className="w-6 h-6 inline-block mr-2 -mt-1" />Contracts Overview<RealtimeStatusIndicator variant="badge" className="ml-2 align-middle" /></h1><p className="text-sm" style={{ color: cn.textSecondary }}>Monitor all contracts, negotiations, and platform revenue</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[{ label: "Total Contract Value", value: formatPoints(totalValue, { compact: true }), sub: `\u2248 ${formatBDT(pointsToBDT(totalValue), { compact: true })}`, icon: Coins, color: "#5FB865", bg: "#7CE57720" }, { label: "Platform Revenue (Fees)", value: formatPoints(totalFees, { compact: true }), sub: "From all contracts", icon: Shield, color: "#7B5EA7", bg: "#8082ED20" }, { label: "Active Contracts", value: String(activeContracts), sub: "Currently running", icon: CheckCircle, color: "#00897B", bg: "#26C6DA20" }, { label: "In Negotiation", value: String(negotiatingContracts), sub: "Awaiting agreement", icon: MessageSquare, color: "#E8A838", bg: "#FFB54D20" }].map(s => { const Icon = s.icon; return (<div key={s.label} className="cn-stat-card"><div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: s.bg }}><Icon className="w-5 h-5" style={{ color: s.color }} /></div><p className="text-lg" style={{ color: cn.text }}>{s.value}</p><p className="text-xs" style={{ color: cn.textSecondary }}>{s.label}</p><p className="text-xs mt-0.5" style={{ color: s.color }}>{s.sub}</p></div>); })}</div>
      <div className="finance-card p-5"><div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: cn.textSecondary }} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contract ID, party name, patient..." className="pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none w-full" style={{ borderColor: cn.border, background: cn.bgInput, color: cn.text }} /></div><div className="flex gap-2"><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | ContractStatus)} className="px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: cn.border, background: cn.bgInput, color: cn.text }}><option value="all">All Status</option><option value="negotiating">Negotiating</option><option value="offered">Offered</option><option value="active">Active</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "all" | "guardian_agency" | "agency_caregiver")} className="px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: cn.border, background: cn.bgInput, color: cn.text }}><option value="all">All Types</option><option value="guardian_agency">Guardian \u2194 Agency</option><option value="agency_caregiver">Agency \u2194 Caregiver</option></select></div></div><ResponsiveTable columns={columns} data={filtered} keyExtractor={(row) => row.id} mobileCard={mobileCard} emptyMessage="No contracts match your filters" /></div>
    </div>
  );
}