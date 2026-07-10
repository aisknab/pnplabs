import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { BuildPNPVerifierRunMatrixSummary0 } from '../../tools/generate-pnp-verifier-run-summary.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

test('matrix summary is neutral historical metadata rather than a green badge', async () => {
  const summary = await readJson('public/pnp-verifier-run-matrix-summary.json');
  assert.equal(summary.kind, 'PNPVerifierRunMatrixBadgeSummary0');
  assert.equal(summary.status, 'historical-verifier-run-matrix-summary-frozen');
  assert.equal(summary.historical, true);
  assert.equal(summary.currentStatusBadge, false);
  assert.equal(summary.badge.state, 'historical');
  assert.equal(summary.badge.tone, 'neutral');
  assert.equal(summary.badge.shortText, 'historical snapshot');
  assert.equal(summary.currentBoundary.mathematicalTheoremEstablished, false);
  assert.equal(summary.currentBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(summary.currentBoundary.publicTheoremStatement, null);
  assert.equal(summary.currentBoundary.finalTheoremReady, false);
  assert.match(summary.summarySha256, /^[0-9a-f]{64}$/);
});

test('summary generator reproduces the committed neutral summary', async () => {
  const matrix = await readJson('public/pnp-verifier-run-comparison-matrix.json');
  const committed = await readJson('public/pnp-verifier-run-matrix-summary.json');
  const generated = BuildPNPVerifierRunMatrixSummary0(matrix);
  assert.equal(generated.tag, 'accept');
  assert.equal(generated.summary.summarySha256, committed.summarySha256);
  assert.equal(generated.summary.badge.state, 'historical');
  assert.equal(generated.summary.badge.tone, 'neutral');
});

test('historical summary never becomes a current green badge even if old pairs agree', async () => {
  const matrix = await readJson('public/pnp-verifier-run-comparison-matrix.json');
  const generated = BuildPNPVerifierRunMatrixSummary0(matrix);
  assert.equal(generated.summary.metrics.allRequiredPairsAccept, true);
  assert.equal(generated.summary.currentStatusBadge, false);
  assert.notEqual(generated.summary.badge.state, 'passing');
  assert.notEqual(generated.summary.badge.tone, 'success');
});
