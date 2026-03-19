import { cn } from "@/frontend/theme/tokens";
import { useState } from "react";
import { Link } from "react-router";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { Building2, Heart, Calendar, Clock, User, Phone, ClipboardList, FileText, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CaregiverAssignedPatientsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.caregiverAssignedPatients", "Caregiver Assigned Patients"));

  const { data: patients, loading: lPatients } = useAsyncData(() => caregiverService.getAssignedPatients());
  const { data: pastPatients, loading: lPast } = useAsyncData(() => caregiverService.getPastPatients());
  const loading = lPatients || lPast;
  const [tab, setTab] = useState<"active" | "past">("active");

  if (loading || !patients || !pastPatients) return <PageSkeleton cards={3} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl" style={{ color: cn.text }}>My Patients</h1>
        <p className="text-sm" style={{ color: cn.textSecondary }}>
          Patients assigned through active placements
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("active")}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ background: tab === "active" ? cn.pinkBg : "transparent", color: tab === "active" ? cn.pink : cn.textSecondary }}>
          Active ({patients.length})
        </button>
        <button onClick={() => setTab("past")}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ background: tab === "past" ? cn.pinkBg : "transparent", color: tab === "past" ? cn.pink : cn.textSecondary }}>
          Past ({pastPatients.length})
        </button>
      </div>

      {tab === "active" && (
        <div className="space-y-4">
          {patients.map((patient) => (
            <div key={patient.id} className="finance-card p-4 sm:p-5" style={{ borderLeft: `3px solid ${cn.pink}` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm" style={{ background: cn.pinkBg, color: cn.pink }}>
                  {patient.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
                <div>
                  <h3 className="text-sm" style={{ color: cn.text }}>{patient.name}</h3>
                  <p className="text-xs" style={{ color: cn.textSecondary }}>{patient.age}y, {patient.gender}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {patient.conditions.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded-full text-xs" style={{ background: cn.pinkBg, color: cn.pink }}>{c}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs" style={{ color: cn.textSecondary }}>
                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{patient.agency}</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{patient.careType}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{patient.schedule}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" style={{ color: cn.green }} />{patient.nextShiftIn}</span>
              </div>

              <div className="p-3 rounded-xl mb-3" style={{ background: cn.greenBg }}>
                <p className="text-xs" style={{ color: cn.green }}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  Next Shift: {patient.nextShift} — {patient.nextShiftIn}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-3 p-3 rounded-xl" style={{ background: cn.bgInput }}>
                <User className="w-4 h-4" style={{ color: cn.textSecondary }} />
                <div className="flex-1">
                  <p className="text-xs" style={{ color: cn.textSecondary }}>Guardian</p>
                  <p className="text-sm" style={{ color: cn.text }}>{patient.guardian}</p>
                </div>
                <a href={`tel:${patient.guardianPhone}`} className="p-2 rounded-lg" style={{ background: cn.greenBg }}>
                  <Phone className="w-4 h-4" style={{ color: cn.green }} />
                </a>
              </div>

              <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: `1px solid ${cn.border}` }}>
                <Link to={`/caregiver/care-log/new?patient=${patient.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-1"
                  style={{ background: "var(--cn-gradient-caregiver)" }}>
                  <ClipboardList className="w-3 h-3" /> Log Care
                </Link>
                <button className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{ borderColor: cn.border, color: cn.textSecondary }}>
                  <FileText className="w-3 h-3" /> Care Plan
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{ borderColor: cn.border, color: cn.textSecondary }}>
                  <MessageSquare className="w-3 h-3" /> Message Guardian
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "past" && (
        <div className="space-y-3">
          {pastPatients.map((pp) => (
            <div key={pp.name} className="finance-card p-4 opacity-80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs" style={{ background: cn.bgInput, color: cn.textSecondary }}>
                  {pp.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: cn.text }}>{pp.name}</p>
                  <p className="text-xs" style={{ color: cn.textSecondary }}>{pp.dates} | {pp.totalShifts} shifts</p>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: cn.amber }}>
                  <span>{pp.rating}</span>
                  <span>★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}