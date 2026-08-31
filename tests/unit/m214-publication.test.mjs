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

const milestoneId = 'concrete-cook-levin-builder-post-divider-raw-route-classifier';
const theoremName = 'PNP.Concrete.CookLevin.BuilderPostDividerRawRouteClassifier.cook_levin_builder_post_divider_raw_route_classifier_checked_complete';
const theoremHash = '59409490565859dd69d80adf3261d0942f5cd81d05d0703a160f7e82388dede6';
const moduleName = 'PNP.Concrete.CookLevinBuilderPostDividerRawRouteClassifier';

test('M214 public payloads preserve the post-divider route-classifier boundary', () => {
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  assert.ok(milestone);
  assert.equal(milestone.title, 'Literal Cook-Levin post-divider raw route classifier');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /fixed collision-free 180-rule bridge/);
  assert.match(milestone.scope, /problem-derived clause count from a restored sidecar/);
  assert.match(milestone.scope, /All 85 public declarations/);
  assert.match(milestone.nonClaim, /does not inspect, select, emit, or append a Cook-Levin token/);
  assert.match(milestone.nonClaim, /does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P/);
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

test('M214 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 85],
    ['ExactDividerTapeInputsFormalized', true],
    ['ProblemClauseCountSidecarDerivedFormalized', true],
    ['ArbitraryWorkspacePreservedFormalized', true],
    ['ShieldedComparatorTraceFormalized', true],
    ['AllCoordinateBodyFinishAgreementFormalized', true],
    ['CompiledSimulationFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['SourceSizePolynomialBoundFormalized', true],
    ['RawBodyTokenEmissionFormalized', false],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(status[`leanConcreteCookLevinBuilderPostDividerRawRouteClassifier${suffix}`], expected);
    assert.equal(release.earnedBoundary[`cookLevinBuilderPostDividerRawRouteClassifier${suffix}`], expected);
  }
  assert.equal(release.earnedBoundary.cookLevinBuilderPostDividerRawRouteClassifierCheckedCompleteTheorem, theoremName);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPostDividerRawRouteClassifierTheoremKernelTypeSha256, { [theoremName]: theoremHash });
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPostDividerRawRouteClassifierAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPostDividerRawRouteClassifierProjectAxiomClosure, []);
});

test('M214 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-08-31-214';
  const history = progress.history.find((row) => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 190, totalRows: 192 });
  assert.equal(history.riskWeightedProofCompletionPercent, 35);
  assert.equal(history.uncertaintyLowPercent, 20);
  assert.equal(history.uncertaintyHighPercent, 40);
  assert.equal(history.globalGatesClosed, 0);
  assert.equal(history.globalGatesAvailable, 5);
  assert.equal(history.scoreChanged, false);
  assert.deepEqual(history.changedCheckpointIds, []);
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
