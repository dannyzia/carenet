import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import { ArrowRightLeft, Flag, Clock, Plus, CheckCircle, User, AlertTriangle } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function HandoffNotesPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.handoffNotes", "Handoff Notes"));

  const { data: notes, loading } = useAsyncData(() => caregiverService.getHandoffNotes("p-1"));
  if (loading || !notes) return <PageSkeleton cards={3} />;
  return <HandoffContent initialNotes={notes} />;
}

function HandoffContent({ initialNotes }: { initialNotes: any[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ toCaregiverId: "", notes: "", flaggedItems: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.notes.trim()) return;
    setSubmitting(true);
    const result = await caregiverService.createHandoffNote({
      shiftId: "sh-current", toCaregiverId: form.toCaregiverId || "cg-next",
      patientId: "p-1", notes: form.notes,
      flaggedItems: form.flaggedItems.split("\n").filter(Boolean),
    });
    setNotes(prev => [{
      id: result.id, fromCaregiver: "You", toCaregiver: form.toCaregiverId || "Next Caregiver",
      notes: form.notes, flaggedItems: form.flaggedItems.split("\n").filter(Boolean),
      createdAt: new Date().toISOString(),
    }, ...prev]);
    setShowForm(false);
    setForm({ toCaregiverId: "", notes: "", flaggedItems: "" });
    setSubmitting(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl" style={{ color: cn.textHeading }}>Shift Handoff Notes</h1>
          <p className="text-sm mt-0.5" style={{ color: cn.textSecondary }}>{notes.length} handoff records</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm" style={{ background: "var(--cn-gradient-caregiver)" }}>
          <Plus className="w-4 h-4" /> New Handoff
        </button>
      </div>

      {showForm && (
        <div className="finance-card p-5 space-y-4" style={{ borderLeft: `3px solid ${cn.pink}` }}>
          <h3 className="text-sm flex items-center gap-2" style={{ color: cn.pink }}><ArrowRightLeft className="w-4 h-4" /> Create Handoff Note</h3>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Notes for next caregiver</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={4} placeholder="Summarize patient status, what was done, what needs attention..."
              className="w-full px-4 py-3 rounded-xl border text-sm resize-none" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} />
          </div>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Flagged Items (one per line)</label>
            <textarea value={form.flaggedItems} onChange={e => setForm(f => ({ ...f, flaggedItems: e.target.value }))}
              rows={3} placeholder="BP elevated — recheck in 2 hours&#10;Refused afternoon medication"
              className="w-full px-4 py-3 rounded-xl border text-sm resize-none" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} />
          </div>
          <button onClick={handleSubmit} disabled={!form.notes.trim() || submitting}
            className="w-full py-2.5 rounded-xl text-white text-sm disabled:opacity-50" style={{ background: "var(--cn-gradient-caregiver)" }}>
            {submitting ? "Submitting..." : "Submit Handoff"}
          </button>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {notes.map((note: any, idx: number) => (
          <div key={note.id} className="relative">
            {idx < notes.length - 1 && <div className="absolute left-5 top-12 bottom-0 w-0.5" style={{ background: cn.border }} />}
            <div className="finance-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: cn.pinkBg }}>
                  <ArrowRightLeft className="w-4 h-4" style={{ color: cn.pink }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: cn.textHeading }}>
                    <span style={{ color: cn.pink }}>{note.fromCaregiver}</span> → <span style={{ color: cn.green }}>{note.toCaregiver}</span>
                  </p>
                  <p className="text-xs flex items-center gap-1" style={{ color: cn.textSecondary }}>
                    <Clock className="w-3 h-3" /> {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm" style={{ color: cn.text }}>{note.notes}</p>
              {note.flaggedItems.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs flex items-center gap-1" style={{ color: "var(--cn-amber)" }}><Flag className="w-3 h-3" /> Flagged Items</p>
                  {note.flaggedItems.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 pl-4">
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "var(--cn-amber)" }} />
                      <p className="text-xs" style={{ color: cn.text }}>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
