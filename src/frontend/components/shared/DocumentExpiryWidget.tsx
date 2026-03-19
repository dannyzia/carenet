/**
 * DocumentExpiryWidget — dashboard widget showing upcoming document expirations
 */
import { cn } from "@/frontend/theme/tokens";
import { AlertTriangle, Clock, FileWarning, CheckCircle, ChevronRight } from "lucide-react";
import { useAsyncData } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services";
import type { DocumentExpiryAlert } from "@/backend/models";

const severityConfig: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  expired: { color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: FileWarning, label: "Expired" },
  critical: { color: "#F97316", bg: "rgba(249,115,22,0.1)", icon: AlertTriangle, label: "Expires Soon" },
  warning: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: Clock, label: "Upcoming" },
  info: { color: "#0288D1", bg: "rgba(2,136,209,0.1)", icon: CheckCircle, label: "Valid" },
};

export function DocumentExpiryWidget() {
  const { data: alerts, loading } = useAsyncData(() => caregiverService.getExpiringDocuments(90));

  if (loading || !alerts) {
    return (
      <div className="finance-card p-4 animate-pulse">
        <div className="h-4 w-32 rounded bg-gray-200 mb-3" />
        <div className="space-y-2">
          <div className="h-10 rounded bg-gray-100" />
          <div className="h-10 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (alerts.length === 0) return null;

  const expired = alerts.filter(a => a.severity === "expired").length;
  const critical = alerts.filter(a => a.severity === "critical").length;

  return (
    <div className="finance-card p-4 space-y-3" style={{ borderLeft: `3px solid ${expired > 0 ? "#EF4444" : critical > 0 ? "#F97316" : "#F59E0B"}` }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm flex items-center gap-2" style={{ color: cn.textHeading }}>
          <FileWarning className="w-4 h-4" style={{ color: expired > 0 ? "#EF4444" : "#F59E0B" }} />
          Document Alerts
        </h3>
        {expired > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">{expired} expired</span>
        )}
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity] || severityConfig.info;
          const Icon = cfg.icon;
          return (
            <div key={alert.documentId} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: cfg.bg }}>
              <Icon className="w-4 h-4 shrink-0" style={{ color: cfg.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: cn.text }}>{alert.documentName}</p>
                <p className="text-xs" style={{ color: cfg.color }}>
                  {alert.daysUntilExpiry < 0 ? `Expired ${Math.abs(alert.daysUntilExpiry)} days ago` :
                   alert.daysUntilExpiry === 0 ? "Expires today" :
                   `Expires in ${alert.daysUntilExpiry} days`}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: cn.textSecondary }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
