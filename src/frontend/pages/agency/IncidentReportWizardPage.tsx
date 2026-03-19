"use client";
import React from "react";
import { AlertTriangle, ArrowLeft, ShieldAlert, FileText, Clock, User, Camera, Plus, ChevronRight, Send, MapPin, Stethoscope } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/shared/PageHero";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function IncidentReportWizardPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.incidentReportWizard", "Incident Report Wizard"));

  const navigate = useNavigate();
  return (
    <div>
      <PageHero bgColor="#DC2626" className="pt-8 pb-32 px-6 relative overflow-hidden"><div className="max-w-3xl mx-auto relative z-10 text-white"><div className="flex items-center gap-4 mb-8"><h1 className="text-2xl font-bold">Report Clinical Incident</h1></div><p className="text-red-100 max-w-md">Document any medical errors, falls, or safety concerns immediately.</p></div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-400/20 rounded-full blur-[100px] animate-pulse" /></PageHero>
      <div className="max-w-3xl mx-auto px-6 -mt-16 relative z-20"><div className="finance-card p-10 md:p-16"><form className="space-y-10"><div className="space-y-6"><h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Clock className="w-5 h-5 text-red-500" />Incident Details</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date & Time</label><input type="datetime-local" className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-bold text-gray-800" /></div><div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Incident Type</label><select className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-bold text-gray-800"><option>Medication Error</option><option>Patient Fall</option><option>Equipment Failure</option><option>Behavioral Issue</option></select></div></div></div><div className="space-y-6"><h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FileText className="w-5 h-5 text-red-500" />Description & Action</h2><div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">What Happened?</label><textarea className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 outline-none min-h-[160px] text-sm text-gray-600 leading-relaxed" placeholder="Describe the incident..." /></div><div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Immediate Actions Taken</label><textarea className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 outline-none min-h-[100px] text-sm text-gray-600" placeholder="e.g. Notified family doctor..." /></div></div><div className="space-y-6"><h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Camera className="w-5 h-5 text-red-500" />Evidence (Photos)</h2><div className="grid grid-cols-4 gap-4"><button type="button" className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-red-500 hover:bg-red-50 transition-all"><Plus className="w-6 h-6 mb-1" /><span className="text-[10px] font-bold uppercase">Upload</span></button></div></div><div className="pt-6"><Button type="button" onClick={() => navigate("/agency/dashboard")} className="w-full h-16 rounded-3xl bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-2xl">Submit Formal Report<Send className="ml-2 w-5 h-5" /></Button><p className="text-center text-[10px] text-gray-400 font-bold mt-6 uppercase tracking-widest">A copy will be sent to the Ministry of Health (if required)</p></div></form></div></div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 3rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}