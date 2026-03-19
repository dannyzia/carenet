"use client";
import React from "react";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Search, Filter, ChevronRight, ShoppingBag, Star, Plus } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate, Link } from "react-router";
import { PageHero } from "@/frontend/components/shared/PageHero";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { shopService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function WishlistPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.wishlist", "Wishlist"));

  const { data: mockWishlist, loading } = useAsyncData(() => shopService.getWishlist());
  const navigate = useNavigate();

  if (loading || !mockWishlist) return <PageSkeleton cards={3} />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)" className="pt-8 pb-32 px-6"><div className="max-w-5xl mx-auto"><div className="flex justify-between items-center mb-8"><h1 className="text-2xl font-bold text-white">My Wishlist</h1><Button className="bg-white text-[#DB869A] hover:bg-white/90 font-bold rounded-2xl px-6 h-12 shadow-lg"><ShoppingCart className="w-5 h-5 mr-2" /> Move All to Cart</Button></div><div className="finance-card p-6 !bg-white/10 !backdrop-blur-xl !border-white/20 flex items-center justify-between text-white"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"><Heart className="w-7 h-7 fill-white" /></div><div><p className="font-bold text-lg">Favorite Care Items</p><p className="text-white/70 text-sm">{mockWishlist.length} items saved for later</p></div></div></div></div></PageHero>
      <div className="max-w-5xl mx-auto px-6 -mt-16"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{mockWishlist.map((item) => (<div key={item.id} className="finance-card overflow-hidden group"><div className="aspect-square relative overflow-hidden bg-gray-50"><img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={item.name} /><button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600"><Trash2 className="w-5 h-5" /></button></div><div className="p-6"><div className="flex items-center gap-1 mb-2"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-xs font-bold text-gray-800">{item.rating}</span></div><h3 className="font-bold text-gray-800 text-sm mb-4 truncate">{item.name}</h3><div className="flex justify-between items-center mb-6"><span className="text-xl font-black text-gray-800">{item.price}</span><span className="text-[10px] font-bold text-gray-400 uppercase">In Stock</span></div><Button className="w-full h-12 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-gray-800">Add to Cart</Button></div></div>))}<button className="finance-card border-dashed border-2 border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-[#FEB4C5] hover:bg-[#FFF5F7] transition-all min-h-[400px]"><div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center"><ShoppingBag className="w-6 h-6" /></div><p className="font-bold">Discover More Products</p></button></div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2.5rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}