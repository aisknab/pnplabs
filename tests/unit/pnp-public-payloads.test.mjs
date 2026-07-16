import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CORE_COMMIT = 'a09062d02e0c06704f57efe1bdb99024fbcfc618';
const STATUS_COORDINATE = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-16-46';
const INVENTORY_COORDINATE = 'PNP-LEAN-THEOREM-INVENTORY-2026-07-16-46';
const INVENTORY_SHA256 = '7ddd275e3094957ac3ed7a2c07deadb3d599883c6a2206f80e17b97eee848f30';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

async function readBytes(path) {
  return readFile(new URL(`../../${path}`, import.meta.url));
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

const siblingRepo = new URL('../../../pnp/', import.meta.url);
const siblingGit = new URL('.git', siblingRepo);
let siblingAvailable = true;
try {
  await access(siblingGit);
} catch {
  siblingAvailable = false;
}

test('status and inventory are byte-identical to the pinned merged core publication', { skip: siblingAvailable ? false : 'sibling pnp checkout unavailable; upstream-consistency CI performs the remote comparison' }, async () => {
  for (const path of ['public/pnp-status.json', 'public/pnp-theorem-inventory.json']) {
    const site = await readText(path);
    const { stdout: source } = await execFileAsync('git', [
      '-C', fileURLToPath(siblingRepo), 'show', `${CORE_COMMIT}:${path}`,
    ], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
    assert.equal(site, source, `${path} must match pinned merged core commit`);
  }
});

test('current status binds the compiled inventory and fails the concrete gate closed', async () => {
  const status = await readJson('public/pnp-status.json');
  const inventoryBytes = await readBytes('public/pnp-theorem-inventory.json');
  const inventory = JSON.parse(inventoryBytes);

  assert.equal(status.kind, 'PNPFormalReconstructionStatus0');
  assert.equal(status.coordinate, STATUS_COORDINATE);
  assert.equal(status.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-16-COOK-LEVIN-BUILDER-FIRST-TOKEN-PREFIX-45');
  assert.equal(status.formalPublicationMapCoordinate, 'PNP-FORMAL-PUBLICATION-MAP-2026-07-16-46');
  assert.equal(status.formalPublicationMapSha256, '52d594396203ab52f2e2d523f2f79b95315394dc5f2c0f78cdfe9b77095dac43');
  assert.equal(status.leanSourceClosureSha256, '575720b63a17efc574f1d89333e7996af1139d8fa224a027cac756c3808f42f3');
  assert.equal(status.status, 'formal-reconstruction-in-progress');
  assert.equal(status.currentStatusAuthority, true);
  assert.equal(status.leanToolchain, 'leanprover/lean4:v4.31.0');

  assert.equal(inventory.kind, 'PNPLeanTheoremInventory0');
  assert.equal(inventory.coordinate, INVENTORY_COORDINATE);
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), INVENTORY_SHA256);
  assert.equal(status.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(status.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(inventory.declarationCount, 7054);
  assert.equal(inventory.theoremCount, 3249);
  assert.equal(inventory.assumptionFreeTheoremCount, 2636);
  assert.equal(inventory.excludedPrivateDeclarationCount, 1355);
  assert.equal(inventory.sourceClosureModuleCount, 65);
  assert.equal(inventory.axiomCount, 4);
  assert.deepEqual(inventory.projectAxioms, [
    'PNP.CheckPCCPackexp',
    'PNP.GeneratePCCPack',
    'PNP.LockedNANDThreshold',
    'PNP.ResidualBandExactMinimization',
  ]);

  const gate = status.concretePublicationGate;
  assert.equal(status.abstractPEqualsNPPublicationEligible, false);
  assert.equal(status.publicationStatusDerivedOnlyFromConcreteGate, true);
  assert.equal(gate.abstractPEqualsNPIsPublicationIneligible, true);
  assert.equal(gate.unsetFingerprintIsIntentionalFailClosedMigrationGate, true);
  assert.equal(gate.expectedConcreteTargetKernelTypeSha256, null);
  assert.equal(gate.expectedSourceClosureSha256, null);
  assert.equal(gate.subchecks.concreteTargetKernelTypeFingerprintConfigured, false);
  assert.equal(gate.subchecks.concreteTargetKernelTypeFingerprintMatches, false);
  assert.equal(gate.subchecks.sourceClosureFingerprintConfigured, false);
  assert.equal(gate.subchecks.sourceClosureFingerprintMatches, false);
  assert.equal(gate.subchecks.concreteTargetPresent, true);
  assert.equal(inventory.concreteTargetCandidate?.name, 'PNP.Main.ConcretePEqualsNP');
  assert.equal(inventory.concreteTargetCandidate?.kind, 'definition');
  assert.deepEqual(inventory.concreteTargetCandidate?.axioms, []);
  assert.equal(gate.subchecks.compatibilityRootPresent, false);
  assert.equal(gate.passed, false);

  for (const key of [
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
    'finalTheoremReady',
    'satInPConclusionAccepted',
    'pEqualsNPConclusionAccepted',
    'rootLeanTheoremPresent',
    'rootLeanTheoremBuilt',
    'rootLeanTheoremAxiomAuditPassed',
  ]) assert.equal(status[key], false, key);
  assert.equal(status.publicTheoremStatement, null);
  assert.equal(status.publicTheoremConclusion, null);
  assert.equal(status.projectSpecificAxiomsRemaining, true);
  assert.deepEqual(status.projectSpecificAxiomInventory, inventory.projectAxioms);
  assert.equal(status.remainingBlockers.length, 6);
  assert.equal(status.leanConcreteCNFSATMembershipFormalized, true);
  assert.equal(status.leanConcreteCNFSATMembershipTheorem, 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP');
  assert.equal(status.leanConcreteCNFVerifierCorrectnessFormalized, true);
  assert.equal(status.leanConcreteCNFVerifierNoTimeoutFormalized, true);
  assert.equal(status.leanConcreteCNFWorkAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCNFWorkAuditedDeclarationCount, 766);
  assert.equal(status.leanConcretePipelineTerminalOutputPackingFormalized, true);
  assert.equal(status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount, 69);
  assert.equal(status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized, true);
  assert.equal(status.leanConcretePipelineTerminalBridgeAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineTerminalBridgeAuditedDeclarationCount, 59);
  assert.equal(status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized, true);
  assert.equal(status.leanConcretePipelineInputFramerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineInputFramerAuditedDeclarationCount, 70);
  assert.equal(status.leanConcretePipelineAllInputFramingFormalized, true);
  assert.equal(status.leanConcretePipelinePairedCompilerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelinePairedCompilerAuditedDeclarationCount, 28);
  assert.equal(status.leanConcretePipelineCanonicalPairCompilationFormalized, true);
  assert.equal(status.leanConcretePipelineCompilerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineCompilerAuditedDeclarationCount, 29);
  assert.equal(status.leanConcretePipelineAllInputCompilationFormalized, true);
  assert.equal(status.leanConcretePipelineMalformedInputBehaviorFormalized, true);
  assert.equal(status.leanConcretePipelineRawRefinementFormalized, true);
  assert.equal(status.leanConcretePipelineExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialNamespaceFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialNamespaceAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineSequentialNamespaceAuditedDeclarationCount, 26);
  assert.equal(status.leanConcretePipelineSequentialCompilationFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialCompilerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineSequentialCompilerAuditedDeclarationCount, 31);
  assert.equal(status.leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialStuckFirstTimeoutFormalized, true);
  assert.equal(status.leanConcretePipelineRefinementAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineRefinementAuditedDeclarationCount, 16);
  assert.equal(status.leanConcreteFunctionProgramRecursiveCompilationFormalized, true);
  assert.equal(status.leanConcreteDecisionProgramRecursiveCompilationFormalized, true);
  assert.equal(status.leanConcretePolynomialTimeDeciderRawCompilationFormalized, true);
  assert.equal(status.standardComplexityModelFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount, 39);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount, 40);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixAuditedDeclarationCount, 37);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderFormalized, false);
  assert.equal(gate.subchecks.standardComplexityModelEligible, true);
  assert.equal(status.leanConcreteCNFSATInPFormalized, false);
  assert.equal(status.leanConcreteCNFNPCompletenessFormalized, false);

  const membership = inventory.milestoneCandidates.find((candidate) => candidate.name === status.leanConcreteCNFSATMembershipTheorem);
  assert.equal(membership.kind, 'theorem');
  assert.equal(membership.module, 'PNP.Concrete.CNFWorkUniversalCorrectness');
  assert.deepEqual(membership.axioms, []);
  assert.equal(membership.kernelType, 'Lean.Expr.app (Lean.Expr.const `PNP.Concrete.InNP []) (Lean.Expr.const `PNP.Concrete.CNFSAT [])');

  const cookLevinBridge = inventory.milestoneCandidates.find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language');
  assert.equal(cookLevinBridge.kind, 'theorem');
  assert.equal(cookLevinBridge.module, 'PNP.Concrete.CookLevinRawTapeBridge');
  assert.deepEqual(cookLevinBridge.axioms, ['Classical.choice', 'Quot.sound', 'propext']);
  const formulaSize = inventory.milestoneCandidates.find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le');
  assert.equal(formulaSize.kind, 'theorem');
  assert.equal(formulaSize.module, 'PNP.Concrete.CookLevinFormulaSize');
  assert.deepEqual(formulaSize.axioms, ['Quot.sound', 'propext']);
  for (const name of [
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula',
  ]) {
    const schedule = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(schedule.kind, 'theorem', name);
    assert.equal(schedule.module, 'PNP.Concrete.CookLevinFormulaSchedule', name);
    assert.deepEqual(schedule.axioms, ['Quot.sound', 'propext'], name);
  }
  for (const absent of ['PNP.Concrete.cnfSATNPComplete', 'PNP.Concrete.cnfSATInP', 'PNP.Main.p_eq_np']) {
    assert.equal(inventory.milestoneCandidates.some((candidate) => candidate.name === absent), false, absent);
  }
  const builderMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-input-length');
  assert.equal(builderMilestone.requiredTheorems.length, 10);
  for (const theoremRow of builderMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderInputLength', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const builderPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-input-prefix');
  assert.equal(builderPrefixMilestone.requiredTheorems.length, 14);
  for (const theoremRow of builderPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderInputPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const builderTokenMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-token-appender');
  assert.equal(builderTokenMilestone.requiredTheorems.length, 17);
  for (const theoremRow of builderTokenMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderTokenAppender', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const firstTokenMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-first-token-prefix');
  assert.equal(firstTokenMilestone.requiredTheorems.length, 25);
  for (const theoremRow of firstTokenMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderFirstTokenPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }

  const packer = inventory.milestoneCandidates.find((candidate) => candidate.name === 'PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq');
  assert.equal(packer.kind, 'theorem');
  assert.equal(packer.module, 'PNP.Concrete.TerminalOutputPacker');
  assert.deepEqual(packer.axioms, []);
  const terminalBridge = inventory.milestoneCandidates.find((candidate) => candidate.name === 'PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents');
  assert.equal(terminalBridge.kind, 'theorem');
  assert.equal(terminalBridge.module, 'PNP.Concrete.PipelineTerminalBridge');
  assert.deepEqual(terminalBridge.axioms, []);
  for (const name of [
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff',
  ]) {
    const paired = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(paired.kind, 'theorem', name);
    assert.equal(paired.module, 'PNP.Concrete.PipelinePairedCompiler', name);
    assert.deepEqual(paired.axioms, [], name);
  }
  for (const name of [
    'PNP.Concrete.PipelineCompiler.pipeline_correct',
    'PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_ne_timeout',
    'PNP.Concrete.PipelineCompiler.pipeline_accepts_iff',
    'PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact',
  ]) {
    const compiler = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(compiler.kind, 'theorem', name);
    assert.equal(compiler.module, 'PNP.Concrete.PipelineCompiler', name);
    assert.deepEqual(compiler.axioms, [], name);
  }
  for (const name of [
    'PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact',
    'PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents',
    'PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted',
    'PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le',
    'PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound',
    'PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent',
    'PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept',
    'PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout',
  ]) {
    const framer = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(framer.kind, 'theorem', name);
    assert.equal(framer.module, 'PNP.Concrete.PipelineInputFramer', name);
    assert.deepEqual(framer.axioms, [], name);
  }
  for (const [name, module] of [
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_correct', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin', 'PNP.Concrete.PipelineRefinement'],
    ['PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq', 'PNP.Concrete.PipelineRefinement'],
    ['PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin', 'PNP.Concrete.PipelineRefinement'],
    ['PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq', 'PNP.Concrete.PipelineRefinement'],
    ['PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff', 'PNP.Concrete.PipelineRefinement'],
  ]) {
    const compiler = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(compiler.kind, 'theorem', name);
    assert.equal(compiler.module, module, name);
    assert.deepEqual(compiler.axioms, [], name);
  }
  assert.equal(inventory.milestoneCandidates.length, 365);

  assert.equal(status.formalPublicationMilestones.length, 26);
  assert.deepEqual(status.formalPublicationMilestones.map((row) => row.earned), [...Array(23).fill(true), false, false, false]);
  for (const row of status.formalPublicationMilestones.slice(0, 23)) {
    assert.equal(row.allPresent, true, row.id);
    assert.equal(row.allKernelTypesMatch, true, row.id);
    assert.equal(row.sourceClosureFingerprintMatches, true, row.id);
    assert.equal(row.theoremRows.every((theorem) => theorem.axioms.every((axiom) => ['Classical.choice', 'Quot.sound', 'propext'].includes(axiom))), true, row.id);
  }
  assert.equal(status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-tableau-cnf-semantics').allAssumptionFree, false);
  assert.equal(status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-raw-tape-bridge').allAssumptionFree, false);
  assert.equal(status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-formula-size').earned, true);
  assert.equal(status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-formula-schedule').earned, true);
  const cursor = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-formula-cursor');
  assert.equal(cursor.earned, true);
  assert.equal(cursor.requiredTheorems.length, 13);
  assert.equal(builderMilestone.earned, true);
  assert.equal(builderPrefixMilestone.earned, true);
  assert.equal(builderTokenMilestone.earned, true);
  assert.equal(status.formalPublicationMilestones.at(-1).nonClaim.includes('ineligible'), true);

  for (const command of [
    'lake build PNP',
    'node scripts/export-lean-theorem-inventory.mjs --check',
    'node scripts/generate-formal-publication.mjs --check',
    'npm run report:check',
  ]) assert.ok(status.verificationCommands.includes(command), command);
});

test('current status inventories publication workflows while PNPLabs operational audit remains separate', async () => {
  const status = await readJson('public/pnp-status.json');
  const operationalWorkflows = new Set(['production-deployment-consistency.yml']);
  const names = (await readdir(new URL('../../.github/workflows/', import.meta.url)))
    .filter((name) => name.endsWith('.yml'))
    .filter((name) => !operationalWorkflows.has(name))
    .sort()
    .map((name) => `.github/workflows/${name}`);
  assert.deepEqual([...status.activeCompanionWorkflows].sort(), names);
  assert.deepEqual([...operationalWorkflows], ['production-deployment-consistency.yml']);
});

test('payload index describes current inventory/report and quarantines legacy surfaces', async () => {
  const index = await readJson('public/pnp-index.json');
  assert.equal(index.version, 31);
  assert.equal(index.sourceCommitRef, CORE_COMMIT);
  assert.equal(index.sourceProofCommitRef, '88334f358c90beac4059de66d9329368a62a295c');
  assert.equal(index.sourceTree, 'd2787bc7bd78860b52308452bccadc18d1a686a5');
  assert.equal(index.statusCoordinate, STATUS_COORDINATE);
  assert.equal(index.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-16-COOK-LEVIN-BUILDER-FIRST-TOKEN-PREFIX-45');
  assert.equal(index.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(index.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(index.canonicalReportCoordinate, 'PNP-CANONICAL-FORMAL-RECONSTRUCTION-REPORT-2026-07-16-46');
  assert.equal(index.canonicalReportPages, 18);
  assert.equal(index.formalPublicationRelease, '/downloads/formal-publication-release.json');
  assert.equal(index.status, 'formal-reconstruction-current-gate-closed');
  assert.equal(index.claimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(index.claimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(index.claimBoundary.publicTheoremStatement, null);
  assert.equal(index.claimBoundary.abstractPEqualsNPPublicationEligible, false);
  assert.equal(index.claimBoundary.publicationStatusDerivedOnlyFromConcreteGate, true);
  assert.equal(index.claimBoundary.concretePublicationGatePassed, false);
  assert.equal(index.claimBoundary.leanTheoremInventoryDeclarationCount, 7054);
  assert.equal(index.claimBoundary.leanTheoremInventoryTheoremCount, 3249);
  assert.equal(index.claimBoundary.leanTheoremInventoryAssumptionFreeTheoremCount, 2636);
  assert.equal(index.claimBoundary.leanTheoremInventoryExcludedPrivateDeclarationCount, 1355);
  assert.equal(index.claimBoundary.leanTheoremInventorySourceClosureModuleCount, 65);
  assert.equal(index.claimBoundary.leanConcreteCNFSATMembershipFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStateNamespaceFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStateNamespaceAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStateNamespaceAuditedDeclarationCount, 39);
  assert.equal(index.claimBoundary.leanConcretePipelineStageBridgesFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStageBridgesAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStageBridgesAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcretePipelineStageLaunchFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineVerdictPreservationFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineInternalOutputHandoffComposed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackingFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount, 69);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalBridgeAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalBridgeAuditedDeclarationCount, 59);
  assert.equal(index.claimBoundary.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineInputFramerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineInputFramerAuditedDeclarationCount, 70);
  assert.equal(index.claimBoundary.leanConcretePipelineAllInputFramingFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelinePairedCompilerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelinePairedCompilerAuditedDeclarationCount, 28);
  assert.equal(index.claimBoundary.leanConcretePipelineCanonicalPairCompilationFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineCompilerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineCompilerAuditedDeclarationCount, 29);
  assert.equal(index.claimBoundary.leanConcretePipelineAllInputCompilationFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineMalformedInputBehaviorFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineRawRefinementFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineSequentialNamespaceFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineSequentialCompilerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineSequentialCompilerAuditedDeclarationCount, 31);
  assert.equal(index.claimBoundary.leanConcretePipelineRefinementAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineRefinementAuditedDeclarationCount, 16);
  assert.equal(index.claimBoundary.leanConcreteFunctionProgramRecursiveCompilationFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteDecisionProgramRecursiveCompilationFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePolynomialTimeDeciderRawCompilationFormalized, true);
  assert.equal(index.claimBoundary.standardComplexityModelFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinRawTapeBridgeFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinRawTapeBridgeAuditedDeclarationCount, 54);
  assert.equal(index.claimBoundary.leanConcreteCookLevinSemanticTheorem, 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinRawTapeBridgeAxiomClosure, ['Classical.choice', 'Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaSizeAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaSizeAuditedDeclarationCount, 108);
  assert.equal(index.claimBoundary.leanConcreteCookLevinEncodedFormulaSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinEncodedFormulaSizeTheorem, 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le');
  assert.equal(index.claimBoundary.leanConcreteCookLevinEncodedFormulaSizeKernelTypeSha256, 'c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaSizeAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaSizeProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleAuditedDeclarationCount, 79);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleAnswerIndependent, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleLengthTheorem, 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length');
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleLengthKernelTypeSha256, '7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4');
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleEmitTheorem, 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula');
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleEmitKernelTypeSha256, '2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaScheduleAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaScheduleProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleConstantTimeRawInterpretationFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinRawFormulaBuilderFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleRawRefinementFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorAuditedDeclarationCount, 129);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorDirectCoordinateLookupFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorNestedOptionSemanticsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorExactTraversalFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorExactLengthPolynomialFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinFormulaCursorTheoremKernelTypeSha256).length, 13);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorTheoremKernelTypeSha256['PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula'], '2637f4e27b2a6e40a7e774b10fac91d379daebe9ff6930c72de43ee23bd054d0');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaCursorAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaCursorProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorConstantTimeRawInterpretationFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorRawBuilderFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorRawRefinementFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount, 39);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthRuleCount, 19);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthWorkTimePolynomial, '2 * inputLength^2 + 4 * inputLength + 2');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthRawTimePolynomial, '12 * inputLength^2 + 24 * inputLength + 12');
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthTheoremKernelTypeSha256).length, 10);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixWorkTimePolynomial, 'totalInputFramerWorkSteps(input) + 1 + 2 * inputLength^2 + 4 * inputLength + 2');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixRawTimePolynomial, '18 * inputLength^2 + 63 * inputLength + 93');
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixTheoremKernelTypeSha256).length, 14);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixFormulaBitsEmittedFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixDirectCursorRawInterpretationFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixAuditedDeclarationCount, 37);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixRuleCount, 184);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixRawTimePolynomial, '18 * inputLength^2 + 87 * inputLength + 147');
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixTheoremKernelTypeSha256).length, 25);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderWorkTime, '2 * (max 1 inputLength + inputLength + priorTokenCount + 3)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderFirstTokenRawTimePolynomial, '24 * inputLength + 48');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderRuleCount, 59);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderTheoremKernelTypeSha256).length, 17);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderCompleteHeaderFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderDynamicCursorInterpretationFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFormulaBitsEmittedFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinCompleteRawFormulaBuilderFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaConstructionRuntimePolynomialFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinPolynomialReductionFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCNFSATInPFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCNFNPCompletenessFormalized, false);
  assert.equal(index.claimBoundary.remainingBlockers.length, 6);
  assert.deepEqual(index.formalPublicationMilestoneCounts, { earned: 23, notFormalized: 3, total: 26 });
  assert.equal(index.earnedMilestones.length, 23);
  assert.ok(index.earnedMilestones.includes('concrete-cnf-universal-verifier'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-raw-tape-bridge'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-size'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-schedule'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-cursor'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-input-length'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-input-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-token-appender'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-token-prefix'));
  assert.deepEqual(index.unearnedMilestones, ['global-locked-nand-threshold', 'global-zeroslack-pccmin', 'concrete-publication-root']);
  assert.equal(index.payloads.find((entry) => entry.id === 'pnp-status').status, 'current');
  assert.equal(index.payloads.find((entry) => entry.id === 'pnp-theorem-inventory').status, 'current');
  for (const id of ['pnp-one-command-upload', 'pnp-verification-runs', 'pnp-verifier-run-comparison-matrix', 'pnp-verifier-run-matrix-summary']) {
    assert.equal(index.payloads.find((entry) => entry.id === id).status, 'historical-frozen');
  }
  for (const command of [
    'lake build PNP',
    'npm run pnp:verify -- --no-write',
    'npm run formal:inventory:check',
    'npm run formal:publication:check',
    'npm run report:check',
    'node --test audits/lean-concrete-machine0.test.mjs',
    'node --test audits/lean-concrete-complexity0.test.mjs',
    'node --test audits/lean-concrete-cnf0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-raw-tape-bridge0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-formula-size0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-formula-schedule0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-formula-cursor0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-builder-input-length0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-builder-input-prefix0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-builder-token-appender0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-builder-first-token-prefix0.test.mjs',
    'node --test audits/lean-concrete-terminal-output-packer0.test.mjs',
    'node --test audits/lean-concrete-pipeline-terminal-bridge0.test.mjs',
    'node --test audits/lean-concrete-pipeline-paired-compiler0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteBitStringAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteMachineAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteComplexityAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteTerminalOutputPackerAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineTerminalBridgeAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelinePairedCompilerAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinRawTapeBridgeAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinFormulaSizeAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderInputLengthAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderInputPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderTokenAppenderAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFirstTokenPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinFormulaSize.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinFormulaScheduleAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinFormulaSchedule.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinFormulaCursorAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinFormulaCursor.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderInputPrefix.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderTokenAppender.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFirstTokenPrefix.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelinePairedCompiler.lean',
    'node --test audits/lean-concrete-pipeline-compiler0.test.mjs',
    'node --test audits/lean-concrete-pipeline-sequential-state-namespace0.test.mjs',
    'node --test audits/lean-concrete-pipeline-sequential-compiler0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineCompilerAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelineCompiler.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineSequentialStateNamespaceAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineSequentialCompilerAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelineSequentialCompiler.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelineRefinementRecursive.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteTargetAxiomAudit.lean',
  ]) {
    assert.ok(index.verificationCommands.includes(command), command);
  }
});

test('status page has a conservative complete static fallback', async () => {
  const html = await readText('status.html');
  for (const fragment of [
    'Compiled Lean inventory · 2026-07-16',
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'publicTheoremStatement = null',
    'concretePublicationGate.passed = false',
    '7,054',
    '3,249',
    '2,636',
    '<strong>1,355</strong> private compiler auxiliaries excluded',
    '<strong>65</strong> modules',
    'Twenty-three scoped milestones',
    'PNP.Concrete.FinalUniversalDesign.cnfSATInNP',
    'This does not prove CNF-SAT in P, NP-completeness, or P = NP.',
    'encodedFormula_mem_CNFSAT_iff_language',
    'formulaBitSchedule_emit_eq_encodedFormula',
    'BuilderTokenAppender.appendToken_workRunExact',
    '18*n*n + 87*n + 147',
    'three global milestones',
    'PNP.Main.ConcretePEqualsNP',
    'PNP.Main.p_eq_np',
    'null never matches null',
    'PNP.PEqualsNP',
    'Formal.ResidualBandMinimizer',
    'Formal.RootTheoremAndAxiomAudit',
    'PNP.CheckPCCPackexp',
    'Historical 56-page manuscript',
    '7072f8d0bda6d44d240f9bb3fad624fd357e1278',
  ]) assert.equal(html.includes(fragment), true, `missing status fragment: ${fragment}`);
  assert.equal((html.match(/data-earned="true"/g) || []).length, 23);
  assert.equal((html.match(/data-earned="false"/g) || []).length, 3);
});

test('static inventory prose matches the compiled declaration boundary', async () => {
  const paper = await readText('paper.html');
  const guide = await readText('docs/reviewer_guide.md');
  assert.equal(paper.includes('One thousand three hundred thirty-three private compiler auxiliaries are excluded.'), true);
  assert.equal(guide.includes('One thousand three hundred thirty-three private compiler auxiliaries are excluded explicitly.'), true);
  assert.equal(paper.includes('One thousand and thirty-two'), false);
  assert.equal(guide.includes('One thousand and thirty-two'), false);
});

test('older public-review payloads remain explicitly superseded and non-authoritative', async () => {
  for (const path of [
    'public/pnp-public-review.json',
    'public/pnp-theorem-emission-gate.json',
    'public/pnp-external-review-status.json',
  ]) {
    const payload = await readJson(path);
    assert.equal(payload.historical, true, `${path}: historical flag`);
    assert.equal(payload.currentStatusAuthority, false, `${path}: authority flag`);
    assert.equal(payload.currentClaimBoundary.mathematicalTheoremEstablished, false, `${path}: theorem boundary`);
    assert.equal(payload.currentClaimBoundary.publicTheoremEmissionAllowed, false, `${path}: emission boundary`);
  }
});
