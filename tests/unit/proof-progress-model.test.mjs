import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateProofProgressSurfaces } from "../../tools/generate-proof-progress-surfaces.mjs";
import { validateProofProgressModel } from "../../tools/proof-progress-model.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

async function fixtures() {
  return Promise.all([
    readJson("public/pnp-proof-progress.json"),
    readJson("public/pnp-status.json"),
    readJson("public/pnp-theorem-inventory.json")
  ]);
}

test("canonical progress ledger validates against independent formal evidence", async () => {
  const [ledger, status, inventory] = await fixtures();
  const model = validateProofProgressModel(ledger, status, inventory);
  assert.equal(model.pointsAvailable, 100);
  assert.equal(model.pointsEarned, 33);
  assert.equal(model.percent, 33);
  assert.equal(model.uncertaintyLowPercent, 20);
  assert.equal(model.uncertaintyHighPercent, 40);
  assert.ok(model.uncertaintyLowPercent <= model.percent);
  assert.ok(model.percent <= model.uncertaintyHighPercent);
  assert.deepEqual(
    model.tracks.map((track) => [track.pointsEarned, track.pointsAvailable]),
    [[13, 15], [15, 20], [2, 35], [1, 20], [2, 10]]
  );
  assert.equal(model.checkpointCount, 35);

  const earnedRows = status.formalPublicationMilestones.filter((row) => row.earned === true).length;
  assert.deepEqual(model.formalArtefactCoverage, {
    earnedRows,
    totalRows: status.formalPublicationMilestones.length,
    percentRoundedOneDecimal: Math.round(1000 * earnedRows / status.formalPublicationMilestones.length) / 10
  });
  assert.equal(ledger.formalArtefactCoverage.isProofCompletionMetric, false);
  assert.equal(ledger.formalArtefactCoverage.denominatorCanGrow, true);
  assert.equal(ledger.history[0].asOfCoordinate, "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-08-23-184");
  assert.equal(ledger.history.at(-1).asOfCoordinate, ledger.asOfCoordinate);
  assert.deepEqual(ledger.history.at(-1).changedCheckpointIds, [
    "axiom-remove-residual-band-minimum"
  ]);
  assert.deepEqual(ledger.history.at(-1).formalArtefactCoverage, {
    earnedRows,
    totalRows: status.formalPublicationMilestones.length
  });

  assert.equal(model.globalGatesClosed, 0);
  assert.equal(model.globalGatesAvailable, 5);
  assert.ok(model.globalGates.every((gate) => gate.status === "open"));
  assert.deepEqual(model.projectSpecificAxiomsRemaining, [
    "PNP.CheckPCCPackexp",
    "PNP.GeneratePCCPack"
  ]);
  assert.deepEqual(model.rootTheorem, {
    name: "PNP.Main.p_eq_np",
    present: false,
    built: false,
    axiomAuditPassed: false
  });
  assert.equal(model.publicationGate.passed, false);
});

