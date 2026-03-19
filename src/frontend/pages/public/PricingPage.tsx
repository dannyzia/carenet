import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";
import {
  Check, Heart, Building2, ShoppingBag, ArrowRight,
  CreditCard, HelpCircle, Smartphone, Shield,
} from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/frontend/components/ui/accordion";
import { Button } from "@/frontend/components/ui/button";

// ─── Pricing tiers ───────────────────────────────────────────────────────────
const tiers = [
  {
    id: "guardian",
    icon: Heart,
    label: "Guardian",
    accent: cn.green,
    accentBg: cn.greenBg,
    gradient: "var(--cn-gradient-guardian)",
    tagline: "Find and manage care for your family",
    price: { monthly: "Free", annual: "Free" },
    priceNote: "Placement service fee applies",
    highlights: [
      "Post unlimited care requirements",
      "Browse verified agencies & caregivers",
      "Review agency bids and proposals",
      "Placement monitoring & shift tracking",
      "bKash / Nagad / Rocket / Card payments",
      "Patient care dashboard",
    ],
    cta: "Get Started Free",
    ctaPath: "/auth/register/guardian",
    featured: false,
  },
  {
    id: "agency",
    icon: Building2,
    label: "Agency",
    accent: cn.teal,
    accentBg: cn.tealBg,
    gradient: "var(--cn-gradient-agency)",
    tagline: "Manage your entire care operation",
    price: { monthly: "Commission-based", annual: "Subscription available" },
    priceNote: "Per-placement commission + optional monthly plan",
    highlights: [
      "Requirements inbox & bid management",
      "Job posting & application review",
      "Caregiver roster & payroll",
      "Shift monitoring dashboard",
      "Agency storefront & packages",
      "Revenue analytics & reports",
    ],
    cta: "Apply as an Agency",
    ctaPath: "/auth/register/agency",
    featured: true,
  },
  {
    id: "shop",
    icon: ShoppingBag,
    label: "Shop Merchant",
    accent: cn.orange,
    accentBg: cn.orangeBg,
    gradient: "var(--cn-gradient-shop)",
    tagline: "Sell healthcare products to care families",
    price: { monthly: "Revenue share", annual: "Revenue share" },
    priceNote: "Small % per order, no upfront listing fee",
    highlights: [
      "Unlimited product listings",
      "Order & fulfillment management",
      "Inventory tracking & alerts",
      "Customer order history",
      "Merchant analytics dashboard",
      "Product reviews & ratings",
    ],
    cta: "Open Your Shop",
    ctaPath: "/auth/register/shop",
    featured: false,
  },
];

// ─── Payment methods ──────────────────────────────────────────────────────────
const paymentMethods = [
  { name: "bKash", color: "#D12053", bg: "#D1205315" },
  { name: "Nagad", color: "#ED6E1B", bg: "#ED6E1B15" },
  { name: "Rocket", color: "#8B27B5", bg: "#8B27B515" },
  { name: "Card", color: cn.blue, bg: cn.blueBg },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "How does the platform fee work?",
    a: "CareNet uses a commission model. Guardians pay a service fee as a percentage of each placement — this is included in the agency's invoice. Agencies pay a platform commission per successful placement. Caregivers pay no platform fee.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "CareNet supports bKash, Nagad, Rocket, and debit/credit card for guardian payments. Caregiver payroll is processed via bKash, Nagad, or bank transfer through the agency.",
  },
  {
    q: "Is there a contract or lock-in?",
    a: "No lock-in contracts. Guardians can post requirements and end placements at any time. Agencies can list on the platform without a long-term commitment. Optional monthly subscriptions for agencies are billed monthly and can be cancelled anytime.",
  },
  {
    q: "What currency is used?",
    a: "All transactions are in Bangladeshi Taka (৳ BDT). The platform also uses CarePoints (CP) as an internal unit — 10 CP = ৳ 1 — for transparent fee tracking.",
  },
  {
    q: "Is CareNet free for caregivers?",
    a: "Yes. Caregivers join and apply to jobs at no cost. There are no platform fees deducted from caregiver earnings — agencies handle caregiver payroll directly.",
  },
  {
    q: "How are agencies verified?",
    a: "Agencies must submit their DGHS license and business registration during onboarding. An admin reviews and approves each agency before they can post jobs or receive requirements.",
  },
];

