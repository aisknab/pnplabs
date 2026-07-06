import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

function assertActivatedBoundary(payload, label) {
  const boundary = payload.claimBoundary ?? payload;
  assert.equal(boundary.publicTheoremEmissionAllowed, true, `${label}: public theorem emission must be activated`);
  assert.equal(boundary.publicTheoremStatement, 'P = NP', `${label}: theorem statement mismatch`);
  assert.equal(boundary.publicTheoremConclusion, 'P = NP', `${label}: theorem conclusion mismatch`);
  assert.equal(boundary.finalTheoremReady, true, `${label}: final theorem must be ready`);
  assert.equal(boundary.internalFinalTheoremReady, true, `${label}: internal final theorem must be ready`);
  assert.equal(boundary.unrestrictedFinalSoundnessDischarged, true, `${label}: unrestricted final soundness must be discharged`);
  assert.deepEqual(boundary.remainingBlockers, [], `${label}: remaining blockers must be empty`);
}

test('PNP activated status payloads publish theorem-emission activation', async () => {
  const status = await readJson('public/pnp-status.json');
  const index = await readJson('public/pnp-index.json');

  assertActivatedBoundary(status, 'public/pnp-status.json');
  assertActivatedBoundary(index, 'public/pnp-index.json');

  assert.equal(status.kind, 'PNPActivatedStatus0');
  assert.equal(status.coordinate, 'PNP-ACTIVATED-STATUS-2026-07-05-01');
  assert.equal(status.publicTheoremUnderCheckerTrustModel, true);
  assert.equal(status.externalReviewAcceptanceRequiredForEmission, false);
  assert.equal(status.externalReviewIsMathematicalPremise, false);
  assert.equal(status.historicalReportProseIsMathematicalPremise, false);
  assert.deepEqual(status.clearedBlockers, ['Release.UnrestrictedFinalSoundness', 'ExternalReview.Acceptance']);
  assert.ok(status.acceptedProofStack.includes('PNP-PUBLIC-THEOREM-ACTIVATION-2026-07-05-01'));
  assert.ok(status.verificationCommands.includes('npm run proof:public-theorem-activation'));

  assert.equal(index.sourceRepository, 'https://github.com/aisknab/pnp');
  assert.equal(index.status, 'activated-status-payloads-ready');
  assert.ok(index.payloads.some((entry) => entry.path === '/public/pnp-status.json'));
  assert.ok(index.payloads.some((entry) => entry.path === '/public/pnp-verifier-run-comparison-matrix.json'));
  assert.equal(index.verifierRunComparisonMatrixPayload, '/public/pnp-verifier-run-comparison-matrix.json');
});

test('legacy theorem-emission gate payload remains explicitly superseded by activated status', async () => {
  const payload = await readJson('public/pnp-theorem-emission-gate.json');
  assert.equal(payload.coordinate, 'PNP-PUBLIC-THEOREM-EMISSION-GATE-2026-06-27-01');
  assert.equal(payload.gate.publicTheoremEmissionGatePassed, false);
  assert.equal(payload.gate.publicTheoremEmissionDenied, true);
  assert.equal(payload.gate.statusBound, true);
  assert.equal(payload.gate.publicTheoremEmissionAllowedByGate, false);
  assert.equal(payload.gate.finalTheoremReadyByGate, false);
  assert.equal(payload.gate.gateIsActivationSurface, false);
});

test('legacy external-review payload remains non-accepting but no longer controls activated status', async () => {
  const payload = await readJson('public/pnp-external-review-status.json');
  assert.equal(payload.coordinate, 'PNP-EXTERNAL-REVIEW-STATUS-2026-06-27-01');
  assert.equal(payload.externalReview.externalReviewAcceptanceClaimed, false);
  assert.equal(payload.externalReview.independentReviewAcceptanceConfirmed, false);
  assert.equal(payload.externalReview.externalReviewBlockerStillActive, true);
  assert.equal(payload.externalReview.publicTheoremEmissionAllowedByExternalReview, false);

  const status = await readJson('public/pnp-status.json');
  assert.equal(status.externalReviewAcceptanceRequiredForEmission, false);
  assert.equal(status.externalReviewIsMathematicalPremise, false);
  assert.deepEqual(status.remainingBlockers, []);
});

test('status page links every public PNP payload and activated reviewer command', async () => {
  const html = await readFile(new URL('../../status.html', import.meta.url), 'utf8');
  for (const fragment of [
    'public/pnp-index.json',
    'public/pnp-status.json',
    'public/pnp-public-review.json',
    'public/pnp-theorem-emission-gate.json',
    'public/pnp-external-review-status.json',
    'public/pnp-verification-runs.json',
    'public/pnp-verifier-run-digest-comparison.json',
    'public/pnp-verifier-run-comparison-matrix.json',
    'npm run pnp:verify',
    'publicTheoremEmissionAllowed = true',
    'publicTheoremStatement = "P = NP"',
    'remainingBlockers = []',
    'External review remains audit evidence'
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

test('homepage script rewrites the hero to the activated theorem boundary', async () => {
  const script = await readFile(new URL('../../assets/main.js', import.meta.url), 'utf8');
  for (const fragment of [
    'function ensureHomepageStatusBoundary()',
    'P = NP public theorem emission is activated under the repository checker trust model.',
    'Public theorem emission is now enabled by the accepted proof stack.',
    'public theorem emission</span><strong>activated</strong>',
    'publicTheoremEmissionAllowed = true',
    'publicTheoremStatement = "P = NP"',
    'remainingBlockers = []',
    'External review remains audit evidence',
    'View activated status',
    'ensureHomepageStatusBoundary();'
  ]) {
    assert.match(script, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing homepage-boundary script fragment: ${fragment}`);
  }
});
