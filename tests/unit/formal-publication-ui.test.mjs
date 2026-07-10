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
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), '2636c9dc883d307304fafc7efcc4bfd02912cb3587ed762a13fd0758d603c966');
  assert.equal(validation.validateInventory(inventory), true);
  assert.equal(validation.validateMilestones(status), true);
  assert.equal(validation.validateConcreteGate(status, inventory), true);
  assert.equal(validation.validateStatus(status, inventory), true);
  assert.equal(status.formalPublicationMilestones.filter((row) => row.earned).length, 7);
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

test('browser loader pins the raw status bytes before parsing', () => {
  assert.match(source, /const STATUS_SHA256 = '39624ada2e5ba32fc199de2ff6248d2d45f69eeb0a4eb03caf4b0adea17c9b88'/);
  assert.match(source, /statusResponse\.arrayBuffer\(\)/);
  assert.match(source, /if \(statusDigest !== STATUS_SHA256\) throw new Error/);
});

test('inventory drift and milestone overclaim fail closed', () => {
  const changedInventory = structuredClone(inventory);
  changedInventory.declarationCount += 1;
  assert.equal(validation.validateInventory(changedInventory), false);

  const changedStatus = structuredClone(status);
  changedStatus.formalPublicationMilestones[7].earned = true;
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
  assert.match(statusPage, /2,168/);
  assert.match(statusPage, /Seven scoped milestones/);
  assert.match(statusPage, /three global milestones/i);
  assert.match(statusPage, /PNP\.PEqualsNP/);
  assert.match(statusPage, /null never matches null/);
  assert.match(reportPage, /six-page report generated from the compiled Lean inventory/i);
  assert.match(reportPage, /generated status payload is current publication-status authority/i);
  assert.doesNotMatch(reportPage, /report is the current publication-status authority/i);
  assert.match(reportPage, /56-page claim manuscript remains historical only/i);
  assert.match(verifyPage, /current inventory-derived PDF/i);
  assert.doesNotMatch(homepage, />Historical report</);
});
