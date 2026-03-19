"use client";
import { Link } from "react-router";
import { CheckCircle, Package, ArrowRight, Download, Home, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function OrderSuccessPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.orderSuccess", "Order Success"));

  const orderNumber = "ORD-9428-BNG";
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-12">
        <div className="relative"><div className="absolute inset-0 bg-[#7CE577]/20 rounded-full blur-[4rem] scale-150 animate-pulse" /><div className="w-40 h-40 bg-white rounded-[3rem] shadow-2xl shadow-green-100 border border-green-50 flex items-center justify-center mx-auto relative group"><div className="w-24 h-24 rounded-[2rem] bg-[#7CE577] flex items-center justify-center text-white shadow-xl shadow-[#7CE577]/40 group-hover:scale-110 transition-all duration-500"><CheckCircle className="w-12 h-12" /></div><div className="absolute -top-4 -right-4 p-4 rounded-2xl bg-[#DB869A] text-white shadow-lg animate-bounce"><Package className="w-6 h-6" /></div></div></div>
        <div className="space-y-4"><div className="inline-block px-4 py-1.5 rounded-full bg-[#7CE577]/10 text-[#5FB865] text-xs font-black uppercase tracking-[0.2em]">Order Confirmed</div><h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Thank You for Your Trust!</h1><p className="text-gray-400 text-sm leading-relaxed font-medium">Your order <span className="text-gray-800 font-black">{orderNumber}</span> has been successfully placed.</p></div>
        <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 space-y-6"><div className="flex justify-between items-center text-left"><div className="space-y-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimated Delivery</p><p className="text-gray-800 font-bold">March 17 - March 18, 2026</p></div><div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#7CE577] shadow-sm"><Truck className="w-6 h-6" /></div></div></div>
        <div className="flex flex-col sm:flex-row gap-4"><Link to="/shop" className="flex-1"><Button className="w-full h-16 rounded-3xl bg-[#DB869A] text-white font-black hover:bg-[#DB869A]/90 shadow-xl flex items-center justify-center gap-2">Continue Shopping<ArrowRight className="w-5 h-5" /></Button></Link><Link to="/" className="flex-1"><Button variant="outline" className="w-full h-16 rounded-3xl border-gray-200 text-gray-600 font-black hover:bg-gray-50 flex items-center justify-center gap-2"><Home className="w-5 h-5" />Back to Home</Button></Link></div>
      </div>
    </div>
  );
}