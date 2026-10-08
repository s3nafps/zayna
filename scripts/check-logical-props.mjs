#!/usr/bin/env node
// Fails when source uses left/right-specific classes or CSS. Brief §9 (RTL QA):
// use logical properties (ms-, me-, ps-, pe-, start-, end-, text-start, border-s, rounded-s) only.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../src/", import.meta.url));
const SKIP_DIRS = new Set(["generated"]);
const SOURCE_EXT = /\.(ts|tsx|js|mjs|css)$/;

// Tailwind utilities that hard-code a side. Matched after stripping variant prefixes (md:, hover:, ...).
const FORBIDDEN_CLASS = [
  /^-?m[lr]-/,
  /^-?p[lr]-/,
  /^-?(left|right)-/,
  /^text-(left|right)$/,
  /^float-(left|right)$/,
  /^rounded-(l|r|tl|tr|bl|br)(-|$)/,
  /^border-[lr](-|$)/,
  /^scroll-m[lr]-/,
  /^scroll-p[lr]-/,
];

// Plain CSS properties that hard-code a side.
const FORBIDDEN_CSS = [/(^|[\s;{])(left|right)\s*:/, /text-align\s*:\s*(left|right)\b/];

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (SOURCE_EXT.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const violations = [];
for (const file of walk(ROOT)) {
  const isCss = file.endsWith(".css");
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (isCss) {
      if (FORBIDDEN_CSS.some((pattern) => pattern.test(line))) {
        violations.push({ file, line: index + 1, token: line.trim() });
      }
      return;
    }
    for (const raw of line.split(/[\s"'`{}()<>=,;]+/)) {
      if (!raw) continue;
      const utility = raw.split(":").pop() ?? raw;
      if (FORBIDDEN_CLASS.some((pattern) => pattern.test(utility))) {
        violations.push({ file, line: index + 1, token: raw });
      }
    }
  });
}

if (violations.length > 0) {
  for (const v of violations) {
    console.error(
      `${relative(process.cwd(), v.file)}:${v.line}: "${v.token}" is direction-specific; use a logical property`,
    );
  }
  console.error(`\n${violations.length} direction-specific style(s) found.`);
  process.exit(1);
}
console.log("logical properties: ok");
