import { useState, useRef } from "react";
import { cn } from "@/frontend/theme/tokens";
import {
  Globe, Download, Upload, Trash2, CheckCircle2, AlertTriangle,
  FileText, Plus, X, Info, ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/frontend/hooks";
import {
  getAllLanguages,
  getCustomLanguages,
  addCustomLanguage,
  removeCustomLanguage,
  generateTranslationTemplate,
  validateTranslationFile,
  BUILT_IN_LANGUAGES,
  type LanguageMeta,
} from "@/frontend/i18n/languageManager";

type UploadStep = "idle" | "configure" | "preview" | "success" | "error";

export default function AdminLanguageManagementPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.adminLanguageManagement", "Admin Language Management"));

  const [languages, setLanguages] = useState(getAllLanguages());
  const [uploadStep, setUploadStep] = useState<UploadStep>("idle");
  const [uploadData, setUploadData] = useState<Record<string, any> | null>(null);
  const [uploadMeta, setUploadMeta] = useState({ code: "", name: "", nativeName: "" });
  const [validation, setValidation] = useState<ReturnType<typeof validateTranslationFile> | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshLanguages = () => setLanguages(getAllLanguages());

  const handleDownloadTemplate = () => {
    const template = generateTranslationTemplate();
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "carenet-translation-template.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        const result = validateTranslationFile(data);
        setUploadData(data); setValidation(result); setUploadStep("configure"); setErrorMsg("");
      } catch { setErrorMsg("Invalid JSON file. Please check the file format."); setUploadStep("error"); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveLanguage = () => {
    if (!uploadData) return;
    const result = addCustomLanguage({ code: uploadMeta.code.toLowerCase().trim(), name: uploadMeta.name.trim(), nativeName: uploadMeta.nativeName.trim() }, uploadData);
    if (result.success) { setUploadStep("success"); refreshLanguages(); }
    else { setErrorMsg(result.error || "Failed to save language"); setUploadStep("error"); }
  };

  const handleDelete = (code: string) => { removeCustomLanguage(code); refreshLanguages(); setDeleteConfirm(null); };
  const resetUpload = () => { setUploadStep("idle"); setUploadData(null); setUploadMeta({ code: "", name: "", nativeName: "" }); setValidation(null); setErrorMsg(""); };
  const isBuiltIn = (code: string) => BUILT_IN_LANGUAGES.some((l) => l.code === code);

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cn.greenBg }}><Globe className="w-5 h-5" style={{ color: cn.green }} /></div><div><h1 className="text-xl" style={{ color: cn.text }}>Language Management</h1><p className="text-sm" style={{ color: cn.textSecondary }}>Add new languages to make CareNet accessible to more users</p></div></div></div>

        <div className="finance-card p-4 flex items-start gap-3" style={{ background: cn.blueBg, border: `1px solid rgba(2,136,209,0.2)` }}><Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: cn.blue }} /><div className="text-sm" style={{ color: cn.blue }}><p className="mb-1" style={{ fontWeight: 600 }}>How to add a new language:</p><ol className="list-decimal list-inside space-y-0.5 text-xs" style={{ opacity: 0.85 }}><li>Download the translation template (English source file)</li><li>Translate all values in the JSON file to your target language</li><li>Upload the translated file and set the language code &amp; name</li><li>The new language will appear in the language dropdown for all users</li></ol></div></div>

        <div className="flex flex-wrap gap-3"><button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all cn-touch-target" style={{ borderColor: cn.green, color: cn.green }}><Download className="w-4 h-4" /> Download Template</button><button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white transition-all cn-touch-target" style={{ background: "var(--cn-gradient-admin)" }}><Upload className="w-4 h-4" /> Upload Translation</button><input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} className="hidden" /></div>

        {uploadStep === "configure" && (<div className="finance-card p-5 space-y-5"><div className="flex items-center justify-between"><h3 className="text-sm" style={{ color: cn.textHeading }}>Configure New Language</h3><button onClick={resetUpload} className="p-1 rounded-lg" style={{ color: cn.textSecondary }}><X className="w-4 h-4" /></button></div>{validation && (<div className="p-3 rounded-xl text-sm flex items-start gap-2" style={{ background: validation.valid ? cn.greenBg : cn.amberBg, color: validation.valid ? cn.green : cn.amber }}>{validation.valid ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}<div><p style={{ fontWeight: 500 }}>{validation.valid ? "File validated successfully" : "Validation issues found"}</p><p className="text-xs mt-0.5" style={{ opacity: 0.8 }}>{validation.translatedKeys}/{validation.totalKeys} keys translated ({Math.round((validation.translatedKeys / Math.max(validation.totalKeys, 1)) * 100)}%) &bull; Namespaces: {validation.namespacesCovered.join(", ")}</p>{validation.errors.map((err, i) => (<p key={i} className="text-xs mt-0.5">- {err}</p>))}</div></div>)}<div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Language Code *</label><input type="text" value={uploadMeta.code} onChange={(e) => setUploadMeta({ ...uploadMeta, code: e.target.value })} placeholder="e.g. hi, ur, zh-CN" maxLength={5} className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text, fontSize: "16px" }} /><p className="text-[10px] mt-1" style={{ color: cn.textSecondary }}>ISO 639-1 code</p></div><div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>Native Name *</label><input type="text" value={uploadMeta.name} onChange={(e) => setUploadMeta({ ...uploadMeta, name: e.target.value })} placeholder="e.g. \u0939\u093F\u0928\u094D\u0926\u0940, \u0627\u0631\u062F\u0648" className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text, fontSize: "16px" }} /><p className="text-[10px] mt-1" style={{ color: cn.textSecondary }}>Shown in dropdown</p></div><div><label className="text-xs mb-1.5 block" style={{ color: cn.textSecondary }}>English Name *</label><input type="text" value={uploadMeta.nativeName} onChange={(e) => setUploadMeta({ ...uploadMeta, nativeName: e.target.value })} placeholder="e.g. Hindi, Urdu" className="w-full px-4 py-3 rounded-xl border text-sm" style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text, fontSize: "16px" }} /><p className="text-[10px] mt-1" style={{ color: cn.textSecondary }}>For reference</p></div></div><div className="flex gap-3 pt-2"><button onClick={resetUpload} className="px-4 py-2.5 rounded-xl text-sm border cn-touch-target" style={{ borderColor: cn.border, color: cn.textSecondary }}>Cancel</button><button onClick={handleSaveLanguage} disabled={!uploadMeta.code || !uploadMeta.name || !uploadMeta.nativeName || !validation?.valid} className="px-6 py-2.5 rounded-xl text-sm text-white cn-touch-target disabled:opacity-40" style={{ background: "var(--cn-gradient-admin)" }}>Add Language</button></div></div>)}

        {uploadStep === "success" && (<div className="finance-card p-6 text-center"><CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: cn.green }} /><h3 className="text-lg mb-1" style={{ color: cn.textHeading }}>Language Added!</h3><p className="text-sm mb-4" style={{ color: cn.textSecondary }}>"{uploadMeta.name}" ({uploadMeta.code}) is now available in the language dropdown for all users.</p><button onClick={resetUpload} className="px-6 py-2.5 rounded-xl text-sm text-white cn-touch-target" style={{ background: "var(--cn-gradient-admin)" }}>Done</button></div>)}

        {uploadStep === "error" && (<div className="finance-card p-6 text-center"><AlertTriangle className="w-12 h-12 mx-auto mb-3" style={{ color: "#EF4444" }} /><h3 className="text-lg mb-1" style={{ color: cn.textHeading }}>Upload Failed</h3><p className="text-sm mb-4" style={{ color: cn.textSecondary }}>{errorMsg}</p><button onClick={resetUpload} className="px-6 py-2.5 rounded-xl text-sm border cn-touch-target" style={{ borderColor: cn.border, color: cn.text }}>Try Again</button></div>)}

        <div><h2 className="text-sm mb-3" style={{ color: cn.textHeading }}>Installed Languages ({languages.length})</h2><div className="space-y-3">{languages.map((lang) => { const builtIn = isBuiltIn(lang.code); return (<div key={lang.code} className="finance-card p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3 min-w-0"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0" style={{ background: builtIn ? cn.greenBg : cn.purpleBg, color: builtIn ? cn.green : cn.purple, fontWeight: 700 }}>{lang.code.toUpperCase()}</div><div className="min-w-0"><div className="flex items-center gap-2"><h3 className="text-sm truncate" style={{ color: cn.text }}>{lang.name}</h3><span className="text-xs" style={{ color: cn.textSecondary }}>({lang.nativeName})</span>{builtIn && (<span className="px-1.5 py-0.5 rounded text-[9px] shrink-0" style={{ background: cn.greenBg, color: cn.green }}>Built-in</span>)}</div><p className="text-xs" style={{ color: cn.textSecondary }}>Namespaces: {lang.namespaces.join(", ")}{!builtIn && ` \u2022 Added ${new Date(lang.addedAt).toLocaleDateString()}`}</p></div></div>{!builtIn && (<div className="flex items-center gap-2 shrink-0">{deleteConfirm === lang.code ? (<><button onClick={() => handleDelete(lang.code)} className="px-3 py-1.5 rounded-lg text-xs text-white cn-touch-target" style={{ background: "#EF4444" }}>Confirm Delete</button><button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 rounded-lg text-xs border cn-touch-target" style={{ borderColor: cn.border, color: cn.textSecondary }}>Cancel</button></>) : (<button onClick={() => setDeleteConfirm(lang.code)} className="p-2 rounded-lg cn-touch-target" style={{ color: cn.textSecondary }}><Trash2 className="w-4 h-4" /></button>)}</div>)}</div></div>); })}</div></div>

        <div className="finance-card p-5"><h3 className="text-sm mb-3" style={{ color: cn.textHeading }}>Translation File Format</h3><p className="text-xs mb-3" style={{ color: cn.textSecondary }}>The template JSON contains 4 namespaces. You can translate all or just some \u2014 partially translated files are accepted.</p><pre className="p-4 rounded-xl text-xs overflow-x-auto" style={{ background: cn.bgInput, color: cn.text, fontFamily: "monospace" }}>{`{
  "common": {
    "nav": {
      "home": "Your translation here",
      "features": "...",
      ...
    },
    "btn": { "save": "...", "cancel": "...", ... },
    "status": { ... },
    ...
  },
  "auth": {
    "login": { "title": "...", ... },
    "otp": { ... },
    ...
  },
  "caregiver": { ... },
  "guardian": { ... }
}`}</pre></div>
      </div>
    </>
  );
}