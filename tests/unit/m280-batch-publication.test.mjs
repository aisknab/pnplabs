import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {deriveBatchMilestoneFields, readMilestoneReleaseField, setMilestoneReleaseField, assertCanonicalStaticMilestoneCards, decodePublishedHtml, readBrowserInventoryCounts} from '../helpers/publication-status-fields.mjs';
import {
  M280_BATCH, M280_BATCH_FIELDS, M280_BATCH_THEOREMS, M280_BATCH_SCOPE_SUFFIX,
  assertM280BatchPublicationMap, assertM280BatchStatus,
  assertM280BatchInventory, assertM280BatchManifest,
  m280BatchManifestBoundary, renderM280BrowserDescriptor,
  assertM280BrowserDescriptor,
} from '../../tools/formal-m280-batch-contract.mjs';

const json = file => JSON.parse(readFileSync(file, 'utf8'));
// An explicit core checkout permits isolated contract feedback before sync.
// The active-mirror test below always reads the actual site artifacts.
const core = process.env.PNP_SOURCE_DIR;
const status = json(core ? path.join(core, 'status/FORMAL_RECONSTRUCTION_STATUS.json') : 'public/pnp-status.json');
const inventory = json(core ? path.join(core, 'status/LEAN_THEOREM_INVENTORY.json') : 'public/pnp-theorem-inventory.json');
const progress = json(core ? path.join(core, 'status/PROOF_PROGRESS.json') : 'public/pnp-proof-progress.json');
const ids = new Set(M280_BATCH.milestones.map(row => row.id));
const names = Object.keys(M280_BATCH_THEOREMS);
const rows = status.formalPublicationMilestones.filter(row => ids.has(row.id));
const candidates = inventory.milestoneCandidates.filter(row => Object.hasOwn(M280_BATCH_THEOREMS, row.name));
const minimalStatus = () => ({...M280_BATCH_FIELDS, formalPublicationMilestones: rows});
const minimalInventory = () => ({milestoneCandidates: candidates});
const minimalMap = () => ({milestones: rows, earnedMilestoneTheoremKernelTypeSha256:
  Object.fromEntries(names.map(name => [name, M280_BATCH_THEOREMS[name].hash]))});
const minimalManifest = () => ({earnedBoundary: {
  scope: [...ids].join('+plus-'), milestoneBatchM265M280: m280BatchManifestBoundary(),
}});
const rejection = /^Error: (?:status|inventory|core publication map|current manifest) M\d+ .* mismatch$/;

test('M280 batch contract accepts the exact reviewed 16-row compiled batch', () => {
  assert.deepEqual(M280_BATCH.milestones.map(row => row.number), Array.from({length:16}, (_, i) => 265 + i));
  assert.equal(M280_BATCH.reviewedSource.commit, 'f14cb7a87004ebedfa55351f6ba20d68a333cc18');
  assert.equal(M280_BATCH.reviewedSource.tree, '1cbaf64d8a7303b154848ec73f38e85e406defca');
  assert.equal(names.length, 828);
  assert.equal(Object.keys(M280_BATCH_FIELDS).length, 697);
  assert.ok(Object.isFrozen(M280_BATCH.milestones[0].theorems));
  assertM280BatchStatus(status);
  assertM280BatchInventory(inventory);
  assertM280BatchPublicationMap(minimalMap());
  if (core) assertM280BatchPublicationMap(json(path.join(core, 'publication/FORMAL_PUBLICATION_MAP.json')));
  assertM280BatchManifest(minimalManifest());
});

test('M280 batch contract rejects every absent, stale or wrong-type status field', () => {
  for (const [key, value] of Object.entries(M280_BATCH_FIELDS)) {
    const wrong = typeof value === 'boolean' ? !value : typeof value === 'number' ? value + 1 : 'forged';
    for (const invalid of [undefined, null, wrong, {supplied: value}]) {
      if (JSON.stringify(value) === JSON.stringify(invalid)) continue;
      assert.throws(() => assertM280BatchStatus({...minimalStatus(), [key]: invalid}), rejection, key);
    }
  }
});

