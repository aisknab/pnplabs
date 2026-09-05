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

const milestoneId = 'concrete-cook-levin-builder-physical-classifier-all-route-derived-finish-split';
const theoremName = 'PNP.Concrete.CookLevin.BuilderPhysicalClassifierAllRouteDerivedFinishSplit.cook_levin_builder_physical_classifier_all_route_derived_finish_split_checked_complete';
const theoremHash = '20e0743e1b3e03452e458c24f0ef41584b837cbc6534186d9c42c7906e63f8c1';
const moduleName = 'PNP.Concrete.CookLevinBuilderPhysicalClassifierAllRouteDerivedFinishSplit';
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-05-228';

test('M228 public payloads preserve the all-route derived-Finish request split', () => {
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  assert.ok(milestone);
  assert.equal(milestone.title, 'All-route derived-Finish physical request split');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /every coordinate in its complete post-header schedule/i);
  assert.match(milestone.scope, /without a staged request cell/i);
  assert.match(milestone.scope, /fixed 20-rule relay/i);
  assert.match(milestone.scope, /body-pending marker for every body route/i);
  assert.match(milestone.scope, /canonical Finish request only for the unique Finish route/i);
  assert.match(milestone.scope, /fixed 65-rule conditional reflected dispatcher/i);
  assert.match(milestone.scope, /collision-free 823-rule composition/i);
  assert.match(milestone.scope, /All 91 public declarations/);
  assert.match(milestone.nonClaim, /derives only the unique Finish request/i);
  assert.match(milestone.nonClaim, /body-token and padding request synthesis remain open/i);
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

test('M228 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 91],
    ['FixedRouteRelayRuleCount', 20],
    ['FixedClassifierRelayMachineRuleCount', 749],
    ['FixedConditionalDispatcherRuleCount', 65],
    ['FixedComposedMachineRuleCount', 823],
    ['AllPostHeaderCoordinatesFormalized', true],
    ['CanonicalRequestStagedOnProtectedTape', false],
    ['PhysicalBodyFinishRouteDerived', true],
    ['BodyPendingMarkerFormalized', true],
    ['FinishRequestDerivedFormalized', true],
    ['BodyRequestSynthesisFormalized', false],
    ['PaddingRequestSynthesisFormalized', false],
    ['RawRequestSynthesisFormalized', false],
    ['SuccessiveConfigurationsFormalized', false],
    ['RepeatedBuilderLoopFormalized', false],
    ['ExactNextCanonicalFinishPrefixFormalized', true],
    ['ExactNextCanonicalBodyPrefixFormalized', false],
    ['ExactWorkTraceFormalized', true],
    ['CompiledRawMachineFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['ExternalInputSizePolynomialFormalized', true],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(status[`leanConcreteCookLevinBuilderPhysicalClassifierAllRouteDerivedFinishSplit${suffix}`], expected);
    assert.equal(release.earnedBoundary[`cookLevinBuilderPhysicalClassifierAllRouteDerivedFinishSplit${suffix}`], expected);
    assert.equal(index.claimBoundary[`leanConcreteCookLevinBuilderPhysicalClassifierAllRouteDerivedFinishSplit${suffix}`], expected);
  }
  assert.equal(release.earnedBoundary.cookLevinBuilderPhysicalClassifierAllRouteDerivedFinishSplitCheckedCompleteTheorem, theoremName);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalClassifierAllRouteDerivedFinishSplitTheoremKernelTypeSha256, { [theoremName]: theoremHash });
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalClassifierAllRouteDerivedFinishSplitAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalClassifierAllRouteDerivedFinishSplitProjectAxiomClosure, []);
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized, false);
});

test('M228 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find((row) => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 204, totalRows: 206 });
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

test('M228 active surfaces publish the Finish-only derived-request boundary conservatively', () => {
  const currentCoverage = `${progress.formalArtefactCoverage.earnedRows} of ${progress.formalArtefactCoverage.totalRows}`;
  assert.equal(currentCoverage, '204 of 206');
  for (const file of ['README.md', 'architecture.html', 'faq.html', 'index.html', 'paper.html', 'status.html']) {
    const surface = readFileSync(file, 'utf8');
    assert.match(surface, new RegExp(currentCoverage));
    assert.match(surface, new RegExp(`${progress.proofCompletion.percent}%`));
    assert.match(surface, /derived-Finish|body-pending marker|unique Finish request/i);
    assert.match(surface, /823-rule/i);
    assert.match(surface, /body-token and padding request synthesis remain open/i);
    assert.match(surface, /No fixed weighted checkpoint changes/i);
    assert.match(surface, /All five global gates remain open/i);
  }
  const homepage = readFileSync('index.html', 'utf8');
  assert.match(homepage, new RegExp(`data-current-milestone="${milestoneId}"`));
  assert.match(homepage, new RegExp(`updates\\.html#[^"']*${milestoneId}`));
  const statusPage = readFileSync('status.html', 'utf8');
  assert.match(statusPage, new RegExp(`data-milestone-id="${milestoneId}"`));
  assert.match(statusPage, /data-milestone-id="concrete-cook-levin-builder-physical-classifier-all-route-staged-request-mirrored-dispatch"/);

  const activatedClaim = readFileSync('docs/activated_claim_wording.md', 'utf8');
  const marker = 'leanConcreteCookLevinBuilderPhysicalClassifierAllRouteDerivedFinishSplitFormalized = true';
  assert.equal(activatedClaim.split(marker).length - 1, 1);
  const sourceCheckerMap = readFileSync('docs/source_checker_map.md', 'utf8');
  assert.match(sourceCheckerMap, /all-route derived-Finish physical request split/i);
});
