import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import { Search, UserPlus, Star, MapPin, Phone, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { agencyService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function AgencyCaregiversPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.agencyCaregivers", "Agency Caregivers"));

  const { data: caregivers, loading } = useAsyncData(() => agencyService.getCaregivers());
  const [search, setSearch] = useState("");

  if (loading || !caregivers) return <PageSkeleton cards={5} />;

  const filtered = caregivers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.specialty.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div><h1 className="text-2xl" style={{ color: cn.text }}>Caregivers</h1><p className="text-sm" style={{ color: cn.textSecondary }}>{caregivers.length} caregivers under agency</p></div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm cn-touch-target" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #80CBC4 0%, #00897B 100%)" }}><UserPlus className="w-4 h-4" /> Add Caregiver</button>
        </div>
        <div className="finance-card p-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#848484" }} /><input className="input-field pl-10" placeholder="Search caregivers..." value={search} onChange={e => setSearch(e.target.value)} /></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="finance-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #80CBC4 0%, #00897B 100%)" }}>{c.name.charAt(0)}</div><div><div className="flex items-center gap-1"><p className="font-semibold text-sm" style={{ color: "#535353" }}>{c.name}</p>{c.verified && <CheckCircle className="w-3.5 h-3.5" style={{ color: "#5FB865" }} />}</div><p className="text-xs" style={{ color: "#848484" }}>{c.specialty}</p></div></div>
                <span className="badge-pill" style={{ background: c.status === "active" ? "#7CE57720" : c.status === "on-leave" ? "#FFB54D20" : "#F3F4F6", color: c.status === "active" ? "#5FB865" : c.status === "on-leave" ? "#E8A838" : "#848484" }}>{c.status}</span>
              </div>
              <div className="space-y-1.5 text-xs mb-4" style={{ color: "#848484" }}><p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</p><p className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" style={{ color: "#E8A838" }} />\u2605 {c.rating} \u2022 {c.jobs} jobs completed</p><p>Joined: {c.joined}</p></div>
              <div className="flex gap-2"><button className="flex-1 py-2.5 rounded-lg border text-xs cn-touch-target" style={{ borderColor: cn.border, color: cn.text }}>Profile</button><button className="flex-1 py-2.5 rounded-lg text-white text-xs cn-touch-target" style={{ background: "#00897B" }}>Assign Job</button></div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); } .badge-pill { display: inline-flex; align-items: center; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 500; } .input-field { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #E5E7EB; border-radius: 8px; outline: none; font-size: 0.875rem; color: #535353; }" }} />
    </>
  );
}