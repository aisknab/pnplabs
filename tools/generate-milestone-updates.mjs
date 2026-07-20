// Purpose: validate one update for every formal milestone earned after feed tracking began.
// Inputs: content/milestone-updates.json and the current formal publication payloads.
// Outputs: deterministic updates.html and Atom 1.0 updates.xml bytes.
// Invariants enforced: exact schemas, complete milestone coverage, source binding, and escaped text.
// Assumptions not checked: the executive clarity of the reviewed plain-language prose.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = "content/milestone-updates.json";
const STATUS_PATH = "public/pnp-status.json";
const INDEX_PATH = "public/pnp-index.json";
const HTML_PATH = "updates.html";
const FEED_PATH = "updates.xml";
const BASE_URL = "https://pnplabs.com.au";

class MilestoneUpdatesError extends Error {
  constructor(message) {
    super(message);
    this.name = "MilestoneUpdatesError";
  }
}

function fail(message) {
  throw new MilestoneUpdatesError(message);
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label}: expected an object`);
}

function assertExactKeys(value, keys, label) {
  assertObject(value, label);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label}: expected exact keys ${expected.join(", ")}; found ${actual.join(", ")}`);
  }
}

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() !== value || value.length === 0) {
    fail(`${label}: expected a non-empty trimmed string`);
  }
}

