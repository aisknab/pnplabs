import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const ACTIVATED_STATUS_COORDINATE = 'PNP-ACTIVATED-STATUS-2026-07-05-01';
const PUBLIC_ACTIVATION_COORDINATE = 'PNP-PUBLIC-THEOREM-ACTIVATION-2026-07-05-01';
const REQUIRED_FOCUSED_COMMANDS = [
  'npm run proof:activated-pnp-status',
  'npm run proof:public-theorem-activation',
  'npm run proof:unrestricted-final-soundness-release',
  'npm run proof:uniform-complexity-conclusion',
];

test('verification run registry uses activated theorem-emission boundary', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');

  assert.equal(registry.kind, 'PNPLabsPNPVerificationRunRegistry0');
  assert.equal(registry.version, 1);
  assert.equal(registry.status, 'activated-verification-run-registry-ready');
  assert.equal(registry.claimBoundary.publicTheoremEmissionAllowed, true);
  assert.equal(registry.claimBoundary.publicTheoremStatement, 'P = NP');
  assert.equal(registry.claimBoundary.publicTheoremConclusion, 'P = NP');
  assert.equal(registry.claimBoundary.publicTheoremUnderCheckerTrustModel, true);
  assert.equal(registry.claimBoundary.finalTheoremReady, true);
  assert.equal(registry.claimBoundary.unrestrictedFinalSoundnessDischarged, true);
  assert.equal(registry.claimBoundary.externalReviewIsMathematicalPremise, false);
  assert.deepEqual(registry.claimBoundary.remainingBlockers, []);

  assert.equal(registry.statusPayload.coordinate, ACTIVATED_STATUS_COORDINATE);
  assert.equal(registry.statusPayload.publicTheoremActivationCoordinate, PUBLIC_ACTIVATION_COORDINATE);
  assert.equal(registry.statusPayload.unrestrictedFinalSoundnessReleaseCoordinate, 'PNP-UNRESTRICTED-FINAL-SOUNDNESS-RELEASE-2026-07-05-01');

  for (const command of REQUIRED_FOCUSED_COMMANDS) {
    assert.ok(registry.focusedActivationCommands.includes(command), `missing focused command: ${command}`);
  }
});

test('verification run schema requires activated status and focused proof-script evidence fields', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  const fields = new Set(registry.acceptedRunRecordFields);

  for (const field of [
    'publicTheoremEmissionAllowed',
    'publicTheoremStatement',
    'publicTheoremConclusion',
    'unrestrictedFinalSoundnessDischarged',
    'activatedStatusCoordinate',
    'publicTheoremActivationCoordinate',
    'statusPayloadSha256',
    'proofScriptOutputs',
  ]) {
    assert.ok(fields.has(field), `missing accepted run field: ${field}`);
  }

  assert.equal(registry.runRecordSchema.kind, 'PNPActivatedVerificationRunRecord0');
  assert.ok(registry.runRecordSchema.requiredFields.includes('activatedStatus'));
  assert.equal(registry.runRecordSchema.verdictRequiredValues.tag, 'accept');
  assert.equal(registry.runRecordSchema.verdictRequiredValues.publicTheoremEmissionAllowed, true);
  assert.equal(registry.runRecordSchema.verdictRequiredValues.publicTheoremStatement, 'P = NP');
  assert.deepEqual(registry.runRecordSchema.verdictRequiredValues.remainingBlockers, []);
  assert.equal(registry.runRecordSchema.activatedStatusRequiredValues.coordinate, ACTIVATED_STATUS_COORDINATE);
  assert.equal(registry.runRecordSchema.activatedStatusRequiredValues.publicTheoremActivationCoordinate, PUBLIC_ACTIVATION_COORDINATE);
  assert.equal(registry.runRecordSchema.activatedStatusRequiredValues.externalReviewIsMathematicalPremise, false);

  for (const key of ['proof:activated-pnp-status', 'proof:public-theorem-activation', 'proof:unrestricted-final-soundness-release', 'proof:uniform-complexity-conclusion']) {
    assert.ok(registry.runRecordSchema.proofScriptOutputKeys.includes(key), `missing proof output key: ${key}`);
  }
});

test('verification run issue template asks for activated status evidence', async () => {
  const template = await readText('.github/ISSUE_TEMPLATE/pnp-verification-run.yml');

  for (const fragment of [
    'PNP activated verification run report',
    'npm run proof:activated-pnp-status',
    'npm run proof:public-theorem-activation',
    'publicTheoremEmissionAllowed: true',
    'publicTheoremStatement: P = NP',
    'unrestrictedFinalSoundnessDischarged: true',
    ACTIVATED_STATUS_COORDINATE,
    PUBLIC_ACTIVATION_COORDINATE,
    'statusPayloadSha256',
    'independent external consensus or peer-review acceptance',
    'external review is audit evidence and not a mathematical premise'
  ]) {
    assert.match(template, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing issue-template fragment: ${fragment}`);
  }
});

test('verification-runs page displays activated run-submission boundary and focused commands', async () => {
  const html = await readText('verification-runs.html');

  for (const fragment of [
    'Activated verification run registry',
    'publicTheoremEmissionAllowed = true',
    'publicTheoremStatement = "P = NP"',
    'unrestrictedFinalSoundnessDischarged = true',
    'remainingBlockers = []',
    'externalReviewIsMathematicalPremise = false',
    'npm run proof:activated-pnp-status',
    'npm run proof:public-theorem-activation',
    ACTIVATED_STATUS_COORDINATE,
    PUBLIC_ACTIVATION_COORDINATE,
    'status/ACTIVATED_PNP_STATUS.json'
  ]) {
    assert.match(html, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing verification-runs fragment: ${fragment}`);
  }
});
