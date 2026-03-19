"use client";
import React from "react";
import { ShoppingBag, Filter, ChevronRight, ArrowLeft, Search, Star, ShoppingCart, Heart, Truck, ShieldCheck, Plus } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate, useParams, Link } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { shopService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { PageHero } from "@/frontend/components/shared/PageHero";
import { useTranslation } from "react-i18next";

export default function ProductCategoryPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.productCategory", "Product Category"));

  const { data: mockProducts, loading } = useAsyncData(() => shopService.getProducts());
  const navigate = useNavigate();
  const { category = "Medical Equipment" } = useParams();

  if (loading || !mockProducts) return <PageSkeleton cards={4} />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFAB91 0%, #E64A19 100%)" className="pt-8 pb-32 px-6"><div className="max-w-6xl mx-auto"><div className="flex justify-between items-center mb-8"><h1 className="text-2xl font-bold text-white capitalize">{category}</h1><Button className="bg-white text-[#E64A19] hover:bg-white/90 rounded-xl h-12 px-6 font-bold shadow-lg"><ShoppingCart className="w-5 h-5 mr-2" /> Cart (0)</Button></div><div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">{["All Products", "Best Sellers", "New Arrivals", "Top Rated", "On Sale"].map(f => (<button key={f} className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-sm font-bold whitespace-nowrap hover:bg-white/20 transition-all">{f}</button>))}</div></div></PageHero>
      <div className="max-w-6xl mx-auto px-6 -mt-16"><div className="flex flex-col md:flex-row gap-8"><aside className="w-full md:w-64 space-y-6 flex-shrink-0"><div className="finance-card p-6"><h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Filter className="w-4 h-4 text-[#E64A19]" /> Filters</h3><div className="space-y-6"><div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Price Range</p><div className="space-y-2">{["Under \u09F31,000", "\u09F31,000 - \u09F35,000", "\u09F35,000 - \u09F310,000", "Above \u09F310,000"].map(p => (<label key={p} className="flex items-center gap-2 cursor-pointer group"><div className="w-4 h-4 rounded border-2 border-gray-200 group-hover:border-[#E64A19] transition-colors" /><span className="text-sm text-gray-600 group-hover:text-gray-800">{p}</span></label>))}</div></div></div></div><div className="finance-card p-6 bg-gradient-to-br from-[#FFAB91]/20 to-[#E64A19]/20 border-[#FFAB91]/30"><Truck className="w-6 h-6 text-[#E64A19] mb-4" /><p className="text-xs font-bold text-gray-800 mb-2">Free Delivery</p><p className="text-[10px] text-gray-500">On all orders above \u09F310,000 across Dhaka City.</p></div></aside><main className="flex-1 space-y-6"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{mockProducts.map((p) => (<Link key={p.id} to={`/shop/product/${p.id}`} className="finance-card overflow-hidden group hover:translate-y-[-4px] transition-all"><div className="aspect-square relative overflow-hidden bg-gray-50"><img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} /><button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"><Heart className="w-5 h-5" /></button></div><div className="p-6"><div className="flex items-center gap-1 mb-2"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-xs font-bold text-gray-800">{p.rating}</span></div><h3 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-[#E64A19] transition-colors truncate">{p.name}</h3><p className="text-[10px] text-gray-400 font-bold uppercase mb-4">{p.category}</p><div className="flex justify-between items-center"><span className="text-lg font-black text-gray-800">{p.price}</span><Button size="icon" className="w-10 h-10 rounded-xl bg-[#E64A19] hover:bg-[#D84315] text-white shadow-lg"><Plus className="w-5 h-5" /></Button></div></div></Link>))}</div></main></div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); } .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }" }} />
    </div>
  );
}