function assertPlainLanguage(value, label) {
  assertNonEmptyString(value, label);
  if (/[<>`]/u.test(value)) fail(`${label}: markup and code delimiters are not allowed`);
  if (/PNP\.|encodedFormula|FormulaWidth|FormulaTokensPerClause|cursorWord|workRunExact|Builder[A-Z]|\bSep\b/u.test(value)) {
    fail(`${label}: internal technical notation belongs only in the technical dropdown`);
  }
}

function assertIdentifier(value, label) {
  if (typeof value !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value)) {
    fail(`${label}: expected a lowercase hyphenated identifier`);
  }
}

function assertSha(value, label) {
  if (typeof value !== "string" || !/^[0-9a-f]{40}$/u.test(value)) fail(`${label}: expected lowercase 40-hex`);
}

function assertSafeToken(value, label) {
  if (typeof value !== "string" || !/^[A-Za-z0-9._-]+$/u.test(value)) fail(`${label}: expected a safe token`);
}

function assertTimestamp(value, label) {
  assertNonEmptyString(value, label);
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().replace(".000Z", "Z") !== value) {
    fail(`${label}: expected a canonical RFC3339 UTC timestamp with whole seconds`);
  }
}

function escaped(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function milestoneIsEarned(milestone) {
  return milestone.classification !== "not-formalized";
}

function validateUpdatesModel(data, status, index) {
  assertExactKeys(data, ["kind", "version", "trackingBaseline", "entries"], "updates data");
  if (data.kind !== "PNPLabsMilestoneUpdates0" || data.version !== 0) {
    fail("updates data: unsupported kind or version");
  }
  assertExactKeys(data.trackingBaseline, ["earnedCount", "milestoneIds"], "tracking baseline");
  if (!Number.isSafeInteger(data.trackingBaseline.earnedCount) || data.trackingBaseline.earnedCount < 0) {
    fail("tracking baseline: earnedCount must be a non-negative integer");
  }
  if (!Array.isArray(data.trackingBaseline.milestoneIds)
    || data.trackingBaseline.milestoneIds.length !== data.trackingBaseline.earnedCount) {
    fail("tracking baseline: milestoneIds must contain exactly earnedCount entries");
  }
  if (!Array.isArray(status.formalPublicationMilestones)) {
    fail("formal status: formalPublicationMilestones is missing");
  }
  if (!Array.isArray(data.entries) || data.entries.length === 0) fail("updates data: expected at least one entry");

  const milestones = new Map(status.formalPublicationMilestones.map((milestone) => [milestone.id, milestone]));
  if (milestones.size !== status.formalPublicationMilestones.length) fail("formal status: duplicate milestone IDs");
  const earnedIds = new Set(status.formalPublicationMilestones.filter(milestoneIsEarned).map((milestone) => milestone.id));
  const baselineIds = new Set();
  for (const [position, id] of data.trackingBaseline.milestoneIds.entries()) {
    assertIdentifier(id, `tracking baseline milestone ${position}`);
    if (baselineIds.has(id)) fail(`tracking baseline: duplicate milestone ${id}`);
    if (!earnedIds.has(id)) fail(`tracking baseline: ${id} is not currently earned`);
    baselineIds.add(id);
  }

  const entryIds = new Set();
  const entryMilestoneIds = new Set();
  const timestamps = new Set();
  let previousTimestamp = null;
  const validatedEntries = data.entries.map((entry, position) => {
    const label = `entry ${position}`;
    assertExactKeys(entry, ["id", "milestoneId", "publishedAt", "title", "plainLanguage", "source"], label);
    assertIdentifier(entry.id, `${label} id`);
    assertIdentifier(entry.milestoneId, `${label} milestoneId`);
    assertTimestamp(entry.publishedAt, `${label} publishedAt`);
    assertPlainLanguage(entry.title, `${label} title`);
    if (!Array.isArray(entry.plainLanguage) || entry.plainLanguage.length !== 2) {
      fail(`${label}: plainLanguage must contain exactly two paragraphs`);
    }
    entry.plainLanguage.forEach((paragraph, paragraphIndex) => {
      assertPlainLanguage(paragraph, `${label} plainLanguage ${paragraphIndex}`);
    });
    assertExactKeys(
      entry.source,
      ["commit", "tree", "statusCoordinate", "publicationCoordinate", "sitePublicationCommit", "deploymentId"],
      `${label} source`
    );
    assertSha(entry.source.commit, `${label} source commit`);
    assertSha(entry.source.tree, `${label} source tree`);
    assertSafeToken(entry.source.statusCoordinate, `${label} source statusCoordinate`);
    assertSafeToken(entry.source.publicationCoordinate, `${label} source publicationCoordinate`);
    assertSha(entry.source.sitePublicationCommit, `${label} source sitePublicationCommit`);
    assertSafeToken(entry.source.deploymentId, `${label} source deploymentId`);

    if (entryIds.has(entry.id)) fail(`${label}: duplicate entry ID ${entry.id}`);
    if (entryMilestoneIds.has(entry.milestoneId)) fail(`${label}: duplicate milestone update ${entry.milestoneId}`);
    if (timestamps.has(entry.publishedAt)) fail(`${label}: duplicate publication timestamp ${entry.publishedAt}`);
    if (baselineIds.has(entry.milestoneId)) fail(`${label}: baseline milestone cannot be republished as a tracked update`);
    if (previousTimestamp !== null && entry.publishedAt >= previousTimestamp) {
      fail(`${label}: entries must be strictly newest first`);
    }
    entryIds.add(entry.id);
    entryMilestoneIds.add(entry.milestoneId);
    timestamps.add(entry.publishedAt);
    previousTimestamp = entry.publishedAt;

    const milestone = milestones.get(entry.milestoneId);
    if (!milestone || !milestoneIsEarned(milestone)) fail(`${label}: milestone is not currently earned`);
    assertNonEmptyString(milestone.title, `${label} milestone title`);
    assertNonEmptyString(milestone.scope, `${label} milestone scope`);
    assertNonEmptyString(milestone.nonClaim, `${label} milestone nonClaim`);
    if (!Array.isArray(milestone.requiredTheorems) || milestone.requiredTheorems.length === 0) {
      fail(`${label}: milestone theorem pins are missing`);
    }
    return { ...entry, milestone };
  });

  const covered = new Set([...baselineIds, ...entryMilestoneIds]);
  const missing = [...earnedIds].filter((id) => !covered.has(id)).sort();
  const unexpected = [...covered].filter((id) => !earnedIds.has(id)).sort();
  if (missing.length > 0 || unexpected.length > 0 || covered.size !== earnedIds.size) {
    fail(`updates completeness mismatch; missing=${missing.join(",") || "none"}; unexpected=${unexpected.join(",") || "none"}`);
  }

  const orderedEntries = validatedEntries.map((entry, position) => ({
    ...entry,
    earnedOrdinal: data.trackingBaseline.earnedCount + data.entries.length - position
  }));
  const latest = orderedEntries[0];
  if (latest.source.commit !== index.sourceCommitRef) fail("latest entry: source commit does not match pnp-index.json");
  if (latest.source.tree !== index.sourceTree) fail("latest entry: source tree does not match pnp-index.json");
  if (latest.source.statusCoordinate !== index.statusCoordinate
    || latest.source.statusCoordinate !== status.coordinate) {
    fail("latest entry: status coordinate does not match current publication payloads");
  }
  if (latest.source.publicationCoordinate !== index.publicSurfaceBaselineCoordinate) {
    fail("latest entry: publication coordinate does not match pnp-index.json");
  }
  return { entries: orderedEntries, earnedCount: earnedIds.size };
}

function renderTechnicalDetails(entry) {
  const milestone = entry.milestone;
  return `        <details>\n`
    + `          <summary>Technical details</summary>\n`
    + `          <p><strong>Milestone:</strong> <code>${escaped(entry.milestoneId)}</code></p>\n`
    + `          <p><strong>Classification:</strong> ${escaped(milestone.classification)}</p>\n`
    + `          <p><strong>Verified scope:</strong> ${escaped(milestone.scope)}</p>\n`
    + `          <p><strong>Boundary:</strong> ${escaped(milestone.nonClaim)}</p>\n`
    + `          <p><strong>Reviewed theorem pins:</strong> ${milestone.requiredTheorems.length}</p>\n`
    + `          <p><strong>Core source:</strong> commit <code>${escaped(entry.source.commit)}</code>, tree <code>${escaped(entry.source.tree)}</code>, status <code>${escaped(entry.source.statusCoordinate)}</code>.</p>\n`
    + `          <p><strong>Publication:</strong> <code>${escaped(entry.source.publicationCoordinate)}</code>; site publication <code>${escaped(entry.source.sitePublicationCommit)}</code>; deployment <code>${escaped(entry.source.deploymentId)}</code>.</p>\n`
    + `          <p>These coordinates and hashes establish artefact identity only; they do not establish theorem correctness.</p>\n`
    + `        </details>`;
}

function renderUpdatesHtml(model) {
  const articles = model.entries.map((entry) => {
    const paragraphs = entry.plainLanguage.map((paragraph) => `        <p>${escaped(paragraph)}</p>`).join("\n");
    return `      <article class="card" id="${escaped(entry.id)}" data-milestone-id="${escaped(entry.milestoneId)}">\n`
      + `        <div class="section-label"><time datetime="${escaped(entry.publishedAt)}">${escaped(entry.publishedAt.slice(0, 10))}</time> · earned milestone ${entry.earnedOrdinal}</div>\n`
      + `        <h2>${escaped(entry.title)}</h2>\n`
      + `${paragraphs}\n`
      + `${renderTechnicalDetails(entry)}\n`
      + `      </article>`;
  }).join("\n\n");

  return `<!DOCTYPE html>\n<html lang="en-AU">\n<head>\n`
    + `  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n`
    + `  <title>PNP Labs — milestone updates</title>\n`
    + `  <meta name="description" content="Plain-language and technical updates for each newly earned PNP Labs formal milestone.">\n`
    + `  <link rel="canonical" href="${BASE_URL}/updates.html">\n`
    + `  <link rel="alternate" type="application/atom+xml" title="PNP Labs milestone updates" href="${BASE_URL}/updates.xml">\n`
    + `  <meta name="theme-color" content="#f5f6f7">\n`
    + `  <link rel="icon" href="assets/icon-192.png" type="image/png">\n`
    + `  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">\n`
    + `  <link rel="manifest" href="assets/site.webmanifest">\n`
    + `  <link rel="stylesheet" href="assets/styles.min.css">\n</head>\n<body>\n`
    + `  <a class="skip-link" href="#main">Skip to content</a>\n`
    + `  <header class="site-header"><div class="nav-wrap">\n`
    + `    <a class="brand" href="index.html" aria-label="PNP Labs home"><span class="brand-mark"><img src="assets/icon-192.png" alt="" width="52" height="52"></span><span class="brand-text"><strong>PNP Labs</strong><span>formal reconstruction</span></span></a>\n`
    + `    <nav id="nav" class="nav-links" data-nav aria-label="Primary navigation"><a href="status.html">Status</a><a class="active" aria-current="page" href="updates.html">Updates</a><a href="paper.html">Report</a><a href="architecture.html">Architecture</a><a href="verify.html">Verify</a><a href="review.html">Review</a><a href="faq.html">FAQ</a></nav>\n`
    + `    <button class="menu-btn" data-menu type="button" aria-expanded="false" aria-controls="nav">Menu</button>\n`
    + `  </div></header>\n`
    + `  <main id="main">\n`
    + `    <section class="page-hero"><span class="eyebrow">Follow verified progress</span><h1>Milestone updates</h1>\n`
    + `      <p class="lede">Each update starts with an explanation for readers without a mathematics or computing background. Open Technical details when you want the exact formal scope and limits.</p>\n`
    + `      <p>A feed is a list your news-reader app checks for you. Copy this link into any app that supports RSS or Atom. No email address or PNP Labs account is needed.</p>\n`
    + `      <div class="hero-actions"><a class="btn primary" href="updates.xml" type="application/atom+xml">Open the Atom/RSS feed</a><a class="btn secondary" href="status.html">View current status</a></div>\n`
    + `    </section>\n`
    + `    <section class="section compact" aria-label="Published milestone updates"><div class="faq-list">\n${articles}\n    </div></section>\n`
    + `  </main>\n`
    + `  <footer class="site-footer"><div class="footer-wrap"><div><a class="brand" href="index.html"><span class="brand-text"><strong>PNP Labs</strong><span>compiled formal inventory</span></span></a><p>The repository does not currently establish P = NP.</p></div><nav class="footer-links" aria-label="Footer"><a href="status.html">Status</a><a href="updates.html">Updates</a><a href="paper.html">Report</a><a href="verify.html">Verify</a><a href="review.html">Review</a></nav></div></footer>\n`
    + `  <script src="assets/main.js" defer></script>\n</body>\n</html>\n`;
}

function renderAtomFeed(model) {
  const updated = model.entries[0].publishedAt;
  const entries = model.entries.map((entry) => {
    const url = `${BASE_URL}/updates.html#${entry.id}`;
    const summary = entry.plainLanguage.join(" ");
    const content = `${entry.plainLanguage.map((paragraph) => `<p>${escaped(paragraph)}</p>`).join("")}<p><a href="${url}">Read the technical details on PNPLabs.</a></p>`;
    return `  <entry>\n`
      + `    <id>${escaped(url)}</id>\n`
      + `    <title>${escaped(entry.title)}</title>\n`
      + `    <link rel="alternate" href="${escaped(url)}"/>\n`
      + `    <published>${escaped(entry.publishedAt)}</published>\n`
      + `    <updated>${escaped(entry.publishedAt)}</updated>\n`
      + `    <summary type="text">${escaped(summary)}</summary>\n`
      + `    <content type="html">${escaped(content)}</content>\n`
      + `  </entry>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n`
    + `<feed xmlns="http://www.w3.org/2005/Atom">\n`
    + `  <id>${BASE_URL}/updates.html</id>\n`
    + `  <title>PNP Labs milestone updates</title>\n`
    + `  <subtitle>Plain-language updates with source-bound technical details for newly earned formal milestones.</subtitle>\n`
    + `  <link rel="self" type="application/atom+xml" href="${BASE_URL}/updates.xml"/>\n`
    + `  <link rel="alternate" type="text/html" href="${BASE_URL}/updates.html"/>\n`
    + `  <updated>${escaped(updated)}</updated>\n`
    + `  <author><name>PNP Labs</name></author>\n`
    + `${entries}\n</feed>\n`;
}

async function readJson(root, relativePath) {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    fail(`${relativePath}: ${error.message}`);
  }
}

async function generateMilestoneUpdates({ root = repositoryRoot, write = false } = {}) {
  const [data, status, index] = await Promise.all([
    readJson(root, DATA_PATH),
    readJson(root, STATUS_PATH),
    readJson(root, INDEX_PATH)
  ]);
  const model = validateUpdatesModel(data, status, index);
  const outputs = new Map([
    [HTML_PATH, renderUpdatesHtml(model)],
    [FEED_PATH, renderAtomFeed(model)]
  ]);
  for (const [relativePath, expected] of outputs) {
    const target = path.join(root, relativePath);
    if (write) {
      await writeFile(target, expected);
    } else {
      let actual;
      try {
        actual = await readFile(target, "utf8");
      } catch (error) {
        fail(`${relativePath}: generated output is missing: ${error.message}`);
      }
      if (actual !== expected) fail(`${relativePath}: generated bytes are stale; run npm run updates:generate`);
    }
  }
  return { ...model, outputs };
}

function parseArguments(argv) {
  if (argv.length === 0) return { write: true };
  if (argv.length === 1 && argv[0] === "--check") return { write: false };
  fail("usage: node tools/generate-milestone-updates.mjs [--check]");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await generateMilestoneUpdates(parseArguments(process.argv.slice(2)));
    process.stdout.write(`milestone-updates-valid: ${result.entries.length} entries covering ${result.earnedCount} earned milestones\n`);
  } catch (error) {
    process.stderr.write(`${error.name}: ${error.message}\n`);
    process.exitCode = 1;
  }
}

export {
  MilestoneUpdatesError,
  generateMilestoneUpdates,
  parseArguments,
  renderAtomFeed,
  renderUpdatesHtml,
  validateUpdatesModel
};
