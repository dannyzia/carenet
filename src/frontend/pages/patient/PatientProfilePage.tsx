import { useState } from "react";
import { cn } from "@/frontend/theme/tokens";
import { User, Phone, Mail, MapPin, Calendar, Heart, Shield, Edit3 } from "lucide-react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { patientService } from "@/backend/services/patient.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function PatientProfilePage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.patientProfile", "Patient Profile"));

  const { data: profile, loading } = useAsyncData(() => patientService.getProfile());

  if (loading || !profile) return <PageSkeleton />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div><h1 className="text-2xl" style={{ color: cn.text }}>My Profile</h1><p className="text-sm" style={{ color: cn.textSecondary }}>Your personal and medical information</p></div>

      {/* Profile Card */}
      <div className="finance-card p-6 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--cn-gradient-caregiver)" }}>
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl mb-1" style={{ color: cn.text }}>{profile.name}</h2>
        <p className="text-sm mb-3" style={{ color: cn.textSecondary }}>{profile.age} years | {profile.gender} | Blood Type: {profile.bloodType}</p>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs border cn-touch-target" style={{ borderColor: cn.pink, color: cn.pink }}>
          <Edit3 className="w-3 h-3" /> Edit Profile
        </button>
      </div>

      {/* Contact Info */}
      <div className="finance-card p-5">
        <h3 className="text-sm mb-4" style={{ color: cn.text }}>Contact Information</h3>
        <div className="space-y-3">
          {[
            { icon: Phone, label: "Phone", value: profile.phone },
            { icon: Mail, label: "Email", value: profile.email },
            { icon: MapPin, label: "Address", value: profile.address },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: i < 2 ? `1px solid ${cn.borderLight}` : "none" }}>
                <Icon className="w-4 h-4" style={{ color: cn.textSecondary }} />
                <div><p className="text-xs" style={{ color: cn.textSecondary }}>{item.label}</p><p className="text-sm" style={{ color: cn.text }}>{item.value}</p></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guardian */}
      <div className="finance-card p-5">
        <h3 className="text-sm mb-3" style={{ color: cn.text }}>Assigned Guardian</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.greenBg }}><Shield className="w-5 h-5" style={{ color: cn.green }} /></div>
          <div><p className="text-sm" style={{ color: cn.text }}>{profile.guardian.name}</p><p className="text-xs" style={{ color: cn.textSecondary }}>{profile.guardian.role} since {profile.guardian.since}</p></div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="finance-card p-5" style={{ border: "1px solid rgba(239,68,68,0.15)" }}>
        <h3 className="text-sm mb-3 flex items-center gap-2" style={{ color: "#EF4444" }}><Heart className="w-4 h-4" /> Emergency Contact</h3>
        <div><p className="text-sm" style={{ color: cn.text }}>{profile.emergencyContact.name} ({profile.emergencyContact.relation})</p><p className="text-xs" style={{ color: cn.textSecondary }}>{profile.emergencyContact.phone}</p></div>
      </div>
    </div>
  );
}