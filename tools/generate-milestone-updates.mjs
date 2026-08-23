// Purpose: validate one update for every formal milestone earned after feed tracking began.
// Inputs: content/milestone-updates.json and the current formal publication payloads.
// Outputs: deterministic updates.html, Atom 1.0 updates.xml, and proof-progress.svg bytes.
// Invariants enforced: exact schemas, complete milestone coverage, source binding, progress safety, and escaped text.
// Assumptions not checked: the executive clarity of the reviewed plain-language prose.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { renderProofProgressDashboard, validateProofProgressModel } from "./proof-progress-model.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = "content/milestone-updates.json";
const STATUS_PATH = "public/pnp-status.json";
const INDEX_PATH = "public/pnp-index.json";
const PROGRESS_PATH = "public/pnp-proof-progress.json";
const INVENTORY_PATH = "public/pnp-theorem-inventory.json";
const HTML_PATH = "updates.html";
const FEED_PATH = "updates.xml";
const PROGRESS_SVG_PATH = "assets/proof-progress.svg";
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

function validateUpdatesModel(data, status, index, progress, inventory) {
  assertExactKeys(data, ["kind", "version", "trackingBaseline", "entries"], "updates data");
  if (data.kind !== "PNPLabsMilestoneUpdates2" || data.version !== 2) {
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
  let historicalProgressReached = false;
  const validatedEntries = data.entries.map((entry, position) => {
    const label = `entry ${position}`;
    assertExactKeys(entry, ["id", "milestoneId", "publishedAt", "title", "plainLanguage", "progressEstimatePercent", "source"], label);
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
    if (entry.progressEstimatePercent === null) {
      historicalProgressReached = true;
    } else {
      if (!Number.isSafeInteger(entry.progressEstimatePercent)
          || entry.progressEstimatePercent < 0
          || entry.progressEstimatePercent > 100) {
        fail(`${label}: progressEstimatePercent must be null or an integer from 0 to 100`);
      }
      if (historicalProgressReached) {
        fail(`${label}: a tracked progress estimate cannot appear after a historical null entry`);
      }
      if (entry.progressEstimatePercent === 100
          && (status.concretePublicationGate?.passed !== true
            || status.rootLeanTheoremPresent !== true
            || status.mathematicalTheoremEstablished !== true)) {
        fail(`${label}: 100 percent is forbidden while the theorem root and publication gate are not established`);
      }
    }
    assertExactKeys(
      entry.source,
      ["commit", "tree", "statusCoordinate", "publicationCoordinate"],
      `${label} source`
    );
    assertSha(entry.source.commit, `${label} source commit`);
    assertSha(entry.source.tree, `${label} source tree`);
    assertSafeToken(entry.source.statusCoordinate, `${label} source statusCoordinate`);
    assertSafeToken(entry.source.publicationCoordinate, `${label} source publicationCoordinate`);

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
  if (latest.progressEstimatePercent === null) {
    fail("latest entry: progressEstimatePercent is required after progress tracking begins");
  }
  if (latest.source.commit !== index.latestEarnedMilestoneSourceCommitRef) fail("latest entry: source commit does not match the pinned latest earned milestone");
  if (latest.source.tree !== index.latestEarnedMilestoneSourceTree) fail("latest entry: source tree does not match the pinned latest earned milestone");
  if (latest.source.statusCoordinate !== index.statusCoordinate
    || latest.source.statusCoordinate !== status.coordinate) {
    fail("latest entry: status coordinate does not match current publication payloads");
  }
  if (latest.source.publicationCoordinate !== index.publicSurfaceBaselineCoordinate) {
    fail("latest entry: publication coordinate does not match pnp-index.json");
  }
  return {
    entries: orderedEntries,
    earnedCount: earnedIds.size,
    historicalProgressEstimatePercent: latest.progressEstimatePercent,
    proofProgress: validateProofProgressModel(progress, status, inventory)
  };
}

function renderProgressSvg(model) {
  const percent = model.proofProgress.percent;
  const low = model.proofProgress.uncertaintyLowPercent;
  const high = model.proofProgress.uncertaintyHighPercent;
  const trackX = 72;
  const trackWidth = 816;
  const fillWidth = trackWidth * percent / 100;
  const headX = trackX + fillWidth;
  const uncertaintyX = trackX + trackWidth * low / 100;
  const uncertaintyWidth = trackWidth * (high - low) / 100;
  const gridLines = Array.from({ length: 21 }, (_, index) => {
    const x = trackX + trackWidth * index / 20;
    return `  <path d="M${x} 112v52" stroke="#f8f1e8" stroke-width="2" opacity="0.82"/>`;
  }).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 240" width="960" height="240" role="img" aria-labelledby="proof-progress-title proof-progress-desc">\n`
    + `  <title id="proof-progress-title">Risk-weighted proof completion estimate: ${percent} percent</title>\n`
    + `  <desc id="proof-progress-desc">A conservative estimate of proof burden retired, with a current uncertainty range from ${low} to ${high} percent. It is not a probability of correctness, confidence that P equals NP, or a time estimate.</desc>\n`
    + `  <rect width="960" height="240" rx="28" fill="#f8f1e8"/>\n`
    + `  <path d="M36 52h888" stroke="#6f193c" stroke-width="2" opacity="0.22"/>\n`
    + `  <text x="72" y="84" fill="#371124" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="23" font-weight="700">RISK-WEIGHTED PROOF COMPLETION</text>\n`
    + `  <rect x="${trackX}" y="112" width="${trackWidth}" height="52" rx="8" fill="#6f193c"/>\n`
    + `  <rect x="${uncertaintyX}" y="106" width="${uncertaintyWidth}" height="64" rx="8" fill="#e3a72f" opacity="0.62"/>\n`
    + `  <rect x="${trackX}" y="112" width="${fillWidth}" height="52" rx="8" fill="#168b87"/>\n`
    + `${gridLines}\n`
    + `  <path d="M${headX} 101l11 11-11 11-11-11z" fill="#e3a72f" stroke="#371124" stroke-width="3"/>\n`
    + `  <text x="72" y="207" fill="#6f193c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="30" font-weight="800">${percent}% ESTIMATE</text>\n`
    + `  <text x="888" y="205" text-anchor="end" fill="#5d4b54" font-family="system-ui, sans-serif" font-size="16">uncertainty ${low}% to ${high}% · may decrease</text>\n`
    + `</svg>\n`;
}

function renderTechnicalDetails(entry) {
  const milestone = entry.milestone;
  return `        <details>\n`
    + `          <summary class="disclosure-summary"><span>Technical details</span><span class="disclosure-control" aria-hidden="true"><span class="disclosure-closed">Show</span><span class="disclosure-open">Hide</span><span class="disclosure-chevron">⌄</span></span></summary>\n`
    + `          <p><strong>Milestone:</strong> <code>${escaped(entry.milestoneId)}</code></p>\n`
    + `          <p><strong>Classification:</strong> ${escaped(milestone.classification)}</p>\n`
    + `          <p><strong>Verified scope:</strong> ${escaped(milestone.scope)}</p>\n`
    + `          <p><strong>Boundary:</strong> ${escaped(milestone.nonClaim)}</p>\n`
    + `          <p><strong>Reviewed theorem pins:</strong> ${milestone.requiredTheorems.length}</p>\n`
    + `          <p><strong>Core source:</strong> commit <code>${escaped(entry.source.commit)}</code>, tree <code>${escaped(entry.source.tree)}</code>, status <code>${escaped(entry.source.statusCoordinate)}</code>.</p>\n`
    + `          <p><strong>Publication:</strong> <code>${escaped(entry.source.publicationCoordinate)}</code>.</p>\n`
    + `          <p>Site release and live deployment identity are verified separately by the release seal and deployment provenance record.</p>\n`
    + `          <p>These coordinates and hashes establish artefact identity only; they do not establish theorem correctness.</p>\n`
    + `        </details>`;
}

function renderProgressBaselineUpdate(progress) {
  const baseline = progress.history[0];
  return `      <article class="card progress-baseline-update" id="proof-progress-model-v0-baseline" data-progress-baseline="${escaped(baseline.asOfCoordinate)}">\n`
    + `        <div class="section-label">Progress model v0 baseline</div>\n`
    + `        <h2>Separate evidence coverage from proof completion</h2>\n`
    + `        <p><strong>As of <code>${escaped(baseline.asOfCoordinate)}</code>:</strong></p>\n`
    + `        <ul><li>Formal artefact coverage: ${baseline.formalArtefactCoverage.earnedRows} / ${baseline.formalArtefactCoverage.totalRows}</li><li>Risk-weighted proof completion estimate: ${baseline.riskWeightedProofCompletionPercent}%</li><li>Uncertainty range: ${baseline.uncertaintyLowPercent}% to ${baseline.uncertaintyHighPercent}%</li><li>Global gates closed: ${baseline.globalGatesClosed} / ${baseline.globalGatesAvailable}</li></ul>\n`
    + `        <p>${escaped(baseline.rationale)}</p>\n`
    + `        <p>The earlier scoped-row percentage remains visible only as formal artefact coverage or as clearly labelled historical context. Neither metric is confidence that P=NP is true.</p>\n`
    + `        <p><a href="public/pnp-proof-progress.json">Inspect the canonical machine-readable checkpoint ledger</a>.</p>\n`
    + `      </article>`;
}

function renderUpdatesHtml(model) {
  const articles = model.entries.map((entry, position) => {
    const paragraphs = entry.plainLanguage.map((paragraph) => `        <p>${escaped(paragraph)}</p>`).join("\n");
    const progress = entry.progressEstimatePercent === null
      ? ""
      : `\n        <p class="update-progress"><strong>Superseded scoped-row/editorial estimate at publication:</strong> ${entry.progressEstimatePercent}%. This historical figure is not the current risk-weighted proof-completion estimate and is not a probability or confidence score.</p>`;
    const currentMetrics = position === 0
      ? `\n        <div class="update-current-metrics" aria-label="Current progress tracker snapshot"><strong>Current tracker at ${escaped(model.proofProgress.coordinate)}</strong><ul><li>Formal artefact coverage: ${model.proofProgress.formalArtefactCoverage.earnedRows} of ${model.proofProgress.formalArtefactCoverage.totalRows} current scoped rows earned</li><li>Risk-weighted proof completion estimate: ${model.proofProgress.percent}%</li><li>Uncertainty range: ${model.proofProgress.uncertaintyLowPercent}% to ${model.proofProgress.uncertaintyHighPercent}%</li><li>Global gates closed: ${model.proofProgress.globalGatesClosed} of ${model.proofProgress.globalGatesAvailable}</li></ul></div>`
      : "";
    return `      <article class="card" id="${escaped(entry.id)}" data-milestone-id="${escaped(entry.milestoneId)}">\n`
      + `        <div class="section-label"><time datetime="${escaped(entry.publishedAt)}">${escaped(entry.publishedAt.slice(0, 10))}</time> · earned milestone ${entry.earnedOrdinal}</div>\n`
      + `        <h2>${escaped(entry.title)}</h2>\n`
      + `${paragraphs}${progress}${currentMetrics}\n`
      + `${renderTechnicalDetails(entry)}\n`
      + `      </article>`;
  }).join("\n\n");

  return `<!DOCTYPE html>\n<html lang="en-AU">\n<head>\n`
    + `  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n`
    + `  <title>PNP Labs | milestone updates</title>\n`
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
    + `    <nav id="nav" class="nav-links" data-nav aria-label="Main navigation"><a href="index.html">Overview</a><a class="active" aria-current="page" href="updates.html">Updates</a><a href="faq.html">FAQ</a><a href="status.html">Formal status</a><a href="review.html">Technical review</a></nav>\n`
    + `    <div class="header-cta"><a class="btn secondary small" href="review.html#contact">Contact</a></div>\n`
    + `    <button class="menu-btn" data-menu type="button" aria-expanded="false" aria-controls="nav">Menu</button>\n`
    + `  </div></header>\n`
    + `  <main id="main">\n`
    + `    <section class="page-hero updates-hero"><span class="eyebrow">Follow verified progress</span><h1>Follow each machine-checked milestone.</h1>\n`
    + `      <p class="lede">Every update begins in everyday language and assumes no mathematics background. Open its technical details only when you want the exact Lean scope, theorem pins, and limits.</p>\n`
    + `      <div class="feed-box" aria-labelledby="feed-heading"><div><strong id="feed-heading">Use an RSS or Atom reader</strong><p>Your reader checks this address for new milestones. No email address or PNP Labs account is needed.</p><code id="feed-url">https://pnplabs.com.au/updates.xml</code></div><button class="btn secondary" type="button" data-copy="#feed-url">Copy feed address</button></div>\n`
    + `      <div class="hero-actions"><a class="btn primary" href="updates.xml" type="application/atom+xml">Open the update feed</a><a class="btn secondary" href="status.html">View formal status</a></div>\n`
    + `    </section>\n`
    + `    <section class="section compact proof-progress-section" aria-labelledby="proof-progress-heading">\n${renderProofProgressDashboard(model.proofProgress)}\n    </section>\n`
    + `    <section class="section compact" aria-label="Progress and milestone update history"><div class="faq-list">\n${renderProgressBaselineUpdate(model.proofProgress)}\n\n${articles}\n    </div></section>\n`
    + `  </main>\n`
    + `  <footer class="site-footer"><div class="footer-wrap"><div><a class="brand" href="index.html"><span class="brand-text"><strong>PNP Labs</strong><span>formal reconstruction in progress</span></span></a><p>The repository does not currently establish P = NP.</p></div><nav class="footer-links" aria-label="Footer"><a href="index.html">Overview</a><a href="updates.html">Updates</a><a href="faq.html">FAQ</a><a href="status.html">Formal status</a><a href="review.html">Technical review</a><a href="updates.xml" type="application/atom+xml">RSS/Atom feed</a><a href="review.html#contact">Contact</a></nav></div></footer>\n`
    + `  <script src="assets/main.js" defer></script>\n</body>\n</html>\n`;
}

function renderAtomFeed(model) {
  const updated = model.entries[0].publishedAt;
  const entries = model.entries.map((entry, position) => {
    const url = `${BASE_URL}/updates.html#${entry.id}`;
    const progressText = entry.progressEstimatePercent === null
      ? ""
      : ` Superseded scoped-row/editorial estimate at publication: ${entry.progressEstimatePercent} percent; this historical figure is not current risk-weighted proof completion, a probability, or a confidence score.`;
    const currentText = position === 0
      ? ` Current tracker: formal artefact coverage ${model.proofProgress.formalArtefactCoverage.earnedRows} of ${model.proofProgress.formalArtefactCoverage.totalRows}; risk-weighted proof completion estimate ${model.proofProgress.percent} percent; uncertainty range ${model.proofProgress.uncertaintyLowPercent} to ${model.proofProgress.uncertaintyHighPercent} percent; global gates closed ${model.proofProgress.globalGatesClosed} of ${model.proofProgress.globalGatesAvailable}.`
      : "";
    const summary = `${entry.plainLanguage.join(" ")}${progressText}${currentText}`;
    const progressContent = entry.progressEstimatePercent === null
      ? ""
      : `<p data-superseded-progress-estimate-percent="${entry.progressEstimatePercent}">Superseded scoped-row/editorial estimate at publication: ${entry.progressEstimatePercent}%. This historical figure is not current risk-weighted proof completion, a probability, or a confidence score.</p>`;
    const currentContent = position === 0
      ? `<p data-proof-progress-model="${escaped(model.proofProgress.modelId)}">Formal artefact coverage: ${model.proofProgress.formalArtefactCoverage.earnedRows} of ${model.proofProgress.formalArtefactCoverage.totalRows} current scoped rows earned. Risk-weighted proof completion estimate: ${model.proofProgress.percent}%. Uncertainty range: ${model.proofProgress.uncertaintyLowPercent}% to ${model.proofProgress.uncertaintyHighPercent}%. Global gates closed: ${model.proofProgress.globalGatesClosed} of ${model.proofProgress.globalGatesAvailable}.</p>`
      : "";
    const content = `${entry.plainLanguage.map((paragraph) => `<p>${escaped(paragraph)}</p>`).join("")}${progressContent}${currentContent}<p><a href="${url}">Read the technical details on PNPLabs.</a></p>`;
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
  const [data, status, index, progress, inventory] = await Promise.all([
    readJson(root, DATA_PATH),
    readJson(root, STATUS_PATH),
    readJson(root, INDEX_PATH),
    readJson(root, PROGRESS_PATH),
    readJson(root, INVENTORY_PATH)
  ]);
  const model = validateUpdatesModel(data, status, index, progress, inventory);
  const outputs = new Map([
    [HTML_PATH, renderUpdatesHtml(model)],
    [FEED_PATH, renderAtomFeed(model)],
    [PROGRESS_SVG_PATH, renderProgressSvg(model)]
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
  renderProgressSvg,
  renderUpdatesHtml,
  validateUpdatesModel
};
