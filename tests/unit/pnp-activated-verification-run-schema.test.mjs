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
  assert.equal(status.coordinate, 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-08-09-116');
  assert.equal(status.historicalActivatedStatusCoordinate, registry.historicalStatusPayload.coordinate);
  assert.equal(status.leanTheoremInventoryDeclarationCount, 25515);
  assert.equal(status.leanTheoremInventoryTheoremCount, 13564);
  assert.equal(status.leanTheoremInventoryAssumptionFreeTheoremCount, 7043);
  assert.equal(status.leanTheoremInventoryExcludedPrivateDeclarationCount, 14779);
  assert.equal(status.leanTheoremInventorySourceClosureModuleCount, 232);
  assert.equal(status.formalPublicationMilestones.length, 96);
  assert.equal(status.formalPublicationMilestones.filter((row) => row.earned).length, 93);
  assert.equal(status.formalPublicationMilestones.filter((row) => !row.earned).length, 3);
  assert.equal(status.leanResidualTerminalExecutableSaturationFormalized, true);
  assert.equal(status.leanResidualTerminalPhysicalSupportCompletionFormalized, true);
  assert.equal(status.leanResidualTerminalPhysicalSupportCompletionAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalSupportExtractionFormalized, true);
  assert.equal(status.leanResidualTerminalSupportExtractionAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalOpenSemanticsFormalized, true);
  assert.equal(status.leanResidualTerminalInducedRecoveryFormalized, true);
  assert.equal(status.leanResidualTerminalProperSupportFormalized, true);
  assert.equal(status.leanResidualTerminalProperSupportSearchCompleteFormalized, true);
  assert.equal(status.leanResidualTerminalProperSupportExactLocalGainFormalized, true);
  assert.equal(status.leanResidualTerminalProperSupportAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalProperSupportScope,
    'all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-canonical-primitive-record-seeds-with-exhaustive-reference-minimum-local-gain'
  );
  assert.equal(status.leanResidualTerminalSupportSquareClosureFormalized, true);
  assert.equal(status.leanResidualTerminalSupportSquareMeetJoinExactFormalized, true);
  assert.equal(status.leanResidualTerminalSupportSquarePhysicalCompatibilityFormalized, true);
  assert.equal(status.leanResidualTerminalSupportSquareSemanticExtractionFormalized, true);
  assert.equal(status.leanResidualTerminalSupportSquareClosureAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalSupportSquareClosureScope,
    'all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-pairs-of-finite-terminal-seeds'
  );
  assert.equal(status.leanResidualTerminalFrontierPushoutFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierBoundaryGlueExactFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierInterfaceGlueExactFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierProfileGlueExactFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierInternalizationFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierPushoutAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalProjectionSquareFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionPhysicalInvariantFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionProfileExactFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionMeetJoinCommuteFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionPushoutCommuteFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionSquareAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalSquareLegitimacyFormalized, true);
  assert.equal(status.leanResidualTerminalSquareStructuralCompatibilityFormalized, true);
  assert.equal(status.leanResidualTerminalSquareFrontierPushoutFormalized, true);
  assert.equal(status.leanResidualTerminalSquareSharedQuantityCarrierFormalized, true);
  assert.equal(status.leanResidualTerminalSquareLocalConclusionUnderRouteSilenceFormalized, true);
  assert.equal(status.leanResidualTerminalSquareFailClosedRouteDichotomyFormalized, true);
  assert.equal(status.leanResidualTerminalSquareLegitimacyAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalSquareLegitimacyScope,
    'all-finite-computed-terminal-support-squares-explicit-terminal-dependency-systems-direct-wire-candidates-observers-and-forgetful-projections-with-local-route-silence-or-proof-bearing-first-failure'
  );
  assert.equal(status.leanConcreteLockedNANDParserMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserAxiomAuditPassed, true);
  assert.equal(status.leanConcreteLockedNANDParserAuditedDeclarationCount, 380);
  assert.equal(status.leanConcreteLockedNANDParserAllInputExactFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserExactOutputFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserCompiledNonTimeoutFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserPolynomialTimeMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserRawRefinementFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterAxiomAuditPassed, true);
  assert.equal(status.leanConcreteLockedNANDEmitterAuditedDeclarationCount, 3295);
  assert.equal(status.leanConcreteLockedNANDEmitterAllInputExactFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterExactTargetBytesFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterRawRefinementFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterStrictParserCompositionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterOutputSizeBoundFormalized, true);
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCNFToNANDFiniteMachineFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialTimeFunctionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialReductionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount, 1316);
  assert.equal(status.leanConcreteCNFToNANDAllInputExactFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDExactMachineOutputFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDCompiledNonTimeoutFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDRawRefinementFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDDirectReductionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDLockedReductionCompositionFormalized, true);
  assert.equal(status.leanResidualGainChainVerifierFormalized, true);
  assert.equal(status.leanResidualGainChainAxiomAuditPassed, true);
  assert.equal(status.leanResidualGainChainSlackIterationBoundFormalized, true);
  assert.equal(status.leanResidualGainChainPolynomialRuntimeFormalized, false);
  assert.equal(status.leanResidualTerminalFullBridgeFormalized, true);
  assert.equal(status.leanResidualTerminalFullBridgeAxiomAuditPassed, true);
  assert.equal(status.leanResidualWholeSpanZeroAbsenceIffFormalized, true);
  assert.equal(status.leanResidualTerminalQuotientCarrierFormalized, true);
  assert.equal(status.leanResidualTerminalModeFirewallFormalized, true);
  assert.equal(status.leanResidualTerminalModeFirewallAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalProfileProjectionExactFormalized, true);
  assert.equal(status.leanResidualTerminalCheckedFullLiftFormalized, true);
  assert.equal(status.leanResidualTerminalQuotientEqualityNotConstructiveFormalized, true);
  assert.equal(status.leanResidualTerminalObligationDischargePreservedFormalized, true);
  assert.equal(status.leanResidualProjectionTransferFormalized, true);
  assert.equal(status.leanResidualProjectionTransferAxiomAuditPassed, true);
  assert.equal(status.leanResidualProjectionTransferSignedDeltasFormalized, true);
  assert.equal(status.leanResidualProjectionTransferIdentityFormalized, true);
  assert.equal(status.leanResidualProjectionTransferConstantCutFormalized, true);
  assert.equal(status.remainingBlockers.length, 6);
  assert.equal(status.projectSpecificAxiomInventory.length, 4);
  assert.equal(status.projectSpecificAxiomsRemaining, true);
  assert.equal(status.publicTheoremEmissionAllowed, false);
  assert.equal(status.mathematicalTheoremEstablished, false);
  assert.equal(status.rootLeanTheoremPresent, false);
  assert.equal(status.concretePublicationGate.passed, false);
});
