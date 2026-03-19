import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/theme/tokens";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

export default function NotFoundPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.notFound", "Not Found"));

  const { t } = useTranslation("common");

  return (
    <div
      className="flex-1 flex items-center justify-center px-6 pb-20"
      style={{ backgroundColor: cn.bgPage }}
    >
      <div className="finance-card p-8 md:p-12 text-center max-w-md">
        <h1
          className="text-6xl mb-4"
          style={{ color: cn.pinkLight }}
        >
          {t("error.notFoundTitle")}
        </h1>
        <h2
          className="text-2xl mb-4"
          style={{ color: cn.text }}
        >
          {t("error.notFound")}
        </h2>
        <p className="mb-6" style={{ color: cn.textSecondary }}>
          {t("error.notFoundMessage")}
        </p>
        <Button
          size="lg"
          className="px-8"
          style={{
            background: "var(--cn-gradient-caregiver)",
            color: "white",
            boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
          }}
        >
          {t("error.goHome")}
        </Button>
      </div>
    </div>
  );
}