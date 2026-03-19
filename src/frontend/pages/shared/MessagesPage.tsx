import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { messageService } from "@/backend/services";
import { useAuth } from "@/backend/store";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { ChatPanel } from "@/frontend/components/shared/ChatPanel";
import { cn } from "@/frontend/theme/tokens";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

const ROLE_STYLES: Record<string, { color: string; gradient: string }> = {
  caregiver: { color: cn.pink, gradient: `radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)` },
  guardian: { color: cn.green, gradient: `radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8F5A3 0%, #5FB865 100%)` },
  agency: { color: cn.teal, gradient: `var(--cn-gradient-agency, radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%))` },
  patient: { color: "#0288D1", gradient: `var(--cn-gradient-patient, linear-gradient(135deg, #0288D1 0%, #01579B 100%))` },
  admin: { color: cn.purple, gradient: `linear-gradient(135deg, #7B5EA7 0%, #5E4080 100%)` },
  moderator: { color: cn.amber, gradient: `linear-gradient(135deg, #E8A838 0%, #D48806 100%)` },
};

export default function MessagesPage() {
  const { t } = useTranslation("common");
  useDocumentTitle(t("pageTitles.messages", "Messages"));
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const role = user?.activeRole || "guardian";
  const toUserId = searchParams.get("to");

  const { data: conversations, loading } = useAsyncData(
    () => messageService.getConversations(role),
    [role]
  );

  if (loading || !conversations) return <PageSkeleton cards={3} />;

  const style = ROLE_STYLES[role] || ROLE_STYLES.guardian;

  return (
    <ChatPanel
      conversations={conversations}
      accentColor={style.color}
      accentGradient={style.gradient}
      initialConvoId={toUserId || (conversations[0]?.id ?? null)}
      showRoleFilter={role === "agency"}
    />
  );
}
