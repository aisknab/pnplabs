import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync('assets/main.js', 'utf8');
const validationSource = source.slice(
  source.indexOf('const STATUS_COORDINATE'),
  source.indexOf('function renderFormalStatus'),
);
const context = vm.createContext({ structuredClone });
new vm.Script(`${validationSource}\nglobalThis.validation = { validateConcreteGate, validateInventory, validateMilestones, validateStatus, deriveGateSubchecks };`).runInContext(context);
const validation = context.validation;

const status = JSON.parse(readFileSync('public/pnp-status.json', 'utf8'));
const inventoryBytes = readFileSync('public/pnp-theorem-inventory.json');
const inventory = JSON.parse(inventoryBytes);

test('site validator accepts only the exact current inventory/status boundary', () => {
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), '6a5073b885cdaed765186ddef2beba44bd29432d88fd4516822ecd94a1b0cb45');
  assert.equal(validation.validateInventory(inventory), true);
  assert.equal(validation.validateMilestones(status), true);
  assert.equal(validation.validateConcreteGate(status, inventory), true);
  assert.equal(validation.validateStatus(status, inventory), true);
  assert.equal(status.formalPublicationMilestones.filter((row) => row.earned).length, 9);
  assert.equal(status.formalPublicationMilestones.filter((row) => !row.earned).length, 3);
});

test('null publication fingerprints never match null', () => {
  const forged = structuredClone(status);
  forged.concretePublicationGate.passed = true;
  for (const key of Object.keys(forged.concretePublicationGate.subchecks)) {
    forged.concretePublicationGate.subchecks[key] = true;
  }
  assert.equal(validation.deriveGateSubchecks(forged, inventory).concreteTargetKernelTypeFingerprintMatches, false);
  assert.equal(validation.deriveGateSubchecks(forged, inventory).sourceClosureFingerprintMatches, false);
  assert.equal(validation.validateConcreteGate(forged, inventory), false);
  assert.equal(validation.validateStatus(forged, inventory), false);
});

test('abstract bridge and historical/checker fields cannot activate publication', () => {
  const forged = structuredClone(status);
  forged.abstractPEqualsNPPublicationEligible = true;
  forged.mathematicalTheoremEstablished = true;
  forged.publicTheoremEmissionAllowed = true;
  forged.finalTheoremReady = true;
  forged.historicalCheckerAccepted = true;
  forged.historicalActivationAccepted = true;
  assert.equal(validation.validateStatus(forged, inventory), false);
});

test('secondary authority fields and blocker ledgers cannot overclaim', () => {
  for (const field of [
    'internalFinalTheoremReady',
    'unrestrictedFinalSoundnessDischarged',
    'uniformFinalSoundnessProved',
    'checkerAcceptanceIsMathematicalProof',
    'externalReviewIsMathematicalPremise',
  ]) {
    const forged = structuredClone(status);
    forged[field] = true;
    assert.equal(validation.validateStatus(forged, inventory), false, field);
  }

  for (const [field, value] of [
    ['activeFinalNodeIds', ['forged-root']],
    ['remainingFormalObligations', []],
    ['remainingBlockers', []],
  ]) {
    const forged = structuredClone(status);
    forged[field] = value;
    assert.equal(validation.validateStatus(forged, inventory), false, field);
  }
});

test('CNF-SAT milestone cannot be widened to InP, NP-completeness, or P = NP', () => {
  for (const field of [
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
    'rootLeanTheoremPresent',
  ]) {
    const forged = structuredClone(status);
    forged[field] = true;
    assert.equal(validation.validateStatus(forged, inventory), false, field);
  }

  const missingMembership = structuredClone(inventory);
  missingMembership.milestoneCandidates = missingMembership.milestoneCandidates
    .filter((candidate) => candidate.name !== 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP');
  assert.equal(validation.validateInventory(missingMembership), false);

  const assumedMembership = structuredClone(inventory);
  assumedMembership.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumedMembership), false);
});

test('pipeline bridge status cannot be widened to a complete compiler', () => {
  for (const field of [
    'leanConcretePipelineTerminalOutputPackingFormalized',
    'leanConcretePipelineRawRefinementFormalized',
  ]) {
    const forged = structuredClone(status);
    forged[field] = true;
    assert.equal(validation.validateStatus(forged, inventory), false, field);
  }

  for (const field of [
    'leanConcretePipelineStateNamespaceFormalized',
    'leanConcretePipelineStateNamespaceAxiomAuditPassed',
    'leanConcretePipelineStageBridgesFormalized',
    'leanConcretePipelineStageBridgesAxiomAuditPassed',
    'leanConcretePipelineStageLaunchFormalized',
    'leanConcretePipelineVerdictPreservationFormalized',
    'leanConcretePipelineInternalOutputHandoffComposed',
  ]) {
    const missing = structuredClone(status);
    missing[field] = false;
    assert.equal(validation.validateStatus(missing, inventory), false, field);
  }

  const assumedBridge = structuredClone(inventory);
  assumedBridge.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.PipelineStageBridges.workBoundedDecide_bridged_timeout_of_stuck_rawRunExact')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumedBridge), false);
});

test('browser loader pins the raw status bytes before parsing', () => {
  assert.match(source, /const STATUS_SHA256 = 'e7ea701580df8e60c9493a11c3cf80de2d698e926319b52896c0a83d7baf2419'/);
  assert.match(source, /statusResponse\.arrayBuffer\(\)/);
  assert.match(source, /if \(statusDigest !== STATUS_SHA256\) throw new Error/);
});

test('inventory drift and milestone overclaim fail closed', () => {
  const changedInventory = structuredClone(inventory);
  changedInventory.declarationCount += 1;
  assert.equal(validation.validateInventory(changedInventory), false);

  const changedStatus = structuredClone(status);
  changedStatus.formalPublicationMilestones[9].earned = true;
  assert.equal(validation.validateMilestones(changedStatus), false);
  assert.equal(validation.validateStatus(changedStatus, inventory), false);
});

test('static pages remain conservative and distinguish current from historical reports', () => {
  const homepage = readFileSync('index.html', 'utf8');
  const statusPage = readFileSync('status.html', 'utf8');
  const reportPage = readFileSync('paper.html', 'utf8');
  const verifyPage = readFileSync('verify.html', 'utf8');

  for (const page of [homepage, statusPage, reportPage, verifyPage]) {
    assert.match(page, /does not currently establish P = NP|does not claim P = NP|target theorem is not established/i);
  }
  assert.match(statusPage, /4,912/);
  assert.match(statusPage, /Nine scoped milestones/);
  assert.match(statusPage, /three global milestones/i);
  assert.match(statusPage, /PNP\.PEqualsNP/);
  assert.match(statusPage, /null never matches null/);
  assert.match(reportPage, /nine-page report generated from the compiled Lean inventory/i);
  assert.match(reportPage, /generated status payload is current publication-status authority/i);
  assert.doesNotMatch(reportPage, /report is the current publication-status authority/i);
  assert.match(reportPage, /56-page claim manuscript remains historical only/i);
  assert.match(verifyPage, /current inventory-derived PDF/i);
  assert.doesNotMatch(homepage, />Historical report</);
});