test("progress validation rejects arithmetic, evidence, gate, axiom, and root drift", async () => {
  const [ledger, status, inventory] = await fixtures();

  const weightDrift = structuredClone(ledger);
  weightDrift.tracks[0].pointsAvailable = 16;
  assert.throws(() => validateProofProgressModel(weightDrift, status, inventory), /Track\.PointsAvailable/u);

  const scoreDrift = structuredClone(ledger);
  scoreDrift.proofCompletion.percent = 98.8;
  assert.throws(() => validateProofProgressModel(scoreDrift, status, inventory), /ProofCompletion\.StoredPercent/u);

  const unsupportedCheckpoint = structuredClone(ledger);
  unsupportedCheckpoint.tracks[2].checkpoints[1].status = "earned";
  unsupportedCheckpoint.tracks[2].checkpoints[1].awardedAtCoordinate = ledger.asOfCoordinate;
  assert.throws(() => validateProofProgressModel(unsupportedCheckpoint, status, inventory), /Checkpoint\.Status/u);

  const missingEvidence = structuredClone(ledger);
  missingEvidence.tracks[0].checkpoints[0].evidence = [];
  assert.throws(() => validateProofProgressModel(missingEvidence, status, inventory), /Checkpoint\.EvidenceMissing/u);

  const coverageDrift = structuredClone(ledger);
  coverageDrift.formalArtefactCoverage.earnedRows -= 1;
  assert.throws(() => validateProofProgressModel(coverageDrift, status, inventory), /Coverage\.EarnedRows/u);

  const gateDrift = structuredClone(ledger);
  gateDrift.globalGates[0].status = "closed";
  assert.throws(() => validateProofProgressModel(gateDrift, status, inventory), /Gate\.Status/u);

  const axiomDrift = structuredClone(inventory);
  axiomDrift.projectAxioms = axiomDrift.projectAxioms.slice(1);
  assert.throws(() => validateProofProgressModel(ledger, status, axiomDrift), /Evidence\.AxiomPresence/u);

  const forgedRoot = structuredClone(ledger);
  forgedRoot.rootTheorem.present = true;
  assert.throws(() => validateProofProgressModel(forgedRoot, status, inventory), /Root\.Present/u);

  const unknownAwardCoordinate = structuredClone(ledger);
  unknownAwardCoordinate.tracks[0].checkpoints[0].awardedAtCoordinate = "PNP-UNKNOWN-COORDINATE";
  assert.throws(() => validateProofProgressModel(unknownAwardCoordinate, status, inventory), /Checkpoint\.UnknownAwardCoordinate/u);

  const duplicateHistory = structuredClone(ledger);
  duplicateHistory.history.push(structuredClone(duplicateHistory.history.at(-1)));
  assert.throws(() => validateProofProgressModel(duplicateHistory, status, inventory), /History\.DuplicateCoordinate/u);

  const currentHistoryDrift = structuredClone(ledger);
  currentHistoryDrift.history.at(-1).formalArtefactCoverage.earnedRows -= 1;
  assert.throws(() => validateProofProgressModel(currentHistoryDrift, status, inventory), /History\.CurrentCoverage/u);

  const changeEvidenceDrift = structuredClone(ledger);
  changeEvidenceDrift.history.at(-1).changeRecords[0].compiledEvidence = [];
  assert.throws(() => validateProofProgressModel(changeEvidenceDrift, status, inventory), /History\.ChangeRecordEvidenceMissing/u);

  const changeTotalDrift = structuredClone(ledger);
  changeTotalDrift.history.at(-1).changeRecords[0].oldAndNewTotal.new = 34;
  assert.throws(() => validateProofProgressModel(changeTotalDrift, status, inventory), /History\.ChangeRecordTotal/u);
});

test("active progress surfaces keep coverage and proof completion separate", async () => {
  const [ledger] = await fixtures();
  await generateProofProgressSurfaces({ root, write: false });
  const [home, statusPage, faq, updates, svg] = await Promise.all([
    readFile(path.join(root, "index.html"), "utf8"),
    readFile(path.join(root, "status.html"), "utf8"),
    readFile(path.join(root, "faq.html"), "utf8"),
    readFile(path.join(root, "updates.html"), "utf8"),
    readFile(path.join(root, "assets/proof-progress.svg"), "utf8")
  ]);
  for (const [label, surface] of [["home", home], ["status", statusPage], ["updates", updates]]) {
    assert.match(surface, /Risk-weighted proof completion estimate/u, label);
    assert.match(surface, /Formal artefact coverage/u, label);
    assert.match(surface, /not proof completion/u, label);
    assert.match(surface, new RegExp(`${ledger.proofCompletion.percent}%`, "u"), label);
    assert.match(surface, new RegExp(`${ledger.formalArtefactCoverage.earnedRows} of ${ledger.formalArtefactCoverage.totalRows}`, "u"), label);
    assert.doesNotMatch(surface, /98(?:\.8)?%[^<.]{0,100}(?:proof completion|towards proving|known formalisation work)/iu, label);
  }
  assert.match(faq, new RegExp(`Why did the progress figure change from 98% to about ${ledger.proofCompletion.percent}%\\?`, "u"));
  assert.match(faq, /superseded scoped-row\/editorial estimates/u);
  assert.match(updates, /Superseded scoped-row\/editorial estimate at publication:<\/strong> 98%/u);
  assert.match(updates, /id="proof-progress-model-v0-baseline"/u);
  assert.match(updates, /Formal artefact coverage: 160 \/ 162/u);
  assert.match(updates, /Risk-weighted proof completion estimate: 30%/u);
  assert.match(svg, new RegExp(`Risk-weighted proof completion estimate: ${ledger.proofCompletion.percent} percent`, "u"));
  assert.match(svg, /uncertainty range from 20 to 40 percent/u);
  assert.doesNotMatch(svg, /editorial/u);
});
