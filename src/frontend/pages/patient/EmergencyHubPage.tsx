"use client";
import React from "react";
import { ShieldAlert, Phone, MapPin, Heart, Stethoscope, User, AlertTriangle, ArrowLeft, ChevronRight, Ambulance, History, Info } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate } from "react-router";
import { PageHero } from "@/frontend/components/shared/PageHero";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { patientService } from "@/backend/services/patient.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function EmergencyHubPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.emergencyHub", "Emergency Hub"));

  const navigate = useNavigate();
  const { data: emergency, loading } = useAsyncData(() => patientService.getEmergencyData());

  if (loading || !emergency) return <PageSkeleton />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #EF4444 0%, #DC2626 100%)" className="pt-8 pb-32 px-6"><div className="max-w-4xl mx-auto relative z-10 text-white"><div className="flex items-center justify-end mb-10"><div className="px-4 py-1.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white animate-pulse" />Emergency Mode Active</div></div><div className="text-center"><h1 className="text-4xl font-black mb-4">Emergency Hub</h1><p className="text-red-100 max-w-md mx-auto">Immediate assistance for health crises. Hold the button below for 3 seconds to alert all contacts.</p></div></div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-400/20 rounded-full blur-[100px] animate-pulse" /></PageHero>
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-6"><div className="finance-card p-10 bg-white border-2 border-red-100 text-center flex flex-col items-center"><button className="w-32 h-32 rounded-full bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] flex items-center justify-center text-white active:scale-95 transition-all group mb-6"><ShieldAlert className="w-16 h-16 group-hover:scale-110 transition-transform" /></button><h2 className="text-2xl font-black text-gray-800">SOS ALERT</h2><p className="text-gray-400 text-sm mt-2">Hold for 3 seconds to notify emergency contacts, local police, and your caregiver.</p></div><div className="finance-card p-8"><h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Phone className="w-5 h-5 text-red-400" />Quick Emergency Dial</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{emergency.contacts.map((c, i) => (<button key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors text-left group"><div className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center`}><Phone className="w-6 h-6" /></div><div><p className="text-sm font-bold text-gray-800">{c.name}</p><p className="text-xs text-gray-400">{c.role} {"\u2022"} {c.phone}</p></div><ChevronRight className="ml-auto w-5 h-5 text-gray-300 group-hover:text-gray-500" /></button>))}</div></div></div><div className="lg:col-span-1 space-y-6"><div className="finance-card p-6 bg-red-50 border-red-200"><h3 className="text-red-700 font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5" />Medical Info (Vitals)</h3><div className="space-y-3"><div className="bg-white/50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 font-bold uppercase">Blood Group</p><p className="text-lg font-black text-red-600">{emergency.medical.bloodGroup}</p></div><div className="bg-white/50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 font-bold uppercase">Allergies</p><p className="text-sm font-bold text-gray-700">{emergency.medical.allergies}</p></div><div className="bg-white/50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 font-bold uppercase">Chronic Condition</p><p className="text-sm font-bold text-gray-700">{emergency.medical.chronic}</p></div></div></div><div className="finance-card p-6"><h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#FEB4C5]" />Current Location</h3><div className="h-32 bg-gray-100 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden"><div className="absolute inset-0 bg-gray-200 flex items-center justify-center"><div className="w-4 h-4 bg-red-500 rounded-full animate-ping" /><div className="w-4 h-4 bg-red-500 rounded-full absolute" /></div></div><p className="text-xs text-gray-500">{emergency.location}</p></div></div></div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}