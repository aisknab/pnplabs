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
  'concrete-cook-levin-builder-physical-classifier-terminal-join';
const theoremName =
  'PNP.Concrete.CookLevin.BuilderPhysicalClassifierTerminalJoin.cook_levin_builder_physical_classifier_terminal_join_checked_complete';
const theoremHash =
  '9942e24e311a740e4f3fa4c4662a4d2c8809ee3cfd17a252aa3e2fb79a1eeeb0';
const moduleName =
  'PNP.Concrete.CookLevinBuilderPhysicalClassifierTerminalJoin';
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-03-226';

test('M226 public payloads preserve the physical classifier terminal-join boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === milestoneId,
  );
  assert.ok(milestone);
  assert.equal(milestone.title, 'All-route physical classifier terminal join');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /every coordinate in its complete post-header schedule/i);
  assert.match(milestone.scope, /arbitrary protected workspace/i);
  assert.match(milestone.scope, /total nine-symbol, tape-preserving redirect/i);
  assert.match(milestone.scope, /same continuation-ready accepting state/i);
  assert.match(milestone.scope, /collision-free 720-rule machine/i);
  assert.match(milestone.scope, /zero additional steps on body routes/i);
  assert.match(milestone.scope, /All 34 public declarations/);
  assert.match(milestone.nonClaim, /normalizes only.*terminal control flow/i);
  assert.match(milestone.nonClaim, /does not synthesize, stage or dispatch/i);
  assert.match(milestone.nonClaim, /connect successive schedule configurations/i);
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

test('M226 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 34],
    ['FixedRedirectRuleCount', 9],
    ['FixedComposedMachineRuleCount', 720],
    ['AllPostHeaderCoordinatesFormalized', true],
    ['ArbitraryWorkspaceFormalized', true],
    ['BodyZeroAdditionalStepsFormalized', true],
    ['FinishOneAdditionalStepFormalized', true],
    ['CommonContinuationStateFormalized', true],
    ['TapePreservingTerminalJoinFormalized', true],
    ['RawRequestSynthesisFormalized', false],
    ['RequestDispatchFormalized', false],
    ['RepeatedBuilderLoopFormalized', false],
    ['ExactWorkTraceFormalized', true],
    ['CompiledRawMachineFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['ExternalInputSizePolynomialFormalized', true],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(
      status[`leanConcreteCookLevinBuilderPhysicalClassifierTerminalJoin${suffix}`],
      expected,
    );
    assert.equal(
      release.earnedBoundary[
        `cookLevinBuilderPhysicalClassifierTerminalJoin${suffix}`
      ],
      expected,
    );
  }
  assert.equal(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierTerminalJoinCheckedCompleteTheorem,
    theoremName,
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierTerminalJoinTheoremKernelTypeSha256,
    { [theoremName]: theoremHash },
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierTerminalJoinAxiomClosure,
    ['Quot.sound', 'propext'],
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierTerminalJoinProjectAxiomClosure,
    [],
  );
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized,
    false);
});

test('M226 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find(
    (row) => row.asOfCoordinate === coordinate,
  );
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage,
    { earnedRows: 202, totalRows: 204 });
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




test('M226 active surfaces publish the terminal join conservatively', () => {
  const currentCoverage =
    `${progress.formalArtefactCoverage.earnedRows} of ${progress.formalArtefactCoverage.totalRows}`;
  for (const file of [
    'README.md', 'architecture.html', 'faq.html', 'index.html', 'paper.html',
    'status.html',
  ]) {
    const surface = readFileSync(file, 'utf8');
    assert.match(surface, new RegExp(currentCoverage.replace('/', '\\/')));
    assert.match(surface, new RegExp(`${progress.proofCompletion.percent}%`));
    assert.match(surface, /all-route physical classifier terminal join|every post-header classifier route|terminal control/i);
    assert.match(surface, /720-rule/i);
    assert.match(surface, /does not synthesize, stage or dispatch|request synthesis and dispatch.*remain open/i);
    assert.match(surface, /No fixed weighted checkpoint changes/i);
    assert.match(surface, /All five global gates remain open/i);
  }
  const homepage = readFileSync('index.html', 'utf8');
  assert.match(homepage,
    new RegExp(`data-current-milestone="${milestoneId}"`));
  assert.match(homepage,
    new RegExp(`updates\\.html#[^"']*${milestoneId}`));
  const statusPage = readFileSync('status.html', 'utf8');
  assert.match(statusPage,
    new RegExp(`data-milestone-id="${milestoneId}"`));
  assert.match(statusPage,
    /data-milestone-id="concrete-cook-levin-builder-physical-classifier-all-body-staged-request-mirrored-dispatch"/);
  assert.equal(release.artifacts.report.pageCount >= 166, true);
});
