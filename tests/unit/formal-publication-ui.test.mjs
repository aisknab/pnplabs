import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync('assets/main.js', 'utf8');
const validationSource = source.slice(
  source.indexOf('const STATUS_COORDINATE'),
  source.indexOf('function renderFormalStatus'),
);
const context = vm.createContext({ structuredClone });
new vm.Script(`${validationSource}\nglobalThis.validation = { FAIL_CLOSED_FORMAL_STATUS, formalStatusFields, validateConcreteGate, validateInventory, validateMilestones, validateStatus, deriveGateSubchecks };`).runInContext(context);
const validation = context.validation;

const statusBytes = readFileSync('public/pnp-status.json');
const status = JSON.parse(statusBytes);
const inventoryBytes = readFileSync('public/pnp-theorem-inventory.json');
const inventory = JSON.parse(inventoryBytes);
const index = JSON.parse(readFileSync('public/pnp-index.json', 'utf8'));
const release = JSON.parse(readFileSync('downloads/formal-publication-release.json', 'utf8'));
const updates = JSON.parse(readFileSync('content/milestone-updates.json', 'utf8'));

const STATUS_STEM_WITHOUT_SCOPE_BY_MILESTONE_ID = Object.freeze({
  'concrete-cook-levin-builder-full-schedule-cursor-controller':
    'ConcreteCookLevinBuilderFullScheduleCursorController',
  'concrete-cook-levin-builder-arbitrary-slot-header-router':
    'ConcreteCookLevinBuilderArbitrarySlotHeaderRouter',
  'concrete-cook-levin-builder-arbitrary-slot-post-header-decoder':
    'ConcreteCookLevinBuilderArbitrarySlotPostHeaderDecoder',
  'concrete-cook-levin-builder-post-header-raw-divider':
    'ConcreteCookLevinBuilderPostHeaderRawDivider',
  'concrete-cook-levin-builder-post-header-raw-launch':
    'ConcreteCookLevinBuilderPostHeaderRawLaunch',
  'concrete-cook-levin-builder-post-header-raw-tape-bridge':
    'ConcreteCookLevinBuilderPostHeaderRawTapeBridge',
  'concrete-cook-levin-builder-post-divider-raw-route-classifier':
    'ConcreteCookLevinBuilderPostDividerRawRouteClassifier',
  'concrete-cook-levin-builder-post-divider-selected-token-launch':
    'ConcreteCookLevinBuilderPostDividerSelectedTokenLaunch',
  'concrete-cook-levin-builder-complete-schedule-iteration':
    'ConcreteCookLevinBuilderCompleteScheduleIteration',
  'concrete-cook-levin-builder-physical-optional-token-dispatch':
    'ConcreteCookLevinBuilderPhysicalOptionalTokenDispatch',
  'concrete-cook-levin-builder-physical-dispatch-schedule':
    'ConcreteCookLevinBuilderPhysicalDispatchSchedule',
  'concrete-cook-levin-builder-physical-finish-request':
    'ConcreteCookLevinBuilderPhysicalFinishRequest',
  'concrete-cook-levin-builder-physical-classifier-pipeline':
    'ConcreteCookLevinBuilderPhysicalClassifierPipeline',
  'concrete-cook-levin-builder-physical-classifier-finish-request':
    'ConcreteCookLevinBuilderPhysicalClassifierFinishRequest',
  'concrete-cook-levin-builder-physical-classifier-finish-workspace-orientation':
    'ConcreteCookLevinBuilderPhysicalClassifierFinishWorkspaceOrientation',
  'concrete-cook-levin-builder-physical-classifier-finish-mirrored-dispatch':
    'ConcreteCookLevinBuilderPhysicalClassifierFinishMirroredDispatch',
  'concrete-cook-levin-builder-physical-classifier-first-body-separator-mirrored-dispatch':
    'ConcreteCookLevinBuilderPhysicalClassifierFirstBodySeparatorMirroredDispatch',
  'concrete-cook-levin-builder-physical-classifier-all-body-staged-request-mirrored-dispatch':
    'ConcreteCookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatch',
  'concrete-cook-levin-builder-physical-classifier-terminal-join':
    'ConcreteCookLevinBuilderPhysicalClassifierTerminalJoin',
});

function statusFieldStem(milestone) {
  const suffix = 'TheoremKernelTypeSha256';
  const requiredTheorems = new Set(milestone.requiredTheorems);
  const matchingField = Object.entries(release.earnedBoundary).find(
    ([key, value]) => key.endsWith(suffix)
      && value !== null
      && typeof value === 'object'
      && !Array.isArray(value)
      && Object.keys(value).length === requiredTheorems.size
      && [...requiredTheorems].every((name) => Object.hasOwn(value, name)),
  );
  assert.ok(matchingField, `missing earned-boundary fingerprint map for ${milestone.id}`);
  const releasePrefix = matchingField[0].slice(0, -suffix.length);
  const matchingScopeFields = Object.entries(release.earnedBoundary).filter(
    ([key]) => key.endsWith('Scope')
      && key.slice(0, -'Scope'.length).toLowerCase() === releasePrefix.toLowerCase(),
  );
  assert.ok(matchingScopeFields.length <= 1, `expected at most one release scope field for ${milestone.id}`);
  if (matchingScopeFields.length === 0) {
    const stem = STATUS_STEM_WITHOUT_SCOPE_BY_MILESTONE_ID[milestone.id];
    assert.ok(stem, `missing status-stem mapping for scopeless milestone ${milestone.id}`);
    assert.equal(status[`lean${stem}Formalized`], true);
    assert.equal(status[`lean${stem}AxiomAuditPassed`], true);
    return stem;
  }
  const scope = matchingScopeFields[0][1];
  const scopeKeys = Object.keys(status).filter(
    (key) => key.startsWith('lean') && key.endsWith('Scope') && status[key] === scope,
  );
  assert.equal(scopeKeys.length, 1, `expected one status scope field for ${milestone.id}`);
  return scopeKeys[0].slice('lean'.length, -'Scope'.length);
}

test('site validator accepts only the exact current inventory/status boundary', () => {
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), index.leanTheoremInventorySha256);
  assert.equal(validation.validateInventory(inventory), true);
  assert.equal(validation.validateMilestones(status, inventory), true);
  assert.equal(validation.validateConcreteGate(status, inventory), true);
  assert.equal(validation.validateStatus(status, inventory), true);
  assert.equal(status.formalPublicationMilestones.filter((row) => row.earned).length, index.formalPublicationMilestoneCounts.earned);
  assert.equal(status.formalPublicationMilestones.filter((row) => !row.earned).length, index.formalPublicationMilestoneCounts.unearned);
});

test('site validator pins the concrete locked-NAND threshold publication theorem', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === 'global-locked-nand-threshold'
  );
  const candidate = inventory.milestoneCandidates.find(
    (row) => row.name === 'PNP.Main.locked_nand_threshold'
  );
  assert.equal(milestone.classification, 'formalized-concrete-locked-nand-threshold');
  assert.equal(milestone.earned, true);
  assert.deepEqual(candidate.axioms, ['Quot.sound', 'propext']);
  assert.equal(candidate.module, 'PNP.Concrete.LockedNANDThresholdPublication');

  const missing = structuredClone(inventory);
  missing.milestoneCandidates = missing.milestoneCandidates.filter(
    (row) => row.name !== 'PNP.Main.locked_nand_threshold'
  );
  assert.equal(validation.validateInventory(missing), false);

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates.find(
    (row) => row.name === 'PNP.Main.locked_nand_threshold'
  ).axioms = ['PNP.LockedNANDThreshold'];
  assert.equal(validation.validateInventory(assumed), false);

  const moved = structuredClone(inventory);
  moved.milestoneCandidates.find(
    (row) => row.name === 'PNP.Main.locked_nand_threshold'
  ).module = 'PNP.Main';
  assert.equal(validation.validateInventory(moved), false);

  const forged = structuredClone(status);
  const forgedRow = forged.formalPublicationMilestones.find(
    (row) => row.id === 'global-locked-nand-threshold'
  );
  forgedRow.theoremRows[0].actualKernelTypeSha256 = '0'.repeat(64);
  forgedRow.theoremRows[0].expectedKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(forged, inventory), false);

  const widened = structuredClone(status);
  widened.formalPublicationMilestones.find(
    (row) => row.id === 'global-locked-nand-threshold'
  ).scope = 'A polynomial-time target decider.';
  assert.equal(validation.validateStatus(widened, inventory), false);
});

test('site validator rejects hostile latest publication mutations', () => {
  const milestoneId = updates.entries[0].milestoneId;
  const milestone = status.formalPublicationMilestones.find((row) => row.id === milestoneId);
  const theoremName = milestone.theoremRows[0].name;
  assert.equal(milestone.requiredTheorems.length, milestone.theoremRows.length);
  assert.ok(milestone.requiredTheorems.length > 0);
  assert.equal(milestone.earned, true);

  const missing = structuredClone(inventory);
  missing.milestoneCandidates = missing.milestoneCandidates.filter((row) => row.name !== theoremName);
  assert.equal(validation.validateInventory(missing), false);

  const forgedAxiom = structuredClone(inventory);
  forgedAxiom.milestoneCandidates.find((row) => row.name === theoremName).axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(forgedAxiom), false);

  const moved = structuredClone(inventory);
  moved.milestoneCandidates.find((row) => row.name === theoremName).module = 'PNP.ForgedModule';
  assert.equal(validation.validateInventory(moved), false);

  const forgedFingerprint = structuredClone(status);
  const forgedRow = forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === milestoneId).theoremRows
    .find((row) => row.name === theoremName);
  forgedRow.actualKernelTypeSha256 = '0'.repeat(64);
  forgedRow.expectedKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones.find((row) => row.id === milestoneId).scope =
    'The supplied coordinates are constructed from terminal data and prove complete Packet adequacy.';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones.find((row) => row.id === milestoneId).nonClaim =
    'All remaining routes are complete and P = NP.';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);

  const forgedStatus = structuredClone(status);
  forgedStatus[`lean${statusFieldStem(milestone)}Formalized`] = false;
  assert.equal(validation.validateStatus(forgedStatus, inventory), false);
});

test('site validator pins the ambient BN4 residual reduction from canonical payload relations', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-pkgc-ambient-bn4-residual-reduction'
  );
  assert.equal(milestone.requiredTheorems.length, 8);
  assert.equal(validation.validateStatus(status, inventory), true);

  const missing = structuredClone(inventory);
  missing.milestoneCandidates = missing.milestoneCandidates.filter(
    (row) => row.name !== milestone.requiredTheorems[0]
  );
  assert.equal(validation.validateInventory(missing), true);
  assert.equal(validation.validateStatus(status, missing), false);

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates.find(
    (row) => row.name === milestone.requiredTheorems[0]
  ).axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateStatus(status, assumed), false);

  const moved = structuredClone(inventory);
  moved.milestoneCandidates.find(
    (row) => row.name === milestone.requiredTheorems[0]
  ).module = 'PNP.ForgedModule';
  assert.equal(validation.validateStatus(status, moved), false);

  const widened = structuredClone(status);
  widened.formalPublicationMilestones.find(
    (row) => row.id === milestone.id
  ).nonClaim = 'This proves complete global route silence.';
  assert.equal(validation.validateStatus(widened, inventory), false);

  const duplicated = structuredClone(status);
  duplicated.formalPublicationMilestones.push(structuredClone(duplicated.formalPublicationMilestones[0]));
  assert.equal(validation.validateMilestones(duplicated), false);
});

