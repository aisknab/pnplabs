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

const milestoneId =
  'concrete-cook-levin-builder-physical-classifier-all-body-staged-request-mirrored-dispatch';
const theoremName =
  'PNP.Concrete.CookLevin.BuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatch.cook_levin_builder_physical_classifier_all_body_staged_request_mirrored_dispatch_checked_complete';
const theoremHash =
  '8659e14e91dc68c48367f63c0531a29845c29700e9abfbbd7a211e0dad9ab4b4';
const moduleName =
  'PNP.Concrete.CookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatch';
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-03-225';

test('M225 public payloads preserve the all-body staged-request boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === milestoneId,
  );
  assert.ok(milestone);
  assert.equal(milestone.title, 'All-body staged-request physical dispatch');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /every coordinate/i);
  assert.match(milestone.scope, /explicitly staged canonical optional-token request/i);
  assert.match(milestone.scope, /fixed 14-rule scanner/i);
  assert.match(milestone.scope, /reflected 64-rule dispatcher/i);
  assert.match(milestone.scope, /collision-free 807-rule composition/i);
  assert.match(milestone.scope, /populated and padding coordinates/i);
  assert.match(milestone.scope, /current M227 audit covers all 82 public declarations/i);
  assert.match(milestone.nonClaim, /stages each canonical body or padding request/i);
  assert.match(milestone.nonClaim, /does not synthesize that request/i);
  assert.match(milestone.nonClaim, /include the unique Finish route/i);
  assert.deepEqual(milestone.requiredTheorems, [theoremName]);
  assert.equal(milestone.theoremRows.length, 1);
  assert.deepEqual(milestone.theoremRows[0].axioms,
    ['Quot.sound', 'propext']);
  assert.equal(milestone.theoremRows[0].actualKernelTypeSha256, theoremHash);
  assert.equal(milestone.theoremRows[0].expectedKernelTypeSha256, theoremHash);
  assert.equal(milestone.theoremRows[0].kernelTypeFingerprintMatches, true);
  const theorem = inventory.milestoneCandidates.find(
    (row) => row.name === theoremName,
  );
  assert.ok(theorem);
  assert.equal(theorem.module, moduleName);
  assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext']);
});

test('M225 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 82],
    ['FixedRequestRelayRuleCount', 14],
    ['FixedClassifierRelayMachineRuleCount', 734],
    ['FixedMirroredDispatcherRuleCount', 64],
    ['FixedComposedMachineRuleCount', 807],
    ['AllBodyCoordinatesFormalized', true],
    ['AllBodyAndPaddingRequestsStagedAndDispatched', true],
    ['CanonicalRequestStagedOnProtectedTape', true],
    ['RawRequestSynthesisFormalized', false],
    ['CombinedBodyFinishLoopFormalized', false],
    ['ExactNextCanonicalPrefixFormalized', true],
    ['ExactWorkTraceFormalized', true],
    ['CompiledRawMachineFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['ExternalInputSizePolynomialFormalized', true],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(
      status[`leanConcreteCookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatch${suffix}`],
      expected,
    );
    assert.equal(
      release.earnedBoundary[
        `cookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatch${suffix}`
      ],
      expected,
    );
  }
  assert.equal(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatchCheckedCompleteTheorem,
    theoremName,
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatchTheoremKernelTypeSha256,
    { [theoremName]: theoremHash },
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatchAxiomClosure,
    ['Quot.sound', 'propext'],
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatchProjectAxiomClosure,
    [],
  );
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized,
    false);
});

test('M225 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find(
    (row) => row.asOfCoordinate === coordinate,
  );
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage,
    { earnedRows: 201, totalRows: 203 });
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
    formalArtefactCoverageEarnedRows:
      history.formalArtefactCoverage.earnedRows,
    formalArtefactCoverageTotalRows:
      history.formalArtefactCoverage.totalRows,
    riskWeightedProofCompletionPercent:
      history.riskWeightedProofCompletionPercent,
    uncertaintyLowPercent: history.uncertaintyLowPercent,
    uncertaintyHighPercent: history.uncertaintyHighPercent,
    globalGatesClosed: history.globalGatesClosed,
    globalGatesAvailable: history.globalGatesAvailable,
  });
});



test('M225 remains a versioned historical publication card after M226', () => {
  const statusPage = readFileSync('status.html', 'utf8');
  const card = statusPage.match(
    new RegExp(`<article class="card" data-milestone-id="${milestoneId}"[\\s\\S]*?<\\/article>`),
  )?.[0] ?? '';
  assert.match(card, /all-body staged-request/i);
  assert.match(card, /formal artefact coverage becomes 201 of 203/i);
  assert.match(card, /risk-weighted estimate remains 35%/i);
  assert.match(card, /collision-free 807-rule composition/i);
  assert.match(statusPage,
    /data-milestone-id="concrete-cook-levin-builder-physical-classifier-terminal-join"/);
});
