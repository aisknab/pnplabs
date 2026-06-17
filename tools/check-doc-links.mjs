import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

// Purpose: catch broken local links in reviewer Markdown and static HTML pages.
// Inputs: repository Markdown and HTML files.
// Outputs: a success line or missing-link diagnostics.
// Invariants enforced: local href/src and Markdown link targets exist on disk.
// Assumptions not checked: external URLs, anchors, and semantic accuracy.
// Failure modes: missing local target or malformed percent-encoding.
const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules"]);
const MARKDOWN_LINK = /\[[^\]]+\]\(([^)]+)\)/g;
const HTML_LINK = /\b(?:href|src)="([^"]+)"/g;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const info = statSync(fullPath);
    if (info.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.(md|html)$/.test(entry) || entry === "README.md") {
      files.push(fullPath);
    }
  }
  return files;
}

function isExternal(target) {
  return (
    target.startsWith("#") ||
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("tel:") ||
    target.startsWith("data:")
  );
}

function normalizeTarget(target) {
  const withoutAnchor = target.split("#")[0];
  const withoutQuery = withoutAnchor.split("?")[0];
  return decodeURIComponent(withoutQuery);
}

const failures = [];

for (const file of walk(ROOT)) {
  const relFile = path.relative(ROOT, file);
  const text = readFileSync(file, "utf8");
  const regexes = relFile.endsWith(".html") ? [HTML_LINK] : [MARKDOWN_LINK];

  for (const regex of regexes) {
    regex.lastIndex = 0;
    for (const match of text.matchAll(regex)) {
      const rawTarget = match[1].trim();
      if (!rawTarget || isExternal(rawTarget)) continue;
      const target = normalizeTarget(rawTarget);
      if (!target) continue;

      const resolved = target.startsWith("/")
        ? path.join(ROOT, target)
        : path.resolve(path.dirname(file), target);

      if (!existsSync(resolved)) {
        failures.push(`${relFile}: missing link target ${rawTarget}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("documentation links resolved");
