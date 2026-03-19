import { cn } from "@/frontend/theme/tokens";
import { FileText, Download, Calendar, Shield, Activity, Pill, AlertTriangle } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { patientService } from "@/backend/services/patient.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function PatientMedicalRecordsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.patientMedicalRecords", "Patient Medical Records"));

  const { data: records, loading: l1 } = useAsyncData(() => patientService.getMedicalRecords());
  const { data: conditions, loading: l2 } = useAsyncData(() => patientService.getConditions());
  const { data: allergies, loading: l3 } = useAsyncData(() => patientService.getAllergies());

  if (l1 || l2 || l3 || !records || !conditions || !allergies) return <PageSkeleton cards={4} />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div><h1 className="text-2xl" style={{ color: cn.text }}>Medical Records</h1><p className="text-sm" style={{ color: cn.textSecondary }}>Your health documents, conditions, and allergies</p></div>

      {/* Conditions */}
      <div className="finance-card p-5">
        <h2 className="text-sm mb-4 flex items-center gap-2" style={{ color: cn.text }}><Activity className="w-4 h-4" style={{ color: cn.pink }} /> Active Conditions</h2>
        <div className="space-y-3">{conditions.map((c, i) => (
          <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < conditions.length - 1 ? `1px solid ${cn.borderLight}` : "none" }}>
            <div><p className="text-sm" style={{ color: cn.text }}>{c.name}</p><p className="text-xs" style={{ color: cn.textSecondary }}>Since {c.since}</p></div>
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${c.color}15`, color: c.color }}>{c.severity}</span>
          </div>
        ))}</div>
      </div>

      {/* Allergies */}
      <div className="finance-card p-5">
        <h2 className="text-sm mb-3 flex items-center gap-2" style={{ color: cn.text }}><AlertTriangle className="w-4 h-4" style={{ color: "#EF4444" }} /> Allergies</h2>
        <div className="flex flex-wrap gap-2">{allergies.map((a, i) => (<span key={i} className="px-3 py-1 rounded-full text-xs" style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444" }}>{a}</span>))}</div>
      </div>

      {/* Records */}
      <div className="space-y-3">
        <h2 className="text-sm px-1" style={{ color: cn.text }}>Recent Documents</h2>
        {records.map((rec) => (
          <div key={rec.id} className="finance-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.pinkBg }}><FileText className="w-5 h-5" style={{ color: cn.pink }} /></div>
                <div>
                  <p className="text-sm" style={{ color: cn.text }}>{rec.title}</p>
                  <p className="text-xs" style={{ color: cn.textSecondary }}>{rec.type} | {rec.doctor}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: cn.textSecondary }}>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {rec.date}</span>
                    <span>{rec.facility}</span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: rec.status === "Normal" || rec.status === "Clear" ? cn.greenBg : rec.status === "Active" ? cn.pinkBg : cn.amberBg, color: rec.status === "Normal" || rec.status === "Clear" ? cn.green : rec.status === "Active" ? cn.pink : cn.amber }}>{rec.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}