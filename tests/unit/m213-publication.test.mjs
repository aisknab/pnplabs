import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const status = readJson('public/pnp-status.json');
const inventory = readJson('public/pnp-theorem-inventory.json');
const progress = readJson('public/pnp-proof-progress.json');
const index = readJson('public/pnp-index.json');
const release = readJson('downloads/formal-publication-release.json');
const updates = readJson('content/milestone-updates.json');

const milestoneId = 'concrete-cook-levin-builder-post-header-raw-tape-bridge';
const theoremName = 'PNP.Concrete.CookLevin.BuilderPostHeaderRawTapeBridge.cook_levin_builder_post_header_raw_tape_bridge_checked_complete';
const theoremHash = '4471f7d515cd8fc13191d7228a74e226adb6ee9fcfa4277d13f38fef26880753';
const moduleName = 'PNP.Concrete.CookLevinBuilderPostHeaderRawTapeBridge';

test('M213 public payloads preserve the literal tape-bridge claim boundary', () => {
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  assert.ok(milestone);
  assert.equal(milestone.title, 'Literal Cook-Levin post-header raw tape bridge');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /fixed collision-free 351-rule bridge/);
  assert.match(milestone.scope, /arbitrary exterior workspace/);
  assert.match(milestone.scope, /All 78 public declarations/);
  assert.match(milestone.nonClaim, /does not select, emit, or append a Cook-Levin body or Finish token/);
  assert.match(milestone.nonClaim, /does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P/);
  assert.deepEqual(milestone.requiredTheorems, [theoremName]);
  assert.equal(milestone.theoremRows.length, 1);
  assert.equal(milestone.theoremRows[0].name, theoremName);
  assert.equal(milestone.theoremRows[0].present, true);
  assert.equal(milestone.theoremRows[0].kind, 'theorem');
  assert.deepEqual(milestone.theoremRows[0].axioms, ['Quot.sound', 'propext']);
  assert.equal(milestone.theoremRows[0].actualKernelTypeSha256, theoremHash);
  assert.equal(milestone.theoremRows[0].expectedKernelTypeSha256, theoremHash);
  assert.equal(milestone.theoremRows[0].kernelTypeFingerprintMatches, true);

  const theorem = inventory.milestoneCandidates.find((row) => row.name === theoremName);
  assert.ok(theorem);
  assert.equal(theorem.kind, 'theorem');
  assert.equal(theorem.module, moduleName);
  assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext']);
});

test('M213 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 78],
    ['ExactRouterTapeInputsFormalized', true],
    ['LiteralTapeBridgeFormalized', true],
    ['ArbitraryWorkspacePreservedFormalized', true],
    ['ShieldedDividerTraceFormalized', true],
    ['AllRoutesFormalized', true],
    ['CompiledSimulationFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['SourceSizePolynomialBoundFormalized', true],
    ['RawBodyTokenEmissionFormalized', false],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(status[`leanConcreteCookLevinBuilderPostHeaderRawTapeBridge${suffix}`], expected);
    assert.equal(release.earnedBoundary[`cookLevinBuilderPostHeaderRawTapeBridge${suffix}`], expected);
  }
  assert.equal(release.earnedBoundary.cookLevinBuilderPostHeaderRawTapeBridgeCheckedCompleteTheorem, theoremName);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPostHeaderRawTapeBridgeTheoremKernelTypeSha256, {
    [theoremName]: theoremHash,
  });
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPostHeaderRawTapeBridgeAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPostHeaderRawTapeBridgeProjectAxiomClosure, []);
  assert.equal(status.leanConcreteCookLevinBuilderPostHeaderRawDividerAuditedDeclarationCount, 57);
  assert.equal(release.earnedBoundary.cookLevinBuilderPostHeaderRawDividerAuditedDeclarationCount, 57);
});

test('M213 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);

  const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-08-30-213';
  const history = progress.history.find((row) => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 189, totalRows: 191 });
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
