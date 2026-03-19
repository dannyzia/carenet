#!/usr/bin/env node
/**
 * CareNet Translation Coverage Checker
 * =====================================
 * CI-ready script that checks all translation files for missing or extra keys.
 * Exits with code 1 if any language has missing keys — perfect for PR checks.
 *
 * Usage:
 *   node scripts/check-translations.mjs               # Check all languages
 *   node scripts/check-translations.mjs --lang=bn      # Check Bengali only
 *   node scripts/check-translations.mjs --strict       # Also flag extra keys not in English
 *   node scripts/check-translations.mjs --json         # Output JSON for programmatic use
 *   node scripts/check-translations.mjs --fix-empty    # Replace empty strings with English fallback
 *
 * Exit codes:
 *   0 — All translations complete
 *   1 — Missing translations found (CI fail)
 *
 * Add to CI (GitHub Actions example):
 *   - name: Check translations
 *     run: node scripts/check-translations.mjs
 *
 * Add to package.json:
 *   "scripts": {
 *     "translate:check": "node scripts/check-translations.mjs"
 *   }
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { existsSync } from "node:fs";

const LOCALES_DIR = join(process.cwd(), "src", "locales");
const SOURCE_LANG = "en";

// ─── Helpers ─────────────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  magenta: "\x1b[35m",
};

function flattenJson(obj, prefix = "") {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenJson(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

function unflattenJson(flat) {
  const result = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

// ─── Parse CLI args ──────────────────────────────────────────────

const args = process.argv.slice(2);
const flagStrict = args.includes("--strict");
const flagJson = args.includes("--json");
const flagFixEmpty = args.includes("--fix-empty");
const langArg = args.find((a) => a.startsWith("--lang="));
const requestedLangs = langArg
  ? langArg.replace("--lang=", "").split(",").map((l) => l.trim())
  : null;

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  if (!flagJson) {
    console.log(`\n${C.bold}${C.cyan}CareNet Translation Coverage Checker${C.reset}`);
    console.log(`${C.dim}Checks all locale files against English source${C.reset}\n`);
  }

  // 1. Read English source files
  const enDir = join(LOCALES_DIR, SOURCE_LANG);
  const files = (await readdir(enDir)).filter((f) => f.endsWith(".json"));
  const enKeys = {}; // { "common": { "app.name": "CareNet", ... }, ... }

  for (const file of files) {
    const ns = basename(file, ".json");
    const content = JSON.parse(await readFile(join(enDir, file), "utf-8"));
    enKeys[ns] = flattenJson(content);
  }

  const totalEnKeys = Object.values(enKeys).reduce((sum, ns) => sum + Object.keys(ns).length, 0);
  if (!flagJson) {
    console.log(`${C.blue}i${C.reset} English source: ${files.length} files, ${totalEnKeys} total keys\n`);
  }

  // 2. Find all language directories
  const allDirs = await readdir(LOCALES_DIR);
  let langDirs = allDirs.filter(
    (d) => d !== SOURCE_LANG && existsSync(join(LOCALES_DIR, d))
  );

  if (requestedLangs) {
    langDirs = langDirs.filter((d) => requestedLangs.includes(d));
  }

  if (langDirs.length === 0) {
    if (!flagJson) console.log(`${C.yellow}!${C.reset} No translation directories found (besides English).\n`);
    process.exit(0);
  }

  // 3. Check each language
  const report = {
    timestamp: new Date().toISOString(),
    sourceKeys: totalEnKeys,
    languages: {},
  };

  let hasErrors = false;

  for (const lang of langDirs.sort()) {
    const langDir = join(LOCALES_DIR, lang);
    const langReport = {
      totalKeys: 0,
      translatedKeys: 0,
      missingKeys: [],
      emptyKeys: [],
      extraKeys: [],
      coverage: 0,
    };

    for (const file of files) {
      const ns = basename(file, ".json");
      const enFlat = enKeys[ns];
      const targetPath = join(langDir, file);

      if (!existsSync(targetPath)) {
        // Entire file missing
        const missingFromFile = Object.keys(enFlat).map((k) => `${ns}.${k}`);
        langReport.missingKeys.push(...missingFromFile);
        langReport.totalKeys += Object.keys(enFlat).length;
        continue;
      }

      let targetFlat = {};
      try {
        const content = JSON.parse(await readFile(targetPath, "utf-8"));
        targetFlat = flattenJson(content);
      } catch (err) {
        if (!flagJson) console.log(`  ${C.red}x${C.reset} ${lang}/${file} — invalid JSON: ${err.message}`);
        langReport.missingKeys.push(...Object.keys(enFlat).map((k) => `${ns}.${k}`));
        langReport.totalKeys += Object.keys(enFlat).length;
        continue;
      }

      // Check for missing keys
      for (const key of Object.keys(enFlat)) {
        langReport.totalKeys++;
        if (!(key in targetFlat)) {
          langReport.missingKeys.push(`${ns}.${key}`);
        } else if (
          typeof targetFlat[key] === "string" &&
          targetFlat[key].trim() === ""
        ) {
          langReport.emptyKeys.push(`${ns}.${key}`);
          langReport.translatedKeys++; // key exists but empty
        } else {
          langReport.translatedKeys++;
        }
      }

      // Check for extra keys (in target but not in English)
      if (flagStrict) {
        for (const key of Object.keys(targetFlat)) {
          if (!(key in enFlat)) {
            langReport.extraKeys.push(`${ns}.${key}`);
          }
        }
      }

      // Fix empty strings if requested
      if (flagFixEmpty && langReport.emptyKeys.length > 0) {
        let modified = false;
        for (const emptyKey of langReport.emptyKeys) {
          const [emptyNs, ...rest] = emptyKey.split(".");
          const flatKey = rest.join(".");
          if (emptyNs === ns && flatKey in targetFlat && flatKey in enFlat) {
            targetFlat[flatKey] = enFlat[flatKey]; // Use English as fallback
            modified = true;
          }
        }
        if (modified) {
          const output = unflattenJson(targetFlat);
          await writeFile(targetPath, JSON.stringify(output, null, 2) + "\n", "utf-8");
          if (!flagJson) console.log(`  ${C.green}+${C.reset} Fixed empty strings in ${lang}/${file}`);
        }
      }
    }

    langReport.coverage = langReport.totalKeys > 0
      ? Math.round((langReport.translatedKeys / langReport.totalKeys) * 100)
      : 0;

    report.languages[lang] = langReport;

    // Print results
    if (!flagJson) {
      const icon = langReport.missingKeys.length === 0 ? `${C.green}✓` : `${C.red}✗`;
      const coverageColor =
        langReport.coverage === 100 ? C.green :
        langReport.coverage >= 80 ? C.yellow : C.red;

      console.log(
        `${icon}${C.reset} ${C.bold}${lang}${C.reset}  ${coverageColor}${langReport.coverage}%${C.reset} ` +
        `(${langReport.translatedKeys}/${langReport.totalKeys} keys)`
      );

      if (langReport.missingKeys.length > 0) {
        hasErrors = true;
        const show = langReport.missingKeys.slice(0, 10);
        for (const key of show) {
          console.log(`    ${C.red}missing:${C.reset} ${C.dim}${key}${C.reset}`);
        }
        if (langReport.missingKeys.length > 10) {
          console.log(`    ${C.dim}... and ${langReport.missingKeys.length - 10} more${C.reset}`);
        }
      }

      if (langReport.emptyKeys.length > 0) {
        const show = langReport.emptyKeys.slice(0, 5);
        for (const key of show) {
          console.log(`    ${C.yellow}empty:${C.reset}   ${C.dim}${key}${C.reset}`);
        }
        if (langReport.emptyKeys.length > 5) {
          console.log(`    ${C.dim}... and ${langReport.emptyKeys.length - 5} more${C.reset}`);
        }
      }

      if (flagStrict && langReport.extraKeys.length > 0) {
        const show = langReport.extraKeys.slice(0, 5);
        for (const key of show) {
          console.log(`    ${C.cyan}extra:${C.reset}   ${C.dim}${key}${C.reset}`);
        }
        if (langReport.extraKeys.length > 5) {
          console.log(`    ${C.dim}... and ${langReport.extraKeys.length - 5} more${C.reset}`);
        }
      }

      console.log();
    }
  }

  // Output JSON report
  if (flagJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    // Summary
    const totalLangs = Object.keys(report.languages).length;
    const completeLangs = Object.values(report.languages).filter(
      (l) => l.missingKeys.length === 0
    ).length;
    const totalMissing = Object.values(report.languages).reduce(
      (sum, l) => sum + l.missingKeys.length,
      0
    );

    console.log(`${C.bold}Summary${C.reset}`);
    console.log(`  Languages: ${completeLangs}/${totalLangs} complete`);
    console.log(`  Missing keys: ${totalMissing}`);

    if (hasErrors) {
      console.log(`\n${C.red}${C.bold}FAIL${C.reset} — ${totalMissing} missing translation keys found.`);
      console.log(`${C.dim}Run: pnpm translate --lang=${Object.entries(report.languages)
        .filter(([, l]) => l.missingKeys.length > 0)
        .map(([code]) => code)
        .join(",")}${C.reset}`);
      console.log();
    } else {
      console.log(`\n${C.green}${C.bold}PASS${C.reset} — All translations complete!`);
      console.log();
    }
  }

  process.exit(hasErrors ? 1 : 0);
}

main().catch((err) => {
  console.error(`${C.red}Fatal error:${C.reset}`, err.message);
  process.exit(1);
});