test('site validator pins the latest canonical publication milestone and rejects hostile mutations', () => {
  const latestUpdate = updates.entries[0];
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === latestUpdate.milestoneId
  );
  assert.ok(milestone, `missing latest milestone ${latestUpdate.milestoneId}`);
  assert.equal(milestone.earned, true);
  assert.ok(milestone.requiredTheorems.length > 0);
  assert.deepEqual(
    milestone.requiredTheorems,
    milestone.theoremRows.map((row) => row.name),
  );
  assert.equal(latestUpdate.source.commit, index.latestEarnedMilestoneSourceCommitRef);
  assert.equal(latestUpdate.source.tree, index.latestEarnedMilestoneSourceTree);
  assert.equal(validation.validateStatus(status, inventory), true);

  const missing = structuredClone(inventory);
  missing.milestoneCandidates = missing.milestoneCandidates.filter(
    (row) => row.name !== milestone.requiredTheorems[0]
  );
  assert.equal(validation.validateInventory(missing), false);
  assert.equal(validation.validateStatus(status, missing), false);

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates.find(
    (row) => row.name === milestone.requiredTheorems[0]
  ).axioms = ['PNP.ForgedLatestMilestoneAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const moved = structuredClone(inventory);
  moved.milestoneCandidates.find(
    (row) => row.name === milestone.requiredTheorems[0]
  ).module = 'PNP.ForgedLatestMilestoneModule';
  assert.equal(validation.validateInventory(moved), false);

  const forgedFingerprint = structuredClone(status);
  const forgedRow = forgedFingerprint.formalPublicationMilestones.find(
    (row) => row.id === milestone.id
  ).theoremRows[0];
  forgedRow.actualKernelTypeSha256 = '0'.repeat(64);
  forgedRow.expectedKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  const fieldStem = statusFieldStem(milestone);
  for (const field of [`lean${fieldStem}Formalized`, `lean${fieldStem}AxiomAuditPassed`]) {
    assert.equal(status[field], true, `missing latest milestone gate ${field}`);
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const scopeField = `lean${fieldStem}Scope`;
  const statusFields = [
    [`lean${fieldStem}Formalized`, true, false],
    [`lean${fieldStem}AxiomAuditPassed`, true, false],
  ];
  if (Object.hasOwn(status, scopeField)) {
    assert.equal(typeof status[scopeField], 'string');
    const strippedScope = structuredClone(status);
    strippedScope[scopeField] = 'unsupported-broader-scope';
    assert.equal(validation.validateStatus(strippedScope, inventory), false, scopeField);
    statusFields.push([scopeField, status[scopeField], null]);
  } else {
    assert.equal(STATUS_STEM_WITHOUT_SCOPE_BY_MILESTONE_ID[milestone.id], fieldStem);
  }

  const renderedStatusLines = new Set(validation.formalStatusFields(status).split('\n'));
  const renderedFailClosedLines = new Set(
    validation.formalStatusFields(validation.FAIL_CLOSED_FORMAL_STATUS).split('\n'),
  );
  for (const [field, value, failClosedValue] of statusFields) {
    assert.ok(
      renderedStatusLines.has(`${field} = ${JSON.stringify(value)}`),
      `rendered current status omits latest milestone field: ${field}`,
    );
    assert.equal(
      validation.FAIL_CLOSED_FORMAL_STATUS[field],
      failClosedValue,
      `fail-closed status omits latest milestone field: ${field}`,
    );
    assert.ok(
      renderedFailClosedLines.has(`${field} = ${JSON.stringify(failClosedValue)}`),
      `rendered fail-closed status omits latest milestone field: ${field}`,
    );
  }

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones.find(
    (row) => row.id === milestone.id
  ).scope = 'This constructs a complete polynomial selector and realizer.';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones.find(
    (row) => row.id === milestone.id
  ).nonClaim = 'This proves the entire remaining claim.';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);
});

test('pre-fetch UI state reports every source-parser claim as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanConcreteLockedNANDParserMachineFormalized',
    'leanConcreteLockedNANDParserAxiomAuditPassed',
    'leanConcreteLockedNANDParserAllInputExactFormalized',
    'leanConcreteLockedNANDParserExactOutputFormalized',
    'leanConcreteLockedNANDParserCompiledNonTimeoutFormalized',
    'leanConcreteLockedNANDParserPolynomialTimeMachineFormalized',
    'leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized',
    'leanConcreteLockedNANDParserRawRefinementFormalized',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanConcreteLockedNANDParserAuditedDeclarationCount, 0);
  assert.equal(failClosed.leanConcreteLockedNANDParserScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanConcreteLockedNANDParserMachineFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDParserAxiomAuditPassed = false/u);
  assert.match(rendered, /leanConcreteLockedNANDParserAuditedDeclarationCount = 0/u);
  assert.match(rendered, /leanConcreteLockedNANDParserAllInputExactFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDParserExactOutputFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDParserCompiledNonTimeoutFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDParserPolynomialTimeMachineFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDParserRawRefinementFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDParserScope = null/u);
});

test('pre-fetch UI state reports every target-emitter claim as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanConcreteLockedNANDEmitterMachineFormalized',
    'leanConcreteLockedNANDEmitterAxiomAuditPassed',
    'leanConcreteLockedNANDEmitterAllInputExactFormalized',
    'leanConcreteLockedNANDEmitterExactTargetBytesFormalized',
    'leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized',
    'leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized',
    'leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized',
    'leanConcreteLockedNANDEmitterRawRefinementFormalized',
    'leanConcreteLockedNANDEmitterStrictParserCompositionFormalized',
    'leanConcreteLockedNANDEmitterOutputSizeBoundFormalized',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanConcreteLockedNANDEmitterAuditedDeclarationCount, 0);
  assert.equal(failClosed.leanConcreteLockedNANDEmitterScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanConcreteLockedNANDEmitterMachineFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDEmitterAxiomAuditPassed = false/u);
  assert.match(rendered, /leanConcreteLockedNANDEmitterAuditedDeclarationCount = 0/u);
  assert.match(rendered, /leanConcreteLockedNANDEmitterStrictParserCompositionFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDEmitterOutputSizeBoundFormalized = false/u);
  assert.match(rendered, /leanConcreteLockedNANDEmitterScope = null/u);
});

test('pre-fetch UI state reports terminal physical support completion as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalExecutableSaturationFormalized',
    'leanResidualTerminalPhysicalSupportCompletionFormalized',
    'leanResidualTerminalPhysicalBoundaryFormalized',
    'leanResidualTerminalPhysicalInterfaceFormalized',
    'leanResidualTerminalPhysicalCompatibilityFormalized',
    'leanResidualTerminalPhysicalSupportCompletionAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalPhysicalSupportCompletionScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalExecutableSaturationFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalPhysicalSupportCompletionFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalPhysicalSupportCompletionScope = null/u);
});

test('pre-fetch UI state reports saturated terminal support square as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalSupportSquareClosureFormalized',
    'leanResidualTerminalSupportSquareMeetJoinExactFormalized',
    'leanResidualTerminalSupportSquarePhysicalCompatibilityFormalized',
    'leanResidualTerminalSupportSquareSemanticExtractionFormalized',
    'leanResidualTerminalSupportSquareClosureAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalSupportSquareClosureScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalSupportSquareClosureFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSupportSquareMeetJoinExactFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSupportSquareClosureScope = null/u);
});

test('pre-fetch UI state reports governed terminal frontier pushout as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalFrontierPushoutFormalized',
    'leanResidualTerminalFrontierBoundaryGlueExactFormalized',
    'leanResidualTerminalFrontierInterfaceGlueExactFormalized',
    'leanResidualTerminalFrontierProfileGlueExactFormalized',
    'leanResidualTerminalFrontierInternalizationFormalized',
    'leanResidualTerminalFrontierPushoutAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalFrontierPushoutScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalFrontierPushoutFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFrontierInternalizationFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFrontierPushoutScope = null/u);
});

test('pre-fetch UI state reports governed terminal projection square as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalProjectionSquareFormalized',
    'leanResidualTerminalProjectionPhysicalInvariantFormalized',
    'leanResidualTerminalProjectionProfileExactFormalized',
    'leanResidualTerminalProjectionMeetJoinCommuteFormalized',
    'leanResidualTerminalProjectionPushoutCommuteFormalized',
    'leanResidualTerminalProjectionSquareAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalProjectionSquareScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalProjectionSquareFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalProjectionPushoutCommuteFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalProjectionSquareScope = null/u);
});

test('pre-fetch UI state reports side-tight minimum arithmetic as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalSideTightMinimumArithmeticFormalized',
    'leanResidualTerminalSideTightSignedSlackIdentityFormalized',
    'leanResidualTerminalSideTightFailClosedGateFormalized',
    'leanResidualTerminalSideTightCanonicalFullBasisFormalized',
    'leanResidualTerminalSideTightCanonicalQuotientBasisFormalized',
    'leanResidualTerminalSideTightMinimumAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalSideTightMinimumScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalSideTightMinimumArithmeticFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSideTightFailClosedGateFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSideTightMinimumScope = null/u);
});

test('pre-fetch UI state reports four-corner carrier transport as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalFourCornerCarrierTransportFormalized',
    'leanResidualTerminalFourCornerCarrierExactEndpointsFormalized',
    'leanResidualTerminalFourCornerCarrierInjectiveCoordinatesFormalized',
    'leanResidualTerminalFourCornerCarrierProfileTransportFormalized',
    'leanResidualTerminalFourCornerCarrierFailClosedPhysicalTransportFormalized',
    'leanResidualTerminalFourCornerCarrierAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalFourCornerCarrierScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalFourCornerCarrierTransportFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFourCornerCarrierFailClosedPhysicalTransportFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFourCornerCarrierScope = null/u);
});

test('pre-fetch UI state reports four-corner optimum carrier compatibility as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalFourCornerOptimaCarrierCompatibleFormalized',
    'leanResidualTerminalFourCornerOptimaFaithfulAmbientizationFormalized',
    'leanResidualTerminalFourCornerOptimaReferenceMinimumPreservedFormalized',
    'leanResidualTerminalFourCornerOptimaLocalizedMinimaFormalized',
    'leanResidualTerminalFourCornerOptimaSharedObserverProjectionFormalized',
    'leanResidualTerminalFourCornerOptimaAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalFourCornerOptimaCarrierScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalFourCornerOptimaCarrierCompatibleFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFourCornerOptimaSharedObserverProjectionFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFourCornerOptimaCarrierScope = null/u);
});

test('pre-fetch UI state reports four-corner optimum coherence as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalFourCornerOptimumCoherenceClassifierFormalized',
    'leanResidualTerminalFourCornerOptimumFirstFailureFormalized',
    'leanResidualTerminalFourCornerOptimumRetainedSemanticsFormalized',
    'leanResidualTerminalFourCornerOptimumProfileTransportFormalized',
    'leanResidualTerminalFourCornerOptimumModeFirewallFormalized',
    'leanResidualTerminalFourCornerOptimumSideTightTupleFactsFormalized',
    'leanResidualTerminalFourCornerOptimumCoherenceAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalFourCornerOptimumCoherenceScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalFourCornerOptimumCoherenceClassifierFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFourCornerOptimumFirstFailureFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFourCornerOptimumCoherenceScope = null/u);
});

test('pre-fetch UI state reports computed terminal BN2 square legitimacy as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalSquareLegitimacyFormalized',
    'leanResidualTerminalSquareStructuralCompatibilityFormalized',
    'leanResidualTerminalSquareFrontierPushoutFormalized',
    'leanResidualTerminalSquareSharedQuantityCarrierFormalized',
    'leanResidualTerminalSquareLocalConclusionUnderRouteSilenceFormalized',
    'leanResidualTerminalSquareFailClosedRouteDichotomyFormalized',
    'leanResidualTerminalSquareLegitimacyAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalSquareLegitimacyScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalSquareLegitimacyFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSquareStructuralCompatibilityFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSquareFailClosedRouteDichotomyFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSquareLegitimacyScope = null/u);
});

test('pre-fetch UI state reports computed terminal BCEL anchor nucleus as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalComputedBCELAnchorNucleusFormalized',
    'leanResidualTerminalBCELMinimumPositiveNucleusFormalized',
    'leanResidualTerminalBCELAnchorAlgebraFormalized',
    'leanResidualTerminalBCELCutDefectFirewallFormalized',
    'leanResidualTerminalBCELCutRouteDichotomyFormalized',
    'leanResidualTerminalBCELConstantCutConclusionFormalized',
    'leanResidualTerminalBCELAnchorNucleusAxiomAuditPassed',
    'leanSaturatePositiveFormalized',
    'leanBCELReadyFormalized',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalBCELAnchorNucleusScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalComputedBCELAnchorNucleusFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalBCELCutRouteDichotomyFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalBCELAnchorNucleusScope = null/u);
  assert.match(rendered, /leanSaturatePositiveFormalized = false/u);
  assert.match(rendered, /leanBCELReadyFormalized = false/u);
});

