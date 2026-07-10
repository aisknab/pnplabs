import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

test('run registry is a frozen historical snapshot with a conservative current boundary', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  assert.equal(registry.kind, 'PNPLabsPNPVerificationRunRegistry0');
  assert.equal(registry.version, 8);
  assert.equal(registry.status, 'historical-activated-verification-run-registry-frozen');
  assert.equal(registry.historical, true);
  assert.equal(registry.intakeFrozen, true);
  assert.equal(registry.currentClaimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(registry.currentClaimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(registry.currentClaimBoundary.publicTheoremStatement, null);
  assert.equal(registry.currentClaimBoundary.finalTheoremReady, false);
  assert.equal(registry.currentClaimBoundary.projectSpecificAxiomsRemaining, true);
  assert.equal(registry.currentClaimBoundary.remainingBlockers.length, 8);
  assert.equal(registry.importWorkflow.status, 'frozen');
  assert.equal(registry.importWorkflow.intakeFrozen, true);
  assert.equal(registry.importWorkflow.acceptsNewRecords, false);
  assert.equal(registry.importWorkflow.writeCommand, null);
  assert.equal(registry.badgeSummaryWorkflow.exposesStatusBadge, false);
});

test('superseded activated record remains labelled historical', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  assert.equal(registry.historicalClaimBoundary.publicTheoremEmissionAllowed, true);
  assert.equal(registry.historicalStatusPayload.coordinate, 'PNP-ACTIVATED-STATUS-2026-07-05-01');
  assert.equal(registry.runs.length, 1);
  assert.equal(registry.runs[0].recordId, 'pnplabs-ci-pr16-2026-07-06');
  assert.equal(registry.runs[0].historical, true);
  assert.equal(registry.runs[0].verdict.publicTheoremEmissionAllowed, true);
  assert.match(registry.nonClaims.join('\n'), /superseded activated checker status/);
  assert.match(registry.nonClaims.join('\n'), /not current theorem-status evidence/);
  assert.match(registry.nonClaims.join('\n'), /New records are not accepted/);
});

test('historical registry page communicates the freeze and current false boundary', async () => {
  const html = await readFile(new URL('../../verification-runs.html', import.meta.url), 'utf8');
  for (const fragment of [
    'Activated verifier-run registry is frozen.',
    'New activated-status records are not accepted',
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'publicTheoremStatement = null',
    'currentStatusBadge = false',
    'badge.state = "historical"',
    'pnplabs-ci-pr16-2026-07-06',
    'historical data and do not override',
  ]) assert.equal(html.includes(fragment), true, `missing frozen-registry page fragment: ${fragment}`);
});
