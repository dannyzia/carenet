import { useState } from "react";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { Link } from "react-router";
import { Search, Filter, ShoppingCart, Star, ArrowLeft, Heart, Eye, Package, ChevronDown } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { shopService } from "@/backend/services";
import { useTranslation } from "react-i18next";

export default function ProductListPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.productList", "Product List"));

  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, loading } = useAsyncData(() => shopService.getShopFrontProducts());

  if (loading || !products) return <PageSkeleton cards={4} />;

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-20"><div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between"><div className="flex items-center gap-4"><Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-all"><ArrowLeft className="w-5 h-5 text-gray-600" /></Link><h1 className="text-xl font-bold text-gray-800">CareNet Shop</h1></div><Link to="/shop/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-all"><ShoppingCart className="w-6 h-6 text-gray-600" /><span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FEB4C5] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">3</span></Link></div></div>
      <div className="max-w-7xl mx-auto px-4 py-8"><div className="rounded-3xl p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between" style={{ background: "linear-gradient(135deg, #FEB4C5 0%, #DB869A 100%)" }}><div className="z-10 text-white space-y-4 md:max-w-md text-center md:text-left"><h2 className="text-3xl font-bold leading-tight">Quality Care Products Delivered to Your Door</h2><p className="text-white/80">Get up to 20% off on your first order.</p><Button className="bg-white text-[#DB869A] hover:bg-white/90 rounded-xl px-8 py-6 text-lg font-bold">Shop Now</Button></div><div className="relative mt-8 md:mt-0"><Package className="w-32 h-32 md:w-48 md:h-48 text-white/40 rotate-12" /></div></div>
      <div className="flex flex-col md:flex-row gap-4 mb-8"><div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search products, brands..." className="w-full h-14 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#FEB4C5] outline-none text-gray-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">{["All", "Medical Devices", "Mobility", "Sleep Aids", "Daily Living", "Hygiene", "Nutrition"].map((cat, idx) => (<button key={idx} className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-medium transition-all ${idx === 0 ? "bg-[#DB869A] text-white shadow-md shadow-[#DB869A]/20" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"}`}>{cat}</button>))}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{products.map((product) => (<Link key={product.id} to={`/shop/product/${product.id}`} className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-50"><div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50"><img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" /><button className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-gray-400 hover:text-red-500 transition-all"><Heart className="w-5 h-5" /></button></div><div className="space-y-1"><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{product.category}</span><h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-[#DB869A] transition-all">{product.name}</h3><div className="flex items-center gap-1 mb-2"><Star className="w-3.5 h-3.5 text-orange-400 fill-current" /><span className="text-xs font-bold text-gray-700">{product.rating}</span><span className="text-xs text-gray-400">({product.reviews})</span></div><div className="flex items-center justify-between pt-2"><div className="flex flex-col"><span className="text-lg font-black text-gray-900">{product.price}</span><span className="text-xs text-gray-400 line-through">{product.oldPrice}</span></div><button className="p-3 rounded-2xl bg-[#7CE577]/10 text-[#5FB865] hover:bg-[#7CE577] hover:text-white transition-all shadow-sm"><ShoppingCart className="w-5 h-5" /></button></div></div></Link>))}</div>
      <div className="mt-12 text-center"><Button variant="outline" className="px-12 py-6 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 border-gray-200">Load More Products</Button></div></div>
    </div>
  );
}