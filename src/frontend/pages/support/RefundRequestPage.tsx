import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/PageHero";
import { formatBDT } from "@/frontend/utils/currency";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Package, RefreshCcw, HelpCircle, CheckCircle2, Clock, AlertTriangle, CreditCard } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { supportService } from "@/backend/services/support.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";

export default function RefundRequestPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.refundRequest", "Refund Request"));

  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isBangla = i18n.language === "bn";
  const bdtOpts = { bangla: isBangla };

  const { data: eligibleTransactions, loading: lTxn } = useAsyncData(() => supportService.getRefundEligibleTransactions());
  const { data: refundTimeline, loading: lTl } = useAsyncData(() => supportService.getRefundTimeline());

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<"service" | "product" | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<Awaited<ReturnType<typeof supportService.getRefundEligibleTransactions>>[0] | null>(null);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  if (lTxn || lTl || !eligibleTransactions || !refundTimeline) return <PageSkeleton />;

  const filteredTxns = selectedType
    ? eligibleTransactions.filter((t) => t.type === selectedType)
    : eligibleTransactions;

  return (
    <div>
      {/* Header */}
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFAB91 0%, #E64A19 100%)" className="pt-8 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setStep(1)} className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all cn-touch-target">
              <ArrowLeft />
            </button>
            <h1 className="text-2xl text-white">Refund & Dispute Center</h1>
          </div>
          <p className="text-white/80 max-w-md">Our goal is to ensure you only pay for quality care and authentic products.</p>
        </div>
      </PageHero>

      <div className="max-w-3xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.05)", border: "1px solid rgba(255,255,255,0.4)" }}>

          {/* ── Step 1: Select Type ── */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl mb-2" style={{ color: cn.text }}>What would you like to dispute?</h2>
                <p className="text-sm" style={{ color: cn.textSecondary }}>Select the transaction type to begin the refund process.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => { setSelectedType("product"); setStep(2); }}
                  className="p-8 rounded-3xl border-2 text-left group transition-all cn-touch-target"
                  style={{ borderColor: cn.border }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: cn.bgInput }}>
                    <Package className="w-7 h-7" style={{ color: cn.textSecondary }} />
                  </div>
                  <h3 className="text-lg" style={{ color: cn.text }}>Shop Order</h3>
                  <p className="text-xs mt-2" style={{ color: cn.textSecondary }}>Refund for medical equipment or supplies.</p>
                </button>
                <button onClick={() => { setSelectedType("service"); setStep(2); }}
                  className="p-8 rounded-3xl border-2 text-left group transition-all cn-touch-target"
                  style={{ borderColor: cn.border }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: cn.bgInput }}>
                    <RefreshCcw className="w-7 h-7" style={{ color: cn.textSecondary }} />
                  </div>
                  <h3 className="text-lg" style={{ color: cn.text }}>Care Service</h3>
                  <p className="text-xs mt-2" style={{ color: cn.textSecondary }}>Refund for a shift or booking deposit.</p>
                </button>
              </div>

              <div className="p-5 rounded-2xl flex items-start gap-4" style={{ background: cn.blueBg }}>
                <HelpCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: cn.blue }} />
                <div>
                  <p className="text-xs" style={{ color: cn.blue }}>Standard Policy</p>
                  <p className="text-[11px] mt-1" style={{ color: cn.textSecondary }}>
                    Refunds for services must be requested within 24 hours of shift completion.
                    Product returns are accepted within 7 days. Refunds are processed to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Select Transaction & Details ── */}
          {step === 2 && (
            <div className="space-y-6">
              <button onClick={() => setStep(1)} className="text-xs uppercase tracking-widest flex items-center gap-2 cn-touch-target" style={{ color: cn.textSecondary }}>
                <ArrowLeft className="w-3 h-3" /> Go Back
              </button>

              <div>
                <h2 className="text-2xl mb-2" style={{ color: cn.text }}>Select Transaction</h2>
                <p className="text-sm" style={{ color: cn.textSecondary }}>Choose the transaction you'd like to request a refund for.</p>
              </div>

              {/* Eligible Transactions */}
              <div className="space-y-3">
                {filteredTxns.map((txn) => (
                  <button
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="w-full p-4 rounded-xl border-2 text-left transition-all cn-touch-target"
                    style={{ borderColor: selectedTxn?.id === txn.id ? "#E64A19" : cn.border, background: selectedTxn?.id === txn.id ? "rgba(230,74,25,0.04)" : undefined }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm" style={{ color: cn.text }}>{txn.desc}</p>
                      <p className="text-sm" style={{ color: cn.text }}>{formatBDT(txn.amount, bdtOpts)}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs" style={{ color: cn.textSecondary }}>{txn.date}</span>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                        style={{ background: `${txn.methodColor}10`, color: txn.methodColor }}>
                        <CreditCard className="w-3 h-3" />
                        {txn.paymentMethod} · {txn.paymentAccount}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedTxn && (
                <>
                  {/* Original Payment Method Info */}
                  <div className="p-4 rounded-xl border" style={{ borderColor: cn.border }}>
                    <p className="text-xs mb-2" style={{ color: cn.textSecondary }}>Refund will be credited to:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm"
                        style={{ background: selectedTxn.methodColor }}>
                        {selectedTxn.paymentMethod.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: cn.text }}>{selectedTxn.paymentMethod}</p>
                        <p className="text-xs" style={{ color: cn.textSecondary }}>{selectedTxn.paymentAccount}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-sm" style={{ color: cn.green }}>
                          {formatBDT(selectedTxn.amount, bdtOpts)}
                        </p>
                        <p className="text-[10px]" style={{ color: cn.textSecondary }}>Refund amount</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-widest block mb-1.5" style={{ color: cn.textSecondary }}>Reason</label>
                      <select value={reason} onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border text-sm"
                        style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }}>
                        <option value="">Select reason</option>
                        <option value="not-described">Item not as described</option>
                        <option value="damaged">Damaged product received</option>
                        <option value="no-show">Caregiver did not show up</option>
                        <option value="poor-quality">Poor quality of service</option>
                        <option value="wrong-charge">Charged incorrect amount</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest block mb-1.5" style={{ color: cn.textSecondary }}>Details</label>
                      <textarea
                        value={details} onChange={(e) => setDetails(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border text-sm resize-none min-h-[120px]"
                        style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }}
                        placeholder="Please provide specific details about your refund request..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    disabled={!reason}
                    className="w-full py-4 rounded-2xl text-white text-lg flex items-center justify-center gap-2 cn-touch-target disabled:opacity-50"
                    style={{ background: "#E64A19", boxShadow: "0 10px 30px rgba(230,74,25,0.25)" }}
                  >
                    Submit Refund Request
                  </button>
                  <p className="text-center text-xs" style={{ color: cn.textSecondary }}>Response within 24-48 hours</p>
                </>
              )}
            </div>
          )}

          {/* ── Step 3: Success + Refund Timeline ── */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: cn.greenBg }}>
                  <CheckCircle2 className="w-10 h-10" style={{ color: cn.green }} />
                </div>
                <h2 className="text-2xl mb-2" style={{ color: cn.text }}>Request Received</h2>
                <p className="text-sm" style={{ color: cn.textSecondary }}>
                  Case <strong style={{ color: cn.text }}>#REF-{Date.now().toString(36).toUpperCase().slice(-6)}</strong> has been opened.
                </p>
              </div>

              {/* Original payment display */}
              {selectedTxn && (
                <div className="p-4 rounded-xl" style={{ background: cn.bgInput }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ color: cn.text }}>{selectedTxn.desc}</p>
                      <p className="text-xs mt-1" style={{ color: cn.textSecondary }}>
                        Paid via {selectedTxn.paymentMethod} · {selectedTxn.paymentAccount}
                      </p>
                    </div>
                    <p className="text-lg" style={{ color: cn.pink }}>{formatBDT(selectedTxn.amount, bdtOpts)}</p>
                  </div>
                </div>
              )}

              {/* Refund Timeline */}
              <div>
                <h3 className="text-sm mb-4" style={{ color: cn.text }}>Refund Timeline</h3>
                <div className="space-y-0 relative">
                  {refundTimeline.map((item, idx) => {
                    const isDone = item.status === "done";
                    const isActive = item.status === "active";
                    const color = isDone ? cn.green : isActive ? cn.amber : cn.textSecondary;
                    const bg = isDone ? cn.greenBg : isActive ? cn.amberBg : cn.bgInput;

                    return (
                      <div key={item.step} className="flex gap-4 relative">
                        {/* Vertical line */}
                        {idx < refundTimeline.length - 1 && (
                          <div className="absolute left-4 top-8 w-0.5 h-full -ml-px" style={{ background: isDone ? cn.green : cn.border }} />
                        )}

                        {/* Dot */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10" style={{ background: bg }}>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4" style={{ color: cn.green }} />
                          ) : isActive ? (
                            <Clock className="w-4 h-4" style={{ color: cn.amber }} />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: cn.border }} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="pb-6 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm" style={{ color }}>{item.step}</p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: bg, color }}>
                              {item.time}
                            </span>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: cn.textSecondary }}>{item.desc}</p>
                          {isActive && (
                            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: cn.amber }}>
                              <AlertTriangle className="w-3 h-3" /> In progress — we'll notify you
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate("/notifications")}
                  className="w-full py-3.5 rounded-2xl text-white cn-touch-target"
                  style={{ background: "#333" }}>
                  View Case Status
                </button>
                <button onClick={() => navigate("/")}
                  className="w-full py-3.5 rounded-2xl text-xs uppercase tracking-widest cn-touch-target"
                  style={{ color: cn.textSecondary }}>
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}