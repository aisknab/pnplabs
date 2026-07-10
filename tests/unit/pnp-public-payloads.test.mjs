import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
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

test('site status is byte-for-byte identical to the merged authoritative sibling payload', { skip: siblingAvailable ? false : 'sibling pnp checkout unavailable; upstream-consistency CI performs the remote comparison' }, async () => {
  const site = await readText('public/pnp-status.json');
  const { stdout: source } = await execFileAsync('git', [
    '-C',
    fileURLToPath(siblingRepo),
    'show',
    'origin/main:public/pnp-status.json',
  ], { encoding: 'utf8' });
  assert.equal(site, source, 'mirror must follow merged upstream main, not unmerged sibling worktree changes');
});

test('current status exposes the incomplete formal reconstruction', async () => {
  const status = await readJson('public/pnp-status.json');
  assert.equal(status.kind, 'PNPFormalReconstructionStatus0');
  assert.equal(status.coordinate, 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-08');
  assert.equal(status.status, 'formal-reconstruction-in-progress');
  assert.equal(status.mathematicalTheoremEstablished, false);
  assert.equal(status.publicTheoremEmissionAllowed, false);
  assert.equal(status.publicTheoremStatement, null);
  assert.equal(status.publicTheoremConclusion, null);
  assert.equal(status.finalTheoremReady, false);
  assert.equal(status.satInPConclusionAccepted, false);
  assert.equal(status.pEqualsNPConclusionAccepted, false);
  assert.equal(status.rootLeanTheoremPresent, false);
  assert.equal(status.rootLeanTheoremBuilt, false);
  assert.equal(status.rootLeanTheoremAxiomAuditPassed, false);
  assert.equal(status.projectSpecificAxiomsRemaining, true);
  assert.equal(status.leanToolchain, 'leanprover/lean4:v4.31.0');
  assert.equal(status.leanCompilerVersion, '4.31.0');
  assert.equal(status.leanCompilerCommit, '68218e876d2a38b1985b8590fff244a83c321783');
  assert.equal(status.lakeVersion, '5.0.0-src+68218e8');
  assert.equal(status.elanVersion, '4.2.3');
  assert.equal(status.elanReleaseCommit, 'b6cec7e10fe4965a605aaf60d1cb4a5837f0462b');
  assert.equal(status.elanArchiveSha256, 'df0b2b3a439961ffcbb3985214365ffe40f49bc871df04dff268c7d8e21ca8b2');
  assert.equal(status.leanBuildTarget, 'PNP');
  assert.equal(status.leanRootModule, 'PNP');
  assert.equal(status.leanRootStatusDeclaration, 'PNP.Main.rootTheoremStatus');
  assert.equal(status.leanBuildConfigurationPinned, true);
  assert.equal(status.explicitLeanRootTargetPresent, true);
  assert.equal(status.leanLibraryTargetBuilt, true);
  assert.equal(status.leanSourcePlaceholderAuditPassed, true);
  assert.equal(status.leanNANDDirectWireCoreFormalized, true);
  assert.equal(status.leanNANDDirectWireCoreAxiomAuditPassed, true);
  assert.equal(status.leanNANDEnumeratorFormalized, true);
  assert.equal(status.leanNANDEnumeratorAxiomAuditPassed, true);
  assert.equal(status.leanNANDExactWidthEnumerationComplete, true);
  assert.equal(status.leanNANDEnumeratorUsesOrderedGatePairs, true);
  assert.equal(status.leanNANDEnumeratorIncludesUniqueEmptyOutputTuple, true);
  assert.equal(status.leanNANDEnumeratorDeduplicated, false);
  assert.equal(status.leanNANDTruthTableFormalized, true);
  assert.equal(status.leanNANDTruthTableAxiomAuditPassed, true);
  assert.equal(status.leanNANDSemanticEquivalenceDecidable, true);
  assert.equal(status.leanNANDMinimumAndSlackFormalized, true);
  assert.equal(status.leanNANDReferenceMinimumFormalized, true);
  assert.equal(status.leanNANDReferenceMinimumAxiomAuditPassed, true);
  assert.equal(status.leanNANDReferenceMinimumExhaustive, true);
  assert.equal(status.leanNANDReferenceMinimumScope, 'finite-boolean-direct-wire-empty-profile');
  assert.equal(status.leanNANDReferenceMinimumPolynomialRuntimeProved, false);
  assert.equal(status.leanNANDResidualSlackZeroIffMinimumFormalized, true);
  assert.equal(status.leanNANDCompositionFormalized, true);
  assert.equal(status.leanNANDCompositionAxiomAuditPassed, true);
  assert.equal(status.leanNANDFramedReplacementFormalized, true);
  assert.equal(status.leanNANDFramedGlobalSlackLawFormalized, true);
  assert.equal(status.leanNANDFramedSlackAxiomAuditPassed, true);
  assert.equal(status.leanNANDReplacementScope, 'concrete-serial-framed-context');
  assert.equal(status.leanLockedNANDDirectCandidatesFormalized, true);
  assert.equal(status.leanLockedNANDDirectAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDInternalMacroConstantsAbsent, true);
  assert.equal(status.leanDirectWireOutputLowerBoundFormalized, true);
  assert.equal(status.leanDirectWireBaselineAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDSourceDerivedCountsFormalized, true);
  assert.equal(status.leanLockedNANDBaselineAccountingFormalized, true);
  assert.equal(status.leanLockedNANDBaselineAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDConditionalSquareBaselineExactnessFormalized, true);
  assert.equal(status.leanLockedNANDLocalBaselineConditionsFormalized, true);
  assert.equal(status.leanLockedNANDLocalSquareBaselineExactnessFormalized, true);
  assert.equal(status.leanLockedNANDLocalBaselineAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDProofScope, 'typed-local-macros-source-derived-counts-and-five-local-square-baselines');
  assert.equal(status.leanLockedNANDConditionalThresholdBoundaryFormalized, true);
  assert.equal(status.leanLockedNANDConditionalResidualSlackAtMostFourFormalized, true);
  assert.equal(status.leanLockedNANDThresholdBoundaryAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDThresholdBoundaryScope, 'proof-bearing-typed-candidate-and-semantic-premises-only');
  assert.equal(status.leanLockedNANDThresholdBoundaryPremisesInstantiated, false);
  assert.equal(status.leanLockedNANDGlobalBaselineDistinctFormalized, false);
  assert.equal(status.leanLockedNANDCarrierLayoutFormalized, false);
  assert.equal(status.leanLockedNANDTraceEquivalenceFormalized, false);
  assert.equal(status.leanLockedNANDDerivedFinalOutputLawsFormalized, false);
  assert.equal(status.leanLockedNANDResidualSlackAtMostFourFormalized, false);
  assert.equal(status.leanLockedNANDPolynomialBuilderFormalized, false);
  assert.equal(status.leanCompatibleReplacementFormalized, false);
  assert.equal(status.leanGlobalSlackLawFormalized, false);
  assert.equal(status.leanLockedNANDBuilderFormalized, false);
  assert.equal(status.leanLockedNANDThresholdFormalized, false);
  assert.equal(status.lockedNANDOutputConvention, 'ordered-multi-output-baseline-coordinates-plus-final-coordinate');
  assert.equal(status.legacySyntheticLockedNANDM2FixtureStatus, 'quarantined-internally-inconsistent');
  assert.equal(status.legacySyntheticLockedNANDM2HonestBaseline, 86);
  assert.equal(status.legacySyntheticLockedNANDM2MetadataConsistentBaseline, 95);
  assert.equal(status.legacySyntheticLockedNANDM2StoredBaseline, 91);
  assert.equal(status.legacySyntheticLockedNANDM2HonestDisplayedGateCount, 90);
  assert.equal(status.legacySyntheticLockedNANDM2MetadataConsistentDisplayedGateCount, 99);
  assert.equal(status.legacySyntheticLockedNANDM2StoredDisplayedGateCount, 95);
  assert.deepEqual(status.lockedNANDThresholdHostileReviewLemmaInventory, [
    'DirectWireOutputLowerBound',
    'MacroDistinct',
    'TraceEquivalence',
    'ZeroOutputConvention',
    'FinalLockSeparation',
  ]);
  assert.deepEqual(status.leanLockedNANDThresholdPremiseInventory, [
    'baselineCandidate',
    'fullCandidate',
    'baselineConditions',
    'initialOutputsPreserved',
    'unsatisfiableFinalZero',
    'satisfiableFinalConditions',
  ]);
  assert.deepEqual(status.leanLockedNANDThresholdMissingInstantiationInventory,
    status.leanLockedNANDThresholdPremiseInventory);
  assert.equal(status.sorryOrAdmitInRootDependencyClosure, null);
  assert.deepEqual(status.projectSpecificAxiomInventory, [
    'PNP.SAT',
    'PNP.LockedNANDThreshold',
    'PNP.ResidualBandExactMinimization',
    'PNP.GeneratePCCPack',
    'PNP.CheckPCCPackexp',
  ]);
  assert.equal(status.checkerAcceptanceIsMathematicalProof, false);
  assert.equal(status.legacyCheckerStackStatus, 'historical-assertion-checker-evidence-only');
  assert.equal(status.externalReviewIsMathematicalPremise, false);
  assert.deepEqual(status.verificationCommands, [
    'node pcc-formal-reconstruction-status0.mjs --json',
    'node pcc-formal-public-surface0.mjs --json',
    'npm run legacy:v0:check',
    'npm run pnp:verify -- --no-write',
    'node --test audits/lean-root-target0.test.mjs',
    'node --test audits/lean-nand-semantics0.test.mjs',
    'node --test audits/lean-nand-enumerator0.test.mjs',
    'node --test audits/lean-nand-reference-minimum0.test.mjs',
    'node --test audits/lean-locked-nand-baseline0.test.mjs',
    'node --test audits/lean-locked-nand-threshold-boundary0.test.mjs',
    'lake build PNP',
    'lake env lean -DwarningAsError=true lean-audit/PNPBridgeAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPNANDSemanticsAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPNANDEnumeratorAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPNANDTruthTableAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPNANDMinimumAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPNANDCompositionAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPNANDSlackAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDDirectAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPDirectWireBaselineAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDBaselineAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDLocalBaselineAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDThresholdBoundaryAxiomAudit.lean',
  ]);
  assert.deepEqual(status.historicalReplayWorkflows, ['.github/workflows/legacy-v0-replay.yml']);
  assert.equal(status.legacyCheckerArchiveManifest, 'archive/legacy-v0/ARCHIVE.json');
  assert.equal(status.legacyCheckerArchiveCheckCommand, 'npm run legacy:v0:check');
  assert.equal(status.legacyCheckerReplayCommand, 'npm run legacy:v0:replay -- --output /tmp/pnp-legacy-v0-7072f8d');
  assert.equal(status.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-10-LOCKED-NAND-CONDITIONAL-THRESHOLD-BOUNDARY-08');
  assert.ok(status.nonClaims.includes('The formalized direct-wire NAND semantics layer does not by itself prove enumeration, minimum size, replacement/slack, the locked NAND builder, its threshold, SAT, or P = NP.'));
  assert.ok(status.nonClaims.includes('The exact-width syntactic NAND enumeration remains intentionally noncanonical and may contain duplicates.'));
  assert.ok(status.nonClaims.includes("The exhaustive direct-wire truth-table and reference-minimum computation has no polynomial-runtime claim and does not formalize the report's residual-band minimizer."));
  assert.ok(status.nonClaims.includes("Replacement and global slack are proved only for the concrete serial framed-context construction, not arbitrary support profiles or the report's locked-NAND family."));
  assert.ok(status.nonClaims.includes('The typed local locked-NAND candidates, source-derived accounting, conditional square-baseline theorem, and five discharged local square baselines do not prove global cross-instance BaselineDistinct, a locked builder or threshold, residual slack at most four, or polynomial runtime.'));
  assert.ok(status.nonClaims.includes('The report threshold word is multi-output: its baseline coordinates remain present alongside one final coordinate; a legacy single-output seed is not that construction.'));
  assert.ok(status.nonClaims.includes('The legacy synthetic m=2 fixture is quarantined as internally inconsistent: honest source-derived baseline/displayed counts are 86/90, metadata-consistent counts are 95/99, and stored hybrid counts are 91/95.'));
  assert.ok(status.nonClaims.some((entry) => entry.includes('is not the report threshold theorem')));
  assert.ok(status.nonClaims.some((entry) => entry.includes('conditional on that six-field premise package')));
  assert.ok(status.nonClaims.some((entry) => entry.includes('arbitrary satisfiable proposition and baseline natural number')));
  assert.equal(status.remainingFormalObligations.length, 7);
  assert.deepEqual(status.remainingBlockers, status.remainingFormalObligations);
  assert.equal(status.remainingBlockers.includes('Formal.PinnedLeanBuildAndRootTarget'), false);
});

test('current status inventories every active companion workflow', async () => {
  const status = await readJson('public/pnp-status.json');
  const names = (await readdir(new URL('../../.github/workflows/', import.meta.url)))
    .filter((name) => name.endsWith('.yml'))
    .sort()
    .map((name) => `.github/workflows/${name}`);

  assert.deepEqual([...status.activeCompanionWorkflows].sort(), names);
});

test('payload index mirrors the conservative boundary and labels legacy surfaces', async () => {
  const index = await readJson('public/pnp-index.json');
  assert.equal(index.version, 12);
  assert.equal(index.statusCoordinate, 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-08');
  assert.equal(index.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-10-LOCKED-NAND-CONDITIONAL-THRESHOLD-BOUNDARY-08');
  assert.equal(index.status, 'formal-reconstruction-status-payloads-ready');
  assert.equal(index.claimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(index.claimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(index.claimBoundary.publicTheoremStatement, null);
  assert.equal(index.claimBoundary.finalTheoremReady, false);
  assert.equal(index.claimBoundary.satInPConclusionAccepted, false);
  assert.equal(index.claimBoundary.pEqualsNPConclusionAccepted, false);
  assert.equal(index.claimBoundary.rootLeanTheoremPresent, false);
  assert.equal(index.claimBoundary.projectSpecificAxiomsRemaining, true);
  assert.equal(index.claimBoundary.leanLibraryTargetBuilt, true);
  assert.equal(index.claimBoundary.leanNANDDirectWireCoreFormalized, true);
  assert.equal(index.claimBoundary.leanNANDDirectWireCoreAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanNANDEnumeratorFormalized, true);
  assert.equal(index.claimBoundary.leanNANDEnumeratorAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanNANDExactWidthEnumerationComplete, true);
  assert.equal(index.claimBoundary.leanNANDEnumeratorUsesOrderedGatePairs, true);
  assert.equal(index.claimBoundary.leanNANDEnumeratorIncludesUniqueEmptyOutputTuple, true);
  assert.equal(index.claimBoundary.leanNANDEnumeratorDeduplicated, false);
  assert.equal(index.claimBoundary.leanNANDTruthTableFormalized, true);
  assert.equal(index.claimBoundary.leanNANDTruthTableAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanNANDSemanticEquivalenceDecidable, true);
  assert.equal(index.claimBoundary.leanNANDMinimumAndSlackFormalized, true);
  assert.equal(index.claimBoundary.leanNANDReferenceMinimumFormalized, true);
  assert.equal(index.claimBoundary.leanNANDReferenceMinimumAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanNANDReferenceMinimumExhaustive, true);
  assert.equal(index.claimBoundary.leanNANDReferenceMinimumScope, 'finite-boolean-direct-wire-empty-profile');
  assert.equal(index.claimBoundary.leanNANDReferenceMinimumPolynomialRuntimeProved, false);
  assert.equal(index.claimBoundary.leanNANDResidualSlackZeroIffMinimumFormalized, true);
  assert.equal(index.claimBoundary.leanNANDCompositionFormalized, true);
  assert.equal(index.claimBoundary.leanNANDCompositionAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanNANDFramedReplacementFormalized, true);
  assert.equal(index.claimBoundary.leanNANDFramedGlobalSlackLawFormalized, true);
  assert.equal(index.claimBoundary.leanNANDFramedSlackAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanNANDReplacementScope, 'concrete-serial-framed-context');
  assert.equal(index.claimBoundary.leanLockedNANDDirectCandidatesFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDDirectAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanLockedNANDInternalMacroConstantsAbsent, true);
  assert.equal(index.claimBoundary.leanDirectWireOutputLowerBoundFormalized, true);
  assert.equal(index.claimBoundary.leanDirectWireBaselineAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanLockedNANDSourceDerivedCountsFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDBaselineAccountingFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDBaselineAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanLockedNANDConditionalSquareBaselineExactnessFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDLocalBaselineConditionsFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDLocalSquareBaselineExactnessFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDLocalBaselineAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanLockedNANDProofScope, 'typed-local-macros-source-derived-counts-and-five-local-square-baselines');
  assert.equal(index.claimBoundary.leanLockedNANDConditionalThresholdBoundaryFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDConditionalResidualSlackAtMostFourFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDThresholdBoundaryAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanLockedNANDThresholdBoundaryScope, 'proof-bearing-typed-candidate-and-semantic-premises-only');
  assert.equal(index.claimBoundary.leanLockedNANDThresholdBoundaryPremisesInstantiated, false);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalBaselineDistinctFormalized, false);
  assert.equal(index.claimBoundary.leanLockedNANDCarrierLayoutFormalized, false);
  assert.equal(index.claimBoundary.leanLockedNANDTraceEquivalenceFormalized, false);
  assert.equal(index.claimBoundary.leanLockedNANDDerivedFinalOutputLawsFormalized, false);
  assert.equal(index.claimBoundary.leanLockedNANDResidualSlackAtMostFourFormalized, false);
  assert.equal(index.claimBoundary.leanLockedNANDPolynomialBuilderFormalized, false);
  assert.equal(index.claimBoundary.leanCompatibleReplacementFormalized, false);
  assert.equal(index.claimBoundary.leanGlobalSlackLawFormalized, false);
  assert.equal(index.claimBoundary.leanLockedNANDBuilderFormalized, false);
  assert.equal(index.claimBoundary.leanLockedNANDThresholdFormalized, false);
  assert.equal(index.claimBoundary.lockedNANDOutputConvention, 'ordered-multi-output-baseline-coordinates-plus-final-coordinate');
  assert.equal(index.claimBoundary.legacySyntheticLockedNANDM2FixtureStatus, 'quarantined-internally-inconsistent');
  assert.deepEqual([
    index.claimBoundary.legacySyntheticLockedNANDM2HonestBaseline,
    index.claimBoundary.legacySyntheticLockedNANDM2HonestDisplayedGateCount,
    index.claimBoundary.legacySyntheticLockedNANDM2MetadataConsistentBaseline,
    index.claimBoundary.legacySyntheticLockedNANDM2MetadataConsistentDisplayedGateCount,
    index.claimBoundary.legacySyntheticLockedNANDM2StoredBaseline,
    index.claimBoundary.legacySyntheticLockedNANDM2StoredDisplayedGateCount,
  ], [86, 90, 95, 99, 91, 95]);
  assert.deepEqual(index.claimBoundary.lockedNANDThresholdHostileReviewLemmaInventory, [
    'DirectWireOutputLowerBound',
    'MacroDistinct',
    'TraceEquivalence',
    'ZeroOutputConvention',
    'FinalLockSeparation',
  ]);
  assert.deepEqual(index.claimBoundary.leanLockedNANDThresholdMissingInstantiationInventory,
    index.claimBoundary.leanLockedNANDThresholdPremiseInventory);
  assert.deepEqual(index.claimBoundary.projectSpecificAxiomInventory, [
    'PNP.SAT',
    'PNP.LockedNANDThreshold',
    'PNP.ResidualBandExactMinimization',
    'PNP.GeneratePCCPack',
    'PNP.CheckPCCPackexp',
  ]);
  assert.equal(index.claimBoundary.remainingBlockers.length, 7);
  assert.equal(index.claimBoundary.remainingBlockers.includes('Formal.PinnedLeanBuildAndRootTarget'), false);
  assert.ok(index.verificationCommands.includes('node --test audits/lean-nand-semantics0.test.mjs'));
  assert.ok(index.verificationCommands.includes('node --test audits/lean-nand-enumerator0.test.mjs'));
  assert.ok(index.verificationCommands.includes('node --test audits/lean-nand-reference-minimum0.test.mjs'));
  assert.ok(index.verificationCommands.includes('node --test audits/lean-locked-nand-baseline0.test.mjs'));
  assert.ok(index.verificationCommands.includes('node --test audits/lean-locked-nand-threshold-boundary0.test.mjs'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPNANDSemanticsAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPNANDEnumeratorAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPNANDTruthTableAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPNANDMinimumAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPNANDCompositionAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPNANDSlackAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDDirectAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPDirectWireBaselineAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDBaselineAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDLocalBaselineAxiomAudit.lean'));
  assert.ok(index.verificationCommands.includes('lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDThresholdBoundaryAxiomAudit.lean'));
  assert.ok(index.nonClaims.some((entry) => entry.includes('five exact local square minima')));
  assert.ok(index.nonClaims.some((entry) => entry.includes('baseline coordinates plus one final coordinate')));
  assert.ok(index.nonClaims.some((entry) => entry.includes('86/90')));
  assert.ok(index.nonClaims.some((entry) => entry.includes('six typed semantic premises')));
  assert.ok(index.nonClaims.some((entry) => entry.includes('not an unconditional theorem')));
  assert.equal(index.historicalRunIntakeFrozen, true);
  assert.equal(index.payloads.find((entry) => entry.id === 'pnp-status').status, 'current');
  for (const id of ['pnp-one-command-upload', 'pnp-verification-runs', 'pnp-verifier-run-comparison-matrix', 'pnp-verifier-run-matrix-summary']) {
    assert.equal(index.payloads.find((entry) => entry.id === id).status, 'historical-frozen');
  }
});

test('status page shows every current false field and the remaining blockers', async () => {
  const html = await readText('status.html');
  for (const fragment of [
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'publicTheoremStatement = null',
    'finalTheoremReady = false',
    'rootLeanTheoremPresent = false',
    'rootLeanTheoremBuilt = false',
    'rootLeanTheoremAxiomAuditPassed = false',
    'projectSpecificAxiomsRemaining = true',
    'Seven obligations remain',
    'leanprover/lean4:v4.31.0',
    'Executable finite equivalence, minimum, and framed slack',
    'leanNANDSemanticEquivalenceDecidable = true',
    'leanNANDMinimumAndSlackFormalized = true',
    'leanNANDReferenceMinimumPolynomialRuntimeProved = false',
    'leanCompatibleReplacementFormalized = false',
    'concrete-serial-framed-context',
    'Typed candidates, source-derived counts, and five exact local minima',
    '10/10',
    'BaselineDistinct',
    'leanLockedNANDLocalSquareBaselineExactnessFormalized = true',
    'ordered-multi-output-baseline-coordinates-plus-final-coordinate',
    'leanLockedNANDGlobalBaselineDistinctFormalized = false',
    'leanLockedNANDBuilderFormalized = false',
    'leanLockedNANDThresholdFormalized = false',
    'leanLockedNANDResidualSlackAtMostFourFormalized = false',
    'leanLockedNANDPolynomialBuilderFormalized = false',
    '86/90',
    '95/99',
    '91/95',
    'Semantic deduction complete; six global premises uninstantiated',
    'baselineCandidate',
    'satisfiableFinalConditions',
    'leanLockedNANDConditionalThresholdBoundaryFormalized = true',
    'leanLockedNANDThresholdBoundaryPremisesInstantiated = false',
    'leanLockedNANDCarrierLayoutFormalized = false',
    'leanLockedNANDTraceEquivalenceFormalized = false',
    'leanLockedNANDDerivedFinalOutputLawsFormalized = false',
    'FinalLockSeparation',
    'not the report threshold theorem',
    'PNPNANDSemanticsAxiomAudit.lean',
    'PNPNANDEnumeratorAxiomAudit.lean',
    'PNPNANDTruthTableAxiomAudit.lean',
    'PNPNANDMinimumAxiomAudit.lean',
    'PNPNANDCompositionAxiomAudit.lean',
    'PNPNANDSlackAxiomAudit.lean',
    'PNPLockedNANDDirectAxiomAudit.lean',
    'PNPDirectWireBaselineAxiomAudit.lean',
    'PNPLockedNANDBaselineAxiomAudit.lean',
    'PNPLockedNANDLocalBaselineAxiomAudit.lean',
    'PNPLockedNANDThresholdBoundaryAxiomAudit.lean',
    'PNP.CheckPCCPackexp',
    'Formal.ResidualBandMinimizer',
    'Formal.RootTheoremAndAxiomAudit',
    'historical assertion-checker evidence',
  ]) assert.equal(html.includes(fragment), true, `missing status fragment: ${fragment}`);
});

test('older public-review payloads are explicitly superseded and non-authoritative', async () => {
  for (const path of [
    'public/pnp-public-review.json',
    'public/pnp-theorem-emission-gate.json',
    'public/pnp-external-review-status.json',
  ]) {
    const payload = await readJson(path);
    assert.equal(payload.historical, true, `${path}: historical flag`);
    assert.equal(payload.currentStatusAuthority, false, `${path}: authority flag`);
    assert.equal(payload.supersededBy, 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-01', `${path}: supersession coordinate`);
    assert.equal(payload.currentClaimBoundary.mathematicalTheoremEstablished, false, `${path}: theorem boundary`);
    assert.equal(payload.currentClaimBoundary.publicTheoremEmissionAllowed, false, `${path}: emission boundary`);
  }
});
