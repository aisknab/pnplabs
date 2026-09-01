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

const milestoneId = 'concrete-cook-levin-builder-physical-finish-request';
const theoremName = 'PNP.Concrete.CookLevin.BuilderPhysicalFinishRequest.cook_levin_builder_physical_finish_request_checked_complete';
const theoremHash = 'b51a29e1004e8d0713fb9a663de27dccb417fbe973ef449d6f3532e5319870b0';
const moduleName = 'PNP.Concrete.CookLevinBuilderPhysicalFinishRequest';
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-01-219';

test('M219 public payloads preserve the physical Finish-request handoff boundary', () => {
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  assert.ok(milestone);
  assert.equal(milestone.title, 'Physical Finish-request handoff');
  assert.equal(milestone.classification, 'formalized-foundation-only');
  assert.equal(milestone.status, 'formalized-foundation-only');
  assert.equal(milestone.earned, true);
  assert.equal(milestone.allPresent, true);
  assert.equal(milestone.allAssumptionFree, false);
  assert.equal(milestone.allKernelTypesMatch, true);
  assert.equal(milestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(milestone.sourceClosureFingerprintMatches, true);
  assert.match(milestone.scope, /unique final post-header coordinate is derived internally/);
  assert.match(milestone.scope, /collision-free 137-rule composition/);
  assert.match(milestone.scope, /six-for-one compiled and one-step-short traces/);
  assert.match(milestone.scope, /All 49 public declarations/);
  assert.match(milestone.nonClaim, /does not derive body-token or padding requests/);
  assert.match(milestone.nonClaim, /does not.*connect successive schedule configurations into one literal raw-machine loop/);
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

test('M219 status and release mirrors retain every load-bearing field', () => {
  const pairs = [
    ['Formalized', true],
    ['AxiomAuditPassed', true],
    ['AuditedDeclarationCount', 49],
    ['CanonicalFinishCoordinateDerived', true],
    ['ProtectedBuilderSuffixFormalized', true],
    ['LiteralFinishRequestWritten', true],
    ['FixedComposedMachineRuleCount', 137],
    ['ExactWorkTraceFormalized', true],
    ['CompiledRawMachineFormalized', true],
    ['OneStepShortNonhaltingFormalized', true],
    ['ExternalInputSizePolynomialFormalized', true],
    ['BodyOrPaddingRequestDerived', false],
    ['PrecedingClassifierSuffixHandoffFormalized', false],
    ['LiteralRawLoopFormalized', false],
  ];
  for (const [suffix, expected] of pairs) {
    assert.equal(status[`leanConcreteCookLevinBuilderPhysicalFinishRequest${suffix}`], expected);
    assert.equal(release.earnedBoundary[`cookLevinBuilderPhysicalFinishRequest${suffix}`], expected);
  }
  assert.equal(release.earnedBoundary.cookLevinBuilderPhysicalFinishRequestCheckedCompleteTheorem, theoremName);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalFinishRequestTheoremKernelTypeSha256, { [theoremName]: theoremHash });
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalFinishRequestAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderPhysicalFinishRequestProjectAxiomClosure, []);
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized, false);
});

test('M219 progress snapshot remains separate and conservative', () => {
  assert.ok(index.earnedMilestones.includes(milestoneId));
  assert.equal(progress.formalArtefactCoverage.isProofCompletionMetric, false);
  const history = progress.history.find((row) => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 195, totalRows: 197 });
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

test('M219 active surfaces publish the new boundary without erasing M218 history', () => {
  for (const file of ['README.md', 'architecture.html', 'faq.html', 'index.html', 'paper.html', 'status.html']) {
    const text = readFileSync(file, 'utf8');
    assert.match(text, /195 of 197/);
    assert.match(text, /35%/);
    assert.match(text, /Finish-request|Finish request/i);
    assert.doesNotMatch(text, /M219[^\n]*close(?:s|d) (?:a )?(?:fixed checkpoint|global gate)/i);
  }
  const homepage = readFileSync('index.html', 'utf8');
  assert.match(homepage, new RegExp(`data-current-milestone="${milestoneId}"`));
  const readme = readFileSync('README.md', 'utf8');
  assert.match(readme, /Its 1 reviewed theorem pin and all 49 declarations in the focused audit/);
  const statusPage = readFileSync('status.html', 'utf8');
  assert.match(statusPage, new RegExp(`data-milestone-id="${milestoneId}"`));
  assert.match(statusPage, /data-milestone-id="concrete-cook-levin-builder-physical-dispatch-schedule"/);
  assert.equal(release.artifacts.report.pageCount, 158);
});
