import { cn } from "@/frontend/theme/tokens";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { agencyService } from "@/backend/services/agency.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function AgencyReportsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.agencyReports", "Agency Reports"));

  const { data: reportsData, loading } = useAsyncData(() => agencyService.getReportsData());

  if (loading || !reportsData) return <PageSkeleton cards={4} />;

  const { monthly: monthlyData, performance: performanceData } = reportsData;

  return (
    <>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-semibold" style={{ color: "#535353" }}>Agency Reports</h1><p className="text-sm" style={{ color: "#848484" }}>Performance analytics and insights</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[["Total Revenue (YTD)", "\u09F3 14.23L", "#5FB865"], ["Client Satisfaction", "4.8 / 5.0", "#E8A838"], ["Caregiver Retention", "94%", "#00897B"], ["Jobs Completed", "312", "#7B5EA7"]].map(([l, v, c]) => (<div key={l as string} className="stat-card"><p className="text-2xl font-bold" style={{ color: c as string }}>{v as string}</p><p className="text-xs mt-1" style={{ color: "#848484" }}>{l as string}</p></div>))}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="finance-card p-5"><h2 className="font-semibold mb-4" style={{ color: "#535353" }}>Clients & Caregivers Growth</h2><ResponsiveContainer width="100%" height={200}><BarChart data={monthlyData} barGap={4}><XAxis dataKey="month" tick={{ fontSize: 12, fill: "#848484" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: "#848484" }} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="clients" fill="#DB869A" radius={[4, 4, 0, 0]} name="Clients" /><Bar dataKey="caregivers" fill="#00897B" radius={[4, 4, 0, 0]} name="Caregivers" /></BarChart></ResponsiveContainer></div>
          <div className="finance-card p-5"><h2 className="font-semibold mb-4" style={{ color: "#535353" }}>Rating Trend</h2><ResponsiveContainer width="100%" height={200}><LineChart data={performanceData}><XAxis dataKey="month" tick={{ fontSize: 12, fill: "#848484" }} axisLine={false} tickLine={false} /><YAxis domain={[4, 5]} tick={{ fontSize: 12, fill: "#848484" }} axisLine={false} tickLine={false} /><Tooltip formatter={(v: number) => [v, "Avg Rating"]} /><Line type="monotone" dataKey="rating" stroke="#E8A838" strokeWidth={2.5} dot={{ fill: "#E8A838", r: 4 }} /></LineChart></ResponsiveContainer></div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: ".stat-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.25rem; } .finance-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }" }} />
    </>
  );
}