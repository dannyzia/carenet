"use client";

import React from "react";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  Share2, 
  Heart, 
  MessageCircle, 
  ChevronRight, 
  CheckCircle2,
  BookOpen,
  Tag,
  Award
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { communityService } from "@/backend/services/community.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useNavigate, useParams } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { useTranslation } from "react-i18next";

export default function BlogDetailPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.blogDetail", "Blog Detail"));

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, loading } = useAsyncData(() => communityService.getBlogPostById(id ?? "1"), [id]);

  if (loading || !post) return <PageSkeleton />;

  return (
    <div>
      {/* Header Overlay */}
      <div className="h-96 relative overflow-hidden -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-6">
        <img 
          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1600&h=600" 
          className="w-full h-full object-cover" 
          alt="blog cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
        
        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all z-20">
          <ArrowLeft />
        </button>
        
        <div className="absolute top-8 right-8 flex gap-3 z-20">
           <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all border border-white/20 shadow-xl"><Share2 className="w-4 h-4" /></button>
           <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all border border-white/20 shadow-xl"><Heart className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-20">
        <article className="finance-card p-10 md:p-16 space-y-12">
           {/* Meta */}
           <div className="space-y-6">
              <div className="flex flex-wrap gap-4 items-center">
                 <span className="px-5 py-2 rounded-2xl bg-[#E8F9E7] text-[#5FB865] text-[10px] font-black uppercase tracking-widest">Health Guide</span>
                 <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> March 12, 2026</span>
                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> 8 min read</span>
                 </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight">Essential Post-Operative Care Tips for Families</h1>
              
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                 <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=60&h=60" className="w-12 h-12 rounded-2xl object-cover shadow-md" alt="author" />
                 <div>
                    <p className="font-bold text-gray-800">Dr. Farhana Ahmed</p>
                    <p className="text-[10px] text-[#7CE577] font-bold uppercase tracking-widest">Medical Reviewer</p>
                 </div>
              </div>
           </div>

           {/* Content */}
           <div className="space-y-8 text-lg text-gray-600 leading-loose">
              <p className="font-medium text-gray-800">Recovering from surgery is a critical phase. Learn how you can support your loved ones at home with these professional medical insights.</p>
              
              <h2 className="text-2xl font-black text-gray-800 pt-6">1. Medication Management</h2>
              <p>The first 48 hours after surgery are the most critical for pain management. Ensuring the patient takes their prescribed medication exactly as scheduled is vital to prevent severe pain breakthroughs. Using a digital reminder app like CareNet can help you stay on track with diverse drug schedules.</p>
              
              <div className="p-10 rounded-[2.5rem] bg-[#FFF5F7] border border-[#FEB4C5]/20 my-10 relative overflow-hidden">
                 <h3 className="text-xl font-bold text-[#DB869A] mb-4 relative z-10">Pro Tip</h3>
                 <p className="text-gray-600 relative z-10">Keep a written log of all medications given, including the dose and time. This is invaluable information for medical professionals during follow-up visits.</p>
                 <Award className="absolute -bottom-10 -right-10 w-48 h-48 text-[#FEB4C5] opacity-10" />
              </div>

              <h2 className="text-2xl font-black text-gray-800 pt-6">2. Infection Control</h2>
              <p>Infection at the incision site is a common risk. Families should be trained on how to properly wash hands before touching the patient and how to spot early signs of infection: redness, swelling, warmth, or unusual discharge.</p>
              
              <ul className="space-y-4 pt-4">
                 {[
                   "Always use sterile gloves for wound dressing.",
                   "Monitor body temperature twice daily.",
                   "Report any fever above 101°F immediately."
                 ].map((li, i) => (
                   <li key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#E8F9E7] flex items-center justify-center flex-shrink-0 mt-1"><CheckCircle2 className="w-4 h-4 text-[#5FB865]" /></div>
                      <span className="text-base font-medium">{li}</span>
                   </li>
                 ))}
              </ul>

              <blockquote className="border-l-8 border-[#FEB4C5] pl-8 my-12 py-4 italic text-2xl font-medium text-gray-400">
                "Home-based care is not just about physical healing; it's about providing the emotional safety that hospitals often lack."
              </blockquote>
           </div>

           {/* Footer / Tags */}
           <div className="pt-12 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                 {["Surgery", "Nursing", "Family Support", "Dhaka Health", "Geriatrics"].map(t => (
                   <span key={t} className="px-4 py-2 rounded-xl bg-gray-50 text-gray-400 text-xs font-bold transition-all hover:bg-gray-100 cursor-pointer">#{t}</span>
                 ))}
              </div>
           </div>
        </article>

        {/* Related Posts */}
        <div className="mt-20 space-y-8">
           <h3 className="text-2xl font-black text-gray-800">Continue Reading</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <div key={i} className="finance-card p-8 flex gap-6 group hover:translate-y-[-4px] transition-all cursor-pointer">
                   <div className="w-24 h-24 rounded-3xl bg-gray-100 flex-shrink-0 overflow-hidden shadow-lg">
                      <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=150&h=150" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="related" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-[#FEB4C5] uppercase mb-2">Category</p>
                      <h4 className="font-bold text-gray-800 group-hover:text-[#DB869A] transition-colors leading-tight">Managing Chronic Hypertension in the Elderly</h4>
                      <div className="flex items-center gap-3 mt-4 text-[10px] font-bold text-gray-400 uppercase">
                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min</span>
                         <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 12 Comments</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "\n        .finance-card {\n          background: rgba(255, 255, 255, 0.95);\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(255, 255, 255, 0.4);\n          border-radius: 4rem;\n          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.05);\n        }\n      " }} />
    </div>
  );
}