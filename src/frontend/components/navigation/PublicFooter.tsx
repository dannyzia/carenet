import { cn } from "@/frontend/theme/tokens";
import { Link } from "react-router";
import { Button } from "@/frontend/components/ui/button";
import { useTranslation } from "react-i18next";

const footerLinks = [
  { labelKey: "features", navKey: "features", to: "/features" },
  { labelKey: "pricing",  navKey: "pricing",  to: "/pricing"  },
  { labelKey: "about",    navKey: "about",    to: "/about"    },
  { labelKey: "contact",  navKey: "contact",  to: "/contact"  },
  { labelKey: "privacy",  navKey: "privacy",  to: "/privacy"  },
  { labelKey: "terms",    navKey: "terms",    to: "/terms"    },
];

export function PublicFooter() {
  const { t } = useTranslation("common");

  return (
    <div className="px-6 py-12 md:py-16" style={{ backgroundColor: cn.bgCard }}>
      <div className="max-w-4xl mx-auto">
        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {footerLinks.map(({ labelKey, navKey, to }) => (
            <Link key={to} to={to}>
              <Button
                variant="outline"
                className="w-full min-h-[48px] py-3 px-4 text-sm transition-all hover:border-[#FEB4C5] hover:text-[#FEB4C5] hover:bg-[rgba(254,180,197,0.05)]"
                style={{
                  color: cn.text,
                  borderColor: "rgba(254, 180, 197, 0.3)",
                  backgroundColor: "transparent",
                }}
              >
                {t(`footer.${labelKey}`, { defaultValue: t(`nav.${navKey}`, labelKey) })}
              </Button>
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t pt-6" style={{ borderColor: "rgba(0, 0, 0, 0.08)" }}>
          <p className="text-center text-sm leading-relaxed" style={{ color: cn.textSecondary }}>
            &copy; 2024 {t("app.name")}. {t("footer.rights")}
          </p>
          <p className="text-center text-xs mt-1" style={{ color: cn.textSecondary, opacity: 0.6 }}>
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </div>
  );
}