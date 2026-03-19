/**
 * generate-bd-medicines.mjs
 * ─────────────────────────
 * One-time script: reads the Kaggle BD medicine CSV and outputs
 * a clean JSON file for use in the MedicineSearchCombobox.
 *
 * Usage (from CareNet 2 root):
 *   node scripts/generate-bd-medicines.mjs
 *
 * Output: src/frontend/data/bd-medicines.json
 */

import fs from "fs";
import path from "path";

// ── CONFIG ──────────────────────────────────────────────────────────────────
const SOURCE_CSV  = "C:\\Users\\callz\\OneDrive\\Documents\\My Projects\\SynologyDrive\\Websites\\New folder\\archive\\medicine.csv";
const OUTPUT_JSON = "C:\\Users\\callz\\OneDrive\\Documents\\My Projects\\SynologyDrive\\Websites\\New folder\\CareNet 2\\src\\frontend\\data\\bd-medicines.json";
// ────────────────────────────────────────────────────────────────────────────

function parseCSV(content) {
  const lines = content.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted fields (some fields contain commas inside quotes)
    const fields = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = fields[idx] || "";
    });
    results.push(row);
  }
  return results;
}

// Read and parse
console.log("Reading CSV from:", SOURCE_CSV);
const raw = fs.readFileSync(SOURCE_CSV, "utf-8");
const rows = parseCSV(raw);
console.log(`  ${rows.length} rows read`);

// Map to the shape the combobox needs
const medicines = rows
  .filter((r) => r["brand name"] && r["generic"])
  .map((r) => ({
    brand_name:   r["brand name"].trim(),
    generic_name: r["generic"].trim(),
    strength:     r["strength"]?.trim() || "",
    dosage_form:  r["dosage form"]?.trim() || "",
  }))
  // Remove duplicates by brand_name + strength combo
  .filter(
    (item, idx, arr) =>
      arr.findIndex(
        (x) => x.brand_name === item.brand_name && x.strength === item.strength
      ) === idx
  )
  // Sort alphabetically by brand name
  .sort((a, b) => a.brand_name.localeCompare(b.brand_name));

console.log(`  ${medicines.length} unique medicines after dedup`);

// Ensure output directory exists
const outDir = path.dirname(OUTPUT_JSON);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`  Created directory: ${outDir}`);
}

// Write output
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(medicines, null, 2), "utf-8");
const sizeKB = Math.round(fs.statSync(OUTPUT_JSON).size / 1024);
console.log(`\nDone! Written to: ${OUTPUT_JSON}`);
console.log(`File size: ${sizeKB} KB`);
console.log(`Sample entry:`, medicines[0]);
