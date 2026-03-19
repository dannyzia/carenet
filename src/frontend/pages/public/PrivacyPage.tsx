import React from "react";
import { Link } from "react-router";
import { Button } from "@/frontend/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

export default function PrivacyPolicyPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.privacyPolicy", "Privacy Policy"));

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: cn.bgPage }}>
      <div className="max-w-4xl mx-auto">
        <div className="finance-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8" style={{ color: "#7CE577" }} />
            <h1 className="text-3xl font-bold" style={{ color: "#535353" }}>
              Privacy Policy
            </h1>
          </div>

          <div className="prose max-w-none space-y-6" style={{ color: "#535353" }}>
            <p className="text-sm" style={{ color: "#848484" }}>
              <strong>Last Updated:</strong> December 2024
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="mb-2">CareNet collects the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, phone number, email, date of birth, NID, address</li>
                <li><strong>Health Information:</strong> Patient medical conditions, medications, allergies (with consent)</li>
                <li><strong>Professional Information:</strong> Certifications, trade licenses, police clearance</li>
                <li><strong>Location Data:</strong> GPS coordinates for check-in verification</li>
                <li><strong>Usage Data:</strong> Care logs, messages, ratings, reviews</li>
                <li><strong>Payment Information:</strong> Bank/mobile money account details (encrypted)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="mb-2">We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitate connections between guardians, caregivers, and agencies</li>
                <li>Verify identities and credentials of service providers</li>
                <li>Process payments and manage billing</li>
                <li>Monitor quality and safety of care services</li>
                <li>Resolve disputes and enforce platform policies</li>
                <li>Improve platform features and user experience</li>
                <li>Comply with legal obligations under Bangladesh law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
              <p className="mb-2">We share information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>With Service Providers:</strong> Caregivers and agencies receive necessary patient information</li>
                <li><strong>With Guardians:</strong> Guardians receive caregiver credentials and care logs</li>
                <li><strong>With Moderators/Admins:</strong> For verification and dispute resolution</li>
                <li><strong>With Payment Processors:</strong> For secure payment processing</li>
                <li><strong>Legal Requirements:</strong> When required by Bangladesh law or court orders</li>
              </ul>
              <p className="mt-2">We never sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure HTTPS connections for all communications</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Encrypted database storage</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p className="mb-2">As a CareNet user, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data stored on our platform</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Export your data in a portable format</li>
                <li>File complaints about privacy violations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
              <p>
                For privacy-related questions or to exercise your rights, contact us at:
                <br />
                Email: privacy@carenet.bd
                <br />
                Phone: +880 1712-3456789
                <br />
                Address: CareNet Bangladesh, Dhaka
              </p>
            </section>
          </div>

          <div className="mt-8 p-4 rounded-2xl" style={{ background: "rgba(124,229,119,0.1)" }}>
            <p className="text-sm" style={{ color: "#535353" }}>
              Your privacy and security are our top priorities. We are committed to protecting your personal information and maintaining transparency in how we collect, use, and safeguard your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
