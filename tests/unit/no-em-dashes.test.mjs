import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  PUBLIC_DIRECTORY_PATHS,
  PUBLIC_EXACT_PATHS,
  PUBLIC_ROOT_PATHS
} from "../../public-surface.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const canonicalByteExactMirrors = new Set([
  "downloads/canonical-proof-report.pdf",
  "downloads/canonical-proof-report.tex",
  "downloads/canonical_proof_report.pdf",
  "downloads/canonical_proof_report.tex"
]);
const textExtensions = new Set([
  ".css", ".html", ".js", ".json", ".md", ".mjs", ".svg", ".tex", ".txt", ".xml"
]);

async function collectPublicTextPaths() {
  const paths = [...PUBLIC_ROOT_PATHS, ...PUBLIC_EXACT_PATHS];
  async function walk(relativeDirectory) {
    const entries = await readdir(path.join(repositoryRoot, relativeDirectory), { withFileTypes: true });
    for (const entry of entries) {
      const relativePath = path.posix.join(relativeDirectory, entry.name);
      if (entry.isDirectory()) await walk(relativePath);
      else if (entry.isFile() && (textExtensions.has(path.extname(entry.name)) || path.extname(entry.name) === "")) {
        paths.push(relativePath);
      }
    }
  }
  for (const directory of PUBLIC_DIRECTORY_PATHS) await walk(directory);
  return [...new Set(paths)].filter((relativePath) => !canonicalByteExactMirrors.has(relativePath)).sort();
}

test("the public PNPLabs text surface contains no em dash characters or entities", async () => {
  const forbiddenEntity = /&(?:mdash|#8212|#x2014);/iu;
  for (const relativePath of await collectPublicTextPaths()) {
    const text = await readFile(path.join(repositoryRoot, relativePath), "utf8");
    assert.equal(text.includes("\u2014"), false, `${relativePath}: raw em dash`);
    assert.doesNotMatch(text, forbiddenEntity, `${relativePath}: encoded em dash`);
  }
});
