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
  'concrete-cook-levin-builder-physical-classifier-finish-request';
const theoremName =
  'PNP.Concrete.CookLevin.BuilderPhysicalClassifierFinishRequest.cook_levin_builder_physical_classifier_finish_request_checked_complete';
const theoremHash =
  'ca8b4f2f5712ddd7589a609fdaff3df08550d4b33e5d1e9cd374fb8f82c58bd7';
const moduleName =
  'PNP.Concrete.CookLevinBuilderPhysicalClassifierFinishRequest';
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-02-221';

test('M221 public payloads preserve the full-classifier Finish-request boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === milestoneId,
  );
  assert.ok(milestone);
  assert.equal(milestone.title, 'Full-classifier Finish-request cell');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /canonical Finish coordinate is derived internally/);
  assert.match(milestone.scope, /collision-free 721-rule machine/);
  assert.match(milestone.scope, /changes exactly that focused cell/);
  assert.match(milestone.scope, /All 36 public declarations/);
  assert.match(milestone.nonClaim,
    /does not derive body-token or padding request symbols/);
  assert.match(milestone.nonClaim,
    /orient the preserved workspace for the dispatcher/);
  assert.deepEqual(milestone.requiredTheorems, [theoremName]);
  assert.equal(milestone.theoremRows.length, 1);
  assert.equal(milestone.theoremRows[0].name, theoremName);
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

test('M221 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 36],
    ['FixedComposedMachineRuleCount', 721],
    ['FinishCoordinateDerived', true],
    ['ClassifierVerdictSwapFormalized', true],
    ['ExactRequestCellFormalized', true],
    ['WorkspacePreservationFormalized', true],
    ['ExactWorkTraceFormalized', true],
    ['CompiledRawMachineFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['ExternalInputSizePolynomialFormalized', true],
    ['BodyOrPaddingRequestDerived', false],
    ['DispatcherConnected', false],
    ['LiteralRawLoopFormalized', false],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(
      status[`leanConcreteCookLevinBuilderPhysicalClassifierFinishRequest${suffix}`],
      expected,
    );
    assert.equal(
      release.earnedBoundary[
        `cookLevinBuilderPhysicalClassifierFinishRequest${suffix}`
      ],
      expected,
    );
  }
  assert.equal(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierFinishRequestCheckedCompleteTheorem,
    theoremName,
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierFinishRequestTheoremKernelTypeSha256,
    { [theoremName]: theoremHash },
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierFinishRequestAxiomClosure,
    ['Quot.sound', 'propext'],
  );
  assert.deepEqual(
    release.earnedBoundary
      .cookLevinBuilderPhysicalClassifierFinishRequestProjectAxiomClosure,
    [],
  );
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized,
    false);
});

test('M221 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find(
    (row) => row.asOfCoordinate === coordinate,
  );
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage,
    { earnedRows: 197, totalRows: 199 });
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

test('M221 remains a versioned historical publication card after M222', () => {
  const statusPage = readFileSync('status.html', 'utf8');
  const card = statusPage.match(
    new RegExp(`<article class="card" data-milestone-id="${milestoneId}"[\\s\\S]*?<\\/article>`),
  )?.[0] ?? '';
  assert.match(card, /Finish-request cell/i);
  assert.match(card, /formal artefact coverage becomes 197 of 199/i);
  assert.match(card, /risk-weighted estimate remains 35%/i);
  assert.doesNotMatch(card,
    /M221[^\n]*close(?:s|d) (?:a )?(?:fixed checkpoint|global gate)/i);
  assert.match(statusPage,
    /data-milestone-id="concrete-cook-levin-builder-physical-classifier-finish-workspace-orientation"/);
});
