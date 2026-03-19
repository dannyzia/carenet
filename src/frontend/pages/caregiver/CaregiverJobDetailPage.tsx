import { useState } from "react";
import { useParams } from "react-router";
import { useTransitionNavigate } from "@/frontend/hooks/useTransitionNavigate";
import { cn } from "@/frontend/theme/tokens";
import {
  ArrowLeft, MapPin, Clock, DollarSign, Star, Calendar,
  User, Heart, Briefcase, CheckCircle2, MessageSquare,
  ShieldCheck, AlertTriangle, Share2, Bookmark
} from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import type { JobDetail } from "@/backend/models";
import { useTranslation } from "react-i18next";

export default function CaregiverJobDetailPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.caregiverJobDetail", "Caregiver Job Detail"));

  const { id } = useParams<{ id: string }>();
  const navigate = useTransitionNavigate();
  const { data: job, loading } = useAsyncData(() => caregiverService.getJobDetailById(id ?? ""));

  if (loading) return <PageSkeleton cards={3} />;

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Briefcase className="w-12 h-12 mb-4" style={{ color: cn.textSecondary }} />
        <h2 className="mb-2" style={{ color: cn.text }}>Job Not Found</h2>
        <p className="text-sm mb-6" style={{ color: cn.textSecondary }}>This job listing doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/caregiver/jobs")} className="px-5 py-2 rounded-xl text-sm text-white" style={{ background: "var(--cn-gradient-caregiver)" }}>Back to Jobs</button>
      </div>
    );
  }

  return <JobDetailContent job={job} />;
}

function JobDetailContent({ job }: { job: JobDetail }) {
  const navigate = useTransitionNavigate();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <>
      <div className="space-y-5 max-w-4xl mx-auto">

        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/caregiver/jobs")} className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity" style={{ color: cn.textSecondary }}>
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </button>
          <div className="flex gap-2">
            <button onClick={() => setSaved(s => !s)} className="p-2 rounded-lg border transition-all" style={{ borderColor: cn.border, background: cn.bgCard }} title="Save job">
              <Bookmark className="w-4 h-4" style={{ color: saved ? cn.pink : cn.textSecondary, fill: saved ? cn.pink : "none" }} />
            </button>
            <button className="p-2 rounded-lg border transition-all" style={{ borderColor: cn.border, background: cn.bgCard }} title="Share">
              <Share2 className="w-4 h-4" style={{ color: cn.textSecondary }} />
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="rounded-2xl p-6 text-white" style={{ background: "var(--cn-gradient-caregiver)" }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl text-white">{job.title}</h1>
                  {job.urgent && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                      <AlertTriangle className="w-3 h-3" /> Urgent
                    </span>
                  )}
                </div>
                <p className="text-white/80 text-sm">{job.patient} · {job.gender}, {job.age} yrs</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/70">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.shift}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{job.duration}</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl text-white">{job.budget}</p>
              <p className="text-xs text-white/60 mt-0.5">{job.careType}</p>
              {job.rating && (
                <span className="flex items-center justify-end gap-1 text-xs text-white/80 mt-1">
                  <Star className="w-3 h-3 fill-white" /> {job.rating} guardian rating
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20 text-xs text-white/70">
            <span>Posted {job.posted}</span>
            <span>{job.applicants} caregiver{job.applicants !== 1 ? "s" : ""} applied</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="cn-card-flat p-6">
              <h2 className="mb-3" style={{ color: cn.text }}>Job Description</h2>
              <p className="text-sm leading-relaxed" style={{ color: cn.textSecondary }}>{job.description}</p>
            </div>
            <div className="cn-card-flat p-6">
              <h2 className="mb-4" style={{ color: cn.text }}>Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(sk => (
                  <span key={sk} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm" style={{ background: cn.greenBg, color: cn.green }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {sk}
                  </span>
                ))}
              </div>
            </div>
            <div className="cn-card-flat p-6">
              <h2 className="mb-4" style={{ color: cn.text }}>Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: cn.textSecondary }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: cn.pinkBg }}>
                      <span className="text-xs" style={{ color: cn.pink }}>{i + 1}</span>
                    </div>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="cn-card-flat p-5" style={{ borderLeft: `3px solid ${cn.green}` }}>
              <h3 className="mb-3 text-sm" style={{ color: cn.text }}>Pay Estimate</h3>
              <p className="mb-1" style={{ color: cn.green }}>{job.budget}</p>
              <p className="text-xs" style={{ color: cn.textSecondary }}>{job.budgetBreakdown}</p>
              <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: cn.borderLight, color: cn.textSecondary }}>
                CareNet service fee (5%) deducted at payout
              </div>
            </div>
            <div className="cn-card-flat p-5">
              <h3 className="mb-4 text-sm" style={{ color: cn.text }}>Posted By</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={job.guardianImg} alt={job.guardianName} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm" style={{ color: cn.text }}>{job.guardianName}</p>
                  <div className="flex items-center gap-1 text-xs mt-0.5">
                    {job.guardianVerified ? (
                      <><ShieldCheck className="w-3 h-3" style={{ color: cn.green }} /><span style={{ color: cn.green }}>Verified Guardian</span></>
                    ) : (
                      <><User className="w-3 h-3" style={{ color: cn.textSecondary }} /><span style={{ color: cn.textSecondary }}>Unverified</span></>
                    )}
                  </div>
                </div>
              </div>
              <button className="w-full py-2 rounded-xl text-sm border flex items-center justify-center gap-2 hover:opacity-80 transition-opacity" style={{ borderColor: cn.border, color: cn.text }}>
                <MessageSquare className="w-4 h-4" /> Message Guardian
              </button>
            </div>
            <div className="cn-card-flat p-5">
              <h3 className="mb-4 text-sm" style={{ color: cn.text }}>Job Info</h3>
              <div className="space-y-3">
                {[
                  { icon: Briefcase, label: "Care Type", value: job.careType },
                  { icon: MapPin, label: "Location", value: job.location },
                  { icon: Clock, label: "Shift", value: job.shift },
                  { icon: Calendar, label: "Duration", value: job.duration },
                  { icon: User, label: "Patient", value: `${job.gender}, ${job.age} yrs` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: cn.bgInput }}>
                      <Icon className="w-4 h-4" style={{ color: cn.textSecondary }} />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: cn.textSecondary }}>{label}</p>
                      <p className="text-sm" style={{ color: cn.text }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Apply CTA */}
        <div className="cn-card-flat p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm" style={{ color: cn.text }}>Ready to apply for this position?</p>
            <p className="text-xs mt-0.5" style={{ color: cn.textSecondary }}>
              {job.applicants} caregiver{job.applicants !== 1 ? "s have" : " has"} already applied
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={() => navigate("/caregiver/jobs")} className="px-5 py-2.5 rounded-xl text-sm border hover:opacity-80 transition-opacity" style={{ borderColor: cn.border, color: cn.text }}>
              Back to Listings
            </button>
            <button onClick={() => setApplied(true)} disabled={applied} className="px-6 py-2.5 rounded-xl text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: applied ? cn.green : "var(--cn-gradient-caregiver)" }}>
              {applied ? "✓ Applied!" : "Apply Now"}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}