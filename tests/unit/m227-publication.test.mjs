import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf8'));
const status = readJson('public/pnp-status.json');
const inventory = readJson('public/pnp-theorem-inventory.json');
const progress = readJson('public/pnp-proof-progress.json');
const index = readJson('public/pnp-index.json');
const release = readJson('downloads/formal-publication-release.json');
const updates = readJson('content/milestone-updates.json');

const milestoneId = "concrete-cook-levin-builder-physical-classifier-all-route-staged-request-mirrored-dispatch";
const theoremName = "PNP.Concrete.CookLevin.BuilderPhysicalClassifierAllRouteStagedRequestMirroredDispatch.cook_levin_builder_physical_classifier_all_route_staged_request_mirrored_dispatch_checked_complete";
const theoremHash = "f8323850eefda8fb9f731c4be6af9f85f797744e9b90c79539316bab48c11871";
const moduleName = "PNP.Concrete.CookLevinBuilderPhysicalClassifierAllRouteStagedRequestMirroredDispatch";
const coordinate = "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-04-227";

test('M227 public payloads preserve the all-route staged-request dispatch boundary', () => {
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  assert.ok(milestone);
  assert.equal(milestone.title, "All-route staged-request physical dispatch");
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /every coordinate in its complete post-header schedule/i);
  assert.match(milestone.scope, /common body-or-Finish terminal geometry/i);
  assert.match(milestone.scope, /fixed 14-rule request relay/i);
  assert.match(milestone.scope, /reflected fixed 64-rule dispatcher/i);
  assert.match(milestone.scope, /collision-free 816-rule composition/i);
  assert.match(milestone.scope, /All 65 public declarations/);
  assert.match(milestone.nonClaim, /request explicitly staged/i);
  assert.match(milestone.nonClaim, /does not synthesize the request from raw classifier state/i);
  assert.match(milestone.nonClaim, /connect successive schedule configurations/i);
  assert.deepEqual(milestone.requiredTheorems, [theoremName]);
  assert.equal(milestone.theoremRows.length, 1);
  assert.deepEqual(milestone.theoremRows[0].axioms, ['Quot.sound', 'propext']);
  assert.equal(milestone.theoremRows[0].actualKernelTypeSha256, theoremHash);
  assert.equal(milestone.theoremRows[0].expectedKernelTypeSha256, theoremHash);
  assert.equal(milestone.theoremRows[0].kernelTypeFingerprintMatches, true);
  const theorem = inventory.milestoneCandidates.find((row) => row.name === theoremName);
  assert.ok(theorem);
  assert.equal(theorem.module, moduleName);
  assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext']);
});

test('M227 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
  [
    "Formalized",
    true
  ],
  [
    "AxiomAuditPassed",
    true
  ],
  [
    "AuditedDeclarationCount",
    65
  ],
  [
    "FixedRequestRelayRuleCount",
    14
  ],
  [
    "FixedClassifierRelayMachineRuleCount",
    743
  ],
  [
    "FixedMirroredDispatcherRuleCount",
    64
  ],
  [
    "FixedComposedMachineRuleCount",
    816
  ],
  [
    "AllPostHeaderCoordinatesFormalized",
    true
  ],
  [
    "BodyAndFinishRoutesDispatched",
    true
  ],
  [
    "CanonicalRequestStagedOnProtectedTape",
    true
  ],
  [
    "RawRequestSynthesisFormalized",
    false
  ],
  [
    "SuccessiveConfigurationsFormalized",
    false
  ],
  [
    "RepeatedBuilderLoopFormalized",
    false
  ],
  [
    "ExactNextCanonicalPrefixFormalized",
    true
  ],
  [
    "ExactWorkTraceFormalized",
    true
  ],
  [
    "CompiledRawMachineFormalized",
    true
  ],
  [
    "OneStepShortNonhaltingFormalized",
    true
  ],
  [
    "ExternalInputSizePolynomialFormalized",
    true
  ]
];
  for (const [suffix, expected] of pairs) {
    assert.equal(status[`leanConcreteCookLevinBuilderPhysicalClassifierAllRouteStagedRequestMirroredDispatch${suffix}`], expected);
    assert.equal(release.earnedBoundary[`cookLevinBuilderPhysicalClassifierAllRouteStagedRequestMirroredDispatch${suffix}`], expected);
  }
  assert.equal(release.earnedBoundary.cookLevinBuilderPhysicalClassifierAllRouteStagedRequestMirroredDispatchCheckedCompleteTheorem, theoremName);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalClassifierAllRouteStagedRequestMirroredDispatchTheoremKernelTypeSha256, { [theoremName]: theoremHash });
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalClassifierAllRouteStagedRequestMirroredDispatchAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalClassifierAllRouteStagedRequestMirroredDispatchProjectAxiomClosure, []);
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized, false);
});

