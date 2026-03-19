"use client";

import React from "react";
import { 
  FileText, 
  Send, 
  Paperclip, 
  ArrowLeft, 
  AlertCircle, 
  MessageSquare, 
  User, 
  Tag, 
  ShieldCheck,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/PageHero";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { supportService } from "@/backend/services/support.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function TicketSubmissionPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.ticketSubmission", "Ticket Submission"));

  const navigate = useNavigate();
  const { data: categories, loading } = useAsyncData(() => supportService.getTicketCategories());

  if (loading || !categories) return <PageSkeleton />;

  return (
    <div>
      {/* Header */}
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)" className="pt-8 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">

            <h1 className="text-2xl font-bold text-white">Create Support Ticket</h1>
          </div>
          <p className="text-white/80 max-w-lg">Describe your issue in detail and our support specialist will get back to you within 2-4 hours.</p>
        </div>
      </PageHero>

      <div className="max-w-3xl mx-auto px-6 -mt-16 relative z-20">
        <div className="finance-card p-10 md:p-12">
           <form className="space-y-8">
              {/* Category Selection */}
              <div className="space-y-4">
                 <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#FEB4C5]" />
                    Issue Category
                 </h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(cat => (
                      <button key={cat} type="button" className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-300 hover:border-[#FEB4C5] hover:text-[#DB869A] dark:hover:text-[#FEB4C5] hover:bg-[#FFF5F7] dark:hover:bg-[#FEB4C5]/10 transition-all">
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>

              <hr className="border-gray-50" />

              {/* Message Details */}
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                    <input className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#7CE577]/20 outline-none transition-all font-bold text-gray-800" placeholder="e.g. Unable to process bKash payment" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                       className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-[#7CE577]/20 transition-all min-h-[200px] text-sm text-gray-600 leading-relaxed" 
                       placeholder="Tell us more about the problem you are facing..."
                    />
                 </div>
              </div>

              {/* Attachments */}
              <div className="space-y-4">
                 <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-[#FEB4C5]" />
                    Attachments (Optional)
                 </h2>
                 <div className="grid grid-cols-4 gap-4">
                    <button type="button" className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-[#FEB4C5] hover:text-[#FEB4C5] hover:bg-[#FFF5F7] transition-all">
                       <Plus className="w-6 h-6 mb-1" />
                       <span className="text-[10px] font-bold uppercase">Add</span>
                    </button>
                 </div>
              </div>

              <div className="pt-6">
                 <Button 
                    type="button" 
                    onClick={() => navigate("/support/help")}
                    className="w-full h-16 rounded-3xl font-black text-lg bg-[#FEB4C5] hover:bg-[#DB869A] text-white shadow-xl group"
                 >
                    Submit Ticket
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
                 <p className="text-center text-[10px] text-gray-400 font-bold mt-6 uppercase tracking-widest">Expected Response: 2h 45m</p>
              </div>
           </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "\n        .finance-card {\n          background: rgba(255, 255, 255, 0.95);\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(255, 255, 255, 0.4);\n          border-radius: 3rem;\n          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);\n        }\n      " }} />
    </div>
  );
}