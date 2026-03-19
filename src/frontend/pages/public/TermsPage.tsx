import React from "react";
import { Link } from "react-router";
import { Button } from "@/frontend/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

export default function TermsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.terms", "Terms"));

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: cn.bgPage }}>
      <div className="max-w-4xl mx-auto">
        <div className="finance-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8" style={{ color: "#8B7AE8" }} />
            <h1 className="text-3xl font-bold" style={{ color: "#535353" }}>
              Terms & Conditions
            </h1>
          </div>

          <div className="prose max-w-none space-y-6" style={{ color: "#535353" }}>
            <p className="text-sm" style={{ color: "#848484" }}>
              <strong>Last Updated:</strong> December 2024
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p>
                Welcome to CareNet Bangladesh. By accessing or using our platform, you agree to be bound by these Terms and Conditions. CareNet provides a platform connecting guardians, caregivers, agencies, and healthcare service providers across Bangladesh.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. User Accounts</h2>
              <p className="mb-2">When you create an account on CareNet, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Verification Process</h2>
              <p>All caregivers and agencies must undergo our 6-step verification process, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Certificate verification</li>
                <li>Police clearance check</li>
                <li>In-person interview</li>
                <li>Psychological assessment</li>
                <li>Document verification</li>
                <li>Final approval</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Payment Terms</h2>
              <p>CareNet facilitates payments between guardians, agencies, and caregivers. All payments are subject to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Platform commission fees as disclosed during registration</li>
                <li>Payment enforcement policy (7-day grace period)</li>
                <li>Escrow protection during dispute resolution</li>
                <li>Secure payment processing through approved gateways</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. User Conduct</h2>
              <p className="mb-2">Users agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any laws or regulations of Bangladesh</li>
                <li>Provide false or misleading information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to circumvent platform fees</li>
                <li>Engage in fraudulent activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Dispute Resolution</h2>
              <p>All disputes are subject to our Two-Tier Authority System:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Initial review by Platform Moderators</li>
                <li>Final decision by Platform Administrators</li>
                <li>48-hour escrow period for payment disputes</li>
                <li>Evidence-based resolution process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Contact Information</h2>
              <p>
                For questions about these terms, please contact us at:
                <br />
                Email: legal@carenet.bd
                <br />
                Phone: +880 1712-3456789
              </p>
            </section>
          </div>

          <div className="mt-8 p-4 rounded-2xl" style={{ background: "rgba(139,122,232,0.1)" }}>
            <p className="text-sm" style={{ color: "#535353" }}>
              By using CareNet, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
