#!/usr/bin/env node

// Purpose: validate the mirrored fixed-weight proof-progress ledger against the
// current formal status and compiled declaration inventory.
// Inputs: public/pnp-proof-progress.json, public/pnp-status.json, and
// public/pnp-theorem-inventory.json.
// Outputs: a fail-closed view model for active public pages and tests.
// Invariants enforced: fixed checkpoints, exact 100-point arithmetic, independent
// evidence-row coverage, blocker/axiom/root consistency, and non-claim boundaries.
// Assumptions not checked: whether the reviewed fixed weights best predict future work.

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PATHS = Object.freeze({
  ledger: "public/pnp-proof-progress.json",
  status: "public/pnp-status.json",
  inventory: "public/pnp-theorem-inventory.json"
});

const BASELINE_COORDINATE = "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-08-23-184";
const BASELINE_COVERAGE = Object.freeze({ earnedRows: 160, totalRows: 162 });

const EXPECTED_TRACKS = Object.freeze([
  {
    id: "formal-foundations",
    title: "Formal foundations and proof infrastructure",
    pointsAvailable: 15,
    checkpoints: [
      ["foundations-concrete-kernel-interfaces", 4, "earned"],
      ["foundations-recursive-pipeline", 4, "earned"],
      ["foundations-inventory-gate", 3, "earned"],
      ["foundations-cnfsat-in-np", 2, "earned"],
      ["foundations-final-compatibility", 2, "open"]
    ]
  },
  {
    id: "concrete-reductions",
    title: "Concrete reductions and locked-NAND route",
    pointsAvailable: 20,
    checkpoints: [
      ["reductions-cook-levin-semantics", 3, "earned"],
      ["reductions-cnf-to-nand", 3, "earned"],
      ["reductions-locked-nand", 4, "earned"],
      ["reductions-builder-prefixes", 2, "earned"],
      ["reductions-report-locked-nand-linkage", 2, "earned"],
      ["reductions-complete-cook-levin-builder", 3, "open"],
      ["reductions-concrete-np-hardness", 2, "open"],
      ["reductions-final-target-compatibility", 1, "open"]
    ]
  },
  {
    id: "unconditional-residual-core",
    title: "Unconditional residual core and ZeroSlack",
    pointsAvailable: 35,
    checkpoints: [
      ["residual-finite-stopping-foundations", 2, "earned"],
      ["residual-derive-terminal-objects", 5, "open"],
      ["residual-pkgc-bn3-bn6-integration", 4, "open"],
      ["residual-hn-bud-hb-semantics", 4, "open"],
      ["residual-global-route-coverage", 4, "open"],
      ["residual-unconditional-saturate-positive", 4, "open"],
      ["residual-unconditional-bcel-ready", 4, "open"],
      ["residual-unconditional-zero-slack", 8, "open"]
    ]
  },
  {
    id: "exact-pccmin",
    title: "Exact PCCMin algorithm, complexity and bounds",
    pointsAvailable: 20,
    checkpoints: [
      ["pccmin-strict-gain-scaffold", 1, "earned"],
      ["pccmin-executable-loop", 3, "open"],
      ["pccmin-iteration-sound-descent", 4, "open"],
      ["pccmin-termination-exactness", 4, "open"],
      ["pccmin-polynomial-objects", 4, "open"],
      ["pccmin-total-polynomial-bounds", 4, "open"]
    ]
  },
  {
    id: "root-and-axioms",
    title: "Root theorem and project-axiom elimination",
    pointsAvailable: 10,
    checkpoints: [
      ["axiom-remove-generate-pccpack", 1, "open"],
      ["axiom-remove-check-pccpackexp", 1, "open"],
      ["axiom-remove-locked-nand-threshold", 1, "open"],
      ["axiom-remove-residual-band-minimum", 1, "open"],
      ["root-deterministic-cnfsat-in-p", 2, "open"],
      ["root-complexity-transport", 1, "open"],
      ["root-eligible-theorem", 2, "open"],
      ["root-publication-gate", 1, "open"]
    ]
  }
]);

