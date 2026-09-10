import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  M230, assertM230Status, assertM230Inventory, assertM230Manifest,
  assertM230PublicationMap,
} from '../../tools/formal-m230-contract.mjs';

const json = file => JSON.parse(readFileSync(file, 'utf8'));
const status = json('public/pnp-status.json');
const inventory = json('public/pnp-theorem-inventory.json');
const release = json('downloads/formal-publication-release.json');
const index = json('public/pnp-index.json');
const progress = json('public/pnp-proof-progress.json');
const updates = json('content/milestone-updates.json');
const names = Object.keys(M230.theorems);
const row = status.formalPublicationMilestones.find(row => row.id === M230.id);
const minimalStatus = () => ({ ...M230.fields, formalPublicationMilestones: [structuredClone(row)] });
const minimalInventory = () => ({ milestoneCandidates: structuredClone(inventory.milestoneCandidates.filter(row => names.includes(row.name))) });
const minimalManifest = () => ({ earnedBoundary: structuredClone(Object.fromEntries(Object.entries(release.earnedBoundary).filter(([key]) =>
  key === 'scope' || key.startsWith('cookLevinCompleteBuilder') || Object.hasOwn(M230.releaseFields, key)))) });
const minimalMap = () => ({ milestones: [structuredClone(row)], earnedMilestoneTheoremKernelTypeSha256:
  Object.fromEntries(Object.entries(M230.theorems).map(([name, evidence]) => [name, evidence.hash])) });

test('M230 contracts accept the exact six compiled theorem pins and four source flags', () => {
  assert.equal(names.length, 6);
  assert.equal(Object.keys(M230.fields).length, 4);
  assertM230Status(status);
  assertM230Inventory(inventory);
  assertM230Manifest(release);
  assertM230PublicationMap(minimalMap());
  for (const [field, value] of Object.entries(M230.fields)) assert.equal(index.claimBoundary[field], value);
  const historicalUpdate = updates.entries.find(entry => entry.milestoneId === M230.id);
  assert.equal(historicalUpdate.source.commit, M230.sourceCommit);
  assert.equal(historicalUpdate.source.tree, M230.sourceTree);
  assert.match(M230.scope, /every ordinary raw bitstring, including empty and odd-length inputs/);
  assert.match(M230.scope, /polynomial in the original input length/);
  assert.match(M230.nonClaim, /not a deterministic SAT algorithm/);
  assert.match(M230.nonClaim, /No global gate closes and P = NP is not proved/);
});

test('M230 rejects absent, duplicate, weakened, moved and assumption-backed declarations', () => {
  for (const name of names) {
    for (const mutate of [
      payload => { payload.milestoneCandidates = payload.milestoneCandidates.filter(row => row.name !== name); },
      payload => { payload.milestoneCandidates.push(structuredClone(payload.milestoneCandidates.find(row => row.name === name))); },
      payload => { payload.milestoneCandidates.find(row => row.name === name).kernelType = 'True'; },
      payload => { payload.milestoneCandidates.find(row => row.name === name).kind = 'axiom'; },
      payload => { payload.milestoneCandidates.find(row => row.name === name).module = 'PNP.Fixture'; },
      payload => { payload.milestoneCandidates.find(row => row.name === name).axioms.push('PNP.ForgedAssumption'); },
      payload => { payload.milestoneCandidates.find(row => row.name === name).axioms = []; },
    ]) {
      const payload = minimalInventory();
      mutate(payload);
      assert.throws(() => assertM230Inventory(payload), /^Error: inventory M230 .* theorem mismatch$/);
    }
  }
  const execution = names.filter(name => !M230.theorems[name].axioms.includes('Classical.choice'));
  assert.equal(execution.length, 4);
  for (const name of execution) {
    const payload = minimalInventory();
    payload.milestoneCandidates.find(row => row.name === name).axioms.unshift('Classical.choice');
    assert.throws(() => assertM230Inventory(payload), /M230/);
  }
});

test('M230 rejects stale builder status and release flags without inventing audit flags', () => {
  for (const key of Object.keys(M230.fields)) {
    for (const invalid of [false, undefined, null]) {
      const payload = minimalStatus();
      payload[key] = invalid;
      assert.throws(() => assertM230Status(payload), /^Error: status M230 .* evidence mismatch$/);
    }
  }
  for (const [key, value] of Object.entries(M230.releaseFields)) {
    for (const invalid of [undefined, null, typeof value === 'boolean' ? !value : 'forged']) {
      const payload = minimalManifest();
      payload.earnedBoundary[key] = invalid;
      assert.throws(() => assertM230Manifest(payload), /^Error: current manifest M230 .* boundary mismatch$/);
    }
  }
});

