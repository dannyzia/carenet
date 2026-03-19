import { cn } from "@/frontend/theme/tokens";
import { Package, ShoppingBag, TrendingUp, Users, ArrowUpRight, ArrowDownRight, MoreVertical, Search, Filter, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { shopService } from "@/backend/services/shop.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";

export default function ShopDashboardPage() {
  const { t } = useTranslation("common");
  useDocumentTitle(t("pageTitles.shopDashboard", "Dashboard"));

  const { data: recentOrders, loading } = useAsyncData(() => shopService.getShopDashboardOrders());

  if (loading || !recentOrders) return <PageSkeleton cards={4} />;

  const stats = [
    { label: "Total Sales", value: "\u09F31,24,500", icon: ShoppingBag, change: "+12.5%", positive: true },
    { label: "Active Products", value: "48", icon: Package, change: "+2", positive: true },
    { label: "New Orders", value: "12", icon: TrendingUp, change: "-5%", positive: false },
    { label: "Total Customers", value: "850", icon: Users, change: "+18%", positive: true },
  ];

  return (
    <>
      <div className="space-y-6">
        <div><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h1 className="text-2xl font-bold text-gray-800">Shop Dashboard</h1><p className="text-gray-500">Welcome back! Here's what's happening with your store today.</p></div><button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm cn-touch-target shrink-0" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #00BCD4 0%, #0097A7 100%)" }}><UserPlus className="w-4 h-4" /> Invite Shop Manager</button></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{stats.map((stat, idx) => (<div key={idx} className="stat-card"><div className="flex justify-between items-start mb-4"><div className="p-2 rounded-lg bg-orange-50 text-orange-600"><stat.icon className="w-5 h-5" /></div><div className={`flex items-center text-xs font-medium ${stat.positive ? "text-green-600" : "text-red-600"}`}>{stat.positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}{stat.change}</div></div><h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3><p className="text-sm text-gray-500">{stat.label}</p></div>))}</div>
        <div className="finance-card"><div className="p-6 border-b border-gray-100 flex justify-between items-center"><h2 className="text-lg font-bold text-gray-800">Recent Orders</h2><button className="text-sm font-medium text-orange-600 hover:text-orange-700">View All</button></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50 text-gray-500 text-xs font-medium uppercase tracking-wider"><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Product</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Date</th></tr></thead><tbody className="divide-y divide-gray-100">{recentOrders.map((order) => (<tr key={order.id} className="table-row"><td className="px-6 py-4 text-sm font-medium text-gray-800">{order.id}</td><td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td><td className="px-6 py-4 text-sm text-gray-600">{order.product}</td><td className="px-6 py-4 text-sm font-bold text-gray-800">{order.amount}</td><td className="px-6 py-4"><span className={`badge-pill ${order.status === "Delivered" ? "bg-green-100 text-green-700" : order.status === "Processing" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>{order.status}</span></td><td className="px-6 py-4 text-sm text-gray-500">{order.date}</td></tr>))}</tbody></table></div></div>
      </div>
    </>
  );
}
