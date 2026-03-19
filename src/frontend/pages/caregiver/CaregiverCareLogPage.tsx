import { useState } from "react";
import { useSearchParams } from "react-router";
import { useTransitionNavigate } from "@/frontend/hooks/useTransitionNavigate";
import { cn } from "@/frontend/theme/tokens";
import {
  UtensilsCrossed, Pill, Activity, Dumbbell, Droplets, Moon, Eye, AlertTriangle,
  Camera, Mic, CheckCircle2, ChevronLeft, Clock, User, WifiOff,
} from "lucide-react";
import { useSyncQueue } from "@/frontend/offline/useSyncQueue";
import { useOnlineStatus } from "@/frontend/offline/useOnlineStatus";
import { useAuth } from "@/frontend/auth/AuthContext";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { useTranslation } from "react-i18next";
import { caregiverService } from "@/backend/services/caregiver.service";

const logTypes = [
  { id: "meal", name: "Meal", icon: UtensilsCrossed, color: "#E64A19", bg: "rgba(230,74,25,0.12)" },
  { id: "medication", name: "Medication", icon: Pill, color: "#5FB865", bg: "rgba(95,184,101,0.12)" },
  { id: "vitals", name: "Vitals", icon: Activity, color: "#0288D1", bg: "rgba(2,136,209,0.12)" },
  { id: "exercise", name: "Exercise", icon: Dumbbell, color: "#7B5EA7", bg: "rgba(123,94,167,0.12)" },
  { id: "bathroom", name: "Bathroom", icon: Droplets, color: "#00897B", bg: "rgba(0,137,123,0.12)" },
  { id: "sleep", name: "Sleep", icon: Moon, color: "#3949AB", bg: "rgba(57,73,171,0.12)" },
  { id: "observation", name: "Observation", icon: Eye, color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
  { id: "incident", name: "Incident", icon: AlertTriangle, color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
];

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const portionSizes = ["Light", "Normal", "Heavy"];
const moods = ["\u{1F60A} Happy", "\u{1F610} Neutral", "\u{1F622} Sad", "\u{1F624} Agitated", "\u{1F634} Drowsy"];

export default function CaregiverCareLogPage() {
  const { t } = useTranslation("common");
  useDocumentTitle(t("pageTitles.careLog", "Care Log"));
  const navigate = useTransitionNavigate();
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [mobileStep, setMobileStep] = useState(0);

  const { queueAction } = useSyncQueue();
  const { isOnline } = useOnlineStatus();
  const { user } = useAuth();

  const [mealType, setMealType] = useState("");
  const [portion, setPortion] = useState("");
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [bp, setBp] = useState({ sys: "", dia: "" });
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [mood, setMood] = useState("");
  const [severity, setSeverity] = useState("");

  const selType = logTypes.find((t) => t.id === selectedType);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setMobileStep(1);
  };

  const handleSubmit = async () => {
    const payload: Record<string, any> = {
      patientId: "patient-ar-001",
      patientName: "Mr. Abdul Rahman",
      logType: selectedType,
      notes,
      timestamp: new Date().toISOString(),
    };
    if (selectedType === "meal") Object.assign(payload, { mealType, portion });
    if (selectedType === "medication") Object.assign(payload, { medName, medDosage });
    if (selectedType === "vitals") Object.assign(payload, { bp, heartRate, temperature });
    if (selectedType === "observation") Object.assign(payload, { mood });
    if (selectedType === "incident") Object.assign(payload, { severity });

    await queueAction("care-log.create", payload, user?.id || "anonymous", 1);
    setSavedOffline(!isOnline);
    setSubmitted(true);
  };

  const stepLabels = ["Type", "Details", "Review"];

  if (submitted) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="finance-card p-8 text-center max-w-sm">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: savedOffline ? cn.amberBg : cn.greenBg }}>
              {savedOffline ? (
                <WifiOff className="w-8 h-8" style={{ color: cn.amber }} />
              ) : (
                <CheckCircle2 className="w-8 h-8" style={{ color: cn.green }} />
              )}
            </div>
            <h2 className="text-lg mb-1" style={{ color: cn.text }}>
              {savedOffline ? "Saved Offline" : "Care Log Saved!"}
            </h2>
            <p className="text-sm mb-4" style={{ color: cn.textSecondary }}>
              {savedOffline
                ? "Entry saved to device. Will sync automatically when back online."
                : "Entry recorded for Mr. Abdul Rahman"}
            </p>
            {savedOffline && (
              <div className="flex items-center justify-center gap-1.5 mb-4 px-3 py-2 rounded-lg text-xs" style={{ background: cn.amberBg, color: cn.amber }}>
                <WifiOff className="w-3.5 h-3.5" /> Pending sync
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button onClick={() => { setSubmitted(false); setSavedOffline(false); setSelectedType(null); setNotes(""); setMobileStep(0); }}
                className="py-2.5 rounded-xl text-white text-sm" style={{ background: "var(--cn-gradient-caregiver)" }}>
                Log Another Entry
              </button>
              <button onClick={() => navigate("/caregiver/assigned-patients")}
                className="py-2.5 rounded-xl text-sm border" style={{ borderColor: cn.border, color: cn.textSecondary }}>
                Back to Patients
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          {mobileStep > 0 && (
            <button onClick={() => setMobileStep(mobileStep - 1)} className="p-2 -ml-2 cn-touch-target rounded-lg" style={{ color: cn.text }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg flex-1" style={{ color: cn.textHeading, textAlign: mobileStep > 0 ? "center" : "left" }}>
            New Care Log
          </h1>
          <span className="text-xs" style={{ color: cn.textSecondary }}>
            {mobileStep + 1}/{stepLabels.length}
          </span>
        </div>
        <div className="flex gap-1.5">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1 h-1 rounded-full" style={{ background: i <= mobileStep ? cn.pink : cn.borderLight }} />
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        {!isOnline && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ background: cn.amberBg, color: cn.amber }}>
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>You're offline — care logs will be saved locally and synced when back online.</span>
          </div>
        )}

        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: cn.pinkBg }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs" style={{ background: cn.pink, color: "white" }}>AR</div>
          <div>
            <p className="text-sm" style={{ color: cn.text }}>Mr. Abdul Rahman</p>
            <p className="text-xs" style={{ color: cn.textSecondary }}>Shift: Tonight 8PM-8AM | <Clock className="w-3 h-3 inline" /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        <div className={mobileStep !== 0 ? "hidden md:block" : ""}>
          <h2 className="text-sm mb-3" style={{ color: cn.text }}>What are you logging?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {logTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button key={type.id} onClick={() => handleSelectType(type.id)}
                  className="finance-card p-3 flex flex-col items-center gap-2 transition-all cn-touch-target"
                  style={{ borderColor: isSelected ? type.color : cn.border, borderWidth: "2px", background: isSelected ? type.bg : undefined }}>
                  <Icon className="w-5 h-5" style={{ color: type.color }} />
                  <span className="text-xs" style={{ color: isSelected ? type.color : cn.text }}>{type.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedType && (
          <div className={mobileStep !== 1 ? "hidden md:block" : ""}>
            <div className="finance-card p-5 space-y-4">
              <h3 className="text-sm flex items-center gap-2" style={{ color: selType?.color }}>
                {selType && <selType.icon className="w-4 h-4" />} {selType?.name} Details
              </h3>

              {selectedType === "meal" && (
                <>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Meal Type</label>
                    <div className="flex gap-2">
                      {mealTypes.map((m) => (
                        <button key={m} onClick={() => setMealType(m)}
                          className="flex-1 py-2 rounded-lg text-xs border"
                          style={{ borderColor: mealType === m ? selType!.color : cn.border, color: mealType === m ? selType!.color : cn.text, background: mealType === m ? selType!.bg : undefined }}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Portion Size</label>
                    <div className="flex gap-2">
                      {portionSizes.map((p) => (
                        <button key={p} onClick={() => setPortion(p)}
                          className="flex-1 py-2 rounded-lg text-xs border"
                          style={{ borderColor: portion === p ? selType!.color : cn.border, color: portion === p ? selType!.color : cn.text }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedType === "medication" && (
                <>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Medication Name</label>
                    <select value={medName} onChange={(e) => setMedName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }}>
                      <option value="">Select medication</option>
                      <option value="Amlodipine 5mg">Amlodipine 5mg</option>
                      <option value="Metformin 500mg">Metformin 500mg</option>
                      <option value="Insulin Glargine">Insulin Glargine</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Dosage Given</label>
                    <input type="text" value={medDosage} onChange={(e) => setMedDosage(e.target.value)} placeholder="e.g., 1 tablet"
                      className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} />
                  </div>
                </>
              )}

              {selectedType === "vitals" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Blood Pressure</label>
                    <div className="flex items-center gap-1">
                      <input type="number" placeholder="Sys" value={bp.sys} onChange={(e) => setBp({ ...bp, sys: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} />
                      <span style={{ color: cn.textSecondary }}>/</span>
                      <input type="number" placeholder="Dia" value={bp.dia} onChange={(e) => setBp({ ...bp, dia: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Heart Rate (BPM)</label>
                    <input type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="72"
                      className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Temperature (°F)</label>
                    <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="98.6"
                      className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} />
                  </div>
                </div>
              )}

              {selectedType === "observation" && (
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Patient Mood</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((m) => (
                      <button key={m} onClick={() => setMood(m)}
                        className="px-3 py-2 rounded-lg text-sm border"
                        style={{ borderColor: mood === m ? selType!.color : cn.border, background: mood === m ? selType!.bg : undefined }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedType === "incident" && (
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Severity</label>
                  <div className="flex gap-2">
                    {["Minor", "Moderate", "Severe"].map((s) => (
                      <button key={s} onClick={() => setSeverity(s)}
                        className="flex-1 py-2 rounded-lg text-xs border"
                        style={{ borderColor: severity === s ? "#EF4444" : cn.border, color: severity === s ? "#EF4444" : cn.text, background: severity === s ? "rgba(239,68,68,0.1)" : undefined }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Notes</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  className="w-full px-4 py-3 rounded-xl border text-sm resize-none"
                  style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }} />
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: cn.border, color: cn.textSecondary }}>
                  <Camera className="w-4 h-4" /> Photo
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: cn.border, color: cn.textSecondary }}>
                  <Mic className="w-4 h-4" /> Voice Note
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedType && (
          <div className={mobileStep === 2 || "hidden md:block" ? "" : "hidden"}>
            <div className="md:hidden finance-card p-4 mb-4 space-y-3">
              <h3 className="text-sm" style={{ color: cn.textHeading }}>Review Entry</h3>
              <div className="flex items-center gap-2 text-sm" style={{ color: cn.text }}>
                {selType && <selType.icon className="w-4 h-4" style={{ color: selType.color }} />}
                <span>{selType?.name}</span>
              </div>
              {notes && <p className="text-xs" style={{ color: cn.textSecondary }}>Notes: {notes}</p>}
              <p className="text-xs" style={{ color: cn.textSecondary }}>Patient: Mr. Abdul Rahman</p>
            </div>

            <div className="md:block">
              <button onClick={handleSubmit}
                className="w-full py-3 rounded-xl text-white text-sm cn-touch-target flex items-center justify-center gap-2"
                style={{ background: "var(--cn-gradient-caregiver)" }}>
                {!isOnline && <WifiOff className="w-4 h-4" />}
                {isOnline ? "Save Care Log" : "Save Offline"}
              </button>
            </div>
          </div>
        )}

        {selectedType && mobileStep === 1 && (
          <div className="md:hidden sticky bottom-0 z-20 py-3 cn-safe-bottom" style={{ background: cn.bgPage }}>
            <button onClick={() => setMobileStep(2)}
              className="w-full py-3 rounded-xl text-white text-sm cn-touch-target"
              style={{ background: "var(--cn-gradient-caregiver)" }}>
              Review & Submit
            </button>
          </div>
        )}

        <div className={mobileStep !== 0 ? "hidden md:block" : ""}>
          <h3 className="text-sm mb-3" style={{ color: cn.text }}>Recent Logs (This Shift)</h3>
          <RecentCareLogsSection />
        </div>
      </div>
    </>
  );
}

function RecentCareLogsSection() {
  const { data: recentLogs, loading } = useAsyncData(() => caregiverService.getRecentCareLogs());
  const iconMap: Record<string, typeof Activity> = { vitals: Activity, medication: Pill, meal: UtensilsCrossed };

  if (loading || !recentLogs) return <div className="animate-pulse space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 rounded-xl" style={{ background: cn.bgInput }} />)}</div>;

  return (
    <div className="space-y-2">
      {recentLogs.map((log, i) => {
        const Icon = iconMap[log.iconType] || Activity;
        return (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: cn.bgInput }}>
            <Icon className="w-4 h-4 shrink-0" style={{ color: log.color }} />
            <div className="flex-1">
              <p className="text-sm" style={{ color: cn.text }}>{log.type}</p>
              <p className="text-xs" style={{ color: cn.textSecondary }}>{log.detail}</p>
            </div>
            <span className="text-xs" style={{ color: cn.textSecondary }}>{log.time}</span>
          </div>
        );
      })}
    </div>
  );
}