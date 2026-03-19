"use client";

import React from "react";
import { 
  BookOpen, 
  Search, 
  Filter, 
  ArrowLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Calendar, 
  Tag, 
  Heart,
  TrendingUp,
  Share2
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate, Link } from "react-router";
import { PageHero } from "@/frontend/components/PageHero";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { communityService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function BlogListPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.blogList", "Blog List"));

  const { data: mockPosts, loading } = useAsyncData(() => communityService.getBlogPosts());
  const navigate = useNavigate();

  if (loading || !mockPosts) return <PageSkeleton cards={3} />;

  return (
    <div>
      {/* Hero Header */}
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #111827 0%, #000000 100%)" className="pt-20 pb-40 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-white text-center">
           <div className="flex justify-center mb-6">
              <span className="px-5 py-2 rounded-full bg-white/10 text-[#7CE577] text-xs font-black uppercase tracking-[0.3em] border border-white/10">CareNet Blog</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Insight into a<br />Healthier Bangladesh</h1>
           <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input type="text" placeholder="Search topics, doctors, or guides..." className="w-full h-16 pl-16 pr-6 rounded-3xl bg-white/5 border border-white/10 text-white outline-none focus:bg-white/10 focus:border-[#7CE577]/50 transition-all text-lg" />
           </div>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7CE577]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </PageHero>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Featured Post */}
           <div className="lg:col-span-2 space-y-12">
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                       <TrendingUp className="w-6 h-6 text-[#FEB4C5]" />
                       Latest Insights
                    </h2>
                    <div className="flex gap-2">
                       {["General", "Nursing", "Research", "News"].map(t => (
                         <button key={t} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-800">{t}</button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-12">
                    {mockPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.id}`} className="group space-y-6 block">
                         <div className="aspect-[21/9] rounded-[3rem] overflow-hidden relative shadow-2xl">
                            <img src={post.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                            <div className="absolute top-6 left-6 px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md text-[#DB869A] text-[10px] font-black uppercase tracking-widest shadow-lg">
                               {post.cat}
                            </div>
                         </div>
                         <div className="px-4 space-y-4">
                            <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                               <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {post.author}</span>
                               <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                               <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> 5 min read</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-800 group-hover:text-[#DB869A] transition-colors leading-snug">{post.title}</h3>
                            <p className="text-gray-500 leading-relaxed max-w-2xl">{post.excerpt}</p>
                            <div className="pt-4 flex items-center gap-2 font-black text-[#FEB4C5] group-hover:gap-4 transition-all">
                               Read Full Insight <ChevronRight className="w-5 h-5" />
                            </div>
                         </div>
                      </Link>
                    ))}
                 </div>
              </div>
           </div>

           {/* Sidebar */}
           <div className="lg:col-span-1 space-y-12">
              <div className="finance-card p-10 bg-gray-900 text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-4">Join our Newsletter</h3>
                    <p className="text-white/50 text-xs mb-8 leading-relaxed">Get the latest health tips and platform updates delivered to your inbox every week.</p>
                    <div className="space-y-3">
                       <input type="email" placeholder="Email address" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm outline-none focus:bg-white/10" />
                       <Button className="w-full h-14 bg-[#7CE577] hover:bg-[#5FB865] text-white font-black rounded-2xl shadow-xl transition-all">Subscribe Now</Button>
                    </div>
                 </div>
                 <BookOpen className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 opacity-10" />
              </div>

              <div className="space-y-8">
                 <h3 className="text-xl font-bold text-gray-800">Categories</h3>
                 <div className="space-y-4">
                    {[
                      { name: "Family Healthcare", count: 24 },
                      { name: "Professional Nursing", count: 18 },
                      { name: "Child Growth", count: 12 },
                      { name: "Geriatric Research", count: 9 },
                      { name: "Mental Wellness", count: 15 }
                    ].map((c, i) => (
                      <div key={i} className="flex justify-between items-center group cursor-pointer">
                         <span className="text-sm font-bold text-gray-500 group-hover:text-[#FEB4C5] transition-colors">{c.name}</span>
                         <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-0.5 rounded group-hover:bg-[#FFF5F7] group-hover:text-[#DB869A] transition-all">{c.count}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="finance-card p-10 bg-gradient-to-br from-[#FEB4C5]/10 to-[#DB869A]/10 border-[#FEB4C5]/20">
                 <h3 className="text-xl font-bold text-gray-800 mb-6">Trending Now</h3>
                 <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4 group cursor-pointer">
                         <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden shadow-md">
                            <img src={`https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=100&h=100`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="trend" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-800 leading-snug group-hover:text-[#DB869A] transition-colors">Digital monitoring for diabetic patients in Dhaka</p>
                            <p className="text-[10px] text-gray-400 mt-2">2 min read</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "\n        .finance-card {\n          background: rgba(255, 255, 255, 0.95);\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(255, 255, 255, 0.4);\n          border-radius: 3rem;\n          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);\n        }\n      " }} />
    </div>
  );
}