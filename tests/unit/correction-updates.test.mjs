import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateUpdatesModel, validateCorrectionEvidence, renderUpdatesHtml, renderAtomFeed, renderProgressSvg } from "../../tools/generate-milestone-updates.mjs";
import { COMPATIBLE_SUPPORT_CORRECTION } from "../../tools/compatible-support-correction-contract.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const json = async (name) => JSON.parse(await readFile(path.join(repositoryRoot, name), "utf8"));
const [updates, status, index, progress, inventory] = await Promise.all([
  json("content/milestone-updates.json"), json("public/pnp-status.json"), json("public/pnp-index.json"),
  json("public/pnp-proof-progress.json"), json("public/pnp-theorem-inventory.json")
]);
const latest = status.formalPublicationMilestones.find((row) => row.id === updates.entries[0].milestoneId);
const theorem = inventory.declarations.find((row) => row.kind === "theorem"
  && latest.requiredTheorems.includes(row.name));
assert.ok(theorem, "fixture must use a real current compiled theorem");
const fixtureNonClaim = status.nonClaims.find((value) => value !== COMPATIBLE_SUPPORT_CORRECTION.evidence.nonClaim);
assert.ok(fixtureNonClaim, "generic fixture must not impersonate the reserved reviewed correction");
function fixture() {
  const data = structuredClone(updates);
  data.corrections.unshift({
    id: "synthetic-source-bound-correction",
    publishedAt: new Date(Date.parse(data.entries[0].publishedAt) + 1000).toISOString().replace(".000Z", "Z"),
    title: "A separately recorded correction",
    plainLanguage: [
      "This synthetic fixture tests how a correction is presented separately from an earned result.",
      "It makes no new mathematical claim and awards no milestone or proof-completion credit."
    ],
    source: {
      commit: index.sourceProofCommitRef, tree: index.sourceTree,
      statusCoordinate: index.statusCoordinate, publicationCoordinate: index.publicSurfaceBaselineCoordinate
    },
    progressSnapshot: structuredClone(data.entries[0].progressSnapshot),
    evidence: {
      nonClaim: fixtureNonClaim,
      theorems: [{ name: theorem.name, module: theorem.module, axioms: [...theorem.axioms] }]
    }
  });
  return data;
}
const validate = (data, sourceStatus = status, sourceInventory = inventory) =>
  validateUpdatesModel(data, sourceStatus, index, progress, sourceInventory);
const reject = (mutate, pattern) => {
  const data = fixture();
  mutate(data.corrections[0], data);
  assert.throws(() => validate(data), pattern);
};

test("corrections cannot change earned completeness, ordinals, proof points or the progress graphic", () => {
  const original = validate(updates);
  const model = validate(fixture());
  assert.deepEqual(model.entries, original.entries);
  assert.equal(model.earnedCount, original.earnedCount);
  assert.deepEqual(model.proofProgress, original.proofProgress);
  assert.equal(renderProgressSvg(model), renderProgressSvg(original));
  assert.equal(model.corrections.length, original.corrections.length + 1);
  assert.ok(!Object.hasOwn(model.corrections[0], "earnedOrdinal"));
  assert.ok(!Object.hasOwn(model.corrections[0], "milestoneId"));
});

test("corrections render prominently and accessibly without an earned milestone label", () => {
  const data = fixture();
  const model = validate(data);
  const html = renderUpdatesHtml(model);
  const start = html.indexOf('id="' + data.corrections[0].id + '"');
  const article = html.slice(start, html.indexOf("</article>", start));
  assert.ok(start > 0 && start < html.indexOf('id="' + data.entries[0].id + '"'));
  assert.match(article, /data-update-kind="correction"/u);
  assert.match(article, /Correction, not an earned milestone/u);
  assert.doesNotMatch(article, /data-milestone-id|earned milestone \d+/u);
  assert.match(article, /aria-label="Progress tracker snapshot at the original correction"/u);
  assert.ok(article.indexOf(data.corrections[0].plainLanguage[1]) < article.indexOf("<details>"));
  assert.ok(article.includes(theorem.name));
  assert.ok(article.includes("Source-bound limitation"));
  assert.doesNotMatch(article, /<details\s+open/u);
  assert.ok(article.includes("Risk-weighted proof completion estimate: " + progress.proofCompletion.percent + "%"));
  assert.ok(article.includes("Formal artefact coverage: " + progress.formalArtefactCoverage.earnedRows));
});

test("Atom uses the latest correction timestamp and a separate category with escaped summaries", () => {
  const data = fixture();
  data.corrections[0].title = "Correction & evidence";
  const feed = renderAtomFeed(validate(data));
  assert.ok(feed.indexOf("<updated>" + data.corrections[0].publishedAt + "</updated>") < feed.indexOf("<entry>"));
  const first = feed.slice(feed.indexOf("<entry>"), feed.indexOf("</entry>"));
  assert.match(first, /<category term="correction"\/>/u);
  assert.match(first, /Correction &amp; evidence/u);
  assert.match(first, /Correction, not an earned milestone/u);
  assert.ok(first.includes(data.corrections[0].id));
  assert.ok(first.includes("Formal artefact coverage:"));
  assert.ok(first.includes("Risk-weighted proof completion estimate:"));
  assert.ok(feed.indexOf(data.corrections[0].id) < feed.indexOf(data.entries[0].id));
});

