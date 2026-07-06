import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { BuildPNPVerifierRunMatrixSummary0 } from '../../tools/generate-pnp-verifier-run-summary.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('matrix badge summary payload exposes compact passing state', async () => {
  const summary = await readJson('public/pnp-verifier-run-matrix-summary.json');

  assert.equal(summary.kind, 'PNPVerifierRunMatrixBadgeSummary0');
  assert.equal(summary.status, 'verifier-run-matrix-badge-summary-ready');
  assert.equal(summary.sourceMatrix, 'public/pnp-verifier-run-comparison-matrix.json');
  assert.equal(summary.badge.state, 'passing');
  assert.equal(summary.badge.tone, 'success');
  assert.equal(summary.badge.text, '1 public run; 1/1 required comparisons passing');
  assert.equal(summary.metrics.registryRunCount, 1);
  assert.equal(summary.metrics.pairCount, 1);
  assert.equal(summary.metrics.acceptedPairCount, 1);
  assert.equal(summary.metrics.requiredMismatchPairCount, 0);
  assert.equal(summary.metrics.allRequiredPairsAccept, true);
  assert.equal(summary.metrics.diagonalAccepts, true);
  assert.equal(summary.boundary.publicTheoremEmissionAllowed, true);
  assert.equal(summary.boundary.publicTheoremStatement, 'P = NP');
  assert.equal(summary.boundary.externalReviewIsMathematicalPremise, false);
  assert.match(summary.summarySha256, /^[0-9a-f]{64}$/);
});

test('matrix badge generator matches the committed summary core', async () => {
  const matrix = await readJson('public/pnp-verifier-run-comparison-matrix.json');
  const committed = await readJson('public/pnp-verifier-run-matrix-summary.json');
  const generated = BuildPNPVerifierRunMatrixSummary0(matrix);

  assert.equal(generated.tag, 'accept');
  assert.equal(generated.summary.kind, committed.kind);
  assert.equal(generated.summary.badge.state, committed.badge.state);
  assert.equal(generated.summary.badge.text, committed.badge.text);
  assert.deepEqual(generated.summary.metrics, committed.metrics);
  assert.deepEqual(generated.summary.recordIds, committed.recordIds);
});

test('matrix badge generator switches to attention for required mismatches', async () => {
  const matrix = await readJson('public/pnp-verifier-run-comparison-matrix.json');
  matrix.requiredMismatchPairCount = 1;
  matrix.rejectedPairCount = 1;
  matrix.allRequiredPairsAccept = false;
  matrix.allRequiredPairsMatch = false;

  const generated = BuildPNPVerifierRunMatrixSummary0(matrix);
  assert.equal(generated.tag, 'accept');
  assert.equal(generated.summary.badge.state, 'attention');
  assert.equal(generated.summary.badge.tone, 'warning');
});

test('matrix badge pages expose compact summary fragments', async () => {
  const status = await readText('status.html');
  const runs = await readText('verification-runs.html');
  const digests = await readText('verifier-run-digests.html');
  const joined = `${status}\n${runs}\n${digests}`;

  for (const fragment of [
    'Verifier-run matrix badge',
    '1 public run; 1/1 required comparisons passing',
    'public/pnp-verifier-run-matrix-summary.json',
    'npm run pnp:run-summary',
    'badge.state = passing',
    'metrics.requiredMismatchPairCount = 0'
  ]) {
    assert.equal(joined.includes(fragment), true, `missing matrix badge fragment: ${fragment}`);
  }
});
