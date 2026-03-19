import type { AppNotification } from "@/backend/models";

/** Platform notification feed — channel IDs match the UI's channelConfig keys */
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", channel: "care-safety", titleEn: "Fall Risk Alert", titleBn: "পতনের ঝুঁকি সতর্কতা", messageEn: "Mr. Abdul Rahman's movement sensor detected unusual activity at 3:15 AM.", messageBn: "জনাব আব্দুল রহমানের মুভমেন্ট সেন্সর", time: "15 min ago", read: false },
  { id: "n3", channel: "shift-reminders", titleEn: "Shift Starting Soon", titleBn: "শিফট শীঘ্রই শুরু হচ্ছে", messageEn: "Your night shift starts in 1 hour.", messageBn: "আপনার রাতের শিফট ১ ঘন্টায় শুরু হচ্ছে", time: "1 hour ago", read: false },
  { id: "n5", channel: "messages", titleEn: "New Message from Agency", titleBn: "এজেন্সি থেকে নতুন বার্তা", messageEn: "HealthCare Pro BD sent you a message.", messageBn: "হেলথকেয়ার প্রো বিডি বার্তা পাঠিয়েছে", time: "3 hours ago", read: false },
  { id: "n6", channel: "payments", titleEn: "Payment Received", titleBn: "পেমেন্ট প্রাপ্ত", messageEn: "৳ 8,400 received via bKash.", messageBn: "বিকাশের মাধ্যমে ৳ ৮,৪০০ প্রাপ্ত", time: "1 day ago", read: true },
  { id: "n9", channel: "ratings", titleEn: "New 5-Star Rating", titleBn: "নতুন ৫-তারা রেটিং", messageEn: "Rashed Hossain gave you a 5-star rating.", messageBn: "রাশেদ হোসেন ৫-তারা রেটিং দিয়েছেন", time: "2 days ago", read: true },
  { id: "n10", channel: "platform", titleEn: "CareNet v2.1 Released", titleBn: "CareNet v2.1 প্রকাশিত", messageEn: "New features: offline care logs, Bangla support.", messageBn: "নতুন ফিচার: অফলাইন কেয়ার লগ", time: "3 days ago", read: true },

  // ─── Billing Notifications ───
  { id: "n-bill-1", channel: "billing", titleEn: "Payment Proof Received", titleBn: "পেমেন্ট প্রমাণ প্রাপ্ত", messageEn: "Rashed Hossain submitted payment proof of ৳21,919 via bKash for invoice INV-2026-0042.", messageBn: "রাশেদ হোসেন ৳২১,৯১৯ বিকাশের মাধ্যমে পেমেন্ট প্রমাণ জমা দিয়েছেন।", time: "2 hours ago", read: false, actionUrl: "/billing/verify/PP-001" },
  { id: "n-bill-2", channel: "billing", titleEn: "Payment Verified", titleBn: "পেমেন্ট যাচাই হয়েছে", messageEn: "Your payment of ৳15,400 for invoice INV-2026-0038 has been verified by Admin Karim.", messageBn: "আপনার ৳১৫,৪০০ পেমেন্ট যাচাই করা হয়েছে।", time: "1 day ago", read: true, actionUrl: "/billing/invoice/INV-2026-0038" },
  { id: "n-bill-3", channel: "billing", titleEn: "Payment Proof Rejected", titleBn: "পেমেন্ট প্রমাণ প্রত্যাখ্যাত", messageEn: "Your payment proof for invoice INV-2026-0035 was rejected. Reason: Reference number does not match.", messageBn: "আপনার পেমেন্ট প্রমাণ প্রত্যাখ্যাত হয়েছে।", time: "2 days ago", read: false, actionUrl: "/billing/invoice/INV-2026-0035" },
  { id: "n-bill-4", channel: "billing", titleEn: "Payment Proof Received", titleBn: "পেমেন্ট প্রমাণ প্রাপ্ত", messageEn: "HealthCare Pro BD submitted payment proof of ৳12,000 via bKash for caregiver payout.", messageBn: "হেলথকেয়ার প্রো বিডি ৳১২,০০০ পেমেন্ট প্রমাণ জমা দিয়েছেন।", time: "1 hour ago", read: false, actionUrl: "/billing/verify/PP-004" },
];