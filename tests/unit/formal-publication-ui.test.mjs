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
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), 'b8ea4ad0e08985129ef460b626e6822346907b0f90b789b51102757d80aa4a7e');
  assert.equal(validation.validateInventory(inventory), true);
  assert.equal(validation.validateMilestones(status), true);
  assert.equal(validation.validateConcreteGate(status, inventory), true);
  assert.equal(validation.validateStatus(status, inventory), true);
  assert.equal(status.formalPublicationMilestones.filter((row) => row.earned).length, 27);
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
  assert.equal(milestone.requiredTheorems.length, 13);

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

test('Cook-Levin first-token prefix requires all twenty-seven exact theorem rows and remains an incomplete builder', () => {
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

test('Cook-Levin first-clause prefix requires all forty-one exact theorem rows and remains dynamically incomplete', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-clause-prefix');
  assert.equal(milestone.requiredTheorems.length, 41);

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
  assert.match(source, /const STATUS_SHA256 = 'a5b97099c90d4696bef48d856571d53a836ba246d9545ebf210a19864fe2978d'/);
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
  assert.match(statusPage, /7,746/);
  assert.match(statusPage, /Twenty-seven scoped milestones/);
  assert.match(statusPage, /three global milestones/i);
  assert.match(statusPage, /PNP\.PEqualsNP/);
  assert.match(statusPage, /null never matches null/);
  assert.match(reportPage, /twenty-two-page report generated from the compiled Lean inventory/i);
  assert.match(reportPage, /generated status payload is current publication-status authority/i);
  assert.doesNotMatch(reportPage, /report is the current publication-status authority/i);
  assert.match(reportPage, /56-page claim manuscript remains historical only/i);
  assert.match(verifyPage, /current inventory-derived PDF/i);
  assert.doesNotMatch(homepage, />Historical report</);
});
