import { ArrowLeft, MapPin, Clock, DollarSign, User, Star, CheckCircle, Building2, Calendar, FileText, CheckCircle2, ShieldCheck, MessageSquare } from "lucide-react";
import React from "react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { PageHero } from "@/frontend/components/PageHero";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services/caregiver.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function JobApplicationDetailPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.jobApplicationDetail", "Job Application Detail"));

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: application, loading } = useAsyncData(() => caregiverService.getJobApplicationDetail(id ?? ""), [id]);

  if (loading || !application) return <PageSkeleton />;

  return (
    <>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8"><h1 className="text-2xl font-bold text-white">Application Detail</h1></div>
          <div className="finance-card p-6 !bg-white/10 !backdrop-blur-xl !border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white"><Building2 className="w-7 h-7" /></div>
              <div><p className="text-white font-bold text-lg">Post-Surgery Night Care</p><p className="text-white/70 text-sm">Applied on March 12, 2026</p></div>
            </div>
            <div className="px-4 py-2 rounded-full bg-[#E8F9E7] text-[#5FB865] text-xs font-bold uppercase tracking-widest">Interview Scheduled</div>
          </div>
        </div>
      </PageHero>

      <div className="max-w-4xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="finance-card p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Job Overview</h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[{ icon: Calendar, label: "Duration", value: "2 Weeks" }, { icon: Clock, label: "Shift", value: "Night (8pm - 8am)" }, { icon: MapPin, label: "Location", value: "Dhanmondi, Dhaka" }, { icon: User, label: "Patient", value: "Male, 68 yrs" }].map(item => {
                  const Icon = item.icon;
                  return (<div key={item.label} className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center"><Icon className="w-5 h-5 text-gray-400" /></div><div><p className="text-[10px] font-bold text-gray-400 uppercase">{item.label}</p><p className="text-sm font-bold text-gray-800">{item.value}</p></div></div>);
                })}
              </div>
              <h3 className="font-bold text-gray-800 mb-3">Job Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">Seeking a certified caregiver for overnight assistance following a hip replacement surgery. Responsibilities include monitoring vitals, managing medication schedule, assisting with mobility to the restroom, and ensuring patient comfort.</p>
              <h3 className="font-bold text-gray-800 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">{["Post-Op Nursing", "Mobility Assist", "Vitals Monitoring", "First Aid"].map(s => (<span key={s} className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg border border-gray-100">{s}</span>))}</div>
            </div>
            <div className="finance-card p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-8">Application Status</h2>
              <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                <div className="flex gap-6 relative z-10"><div className="w-10 h-10 rounded-full bg-[#E8F9E7] text-[#5FB865] flex items-center justify-center border-4 border-white shadow-sm"><CheckCircle2 className="w-5 h-5" /></div><div><p className="font-bold text-gray-800">Application Submitted</p><p className="text-xs text-gray-400">March 12, 2026 • 10:45 AM</p></div></div>
                <div className="flex gap-6 relative z-10"><div className="w-10 h-10 rounded-full bg-[#E8F9E7] text-[#5FB865] flex items-center justify-center border-4 border-white shadow-sm"><CheckCircle2 className="w-5 h-5" /></div><div><p className="font-bold text-gray-800">Reviewed by Guardian</p><p className="text-xs text-gray-400">March 13, 2026 • 02:30 PM</p></div></div>
                <div className="flex gap-6 relative z-10"><div className="w-10 h-10 rounded-full bg-[#7CE577] text-white flex items-center justify-center border-4 border-white shadow-lg animate-pulse"><Calendar className="w-5 h-5" /></div><div><p className="font-bold text-gray-800">Interview Scheduled</p><p className="text-xs text-gray-500 font-medium">Tomorrow, March 16 • 11:00 AM (Online)</p><Button variant="outline" className="mt-3 h-10 rounded-xl text-xs border-[#7CE577] text-[#7CE577]">Join Meeting</Button></div></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="finance-card p-6 bg-gradient-to-br from-[#7CE577]/10 to-[#5FB865]/10 border-[#7CE577]/20">
              <h3 className="font-bold text-gray-800 mb-4">Earnings Estimate</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Hourly Rate</span><span className="font-bold text-gray-800">৳600</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Total Hours (Est)</span><span className="font-bold text-gray-800">168 hrs</span></div>
                <div className="pt-3 border-t border-[#7CE577]/20 flex justify-between items-center"><span className="font-bold text-gray-800">Net Payout</span><span className="text-xl font-black text-[#5FB865]">৳100,800</span></div>
              </div>
            </div>
            <div className="finance-card p-6">
              <h3 className="font-bold text-gray-800 mb-4">Guardian Profile</h3>
              <div className="flex items-center gap-4 mb-4">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" className="w-12 h-12 rounded-full object-cover" alt="guardian" />
                <div><p className="font-bold text-gray-800">Ariful Islam</p><div className="flex items-center text-[10px] text-gray-400"><ShieldCheck className="w-3 h-3 text-[#7CE577] mr-1" /> Verified Member</div></div>
              </div>
              <Button variant="ghost" className="w-full h-12 rounded-xl text-sm font-bold text-[#FEB4C5] bg-[#FFF5F7]"><MessageSquare className="w-4 h-4 mr-2" /> Message Guardian</Button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </>
  );
}