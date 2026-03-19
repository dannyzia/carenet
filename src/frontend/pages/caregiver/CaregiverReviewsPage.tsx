import { Star, ThumbsUp } from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { caregiverService } from "@/backend/services";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function CaregiverReviewsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.caregiverReviews", "Caregiver Reviews"));

  const { data: reviews, loading } = useAsyncData(() => caregiverService.getReviews());

  if (loading || !reviews) return <PageSkeleton cards={3} />;

  const ratingBreakdown = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100,
  }));

  const avgRating = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#535353" }}>Reviews & Ratings</h1>
          <p className="text-sm" style={{ color: "#848484" }}>See what your clients say about your care</p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rating Summary */}
          <div className="finance-card p-6 flex flex-col items-center justify-center text-center">
            <p className="text-6xl font-bold mb-2" style={{ color: "#535353" }}>{avgRating.toFixed(1)}</p>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="w-5 h-5 fill-current" style={{ color: s <= Math.round(avgRating) ? "#E8A838" : "#E5E7EB" }} />
              ))}
            </div>
            <p className="text-sm" style={{ color: "#848484" }}>Based on {reviews.length} reviews</p>
          </div>

          {/* Breakdown */}
          <div className="finance-card p-5 lg:col-span-2">
            <h2 className="font-semibold mb-4" style={{ color: "#535353" }}>Rating Breakdown</h2>
            <div className="space-y-3">
              {ratingBreakdown.map(r => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm w-8 shrink-0" style={{ color: "#535353" }}>
                    {r.stars} <Star className="w-3 h-3 fill-current" style={{ color: "#E8A838" }} />
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${r.pct}%`, background: "#E8A838" }} />
                  </div>
                  <span className="text-sm w-6 shrink-0" style={{ color: "#848484" }}>{r.count}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: "Professionalism", score: 4.9 }, { label: "Punctuality", score: 4.7 }, { label: "Communication", score: 4.6 },
              ].map(m => (
                <div key={m.label} className="p-3 rounded-xl text-center" style={{ background: "#F9FAFB" }}>
                  <p className="text-lg font-bold" style={{ color: "#535353" }}>{m.score}</p>
                  <p className="text-xs" style={{ color: "#848484" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="finance-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                  style={{ background: r.avatarColor }}>
                  {r.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div>
                      <span className="font-semibold text-sm" style={{ color: "#535353" }}>{r.reviewer}</span>
                      <span className="text-xs ml-2 badge-pill" style={{ background: "#F3F4F6", color: "#848484" }}>{r.role}</span>
                    </div>
                    <span className="text-xs" style={{ color: "#848484" }}>{r.date}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-current" style={{ color: s <= r.rating ? "#E8A838" : "#E5E7EB" }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#535353" }}>{r.text}</p>
                  <button className="flex items-center gap-1 mt-3 text-xs hover:underline" style={{ color: "#848484" }}>
                    <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "\n        .finance-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }\n        .badge-pill { display: inline-flex; align-items: center; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.7rem; }\n      " }} />
    </>
  );
}