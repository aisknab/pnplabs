import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { AuditTargetValidationError, validateCorrectionSources } from "../../tools/check-cross-repo-targets.mjs";

// These synthetic Git objects exercise source binding, not theorem authority.
const theorem = { name: "PNP.Fixture.correction", module: "PNP.Fixture", axioms: ["propext"] };
const snapshot = {
  modelId: "synthetic-fixed-checkpoints",
  formalArtefactCoverageEarnedRows: 2, formalArtefactCoverageTotalRows: 4,
  riskWeightedProofCompletionPercent: 10, uncertaintyLowPercent: 5, uncertaintyHighPercent: 15,
  globalGatesClosed: 0, globalGatesAvailable: 5
};
const nonClaim = "Synthetic contract fixture, not a mathematical result.";
const json = (value) => JSON.stringify(value) + "\n";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
function git(root, args) {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
function write(root, name, bytes) {
  mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
  writeFileSync(path.join(root, name), bytes);
}
function commit(root) {
  git(root, ["add", "public/pnp-status.json", "public/pnp-theorem-inventory.json", "status/PROOF_PROGRESS.json"]);
  git(root, ["-c", "user.name=Contract fixture", "-c", "user.email=fixture@example.invalid", "commit", "-q", "-m", "Synthetic source fixture"]);
  return { commit: git(root, ["rev-parse", "HEAD"]), tree: git(root, ["rev-parse", "HEAD^{tree}"]) };
}
function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), "pnplabs-correction-source-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  git(root, ["init", "-q"]);
  const inventory = { coordinate: "TEST-INVENTORY", declarations: [{ ...theorem, kind: "theorem" }] };
  const status = {
    coordinate: "TEST-STATUS", publicSurfaceBaselineCoordinate: "TEST-PUBLICATION",
    nonClaims: [nonClaim], leanTheoremInventoryCoordinate: inventory.coordinate,
    leanTheoremInventorySha256: hash(json(inventory)), leanTheoremInventoryGeneratedFromCompiledEnvironment: true
  };
  const progress = {
    modelId: snapshot.modelId, asOfCoordinate: status.coordinate,
    history: [{
      asOfCoordinate: status.coordinate,
      formalArtefactCoverage: { earnedRows: snapshot.formalArtefactCoverageEarnedRows, totalRows: snapshot.formalArtefactCoverageTotalRows },
      riskWeightedProofCompletionPercent: snapshot.riskWeightedProofCompletionPercent,
      uncertaintyLowPercent: snapshot.uncertaintyLowPercent, uncertaintyHighPercent: snapshot.uncertaintyHighPercent,
      globalGatesClosed: snapshot.globalGatesClosed, globalGatesAvailable: snapshot.globalGatesAvailable
    }]
  };
  write(root, "public/pnp-status.json", json(status));
  write(root, "public/pnp-theorem-inventory.json", json(inventory));
  write(root, "status/PROOF_PROGRESS.json", json(progress));
  const identity = commit(root);
  const correction = {
    id: "synthetic-correction",
    source: { ...identity, statusCoordinate: status.coordinate, publicationCoordinate: status.publicSurfaceBaselineCoordinate },
    progressSnapshot: structuredClone(snapshot),
    evidence: { nonClaim, theorems: [structuredClone(theorem)] }
  };
  return { root, status, inventory, progress, correction };
}
function fails(root, rows, pattern) {
  assert.throws(() => validateCorrectionSources(root, rows), (error) =>
    error instanceof AuditTargetValidationError && error.failures.some((message) => pattern.test(message)));
}

