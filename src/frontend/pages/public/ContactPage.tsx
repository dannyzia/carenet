import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/theme/tokens";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

export default function ContactPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.contact", "Contact"));

  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: cn.bgPage }}
    >
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🐣</div>
        <h1 className="text-3xl md:text-4xl mb-4" style={{ color: cn.text }}>
          Contact
        </h1>
        <p className="text-lg mb-8" style={{ color: cn.textSecondary }}>
          Will be hatching soon...
        </p>
        <Link to="/home">
          <Button
            variant="outline"
            className="gap-2"
            style={{ color: cn.text, borderColor: "rgba(254, 180, 197, 0.4)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