test('computed terminal BCEL anchor nucleus requires its exact conservative boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-computed-bcel-anchor-nucleus'
  );
  assert.equal(milestone.requiredTheorems.length, 36);
  assert.equal(milestone.theoremRows.every((row) => row.present && row.kernelTypeFingerprintMatches), true);
  assert.equal(validation.validateStatus(status, inventory), true);

  for (const key of [
    'leanResidualTerminalComputedBCELAnchorNucleusFormalized',
    'leanResidualTerminalBCELMinimumPositiveNucleusFormalized',
    'leanResidualTerminalBCELAnchorAlgebraFormalized',
    'leanResidualTerminalBCELCutDefectFirewallFormalized',
    'leanResidualTerminalBCELCutRouteDichotomyFormalized',
    'leanResidualTerminalBCELConstantCutConclusionFormalized',
    'leanResidualTerminalBCELAnchorNucleusAxiomAuditPassed',
  ]) {
    const altered = structuredClone(status);
    altered[key] = false;
    assert.equal(validation.validateStatus(altered, inventory), false, key);
  }

  for (const key of ['leanSaturatePositiveFormalized', 'leanBCELReadyFormalized']) {
    const widened = structuredClone(status);
    widened[key] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, key);
  }

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualTerminalBCELAnchorNucleusScope = 'unconditional-bcel-ready';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const widenedMilestone = structuredClone(status);
  widenedMilestone.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-computed-bcel-anchor-nucleus'
  ).nonClaim = 'This establishes BCELReady and P = NP.';
  assert.equal(validation.validateStatus(widenedMilestone, inventory), false);

  const missingPin = structuredClone(status);
  missingPin.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-computed-bcel-anchor-nucleus'
  ).requiredTheorems.pop();
  assert.equal(validation.validateStatus(missingPin, inventory), false);
});

test('pre-fetch UI state reports the terminal saturation-positivity firewall as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalSaturationPositivityFirewallFormalized',
    'leanResidualTerminalSaturationPositivityFirewallAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalSaturationPositivityFirewallScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalSaturationPositivityFirewallFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSaturationPositivityFirewallAxiomAuditPassed = false/u);
  assert.match(rendered, /leanResidualTerminalSaturationPositivityFirewallScope = null/u);
});

test('terminal saturation-positivity firewall requires its exact conservative boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-saturation-positivity-firewall'
  );
  assert.equal(milestone.requiredTheorems.length, 12);
  assert.equal(milestone.theoremRows.every((row) => row.present && row.kernelTypeFingerprintMatches), true);
  assert.match(milestone.scope, /zero projection defect returns an attained quotient minimum with a checked full lift/u);
  assert.match(milestone.nonClaim, /closes only projectionPositivityNotLostSilently/u);
  assert.equal(validation.validateStatus(status, inventory), true);

  for (const key of [
    'leanResidualTerminalSaturationPositivityFirewallFormalized',
    'leanResidualTerminalSaturationPositivityFirewallAxiomAuditPassed',
  ]) {
    const altered = structuredClone(status);
    altered[key] = false;
    assert.equal(validation.validateStatus(altered, inventory), false, key);
  }

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualTerminalSaturationPositivityFirewallScope = 'full-saturate-positive';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const widenedMilestone = structuredClone(status);
  widenedMilestone.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-saturation-positivity-firewall'
  ).nonClaim = 'This establishes SaturatePositive and P = NP.';
  assert.equal(validation.validateStatus(widenedMilestone, inventory), false);

  const missingPin = structuredClone(status);
  missingPin.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-saturation-positivity-firewall'
  ).requiredTheorems.pop();
  assert.equal(validation.validateStatus(missingPin, inventory), false);
});

test('pre-fetch UI state reports candidate-derived saturation cost balance as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalCandidateSaturationFormalized',
    'leanResidualTerminalSaturationCostBalanceFormalized',
    'leanResidualTerminalFirstNontransparentStepFormalized',
    'leanResidualTerminalSaturationCostBalanceAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalSaturationCostBalanceScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalCandidateSaturationFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSaturationCostBalanceFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFirstNontransparentStepFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalSaturationCostBalanceAxiomAuditPassed = false/u);
  assert.match(rendered, /leanResidualTerminalSaturationCostBalanceScope = null/u);
});

test('candidate-derived saturation cost balance requires its exact conservative boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-candidate-saturation-cost-balance'
  );
  assert.equal(milestone.requiredTheorems.length, 17);
  assert.equal(milestone.theoremRows.every((row) => row.present && row.kernelTypeFingerprintMatches), true);
  assert.match(milestone.scope, /candidate-derived dependency system and deterministic rule-labelled saturation trace/u);
  assert.match(milestone.nonClaim, /finite terminal forms of transparentSaturationCostBalanced and firstNontransparentStepRecorded/u);
  assert.equal(validation.validateStatus(status, inventory), true);

  for (const key of [
    'leanResidualTerminalCandidateSaturationFormalized',
    'leanResidualTerminalSaturationCostBalanceFormalized',
    'leanResidualTerminalFirstNontransparentStepFormalized',
    'leanResidualTerminalSaturationCostBalanceAxiomAuditPassed',
  ]) {
    const altered = structuredClone(status);
    altered[key] = false;
    assert.equal(validation.validateStatus(altered, inventory), false, key);
  }

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualTerminalSaturationCostBalanceScope = 'full-saturate-positive';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const widenedMilestone = structuredClone(status);
  widenedMilestone.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-candidate-saturation-cost-balance'
  ).nonClaim = 'This establishes SaturatePositive and P = NP.';
  assert.equal(validation.validateStatus(widenedMilestone, inventory), false);

  const missingPin = structuredClone(status);
  missingPin.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-candidate-saturation-cost-balance'
  ).requiredTheorems.pop();
  assert.equal(validation.validateStatus(missingPin, inventory), false);
});

test('pre-fetch UI state reports terminal interface-exposure routing as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalInterfaceExposureRoutingFormalized',
    'leanResidualTerminalFiniteInterfaceExposureRoutesToEFormalized',
    'leanResidualTerminalInterfaceExposureZeroCostRetractFormalized',
    'leanResidualTerminalFirstInterfaceExposureRouteFormalized',
    'leanResidualTerminalInterfaceExposureRoutingAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalInterfaceExposureRoutingScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalInterfaceExposureRoutingFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFiniteInterfaceExposureRoutesToEFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalInterfaceExposureZeroCostRetractFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFirstInterfaceExposureRouteFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalInterfaceExposureRoutingAxiomAuditPassed = false/u);
  assert.match(rendered, /leanResidualTerminalInterfaceExposureRoutingScope = null/u);
});

test('terminal interface-exposure routing requires its exact conservative boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-interface-exposure-routing'
  );
  assert.equal(milestone.requiredTheorems.length, 10);
  assert.equal(milestone.theoremRows.every((row) => row.present && row.kernelTypeFingerprintMatches), true);
  assert.match(milestone.scope, /exact candidate-derived interface-consumer edge/u);
  assert.match(milestone.nonClaim, /finite local form of interfaceExposureRoutesToE/u);
  assert.equal(validation.validateStatus(status, inventory), true);

  for (const key of [
    'leanResidualTerminalInterfaceExposureRoutingFormalized',
    'leanResidualTerminalFiniteInterfaceExposureRoutesToEFormalized',
    'leanResidualTerminalInterfaceExposureZeroCostRetractFormalized',
    'leanResidualTerminalFirstInterfaceExposureRouteFormalized',
    'leanResidualTerminalInterfaceExposureRoutingAxiomAuditPassed',
  ]) {
    const altered = structuredClone(status);
    altered[key] = false;
    assert.equal(validation.validateStatus(altered, inventory), false, key);
  }

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualTerminalInterfaceExposureRoutingScope = 'global-package-e-route-completeness';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const widenedMilestone = structuredClone(status);
  widenedMilestone.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-interface-exposure-routing'
  ).nonClaim = 'This establishes Package E and P = NP.';
  assert.equal(validation.validateStatus(widenedMilestone, inventory), false);

  const missingPin = structuredClone(status);
  missingPin.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-interface-exposure-routing'
  ).requiredTheorems.pop();
  assert.equal(validation.validateStatus(missingPin, inventory), false);
});

test('pre-fetch UI state reports terminal finite SaturatePositive composition as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  for (const field of [
    'leanResidualTerminalOriginKernelObligationRoutingFormalized',
    'leanResidualTerminalFiniteOriginKernelObligationClosureRoutedFormalized',
    'leanResidualTerminalFirstOriginKernelObligationRouteFormalized',
    'leanResidualTerminalOriginKernelObligationRoutingAxiomAuditPassed',
    'leanResidualTerminalFiniteSaturatePositiveCompositionFormalized',
    'leanResidualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed',
  ]) assert.equal(failClosed[field], false, field);
  assert.equal(failClosed.leanResidualTerminalOriginKernelObligationRoutingScope, null);
  assert.equal(failClosed.leanResidualTerminalFiniteSaturatePositiveCompositionScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalOriginKernelObligationRoutingFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFiniteOriginKernelObligationClosureRoutedFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFirstOriginKernelObligationRouteFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalOriginKernelObligationRoutingAxiomAuditPassed = false/u);
  assert.match(rendered, /leanResidualTerminalOriginKernelObligationRoutingScope = null/u);
  assert.match(rendered, /leanResidualTerminalFiniteSaturatePositiveCompositionFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed = false/u);
  assert.match(rendered, /leanResidualTerminalFiniteSaturatePositiveCompositionScope = null/u);
});

test('terminal finite SaturatePositive composition requires its exact conservative boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-finite-saturate-positive-composition'
  );
  assert.equal(milestone.requiredTheorems.length, 9);
  assert.equal(milestone.theoremRows.every((row) => row.present && row.kernelTypeFingerprintMatches), true);
  assert.match(milestone.scope, /positive full slack/u);
  assert.match(milestone.nonClaim, /finite local form of originKernelObligationClosureRouted/u);
  assert.equal(validation.validateStatus(status, inventory), true);

  for (const key of [
    'leanResidualTerminalOriginKernelObligationRoutingFormalized',
    'leanResidualTerminalFiniteOriginKernelObligationClosureRoutedFormalized',
    'leanResidualTerminalFirstOriginKernelObligationRouteFormalized',
    'leanResidualTerminalOriginKernelObligationRoutingAxiomAuditPassed',
    'leanResidualTerminalFiniteSaturatePositiveCompositionFormalized',
    'leanResidualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed',
  ]) {
    const altered = structuredClone(status);
    altered[key] = false;
    assert.equal(validation.validateStatus(altered, inventory), false, key);
  }

  const widenedRoutingScope = structuredClone(status);
  widenedRoutingScope.leanResidualTerminalOriginKernelObligationRoutingScope = 'global-route-completeness';
  assert.equal(validation.validateStatus(widenedRoutingScope, inventory), false);

  const widenedCompositionScope = structuredClone(status);
  widenedCompositionScope.leanResidualTerminalFiniteSaturatePositiveCompositionScope = 'manuscript-wide-saturate-positive';
  assert.equal(validation.validateStatus(widenedCompositionScope, inventory), false);

  const widenedMilestone = structuredClone(status);
  widenedMilestone.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-finite-saturate-positive-composition'
  ).nonClaim = 'This establishes SaturatePositive, Package E, and P = NP.';
  assert.equal(validation.validateStatus(widenedMilestone, inventory), false);

  const missingPin = structuredClone(status);
  missingPin.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-finite-saturate-positive-composition'
  ).requiredTheorems.pop();
  assert.equal(validation.validateStatus(missingPin, inventory), false);
});

test('pre-fetch UI state reports residual terminal RankWF as fail closed', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  assert.equal(failClosed.leanResidualTerminalRankWFFormalized, false);
  assert.equal(failClosed.leanResidualTerminalRankWFAxiomAuditPassed, false);
  assert.equal(failClosed.leanResidualTerminalRankWFScope, null);

  const rendered = validation.formalStatusFields(failClosed);
  assert.match(rendered, /leanResidualTerminalRankWFFormalized = false/u);
  assert.match(rendered, /leanResidualTerminalRankWFAxiomAuditPassed = false/u);
  assert.match(rendered, /leanResidualTerminalRankWFScope = null/u);
});

test('residual terminal RankWF requires its exact conservative boundary', () => {
  const milestone = status.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-rank-wf'
  );
  assert.equal(milestone.requiredTheorems.length, 18);
  assert.equal(milestone.theoremRows.every((row) => row.present && row.kernelTypeFingerprintMatches), true);
  assert.match(milestone.scope, /exactly ten natural coordinates/u);
  assert.match(milestone.nonClaim, /does not map the current finite terminal routes/u);
  assert.equal(validation.validateStatus(status, inventory), true);

  for (const key of [
    'leanResidualTerminalRankWFFormalized',
    'leanResidualTerminalRankWFAxiomAuditPassed',
  ]) {
    const altered = structuredClone(status);
    altered[key] = false;
    assert.equal(validation.validateStatus(altered, inventory), false, key);
  }

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualTerminalRankWFScope = 'all-routes-strictly-decrease-and-are-complete';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const widenedMilestone = structuredClone(status);
  widenedMilestone.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-rank-wf'
  ).nonClaim = 'This establishes route completeness, Package E, and P = NP.';
  assert.equal(validation.validateStatus(widenedMilestone, inventory), false);

  const missingPin = structuredClone(status);
  missingPin.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-rank-wf'
  ).requiredTheorems.pop();
  assert.equal(validation.validateStatus(missingPin, inventory), false);

  const forgedInventory = structuredClone(inventory);
  forgedInventory.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.terminalResidualRankLexLT_wellFounded'
  ).axioms = ['PNP.CheckPCCPackexp'];
  assert.equal(validation.validateInventory(forgedInventory), false);
});

