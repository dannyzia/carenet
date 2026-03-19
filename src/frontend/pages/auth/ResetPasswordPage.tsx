import React, { useState } from "react";
import { Link } from "react-router";
import { useTransitionNavigate } from "@/frontend/hooks/useTransitionNavigate";
import { Heart, Eye, EyeOff, CheckCircle, Lock } from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { useAuth } from "@/frontend/auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

export default function ResetPasswordPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.resetPassword", "Reset Password"));

  const navigate = useTransitionNavigate();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    setError("");
    const result = await resetPassword(password);
    setLoading(false);
    if (result.success) {
      setDone(true);
    } else {
      setError(result.error || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: cn.bgPage }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)", boxShadow: "0px 4px 18px rgba(240,161,180,0.35)" }}>
            <Heart className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="finance-card p-8">
          {!done ? (
            <>
              <h1 className="text-2xl text-center mb-2" style={{ color: cn.text }}>Set New Password</h1>
              <p className="text-center text-sm mb-6" style={{ color: cn.textSecondary }}>Create a strong password for your account</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: cn.text }}>New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: cn.textSecondary }} />
                    <input type={showPwd ? "text" : "password"} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm" style={{ borderColor: cn.border, color: cn.text, background: cn.bgInput, fontSize: "16px" }} autoComplete="new-password" required minLength={8} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: cn.textSecondary }}>{showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: cn.text }}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: cn.textSecondary }} />
                    <input type={showConfirm ? "text" : "password"} placeholder="Repeat your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm" style={{ borderColor: cn.border, color: cn.text, background: cn.bgInput, fontSize: "16px" }} autoComplete="new-password" required />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: cn.textSecondary }}>{showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                  {confirm && password !== confirm && <p className="text-xs mt-1" style={{ color: cn.red }}>Passwords do not match</p>}
                </div>
                {error && <p className="text-sm text-center py-2 px-3 rounded-lg" style={{ color: "#EF4444", background: "rgba(239,68,68,0.08)" }}>{error}</p>}
                <button type="submit" disabled={loading || password !== confirm || password.length < 8} className="w-full py-3 rounded-xl text-white disabled:opacity-60" style={{ background: "radial-gradient(118.75% 157.07% at 34.74% -18.75%, #DB869A 0%, #8082ED 100%)" }}>{loading ? "Resetting..." : "Reset Password"}</button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#7CE57720" }}><CheckCircle className="w-8 h-8" style={{ color: cn.green }} /></div>
              <h2 className="text-xl mb-2" style={{ color: cn.text }}>Password Reset!</h2>
              <p className="text-sm mb-6" style={{ color: cn.textSecondary }}>Your password has been successfully updated.</p>
              <button onClick={() => navigate("/auth/login")} className="w-full py-3 rounded-xl text-white" style={{ background: "radial-gradient(118.75% 157.07% at 34.74% -18.75%, #DB869A 0%, #8082ED 100%)" }}>Sign In Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}