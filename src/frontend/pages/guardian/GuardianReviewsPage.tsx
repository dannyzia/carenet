import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import { Star, Send, CheckCircle } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { guardianService } from "@/backend/services/guardian.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import type { PastCaregiverReview } from "@/backend/models";
import { useTranslation } from "react-i18next";

export default function GuardianReviewsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.guardianReviews", "Guardian Reviews"));

  const { data: reviewsData, loading } = useAsyncData(() => guardianService.getReviewsData());
  const [reviewModal, setReviewModal] = useState<PastCaregiverReview | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => { if (!rating || !text.trim()) return; setSubmitted(true); setTimeout(() => { setReviewModal(null); setSubmitted(false); setRating(0); setText(""); }, 1500); };

  if (loading || !reviewsData) return <PageSkeleton cards={3} />;

  const { pastCaregivers, receivedReviews } = reviewsData;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold" style={{ color: "#535353" }}>Reviews</h1><p className="text-sm" style={{ color: "#848484" }}>Rate your caregivers and see feedback received</p></div>

      <div className="finance-card p-5"><h2 className="font-semibold mb-4" style={{ color: "#535353" }}>Pending Reviews</h2><div className="space-y-3">{pastCaregivers.filter(c => !c.reviewed).map(c => (<div key={c.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "#FFF9F5", border: "1px solid #FEB4C540" }}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: c.color }}>{c.avatar}</div><div><p className="font-medium text-sm" style={{ color: "#535353" }}>{c.name}</p><p className="text-xs" style={{ color: "#848484" }}>{c.type} \u2022 {c.period}</p></div></div><button onClick={() => setReviewModal(c)} className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)" }}>Write Review</button></div>))}{pastCaregivers.filter(c => !c.reviewed).length === 0 && (<p className="text-sm text-center py-4" style={{ color: "#848484" }}>No pending reviews</p>)}</div></div>

      <div className="finance-card p-5"><h2 className="font-semibold mb-4" style={{ color: "#535353" }}>My Reviews</h2><div className="space-y-4">{pastCaregivers.filter(c => c.reviewed && c.myReview).map(c => (<div key={c.id} className="p-4 rounded-xl" style={{ background: "#F9FAFB" }}><div className="flex items-center gap-3 mb-2"><div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: c.color }}>{c.avatar}</div><div><p className="font-medium text-sm" style={{ color: "#535353" }}>{c.name}</p><p className="text-xs" style={{ color: "#848484" }}>{c.type}</p></div></div><div className="flex gap-1 mb-2">{[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" style={{ color: s <= (c.myReview?.rating || 0) ? "#E8A838" : "#E5E7EB" }} />)}</div><p className="text-sm" style={{ color: "#535353" }}>{c.myReview?.text}</p></div>))}</div></div>

      <div className="finance-card p-5"><h2 className="font-semibold mb-4" style={{ color: "#535353" }}>Reviews I Received</h2>{receivedReviews.map(r => (<div key={r.id} className="p-4 rounded-xl" style={{ background: "#F9FAFB" }}><div className="flex items-center gap-3 mb-2"><div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "#DB869A" }}>{r.from.charAt(0)}</div><div><p className="font-medium text-sm" style={{ color: "#535353" }}>{r.from}</p><p className="text-xs" style={{ color: "#848484" }}>{r.role} \u2022 {r.date}</p></div></div><div className="flex gap-1 mb-2">{[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" style={{ color: s <= r.rating ? "#E8A838" : "#E5E7EB" }} />)}</div><p className="text-sm" style={{ color: "#535353" }}>{r.text}</p></div>))}</div>

      {reviewModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="finance-card p-6 w-full max-w-md">
            {submitted ? (<div className="text-center py-4"><CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "#5FB865" }} /><p className="font-semibold" style={{ color: "#535353" }}>Review Submitted!</p></div>) : (<>
              <h2 className="font-semibold mb-2" style={{ color: "#535353" }}>Review {reviewModal.name}</h2>
              <p className="text-sm mb-5" style={{ color: "#848484" }}>{reviewModal.type} \u2022 {reviewModal.period}</p>
              <div className="flex gap-2 mb-5 justify-center">{[1, 2, 3, 4, 5].map(s => (<button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(s)}><Star className="w-8 h-8 transition-all" style={{ color: s <= (hoverRating || rating) ? "#E8A838" : "#E5E7EB", fill: s <= (hoverRating || rating) ? "#E8A838" : "transparent" }} /></button>))}</div>
              <textarea className="input-field mb-4" rows={4} placeholder="Share your experience..." value={text} onChange={e => setText(e.target.value)} style={{ resize: "none" }} />
              <div className="flex gap-3"><button onClick={() => setReviewModal(null)} className="flex-1 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#E5E7EB", color: "#535353" }}>Cancel</button><button onClick={handleSubmit} disabled={!rating || !text.trim()} className="flex-1 py-2.5 rounded-lg text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)" }}><Send className="w-4 h-4" /> Submit</button></div>
            </>)}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: ".finance-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); } .input-field { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #E5E7EB; border-radius: 8px; outline: none; font-size: 0.875rem; color: #535353; }" }} />
    </div>
  );
}