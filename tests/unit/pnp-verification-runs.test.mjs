import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

function assertActivatedBoundary(boundary, label) {
  assert.equal(boundary.publicTheoremEmissionAllowed, true, `${label}: theorem emission must be activated`);
  assert.equal(boundary.publicTheoremStatement, 'P = NP', `${label}: theorem statement mismatch`);
  assert.equal(boundary.publicTheoremConclusion, 'P = NP', `${label}: theorem conclusion mismatch`);
  assert.equal(boundary.publicTheoremUnderCheckerTrustModel, true, `${label}: checker-trust flag mismatch`);
  assert.equal(boundary.finalTheoremReady, true, `${label}: final theorem must be ready`);
  assert.equal(boundary.internalFinalTheoremReady, true, `${label}: internal theorem must be ready`);
  assert.equal(boundary.unrestrictedFinalSoundnessDischarged, true, `${label}: unrestricted final soundness must be discharged`);
  assert.equal(boundary.externalReviewIsMathematicalPremise, false, `${label}: external review must not be a theorem premise`);
  assert.deepEqual(boundary.remainingBlockers, [], `${label}: blockers must be empty`);
}

test('verification run registry is empty and activated-status aware', async () => {
  const payload = await readJson('public/pnp-verification-runs.json');
  assert.equal(payload.kind, 'PNPLabsPNPVerificationRunRegistry0');
  assert.equal(payload.status, 'activated-verification-run-registry-ready');
  assert.equal(payload.sourceRepository, 'https://github.com/aisknab/pnp');
  assertActivatedBoundary(payload.claimBoundary, 'verification run registry');
  assert.deepEqual(payload.runs, []);
  assert.ok(payload.primaryCommand.includes('npm run pnp:verify'));
  assert.ok(payload.focusedActivationCommands.includes('npm run proof:activated-pnp-status'));
  assert.ok(payload.acceptedRunRecordFields.includes('pnpCommit'));
  assert.ok(payload.acceptedRunRecordFields.includes('verdictTag'));
  assert.ok(payload.acceptedRunRecordFields.includes('activatedStatusCoordinate'));
  assert.ok(payload.acceptedRunRecordFields.includes('proofScriptOutputs'));
  assert.equal(payload.statusPayload.coordinate, 'PNP-ACTIVATED-STATUS-2026-07-05-01');
  assert.equal(payload.statusPayload.publicTheoremActivationCoordinate, 'PNP-PUBLIC-THEOREM-ACTIVATION-2026-07-05-01');
});

test('verification run page invites activated source checker runs', async () => {
  const html = await readFile(new URL('../../verification-runs.html', import.meta.url), 'utf8');
  for (const fragment of [
    'Activated verification run registry',
    'git clone https://github.com/aisknab/pnp.git',
    'npm run pnp:verify',
    'npm run proof:activated-pnp-status',
    'public/pnp-verification-runs.json',
    'publicTheoremEmissionAllowed = true',
    'publicTheoremStatement = "P = NP"',
    'unrestrictedFinalSoundnessDischarged = true',
    'remainingBlockers = []',
    'externalReviewIsMathematicalPremise = false'
  ]) {
    assert.match(html, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing fragment: ${fragment}`);
  }
});

test('status page links the verification run registry', async () => {
  const html = await readFile(new URL('../../status.html', import.meta.url), 'utf8');
  assert.match(html, /verification-runs\.html/);
  assert.match(html, /public\/pnp-verification-runs\.json/);
});
