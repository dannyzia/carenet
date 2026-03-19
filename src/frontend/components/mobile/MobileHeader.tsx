import { ArrowLeft } from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { useTransitionNavigate } from "@/frontend/hooks/useTransitionNavigate";

/**
 * MobileHeader — Sticky mobile header with back arrow, title, and optional action.
 * Only visible on mobile (< md breakpoint). Desktop uses the layout header.
 */

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  hideBack?: boolean;
  action?: React.ReactNode;
}

export function MobileHeader({ title, subtitle, onBack, hideBack, action }: MobileHeaderProps) {
  const navigate = useTransitionNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <div
      className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 md:hidden -mx-4 -mt-4 mb-4"
      style={{ background: cn.bgCard, borderBottom: `1px solid ${cn.borderLight}` }}
    >
      {!hideBack && (
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-lg cn-touch-target"
          style={{ color: cn.text }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-base truncate" style={{ color: cn.text }}>{title}</h1>
        {subtitle && <p className="text-xs truncate" style={{ color: cn.textSecondary }}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}