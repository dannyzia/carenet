import { FileText, Download, CreditCard, CheckCircle2, Clock, Calendar, User, Printer, Share2, Building2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/PageHero";
import { formatBDT } from "@/frontend/utils/currency";
import { useTranslation } from "react-i18next";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { guardianService } from "@/backend/services/guardian.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = { paid: { label: "PAID IN FULL", color: "#5FB865", bg: "#E8F9E7", icon: CheckCircle2 }, partial: { label: "PARTIALLY PAID", color: "#E8A838", bg: "#FFF8E1", icon: Clock }, unpaid: { label: "UNPAID", color: "#EF4444", bg: "#FEF2F2", icon: Clock }, overdue: { label: "OVERDUE", color: "#EF4444", bg: "#FEF2F2", icon: Clock } };

export default function InvoiceDetailPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.invoiceDetail", "Invoice Detail"));

  const navigate = useNavigate();
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { data: invoice, loading } = useAsyncData(() => guardianService.getInvoiceDetail(id ?? "CN-78902"), [id]);

  if (loading || !invoice) return <PageSkeleton />;

  const isBangla = i18n.language === "bn";
  const bdtOpts = { bangla: isBangla };
  const st = statusConfig[invoice.status] || statusConfig.unpaid;
  const StatusIcon = st.icon;

  return (
    <div>
      <PageHero gradient="var(--cn-gradient-caregiver)" className="pt-8 pb-32 px-6"><div className="max-w-3xl mx-auto"><div className="flex justify-between items-center"><div className="flex items-center gap-4"><h1 className="text-2xl text-white">Invoice Details</h1></div><div className="flex gap-2"><Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl"><Printer className="w-5 h-5" /></Button><Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl"><Share2 className="w-5 h-5" /></Button></div></div></div></PageHero>
      <div className="max-w-3xl mx-auto px-6 -mt-16">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.05)", border: "1px solid rgba(255,255,255,0.4)" }}>
          <div className="p-6 flex justify-between items-center border-b" style={{ background: st.bg, borderColor: `${st.color}20` }}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: st.color, color: "white" }}><StatusIcon className="w-6 h-6" /></div><div><p className="text-[10px] uppercase tracking-widest" style={{ color: st.color }}>Status</p><p className="text-lg" style={{ color: st.color }}>{st.label}</p></div></div><div className="text-right"><p className="text-[10px] uppercase tracking-widest" style={{ color: cn.textSecondary }}>Invoice No</p><p className="text-lg" style={{ color: cn.text }}>#{invoice.id}</p></div></div>
          <div className="p-8 md:p-12 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><div className="space-y-2"><p className="text-xs uppercase tracking-widest" style={{ color: cn.textSecondary }}>Billed To</p><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.bgInput }}><User style={{ color: cn.textSecondary }} /></div><div><p style={{ color: cn.text }}>{invoice.billedTo.name}</p><p className="text-xs" style={{ color: cn.textSecondary }}>Guardian ID: {invoice.billedTo.guardianId}</p></div></div></div><div className="space-y-2"><p className="text-xs uppercase tracking-widest" style={{ color: cn.textSecondary }}>Agency Provider</p><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.tealBg }}><Building2 style={{ color: cn.teal }} /></div><div><p style={{ color: cn.text }}>{invoice.agency.name}</p><p className="text-xs" style={{ color: cn.textSecondary }}>Placement: {invoice.agency.placementId}</p></div></div></div></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{[{ label: "Period", value: `${invoice.period.from} \u2014 ${invoice.period.to}`, icon: Calendar }, { label: "Issue Date", value: invoice.issuedDate, icon: FileText }, { label: "Due Date", value: invoice.dueDate, icon: Clock }].map((d) => (<div key={d.label} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: cn.bgInput }}><d.icon className="w-4 h-4 shrink-0" style={{ color: cn.pink }} /><div><p className="text-[10px] uppercase" style={{ color: cn.textSecondary }}>{d.label}</p><p className="text-xs" style={{ color: cn.text }}>{d.value}</p></div></div>))}</div>
            <div className="space-y-4"><p className="text-xs uppercase tracking-widest" style={{ color: cn.textSecondary }}>Service Itemization</p><div className="space-y-3">{invoice.lineItems.map((item, idx) => (<div key={idx} className="flex justify-between items-center py-4 border-b" style={{ borderColor: cn.borderLight }}><div className="max-w-[60%]"><p style={{ color: cn.text }}>{item.desc}</p><p className="text-[10px] mt-1 uppercase" style={{ color: cn.textSecondary }}>{item.qty} \u00d7 {formatBDT(item.rate, bdtOpts)}</p></div><span className="text-lg" style={{ color: cn.text }}>{formatBDT(item.total, bdtOpts)}</span></div>))}</div></div>
            <div className="rounded-2xl p-6 md:p-8 space-y-4" style={{ background: cn.bgInput }}><div className="flex justify-between text-sm"><span style={{ color: cn.textSecondary }}>Subtotal</span><span style={{ color: cn.text }}>{formatBDT(invoice.subtotal, bdtOpts)}</span></div><div className="flex justify-between text-sm"><span style={{ color: cn.textSecondary }}>Platform Fee ({invoice.platformFeeRate}%)</span><span style={{ color: cn.text }}>{formatBDT(invoice.platformFee, bdtOpts)}</span></div><div className="flex justify-between text-sm"><span style={{ color: cn.textSecondary }}>VAT ({invoice.vatRate}% on platform fee)</span><span style={{ color: cn.text }}>{formatBDT(invoice.vat, bdtOpts)}</span></div>{invoice.earlyDiscount > 0 && (<div className="flex justify-between text-sm" style={{ color: cn.green }}><span>Early Booking Discount</span><span>-{formatBDT(invoice.earlyDiscount, bdtOpts)}</span></div>)}<div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: cn.border }}><span className="text-xl" style={{ color: cn.text }}>Total Amount</span><div className="text-right"><span className="text-3xl" style={{ color: cn.pink }}>{formatBDT(invoice.total, bdtOpts)}</span><p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: cn.textSecondary }}>VAT Included</p></div></div></div>
            {invoice.status === "paid" && (<div className="grid grid-cols-2 gap-4"><div className="p-5 rounded-2xl bg-white border flex items-center gap-3" style={{ borderColor: cn.borderLight }}><CreditCard className="w-5 h-5" style={{ color: cn.pink }} /><div><p className="text-[10px] uppercase" style={{ color: cn.textSecondary }}>Paid Via</p><p className="text-sm" style={{ color: cn.text }}>{invoice.paidVia}</p></div></div><div className="p-5 rounded-2xl bg-white border flex items-center gap-3" style={{ borderColor: cn.borderLight }}><Calendar className="w-5 h-5" style={{ color: cn.pink }} /><div><p className="text-[10px] uppercase" style={{ color: cn.textSecondary }}>Payment Date</p><p className="text-sm" style={{ color: cn.text }}>{invoice.paidDate}</p></div></div></div>)}
            <div className="space-y-3">{invoice.status !== "paid" && (<button onClick={() => navigate(`/billing/submit-proof/${invoice.id}`)} className="w-full h-14 rounded-2xl text-white text-lg flex items-center justify-center gap-2 cn-touch-target" style={{ background: cn.green, boxShadow: "0 10px 30px rgba(95,184,101,0.25)" }}><CreditCard className="w-5 h-5" /> Pay {formatBDT(invoice.total, bdtOpts)}</button>)}<Button className="w-full h-14 rounded-2xl text-lg" variant="outline"><Download className="w-5 h-5 mr-2" /> Download PDF Receipt</Button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