test("correction source audit reads the exact recorded Git object, not current HEAD or working files", (t) => {
  const f = fixture(t);
  assert.equal(validateCorrectionSources(f.root, [f.correction]), 1);
  f.status.nonClaims = ["A later source has a different limitation."];
  write(f.root, "public/pnp-status.json", json(f.status));
  commit(f.root);
  write(f.root, "public/pnp-theorem-inventory.json", "uncommitted invalid bytes\n");
  assert.equal(validateCorrectionSources(f.root, [f.correction]), 1);
  const second = structuredClone(f.correction);
  second.id = "another-correction-at-the-same-source";
  assert.equal(validateCorrectionSources(f.root, [f.correction, second]), 2);
});

test("correction source audit rejects source drift, unavailable commits and unbound progress", (t) => {
  const f = fixture(t);
  for (const [field, value, pattern] of [
    ["commit", "--help", /exact commit and tree/u],
    ["commit", "0".repeat(40), /git .* failed/u],
    ["tree", "0".repeat(40), /commit\/tree mismatch/u],
    ["statusCoordinate", "DIFFERENT-STATUS", /source coordinate mismatch/u],
    ["publicationCoordinate", "DIFFERENT-PUBLICATION", /source coordinate mismatch/u]
  ]) {
    const row = structuredClone(f.correction);
    row.source[field] = value;
    fails(f.root, [row], pattern);
  }
  for (const field of Object.keys(snapshot)) {
    const row = structuredClone(f.correction);
    row.progressSnapshot[field] = typeof row.progressSnapshot[field] === "number"
      ? row.progressSnapshot[field] + 1 : "different-model";
    fails(f.root, [row], /progress snapshot differs/u);
  }
  const missing = structuredClone(f.correction);
  delete missing.progressSnapshot;
  fails(f.root, [missing], /progress snapshot differs/u);
  fails(f.root, null, /corrections must be an array/u);
});

test("correction source audit checks canonical non-claims and compiled theorem evidence", (t) => {
  const f = fixture(t);
  const scope = structuredClone(f.correction);
  scope.evidence.nonClaim = "Unproved wider claim.";
  fails(f.root, [scope], /non-claim is absent/u);
  const name = structuredClone(f.correction);
  name.evidence.theorems[0].name += "Missing";
  fails(f.root, [name], /compiled theorem metadata mismatch/u);
  const axiom = structuredClone(f.correction);
  axiom.evidence.theorems[0].axioms = ["PNP.UnprovedAssumption"];
  fails(f.root, [axiom], /standard axiom closures/u);
});

test("correction source audit rejects unsealed inventory bytes and falsely attributed compilation", (t) => {
  const f = fixture(t);
  f.inventory.declarations[0].kind = "definition";
  write(f.root, "public/pnp-theorem-inventory.json", json(f.inventory));
  let identity = commit(f.root);
  let row = { ...f.correction, source: { ...f.correction.source, ...identity } };
  fails(f.root, [row], /compiled inventory seal mismatch/u);

  f.status.leanTheoremInventorySha256 = hash(json(f.inventory));
  write(f.root, "public/pnp-status.json", json(f.status));
  identity = commit(f.root);
  row = { ...f.correction, source: { ...f.correction.source, ...identity } };
  fails(f.root, [row], /compiled theorem metadata mismatch/u);

  f.inventory.declarations[0].kind = "theorem";
  f.status.leanTheoremInventorySha256 = hash(json(f.inventory));
  f.status.leanTheoremInventoryGeneratedFromCompiledEnvironment = false;
  write(f.root, "public/pnp-status.json", json(f.status));
  write(f.root, "public/pnp-theorem-inventory.json", json(f.inventory));
  identity = commit(f.root);
  row = { ...f.correction, source: { ...f.correction.source, ...identity } };
  fails(f.root, [row], /compiled inventory seal mismatch/u);
});

test("correction source audit fails closed on a malformed source JSON object", (t) => {
  const f = fixture(t);
  write(f.root, "status/PROOF_PROGRESS.json", "not-json\n");
  const identity = commit(f.root);
  fails(f.root, [{ ...f.correction, source: { ...f.correction.source, ...identity } }], /invalid source JSON/u);
});