const EXPECTED_GATES = Object.freeze([
  ["concrete-sat", "Concrete SAT", "Formal.ConcreteSAT"],
  ["residual-band-minimizer", "Residual-band minimiser", "Formal.ResidualBandMinimizer"],
  ["unconditional-zero-slack", "Unconditional ZeroSlack", "Formal.ZeroSlack"],
  ["polynomial-runtime-bounds", "Polynomial runtime and certificate bounds", "Formal.PolynomialRuntimeAndCertificateBounds"],
  ["root-theorem-axiom-audit", "Root theorem and axiom audit", "Formal.RootTheoremAndAxiomAudit"]
]);

const EXPECTED_AXIOMS = Object.freeze([
  "PNP.CheckPCCPackexp",
  "PNP.GeneratePCCPack",
  "PNP.LockedNANDThreshold",
  "PNP.ResidualBandExactMinimization"
]);

const REQUIRED_CHANGE_FIELDS = Object.freeze([
  "checkpointId",
  "oldStatus",
  "newStatus",
  "compiledEvidence",
  "sourceCoordinateOrCommit",
  "loadBearingRationale",
  "remainingTrackLimitations",
  "oldAndNewTotal",
  "uncertaintyRangeDecision"
]);

class ProofProgressModelError extends Error {
  constructor(code, message, details = {}) {
    super(`${code}: ${message}`);
    this.name = "ProofProgressModelError";
    this.code = code;
    this.details = details;
  }
}

function fail(code, message, details = {}) {
  throw new ProofProgressModelError(code, message, details);
}

function plain(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requirePlain(value, code, details = {}) {
  if (!plain(value)) fail(code, "expected an object", details);
}

function requireArray(value, code, details = {}) {
  if (!Array.isArray(value)) fail(code, "expected an array", details);
}

function requireString(value, code, details = {}) {
  if (typeof value !== "string" || value.trim() !== value || value.length === 0) {
    fail(code, "expected a non-empty trimmed string", details);
  }
}

function requireDate(value, code, details = {}) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    fail(code, "expected an ISO calendar date", details);
  }
}

function requireValue(actual, expected, code, details = {}) {
  if (!Object.is(actual, expected)) fail(code, "value does not match the fixed progress contract", { ...details, expected, actual });
}

function requireJson(actual, expected, code, details = {}) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(code, "structured value does not match the progress contract", { ...details, expected, actual });
  }
}

function resolveField(root, dottedPath) {
  let value = root;
  for (const part of dottedPath.split(".")) {
    if (!plain(value) || !Object.hasOwn(value, part)) {
      fail("Evidence.StatusFieldMissing", "status evidence field is missing", { dottedPath, part });
    }
    value = value[part];
  }
  return value;
}

function validateEvidence(evidence, status, inventory, checkpointId) {
  requirePlain(evidence, "Evidence.Shape", { checkpointId });
  if (evidence.kind === "status-field") {
    requireString(evidence.field, "Evidence.StatusField", { checkpointId });
    requireJson(resolveField(status, evidence.field), evidence.expected, "Evidence.StatusMismatch", { checkpointId, field: evidence.field });
    return;
  }
  if (evidence.kind === "milestone-earned") {
    requireString(evidence.id, "Evidence.MilestoneId", { checkpointId });
    const milestone = status.formalPublicationMilestones?.find?.((row) => row?.id === evidence.id);
    if (!milestone || milestone.earned !== true) {
      fail("Evidence.MilestoneNotEarned", "required formal publication milestone is not earned", { checkpointId, milestoneId: evidence.id });
    }
    return;
  }
  if (evidence.kind === "status-blocker-open") {
    requireString(evidence.id, "Evidence.BlockerId", { checkpointId });
    if (!status.remainingBlockers?.includes?.(evidence.id)) {
      fail("Evidence.BlockerNotOpen", "required open blocker is absent", { checkpointId, blocker: evidence.id });
    }
    return;
  }
  if (evidence.kind === "inventory-declaration") {
    requireString(evidence.name, "Evidence.DeclarationName", { checkpointId });
    requireValue(typeof evidence.expectedPresent, "boolean", "Evidence.DeclarationExpectedPresent", { checkpointId });
    const present = inventory.declarations?.some?.((row) => row?.name === evidence.name) ?? false;
    requireValue(present, evidence.expectedPresent, "Evidence.DeclarationPresence", { checkpointId, name: evidence.name });
    return;
  }
  if (evidence.kind === "inventory-project-axiom") {
    requireString(evidence.name, "Evidence.AxiomName", { checkpointId });
    requireValue(typeof evidence.expectedPresent, "boolean", "Evidence.AxiomExpectedPresent", { checkpointId });
    const present = inventory.projectAxioms?.includes?.(evidence.name) ?? false;
    requireValue(present, evidence.expectedPresent, "Evidence.AxiomPresence", { checkpointId, name: evidence.name });
    return;
  }
  fail("Evidence.UnknownKind", "unsupported checkpoint evidence kind", { checkpointId, kind: evidence.kind });
}

