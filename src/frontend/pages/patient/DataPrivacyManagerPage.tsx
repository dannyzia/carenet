"use client";
import React, { useState } from "react";
import { ShieldCheck, ArrowLeft, ChevronRight, Lock, User, Eye, EyeOff, History, CheckCircle2, XCircle, Clock, AlertCircle, Database, Globe, Settings } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/shared/PageHero";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { patientService } from "@/backend/services/patient.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function DataPrivacyManagerPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.dataPrivacyManager", "Data Privacy Manager"));

  const navigate = useNavigate();
  const { data: privacy, loading } = useAsyncData(() => patientService.getPrivacyData());

  if (loading || !privacy) return <PageSkeleton />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #111827 0%, #000000 100%)" className="pt-8 pb-32 px-6"><div className="max-w-4xl mx-auto"><div className="flex justify-between items-center mb-12 text-white"><h1 className="text-2xl font-bold">Privacy & Health Vault</h1><div className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-2"><Lock className="w-3 h-3" /> 256-bit Encryption Active</div></div><div className="finance-card p-10 !bg-white/10 !backdrop-blur-xl !border-white/20 text-white flex items-center justify-between"><div className="flex items-center gap-6"><div className="w-16 h-16 rounded-3xl bg-blue-500 flex items-center justify-center shadow-2xl"><ShieldCheck className="w-8 h-8" /></div><div><h2 className="text-2xl font-black mb-1">Your Privacy Controls</h2><p className="text-white/50 text-sm">Manage who can see your clinical records and vital logs.</p></div></div><Button variant="ghost" className="text-white hover:bg-white/10 font-bold border border-white/20 rounded-xl h-12 px-6">Download Data</Button></div></div></PageHero>
      <div className="max-w-4xl mx-auto px-6 -mt-16"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-6"><div className="finance-card p-8"><h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-500" />Currently Authorized</h3><div className="space-y-4">{privacy.authorized.map((auth, i) => (<div key={i} className="p-5 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-all"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all"><User className="w-5 h-5" /></div><div><p className="font-bold text-gray-800 text-sm">{auth.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{auth.role} {"\u2022"} {auth.level}</p></div></div><div className="text-right"><p className="text-[10px] text-[#5FB865] font-black uppercase mb-2">{auth.expires}</p><button className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">Revoke</button></div></div>))}</div></div><div className="finance-card p-8"><h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2"><History className="w-5 h-5 text-gray-400" />Data Access Logs</h3><div className="space-y-4 font-mono">{privacy.accessLogs.map((log, i) => (<div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 text-[10px]"><span className="text-gray-800 font-bold">{log.user} <span className="text-gray-400 font-normal">{"\u2192"} {log.action}</span></span><span className="text-gray-300">{log.time}</span></div>))}</div></div></div><aside className="lg:col-span-1 space-y-6"><div className="finance-card p-8 bg-[#FFF5F7] border-[#FEB4C5]/20"><h3 className="font-black text-[#DB869A] uppercase tracking-widest text-xs mb-6">Vault Lockdown</h3><p className="text-xs text-gray-500 leading-relaxed mb-8">In an emergency, your Guardian can override privacy locks to share data with hospital personnel.</p></div><div className="finance-card p-8"><h3 className="font-bold text-gray-800 mb-6">Data Export</h3><p className="text-xs text-gray-400 leading-relaxed mb-6">Request a complete copy of your health records.</p><Button className="w-full h-11 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Request JSON Export</Button></div><div className="finance-card p-6 border-l-4 border-[#7CE577] bg-[#E8F9E7]/20"><div className="flex items-center gap-2 mb-3"><ShieldCheck className="w-4 h-4 text-[#5FB865]" /><h3 className="text-[10px] font-black text-[#5FB865] uppercase">Safe Harbor</h3></div><p className="text-[10px] text-gray-500">Your clinical data is stored in localized Dhaka servers.</p></div></aside></div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}