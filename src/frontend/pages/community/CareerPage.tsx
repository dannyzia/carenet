"use client";

import React from "react";
import { 
  Briefcase, 
  Search, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users, 
  TrendingUp, 
  Heart,
  Globe,
  Award,
  Zap,
  Tag
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate } from "react-router";
import { PageHero } from "@/frontend/components/PageHero";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { communityService } from "@/backend/services/community.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

const openPositions = [
  { id: 1, title: "Senior Medical Coordinator", dept: "Operations", type: "Full-Time", location: "Dhaka", salary: "৳80k - ৳120k" },
  { id: 2, title: "Platform Product Manager", dept: "Product", type: "Full-Time", location: "Remote/Dhaka", salary: "৳150k - ৳220k" },
  { id: 3, title: "Customer Success Lead", dept: "Support", type: "Full-Time", location: "Dhaka", salary: "৳60k - ৳90k" },
  { id: 4, title: "Operations Analyst", dept: "Operations", type: "Full-Time", location: "Dhaka", salary: "৳50k - ৳75k" }
];

export default function CareerPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.career", "Career"));

  const navigate = useNavigate();
  const { data: careerData, loading } = useAsyncData(() => communityService.getCareerData());

  if (loading || !careerData) return <PageSkeleton />;

  return (
    <div>
      {/* Hero Header */}
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)" className="pt-20 pb-48 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-white text-center">
           <div className="flex justify-center mb-6">
              <span className="px-5 py-2 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] border border-white/20">We Are Hiring</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Help Us Care for<br />Every Family</h1>
           <p className="text-white/80 text-xl max-w-2xl mx-auto font-medium">Join the team building the future of digital healthcare and professional nursing in Bangladesh.</p>
           
           <div className="mt-12 flex justify-center gap-6">
              <Button className="h-16 px-10 rounded-3xl bg-white text-[#DB869A] font-black text-lg shadow-2xl hover:bg-gray-50 transition-all">
                 Explore Openings
              </Button>
              <Button variant="ghost" className="h-16 px-10 rounded-3xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20">
                 Our Culture
              </Button>
           </div>
        </div>
        
        {/* Animated Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </PageHero>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
           {[
             { title: "Empower Families", desc: "Build tools that bring professional care to millions.", icon: Heart, color: "bg-[#FFF5F7] text-[#DB869A]" },
             { title: "Scale with Tech", desc: "Solve complex logistics and health challenges.", icon: Zap, color: "bg-blue-50 text-blue-500" },
             { title: "Grow Together", desc: "A mission-driven culture of learning and empathy.", icon: Award, color: "bg-[#E8F9E7] text-[#5FB865]" }
           ].map((v, i) => (
             <div key={i} className="finance-card p-10 group hover:translate-y-[-4px] transition-all">
                <div className={`w-14 h-14 rounded-2xl ${v.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                   <v.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-3">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{v.desc}</p>
             </div>
           ))}
        </div>

        <div className="space-y-12">
           <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-gray-100 pb-8">
              <div>
                 <h2 className="text-4xl font-black text-gray-800 mb-2">Open Positions</h2>
                 <p className="text-gray-400 font-medium uppercase text-[10px] tracking-[0.2em]">4 Active roles available</p>
              </div>
              <div className="flex gap-3">
                 {["Product", "Operations", "Tech", "Support"].map(d => (
                   <button key={d} className="px-5 py-2 rounded-xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#FEB4C5] hover:border-[#FEB4C5] transition-all">{d}</button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {openPositions.map((job) => (
                <div key={job.id} className="finance-card p-8 flex flex-col md:flex-row md:items-center justify-between group hover:border-[#FEB4C5] transition-all cursor-pointer">
                   <div className="flex items-center gap-8">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#FFF5F7] group-hover:text-[#DB869A] transition-all">
                         <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-gray-800 mb-2">{job.title}</h3>
                         <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {job.dept}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                         </div>
                      </div>
                   </div>
                   <div className="mt-6 md:mt-0 flex items-center gap-10">
                      <div className="text-right hidden md:block">
                         <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Estimated Range</p>
                         <p className="font-black text-gray-800">{job.salary}</p>
                      </div>
                      <Button className="h-12 px-8 rounded-xl bg-gray-900 text-white font-black text-xs hover:bg-black shadow-lg">
                         Apply Now
                      </Button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "\n        .finance-card {\n          background: rgba(255, 255, 255, 0.95);\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(255, 255, 255, 0.4);\n          border-radius: 3rem;\n          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);\n        }\n      " }} />
    </div>
  );
}