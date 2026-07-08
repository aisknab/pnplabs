import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { BuildPNPVerifierRunComparisonMatrix0 } from '../../tools/generate-pnp-verifier-run-matrix.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('comparison matrix payload exposes the public run registry matrix', async () => {
  const matrix = await readJson('public/pnp-verifier-run-comparison-matrix.json');

  assert.equal(matrix.kind, 'PNPVerifierRunComparisonMatrix0');
  assert.equal(matrix.status, 'verifier-run-comparison-matrix-ready');
  assert.equal(matrix.sourceRegistry, 'public/pnp-verification-runs.json');
  assert.equal(matrix.comparisonPolicyPayload, 'public/pnp-verifier-run-digest-comparison.json');
  assert.equal(matrix.generatedBy, 'tools/generate-pnp-verifier-run-matrix.mjs');
  assert.equal(matrix.registryRunCount, 1);
  assert.equal(matrix.pairCount, 1);
  assert.equal(matrix.acceptedPairCount, 1);
  assert.equal(matrix.rejectedPairCount, 0);
  assert.equal(matrix.requiredMismatchPairCount, 0);
  assert.equal(matrix.allRequiredPairsAccept, true);
  assert.equal(matrix.allRequiredPairsMatch, true);
  assert.equal(matrix.diagonalAccepts, true);
  assert.deepEqual(matrix.recordIds, ['pnplabs-ci-pr16-2026-07-06']);
  assert.match(matrix.matrixSha256, /^[0-9a-f]{64}$/);
});

test('generated comparison matrix matches the committed matrix core', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  const committed = await readJson('public/pnp-verifier-run-comparison-matrix.json');
  const generated = BuildPNPVerifierRunComparisonMatrix0(registry);

  assert.equal(generated.tag, 'accept');
  assert.equal(generated.matrix.kind, committed.kind);
  assert.equal(generated.matrix.registryRunCount, committed.registryRunCount);
  assert.equal(generated.matrix.pairCount, committed.pairCount);
  assert.equal(generated.matrix.acceptedPairCount, committed.acceptedPairCount);
  assert.equal(generated.matrix.requiredMismatchPairCount, committed.requiredMismatchPairCount);
  assert.equal(generated.matrix.rows[0].cells[0].tag, 'accept');
  assert.equal(generated.matrix.rows[0].cells[0].leftRecordId, 'pnplabs-ci-pr16-2026-07-06');
  assert.equal(generated.matrix.rows[0].cells[0].rightRecordId, 'pnplabs-ci-pr16-2026-07-06');
  assert.equal(generated.matrix.rows[0].cells[0].requiredMismatches.length, 0);
});

test('comparison matrix rejects stale non-activated registries', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  registry.claimBoundary.publicTheoremEmissionAllowed = false;
  const out = BuildPNPVerifierRunComparisonMatrix0(registry);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'Matrix.ClaimBoundary');
});

test('comparison matrix rejects duplicate record identifiers', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  registry.runs.push(JSON.parse(JSON.stringify(registry.runs[0])));
  const out = BuildPNPVerifierRunComparisonMatrix0(registry);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'Matrix.DuplicateRecordIds');
});

test('comparison matrix page and payload index link the matrix and summary payloads', async () => {
  const html = await readText('verifier-run-digests.html');
  const index = await readJson('public/pnp-index.json');

  for (const fragment of [
    'public/pnp-verifier-run-comparison-matrix.json',
    'public/pnp-verifier-run-matrix-summary.json',
    'npm run pnp:run-matrix -- --json',
    'npm run pnp:run-summary -- --json',
    'registryRunCount = 1',
    'pairCount = 1',
    'acceptedPairCount = 1',
    'requiredMismatchPairCount = 0',
    'allRequiredPairsAccept = true',
    'diagonalAccepts = true'
  ]) {
    assert.equal(html.includes(fragment), true, `missing matrix page fragment: ${fragment}`);
  }

  assert.equal(index.version, 5);
  assert.ok(index.payloads.some((entry) => entry.path === '/public/pnp-verifier-run-comparison-matrix.json'));
  assert.ok(index.payloads.some((entry) => entry.path === '/public/pnp-verifier-run-matrix-summary.json'));
  assert.ok(index.payloads.some((entry) => entry.path === '/public/pnp-one-command-upload.json'));
  assert.equal(index.verifierRunComparisonMatrixPayload, '/public/pnp-verifier-run-comparison-matrix.json');
  assert.equal(index.verifierRunMatrixSummaryPayload, '/public/pnp-verifier-run-matrix-summary.json');
});
