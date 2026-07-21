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
  renderUpdatesHtml,
  validateUpdatesModel
} from "../../tools/generate-milestone-updates.mjs";
import { EXTENSIONLESS_REDIRECTS, PUBLIC_ROOT_PATHS, SECURITY_HEADERS } from "../../public-surface.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repositoryRoot, relativePath), "utf8"));
}

async function fixtures() {
  return Promise.all([
    readJson("content/milestone-updates.json"),
    readJson("public/pnp-status.json"),
    readJson("public/pnp-index.json")
  ]);
}

test("current updates cover every milestone earned after the exact 39-milestone baseline", async () => {
  const [data, status, index] = await fixtures();
  const model = validateUpdatesModel(data, status, index);
  assert.equal(data.trackingBaseline.earnedCount, 39);
  assert.equal(model.earnedCount, 42);
  assert.equal(model.entries.length, 3);
  assert.equal(model.entries[0].earnedOrdinal, 42);
  assert.equal(model.entries[0].milestone.requiredTheorems.length, 92);
  assert.equal(model.entries[1].earnedOrdinal, 41);
  assert.equal(model.entries[1].milestone.requiredTheorems.length, 75);
  assert.equal(model.entries[2].earnedOrdinal, 40);
  assert.equal(model.entries[2].milestone.requiredTheorems.length, 40);
  assert.equal(model.entries[0].source.commit, index.sourceCommitRef);
  assert.equal(model.entries[0].source.tree, index.sourceTree);
});

test("HTML puts two plain-language paragraphs before one collapsed source-derived technical dropdown", async () => {
  const [data, status, index] = await fixtures();
  const model = validateUpdatesModel(data, status, index);
  const html = renderUpdatesHtml(model);
  const firstPlain = html.indexOf(data.entries[0].plainLanguage[0]);
  const secondPlain = html.indexOf(data.entries[0].plainLanguage[1]);
  const details = html.indexOf("<details>");
  assert.ok(firstPlain > 0 && secondPlain > firstPlain && details > secondPlain);
  assert.match(html, /<details>\s*<summary>Technical details<\/summary>/u);
  assert.doesNotMatch(html, /<details\s+open/u);
  assert.ok(html.includes(model.entries[0].milestone.scope));
  assert.ok(html.includes(model.entries[0].milestone.nonClaim));
  assert.match(html, /Reviewed theorem pins:<\/strong> 92/u);
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
  assert.ok(!feed.includes(model.entries[0].milestone.scope));

  const escapedModel = structuredClone(model);
  escapedModel.entries[0].title = "Research & development";
  assert.match(renderAtomFeed(escapedModel), /Research &amp; development/u);
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
  duplicate.entries.push(structuredClone(duplicate.entries[0]));
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
  for (const relativePath of [
    "content/milestone-updates.json",
    "public/pnp-status.json",
    "public/pnp-index.json"
  ]) {
    await writeFile(path.join(root, relativePath), await readFile(path.join(repositoryRoot, relativePath)));
  }
  await generateMilestoneUpdates({ root, write: true });
  await generateMilestoneUpdates({ root, write: false });
  await writeFile(path.join(root, "updates.html"), "stale\n");
  await assert.rejects(generateMilestoneUpdates({ root, write: false }), /generated bytes are stale/u);
});

test("the checked-in page and feed are exact generated outputs", async () => {
  const result = await generateMilestoneUpdates({ write: false });
  assert.equal(result.entries.length, 3);
});

test("updates are discoverable from every public HTML page and the locked-down static surface", async () => {
  const htmlPaths = PUBLIC_ROOT_PATHS.filter((relativePath) => relativePath.endsWith(".html"));
  for (const relativePath of htmlPaths) {
    const html = await readFile(path.join(repositoryRoot, relativePath), "utf8");
    assert.match(html, /<link rel="alternate" type="application\/atom\+xml" title="PNP Labs milestone updates" href="https:\/\/pnplabs\.com\.au\/updates\.xml">/u, relativePath);
    const statusPosition = html.indexOf('href="status.html">Status</a>');
    const updatesPosition = html.indexOf('href="updates.html">Updates</a>');
    assert.ok(statusPosition >= 0 && updatesPosition > statusPosition, relativePath);
  }
  assert.ok(PUBLIC_ROOT_PATHS.includes("updates.html"));
  assert.ok(PUBLIC_ROOT_PATHS.includes("updates.xml"));
  assert.equal(EXTENSIONLESS_REDIRECTS["/updates"], "/updates.html");
  assert.match(SECURITY_HEADERS["Content-Security-Policy"], /default-src 'self'/u);
  assert.doesNotMatch(SECURITY_HEADERS["Content-Security-Policy"], /https?:\/\//u);
  assert.match(await readFile(path.join(repositoryRoot, "sitemap.xml"), "utf8"), /https:\/\/pnplabs\.com\.au\/updates\.html/u);
  assert.match(await readFile(path.join(repositoryRoot, "index.html"), "utf8"), /Follow milestone updates/u);
});

test("CLI accepts only generate mode or read-only check mode", () => {
  assert.deepEqual(parseArguments([]), { write: true });
  assert.deepEqual(parseArguments(["--check"]), { write: false });
  assert.throws(() => parseArguments(["--write"]), /usage/u);
});
