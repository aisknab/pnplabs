// Purpose: freeze the reviewed publication boundary for this correction.
// This is not a Lean type check or a substitute for the core proof and axiom audit.
// The publisher separately verifies the exact core source and sealed inventory.
// Keep this review independent of generated status so deleting or weakening the
// notice cannot pass merely because its current producer changed with it.

function freezeDeep(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freezeDeep);
    Object.freeze(value);
  }
  return value;
}

export const GROWING_WINDOW_CORRECTION = freezeDeep({
  "id": "growing-window-enumeration-size-correction",
  "evidence": {
    "nonClaim": "The global stopping theorem uses the exhaustive semantic reference minimum as a mathematical witness and requires a proof of global no-gain at a chain endpoint. It does not generate a route, derive global absence from a finite scan, construct the report ZeroSlack certificate, or establish polynomial runtime.",
    "theorems": [
      {
        "name": "PNP.DirectWire.GrowingWindowUniverseBound.programs_tail_length_le",
        "module": "PNP.NANDGrowingWindowUniverseBound",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.GrowingWindowUniverseBound.smallerCandidates_exceeds_polynomial",
        "module": "PNP.NANDGrowingWindowUniverseBound",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.GrowingWindowUniverseBound.query_length_le",
        "module": "PNP.NANDGrowingWindowUniverseBound",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.GrowingWindowUniverseBound.valid_requires_full_budget",
        "module": "PNP.NANDGrowingWindowUniverseBound",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.GrowingWindowUniverseBound.valid_universe_exceeds_encoded_polynomial",
        "module": "PNP.NANDGrowingWindowUniverseBound",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.GrowingWindowUniverseBound.no_uniform_polynomial_complete_universe",
        "module": "PNP.NANDGrowingWindowUniverseBound",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      }
    ]
  }
});

function fail(message) {
  throw new Error("growing-window correction: " + message);
}

export function assertReviewedGrowingWindowCorrectionEvidence(correction) {
  const expected = GROWING_WINDOW_CORRECTION;
  const names = new Set(expected.evidence.theorems.map((row) => row.name));
  const identifiesFinding = Array.isArray(correction?.evidence?.theorems)
    && correction.evidence.theorems.some((row) => names.has(row?.name));
  if (correction?.id !== expected.id && !identifiesFinding) return;
  if (correction.id !== expected.id) fail("reviewed notice identity changed");
  const evidence = correction.evidence;
  if (evidence?.nonClaim !== expected.evidence.nonClaim) fail("reviewed limitation changed");
  if (!Array.isArray(evidence.theorems)
      || evidence.theorems.length !== expected.evidence.theorems.length) {
    fail("reviewed theorem set changed");
  }
  const suppliedNames = new Set(evidence.theorems.map((row) => row?.name));
  if (suppliedNames.size !== evidence.theorems.length) fail("reviewed theorem set changed");
  for (const theorem of expected.evidence.theorems) {
    const row = evidence.theorems.find((candidate) => candidate?.name === theorem.name);
    if (!row || row.module !== theorem.module
        || JSON.stringify(row.axioms) !== JSON.stringify(theorem.axioms)) {
      fail("reviewed compiled metadata changed for " + theorem.name);
    }
  }
}

export function assertReviewedGrowingWindowCorrectionRetained(corrections, _status, inventory) {
  const expected = GROWING_WINDOW_CORRECTION;
  const theoremNames = new Set(expected.evidence.theorems.map((row) => row.name));
  // The retained stopping/scan non-claim predates this finding. Only its
  // distinct compiled theorem names identify the new correction; reusing the
  // general boundary alone does not claim this theorem was already published.
  const findingInInventory = Array.isArray(inventory?.declarations)
    && inventory.declarations.some((row) => theoremNames.has(row?.name));
  if (findingInInventory) {
    if (!Array.isArray(corrections)
        || corrections.filter((row) => row?.id === expected.id).length !== 1) {
      fail("the source-bound finding requires its separately labelled correction notice");
    }
  }
  for (const correction of corrections ?? []) assertReviewedGrowingWindowCorrectionEvidence(correction);
}
