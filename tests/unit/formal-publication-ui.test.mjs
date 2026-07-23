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
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), '037b1bf13da821c60db27d887f32d0f1347072d9288bb21851d7fde525bffbd3');
  assert.equal(validation.validateInventory(inventory), true);
  assert.equal(validation.validateMilestones(status), true);
  assert.equal(validation.validateConcreteGate(status, inventory), true);
  assert.equal(validation.validateStatus(status, inventory), true);
  assert.equal(status.formalPublicationMilestones.filter((row) => row.earned).length, 53);
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

test('Cook-Levin semantic bridge requires its exact standard-axiom closure and cannot become a complexity claim', () => {
  const assumedBridge = structuredClone(inventory);
  assumedBridge.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language')
    .axioms = ['Classical.choice', 'PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumedBridge), false);

  const forgedMilestone = structuredClone(status);
  forgedMilestone.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-raw-tape-bridge')
    .theoremRows[0].axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateMilestones(forgedMilestone), false);
  assert.equal(validation.validateStatus(forgedMilestone, inventory), false);
});

test('Cook-Levin formula-size evidence is exact and cannot be widened into a reduction claim', () => {
  const missingFormulaSize = structuredClone(inventory);
  missingFormulaSize.milestoneCandidates = missingFormulaSize.milestoneCandidates
    .filter((candidate) => candidate.name !== 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le');
  assert.equal(validation.validateInventory(missingFormulaSize), false);

  const assumedFormulaSize = structuredClone(inventory);
  assumedFormulaSize.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumedFormulaSize), false);

  const forgedFingerprint = structuredClone(status);
  const forgedFormulaSize = forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-formula-size');
  forgedFormulaSize.theoremRows
    .find((row) => row.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le')
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of ['leanConcreteCNFNPCompletenessFormalized', 'leanConcreteCNFSATInPFormalized']) {
    const widenedClaim = structuredClone(status);
    widenedClaim[field] = true;
    assert.equal(validation.validateStatus(widenedClaim, inventory), false, field);
  }
});

test('Cook-Levin formula schedule requires exact emission, length, and approved axiom closure', () => {
  for (const name of [
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula',
  ]) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  const schedule = forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-formula-schedule');
  schedule.theoremRows
    .find((row) => row.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula')
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);
});

test('Cook-Levin formula cursor requires all direct lookups, exact traversal, and approved closure', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-formula-cursor');
  assert.equal(milestone.requiredTheorems.length, 16);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  const cursor = forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-formula-cursor');
  cursor.theoremRows
    .find((row) => row.name.endsWith('FormulaBitCursor.run_full'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);
});

