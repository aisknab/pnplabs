import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  M229, assertM229Status, assertM229Inventory, assertM229Manifest,
  assertM229PublicationMap,
} from '../../tools/formal-m229-contract.mjs';

const json = file => JSON.parse(readFileSync(file, 'utf8'));
const status = json('public/pnp-status.json');
const inventory = json('public/pnp-theorem-inventory.json');
const release = json('downloads/formal-publication-release.json');
const index = json('public/pnp-index.json');
const progress = json('public/pnp-proof-progress.json');
const updates = json('content/milestone-updates.json');
const row = status.formalPublicationMilestones.find(row => row.id === M229.id);
const theorem = inventory.milestoneCandidates.find(row => row.name === M229.theoremName);
const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-05-229';
const minimalStatus = () => ({ ...M229.fields, formalPublicationMilestones: [structuredClone(row)] });
const minimalInventory = () => ({ milestoneCandidates: [structuredClone(theorem)] });
const minimalManifest = () => ({ earnedBoundary: Object.fromEntries(Object.entries(release.earnedBoundary).filter(([key]) => key === 'scope' || key.startsWith(M229.releasePrefix))) });
const minimalMap = () => ({ milestones: [structuredClone(row)], earnedMilestoneTheoremKernelTypeSha256: { [M229.theoremName]: M229.kernelTypeSha256 } });

test('M229 publication contracts accept the exact compiled evidence and mirrors', () => {
  assert.equal(M229.kernelTypeSha256, '5cb01b3ff8e154613151d8d131f576ce86bdc33e2d24d355793a3ca55ce7208f');
  assertM229Status(status);
  assertM229Inventory(inventory);
  assertM229Manifest(release);
  assertM229PublicationMap(minimalMap());
  assert.deepEqual(index.formalPublicationMilestoneCounts, {
    total: status.formalPublicationMilestones.length,
    earned: progress.formalArtefactCoverage.earnedRows,
    unearned: status.formalPublicationMilestones.filter(row => !row.earned).length,
  });
  assert.equal(Object.keys(M229.fields).length, 18);
  for (const [key, value] of Object.entries(M229.fields)) assert.equal(index.claimBoundary[key], value);
  assert.match(M229.scope, /every coordinate in its complete post-header schedule/);
  assert.match(M229.scope, /without a staged request, route, remainder or success certificate/);
  assert.match(M229.scope, /physical remainder equals the canonical body token coordinate/);
  assert.match(M229.nonClaim, /Both body outcomes remain incomplete terminal configurations/);
});

test('M229 rejects missing or changed status and release fields, including widened claims', () => {
  for (const [key, value] of Object.entries(M229.fields)) {
    for (const invalid of [undefined, null, typeof value === 'boolean' ? !value : value + 1]) {
      const payload = minimalStatus();
      payload[key] = invalid;
      assert.throws(() => assertM229Status(payload), /M229/);
      const manifest = structuredClone(minimalManifest());
      manifest.earnedBoundary[key.replace(M229.statusPrefix, M229.releasePrefix)] = invalid;
      assert.throws(() => assertM229Manifest(manifest), /M229/);
    }
  }
});

test('M229 rejects missing, duplicated, weakened or assumption-backed compiled declarations', () => {
  for (const mutate of [
    payload => { payload.milestoneCandidates = []; },
    payload => { payload.milestoneCandidates.push(structuredClone(theorem)); },
    payload => { payload.milestoneCandidates[0].kernelType = 'True'; },
    payload => { payload.milestoneCandidates[0].kind = 'axiom'; },
    payload => { payload.milestoneCandidates[0].module = 'PNP.Fixture'; },
    payload => { payload.milestoneCandidates[0].axioms.push('PNP.FixtureAssumption'); },
    payload => { payload.milestoneCandidates[0].axioms.push('Classical.choice'); },
  ]) {
    const payload = minimalInventory();
    mutate(payload);
    assert.throws(() => assertM229Inventory(payload), /M229/);
  }
});

test('M229 rejects altered publication scope, theorem fingerprints and release axiom evidence', () => {
  for (const field of ['scope', 'nonClaim', 'classification']) {
    const map = minimalMap();
    map.milestones[0][field] = 'unconditional-complete-proof';
    assert.throws(() => assertM229PublicationMap(map), /M229/);
  }
  const map = minimalMap();
  map.earnedMilestoneTheoremKernelTypeSha256[M229.theoremName] = '0'.repeat(64);
  assert.throws(() => assertM229PublicationMap(map), /M229/);
  for (const [suffix, value] of [
    ['CheckedCompleteTheorem', 'PNP.Main.p_eq_np'],
    ['TheoremKernelTypeSha256', {}],
    ['AxiomClosure', []],
    ['ProjectAxiomClosure', ['PNP.FixtureAssumption']],
  ]) {
    const manifest = structuredClone(minimalManifest());
    manifest.earnedBoundary[M229.releasePrefix + suffix] = value;
    assert.throws(() => assertM229Manifest(manifest), /M229/);
  }
  const manifest = structuredClone(minimalManifest());
  manifest.earnedBoundary.scope = 'unrelated-scope';
  assert.throws(() => assertM229Manifest(manifest), /M229/);
  for (const mutate of [
    row => { row.earned = false; },
    row => { row.allAssumptionFree = true; },
    row => { row.theoremRows = []; },
    row => { row.theoremRows[0].actualKernelTypeSha256 = '0'.repeat(64); },
    row => { row.theoremRows[0].axioms.push('PNP.FixtureAssumption'); },
  ]) {
    const payload = minimalStatus();
    mutate(payload.formalPublicationMilestones[0]);
    assert.throws(() => assertM229Status(payload), /M229/);
  }
});

