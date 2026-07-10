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
  assert.equal(status.coordinate, 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-03');
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
  assert.equal(status.leanToolchain, 'leanprover/lean4:v4.31.0');
  assert.equal(status.leanCompilerVersion, '4.31.0');
  assert.equal(status.leanCompilerCommit, '68218e876d2a38b1985b8590fff244a83c321783');
  assert.equal(status.lakeVersion, '5.0.0-src+68218e8');
  assert.equal(status.elanVersion, '4.2.3');
  assert.equal(status.elanReleaseCommit, 'b6cec7e10fe4965a605aaf60d1cb4a5837f0462b');
  assert.equal(status.elanArchiveSha256, 'df0b2b3a439961ffcbb3985214365ffe40f49bc871df04dff268c7d8e21ca8b2');
  assert.equal(status.leanBuildTarget, 'PNP');
  assert.equal(status.leanRootModule, 'PNP');
  assert.equal(status.leanRootStatusDeclaration, 'PNP.Main.rootTheoremStatus');
  assert.equal(status.leanBuildConfigurationPinned, true);
  assert.equal(status.explicitLeanRootTargetPresent, true);
  assert.equal(status.leanLibraryTargetBuilt, true);
  assert.equal(status.leanSourcePlaceholderAuditPassed, true);
  assert.equal(status.sorryOrAdmitInRootDependencyClosure, null);
  assert.deepEqual(status.projectSpecificAxiomInventory, [
    'PNP.SAT',
    'PNP.LockedNANDThreshold',
    'PNP.ResidualBandExactMinimization',
    'PNP.GeneratePCCPack',
    'PNP.CheckPCCPackexp',
  ]);
  assert.equal(status.checkerAcceptanceIsMathematicalProof, false);
  assert.equal(status.legacyCheckerStackStatus, 'historical-assertion-checker-evidence-only');
  assert.equal(status.externalReviewIsMathematicalPremise, false);
  assert.deepEqual(status.verificationCommands, [
    'node pcc-formal-reconstruction-status0.mjs --json',
    'node pcc-formal-public-surface0.mjs --json',
    'npm run legacy:v0:check',
    'npm run pnp:verify -- --no-write',
    'node --test audits/lean-root-target0.test.mjs',
    'lake build PNP',
    'lake env lean -DwarningAsError=true lean-audit/PNPBridgeAxiomAudit.lean',
  ]);
  assert.deepEqual(status.historicalReplayWorkflows, ['.github/workflows/legacy-v0-replay.yml']);
  assert.equal(status.legacyCheckerArchiveManifest, 'archive/legacy-v0/ARCHIVE.json');
  assert.equal(status.legacyCheckerArchiveCheckCommand, 'npm run legacy:v0:check');
  assert.equal(status.legacyCheckerReplayCommand, 'npm run legacy:v0:replay -- --output /tmp/pnp-legacy-v0-7072f8d');
  assert.equal(status.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-10-PINNED-LEAN-ROOT-03');
  assert.equal(status.remainingFormalObligations.length, 7);
  assert.deepEqual(status.remainingBlockers, status.remainingFormalObligations);
  assert.equal(status.remainingBlockers.includes('Formal.PinnedLeanBuildAndRootTarget'), false);
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
  assert.equal(index.version, 7);
  assert.equal(index.status, 'formal-reconstruction-status-payloads-ready');
  assert.equal(index.claimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(index.claimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(index.claimBoundary.publicTheoremStatement, null);
  assert.equal(index.claimBoundary.finalTheoremReady, false);
  assert.equal(index.claimBoundary.rootLeanTheoremPresent, false);
  assert.equal(index.claimBoundary.projectSpecificAxiomsRemaining, true);
  assert.equal(index.claimBoundary.leanLibraryTargetBuilt, true);
  assert.deepEqual(index.claimBoundary.projectSpecificAxiomInventory, [
    'PNP.SAT',
    'PNP.LockedNANDThreshold',
    'PNP.ResidualBandExactMinimization',
    'PNP.GeneratePCCPack',
    'PNP.CheckPCCPackexp',
  ]);
  assert.equal(index.claimBoundary.remainingBlockers.length, 7);
  assert.equal(index.claimBoundary.remainingBlockers.includes('Formal.PinnedLeanBuildAndRootTarget'), false);
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
    'Seven obligations remain',
    'leanprover/lean4:v4.31.0',
    'PNP.CheckPCCPackexp',
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