test('M230 rejects forged milestone claims and exact theorem fingerprints at each boundary', () => {
  for (const field of ['scope', 'nonClaim', 'classification', 'requiredTheorems']) {
    const map = minimalMap();
    map.milestones[0][field] = 'unconditional-complete-proof';
    assert.throws(() => assertM230PublicationMap(map), /^Error: core publication map M230 .* boundary mismatch$/);
    const payload = minimalStatus();
    payload.formalPublicationMilestones[0][field] = 'unconditional-complete-proof';
    assert.throws(() => assertM230Status(payload), /^Error: status M230 .* boundary mismatch$/);
  }
  for (const name of names) {
    const map = minimalMap();
    map.earnedMilestoneTheoremKernelTypeSha256[name] = '0'.repeat(64);
    assert.throws(() => assertM230PublicationMap(map), /^Error: core publication map M230 .* fingerprint mismatch$/);
    const manifest = minimalManifest();
    manifest.earnedBoundary.cookLevinCompleteBuilderTheoremKernelTypeSha256[name] = '0'.repeat(64);
    assert.throws(() => assertM230Manifest(manifest), /^Error: current manifest M230 .* fingerprint mismatch$/);
    const payload = minimalStatus();
    payload.formalPublicationMilestones[0].theoremRows.find(row => row.name === name).actualKernelTypeSha256 = '0'.repeat(64);
    assert.throws(() => assertM230Status(payload), /^Error: status M230 .* theorem mismatch$/);
  }
  for (const field of ['earned', 'allPresent', 'allKernelTypesMatch', 'axiomClosureUsesOnlyLeanStandardAllowlist', 'sourceClosureFingerprintMatches']) {
    const payload = minimalStatus();
    payload.formalPublicationMilestones[0][field] = false;
    assert.throws(() => assertM230Status(payload), /M230/);
  }
  for (const [field, value] of [
    ['scope', 'unrelated'],
    ['cookLevinCompleteBuilderCheckedCompleteTheorem', 'PNP.Main.p_eq_np'],
    ['cookLevinCompleteBuilderExecutionAxiomClosure', ['Classical.choice', 'Quot.sound', 'propext']],
    ['cookLevinCompleteBuilderAxiomClosure', []],
    ['cookLevinCompleteBuilderProjectAxiomClosure', ['PNP.ForgedAssumption']],
  ]) {
    const manifest = minimalManifest();
    manifest.earnedBoundary[field] = value;
    assert.throws(() => assertM230Manifest(manifest), /M230/);
  }
});

test('M230 earns only the fixed complete-builder checkpoint and keeps all global gates open', () => {
  const history = progress.history.find(row => row.asOfCoordinate === M230.coordinate);
  assert.ok(history);
  assert.equal(history.scoreChanged, true);
  assert.deepEqual(history.changedCheckpointIds, ['reductions-complete-cook-levin-builder']);
  assert.equal(history.riskWeightedProofCompletionPercent, 38);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 206, totalRows: 208 });
  assert.equal(history.uncertaintyLowPercent, 20);
  assert.equal(history.uncertaintyHighPercent, 40);
  assert.equal(history.globalGatesClosed, 0);
  assert.equal(history.globalGatesAvailable, 5);
  assert.equal(status.rootLeanTheoremPresent, false);
  assert.deepEqual(status.projectSpecificAxiomInventory, []);
  assert.equal(status.concretePublicationGate.passed, false);
  const previous = progress.history[progress.history.indexOf(history) - 1];
  assert.equal(previous.riskWeightedProofCompletionPercent, 35);
  const update = updates.entries.find(row => row.milestoneId === M230.id);
  assert.equal(update.source.statusCoordinate, history.asOfCoordinate);
  assert.equal(update.progressSnapshot.riskWeightedProofCompletionPercent, history.riskWeightedProofCompletionPercent);
  assert.equal(update.progressSnapshot.formalArtefactCoverageEarnedRows, history.formalArtefactCoverage.earnedRows);
  assert.equal(update.progressSnapshot.formalArtefactCoverageTotalRows, history.formalArtefactCoverage.totalRows);
});

test('current site surfaces separate formula construction, SAT decision and both progress metrics', () => {
  const latest = updates.entries[0];
  for (const file of ['README.md', 'index.html', 'status.html', 'faq.html', 'paper.html', 'architecture.html']) {
    const surface = readFileSync(file, 'utf8');
    assert.ok(surface.includes(`${progress.proofCompletion.percent}%`), file + ': proof estimate');
    assert.ok(surface.includes(`${progress.formalArtefactCoverage.earnedRows} of ${progress.formalArtefactCoverage.totalRows}`), file + ': separate coverage');
    if (latest.milestoneId === M230.id) {
      assert.match(surface, /complete.*Cook-Levin|Complete.*Cook-Levin|complete.*Cook–Levin/i);
      assert.match(surface, /not a deterministic SAT algorithm|does not decide satisfiability/);
    }
  }
  assert.ok(readFileSync('status.html', 'utf8').includes(`data-milestone-id="${M230.id}"`));
  assert.ok(readFileSync('status.html', 'utf8').includes('data-milestone-id="concrete-cook-levin-builder-physical-classifier-all-route-body-remainder-split"'));
});

