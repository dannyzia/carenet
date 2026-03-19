/**
 * Vite Plugin: i18n Key Sync
 * ===========================
 * Automatically ensures every target locale has all keys from en/*.json.
 * Runs once at dev server startup and before production builds.
 * Missing locale directories and files are created with English fallback values.
 *
 * This eliminates the need to manually run `npm run i18n:sync` after adding
 * new i18n keys — the dev server picks them up instantly.
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import type { Plugin } from "vite";

const TARGET_LANGUAGES = [
  "bn", "hi", "ur", "ar", "es", "fr", "de", "pt", "ja", "ko",
  "zh", "zh-TW", "th", "vi", "id", "ms", "ta", "te", "mr", "gu",
  "kn", "ml", "pa", "ne", "si", "my", "ru", "tr", "it", "nl",
  "pl", "sv", "da", "no", "fi", "el", "he", "fa", "sw", "am", "zu",
];

/** Deep merge: source fills in missing keys in target */
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (!(key in result)) {
      result[key] = value;
    } else if (
      typeof value === "object" && value !== null && !Array.isArray(value) &&
      typeof result[key] === "object" && result[key] !== null && !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value as Record<string, unknown>);
    }
  }
  return result;
}

/** Reorder keys to match source ordering */
function reorderToMatch(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(source)) {
    if (key in target) {
      const sv = source[key];
      const tv = target[key];
      if (
        typeof sv === "object" && sv !== null && !Array.isArray(sv) &&
        typeof tv === "object" && tv !== null && !Array.isArray(tv)
      ) {
        result[key] = reorderToMatch(tv as Record<string, unknown>, sv as Record<string, unknown>);
      } else {
        result[key] = tv;
      }
    }
  }
  for (const key of Object.keys(target)) {
    if (!(key in result)) {
      result[key] = target[key];
    }
  }
  return result;
}

function hasMissingKeys(target: Record<string, unknown>, source: Record<string, unknown>): boolean {
  for (const [key, value] of Object.entries(source)) {
    if (!(key in target)) return true;
    if (
      typeof value === "object" && value !== null && !Array.isArray(value) &&
      typeof target[key] === "object" && target[key] !== null
    ) {
      if (hasMissingKeys(target[key] as Record<string, unknown>, value as Record<string, unknown>)) return true;
    }
  }
  return false;
}

async function syncLocales(localesDir: string): Promise<number> {
  const enDir = join(localesDir, "en");
  if (!existsSync(enDir)) return 0;

  const enFiles = (await readdir(enDir)).filter((f) => f.endsWith(".json"));
  const enData: Record<string, Record<string, unknown>> = {};

  for (const file of enFiles) {
    const ns = file.replace(".json", "");
    enData[ns] = JSON.parse(await readFile(join(enDir, file), "utf-8"));
  }

  let filesWritten = 0;

  for (const lang of TARGET_LANGUAGES) {
    const langDir = join(localesDir, lang);
    if (!existsSync(langDir)) {
      await mkdir(langDir, { recursive: true });
    }

    for (const [ns, enContent] of Object.entries(enData)) {
      const filePath = join(langDir, `${ns}.json`);
      let existing: Record<string, unknown> = {};

      if (existsSync(filePath)) {
        try {
          existing = JSON.parse(await readFile(filePath, "utf-8"));
        } catch {
          existing = {};
        }

        // Skip if no missing keys
        if (!hasMissingKeys(existing, enContent)) continue;
      }

      const merged = deepMerge(existing, enContent);
      const ordered = reorderToMatch(merged, enContent);
      await writeFile(filePath, JSON.stringify(ordered, null, 2) + "\n", "utf-8");
      filesWritten++;
    }
  }

  return filesWritten;
}

export default function i18nSyncPlugin(): Plugin {
  let localesDir = "";

  return {
    name: "vite-i18n-sync",
    configResolved(config) {
      localesDir = join(config.root, "src", "locales");
    },
    async buildStart() {
      try {
        const count = await syncLocales(localesDir);
        if (count > 0) {
          console.log(`\x1b[36m[i18n-sync]\x1b[0m Synced ${count} locale file${count !== 1 ? "s" : ""} with English fallback keys`);
        }
      } catch (err) {
        console.warn(`\x1b[33m[i18n-sync]\x1b[0m Warning: locale sync failed:`, (err as Error).message);
      }
    },
  };
}
