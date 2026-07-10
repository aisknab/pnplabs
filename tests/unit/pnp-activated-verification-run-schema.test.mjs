import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

test('historical activated record schema is retained only for auditability', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  assert.equal(registry.runRecordSchema.kind, 'PNPActivatedVerificationRunRecord0');
  assert.equal(registry.historical, true);
  assert.equal(registry.intakeFrozen, true);
  assert.equal(registry.submissionPath.status, 'closed');
  assert.equal(registry.submissionPath.acceptsNewRecords, false);
  assert.equal(registry.importWorkflow.acceptsNewRecords, false);
  assert.equal(registry.currentClaimBoundary.publicTheoremEmissionAllowed, false);
});

test('current status supersedes every historical activated coordinate', async () => {
  const status = await readJson('public/pnp-status.json');
  const registry = await readJson('public/pnp-verification-runs.json');
  assert.equal(status.coordinate, 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-01');
  assert.equal(status.historicalActivatedStatusCoordinate, registry.historicalStatusPayload.coordinate);
  assert.equal(status.publicTheoremEmissionAllowed, false);
  assert.equal(status.mathematicalTheoremEstablished, false);
  assert.equal(status.rootLeanTheoremPresent, false);
});
