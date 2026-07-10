import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('shared site script applies conservative formal-reconstruction copy', async () => {
  const script = await readText('assets/main.js');
  for (const fragment of [
    'FAIL_CLOSED_FORMAL_STATUS',
    'function isConservativeFormalStatus(payload)',
    'function ensureHomepageFormalReconstructionBoundary()',
    'The repository does not currently establish P = NP.',
    'function ensureFormalVerificationCopy()',
    'function ensureFormalFAQCopy()',
    'function ensureFormalReviewCopy()',
    'publicTheoremEmissionAllowed = false',
    'rootLeanTheoremPresent = false',
    'projectSpecificAxiomsRemaining = true',
    'leanprover/lean4:v4.31.0',
    'payload.leanNANDDirectWireCoreFormalized === true',
    'payload.leanNANDDirectWireCoreAxiomAuditPassed === true',
    'payload.leanNANDEnumeratorFormalized === true',
    'payload.leanNANDEnumeratorAxiomAuditPassed === true',
    'payload.leanNANDExactWidthEnumerationComplete === true',
    'payload.leanNANDEnumeratorDeduplicated === false',
    'payload.leanNANDTruthTableFormalized === true',
    'payload.leanNANDTruthTableAxiomAuditPassed === true',
    'payload.leanNANDSemanticEquivalenceDecidable === true',
    'payload.leanNANDReferenceMinimumFormalized === true',
    'payload.leanNANDReferenceMinimumPolynomialRuntimeProved === false',
    'payload.leanNANDFramedReplacementFormalized === true',
    'payload.leanCompatibleReplacementFormalized === false',
    'payload.leanLockedNANDDirectCandidatesFormalized === true',
    'payload.leanLockedNANDInternalMacroConstantsAbsent === true',
    'payload.leanDirectWireOutputLowerBoundFormalized === true',
    'payload.leanLockedNANDSourceDerivedCountsFormalized === true',
    'payload.leanLockedNANDLocalSquareBaselineExactnessFormalized === true',
    'payload.leanLockedNANDConditionalThresholdBoundaryFormalized === true',
    'payload.leanLockedNANDConditionalResidualSlackAtMostFourFormalized === true',
    'payload.leanLockedNANDThresholdBoundaryAxiomAuditPassed === true',
    'payload.leanLockedNANDThresholdBoundaryPremisesInstantiated === false',
    'payload.leanLockedNANDGlobalBaselineDistinctFormalized === false',
    'payload.leanLockedNANDCarrierLayoutFormalized === false',
    'payload.leanLockedNANDTraceEquivalenceFormalized === false',
    'payload.leanLockedNANDDerivedFinalOutputLawsFormalized === false',
    'payload.leanLockedNANDResidualSlackAtMostFourFormalized === false',
    'payload.leanLockedNANDPolynomialBuilderFormalized === false',
    'payload.leanResidualRoutesListedGainScanFormalized === true',
    'payload.leanResidualRoutesAxiomAuditPassed === true',
    'payload.leanResidualRoutesGainSoundnessFormalized === true',
    'payload.leanResidualRoutesStrictResidualDescentFormalized === true',
    'payload.leanResidualRoutesExactResultProofBearing === true',
    'payload.leanResidualRoutesZeroSlackResultProofBearing === true',
    'payload.leanResidualRoutesUnresolvedFailClosed === true',
    "payload.leanResidualRoutesScope === 'explicit-caller-supplied-finite-candidate-list'",
    'payload.leanResidualRoutesCandidateListCompletenessFormalized === false',
    'payload.leanResidualRoutesGlobalGainCompletenessFormalized === false',
    'payload.leanZeroSlackPositiveSlackContradictionFormalized === false',
    'payload.leanZeroSlackCompletenessFormalized === false',
    'payload.leanPCCMinLoopExactnessFormalized === false',
    'payload.leanPCCMinPolynomialRuntimeFormalized === false',
    'payload.leanResidualBandMinimizerFormalized === false',
    'payload.legacySyntheticLockedNANDM2HonestBaseline === 86',
    'payload.legacySyntheticLockedNANDM2MetadataConsistentBaseline === 95',
    'payload.legacySyntheticLockedNANDM2StoredBaseline === 91',
    'explicit-list gain scan checked',
    'positive-slack unresolved regression',
    'firstListedGain',
    'scanListedGains',
    'ExactMinimumResult',
    'ZeroSlackResult',
    'Candidate-list/global completeness',
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
    'PNPResidualRoutesAxiomAudit.lean',
    'five project-specific axioms remain',
    'JSON.stringify(payload.remainingBlockers) === JSON.stringify([',
    'activated verifier-run registry and automated submission workflow are frozen',
    'loadFormalReconstructionStatus();',
  ]) {
    assert.equal(script.includes(fragment), true, `missing formal-copy fragment: ${fragment}`);
  }
});

test('verify, FAQ, review, home, and status pages load the conservative shared script', async () => {
  for (const page of ['verify.html', 'faq.html', 'review.html', 'index.html', 'status.html']) {
    const html = await readText(page);
    assert.match(html, /<script src="assets\/main\.js" defer><\/script>/, `${page} must load assets/main.js`);
  }
});

test('status fetch fails closed before any request or validation succeeds', async () => {
  const script = await readText('assets/main.js');
  const initialFailClosed = script.indexOf("renderFormalStatus(root, FAIL_CLOSED_FORMAL_STATUS, 'fail-closed')");
  const fetchCall = script.indexOf("fetch('public/pnp-status.json'");
  assert.ok(initialFailClosed >= 0 && initialFailClosed < fetchCall, 'fail-closed state must render before fetch');
  assert.match(script, /if \(!response\.ok\) throw new Error/);
  assert.match(script, /if \(!isConservativeFormalStatus\(payload\)\) throw new Error/);
  assert.match(script, /PNP status load failed closed/);
});
