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

const milestoneId = 'concrete-cook-levin-builder-post-divider-selected-token-launch';
const theoremName = 'PNP.Concrete.CookLevin.BuilderPostDividerSelectedTokenLaunch.cook_levin_builder_post_divider_selected_token_launch_checked_complete';
const theoremHash = 'c2716eecd081065c3d918c77e2e4478f87554b5678bfa685c5f360ba8e0d236a';
const moduleName = 'PNP.Concrete.CookLevinBuilderPostDividerSelectedTokenLaunch';

test('M215 public payloads preserve the selected-token launch boundary', () => {
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  assert.ok(milestone);
  assert.equal(milestone.title, 'All-coordinate Cook-Levin selected-token launch');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /canonical schedule alone derives padding, the exact body token, or the unique Finish token/);
  assert.match(milestone.scope, /existing fixed 59-rule appender/);
  assert.match(milestone.scope, /All 30 public declarations/);
  assert.match(milestone.nonClaim, /selection handoff is not yet a literal raw tape rewrite/);
  assert.match(milestone.nonClaim, /does not iterate the complete token schedule/);
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

test('M215 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 30],
    ['CanonicalScheduleSelectionFormalized', true],
    ['PaddingBodyFinishTransitionFormalized', true],
    ['CanonicalSelectedTokenLaunchFormalized', true],
    ['CompiledSimulationFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['SourceSizePolynomialBoundFormalized', true],
    ['LiteralRawSelectionHandoffFormalized', false],
    ['ScheduleIterationFormalized', false],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(status[`leanConcreteCookLevinBuilderPostDividerSelectedTokenLaunch${suffix}`], expected);
    assert.equal(release.earnedBoundary[`cookLevinBuilderPostDividerSelectedTokenLaunch${suffix}`], expected);
  }
  assert.equal(release.earnedBoundary.cookLevinBuilderPostDividerSelectedTokenLaunchCheckedCompleteTheorem, theoremName);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPostDividerSelectedTokenLaunchTheoremKernelTypeSha256, { [theoremName]: theoremHash });
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPostDividerSelectedTokenLaunchAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPostDividerSelectedTokenLaunchProjectAxiomClosure, []);
});

test('M215 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-08-31-215';
  const history = progress.history.find((row) => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 191, totalRows: 193 });
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