test('V54 consumer-antichain normal form is fail closed and requires its exact boundary', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  assert.equal(failClosed.leanResidualTerminalConsumerAntichainNormalFormFormalized, false);
  assert.equal(failClosed.leanResidualTerminalConsumerAntichainNormalFormAxiomAuditPassed, false);
  assert.equal(failClosed.leanResidualTerminalConsumerAntichainNormalFormScope, null);
  assert.match(
    validation.formalStatusFields(failClosed),
    /leanResidualTerminalConsumerAntichainNormalFormFormalized = false/u
  );

  const erasedAudit = structuredClone(status);
  erasedAudit.leanResidualTerminalConsumerAntichainNormalFormAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(erasedAudit, inventory), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-consumer-antichain-normal-form'
  ).scope = 'A complete PkgC and BN6 construction.';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-consumer-antichain-normal-form'
  ).theoremRows.find(
    (row) => row.name === 'PNP.DirectWire.terminalV54_consumerAntichain_normal_form'
  ).actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);
});

test('V53 constant-cut hypergraph rigidity is fail closed and requires its exact boundary', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  assert.equal(failClosed.leanResidualTerminalConstantCutHypergraphRigidityFormalized, false);
  assert.equal(failClosed.leanResidualTerminalConstantCutHypergraphRigidityAxiomAuditPassed, false);
  assert.equal(failClosed.leanResidualTerminalConstantCutHypergraphRigidityScope, null);
  assert.match(
    validation.formalStatusFields(failClosed),
    /leanResidualTerminalConstantCutHypergraphRigidityFormalized = false/u
  );

  const erasedAudit = structuredClone(status);
  erasedAudit.leanResidualTerminalConstantCutHypergraphRigidityAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(erasedAudit, inventory), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-constant-cut-hypergraph-rigidity'
  ).scope = 'A complete PkgC, BN6, ZeroSlack, and PCCMin construction.';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-constant-cut-hypergraph-rigidity'
  ).theoremRows.find(
    (row) => row.name === 'PNP.DirectWire.terminalV53_constantCut_hypergraph_rigidity'
  ).actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  const forgedInventory = structuredClone(inventory);
  forgedInventory.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.terminalV53_constantCut_hypergraph_rigidity'
  ).axioms = ['PNP.CheckPCCPackexp'];
  assert.equal(validation.validateInventory(forgedInventory), false);
});

test('PkgC separating-consumer restoration dichotomy is fail closed and rejects widened or forged evidence', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  assert.equal(failClosed.leanResidualTerminalPkgCSeparatingConsumersFormalized, false);
  assert.equal(failClosed.leanResidualTerminalPkgCSeparatingConsumersAxiomAuditPassed, false);
  assert.equal(failClosed.leanResidualTerminalPkgCSeparatingConsumersScope, null);
  assert.match(
    validation.formalStatusFields(failClosed),
    /leanResidualTerminalPkgCSeparatingConsumersFormalized = false/u
  );

  const erasedAudit = structuredClone(status);
  erasedAudit.leanResidualTerminalPkgCSeparatingConsumersAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(erasedAudit, inventory), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-pkgc-separating-consumers'
  ).scope = 'A complete PkgC, BN6, ZeroSlack, PCCMin, and P = NP construction.';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-pkgc-separating-consumers'
  ).theoremRows.find(
    (row) => row.name === 'PNP.DirectWire.classifyTerminalPkgCSeparatingConsumers_exhaustive'
  ).actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  const forgedInventory = structuredClone(inventory);
  forgedInventory.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.classifyTerminalPkgCSeparatingConsumers_exhaustive'
  ).axioms = ['PNP.CheckPCCPackexp'];
  assert.equal(validation.validateInventory(forgedInventory), false);
});

test('PkgC typed restoration realization is fail closed and rejects widened or forged evidence', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  assert.equal(failClosed.leanResidualTerminalPkgCTypedRestorationFormalized, false);
  assert.equal(failClosed.leanResidualTerminalPkgCTypedRestorationAxiomAuditPassed, false);
  assert.equal(failClosed.leanResidualTerminalPkgCTypedRestorationScope, null);
  assert.match(
    validation.formalStatusFields(failClosed),
    /leanResidualTerminalPkgCTypedRestorationFormalized = false/u
  );

  const erasedAudit = structuredClone(status);
  erasedAudit.leanResidualTerminalPkgCTypedRestorationAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(erasedAudit, inventory), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-pkgc-typed-restoration'
  ).scope = 'A complete PkgC, BN6, ZeroSlack, PCCMin, and P = NP construction.';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-pkgc-typed-restoration'
  ).theoremRows.find(
    (row) => row.name === 'PNP.DirectWire.classifyTerminalPkgCTypedRestoration_exhaustive'
  ).actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  const forgedInventory = structuredClone(inventory);
  forgedInventory.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.classifyTerminalPkgCTypedRestoration_exhaustive'
  ).axioms = ['PNP.CheckPCCPackexp'];
  assert.equal(validation.validateInventory(forgedInventory), false);
});

test('PkgC same-key cancellation is fail closed and rejects widened or forged evidence', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  assert.equal(failClosed.leanResidualTerminalPkgCSameKeyCancellationFormalized, false);
  assert.equal(failClosed.leanResidualTerminalPkgCSameKeyCancellationAxiomAuditPassed, false);
  assert.equal(failClosed.leanResidualTerminalPkgCSameKeyCancellationScope, null);
  assert.match(
    validation.formalStatusFields(failClosed),
    /leanResidualTerminalPkgCSameKeyCancellationFormalized = false/u
  );

  const erasedAudit = structuredClone(status);
  erasedAudit.leanResidualTerminalPkgCSameKeyCancellationAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(erasedAudit, inventory), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-pkgc-same-key-cancellation'
  ).scope = 'A complete ambient BN4 ledger, global PkgC, ZeroSlack, PCCMin, and P = NP construction.';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-pkgc-same-key-cancellation'
  ).theoremRows.find(
    (row) => row.name === 'PNP.DirectWire.classifyTerminalPkgCSameKeyCancellation_exhaustive'
  ).actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  const forgedInventory = structuredClone(inventory);
  forgedInventory.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.classifyTerminalPkgCSameKeyCancellation_exhaustive'
  ).axioms = ['PNP.CheckPCCPackexp'];
  assert.equal(validation.validateInventory(forgedInventory), false);
});

test('BN6 grouped hypergraph-packet bridge is fail closed and rejects widened or forged evidence', () => {
  const failClosed = validation.FAIL_CLOSED_FORMAL_STATUS;
  assert.equal(failClosed.leanResidualTerminalBN6HypergraphPacketFormalized, false);
  assert.equal(failClosed.leanResidualTerminalBN6HypergraphPacketAxiomAuditPassed, false);
  assert.equal(failClosed.leanResidualTerminalBN6HypergraphPacketScope, null);
  assert.match(
    validation.formalStatusFields(failClosed),
    /leanResidualTerminalBN6HypergraphPacketFormalized = false/u
  );

  const erasedAudit = structuredClone(status);
  erasedAudit.leanResidualTerminalBN6HypergraphPacketAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(erasedAudit, inventory), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-bn6-hypergraph-packet'
  ).scope = 'A complete PkgC, selector, ZeroSlack, PCCMin, and P = NP construction.';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-bn6-hypergraph-packet'
  ).theoremRows.find(
    (row) => row.name === 'PNP.DirectWire.terminalBN6_hypergraph_packet'
  ).actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  const forgedInventory = structuredClone(inventory);
  forgedInventory.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.terminalBN6_hypergraph_packet'
  ).axioms = ['PNP.CheckPCCPackexp'];
  assert.equal(validation.validateInventory(forgedInventory), false);
});

test('null publication fingerprints never match null', () => {
  const forged = structuredClone(status);
  forged.concretePublicationGate.passed = true;
  for (const key of Object.keys(forged.concretePublicationGate.subchecks)) {
    forged.concretePublicationGate.subchecks[key] = true;
  }
  assert.equal(validation.deriveGateSubchecks(forged, inventory).concreteTargetKernelTypeFingerprintMatches, false);
  assert.equal(validation.deriveGateSubchecks(forged, inventory).sourceClosureFingerprintMatches, false);
  assert.equal(validation.validateConcreteGate(forged, inventory), false);
  assert.equal(validation.validateStatus(forged, inventory), false);
});

test('legacy eligibility and historical/checker fields cannot activate publication', () => {
  const forged = structuredClone(status);
  forged.abstractPEqualsNPPublicationEligible = true;
  forged.mathematicalTheoremEstablished = true;
  forged.publicTheoremEmissionAllowed = true;
  forged.finalTheoremReady = true;
  forged.historicalCheckerAccepted = true;
  forged.historicalActivationAccepted = true;
  assert.equal(validation.validateStatus(forged, inventory), false);
});

test('secondary authority fields and blocker ledgers cannot overclaim', () => {
  for (const field of [
    'internalFinalTheoremReady',
    'unrestrictedFinalSoundnessDischarged',
    'uniformFinalSoundnessProved',
    'checkerAcceptanceIsMathematicalProof',
    'externalReviewIsMathematicalPremise',
  ]) {
    const forged = structuredClone(status);
    forged[field] = true;
    assert.equal(validation.validateStatus(forged, inventory), false, field);
  }

  for (const [field, value] of [
    ['activeFinalNodeIds', ['forged-root']],
    ['remainingFormalObligations', []],
    ['remainingBlockers', []],
  ]) {
    const forged = structuredClone(status);
    forged[field] = value;
    assert.equal(validation.validateStatus(forged, inventory), false, field);
  }
});

test('CNF-SAT milestone cannot be widened to InP, NP-completeness, or P = NP', () => {
  for (const field of [
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
    'rootLeanTheoremPresent',
  ]) {
    const forged = structuredClone(status);
    forged[field] = true;
    assert.equal(validation.validateStatus(forged, inventory), false, field);
  }

  const missingMembership = structuredClone(inventory);
  missingMembership.milestoneCandidates = missingMembership.milestoneCandidates
    .filter((candidate) => candidate.name !== 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP');
  assert.equal(validation.validateInventory(missingMembership), false);

  const assumedMembership = structuredClone(inventory);
  assumedMembership.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumedMembership), false);
});

test('Cook-Levin semantic bridge requires its exact standard-axiom closure and cannot become a complexity claim', () => {
  const assumedBridge = structuredClone(inventory);
  assumedBridge.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language')
    .axioms = ['Classical.choice', 'PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumedBridge), false);

  const forgedMilestone = structuredClone(status);
  forgedMilestone.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-raw-tape-bridge')
    .theoremRows[0].axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateMilestones(forgedMilestone), false);
  assert.equal(validation.validateStatus(forgedMilestone, inventory), false);
});

test('Cook-Levin formula-size evidence is exact and cannot be widened into a reduction claim', () => {
  const missingFormulaSize = structuredClone(inventory);
  missingFormulaSize.milestoneCandidates = missingFormulaSize.milestoneCandidates
    .filter((candidate) => candidate.name !== 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le');
  assert.equal(validation.validateInventory(missingFormulaSize), false);

  const assumedFormulaSize = structuredClone(inventory);
  assumedFormulaSize.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumedFormulaSize), false);

  const forgedFingerprint = structuredClone(status);
  const forgedFormulaSize = forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-formula-size');
  forgedFormulaSize.theoremRows
    .find((row) => row.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le')
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of ['leanConcreteCNFNPCompletenessFormalized', 'leanConcreteCNFSATInPFormalized']) {
    const widenedClaim = structuredClone(status);
    widenedClaim[field] = true;
    assert.equal(validation.validateStatus(widenedClaim, inventory), false, field);
  }
});

test('Cook-Levin formula schedule requires exact emission, length, and approved axiom closure', () => {
  for (const name of [
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula',
  ]) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  const schedule = forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-formula-schedule');
  schedule.theoremRows
    .find((row) => row.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula')
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);
});

test('Cook-Levin formula cursor requires all direct lookups, exact traversal, and approved closure', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-formula-cursor');
  assert.equal(milestone.requiredTheorems.length, 16);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  const cursor = forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-formula-cursor');
  cursor.theoremRows
    .find((row) => row.name.endsWith('FormulaBitCursor.run_full'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);
});

