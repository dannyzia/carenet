import { useState } from "react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { shopService } from "@/backend/services/shop.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { cn } from "@/frontend/theme/tokens";
import { ClipboardList, Search, Filter, MoreVertical, ArrowDownCircle, AlertCircle, CheckCircle, Package, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ShopInventoryPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.shopInventory", "Shop Inventory"));

  const [searchTerm, setSearchTerm] = useState("");
  const { data: inventory, loading } = useAsyncData(() => shopService.getInventory());

  if (loading || !inventory) return <PageSkeleton />;

  const inventoryItems = inventory.map((item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    stock: item.stock,
    threshold: item.threshold,
    status: item.status,
  }));
  return (
    <><div className="space-y-6"><div><h1 className="text-2xl font-bold text-gray-800">Inventory Tracking</h1><p className="text-gray-500">Keep track of your stock levels and set low stock alerts.</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="stat-card flex items-center gap-4"><div className="p-3 rounded-full bg-blue-100 text-blue-600"><Package className="w-6 h-6" /></div><div><p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total SKUs</p><h3 className="text-2xl font-bold text-gray-800">142</h3></div></div><div className="stat-card flex items-center gap-4"><div className="p-3 rounded-full bg-orange-100 text-orange-600"><AlertCircle className="w-6 h-6" /></div><div><p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Low Stock</p><h3 className="text-2xl font-bold text-gray-800">12</h3></div></div><div className="stat-card flex items-center gap-4"><div className="p-3 rounded-full bg-red-100 text-red-600"><TrendingDown className="w-6 h-6" /></div><div><p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Out of Stock</p><h3 className="text-2xl font-bold text-gray-800">4</h3></div></div></div><div className="flex gap-3"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search by SKU or Product Name..." className="input-field pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div><div className="finance-card"><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50 text-gray-500 text-xs font-medium uppercase tracking-wider"><th className="px-6 py-4">Product Name</th><th className="px-6 py-4">SKU</th><th className="px-6 py-4">Current Stock</th><th className="px-6 py-4">Threshold</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{inventoryItems.map((item) => (<tr key={item.id} className="table-row"><td className="px-6 py-4 text-sm font-medium text-gray-800">{item.name}</td><td className="px-6 py-4 text-sm text-gray-500 font-mono tracking-tighter">{item.sku}</td><td className="px-6 py-4 text-sm text-gray-800">{item.stock}</td><td className="px-6 py-4 text-sm text-gray-500">{item.threshold}</td><td className="px-6 py-4"><span className={`badge-pill ${item.status === "Healthy" ? "bg-green-100 text-green-700" : item.status === "Low Stock" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>{item.status}</span></td><td className="px-6 py-4 text-right"><button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">Restock</button></td></tr>))}</tbody></table></div></div></div></>
  );
}