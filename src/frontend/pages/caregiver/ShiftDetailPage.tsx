"use client";
import React from "react";
import { PlayCircle, MapPin, Clock, User, CheckSquare, ClipboardList, Camera, Phone, ArrowLeft, AlertCircle, Activity, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/PageHero";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services/caregiver.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function ShiftDetailPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.shiftDetail", "Shift Detail"));

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: shift, loading } = useAsyncData(() => caregiverService.getShiftDetail(id ?? ""), [id]);

  if (loading || !shift) return <PageSkeleton />;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8"><div className="flex items-center gap-4"><h1 className="text-2xl font-bold text-white">Active Shift</h1></div><div className="px-4 py-1.5 rounded-full bg-white/20 text-xs font-bold text-white flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#7CE577] animate-pulse" />On Duty</div></div>
          <div className="finance-card p-6 !bg-white/10 !backdrop-blur-xl !border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-black">04:22</div><div><p className="text-white font-bold">Shift Duration</p><p className="text-white/70 text-sm">Started at 08:00 AM</p></div></div>
            <Button className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl px-6 h-12 shadow-lg">End Shift</Button>
          </div>
        </div>
      </PageHero>
      <div className="max-w-4xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="finance-card p-8">
              <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-[#FEB4C5]" />Task Checklist</h2><span className="text-xs font-bold text-gray-400">2/5 Completed</span></div>
              <div className="space-y-4">
                {[{ task: "Administer Morning Meds", time: "08:30 AM", done: true }, { task: "Check Blood Pressure", time: "09:00 AM", done: true }, { task: "Physiotherapy Session (15 min)", time: "10:30 AM", done: false }, { task: "Prepare Light Lunch", time: "12:30 PM", done: false }, { task: "Log Afternoon Vitals", time: "02:00 PM", done: false }].map((t, i) => (
                  <div key={i} className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${t.done ? 'bg-gray-50 border-gray-100' : 'bg-white border-[#FEB4C5]/20 hover:border-[#FEB4C5]'}`}>
                    <div className="flex items-center gap-4"><div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${t.done ? 'bg-[#7CE577] border-[#7CE577]' : 'border-gray-200'}`}>{t.done && <CheckSquare className="w-4 h-4 text-white" />}</div><div><p className={`text-sm font-bold ${t.done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{t.task}</p><p className="text-[10px] text-gray-400 font-medium">{t.time}</p></div></div>
                    {!t.done && <Button variant="ghost" className="text-[10px] font-bold text-[#FEB4C5]">Mark Done</Button>}
                  </div>
                ))}
              </div>
            </div>
            <div className="finance-card p-8"><h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-[#7CE577]" />Vital Logging</h2><div className="grid grid-cols-2 gap-4"><div className="p-4 rounded-2xl bg-gray-50 border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Blood Pressure</p><input type="text" placeholder="120/80" className="w-full bg-transparent font-bold text-gray-800 outline-none" /></div><div className="p-4 rounded-2xl bg-gray-50 border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Sugar Level</p><input type="text" placeholder="5.6" className="w-full bg-transparent font-bold text-gray-800 outline-none" /></div></div><Button className="w-full mt-6 h-12 rounded-xl bg-[#7CE577] text-white font-bold shadow-lg">Save Vitals</Button></div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="finance-card p-6"><h3 className="font-bold text-gray-800 mb-4">Patient Profile</h3><div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 rounded-full bg-[#FFF5F7] flex items-center justify-center text-[#FEB4C5]"><User className="w-6 h-6" /></div><div><p className="font-bold text-gray-800">Mrs. Fatema Begum</p><p className="text-xs text-gray-400">72 yrs • Female</p></div></div><div className="space-y-3 pt-6 border-t border-gray-100"><div className="flex items-center gap-3 text-xs text-gray-600"><MapPin className="w-4 h-4 text-[#FEB4C5]" /> Gulshan, Dhaka</div><div className="flex items-center gap-3 text-xs text-gray-600"><ShieldCheck className="w-4 h-4 text-[#7CE577]" /> Critical Care Patient</div></div><Button variant="outline" className="w-full mt-6 h-12 rounded-xl border-red-200 text-red-500 hover:bg-red-50"><AlertCircle className="w-4 h-4 mr-2" /> Report Issue</Button></div>
            <div className="finance-card p-6 bg-gray-900 text-white"><h3 className="font-bold mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-[#7CE577]" />Emergency Contacts</h3><div className="space-y-4"><div className="flex justify-between items-center"><div><p className="text-xs font-bold">Zubayer (Son)</p><p className="text-[10px] text-white/50">017XX-XXXXXX</p></div><button className="w-8 h-8 rounded-full bg-[#7CE577] flex items-center justify-center text-white"><Phone className="w-4 h-4" /></button></div><div className="flex justify-between items-center"><div><p className="text-xs font-bold">Family Doctor</p><p className="text-[10px] text-white/50">018XX-XXXXXX</p></div><button className="w-8 h-8 rounded-full bg-[#7CE577] flex items-center justify-center text-white"><Phone className="w-4 h-4" /></button></div></div></div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}