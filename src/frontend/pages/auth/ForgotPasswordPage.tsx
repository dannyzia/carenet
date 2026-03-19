import { Mail, Heart, CheckCircle } from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { Link } from "react-router";
import { useState } from "react";
import { useAuth } from "@/frontend/auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

export default function ForgotPasswordPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.forgotPassword", "Forgot Password"));

  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: cn.bgPage }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)", boxShadow: "0px 4px 18px rgba(240,161,180,0.35)" }}><Heart className="w-7 h-7 text-white" /></div>
        </div>
        <div className="finance-card p-8">
          {!sent ? (
            <>
              <h1 className="text-2xl text-center mb-2" style={{ color: cn.text }}>Forgot Password?</h1>
              <p className="text-center text-sm mb-6" style={{ color: cn.textSecondary }}>Enter your registered email. We'll send a password reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: cn.text }}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: cn.textSecondary }} />
                    <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm" style={{ borderColor: cn.border, color: cn.text, background: cn.bgInput, fontSize: "16px" }} autoComplete="email" required />
                  </div>
                </div>
                {error && <p className="text-sm text-center py-2 px-3 rounded-lg" style={{ color: "#EF4444", background: "rgba(239,68,68,0.08)" }}>{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-white transition-opacity disabled:opacity-70" style={{ background: "radial-gradient(118.75% 157.07% at 34.74% -18.75%, #DB869A 0%, #8082ED 100%)", boxShadow: "-4px 30px 30px rgba(219,134,154,0.25)" }}>{loading ? "Sending..." : "Send Reset Link"}</button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#7CE57720" }}><CheckCircle className="w-8 h-8" style={{ color: cn.green }} /></div>
              <h2 className="text-xl mb-2" style={{ color: cn.text }}>Check Your Email</h2>
              <p className="text-sm mb-6" style={{ color: cn.textSecondary }}>We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.</p>
              <p className="text-xs" style={{ color: cn.textSecondary }}>Didn't receive it? Check your spam folder, or <button onClick={() => { setSent(false); setEmail(""); }} className="hover:underline" style={{ color: cn.pink }}>try again</button>.</p>
            </div>
          )}
          <p className="mt-6 text-center text-sm" style={{ color: cn.textSecondary }}>Remember your password?{" "}<Link to="/auth/login" className="hover:underline" style={{ color: cn.pink }}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
