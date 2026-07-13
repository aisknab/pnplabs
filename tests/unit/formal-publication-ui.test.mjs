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
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), '59972a230221cd438cb08585a44c48f7c52d20aa025cd607daed2343fca18c81');
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

test('all-input compiler cannot be widened to recursive raw refinement or stripped of compiled evidence', () => {
  const forgedRefinement = structuredClone(status);
  forgedRefinement.leanConcretePipelineRawRefinementFormalized = true;
  assert.equal(validation.validateStatus(forgedRefinement, inventory), false, 'leanConcretePipelineRawRefinementFormalized');

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
});

test('browser loader pins the raw status bytes before parsing', () => {
  assert.match(source, /const STATUS_SHA256 = 'c02776e09bdd0f9cba4156306a0644905a2012053dbe4b087a7c65e133d9fcf9'/);
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
  assert.match(statusPage, /5,235/);
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
