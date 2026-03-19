import React, { useState } from "react";
import { Search, MapPin, Clock, DollarSign, Star, Filter, Bookmark, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/frontend/theme/tokens";
import { useNavigate } from "react-router";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";

const types = ["All Types", "Elderly Care", "Child Care", "Post-Surgery", "Physiotherapy", "Dementia Care", "Palliative Care"];

export default function CaregiverJobsPage() {
  const { t } = useTranslation("common");
  useDocumentTitle(t("pageTitles.jobMarketplace", "Job Marketplace"));
  const { data: jobs, loading } = useAsyncData(() => caregiverService.getAvailableJobs());
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [saved, setSaved] = useState<string[]>([]);
  const navigate = useNavigate();

  if (loading || !jobs) return <PageSkeleton cards={4} />;

  const filtered = jobs.filter(j =>
    (type === "All Types" || j.type === type) &&
    (j.title.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSave = (id: string) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="space-y-5">
        <div>
          <h1 className="text-2xl" style={{ color: cn.text }}>Find Jobs</h1>
          <p className="text-sm mt-0.5" style={{ color: cn.textSecondary }}>Browse caregiving opportunities near you</p>
        </div>

        {/* Filters */}
        <div className="cn-card-flat p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: cn.textSecondary }} />
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none focus:ring-1"
                style={{ borderColor: cn.border, color: cn.text, background: cn.bgInput }}
                placeholder="Search by title or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: cn.textSecondary }} />
              <select
                className="pl-10 pr-8 py-2 rounded-lg border text-sm outline-none appearance-none"
                style={{ borderColor: cn.border, color: cn.text, background: cn.bgInput, minWidth: "160px" }}
                value={type}
                onChange={e => setType(e.target.value)}
              >
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: cn.textSecondary }} />
            </div>
          </div>
        </div>

        <p className="text-sm" style={{ color: cn.textSecondary }}>{filtered.length} jobs found</p>

        {/* Job Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(job => (
            <div key={job.id} className="cn-card-flat p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm" style={{ color: cn.text }}>{job.title}</h3>
                    {job.urgent && (
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: cn.textSecondary }}>{job.patient} • Age {job.age}</p>
                </div>
                <button onClick={() => toggleSave(job.id)} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity">
                  <Bookmark
                    className="w-4 h-4"
                    style={{
                      color: saved.includes(job.id) ? cn.pink : cn.textSecondary,
                      fill: saved.includes(job.id) ? cn.pink : "none",
                    }}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs">
                <span className="flex items-center gap-1" style={{ color: cn.textSecondary }}>
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1" style={{ color: cn.textSecondary }}>
                  <Clock className="w-3 h-3" /> {job.duration}
                </span>
                <span className="flex items-center gap-1" style={{ color: cn.green }}>
                  <DollarSign className="w-3 h-3" /> {job.budget}
                </span>
                {job.rating && (
                  <span className="flex items-center gap-1" style={{ color: cn.amber }}>
                    <Star className="w-3 h-3 fill-current" /> {job.rating}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.skills.map(sk => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{ background: cn.pinkBg, color: cn.pink }}
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: cn.textSecondary }}>Posted {job.posted}</span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs border hover:opacity-80 transition-opacity"
                    style={{ borderColor: cn.border, color: cn.text }}
                    onClick={() => navigate(`/caregiver/jobs/${job.id}`)}
                  >
                    Details
                  </button>
                  <button
                    className="px-4 py-1.5 rounded-lg text-xs text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--cn-gradient-caregiver)" }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}