import { cn } from "@/frontend/theme/tokens";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "@/frontend/i18n";
import { getAllLanguages } from "@/frontend/i18n/languageManager";
import { Globe, ChevronDown } from "lucide-react";

interface LanguageSwitcherProps {
  /** "dropdown" (default) = select menu, "compact" = smaller select, "minimal" = globe icon with dropdown */
  variant?: "dropdown" | "compact" | "minimal";
  className?: string;
}

/**
 * LanguageSwitcher — Dynamic dropdown supporting all built-in + admin-uploaded languages.
 * Persists preference to localStorage via changeLanguage().
 */
export function LanguageSwitcher({
  variant = "dropdown",
  className = "",
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const languages = getAllLanguages();

  const handleChange = (code: string) => {
    changeLanguage(code);
  };

  if (variant === "minimal") {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <Globe className="w-4 h-4 absolute left-2 pointer-events-none" style={{ color: cn.textSecondary }} />
        <select
          value={currentLang}
          onChange={(e) => handleChange(e.target.value)}
          className="appearance-none bg-transparent pl-7 pr-6 py-2 rounded-lg text-xs cursor-pointer focus:outline-none cn-touch-target"
          style={{ color: cn.text }}
          title="Select language"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none" style={{ color: cn.textSecondary }} />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <select
          value={currentLang}
          onChange={(e) => handleChange(e.target.value)}
          className="appearance-none px-2 pr-6 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none cn-touch-target"
          style={{
            borderColor: cn.border,
            color: cn.text,
            background: cn.bgCard,
          }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none" style={{ color: cn.textSecondary }} />
      </div>
    );
  }

  // Default: dropdown
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Globe className="w-4 h-4 absolute left-3 pointer-events-none" style={{ color: cn.green }} />
      <select
        value={currentLang}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border text-sm cursor-pointer focus:outline-none cn-touch-target"
        style={{
          borderColor: cn.border,
          color: cn.text,
          background: cn.bgCard,
          minWidth: "140px",
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-2.5 pointer-events-none" style={{ color: cn.textSecondary }} />
    </div>
  );
}