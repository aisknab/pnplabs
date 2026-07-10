import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { BuildPNPVerifierRunComparisonMatrix0 } from '../../tools/generate-pnp-verifier-run-matrix.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

test('comparison matrix is frozen historical metadata', async () => {
  const matrix = await readJson('public/pnp-verifier-run-comparison-matrix.json');
  assert.equal(matrix.kind, 'PNPVerifierRunComparisonMatrix0');
  assert.equal(matrix.status, 'historical-verifier-run-comparison-matrix-frozen');
  assert.equal(matrix.historical, true);
  assert.equal(matrix.intakeFrozen, true);
  assert.equal(matrix.generatedFromRegistryStatus, 'historical-activated-verification-run-registry-frozen');
  assert.equal(matrix.currentBoundary.mathematicalTheoremEstablished, false);
  assert.equal(matrix.currentBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(matrix.currentBoundary.publicTheoremStatement, null);
  assert.equal(matrix.currentBoundary.finalTheoremReady, false);
  assert.equal(matrix.currentBoundary.projectSpecificAxiomsRemaining, true);
  assert.match(matrix.nonClaims.join('\n'), /No current green status badge/);
  assert.match(matrix.matrixSha256, /^[0-9a-f]{64}$/);
});

test('generated historical matrix matches committed matrix core', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  const committed = await readJson('public/pnp-verifier-run-comparison-matrix.json');
  const generated = BuildPNPVerifierRunComparisonMatrix0(registry);
  assert.equal(generated.tag, 'accept');
  assert.equal(generated.matrix.status, committed.status);
  assert.equal(generated.matrix.matrixSha256, committed.matrixSha256);
  assert.equal(generated.matrix.rows[0].cells[0].tag, 'accept');
});

test('matrix generator rejects a registry that is not frozen', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  registry.intakeFrozen = false;
  const out = BuildPNPVerifierRunComparisonMatrix0(registry);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'Matrix.RegistryStatus');
});

test('matrix generator rejects a strengthened current boundary', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  registry.currentClaimBoundary.publicTheoremEmissionAllowed = true;
  const out = BuildPNPVerifierRunComparisonMatrix0(registry);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'Matrix.CurrentClaimBoundary');
});

test('matrix generator rejects duplicate historical record identifiers', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  registry.runs.push(structuredClone(registry.runs[0]));
  const out = BuildPNPVerifierRunComparisonMatrix0(registry);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'Matrix.DuplicateRecordIds');
});
