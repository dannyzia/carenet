"use client";

import React, { useState } from "react";
import { FileText, ArrowLeft, Save, Edit3, ChevronRight, ShieldCheck, Globe, Clock, Search, History, Layout, ExternalLink, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate } from "react-router";
import { PageHero } from "@/frontend/components/PageHero";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { adminService } from "@/backend/services/admin.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function PolicyManagerPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.policyManager", "Policy Manager"));

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("terms");
  const { data: policyData, loading } = useAsyncData(() => adminService.getPolicyData());

  if (loading || !policyData) return <PageSkeleton />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #1F2937 0%, #111827 100%)" className="pt-8 pb-32 px-6"><div className="max-w-6xl mx-auto"><div className="flex justify-between items-center mb-12 text-white"><div className="flex items-center gap-4"><h1 className="text-2xl font-bold">Legal & Policy CMS</h1></div><div className="flex gap-3"><Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl font-bold"><History className="w-4 h-4 mr-2" /> Revision History</Button><Button className="bg-[#7CE577] hover:bg-[#5FB865] text-white font-black rounded-xl h-11 px-6 shadow-lg"><Save className="w-4 h-4 mr-2" /> Deploy Changes</Button></div></div><div className="flex gap-8 border-b border-white/10">{[{ id: "terms", label: "Terms of Service" }, { id: "privacy", label: "Privacy Policy" }, { id: "medical", label: "Medical Disclaimer" }, { id: "refund", label: "Refund Policy" }].map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`pb-4 text-sm font-bold transition-all relative ${activeTab === t.id ? 'text-white' : 'text-white/40 hover:text-white/60'}`}>{t.label}{activeTab === t.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FEB4C5] rounded-full" />}</button>))}</div></div></PageHero>
      <div className="max-w-6xl mx-auto px-6 -mt-16"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6"><div className="finance-card p-10 md:p-16"><div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black text-gray-800">Current Version: v2.4.0</h2><span className="px-3 py-1 rounded-full bg-[#E8F9E7] text-[#5FB865] text-[10px] font-black uppercase tracking-widest">Active Live</span></div><div className="space-y-8"><div className="space-y-4"><h3 className="font-bold text-gray-800 text-lg">Section 1: Service Definitions</h3><textarea className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 outline-none min-h-[200px] text-sm text-gray-600 leading-loose" defaultValue="CareNet acts as a platform connector between verified independent caregivers and family guardians. We do not employ caregivers directly unless specified through the 'Agency Managed' tier. Services include home nursing, companion care, and clinical diagnostics." /></div><div className="space-y-4"><h3 className="font-bold text-gray-800 text-lg">Section 2: Payment Escrow</h3><textarea className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 outline-none min-h-[200px] text-sm text-gray-600 leading-loose" defaultValue="All payments are processed through the CareNet Secure Escrow system. Funds are held until shift completion is confirmed by both parties. Any disputes must be raised within 24 hours of service termination." /></div></div></div></div>
        <aside className="lg:col-span-1 space-y-6"><div className="finance-card p-8 bg-[#111827] text-white"><h3 className="font-bold mb-6 flex items-center gap-2"><Globe className="w-4 h-4 text-[#7CE577]" />Deployment Status</h3><div className="space-y-6"><div className="flex justify-between text-[10px] font-black uppercase text-white/40"><span>Last Published</span><span className="text-white">Mar 01, 2026</span></div><div className="flex justify-between text-[10px] font-black uppercase text-white/40"><span>Publisher</span><span className="text-white">Legal_Team_04</span></div><div className="pt-6 border-t border-white/10"><p className="text-xs text-white/60 leading-relaxed mb-6">Deploying changes will force all users to re-accept the terms upon next login.</p><label className="flex items-center gap-3 cursor-pointer"><div className="w-5 h-5 rounded border-2 border-white/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-[#7CE577]" /></div><span className="text-[10px] font-black uppercase">Force Re-acceptance</span></label></div></div></div><div className="finance-card p-8"><h3 className="font-bold text-gray-800 mb-6">Language Localization</h3><div className="space-y-3"><div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"><span className="text-xs font-bold text-gray-700">English (Primary)</span><ShieldCheck className="w-4 h-4 text-[#7CE577]" /></div><div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 opacity-50"><span className="text-xs font-bold text-gray-700">Bangla (Translation)</span><Edit3 className="w-4 h-4" /></div></div></div><div className="finance-card p-8 border-l-4 border-orange-400"><div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-5 h-5 text-orange-400" /><h3 className="font-black text-orange-700 text-xs uppercase">Compliance Check</h3></div><p className="text-[10px] text-gray-500">Your current Privacy Policy meets 100% of the Digital Bangladesh Data Act 2025 requirements.</p></div></aside>
      </div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2.5rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}