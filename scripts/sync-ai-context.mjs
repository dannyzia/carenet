import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPack } from "../../Rules&Skills/scripts/render-pack.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const targetDir = path.resolve(scriptDir, "..");
const packDir = path.resolve(scriptDir, "..", "..", "Rules&Skills", "packs", "carenet-2");

const result = await renderPack({ packDir, targetDir });

console.log(
  `CareNet 2 sync complete: ${result.cursorRuleCount} Cursor rules, ${result.combinedRuleCount} combined rules, ${result.skillFileCount} skill files.`,
);
