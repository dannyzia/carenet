"use client";

import React from "react";
import { CheckCircle2, XCircle, ArrowLeft, ChevronRight, Mail, ShieldCheck, ArrowRight, RefreshCcw, Home, MessageSquare, Globe } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useSearchParams } from "react-router";
import { useTransitionNavigate } from "@/frontend/hooks/useTransitionNavigate";
import { cn } from "@/frontend/theme/tokens";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

export default function VerificationResultPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.verificationResult", "Verification Result"));

  const navigate = useTransitionNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "success";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ backgroundColor: "#F5F7FA" }}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10" style={{ background: status === 'success' ? '#7CE577' : '#FEB4C5' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ background: status === 'success' ? '#FEB4C5' : '#DB869A' }} />
      <div className="finance-card p-12 md:p-20 text-center max-w-xl w-full relative z-10 animate-in zoom-in duration-500">
        {status === 'success' ? (
          <div className="space-y-10">
            <div className="w-24 h-24 bg-[#E8F9E7] rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce"><ShieldCheck className="w-12 h-12 text-[#5FB865]" /></div>
            <div><h1 className="text-4xl font-black text-gray-800 mb-4">Email Verified!</h1><p className="text-gray-400 text-lg">Your identity has been authenticated. You now have full access to the CareNet dashboard.</p></div>
            <div className="space-y-3"><Button onClick={() => navigate("/auth/login")} className="w-full h-16 rounded-3xl bg-gray-900 hover:bg-black text-white font-black text-lg shadow-2xl transition-all group">Go to Dashboard<ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" /></Button><Button variant="ghost" className="h-14 text-[10px] font-black uppercase tracking-widest text-gray-400">Set Up Profile Later</Button></div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="w-24 h-24 bg-[#FFF5F7] rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl"><XCircle className="w-12 h-12 text-[#DB869A]" /></div>
            <div><h1 className="text-4xl font-black text-gray-800 mb-4">Verification Failed</h1><p className="text-gray-400 text-lg">The link has expired or is invalid. Please request a new verification email.</p></div>
            <div className="space-y-3"><Button className="w-full h-16 rounded-3xl bg-[#FEB4C5] hover:bg-[#DB869A] text-white font-black text-lg shadow-2xl transition-all">Resend Verification Link<RefreshCcw className="ml-2 w-5 h-5" /></Button><Button variant="ghost" onClick={() => navigate("/support/help")} className="h-14 text-sm font-bold text-gray-400 flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" /> Contact Support</Button></div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 4rem; box-shadow: 0 30px 100px rgba(0, 0, 0, 0.05); }" }} />
    </div>
  );
}