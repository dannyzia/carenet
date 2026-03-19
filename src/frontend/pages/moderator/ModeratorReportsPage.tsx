import { cn } from "@/frontend/theme/tokens";
import { Flag } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { moderatorService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function ModeratorReportsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.moderatorReports", "Moderator Reports"));

  const { data: reports, loading } = useAsyncData(() => moderatorService.getReports());

  if (loading || !reports) return <PageSkeleton cards={3} />;

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#535353" }}>Reports</h1>
          <p className="text-sm" style={{ color: "#848484" }}>Handle user and system reports</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[["Open", reports.filter(r => r.status === "open").length, "#EF4444"], ["Investigating", reports.filter(r => r.status === "investigating").length, "#E8A838"], ["Resolved", reports.filter(r => r.status === "resolved").length, "#5FB865"]].map(([l, v, c]) => (
            <div key={l as string} className="stat-card text-center">
              <p className="text-3xl font-bold" style={{ color: c as string }}>{v as number}</p>
              <p className="text-xs mt-1" style={{ color: "#848484" }}>{l as string}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="finance-card p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Flag className="w-4 h-4" style={{ color: r.priority === "high" ? "#EF4444" : r.priority === "medium" ? "#E8A838" : "#5FB865" }} />
                <span className="font-semibold text-sm" style={{ color: "#535353" }}>{r.type}</span>
                <span className="badge-pill" style={{ background: r.status === "open" ? "#EF444420" : r.status === "investigating" ? "#FFB54D20" : "#7CE57720", color: r.status === "open" ? "#EF4444" : r.status === "investigating" ? "#E8A838" : "#5FB865" }}>{r.status}</span>
                <span className="text-xs ml-auto" style={{ color: "#848484" }}>{r.date}</span>
              </div>
              <p className="text-xs mb-1" style={{ color: "#848484" }}>From: <span style={{ color: "#535353" }}>{r.from}</span> against <span style={{ color: "#DB869A" }}>{r.against}</span></p>
              <p className="text-sm" style={{ color: "#535353" }}>{r.desc}</p>
              <div className="flex gap-2 mt-3">
                {r.status !== "resolved" && <button className="px-3 py-1.5 rounded-lg text-xs text-white" style={{ background: "#5FB865" }}>Resolve</button>}
                <button className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: "#E5E7EB", color: "#535353" }}>Details</button>
                <button className="px-3 py-1.5 rounded-lg text-xs text-white" style={{ background: "#7B5EA7" }}>Escalate to Admin</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: "\n        .stat-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.25rem; }\n        .finance-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }\n        .badge-pill { display: inline-flex; align-items: center; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 500; }\n      " }} />
    </>
  );
}