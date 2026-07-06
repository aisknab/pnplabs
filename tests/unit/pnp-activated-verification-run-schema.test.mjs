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

function mustContain(text, fragments, label) {
  for (const fragment of fragments) {
    assert.equal(text.includes(fragment), true, `${label}: missing fragment: ${fragment}`);
  }
}

test('verification run registry uses activated theorem-emission boundary', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');

  assert.equal(registry.kind, 'PNPLabsPNPVerificationRunRegistry0');
  assert.equal(registry.version, 7);
  assert.equal(registry.status, 'activated-verification-run-registry-badge-ready');
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
  assert.equal(registry.runs.length, 1);
  assert.equal(registry.runs[0].recordId, 'pnplabs-ci-pr16-2026-07-06');
  assert.equal(registry.importWorkflow.status, 'ready');
  assert.equal(registry.importWorkflow.tool, 'tools/import-pnp-verifier-run.mjs');
  assert.equal(registry.importWorkflow.attachesNormalizedDigests, true);
  assert.ok(registry.importWorkflow.acceptedRecordClasses.includes('source-checker-verifier-run'));
  assert.equal(registry.normalizationWorkflow.status, 'ready');
  assert.equal(registry.normalizationWorkflow.tool, 'tools/normalize-pnp-verifier-run.mjs');
  assert.ok(registry.normalizationWorkflow.storedDigestFields.includes('runRecordNormalizedSha256'));
  assert.equal(registry.comparisonWorkflow.status, 'ready');
  assert.equal(registry.comparisonWorkflow.tool, 'tools/compare-pnp-verifier-runs.mjs');
  assert.equal(registry.comparisonWorkflow.page, 'verifier-run-digests.html');
  assert.equal(registry.matrixWorkflow.status, 'ready');
  assert.equal(registry.matrixWorkflow.tool, 'tools/generate-pnp-verifier-run-matrix.mjs');
  assert.equal(registry.matrixWorkflow.payload, 'public/pnp-verifier-run-comparison-matrix.json');
  assert.equal(registry.badgeSummaryWorkflow.status, 'ready');
  assert.equal(registry.badgeSummaryWorkflow.tool, 'tools/generate-pnp-verifier-run-summary.mjs');
  assert.equal(registry.badgeSummaryWorkflow.payload, 'public/pnp-verifier-run-matrix-summary.json');

  for (const command of REQUIRED_FOCUSED_COMMANDS) {
    assert.ok(registry.focusedActivationCommands.includes(command), `missing focused command: ${command}`);
  }
});

test('verification run schema requires activated status, proof-script evidence, and normalized digest fields', async () => {
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
    'normalizedDigests',
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
  for (const key of ['runRecordNormalizedSha256', 'verdictNormalizedSha256', 'activatedStatusNormalizedSha256', 'proofScriptOutputsNormalizedSha256', 'artifactsOrLogsNormalizedSha256']) {
    assert.ok(registry.runRecordSchema.normalizedDigestFields.includes(key), `missing normalized digest field: ${key}`);
  }
});

test('verification run issue template asks for activated status evidence', async () => {
  const template = await readText('.github/ISSUE_TEMPLATE/pnp-verification-run.yml');

  mustContain(template, [
    'PNP activated verification run report',
    'npm run proof:activated-pnp-status',
    'npm run proof:public-theorem-activation',
    'publicTheoremEmissionAllowed: true',
    'publicTheoremStatement: P = NP',
    'unrestrictedFinalSoundnessDischarged: true',
    ACTIVATED_STATUS_COORDINATE,
    PUBLIC_ACTIVATION_COORDINATE,
    'statusPayloadSha256',
    'external review is audit evidence and not a mathematical premise'
  ], 'issue template');

  assert.equal(/external\s+review\s+is\s+(a\s+)?(mathematical\s+)?premise/i.test(template), false, 'issue template must not say external review is a theorem premise');
});

test('verification-runs page displays activated run-submission boundary and focused commands', async () => {
  const html = await readText('verification-runs.html');

  mustContain(html, [
    'Activated verification run registry',
    'publicTheoremEmissionAllowed = true',
    'publicTheoremStatement = "P = NP"',
    'unrestrictedFinalSoundnessDischarged = true',
    'remainingBlockers = []',
    'externalReviewIsMathematicalPremise = false',
    'npm run proof:activated-pnp-status',
    'npm run proof:public-theorem-activation',
    'npm run pnp:compare-runs',
    'npm run pnp:run-summary',
    'public/pnp-verifier-run-matrix-summary.json',
    'public/pnp-verifier-run-comparison-matrix.json',
    'verifier-run-digests.html',
    ACTIVATED_STATUS_COORDINATE,
    PUBLIC_ACTIVATION_COORDINATE,
    'status/ACTIVATED_PNP_STATUS.json',
    'pnplabs-ci-pr16-2026-07-06',
    '<script src="assets/main.js" defer></script>'
  ], 'verification-runs page');

  assert.equal(/external\s+review\s+is\s+(a\s+)?(mathematical\s+)?premise/i.test(html), false, 'verification page must not say external review is a theorem premise');
});
