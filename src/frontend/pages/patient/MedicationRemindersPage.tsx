"use client";
import React, { useState } from "react";
import { Bell, Clock, Plus, Calendar, CheckCircle2, XCircle, Info, Pill, ArrowLeft, ChevronRight, Droplets, AlertCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate } from "react-router";
import { PageHero } from "@/frontend/components/shared/PageHero";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { patientService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function MedicationRemindersPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.medicationReminders", "Medication Reminders"));

  const { data: mockMeds, loading } = useAsyncData(() => patientService.getMedicationReminders());
  const navigate = useNavigate();

  if (loading || !mockMeds) return <PageSkeleton cards={4} />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)" className="pt-8 pb-32 px-6"><div className="max-w-4xl mx-auto"><div className="flex justify-between items-center mb-8"><h1 className="text-2xl font-bold text-white">Medications</h1><Button className="bg-white text-[#DB869A] hover:bg-white/90 rounded-2xl font-bold px-6 h-12"><Plus className="w-5 h-5 mr-2" /> Add New</Button></div><div className="finance-card p-6 !bg-white/10 !backdrop-blur-xl !border-white/20 flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white"><Bell className="w-6 h-6 animate-swing" /></div><div><p className="text-white font-bold text-lg">Upcoming Dose</p><p className="text-white/70 text-sm">Next: Atorvastatin at 08:00 PM</p></div></div><div className="text-white text-right"><p className="text-2xl font-bold">1/3</p><p className="text-white/70 text-[10px] font-bold uppercase">Taken Today</p></div></div></div></PageHero>
      <div className="max-w-4xl mx-auto px-6 -mt-16"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-4"><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-gray-800">Today's Schedule</h2><p className="text-sm text-gray-400 font-medium">Sunday, March 15</p></div>{mockMeds.map((med) => (<div key={med.id} className={`finance-card p-5 border-l-8 transition-all hover:translate-x-1 ${med.taken ? 'border-[#7CE577]' : 'border-gray-100'}`}><div className="flex justify-between items-start"><div className="flex gap-4"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${med.taken ? 'bg-[#E8F9E7] text-[#5FB865]' : 'bg-gray-50 text-gray-400'}`}><Pill className="w-6 h-6" /></div><div><h3 className="font-bold text-gray-800 text-lg leading-none">{med.name}</h3><p className="text-sm text-[#FEB4C5] font-semibold mt-1">{med.dosage}</p><div className="flex items-center gap-3 mt-3"><span className="flex items-center text-xs text-gray-400 font-medium"><Clock className="w-3 h-3 mr-1" /> {med.timing}</span><span className="flex items-center text-xs text-gray-400 font-medium"><Info className="w-3 h-3 mr-1" /> {med.instructed}</span></div></div></div><div className="flex flex-col gap-2">{med.taken ? <div className="flex items-center gap-1 text-[#5FB865] text-xs font-bold bg-[#E8F9E7] px-3 py-1.5 rounded-full"><CheckCircle2 className="w-4 h-4" /> Taken</div> : <Button className="bg-[#FEB4C5] text-white h-10 px-4 rounded-xl text-xs font-bold shadow-md hover:bg-[#DB869A]">Mark Taken</Button>}<button className="text-[10px] text-gray-300 hover:text-red-400 uppercase font-bold tracking-widest text-center">Missed?</button></div></div></div>))}</div><div className="lg:col-span-1 space-y-6"><div className="finance-card p-6 border-l-4 border-orange-400"><h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-400" />Refill Alerts</h3><div className="space-y-4">{mockMeds.filter(m => m.id === 3).map(m => (<div key={m.id} className="flex justify-between items-center bg-orange-50 p-3 rounded-xl border border-orange-100"><span className="text-sm font-bold text-orange-700">{m.name}</span><span className="text-xs font-medium text-orange-600">Refill in {m.refill}</span></div>))}<Button className="w-full h-12 bg-white border border-orange-200 text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-50">Order from Shop</Button></div></div><div className="finance-card p-6"><h3 className="text-lg font-bold text-gray-800 mb-4">Adherence Report</h3><div className="flex items-end justify-center gap-2 h-24 mb-4">{[60, 80, 45, 90, 100, 75, 95].map((v, i) => (<div key={i} className="w-3 bg-[#EAB1C1] rounded-t-full transition-all" style={{ height: `${v}%` }} />))}</div><p className="text-xs text-gray-400 text-center font-medium">92% Average this week</p></div></div></div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); } @keyframes swing { 0%, 100% { transform: rotate(0deg); } 20% { transform: rotate(15deg); } 40% { transform: rotate(-10deg); } } .animate-swing { animation: swing 2s infinite ease-in-out; }" }} />
    </div>
  );
}