import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {deriveBatchMilestoneFields, readMilestoneReleaseField, setMilestoneReleaseField, assertCanonicalStaticMilestoneCards, decodePublishedHtml, readBrowserInventoryCounts} from '../helpers/publication-status-fields.mjs';
import {
  M264_BATCH, M264_BATCH_FIELDS, M264_BATCH_THEOREMS, M264_BATCH_SCOPE_SUFFIX,
  assertM264BatchPublicationMap, assertM264BatchStatus,
  assertM264BatchInventory, assertM264BatchManifest,
  m264BatchManifestBoundary, renderM264BrowserDescriptor,
  assertM264BrowserDescriptor,
} from '../../tools/formal-m264-batch-contract.mjs';

const json = file => JSON.parse(readFileSync(file, 'utf8'));
// An explicit core checkout permits isolated contract feedback before sync.
// The active-mirror test below always reads the actual site artifacts.
const core = process.env.PNP_SOURCE_DIR;
const status = json(core ? path.join(core, 'status/FORMAL_RECONSTRUCTION_STATUS.json') : 'public/pnp-status.json');
const inventory = json(core ? path.join(core, 'status/LEAN_THEOREM_INVENTORY.json') : 'public/pnp-theorem-inventory.json');
const progress = json(core ? path.join(core, 'status/PROOF_PROGRESS.json') : 'public/pnp-proof-progress.json');
const ids = new Set(M264_BATCH.milestones.map(row => row.id));
const names = Object.keys(M264_BATCH_THEOREMS);
const rows = status.formalPublicationMilestones.filter(row => ids.has(row.id));
const candidates = inventory.milestoneCandidates.filter(row => Object.hasOwn(M264_BATCH_THEOREMS, row.name));
const minimalStatus = () => ({...M264_BATCH_FIELDS, formalPublicationMilestones: rows});
const minimalInventory = () => ({milestoneCandidates: candidates});
const minimalMap = () => ({milestones: rows, earnedMilestoneTheoremKernelTypeSha256:
  Object.fromEntries(names.map(name => [name, M264_BATCH_THEOREMS[name].hash]))});
const minimalManifest = () => ({earnedBoundary: {
  scope: [...ids].join('+plus-'), milestoneBatchM263M264: m264BatchManifestBoundary(),
}});
const rejection = /^Error: (?:status|inventory|core publication map|current manifest) M\d+ .* mismatch$/;

test('M264 batch contract accepts the exact reviewed 2-row compiled batch', () => {
  assert.deepEqual(M264_BATCH.milestones.map(row => row.number), Array.from({length:2}, (_, i) => 263 + i));
  assert.equal(M264_BATCH.reviewedSource.commit, '029153fc5d8bfc84c61d33858d0472bcbf3d3a73');
  assert.equal(M264_BATCH.reviewedSource.tree, 'd725f0e14d1a4625c0ce991364fa4481ef3c032a');
  assert.equal(names.length, 70);
  assert.equal(Object.keys(M264_BATCH_FIELDS).length, 108);
  assert.ok(Object.isFrozen(M264_BATCH.milestones[0].theorems));
  assertM264BatchStatus(status);
  assertM264BatchInventory(inventory);
  assertM264BatchPublicationMap(minimalMap());
  if (core) assertM264BatchPublicationMap(json(path.join(core, 'publication/FORMAL_PUBLICATION_MAP.json')));
  assertM264BatchManifest(minimalManifest());
});

test('M264 batch contract rejects every absent, stale or wrong-type status field', () => {
  for (const [key, value] of Object.entries(M264_BATCH_FIELDS)) {
    const wrong = typeof value === 'boolean' ? !value : typeof value === 'number' ? value + 1 : 'forged';
    for (const invalid of [undefined, null, wrong, {supplied: value}]) {
      if (JSON.stringify(value) === JSON.stringify(invalid)) continue;
      assert.throws(() => assertM264BatchStatus({...minimalStatus(), [key]: invalid}), rejection, key);
    }
  }
});

