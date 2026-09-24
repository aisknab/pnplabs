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

export const COMPATIBLE_SUPPORT_CORRECTION = freezeDeep({
  "id": "unrestricted-compatible-support-slack-correction",
  "evidence": {
    "nonClaim": "The unrestricted raw-port-complete compatible-support slack inequality is refuted by a kernel-checked eleven-gate counterexample: the whole word is minimum with slack zero, while its actual proper nine-gate cut has independent open minimum eight and slack one. Its smaller equivalent literal splice is cyclic. This does not refute the checked acyclic framed law or a correctly restricted full/admissible-support law. Complete source-derived full-profile admissibility, first-loss routing and the global proof obligations remain open. This correction adds no earned positive publication row or fixed checkpoint credit.",
    "theorems": [
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.formula_exact",
        "module": "PNP.NANDCompatibleSupportSlackMinimum",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.baseline",
        "module": "PNP.NANDCompatibleSupportSlackMinimum",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.no_output_is_first_nand",
        "module": "PNP.NANDCompatibleSupportSlackMinimum",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.gate_lower_bound",
        "module": "PNP.NANDCompatibleSupportSlackMinimum",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.original_is_minimum",
        "module": "PNP.NANDCompatibleSupportSlackMinimum",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.original_reference_minimum",
        "module": "PNP.NANDCompatibleSupportSlackMinimum",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.global_slack_zero",
        "module": "PNP.NANDCompatibleSupportSlackMinimum",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.boundary_exact",
        "module": "PNP.NANDCompatibleSupportSlackComparison",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.interface_exact",
        "module": "PNP.NANDCompatibleSupportSlackComparison",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.selected_gate_count",
        "module": "PNP.NANDCompatibleSupportSlackComparison",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.smaller_formula_exact",
        "module": "PNP.NANDCompatibleSupportSlackComparison",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.same_open_function",
        "module": "PNP.NANDCompatibleSupportSlackComparison",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.comparison_reference_minimum",
        "module": "PNP.NANDCompatibleSupportSlackComparison",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.open_baseline",
        "module": "PNP.NANDCompatibleSupportSlackObstruction",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.local_reference_minimum",
        "module": "PNP.NANDCompatibleSupportSlackObstruction",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.local_slack_one",
        "module": "PNP.NANDCompatibleSupportSlackObstruction",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.global_slack_law_violation",
        "module": "PNP.NANDCompatibleSupportSlackObstruction",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      },
      {
        "name": "PNP.DirectWire.CompatibleSupportSlackObstruction.literal_splice_is_cyclic",
        "module": "PNP.NANDCompatibleSupportSlackComparison",
        "axioms": [
          "Quot.sound",
          "propext"
        ]
      }
    ]
  }
});

function fail(message) {
  throw new Error("compatible-support correction: " + message);
}

export function assertReviewedCorrectionEvidence(correction) {
  const expected = COMPATIBLE_SUPPORT_CORRECTION;
  if (correction?.id !== expected.id
      && correction?.evidence?.nonClaim !== expected.evidence.nonClaim) return;
  if (correction.id !== expected.id) fail("reviewed notice identity changed");
  const evidence = correction.evidence;
  if (evidence?.nonClaim !== expected.evidence.nonClaim) fail("reviewed limitation changed");
  if (!Array.isArray(evidence.theorems)
      || evidence.theorems.length !== expected.evidence.theorems.length) {
    fail("reviewed theorem set changed");
  }
  const names = new Set(evidence.theorems.map((row) => row?.name));
  if (names.size !== evidence.theorems.length) fail("reviewed theorem set changed");
  for (const theorem of expected.evidence.theorems) {
    const row = evidence.theorems.find((candidate) => candidate?.name === theorem.name);
    if (!row || row.module !== theorem.module
        || JSON.stringify(row.axioms) !== JSON.stringify(theorem.axioms)) {
      fail("reviewed compiled metadata changed for " + theorem.name);
    }
  }
}

export function assertReviewedCorrectionRetained(corrections, status, inventory) {
  const expected = COMPATIBLE_SUPPORT_CORRECTION;
  const theoremNames = new Set(expected.evidence.theorems.map((row) => row.name));
  const findingInStatus = Array.isArray(status?.nonClaims)
    && status.nonClaims.includes(expected.evidence.nonClaim);
  const findingInInventory = Array.isArray(inventory?.declarations)
    && inventory.declarations.some((row) => theoremNames.has(row?.name));
  if (findingInStatus || findingInInventory) {
    if (!Array.isArray(corrections)
        || corrections.filter((row) => row?.id === expected.id).length !== 1) {
      fail("the source-bound finding requires its separately labelled correction notice");
    }
  }
  for (const correction of corrections ?? []) assertReviewedCorrectionEvidence(correction);
}