test('M280 batch contract rejects missing, duplicate and altered milestone rows', () => {
  for (const row of rows) {
    assert.throws(() => assertM280BatchStatus({...minimalStatus(),
      formalPublicationMilestones: rows.filter(other => other.id !== row.id)}), rejection);
    assert.throws(() => assertM280BatchStatus({...minimalStatus(), formalPublicationMilestones: [...rows, row]}), rejection);
    for (const key of ['title', 'classification', 'scope', 'nonClaim', 'requiredTheorems']) {
      const changed = {...row, [key]: 'unconditional-complete-proof'};
      const altered = rows.map(other => other.id === row.id ? changed : other);
      assert.throws(() => assertM280BatchStatus({...minimalStatus(), formalPublicationMilestones: altered}), rejection);
      assert.throws(() => assertM280BatchPublicationMap({...minimalMap(), milestones: altered}), rejection);
    }
    for (const [key, value] of Object.entries(M280_BATCH.milestones.find(item => item.id === row.id).verification)) {
      const changed = {...row, [key]: typeof value === 'boolean' ? !value : 'forged'};
      assert.throws(() => assertM280BatchStatus({...minimalStatus(),
        formalPublicationMilestones: rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M280 batch contract rejects absent, duplicated, moved and assumed declarations', () => {
  for (const row of candidates) {
    const without = candidates.filter(other => other.name !== row.name);
    assert.throws(() => assertM280BatchInventory({milestoneCandidates: without}), rejection, row.name);
    assert.throws(() => assertM280BatchInventory({milestoneCandidates: [...candidates, row]}), rejection, row.name);
    for (const changed of [
      {...row, kind:'axiom'}, {...row, module:'PNP.Fixture'},
      {...row, axioms:[...row.axioms, 'PNP.ForgedAssumption']},
      {...row, axioms:row.axioms.length ? [] : ['propext']},
      {...row, kernelType:null},
    ]) assert.throws(() => assertM280BatchInventory({milestoneCandidates:
      candidates.map(other => other.name === row.name ? changed : other)}), rejection, row.name);
  }
});

test('M280 batch contract hashes raw kernel types for every milestone', () => {
  for (const milestone of M280_BATCH.milestones) {
    const name = Object.keys(milestone.theorems).at(-1);
    const row = candidates.find(candidate => candidate.name === name);
    for (const kernelType of ['True', row.kernelType + ' suppliedCorrectness']) {
      assert.throws(() => assertM280BatchInventory({milestoneCandidates:
        candidates.map(other => other.name === name ? {...row, kernelType} : other)}), rejection);
    }
  }
});

test('M280 batch contract rejects forged publication and status fingerprints', () => {
  for (const name of names) {
    const map = minimalMap();
    map.earnedMilestoneTheoremKernelTypeSha256[name] = '0'.repeat(64);
    assert.throws(() => assertM280BatchPublicationMap(map), rejection);
  }
  for (const row of rows) for (const proof of row.theoremRows) {
    for (const invalid of [
      {...proof, present:false}, {...proof, kind:'axiom'},
      {...proof, actualKernelTypeSha256:'0'.repeat(64)},
      {...proof, expectedKernelTypeSha256:'0'.repeat(64)},
      {...proof, axioms:[...proof.axioms, 'PNP.ForgedAssumption']},
    ]) {
      const changed = {...row, theoremRows:row.theoremRows.map(other => other.name === proof.name ? invalid : other)};
      assert.throws(() => assertM280BatchStatus({...minimalStatus(),
        formalPublicationMilestones:rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M280 batch contract binds every release field and theorem to the reviewed batch', () => {
  for (const milestone of M280_BATCH.milestones) {
    const manifest = minimalManifest();
    const row = manifest.earnedBoundary.milestoneBatchM265M280.milestones.find(row => row.id === milestone.id);
    const field = Object.keys(row.fields)[0];
    row.fields[field] = 'forged';
    assert.throws(() => assertM280BatchManifest(manifest), rejection);
    const dropped = minimalManifest();
    dropped.earnedBoundary.scope = [...ids].filter(id => id !== milestone.id).join('+plus-');
    assert.throws(() => assertM280BatchManifest(dropped), rejection);
    for (const kind of ['theoremKernelTypeSha256', 'theoremAxioms']) {
      const changed = minimalManifest();
      const target = changed.earnedBoundary.milestoneBatchM265M280.milestones.find(row => row.id === milestone.id);
      target[kind][Object.keys(target[kind])[0]] = 'forged';
      assert.throws(() => assertM280BatchManifest(changed), rejection);
    }
  }
  const stale = minimalManifest();
  stale.earnedBoundary.milestoneBatchM265M280.reviewedSource.commit = '0'.repeat(40);
  assert.throws(() => assertM280BatchManifest(stale), rejection);
});

test('M280 batch contract generates the exact same metadata validators for the browser', () => {
  const descriptor = renderM280BrowserDescriptor();
  assertM280BrowserDescriptor(descriptor);
  assert.throws(() => assertM280BrowserDescriptor(descriptor + '\n' + descriptor), /browser M280/);
  assert.throws(() => assertM280BrowserDescriptor(descriptor.replace(M280_BATCH.reviewedSource.commit, '0'.repeat(40))), /browser M280/);
  const context = vm.createContext({});
  vm.runInContext(descriptor + '\nglobalThis.checks = FORMAL_M265_M280_VALIDATORS;', context);
  context.checks.status(minimalStatus());
  context.checks.inventory(minimalInventory());
  for (const milestone of M280_BATCH.milestones) {
    const key = Object.keys(milestone.fields)[0];
    assert.throws(() => context.checks.status({...minimalStatus(), [key]:undefined}), rejection);
    const name = Object.keys(milestone.theorems)[0];
    assert.throws(() => context.checks.inventory({milestoneCandidates:
      candidates.filter(row => row.name !== name)}), rejection);
  }
});


test('M280 batch contract preserves independent historical progress reviews', () => {
  for (const milestone of M280_BATCH.milestones) {
    const review = progress.history.find(row => row.asOfCoordinate === milestone.coordinate);
    assert.ok(review, milestone.coordinate);
    assert.equal(review.scoreChanged, false);
    assert.deepEqual(review.changedCheckpointIds, []);
    assert.equal(review.riskWeightedProofCompletionPercent, 40);
    assert.equal(review.globalGatesClosed, 0);
    assert.equal(review.uncertaintyLowPercent, 20);
    assert.equal(review.uncertaintyHighPercent, 40);
  }
  const latest = progress.history.find(row => row.asOfCoordinate === M280_BATCH.reviewedSource.statusCoordinate);
  assert.deepEqual(latest.formalArtefactCoverage, {earnedRows:256,totalRows:258});
});

test('M280 batch contract is wired alongside every retained batch', () => {
  for (const [file,kinds] of [
    ['tools/sync-public-access-docs.mjs',['PublicationMap','Status','Inventory']],
    ['tools/verify-release-seal.mjs',['Status','Inventory','Manifest']],
    ['tools/check-cross-repo-targets.mjs',['PublicationMap','Status','Inventory','Manifest']],
  ]) {
    const source = readFileSync(file,'utf8');
    for (const batch of [258,262,264,280]) {
      assert.ok(source.includes("from './formal-m" + batch + "-batch-contract.mjs'"),file);
      for (const kind of kinds) assert.match(source,new RegExp('assertM' + batch + 'Batch' + kind + '\\(\\w+\\);'),file);
    }
    if (kinds.includes('Manifest')) assert.equal(source.split(' + M258_BATCH_SCOPE_SUFFIX + M262_BATCH_SCOPE_SUFFIX + M264_BATCH_SCOPE_SUFFIX + M280_BATCH_SCOPE_SUFFIX)').length - 1,6,file);
  }
  const browser = readFileSync('assets/main.js','utf8');
  assertM280BrowserDescriptor(browser);
  for (const kind of ['inventory','status']) assert.ok(browser.includes('try { FORMAL_M265_M280_VALIDATORS.' + kind + '(' + kind + '); } catch { return false; }'));
  assert.ok(browser.includes('[FORMAL_M232_M258_BATCH, FORMAL_M259_M262_BATCH, FORMAL_M263_M264_BATCH, FORMAL_M265_M280_BATCH].flatMap(batch => batch.milestones)'));
});

test('M280 current mirrors bind the latest reviewed source and separate progress fields', () => {
  const publishedStatus = json('public/pnp-status.json');
  const publishedInventory = json('public/pnp-theorem-inventory.json');
  const publishedProgress = json('public/pnp-proof-progress.json');
  const release = json('downloads/formal-publication-release.json');
  const index = json('public/pnp-index.json');
  assertM280BatchStatus(publishedStatus);
  assertM280BatchInventory(publishedInventory);
  assertM280BatchManifest(release);
  const latest = Object.values(release.earnedBoundary).filter(row => row?.kind === 'PNPLabsCompiledMilestoneBatch0')
    .sort((a,b) => Math.max(...a.milestones.map(row => row.number)) - Math.max(...b.milestones.map(row => row.number))).at(-1);
  assert.equal(release.source.commit,latest.reviewedSource.commit);
  assert.equal(release.source.tree,latest.reviewedSource.tree);
  assert.equal(publishedStatus.coordinate,latest.reviewedSource.statusCoordinate);
  assert.equal(publishedProgress.asOfCoordinate,publishedStatus.coordinate);
  assert.equal(index.sourceCommitRef,release.source.commit);
  assert.equal(index.sourceTree,release.source.tree);
  assert.equal(index.formalArtefactCoverageEarnedRows,publishedProgress.formalArtefactCoverage.earnedRows);
  assert.equal(index.formalArtefactCoverageTotalRows,publishedProgress.formalArtefactCoverage.totalRows);
  assert.equal(index.proofProgressPointsEarned,publishedProgress.proofCompletion.pointsEarned);
  for (const [field,value] of Object.entries(M280_BATCH_FIELDS)) assert.deepEqual(index.claimBoundary[field],value,field);
});

test('M280 publication preserves every earlier update and each milestone scoring coordinate', () => {
  const updates = json('content/milestone-updates.json');
  const entries = updates.entries.filter(entry => ids.has(entry.milestoneId));
  assert.deepEqual(entries.map(entry => entry.milestoneId),M280_BATCH.milestones.toReversed().map(row => row.id));
  assert.equal(new Set(entries.map(entry => entry.publishedAt)).size,1);
  for (const entry of entries) {
    const milestone = M280_BATCH.milestones.find(row => row.id === entry.milestoneId);
    const review = progress.history.find(row => row.asOfCoordinate === milestone.coordinate);
    assert.deepEqual(entry.source,{...M280_BATCH.reviewedSource,statusCoordinate:milestone.coordinate,
      publicationCoordinate:json('public/pnp-index.json').publicSurfaceBaselineCoordinate});
    assert.deepEqual(entry.progressSnapshot,{modelId:progress.modelId,
      formalArtefactCoverageEarnedRows:review.formalArtefactCoverage.earnedRows,
      formalArtefactCoverageTotalRows:review.formalArtefactCoverage.totalRows,
      riskWeightedProofCompletionPercent:review.riskWeightedProofCompletionPercent,
      uncertaintyLowPercent:review.uncertaintyLowPercent,uncertaintyHighPercent:review.uncertaintyHighPercent,
      globalGatesClosed:review.globalGatesClosed,globalGatesAvailable:review.globalGatesAvailable});
    assert.equal(entry.plainLanguage.length,2);
  }
  const earlier = updates.entries.slice(updates.entries.findLastIndex(entry => ids.has(entry.milestoneId)) + 1);
  assert.equal(createHash('sha256').update(JSON.stringify(earlier)).digest('hex'),"92f6e90de613f476c2e55dcbee6154b07d9de7ced26c64cc607782e49426146f");
});

test('M280 complete browser boundary accepts current evidence and rejects new status and theorem mutations', () => {
  const source = readFileSync('assets/main.js','utf8');
  const validationSource = source.slice(source.indexOf('const STATUS_COORDINATE'),source.indexOf('function renderFormalStatus'));
  const context = vm.createContext({structuredClone});
  new vm.Script(validationSource+'\nglobalThis.validation={validateInventory,validateMilestones,validateConcreteGate,validateStatus};').runInContext(context);
  const checks = context.validation;
  const currentStatus = json('public/pnp-status.json');
  const currentInventory = json('public/pnp-theorem-inventory.json');
  assert.equal(checks.validateInventory(currentInventory),true,'positive current inventory');
  assert.equal(checks.validateMilestones(currentStatus,currentInventory),true);
  assert.equal(checks.validateConcreteGate(currentStatus,currentInventory),true);
  assert.equal(checks.validateStatus(currentStatus,currentInventory),true);
  for (const milestone of M280_BATCH.milestones) {
    const key = Object.keys(milestone.fields).find(key=>key.endsWith('Formalized'));
    const original = currentStatus[key];
    try {
      currentStatus[key]=false;
      assert.equal(checks.validateStatus(currentStatus,currentInventory),false,key);
    } finally { currentStatus[key]=original; }
    const name = Object.keys(milestone.theorems)[0];
    const row = currentInventory.milestoneCandidates.find(row=>row.name===name);
    const originalAxioms = row.axioms;
    try {
      row.axioms=[...originalAxioms,'PNP.ForgedAssumption'];
      assert.equal(checks.validateInventory(currentInventory),false,name);
    } finally { row.axioms=originalAxioms; }
  }
  assert.equal(checks.validateInventory(currentInventory),true,'restored exact inventory');
  assert.equal(checks.validateStatus(currentStatus,currentInventory),true,'restored exact status');
});

test('M280 current primary surfaces expose the restricted result and separate correction', () => {
  const updates = json('content/milestone-updates.json'), latest = updates.entries[0];
  const correction = updates.corrections.find(row => row.id === 'unrestricted-compatible-support-slack-correction');
  const progress = json('public/pnp-proof-progress.json');
  assert.ok(correction);
  for (const file of ['index.html','status.html','faq.html','paper.html','architecture.html']) {
    const html = readFileSync(file,'utf8');
    const summary = decodePublishedHtml(html.match(/<section class="section compact" data-m280-publication-summary>[\s\S]*?<\/section>/)?.[0] ?? '');
    assert.ok(summary,file + ': current summary');
    for (const paragraph of [...latest.plainLanguage,...correction.plainLanguage]) assert.ok(summary.includes(paragraph),file + ': reviewed copy');
    for (const id of [latest.id,correction.id]) assert.ok(summary.includes('updates.html#'+id),file + ': current record');
    assert.ok(summary.includes('Formal artefact coverage: '+progress.formalArtefactCoverage.earnedRows+' of '+progress.formalArtefactCoverage.totalRows));
    assert.ok(summary.includes('estimate: '+progress.proofCompletion.percent+'%'));
    assert.ok(summary.includes('uncertainty '+progress.proofCompletion.uncertaintyLowPercent+'% to '+progress.proofCompletion.uncertaintyHighPercent+'%'));
    assert.ok(summary.includes('Global gates closed: '+progress.globalGates.filter(row=>row.status==='closed').length+' of '+progress.globalGates.length));
    assert.ok(summary.includes('This correction adds no earned positive publication row or fixed checkpoint credit.'));
    assert.ok(summary.includes('This is not a globally successful rewrite strategy or a theorem of total polynomial runtime.'));
    assert.ok(summary.includes('PNP.Main.p_eq_np remains absent and the publication gate is false.'));
    assert.doesNotMatch(html,/data-m(?:258|262|264)-publication-summary/);
  }
  const bottom = decodePublishedHtml(readFileSync('index.html','utf8').match(/<section class="section compact" data-current-milestone="[^"]+">[\s\S]*?<\/section>/)?.[0] ?? '');
  assert.ok(bottom.includes('data-current-milestone="'+latest.milestoneId+'"'));
  for (const paragraph of [...latest.plainLanguage,...correction.plainLanguage]) assert.ok(bottom.includes(paragraph));
  const faq = decodePublishedHtml(readFileSync('faq.html','utf8'));
  for (const text of [M280_BATCH.milestones.at(-1).scope,M280_BATCH.milestones.at(-1).nonClaim]) assert.ok(faq.includes(text));
  const classifier=decodePublishedHtml(readFileSync('architecture.html','utf8').match(/<article class="card"><h3>Scoped milestone classifier<\/h3>[\s\S]*?<\/article>/)?.[0] ?? '');
  assert.ok(classifier.includes(progress.formalArtefactCoverage.earnedRows+' of '+progress.formalArtefactCoverage.totalRows+' scoped rows'));
  for (const paragraph of latest.plainLanguage) assert.ok(classifier.includes(paragraph));
  const paper=readFileSync('paper.html','utf8');
  assert.ok(paper.includes(progress.formalArtefactCoverage.earnedRows+' earned scoped milestones; '+(progress.formalArtefactCoverage.totalRows-progress.formalArtefactCoverage.earnedRows)+' missing global milestones'));
  for (const [file,heading] of [['status.html','Current formal report'],['paper.html','Earned scoped results']]) {
    const card=decodePublishedHtml(readFileSync(file,'utf8').split('\n').find(line=>line.includes('<h3>'+heading+'</h3>')) ?? '');
    for (const paragraph of latest.plainLanguage) assert.ok(card.includes(paragraph),file+': current report summary');
  }
});

test('M280 current static fields and complete ledger follow the canonical evidence', () => {
  const currentStatus=json('public/pnp-status.json'), currentInventory=json('public/pnp-theorem-inventory.json');
  for (const file of ['index.html','status.html']) {
    const html=readFileSync(file,'utf8');
    const fields=decodePublishedHtml(html.match(/<pre data-formal-status-fields>([\s\S]*?)<\/pre>/)?.[1] ?? '');
    for (const [key,value] of Object.entries(M280_BATCH_FIELDS)) assert.ok(fields.includes(key+' = '+JSON.stringify(value)),file+': '+key);
    assert.ok(fields.includes('concretePublicationGate.passed = false'));
    assert.ok(html.includes(json('downloads/formal-publication-release.json').artifacts.theoremInventory.sha256));
  }
  const html=readFileSync('status.html','utf8');
  assertCanonicalStaticMilestoneCards(html,currentStatus);
  const counts=html.match(/<p data-formal-inventory-counts>([\s\S]*?)<\/p>/)?.[1] ?? '';
  const keys=['declarationCount','theoremCount','assumptionFreeTheoremCount','excludedPrivateDeclarationCount','sourceClosureModuleCount','axiomCount'];
  for (const key of keys) assert.ok(counts.includes('<strong>'+currentInventory[key].toLocaleString('en-AU')+'</strong>'),key);
  assert.deepEqual(readBrowserInventoryCounts(readFileSync('assets/main.js','utf8')),
    {declarations:currentInventory.declarationCount,theorems:currentInventory.theoremCount,
      assumptionFreeTheorems:currentInventory.assumptionFreeTheoremCount,
      excludedPrivateDeclarations:currentInventory.excludedPrivateDeclarationCount,
      modules:currentInventory.sourceClosureModuleCount,axioms:currentInventory.axiomCount});
});

test('M280 current documentation keeps the correction distinct from earned progress', () => {
  const updates=json('content/milestone-updates.json'), latest=updates.entries[0];
  const correction=updates.corrections.find(row=>row.id==='unrestricted-compatible-support-slack-correction');
  for (const file of ['docs/activated_claim_wording.md','docs/audit_questions.md','docs/one_command_verify_upload.md','docs/proof_pipeline.md','docs/reproducibility.md','docs/reviewer_guide.md','docs/source_checker_map.md','docs/trust_model.md']) {
    const block=readFileSync(file,'utf8').split('<!-- CURRENT_PUBLICATION:START -->')[1]?.split('<!-- CURRENT_PUBLICATION:END -->')[0] ?? '';
    for (const value of [latest.title,...latest.plainLanguage,...correction.plainLanguage,latest.source.commit,latest.source.tree,latest.source.statusCoordinate])
      assert.ok(block.includes(value),file+': current reviewed source and copy');
    assert.ok(block.includes('This correction adds no earned positive publication row or fixed checkpoint credit.'));
    assert.ok(block.includes('changes no fixed weighted checkpoint'));
    assert.doesNotMatch(block,/M264 current publication|\b\d+[- ]pages?\b/);
  }
  const readme=readFileSync('README.md','utf8');
  assert.ok(readme.includes('## M280 current publication'));
  for (const paragraph of [...latest.plainLanguage,...correction.plainLanguage]) assert.ok(readme.includes(paragraph));
  assert.ok(readme.includes(json('public/pnp-proof-progress.json').asOfCoordinate));
});
