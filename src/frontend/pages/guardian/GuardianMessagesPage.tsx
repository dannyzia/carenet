import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { messageService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { ChatPanel } from "@/frontend/components/shared/ChatPanel";
import { cn } from "@/frontend/theme/tokens";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

export default function GuardianMessagesPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.guardianMessages", "Guardian Messages"));

  const [searchParams] = useSearchParams();
  const toUserId = searchParams.get("to");

  const { data: conversations, loading } = useAsyncData(
    () => messageService.getConversations("guardian")
  );

  if (loading || !conversations) return <PageSkeleton cards={3} />;

  return (
    <ChatPanel
      conversations={conversations}
      accentColor={cn.green}
      accentGradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8F5A3 0%, #5FB865 100%)"
      initialConvoId={toUserId || (conversations[0]?.id ?? null)}
    />
  );
}
