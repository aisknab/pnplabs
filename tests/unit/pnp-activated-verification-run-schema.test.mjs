import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

test('historical activated record schema is retained only for auditability', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  assert.equal(registry.runRecordSchema.kind, 'PNPActivatedVerificationRunRecord0');
  assert.equal(registry.historical, true);
  assert.equal(registry.intakeFrozen, true);
  assert.equal(registry.submissionPath.status, 'closed');
  assert.equal(registry.submissionPath.acceptsNewRecords, false);
  assert.equal(registry.importWorkflow.acceptsNewRecords, false);
  assert.equal(registry.currentClaimBoundary.publicTheoremEmissionAllowed, false);
});

test('current status supersedes every historical activated coordinate', async () => {
  const status = await readJson('public/pnp-status.json');
  const registry = await readJson('public/pnp-verification-runs.json');
  assert.equal(status.coordinate, 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-29-90');
  assert.equal(status.historicalActivatedStatusCoordinate, registry.historicalStatusPayload.coordinate);
  assert.equal(status.leanTheoremInventoryDeclarationCount, 13731);
  assert.equal(status.leanTheoremInventoryTheoremCount, 7827);
  assert.equal(status.leanTheoremInventoryAssumptionFreeTheoremCount, 4012);
  assert.equal(status.leanTheoremInventoryExcludedPrivateDeclarationCount, 6908);
  assert.equal(status.leanTheoremInventorySourceClosureModuleCount, 117);
  assert.equal(status.formalPublicationMilestones.length, 70);
  assert.equal(status.formalPublicationMilestones.filter((row) => row.earned).length, 67);
  assert.equal(status.formalPublicationMilestones.filter((row) => !row.earned).length, 3);
  assert.equal(status.leanConcreteLockedNANDParserMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserAxiomAuditPassed, true);
  assert.equal(status.leanConcreteLockedNANDParserAuditedDeclarationCount, 380);
  assert.equal(status.leanConcreteLockedNANDParserAllInputExactFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserExactOutputFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserCompiledNonTimeoutFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserPolynomialTimeMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserRawRefinementFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterMachineFormalized, false);
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionFormalized, false);
  assert.equal(status.remainingBlockers.length, 6);
  assert.equal(status.projectSpecificAxiomInventory.length, 4);
  assert.equal(status.projectSpecificAxiomsRemaining, true);
  assert.equal(status.publicTheoremEmissionAllowed, false);
  assert.equal(status.mathematicalTheoremEstablished, false);
  assert.equal(status.rootLeanTheoremPresent, false);
  assert.equal(status.concretePublicationGate.passed, false);
});