test('M229 rejection diagnostics retain every shared trust-layer contract', () => {
  const releaseFlag = minimalManifest();
  releaseFlag.earnedBoundary[M229.releasePrefix + 'Formalized'] = false;
  assert.throws(() => assertM229Manifest(releaseFlag), /^Error: current manifest M229 .* boundary mismatch$/);

  const releaseFingerprint = minimalManifest();
  releaseFingerprint.earnedBoundary[M229.releasePrefix + 'TheoremKernelTypeSha256'] = {
    [M229.theoremName]: '0'.repeat(64),
  };
  assert.throws(() => assertM229Manifest(releaseFingerprint), /^Error: current manifest M229 .* fingerprint mismatch$/);

  const statusFlag = minimalStatus();
  statusFlag[M229.statusPrefix + 'AxiomAuditPassed'] = false;
  assert.throws(() => assertM229Status(statusFlag), /^Error: status M229 .* evidence mismatch$/);

  const statusMilestone = minimalStatus();
  statusMilestone.formalPublicationMilestones[0].nonClaim = 'unsupported-complete-global-claim';
  assert.throws(() => assertM229Status(statusMilestone), /^Error: status M229 .* boundary mismatch$/);

  const inventoryAxiom = minimalInventory();
  inventoryAxiom.milestoneCandidates[0].axioms = ['PNP.ForgedLatestMilestoneAxiom'];
  assert.throws(() => assertM229Inventory(inventoryAxiom), /^Error: inventory M229 .* theorem mismatch$/);

  const mapMilestone = minimalMap();
  mapMilestone.milestones[0].scope = 'unsupported-complete-global-claim';
  assert.throws(() => assertM229PublicationMap(mapMilestone), /^Error: core publication map M229 .* boundary mismatch$/);

  const mapFingerprint = minimalMap();
  mapFingerprint.earnedMilestoneTheoremKernelTypeSha256[M229.theoremName] = '0'.repeat(64);
  assert.throws(() => assertM229PublicationMap(mapFingerprint), /^Error: core publication map M229 .* fingerprint mismatch$/);
});

test('M229 history awards coverage without a fixed checkpoint or global-gate increase', () => {
  const history = progress.history.find(row => row.asOfCoordinate === coordinate);
  assert.ok(history);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 205, totalRows: 207 });
  assert.equal(history.riskWeightedProofCompletionPercent, 35);
  assert.equal(history.uncertaintyLowPercent, 20);
  assert.equal(history.uncertaintyHighPercent, 40);
  assert.equal(history.globalGatesClosed, 0);
  assert.equal(history.globalGatesAvailable, 5);
  assert.equal(history.scoreChanged, false);
  assert.deepEqual(history.changedCheckpointIds, []);
  const update = updates.entries.find(row => row.milestoneId === M229.id);
  assert.equal(update.source.statusCoordinate, coordinate);
  assert.deepEqual(update.progressSnapshot, {
    modelId: progress.modelId,
    formalArtefactCoverageEarnedRows: history.formalArtefactCoverage.earnedRows,
    formalArtefactCoverageTotalRows: history.formalArtefactCoverage.totalRows,
    riskWeightedProofCompletionPercent: history.riskWeightedProofCompletionPercent,
    uncertaintyLowPercent: history.uncertaintyLowPercent,
    uncertaintyHighPercent: history.uncertaintyHighPercent,
    globalGatesClosed: history.globalGatesClosed,
    globalGatesAvailable: history.globalGatesAvailable,
  });
});

test('current surfaces use ledger values and preserve the versioned M229 boundary', () => {
  const latest = updates.entries[0];
  const currentCoverage = `${progress.formalArtefactCoverage.earnedRows} of ${progress.formalArtefactCoverage.totalRows}`;
  for (const file of ['README.md', 'index.html', 'status.html', 'faq.html', 'paper.html', 'architecture.html']) {
    const surface = readFileSync(file, 'utf8');
    assert.ok(surface.includes(currentCoverage), `${file}: current coverage`);
    assert.ok(surface.includes(`${progress.proofCompletion.percent}%`), `${file}: proof estimate`);
    if (latest.milestoneId === M229.id) {
      assert.match(surface, /physical body remainder|physical body-remainder|physical remainder/);
      assert.match(surface, /clause occupancy and body-token and padding request synthesis open/);
    }
  }
  for (const file of ['index.html', 'status.html']) {
    assert.ok(readFileSync(file, 'utf8').includes(release.artifacts.theoremInventory.sha256), file + ': visible inventory identity');
  }
  const home = readFileSync('index.html', 'utf8');
  assert.ok(home.includes(`data-current-milestone="${latest.milestoneId}"`));
  const statusPage = readFileSync('status.html', 'utf8');
  assert.ok(statusPage.includes(`data-milestone-id="${M229.id}"`));
  assert.ok(statusPage.includes('data-milestone-id="concrete-cook-levin-builder-physical-classifier-all-route-derived-finish-split"'));
  const claims = readFileSync('docs/activated_claim_wording.md', 'utf8');
  for (const [key, value] of Object.entries(M229.fields)) assert.ok(claims.includes(`${key} = ${value}`));
  assert.match(readFileSync('AGENTS.md', 'utf8'), /Verification ownership matrix/);
});
