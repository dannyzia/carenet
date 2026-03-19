"use client";

import { useState } from "react";
import { Link } from "react-router";
import { Search, Filter, Star, Clock, DollarSign, MapPin, Building2, Loader2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { cn } from "@/frontend/theme/tokens";
import { marketplaceService } from "@/backend/services";
import { useAsyncData, useDebouncedSearch, useDocumentTitle } from "@/frontend/hooks";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import type { Job } from "@/backend/models";
import { useTranslation } from "react-i18next";

export default function MarketplacePage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.marketplace", "Marketplace"));

  const { data: allJobs, loading: initialLoading } = useAsyncData(() => marketplaceService.getJobs());
  const { query: searchQuery, setQuery: setSearchQuery, results: searchResults, loading: searching } = useDebouncedSearch<Job[]>(
    (q) => marketplaceService.searchJobs(q), 300
  );

  if (initialLoading || !allJobs) return <div className="min-h-screen pb-24 p-6" style={{ backgroundColor: "#F5F7FA" }}><PageSkeleton cards={4} /></div>;

  const filteredJobs = searchQuery.trim() ? (searchResults ?? allJobs) : allJobs;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      <div className="max-w-6xl mx-auto p-6" style={{ backgroundColor: "#FEFEFE" }}>
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold" style={{ color: "#535353" }}>Caregiver Marketplace</h1>
          <p style={{ color: "#848484" }}>Find the perfect caregiver for your loved ones</p>
        </div>
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#848484" }} />
            <Input type="text" placeholder="Search jobs, skills, or agencies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white border-gray-200" style={{ color: "#535353" }} />
          </div>
          <Button variant="outline" className="flex items-center gap-2" style={{ color: "#535353", borderColor: "rgba(132, 132, 132, 0.2)" }}><Filter className="w-4 h-4" />Filters</Button>
        </div>
        <h2 className="mb-4 text-xl font-semibold" style={{ color: "#535353" }}>{filteredJobs.length} Jobs Found</h2>
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="finance-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold" style={{ color: "#535353" }}>{job.title}</h3>
                    {job.agency.verified && <span className="px-2 py-1 rounded-full text-xs" style={{ background: "#7CE577", color: "white" }}>Verified</span>}
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-sm" style={{ color: "#848484" }}>
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{job.location}</span></div>
                    <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" /><span>{job.salary}</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{job.experience}</span></div>
                  </div>
                  <p className="text-base mb-4" style={{ color: "#535353" }}>{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, index) => (<span key={index} className="px-3 py-1 rounded-full text-sm" style={{ background: "rgba(254, 180, 197, 0.2)", color: "#FEB4C5" }}>{skill}</span>))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)" }}><Building2 className="w-5 h-5 text-white" /></div>
                      <div>
                        <h4 className="font-semibold text-sm" style={{ color: "#535353" }}>{job.agency.name}</h4>
                        <div className="flex items-center gap-1"><Star className="w-4 h-4" style={{ fill: "#FFB54D", color: "#FFB54D" }} /><span className="text-sm" style={{ color: "#535353" }}>{job.agency.rating}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)", color: "white" }}>Apply Now</Button>
                      <Button variant="outline" size="sm" style={{ color: "#535353", borderColor: "rgba(132, 132, 132, 0.2)" }}>Details</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}