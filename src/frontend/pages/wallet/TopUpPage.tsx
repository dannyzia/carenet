import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowLeft, Coins, Sparkles, CreditCard, Smartphone, Building2,
  CheckCircle, Shield, Loader2, ChevronRight, AlertTriangle,
} from "lucide-react";
import { cn } from "@/frontend/theme/tokens";
import { useWallet } from "@/frontend/hooks/useWallet";
import { formatPoints, pointsToBDT, POINT_PACKAGES } from "@/frontend/utils/points";
import { formatBDT } from "@/frontend/utils/currency";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";

const PAYMENT_METHODS = [
  { id: "bkash", name: "bKash", icon: Smartphone, color: "#E2136E", desc: "Mobile wallet" },
  { id: "nagad", name: "Nagad", icon: Smartphone, color: "#F6921E", desc: "Mobile wallet" },
  { id: "rocket", name: "Rocket", icon: Smartphone, color: "#8B2F8B", desc: "Mobile wallet" },
  { id: "bank", name: "Bank Transfer", icon: Building2, color: "#1E88E5", desc: "BEFTN / NPSB" },
  { id: "card", name: "Card (Visa/MC)", icon: CreditCard, color: "#1A1F71", desc: "Debit or credit" },
];

export default function TopUpPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.topUp", "Top Up"));

  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "guardian";
  const { wallet, loading, buyPoints } = useWallet(role);

  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState("");

  if (loading || !wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: cn.pink }} />
        <p className="text-sm" style={{ color: cn.textSecondary }}>Loading...</p>
      </div>
    );
  }

  const pkg = POINT_PACKAGES.find((p) => p.id === selectedPkg);
  const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  const roleGradient = role === "guardian"
    ? "var(--cn-gradient-guardian)"
    : role === "agency"
    ? "var(--cn-gradient-agency)"
    : "var(--cn-gradient-caregiver)";

  const handlePurchase = async () => {
    if (!selectedPkg || !selectedMethod) return;
    setBuying(true);
    await buyPoints(selectedPkg, selectedMethod);
    setBuying(false);
    setSuccess(true);
    setStep(3);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Link to={`/wallet?role=${role}`} className="inline-flex items-center gap-1 text-sm hover:underline no-underline mb-2"
          style={{ color: cn.textSecondary }}>
          <ArrowLeft className="w-4 h-4" /> Back to Wallet
        </Link>
        <h1 className="text-2xl flex items-center gap-2" style={{ color: cn.text }}>
          <Coins className="w-6 h-6" style={{ color: cn.amber }} />
          Top Up CarePoints
        </h1>
        <p className="text-sm" style={{ color: cn.textSecondary }}>
          Current balance: {formatPoints(wallet.balance)} ({formatBDT(pointsToBDT(wallet.balance))})
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{
                background: step >= s ? roleGradient : cn.bgInput,
                color: step >= s ? "white" : cn.textSecondary,
              }}>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            <span className="text-xs hidden sm:block" style={{ color: step >= s ? cn.text : cn.textSecondary }}>
              {s === 1 ? "Select Package" : s === 2 ? "Payment" : "Confirmation"}
            </span>
            {s < 3 && <div className="flex-1 h-0.5 rounded" style={{ background: step > s ? cn.green : cn.borderLight }} />}
          </div>
        ))}
      </div>

      {/* Step 1: Package Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="mb-1" style={{ color: cn.text }}>Choose a Package</h2>
            <p className="text-xs mb-4" style={{ color: cn.textSecondary }}>
              1 BDT = 10 CarePoints · Bonus points on larger packages
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POINT_PACKAGES.map((p) => (
                <button key={p.id}
                  onClick={() => setSelectedPkg(p.id)}
                  className="p-4 rounded-xl border-2 text-left transition-all"
                  style={{
                    borderColor: selectedPkg === p.id ? cn.pink : cn.border,
                    background: selectedPkg === p.id ? cn.pinkBg : "white",
                  }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs" style={{ color: cn.textSecondary }}>{p.label}</p>
                    {p.bonus > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                        style={{ background: cn.greenBg, color: cn.green }}>
                        <Sparkles className="w-3 h-3" /> +{formatPoints(p.bonus)}
                      </span>
                    )}
                  </div>
                  <p className="text-xl" style={{ color: cn.text }}>{formatPoints(p.points)}</p>
                  <p className="text-sm" style={{ color: cn.textSecondary }}>{formatBDT(p.bdt)}</p>
                  {p.bonus > 0 && (
                    <p className="text-xs mt-1" style={{ color: cn.green }}>
                      Total with bonus: {formatPoints(p.points + p.bonus)}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => selectedPkg && setStep(2)}
            disabled={!selectedPkg}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-opacity"
            style={{ background: roleGradient, opacity: selectedPkg ? 1 : 0.5 }}>
            Continue to Payment <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Payment Method */}
      {step === 2 && pkg && (
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="rounded-2xl p-4 text-white" style={{ background: roleGradient }}>
            <p className="text-xs opacity-70">You're buying</p>
            <p className="text-2xl mt-1">{formatPoints(pkg.points + pkg.bonus)} CarePoints</p>
            <p className="text-sm opacity-80">
              {formatBDT(pkg.bdt)}
              {pkg.bonus > 0 && ` (includes ${formatPoints(pkg.bonus)} bonus)`}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="mb-4" style={{ color: cn.text }}>Select Payment Method</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => {
                const MIcon = m.icon;
                const isSelected = selectedMethod === m.id;
                return (
                  <button key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all"
                    style={{
                      borderColor: isSelected ? m.color : cn.border,
                      background: isSelected ? `${m.color}10` : "white",
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${m.color}20` }}>
                      <MIcon className="w-5 h-5" style={{ color: m.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: cn.text }}>{m.name}</p>
                      <p className="text-xs" style={{ color: cn.textSecondary }}>{m.desc}</p>
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 shrink-0" style={{ color: m.color }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone/Account for MFS */}
          {selectedMethod && selectedMethod !== "bank" && selectedMethod !== "card" && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <label className="block text-xs mb-1.5" style={{ color: cn.textSecondary }}>
                {method?.name} Account Number
              </label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: cn.border, color: cn.text }} />
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => setStep(1)}
              className="px-4 py-3 rounded-xl text-sm border flex-1"
              style={{ borderColor: cn.border, color: cn.textSecondary }}>
              Back
            </button>
            <button onClick={handlePurchase}
              disabled={!selectedMethod || buying}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm flex-[2] transition-opacity"
              style={{ background: roleGradient, opacity: selectedMethod && !buying ? 1 : 0.5 }}>
              {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {buying ? "Processing..." : `Pay ${formatBDT(pkg.bdt)}`}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && success && pkg && (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "#7CE57720" }}>
            <CheckCircle className="w-8 h-8" style={{ color: "#5FB865" }} />
          </div>
          <h2 className="text-xl mb-2" style={{ color: cn.text }}>Top Up Successful!</h2>
          <p className="text-sm mb-1" style={{ color: cn.textSecondary }}>
            {formatPoints(pkg.points + pkg.bonus)} CarePoints added to your wallet
          </p>
          <p className="text-sm mb-6" style={{ color: cn.textSecondary }}>
            New balance: {formatPoints(wallet.balance + pkg.points + pkg.bonus)}
          </p>
          <div className="p-4 rounded-xl mb-6" style={{ background: cn.bgInput }}>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p style={{ color: cn.textSecondary }}>Transaction ID</p>
                <p style={{ color: cn.text }}>TXN-{Date.now().toString(36).toUpperCase()}</p>
              </div>
              <div>
                <p style={{ color: cn.textSecondary }}>Payment Method</p>
                <p style={{ color: cn.text }}>{method?.name}</p>
              </div>
              <div>
                <p style={{ color: cn.textSecondary }}>Amount Paid</p>
                <p style={{ color: cn.text }}>{formatBDT(pkg.bdt)}</p>
              </div>
              <div>
                <p style={{ color: cn.textSecondary }}>Points Received</p>
                <p style={{ color: cn.green }}>{formatPoints(pkg.points + pkg.bonus)}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <Link to={`/wallet?role=${role}`}
              className="px-6 py-2.5 rounded-xl text-white text-sm no-underline"
              style={{ background: roleGradient }}>
              Back to Wallet
            </Link>
            <button onClick={() => { setStep(1); setSuccess(false); setSelectedPkg(null); setSelectedMethod(null); }}
              className="px-6 py-2.5 rounded-xl text-sm border"
              style={{ borderColor: cn.border, color: cn.text }}>
              Buy More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