test("a correction tied with a batch sorts first without reordering earned entries", () => {
  const data = fixture();
  data.corrections[0].publishedAt = data.entries[0].publishedAt;
  const model = validate(data);
  const html = renderUpdatesHtml(model);
  assert.ok(html.indexOf('id="' + data.corrections[0].id + '"') < html.indexOf('id="' + data.entries[0].id + '"'));
  assert.deepEqual(model.entries.map((row) => row.id), data.entries.map((row) => row.id));
});

test("correction schema rejects credit fields, arbitrary fields, missing evidence and invalid collections", () => {
  for (const field of ["milestoneId", "earnedOrdinal", "pointsEarned", "progressEstimatePercent", "technicalSummary"]) {
    reject((row) => { row[field] = 1; }, /expected exact keys/u);
  }
  reject((row) => { delete row.evidence; }, /expected exact keys/u);
  for (const value of [null, {}, "correction"]) {
    reject((_row, data) => { data.corrections = value; }, /corrections must be an array/u);
  }
  reject((row) => { row.evidence.extra = true; }, /expected exact keys/u);
});

test("correction identity, timestamps and prose fail closed", () => {
  reject((row, data) => { row.id = data.entries[0].id; }, /duplicate update ID/u);
  reject((row) => { row.id = "proof-progress-model-v0-baseline"; }, /duplicate update ID/u);
  reject((row, data) => { data.corrections.push(structuredClone(row)); }, /duplicate update ID/u);
  reject((row) => { row.publishedAt = "2026-09-24"; }, /canonical RFC3339/u);
  reject((row) => { row.title = "<script>unsafe</script>"; }, /markup and code delimiters/u);
  reject((row) => { row.plainLanguage = ["Only one paragraph"]; }, /exactly two paragraphs/u);
  reject((row) => { row.plainLanguage[0] = "Use PNP.Internal notation."; }, /internal technical notation/u);
  reject((row, data) => {
    const later = structuredClone(row);
    later.id = "later-correction";
    later.publishedAt = new Date(Date.parse(row.publishedAt) + 1000).toISOString().replace(".000Z", "Z");
    data.corrections.push(later);
  }, /corrections must be newest first/u);
});

test("corrections cannot manufacture progress or diverge from the fixed historical snapshot", () => {
  for (const field of Object.keys(fixture().corrections[0].progressSnapshot)) {
    reject((row) => { row.progressSnapshot[field] = typeof row.progressSnapshot[field] === "number"
      ? row.progressSnapshot[field] + 1 : "unknown-model"; }, /conflicts with canonical progress history/u);
  }
  reject((row) => { row.progressSnapshot.extra = 0; }, /expected exact keys/u);
});

test("corrections reject an unknown source, wrong tree, coordinate or circular site identity", () => {
  for (const field of ["commit", "tree"]) {
    reject((row) => { row.source[field] = "a".repeat(40); }, /source binding/u);
  }
  for (const field of ["statusCoordinate", "publicationCoordinate"]) {
    reject((row) => { row.source[field] = "UNKNOWN-COORDINATE"; }, /source binding/u);
  }
  reject((row) => { row.source.sitePublicationCommit = "a".repeat(40); }, /expected exact keys/u);
});

test("current correction evidence must match authoritative non-claims and compiled metadata", () => {
  reject((row) => { row.evidence.nonClaim = "An independently invented claim."; }, /non-claim is absent/u);
  reject((row) => { row.evidence.theorems = []; }, /at least one compiled theorem/u);
  reject((row) => { row.evidence.theorems[0].name += "Missing"; }, /compiled theorem metadata mismatch/u);
  reject((row) => { row.evidence.theorems[0].module += "Changed"; }, /compiled theorem metadata mismatch/u);
  reject((row) => { row.evidence.theorems.push(structuredClone(row.evidence.theorems[0])); }, /duplicate theorem/u);
  reject((row) => { row.evidence.theorems[0].axioms = ["PNP.ProjectAssumption"]; }, /standard axiom closures/u);
  reject((row) => { row.evidence.theorems[0].axioms = ["sorryAx"]; }, /standard axiom closures/u);
  reject((row) => { row.evidence.theorems[0].axioms = ["Lean.ofReduceBool"]; }, /standard axiom closures/u);
  const data = fixture();
  const missing = { ...inventory, declarations: inventory.declarations.filter((row) => row.name !== theorem.name) };
  assert.throws(() => validate(data, status, missing), /compiled theorem metadata mismatch/u);
  const changed = { ...inventory, declarations: inventory.declarations.map((row) =>
    row.name === theorem.name ? { ...row, kind: "definition" } : row) };
  assert.throws(() => validate(data, status, changed), /compiled theorem metadata mismatch/u);
});

test("historical correction evidence is checked against its source object, not silently reinterpreted", () => {
  const row = fixture().corrections[0];
  validateCorrectionEvidence(row, status, inventory);
  assert.throws(() => validateCorrectionEvidence(row, { ...status, nonClaims: [] }, inventory), /non-claim is absent/u);
  assert.throws(() => validateCorrectionEvidence(row, status, { declarations: [] }), /compiled theorem metadata mismatch/u);
  const forged = structuredClone(row);
  forged.evidence.theorems[0].axioms = ["Classical.choice"];
  if (JSON.stringify(theorem.axioms) === JSON.stringify(forged.evidence.theorems[0].axioms)) {
    forged.evidence.theorems[0].axioms = [];
  }
  assert.throws(() => validateCorrectionEvidence(forged, status, inventory), /compiled theorem metadata mismatch/u);
});
