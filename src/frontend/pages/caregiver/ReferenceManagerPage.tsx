"use client";
import React from "react";
import { Users, Plus, CheckCircle2, Clock, MessageCircle, Mail, Phone, ArrowLeft, ChevronRight, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services/caregiver.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { PageHero } from "@/frontend/components/PageHero";
import { useTranslation } from "react-i18next";

export default function ReferenceManagerPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.referenceManager", "Reference Manager"));

  const { data: references, loading } = useAsyncData(() => caregiverService.getReferences());

  if (loading || !references) return <PageSkeleton />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8"><div className="flex items-center gap-4"><h1 className="text-2xl font-bold text-white">Reference Manager</h1></div><Button className="bg-white text-[#DB869A] hover:bg-white/90 rounded-2xl font-bold"><Plus className="w-5 h-5 mr-1" /> Add Reference</Button></div>
          <div className="finance-card p-6 !bg-white/10 !backdrop-blur-xl !border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white"><UserCheck className="w-7 h-7" /></div><div><p className="text-white font-bold text-lg">Trust Score</p><p className="text-white/70 text-sm">Based on 5 verified references</p></div></div>
            <div className="text-right"><p className="text-3xl font-black text-white">98/100</p><p className="text-white/70 text-[10px] font-bold uppercase">Elite Badge Active</p></div>
          </div>
        </div>
      </PageHero>
      <div className="max-w-4xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2"><h2 className="text-lg font-bold text-gray-800">Verified Professional References</h2><span className="text-xs text-gray-400 font-medium">Updated 2 days ago</span></div>
            {references.map((r, i) => (
              <div key={i} className="finance-card p-6 flex items-center justify-between group hover:border-[#FEB4C5] transition-all">
                <div className="flex items-center gap-5"><div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#FEB4C5] font-black text-xl border border-gray-100 group-hover:bg-[#FFF5F7]">{r.name.charAt(0)}</div><div><h3 className="font-bold text-gray-800 leading-none">{r.name}</h3><p className="text-xs text-gray-400 mt-2">{r.role}</p><div className="flex items-center gap-3 mt-3"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">{r.type}</span><span className="text-[10px] font-bold text-[#5FB865] flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {r.status}</span></div></div></div>
                <div className="text-right"><p className="text-[10px] text-gray-300 font-bold mb-2 uppercase">{r.date}</p><Button variant="ghost" size="icon" className="text-gray-300 hover:text-[#FEB4C5]"><Mail className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="text-gray-300 hover:text-[#7CE577]"><Phone className="w-4 h-4" /></Button></div>
              </div>
            ))}
            <div className="mt-10"><h2 className="text-lg font-bold text-gray-800 mb-4">Pending Requests</h2><div className="finance-card p-6 border-dashed border-2 border-gray-200 bg-gray-50/50"><div className="flex items-center justify-between"><div className="flex items-center gap-4 opacity-60"><div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400"><Clock className="w-6 h-6" /></div><div><p className="font-bold text-gray-500">Nusrat Jahan</p><p className="text-xs text-gray-400">Guardian • Sent Mar 14</p></div></div><Button variant="outline" className="h-9 rounded-xl text-xs font-bold border-gray-200">Resend Invite</Button></div></div></div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="finance-card p-8 bg-gradient-to-br from-[#7CE577]/20 to-[#5FB865]/20 border-[#7CE577]/20"><h3 className="font-bold text-gray-800 mb-4">Why References?</h3><p className="text-sm text-gray-600 leading-relaxed">Profiles with at least 3 verified references are **5x more likely** to be hired by top agencies and premium guardians.</p><ul className="mt-6 space-y-3">{["Unlock Elite Status", "Increase Hourly Rate", "Priority Job Alerts"].map((f, i) => (<li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-700"><CheckCircle2 className="w-4 h-4 text-[#7CE577]" /> {f}</li>))}</ul></div>
            <div className="finance-card p-6"><h3 className="font-bold text-gray-800 mb-4">Social Verification</h3><div className="flex gap-2">{[{ name: "LinkedIn", color: "bg-[#0A66C2]" }, { name: "NID", color: "bg-red-500" }, { name: "Email", color: "bg-gray-800" }].map((v, i) => (<div key={i} className={`flex-1 h-10 rounded-xl ${v.color} flex items-center justify-center text-white font-black text-[10px] cursor-pointer hover:opacity-90`}>{v.name}</div>))}</div></div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2.5rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}