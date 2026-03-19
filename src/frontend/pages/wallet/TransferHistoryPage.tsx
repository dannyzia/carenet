import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowLeft, ArrowUpRight, ArrowDownRight, ArrowRightLeft, Download,
  Search, Filter, Calendar, CreditCard, Coins, Clock, ChevronRight,
  TrendingUp, ShoppingCart, Gift, Shield, Ban, Sparkles, Loader2,
} from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { useWallet } from "@/frontend/hooks/useWallet";
import { formatPoints, pointsToBDT } from "@/frontend/utils/points";
import { formatBDT } from "@/frontend/utils/currency";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

const TX_ICON_MAP: Record<string, { icon: typeof ArrowUpRight; color: string; bg: string; label: string }> = {
  purchase: { icon: ShoppingCart, color: "#5FB865", bg: "#7CE57720", label: "Purchase" },
  withdrawal: { icon: ArrowUpRight, color: "#EF4444", bg: "#EF444420", label: "Withdrawal" },
  contract_payment: { icon: ArrowUpRight, color: "#EF4444", bg: "#EF444420", label: "Contract Payment" },
  earning: { icon: ArrowDownRight, color: "#5FB865", bg: "#7CE57720", label: "Earning" },
  platform_fee: { icon: Shield, color: "#7B5EA7", bg: "#8082ED20", label: "Platform Fee" },
  commission: { icon: TrendingUp, color: "#E8A838", bg: "#FFB54D20", label: "Commission" },
  admin_credit: { icon: Gift, color: "#00897B", bg: "#26C6DA20", label: "Admin Credit" },
  admin_debit: { icon: Ban, color: "#EF4444", bg: "#EF444420", label: "Admin Debit" },
  bonus: { icon: Sparkles, color: "#DB869A", bg: "#FEB4C520", label: "Bonus" },
  refund: { icon: ArrowRightLeft, color: "#5FB865", bg: "#7CE57720", label: "Refund" },
  transfer: { icon: ArrowRightLeft, color: "#3B82F6", bg: "#3B82F620", label: "Transfer" },
};

export default function TransferHistoryPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.transferHistory", "Transfer History"));

  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "guardian";
  const { wallet, transactions, loading } = useWallet(role);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"all" | "7d" | "30d" | "90d">("all");

  if (loading || !wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: cn.pink }} />
        <p className="text-sm" style={{ color: cn.textSecondary }}>Loading transfer history...</p>
      </div>
    );
  }

  const now = Date.now();
  const dateThresholds: Record<string, number> = {
    "7d": 7 * 86400000,
    "30d": 30 * 86400000,
    "90d": 90 * 86400000,
  };

  const filtered = transactions.filter((t) => {
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) && !(t.counterparty || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (dateRange !== "all") {
      const txTime = new Date(t.createdAt).getTime();
      if (now - txTime > dateThresholds[dateRange]) return false;
    }
    return true;
  });

  const totalCredits = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  const roleGradient = role === "guardian"
    ? "var(--cn-gradient-guardian)"
    : role === "agency"
    ? "var(--cn-gradient-agency)"
    : "var(--cn-gradient-caregiver)";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link to={`/wallet?role=${role}`} className="inline-flex items-center gap-1 text-sm hover:underline no-underline mb-2"
            style={{ color: cn.textSecondary }}>
            <ArrowLeft className="w-4 h-4" /> Back to Wallet
          </Link>
          <h1 className="text-2xl" style={{ color: cn.text }}>Transfer History</h1>
          <p className="text-sm" style={{ color: cn.textSecondary }}>
            {wallet.userName} · {filtered.length} transactions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border"
          style={{ borderColor: cn.border, color: cn.text }}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 text-white" style={{ background: roleGradient }}>
          <p className="text-xs opacity-70">Current Balance</p>
          <p className="text-2xl mt-1">{formatPoints(wallet.balance)}</p>
          <p className="text-xs opacity-60">{formatBDT(pointsToBDT(wallet.balance))}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="w-5 h-5" style={{ color: "#5FB865" }} />
            <span className="text-xs" style={{ color: cn.textSecondary }}>Total Credits (filtered)</span>
          </div>
          <p className="text-xl" style={{ color: "#5FB865" }}>+{formatPoints(totalCredits)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-5 h-5" style={{ color: "#EF4444" }} />
            <span className="text-xs" style={{ color: cn.textSecondary }}>Total Debits (filtered)</span>
          </div>
          <p className="text-xl" style={{ color: "#EF4444" }}>-{formatPoints(totalDebits)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: cn.textSecondary }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: cn.border, color: cn.text }} />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: cn.border, color: cn.text }}>
            <option value="all">All Types</option>
            {Object.entries(TX_ICON_MAP).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: cn.border, color: cn.text }}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: cn.bgInput }}>
            {(["all", "7d", "30d", "90d"] as const).map((d) => (
              <button key={d} onClick={() => setDateRange(d)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: dateRange === d ? cn.bgCard : "transparent",
                  color: dateRange === d ? cn.text : cn.textSecondary,
                  boxShadow: dateRange === d ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}>
                {d === "all" ? "All" : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="mb-4" style={{ color: cn.text }}>
          Transactions ({filtered.length})
        </h2>
        <div className="space-y-1">
          {filtered.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: cn.textSecondary }}>No transactions match your filters</p>
          )}
          {filtered.map((t) => {
            const iconInfo = TX_ICON_MAP[t.type] || TX_ICON_MAP.transfer;
            const Icon = iconInfo.icon;
            const isCredit = t.amount > 0;
            return (
              <div key={t.id} className="flex items-center justify-between py-3 border-b last:border-0"
                style={{ borderColor: cn.borderLight }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: iconInfo.bg }}>
                    <Icon className="w-4 h-4" style={{ color: iconInfo.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm truncate" style={{ color: cn.text }}>{t.description}</p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: cn.textSecondary }}>
                      <span>{new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      {t.counterparty && <span>· {t.counterparty}</span>}
                      <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: iconInfo.bg, color: iconInfo.color }}>
                        {iconInfo.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm" style={{ color: isCredit ? "#5FB865" : cn.text }}>
                    {isCredit ? "+" : ""}{formatPoints(t.amount)}
                  </p>
                  <p className="text-xs" style={{ color: cn.textSecondary }}>
                    Bal: {formatPoints(t.balanceAfter)}
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px]"
                    style={{
                      background: t.status === "completed" ? "#7CE57720" : t.status === "pending" ? "#FFB54D20" : "#EF444420",
                      color: t.status === "completed" ? "#5FB865" : t.status === "pending" ? "#E8A838" : "#EF4444",
                    }}>
                    {t.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
