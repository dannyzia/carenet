import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import { FileText, Copy, Check, Clock, Pill, Calendar, ChevronDown, ChevronUp, Stethoscope, ListChecks } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { agencyService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useAriaToast } from "@/frontend/hooks/useAriaToast";
import type { CarePlanTemplate } from "@/backend/models";
import { useTranslation } from "react-i18next";

export default function CarePlanTemplatePage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.carePlanTemplate", "Care Plan Template"));

  const toast = useAriaToast();
  const { data: templates, loading } = useAsyncData(() => agencyService.getCareTemplates());
  if (loading || !templates) return <PageSkeleton cards={3} />;
  return <TemplateContent templates={templates} />;
}

function TemplateContent({ templates }: { templates: CarePlanTemplate[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const toast = useAriaToast();

  const handleApply = async (templateId: string) => {
    await agencyService.applyTemplate(templateId, "pl-demo");
    setAppliedIds(prev => new Set(prev).add(templateId));
    toast.success("Template applied to placement!");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl" style={{ color: cn.textHeading }}>Care Plan Templates</h1>
        <p className="text-sm mt-0.5" style={{ color: cn.textSecondary }}>Pre-built care plans for common conditions. Apply to any placement.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="finance-card p-3 text-center">
          <p className="text-lg" style={{ color: cn.pink }}>{templates.length}</p>
          <p className="text-xs" style={{ color: cn.textSecondary }}>Templates</p>
        </div>
        <div className="finance-card p-3 text-center">
          <p className="text-lg" style={{ color: cn.green }}>{templates.reduce((acc, t) => acc + t.tasks.length, 0)}</p>
          <p className="text-xs" style={{ color: cn.textSecondary }}>Total Tasks</p>
        </div>
        <div className="finance-card p-3 text-center">
          <p className="text-lg" style={{ color: "var(--cn-blue)" }}>{templates.reduce((acc, t) => acc + t.medications.length, 0)}</p>
          <p className="text-xs" style={{ color: cn.textSecondary }}>Medications</p>
        </div>
      </div>

      <div className="space-y-3">
        {templates.map(template => {
          const expanded = expandedId === template.id;
          const applied = appliedIds.has(template.id);
          return (
            <div key={template.id} className="finance-card overflow-hidden">
              {/* Header */}
              <div className="p-4 cursor-pointer" onClick={() => setExpandedId(expanded ? null : template.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.pinkBg }}>
                      <Stethoscope className="w-5 h-5" style={{ color: cn.pink }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: cn.textHeading }}>{template.name}</p>
                      <p className="text-xs" style={{ color: cn.textSecondary }}>{template.condition} · {template.tasks.length} tasks · {template.medications.length} meds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {applied && <Check className="w-4 h-4 text-green-500" />}
                    {expanded ? <ChevronUp className="w-4 h-4" style={{ color: cn.textSecondary }} /> : <ChevronDown className="w-4 h-4" style={{ color: cn.textSecondary }} />}
                  </div>
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded && (
                <div className="px-4 pb-4 space-y-4" style={{ borderTop: `1px solid ${cn.border}` }}>
                  <p className="text-sm pt-3" style={{ color: cn.text }}>{template.description}</p>

                  {/* Tasks */}
                  <div>
                    <p className="text-xs mb-2 flex items-center gap-1" style={{ color: cn.pink }}><ListChecks className="w-3.5 h-3.5" /> Daily Tasks</p>
                    <div className="space-y-1.5">
                      {template.tasks.map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: cn.bgInput }}>
                          <span className="text-sm" style={{ color: cn.text }}>{task.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: cn.pinkBg, color: cn.pink }}>{task.frequency}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medications */}
                  <div>
                    <p className="text-xs mb-2 flex items-center gap-1" style={{ color: cn.green }}><Pill className="w-3.5 h-3.5" /> Medications</p>
                    <div className="space-y-1.5">
                      {template.medications.map((med, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: cn.bgInput }}>
                          <div>
                            <span className="text-sm" style={{ color: cn.text }}>{med.name}</span>
                            <span className="text-xs ml-2" style={{ color: cn.textSecondary }}>{med.dosage}</span>
                          </div>
                          <span className="text-xs" style={{ color: cn.textSecondary }}>{med.frequency}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <p className="text-xs mb-2 flex items-center gap-1" style={{ color: "var(--cn-blue)" }}><Calendar className="w-3.5 h-3.5" /> Schedule</p>
                    <div className="space-y-1.5">
                      {template.schedule.map((slot, i) => (
                        <div key={i} className="p-2.5 rounded-lg" style={{ background: cn.bgInput }}>
                          <p className="text-xs mb-1" style={{ color: cn.textSecondary }}>{slot.shift} Shift</p>
                          <div className="flex flex-wrap gap-1">
                            {slot.tasks.map((task, j) => (
                              <span key={j} className="text-xs px-2 py-0.5 rounded-full" style={{ background: cn.bgCard, color: cn.text, border: `1px solid ${cn.border}` }}>{task}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button onClick={() => handleApply(template.id)} disabled={applied}
                    className="w-full py-2.5 rounded-xl text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: applied ? cn.green : "var(--cn-gradient-caregiver)" }}>
                    {applied ? <><Check className="w-4 h-4" /> Applied</> : <><Copy className="w-4 h-4" /> Apply to Placement</>}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}