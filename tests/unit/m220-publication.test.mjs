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

const milestoneId = 'concrete-cook-levin-builder-physical-classifier-pipeline';
const theoremName = 'PNP.Concrete.CookLevin.BuilderPhysicalClassifierPipeline.cook_levin_builder_physical_classifier_pipeline_checked_complete';
const theoremHash = '4bbd25d56fa38cdee8b2595274ea8897404ee4e23d832f4aa3d62f681311813d';
const moduleName = 'PNP.Concrete.CookLevinBuilderPhysicalClassifierPipeline';
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-01-220';

test('M220 public payloads preserve the all-coordinate physical classifier boundary', () => {
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  assert.ok(milestone);
  assert.equal(milestone.title, 'All-coordinate physical classifier pipeline');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /every canonical post-header coordinate/);
  assert.match(milestone.scope, /collision-free 711-rule machine/);
  assert.match(milestone.scope, /Three exact physical tape handoffs/);
  assert.match(milestone.scope, /All 63 public declarations/);
  assert.match(milestone.nonClaim, /does not derive body-token or padding request symbols/);
  assert.match(milestone.nonClaim, /does not.*connect.*classification to M217's request dispatcher/);
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

test('M220 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 63],
    ['AllCoordinatesFormalized', true],
    ['FixedComposedMachineRuleCount', 711],
    ['ExactStageHandoffsFormalized', true],
    ['RouteAgreementFormalized', true],
    ['ExactWorkTraceFormalized', true],
    ['CompiledRawMachineFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['ExternalInputSizePolynomialFormalized', true],
    ['BodyOrPaddingRequestDerived', false],
    ['LiteralRawLoopFormalized', false],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(status[`leanConcreteCookLevinBuilderPhysicalClassifierPipeline${suffix}`], expected);
    assert.equal(release.earnedBoundary[`cookLevinBuilderPhysicalClassifierPipeline${suffix}`], expected);
  }
  assert.equal(release.earnedBoundary.cookLevinBuilderPhysicalClassifierPipelineCheckedCompleteTheorem, theoremName);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalClassifierPipelineTheoremKernelTypeSha256, { [theoremName]: theoremHash });
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalClassifierPipelineAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalClassifierPipelineProjectAxiomClosure, []);
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized, false);
});

test('M220 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find((row) => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 196, totalRows: 198 });
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

test('M220 active surfaces publish the classifier pipeline without overclaiming', () => {
  const currentCoverage =
    `${progress.formalArtefactCoverage.earnedRows} of ${progress.formalArtefactCoverage.totalRows}`;
  for (const file of ['README.md', 'architecture.html', 'faq.html', 'index.html', 'paper.html', 'status.html']) {
    const text = readFileSync(file, 'utf8');
    assert.match(text, new RegExp(currentCoverage.replace('/', '\\/')));
    assert.match(text, /35%/);
    assert.match(text, /classifier pipeline/i);
    assert.doesNotMatch(text, /M220[^\n]*close(?:s|d) (?:a )?(?:fixed checkpoint|global gate)/i);
  }
  const homepage = readFileSync('index.html', 'utf8');
  assert.match(homepage, new RegExp(`data-current-milestone="${milestoneId}"`));
  const statusPage = readFileSync('status.html', 'utf8');
  assert.match(statusPage, new RegExp(`data-milestone-id="${milestoneId}"`));
  assert.match(statusPage, /data-milestone-id="concrete-cook-levin-builder-physical-finish-request"/);
  assert.equal(release.artifacts.report.pageCount, 159);
});