export default function PricingPage() {
  const { t } = useTranslation("common");
  useDocumentTitle(t("pageTitles.pricing", "Pricing"));
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen" style={{ backgroundColor: cn.bgPage }}>

      {/* ── Hero ── */}
      <div className="px-6 py-16 md:py-20 text-center" style={{ backgroundColor: "#FFF5F7" }}>
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6"
            style={{ background: cn.pinkBg, color: cn.pink }}>
            <CreditCard className="w-4 h-4" aria-hidden="true" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl mb-4" style={{ color: cn.textHeading }}>
            Pricing for Bangladesh's care economy
          </h1>
          <p className="text-lg mb-8" style={{ color: cn.textSecondary }}>
            No hidden fees. No lock-in. Pay only when care is delivered.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl"
            style={{ background: cn.bgInput }}>
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="px-5 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: billing === b ? cn.bgCard : "transparent",
                  color: billing === b ? cn.text : cn.textSecondary,
                  boxShadow: billing === b ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {b === "monthly" ? "Monthly" : "Annual"}
                {b === "annual" && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]"
                    style={{ background: cn.greenBg, color: cn.green }}>
                    Save
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pricing cards ── */}
      <div className="px-6 py-14 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className="rounded-2xl p-6 flex flex-col"
                style={{
                  background: cn.bgCard,
                  boxShadow: tier.featured
                    ? "0 8px 32px rgba(0,137,123,0.15)"
                    : "var(--cn-shadow-card)",
                  border: tier.featured ? `2px solid ${tier.accent}` : `1px solid ${cn.border}`,
                }}
              >
                {tier.featured && (
                  <div className="text-center mb-4">
                    <span className="px-3 py-1 rounded-full text-xs text-white"
                      style={{ background: tier.gradient }}>
                      Most popular
                    </span>
                  </div>
                )}

                {/* Icon + label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: tier.accentBg }}>
                    <Icon className="w-5 h-5" style={{ color: tier.accent }} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-base" style={{ color: cn.text, fontWeight: 500 }}>{tier.label}</p>
                    <p className="text-xs" style={{ color: cn.textSecondary }}>{tier.tagline}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5 pb-5" style={{ borderBottom: `1px solid ${cn.border}` }}>
                  <p className="text-2xl mb-0.5" style={{ color: cn.text, fontWeight: 600 }}>
                    {tier.price[billing]}
                  </p>
                  <p className="text-xs" style={{ color: cn.textSecondary }}>{tier.priceNote}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm"
                      style={{ color: cn.text }}>
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: tier.accent }} aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to={tier.ctaPath}>
                  <Button
                    className="w-full h-11"
                    style={tier.featured
                      ? { background: tier.gradient, color: "white", border: "none" }
                      : { background: tier.accentBg, color: tier.accent, border: "none" }
                    }
                  >
                    {tier.cta} <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Caregiver note */}
        <div className="mt-6 p-5 rounded-xl flex items-start gap-4"
          style={{ background: cn.pinkBg, border: `1px solid ${cn.pink}30` }}>
          <Heart className="w-5 h-5 shrink-0 mt-0.5" style={{ color: cn.pink }} aria-hidden="true" />
          <div>
            <p className="text-sm" style={{ color: cn.text, fontWeight: 500 }}>
              Caregivers — always free to join
            </p>
            <p className="text-sm mt-0.5" style={{ color: cn.textSecondary }}>
              Browse jobs, apply, log care, and receive payroll at zero cost to you.
              CareNet never deducts fees from caregiver earnings.{" "}
              <Link to="/auth/register/caregiver" className="hover:underline" style={{ color: cn.pink }}>
                Register as a caregiver →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Payment methods strip ── */}
      <div className="px-6 py-10" style={{ backgroundColor: cn.bgCard }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm mb-5" style={{ color: cn.textSecondary }}>
            <Smartphone className="w-4 h-4 inline mr-1.5 -mt-0.5" aria-hidden="true" />
            Accepted payment methods in Bangladesh
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {paymentMethods.map((pm) => (
              <div key={pm.name}
                className="px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: pm.bg, color: pm.color }}>
                {pm.name}
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: cn.textSecondary }}>
            All transactions processed in Bangladeshi Taka (৳ BDT)
          </p>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="px-6 py-14 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <HelpCircle className="w-8 h-8 mx-auto mb-3" style={{ color: cn.pink }} aria-hidden="true" />
          <h2 className="text-3xl mb-2" style={{ color: cn.text }}>Frequently asked questions</h2>
          <p className="text-base" style={{ color: cn.textSecondary }}>
            Everything you need to know about CareNet pricing.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden"
          style={{ background: cn.bgCard, border: `1px solid ${cn.border}` }}>
          <Accordion type="single" collapsible className="px-6">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger style={{ color: cn.text }}>{faq.q}</AccordionTrigger>
                <AccordionContent style={{ color: cn.textSecondary }}>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* ── CTA Footer ── */}
      <div className="px-6 py-14 text-center" style={{ backgroundColor: "#FFF5F7" }}>
        <div className="max-w-xl mx-auto">
          <Shield className="w-10 h-10 mx-auto mb-4" style={{ color: cn.green }} aria-hidden="true" />
          <h2 className="text-3xl mb-3" style={{ color: cn.textHeading }}>Start for free today</h2>
          <p className="text-base mb-8" style={{ color: cn.textSecondary }}>
            Guardians and caregivers join at no cost. Agencies and shops start with a simple
            commission model — no upfront fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth/role-selection">
              <Button size="lg" className="px-8 h-12 w-full sm:w-auto"
                style={{ background: "var(--cn-gradient-caregiver)", color: "white", boxShadow: "0px 4px 18px rgba(240,161,180,0.35)" }}>
                Get Started Free <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="px-8 h-12 w-full sm:w-auto"
                style={{ borderColor: cn.border, color: cn.text }}>
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
