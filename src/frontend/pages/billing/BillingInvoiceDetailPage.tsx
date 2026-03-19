import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, FileText, Calendar, User, Building2, CheckCircle2,
  Clock, Upload, AlertTriangle, CreditCard, Download, Eye,
} from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { Button } from "@/frontend/components/ui/button";
import { PageHero } from "@/frontend/components/PageHero";
import { formatBDT } from "@/backend/utils/currency";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { billingService } from "@/backend/services/billing.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import type { PaymentProof } from "@/backend/models";
import { useTranslation } from "react-i18next";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  unpaid: { label: "UNPAID", color: "#EF4444", bg: "#FEF2F2", icon: Clock },
  proof_submitted: { label: "PROOF SUBMITTED", color: "#E8A838", bg: "#FFF8E1", icon: Upload },
  verified: { label: "PAID & VERIFIED", color: "#5FB865", bg: "#E8F9E7", icon: CheckCircle2 },
  disputed: { label: "DISPUTED", color: "#EF4444", bg: "#FEF2F2", icon: AlertTriangle },
  overdue: { label: "OVERDUE", color: "#EF4444", bg: "#FEF2F2", icon: AlertTriangle },
};

const proofStatusColors: Record<string, { color: string; bg: string }> = {
  pending: { color: "#E8A838", bg: "rgba(232,168,56,0.1)" },
  verified: { color: "#5FB865", bg: "rgba(95,184,101,0.1)" },
  rejected: { color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

export default function BillingInvoiceDetailPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.billingInvoiceDetail", "Billing Invoice Detail"));

  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const { data: invoice, loading } = useAsyncData(() => billingService.getInvoiceById(invoiceId ?? ""), [invoiceId]);

  if (loading || !invoice) return <PageSkeleton />;

  const st = statusConfig[invoice.status] || statusConfig.unpaid;
  const StatusIcon = st.icon;

  return (
    <div>
      <PageHero gradient="var(--cn-gradient-guardian)" className="pt-8 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl text-white flex items-center gap-2"><FileText className="w-7 h-7" /> Invoice Details</h1>
        </div>
      </PageHero>

      <div className="max-w-3xl mx-auto px-6 -mt-20 space-y-6 pb-8">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.05)", border: "1px solid rgba(255,255,255,0.4)" }}>
          {/* Status Header */}
          <div className="p-6 flex justify-between items-center border-b" style={{ background: st.bg, borderColor: `${st.color}20` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: st.color, color: "white" }}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: st.color }}>Status</p>
                <p className="text-lg" style={{ color: st.color }}>{st.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest" style={{ color: cn.textSecondary }}>Invoice</p>
              <p className="text-lg" style={{ color: cn.text }}>{invoice.id}</p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.tealBg }}>
                  <Building2 className="w-5 h-5" style={{ color: cn.teal }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: cn.textSecondary }}>From</p>
                  <p className="text-sm" style={{ color: cn.text }}>{invoice.fromParty.name}</p>
                  <p className="text-xs" style={{ color: cn.textSecondary }}>{invoice.fromParty.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.greenBg }}>
                  <User className="w-5 h-5" style={{ color: cn.green }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: cn.textSecondary }}>To (Billed)</p>
                  <p className="text-sm" style={{ color: cn.text }}>{invoice.toParty.name}</p>
                  <p className="text-xs" style={{ color: cn.textSecondary }}>{invoice.toParty.role}</p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Description", value: invoice.description, icon: FileText },
                { label: "Issued", value: invoice.issuedDate, icon: Calendar },
                { label: "Due Date", value: invoice.dueDate, icon: Clock },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: cn.bgInput }}>
                  <d.icon className="w-4 h-4 shrink-0" style={{ color: cn.pink }} />
                  <div>
                    <p className="text-[10px] uppercase" style={{ color: cn.textSecondary }}>{d.label}</p>
                    <p className="text-xs" style={{ color: cn.text }}>{d.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest" style={{ color: cn.textSecondary }}>Line Items</p>
              {invoice.lineItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b" style={{ borderColor: cn.borderLight }}>
                  <div>
                    <p className="text-sm" style={{ color: cn.text }}>{item.desc}</p>
                    <p className="text-[10px] uppercase" style={{ color: cn.textSecondary }}>{item.qty} × {formatBDT(item.rate)}</p>
                  </div>
                  <span className="text-sm" style={{ color: cn.text }}>{formatBDT(item.total)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="rounded-2xl p-6 space-y-3" style={{ background: cn.bgInput }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: cn.textSecondary }}>Subtotal</span>
                <span style={{ color: cn.text }}>{formatBDT(invoice.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: cn.textSecondary }}>Platform Fee</span>
                <span style={{ color: cn.text }}>{formatBDT(invoice.platformFee)}</span>
              </div>
              <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: cn.border }}>
                <span className="text-lg" style={{ color: cn.text }}>Total</span>
                <span className="text-2xl" style={{ color: cn.pink }}>{formatBDT(invoice.total)}</span>
              </div>
            </div>

            {/* Payment Proofs */}
            {invoice.paymentProofs.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest" style={{ color: cn.textSecondary }}>Payment Proofs ({invoice.paymentProofs.length})</p>
                {invoice.paymentProofs.map((proof: PaymentProof) => {
                  const ps = proofStatusColors[proof.status] || proofStatusColors.pending;
                  return (
                    <div key={proof.id} className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all"
                      style={{ borderColor: cn.border }} onClick={() => navigate(`/billing/verify/${proof.id}`)}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: ps.bg }}>
                        <CreditCard className="w-4 h-4" style={{ color: ps.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ color: cn.text }}>Ref: {proof.referenceNumber}</p>
                        <p className="text-xs" style={{ color: cn.textSecondary }}>{proof.submittedAt}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: ps.bg, color: ps.color }}>
                        {proof.status}
                      </span>
                      <Eye className="w-4 h-4" style={{ color: cn.textSecondary }} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {(invoice.status === "unpaid" || invoice.status === "overdue" || invoice.status === "disputed") && (
                <Button className="w-full h-12 rounded-2xl text-white" style={{ background: cn.green, boxShadow: "0 10px 30px rgba(95,184,101,0.25)" }}
                  onClick={() => navigate(`/billing/submit-proof/${invoice.id}`)}>
                  <Upload className="w-5 h-5 mr-2" /> Submit Payment Proof
                </Button>
              )}
              <Button variant="outline" className="w-full h-12 rounded-2xl">
                <Download className="w-5 h-5 mr-2" /> Download Invoice PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
