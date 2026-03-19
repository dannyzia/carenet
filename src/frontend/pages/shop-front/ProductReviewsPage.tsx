"use client";
import React from "react";
import { Star, ArrowLeft, ChevronRight, ThumbsUp, MessageCircle, ShieldCheck, CheckCircle2, Filter, Search, Camera } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { shopService } from "@/backend/services/shop.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useParams } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/shared/PageHero";
import { useTranslation } from "react-i18next";

export default function ProductReviewsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.productReviews", "Product Reviews"));

  const { id } = useParams();
  const { data: reviews, loading } = useAsyncData(() => shopService.getProductReviews(id ?? ""), [id]);

  if (loading || !reviews) return <PageSkeleton />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFAB91 0%, #E64A19 100%)" className="pt-8 pb-32 px-6"><div className="max-w-4xl mx-auto"><div className="flex items-center gap-4 mb-8 text-white"><h1 className="text-2xl font-bold">Customer Reviews</h1></div><div className="finance-card p-8 !bg-white/10 !backdrop-blur-xl !border-white/20 text-white"><div className="flex flex-col md:flex-row items-center gap-12"><div className="text-center md:text-left"><p className="text-6xl font-black mb-2">4.8</p><div className="flex gap-1 mb-2 justify-center md:justify-start">{[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}</div><p className="text-white/60 text-xs font-bold uppercase tracking-widest">Based on 1,240 reviews</p></div><div className="flex-1 w-full space-y-2">{[{ stars: 5, pct: 85 }, { stars: 4, pct: 10 }, { stars: 3, pct: 3 }, { stars: 2, pct: 1 }, { stars: 1, pct: 1 }].map(r => (<div key={r.stars} className="flex items-center gap-4"><span className="text-[10px] font-bold w-4">{r.stars}</span><div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-white" style={{ width: `${r.pct}%` }} /></div><span className="text-[10px] font-bold text-white/40 w-8">{r.pct}%</span></div>))}</div><Button className="bg-white text-[#E64A19] hover:bg-white/90 font-black rounded-2xl h-14 px-8 shadow-xl">Write a Review</Button></div></div></div></PageHero>
      <div className="max-w-4xl mx-auto px-6 -mt-16"><div className="finance-card overflow-hidden"><div className="divide-y divide-gray-50">{reviews.map(i => (<div key={i.id} className="p-10 space-y-6 hover:bg-gray-50/30 transition-all"><div className="flex justify-between items-start"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-[#FFF5F7] flex items-center justify-center font-black text-[#DB869A]">A</div><div><div className="flex items-center gap-2 mb-1"><p className="font-bold text-gray-800">Ariful Islam</p><span className="flex items-center gap-1 text-[10px] font-bold text-[#5FB865] uppercase"><ShieldCheck className="w-3 h-3" /> Verified Buyer</span></div><div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}</div></div></div><p className="text-xs text-gray-300 font-medium">March {12-i}, 2026</p></div><p className="text-gray-600 leading-relaxed text-sm">"I bought this blood pressure monitor for my elderly father. Very easy to use with a large display. Highly recommend for home use."</p><div className="flex items-center gap-6 pt-4"><button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#5FB865]"><ThumbsUp className="w-3.5 h-3.5" /> Helpful (12)</button><button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#FEB4C5]"><MessageCircle className="w-3.5 h-3.5" /> Reply</button></div></div>))}</div><div className="p-8 border-t border-gray-50 text-center"><Button variant="ghost" className="text-sm font-bold text-[#E64A19]">Load More Reviews</Button></div></div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 3rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}