test('Cook-Levin input-length builder requires all ten exact theorem rows and cannot become a complete reduction', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-input-length');
  assert.equal(milestone.requiredTheorems.length, 10);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderInputLength.workRunExact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-input-length')
    .theoremRows.find((row) => row.name.endsWith('.run_compile'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderInputLengthFormalized',
    'leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed',
    'leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized',
    'leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of ['leanConcreteCNFNPCompletenessFormalized', 'leanConcreteCNFSATInPFormalized']) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin executable builder prefix requires all fourteen exact theorem rows and cannot become a complete reduction', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-input-prefix');
  assert.equal(milestone.requiredTheorems.length, 14);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-input-prefix')
    .theoremRows.find((row) => row.name.endsWith('.run_compile_exact'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderInputPrefixFormalized',
    'leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized',
    'leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of ['leanConcreteCNFNPCompletenessFormalized', 'leanConcreteCNFSATInPFormalized']) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin token appender retains all seventeen independently audited theorem rows', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-token-appender');
  assert.equal(milestone.requiredTheorems.length, 17);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderTokenAppender.appendToken_workRunExact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-token-appender')
    .theoremRows.find((row) => row.name.endsWith('.firstHeaderToken_bits_eq_encodedFormula_take_two'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderTokenAppenderFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed',
    'leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const disconnected = structuredClone(status);
  disconnected.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed = false;
  assert.equal(validation.validateStatus(disconnected, inventory), false);
});

test('Cook-Levin first-token prefix requires all twenty-eight exact theorem rows and remains an incomplete builder', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-token-prefix');
  assert.equal(milestone.requiredTheorems.length, 25);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.workRunExact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-token-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_take_two'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstTokenPrefixFormalized',
    'leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin complete header requires all forty-eight evaluator/composition theorem rows and remains body-incomplete', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-complete-header');
  assert.equal(milestone.requiredTheorems.length, 48);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  for (const name of [
    'PNP.Concrete.CookLevin.BuilderUnaryPolynomial.workRunExact',
    'PNP.Concrete.CookLevin.BuilderCompleteHeader.workRunExact',
  ]) {
    const assumed = structuredClone(inventory);
    assumed.milestoneCandidates.find((candidate) => candidate.name === name).axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumed), false, name);
  }

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-complete-header')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_header'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderUnaryPolynomialFormalized',
    'leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed',
    'leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed',
    'leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin body-start prefix requires all forty-two exact theorem rows and remains dynamically incomplete', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-body-start-prefix');
  assert.equal(milestone.requiredTheorems.length, 42);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  for (const name of [
    'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact',
    'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTokenBits_eq_encodedFormula_bodyStart',
  ]) {
    const assumed = structuredClone(inventory);
    assumed.milestoneCandidates.find((candidate) => candidate.name === name).axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumed), false, name);
  }

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-body-start-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_bodyStart'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderBodyStartPrefixFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized',
    'leanConcreteCookLevinBuilderInputPrefixAppenderComposed',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin first-literal prefix requires all fifty-two exact theorem rows and remains dynamically incomplete', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 52);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  for (const name of [
    'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact',
    'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix',
    'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral',
  ]) {
    const assumed = structuredClone(inventory);
    assumed.milestoneCandidates.find((candidate) => candidate.name === name).axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumed), false, name);
  }

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_firstLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized',
    'leanConcreteCookLevinBuilderInputPrefixAppenderComposed',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount = 72;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin first-clause prefix requires all forty-four exact theorem rows and remains dynamically incomplete', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-clause-prefix');
  assert.equal(milestone.requiredTheorems.length, 43);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  for (const name of [
    'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact',
    'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix',
    'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause',
  ]) {
    const assumed = structuredClone(inventory);
    assumed.milestoneCandidates.find((candidate) => candidate.name === name).axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumed), false, name);
  }

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-clause-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_firstClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstClausePrefixFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized',
    'leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized',
    'leanConcreteCookLevinBuilderInputPrefixAppenderComposed',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFirstClausePrefixAuditedDeclarationCount = 76;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin dynamic-token cursor step requires all thirty-one exact rows and cannot become a general cursor', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-dynamic-token-cursor-step');
  assert.equal(milestone.requiredTheorems.length, 31);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.specification_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-dynamic-token-cursor-step')
    .theoremRows.find((row) => row.name.endsWith('.directOutcome_is_padding'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized',
    'leanConcreteCookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount = 44;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin first-clause padding run requires all forty-eight exact rows and remains a bounded block', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 48);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.secondClauseStart_direct_eq_sep'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount = 83;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-clause separator step requires all forty exact rows and remains one fixed transition', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-separator-step');
  assert.equal(milestone.requiredTheorems.length, 40);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_separator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-separator-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_f'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClauseSeparatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin clause-two first literal requires all fifty-eight exact rows and remains one fixed literal prefix', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-first-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 58);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-first-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_secondClauseFirstLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount = 86;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin clause-two second literal requires all seventy-six exact rows and remains one fixed literal prefix', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-second-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 75);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-second-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_secondClauseSecondLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount = 114;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin complete clause-two prefix requires all forty-one exact rows and remains one fixed clause prefix', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-prefix');
  assert.equal(milestone.requiredTheorems.length, 41);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_terminator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_secondClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClausePrefixFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount = 56;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin clause-two padding run requires all thirty-nine exact rows and remains a no-emission boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.thirdClauseStart_direct_eq_sep'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin third-clause separator step requires all forty exact rows and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-separator-step');
  assert.equal(milestone.requiredTheorems.length, 40);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_separator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-separator-step')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClauseStart'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin clause-three first literal requires all fifty-eight exact rows and remains a two-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-first-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 58);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_sign_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-first-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount = 86;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin clause-three second literal requires all ninety-two exact rows and remains a four-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-second-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 92);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_sign_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-second-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount = 144;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin complete third clause requires all forty-one exact rows and remains padding-bounded', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-prefix');
  assert.equal(milestone.requiredTheorems.length, 41);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_terminator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClausePrefixFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount = 56;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin clause-three padding traversal requires all thirty-nine exact rows and remains no-emission bounded', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-third-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_thirdClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin fourth-clause separator step requires all forty exact rows and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-separator-step');
  assert.equal(milestone.requiredTheorems.length, 40);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_separator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-separator-step')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClauseStart'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin fourth-clause first-literal prefix requires all seventy-six exact rows and remains a one-literal boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-first-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 75);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_unaryUnit_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-first-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount = 114;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  for (const field of [
    'leanConcreteCookLevinBuilderDynamicCursorFormalized',
    'leanConcreteCookLevinFormulaBuilderFormalized',
    'leanConcreteCookLevinBuilderRawRefinementFormalized',
    'leanConcreteCookLevinBuilderPolynomialReductionFormalized',
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('Cook-Levin fourth-clause second-literal prefix requires all ninety-two exact rows and remains a two-literal boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-second-literal-prefix');
  assert.equal(milestone.requiredTheorems.length, 92);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-second-literal-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount = 146;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin complete fourth-clause prefix requires all forty-one exact rows and remains a padding boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-prefix');
  assert.equal(milestone.requiredTheorems.length, 41);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_terminator_step')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-prefix')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClausePrefixFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClausePrefixAuditedDeclarationCount = 56;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin fourth-clause padding run requires all thirty-nine exact rows and remains a fifth-rectangle boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFourthClausePaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin fifth-clause padding run requires all thirty-nine exact rows and remains a sixth-rectangle boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fifth-clause-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-fifth-clause-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFifthClausePaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin first-constraint padding run requires all thirty-nine exact rows and remains a separator-observation boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-constraint-padding-run');
  assert.equal(milestone.requiredTheorems.length, 39);
  assert.match(milestone.nonClaim, /observes but does not emit that separator/);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_padding_run')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-first-constraint-padding-run')
    .theoremRows.find((row) => row.name.endsWith('.finalTokenBits_eq_encodedFormula_fourthClause'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAuditedDeclarationCount = 67;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint separator requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-separator-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the Sep beginning the second scheduled constraint/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 37\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is T/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following T/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_separator_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-separator-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal sign requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-sign-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the positive sign beginning the second scheduled constraint's first literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 38\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is the first unary T/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following unary T/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_sign_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-sign-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal first unary unit requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the first unary T of the second scheduled constraint's first variable index/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 39\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is the second unary T/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following second unary T/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_firstUnaryUnit_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal second unary unit requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the second unary T of the second scheduled constraint's first variable index/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 40\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is the third unary T/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following third unary T/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_secondUnaryUnit_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal third unary unit requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the third and final unary T of the second scheduled constraint's first variable index/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 41\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is the terminating F/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following terminating F/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.specification_thirdUnaryUnit_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_f'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal terminator requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-terminator-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits exactly the terminating F of the second scheduled constraint's first literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 42\)\)/u);
  assert.match(milestone.scope, /direct next schedule token is Finish when tapeWidth is one and the positive T beginning the next literal at wider widths/u);
  assert.match(milestone.nonClaim, /emits exactly one token/u);
  assert.match(milestone.nonClaim, /does not emit the following Finish in the width-one case or the following positive T in wider cases/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.specification_terminator_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-terminator-step')
    .theoremRows.find((row) => row.name.endsWith('.nextTokenSlot_direct_eq_finish_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAuditedDeclarationCount = 55;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint first-literal successor token requires all forty exact pins and remains a one-token boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /emits Finish exactly when tapeWidth is one and T at every wider width/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 43\)\)/u);
  assert.match(milestone.scope, /following opportunity is padding at width one and unary T at wider widths/u);
  assert.match(milestone.nonClaim, /emits exactly one width-selected token/u);
  assert.match(milestone.nonClaim, /does not emit the following padding opportunity at width one or unary T at wider widths/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.specification_successor_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step')
    .theoremRows.find((row) => row.name.endsWith('.followingTokenSlot_direct_eq_padding_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepInputPrefixAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAuditedDeclarationCount = 81;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint padding-or-unary opportunity requires all forty exact pins and remains a one-opportunity boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-padding-or-unary-opportunity-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(milestone.scope, /at every wider width it appends exactly the first unary T of the second literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 43 \+ if tapeWidth = 1 then 0 else 1\)\)/u);
  assert.match(milestone.scope, /following slot is again padding at width one and the second unary T at wider widths/u);
  assert.match(milestone.nonClaim, /consumes exactly one width-selected schedule opportunity/u);
  assert.match(milestone.nonClaim, /does not consume the following padding opportunity at width one or second unary T at wider widths/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.specification_opportunity_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-padding-or-unary-opportunity-step')
    .theoremRows.find((row) => row.name.endsWith('.followingTokenSlot_direct_eq_padding_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPaddingOrUnaryOpportunityFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAuditedDeclarationCount = 81;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint second padding-or-unary opportunity requires all forty exact pins and remains a one-opportunity boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-second-padding-or-unary-opportunity-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(milestone.scope, /at every wider width it appends exactly the second unary T of the second literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 43 \+ if tapeWidth = 1 then 0 else 2\)\)/u);
  assert.match(milestone.scope, /following slot is again padding at width one and the third unary T at wider widths/u);
  assert.match(milestone.nonClaim, /consumes exactly one additional width-selected schedule opportunity/u);
  assert.match(milestone.nonClaim, /does not consume the following padding opportunity at width one or third unary T at wider widths/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.specification_opportunity_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-second-padding-or-unary-opportunity-step')
    .theoremRows.find((row) => row.name.endsWith('.followingTokenSlot_direct_eq_padding_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSecondPaddingOrUnaryOpportunityFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAuditedDeclarationCount = 81;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint third padding-or-unary opportunity requires all forty exact pins and remains a one-opportunity boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-third-padding-or-unary-opportunity-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(milestone.scope, /at every wider width it appends exactly the third unary T of the second literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 43 \+ if tapeWidth = 1 then 0 else 3\)\)/u);
  assert.match(milestone.scope, /following slot is again padding at width one and the fourth unary T at wider widths/u);
  assert.match(milestone.nonClaim, /consumes exactly one additional width-selected schedule opportunity/u);
  assert.match(milestone.nonClaim, /does not consume the following padding opportunity at width one or fourth unary T at wider widths/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.specification_opportunity_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-third-padding-or-unary-opportunity-step')
    .theoremRows.find((row) => row.name.endsWith('.followingTokenSlot_direct_eq_padding_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepThirdPaddingOrUnaryOpportunityFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAuditedDeclarationCount = 81;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint fourth padding-or-unary opportunity requires all forty exact pins and remains a one-opportunity boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-fourth-padding-or-unary-opportunity-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(milestone.scope, /at every wider width it appends exactly the fourth unary T of the second literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 43 \+ if tapeWidth = 1 then 0 else 4\)\)/u);
  assert.match(milestone.scope, /following slot is padding at width one and the terminating F at wider widths/u);
  assert.match(milestone.nonClaim, /consumes exactly one additional width-selected schedule opportunity/u);
  assert.match(milestone.nonClaim, /does not consume the following padding opportunity at width one or terminating F at wider widths/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.specification_opportunity_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-fourth-padding-or-unary-opportunity-step')
    .theoremRows.find((row) => row.name.endsWith('.followingTokenSlot_direct_eq_padding_or_f'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFourthPaddingOrUnaryOpportunityFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAuditedDeclarationCount = 81;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint fifth padding-or-terminator opportunity requires all forty exact pins and remains a one-opportunity boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-fifth-padding-or-terminator-opportunity-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(milestone.scope, /at every wider width it appends exactly the terminating F of the second literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 43 \+ if tapeWidth = 1 then 0 else 5\)\)/u);
  assert.match(milestone.scope, /following slot is padding at width one and the opening unary T of the following literal at wider widths/u);
  assert.match(milestone.nonClaim, /consumes exactly one additional width-selected schedule opportunity/u);
  assert.match(milestone.nonClaim, /does not consume the following padding opportunity at width one or opening unary T at wider widths/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.specification_opportunity_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-fifth-padding-or-terminator-opportunity-step')
    .theoremRows.find((row) => row.name.endsWith('.followingTokenSlot_direct_eq_padding_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFifthPaddingOrTerminatorOpportunityFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepInputPrefixOptionalTerminatorAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAuditedDeclarationCount = 81;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint sixth padding-or-opening-unary opportunity requires all forty exact pins and remains a one-opportunity boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-sixth-padding-or-opening-unary-opportunity-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(milestone.scope, /at every wider width it appends exactly the opening positive T of the following literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 43 \+ if tapeWidth = 1 then 0 else 6\)\)/u);
  assert.match(milestone.scope, /following slot is padding at width one and the first unary-index T of the following literal at wider widths/u);
  assert.match(milestone.nonClaim, /consumes exactly one additional width-selected schedule opportunity/u);
  assert.match(milestone.nonClaim, /does not consume the following padding opportunity at width one or first unary-index T at wider widths/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.specification_opportunity_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const reusedModule = structuredClone(inventory);
  reusedModule.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.workRunExact')
    .module = 'PNP.ForgedModule';
  assert.equal(validation.validateInventory(reusedModule), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-sixth-padding-or-opening-unary-opportunity-step')
    .theoremRows.find((row) => row.name.endsWith('.followingTokenSlot_direct_eq_padding_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSixthPaddingOrOpeningUnaryOpportunityFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepInputPrefixOptionalAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAuditedDeclarationCount = 81;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('Cook-Levin second-constraint seventh padding-or-unary opportunity requires all forty exact pins and remains a one-opportunity boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-seventh-padding-or-unary-opportunity-step');
  assert.equal(milestone.requiredTheorems.length, 40);
  assert.match(milestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(milestone.scope, /at every wider width it appends exactly the first unary-index T of the following literal/u);
  assert.match(milestone.scope, /encodedFormula\.take \(2 \* \(FormulaWidth \+ 43 \+ if tapeWidth = 1 then 0 else 7\)\)/u);
  assert.match(milestone.scope, /following slot is padding at width one and the second unary-index T of the following literal at wider widths/u);
  assert.match(milestone.nonClaim, /consumes exactly one additional width-selected schedule opportunity/u);
  assert.match(milestone.nonClaim, /does not consume the following padding opportunity at width one or second unary-index T at wider widths/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates.filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.specification_opportunity_step')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const reusedModule = structuredClone(inventory);
  reusedModule.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.workRunExact')
    .module = 'PNP.ForgedModule';
  assert.equal(validation.validateInventory(reusedModule), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-seventh-padding-or-unary-opportunity-step')
    .theoremRows.find((row) => row.name.endsWith('.followingTokenSlot_direct_eq_padding_or_t'))
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);

  for (const field of [
    'leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomAuditPassed',
    'leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSeventhPaddingOrUnaryOpportunityFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized',
    'leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed',
    'leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAuditedDeclarationCount = 81;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);
});

test('recursive raw refinement cannot be stripped or separated from compiled evidence', () => {
  const strippedRefinement = structuredClone(status);
  strippedRefinement.leanConcretePipelineRawRefinementFormalized = false;
  assert.equal(validation.validateStatus(strippedRefinement, inventory), false, 'leanConcretePipelineRawRefinementFormalized');

  for (const field of [
    'leanConcretePipelineStateNamespaceFormalized',
    'leanConcretePipelineStateNamespaceAxiomAuditPassed',
    'leanConcretePipelineStageBridgesFormalized',
    'leanConcretePipelineStageBridgesAxiomAuditPassed',
    'leanConcretePipelineStageLaunchFormalized',
    'leanConcretePipelineVerdictPreservationFormalized',
    'leanConcretePipelineInternalOutputHandoffComposed',
    'leanConcretePipelineTerminalOutputPackingFormalized',
    'leanConcretePipelineTerminalOutputPackerAxiomAuditPassed',
    'leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized',
    'leanConcretePipelineTerminalBridgeAxiomAuditPassed',
    'leanConcretePipelineInputFramerAxiomAuditPassed',
    'leanConcretePipelineAllInputFramingFormalized',
    'leanConcretePipelinePairedCompilerAxiomAuditPassed',
    'leanConcretePipelineCanonicalPairCompilationFormalized',
    'leanConcretePipelineCompilerAxiomAuditPassed',
    'leanConcretePipelineAllInputCompilationFormalized',
    'leanConcretePipelineSequentialNamespaceFormalized',
    'leanConcretePipelineSequentialNamespaceAxiomAuditPassed',
    'leanConcretePipelineSequentialCompilationFormalized',
    'leanConcretePipelineSequentialCompilerAxiomAuditPassed',
    'leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized',
    'leanConcretePipelineSequentialExternalInputSizePolynomialFormalized',
    'leanConcretePipelineSequentialStuckFirstTimeoutFormalized',
    'leanConcretePipelineRefinementAxiomAuditPassed',
    'leanConcreteFunctionProgramRecursiveCompilationFormalized',
    'leanConcreteDecisionProgramRecursiveCompilationFormalized',
    'leanConcretePolynomialTimeDeciderRawCompilationFormalized',
    'standardComplexityModelFormalized',
    'leanConcretePipelineMalformedInputBehaviorFormalized',
    'leanConcretePipelineExternalInputSizePolynomialFormalized',
  ]) {
    const missing = structuredClone(status);
    missing[field] = false;
    assert.equal(validation.validateStatus(missing, inventory), false, field);
  }

  const assumedBridge = structuredClone(inventory);
  assumedBridge.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.PipelineStageBridges.workBoundedDecide_bridged_timeout_of_stuck_rawRunExact')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumedBridge), false);

  const assumedPacker = structuredClone(inventory);
  assumedPacker.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumedPacker), false);

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount = 68;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  const assumedTerminalBridge = structuredClone(inventory);
  assumedTerminalBridge.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents')
    .axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(assumedTerminalBridge), false);

  const removedTrace = structuredClone(status);
  removedTrace.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized = false;
  assert.equal(validation.validateStatus(removedTrace, inventory), false);

  const wrongFramerAuditCount = structuredClone(status);
  wrongFramerAuditCount.leanConcretePipelineInputFramerAuditedDeclarationCount = 69;
  assert.equal(validation.validateStatus(wrongFramerAuditCount, inventory), false);

  for (const theorem of [
    'PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact',
    'PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents',
    'PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound',
    'PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout',
  ]) {
    const assumedFramer = structuredClone(inventory);
    assumedFramer.milestoneCandidates
      .find((candidate) => candidate.name === theorem)
      .axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumedFramer), false, theorem);
  }

  const wrongPairedAuditCount = structuredClone(status);
  wrongPairedAuditCount.leanConcretePipelinePairedCompilerAuditedDeclarationCount = 27;
  assert.equal(validation.validateStatus(wrongPairedAuditCount, inventory), false);

  for (const theorem of [
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff',
  ]) {
    const assumedPairedCompiler = structuredClone(inventory);
    assumedPairedCompiler.milestoneCandidates
      .find((candidate) => candidate.name === theorem)
      .axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumedPairedCompiler), false, theorem);
  }

  const wrongCompilerAuditCount = structuredClone(status);
  wrongCompilerAuditCount.leanConcretePipelineCompilerAuditedDeclarationCount = 28;
  assert.equal(validation.validateStatus(wrongCompilerAuditCount, inventory), false);

  for (const theorem of [
    'PNP.Concrete.PipelineCompiler.pipeline_correct',
    'PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_ne_timeout',
    'PNP.Concrete.PipelineCompiler.pipeline_accepts_iff',
    'PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact',
  ]) {
    const assumedCompiler = structuredClone(inventory);
    assumedCompiler.milestoneCandidates
      .find((candidate) => candidate.name === theorem)
      .axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumedCompiler), false, theorem);
  }

  for (const theorem of [
    'PNP.Concrete.PipelineSequentialCompiler.sequential_correct',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact',
    'PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin',
    'PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq',
    'PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin',
    'PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq',
    'PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff',
  ]) {
    const assumedRecursiveCompiler = structuredClone(inventory);
    assumedRecursiveCompiler.milestoneCandidates
      .find((candidate) => candidate.name === theorem)
      .axioms = ['PNP.ForgedAxiom'];
    assert.equal(validation.validateInventory(assumedRecursiveCompiler), false, theorem);
  }
});

test('strict-v0 locked-NAND source parser requires every exact theorem and stays fail-closed beyond parsing', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-locked-nand-source-parser');
  assert.equal(milestone.requiredTheorems.length, 20);
  assert.equal(milestone.earned, true);
  assert.equal(milestone.classification, 'formalized-foundation-only');

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates
      .filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.LockedNAND.SourceParser.allInput_exact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const movedModule = structuredClone(inventory);
  movedModule.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_accept_iff')
    .module = 'PNP.ForgedModule';
  assert.equal(validation.validateInventory(movedModule), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-locked-nand-source-parser')
    .theoremRows.find((row) => row.name === 'PNP.Concrete.LockedNAND.SourceParser.compiledMachineOutput_eq_validatedSourceBytes')
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of [
    'leanConcreteLockedNANDParserMachineFormalized',
    'leanConcreteLockedNANDParserAxiomAuditPassed',
    'leanConcreteLockedNANDParserAllInputExactFormalized',
    'leanConcreteLockedNANDParserExactOutputFormalized',
    'leanConcreteLockedNANDParserCompiledNonTimeoutFormalized',
    'leanConcreteLockedNANDParserPolynomialTimeMachineFormalized',
    'leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized',
    'leanConcreteLockedNANDParserRawRefinementFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteLockedNANDParserAuditedDeclarationCount = 379;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  const wrongScope = structuredClone(status);
  wrongScope.leanConcreteLockedNANDParserScope = 'widened-parser-claim';
  assert.equal(validation.validateStatus(wrongScope, inventory), false);

  for (const field of [
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('strict-v0 locked-NAND target emitter requires every exact theorem and stays within its boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-locked-nand-target-emitter');
  assert.equal(milestone.requiredTheorems.length, 22);
  assert.equal(milestone.earned, true);
  assert.equal(milestone.classification, 'formalized-foundation-only');

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates
      .filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.allInput_bounded_exact')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const movedModule = structuredClone(inventory);
  movedModule.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledMachineOutput_eq_targetBytes')
    .module = 'PNP.ForgedModule';
  assert.equal(validation.validateInventory(movedModule), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-locked-nand-target-emitter')
    .theoremRows.find((row) => row.name === 'PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.strictLockedNANDPolynomialTimeFunction_output')
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  for (const field of [
    'leanConcreteLockedNANDEmitterMachineFormalized',
    'leanConcreteLockedNANDEmitterAxiomAuditPassed',
    'leanConcreteLockedNANDEmitterAllInputExactFormalized',
    'leanConcreteLockedNANDEmitterExactTargetBytesFormalized',
    'leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized',
    'leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized',
    'leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized',
    'leanConcreteLockedNANDEmitterRawRefinementFormalized',
    'leanConcreteLockedNANDEmitterStrictParserCompositionFormalized',
    'leanConcreteLockedNANDEmitterOutputSizeBoundFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteLockedNANDEmitterAuditedDeclarationCount = 3294;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  const wrongScope = structuredClone(status);
  wrongScope.leanConcreteLockedNANDEmitterScope = 'widened-emitter-claim';
  assert.equal(validation.validateStatus(wrongScope, inventory), false);

  for (const field of [
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});

test('strict-v0 locked-NAND polynomial reduction requires every exact theorem and rejects widened claims', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-locked-nand-polynomial-reduction');
  assert.equal(milestone.requiredTheorems.length, 5);
  assert.equal(milestone.earned, true);
  assert.equal(milestone.classification, 'formalized-polynomial-reduction');
  assert.match(milestone.scope, /EncodedNANDSAT to EncodedLockedNANDThreshold/u);
  assert.match(milestone.nonClaim, /downstream all-input CNF compiler now identifies CNFSAT/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates
      .filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_correct')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const movedModule = structuredClone(inventory);
  movedModule.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.LockedNAND.encodedNANDSAT_reducesTo_encodedLockedNANDThreshold')
    .module = 'PNP.ForgedModule';
  assert.equal(validation.validateInventory(movedModule), false);

  const forgedFingerprint = structuredClone(status);
  forgedFingerprint.formalPublicationMilestones
    .find((row) => row.id === 'concrete-locked-nand-polynomial-reduction')
    .theoremRows.find((row) => row.name === 'PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_hasRawRefinement')
    .actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateMilestones(forgedFingerprint), false);
  assert.equal(validation.validateStatus(forgedFingerprint, inventory), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones
    .find((row) => row.id === 'concrete-locked-nand-polynomial-reduction')
    .scope = 'Polynomial reduction from CNFSAT proving NP-hardness';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones
    .find((row) => row.id === 'concrete-locked-nand-polynomial-reduction')
    .nonClaim = 'P = NP';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);

  for (const field of [
    'leanConcreteLockedNANDPolynomialReductionFormalized',
    'leanConcreteLockedNANDPolynomialReductionAxiomAuditPassed',
    'leanConcreteLockedNANDPolynomialReductionExactFunctionFormalized',
    'leanConcreteLockedNANDPolynomialReductionExactOutputFormalized',
    'leanConcreteLockedNANDPolynomialReductionLanguageEquivalenceFormalized',
    'leanConcreteLockedNANDPolynomialReductionWitnessFormalized',
    'leanConcreteLockedNANDPolynomialReductionRawRefinementFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteLockedNANDPolynomialReductionAuditedDeclarationCount = 15;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  const wrongScope = structuredClone(status);
  wrongScope.leanConcreteLockedNANDPolynomialReductionScope = 'ordinary-cnfsat-np-hardness';
  assert.equal(validation.validateStatus(wrongScope, inventory), false);

  for (const field of [
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }
});


test('CNF-to-NAND semantic compiler requires every exact theorem and rejects complexity overclaims', () => {
  const compiler = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cnf-to-nand-semantic-compiler');
  assert.equal(compiler.requiredTheorems.length, 18);
  assert.equal(compiler.earned, true);
  assert.equal(compiler.classification, 'formalized-semantic-boundary');
  assert.match(compiler.scope, /total answer-independent compiler/u);
  assert.match(compiler.nonClaim, /subsequent all-input milestone supplies the finite-machine/u);

  for (const name of compiler.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates
      .filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CNFToNAND.compileEncodedCNFToNAND_correct')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const movedModule = structuredClone(inventory);
  movedModule.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CNFToNAND.compileFormula_wellFormed')
    .module = 'PNP.ForgedModule';
  assert.equal(validation.validateInventory(movedModule), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cnf-to-nand-semantic-compiler')
    .scope = 'Finite-machine polynomial reduction proving CNFSAT NP-hardness';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cnf-to-nand-semantic-compiler')
    .nonClaim = 'P = NP';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);

  for (const field of [
    'leanConcreteCNFToNANDSemanticCompilerFormalized',
    'leanConcreteCNFToNANDSemanticCompilerAxiomAuditPassed',
    'leanConcreteCNFToNANDExactCodecCanonicalityFormalized',
    'leanConcreteCNFToNANDTypedTopologicalCompilationFormalized',
    'leanConcreteCNFToNANDWellFormedOutputFormalized',
    'leanConcreteCNFToNANDExactSemanticsFormalized',
    'leanConcreteCNFToNANDEdgeSemanticsFormalized',
    'leanConcreteCNFToNANDExactGateCountFormalized',
    'leanConcreteCNFToNANDPolynomialOutputSizeBoundFormalized',
    'leanConcreteCNFToNANDAllBitstringFailClosedFormalized',
    'leanConcreteCNFToNANDLockedThresholdCompositionFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  for (const field of [
    'leanConcreteCNFSATInPFormalized',
    'leanConcreteCNFNPCompletenessFormalized',
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
  ]) {
    const widened = structuredClone(status);
    widened[field] = true;
    assert.equal(validation.validateStatus(widened, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount = 40;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  const wrongScope = structuredClone(status);
  wrongScope.leanConcreteCNFToNANDSemanticCompilerScope = 'polynomial-reduction';
  assert.equal(validation.validateStatus(wrongScope, inventory), false);
});

test('CNF-to-NAND polynomial reduction requires all 28 pins and rejects solver overclaims', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cnf-to-nand-polynomial-reduction');
  assert.equal(milestone.requiredTheorems.length, 28);
  assert.equal(milestone.earned, true);
  assert.equal(milestone.classification, 'formalized-polynomial-reduction');
  assert.match(milestone.scope, /fixed 135,070-rule three-node/u);
  assert.match(milestone.scope, /direct PolynomialReduction from CNFSAT to EncodedNANDSAT/u);
  assert.match(milestone.nonClaim, /does not itself decide CNF-SAT/u);

  for (const name of milestone.requiredTheorems) {
    const missing = structuredClone(inventory);
    missing.milestoneCandidates = missing.milestoneCandidates
      .filter((candidate) => candidate.name !== name);
    assert.equal(validation.validateInventory(missing), false, name);
  }

  const assumed = structuredClone(inventory);
  assumed.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CNFToNAND.cnfSAT_reducesTo_encodedNANDSAT')
    .axioms = ['PNP.ForgedAxiom', 'Quot.sound', 'propext'];
  assert.equal(validation.validateInventory(assumed), false);

  const movedModule = structuredClone(inventory);
  movedModule.milestoneCandidates
    .find((candidate) => candidate.name === 'PNP.Concrete.CNFToNANDCompilerCompiled.compiledMachineOutput_eq_compileEncodedCNFToNAND')
    .module = 'PNP.ForgedModule';
  assert.equal(validation.validateInventory(movedModule), false);

  const widenedScope = structuredClone(status);
  widenedScope.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cnf-to-nand-polynomial-reduction')
    .scope = 'A deterministic polynomial-time CNF-SAT solver proving P = NP';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cnf-to-nand-polynomial-reduction')
    .nonClaim = 'P = NP';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);

  for (const field of [
    'leanConcreteCNFToNANDPolynomialReductionFormalized',
    'leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed',
    'leanConcreteCNFToNANDAllInputExactFormalized',
    'leanConcreteCNFToNANDExactMachineOutputFormalized',
    'leanConcreteCNFToNANDCompiledNonTimeoutFormalized',
    'leanConcreteCNFToNANDRawRefinementFormalized',
    'leanConcreteCNFToNANDDirectReductionFormalized',
    'leanConcreteCNFToNANDLockedReductionCompositionFormalized',
  ]) {
    const stripped = structuredClone(status);
    stripped[field] = false;
    assert.equal(validation.validateStatus(stripped, inventory), false, field);
  }

  const wrongAuditCount = structuredClone(status);
  wrongAuditCount.leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount = 1315;
  assert.equal(validation.validateStatus(wrongAuditCount, inventory), false);

  const wrongScope = structuredClone(status);
  wrongScope.leanConcreteCNFToNANDPolynomialReductionScope = 'cnfsat-in-p';
  assert.equal(validation.validateStatus(wrongScope, inventory), false);
});

test('browser loader pins the raw status bytes before parsing', () => {
  const expectedDigest = createHash('sha256').update(statusBytes).digest('hex');
  assert.ok(source.includes(`const STATUS_SHA256 = '${expectedDigest}'`));
  assert.match(source, /statusResponse\.arrayBuffer\(\)/);
  assert.match(source, /if \(statusDigest !== STATUS_SHA256\) throw new Error/);
});

test('inventory drift and milestone overclaim fail closed', () => {
  const changedInventory = structuredClone(inventory);
  changedInventory.declarationCount += 1;
  assert.equal(validation.validateInventory(changedInventory), false);

  const changedStatus = structuredClone(status);
  changedStatus.formalPublicationMilestones.find((row) => !row.earned).earned = true;
  assert.equal(validation.validateMilestones(changedStatus), false);
  assert.equal(validation.validateStatus(changedStatus, inventory), false);

  const softenedGap = structuredClone(status);
  softenedGap.formalPublicationMilestones
    .find((row) => row.id === 'global-zeroslack-pccmin').nonClaim = 'global completeness remains open';
  assert.equal(validation.validateStatus(softenedGap, inventory), false);
});

test('terminal projection minima require their exact theorem and status boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-projection-minimum');
  assert.equal(milestone.requiredTheorems.length, 14);

  const missingTheorem = structuredClone(inventory);
  missingTheorem.milestoneCandidates = missingTheorem.milestoneCandidates.filter(
    (row) => row.name !== 'PNP.DirectWire.terminalProjectionMinimum_mono'
  );
  assert.equal(validation.validateInventory(missingTheorem), false);

  const forgedAxiom = structuredClone(inventory);
  forgedAxiom.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.terminalProjectionMinimum_mono'
  ).axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(forgedAxiom), false);

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualProjectionMinimumScope = 'polynomial-global-minimizer';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedRuntime = structuredClone(status);
  forgedRuntime.leanPCCMinPolynomialRuntimeFormalized = true;
  assert.equal(validation.validateStatus(forgedRuntime, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-projection-minimum'
  ).nonClaim = 'This proves P = NP.';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);
});

test('terminal projection transfer requires the exact four-corner theorem boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-projection-transfer');
  assert.equal(milestone.requiredTheorems.length, 4);

  const missingTheorem = structuredClone(inventory);
  missingTheorem.milestoneCandidates = missingTheorem.milestoneCandidates.filter(
    (row) => row.name !== 'PNP.DirectWire.TerminalProjectionFourCorners.transferIdentity'
  );
  assert.equal(validation.validateInventory(missingTheorem), false);

  const forgedAxiom = structuredClone(inventory);
  forgedAxiom.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.TerminalProjectionFourCorners.transferIdentity'
  ).axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(forgedAxiom), false);

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualProjectionTransferScope = 'all-support-squares';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-projection-transfer'
  ).nonClaim = 'This proves P = NP.';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);
});

test('terminal saturation requires the exact finite explicit-dependency closure boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-saturation-closure');
  assert.equal(milestone.requiredTheorems.length, 7);

  const missingTheorem = structuredClone(inventory);
  missingTheorem.milestoneCandidates = missingTheorem.milestoneCandidates.filter(
    (row) => row.name !== 'PNP.DirectWire.terminalSaturate_closed'
  );
  assert.equal(validation.validateInventory(missingTheorem), false);

  const forgedAxiom = structuredClone(inventory);
  forgedAxiom.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.terminalSaturate_closed'
  ).axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(forgedAxiom), false);

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualTerminalSaturationScope = 'all-arbitrary-circuit-support-squares';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedSaturatePositive = structuredClone(status);
  forgedSaturatePositive.leanSaturatePositiveFormalized = true;
  assert.equal(validation.validateStatus(forgedSaturatePositive, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-saturation-closure'
  ).nonClaim = 'This constructs every required support square and proves P = NP.';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);
});

test('terminal physical support requires exact executable saturation and crossing-wire boundaries', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-physical-support-completion');
  assert.equal(milestone.requiredTheorems.length, 14);

  const missingTheorem = structuredClone(inventory);
  missingTheorem.milestoneCandidates = missingTheorem.milestoneCandidates.filter(
    (row) => row.name !== 'PNP.DirectWire.completeTerminalPhysicalSupport_incoming_complete'
  );
  assert.equal(validation.validateInventory(missingTheorem), false);

  const forgedAxiom = structuredClone(inventory);
  forgedAxiom.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.mem_terminalSaturateRecords_iff'
  ).axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(forgedAxiom), false);

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualTerminalPhysicalSupportCompletionScope = 'all-proper-governed-support-squares';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedAudit = structuredClone(status);
  forgedAudit.leanResidualTerminalPhysicalSupportCompletionAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(forgedAudit, inventory), false);

  const forgedSaturatePositive = structuredClone(status);
  forgedSaturatePositive.leanSaturatePositiveFormalized = true;
  assert.equal(validation.validateStatus(forgedSaturatePositive, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-physical-support-completion'
  ).nonClaim = 'This constructs every required proper support square and proves P = NP.';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);
});

test('terminal support extraction requires exact pins, open semantics, and a conservative boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-support-extraction');
  assert.equal(milestone.requiredTheorems.length, 21);

  const missingTheorem = structuredClone(inventory);
  missingTheorem.milestoneCandidates = missingTheorem.milestoneCandidates.filter(
    (row) => row.name !== 'PNP.DirectWire.extractTerminalSupport_semantics'
  );
  assert.equal(validation.validateInventory(missingTheorem), false);

  const forgedAxiom = structuredClone(inventory);
  forgedAxiom.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.extractTerminalSupport_induced'
  ).axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(forgedAxiom), false);

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualTerminalSupportExtractionScope = 'all-derived-proper-governed-support-squares';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const forgedAudit = structuredClone(status);
  forgedAudit.leanResidualTerminalSupportExtractionAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(forgedAudit, inventory), false);

  const erasedSemantics = structuredClone(status);
  erasedSemantics.leanResidualTerminalOpenSemanticsFormalized = false;
  assert.equal(validation.validateStatus(erasedSemantics, inventory), false);

  const forgedSaturatePositive = structuredClone(status);
  forgedSaturatePositive.leanSaturatePositiveFormalized = true;
  assert.equal(validation.validateStatus(forgedSaturatePositive, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-support-extraction'
  ).nonClaim = 'This derives every proper support square and proves P = NP.';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);
});

test('saturated terminal support square requires exact pins, order laws, extraction, and a conservative boundary', () => {
  const milestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-saturated-support-square-closure');
  assert.equal(milestone.requiredTheorems.length, 23);

  const missingTheorem = structuredClone(inventory);
  missingTheorem.milestoneCandidates = missingTheorem.milestoneCandidates.filter(
    (row) => row.name !== 'PNP.DirectWire.TerminalSaturatedSupportSquare.meetRecords_greatest'
  );
  assert.equal(validation.validateInventory(missingTheorem), false);

  const forgedAxiom = structuredClone(inventory);
  forgedAxiom.milestoneCandidates.find(
    (row) => row.name === 'PNP.DirectWire.TerminalSaturatedSupportSquare.joinRecords_least'
  ).axioms = ['PNP.ForgedAxiom'];
  assert.equal(validation.validateInventory(forgedAxiom), false);

  const widenedScope = structuredClone(status);
  widenedScope.leanResidualTerminalSupportSquareClosureScope = 'all-manuscript-projection-compatible-squares';
  assert.equal(validation.validateStatus(widenedScope, inventory), false);

  const erasedOrderLaw = structuredClone(status);
  erasedOrderLaw.leanResidualTerminalSupportSquareMeetJoinExactFormalized = false;
  assert.equal(validation.validateStatus(erasedOrderLaw, inventory), false);

  const erasedExtraction = structuredClone(status);
  erasedExtraction.leanResidualTerminalSupportSquareSemanticExtractionFormalized = false;
  assert.equal(validation.validateStatus(erasedExtraction, inventory), false);

  const erasedFrontierPushout = structuredClone(status);
  erasedFrontierPushout.leanResidualTerminalFrontierPushoutFormalized = false;
  assert.equal(validation.validateStatus(erasedFrontierPushout, inventory), false);

  const alteredFrontierScope = structuredClone(status);
  alteredFrontierScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-governed-frontier-pushout'
  ).scope = 'A broader unsupported frontier claim.';
  assert.equal(validation.validateStatus(alteredFrontierScope, inventory), false);

  const erasedProjectionSquare = structuredClone(status);
  erasedProjectionSquare.leanResidualTerminalProjectionSquareFormalized = false;
  assert.equal(validation.validateStatus(erasedProjectionSquare, inventory), false);

  const erasedSideTightGate = structuredClone(status);
  erasedSideTightGate.leanResidualTerminalSideTightFailClosedGateFormalized = false;
  assert.equal(validation.validateStatus(erasedSideTightGate, inventory), false);

  const alteredSideTightScope = structuredClone(status);
  alteredSideTightScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-side-tight-minimum-arithmetic'
  ).scope = 'A broader unsupported coherent-basis claim.';
  assert.equal(validation.validateStatus(alteredSideTightScope, inventory), false);

  const erasedCarrierTransport = structuredClone(status);
  erasedCarrierTransport.leanResidualTerminalFourCornerCarrierTransportFormalized = false;
  assert.equal(validation.validateStatus(erasedCarrierTransport, inventory), false);

  const alteredCarrierScope = structuredClone(status);
  alteredCarrierScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-four-corner-carrier-transport'
  ).scope = 'A broader unsupported optimum-carrier claim.';
  assert.equal(validation.validateStatus(alteredCarrierScope, inventory), false);

  const erasedOptimumCompatibility = structuredClone(status);
  erasedOptimumCompatibility.leanResidualTerminalFourCornerOptimaCarrierCompatibleFormalized = false;
  assert.equal(validation.validateStatus(erasedOptimumCompatibility, inventory), false);

  const alteredOptimumCompatibilityScope = structuredClone(status);
  alteredOptimumCompatibilityScope.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-four-corner-optimum-carrier-compatibility'
  ).scope = 'A broader unsupported coherent optimum claim.';
  assert.equal(validation.validateStatus(alteredOptimumCompatibilityScope, inventory), false);

  const erasedBoundary = structuredClone(status);
  erasedBoundary.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-saturated-support-square-closure'
  ).nonClaim = 'This proves the manuscript projection square and P = NP.';
  assert.equal(validation.validateStatus(erasedBoundary, inventory), false);

  const widenedFiniteBCELReadyBoundary = structuredClone(status);
  widenedFiniteBCELReadyBoundary.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-finite-bcel-ready-composition'
  ).nonClaim = 'This proves manuscript-wide BCELReady.';
  assert.equal(validation.validateStatus(widenedFiniteBCELReadyBoundary, inventory), false);

  const alteredFiniteBCELReadyPin = structuredClone(status);
  alteredFiniteBCELReadyPin.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-finite-bcel-ready-composition'
  ).theoremRows[0].actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(alteredFiniteBCELReadyPin, inventory), false);

  const erasedFiniteBCELReadyAudit = structuredClone(status);
  erasedFiniteBCELReadyAudit.leanResidualTerminalFiniteBCELReadyCompositionAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(erasedFiniteBCELReadyAudit, inventory), false);

  const widenedFiniteBCELPacketCarrierBoundary = structuredClone(status);
  widenedFiniteBCELPacketCarrierBoundary.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-finite-bcel-packet-carrier-coherence'
  ).nonClaim = 'This derives constant activation and proves unconditional ZeroSlack.';
  assert.equal(validation.validateStatus(widenedFiniteBCELPacketCarrierBoundary, inventory), false);

  const alteredFiniteBCELPacketCarrierPin = structuredClone(status);
  alteredFiniteBCELPacketCarrierPin.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-finite-bcel-packet-carrier-coherence'
  ).theoremRows[0].actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(alteredFiniteBCELPacketCarrierPin, inventory), false);

  const erasedFiniteBCELPacketCarrierAudit = structuredClone(status);
  erasedFiniteBCELPacketCarrierAudit.leanResidualTerminalFiniteBCELPacketCarrierCoherenceAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(erasedFiniteBCELPacketCarrierAudit, inventory), false);

  const widenedFiniteBCELPacketActivationBoundary = structuredClone(status);
  widenedFiniteBCELPacketActivationBoundary.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-finite-bcel-packet-activation-obstruction'
  ).nonClaim = 'This constructs activation coherence and proves unconditional ZeroSlack.';
  assert.equal(validation.validateStatus(widenedFiniteBCELPacketActivationBoundary, inventory), false);

  const alteredFiniteBCELPacketActivationPin = structuredClone(status);
  alteredFiniteBCELPacketActivationPin.formalPublicationMilestones.find(
    (row) => row.id === 'residual-terminal-finite-bcel-packet-activation-obstruction'
  ).theoremRows[0].actualKernelTypeSha256 = '0'.repeat(64);
  assert.equal(validation.validateStatus(alteredFiniteBCELPacketActivationPin, inventory), false);

  const erasedFiniteBCELPacketActivationAudit = structuredClone(status);
  erasedFiniteBCELPacketActivationAudit.leanResidualTerminalFiniteBCELPacketActivationObstructionAxiomAuditPassed = false;
  assert.equal(validation.validateStatus(erasedFiniteBCELPacketActivationAudit, inventory), false);
});

