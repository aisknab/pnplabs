import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const blockers = ['Release.UnrestrictedFinalSoundness', 'ExternalReview.Acceptance'];

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

function assertBoundary(boundary, label) {
  assert.equal(boundary.publicTheoremEmissionAllowed, false, `${label}: theorem emission must stay disabled`);
  assert.equal(boundary.finalTheoremReady, false, `${label}: final theorem must stay not ready`);
  assert.deepEqual(boundary.activeFinalNodeIds, [], `${label}: final nodes must stay empty`);
  assert.deepEqual(boundary.remainingBlockers, blockers, `${label}: blockers must remain exact`);
}

test('verification run registry is empty and non-activating', async () => {
  const payload = await readJson('public/pnp-verification-runs.json');
  assert.equal(payload.kind, 'PNPLabsPNPVerificationRunRegistry0');
  assert.equal(payload.status, 'verification-run-registry-ready');
  assert.equal(payload.sourceRepository, 'https://github.com/aisknab/pnp');
  assertBoundary(payload.claimBoundary, 'verification run registry');
  assert.deepEqual(payload.runs, []);
  assert.ok(payload.primaryCommand.includes('npm run pnp:verify'));
  assert.ok(payload.acceptedRunRecordFields.includes('pnpCommit'));
  assert.ok(payload.acceptedRunRecordFields.includes('verdictTag'));
});

test('verification run page invites source checker runs without changing boundary', async () => {
  const html = await readFile(new URL('../../verification-runs.html', import.meta.url), 'utf8');
  for (const fragment of [
    'Verification run registry',
    'git clone https://github.com/aisknab/pnp.git',
    'npm run pnp:verify',
    'public/pnp-verification-runs.json',
    'publicTheoremEmissionAllowed = false',
    'Release.UnrestrictedFinalSoundness',
    'ExternalReview.Acceptance'
  ]) {
    assert.match(html, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing fragment: ${fragment}`);
  }
});

test('status page links the verification run registry', async () => {
  const html = await readFile(new URL('../../status.html', import.meta.url), 'utf8');
  assert.match(html, /verification-runs\.html/);
  assert.match(html, /public\/pnp-verification-runs\.json/);
});
