#!/usr/bin/env node
/**
 * esbuild JSX treats `}` inside `<style>{\`...\`}` as closing the outer `{` even when inside backticks.
 * Replace with dangerouslySetInnerHTML so production build succeeds.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve("src/frontend/pages");

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith("Page.tsx")) acc.push(p);
  }
  return acc;
}

const re = /<style>\{\`([\s\S]*?)\`\}<\/style>/g;

let total = 0;
for (const file of walk(ROOT)) {
  let src = fs.readFileSync(file, "utf8");
  if (!re.test(src)) {
    re.lastIndex = 0;
    continue;
  }
  re.lastIndex = 0;
  const next = src.replace(re, (_, css) => {
    const html = JSON.stringify(css);
    return `<style dangerouslySetInnerHTML={{ __html: ${html} }} />`;
  });
  if (next !== src) {
    fs.writeFileSync(file, next, "utf8");
    total++;
    console.log("fixed:", path.relative(process.cwd(), file));
  }
}
console.log("files updated:", total);
