import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, Shield, CreditCard, TrendingUp, AlertCircle, CheckCircle, Flag, Coins, Handshake } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { adminService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";

export default function AdminDashboardPage() {
  const { t } = useTranslation("common");
  useDocumentTitle(t("pageTitles.adminDashboard", "Dashboard"));

  const { data: dashboard, loading } = useAsyncData(() => adminService.getDashboardData());

  if (loading || !dashboard) return <PageSkeleton cards={4} />;

  const { userGrowth, revenueData, pieData, pendingItems, recentActivity } = dashboard;

  return (
    <>
      <div className="space-y-6">
        <div><h1 className="text-2xl" style={{ color: cn.text }}>Admin Dashboard</h1><p className="text-sm" style={{ color: cn.textSecondary }}>Platform overview \u2014 March 15, 2026</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{[{ label: "Total Users", value: "5,034", icon: Users, color: cn.purple, bg: cn.purpleBg, change: "+12% this month" }, { label: "Active Caregivers", value: "1,520", icon: Shield, color: cn.pink, bg: cn.pinkBg, change: "142 pending verify" }, { label: "Revenue (Mar)", value: "\u09F3 2.89L", icon: CreditCard, color: cn.green, bg: cn.greenBg, change: "+23% vs Feb" }, { label: "Platform Growth", value: "+18%", icon: TrendingUp, color: cn.amber, bg: cn.amberBg, change: "Month-over-month" }].map(s => { const Icon = s.icon; return (<div key={s.label} className="cn-stat-card"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}><Icon className="w-5 h-5" style={{ color: s.color }} /></div><TrendingUp className="w-4 h-4" style={{ color: cn.green }} /></div><p className="text-2xl" style={{ color: cn.text }}>{s.value}</p><p className="text-xs mt-0.5" style={{ color: cn.textSecondary }}>{s.label}</p><p className="text-xs mt-1" style={{ color: s.color }}>{s.change}</p></div>); })}</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{pendingItems.map(p => (<Link key={p.type} to={p.path} className="cn-card p-4 text-center"><div className="text-3xl mb-1" style={{ color: p.color }}>{p.count}</div><p className="text-sm" style={{ color: cn.textSecondary }}>Pending {p.type}</p></Link>))}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/wallet-management" className="cn-card-flat p-4 flex items-center gap-4 hover:shadow-md transition-shadow no-underline cn-touch-target"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: cn.purpleBg }}><Coins className="w-6 h-6" style={{ color: cn.purple }} /></div><div className="flex-1"><p className="text-xs" style={{ color: cn.textSecondary }}>Points in Circulation</p><p className="text-xl" style={{ color: cn.text }}>10.2M CP</p><p className="text-xs" style={{ color: cn.amber }}>31,020 CP in pending dues</p></div></Link>
          <Link to="/admin/contracts" className="cn-card-flat p-4 flex items-center gap-4 hover:shadow-md transition-shadow no-underline cn-touch-target"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: cn.pinkBg }}><Handshake className="w-6 h-6" style={{ color: cn.pink }} /></div><div className="flex-1"><p className="text-xs" style={{ color: cn.textSecondary }}>Contracts</p><p className="text-xl" style={{ color: cn.text }}>5 total</p><p className="text-xs" style={{ color: cn.green }}>Platform revenue: 20,020 CP</p></div></Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="cn-card-flat p-5"><h2 className="mb-4" style={{ color: cn.text }}>User Growth</h2><ResponsiveContainer width="100%" height={200}><BarChart data={userGrowth} barSize={8}><XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--cn-text-secondary)" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "var(--cn-text-secondary)" }} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="caregivers" fill="var(--cn-pink)" radius={[3, 3, 0, 0]} name="Caregivers" /><Bar dataKey="guardians" fill="var(--cn-green)" radius={[3, 3, 0, 0]} name="Guardians" /><Bar dataKey="patients" fill="var(--cn-purple)" radius={[3, 3, 0, 0]} name="Patients" /></BarChart></ResponsiveContainer></div>
          <div className="cn-card-flat p-5"><h2 className="mb-4" style={{ color: cn.text }}>Monthly Revenue (\u09F3)</h2><ResponsiveContainer width="100%" height={200}><LineChart data={revenueData}><XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--cn-text-secondary)" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "var(--cn-text-secondary)" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} /><Tooltip formatter={(v: number) => [`\u09F3 ${v.toLocaleString()}`, "Revenue"]} /><Line type="monotone" dataKey="revenue" stroke="var(--cn-purple)" strokeWidth={2.5} dot={{ fill: "var(--cn-purple)", r: 4 }} /></LineChart></ResponsiveContainer></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="cn-card-flat p-5"><h2 className="mb-4" style={{ color: cn.text }}>User Distribution</h2><div className="flex justify-center mb-4"><PieChart width={160} height={160}><Pie data={pieData} cx={80} cy={80} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">{pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie></PieChart></div><div className="space-y-2">{pieData.map(d => (<div key={d.name} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2" style={{ color: cn.text }}><span className="w-3 h-3 rounded-full inline-block" style={{ background: d.color }} />{d.name}</span><span style={{ color: d.color }}>{d.value.toLocaleString()}</span></div>))}</div></div>
          <div className="cn-card-flat p-5 lg:col-span-2"><h2 className="mb-4" style={{ color: cn.text }}>Recent Activity</h2><div className="space-y-3">{recentActivity.map((a, i) => (<div key={i} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: cn.borderLight }}><div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: a.type === "flag" ? cn.pinkBg : a.type === "resolve" ? cn.greenBg : cn.purpleBg }}>{a.type === "flag" ? <Flag className="w-4 h-4" style={{ color: cn.red }} /> : a.type === "resolve" ? <CheckCircle className="w-4 h-4" style={{ color: cn.green }} /> : a.type === "payment" ? <CreditCard className="w-4 h-4" style={{ color: cn.green }} /> : <AlertCircle className="w-4 h-4" style={{ color: cn.purple }} />}</div><div><p className="text-sm" style={{ color: cn.text }}>{a.text}</p><p className="text-xs mt-0.5" style={{ color: cn.textSecondary }}>{a.time}</p></div></div>))}</div></div>
        </div>
      </div>
    </>
  );
}
