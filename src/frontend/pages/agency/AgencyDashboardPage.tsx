import { cn } from "@/frontend/theme/tokens";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, CreditCard, TrendingUp, Star, ArrowRight, CheckCircle, Clock, Coins, Handshake } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { agencyService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useEffect } from "react";
import { marketplaceService } from "@/backend/services/marketplace.service";
import { useAriaToast } from "@/frontend/hooks/useAriaToast";

export default function AgencyDashboardPage() {
  const { t } = useTranslation("common");
  useDocumentTitle(t("pageTitles.agencyDashboard", "Dashboard"));

  const toast = useAriaToast();
  const { data: caregivers, loading: lC } = useAsyncData(() => agencyService.getCaregivers());
  const { data: revenueData, loading: lR } = useAsyncData(() => agencyService.getRevenueChartData());
  const loading = lC || lR;

  // Listen for package subscription notifications
  useEffect(() => {
    const unsubscribe = marketplaceService.onPackageSubscription((agencyId, packageTitle) => {
      toast.success(`New subscriber! A guardian just subscribed to "${packageTitle}"`, {
        duration: 6000,
        description: "Check your packages for details.",
      });
    });
    return unsubscribe;
  }, []);

  if (loading || !caregivers || !revenueData) return <PageSkeleton cards={4} />;

  return (
    <>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-semibold" style={{ color: "#535353" }}>Agency Dashboard</h1><p className="text-sm" style={{ color: "#848484" }}>HealthCare Pro BD — March 15, 2026</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Caregivers", value: "24", icon: Users, color: "#00897B", bg: "#26C6DA20" },
            { label: "Active Clients", value: "18", icon: Users, color: "#DB869A", bg: "#FEB4C520" },
            { label: "Revenue (Mar)", value: "\u09F3 3.12L", icon: CreditCard, color: "#5FB865", bg: "#7CE57720" },
            { label: "Avg Rating", value: "4.8 \u2605", icon: Star, color: "#E8A838", bg: "#FFB54D20" },
          ].map(s => { const Icon = s.icon; return (
            <div key={s.label} className="stat-card"><div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}><Icon className="w-5 h-5" style={{ color: s.color }} /></div><p className="text-xl font-bold" style={{ color: "#535353" }}>{s.value}</p><p className="text-xs" style={{ color: "#848484" }}>{s.label}</p></div>
          ); })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/wallet?role=agency" className="stat-card flex items-center gap-4 no-underline hover:shadow-md transition-shadow"><div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#26C6DA20" }}><Coins className="w-6 h-6" style={{ color: "#00897B" }} /></div><div className="flex-1"><p className="text-xs" style={{ color: "#848484" }}>CarePoints Balance</p><p className="text-xl font-bold" style={{ color: "#535353" }}>3,12,000 CP</p><p className="text-xs" style={{ color: "#E8A838" }}>Fee due: 9,310 CP</p></div><ArrowRight className="w-4 h-4" style={{ color: "#848484" }} /></Link>
          <Link to="/contracts?role=agency" className="stat-card flex items-center gap-4 no-underline hover:shadow-md transition-shadow"><div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEB4C520" }}><Handshake className="w-6 h-6" style={{ color: "#DB869A" }} /></div><div className="flex-1"><p className="text-xs" style={{ color: "#848484" }}>Active Contracts</p><p className="text-xl font-bold" style={{ color: "#535353" }}>3</p><p className="text-xs" style={{ color: "#E8A838" }}>2 pending offers</p></div><ArrowRight className="w-4 h-4" style={{ color: "#848484" }} /></Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="finance-card p-5 lg:col-span-2"><h2 className="font-semibold mb-4" style={{ color: "#535353" }}>Monthly Revenue (\u09F3)</h2><ResponsiveContainer width="100%" height={200}><BarChart data={revenueData}><XAxis dataKey="month" tick={{ fontSize: 12, fill: "#848484" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: "#848484" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} /><Tooltip formatter={(v: number) => [`\u09F3 ${v.toLocaleString()}`, "Revenue"]} /><Bar dataKey="amount" fill="#00897B" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
          <div className="finance-card p-5"><div className="flex items-center justify-between mb-4"><h2 className="font-semibold" style={{ color: "#535353" }}>Top Caregivers</h2><Link to="/agency/caregivers" className="text-xs hover:underline" style={{ color: "#00897B" }}>View all</Link></div><div className="space-y-3">{caregivers.slice(0, 3).map(c => (<div key={c.name} className="flex items-center gap-3"><div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #80CBC4 0%, #00897B 100%)" }}>{c.name.charAt(0)}</div><div className="flex-1"><p className="text-sm font-medium" style={{ color: "#535353" }}>{c.name}</p><p className="text-xs" style={{ color: "#848484" }}>\u2605 {c.rating} \u2022 {c.jobs} jobs</p></div><span className="badge-pill" style={{ background: c.status === "active" ? "#7CE57720" : "#FFB54D20", color: c.status === "active" ? "#5FB865" : "#E8A838" }}>{c.status}</span></div>))}</div></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{ label: "Manage Caregivers", path: "/agency/caregivers", color: "#00897B" }, { label: "View Clients", path: "/agency/clients", color: "#DB869A" }, { label: "Payments", path: "/agency/payments", color: "#5FB865" }, { label: "Reports", path: "/agency/reports", color: "#7B5EA7" }].map(a => (<Link key={a.label} to={a.path} className="finance-card p-4 text-center hover:scale-105 transition-transform"><p className="text-sm font-medium" style={{ color: a.color }}>{a.label}</p><ArrowRight className="w-4 h-4 mx-auto mt-2" style={{ color: a.color }} /></Link>))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: ".stat-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.25rem; } .finance-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); } .badge-pill { display: inline-flex; align-items: center; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 500; }" }} />
    </>
  );
}