test('M227 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find((row) => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 203, totalRows: 205 });
  assert.equal(history.riskWeightedProofCompletionPercent, 35);
  assert.equal(history.uncertaintyLowPercent, 20);
  assert.equal(history.uncertaintyHighPercent, 40);
  assert.equal(history.globalGatesClosed, 0);
  assert.equal(history.globalGatesAvailable, 5);
  assert.equal(history.scoreChanged, false);
  assert.deepEqual(history.changedCheckpointIds, []);
  assert.equal(progress.projectSpecificAxiomsRemaining.length, 0);
  assert.equal(progress.rootTheorem.name, 'PNP.Main.p_eq_np');
  assert.equal(progress.rootTheorem.present, false);
  assert.equal(status.concretePublicationGate.passed, false);
  const update = updates.entries.find((row) => row.milestoneId === milestoneId);
  assert.ok(update);
  assert.equal(update.source.statusCoordinate, coordinate);
  assert.deepEqual(update.progressSnapshot, {
    modelId: progress.modelId,
    formalArtefactCoverageEarnedRows: history.formalArtefactCoverage.earnedRows,
    formalArtefactCoverageTotalRows: history.formalArtefactCoverage.totalRows,
    riskWeightedProofCompletionPercent: history.riskWeightedProofCompletionPercent,
    uncertaintyLowPercent: history.uncertaintyLowPercent,
    uncertaintyHighPercent: history.uncertaintyHighPercent,
    globalGatesClosed: history.globalGatesClosed,
    globalGatesAvailable: history.globalGatesAvailable,
  });
});

test('M227 active surfaces publish all-route staged-request dispatch conservatively', () => {
  const currentCoverage = `203 of 205`;
  for (const file of ['README.md', 'architecture.html', 'faq.html', 'index.html', 'paper.html', 'status.html']) {
    const surface = readFileSync(file, 'utf8');
    assert.match(surface, new RegExp(currentCoverage));
    assert.match(surface, new RegExp(`35%`));
    assert.match(surface, /all-route staged-request|body-or-Finish|every post-header coordinate/i);
    assert.match(surface, /816-rule/i);
    assert.match(surface, /request remains explicitly staged|does not synthesize/i);
    assert.match(surface, /No fixed weighted checkpoint changes/i);
    assert.match(surface, /All five global gates remain open/i);
  }
  const homepage = readFileSync('index.html', 'utf8');
  assert.match(homepage, new RegExp(`data-current-milestone="${milestoneId}"`));
  assert.match(homepage, new RegExp(`updates\\.html#[^"']*${milestoneId}`));
  const statusPage = readFileSync('status.html', 'utf8');
  assert.match(statusPage, new RegExp(`data-milestone-id="${milestoneId}"`));
  assert.match(statusPage, /data-milestone-id="concrete-cook-levin-builder-physical-classifier-terminal-join"/);
  assert.ok(release.artifacts.report.pageCount >= 166);
  const activatedClaim = readFileSync('docs/activated_claim_wording.md', 'utf8');
  const marker = 'leanConcreteCookLevinBuilderPhysicalClassifierAllRouteStagedRequestMirroredDispatchFormalized = true';
  assert.equal(activatedClaim.split(marker).length - 1, 1);
  const sourceCheckerMap = readFileSync('docs/source_checker_map.md', 'utf8');
  assert.match(sourceCheckerMap, /all-route staged-request physical dispatch/i);
});
