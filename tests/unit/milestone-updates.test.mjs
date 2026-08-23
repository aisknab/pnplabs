import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  generateMilestoneUpdates,
  parseArguments,
  renderAtomFeed,
  renderProgressSvg,
  renderUpdatesHtml,
  validateUpdatesModel as validateUpdatesModelRaw
} from "../../tools/generate-milestone-updates.mjs";
import { EXTENSIONLESS_REDIRECTS, PUBLIC_ROOT_PATHS, SECURITY_HEADERS } from "../../public-surface.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const CONCEPT_STOP_WORDS = new Set([
  "about", "after", "again", "against", "being", "could", "does", "every",
  "from", "has", "have", "into", "itself", "milestone", "only", "original",
  "other", "than", "that", "their", "there", "these", "this", "through",
  "under", "where", "which", "with", "without"
]);

function significantConcepts(value) {
  return [...new Set(
    value
      .replaceAll(/<[^>]*>/gu, " ")
      .replaceAll(/&[a-z0-9#]+;/giu, " ")
      .toLowerCase()
      .match(/[a-z0-9]+/gu)
      ?.filter((word) => word.length >= 5 && !CONCEPT_STOP_WORDS.has(word)) ?? []
  )];
}

function assertCanonicalConceptCoverage(actual, canonical, minimum, label) {
  const actualText = actual.toLowerCase();
  const concepts = significantConcepts(canonical);
  const present = concepts.filter((concept) => actualText.includes(concept));
  assert.ok(concepts.length > 0, `${label}: canonical record has no testable concepts`);
  assert.ok(
    present.length / concepts.length >= minimum,
    `${label}: expected at least ${Math.round(minimum * 100)}% canonical concept coverage; missing ${concepts.filter((concept) => !actualText.includes(concept)).join(", ")}`
  );
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repositoryRoot, relativePath), "utf8"));
}

const canonicalProgress = await readJson("public/pnp-proof-progress.json");
const canonicalInventory = await readJson("public/pnp-theorem-inventory.json");

function validateUpdatesModel(data, status, index, progress = canonicalProgress, inventory = canonicalInventory) {
  return validateUpdatesModelRaw(data, status, index, progress, inventory);
}

async function fixtures() {
  return Promise.all([
    readJson("content/milestone-updates.json"),
    readJson("public/pnp-status.json"),
    readJson("public/pnp-index.json"),
    readJson("public/pnp-theorem-inventory.json")
  ]);
}

test("current updates cover every milestone earned after the exact 39-milestone baseline", async () => {
  const [data, status, index] = await fixtures();
  const model = validateUpdatesModel(data, status, index);
  assert.equal(data.trackingBaseline.earnedCount, 39);
  assert.equal(data.kind, "PNPLabsMilestoneUpdates2");
  assert.equal(data.version, 2);
  assert.equal(model.earnedCount, index.formalPublicationMilestoneCounts.earned);
  assert.equal(model.entries.length, model.earnedCount - data.trackingBaseline.earnedCount);
  assert.deepEqual(
    model.entries.map((entry) => entry.earnedOrdinal),
    Array.from({ length: model.entries.length }, (_, offset) => model.earnedCount - offset)
  );
  assert.deepEqual(
    model.entries.map((entry) => entry.milestone.requiredTheorems.length),
    data.entries.map((entry) => status.formalPublicationMilestones.find(
      (milestone) => milestone.id === entry.milestoneId
    ).requiredTheorems.length)
  );
  assert.equal(model.historicalProgressEstimatePercent, data.entries[0].progressEstimatePercent);
  assert.equal(model.proofProgress.percent, canonicalProgress.proofCompletion.percent);
  assert.equal(model.entries[0].id, data.entries[0].id);
  assert.equal(model.entries[0].milestone.id, data.entries[0].milestoneId);
  assert.equal(model.entries[0].source.commit, index.latestEarnedMilestoneSourceCommitRef);
  assert.equal(model.entries[0].source.tree, index.latestEarnedMilestoneSourceTree);
});

