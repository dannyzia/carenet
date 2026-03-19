import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";
import {
  Heart, Calendar, DollarSign, Shield, Building2, ClipboardList,
  Star, MessageSquare, Package, BarChart2, Briefcase, Users,
  Wifi, Globe, Smartphone, Radio, Lock, ArrowRight,
} from "lucide-react";
import { cn, roleConfig } from "@/frontend/theme/tokens";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/frontend/components/ui/tabs";
import { Button } from "@/frontend/components/ui/button";

// ─── Feature data per role ───

const roleFeatures = {
  guardian: {
    role: "guardian" as const,
    label: "For Guardians",
    headline: "Find, book and monitor care for your loved ones",
    features: [
      { icon: ClipboardList, title: "Post Care Requirements", desc: "Describe exactly what care your loved one needs — condition, schedule, budget, and location." },
      { icon: Building2, title: "Browse Verified Agencies", desc: "Review licensed, rated agencies in your area and request bids tailored to your requirement." },
      { icon: Shield, title: "Bid Review & Placement", desc: "Compare agency proposals, negotiate terms, and confirm placements with confidence." },
      { icon: Radio, title: "Real-Time Shift Monitoring", desc: "See caregiver check-ins, care logs, and vitals updates as they happen." },
      { icon: DollarSign, title: "Payments via bKash & Nagad", desc: "Pay securely through bKash, Nagad, Rocket, or card — all integrated into one billing flow." },
      { icon: Heart, title: "Patient Care Dashboard", desc: "Track all patients, placements, and schedules from a single guardian dashboard." },
    ],
  },
  caregiver: {
    role: "caregiver" as const,
    label: "For Caregivers",
    headline: "Find work, log care, and grow your career",
    features: [
      { icon: Briefcase, title: "Job Marketplace", desc: "Browse care jobs posted by agencies across Bangladesh — filter by location, type, and shift." },
      { icon: ClipboardList, title: "Digital Care Logging", desc: "Record vitals, medications, tasks, and notes for every shift — offline-capable." },
      { icon: DollarSign, title: "Earnings & Payouts", desc: "Track daily and monthly earnings. Receive payroll via bKash, Nagad, or bank transfer." },
      { icon: Star, title: "Portfolio & Reviews", desc: "Build a verified work history, showcase certifications, and collect guardian reviews." },
      { icon: Shield, title: "Training Portal", desc: "Access skill assessments, certifications, and professional development resources." },
      { icon: Calendar, title: "Shift Planner", desc: "Manage your schedule, view upcoming shifts, and handle handoff notes in one place." },
    ],
  },
  agency: {
    role: "agency" as const,
    label: "For Agencies",
    headline: "Manage your entire care operation in one platform",
    features: [
      { icon: ClipboardList, title: "Requirements Inbox", desc: "Receive care requirement submissions from guardians and respond with tailored proposals." },
      { icon: Briefcase, title: "Job Management", desc: "Post jobs against requirements, review caregiver applications, and manage placements." },
      { icon: Radio, title: "Shift Monitoring", desc: "Live dashboard showing caregiver check-ins, late alerts, and shift status across all clients." },
      { icon: Users, title: "Caregiver Roster", desc: "Manage your caregiver workforce, track attendance, and handle hiring from one dashboard." },
      { icon: DollarSign, title: "Payroll & Payouts", desc: "Automate caregiver payroll calculations and process payouts via bKash or bank transfer." },
      { icon: BarChart2, title: "Agency Analytics", desc: "Track revenue trends, placement success rates, ratings, and monthly performance data." },
    ],
  },
  patient: {
    role: "patient" as const,
    label: "For Patients",
    headline: "Your health, your records, your peace of mind",
    features: [
      { icon: Heart, title: "Vitals Tracking", desc: "Log blood pressure, pulse, glucose, and temperature. Track trends over time." },
      { icon: ClipboardList, title: "Medication Reminders", desc: "Scheduled reminders for every medication, with caregiver confirmation on administration." },
      { icon: Shield, title: "Emergency Hub", desc: "One-tap access to emergency contacts, nearby hospitals, and critical health information." },
      { icon: BarChart2, title: "Health Reports", desc: "View comprehensive health summaries and export records for medical appointments." },
      { icon: Calendar, title: "Care History", desc: "Full timeline of all care received — caregivers, shifts, logs, and vitals history." },
      { icon: Lock, title: "Data Privacy Controls", desc: "Control exactly who can view your health information and revoke access at any time." },
    ],
  },
  shop: {
    role: "shop" as const,
    label: "For Shop Owners",
    headline: "Sell healthcare products to the people who need them",
    features: [
      { icon: Package, title: "Product Listings", desc: "List medical equipment, mobility aids, personal care products, and health supplements." },
      { icon: BarChart2, title: "Order Management", desc: "Track orders from placement to fulfillment with real-time status updates." },
      { icon: DollarSign, title: "Revenue Analytics", desc: "Monitor sales trends, top products, and monthly revenue from the merchant dashboard." },
      { icon: Users, title: "Customer Orders", desc: "View and manage all customer order history, returns, and fulfillment status." },
      { icon: ClipboardList, title: "Inventory Tracking", desc: "Set stock levels, receive low-inventory alerts, and manage product availability." },
      { icon: Star, title: "Product Reviews", desc: "Collect and display customer reviews to build trust and improve product quality." },
    ],
  },
};

