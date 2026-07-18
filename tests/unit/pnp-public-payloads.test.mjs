import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CORE_COMMIT = '151e25f791def55a7855b20bd805cfb088c4d853';
const STATUS_COORDINATE = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-19-56';
const INVENTORY_COORDINATE = 'PNP-LEAN-THEOREM-INVENTORY-2026-07-19-56';
const INVENTORY_SHA256 = '37430f2e076d381bf8014f60a1caf7dee4ecbec518e7c792029892d75211dd0e';

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
  assert.equal(status.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-19-COOK-LEVIN-BUILDER-SECOND-CLAUSE-PREFIX-55');
  assert.equal(status.formalPublicationMapCoordinate, 'PNP-FORMAL-PUBLICATION-MAP-2026-07-19-56');
  assert.equal(status.formalPublicationMapSha256, 'f842ba06fc032cc364ecb26405936b9cc40ed1dc2057b441db6335341d431412');
  assert.equal(status.leanSourceClosureSha256, 'bdc976391d9229224a6e006452af9aa6422a0ec2a5a40ae37e096e3b0b393f8e');
  assert.equal(status.status, 'formal-reconstruction-in-progress');
  assert.equal(status.currentStatusAuthority, true);
  assert.equal(status.leanToolchain, 'leanprover/lean4:v4.31.0');

  assert.equal(inventory.kind, 'PNPLeanTheoremInventory0');
  assert.equal(inventory.coordinate, INVENTORY_COORDINATE);
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), INVENTORY_SHA256);
  assert.equal(status.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(status.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(inventory.declarationCount, 8473);
  assert.equal(inventory.theoremCount, 4267);
  assert.equal(inventory.assumptionFreeTheoremCount, 3013);
  assert.equal(inventory.excludedPrivateDeclarationCount, 2779);
  assert.equal(inventory.sourceClosureModuleCount, 76);
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
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialAuditedDeclarationCount, 74);
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount, 84);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixAuditedDeclarationCount, 60);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount, 74);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderDynamicCursorFormalized, false);
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized, false);
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
  const completeHeaderMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-complete-header');
  assert.equal(completeHeaderMilestone.requiredTheorems.length, 48);
  for (const theoremRow of completeHeaderMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.ok([
      'PNP.Concrete.CookLevinBuilderUnaryPolynomial',
      'PNP.Concrete.CookLevinBuilderCompleteHeader',
    ].includes(builder.module), theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const bodyStartMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-body-start-prefix');
  assert.equal(bodyStartMilestone.requiredTheorems.length, 42);
  for (const theoremRow of bodyStartMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderBodyStartPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const firstLiteralMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-first-literal-prefix');
  assert.equal(firstLiteralMilestone.requiredTheorems.length, 52);
  for (const theoremRow of firstLiteralMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderFirstLiteralPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const firstClauseMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-first-clause-prefix');
  assert.equal(firstClauseMilestone.requiredTheorems.length, 43);
  for (const theoremRow of firstClauseMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name === 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rule_source_ne_acceptState'
      ? 'PNP.Concrete.CookLevinBuilderFirstLiteralPrefix'
      : 'PNP.Concrete.CookLevinBuilderFirstClausePrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const dynamicCursorStepMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-dynamic-token-cursor-step');
  assert.equal(dynamicCursorStepMilestone.requiredTheorems.length, 31);
  for (const theoremRow of dynamicCursorStepMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const firstClausePaddingRunMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-first-clause-padding-run');
  assert.equal(firstClausePaddingRunMilestone.requiredTheorems.length, 48);
  for (const theoremRow of firstClausePaddingRunMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name === 'PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator'
      ? 'PNP.Concrete.CookLevinBuilderCompleteHeader'
      : 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount, 84);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized, true);
  const secondClauseSeparatorStepMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-separator-step');
  assert.equal(secondClauseSeparatorStepMilestone.requiredTheorems.length, 40);
  for (const theoremRow of secondClauseSeparatorStepMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  const secondClauseFirstLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-first-literal-prefix');
  assert.equal(secondClauseFirstLiteralPrefixMilestone.requiredTheorems.length, 58);
  for (const theoremRow of secondClauseFirstLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  const secondClauseSecondLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-second-literal-prefix');
  assert.equal(secondClauseSecondLiteralPrefixMilestone.requiredTheorems.length, 75);
  for (const theoremRow of secondClauseSecondLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  const secondClausePrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-prefix');
  assert.equal(secondClausePrefixMilestone.requiredTheorems.length, 41);
  for (const theoremRow of secondClausePrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondClausePrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount, 57);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized, false);

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
  assert.equal(inventory.milestoneCandidates.length, 841);

  assert.equal(status.formalPublicationMilestones.length, 36);
  assert.deepEqual(status.formalPublicationMilestones.map((row) => row.earned), [...Array(33).fill(true), false, false, false]);
  for (const row of status.formalPublicationMilestones.slice(0, 33)) {
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
  assert.equal(cursor.requiredTheorems.length, 16);
  assert.equal(builderMilestone.earned, true);
  assert.equal(builderPrefixMilestone.earned, true);
  assert.equal(builderTokenMilestone.earned, true);
  assert.equal(completeHeaderMilestone.earned, true);
  assert.equal(bodyStartMilestone.earned, true);
  assert.equal(firstLiteralMilestone.earned, true);
  assert.equal(secondClauseFirstLiteralPrefixMilestone.earned, true);
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
  assert.equal(index.version, 41);
  assert.equal(index.sourceCommitRef, CORE_COMMIT);
  assert.equal(index.sourceProofCommitRef, '54ae0f9d9ef7ede310b2a761832c1c404a913f51');
  assert.equal(index.sourceTree, 'b0194b3f98c24acc1b2b75b59edf5c69e1697b40');
  assert.equal(index.statusCoordinate, STATUS_COORDINATE);
  assert.equal(index.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-19-COOK-LEVIN-BUILDER-SECOND-CLAUSE-PREFIX-55');
  assert.equal(index.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(index.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(index.canonicalReportCoordinate, 'PNP-CANONICAL-FORMAL-RECONSTRUCTION-REPORT-2026-07-19-56');
  assert.equal(index.canonicalReportPages, 30);
  assert.equal(index.formalPublicationRelease, '/downloads/formal-publication-release.json');
  assert.equal(index.status, 'formal-reconstruction-current-gate-closed');
  assert.equal(index.claimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(index.claimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(index.claimBoundary.publicTheoremStatement, null);
  assert.equal(index.claimBoundary.abstractPEqualsNPPublicationEligible, false);
  assert.equal(index.claimBoundary.publicationStatusDerivedOnlyFromConcreteGate, true);
  assert.equal(index.claimBoundary.concretePublicationGatePassed, false);
  assert.equal(index.claimBoundary.leanTheoremInventoryDeclarationCount, 8473);
  assert.equal(index.claimBoundary.leanTheoremInventoryTheoremCount, 4267);
  assert.equal(index.claimBoundary.leanTheoremInventoryAssumptionFreeTheoremCount, 3013);
  assert.equal(index.claimBoundary.leanTheoremInventoryExcludedPrivateDeclarationCount, 2779);
  assert.equal(index.claimBoundary.leanTheoremInventorySourceClosureModuleCount, 76);
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
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinFormulaCursorTheoremKernelTypeSha256).length, 16);
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
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialAuditedDeclarationCount, 74);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialTheoremKernelTypeSha256).length, 10);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount, 84);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderTheoremKernelTypeSha256).length, 38);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixAuditedDeclarationCount, 60);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixAppenderComposed, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixTheoremKernelTypeSha256).length, 42);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.bodyStartTokens_eq_canonical_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixNextTokenCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_two');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount, 74);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixTheoremKernelTypeSha256).length, 52);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixCanonicalFormulaPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixNextTokenCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_four');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixSignSlotTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralSignSlotDirect_eq_t');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixZeroTerminatorSlotTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralZeroTerminatorSlotDirect_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixAuditedDeclarationCount, 79);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixCombinedAuditedDeclarationCount, 80);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixTheoremKernelTypeSha256).length, 43);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixCanonicalFormulaPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixNextTokenCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_twelve');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount, 47);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepTheoremKernelTypeSha256).length, 31);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.directOutcome_is_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenSlot_eq_formulaVariableSlotBound_add_thirteen');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount, 84);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunTheoremKernelTypeSha256).length, 48);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenSlot_eq_secondClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseSeparatorTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.secondClauseStart_direct_eq_sep');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunPredecessorTransportTheorem, 'PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepSeparatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_separator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.secondClauseStartTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.nextTokenSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepPredecessorDeadStepTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 58);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondClauseFirstLiteralTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseFirstLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_three');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixSignTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 75);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondClauseSecondLiteralTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseSecondLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_six');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixSignTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralUnaryUnitSlot_direct_eq_t');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount, 57);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixRawTimePolynomial, 'BuilderSecondClauseSecondLiteralPrefix.rawTimeBound + 390 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixRuleCount, /^2098 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.secondClauseTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenBits_eq_encodedFormula_secondClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenSlot_eq_secondClauseStart_add_seven');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.clauseTerminatorSlot_direct_eq_finish');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.nextTokenSlot_direct_eq_padding');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized, false);
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
  assert.deepEqual(index.formalPublicationMilestoneCounts, { earned: 33, notFormalized: 3, total: 36 });
  assert.equal(index.earnedMilestones.length, 33);
  assert.ok(index.earnedMilestones.includes('concrete-cnf-universal-verifier'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-raw-tape-bridge'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-size'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-schedule'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-cursor'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-input-length'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-input-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-token-appender'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-token-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-complete-header'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-body-start-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-clause-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-dynamic-token-cursor-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-clause-padding-run'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-separator-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-first-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-second-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-prefix'));
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
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderUnaryPolynomialAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderCompleteHeaderAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderCompleteHeader.lean',
    'node --test audits/lean-concrete-cook-levin-builder-first-clause-padding-run0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFirstClausePaddingRunAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFirstClausePaddingRun.lean',
    'node --test audits/lean-concrete-cook-levin-builder-second-clause-separator-step0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderSecondClauseSeparatorStep.lean',
    'node --test audits/lean-concrete-cook-levin-builder-second-clause-first-literal-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderSecondClauseFirstLiteralPrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-second-clause-second-literal-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderSecondClauseSecondLiteralPrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-second-clause-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderSecondClausePrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderSecondClausePrefix.lean',
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
    'Compiled Lean inventory · 2026-07-19',
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'publicTheoremStatement = null',
    'concretePublicationGate.passed = false',
    '8,473',
    '4,267',
    '3,013',
    '<strong>2,779</strong> private compiler auxiliaries excluded',
    '<strong>76</strong> modules',
    'Thirty-three scoped milestones',
    'PNP.Concrete.FinalUniversalDesign.cnfSATInNP',
    'This does not prove CNF-SAT in P, NP-completeness, or P = NP.',
    'encodedFormula_mem_CNFSAT_iff_language',
    'formulaBitSchedule_emit_eq_encodedFormula',
    'BuilderTokenAppender.appendToken_workRunExact',
    '18*n*n + 87*n + 147',
    'BuilderCompleteHeader.workRunExact',
    'BuilderBodyStartPrefix.workRunExact',
    'BuilderFirstLiteralPrefix.workRunExact',
    'BuilderFirstClausePrefix.workRunExact',
    'BuilderDynamicTokenCursorStep.workRunExact',
    'BuilderFirstClausePaddingRun.workRunExact',
    'BuilderSecondClauseSeparatorStep.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 13))',
    'nextTokenSlot_direct_eq_f',
    '1366',
    'BuilderSecondClauseFirstLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 15))',
    'secondClauseStart + 3',
    '1610',
    'BuilderSecondClauseSecondLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 18))',
    'secondClauseStart + 6',
    '1976',
    'BuilderSecondClausePrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 19))',
    'secondClauseStart + 7',
    '2098',
    'FormulaTokensPerClause - 12',
    'T^FormulaWidth F Sep T F T T F T T T F Finish',
    'T^FormulaWidth F Sep T F T T F T T T F Finish Sep F F F T F',
    'T^FormulaWidth F Sep T F T T F T T T F Finish Sep F F F T F Finish',
    'formulaVariableSlotBound + 12',
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
  assert.equal((html.match(/data-earned="true"/g) || []).length, 33);
  assert.equal((html.match(/data-earned="false"/g) || []).length, 3);
});

test('static inventory prose matches the compiled declaration boundary', async () => {
  const paper = await readText('paper.html');
  const guide = await readText('docs/reviewer_guide.md');
  const reproducibility = await readText('docs/reproducibility.md');
  assert.equal(paper.includes('Two thousand seven hundred seventy-nine private compiler auxiliaries are excluded.'), true);
  assert.equal(guide.includes('Two thousand seven hundred seventy-nine private compiler auxiliaries are excluded explicitly.'), true);
  for (const fragment of ['321,299', '65,755', '615,627', '4,313,527', 'thirty A4 pages']) {
    assert.equal(reproducibility.includes(fragment), true, `missing reproducibility fragment: ${fragment}`);
  }
  assert.equal(reproducibility.includes('twenty A4 pages'), false);
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