test("HTML puts two plain-language paragraphs before one collapsed source-derived technical dropdown", async () => {
  const [data, status, index] = await fixtures();
  const model = validateUpdatesModel(data, status, index);
  const html = renderUpdatesHtml(model);
  const escapeExpected = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
  const firstPlain = html.indexOf(escapeExpected(data.entries[0].plainLanguage[0]));
  const secondPlain = html.indexOf(escapeExpected(data.entries[0].plainLanguage[1]));
  const details = html.indexOf("<details>");
  assert.ok(firstPlain > 0 && secondPlain > firstPlain && details > secondPlain);
  assert.match(html, /<details>\s*<summary class="disclosure-summary"><span>Technical details<\/span>/u);
  assert.doesNotMatch(html, /<details\s+open/u);
  assert.ok(html.includes(escapeExpected(model.entries[0].milestone.scope)));
  assert.ok(html.includes(escapeExpected(model.entries[0].milestone.nonClaim)));
  assert.match(html, new RegExp(`Reviewed theorem pins:<\\/strong> ${model.entries[0].milestone.requiredTheorems.length}`, 'u'));
  assert.match(html, /Risk-weighted proof completion estimate/u);
  assert.match(html, new RegExp(`<progress[^>]+max="100"[^>]+value="${model.proofProgress.percent}"`, 'u'));
  assert.match(html, /This is not confidence that P=NP is true, a probability of success, or a time estimate/u);
  const coverageHeading = html.indexOf("Formal artefact coverage");
  const coverageCount = html.indexOf(`${model.proofProgress.formalArtefactCoverage.earnedRows} of ${model.proofProgress.formalArtefactCoverage.totalRows}`, coverageHeading);
  assert.ok(coverageHeading > 0 && coverageCount > coverageHeading);
  assert.match(html, /assets\/proof-progress\.svg/u);
  assert.match(html, /release seal and deployment provenance record/u);
  assert.doesNotMatch(html, /<form\b|<script[^>]+https?:\/\//iu);
});

test("Atom output has stable IDs, canonical timestamps, escaped text, and no duplicated technical prose", async () => {
  const [data, status, index] = await fixtures();
  const model = validateUpdatesModel(data, status, index);
  const feed = renderAtomFeed(model);
  assert.match(feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/u);
  assert.match(feed, /<link rel="self" type="application\/atom\+xml" href="https:\/\/pnplabs\.com\.au\/updates\.xml"\/>/u);
  assert.ok(feed.includes(`<published>${data.entries[0].publishedAt}</published>`));
  assert.ok(feed.includes(`updates.html#${data.entries[0].id}`));
  assert.ok(feed.includes("Read the technical details on PNPLabs."));
  assert.match(feed, new RegExp(`Superseded scoped-row\/editorial estimate at publication: ${model.historicalProgressEstimatePercent} percent`, 'u'));
  assert.match(feed, /data-superseded-progress-estimate-percent=&quot;54&quot;/u);
  assert.match(feed, new RegExp(`Risk-weighted proof completion estimate: ${model.proofProgress.percent}%`, 'u'));
  assert.ok(!feed.includes(model.entries[0].milestone.scope));

  const escapedModel = structuredClone(model);
  escapedModel.entries[0].title = "Research & development";
  assert.match(renderAtomFeed(escapedModel), /Research &amp; development/u);
});

test("progress SVG is deterministic, accessible, themed, and free of active content", async () => {
  const [data, status, index] = await fixtures();
  const svg = renderProgressSvg(validateUpdatesModel(data, status, index));
  assert.match(svg, /role="img" aria-labelledby="proof-progress-title proof-progress-desc"/u);
  assert.match(svg, new RegExp(`Risk-weighted proof completion estimate: ${canonicalProgress.proofCompletion.percent} percent`, 'u'));
  assert.match(svg, /#6f193c/u);
  assert.match(svg, /#168b87/u);
  assert.match(svg, new RegExp(`${canonicalProgress.proofCompletion.percent}% ESTIMATE`, 'u'));
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/u);
  assert.doesNotMatch(
    svg.replace('xmlns="http://www.w3.org/2000/svg"', ''),
    /<script\b|https?:\/\/|xlink:href|foreignObject/iu
  );
});

test("progress validation rejects missing, hostile, out-of-range, and premature 100 percent values", async () => {
  const [data, status, index] = await fixtures();

  const missing = structuredClone(data);
  delete missing.entries[0].progressEstimatePercent;
  assert.throws(() => validateUpdatesModel(missing, status, index), /expected exact keys/u);

  for (const value of [-1, 101, 30.5, "30", "<script>alert(1)<\/script>"]) {
    const invalid = structuredClone(data);
    invalid.entries[0].progressEstimatePercent = value;
    assert.throws(() => validateUpdatesModel(invalid, status, index), /integer from 0 to 100/u);
  }

  const premature = structuredClone(data);
  premature.entries[0].progressEstimatePercent = 100;
  assert.throws(() => validateUpdatesModel(premature, status, index), /100 percent is forbidden/u);

  const latestNull = structuredClone(data);
  for (const entry of latestNull.entries) entry.progressEstimatePercent = null;
  assert.throws(() => validateUpdatesModel(latestNull, status, index), /latest entry.*required/u);

  const historicalGap = structuredClone(data);
  historicalGap.entries[1].progressEstimatePercent = null;
  historicalGap.entries[2].progressEstimatePercent = 29;
  assert.throws(() => validateUpdatesModel(historicalGap, status, index), /cannot appear after a historical null/u);
});

test("superseded historical estimates remain accurate and may decrease between milestones", async () => {
  const [data, status, index] = await fixtures();
  const olderTracked = structuredClone(data);
  olderTracked.entries[1].progressEstimatePercent = 35;
  const model = validateUpdatesModel(olderTracked, status, index);
  assert.equal(model.entries[0].progressEstimatePercent, data.entries[0].progressEstimatePercent);
  assert.equal(model.entries[1].progressEstimatePercent, 35);
});

test("validation fails closed when an earned milestone has no update", async () => {
  const [data, status, index] = await fixtures();
  const mutated = structuredClone(status);
  mutated.formalPublicationMilestones.push({
    classification: "formalized-foundation-only",
    id: "unpublished-new-milestone",
    title: "Unpublished milestone",
    scope: "Exact test scope.",
    nonClaim: "No broader claim.",
    requiredTheorems: ["Example.theorem"]
  });
  assert.throws(() => validateUpdatesModel(data, mutated, index), /updates completeness mismatch.*unpublished-new-milestone/u);
});

test("validation rejects duplicates, source drift, unsafe prose, and schema extensions", async () => {
  const [data, status, index] = await fixtures();

  const duplicate = structuredClone(data);
  const duplicateEntry = structuredClone(duplicate.entries[0]);
  duplicateEntry.progressEstimatePercent = null;
  duplicate.entries.push(duplicateEntry);
  assert.throws(() => validateUpdatesModel(duplicate, status, index), /duplicate entry ID/u);

  const sourceDrift = structuredClone(data);
  sourceDrift.entries[0].source.commit = "a".repeat(40);
  assert.throws(() => validateUpdatesModel(sourceDrift, status, index), /source commit does not match/u);

  const unsafe = structuredClone(data);
  unsafe.entries[0].plainLanguage[0] = "Run `BuilderUnsafe` now.";
  assert.throws(() => validateUpdatesModel(unsafe, status, index), /markup and code delimiters/u);

  const extended = structuredClone(data);
  extended.entries[0].technicalSummary = "independently maintained drift";
  assert.throws(() => validateUpdatesModel(extended, status, index), /expected exact keys/u);

  const circularSiteIdentity = structuredClone(data);
  circularSiteIdentity.entries[0].source.sitePublicationCommit = "a".repeat(40);
  assert.throws(() => validateUpdatesModel(circularSiteIdentity, status, index), /expected exact keys/u);

  const circularDeploymentIdentity = structuredClone(data);
  circularDeploymentIdentity.entries[0].source.deploymentId = "future-release";
  assert.throws(() => validateUpdatesModel(circularDeploymentIdentity, status, index), /expected exact keys/u);
});

test("technical text follows the canonical status record instead of an editorial copy", async () => {
  const [data, status, index] = await fixtures();
  const original = renderUpdatesHtml(validateUpdatesModel(data, status, index));
  const mutatedStatus = structuredClone(status);
  const milestone = mutatedStatus.formalPublicationMilestones.find((entry) => entry.id === data.entries[0].milestoneId);
  milestone.scope = "Mutated canonical scope for test.";
  const mutated = renderUpdatesHtml(validateUpdatesModel(data, mutatedStatus, index));
  assert.notEqual(mutated, original);
  assert.ok(mutated.includes("Mutated canonical scope for test."));
});

test("checked generation rejects stale public HTML or XML bytes", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "pnplabs-updates-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "content"));
  await mkdir(path.join(root, "public"));
  await mkdir(path.join(root, "assets"));
  for (const relativePath of [
    "content/milestone-updates.json",
    "public/pnp-status.json",
    "public/pnp-index.json",
    "public/pnp-proof-progress.json",
    "public/pnp-theorem-inventory.json"
  ]) {
    await writeFile(path.join(root, relativePath), await readFile(path.join(repositoryRoot, relativePath)));
  }
  await generateMilestoneUpdates({ root, write: true });
  await generateMilestoneUpdates({ root, write: false });
  await writeFile(path.join(root, "updates.html"), "stale\n");
  await assert.rejects(generateMilestoneUpdates({ root, write: false }), /generated bytes are stale/u);

  await generateMilestoneUpdates({ root, write: true });
  await writeFile(path.join(root, "assets/proof-progress.svg"), "<svg>stale<\/svg>\n");
  await assert.rejects(generateMilestoneUpdates({ root, write: false }), /proof-progress\.svg.*stale/u);
});

test("the checked-in page and feed are exact generated outputs", async () => {
  const [data] = await fixtures();
  const result = await generateMilestoneUpdates({ write: false });
  assert.equal(result.entries.length, data.entries.length);
});

test("updates are discoverable from every public HTML page and the locked-down static surface", async () => {
  const htmlPaths = PUBLIC_ROOT_PATHS.filter((relativePath) => relativePath.endsWith(".html"));
  for (const relativePath of htmlPaths) {
    const html = await readFile(path.join(repositoryRoot, relativePath), "utf8");
    assert.match(html, /<link rel="alternate" type="application\/atom\+xml" title="PNP Labs milestone updates" href="https:\/\/pnplabs\.com\.au\/updates\.xml">/u, relativePath);
    const expectedNavigation = [
      'href="index.html">Overview</a>',
      'href="updates.html">Updates</a>',
      'href="faq.html">FAQ</a>',
      'href="status.html">Formal status</a>',
      'href="review.html">Technical review</a>',
    ];
    let previousPosition = -1;
    for (const fragment of expectedNavigation) {
      const position = html.indexOf(fragment);
      assert.ok(position > previousPosition, `${relativePath}: missing or misordered ${fragment}`);
      previousPosition = position;
    }
    assert.match(html, /href="review\.html#contact">Contact<\/a>/u, relativePath);
  }
  assert.ok(PUBLIC_ROOT_PATHS.includes("updates.html"));
  assert.ok(PUBLIC_ROOT_PATHS.includes("updates.xml"));
  assert.equal(EXTENSIONLESS_REDIRECTS["/updates"], "/updates.html");
  assert.match(SECURITY_HEADERS["Content-Security-Policy"], /default-src 'self'/u);
  assert.doesNotMatch(SECURITY_HEADERS["Content-Security-Policy"], /https?:\/\//u);
  assert.match(await readFile(path.join(repositoryRoot, "sitemap.xml"), "utf8"), /https:\/\/pnplabs\.com\.au\/updates\.html/u);
  const home = await readFile(path.join(repositoryRoot, "index.html"), "utf8");
  assert.match(home, />Inspect the tracker<\/a>/u);
  assert.match(home, /class="proof-tape-graphic" role="img"/u);
  assert.doesNotMatch(home, /assets\/proof-progress\.svg/u);
  assert.match(
    await readFile(path.join(repositoryRoot, "assets/proof-progress.svg"), "utf8"),
    new RegExp(`${canonicalProgress.proofCompletion.percent}% ESTIMATE`, 'u')
  );
});

test("FAQ explains the superseded ratio and current fixed-weight boundary", async () => {
  const [data, status, index, inventory] = await fixtures();
  const progress = canonicalProgress.proofCompletion;
  const coverage = canonicalProgress.formalArtefactCoverage;
  const latestMilestone = status.formalPublicationMilestones.find(
    (milestone) => milestone.id === data.entries[0].milestoneId
  );
  const faq = await readFile(path.join(repositoryRoot, "faq.html"), "utf8");
  assert.match(faq, new RegExp(`Why did the progress figure change from 98% to about ${progress.percent}%\\?`, 'u'));
  assert.match(faq, /narrower scoped-row\/editorial measure/u);
  assert.match(faq, new RegExp(`${coverage.earnedRows} of ${coverage.totalRows} scoped publication rows earned`, 'u'));
  assert.match(faq, new RegExp(`uncertainty range of ${progress.uncertaintyLowPercent}% to ${progress.uncertaintyHighPercent}%`, 'u'));
  assert.match(faq, /five large proof blockers/u);
  assert.equal(index.formalPublicationMilestoneCounts.earned, coverage.earnedRows);
  assert.equal(index.formalPublicationMilestoneCounts.total, coverage.totalRows);
  assert.equal(latestMilestone.earned, true);
  assert.ok(latestMilestone.requiredTheorems.length > 0);
  for (const theorem of latestMilestone.requiredTheorems) {
    assert.ok(inventory.milestoneCandidates.some((candidate) => candidate.name === theorem), theorem);
  }
  assertCanonicalConceptCoverage(faq, latestMilestone.scope, 0.75, "FAQ latest scope");
  assertCanonicalConceptCoverage(faq, latestMilestone.nonClaim, 0.75, "FAQ latest non-claim");
  assertCanonicalConceptCoverage(faq, data.entries[0].plainLanguage.join(" "), 0.70, "FAQ latest update");
  assert.match(faq, /P = NP/u);
});

test("CLI accepts only generate mode or read-only check mode", () => {
  assert.deepEqual(parseArguments([]), { write: true });
  assert.deepEqual(parseArguments(["--check"]), { write: false });
  assert.throws(() => parseArguments(["--write"]), /usage/u);
});
