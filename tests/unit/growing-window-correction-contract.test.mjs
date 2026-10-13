import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  GROWING_WINDOW_CORRECTION,
  assertReviewedGrowingWindowCorrectionEvidence,
  assertReviewedGrowingWindowCorrectionRetained
} from "../../tools/growing-window-correction-contract.mjs";
import {
  validateUpdatesModel, validateCorrectionEvidence
} from "../../tools/generate-milestone-updates.mjs";

const reviewed = GROWING_WINDOW_CORRECTION;
const notice = () => structuredClone(reviewed);
const source = () => ({
  status: { nonClaims: [reviewed.evidence.nonClaim] },
  inventory: { declarations: reviewed.evidence.theorems.map((row) => ({ ...structuredClone(row), kind: "theorem" })) }
});

test("the fixed correction review has no earned milestone, score or source-tip authority", () => {
  assert.deepEqual(Object.keys(reviewed).sort(), ["evidence", "id"]);
  assert.equal(reviewed.id, "growing-window-enumeration-size-correction");
  assert.equal(reviewed.evidence.theorems.length, 6);
  for (const suffix of ["programs_tail_length_le", "smallerCandidates_exceeds_polynomial",
    "query_length_le", "valid_requires_full_budget", "valid_universe_exceeds_encoded_polynomial",
    "no_uniform_polynomial_complete_universe"]) {
    assert.ok(reviewed.evidence.theorems.some((row) =>
      row.name === "PNP.DirectWire.GrowingWindowUniverseBound." + suffix));
  }
  assert.ok(Object.isFrozen(reviewed));
  assert.ok(Object.isFrozen(reviewed.evidence));
  assert.ok(Object.isFrozen(reviewed.evidence.theorems));
  assert.ok(Object.isFrozen(reviewed.evidence.theorems[0].axioms));
  assert.throws(() => { reviewed.evidence.theorems.pop(); }, TypeError);
});

test("the reviewed evidence is accepted independently of theorem presentation order", () => {
  const row = notice();
  const { status, inventory } = source();
  row.evidence.theorems.reverse();
  assertReviewedGrowingWindowCorrectionEvidence(row);
  validateCorrectionEvidence(row, status, inventory);
  assertReviewedGrowingWindowCorrectionRetained([row], status, inventory);
});

test("every reviewed theorem and its module and axiom closure is retained", () => {
  for (let i = 0; i < reviewed.evidence.theorems.length; i += 1) {
    const missing = notice();
    missing.evidence.theorems.splice(i, 1);
    assert.throws(() => assertReviewedGrowingWindowCorrectionEvidence(missing), /reviewed theorem set changed/u);
    for (const field of ["name", "module", "axioms"]) {
      const changed = notice();
      changed.evidence.theorems[i][field] = field === "axioms" ? [] : changed.evidence.theorems[i][field] + "Changed";
      assert.throws(() => assertReviewedGrowingWindowCorrectionEvidence(changed), /reviewed compiled metadata changed/u);
    }
  }
  const extra = notice();
  extra.evidence.theorems.push({ name: "PNP.Fixture.unrelated", module: "PNP.Fixture", axioms: [] });
  assert.throws(() => assertReviewedGrowingWindowCorrectionEvidence(extra), /reviewed theorem set changed/u);
  const duplicate = notice();
  duplicate.evidence.theorems[1] = structuredClone(duplicate.evidence.theorems[0]);
  assert.throws(() => assertReviewedGrowingWindowCorrectionEvidence(duplicate), /reviewed theorem set changed/u);
});

test("the fixed notice identity and conservative limitation cannot be replaced together with generated metadata", () => {
  const row = notice();
  row.evidence.nonClaim = "A different limitation that was inserted into generated status.";
  const { status, inventory } = source();
  status.nonClaims = [row.evidence.nonClaim];
  assert.throws(() => validateCorrectionEvidence(row, status, inventory), /reviewed limitation changed/u);
  const renamed = notice();
  renamed.id = "different-correction";
  assert.throws(() => validateCorrectionEvidence(renamed, source().status, inventory), /reviewed notice identity changed/u);
});

test("the distinct compiled finding requires exactly one separately recorded correction", () => {
  const { status, inventory } = source();
  for (const [s, i] of [[{ nonClaims: [] }, inventory], [status, inventory]]) {
    assert.throws(() => assertReviewedGrowingWindowCorrectionRetained([], s, i), /requires its separately labelled correction notice/u);
    assert.throws(() => assertReviewedGrowingWindowCorrectionRetained([{ id: "unrelated" }], s, i), /requires its separately labelled correction notice/u);
    assert.throws(() => assertReviewedGrowingWindowCorrectionRetained([notice(), notice()], s, i), /requires its separately labelled correction notice/u);
    assertReviewedGrowingWindowCorrectionRetained([notice()], s, i);
  }
});

test("older published sources and unrelated notices remain valid, while historical reviewed evidence stays fixed", () => {
  const emptyStatus = { nonClaims: [] }, emptyInventory = { declarations: [] };
  // The canonical global stopping boundary is older than this correction.
  assertReviewedGrowingWindowCorrectionRetained([], source().status, emptyInventory);
  assertReviewedGrowingWindowCorrectionEvidence({ id: "unrelated", evidence: {
    nonClaim: reviewed.evidence.nonClaim, theorems: []
  } });
  assertReviewedGrowingWindowCorrectionRetained([], emptyStatus, emptyInventory);
  assertReviewedGrowingWindowCorrectionRetained([{ id: "unrelated", evidence: { nonClaim: "Another reviewed boundary." } }], emptyStatus, emptyInventory);
  assertReviewedGrowingWindowCorrectionRetained([notice()], emptyStatus, emptyInventory);
  const changed = notice();
  changed.evidence.theorems[0].axioms = [];
  assert.throws(() => assertReviewedGrowingWindowCorrectionRetained([changed], emptyStatus, emptyInventory), /reviewed compiled metadata changed/u);
});

test("the complete updates validator rejects deletion of a correction required by its source", async () => {
  const read = async (file) => JSON.parse(await readFile(new URL("../../" + file, import.meta.url), "utf8"));
  const [updates, status, index, progress, inventory] = await Promise.all([
    read("content/milestone-updates.json"), read("public/pnp-status.json"), read("public/pnp-index.json"),
    read("public/pnp-proof-progress.json"), read("public/pnp-theorem-inventory.json")
  ]);
  updates.corrections = updates.corrections.filter((row) => row.id !== reviewed.id);
  // Synthetic marker injection tests the adapter before and after source sync.
  // It is not compiled evidence or mathematical authority.
  if (!inventory.declarations.some((row) => row.name === reviewed.evidence.theorems[0].name)) {
    inventory.declarations.push({ ...structuredClone(reviewed.evidence.theorems[0]), kind: "theorem" });
  }
  if (!status.nonClaims.includes(reviewed.evidence.nonClaim)) status.nonClaims.push(reviewed.evidence.nonClaim);
  assert.throws(() => validateUpdatesModel(updates, status, index, progress, inventory),
    /requires its separately labelled correction notice/u);
});
