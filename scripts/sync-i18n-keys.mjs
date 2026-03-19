#!/usr/bin/env node
/**
 * CareNet i18n Key Sync Script
 * =============================
 * Ensures every locale directory has all keys present in en/common.json.
 * Missing keys are filled with the English value as a fallback placeholder.
 *
 * Usage:
 *   node scripts/sync-i18n-keys.mjs                    # Sync all locales
 *   node scripts/sync-i18n-keys.mjs --dry               # Preview without writing
 *   node scripts/sync-i18n-keys.mjs --lang=hi,ar        # Sync specific locales only
 *   node scripts/sync-i18n-keys.mjs --namespace=common   # Sync specific namespace only
 *
 * Works hand-in-hand with translate.mjs: this script ensures structural parity,
 * translate.mjs handles actual translation of the English fallback values.
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

const LOCALES_DIR = join(process.cwd(), "src", "locales");
const SOURCE_LANG = "en";

// All target languages from translate.mjs
const ALL_TARGETS = [
  "bn", "hi", "ur", "ar", "es", "fr", "de", "pt", "ja", "ko",
  "zh", "zh-TW", "th", "vi", "id", "ms", "ta", "te", "mr", "gu",
  "kn", "ml", "pa", "ne", "si", "my", "ru", "tr", "it", "nl",
  "pl", "sv", "da", "no", "fi", "el", "he", "fa", "sw", "am", "zu",
];

// ─── Helpers ─────────────────────────────────────────────────────

/** Deep merge: source keys override target only where target is missing */
function deepMerge(target, source) {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (!(key in result)) {
      result[key] = value;
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value);
    }
    // else: target already has the key, keep it
  }
  return result;
}

/** Count leaf keys in a nested object */
function countKeys(obj) {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      count += countKeys(value);
    } else {
      count++;
    }
  }
  return count;
}

/** Find missing keys by comparing target against source */
function findMissingKeys(target, source, prefix = "") {
  const missing = [];
  for (const [key, value] of Object.entries(source)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in target)) {
      missing.push(fullKey);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      if (typeof target[key] === "object" && target[key] !== null) {
        missing.push(...findMissingKeys(target[key], value, fullKey));
      } else {
        missing.push(fullKey);
      }
    }
  }
  return missing;
}

/** Ensure key ordering matches the source (English) file */
function reorderToMatch(target, source) {
  const result = {};
  // First add all keys in source order
  for (const key of Object.keys(source)) {
    if (key in target) {
      const sv = source[key];
      const tv = target[key];
      if (
        typeof sv === "object" && sv !== null && !Array.isArray(sv) &&
        typeof tv === "object" && tv !== null && !Array.isArray(tv)
      ) {
        result[key] = reorderToMatch(tv, sv);
      } else {
        result[key] = tv;
      }
    }
  }
  // Then add any extra keys that target has but source doesn't
  for (const key of Object.keys(target)) {
    if (!(key in result)) {
      result[key] = target[key];
    }
  }
  return result;
}

// ─── CLI parsing ─────────────────────────────────────────────────

const args = process.argv.slice(2);
const isDry = args.includes("--dry");
const langArg = args.find((a) => a.startsWith("--lang="));
const nsArg = args.find((a) => a.startsWith("--namespace="));

const targetLangs = langArg
  ? langArg.replace("--lang=", "").split(",")
  : ALL_TARGETS;

const namespaceFilter = nsArg ? nsArg.replace("--namespace=", "") : null;

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  // 1. Read all English namespace files
  const enDir = join(LOCALES_DIR, SOURCE_LANG);
  const enFiles = (await readdir(enDir)).filter((f) => f.endsWith(".json"));

  const enData = {};
  for (const file of enFiles) {
    const ns = file.replace(".json", "");
    if (namespaceFilter && ns !== namespaceFilter) continue;
    enData[ns] = JSON.parse(await readFile(join(enDir, file), "utf-8"));
  }

  const namespaces = Object.keys(enData);
  console.log(`\n📋 Source: en/ (${namespaces.length} namespace${namespaces.length > 1 ? "s" : ""}: ${namespaces.join(", ")})`);
  console.log(`🎯 Targets: ${targetLangs.length} language${targetLangs.length > 1 ? "s" : ""}`);
  if (isDry) console.log("🔍 DRY RUN — no files will be written\n");
  else console.log("");

  let totalAdded = 0;
  let totalCreated = 0;

  for (const lang of targetLangs) {
    const langDir = join(LOCALES_DIR, lang);
    const isNewLang = !existsSync(langDir);

    if (isNewLang && !isDry) {
      await mkdir(langDir, { recursive: true });
    }

    for (const ns of namespaces) {
      const filePath = join(langDir, `${ns}.json`);
      let existing = {};

      if (existsSync(filePath)) {
        try {
          existing = JSON.parse(await readFile(filePath, "utf-8"));
        } catch {
          console.log(`  ⚠️  ${lang}/${ns}.json — parse error, will overwrite`);
          existing = {};
        }
      }

      const missing = findMissingKeys(existing, enData[ns]);

      if (missing.length === 0) continue;

      const merged = deepMerge(existing, enData[ns]);
      const ordered = reorderToMatch(merged, enData[ns]);

      if (isNewLang) {
        totalCreated++;
        console.log(`  ✨ ${lang}/${ns}.json — CREATED (${countKeys(ordered)} keys)`);
      } else {
        totalAdded += missing.length;
        console.log(`  🔧 ${lang}/${ns}.json — +${missing.length} key${missing.length > 1 ? "s" : ""}`);
        if (missing.length <= 10) {
          for (const k of missing) {
            console.log(`      + ${k}`);
          }
        } else {
          for (const k of missing.slice(0, 5)) {
            console.log(`      + ${k}`);
          }
          console.log(`      ... and ${missing.length - 5} more`);
        }
      }

      if (!isDry) {
        await writeFile(filePath, JSON.stringify(ordered, null, 2) + "\n", "utf-8");
      }
    }
  }

  console.log(`\n✅ Done! ${totalCreated} file${totalCreated !== 1 ? "s" : ""} created, ${totalAdded} key${totalAdded !== 1 ? "s" : ""} added.`);
  if (isDry) console.log("   (Dry run — nothing was written. Remove --dry to apply.)");
  if (totalAdded > 0 || totalCreated > 0) {
    console.log("   💡 Run `npm run translate` to translate the English fallback values.");
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