test('Cook-Levin input-length builder requires all ten exact theorem rows and cannot become a complete reduction', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-input-length');
  assert.equal(milestone.requiredTheorems.length, 10);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderInputLength.workRunExact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-input-length')
    .theoremRows.find((row) => row.name.endsWith('.run_compile'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderInputLengthFormalized',
    'leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed',
    'leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized',
    'leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of ['leanConcreteCNFNPCompletenessFormalized', 'leanConcreteCNFSATInPFormalized']) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin executable builder prefix requires all fourteen exact theorem rows and cannot become a complete reduction', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-input-prefix');
  assert.equal(milestone.requiredTheorems.length, 14);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-input-prefix')
    .theoremRows.find((row) => row.name.endsWith('.run_compile_exact'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderInputPrefixFormalized',
    'leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized',
    'leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of ['leanConcreteCNFNPCompletenessFormalized', 'leanConcreteCNFSATInPFormalized']) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin token appender retains all seventeen independently audited theorem rows', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-token-appender');
  assert.equal(milestone.requiredTheorems.length, 17);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderTokenAppender.appendToken_workRunExact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-token-appender')
    .theoremRows.find((row) => row.name.endsWith('.firstHeaderToken_bits_eq_encodedFormula_take_two'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderTokenAppenderFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed',
    'leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const disconnected = structuredClone(status);
  disconnected.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed = false;
  assert.equal(validation.validateStatus(disconnected, inventory), false);
});

test('Cook-Levin first-token prefix requires all twenty-eight exact theorem rows and remains an incomplete builder', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-token-prefix');
  assert.equal(milestone.requiredTheorems.length, 25);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.workRunExact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-token-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_take_two'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstTokenPrefixFormalized',
    'leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin complete header requires all forty-eight evaluator/composition theorem rows and remains body-incomplete', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-complete-header');
  assert.equal(milestone.requiredTheorems.length, 48);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  for (const name of [
    'PNP.Concrete.CookLevin.BuilderUnaryPolynomial.workRunExact',
    'PNP.Concrete.CookLevin.BuilderCompleteHeader.workRunExact',
  ]) {
    const assumed = structuredClone(inventory);
    assumed.milestoneCandidates.find((candidate) => candidate.name === name).axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumed), false, name);
  }

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-complete-header')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_header'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderUnaryPolynomialFormalized',
    'leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed',
    'leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed',
    'leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin body-start prefix requires all forty-two exact theorem rows and remains dynamically incomplete', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-body-start-prefix');
  assert.equal(milestone.requiredTheorems.length, 42);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  for (const name of [
    'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact',
    'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTokenBits_eq_encodedFormula_bodyStart',
  ]) {
    const assumed = structuredClone(inventory);
    assumed.milestoneCandidates.find((candidate) => candidate.name === name).axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumed), false, name);
  }

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-body-start-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_bodyStart'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderBodyStartPrefixFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized',
    'leanConcreteCookLevinBuilderInputPrefixAppenderComposed',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin first-literal prefix requires all fifty-two exact theorem rows and remains dynamically incomplete', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 52);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  for (const name of [
    'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact',
    'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix',
    'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral',
  ]) {
    const assumed = structuredClone(inventory);
    assumed.milestoneCandidates.find((candidate) => candidate.name === name).axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumed), false, name);
  }

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_firstLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized',
    'leanConcreteCookLevinBuilderInputPrefixAppenderComposed',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount = 72;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin first-clause prefix requires all forty-four exact theorem rows and remains dynamically incomplete', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-clause-prefix');
  assert.equal(milestone.requiredTheorems.length, 43);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  for (const name of [
    'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact',
    'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix',
    'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause',
  ]) {
    const assumed = structuredClone(inventory);
    assumed.milestoneCandidates.find((candidate) => candidate.name === name).axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumed), false, name);
  }

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-clause-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_firstClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstClausePrefixFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized',
    'leanConcreteCookLevinBuilderInputPrefixAppenderComposed',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFirstClausePrefixAuditedDeclarationCount = 76;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin dynamic-token cursor step requires all thirty-one exact rows and cannot become a general cursor', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-dynamic-token-cursor-step');
  assert.equal(milestone.requiredTheorems.length, 31);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.specification_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-dynamic-token-cursor-step')
    .theoremRows.find((row) => row.name.endsWith('.directOutcome_is_padding'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount = 44;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin first-clause padding run requires all forty-eight exact rows and remains a bounded block', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 48);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.secondClauseStart_direct_eq_sep'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount = 83;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-clause separator step requires all forty exact rows and remains one fixed transition', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-separator-step');
  assert.equal(milestone.requiredTheorems.length, 40);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_separator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-separator-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_f'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin clause-two first literal requires all fifty-eight exact rows and remains one fixed literal prefix', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-first-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 58);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-first-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_secondClauseFirstLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount = 86;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin clause-two second literal requires all seventy-five exact rows and remains one fixed literal prefix', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-second-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 75);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-second-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_secondClauseSecondLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount = 114;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin complete clause-two prefix requires all forty-one exact rows and remains one fixed clause prefix', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-prefix');
  assert.equal(milestone.requiredTheorems.length, 41);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_terminator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_secondClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClausePrefixFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount = 56;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin clause-two padding run requires all thirty-nine exact rows and remains a no-emission boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.thirdClauseStart_direct_eq_sep'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin third-clause separator step requires all forty exact rows and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-separator-step');
  assert.equal(milestone.requiredTheorems.length, 40);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_separator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-separator-step')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClauseStart'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin clause-three first literal requires all fifty-eight exact rows and remains a two-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-first-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 58);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_sign_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-first-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount = 86;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin clause-three second literal requires all ninety-two exact rows and remains a four-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-second-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 92);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_sign_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-second-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount = 144;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin complete third clause requires all forty-one exact rows and remains padding-bounded', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-prefix');
  assert.equal(milestone.requiredTheorems.length, 41);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_terminator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClausePrefixFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount = 56;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin clause-three padding traversal requires all thirty-nine exact rows and remains no-emission bounded', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin fourth-clause separator step requires all forty exact rows and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-separator-step');
  assert.equal(milestone.requiredTheorems.length, 40);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_separator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-separator-step')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClauseStart'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin fourth-clause first-literal prefix requires all seventy-five exact rows and remains a one-literal boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-first-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 75);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_unaryUnit_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-first-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount = 114;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin fourth-clause second-literal prefix requires all ninety-two exact rows and remains a two-literal boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-second-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 92);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-second-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount = 146;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin complete fourth-clause prefix requires all forty-one exact rows and remains a padding boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-prefix');
  assert.equal(milestone.requiredTheorems.length, 41);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_terminator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClausePrefixFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClausePrefixAuditedDeclarationCount = 56;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin fourth-clause padding run requires all thirty-nine exact rows and remains a fifth-rectangle boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClausePaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin fifth-clause padding run requires all thirty-nine exact rows and remains a sixth-rectangle boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fifth-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fifth-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFifthClausePaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin first-constraint padding run requires all thirty-nine exact rows and remains a separator-observation boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-constraint-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);
  assert.match(milestone.nonClaim, /observes but does not emit that separator/);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-constraint-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint separator requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-separator-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the Sep beginning the second scheduled constraint/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 37\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is T/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following T/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_separator_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-separator-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal sign requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-sign-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the positive sign beginning the second scheduled constraint's first literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 38\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is the first unary T/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following unary T/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_sign_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-sign-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal first unary unit requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the first unary T of the second scheduled constraint's first variable index/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 39\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is the second unary T/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following second unary T/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_firstUnaryUnit_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal second unary unit requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the second unary T of the second scheduled constraint's first variable index/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 40\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is the third unary T/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following third unary T/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_secondUnaryUnit_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal third unary unit requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the third and final unary T of the second scheduled constraint's first variable index/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 41\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is the terminating F/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following terminating F/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.specification_thirdUnaryUnit_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_f'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal terminator requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-terminator-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the terminating F of the second scheduled constraint's first literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 42\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is Finish when tapeWidth is one and the positive T beginning the next literal at wider widths/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following Finish in the width-one case or the following positive T in wider cases/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.specification_terminator_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-terminator-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_finish_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal successor token requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits Finish exactly when tapeWidth is one and T at every wider width/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 43\)\)/u);
  assert.match(milestone.scope, /following opportunity is padding at width one and unary T at wider widths/u);
  assert.match(milestone.nonClaim, /emits exactly one width-selected token/u);
  assert.match(milestone.nonClaim, /does not emit the following padding opportunity at width one or unary T at wider widths/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.specification_successor_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step')
    .theoremRows.find((row) => row.name.endsWith('.followingTokenSlot_direct_eq_padding_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAuditedDeclarationCount = 81;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('recursive raw refinement cannot be stripped or separated from compiled evidence', () => {
  const strippedRefinement = structuredClone(status);
  strippedRefinement.leanConcretePipelineRawRefinementFormalized = false;
  assert.equal(validation.validateStatus(strippedRefinement, inventory), false, 'leanConcretePipelineRawRefinementFormalized');

  for (const field of [
    'leanConcretePipelineStateNamespaceFormalized',
    'leanConcretePipelineStateNamespaceAxiomAuditPassed',
    'leanConcretePipelineStageBridgesFormalized',
    'leanConcretePipelineStageBridgesAxiomAuditPassed',
    'leanConcretePipelineStageLaunchFormalized',
    'leanConcretePipelineVerdictPreservationFormalized',
    'leanConcretePipelineInternalOutputHandoffComposed',
    'leanConcretePipelineTerminalOutputPackingFormalized',
    'leanConcretePipelineTerminalOutputPackerAxiomAuditPassed',
    'leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized',
    'leanConcretePipelineTerminalBridgeAxiomAuditPassed',
    'leanConcretePipelineInputFramerAxiomAuditPassed',
    'leanConcretePipelineAllInputFramingFormalized',
    'leanConcretePipelinePairedCompilerAxiomAuditPassed',
    'leanConcretePipelineCanonicalPairCompilationFormalized',
    'leanConcretePipelineCompilerAxiomAuditPassed',
    'leanConcretePipelineAllInputCompilationFormalized',
    'leanConcretePipelineSequentialNamespaceFormalized',
    'leanConcretePipelineSequentialNamespaceAxiomAuditPassed',
    'leanConcretePipelineSequentialCompilationFormalized',
    'leanConcretePipelineSequentialCompilerAxiomAuditPassed',
    'leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized',
    'leanConcretePipelineSequentialExternalInputSizePolynomialFormalized',
    'leanConcretePipelineSequentialStuckFirstTimeoutFormalized',
    'leanConcretePipelineRefinementAxiomAuditPassed',
    'leanConcreteFunctionProgramRecursiveCompilationFormalized',
    'leanConcreteDecisionProgramRecursiveCompilationFormalized',
    'leanConcretePolynomialTimeDeciderRawCompilationFormalized',
    'standardComplexityModelFormalized',
    'leanConcretePipelineMalformedInputBehaviorFormalized',
    'leanConcretePipelineExternalInputSizePolynomialFormalized',
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

  const assumedPacker = structuredClone(inventory);
  assumedPacker.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumedPacker), false);

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount = 68;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  const assumedTerminalBridge = structuredClone(inventory);
  assumedTerminalBridge.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumedTerminalBridge), false);

  const removedTrace = structuredClone(status);
  removedTrace.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized = false;
  assert.equal(validation.validateStatus(removedTrace, inventory), false);

  const wrongFramerAuditCount = structuredClone(status);
  wrongFramerAuditCount.leanConcretePipelineInputFramerAuditedDeclarationCount = 69;
  assert.equal(validation.validateStatus(wrongFramerAuditCount, inventory), false);

  for (const theorem of [
    'PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact',
    'PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents',
    'PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound',
    'PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout',
  ]) {
    const assumedFramer = structuredClone(inventory);
    assumedFramer.milestoneCandidates
      .find((candidate) => candidate.name === theorem)
      .axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumedFramer), false, theorem);
  }

  const wrongPairedAuditCount = structuredClone(status);
  wrongPairedAuditCount.leanConcretePipelinePairedCompilerAuditedDeclarationCount = 27;
  assert.equal(validation.validateStatus(wrongPairedAuditCount, inventory), false);

  for (const theorem of [
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff',
  ]) {
    const assumedPairedCompiler = structuredClone(inventory);
    assumedPairedCompiler.milestoneCandidates
      .find((candidate) => candidate.name === theorem)
      .axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumedPairedCompiler), false, theorem);
  }

  const wrongCompilerAuditCount = structuredClone(status);
  wrongCompilerAuditCount.leanConcretePipelineCompilerAuditedDeclarationCount = 28;
  assert.equal(validation.validateStatus(wrongCompilerAuditCount, inventory), false);

  for (const theorem of [
    'PNP.Concrete.PipelineCompiler.pipeline_correct',
    'PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_ne_timeout',
    'PNP.Concrete.PipelineCompiler.pipeline_accepts_iff',
    'PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact',
  ]) {
    const assumedCompiler = structuredClone(inventory);
    assumedCompiler.milestoneCandidates
      .find((candidate) => candidate.name === theorem)
      .axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumedCompiler), false, theorem);
  }

  for (const theorem of [
    'PNP.Concrete.PipelineSequentialCompiler.sequential_correct',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact',
    'PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin',
    'PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq',
    'PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin',
    'PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq',
    'PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff',
  ]) {
    const assumedRecursiveCompiler = structuredClone(inventory);
    assumedRecursiveCompiler.milestoneCandidates
      .find((candidate) => candidate.name === theorem)
      .axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumedRecursiveCompiler), false, theorem);
  }
});

