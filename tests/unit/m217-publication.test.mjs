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

const milestoneId = 'concrete-cook-levin-builder-physical-optional-token-dispatch';
const theoremName = 'PNP.Concrete.CookLevin.BuilderPhysicalOptionalTokenDispatch.cook_levin_builder_physical_optional_token_dispatch_checked_complete';
const theoremHash = 'fd4609ed040f392e53749bd5458295b60091ffe3ab897d60cad762b733714dbb';
const moduleName = 'PNP.Concrete.CookLevinBuilderPhysicalOptionalTokenDispatch';
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-01-217';

test('M217 public payloads preserve the physical optional-token dispatch boundary', () => {
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  assert.ok(milestone);
  assert.equal(milestone.title, 'Physical optional-token dispatch');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /fixed collision-free 64-rule machine/);
  assert.match(milestone.scope, /five physical request symbols/);
  assert.match(milestone.scope, /canonical scheduleEntry specialization at every post-header coordinate/);
  assert.match(milestone.scope, /All 49 public declarations/);
  assert.match(milestone.nonClaim, /does not derive that request from M214's raw coordinate classifier/);
  assert.match(milestone.nonClaim, /does not.*iterate one physical selector\/dispatcher loop/);
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

test('M217 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 49],
    ['FiveRequestAlphabetFormalized', true],
    ['LiteralRequestTapeHandoffFormalized', true],
    ['CanonicalAllCoordinatesFormalized', true],
    ['ExactCompiledTraceFormalized', true],
    ['MalformedRequestTimeoutFormalized', true],
    ['OneStepShortTimeoutFormalized', true],
    ['SourceSizePolynomialBoundFormalized', true],
    ['RawCoordinateSelectorFormalized', false],
    ['LiteralScheduleLoopFormalized', false],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(status[`leanConcreteCookLevinBuilderPhysicalOptionalTokenDispatch${suffix}`], expected);
    assert.equal(release.earnedBoundary[`cookLevinBuilderPhysicalOptionalTokenDispatch${suffix}`], expected);
  }
  assert.equal(release.earnedBoundary.cookLevinBuilderPhysicalOptionalTokenDispatchCheckedCompleteTheorem, theoremName);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalOptionalTokenDispatchTheoremKernelTypeSha256, { [theoremName]: theoremHash });
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalOptionalTokenDispatchAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalOptionalTokenDispatchProjectAxiomClosure, []);
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized, false);
});

test('M217 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find((row) => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 193, totalRows: 195 });
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

test('M217 remains historically exact after later current releases', () => {
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
  assert.match(statusPage, /data-milestone-id="concrete-cook-levin-builder-complete-schedule-iteration"/);
  const historicalUpdate = updates.entries.find((row) => row.milestoneId === milestoneId);
  assert.ok(historicalUpdate);
  assert.deepEqual(historicalUpdate.progressSnapshot, {
    modelId: progress.modelId,
    formalArtefactCoverageEarnedRows: 193,
    formalArtefactCoverageTotalRows: 195,
    riskWeightedProofCompletionPercent: 35,
    uncertaintyLowPercent: 20,
    uncertaintyHighPercent: 40,
    globalGatesClosed: 0,
    globalGatesAvailable: 5,
  });
});
