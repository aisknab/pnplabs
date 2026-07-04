import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const blockers = ['Release.UnrestrictedFinalSoundness', 'ExternalReview.Acceptance'];

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

function assertNonActivatingBoundary(payload, label) {
  const boundary = payload.claimBoundary ?? payload;
  assert.equal(boundary.publicTheoremEmissionAllowed, false, `${label}: public theorem emission must stay disabled`);
  assert.equal(boundary.finalTheoremReady, false, `${label}: final theorem must stay not ready`);
  assert.deepEqual(boundary.activeFinalNodeIds, [], `${label}: active final nodes must stay empty`);
  assert.deepEqual(boundary.remainingBlockers, blockers, `${label}: release blockers must remain exact`);
}

test('PNP public payloads preserve the non-activation boundary', async () => {
  const paths = [
    'public/pnp-index.json',
    'public/pnp-status.json',
    'public/pnp-public-review.json',
    'public/pnp-theorem-emission-gate.json',
    'public/pnp-external-review-status.json'
  ];

  for (const path of paths) {
    const payload = await readJson(path);
    assertNonActivatingBoundary(payload, path);
    assert.equal(payload.sourceRepository, 'https://github.com/aisknab/pnp', `${path}: source repository mismatch`);
  }
});

test('the theorem-emission gate payload remains denied', async () => {
  const payload = await readJson('public/pnp-theorem-emission-gate.json');
  assert.equal(payload.coordinate, 'PNP-PUBLIC-THEOREM-EMISSION-GATE-2026-06-27-01');
  assert.equal(payload.gate.publicTheoremEmissionGatePassed, false);
  assert.equal(payload.gate.publicTheoremEmissionDenied, true);
  assert.equal(payload.gate.statusBound, true);
  assert.equal(payload.gate.publicTheoremEmissionAllowedByGate, false);
  assert.equal(payload.gate.finalTheoremReadyByGate, false);
  assert.equal(payload.gate.gateIsActivationSurface, false);
});

test('the external-review payload remains non-accepting', async () => {
  const payload = await readJson('public/pnp-external-review-status.json');
  assert.equal(payload.coordinate, 'PNP-EXTERNAL-REVIEW-STATUS-2026-06-27-01');
  assert.equal(payload.externalReview.externalReviewAcceptanceClaimed, false);
  assert.equal(payload.externalReview.independentReviewAcceptanceConfirmed, false);
  assert.equal(payload.externalReview.externalReviewBlockerStillActive, true);
  assert.equal(payload.externalReview.publicTheoremEmissionAllowedByExternalReview, false);
});

test('status page links every public PNP payload and reviewer command', async () => {
  const html = await readFile(new URL('../../status.html', import.meta.url), 'utf8');
  for (const fragment of [
    'public/pnp-index.json',
    'public/pnp-status.json',
    'public/pnp-public-review.json',
    'public/pnp-theorem-emission-gate.json',
    'public/pnp-external-review-status.json',
    'npm run pnp:verify',
    'publicTheoremEmissionAllowed = false',
    'Release.UnrestrictedFinalSoundness',
    'ExternalReview.Acceptance'
  ]) {
    assert.match(html, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing status-page fragment: ${fragment}`);
  }
});

test('site navigation enhancement exposes the status page', async () => {
  const script = await readFile(new URL('../../assets/main.js', import.meta.url), 'utf8');
  assert.match(script, /function ensureStatusLink\(\)/);
  assert.match(script, /href = 'status\.html'/);
  assert.match(script, /textContent = 'Status'/);
  assert.match(script, /ensureStatusLink\(\);/);
});

test('homepage script rewrites the hero to the current non-activation boundary', async () => {
  const script = await readFile(new URL('../../assets/main.js', import.meta.url), 'utf8');
  for (const fragment of [
    'function ensureHomepageStatusBoundary()',
    'A machine-checkable P versus NP route under public review.',
    'Public theorem emission is disabled while release blockers remain active.',
    'public theorem emission</span><strong>disabled</strong>',
    'publicTheoremEmissionAllowed = false',
    'finalTheoremReady = false',
    'Release.UnrestrictedFinalSoundness',
    'ExternalReview.Acceptance',
    'View current status',
    'ensureHomepageStatusBoundary();'
  ]) {
    assert.match(script, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing homepage-boundary script fragment: ${fragment}`);
  }
});
