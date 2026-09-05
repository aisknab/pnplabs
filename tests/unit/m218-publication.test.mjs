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

const milestoneId = 'concrete-cook-levin-builder-physical-dispatch-schedule';
const theoremName = 'PNP.Concrete.CookLevin.BuilderPhysicalDispatchSchedule.cook_levin_builder_physical_dispatch_schedule_checked_complete';
const theoremHash = 'a54a569b4a01cd36d1a9934d3ea1e5c832b702380b2b7507f66267dd7a6b5404';
const moduleName = 'PNP.Concrete.CookLevinBuilderPhysicalDispatchSchedule';
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-01-218';

test('M218 public payloads preserve the all-coordinate physical dispatch schedule boundary', () => {
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  assert.ok(milestone);
  assert.equal(milestone.title, 'All-coordinate physical dispatch schedule');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /every canonical post-header coordinate/);
  assert.match(milestone.scope, /complete encoded formula/);
  assert.match(milestone.scope, /exact work, compiled and one-step-short physical traces/);
  assert.match(milestone.scope, /All 16 public declarations/);
  assert.match(milestone.nonClaim, /does not derive a request from M214 raw classifier cells/);
  assert.match(milestone.nonClaim, /does not.*implement one literal raw-machine loop/);
  assert.deepEqual(milestone.requiredTheorems, [theoremName]);
  assert.equal(milestone.theoremRows.length, 1);
  assert.equal(milestone.theoremRows[0].name, theoremName);
  assert.deepEqual(milestone.theoremRows[0].axioms, ['Quot.sound', 'propext']);
  assert.equal(milestone.theoremRows[0].actualKernelTypeSha256, theoremHash);
  assert.equal(milestone.theoremRows[0].expectedKernelTypeSha256, theoremHash);
  assert.equal(milestone.theoremRows[0].kernelTypeFingerprintMatches, true);
  const theorem = inventory.milestoneCandidates.find((row) => row.name === theoremName);
  assert.ok(theorem);
  assert.equal(theorem.module, moduleName);
  assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext']);
});

test('M218 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 16],
    ['AllCoordinatesFormalized', true],
    ['CompleteEncodedFormulaTokensFormalized', true],
    ['ExactPerCoordinateTraceFormalized', true],
    ['AggregateSourceSizePolynomialBoundFormalized', true],
    ['RawCoordinateRequestDerived', false],
    ['LiteralRawLoopFormalized', false],
    ['RawStageHandoffFormalized', false],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(status[`leanConcreteCookLevinBuilderPhysicalDispatchSchedule${suffix}`], expected);
    assert.equal(release.earnedBoundary[`cookLevinBuilderPhysicalDispatchSchedule${suffix}`], expected);
  }
  assert.equal(release.earnedBoundary.cookLevinBuilderPhysicalDispatchScheduleCheckedCompleteTheorem, theoremName);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalDispatchScheduleTheoremKernelTypeSha256, { [theoremName]: theoremHash });
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalDispatchScheduleAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalDispatchScheduleProjectAxiomClosure, []);
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized, false);
});

test('M218 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find((row) => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 194, totalRows: 196 });
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

test('M218 remains historically exact after later current releases', () => {
  const currentCoverage =
    `${progress.formalArtefactCoverage.earnedRows} of ${progress.formalArtefactCoverage.totalRows}`;
  for (const file of ['README.md', 'architecture.html', 'faq.html', 'index.html', 'paper.html', 'status.html']) {
    const text = readFileSync(file, 'utf8');
    assert.match(text, new RegExp(currentCoverage.replace('/', '\\/')));
    assert.match(text, /35%/);
  }
  const homepage = readFileSync('index.html', 'utf8');
  assert.match(homepage, new RegExp(`data-current-milestone="${updates.entries[0].milestoneId}"`));
  const statusPage = readFileSync('status.html', 'utf8');
  assert.match(statusPage, new RegExp(`data-milestone-id="${milestoneId}"`));
  assert.match(statusPage, /data-milestone-id="concrete-cook-levin-builder-physical-optional-token-dispatch"/);
  const historicalUpdate = updates.entries.find((row) => row.milestoneId === milestoneId);
  assert.ok(historicalUpdate);
  assert.deepEqual(historicalUpdate.progressSnapshot, {
    modelId: progress.modelId,
    formalArtefactCoverageEarnedRows: 194,
    formalArtefactCoverageTotalRows: 196,
    riskWeightedProofCompletionPercent: 35,
    uncertaintyLowPercent: 20,
    uncertaintyHighPercent: 40,
    globalGatesClosed: 0,
    globalGatesAvailable: 5,
  });
});
