"use client";
import React from "react";
import { UserPlus, Heart, Calendar, FileText, ShieldAlert, ChevronRight, Stethoscope, Activity, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate } from "react-router";
import { PageHero } from "@/frontend/components/PageHero";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function PatientIntakePage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.patientIntake", "Patient Intake"));

  const navigate = useNavigate();
  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)" className="pt-12 pb-24 px-6 relative overflow-hidden"><div className="max-w-3xl mx-auto relative z-10 text-white"><h1 className="text-3xl font-bold mb-3">Add New Patient</h1><p className="text-white/80">Complete the health profile to get the best care matches for your loved one.</p></div><div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" /></PageHero>
      <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-20">
        <div className="finance-card p-8 md:p-12">
          <form className="space-y-8">
            <div className="space-y-6"><h2 className="text-xl font-bold text-gray-800 flex items-center"><div className="w-10 h-10 rounded-xl bg-[#E8F9E7] flex items-center justify-center mr-4"><UserPlus className="w-5 h-5 text-[#5FB865]" /></div>Personal Information</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-sm font-bold text-gray-500 uppercase ml-1">Full Name</label><input className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#7CE577] outline-none transition-all" placeholder="e.g. Mr. Abdul Haque" /></div><div className="space-y-2"><label className="text-sm font-bold text-gray-500 uppercase ml-1">Relationship</label><select className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#7CE577] outline-none transition-all appearance-none"><option>Father</option><option>Mother</option><option>Spouse</option><option>Sibling</option><option>Other</option></select></div><div className="space-y-2"><label className="text-sm font-bold text-gray-500 uppercase ml-1">Age</label><input type="number" className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#7CE577] outline-none transition-all" placeholder="e.g. 75" /></div><div className="space-y-2"><label className="text-sm font-bold text-gray-500 uppercase ml-1">Gender</label><div className="flex gap-2 h-14"><button type="button" className="flex-1 rounded-2xl bg-white border border-gray-200 font-bold text-gray-600 hover:border-[#7CE577] hover:bg-[#E8F9E7] transition-all">Male</button><button type="button" className="flex-1 rounded-2xl bg-white border border-gray-200 font-bold text-gray-600 hover:border-[#7CE577] hover:bg-[#E8F9E7] transition-all">Female</button></div></div></div></div>
            <hr className="border-gray-100" />
            <div className="space-y-6"><h2 className="text-xl font-bold text-gray-800 flex items-center"><div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mr-4"><Activity className="w-5 h-5 text-red-400" /></div>Medical Condition</h2><div className="space-y-4"><p className="text-sm text-gray-500">Select all that apply:</p><div className="flex flex-wrap gap-2">{["Diabetes", "Hypertension", "Dementia", "Post-Stroke", "Cardiac Issue", "Mobility Restricted", "Post-Surgery"].map(tag => (<button key={tag} type="button" className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:border-[#7CE577] hover:bg-[#E8F9E7] transition-all">{tag}</button>))}</div><div className="space-y-2"><label className="text-sm font-bold text-gray-500 uppercase ml-1">Detailed Condition Note</label><textarea className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#7CE577] outline-none transition-all min-h-[120px]" placeholder="Describe specific medical needs or instructions..." /></div></div></div>
            <hr className="border-gray-100" />
            <div className="space-y-6"><h2 className="text-xl font-bold text-gray-800 flex items-center"><div className="w-10 h-10 rounded-xl bg-[#FFF5F7] flex items-center justify-center mr-4"><ShieldAlert className="w-5 h-5 text-[#DB869A]" /></div>Emergency Contact</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-sm font-bold text-gray-500 uppercase ml-1">Contact Person Name</label><input className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FEB4C5] outline-none transition-all" /></div><div className="space-y-2"><label className="text-sm font-bold text-gray-500 uppercase ml-1">Phone Number</label><input className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FEB4C5] outline-none transition-all" /></div></div></div>
            <div className="pt-6"><Button type="button" onClick={() => navigate("/guardian/patients")} className="w-full h-16 rounded-2xl font-bold text-lg shadow-xl" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)" }}>Create Profile<ChevronRight className="ml-2 w-6 h-6" /></Button></div>
          </form>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 3rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); }" }} />
    </div>
  );
}