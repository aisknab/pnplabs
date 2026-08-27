import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

const CONCEPT_STOP_WORDS = new Set([
  'about', 'after', 'again', 'against', 'being', 'could', 'does', 'every',
  'from', 'has', 'have', 'into', 'itself', 'milestone', 'only', 'original',
  'other', 'than', 'that', 'their', 'there', 'these', 'this', 'through',
  'under', 'where', 'which', 'with', 'without',
]);

function significantConcepts(value) {
  return [...new Set(
    value
      .replaceAll(/<[^>]*>/gu, ' ')
      .replaceAll(/&[a-z0-9#]+;/giu, ' ')
      .toLowerCase()
      .match(/[a-z0-9]+/gu)
      ?.filter((word) => word.length >= 5 && !CONCEPT_STOP_WORDS.has(word)) ?? []
  )];
}

function assertCanonicalConceptCoverage(actual, canonical, minimum, label) {
  const actualText = actual.toLowerCase();
  const concepts = significantConcepts(canonical);
  const present = concepts.filter((concept) => actualText.includes(concept));
  assert.ok(concepts.length > 0, `${label}: canonical record has no testable concepts`);
  assert.ok(
    present.length / concepts.length >= minimum,
    `${label}: expected at least ${Math.round(minimum * 100)}% canonical concept coverage; missing ${concepts.filter((concept) => !actualText.includes(concept)).join(', ')}`
  );
}

function latestMilestoneStatusFields(status, release, milestone) {
  const suffix = 'TheoremKernelTypeSha256';
  const requiredTheorems = new Set(milestone.requiredTheorems);
  const matchingField = Object.entries(release.earnedBoundary).find(
    ([key, value]) => key.endsWith(suffix)
      && value !== null
      && typeof value === 'object'
      && !Array.isArray(value)
      && Object.keys(value).length === requiredTheorems.size
      && [...requiredTheorems].every((name) => Object.hasOwn(value, name)),
  );
  assert.ok(matchingField, `missing earned-boundary fingerprint map for ${milestone.id}`);
  const releasePrefix = matchingField[0].slice(0, -suffix.length);
  const matchingScopeFields = Object.entries(release.earnedBoundary).filter(
    ([key]) => key.endsWith('Scope')
      && key.slice(0, -'Scope'.length).toLowerCase() === releasePrefix.toLowerCase(),
  );
  assert.equal(matchingScopeFields.length, 1, `expected one release scope field for ${milestone.id}`);
  const scope = matchingScopeFields[0][1];
  const scopeKeys = Object.keys(status).filter(
    (key) => key.startsWith('lean') && key.endsWith('Scope') && status[key] === scope,
  );
  assert.equal(scopeKeys.length, 1, `expected one status scope field for ${milestone.id}`);
  const stem = scopeKeys[0].slice(0, -'Scope'.length);
  return [`${stem}Formalized`, `${stem}AxiomAuditPassed`, `${stem}Scope`];
}

test('homepage leads with a plain, conservative result and the latest milestone', async () => {
  const [status, inventory, updates, release, proofProgress] = await Promise.all([
    readJson('public/pnp-status.json'),
    readJson('public/pnp-theorem-inventory.json'),
    readJson('content/milestone-updates.json'),
    readJson('downloads/formal-publication-release.json'),
    readJson('public/pnp-proof-progress.json'),
  ]);
  const latest = updates.entries[0];
  const latestMilestoneRecord = status.formalPublicationMilestones.find(
    (row) => row.id === latest.milestoneId
  );
  assert.ok(latestMilestoneRecord, 'latest update must name a current formal-publication milestone');
  const progress = proofProgress.proofCompletion;
  const coverage = proofProgress.formalArtefactCoverage;
  const html = await readText('index.html');
  const currentStatusFields = latestMilestoneStatusFields(status, release, latestMilestoneRecord);
  for (const field of currentStatusFields) {
    assert.ok(Object.hasOwn(status, field), `canonical status missing derived latest-milestone field: ${field}`);
    assert.ok(
      html.includes(`${field} = ${JSON.stringify(status[field])}`),
      `homepage missing current canonical status field: ${field}`
    );
  }
  for (const fragment of [
    'A machine-checked reconstruction of a proposed route to P = NP.',
    'Current result: P = NP is not established.',
    '<strong>P versus NP</strong> asks whether problems with answers that can be checked efficiently can also be solved efficiently.',
    '<strong>Lean</strong> is software that checks each stated mathematical step.',
    latest.title,
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'rootLeanTheoremPresent = false',
    'projectSpecificAxiomsRemaining = false',
    'leanResidualTerminalFourCornerOptimumCoherenceClassifierFormalized = true',
    'leanResidualTerminalFourCornerOptimumFirstFailureFormalized = true',
    'leanResidualTerminalFourCornerOptimumRetainedSemanticsFormalized = true',
    'leanResidualTerminalFourCornerOptimumProfileTransportFormalized = true',
    'leanResidualTerminalFourCornerOptimumModeFirewallFormalized = true',
    'leanResidualTerminalFourCornerOptimumSideTightTupleFactsFormalized = true',
    'leanResidualTerminalFourCornerOptimumCoherenceAxiomAuditPassed = true',
    'leanResidualTerminalFourCornerOptimumLocalRouteClassifierFormalized = true',
    'leanResidualTerminalFourCornerOptimumRouteSoundnessFormalized = true',
    'leanResidualTerminalFourCornerOptimumRouteSilenceFormalized = true',
    'leanResidualTerminalFourCornerOptimumSideTightCompletionUnderRouteSilenceFormalized = true',
    'leanResidualTerminalFourCornerOptimumExactCompletionValuesFormalized = true',
    'leanResidualTerminalFourCornerOptimumPromotionFirewallRetained = true',
    'leanResidualTerminalFourCornerSideTightCompletionAxiomAuditPassed = true',
    'leanResidualTerminalFourCornerArbitraryFamilyCoherenceFormalized = true',
    'leanResidualTerminalFourCornerExactMinimumFamilyEnumerated = true',
    'leanResidualTerminalFourCornerTightBasisFamilyComplete = true',
    'leanResidualTerminalFourCornerSignedTightBasisMaximumFormalized = true',
    'leanResidualTerminalFourCornerTightBasisMaximumEqualsDeltaFormalized = true',
    'leanResidualTerminalFourCornerTightBasisMaximumAxiomAuditPassed = true',
    'leanLockedNANDCarrierLayoutFormalized = true',
    'leanLockedNANDGlobalCandidateAssemblyFormalized = true',
    'leanLockedNANDGlobalBaselineDistinctFormalized = true',
    'leanLockedNANDUnsatisfiableFinalZeroFormalized = true',
    'leanLockedNANDGlobalSemanticThresholdFormalized = true',
    'leanConcreteLockedNANDEncodedSemanticReductionFormalized = true',
    'leanConcreteLockedNANDParserMachineFormalized = true',
    'leanConcreteLockedNANDParserAxiomAuditPassed = true',
    'leanConcreteLockedNANDParserAuditedDeclarationCount = 380',
    'leanConcreteLockedNANDParserAllInputExactFormalized = true',
    'leanConcreteLockedNANDParserExactOutputFormalized = true',
    'leanConcreteLockedNANDParserCompiledNonTimeoutFormalized = true',
    'leanConcreteLockedNANDParserPolynomialTimeMachineFormalized = true',
    'leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized = true',
    'leanConcreteLockedNANDParserRawRefinementFormalized = true',
    'leanConcreteLockedNANDEmitterMachineFormalized = true',
    'leanConcreteLockedNANDEmitterAxiomAuditPassed = true',
    'leanConcreteLockedNANDEmitterAuditedDeclarationCount = 3295',
    'leanConcreteLockedNANDEmitterAllInputExactFormalized = true',
    'leanConcreteLockedNANDEmitterExactTargetBytesFormalized = true',
    'leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized = true',
    'leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized = true',
    'leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized = true',
    'leanConcreteLockedNANDEmitterRawRefinementFormalized = true',
    'leanConcreteLockedNANDEmitterStrictParserCompositionFormalized = true',
    'leanConcreteLockedNANDEmitterOutputSizeBoundFormalized = true',
    'leanConcreteLockedNANDPolynomialReductionFormalized = true',
    'leanConcreteCNFToNANDSemanticCompilerFormalized = true',
    'leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount = 68',
    'leanConcreteCNFToNANDExactSemanticsFormalized = true',
    'leanConcreteCNFToNANDPolynomialOutputSizeBoundFormalized = true',
    'leanConcreteCNFToNANDFiniteMachineFormalized = true',
    'leanConcreteCNFToNANDPolynomialTimeFunctionFormalized = true',
    'leanConcreteCNFToNANDPolynomialReductionFormalized = true',
    'leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount = 1316',
    'leanConcreteCNFToNANDAllInputExactFormalized = true',
    'leanConcreteCNFToNANDExactMachineOutputFormalized = true',
    'leanConcreteCNFToNANDCompiledNonTimeoutFormalized = true',
    'leanConcreteCNFToNANDRawRefinementFormalized = true',
    'leanConcreteCNFToNANDDirectReductionFormalized = true',
    'leanConcreteCNFToNANDLockedReductionCompositionFormalized = true',
    'leanResidualGainChainVerifierFormalized = true',
    'leanResidualGainChainAxiomAuditPassed = true',
    'leanResidualGainChainSemanticInvariantFormalized = true',
    'leanResidualGainChainSlackIterationBoundFormalized = true',
    'leanLockedNANDGainIterationsAtMostFourFormalized = true',
    'leanResidualGainChainPolynomialRuntimeFormalized = false',
    'leanResidualGainStoppingSpecificationFormalized = true',
    'leanResidualGainStoppingAxiomAuditPassed = true',
    'leanResidualGainZeroIffGlobalNoStrictGainFormalized = true',
    'leanResidualGainSemanticMinimumIffGlobalNoStrictGainFormalized = true',
    'leanResidualGainChainGlobalStoppingConsequenceFormalized = true',
    'leanResidualTerminalFullBridgeFormalized = true',
    'leanResidualTerminalFullBridgeAxiomAuditPassed = true',
    'leanResidualTerminalizationExactFormalized = true',
    'leanResidualTerminalFullMinimumSpecificationFormalized = true',
    'leanResidualTerminalMuBridgeFormalized = true',
    'leanResidualWholeSpanPositiveWitnessIffFormalized = true',
    'leanResidualWholeSpanStrictDescentFormalized = true',
    'leanResidualWholeSpanZeroAbsenceIffFormalized = true',
    'leanResidualTerminalQuotientCarrierFormalized = true',
    'leanResidualTerminalModeFirewallFormalized = true',
    'leanResidualProjectionMinimumAxiomAuditPassed = true',
    'leanResidualProjectionMinimumExecutableFullScanFormalized = true',
    'leanResidualProjectionMinimumExecutableQuotientScanFormalized = true',
    'leanResidualProjectionMinimumMonotonicityFormalized = true',
    'leanResidualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized = true',
    'leanResidualProjectionTransferFormalized = true',
    'leanResidualProjectionTransferAxiomAuditPassed = true',
    'leanResidualProjectionTransferSignedDeltasFormalized = true',
    'leanResidualProjectionTransferIdentityFormalized = true',
    'leanResidualProjectionTransferConstantCutFormalized = true',
    'leanResidualTerminalProperSupportFormalized = true',
    'leanResidualTerminalProperSupportSearchCompleteFormalized = true',
    'leanResidualTerminalProperSupportExactLocalGainFormalized = true',
    'leanResidualTerminalProperSupportAxiomAuditPassed = true',
    'leanResidualTerminalSupportSquareClosureFormalized = true',
    'leanResidualTerminalSupportSquareMeetJoinExactFormalized = true',
    'leanResidualTerminalSupportSquarePhysicalCompatibilityFormalized = true',
    'leanResidualTerminalSupportSquareSemanticExtractionFormalized = true',
    'leanResidualTerminalSupportSquareClosureAxiomAuditPassed = true',
    'leanResidualTerminalSaturationFormalized = true',
    'leanResidualTerminalSaturationAxiomAuditPassed = true',
    'leanResidualTerminalPrimitiveUniverseFormalized = true',
    'leanResidualTerminalSaturationExtensiveFormalized = true',
    'leanResidualTerminalSaturationLeastFormalized = true',
    'leanResidualTerminalSaturationMonotoneFormalized = true',
    'leanResidualTerminalSaturationIdempotentFormalized = true',
    'leanResidualTerminalExecutableSaturationFormalized = true',
    'leanResidualTerminalPhysicalSupportCompletionFormalized = true',
    'leanResidualTerminalPhysicalBoundaryFormalized = true',
    'leanResidualTerminalPhysicalInterfaceFormalized = true',
    'leanResidualTerminalPhysicalCompatibilityFormalized = true',
    'leanResidualTerminalPhysicalSupportCompletionAxiomAuditPassed = true',
    'leanResidualTerminalPhysicalSupportCompletionAuditedDeclarationCount = 35',
    'leanResidualTerminalPhysicalSupportCompletionEmptyAxiomDeclarationCount = 8',
    'leanResidualTerminalPhysicalSupportCompletionPropextOnlyDeclarationCount = 24',
    'leanResidualTerminalPhysicalSupportCompletionPropextQuotSoundDeclarationCount = 3',
    'leanResidualTerminalSupportExtractionFormalized = true',
    'leanResidualTerminalSupportExtractionAxiomAuditPassed = true',
    'leanResidualTerminalSupportExtractionAuditedDeclarationCount = 34',
    'leanResidualTerminalSupportExtractionEmptyAxiomDeclarationCount = 3',
    'leanResidualTerminalSupportExtractionPropextOnlyDeclarationCount = 11',
    'leanResidualTerminalSupportExtractionPropextQuotSoundDeclarationCount = 20',
    'leanResidualTerminalOpenSemanticsFormalized = true',
    'leanResidualTerminalInducedRecoveryFormalized = true',
    'leanResidualTerminalSupportCompletionFormalized = true',
    'leanResidualTerminalGovernedSupportCompletionFormalized = true',
    'leanResidualTerminalGovernedProfilePartitionFormalized = true',
    'leanResidualTerminalGovernedSupportCompletionAxiomAuditPassed = true',
    'leanResidualTerminalFrontierPushoutFormalized = true',
    'leanResidualTerminalFrontierBoundaryGlueExactFormalized = true',
    'leanResidualTerminalFrontierInterfaceGlueExactFormalized = true',
    'leanResidualTerminalFrontierProfileGlueExactFormalized = true',
    'leanResidualTerminalFrontierInternalizationFormalized = true',
    'leanResidualTerminalFrontierPushoutAxiomAuditPassed = true',
    'leanResidualTerminalProjectionSquareFormalized = true',
    'leanResidualTerminalProjectionPhysicalInvariantFormalized = true',
    'leanResidualTerminalProjectionProfileExactFormalized = true',
    'leanResidualTerminalProjectionMeetJoinCommuteFormalized = true',
    'leanResidualTerminalProjectionPushoutCommuteFormalized = true',
    'leanResidualTerminalProjectionSquareAxiomAuditPassed = true',
    'leanResidualTerminalSideTightMinimumArithmeticFormalized = true',
    'leanResidualTerminalSideTightSignedSlackIdentityFormalized = true',
    'leanResidualTerminalSideTightFailClosedGateFormalized = true',
    'leanResidualTerminalSideTightCanonicalFullBasisFormalized = true',
    'leanResidualTerminalSideTightCanonicalQuotientBasisFormalized = true',
    'leanResidualTerminalSideTightMinimumAxiomAuditPassed = true',
    'leanResidualTerminalFourCornerOptimaCarrierCompatibleFormalized = true',
    'leanResidualTerminalFourCornerOptimaFaithfulAmbientizationFormalized = true',
    'leanResidualTerminalFourCornerOptimaReferenceMinimumPreservedFormalized = true',
    'leanResidualTerminalFourCornerOptimaLocalizedMinimaFormalized = true',
    'leanResidualTerminalFourCornerOptimaSharedObserverProjectionFormalized = true',
    'leanResidualTerminalFourCornerOptimaAxiomAuditPassed = true',
    'leanResidualTerminalSquareLegitimacyFormalized = true',
    'leanResidualTerminalSquareStructuralCompatibilityFormalized = true',
    'leanResidualTerminalSquareFrontierPushoutFormalized = true',
    'leanResidualTerminalSquareSharedQuantityCarrierFormalized = true',
    'leanResidualTerminalSquareLocalConclusionUnderRouteSilenceFormalized = true',
    'leanResidualTerminalSquareFailClosedRouteDichotomyFormalized = true',
    'leanResidualTerminalSquareLegitimacyAxiomAuditPassed = true',
    'leanResidualTerminalComputedBCELAnchorNucleusFormalized = true',
    'leanResidualTerminalBCELMinimumPositiveNucleusFormalized = true',
    'leanResidualTerminalBCELAnchorAlgebraFormalized = true',
    'leanResidualTerminalBCELCutDefectFirewallFormalized = true',
    'leanResidualTerminalBCELCutRouteDichotomyFormalized = true',
    'leanResidualTerminalBCELConstantCutConclusionFormalized = true',
    'leanResidualTerminalBCELAnchorNucleusAxiomAuditPassed = true',
    'leanResidualTerminalSaturationPositivityFirewallFormalized = true',
    'leanResidualTerminalSaturationPositivityFirewallAxiomAuditPassed = true',
    'leanResidualTerminalCandidateSaturationFormalized = true',
    'leanResidualTerminalSaturationCostBalanceFormalized = true',
    'leanResidualTerminalFirstNontransparentStepFormalized = true',
    'leanResidualTerminalSaturationCostBalanceAxiomAuditPassed = true',
    'leanResidualTerminalInterfaceExposureRoutingFormalized = true',
    'leanResidualTerminalFiniteInterfaceExposureRoutesToEFormalized = true',
    'leanResidualTerminalInterfaceExposureZeroCostRetractFormalized = true',
    'leanResidualTerminalFirstInterfaceExposureRouteFormalized = true',
    'leanResidualTerminalInterfaceExposureRoutingAxiomAuditPassed = true',
    'leanResidualTerminalOriginKernelObligationRoutingFormalized = true',
    'leanResidualTerminalFiniteOriginKernelObligationClosureRoutedFormalized = true',
    'leanResidualTerminalFirstOriginKernelObligationRouteFormalized = true',
    'leanResidualTerminalOriginKernelObligationRoutingAxiomAuditPassed = true',
    'leanResidualTerminalFiniteSaturatePositiveCompositionFormalized = true',
    'leanResidualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed = true',
    'leanResidualTerminalRankWFFormalized = true',
    'leanResidualTerminalRankWFAxiomAuditPassed = true',
    'leanResidualTerminalRankWFScope = "fixed-ten-coordinate-natural-lexicographic-order-executable-comparison-accessibility-induction-and-kernel-well-foundedness"',
    'leanResidualTerminalBN3RequestEnvelopeFormalized = true',
    'leanResidualTerminalBN3RequestEnvelopeAxiomAuditPassed = true',
    'leanResidualTerminalBN3RequestEnvelopeScope = "successful-computed-finite-bcel-anchor-nuclei-canonical-stable-request-identities-exact-singleton-minimal-consumers-duplicate-free-incidence-and-jointly-side-tight-full-or-quotient-basis-family"',
    'leanResidualTerminalBN4ActivationCancellationFormalized = true',
    'leanResidualTerminalBN4ActivationCancellationAxiomAuditPassed = true',
    'leanResidualTerminalBN4ActivationCancellationScope = "successful-computed-finite-bn3-envelope-explicit-typed-cell-ledgers-activation-exact-complete-key-same-key-cancellation-and-exact-integer-mass-residuals"',
    'leanResidualTerminalBN5FullShadowLocalizationFormalized = true',
    'leanResidualTerminalBN5FullShadowLocalizationAxiomAuditPassed = true',
    'leanResidualTerminalBN5FullShadowLocalizationScope = "all-finite-exact-coordinate-negative-unit-refinements-computed-cut-silence-complete-multiplicity-coverage-or-strict-hall-deficit-with-local-x1-nonsilence"',
    'leanResidualTerminalPkgCSeparatingConsumersFormalized = true',
    'leanResidualTerminalPkgCSeparatingConsumersAxiomAuditPassed = true',
    'leanResidualTerminalPkgCSeparatingConsumersScope = "all-finite-explicit-minimal-consumer-antichains-pkgc-separating-consumer-first-pair-canonical-atoms-exact-coordinate-restoration-or-strict-hall-local-q"',
    'leanResidualTerminalPkgCTypedRestorationFormalized = true',
    'leanResidualTerminalPkgCTypedRestorationAxiomAuditPassed = true',
    'leanResidualTerminalPkgCTypedRestorationScope = "all-finite-explicit-minimal-consumer-antichains-typed-full-restoration-candidates-coordinate-preserving-exact-multiplicity-coverage-no-hall-or-singletonized"',
    'leanResidualTerminalPkgCSameKeyCancellationFormalized = true',
    'leanResidualTerminalPkgCSameKeyCancellationAxiomAuditPassed = true',
    'leanResidualTerminalPkgCSameKeyCancellationScope = "all-finite-explicit-minimal-consumer-antichains-typed-exact-coordinate-restoration-canonical-opposite-sign-bn4-ledger-every-key-balanced-empty-residual-or-singletonized-under-cancellation-silence"',
    'leanResidualTerminalConsumerAntichainNormalFormFormalized = true',
    'leanResidualTerminalConsumerAntichainNormalFormAxiomAuditPassed = true',
    'leanResidualTerminalConsumerAntichainNormalFormScope = "all-finite-minimal-consumer-antichains-monotone-empty-false-nonzero-iff-disjoint-and-pkgc-singletonized-exact-v54-consumer-antichain-cut-indicator"',
    'leanResidualTerminalConstantCutHypergraphRigidityFormalized = true',
    'leanResidualTerminalConstantCutHypergraphRigidityAxiomAuditPassed = true',
    'leanResidualTerminalConstantCutHypergraphRigidityScope = "all-finite-nonnegative-weighted-hypergraphs-constant-cut-hypergraph-rigidity-v53-q2-q3-q4-classification"',
    'leanResidualTerminalBN6HypergraphPacketFormalized = true',
    'leanResidualTerminalBN6HypergraphPacketAxiomAuditPassed = true',
    'leanResidualTerminalBN6HypergraphPacketScope = "all-finite-explicit-grouped-v54-activation-to-v53-grouped-hypergraph-packet-bn6-pair-mixed-triple-fullspan-with-payload-witnesses"',
    'leanSaturatePositiveFormalized = false',
    'leanBCELReadyFormalized = false',
    'leanPCCMinPolynomialRuntimeFormalized = false',
    'concretePublicationGate.passed = false',
    inventory.coordinate,
    `updates.html#${latest.id}`,
    `Technical theorem boundary · gate closed · ${status.remainingBlockers.length} blockers`,
    'Risk-weighted proof completion estimate',
    `${progress.percent}% risk-weighted estimate`,
    `uncertainty ${progress.uncertaintyLowPercent}% to ${progress.uncertaintyHighPercent}%`,
    'A conservative estimate of how much of the complete formal proof burden has been retired.',
    `${coverage.earnedRows} of ${coverage.totalRows}`,
    'This is evidence-ledger coverage, not proof completion',
    `${proofProgress.globalGates.filter((gate) => gate.status === 'closed').length} of ${proofProgress.globalGates.length} closed`,
    `Root theorem <code>${proofProgress.rootTheorem.name}</code>: <strong>absent</strong>`,
    'P: problems we can solve efficiently',
    'NP: answers we can check efficiently',
    'Read the plain-language and technical update',
    'EncodedLockedNANDThreshold',
  ]) {
    const statusField = fragment.match(/^([A-Za-z][A-Za-z0-9]+) = /u)?.[1];
    const expectedFragment = statusField && Object.hasOwn(status, statusField)
      ? `${statusField} = ${JSON.stringify(status[statusField])}`
      : fragment;
    const fragmentPresent = html.includes(expectedFragment);
    assert.equal(fragmentPresent, true, `missing homepage fragment: ${expectedFragment}`);
  }
  const latestMilestone = html.match(/<article class="latest-milestone"[\s\S]*?<\/article>/u)?.[0] ?? '';
  assert.ok(latestMilestone.includes(latest.title));
  for (const theorem of latestMilestoneRecord.requiredTheorems.slice(-2)) {
    assert.ok(inventory.milestoneCandidates.some((candidate) => candidate.name === theorem));
  }
  assertCanonicalConceptCoverage(latestMilestone, latestMilestoneRecord.scope, 0.65, 'homepage latest scope');
  assertCanonicalConceptCoverage(latestMilestone, latestMilestoneRecord.nonClaim, 0.70, 'homepage latest non-claim');
  assertCanonicalConceptCoverage(latestMilestone, latest.plainLanguage.join(' '), 0.75, 'homepage latest update');
  assert.ok(latestMilestone.includes('P = NP'));
  const currentBottomLine = html.match(/<section class="section compact" data-current-milestone="([^"]+)">[\s\S]*?Current bottom line[\s\S]*?<\/section>/u);
  assert.ok(currentBottomLine, 'homepage must retain a current bottom-line section');
  assert.equal(currentBottomLine[1], latest.milestoneId);
  assertCanonicalConceptCoverage(currentBottomLine[0], latestMilestoneRecord.scope, 0.35, 'current bottom-line scope');
  assertCanonicalConceptCoverage(currentBottomLine[0], latestMilestoneRecord.nonClaim, 0.55, 'current bottom-line non-claim');
  assert.match(currentBottomLine[0], /remain open/u);
  assert.match(currentBottomLine[0], /P = NP/u);
  assert.doesNotMatch(html, />Historical report</u);
});

test('homepage technical boundary and release identifiers are visibly discoverable but collapsed by default', async () => {
  const [html, status, updates] = await Promise.all([
    readText('index.html'),
    readJson('public/pnp-status.json'),
    readJson('content/milestone-updates.json'),
  ]);
  const latest = updates.entries[0];
  const latestMilestone = status.formalPublicationMilestones.find((row) => row.id === latest.milestoneId);
  assert.ok(latestMilestone, `missing latest milestone ${latest.milestoneId}`);
  assert.match(
    html,
    new RegExp(`<details class="boundary-panel" data-formal-status-root data-status-state="fail-closed" data-current-milestone="${latest.milestoneId}">`, 'u')
  );
  assert.match(html, /Show technical boundary/u);
  assert.match(html, /Hide technical boundary/u);
  assert.match(html, /class="disclosure-chevron"/u);
  assert.match(html, /<details class="release-details">/u);
  assert.match(html, /Source and release identifiers/u);
  assert.doesNotMatch(html, /<details class="(?:boundary-panel|release-details)"[^>]*\sopen(?:\s|=|>)/u);
  assert.match(html, /data-formal-status-fields[\s\S]*data-formal-status-note[\s\S]*<\/details>/u);
  const boundaryCopy = html.match(/<p class="boundary-copy"><strong>Latest earned step:<\/strong>[\s\S]*?<\/p>/u)?.[0] ?? '';
  assertCanonicalConceptCoverage(boundaryCopy, latestMilestone.scope, 0.35, 'homepage technical-boundary scope');
  assertCanonicalConceptCoverage(boundaryCopy, latestMilestone.nonClaim, 0.55, 'homepage technical-boundary non-claim');
});

test('homepage content is authoritative without JavaScript copy rewriting', async () => {
  const script = await readText('assets/main.js');
  for (const forbidden of [
    'ensureHomepageFormalReconstructionBoundary',
    'rewritePageHero',
    'insertAfterPageHero',
    'ensureStatusLink',
    'data-homepage-matrix-summary',
    'data-homepage-one-command-upload',
  ]) assert.doesNotMatch(script, new RegExp(forbidden, 'u'), forbidden);
  assert.match(script, /async function loadFormalPublication\(\)/u);
  assert.match(script, /loadFormalPublication\(\);/u);
});
