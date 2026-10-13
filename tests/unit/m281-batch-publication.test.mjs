import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import {
  M281_BATCH, M281_BATCH_FIELDS, M281_BATCH_THEOREMS, M281_BATCH_SCOPE_SUFFIX,
  assertM281BatchPublicationMap, assertM281BatchStatus,
  assertM281BatchInventory, assertM281BatchManifest,
  m281BatchManifestBoundary, renderM281BrowserDescriptor,
  assertM281BrowserDescriptor,
} from '../../tools/formal-m281-batch-contract.mjs';

const json = file => JSON.parse(readFileSync(file, 'utf8'));
// An explicit core checkout permits isolated contract feedback before sync.
// Shared current-surface tests separately read the actual site artifacts.
const core = process.env.PNP_SOURCE_DIR;
const status = json(core ? path.join(core, 'status/FORMAL_RECONSTRUCTION_STATUS.json') : 'public/pnp-status.json');
const inventory = json(core ? path.join(core, 'status/LEAN_THEOREM_INVENTORY.json') : 'public/pnp-theorem-inventory.json');
const progress = json(core ? path.join(core, 'status/PROOF_PROGRESS.json') : 'public/pnp-proof-progress.json');
const ids = new Set(M281_BATCH.milestones.map(row => row.id));
const names = Object.keys(M281_BATCH_THEOREMS);
const rows = status.formalPublicationMilestones.filter(row => ids.has(row.id));
const candidates = inventory.milestoneCandidates.filter(row => Object.hasOwn(M281_BATCH_THEOREMS, row.name));
const minimalStatus = () => ({...M281_BATCH_FIELDS, formalPublicationMilestones: rows});
const minimalInventory = () => ({milestoneCandidates: candidates});
const minimalMap = () => ({milestones: rows, earnedMilestoneTheoremKernelTypeSha256:
  Object.fromEntries(names.map(name => [name, M281_BATCH_THEOREMS[name].hash]))});
const minimalManifest = () => ({earnedBoundary: {
  scope: [...ids].join('+plus-'), milestoneBatchM281: m281BatchManifestBoundary(),
}});
const rejection = /^Error: (?:status|inventory|core publication map|current manifest) M\d+ .* mismatch$/;

test('M281 batch contract accepts the exact reviewed complete normalizer', () => {
  assert.deepEqual(M281_BATCH.milestones.map(row => row.number), [281]);
  assert.equal(M281_BATCH.reviewedSource.commit, 'f8270c12d163bdd8457131d42bf6dcd3ccea3a28');
  assert.equal(M281_BATCH.reviewedSource.tree, 'd72c0698e791605c92438a9fd4daf59406a2e75a');
  assert.equal(names.length, 12);
  assert.equal(M281_BATCH_SCOPE_SUFFIX, "+plus-complete-serialized-source-normalizer");
  assert.equal(Object.keys(M281_BATCH_FIELDS).length, 31);
  assert.ok(Object.isFrozen(M281_BATCH.milestones[0].theorems));
  assertM281BatchStatus(status);
  assertM281BatchInventory(inventory);
  assertM281BatchPublicationMap(minimalMap());
  if (core) assertM281BatchPublicationMap(json(path.join(core, 'publication/FORMAL_PUBLICATION_MAP.json')));
  assertM281BatchManifest(minimalManifest());
});

test('M281 batch contract rejects every absent, stale or wrong-type status field', () => {
  for (const [key, value] of Object.entries(M281_BATCH_FIELDS)) {
    const wrong = typeof value === 'boolean' ? !value : typeof value === 'number' ? value + 1 : 'forged';
    for (const invalid of [undefined, null, wrong, {supplied: value}]) {
      if (JSON.stringify(value) === JSON.stringify(invalid)) continue;
      assert.throws(() => assertM281BatchStatus({...minimalStatus(), [key]: invalid}), rejection, key);
    }
  }
});

