import { cn } from "@/frontend/theme/tokens";
import { Link } from "react-router";
import { Calendar, Clock, Star, User, FileText, ChevronRight } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { patientService } from "@/backend/services/patient.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function PatientCareHistoryPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.patientCareHistory", "Patient Care History"));

  const { data: careHistory, loading } = useAsyncData(() => patientService.getCareHistory());

  if (loading || !careHistory) return <PageSkeleton cards={4} />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div><h1 className="text-2xl" style={{ color: cn.text }}>Care History</h1><p className="text-sm" style={{ color: cn.textSecondary }}>Review past care sessions and caregiver logs</p></div>
      <div className="space-y-4">
        {careHistory.map((entry) => (
          <div key={entry.id} className="finance-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.pinkBg }}><User className="w-5 h-5" style={{ color: cn.pink }} /></div>
                <div><p className="text-sm" style={{ color: cn.text }}>{entry.caregiver}</p><p className="text-xs" style={{ color: cn.textSecondary }}>{entry.type}</p></div>
              </div>
              <div className="text-right"><div className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color: cn.amber, fill: cn.amber }} /><span className="text-xs" style={{ color: cn.text }}>{entry.rating}</span></div></div>
            </div>
            <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: cn.textSecondary }}>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {entry.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {entry.duration}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">{entry.tasks.map((t, i) => (<span key={i} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: cn.greenBg, color: cn.green }}>{t}</span>))}</div>
            {entry.notes && <p className="text-xs p-2 rounded-lg" style={{ background: cn.bgInput, color: cn.textSecondary }}>{entry.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}