import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import { ShoppingBag, Search, Filter, MoreVertical, ArrowLeft, ArrowRight, Download, Eye, Clock, CheckCircle, Package, Truck } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { shopService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function ShopOrdersPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.shopOrders", "Shop Orders"));

  const [activeTab, setActiveTab] = useState("All");
  const { data: orders, loading } = useAsyncData(() => shopService.getMerchantOrders());

  if (loading || !orders) return <PageSkeleton cards={3} />;

  const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  return (
    <><div className="space-y-6"><div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold text-gray-800">Orders</h1><p className="text-gray-500">Track and manage customer orders.</p></div><button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50"><Download className="w-4 h-4" /><span>Export Report</span></button></div><div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto w-fit">{tabs.map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:bg-gray-200"}`}>{tab}</button>))}</div><div className="finance-card"><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50 text-gray-500 text-xs font-medium uppercase tracking-wider"><th className="px-6 py-4">Order ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Product</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Payment</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{orders.map((order) => (<tr key={order.id} className="table-row"><td className="px-6 py-4 text-sm font-medium text-gray-800">{order.id}</td><td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td><td className="px-6 py-4 text-sm text-gray-600">{order.product}</td><td className="px-6 py-4 text-sm font-bold text-gray-800">{order.amount}</td><td className="px-6 py-4"><span className={`badge-pill ${order.status === "Delivered" ? "bg-green-100 text-green-700" : order.status === "Processing" ? "bg-blue-100 text-blue-700" : order.status === "Shipped" ? "bg-purple-100 text-purple-700" : order.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{order.status}</span></td><td className="px-6 py-4 text-sm text-gray-500">{order.payment}</td><td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-orange-600"><Eye className="w-4 h-4" /></button></div></td></tr>))}</tbody></table></div></div></div></>
  );
}