function roundOne(value) {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderProofProgressDashboard(model, options = {}) {
  const headingId = options.headingId ?? "proof-progress-heading";
  const includeGraphic = options.includeGraphic !== false;
  const coverage = model.formalArtefactCoverage;
  const tracks = model.tracks.map((track) => `          <li><span>${escapeHtml(track.title)}</span><strong>${track.pointsEarned} / ${track.pointsAvailable}</strong></li>`).join("\n");
  const gates = model.globalGates.map((gate) => `          <li><span>${escapeHtml(gate.title)}</span><strong>${gate.status === "open" ? "Open" : "Closed"}</strong></li>`).join("\n");
  const graphic = includeGraphic
    ? `\n          <img src="assets/proof-progress.svg" width="960" height="240" alt="Risk-weighted proof completion estimate ${model.percent} percent, with uncertainty from ${model.uncertaintyLowPercent} to ${model.uncertaintyHighPercent} percent">`
    : "";
  return `      <div class="proof-progress-dashboard" data-proof-progress-model="${escapeHtml(model.modelId)}" data-proof-progress-coordinate="${escapeHtml(model.coordinate)}">\n`
    + `        <article class="card proof-progress-primary">\n`
    + `          <span class="eyebrow">Fixed-weight model v0</span>\n`
    + `          <h2 id="${escapeHtml(headingId)}">Risk-weighted proof completion estimate</h2>\n`
    + `          <p class="progress-number" aria-label="${model.percent} percent risk-weighted proof completion estimate">${model.percent}%</p>\n`
    + `          <p><strong>Current uncertainty range:</strong> ${model.uncertaintyLowPercent}% to ${model.uncertaintyHighPercent}%</p>\n`
    + `          <p>A conservative estimate of how much of the complete formal proof burden has been retired. This is not confidence that P=NP is true, a probability of success, or a time estimate.</p>\n`
    + `          <progress class="proof-progress-meter" max="100" value="${model.percent}" aria-label="Risk-weighted proof completion estimate: ${model.percent} percent; uncertainty ${model.uncertaintyLowPercent} to ${model.uncertaintyHighPercent} percent">${model.percent}%</progress>${graphic}\n`
    + `          <h3>Five-track breakdown</h3>\n`
    + `          <ul class="progress-breakdown" aria-label="Risk-weighted proof completion track scores">\n${tracks}\n          </ul>\n`
    + `        </article>\n`
    + `        <article class="card proof-progress-secondary">\n`
    + `          <span class="section-label">Separate evidence metric</span>\n`
    + `          <h2>Formal artefact coverage</h2>\n`
    + `          <p class="coverage-number">${coverage.earnedRows} of ${coverage.totalRows}</p>\n`
    + `          <p><strong>${coverage.percentRoundedOneDecimal}% of the current evidence ledger.</strong></p>\n`
    + `          <p>This measures coverage of the current scoped publication ledger. It is not proof completion, and the denominator can grow as new formal dependencies are discovered.</p>\n`
    + `        </article>\n`
    + `        <article class="card proof-progress-gates">\n`
    + `          <span class="section-label">Load-bearing obligations</span>\n`
    + `          <h2>Global proof gates</h2>\n`
    + `          <p><strong>${model.globalGatesClosed} of ${model.globalGatesAvailable} closed</strong></p>\n`
    + `          <ul class="progress-gates" aria-label="Current global proof gate states">\n${gates}\n          </ul>\n`
    + `          <p>Project-specific axioms remaining: <strong>${model.projectSpecificAxiomsRemaining.length}</strong><br>Root theorem <code>${escapeHtml(model.rootTheorem.name)}</code>: <strong>${model.rootTheorem.present ? "present" : "absent"}</strong><br>Publication gate: <strong>${String(model.publicationGate.passed)}</strong></p>\n`
    + `        </article>\n`
    + `      </div>`;
}

function validateProofProgressModel(ledger, status, inventory) {
  requirePlain(ledger, "Ledger.Shape");
  requirePlain(status, "Status.Shape");
  requirePlain(inventory, "Inventory.Shape");
  requireValue(ledger.kind, "PNPProofProgress0", "Ledger.Kind");
  requireValue(ledger.version, 0, "Ledger.Version");
  requireValue(ledger.modelId, "fixed-risk-weighted-checkpoints-v0", "Ledger.Model");
  requireValue(ledger.asOfCoordinate, status.coordinate, "Ledger.Coordinate");
  requireDate(ledger.lastReviewedDate, "Ledger.LastReviewedDate");

  requirePlain(ledger.proofCompletion, "ProofCompletion.Shape");
  requireValue(ledger.proofCompletion.label, "risk-weighted proof completion estimate", "ProofCompletion.Label");
  requireValue(ledger.proofCompletion.pointsAvailable, 100, "ProofCompletion.Available");
  requireValue(ledger.proofCompletion.isProbabilityOfCorrectness, false, "ProofCompletion.ProbabilityBoundary");
  requireValue(ledger.proofCompletion.isTimeEstimate, false, "ProofCompletion.TimeBoundary");
  requireValue(ledger.proofCompletion.mayDecrease, true, "ProofCompletion.MayDecrease");

  requireArray(ledger.history, "History.Shape");
  if (ledger.history.length === 0) fail("History.Empty", "progress history must include the M184 baseline");
  const historyCoordinates = new Set();
  for (let index = 0; index < ledger.history.length; index += 1) {
    const entry = ledger.history[index];
    requirePlain(entry, "History.EntryShape", { index });
    requireString(entry.kind, "History.Kind", { index });
    requireString(entry.asOfCoordinate, "History.Coordinate", { index });
    if (historyCoordinates.has(entry.asOfCoordinate)) {
      fail("History.DuplicateCoordinate", "progress history coordinates must be unique", { index, coordinate: entry.asOfCoordinate });
    }
    historyCoordinates.add(entry.asOfCoordinate);
    requirePlain(entry.formalArtefactCoverage, "History.CoverageShape", { index });
    requireValue(Number.isSafeInteger(entry.formalArtefactCoverage.earnedRows), true, "History.EarnedRowsInteger", { index });
    requireValue(Number.isSafeInteger(entry.formalArtefactCoverage.totalRows), true, "History.TotalRowsInteger", { index });
    if (entry.formalArtefactCoverage.earnedRows < 0
        || entry.formalArtefactCoverage.earnedRows > entry.formalArtefactCoverage.totalRows) {
      fail("History.CoverageRange", "historical earned rows must be between zero and total rows", { index });
    }
    requireValue(Number.isSafeInteger(entry.riskWeightedProofCompletionPercent), true, "History.ScoreInteger", { index });
    requireValue(Number.isSafeInteger(entry.uncertaintyLowPercent), true, "History.UncertaintyLowInteger", { index });
    requireValue(Number.isSafeInteger(entry.uncertaintyHighPercent), true, "History.UncertaintyHighInteger", { index });
    requireValue(Number.isSafeInteger(entry.globalGatesClosed), true, "History.GatesClosedInteger", { index });
    requireValue(Number.isSafeInteger(entry.globalGatesAvailable), true, "History.GatesAvailableInteger", { index });
    requireString(entry.rationale, "History.Rationale", { index });
  }

  requireArray(ledger.tracks, "Tracks.Shape");
  requireValue(ledger.tracks.length, EXPECTED_TRACKS.length, "Tracks.Count");
  let pointsAvailable = 0;
  let pointsEarned = 0;
  let checkpointCount = 0;
  for (let trackIndex = 0; trackIndex < EXPECTED_TRACKS.length; trackIndex += 1) {
    const expected = EXPECTED_TRACKS[trackIndex];
    const track = ledger.tracks[trackIndex];
    requirePlain(track, "Track.Shape", { trackIndex });
    requireValue(track.id, expected.id, "Track.Id", { trackIndex });
    requireValue(track.title, expected.title, "Track.Title", { id: expected.id });
    requireValue(track.pointsAvailable, expected.pointsAvailable, "Track.PointsAvailable", { id: expected.id });
    requireArray(track.checkpoints, "Checkpoint.Shape", { id: expected.id });
    requireValue(track.checkpoints.length, expected.checkpoints.length, "Checkpoint.Count", { id: expected.id });
    let trackAvailable = 0;
    let trackEarned = 0;
    for (let checkpointIndex = 0; checkpointIndex < expected.checkpoints.length; checkpointIndex += 1) {
      const [id, points, statusValue] = expected.checkpoints[checkpointIndex];
      const checkpoint = track.checkpoints[checkpointIndex];
      requirePlain(checkpoint, "Checkpoint.Shape", { id });
      requireValue(checkpoint.id, id, "Checkpoint.Id", { track: expected.id, checkpointIndex });
      requireString(checkpoint.title, "Checkpoint.Title", { id });
      requireValue(checkpoint.points, points, "Checkpoint.Points", { id });
      requireValue(checkpoint.status, statusValue, "Checkpoint.Status", { id });
      requireArray(checkpoint.evidence, "Checkpoint.EvidenceShape", { id });
      if (checkpoint.evidence.length === 0) fail("Checkpoint.EvidenceMissing", "checkpoint must retain evidence", { id });
      for (const evidence of checkpoint.evidence) validateEvidence(evidence, status, inventory, id);
      if (checkpoint.status === "earned") {
        requireString(checkpoint.awardedAtCoordinate, "Checkpoint.AwardCoordinate", { id });
        if (!historyCoordinates.has(checkpoint.awardedAtCoordinate)) {
          fail("Checkpoint.UnknownAwardCoordinate", "earned checkpoint coordinate is absent from progress history", { id, coordinate: checkpoint.awardedAtCoordinate });
        }
        trackEarned += points;
      } else {
        requireValue(checkpoint.awardedAtCoordinate, null, "Checkpoint.OpenAwardCoordinate", { id });
      }
      requireString(checkpoint.justification, "Checkpoint.Justification", { id });
      requireString(checkpoint.remainingLimitation, "Checkpoint.RemainingLimitation", { id });
      requireDate(checkpoint.lastReviewedDate, "Checkpoint.LastReviewedDate", { id });
      trackAvailable += points;
      checkpointCount += 1;
    }
    requireValue(trackAvailable, track.pointsAvailable, "Track.CheckpointTotal", { id: expected.id });
    requireValue(track.pointsEarned, trackEarned, "Track.StoredEarned", { id: expected.id });
    pointsAvailable += trackAvailable;
    pointsEarned += trackEarned;
  }
  requireValue(pointsAvailable, 100, "ProofCompletion.TrackMaximumTotal");
  requireValue(pointsEarned, 30, "ProofCompletion.M184Baseline");
  requireValue(ledger.proofCompletion.pointsEarned, pointsEarned, "ProofCompletion.StoredEarned");
  requireValue(ledger.proofCompletion.percent, 100 * pointsEarned / pointsAvailable, "ProofCompletion.StoredPercent");
  if (!(ledger.proofCompletion.uncertaintyLowPercent <= ledger.proofCompletion.percent
    && ledger.proofCompletion.percent <= ledger.proofCompletion.uncertaintyHighPercent)) {
    fail("ProofCompletion.UncertaintyRange", "uncertainty range must contain the displayed estimate");
  }
  requireValue(ledger.proofCompletion.uncertaintyLowPercent, 20, "ProofCompletion.M184UncertaintyLow");
  requireValue(ledger.proofCompletion.uncertaintyHighPercent, 40, "ProofCompletion.M184UncertaintyHigh");

  requireArray(status.formalPublicationMilestones, "Coverage.StatusMilestones");
  const earnedRows = status.formalPublicationMilestones.filter((row) => row?.earned === true).length;
  const totalRows = status.formalPublicationMilestones.length;
  requirePlain(ledger.formalArtefactCoverage, "Coverage.Shape");
  requireValue(ledger.formalArtefactCoverage.label, "formal artefact coverage", "Coverage.Label");
  requireValue(ledger.formalArtefactCoverage.earnedRows, earnedRows, "Coverage.EarnedRows");
  requireValue(ledger.formalArtefactCoverage.totalRows, totalRows, "Coverage.TotalRows");
  requireValue(ledger.formalArtefactCoverage.percentRoundedOneDecimal, roundOne(100 * earnedRows / totalRows), "Coverage.Percent");
  requireValue(ledger.formalArtefactCoverage.isProofCompletionMetric, false, "Coverage.ProofCompletionBoundary");
  requireValue(ledger.formalArtefactCoverage.denominatorCanGrow, true, "Coverage.DenominatorBoundary");

  requireArray(ledger.globalGates, "Gates.Shape");
  requireArray(status.remainingBlockers, "Gates.StatusBlockers");
  requireArray(status.remainingFormalObligations, "Gates.StatusObligations");
  requireValue(ledger.globalGates.length, EXPECTED_GATES.length, "Gates.Count");
  const blockerIds = EXPECTED_GATES.map(([, , blocker]) => blocker);
  requireJson(status.remainingBlockers, blockerIds, "Gates.StatusBlockerSet");
  requireJson(status.remainingFormalObligations, blockerIds, "Gates.StatusObligationSet");
  for (let index = 0; index < EXPECTED_GATES.length; index += 1) {
    const [id, title, blocker] = EXPECTED_GATES[index];
    const gate = ledger.globalGates[index];
    requirePlain(gate, "Gate.Shape", { id });
    requireValue(gate.id, id, "Gate.Id", { index });
    requireValue(gate.title, title, "Gate.Title", { id });
    requireValue(gate.statusBlocker, blocker, "Gate.Blocker", { id });
    requireValue(gate.status, status.remainingBlockers.includes(blocker) ? "open" : "closed", "Gate.Status", { id });
  }

  requireJson(ledger.projectSpecificAxiomsRemaining, EXPECTED_AXIOMS, "Axioms.Ledger");
  requireJson(status.projectSpecificAxiomInventory, EXPECTED_AXIOMS, "Axioms.Status");
  requireJson(inventory.projectAxioms, EXPECTED_AXIOMS, "Axioms.Inventory");
  requireValue(status.projectSpecificAxiomsRemaining, true, "Axioms.StatusFlag");

  requirePlain(ledger.rootTheorem, "Root.Shape");
  requireValue(ledger.rootTheorem.name, status.rootLeanTheorem, "Root.Name");
  requireValue(ledger.rootTheorem.name, inventory.compatibilityRootName, "Root.InventoryName");
  requireValue(ledger.rootTheorem.present, status.rootLeanTheoremPresent, "Root.Present");
  requireValue(ledger.rootTheorem.built, status.rootLeanTheoremBuilt, "Root.Built");
  requireValue(ledger.rootTheorem.axiomAuditPassed, status.rootLeanTheoremAxiomAuditPassed, "Root.AxiomAudit");
  requireValue(inventory.declarations.some((row) => row?.name === ledger.rootTheorem.name), ledger.rootTheorem.present, "Root.InventoryPresence");

  requirePlain(ledger.publicationGate, "PublicationGate.Shape");
  requireValue(ledger.publicationGate.passed, status.concretePublicationGate?.passed, "PublicationGate.Status");
  requireValue(ledger.publicationGate.passed, false, "PublicationGate.M184Baseline");

  requirePlain(ledger.scoreChangePolicy, "Policy.Shape");
  requireValue(ledger.scoreChangePolicy.fixedCheckpointWeights, true, "Policy.FixedWeights");
  requireValue(ledger.scoreChangePolicy.localMilestonesDoNotAutomaticallyChangeScore, true, "Policy.LocalMilestones");
  requireValue(ledger.scoreChangePolicy.externalReviewIsNotMathematicalPremise, true, "Policy.ExternalReview");
  requireJson(ledger.scoreChangePolicy.requiredChangeRecordFields, REQUIRED_CHANGE_FIELDS, "Policy.ChangeFields");

  const baseline = ledger.history[0];
  requireValue(baseline.kind, "baseline", "History.BaselineKind");
  requireValue(baseline.asOfCoordinate, BASELINE_COORDINATE, "History.BaselineCoordinate");
  requireJson(baseline.formalArtefactCoverage, BASELINE_COVERAGE, "History.BaselineCoverage");
  requireValue(baseline.riskWeightedProofCompletionPercent, 30, "History.BaselineScore");
  requireValue(baseline.uncertaintyLowPercent, 20, "History.BaselineUncertaintyLow");
  requireValue(baseline.uncertaintyHighPercent, 40, "History.BaselineUncertaintyHigh");
  requireValue(baseline.globalGatesClosed, 0, "History.BaselineGatesClosed");
  requireValue(baseline.globalGatesAvailable, EXPECTED_GATES.length, "History.BaselineGatesAvailable");
  const currentHistory = ledger.history.at(-1);
  requireValue(currentHistory.asOfCoordinate, ledger.asOfCoordinate, "History.CurrentCoordinate");
  requireJson(currentHistory.formalArtefactCoverage, { earnedRows, totalRows }, "History.CurrentCoverage");
  requireValue(currentHistory.riskWeightedProofCompletionPercent, pointsEarned, "History.CurrentScore");
  requireValue(currentHistory.uncertaintyLowPercent, ledger.proofCompletion.uncertaintyLowPercent, "History.CurrentUncertaintyLow");
  requireValue(currentHistory.uncertaintyHighPercent, ledger.proofCompletion.uncertaintyHighPercent, "History.CurrentUncertaintyHigh");
  requireValue(currentHistory.globalGatesClosed, ledger.globalGates.filter((gate) => gate.status === "closed").length, "History.CurrentGatesClosed");
  requireValue(currentHistory.globalGatesAvailable, EXPECTED_GATES.length, "History.CurrentGatesAvailable");

  requireArray(ledger.nonClaims, "NonClaims.Shape");
  const nonClaims = ledger.nonClaims.join(" ");
  for (const required of [
    "not the probability",
    "not a delivery or time-remaining estimate",
    "Formal artefact coverage is not proof completion",
    "External review"
  ]) {
    if (!nonClaims.includes(required)) fail("NonClaims.RequiredBoundary", "required progress boundary is missing", { required });
  }

  return {
    coordinate: ledger.asOfCoordinate,
    modelId: ledger.modelId,
    pointsEarned,
    pointsAvailable,
    percent: ledger.proofCompletion.percent,
    uncertaintyLowPercent: ledger.proofCompletion.uncertaintyLowPercent,
    uncertaintyHighPercent: ledger.proofCompletion.uncertaintyHighPercent,
    formalArtefactCoverage: {
      earnedRows,
      totalRows,
      percentRoundedOneDecimal: ledger.formalArtefactCoverage.percentRoundedOneDecimal
    },
    tracks: ledger.tracks.map((track) => ({
      id: track.id,
      title: track.title,
      pointsEarned: track.pointsEarned,
      pointsAvailable: track.pointsAvailable
    })),
    globalGates: ledger.globalGates.map((gate) => ({ ...gate })),
    globalGatesClosed: ledger.globalGates.filter((gate) => gate.status === "closed").length,
    globalGatesAvailable: ledger.globalGates.length,
    projectSpecificAxiomsRemaining: [...ledger.projectSpecificAxiomsRemaining],
    rootTheorem: { ...ledger.rootTheorem },
    publicationGate: { ...ledger.publicationGate },
    history: ledger.history.map((entry) => structuredClone(entry)),
    checkpointCount
  };
}

async function readJson(root, relativePath) {
  const absolute = path.resolve(root, relativePath);
  const relative = path.relative(root, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) fail("Read.UnsafePath", "source path escapes repository root", { relativePath });
  try {
    return JSON.parse(await readFile(absolute, "utf8"));
  } catch (error) {
    fail("Read.InvalidJson", `${relativePath}: ${error.message}`);
  }
}

async function loadProofProgressModel(root = repositoryRoot) {
  const [ledger, status, inventory] = await Promise.all([
    readJson(root, PATHS.ledger),
    readJson(root, PATHS.status),
    readJson(root, PATHS.inventory)
  ]);
  return validateProofProgressModel(ledger, status, inventory);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const model = await loadProofProgressModel();
    process.stdout.write(`proof-progress-valid: ${model.pointsEarned}/${model.pointsAvailable} points, ${model.formalArtefactCoverage.earnedRows}/${model.formalArtefactCoverage.totalRows} formal artefact rows, ${model.globalGatesClosed}/${model.globalGatesAvailable} global gates\n`);
  } catch (error) {
    process.stderr.write(`${error.name}: ${error.message}\n`);
    process.exitCode = 1;
  }
}

export {
  EXPECTED_AXIOMS,
  EXPECTED_GATES,
  EXPECTED_TRACKS,
  PATHS,
  ProofProgressModelError,
  loadProofProgressModel,
  renderProofProgressDashboard,
  validateProofProgressModel
};
