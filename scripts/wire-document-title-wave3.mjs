#!/usr/bin/env node
/**
 * Wave 3: add useDocumentTitle + pageTitles keys for every *Page.tsx under src/frontend/pages
 * that does not already call useDocumentTitle.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve("src/frontend/pages");
const COMMON = path.resolve("src/locales/en/common.json");

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith("Page.tsx")) acc.push(p);
  }
  return acc;
}

function toKey(fnName) {
  const base = fnName.replace(/Page$/, "");
  return base ? base.charAt(0).toLowerCase() + base.slice(1) : fnName;
}

function toTitle(fnName) {
  const base = fnName.replace(/Page$/, "");
  return base.replace(/([A-Z])/g, " $1").replace(/^ /, "").trim();
}

function escapeForJsString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** True if file already has `const { ... t ... } = useTranslation("common")` with `t` not aliased. */
function canReuseCommonT(src) {
  const re = /const\s*\{([^}]+)\}\s*=\s*useTranslation\s*\(\s*["']common["']\s*\)/g;
  let m;
  while ((m = re.exec(src))) {
    const inner = m[1].replace(/\s+/g, " ").trim();
    if (/^\bt\s*[,\}]/.test(inner)) return true;
    if (/,\s*t\s*[,\}]/.test(inner)) return true;
  }
  return false;
}

function ensureHooksImport(src) {
  const reHooks = /import\s*\{([^}]+)\}\s*from\s*["']@\/frontend\/hooks["']\s*;/;
  let m = src.match(reHooks);
  if (m) {
    const parts = m[1].split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.includes("useDocumentTitle")) parts.push("useDocumentTitle");
    const unique = [...new Set(parts)].sort((a, b) => a.localeCompare(b));
    return src.replace(reHooks, `import { ${unique.join(", ")} } from "@/frontend/hooks";`);
  }

  const reAsync = /import\s*\{([^}]+)\}\s*from\s*["']@\/frontend\/hooks\/useAsyncData["']\s*;/;
  m = src.match(reAsync);
  if (m) {
    const parts = m[1].split(",").map((s) => s.trim()).filter(Boolean);
    const rest = parts.filter((p) => p !== "useAsyncData" && p !== "useDocumentTitle");
    const merged = ["useAsyncData", "useDocumentTitle", ...rest];
    const unique = [...new Set(merged)];
    return src.replace(reAsync, `import { ${unique.join(", ")} } from "@/frontend/hooks";`);
  }

  const lines = src.split("\n");
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i]) || /^import\s+type\s/.test(lines[i])) lastImport = i;
  }
  const line = `import { useDocumentTitle } from "@/frontend/hooks";`;
  if (lastImport < 0) return `${line}\n${src}`;
  lines.splice(lastImport + 1, 0, line);
  return lines.join("\n");
}

function ensureUseTranslationImport(src) {
  if (/from\s+["']react-i18next["']/.test(src)) return src;
  const lines = src.split("\n");
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i]) || /^import\s+type\s/.test(lines[i])) lastImport = i;
  }
  lines.splice(lastImport + 1, 0, `import { useTranslation } from "react-i18next";`);
  return lines.join("\n");
}

function getExportedFnName(src) {
  const m = src.match(/export default function\s+(\w+)\s*\(/);
  return m ? m[1] : null;
}

function insertHookAfterBrace(src, hookBlock) {
  const re = /export default function\s+\w+\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/;
  const match = src.match(re);
  if (!match) return null;
  const insertPos = match.index + match[0].length;
  return src.slice(0, insertPos) + "\n" + hookBlock + "\n" + src.slice(insertPos);
}

function processFile(file, pageTitles) {
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("useDocumentTitle")) return { changed: false, src };

  const fnName = getExportedFnName(src);
  if (!fnName) {
    console.warn("SKIP (no export default function):", path.relative(process.cwd(), file));
    return { changed: false, src };
  }

  const key = toKey(fnName);
  const fallback = toTitle(fnName);
  const esc = escapeForJsString(fallback);

  if (!pageTitles[key]) {
    pageTitles[key] = fallback;
  }

  let hookBlock;
  if (canReuseCommonT(src)) {
    hookBlock = `  useDocumentTitle(t("pageTitles.${key}", "${esc}"));`;
  } else {
    hookBlock = `  const { t: tDocTitle } = useTranslation("common");\n  useDocumentTitle(tDocTitle("pageTitles.${key}", "${esc}"));`;
    if (!/useTranslation\s*\(/.test(src)) {
      src = ensureUseTranslationImport(src);
    } else if (!/from\s+["']react-i18next["']/.test(src)) {
      src = ensureUseTranslationImport(src);
    }
  }

  src = ensureHooksImport(src);
  const next = insertHookAfterBrace(src, hookBlock);
  if (!next) {
    console.warn("SKIP (brace insert failed):", path.relative(process.cwd(), file));
    return { changed: false, src };
  }

  return { changed: true, src: next };
}

function sortPageTitles(obj) {
  const sorted = {};
  for (const k of Object.keys(obj).sort((a, b) => a.localeCompare(b))) {
    sorted[k] = obj[k];
  }
  return sorted;
}

const files = walk(ROOT).sort((a, b) => a.localeCompare(b));
const common = JSON.parse(fs.readFileSync(COMMON, "utf8"));
const pageTitles = { ...common.pageTitles };
let fileCount = 0;

for (const file of files) {
  const { changed, src } = processFile(file, pageTitles);
  if (changed) {
    fs.writeFileSync(file, src, "utf8");
    fileCount++;
    console.log("wired:", path.relative(process.cwd(), file));
  }
}

common.pageTitles = sortPageTitles(pageTitles);
fs.writeFileSync(COMMON, JSON.stringify(common, null, 2) + "\n", "utf8");

console.log("\nDone. Files updated:", fileCount);
console.log("Updated:", path.relative(process.cwd(), COMMON));
