import { cn } from "@/frontend/theme/tokens";
import React, { useState } from "react";
import { Link } from "react-router";
import { Heart, Shield, Users, ArrowRight, ChevronRight, Award, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

export default function AboutPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.about", "About"));

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const toggleSection = (section: string) => { setExpandedSection(expandedSection === section ? null : section); };
  const ecosystemCards = [
    { emoji: "\uD83E\uDDD1\u200D\uD83E\uDDBD", title: "Patients & Families", description: "Find, book, track, and manage care in one place." },
    { emoji: "\uD83D\uDC69\u200D\u2695\uFE0F", title: "Caregivers", description: "Get verified, receive work opportunities, and grow professionally." },
    { emoji: "\uD83C\uDFE2", title: "Agencies", description: "Manage caregivers, services, and demand from one dashboard." },
    { emoji: "\uD83C\uDFEA", title: "Shops & Service Providers", description: "Reach active care needs with trusted visibility." },
  ];
  const userTypes = [
    { id: "patients", title: "For Patients & Families", description: "Care without complexity. Trusted professionals, clear communication, and full visibility." },
    { id: "caregivers", title: "For Caregivers", description: "Fair opportunities, professional recognition, and simple work management." },
    { id: "agencies", title: "For Agencies", description: "Technology to scale operations, manage quality, and access demand." },
    { id: "shops", title: "For Shops & Providers", description: "Direct access to care-related demand at the right moment." },
  ];
  const coreValues = [
    { emoji: "\u2764\uFE0F", title: "People First" },
    { emoji: "\uD83D\uDEE1\uFE0F", title: "Trust by Design" },
    { emoji: "\u2B50", title: "Quality Without Compromise" },
    { emoji: "\uD83E\uDD1D", title: "Ecosystem Thinking" },
    { emoji: "\uD83D\uDE80", title: "Care at Scale" },
  ];

  const roleGuides = [
    { id: "guardian", emoji: "\uD83D\uDEE1\uFE0F", title: "Guardian", sections: [
      { heading: "Getting Started", steps: ["Open the CareNet app and tap \"Sign Up.\" Choose the Guardian role.", "Fill in your full name, phone number, email, and create a secure password.", "Complete your guardian profile: add your photo, location, and a short bio."] },
      { heading: "Adding Care Recipients", steps: ["From your Home dashboard, go to \"My Patients.\" Tap \"Add New\" to register the person you're caring for.", "Enter their full name, age, gender, medical conditions, mobility level, and dietary needs.", "Upload relevant medical documents so caregivers have complete context."] },
      { heading: "Finding & Booking Caregivers", steps: ["Go to the Marketplace. Use filters to search by care type, location, availability, language, and budget.", "View caregiver profiles: check their verification badge, experience, certifications, ratings, and rates.", "Tap \"Book Now\" on a caregiver's profile. Select the service type, choose dates and times.", "Review the booking summary including total cost and cancellation policy. Confirm and proceed to payment."] },
      { heading: "Managing Active Care", steps: ["Your Home dashboard shows today's schedule, active bookings, and upcoming appointments.", "Use the built-in Messaging system to communicate with your caregiver in real time.", "Track task completion: caregivers log completed tasks which appear in your activity feed.", "In case of emergency, use the emergency contact feature to quickly reach your caregiver or local emergency services."] },
    ]},
    { id: "patient", emoji: "\uD83E\uDDD1\u200D\uD83E\uDDBD", title: "Patient", sections: [
      { heading: "Getting Started", steps: ["Open the CareNet app and tap \"Sign Up.\" Select the Patient role.", "Complete your profile with your name, age, photo, and contact information.", "Fill in your health profile: list your medical conditions, medications, allergies, and mobility status."] },
      { heading: "Daily Care Interaction", steps: ["Receive notifications when your caregiver checks in, completes tasks, or sends you a message.", "Use the messaging feature to request help, ask questions, or share how you're feeling.", "Log your own health data if you want: mood, pain level, sleep quality, meals eaten."] },
    ]},
    { id: "caregiver", emoji: "\uD83D\uDC69\u200D\u2695\uFE0F", title: "Caregiver", sections: [
      { heading: "Getting Started", steps: ["Open the CareNet app and tap \"Sign Up.\" Select the Caregiver role.", "Enter your full name, phone number, email, NID number, and create a password.", "Upload a clear, professional profile photo."] },
      { heading: "Building Your Profile", steps: ["Fill in every section completely \u2014 caregivers with complete profiles get up to 5x more booking requests.", "Add your skills: elderly care, disability support, post-operative care, child care, etc.", "Upload your certifications and training documents. Set your rates and availability calendar."] },
      { heading: "Receiving & Managing Bookings", steps: ["When a family sends you a booking request, you'll receive a push notification.", "Review the booking details: patient information, care requirements, schedule, and payment terms.", "Accept or decline the request. Log your activities as you complete them."] },
    ]},
    { id: "agency", emoji: "\uD83C\uDFE2", title: "Agency Owner", sections: [
      { heading: "Getting Started", steps: ["Open the CareNet app and tap \"Sign Up.\" Select the Agency Owner role.", "Register your agency: enter the agency name, trade license number, office address, and services.", "Upload your agency's logo and trade license document."] },
      { heading: "Managing Your Caregiver Team", steps: ["Go to \"Staff\" to add caregivers. Invite existing CareNet caregivers or onboard new ones.", "Use the Staff Hiring feature to post job openings.", "Assign caregivers to incoming bookings based on their skills and availability."] },
    ]},
    { id: "shop", emoji: "\uD83C\uDFEA", title: "Shop Owner", sections: [
      { heading: "Getting Started", steps: ["Open the CareNet app and tap \"Sign Up.\" Select the Shop role.", "Register your shop: enter the shop name, trade license number, and physical address.", "Upload your shop logo and cover photo."] },
      { heading: "Setting Up Your Product Catalog", steps: ["From your Shop Dashboard, go to \"Products\" \u2192 \"Add New Product.\"", "For each product, add: name, description, category, price, and stock quantity.", "Upload clear product photos from multiple angles."] },
      { heading: "Managing Orders", steps: ["When a customer places an order, you'll receive a push notification.", "Review the order: items, quantities, delivery address, and payment status.", "Mark the order as \"Processing\" when you start preparing it. Update to \"Shipped\" when dispatched."] },
    ]},
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: cn.bgPage }}>
      <section className="relative overflow-hidden" style={{ backgroundColor: cn.pinkBg }}><div className="relative z-10 px-6 py-16 md:py-24"><div className="max-w-4xl mx-auto text-center"><div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ background: "var(--cn-gradient-caregiver)", boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)" }}><Heart className="w-12 h-12 text-white" /></div><h1 className="mb-4 text-5xl" style={{ color: cn.text }}>CareNet</h1><p className="mb-8 text-xl" style={{ color: cn.textSecondary }}>Quality care, connected.</p><p className="mb-8 max-w-2xl mx-auto" style={{ color: cn.text }}>A unified care platform connecting caregivers, agencies, service providers, shops, and patients.</p></div></div></section>
      <section className="px-6 py-12 md:py-16" style={{ backgroundColor: cn.bgPage }}><div className="max-w-4xl mx-auto text-center"><h2 className="mb-6 text-2xl md:text-3xl" style={{ color: cn.text }}>One Platform for Every Care Need</h2><p className="text-base md:text-lg leading-relaxed mb-4" style={{ color: cn.textSecondary }}>CareNet brings together everyone involved in care into one trusted ecosystem.</p></div></section>
      <section className="px-6 py-12" style={{ backgroundColor: cn.bgPage }}><div className="max-w-4xl mx-auto"><h2 className="mb-6 text-2xl md:text-3xl text-center" style={{ color: cn.text }}>Why CareNet Exists</h2><div className="finance-card p-6 md:p-8"><p className="text-base md:text-lg leading-relaxed mb-4" style={{ color: cn.textSecondary }}>CareNet was created to solve a simple problem: care should not be fragmented or hard to trust.</p><p className="text-base md:text-lg leading-relaxed" style={{ color: cn.textSecondary }}>By unifying people, services, and essentials into one platform, we built a system where care works better\u2014for everyone.</p></div></div></section>
      <section className="px-6 py-12" style={{ backgroundColor: cn.bgCard }}><div className="max-w-4xl mx-auto"><h2 className="mb-2 text-2xl md:text-3xl text-center" style={{ color: cn.text }}>How to Use CareNet</h2><p className="mb-8 text-center text-sm" style={{ color: cn.textSecondary }}>Tap your role below for a complete step-by-step guide.</p><div className="space-y-3">{roleGuides.map((role) => (<div key={role.id} className="finance-card overflow-hidden"><button onClick={() => toggleSection(role.id)} className="w-full flex items-center justify-between p-5 text-left" style={{ color: cn.text }}><div className="flex items-center gap-3"><span className="text-2xl">{role.emoji}</span><span className="text-base" style={{ color: cn.text }}>{role.title}</span></div><ChevronRight className="w-5 h-5 transition-transform duration-200" style={{ color: cn.textSecondary, transform: expandedSection === role.id ? "rotate(90deg)" : "rotate(0deg)" }} /></button>{expandedSection === role.id && (<div className="px-5 pb-5 space-y-6">{role.sections.map((section, sIdx) => (<div key={sIdx}><h4 className="text-sm mb-3 flex items-center gap-2" style={{ color: cn.pinkLight }}><span className="w-5 h-5 rounded flex items-center justify-center text-xs text-white flex-shrink-0" style={{ background: "var(--cn-gradient-caregiver)" }}>{String.fromCharCode(65 + sIdx)}</span>{section.heading}</h4><ol className="space-y-2.5 ml-1">{section.steps.map((step, i) => (<li key={i} className="flex items-start gap-3"><span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white mt-0.5" style={{ background: "var(--cn-gradient-caregiver)", opacity: 0.8 }}>{i + 1}</span><span className="text-sm leading-relaxed" style={{ color: cn.textSecondary }}>{step}</span></li>))}</ol></div>))}</div>)}</div>))}</div></div></section>
    </div>
  );
}