test('browser loader pins the raw status bytes before parsing', () => {
  assert.match(source, /const STATUS_SHA256 = '19a31a7f64aa1d84478a94d242d302f1a40bdde3507fe56ffaf610ca00094614'/);
  assert.match(source, /statusResponse\.arrayBuffer\(\)/);
  assert.match(source, /if \(statusDigest !== STATUS_SHA256\) throw new Error/);
});

test('inventory drift and milestone overclaim fail closed', () => {
  const changedInventory = structuredClone(inventory);
  changedInventory.declarationCount += 1;
  assert.equal(validation.validateInventory(changedInventory), false);

  const changedStatus = structuredClone(status);
  changedStatus.formalPublicationMilestones.find((row) => !row.earned).earned = true;
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
  assert.match(statusPage, /10,914/);
  assert.match(statusPage, /Fifty-three scoped milestones/);
  assert.match(statusPage, /three global milestones/i);
  assert.match(statusPage, /PNP\.PEqualsNP/);
  assert.match(statusPage, /null never matches null/);
  assert.match(reportPage, /current 54-page report is generated from the compiled Lean inventory/i);
  assert.match(reportPage, /Inventory first, report second/i);
  assert.doesNotMatch(reportPage, /report is the current publication-status authority/i);
  assert.match(reportPage, /56-page claim manuscript remains historical only/i);
  assert.match(verifyPage, /current inventory-derived PDF/i);
  assert.doesNotMatch(homepage, />Historical report</);
});