test('static pages remain conservative and distinguish current from historical reports', () => {
  const homepage = readFileSync('index.html', 'utf8');
  const statusPage = readFileSync('status.html', 'utf8');
  const reportPage = readFileSync('paper.html', 'utf8');
  const verifyPage = readFileSync('verify.html', 'utf8');
  const latestMilestone = status.formalPublicationMilestones.find(
    (row) => row.id === updates.entries[0].milestoneId
  );
  assert.ok(latestMilestone, 'latest milestone must come from canonical update authority');

  for (const page of [homepage, statusPage, reportPage, verifyPage]) {
    assert.match(page, /does not currently establish P = NP|does not claim P = NP|target theorem is not established/i);
  }
  assert.match(statusPage, new RegExp(status.leanTheoremInventoryDeclarationCount.toLocaleString('en-US'), 'u'));
  assert.equal((statusPage.match(/data-earned="true"/gu) || []).length, index.formalPublicationMilestoneCounts.earned);
  assert.match(statusPage, /finite BN5 full-shadow localization kernel/i);
  assert.match(statusPage, /strict Hall deficit/i);
  assert.match(statusPage, /PkgC separating-consumer restoration dichotomy/i);
  assert.match(statusPage, /classifyTerminalPkgCSeparatingConsumers_exhaustive/);
  assert.match(statusPage, /PkgC typed-restoration same-key cancellation/i);
  assert.match(statusPage, /PkgC ambient BN4 ledger embedding/i);
  assert.match(statusPage, /PkgC ambient BN4 residual reduction/i);
  assert.match(statusPage, /classifyTerminalPkgCAmbientBN4ResidualReduction_exhaustive/);
  assert.match(statusPage, /terminalPkgC_computedAmbientBN4_silence_singletonizes/);
  assert.match(statusPage, /classifyTerminalPkgCSameKeyCancellation_exhaustive/);
  assert.match(statusPage, /V54 consumer-antichain normal form/i);
  assert.match(statusPage, /terminalV54_consumerAntichain_normal_form/);
  assert.match(statusPage, /V53 constant-cut hypergraph rigidity/i);
  assert.match(statusPage, /terminalV53_constantCut_hypergraph_rigidity/);
  assert.match(statusPage, /BN6 grouped hypergraph packet bridge/i);
  assert.match(statusPage, /terminalBN6_hypergraph_packet/);
  assert.match(statusPage, /residual-terminal-finite-bcel-ready-composition/);
  assert.match(statusPage, /terminal_finite_saturate_positive_bcel_ready_checked_complete/);
  assert.match(statusPage, /Checked finite SaturatePositive-to-BCEL-ready composition/i);
  assert.match(statusPage, /residual-terminal-finite-bcel-packet-carrier-coherence/);
  assert.match(statusPage, /terminal_finite_bcel_packet_carrier_coherent_checked_complete/);
  assert.match(statusPage, /Same-candidate finite BCEL-ready and Packet carrier coherence/i);
  assert.match(statusPage, /residual-terminal-finite-bcel-packet-activation-obstruction/);
  assert.match(statusPage, /terminal_finite_bcel_packet_activation_obstruction_checked_complete/);
  assert.match(statusPage, /Finite BCEL and Packet activation-coherence obstruction/i);
  assert.match(homepage, new RegExp(`data-current-milestone="${latestMilestone.id}"`, 'u'));
  assert.match(
    statusPage,
    new RegExp(`${index.formalPublicationMilestoneCounts.earned} scoped milestones earned; ${index.formalPublicationMilestoneCounts.total - index.formalPublicationMilestoneCounts.earned} global milestones unearned`, 'u')
  );
  assert.match(statusPage, /PNP\.PEqualsNP/);
  assert.match(statusPage, /null never matches null/);
  assert.match(reportPage, new RegExp(`current ${release.artifacts.report.pageCount}-page report is generated from the compiled Lean inventory`, 'iu'));
  assert.match(reportPage, /Inventory first, report second/i);
  assert.doesNotMatch(reportPage, /report is the current publication-status authority/i);
  assert.match(reportPage, /57-page claim manuscript remains historical only/i);
  assert.match(verifyPage, /current inventory-derived PDF/i);
  assert.doesNotMatch(homepage, />Historical report</);
});