const currentEditorialFiles = [
  'README.md', 'index.html', 'status.html', 'faq.html', 'paper.html', 'architecture.html',
  'docs/activated_claim_wording.md', 'docs/reviewer_guide.md', 'docs/reproducibility.md',
  'docs/source_checker_map.md', 'docs/proof_pipeline.md',
];
const currentEditorial = () => Object.fromEntries(currentEditorialFiles.map(file => [file, readFileSync(file, 'utf8')]));
function assertM230CurrentEditorial(surfaces) {
  const review = progress.history.find(entry => entry.asOfCoordinate === M230.coordinate);
  const previous = progress.history[progress.history.indexOf(review) - 1];
  const transition = 'raising the risk-weighted estimate from ' +
    previous.riskWeightedProofCompletionPercent + '% to ' + review.riskWeightedProofCompletionPercent + '%';
  for (const file of ['README.md', 'index.html', 'status.html', 'faq.html', 'paper.html', 'architecture.html']) {
    assert.ok(surfaces[file].includes(transition), file + ': current checkpoint transition');
    assert.ok(!surfaces[file].includes('No fixed weighted checkpoint changes, so the risk-weighted estimate remains ' +
      review.riskWeightedProofCompletionPercent + '%'), file + ': contradictory unchanged score');
  }
  const bottom = surfaces['index.html'].split('Current bottom line</div>')[1]?.split('</section>')[0];
  assert.ok(bottom, 'current bottom line section');
  assert.ok(bottom.includes('All-input formula construction is complete'), 'current bottom line builder');
  assert.ok(bottom.includes('SAT decision remains open'), 'current bottom line non-claim');
  const snapshot = surfaces['status.html'].split('class="status-snapshot"')[1]?.split('</section>')[0];
  assert.ok(snapshot?.includes('M230 completes the all-input Cook-Levin formula builder'), 'verified snapshot');
  assert.ok(snapshot.includes('Package the named concrete NP-hardness or NP-completeness transport'), 'next snapshot');
  assert.ok(!snapshot.includes('request synthesis'), 'snapshot must not reopen completed local builder work');
  for (const file of ['index.html', 'status.html']) {
    for (const [field, value] of Object.entries(M230.fields)) {
      assert.ok(surfaces[file].includes(field + ' = ' + JSON.stringify(value)), file + ': current static field ' + field);
    }
  }
  const modules = inventory.sourceClosureModuleCount.toLocaleString('en-US');
  for (const file of ['paper.html', 'architecture.html', 'docs/reviewer_guide.md', 'docs/reproducibility.md']) {
    assert.ok(surfaces[file].includes(modules + ' modules'), file + ': canonical source-module count');
  }
  assert.ok(surfaces['README.md'].includes('across **' + modules + '** modules'));
  assert.ok(surfaces['status.html'].includes('<strong>' + modules + '</strong> modules'));
  assert.ok(surfaces['docs/proof_pipeline.md'].includes(modules + ' source-closure modules'));
  const currentClaim = surfaces['docs/activated_claim_wording.md'].split('The short public statement is:')[1]?.split('## Checker wording')[0];
  assert.ok(currentClaim?.includes('It earns only the fixed complete-builder checkpoint.'), 'current approved claim');
  assert.ok(surfaces['README.md'].includes('Its 6 reviewed theorem pins'));
  assert.ok(!surfaces['README.md'].includes('Its single reviewed theorem pin and audited supporting declarations'));
}

test('M230 current cards and documentation use the earned checkpoint and exact inventory', () => {
  if (updates.entries[0].milestoneId !== M230.id) return;
  assertM230CurrentEditorial(currentEditorial());
  assert.equal(Object.hasOwn(status, 'leanConcreteCookLevinCompleteBuilderAxiomAuditPassed'), false);
});

test('M230 editorial checks reject stale bottom lines, score transitions, snapshots and counts', () => {
  if (updates.entries[0].milestoneId !== M230.id) return;
  const review = progress.history.find(entry => entry.asOfCoordinate === M230.coordinate);
  const previous = progress.history[progress.history.indexOf(review) - 1];
  for (const [file, from, to] of [
    ['index.html', 'leanConcreteCookLevinBuilderDynamicCursorFormalized = true', 'leanConcreteCookLevinBuilderDynamicCursorFormalized = false'],
    ['index.html', 'All-input formula construction is complete', 'The body request is still pending'],
    ['index.html', 'raising the risk-weighted estimate from ' + previous.riskWeightedProofCompletionPercent +
      '% to ' + review.riskWeightedProofCompletionPercent + '%', 'leaving the estimate unchanged'],
    ['status.html', 'M230 completes the all-input Cook-Levin formula builder', 'M230 leaves the builder incomplete'],
    ['docs/proof_pipeline.md', inventory.sourceClosureModuleCount.toLocaleString('en-US') +
      ' source-closure modules', '1 source-closure modules'],
  ]) {
    const fixture = currentEditorial();
    const original = fixture[file];
    fixture[file] = original.replaceAll(from, to);
    assert.ok(fixture[file] !== original, file + ': mutation must change the fixture');
    assert.throws(() => assertM230CurrentEditorial(fixture), assert.AssertionError);
  }
});