test('M281 batch contract rejects missing, duplicate and altered milestone rows', () => {
  for (const row of rows) {
    assert.throws(() => assertM281BatchStatus({...minimalStatus(),
      formalPublicationMilestones: rows.filter(other => other.id !== row.id)}), rejection);
    assert.throws(() => assertM281BatchStatus({...minimalStatus(), formalPublicationMilestones: [...rows, row]}), rejection);
    for (const key of ['title', 'classification', 'scope', 'nonClaim', 'requiredTheorems']) {
      const changed = {...row, [key]: 'unconditional-complete-proof'};
      const altered = rows.map(other => other.id === row.id ? changed : other);
      assert.throws(() => assertM281BatchStatus({...minimalStatus(), formalPublicationMilestones: altered}), rejection);
      assert.throws(() => assertM281BatchPublicationMap({...minimalMap(), milestones: altered}), rejection);
    }
    for (const [key, value] of Object.entries(M281_BATCH.milestones.find(item => item.id === row.id).verification)) {
      const changed = {...row, [key]: typeof value === 'boolean' ? !value : 'forged'};
      assert.throws(() => assertM281BatchStatus({...minimalStatus(),
        formalPublicationMilestones: rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M281 batch contract rejects absent, duplicated, moved and assumed declarations', () => {
  for (const row of candidates) {
    const without = candidates.filter(other => other.name !== row.name);
    assert.throws(() => assertM281BatchInventory({milestoneCandidates: without}), rejection, row.name);
    assert.throws(() => assertM281BatchInventory({milestoneCandidates: [...candidates, row]}), rejection, row.name);
    for (const changed of [
      {...row, kind:'axiom'}, {...row, module:'PNP.Fixture'},
      {...row, axioms:[...row.axioms, 'PNP.ForgedAssumption']},
      {...row, axioms:row.axioms.length ? [] : ['propext']},
      {...row, kernelType:null},
    ]) assert.throws(() => assertM281BatchInventory({milestoneCandidates:
      candidates.map(other => other.name === row.name ? changed : other)}), rejection, row.name);
  }
});

test('M281 batch contract hashes raw kernel types for every milestone', () => {
  for (const milestone of M281_BATCH.milestones) {
    const name = Object.keys(milestone.theorems).at(-1);
    const row = candidates.find(candidate => candidate.name === name);
    for (const kernelType of ['True', row.kernelType + ' suppliedCorrectness']) {
      assert.throws(() => assertM281BatchInventory({milestoneCandidates:
        candidates.map(other => other.name === name ? {...row, kernelType} : other)}), rejection);
    }
  }
});

test('M281 batch contract rejects forged publication and status fingerprints', () => {
  for (const name of names) {
    const map = minimalMap();
    map.earnedMilestoneTheoremKernelTypeSha256[name] = '0'.repeat(64);
    assert.throws(() => assertM281BatchPublicationMap(map), rejection);
  }
  for (const row of rows) for (const proof of row.theoremRows) {
    for (const invalid of [
      {...proof, present:false}, {...proof, kind:'axiom'},
      {...proof, actualKernelTypeSha256:'0'.repeat(64)},
      {...proof, expectedKernelTypeSha256:'0'.repeat(64)},
      {...proof, axioms:[...proof.axioms, 'PNP.ForgedAssumption']},
    ]) {
      const changed = {...row, theoremRows:row.theoremRows.map(other => other.name === proof.name ? invalid : other)};
      assert.throws(() => assertM281BatchStatus({...minimalStatus(),
        formalPublicationMilestones:rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M281 batch contract binds every release field and theorem to the reviewed batch', () => {
  for (const milestone of M281_BATCH.milestones) {
    const manifest = minimalManifest();
    const row = manifest.earnedBoundary.milestoneBatchM281.milestones.find(row => row.id === milestone.id);
    const field = Object.keys(row.fields)[0];
    row.fields[field] = 'forged';
    assert.throws(() => assertM281BatchManifest(manifest), rejection);
    const dropped = minimalManifest();
    dropped.earnedBoundary.scope = [...ids].filter(id => id !== milestone.id).join('+plus-');
    assert.throws(() => assertM281BatchManifest(dropped), rejection);
    for (const kind of ['theoremKernelTypeSha256', 'theoremAxioms']) {
      const changed = minimalManifest();
      const target = changed.earnedBoundary.milestoneBatchM281.milestones.find(row => row.id === milestone.id);
      target[kind][Object.keys(target[kind])[0]] = 'forged';
      assert.throws(() => assertM281BatchManifest(changed), rejection);
    }
  }
  const stale = minimalManifest();
  stale.earnedBoundary.milestoneBatchM281.reviewedSource.commit = '0'.repeat(40);
  assert.throws(() => assertM281BatchManifest(stale), rejection);
});

test('M281 batch contract generates the exact same metadata validators for the browser', () => {
  const descriptor = renderM281BrowserDescriptor();
  assertM281BrowserDescriptor(descriptor);
  assert.throws(() => assertM281BrowserDescriptor(descriptor + '\n' + descriptor), /browser M281/);
  assert.throws(() => assertM281BrowserDescriptor(descriptor.replace(M281_BATCH.reviewedSource.commit, '0'.repeat(40))), /browser M281/);
  const context = vm.createContext({});
  vm.runInContext(descriptor + '\nglobalThis.checks = FORMAL_M281_VALIDATORS;', context);
  context.checks.status(minimalStatus());
  context.checks.inventory(minimalInventory());
  for (const milestone of M281_BATCH.milestones) {
    const key = Object.keys(milestone.fields)[0];
    assert.throws(() => context.checks.status({...minimalStatus(), [key]:undefined}), rejection);
    const name = Object.keys(milestone.theorems)[0];
    assert.throws(() => context.checks.inventory({milestoneCandidates:
      candidates.filter(row => row.name !== name)}), rejection);
  }
});


test('M281 batch contract preserves independent historical progress reviews', () => {
  for (const milestone of M281_BATCH.milestones) {
    const review = progress.history.find(row => row.asOfCoordinate === milestone.coordinate);
    assert.ok(review, milestone.coordinate);
    assert.equal(review.scoreChanged, false);
    assert.deepEqual(review.changedCheckpointIds, []);
    assert.equal(review.riskWeightedProofCompletionPercent, 40);
    assert.equal(review.globalGatesClosed, 0);
    assert.equal(review.uncertaintyLowPercent, 20);
    assert.equal(review.uncertaintyHighPercent, 40);
  }
  const latest = progress.history.find(row => row.asOfCoordinate === M281_BATCH.reviewedSource.statusCoordinate);
  assert.deepEqual(latest.formalArtefactCoverage, {earnedRows:257,totalRows:259});
});

test('M281 batch contract is wired alongside every retained batch', () => {
  for (const [file,kinds] of [
    ['tools/sync-public-access-docs.mjs',['PublicationMap','Status','Inventory']],
    ['tools/verify-release-seal.mjs',['Status','Inventory','Manifest']],
    ['tools/check-cross-repo-targets.mjs',['PublicationMap','Status','Inventory','Manifest']],
  ]) {
    const source = readFileSync(file,'utf8');
    for (const batch of [258,262,264,280,281]) {
      assert.ok(source.includes("from './formal-m" + batch + "-batch-contract.mjs'"),file);
      for (const kind of kinds) assert.match(source,new RegExp('assertM' + batch + 'Batch' + kind + '\\(\\w+\\);'),file);
    }
    if (kinds.includes('Manifest')) assert.equal(source.split(' + M258_BATCH_SCOPE_SUFFIX + M262_BATCH_SCOPE_SUFFIX + M264_BATCH_SCOPE_SUFFIX + M280_BATCH_SCOPE_SUFFIX + M281_BATCH_SCOPE_SUFFIX)').length - 1,6,file);
  }
  const browser = readFileSync('assets/main.js','utf8');
  assertM281BrowserDescriptor(browser);
  for (const kind of ['inventory','status']) assert.ok(browser.includes('try { FORMAL_M281_VALIDATORS.' + kind + '(' + kind + '); } catch { return false; }'));
  assert.ok(browser.includes('[FORMAL_M232_M258_BATCH, FORMAL_M259_M262_BATCH, FORMAL_M263_M264_BATCH, FORMAL_M265_M280_BATCH, FORMAL_M281_BATCH].flatMap(batch => batch.milestones)'));
});