test('M264 batch contract rejects missing, duplicate and altered milestone rows', () => {
  for (const row of rows) {
    assert.throws(() => assertM264BatchStatus({...minimalStatus(),
      formalPublicationMilestones: rows.filter(other => other.id !== row.id)}), rejection);
    assert.throws(() => assertM264BatchStatus({...minimalStatus(), formalPublicationMilestones: [...rows, row]}), rejection);
    for (const key of ['title', 'classification', 'scope', 'nonClaim', 'requiredTheorems']) {
      const changed = {...row, [key]: 'unconditional-complete-proof'};
      const altered = rows.map(other => other.id === row.id ? changed : other);
      assert.throws(() => assertM264BatchStatus({...minimalStatus(), formalPublicationMilestones: altered}), rejection);
      assert.throws(() => assertM264BatchPublicationMap({...minimalMap(), milestones: altered}), rejection);
    }
    for (const [key, value] of Object.entries(M264_BATCH.milestones.find(item => item.id === row.id).verification)) {
      const changed = {...row, [key]: typeof value === 'boolean' ? !value : 'forged'};
      assert.throws(() => assertM264BatchStatus({...minimalStatus(),
        formalPublicationMilestones: rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M264 batch contract rejects absent, duplicated, moved and assumed declarations', () => {
  for (const row of candidates) {
    const without = candidates.filter(other => other.name !== row.name);
    assert.throws(() => assertM264BatchInventory({milestoneCandidates: without}), rejection, row.name);
    assert.throws(() => assertM264BatchInventory({milestoneCandidates: [...candidates, row]}), rejection, row.name);
    for (const changed of [
      {...row, kind:'axiom'}, {...row, module:'PNP.Fixture'},
      {...row, axioms:[...row.axioms, 'PNP.ForgedAssumption']},
      {...row, axioms:row.axioms.length ? [] : ['propext']},
      {...row, kernelType:null},
    ]) assert.throws(() => assertM264BatchInventory({milestoneCandidates:
      candidates.map(other => other.name === row.name ? changed : other)}), rejection, row.name);
  }
});

test('M264 batch contract hashes raw kernel types for every milestone', () => {
  for (const milestone of M264_BATCH.milestones) {
    const name = Object.keys(milestone.theorems).at(-1);
    const row = candidates.find(candidate => candidate.name === name);
    for (const kernelType of ['True', row.kernelType + ' suppliedCorrectness']) {
      assert.throws(() => assertM264BatchInventory({milestoneCandidates:
        candidates.map(other => other.name === name ? {...row, kernelType} : other)}), rejection);
    }
  }
});

test('M264 batch contract rejects forged publication and status fingerprints', () => {
  for (const name of names) {
    const map = minimalMap();
    map.earnedMilestoneTheoremKernelTypeSha256[name] = '0'.repeat(64);
    assert.throws(() => assertM264BatchPublicationMap(map), rejection);
  }
  for (const row of rows) for (const proof of row.theoremRows) {
    for (const invalid of [
      {...proof, present:false}, {...proof, kind:'axiom'},
      {...proof, actualKernelTypeSha256:'0'.repeat(64)},
      {...proof, expectedKernelTypeSha256:'0'.repeat(64)},
      {...proof, axioms:[...proof.axioms, 'PNP.ForgedAssumption']},
    ]) {
      const changed = {...row, theoremRows:row.theoremRows.map(other => other.name === proof.name ? invalid : other)};
      assert.throws(() => assertM264BatchStatus({...minimalStatus(),
        formalPublicationMilestones:rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M264 batch contract binds every release field and theorem to the reviewed batch', () => {
  for (const milestone of M264_BATCH.milestones) {
    const manifest = minimalManifest();
    const row = manifest.earnedBoundary.milestoneBatchM263M264.milestones.find(row => row.id === milestone.id);
    const field = Object.keys(row.fields)[0];
    row.fields[field] = 'forged';
    assert.throws(() => assertM264BatchManifest(manifest), rejection);
    const dropped = minimalManifest();
    dropped.earnedBoundary.scope = [...ids].filter(id => id !== milestone.id).join('+plus-');
    assert.throws(() => assertM264BatchManifest(dropped), rejection);
    for (const kind of ['theoremKernelTypeSha256', 'theoremAxioms']) {
      const changed = minimalManifest();
      const target = changed.earnedBoundary.milestoneBatchM263M264.milestones.find(row => row.id === milestone.id);
      target[kind][Object.keys(target[kind])[0]] = 'forged';
      assert.throws(() => assertM264BatchManifest(changed), rejection);
    }
  }
  const stale = minimalManifest();
  stale.earnedBoundary.milestoneBatchM263M264.reviewedSource.commit = '0'.repeat(40);
  assert.throws(() => assertM264BatchManifest(stale), rejection);
});

test('M264 batch contract generates the exact same metadata validators for the browser', () => {
  const descriptor = renderM264BrowserDescriptor();
  assertM264BrowserDescriptor(descriptor);
  assert.throws(() => assertM264BrowserDescriptor(descriptor + '\n' + descriptor), /browser M264/);
  assert.throws(() => assertM264BrowserDescriptor(descriptor.replace(M264_BATCH.reviewedSource.commit, '0'.repeat(40))), /browser M264/);
  const context = vm.createContext({});
  vm.runInContext(descriptor + '\nglobalThis.checks = FORMAL_M263_M264_VALIDATORS;', context);
  context.checks.status(minimalStatus());
  context.checks.inventory(minimalInventory());
  for (const milestone of M264_BATCH.milestones) {
    const key = Object.keys(milestone.fields)[0];
    assert.throws(() => context.checks.status({...minimalStatus(), [key]:undefined}), rejection);
    const name = Object.keys(milestone.theorems)[0];
    assert.throws(() => context.checks.inventory({milestoneCandidates:
      candidates.filter(row => row.name !== name)}), rejection);
  }
});


test('M264 batch contract preserves independent historical progress reviews', () => {
  for (const milestone of M264_BATCH.milestones) {
    const review = progress.history.find(row => row.asOfCoordinate === milestone.coordinate);
    assert.ok(review, milestone.coordinate);
    assert.equal(review.scoreChanged, false);
    assert.deepEqual(review.changedCheckpointIds, []);
    assert.equal(review.riskWeightedProofCompletionPercent, 40);
    assert.equal(review.globalGatesClosed, 0);
    assert.equal(review.uncertaintyLowPercent, 20);
    assert.equal(review.uncertaintyHighPercent, 40);
  }
  const latest = progress.history.find(row => row.asOfCoordinate === M264_BATCH.reviewedSource.statusCoordinate);
  assert.deepEqual(latest.formalArtefactCoverage, {earnedRows:240,totalRows:242});
});

test('M264 batch contract is wired alongside every retained batch', () => {
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
  assertM264BrowserDescriptor(browser);
  for (const kind of ['inventory','status']) assert.ok(browser.includes('try { FORMAL_M263_M264_VALIDATORS.' + kind + '(' + kind + '); } catch { return false; }'));
  assert.ok(browser.includes('[FORMAL_M232_M258_BATCH, FORMAL_M259_M262_BATCH, FORMAL_M263_M264_BATCH, FORMAL_M265_M280_BATCH].flatMap(batch => batch.milestones)'));
});

test('M264 current mirrors bind the latest reviewed source and separate progress fields', () => {
  const publishedStatus = json('public/pnp-status.json');
  const publishedInventory = json('public/pnp-theorem-inventory.json');
  const publishedProgress = json('public/pnp-proof-progress.json');
  const release = json('downloads/formal-publication-release.json');
  const index = json('public/pnp-index.json');
  assertM264BatchStatus(publishedStatus);
  assertM264BatchInventory(publishedInventory);
  assertM264BatchManifest(release);
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
  for (const [field,value] of Object.entries(M264_BATCH_FIELDS)) assert.deepEqual(index.claimBoundary[field],value,field);
});

test('M264 publication preserves every earlier update and each milestone scoring coordinate', () => {
  const updates = json('content/milestone-updates.json');
  const entries = updates.entries.filter(entry => ids.has(entry.milestoneId));
  assert.deepEqual(entries.map(entry => entry.milestoneId),M264_BATCH.milestones.toReversed().map(row => row.id));
  assert.equal(new Set(entries.map(entry => entry.publishedAt)).size,1);
  for (const entry of entries) {
    const milestone = M264_BATCH.milestones.find(row => row.id === entry.milestoneId);
    const review = progress.history.find(row => row.asOfCoordinate === milestone.coordinate);
    assert.deepEqual(entry.source,{...M264_BATCH.reviewedSource,statusCoordinate:milestone.coordinate,
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
  assert.equal(createHash('sha256').update(JSON.stringify(earlier)).digest('hex'),"49eab224c9d6ad003cdaba3b4f33d141159d641a97eed763fdca0985b1662fdb");
});

test('M264 primary summaries preserve actual history, cost and open global boundaries', () => {
  const latest = json('content/milestone-updates.json').entries[0];
  if (latest.milestoneId !== M264_BATCH.milestones.at(-1).id) return;
  const currentProgress = json('public/pnp-proof-progress.json');
  for (const file of ['index.html','status.html','faq.html','paper.html','architecture.html']) {
    const html = readFileSync(file,'utf8');
    const summary = html.match(/<section class="section compact" data-m264-publication-summary>[\s\S]*?<\/section>/)?.[0];
    assert.ok(summary,file);
    for (const phrase of ['M263 computes and executes dependency-ordered physical rewrite histories',
      'every accepted closed history', 'arbitrary finite selected circuit regions',
      'preserving all ordered original outputs', 'Every exterior gate is retained once',
      'every actual restoration is charged', 'selected region and raw history remain inputs',
      'not a globally successful rewrite strategy or a theorem of total polynomial runtime',
      'M230 and M231 retain the complete Cook-Levin builder and concrete CNF-SAT NP-completeness',
      'root theorem PNP.Main.p_eq_np remains absent', 'publication gate is false']) {
      assert.ok(summary.includes(phrase),file+': '+phrase);
    }
    assert.ok(summary.includes('updates.html#'+latest.id));
    assert.ok(summary.includes(currentProgress.formalArtefactCoverage.earnedRows+' of '+currentProgress.formalArtefactCoverage.totalRows));
    assert.ok(summary.includes('estimate: '+currentProgress.proofCompletion.percent+'%'));
    assert.ok(summary.includes('uncertainty '+currentProgress.proofCompletion.uncertaintyLowPercent+'% to '+currentProgress.proofCompletion.uncertaintyHighPercent+'%'));
    assert.ok(summary.includes('Global gates closed: '+currentProgress.globalGates.filter(row=>row.status==='closed').length+' of '+currentProgress.globalGates.length));
    assert.doesNotMatch(html,/data-m(?:258|262)-publication-summary/);
  }
  const home = readFileSync('index.html','utf8');
  const bottom = home.match(/<section class="section compact" data-current-milestone="wire-history-arbitrary-support">[\s\S]*?<\/section>/)?.[0];
  assert.ok(bottom?.includes('Current bottom line'));
  const bottomText = decodePublishedHtml(bottom);
  for (const paragraph of latest.plainLanguage) assert.ok(bottomText.includes(paragraph));
  for (const phrase of ['final gates + actual removals = original gates + actual materializer charges',
    'removals > charges', 'selected support and raw history remain input data', 'no global strategy is derived']) {
    assert.ok(bottomText.includes(phrase),phrase);
  }
  const faq = decodePublishedHtml(readFileSync('faq.html','utf8'));
  assert.ok(faq.includes(M264_BATCH.milestones.at(-1).scope));
  assert.ok(faq.includes(M264_BATCH.milestones.at(-1).nonClaim));
});

test('M264 current static fields, inventory and complete ledger follow canonical payloads', () => {
  const latest = json('content/milestone-updates.json').entries[0];
  if (latest.milestoneId !== M264_BATCH.milestones.at(-1).id) return;
  const currentStatus = json('public/pnp-status.json');
  const currentInventory = json('public/pnp-theorem-inventory.json');
  for (const file of ['index.html','status.html']) {
    const html = readFileSync(file,'utf8');
    const fields = decodePublishedHtml(html.match(/<pre data-formal-status-fields>([\s\S]*?)<\/pre>/)?.[1] ?? '');
    for (const [key,value] of Object.entries(M264_BATCH_FIELDS)) {
      assert.ok(fields.includes(key+' = '+JSON.stringify(value)),file+': '+key);
    }
    assert.ok(fields.includes('concretePublicationGate.passed = false'));
  }
  const formal = readFileSync('status.html','utf8');
  assertCanonicalStaticMilestoneCards(formal,currentStatus);
  const counts = formal.match(/<p data-formal-inventory-counts>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(counts);
  for (const key of ['declarationCount','theoremCount','assumptionFreeTheoremCount',
    'excludedPrivateDeclarationCount','sourceClosureModuleCount','axiomCount']) {
    assert.ok(counts.includes('<strong>'+currentInventory[key].toLocaleString('en-AU')+'</strong>'),key);
  }
  assert.deepEqual(readBrowserInventoryCounts(readFileSync('assets/main.js','utf8')),
    {declarations:currentInventory.declarationCount,theorems:currentInventory.theoremCount,
      assumptionFreeTheorems:currentInventory.assumptionFreeTheoremCount,
      excludedPrivateDeclarations:currentInventory.excludedPrivateDeclarationCount,
      modules:currentInventory.sourceClosureModuleCount,axioms:currentInventory.axiomCount});
  const missing = readFileSync('paper.html','utf8').split('<h3>Not earned</h3>')[1]?.split('</article>')[0];
  assert.ok(missing);
  assert.doesNotMatch(missing,/SAT NP-hardness|CNF-SAT NP-completeness|complete Cook-Levin formula builder/);
  assert.match(missing,/deterministic polynomial-time SAT algorithm/);
  assert.match(missing,/unconditional residual minimization and global ZeroSlack/);
});

test('M264 current documentation preserves provenance and the supplied-history boundary', () => {
  const latest = json('content/milestone-updates.json').entries[0];
  if (latest.milestoneId !== M264_BATCH.milestones.at(-1).id) return;
  const currentProgress = json('public/pnp-proof-progress.json');
  for (const file of ['docs/activated_claim_wording.md','docs/audit_questions.md',
    'docs/one_command_verify_upload.md','docs/proof_pipeline.md','docs/reproducibility.md',
    'docs/reviewer_guide.md','docs/source_checker_map.md','docs/trust_model.md']) {
    const text = readFileSync(file,'utf8');
    const block = text.split('<!-- CURRENT_PUBLICATION:START -->')[1]?.split('<!-- CURRENT_PUBLICATION:END -->')[0];
    assert.ok(block,file);
    for (const value of [latest.title,...latest.plainLanguage,latest.source.commit,latest.source.tree,latest.source.statusCoordinate]) {
      assert.ok(block.includes(value),file+': latest source and account');
    }
    for (const phrase of ['changes no fixed weighted checkpoint',
      'M230 and M231 close complete Cook-Levin emission/refinement and concrete CNF-SAT NP-completeness',
      'M243 consumes that checked hardness in the still-conditional report bridge',
      'publication gate is false']) assert.ok(block.includes(phrase),file+': '+phrase);
    assert.ok(block.includes(currentProgress.formalArtefactCoverage.earnedRows+' of '+currentProgress.formalArtefactCoverage.totalRows));
    assert.ok(block.includes('estimate: '+currentProgress.proofCompletion.percent+'%'));
    assert.doesNotMatch(block,/M262 current publication|\b\d+[- ]pages?\b/);
  }
  const readme = readFileSync('README.md','utf8');
  assert.ok(readme.includes('## M264 current publication'));
  assert.ok(readme.includes(latest.title));
  for (const paragraph of latest.plainLanguage) assert.ok(readme.includes(paragraph));
  assert.ok(readme.includes(currentProgress.asOfCoordinate));
  assert.ok(readme.includes('changes no fixed weighted checkpoint'));
  const terms = readFileSync('docs/terminology_crosswalk.md','utf8').split('## Current computational history integration')[1]?.split('\n## ')[0];
  assert.ok(terms);
  for (const phrase of ['Dependency-ordered physical history','Creation snapshot and paid restoration',
    'Source-derived causal splice','Exact history cost balance','selected support and raw history remain input data',
    'Boolean equivalence alone is not a causal certificate','complete encoded-input polynomial runtime']) {
    assert.ok(terms.includes(phrase),phrase);
  }
  const review = readFileSync('review.html','utf8');
  assert.ok(review.includes('arbitrary-region literal circuit replacement'));
  assert.ok(review.includes('Saving requires actual removals to exceed restoration charges'));
});

test('M264 latest mutation paths retain exact fields and fingerprint diagnostics', () => {
  const currentStatus = json('public/pnp-status.json');
  for (const milestone of M264_BATCH.milestones) {
    const release = json('downloads/formal-publication-release.json');
    const row = currentStatus.formalPublicationMilestones.find(item=>item.id===milestone.id);
    const derived = deriveBatchMilestoneFields(currentStatus,release,row);
    assert.deepEqual(derived.statusFields,milestone.fields);
    assert.equal(readMilestoneReleaseField(release,derived.releaseFields.Formalized),true);
    setMilestoneReleaseField(release,derived.releaseFields.Formalized,false);
    assert.throws(()=>assertM264BatchManifest(release),/current manifest .* boundary mismatch/);
    const forged = json('downloads/formal-publication-release.json');
    readMilestoneReleaseField(forged,derived.releaseFields.TheoremKernelTypeSha256)[row.requiredTheorems[0]]='0'.repeat(64);
    assert.throws(()=>assertM264BatchManifest(forged),/current manifest .* fingerprint mismatch/);
  }
});

test('M264 complete browser boundary accepts current evidence and rejects new status and theorem mutations', () => {
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
  for (const milestone of M264_BATCH.milestones) {
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
