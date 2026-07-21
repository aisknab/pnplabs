import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CORE_COMMIT = '3a56b27add47f7991b670e6e0fb9bb302d78cd04';
const STATUS_COORDINATE = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-21-65';
const INVENTORY_COORDINATE = 'PNP-LEAN-THEOREM-INVENTORY-2026-07-21-65';
const INVENTORY_SHA256 = '84ba24b2779664619022bc89cacedbd030f3a1cbfebe944ad2ed81351c7191c5';

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
    ], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    assert.equal(site, source, `${path} must match pinned merged core commit`);
  }
});

test('current status binds the compiled inventory and fails the concrete gate closed', async () => {
  const status = await readJson('public/pnp-status.json');
  const inventoryBytes = await readBytes('public/pnp-theorem-inventory.json');
  const inventory = JSON.parse(inventoryBytes);

  assert.equal(status.kind, 'PNPFormalReconstructionStatus0');
  assert.equal(status.coordinate, STATUS_COORDINATE);
  assert.equal(status.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-21-COOK-LEVIN-BUILDER-FOURTH-CLAUSE-SECOND-LITERAL-PREFIX-64');
  assert.equal(status.formalPublicationMapCoordinate, 'PNP-FORMAL-PUBLICATION-MAP-2026-07-21-65');
  assert.equal(status.formalPublicationMapSha256, '491a24cbc52491f7faeded5cb7c28d99fe1716ac637e134685f6897f508059f7');
  assert.equal(status.leanSourceClosureSha256, '78a490d5d59cea47182bafb1875a24f1c2cd9d51ac1902cf108278d4c4373692');
  assert.equal(status.status, 'formal-reconstruction-in-progress');
  assert.equal(status.currentStatusAuthority, true);
  assert.equal(status.leanToolchain, 'leanprover/lean4:v4.31.0');

  assert.equal(inventory.kind, 'PNPLeanTheoremInventory0');
  assert.equal(inventory.coordinate, INVENTORY_COORDINATE);
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), INVENTORY_SHA256);
  assert.equal(status.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(status.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(inventory.declarationCount, 9661);
  assert.equal(inventory.theoremCount, 5173);
  assert.equal(inventory.assumptionFreeTheoremCount, 3215);
  assert.equal(inventory.excludedPrivateDeclarationCount, 3509);
  assert.equal(inventory.sourceClosureModuleCount, 85);
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
  const secondClausePaddingRunMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-padding-run');
  assert.equal(secondClausePaddingRunMilestone.requiredTheorems.length, 39);
  for (const theoremRow of secondClausePaddingRunMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.')
      ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
      : 'PNP.Concrete.CookLevinBuilderSecondClausePaddingRun', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  const thirdClauseSeparatorStepMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-separator-step');
  assert.equal(thirdClauseSeparatorStepMilestone.requiredTheorems.length, 40);
  for (const theoremRow of thirdClauseSeparatorStepMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep'
        : 'PNP.Concrete.CookLevinBuilderThirdClauseSeparatorStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  const thirdClauseFirstLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-first-literal-prefix');
  assert.equal(thirdClauseFirstLiteralPrefixMilestone.requiredTheorems.length, 58);
  for (const theoremRow of thirdClauseFirstLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderThirdClauseFirstLiteralPrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  const thirdClauseSecondLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-second-literal-prefix');
  assert.equal(thirdClauseSecondLiteralPrefixMilestone.requiredTheorems.length, 92);
  for (const theoremRow of thirdClauseSecondLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount, 145);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  const thirdClausePrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-prefix');
  assert.equal(thirdClausePrefixMilestone.requiredTheorems.length, 41);
  for (const theoremRow of thirdClausePrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderThirdClausePrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount, 57);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  const thirdClausePaddingRunMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-padding-run');
  assert.equal(thirdClausePaddingRunMilestone.requiredTheorems.length, 39);
  for (const theoremRow of thirdClausePaddingRunMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.')
      ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
      : 'PNP.Concrete.CookLevinBuilderThirdClausePaddingRun';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  const fourthClauseSeparatorStepMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-separator-step');
  assert.equal(fourthClauseSeparatorStepMilestone.requiredTheorems.length, 40);
  for (const theoremRow of fourthClauseSeparatorStepMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep'
        : 'PNP.Concrete.CookLevinBuilderFourthClauseSeparatorStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  const fourthClauseFirstLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-first-literal-prefix');
  assert.equal(fourthClauseFirstLiteralPrefixMilestone.requiredTheorems.length, 75);
  for (const theoremRow of fourthClauseFirstLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderFourthClauseFirstLiteralPrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  const fourthClauseSecondLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-second-literal-prefix');
  assert.equal(fourthClauseSecondLiteralPrefixMilestone.requiredTheorems.length, 92);
  for (const theoremRow of fourthClauseSecondLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderFourthClauseSecondLiteralPrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount, 147);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);

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
  assert.equal(inventory.milestoneCandidates.length, 1295);

  assert.equal(status.formalPublicationMilestones.length, 45);
  assert.deepEqual(status.formalPublicationMilestones.map((row) => row.earned), [...Array(42).fill(true), false, false, false]);
  for (const row of status.formalPublicationMilestones.slice(0, 42)) {
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
  assert.equal(secondClausePaddingRunMilestone.earned, true);
  assert.equal(thirdClausePaddingRunMilestone.earned, true);
  assert.equal(fourthClauseSeparatorStepMilestone.earned, true);
  assert.equal(fourthClauseSecondLiteralPrefixMilestone.earned, true);
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
  assert.equal(index.version, 48);
  assert.equal(index.sourceCommitRef, CORE_COMMIT);
  assert.equal(index.sourceProofCommitRef, 'e46ac7407301ed71483f34a5300e894557315863');
  assert.equal(index.sourceTree, 'b17cdd6861c91234de106474b7e5fa03277cb37f');
  assert.equal(index.statusCoordinate, STATUS_COORDINATE);
  assert.equal(index.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-21-COOK-LEVIN-BUILDER-FOURTH-CLAUSE-SECOND-LITERAL-PREFIX-64');
  assert.equal(index.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(index.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(index.canonicalReportCoordinate, 'PNP-CANONICAL-FORMAL-RECONSTRUCTION-REPORT-2026-07-21-65');
  assert.equal(index.canonicalReportPages, 41);
  assert.equal(index.formalPublicationRelease, '/downloads/formal-publication-release.json');
  assert.equal(index.status, 'formal-reconstruction-current-gate-closed');
  assert.equal(index.claimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(index.claimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(index.claimBoundary.publicTheoremStatement, null);
  assert.equal(index.claimBoundary.abstractPEqualsNPPublicationEligible, false);
  assert.equal(index.claimBoundary.publicationStatusDerivedOnlyFromConcreteGate, true);
  assert.equal(index.claimBoundary.concretePublicationGatePassed, false);
  assert.equal(index.claimBoundary.leanTheoremInventoryDeclarationCount, 9661);
  assert.equal(index.claimBoundary.leanTheoremInventoryTheoremCount, 5173);
  assert.equal(index.claimBoundary.leanTheoremInventoryAssumptionFreeTheoremCount, 3215);
  assert.equal(index.claimBoundary.leanTheoremInventoryExcludedPrivateDeclarationCount, 3509);
  assert.equal(index.claimBoundary.leanTheoremInventorySourceClosureModuleCount, 85);
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
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunRawTimePolynomial, /countEvaluator\.workSteps/);
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunRuleCount, /^2150 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunPaddingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_padding_run');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenBits_eq_encodedFormula_secondClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingCountTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_seven');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenSlot_eq_thirdClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectSeparatorTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_direct_eq_sep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRawTimePolynomial, 'BuilderSecondClausePaddingRun.rawTimeBound + 330 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRuleCount, /^2272 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepSeparatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_separator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenBits_eq_encodedFormula_thirdClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenSlot_eq_thirdClauseStart_add_one');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.nextTokenSlot_direct_eq_f');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixWorkTime, 'BuilderThirdClauseSeparatorStep.workSteps(problem) + 1 + BuilderThirdClauseFirstLiteralPrefix.suffixWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRawTimePolynomial, 'BuilderThirdClauseSeparatorStep.rawTimeBound + 732 + 48 * inputLength + 24 * FormulaWidth + 24 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRuleCount, /^2516 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 58);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_three');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixSignTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount, 145);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixWorkTime, 'BuilderThirdClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderThirdClauseSecondLiteralPrefix.suffixWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRawTimePolynomial, 'BuilderThirdClauseFirstLiteralPrefix.rawTimeBound + 1752 + 96 * inputLength + 48 * FormulaWidth + 48 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRuleCount, /^3004 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 92);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFirstUnarySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixSecondUnarySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_seven');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixSignTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFirstUnaryTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixSecondUnaryTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount, 57);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixWorkTime, 'BuilderThirdClauseSecondLiteralPrefix.workSteps(problem) + 1 + appenderWorkSteps(problem) + 1 + cursorWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixRawTimePolynomial, 'BuilderThirdClauseSecondLiteralPrefix.rawTimeBound + 498 + 24 * inputLength + 12 * FormulaWidth + 12 * BuilderThirdClauseSeparatorStep.cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixRuleCount, /^3126 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.thirdClauseTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenBits_eq_encodedFormula_thirdClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenSlot_eq_thirdClauseStart_add_eight');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.clauseTerminatorSlot_direct_eq_finish');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.nextTokenSlot_direct_eq_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixFinishTokenCursorRulesLengthTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rules_length');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunRawTimePolynomial, /countEvaluator\.workSteps/);
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunRuleCount, /^3178 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunPaddingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_padding_run');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunTargetSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_target_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenBits_eq_encodedFormula_thirdClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingCountTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_eight');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenSlot_eq_fourthClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunDirectSeparatorTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_direct_eq_sep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepWorkTime, 'BuilderThirdClausePaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, thirdClauseTokens problem) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRawTimePolynomial, 'BuilderThirdClausePaddingRun.rawTimeBound + 426 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRuleCount, /^3300 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepSeparatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_separator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.fourthClauseStartTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenBits_eq_encodedFormula_fourthClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenSlot_eq_fourthClauseStart_add_one');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.nextTokenSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepPredecessorDeadStepTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixWorkTime, 'BuilderFourthClauseSeparatorStep.workSteps(problem) + 1 + BuilderFourthClauseFirstLiteralPrefix.suffixWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRawTimePolynomial, 'BuilderFourthClauseSeparatorStep.rawTimeBound + 1422 + 72 * inputLength + 36 * FormulaWidth + 36 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRuleCount, /^3666 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 75);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixUnaryUnitSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_unaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_four');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixSuffixRulesLengthTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixPredecessorDeadStepTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount, 147);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixWorkTime, 'BuilderFourthClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderFourthClauseSecondLiteralPrefix.suffixWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRawTimePolynomial, 'BuilderFourthClauseFirstLiteralPrefix.rawTimeBound + 2232 + 96 * inputLength + 48 * FormulaWidth + 48 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRuleCount, /^4154 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 92);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixSecondUnaryUnitSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_eight');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixSuffixRulesLengthTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixPredecessorDeadStepTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixProjectAxiomClosure, []);
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
  assert.deepEqual(index.formalPublicationMilestoneCounts, { earned: 42, notFormalized: 3, total: 45 });
  assert.equal(index.earnedMilestones.length, 42);
  assert.ok(index.earnedMilestones.includes('concrete-cnf-universal-verifier'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-raw-tape-bridge'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-size'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-schedule'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-cursor'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-fourth-clause-separator-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-fourth-clause-first-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-fourth-clause-second-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-input-length'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-input-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-token-appender'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-third-clause-first-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-third-clause-second-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-third-clause-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-third-clause-padding-run'));
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
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-padding-run'));
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
    'node --test audits/lean-concrete-cook-levin-builder-third-clause-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderThirdClausePrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderThirdClausePrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-third-clause-padding-run0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderThirdClausePaddingRunAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderThirdClausePaddingRun.lean',
    'node --test audits/lean-concrete-cook-levin-builder-fourth-clause-separator-step0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFourthClauseSeparatorStep.lean',
    'node --test audits/lean-concrete-cook-levin-builder-fourth-clause-first-literal-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFourthClauseFirstLiteralPrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-fourth-clause-second-literal-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFourthClauseSecondLiteralPrefix.lean',
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
    'Compiled Lean inventory · 2026-07-21',
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'publicTheoremStatement = null',
    'concretePublicationGate.passed = false',
    '9,661',
    '5,173',
    '3,215',
    '<strong>3,509</strong> private compiler auxiliaries excluded',
    '<strong>85</strong> modules',
    'Forty-two scoped milestones',
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
    'BuilderSecondClausePaddingRun.workRunExact',
    'C - 7',
    'V + 1 + 2*C',
    '2150',
    'BuilderThirdClauseSeparatorStep.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 20))',
    'BuilderSecondClausePaddingRun.rawTimeBound + 330',
    '2272',
    'BuilderThirdClauseFirstLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 22))',
    'thirdClauseStart + 3',
    'BuilderThirdClauseSeparatorStep.rawTimeBound + 732',
    '2516',
    'BuilderThirdClauseSecondLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 26))',
    'thirdClauseStart + 7',
    'BuilderThirdClauseFirstLiteralPrefix.rawTimeBound + 1752',
    '3004',
    'BuilderThirdClausePrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 27))',
    'thirdClauseStart + 8',
    'BuilderThirdClauseSecondLiteralPrefix.rawTimeBound + 498',
    '3126',
    'BuilderThirdClausePaddingRun.workRunExact',
    'FormulaTokensPerClause - 8',
    'FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause',
    '3178',
    'BuilderFourthClauseSeparatorStep.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 28))',
    'FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause + 1',
    'BuilderThirdClausePaddingRun.rawTimeBound + 426',
    '3300',
    'BuilderFourthClauseFirstLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 31))',
    'FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause + 4',
    'BuilderFourthClauseSeparatorStep.rawTimeBound + 1422',
    '3666',
    'BuilderFourthClauseSecondLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 35))',
    'FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause + 8',
    'BuilderFourthClauseFirstLiteralPrefix.rawTimeBound + 2232',
    '4154',
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
  assert.equal((html.match(/data-earned="true"/g) || []).length, 42);
  assert.equal((html.match(/data-earned="false"/g) || []).length, 3);
});

test('static inventory prose matches the compiled declaration boundary', async () => {
  const paper = await readText('paper.html');
  const guide = await readText('docs/reviewer_guide.md');
  const reproducibility = await readText('docs/reproducibility.md');
  assert.equal(paper.includes('Three thousand five hundred nine private compiler auxiliaries are excluded.'), true);
  assert.equal(guide.includes('Three thousand five hundred nine private compiler auxiliaries are excluded explicitly.'), true);
  for (const fragment of ['348,387', '93,070', '984,156', '6,615,591', 'forty-one A4 pages']) {
    assert.equal(reproducibility.includes(fragment), true, `missing reproducibility fragment: ${fragment}`);
  }
  assert.equal(reproducibility.includes('twenty A4 pages'), false);
  assert.equal(paper.includes('One thousand and thirty-five'), false);
  assert.equal(guide.includes('One thousand and thirty-five'), false);
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
