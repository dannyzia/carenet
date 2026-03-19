import { cn } from "@/frontend/theme/tokens";
import { AlertCircle, Eye, CheckCircle, XCircle } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { moderatorService } from "@/backend/services/moderator.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function ModeratorContentPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.moderatorContent", "Moderator Content"));

  const { data: content, loading } = useAsyncData(() => moderatorService.getFlaggedContent());

  if (loading || !content) return <PageSkeleton cards={4} />;

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#535353" }}>Content Moderation</h1>
          <p className="text-sm" style={{ color: "#848484" }}>Review flagged content and platform violations</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[["High Severity", content.filter(c => c.severity === "high").length, "#EF4444"], ["Medium", content.filter(c => c.severity === "medium").length, "#E8A838"], ["Low", content.filter(c => c.severity === "low").length, "#5FB865"]].map(([l, v, c]) => (
            <div key={l as string} className="stat-card text-center"><p className="text-3xl font-bold" style={{ color: c as string }}>{v as number}</p><p className="text-xs mt-1" style={{ color: "#848484" }}>{l as string}</p></div>
          ))}
        </div>
        <div className="space-y-3">
          {content.map(c => (
            <div key={c.id} className="finance-card p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: c.severity === "high" ? "#EF444420" : c.severity === "medium" ? "#FFB54D20" : "#7CE57720" }}>
                  <AlertCircle className="w-5 h-5" style={{ color: c.severity === "high" ? "#EF4444" : c.severity === "medium" ? "#E8A838" : "#5FB865" }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center mb-1">
                    <span className="badge-pill" style={{ background: "#F3F4F6", color: "#848484" }}>{c.type}</span>
                    <span className="badge-pill" style={{ background: c.severity === "high" ? "#EF444420" : c.severity === "medium" ? "#FFB54D20" : "#7CE57720", color: c.severity === "high" ? "#EF4444" : c.severity === "medium" ? "#E8A838" : "#5FB865" }}>{c.severity}</span>
                    <span className="text-xs ml-auto" style={{ color: "#848484" }}>{c.time}</span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: "#535353" }}>{c.target}</p>
                  <p className="text-sm mt-1" style={{ color: "#848484" }}>{c.content}</p>
                  <p className="text-xs mt-1" style={{ color: "#848484" }}>Flagged by: {c.reporter} — {c.reason}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: "#E5E7EB", color: "#535353" }}><Eye className="w-3 h-3" />View</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white" style={{ background: "#5FB865" }}><CheckCircle className="w-3 h-3" />Clear</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white" style={{ background: "#EF4444" }}><XCircle className="w-3 h-3" />Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: "\n        .stat-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.25rem; }\n        .finance-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }\n        .badge-pill { display: inline-flex; align-items: center; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 500; }\n      " }} />
    </>
  );
}