"use client";
import React from "react";
import { Package, Truck, CheckCircle2, Clock, MapPin, ArrowLeft, ChevronRight, Phone, ShieldCheck, ShoppingBag, HelpCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/shared/PageHero";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { shopService } from "@/backend/services/shop.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function OrderTrackingPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.orderTracking", "Order Tracking"));

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tracking, loading } = useAsyncData(() => shopService.getOrderTracking(id ?? ""), [id]);

  if (loading || !tracking) return <PageSkeleton />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFAB91 0%, #E64A19 100%)" className="pt-8 pb-32 px-6"><div className="max-w-4xl mx-auto"><h1 className="text-2xl font-bold text-white mb-8">Track Your Order</h1><div className="finance-card p-6 !bg-white/10 !backdrop-blur-xl !border-white/20 flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white"><Package className="w-7 h-7" /></div><div><p className="text-white font-bold text-lg">Order #ORD-55421</p><p className="text-white/70 text-sm">Placed on March 14, 2026</p></div></div><div className="text-right"><p className="text-white text-[10px] font-bold uppercase tracking-widest">Status</p><p className="text-xl font-black text-white mt-1">IN TRANSIT</p></div></div></div></PageHero>
      <div className="max-w-4xl mx-auto px-6 -mt-16"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-6"><div className="finance-card p-8"><h2 className="text-xl font-bold text-gray-800 mb-10 flex items-center justify-between">Delivery Status<span className="flex items-center gap-2 text-[#7CE577] text-xs font-bold"><Truck className="w-4 h-4 animate-bounce" /> Arriving by 04:00 PM</span></h2><div className="space-y-10 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">{[{ icon: CheckCircle2, title: "Order Confirmed", time: "March 14, 10:20 AM", done: true }, { icon: CheckCircle2, title: "Picked Up by Courier", time: "March 15, 08:30 AM", done: true }, { icon: Truck, title: "Out for Delivery", time: "Currently at Gulshan Sector 1", active: true }, { icon: ShoppingBag, title: "Delivered", time: "Pending", pending: true }].map((s, i) => (<div key={i} className={`flex gap-6 relative z-10 ${s.pending ? 'opacity-30' : ''}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white ${s.active ? 'bg-[#E64A19] text-white shadow-lg' : s.done ? 'bg-[#E8F9E7] text-[#5FB865] shadow-sm' : 'bg-gray-100 text-gray-400'}`}><s.icon className="w-5 h-5" /></div><div><p className="font-bold text-gray-800">{s.title}</p><p className={`text-xs ${s.active ? 'text-[#E64A19] font-medium' : 'text-gray-400'}`}>{s.time}</p></div></div>))}</div></div></div><div className="lg:col-span-1 space-y-6"><div className="finance-card p-8"><h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#E64A19]" />Delivery Address</h3><div className="p-4 rounded-2xl bg-gray-50 border border-gray-100"><p className="text-sm font-bold text-gray-800 mb-1">Zubayer Ahmed</p><p className="text-xs text-gray-500 leading-relaxed">House 24, Road 12, Block D, Banani, Dhaka - 1213</p></div></div><div className="finance-card p-8 bg-gray-900 text-white"><h3 className="font-bold mb-4 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-[#FEB4C5]" />Need Help?</h3><p className="text-xs text-white/50 mb-6">Contact our logistics team if you experience issues.</p><Button className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold">Report Issue</Button></div></div></div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}