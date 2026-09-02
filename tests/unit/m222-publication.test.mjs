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
  'concrete-cook-levin-builder-physical-classifier-finish-workspace-orientation';
const theoremName =
  'PNP.Concrete.CookLevin.BuilderPhysicalClassifierFinishWorkspaceOrientation.cook_levin_builder_physical_classifier_finish_workspace_orientation_checked_complete';
const theoremHash =
  '22c56aba663179d67726c01ad73acc3b73922afd6607fe16b3b0e94a887a648f';
const moduleName =
  'PNP.Concrete.CookLevinBuilderPhysicalClassifierFinishWorkspaceOrientation';
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-02-222';

test('M222 public payloads preserve the Finish-workspace orientation boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === milestoneId,
  );
  assert.ok(milestone);
  assert.equal(milestone.title, 'Full-classifier Finish-workspace orientation');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /one blank sentinel/);
  assert.match(milestone.scope, /classifier prefix/);
  assert.match(milestone.scope, /collision-free 740-rule machine/);
  assert.match(milestone.scope, /spatial mirror of M217/);
  assert.match(milestone.scope, /All 57 public declarations/);
  assert.match(milestone.nonClaim, /does not prove that M217.*executes/);
  assert.match(milestone.nonClaim, /does not derive body-token or padding requests/);
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

test('M222 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 57],
    ['FixedComposedMachineRuleCount', 740],
    ['FinishCoordinateDerived', true],
    ['ClassifierPrefixDerived', true],
    ['ClassifierPrefixBlankFreeFormalized', true],
    ['BlankSentinelFormalized', true],
    ['WorkspaceOrientationFormalized', true],
    ['MirroredDispatcherEntryFormalized', true],
    ['ExactWorkTraceFormalized', true],
    ['CompiledRawMachineFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['ExternalInputSizePolynomialFormalized', true],
    ['BodyOrPaddingRequestDerived', false],
    ['MirroredDispatcherExecuted', false],
    ['LiteralRawLoopFormalized', false],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(
      status[`leanConcreteCookLevinBuilderPhysicalClassifierFinishWorkspaceOrientation${suffix}`],
      expected,
    );
    assert.equal(
      release.earnedBoundary[
        `cookLevinBuilderPhysicalClassifierFinishWorkspaceOrientation${suffix}`
      ],
      expected,
    );
  }
  assert.equal(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierFinishWorkspaceOrientationCheckedCompleteTheorem,
    theoremName,
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierFinishWorkspaceOrientationTheoremKernelTypeSha256,
    { [theoremName]: theoremHash },
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierFinishWorkspaceOrientationAxiomClosure,
    ['Quot.sound', 'propext'],
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierFinishWorkspaceOrientationProjectAxiomClosure,
    [],
  );
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized,
    false);
});

test('M222 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find(
    (row) => row.asOfCoordinate === coordinate,
  );
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage,
    { earnedRows: 198, totalRows: 200 });
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

test('M222 active surfaces publish workspace orientation without overclaiming', () => {
  const currentCoverage =
    `${progress.formalArtefactCoverage.earnedRows} of ${progress.formalArtefactCoverage.totalRows}`;
  for (const file of [
    'README.md', 'architecture.html', 'faq.html', 'index.html', 'paper.html',
    'status.html',
  ]) {
    const text = readFileSync(file, 'utf8');
    assert.match(text, new RegExp(currentCoverage.replace('/', '\\/')));
    assert.match(text, /35%/);
    assert.match(text, /workspace[- ]orientation/i);
    assert.match(text, /M217[^\n]*(?:not|does not)[^\n]*execut/i);
    assert.doesNotMatch(text,
      /M222[^\n]*close(?:s|d) (?:a )?(?:fixed checkpoint|global gate)/i);
  }
  const homepage = readFileSync('index.html', 'utf8');
  assert.match(homepage,
    new RegExp(`data-current-milestone="${milestoneId}"`));
  const statusPage = readFileSync('status.html', 'utf8');
  assert.match(statusPage,
    new RegExp(`data-milestone-id="${milestoneId}"`));
  assert.match(statusPage,
    /data-milestone-id="concrete-cook-levin-builder-physical-classifier-finish-request"/);
  assert.equal(release.artifacts.report.pageCount, 161);
});
