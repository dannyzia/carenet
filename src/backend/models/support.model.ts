/**
 * Support Domain Models
 * Types for help center, contact, tickets, refunds
 */

export interface HelpCenterCategory {
  id: string; label: string; articles: number; icon: string;
}

export interface HelpCenterArticle {
  id: string; title: string; views: number; category: string;
}

export interface HelpCenterData {
  categories: HelpCenterCategory[];
  popularArticles: HelpCenterArticle[];
}

export interface ContactInfo {
  phone: string; email: string; hours: string; address: string;
  social: { facebook: string; instagram: string };
}

export interface RefundTransaction {
  id: string; type: "service" | "product"; desc: string;
  amount: number; date: string; paymentMethod: string;
  paymentAccount: string; methodColor: string;
}

export interface RefundTimelineStep {
  step: string; time: string;
  status: "done" | "active" | "pending";
  desc: string;
}
