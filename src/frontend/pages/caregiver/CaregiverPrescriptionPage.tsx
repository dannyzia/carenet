import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import {
  Pill, Plus, Clock, User, Calendar, FileText, ChevronDown,
  CheckCircle2, AlertTriangle, Trash2, Edit3, Search,
} from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useTranslation } from "react-i18next";

interface Prescription {
  id: string; patientName: string; medicineName: string; dosage: string;
  frequency: string; timing: string[]; duration: string; prescribedBy: string;
  startDate: string; endDate: string; instructions: string;
  status: "active" | "completed" | "paused"; refillDate?: string;
}

const frequencyOptions = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "Every 6 hours", "Every 8 hours", "As needed (PRN)", "Weekly"];
const timingOptions = ["Morning", "Afternoon", "Evening", "Night", "Before meals", "After meals", "Bedtime"];

export default function CaregiverPrescriptionPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.caregiverPrescription", "Caregiver Prescription"));

  const { data: loadedPrescriptions, loading } = useAsyncData(() => caregiverService.getPrescriptions());

  if (loading || !loadedPrescriptions) return <PageSkeleton cards={4} />;

  return <PrescriptionContent initialPrescriptions={loadedPrescriptions as Prescription[]} />;
}

function PrescriptionContent({ initialPrescriptions }: { initialPrescriptions: Prescription[] }) {
  const [prescriptions] = useState(initialPrescriptions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "paused">("all");
  const [filterPatient, setFilterPatient] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ patientName: "", medicineName: "", dosage: "", frequency: "", timing: [] as string[], duration: "", prescribedBy: "", startDate: "", endDate: "", instructions: "" });

  const filtered = prescriptions.filter(rx => {
    if (filterStatus !== "all" && rx.status !== filterStatus) return false;
    if (filterPatient !== "all" && rx.patientName !== filterPatient) return false;
    if (searchQuery && !rx.medicineName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const patients = [...new Set(prescriptions.map(rx => rx.patientName))];
  const activeCount = prescriptions.filter(rx => rx.status === "active").length;
  const toggleTiming = (t: string) => setForm(f => ({ ...f, timing: f.timing.includes(t) ? f.timing.filter(x => x !== t) : [...f.timing, t] }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl" style={{ color: cn.textHeading }}>Prescription Management</h1>
          <p className="text-sm mt-0.5" style={{ color: cn.textSecondary }}>{activeCount} active prescriptions across {patients.length} patients</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm" style={{ background: "var(--cn-gradient-caregiver)" }}>
          <Plus className="w-4 h-4" /> Add Prescription
        </button>
      </div>

      {showAddForm && (
        <div className="finance-card p-5 space-y-4" style={{ borderLeft: `3px solid ${cn.pink}` }}>
          <h3 className="text-sm flex items-center gap-2" style={{ color: cn.pink }}><Pill className="w-4 h-4" /> New Prescription Entry</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Patient</label><select value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }}><option value="">Select patient</option>{patients.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
            <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Medicine Name</label><input type="text" value={form.medicineName} onChange={e => setForm({ ...form, medicineName: e.target.value })} placeholder="e.g., Amlodipine" className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} /></div>
            <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Dosage</label><input type="text" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} placeholder="e.g., 5mg" className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} /></div>
            <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Frequency</label><select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }}><option value="">Select frequency</option>{frequencyOptions.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
            <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Prescribed By</label><input type="text" value={form.prescribedBy} onChange={e => setForm({ ...form, prescribedBy: e.target.value })} placeholder="Doctor's name" className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} /></div>
            <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Duration</label><input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g., 7 days, Ongoing" className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} /></div>
            <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} /></div>
            <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>End Date (if applicable)</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} /></div>
          </div>
          <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Timing</label><div className="flex flex-wrap gap-2">{timingOptions.map(t => (<button key={t} onClick={() => toggleTiming(t)} className="px-3 py-1.5 rounded-lg text-xs border transition-all" style={{ borderColor: form.timing.includes(t) ? cn.pink : cn.border, color: form.timing.includes(t) ? cn.pink : cn.text, background: form.timing.includes(t) ? cn.pinkBg : "transparent" }}>{t}</button>))}</div></div>
          <div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Special Instructions</label><textarea rows={2} value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} placeholder="e.g., Take after meals..." className="w-full px-4 py-3 rounded-xl border text-sm resize-none" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} /></div>
          <div className="flex gap-3 pt-2">
            <button className="px-5 py-2.5 rounded-xl text-white text-sm" style={{ background: "var(--cn-gradient-caregiver)" }}>Save Prescription</button>
            <button onClick={() => setShowAddForm(false)} className="px-5 py-2.5 rounded-xl text-sm border" style={{ borderColor: cn.border, color: cn.textSecondary }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: cn.border, background: cn.bgInput }}>
          <Search className="w-4 h-4" style={{ color: cn.textSecondary }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search medicine..." className="bg-transparent outline-none text-sm" style={{ color: cn.text }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: cn.border, background: cn.bgInput, color: cn.text }}>
          <option value="all">All Status</option><option value="active">Active</option><option value="completed">Completed</option><option value="paused">Paused</option>
        </select>
        <select value={filterPatient} onChange={e => setFilterPatient(e.target.value)} className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: cn.border, background: cn.bgInput, color: cn.text }}>
          <option value="all">All Patients</option>{patients.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(rx => (
          <div key={rx.id} className="finance-card p-4 sm:p-5" style={{ borderLeft: `3px solid ${rx.status === "active" ? cn.green : rx.status === "paused" ? cn.amber : cn.textSecondary}` }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.pinkBg }}><Pill className="w-5 h-5" style={{ color: cn.pink }} /></div>
                <div>
                  <h3 className="text-sm" style={{ color: cn.text }}>{rx.medicineName} — {rx.dosage}</h3>
                  <p className="text-xs" style={{ color: cn.textSecondary }}>{rx.frequency} | {rx.timing.join(", ")}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs shrink-0" style={{ background: rx.status === "active" ? cn.greenBg : rx.status === "paused" ? cn.amberBg : cn.bgInput, color: rx.status === "active" ? cn.green : rx.status === "paused" ? cn.amber : cn.textSecondary }}>{rx.status}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs" style={{ color: cn.textSecondary }}>
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {rx.patientName}</span>
              <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {rx.prescribedBy}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Since {rx.startDate}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rx.duration}</span>
            </div>
            {rx.instructions && <div className="mt-2 p-2 rounded-lg text-xs" style={{ background: cn.bgInput, color: cn.textSecondary }}><strong>Instructions:</strong> {rx.instructions}</div>}
            {rx.refillDate && <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: cn.amber }}><AlertTriangle className="w-3 h-3" /> Refill needed by {rx.refillDate}</div>}
            <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${cn.borderLight}` }}>
              <button className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{ borderColor: cn.border, color: cn.textSecondary }}><Edit3 className="w-3 h-3" /> Edit</button>
              <button className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{ borderColor: cn.border, color: cn.textSecondary }}><CheckCircle2 className="w-3 h-3" /> Mark Completed</button>
              <button className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1" style={{ borderColor: cn.border, color: cn.red }}><Trash2 className="w-3 h-3" /> Remove</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="finance-card p-8 text-center">
          <Pill className="w-8 h-8 mx-auto mb-2" style={{ color: cn.textSecondary }} />
          <p className="text-sm" style={{ color: cn.textSecondary }}>No prescriptions found</p>
        </div>
      )}
    </div>
  );
}