"use client";

import React, { useState } from "react";
import { Search, ArrowLeft, ChevronRight, Filter, User, ShoppingBag, FileText, Star, MapPin, Clock, Activity, History, TrendingUp, X, Loader2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Link } from "react-router";
import { useTransitionNavigate } from "@/frontend/hooks/useTransitionNavigate";
import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/shared/PageHero";
import { useDebouncedSearch, useDocumentTitle } from "@/frontend/hooks";
import { searchService, type GlobalSearchResults } from "@/backend/services";
import { useTranslation } from "react-i18next";

export default function GlobalSearchPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.globalSearch", "Global Search"));

  const navigate = useTransitionNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const { query, setQuery, results, loading } = useDebouncedSearch<GlobalSearchResults>(
    (q) => searchService.globalSearch(q),
    300
  );

  const caregivers = results?.caregivers ?? [];
  const agencies = results?.agencies ?? [];
  const jobs = results?.jobs ?? [];
  const totalResults = caregivers.length + agencies.length + jobs.length;

  return (
    <div>
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #1F2937 0%, #111827 100%)" className="pt-12 pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"><ArrowLeft /></button>
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FEB4C5] transition-all" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search caregivers, agencies, jobs..."
                className="w-full h-16 pl-14 pr-14 rounded-3xl bg-white text-gray-800 shadow-2xl border-none outline-none text-xl"
                style={{ fontSize: "16px" }}
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              )}
              {loading && (
                <Loader2 className="absolute right-14 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FEB4C5] animate-spin" />
              )}
            </div>
          </div>
          <div className="flex gap-8 border-b border-white/10">
            {[
              { id: "all", label: "Everything", count: totalResults },
              { id: "caregivers", label: "Caregivers", count: caregivers.length },
              { id: "agencies", label: "Agencies", count: agencies.length },
              { id: "jobs", label: "Jobs", count: jobs.length },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`pb-4 text-sm transition-all relative flex items-center gap-2 ${activeTab === t.id ? 'text-white' : 'text-white/40 hover:text-white/60'}`}>
                {t.label}
                {t.count > 0 && <span className="text-[10px] bg-white/10 px-1.5 rounded-full">{t.count}</span>}
                {activeTab === t.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FEB4C5] rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      <div className="max-w-5xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Empty state */}
            {!query.trim() && (
              <div className="finance-card p-12 text-center">
                <Search className="w-10 h-10 mx-auto mb-4" style={{ color: cn.textSecondary }} />
                <h3 className="text-lg" style={{ color: cn.textHeading }}>Start typing to search</h3>
                <p className="text-sm mt-2" style={{ color: cn.textSecondary }}>Search across caregivers, agencies, and job listings</p>
              </div>
            )}

            {/* No results */}
            {query.trim() && !loading && totalResults === 0 && (
              <div className="finance-card p-12 text-center">
                <h3 className="text-lg" style={{ color: cn.textHeading }}>No results for "{query}"</h3>
                <p className="text-sm mt-2" style={{ color: cn.textSecondary }}>Try different keywords or browse categories</p>
              </div>
            )}

            {/* Caregivers section */}
            {(activeTab === "all" || activeTab === "caregivers") && caregivers.length > 0 && (
              <section className="space-y-6">
                <div className="flex justify-between items-center px-4">
                  <h2 className="text-xl text-gray-800">Caregivers</h2>
                  <Link to="/guardian/search" className="text-[10px] text-[#FEB4C5] uppercase tracking-widest">See all results</Link>
                </div>
                <div className="space-y-3">
                  {caregivers.slice(0, 5).map(c => (
                    <Link key={c.id} to={`/guardian/caregiver/${c.id}`} className="finance-card p-5 flex items-center justify-between hover:border-[#FEB4C5] transition-all">
                      <div className="flex items-center gap-4">
                        <img src={c.image} className="w-14 h-14 rounded-2xl object-cover" alt={c.name} />
                        <div>
                          <h3 className="text-gray-800 leading-none">{c.name}</h3>
                          <p className="text-[10px] text-[#FEB4C5] uppercase mt-2">{c.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-xs text-gray-800">{c.rating}</span></div>
                          <p className="text-[10px] text-gray-300 uppercase">{c.verified ? "Verified" : ""}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-200" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Agencies section */}
            {(activeTab === "all" || activeTab === "agencies") && agencies.length > 0 && (
              <section className="space-y-6">
                <div className="flex justify-between items-center px-4">
                  <h2 className="text-xl text-gray-800">Agencies</h2>
                  <Link to="/guardian/search" className="text-[10px] text-[#5FB865] uppercase tracking-widest">See all results</Link>
                </div>
                <div className="space-y-3">
                  {agencies.slice(0, 3).map(a => (
                    <Link key={a.id} to={`/guardian/agency/${a.id}`} className="finance-card p-5 flex items-center justify-between hover:border-[#5FB865] transition-all">
                      <div className="flex items-center gap-4">
                        <img src={a.image} className="w-14 h-14 rounded-2xl object-cover" alt={a.name} />
                        <div>
                          <h3 className="text-gray-800 leading-none">{a.name}</h3>
                          <p className="text-[10px] uppercase mt-2" style={{ color: cn.teal }}>{a.tagline}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-xs" style={{ color: cn.textSecondary }}><Star className="w-3 h-3" style={{ color: cn.amber }} />{a.rating}</div>
                            <div className="flex items-center gap-1 text-xs" style={{ color: cn.textSecondary }}><MapPin className="w-3 h-3" style={{ color: cn.pink }} />{a.location}</div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-200" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Jobs section */}
            {(activeTab === "all" || activeTab === "jobs") && jobs.length > 0 && (
              <section className="space-y-6">
                <div className="flex justify-between items-center px-4">
                  <h2 className="text-xl text-gray-800">Jobs</h2>
                  <Link to="/marketplace" className="text-[10px] text-[#0288D1] uppercase tracking-widest">See all results</Link>
                </div>
                <div className="space-y-3">
                  {jobs.slice(0, 3).map(j => (
                    <Link key={j.id} to={`/marketplace/job/${j.id}`} className="finance-card p-5 flex items-center justify-between hover:border-[#0288D1] transition-all">
                      <div>
                        <h3 className="text-gray-800 leading-none">{j.title}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs" style={{ color: cn.textSecondary }}><MapPin className="w-3 h-3" style={{ color: cn.pink }} />{j.location}</div>
                          <div className="flex items-center gap-1 text-xs" style={{ color: cn.textSecondary }}><Clock className="w-3 h-3" style={{ color: cn.teal }} />{j.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm" style={{ color: cn.green }}>{j.salary}</span>
                        <ChevronRight className="w-5 h-5 text-gray-200" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="finance-card p-8">
              <h3 className="text-gray-800 mb-6 flex items-center gap-2"><History className="w-4 h-4 text-gray-400" />Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {["Diabetes care", "Wheelchair", "Dhanmondi", "Nurse", "Elder care"].map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="px-4 py-2 rounded-xl bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest hover:bg-gray-100 cursor-pointer">{s}</button>
                ))}
              </div>
            </div>
            <div className="finance-card p-8 bg-gradient-to-br from-[#FEB4C5]/10 to-[#DB869A]/10 border-[#FEB4C5]/20">
              <TrendingUp className="w-6 h-6 text-[#DB869A] mb-4" />
              <h3 className="text-lg text-gray-800 mb-2">Trending Near You</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">Families in Gulshan are currently looking for post-op recovery specialists.</p>
              <Button variant="ghost" className="w-full text-[10px] uppercase text-[#DB869A] bg-white h-10 rounded-xl">View Area Trends</Button>
            </div>
          </aside>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); }" }} />
    </div>
  );
}