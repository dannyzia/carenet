"use client";

import React from "react";
import { Scale, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, MessageSquare, User, History, FileText, ShieldAlert, Gavel, ChevronRight, Info } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { PageHero } from "@/frontend/components/PageHero";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { adminService } from "@/backend/services/admin.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function DisputeAdjudicationPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.disputeAdjudication", "Dispute Adjudication"));

  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading } = useAsyncData(() => adminService.getDisputeData());

  if (loading || !data) return <PageSkeleton />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #1F2937 0%, #111827 100%)" className="pt-8 pb-32 px-6"><div className="max-w-6xl mx-auto"><div className="flex justify-between items-center mb-12"><div className="flex items-center gap-4"><h1 className="text-2xl font-bold text-white">Dispute Adjudication</h1></div><div className="flex gap-2"><Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl h-11 px-6 shadow-lg"><History className="w-4 h-4 mr-2" /> View History</Button><Button className="bg-[#7CE577] hover:bg-[#5FB865] text-white font-bold rounded-xl h-11 px-6 shadow-lg"><Gavel className="w-4 h-4 mr-2" /> New Resolution</Button></div></div><div className="grid grid-cols-1 md:grid-cols-4 gap-6">{data.stats.map((s, i) => { const icons = [Scale, AlertTriangle, ShieldAlert, CheckCircle2]; const Icon = icons[i]; return (<div key={i} className="finance-card p-6 !bg-white/5 !backdrop-blur-xl !border-white/10 text-white"><Icon className="w-5 h-5 text-white/40 mb-3" /><p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mb-2">{s.label}</p><p className="text-2xl font-black">{s.val}</p></div>); })}</div></div></PageHero>
      <div className="max-w-6xl mx-auto px-6 -mt-16"><div className="finance-card p-8"><h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2"><Scale className="w-5 h-5 text-[#DB869A]" />Active Disputes</h2><div className="space-y-4">{data.disputes.map((d, i) => (<div key={d.id} className="p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-[#FEB4C5] transition-all gap-4"><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.status === 'escalated' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}><AlertTriangle className="w-5 h-5" /></div><div><p className="text-sm font-bold text-gray-800">{d.id}</p><p className="text-xs text-gray-400 mt-1">{d.parties}</p><div className="flex items-center gap-3 mt-1"><span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{d.type}</span><span className="text-[10px] text-gray-300">&bull; {d.date}</span></div></div></div><div className="flex items-center gap-3"><span className="text-sm font-bold text-gray-800">{d.amount}</span><span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${d.status === 'escalated' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>{d.status}</span><Button variant="ghost" size="sm" className="text-[10px] font-bold text-[#DB869A]">Review <ChevronRight className="w-3 h-3 ml-1" /></Button></div></div>))}</div></div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2.5rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}
