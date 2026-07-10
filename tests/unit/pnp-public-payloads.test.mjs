import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

const siblingStatus = new URL('../../../pnp/public/pnp-status.json', import.meta.url);
let siblingAvailable = true;
try {
  await access(siblingStatus);
} catch {
  siblingAvailable = false;
}

test('site status is byte-for-byte identical to the authoritative sibling payload', { skip: siblingAvailable ? false : 'sibling pnp checkout unavailable; upstream-consistency CI performs the remote comparison' }, async () => {
  const site = await readText('public/pnp-status.json');
  const source = await readFile(siblingStatus, 'utf8');
  assert.equal(site, source);
});

test('current status exposes the incomplete formal reconstruction', async () => {
  const status = await readJson('public/pnp-status.json');
  assert.equal(status.kind, 'PNPFormalReconstructionStatus0');
  assert.equal(status.coordinate, 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-01');
  assert.equal(status.status, 'formal-reconstruction-in-progress');
  assert.equal(status.mathematicalTheoremEstablished, false);
  assert.equal(status.publicTheoremEmissionAllowed, false);
  assert.equal(status.publicTheoremStatement, null);
  assert.equal(status.publicTheoremConclusion, null);
  assert.equal(status.finalTheoremReady, false);
  assert.equal(status.rootLeanTheoremPresent, false);
  assert.equal(status.rootLeanTheoremBuilt, false);
  assert.equal(status.rootLeanTheoremAxiomAuditPassed, false);
  assert.equal(status.projectSpecificAxiomsRemaining, true);
  assert.equal(status.checkerAcceptanceIsMathematicalProof, false);
  assert.equal(status.legacyCheckerStackStatus, 'historical-assertion-checker-evidence-only');
  assert.equal(status.externalReviewIsMathematicalPremise, false);
  assert.deepEqual(status.verificationCommands, [
    'node pcc-formal-reconstruction-status0.mjs --json',
    'node pcc-formal-public-surface0.mjs --json',
    'npm run pnp:verify',
    'lake build PNP',
  ]);
  assert.equal(status.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-10-FORMAL-RECONSTRUCTION-01');
  assert.equal(status.remainingFormalObligations.length, 8);
  assert.deepEqual(status.remainingBlockers, status.remainingFormalObligations);
});

test('current status inventories every active companion workflow', async () => {
  const status = await readJson('public/pnp-status.json');
  const names = (await readdir(new URL('../../.github/workflows/', import.meta.url)))
    .filter((name) => name.endsWith('.yml'))
    .sort()
    .map((name) => `.github/workflows/${name}`);

  assert.deepEqual([...status.activeCompanionWorkflows].sort(), names);
});

test('payload index mirrors the conservative boundary and labels legacy surfaces', async () => {
  const index = await readJson('public/pnp-index.json');
  assert.equal(index.version, 6);
  assert.equal(index.status, 'formal-reconstruction-status-payloads-ready');
  assert.equal(index.claimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(index.claimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(index.claimBoundary.publicTheoremStatement, null);
  assert.equal(index.claimBoundary.finalTheoremReady, false);
  assert.equal(index.claimBoundary.rootLeanTheoremPresent, false);
  assert.equal(index.claimBoundary.projectSpecificAxiomsRemaining, true);
  assert.equal(index.historicalRunIntakeFrozen, true);
  assert.equal(index.payloads.find((entry) => entry.id === 'pnp-status').status, 'current');
  for (const id of ['pnp-one-command-upload', 'pnp-verification-runs', 'pnp-verifier-run-comparison-matrix', 'pnp-verifier-run-matrix-summary']) {
    assert.equal(index.payloads.find((entry) => entry.id === id).status, 'historical-frozen');
  }
});

test('status page shows every current false field and the remaining blockers', async () => {
  const html = await readText('status.html');
  for (const fragment of [
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'publicTheoremStatement = null',
    'finalTheoremReady = false',
    'rootLeanTheoremPresent = false',
    'rootLeanTheoremBuilt = false',
    'rootLeanTheoremAxiomAuditPassed = false',
    'projectSpecificAxiomsRemaining = true',
    'Formal.ResidualBandMinimizer',
    'Formal.RootTheoremAndAxiomAudit',
    'historical assertion-checker evidence',
  ]) assert.equal(html.includes(fragment), true, `missing status fragment: ${fragment}`);
});

test('older public-review payloads are explicitly superseded and non-authoritative', async () => {
  for (const path of [
    'public/pnp-public-review.json',
    'public/pnp-theorem-emission-gate.json',
    'public/pnp-external-review-status.json',
  ]) {
    const payload = await readJson(path);
    assert.equal(payload.historical, true, `${path}: historical flag`);
    assert.equal(payload.currentStatusAuthority, false, `${path}: authority flag`);
    assert.equal(payload.supersededBy, 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-01', `${path}: supersession coordinate`);
    assert.equal(payload.currentClaimBoundary.mathematicalTheoremEstablished, false, `${path}: theorem boundary`);
    assert.equal(payload.currentClaimBoundary.publicTheoremEmissionAllowed, false, `${path}: emission boundary`);
  }
});