const platformFeatures = [
  { icon: Wifi, title: "Works Offline", desc: "Care logs, check-ins, and vitals save locally when there's no internet — sync when reconnected." },
  { icon: Globe, title: "Bilingual EN / বাংলা", desc: "Full support for English and Bangla throughout the platform, with auto-detection." },
  { icon: Smartphone, title: "Mobile Native", desc: "Installable as a PWA or native Android/iOS app via Capacitor — feels like a native app." },
  { icon: Radio, title: "Real-Time Updates", desc: "Live care feeds, shift alerts, and message notifications powered by Supabase Realtime." },
  { icon: Shield, title: "Agency-Mediated Safety", desc: "All caregivers are placed through licensed, verified agencies — protecting families and caregivers." },
  { icon: Lock, title: "Secure by Design", desc: "Row-level security, MFA support, and encrypted data — built on Supabase PostgreSQL." },
];

export default function FeaturesPage() {
  const { t } = useTranslation("common");
  useDocumentTitle(t("pageTitles.features", "Features"));

  return (
    <div className="min-h-screen" style={{ backgroundColor: cn.bgPage }}>

      {/* ── Hero ── */}
      <div className="px-6 py-16 md:py-24 text-center" style={{ backgroundColor: "#FFF5F7" }}>
        <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[rgba(233,154,175,0.12)] blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[rgba(114,204,120,0.10)] blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6"
            style={{ background: cn.pinkBg, color: cn.pink }}>
            <Star className="w-4 h-4" aria-hidden="true" />
            Everything you need for better care
          </div>
          <h1 className="text-4xl md:text-5xl mb-4" style={{ color: cn.textHeading }}>
            A complete care platform<br className="hidden md:block" /> for Bangladesh
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: cn.textSecondary }}>
            CareNet connects guardians, caregivers, agencies, patients, and shop owners in one
            integrated platform — built for the Bangladesh care economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth/role-selection">
              <Button size="lg" className="px-8 h-12 w-full sm:w-auto"
                style={{ background: "var(--cn-gradient-caregiver)", color: "white", boxShadow: "0px 4px 18px rgba(240,161,180,0.35)" }}>
                Get Started Free <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="px-8 h-12 w-full sm:w-auto"
                style={{ borderColor: cn.border, color: cn.text }}>
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Role Feature Tabs ── */}
      <div className="px-6 py-14 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl mb-3" style={{ color: cn.text }}>Features by role</h2>
          <p className="text-base" style={{ color: cn.textSecondary }}>
            CareNet serves every participant in the care journey — select your role to see what's built for you.
          </p>
        </div>

        <Tabs defaultValue="guardian">
          {/* Tab list — scrollable on mobile */}
          <div className="overflow-x-auto pb-2 -mx-1 px-1 mb-8">
            <TabsList className="flex w-max gap-1 h-auto p-1 rounded-xl"
              style={{ background: cn.bgInput }}>
              {Object.values(roleFeatures).map(({ role, label }) => {
                const rCfg = roleConfig[role];
                return (
                  <TabsTrigger
                    key={role}
                    value={role}
                    className="px-4 py-2 text-sm rounded-lg whitespace-nowrap data-[state=active]:text-white transition-all"
                    style={{
                      "--active-bg": `var(--${rCfg.cssVar})`,
                    } as React.CSSProperties}
                  >
                    {label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {Object.values(roleFeatures).map(({ role, headline, features }) => {
            const rCfg = roleConfig[role];
            return (
              <TabsContent key={role} value={role}>
                <p className="text-base mb-6 text-center" style={{ color: cn.textSecondary }}>{headline}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.title} className="cn-card p-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: rCfg.lightBg }}>
                          <Icon className="w-5 h-5" style={{ color: `var(--${rCfg.cssVar})` }} aria-hidden="true" />
                        </div>
                        <h3 className="text-sm mb-1" style={{ color: cn.text, fontWeight: 500 }}>{f.title}</h3>
                        <p className="text-xs leading-relaxed" style={{ color: cn.textSecondary }}>{f.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      {/* ── Platform-wide features strip ── */}
      <div className="px-6 py-14" style={{ backgroundColor: cn.bgCard }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl mb-3" style={{ color: cn.text }}>Built for Bangladesh</h2>
            <p className="text-base" style={{ color: cn.textSecondary }}>
              Platform-wide capabilities that work for every user, every role, every device.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex gap-4 p-5 rounded-xl"
                  style={{ background: cn.bgPage }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: cn.pinkBg }}>
                    <Icon className="w-5 h-5" style={{ color: cn.pink }} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm mb-1" style={{ color: cn.text, fontWeight: 500 }}>{f.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: cn.textSecondary }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CTA Footer ── */}
      <div className="px-6 py-14 text-center" style={{ backgroundColor: "#FFF5F7" }}>
        <div className="max-w-xl mx-auto">
          <Heart className="w-10 h-10 mx-auto mb-4" style={{ color: cn.pink }} aria-hidden="true" />
          <h2 className="text-3xl mb-3" style={{ color: cn.textHeading }}>Ready to get started?</h2>
          <p className="text-base mb-8" style={{ color: cn.textSecondary }}>
            Join thousands of families, caregivers, and agencies already using CareNet across Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth/role-selection">
              <Button size="lg" className="px-8 h-12 w-full sm:w-auto"
                style={{ background: "var(--cn-gradient-caregiver)", color: "white", boxShadow: "0px 4px 18px rgba(240,161,180,0.35)" }}>
                Register Free <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="px-8 h-12 w-full sm:w-auto"
                style={{ borderColor: cn.border, color: cn.text }}>
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
