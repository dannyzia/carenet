import { useState } from "react";
import { Link } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { ChevronLeft, Star, CheckCircle2, Clock, Calendar, User, MapPin, MessageSquare, Send, XCircle, ThumbsUp, Eye } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { agencyService } from "@/backend/services/agency.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

type AppStatus = "all" | "new" | "reviewed" | "interview" | "offered" | "hired" | "rejected";
const statusStyles: Record<string, { label: string; color: string; bg: string }> = { new: { label: "New", color: "#0288D1", bg: "rgba(2,136,209,0.12)" }, reviewed: { label: "Reviewed", color: "#E8A838", bg: "rgba(232,168,56,0.12)" }, interview: { label: "Interview Scheduled", color: "#7B5EA7", bg: "rgba(123,94,167,0.12)" }, offered: { label: "Offer Sent", color: "#00897B", bg: "rgba(0,137,123,0.12)" }, hired: { label: "Hired", color: "#5FB865", bg: "rgba(95,184,101,0.12)" }, rejected: { label: "Rejected", color: "#EF4444", bg: "rgba(239,68,68,0.12)" } };
const tabs: { key: AppStatus; label: string }[] = [{ key: "all", label: "All" }, { key: "new", label: "New" }, { key: "reviewed", label: "Reviewed" }, { key: "interview", label: "Interview" }, { key: "offered", label: "Offered" }, { key: "hired", label: "Hired" }, { key: "rejected", label: "Rejected" }];

export default function AgencyJobApplicationsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.agencyJobApplications", "Agency Job Applications"));

  const [activeTab, setActiveTab] = useState<AppStatus>("all");
  const { data: applications, loading } = useAsyncData(() => agencyService.getJobApplications());

  if (loading || !applications) return <PageSkeleton cards={3} />;

  const filtered = activeTab === "all" ? applications : applications.filter((a) => a.status === activeTab);
  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <Link to="/agency/job-management" className="inline-flex items-center gap-1 text-sm" style={{ color: cn.textSecondary }}><ChevronLeft className="w-4 h-4" /> Back to Jobs</Link>
        <div className="finance-card p-4" style={{ borderLeft: `3px solid ${cn.teal}` }}><div className="flex items-center justify-between mb-2"><span className="text-sm" style={{ color: cn.text }}>JOB-2026-0087</span><span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(232,168,56,0.12)", color: "#E8A838" }}>Applications Received</span></div><p className="text-sm" style={{ color: cn.text }}>Full Day Care (Elder) — Gulshan-2, Dhaka</p><p className="text-xs mt-1" style={{ color: cn.textSecondary }}>Day Shift (8AM-8PM) \u00B7 \u09F3 1,200-1,800/shift \u00B7 3-5 years exp</p></div>
        <div className="flex gap-1 overflow-x-auto pb-1">{tabs.map((tab) => { const isActive = activeTab === tab.key; return (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className="px-3 py-2 rounded-lg text-sm whitespace-nowrap" style={{ background: isActive ? cn.tealBg : "transparent", color: isActive ? cn.teal : cn.textSecondary }}>{tab.label}</button>); })}</div>
        <div className="space-y-3">{filtered.map((app) => { const st = statusStyles[app.status]; const matchColor = app.matchScore >= 90 ? cn.green : app.matchScore >= 70 ? cn.amber : "#EF4444"; return (
          <div key={app.id} className="finance-card p-4 sm:p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: cn.pinkBg, color: cn.pink }}>{app.name.split(" ").map(w => w[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1"><div className="flex items-center gap-2"><h3 className="text-sm" style={{ color: cn.text }}>{app.name}</h3><span className="flex items-center gap-0.5 text-xs" style={{ color: cn.amber }}><Star className="w-3 h-3" /> {app.rating}</span></div><span className="px-2 py-0.5 rounded-full text-xs shrink-0" style={{ background: st.bg, color: st.color }}>{st.label}</span></div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 text-xs" style={{ color: cn.textSecondary }}><span>{app.experience} exp</span><span>{app.gender}</span><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</span><span>{app.previousJobs} jobs \u00B7 {app.completionRate}% completion</span></div>
                <div className="flex items-center gap-2 mb-2"><span className="text-xs" style={{ color: cn.textSecondary }}>Match:</span><div className="flex-1 max-w-[120px] h-2 rounded-full" style={{ background: cn.bgInput }}><div className="h-full rounded-full" style={{ width: `${app.matchScore}%`, background: matchColor }} /></div><span className="text-xs" style={{ color: matchColor }}>{app.matchScore}%</span></div>
                <div className="flex flex-wrap gap-1 mb-2">{app.specialties.map(s => (<span key={s} className="px-2 py-0.5 rounded-full text-xs" style={{ background: cn.pinkBg, color: cn.pink }}>{s}</span>))}{app.certifications.slice(0, 2).map(c => (<span key={c} className="px-2 py-0.5 rounded-full text-xs" style={{ background: cn.greenBg, color: cn.green }}>{c}</span>))}</div>
                <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: `1px solid ${cn.border}` }}><span className="text-xs" style={{ color: cn.textSecondary }}>Applied {app.appliedDate}</span><div className="flex gap-2 ml-auto">{app.status === "new" && <><button className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{ borderColor: cn.border, color: cn.textSecondary }}><Eye className="w-3 h-3" /> Review</button><button className="px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-1" style={{ background: "var(--cn-gradient-agency)" }}><Calendar className="w-3 h-3" /> Schedule Interview</button></>}{app.status === "interview" && <><button className="px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-1" style={{ background: "var(--cn-gradient-agency)" }}><Send className="w-3 h-3" /> Send Offer</button><button className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{ borderColor: "#EF4444", color: "#EF4444" }}><XCircle className="w-3 h-3" /> Reject</button></>}</div></div>
              </div>
            </div>
          </div>); })}</div>
      </div>
    </>
  );
}