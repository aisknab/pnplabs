import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {deriveBatchMilestoneFields, readMilestoneReleaseField, setMilestoneReleaseField} from '../helpers/publication-status-fields.mjs';
import {
  M258_BATCH, M258_BATCH_FIELDS, M258_BATCH_THEOREMS, M258_BATCH_SCOPE_SUFFIX,
  assertM258BatchPublicationMap, assertM258BatchStatus,
  assertM258BatchInventory, assertM258BatchManifest,
  m258BatchManifestBoundary, renderM258BrowserDescriptor,
  assertM258BrowserDescriptor,
} from '../../tools/formal-m258-batch-contract.mjs';

const json = file => JSON.parse(readFileSync(file, 'utf8'));
// An explicit core checkout permits isolated contract feedback before sync.
// The active-mirror test below always reads the actual site artifacts.
const core = process.env.PNP_SOURCE_DIR;
const status = json(core ? path.join(core, 'status/FORMAL_RECONSTRUCTION_STATUS.json') : 'public/pnp-status.json');
const inventory = json(core ? path.join(core, 'status/LEAN_THEOREM_INVENTORY.json') : 'public/pnp-theorem-inventory.json');
const progress = json(core ? path.join(core, 'status/PROOF_PROGRESS.json') : 'public/pnp-proof-progress.json');
const ids = new Set(M258_BATCH.milestones.map(row => row.id));
const names = Object.keys(M258_BATCH_THEOREMS);
const rows = status.formalPublicationMilestones.filter(row => ids.has(row.id));
const candidates = inventory.milestoneCandidates.filter(row => Object.hasOwn(M258_BATCH_THEOREMS, row.name));
const minimalStatus = () => ({...M258_BATCH_FIELDS, formalPublicationMilestones: rows});
const minimalInventory = () => ({milestoneCandidates: candidates});
const minimalMap = () => ({milestones: rows, earnedMilestoneTheoremKernelTypeSha256:
  Object.fromEntries(names.map(name => [name, M258_BATCH_THEOREMS[name].hash]))});
const minimalManifest = () => ({earnedBoundary: {
  scope: [...ids].join('+plus-'), milestoneBatchM232M258: m258BatchManifestBoundary(),
}});
const rejection = /^Error: (?:status|inventory|core publication map|current manifest) M\d+ .* mismatch$/;

test('M258 batch contract accepts the exact reviewed 27-row compiled batch', () => {
  assert.deepEqual(M258_BATCH.milestones.map(row => row.number), Array.from({length:27}, (_, i) => 232 + i));
  assert.equal(M258_BATCH.reviewedSource.commit, '6296c6e1130fbae674548ccbf949f6e608b996c7');
  assert.equal(M258_BATCH.reviewedSource.tree, '78648f5978d16ff5055c5b493e5bb97ff4cd7cac');
  assert.equal(names.length, 369);
  assert.equal(Object.keys(M258_BATCH_FIELDS).length, 540);
  assert.ok(Object.isFrozen(M258_BATCH.milestones[0].theorems));
  assertM258BatchStatus(status);
  assertM258BatchInventory(inventory);
  assertM258BatchPublicationMap(minimalMap());
  if (core) assertM258BatchPublicationMap(json(path.join(core, 'publication/FORMAL_PUBLICATION_MAP.json')));
  assertM258BatchManifest(minimalManifest());
});

test('M258 batch contract rejects every absent, stale or wrong-type status field', () => {
  for (const [key, value] of Object.entries(M258_BATCH_FIELDS)) {
    const wrong = typeof value === 'boolean' ? !value : typeof value === 'number' ? value + 1 : 'forged';
    for (const invalid of [undefined, null, wrong, {supplied: value}]) {
      if (JSON.stringify(value) === JSON.stringify(invalid)) continue;
      assert.throws(() => assertM258BatchStatus({...minimalStatus(), [key]: invalid}), rejection, key);
    }
  }
});

test('M258 batch contract rejects missing, duplicate and altered milestone rows', () => {
  for (const row of rows) {
    assert.throws(() => assertM258BatchStatus({...minimalStatus(),
      formalPublicationMilestones: rows.filter(other => other.id !== row.id)}), rejection);
    assert.throws(() => assertM258BatchStatus({...minimalStatus(), formalPublicationMilestones: [...rows, row]}), rejection);
    for (const key of ['title', 'classification', 'scope', 'nonClaim', 'requiredTheorems']) {
      const changed = {...row, [key]: 'unconditional-complete-proof'};
      const altered = rows.map(other => other.id === row.id ? changed : other);
      assert.throws(() => assertM258BatchStatus({...minimalStatus(), formalPublicationMilestones: altered}), rejection);
      assert.throws(() => assertM258BatchPublicationMap({...minimalMap(), milestones: altered}), rejection);
    }
    for (const [key, value] of Object.entries(M258_BATCH.milestones.find(item => item.id === row.id).verification)) {
      const changed = {...row, [key]: typeof value === 'boolean' ? !value : 'forged'};
      assert.throws(() => assertM258BatchStatus({...minimalStatus(),
        formalPublicationMilestones: rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M258 batch contract rejects absent, duplicated, moved and assumed declarations', () => {
  for (const row of candidates) {
    const without = candidates.filter(other => other.name !== row.name);
    assert.throws(() => assertM258BatchInventory({milestoneCandidates: without}), rejection, row.name);
    assert.throws(() => assertM258BatchInventory({milestoneCandidates: [...candidates, row]}), rejection, row.name);
    for (const changed of [
      {...row, kind:'axiom'}, {...row, module:'PNP.Fixture'},
      {...row, axioms:[...row.axioms, 'PNP.ForgedAssumption']},
      {...row, axioms:row.axioms.length ? [] : ['propext']},
      {...row, kernelType:null},
    ]) assert.throws(() => assertM258BatchInventory({milestoneCandidates:
      candidates.map(other => other.name === row.name ? changed : other)}), rejection, row.name);
  }
});

test('M258 batch contract hashes raw kernel types for every milestone', () => {
  for (const milestone of M258_BATCH.milestones) {
    const name = Object.keys(milestone.theorems).at(-1);
    const row = candidates.find(candidate => candidate.name === name);
    for (const kernelType of ['True', row.kernelType + ' suppliedCorrectness']) {
      assert.throws(() => assertM258BatchInventory({milestoneCandidates:
        candidates.map(other => other.name === name ? {...row, kernelType} : other)}), rejection);
    }
  }
});

test('M258 batch contract rejects forged publication and status fingerprints', () => {
  for (const name of names) {
    const map = minimalMap();
    map.earnedMilestoneTheoremKernelTypeSha256[name] = '0'.repeat(64);
    assert.throws(() => assertM258BatchPublicationMap(map), rejection);
  }
  for (const row of rows) for (const proof of row.theoremRows) {
    for (const invalid of [
      {...proof, present:false}, {...proof, kind:'axiom'},
      {...proof, actualKernelTypeSha256:'0'.repeat(64)},
      {...proof, expectedKernelTypeSha256:'0'.repeat(64)},
      {...proof, axioms:[...proof.axioms, 'PNP.ForgedAssumption']},
    ]) {
      const changed = {...row, theoremRows:row.theoremRows.map(other => other.name === proof.name ? invalid : other)};
      assert.throws(() => assertM258BatchStatus({...minimalStatus(),
        formalPublicationMilestones:rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M258 batch contract binds every release field and theorem to the reviewed batch', () => {
  for (const milestone of M258_BATCH.milestones) {
    const manifest = minimalManifest();
    const row = manifest.earnedBoundary.milestoneBatchM232M258.milestones.find(row => row.id === milestone.id);
    const field = Object.keys(row.fields)[0];
    row.fields[field] = 'forged';
    assert.throws(() => assertM258BatchManifest(manifest), rejection);
    const dropped = minimalManifest();
    dropped.earnedBoundary.scope = [...ids].filter(id => id !== milestone.id).join('+plus-');
    assert.throws(() => assertM258BatchManifest(dropped), rejection);
    for (const kind of ['theoremKernelTypeSha256', 'theoremAxioms']) {
      const changed = minimalManifest();
      const target = changed.earnedBoundary.milestoneBatchM232M258.milestones.find(row => row.id === milestone.id);
      target[kind][Object.keys(target[kind])[0]] = 'forged';
      assert.throws(() => assertM258BatchManifest(changed), rejection);
    }
  }
  const stale = minimalManifest();
  stale.earnedBoundary.milestoneBatchM232M258.reviewedSource.commit = '0'.repeat(40);
  assert.throws(() => assertM258BatchManifest(stale), rejection);
});

test('M258 batch contract generates the exact same metadata validators for the browser', () => {
  const descriptor = renderM258BrowserDescriptor();
  assertM258BrowserDescriptor(descriptor);
  assert.throws(() => assertM258BrowserDescriptor(descriptor + '\n' + descriptor), /browser M258/);
  assert.throws(() => assertM258BrowserDescriptor(descriptor.replace(M258_BATCH.reviewedSource.commit, '0'.repeat(40))), /browser M258/);
  const context = vm.createContext({});
  vm.runInContext(descriptor + '\nglobalThis.checks = FORMAL_M232_M258_VALIDATORS;', context);
  context.checks.status(minimalStatus());
  context.checks.inventory(minimalInventory());
  for (const milestone of M258_BATCH.milestones) {
    const key = Object.keys(milestone.fields)[0];
    assert.throws(() => context.checks.status({...minimalStatus(), [key]:undefined}), rejection);
    const name = Object.keys(milestone.theorems)[0];
    assert.throws(() => context.checks.inventory({milestoneCandidates:
      candidates.filter(row => row.name !== name)}), rejection);
  }
});

test('M258 batch contract is wired into all Node consumers and the classic browser', () => {
  for (const [file, kinds] of [
    ['tools/sync-public-access-docs.mjs', ['PublicationMap', 'Status', 'Inventory']],
    ['tools/verify-release-seal.mjs', ['Status', 'Inventory', 'Manifest']],
    ['tools/check-cross-repo-targets.mjs', ['PublicationMap', 'Status', 'Inventory', 'Manifest']],
  ]) {
    const source = readFileSync(file, 'utf8');
    assert.ok(source.includes("from './formal-m258-batch-contract.mjs'"), file);
    for (const kind of kinds) assert.match(source, new RegExp('assertM258Batch' + kind + '\\(\\w+\\);'), file);
  }
  const browser = readFileSync('assets/main.js', 'utf8');
  assertM258BrowserDescriptor(browser);
  assert.match(browser, /function validateInventory\(inventory\) \{\s+try \{ FORMAL_M232_M258_VALIDATORS.inventory\(inventory\); \} catch \{ return false; \}/);
  assert.match(browser, /function validateStatus\(status, inventory\) \{\s+try \{ FORMAL_M232_M258_VALIDATORS.status\(status\); \} catch \{ return false; \}/);
  assert.ok(browser.indexOf('if (inventoryDigest !== INVENTORY_SHA256)') < browser.indexOf('if (!isConservativeFormalStatus(status, inventory))'));
});

test('M258 batch contract preserves historical risk reviews without awarding row-count credit', () => {
  for (const milestone of M258_BATCH.milestones) {
    const review = progress.history.find(row => row.asOfCoordinate === milestone.coordinate);
    assert.ok(review, milestone.coordinate);
    assert.equal(review.scoreChanged, false);
    assert.deepEqual(review.changedCheckpointIds, []);
    assert.equal(review.riskWeightedProofCompletionPercent, 40);
    assert.equal(review.globalGatesClosed, 0);
  }
  const latest = progress.history.find(row => row.asOfCoordinate === M258_BATCH.reviewedSource.statusCoordinate);
  assert.deepEqual(latest.formalArtefactCoverage, {earnedRows:234,totalRows:236});
  assert.equal(latest.uncertaintyLowPercent, 20);
  assert.equal(latest.uncertaintyHighPercent, 40);
});

test('M258 active site mirrors and release carry the complete reviewed batch', () => {
  assertM258BatchStatus(json('public/pnp-status.json'));
  assertM258BatchInventory(json('public/pnp-theorem-inventory.json'));
  const release = json('downloads/formal-publication-release.json');
  assertM258BatchManifest(release);
  const currentBatch = Object.values(release.earnedBoundary)
    .filter(value => value?.kind === 'PNPLabsCompiledMilestoneBatch0')
    .sort((left, right) => Math.max(...left.milestones.map(row => row.number)) - Math.max(...right.milestones.map(row => row.number))).at(-1);
  assert.equal(release.source.commit, currentBatch.reviewedSource.commit);
  assert.equal(release.source.tree, currentBatch.reviewedSource.tree);
  const index = json('public/pnp-index.json');
  assert.equal(index.sourceCommitRef, release.source.commit);
  assert.equal(index.sourceTree, release.source.tree);
  for (const [field, value] of Object.entries(M258_BATCH_FIELDS))
    assert.deepEqual(index.claimBoundary[field], value, field);
});

test('M258 batch contract extends every legacy scope tail without relaxing ordering', () => {
  assert.equal(M258_BATCH_SCOPE_SUFFIX, '+plus-' + M258_BATCH.milestones.map(row => row.id).join('+plus-'));
  for (const file of ['tools/verify-release-seal.mjs', 'tools/check-cross-repo-targets.mjs']) {
    const source = readFileSync(file, 'utf8');
    assert.equal(source.split(' + M258_BATCH_SCOPE_SUFFIX + M262_BATCH_SCOPE_SUFFIX + M264_BATCH_SCOPE_SUFFIX)').length - 1, 6, file);
    assert.equal(source.split('+plus-concrete-cnf-np-completeness"))').length - 1, 0, file);
  }
});

test('M258 batch field helpers preserve explicit mutation paths and diagnostics', () => {
  const release = json('downloads/formal-publication-release.json');
  const milestone = rows.at(-1);
  const derived = deriveBatchMilestoneFields(status, release, milestone);
  assert.equal(derived.statusStem, 'leanWireUnarySupportSearch');
  assert.deepEqual(derived.statusFields, M258_BATCH.milestones.at(-1).fields);
  assert.equal(readMilestoneReleaseField(release, derived.releaseFields.Formalized), true);
  setMilestoneReleaseField(release, derived.releaseFields.Formalized, false);
  assert.throws(() => assertM258BatchManifest(release), /current manifest .* boundary mismatch/);
  const changed = json('downloads/formal-publication-release.json');
  readMilestoneReleaseField(changed, derived.releaseFields.TheoremKernelTypeSha256)[milestone.requiredTheorems[0]] = '0'.repeat(64);
  assert.throws(() => assertM258BatchManifest(changed), /current manifest .* fingerprint mismatch/);
  assert.throws(() => setMilestoneReleaseField(changed, ['absent'], false), /missing publication field target/);
  const duplicate = json('downloads/formal-publication-release.json');
  duplicate.earnedBoundary.duplicateBatch = structuredClone(duplicate.earnedBoundary.milestoneBatchM232M258);
  assert.throws(() => deriveBatchMilestoneFields(status, duplicate, milestone), /ambiguous publication batch/);
});

test('M258 batch history preserves every original snapshot and all earlier updates', () => {
  const data = json('content/milestone-updates.json');
  const entries = data.entries.filter(entry => ids.has(entry.milestoneId));
  assert.deepEqual(entries.map(entry => entry.milestoneId), M258_BATCH.milestones.toReversed().map(row => row.id));
  assert.equal(new Set(entries.map(entry => entry.publishedAt)).size, 1);
  for (const entry of entries) {
    const row = M258_BATCH.milestones.find(item => item.id === entry.milestoneId);
    const history = progress.history.find(item => item.asOfCoordinate === row.coordinate);
    assert.deepEqual(entry.source, {
      commit: M258_BATCH.reviewedSource.commit,
      tree: M258_BATCH.reviewedSource.tree,
      statusCoordinate: row.coordinate,
      publicationCoordinate: json('public/pnp-index.json').publicSurfaceBaselineCoordinate,
    });
    assert.deepEqual(entry.progressSnapshot, {
      modelId: progress.modelId,
      formalArtefactCoverageEarnedRows: history.formalArtefactCoverage.earnedRows,
      formalArtefactCoverageTotalRows: history.formalArtefactCoverage.totalRows,
      riskWeightedProofCompletionPercent: history.riskWeightedProofCompletionPercent,
      uncertaintyLowPercent: history.uncertaintyLowPercent,
      uncertaintyHighPercent: history.uncertaintyHighPercent,
      globalGatesClosed: history.globalGatesClosed,
      globalGatesAvailable: history.globalGatesAvailable,
    });
    assert.equal(entry.plainLanguage.length, 2);
  }
  // Immutable M231 publication history, not a current count expectation.
  const firstBatch = data.entries.findIndex(entry => entry.milestoneId === M258_BATCH.milestones[0].id);
  const earlier = data.entries.slice(firstBatch + 1);
  assert.equal(createHash('sha256').update(JSON.stringify(earlier)).digest('hex'),
    'da2666c2d2abe599761f847d1163b207b84047ca8403d1d21ca70a061cf9a656');
});

test('M258 current primary surfaces retain the scoped search and actual global boundaries', () => {
  const updates = json('content/milestone-updates.json');
  if (updates.entries[0].milestoneId !== M258_BATCH.milestones.at(-1).id) return;
  const coverage = progress.formalArtefactCoverage;
  for (const file of ['index.html', 'status.html', 'faq.html', 'paper.html', 'architecture.html']) {
    const source = readFileSync(file, 'utf8');
    const summary = source.match(/<section class="section compact" data-m258-publication-summary>[\s\S]*?<\/section>/)?.[0];
    assert.ok(summary, file + ': current batch summary');
    assert.ok(summary.includes('updates.html#' + updates.entries[0].id), file + ': exact current update link');
    assert.ok(summary.includes(coverage.earnedRows + ' of ' + coverage.totalRows), file + ': coverage');
    assert.ok(summary.includes('estimate: ' + progress.proofCompletion.percent + '%'), file + ': proof estimate');
    assert.ok(summary.includes('zero or one incoming wire'), file + ': support boundary');
    assert.ok(summary.includes('not global circuit minimization'), file + ': no global overclaim');
    assert.ok(summary.includes('not global circuit minimization or a theorem of total polynomial runtime'), file + ': runtime boundary');
    assert.ok(summary.includes('M230 and M231 retain the complete Cook-Levin builder and concrete CNF-SAT NP-completeness'), file + ': completed reductions preserved');
    assert.ok(summary.includes('root theorem PNP.Main.p_eq_np remains absent'), file + ': root absent');
    assert.ok(summary.includes('publication gate is false'), file + ': publication closed');
  }
  const formal = readFileSync('status.html', 'utf8');
  const actualIds = [...formal.matchAll(/data-milestone-id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(actualIds, status.formalPublicationMilestones.map(row => row.id));
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  for (const file of ['index.html', 'status.html']) {
    const source = readFileSync(file, 'utf8');
    const pre = source.match(/<pre data-formal-status-fields>([\s\S]*?)<\/pre>/)?.[1];
    assert.ok(pre, file + ': static status fields');
    for (const [key, value] of Object.entries(M258_BATCH_FIELDS)) {
      assert.ok(pre.includes(escape(key + ' = ' + JSON.stringify(value))), file + ': ' + key);
    }
    assert.ok(pre.includes('concretePublicationGate.passed = false'));
  }
  const paper = readFileSync('paper.html', 'utf8');
  const missing = paper.split('<h3>Not earned</h3>')[1]?.split('</article>')[0];
  assert.ok(missing);
  assert.doesNotMatch(missing, /SAT NP-hardness|CNF-SAT NP-completeness|complete Cook-Levin formula builder/);
  assert.match(missing, /deterministic polynomial-time SAT algorithm/);
  assert.match(missing, /unconditional residual minimization and global ZeroSlack/);
});

test('M258 current overview and static inventory values follow their canonical payloads', () => {
  const latest = json('content/milestone-updates.json').entries[0];
  if (latest.milestoneId !== M258_BATCH.milestones.at(-1).id) return;
  const readme = readFileSync('README.md', 'utf8');
  assert.ok(readme.includes('## M258 current publication'));
  assert.ok(readme.includes(latest.title));
  for (const paragraph of latest.plainLanguage) assert.ok(readme.includes(paragraph));
  assert.ok(readme.includes(progress.asOfCoordinate));
  const coverage = progress.formalArtefactCoverage;
  assert.ok(readme.includes(coverage.earnedRows + ' of ' + coverage.totalRows));
  assert.ok(readme.includes('estimate: **' + progress.proofCompletion.percent + '%**'));
  assert.ok(readme.includes('changes no fixed weighted checkpoint'));
  assert.ok(readme.includes('not a polynomial-time SAT algorithm'));
  assert.equal(/207 of 209|SAT hardness or CNFSAT in P/.test(readme), false, "README includes superseded current coverage or a completed blocker");
  const formal = readFileSync('status.html', 'utf8');
  const counts = formal.match(/<p data-formal-inventory-counts>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(counts);
  for (const field of ['declarationCount', 'theoremCount', 'assumptionFreeTheoremCount',
    'excludedPrivateDeclarationCount', 'sourceClosureModuleCount', 'axiomCount']) {
    assert.ok(counts.includes('<strong>' + inventory[field].toLocaleString('en-AU') + '</strong>'), field);
  }
  for (const file of ['paper.html', 'architecture.html']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /\b\d[\d,]* (?:exported )?public declarations(?: across| from)/);
  }
});

const M258_REVIEWER_DOCS = [
  "docs/activated_claim_wording.md",
  "docs/audit_questions.md",
  "docs/one_command_verify_upload.md",
  "docs/proof_pipeline.md",
  "docs/reproducibility.md",
  "docs/reviewer_guide.md",
  "docs/source_checker_map.md",
  "docs/trust_model.md"
];

const M258_RETAINED_HISTORY = [
  {
    "file": "docs/audit_questions.md",
    "startMarker": "## Historical Assertion-Checker Worksheet",
    "endMarker": "<!-- CURRENT_PUBLICATION:START -->",
    "sha256": "9275608e8e414ba56bd155bb077f7926645cd82d031a2c0ab72089b2c596f268"
  },
  {
    "file": "docs/source_checker_map.md",
    "startMarker": "## Reference Classes",
    "endMarker": "<!-- CURRENT_PUBLICATION:START -->",
    "sha256": "9c6be05ce850d00ed97b5b5f8a5b878dcc67b4a5d576722a35411bbc6cd69dba"
  },
  {
    "file": "docs/reproducibility.md",
    "startMarker": "Historical component notes below retain the estimates recorded at their respective milestones.",
    "endMarker": "<!-- CURRENT_PUBLICATION:START -->",
    "sha256": "c206cbbf449fdc7cc3ff8e8f9d418aac48d25b42bb7914db254ba7dc5cbea71c"
  }
];

test('M258 current reviewer documentation keeps source, metrics and proof limits aligned', () => {
  const latest = json('content/milestone-updates.json').entries[0];
  if (latest.milestoneId !== M258_BATCH.milestones.at(-1).id) return;
  for (const file of M258_REVIEWER_DOCS) {
    const text = readFileSync(file, 'utf8');
    const block = text.split('<!-- CURRENT_PUBLICATION:START -->')[1]?.split('<!-- CURRENT_PUBLICATION:END -->')[0];
    assert.ok(block, file + ': current publication markers');
    for (const value of [latest.title, latest.source.commit, latest.source.tree,
      latest.source.statusCoordinate, ...latest.plainLanguage]) assert.ok(block.includes(value), file + ': current source and account');
    assert.ok(block.includes(progress.formalArtefactCoverage.earnedRows + ' of ' + progress.formalArtefactCoverage.totalRows), file + ': coverage');
    assert.ok(block.includes('estimate: ' + progress.proofCompletion.percent + '%'), file + ': score');
    assert.ok(block.includes('Uncertainty range: ' + progress.proofCompletion.uncertaintyLowPercent + '% to ' + progress.proofCompletion.uncertaintyHighPercent + '%'), file + ': uncertainty');
    assert.ok(block.includes('Global gates closed: 0 of 5'), file + ': gates');
    assert.ok(block.includes('changes no fixed weighted checkpoint'), file + ': no row-count credit');
    assert.ok(block.includes('M230 and M231 close complete Cook-Levin emission/refinement and concrete CNF-SAT NP-completeness'), file + ': completed reductions');
    assert.ok(block.includes('M243 consumes that checked hardness in the still-conditional report bridge'), file + ': conditional bridge');
    assert.ok(block.includes('publication gate is false'), file + ': root gate');
    let currentText = text;
    for (const section of M258_RETAINED_HISTORY.filter(entry => entry.file === file)) {
      const start = currentText.indexOf(section.startMarker), end = currentText.indexOf(section.endMarker, start);
      assert.ok(start >= 0 && end > start, file + ': historical exclusion boundary');
      currentText = currentText.slice(0, start) + currentText.slice(end);
    }
    assert.equal(/207 of 209|## M231 current publication boundary/.test(currentText), false, file + ': superseded current copy');
  }
  const guide = readFileSync('docs/reviewer_guide.md', 'utf8');
  assert.ok(guide.includes('A negative answer excludes only proper zero/unary support gains, not a smaller global circuit'));
  assert.ok(guide.includes('Candidate-count bounds do not prove total encoded-input polynomial runtime'));
  assert.ok(guide.includes('M231 combines the complete Cook-Levin reduction with the concrete verifier'));
  assert.ok(guide.includes('seal and four-alias results already included in'));
  for (const file of ['architecture.html', 'paper.html', 'docs/audit_questions.md',
    'docs/proof_pipeline.md', 'docs/reviewer_guide.md', 'docs/source_checker_map.md']) {
    const text = readFileSync(file, 'utf8');
    assert.equal(/\b\d[\d,]* (?:reviewed )?(?:milestone candidates|theorem candidates|theorem kinds|theorem-type fingerprints|milestone declarations)\b/.test(text), false, file + ': duplicated inventory count');
    assert.equal(/\bThe \d+ earned formal artefact scopes are:/.test(text), false, file + ': duplicated scope count');
  }
});

test('M258 reviewer updates preserve the explicit historical worksheets and component notes', () => {
  for (const entry of M258_RETAINED_HISTORY) {
    const text = readFileSync(entry.file, 'utf8');
    const start = text.indexOf(entry.startMarker), end = text.indexOf(entry.endMarker, start);
    assert.ok(start >= 0 && end > start, entry.file);
    assert.equal(createHash('sha256').update(text.slice(start, end)).digest('hex'), entry.sha256, entry.file);
  }
});

test('current review entrypoints use the published source and scoped computational vocabulary', () => {
  const latest = json('content/milestone-updates.json').entries[0];
  const source = latest.source.commit;
  const verify = readFileSync('verify.html', 'utf8');
  const current = verify.match(/<tr data-current-source>([\s\S]*?)<\/tr>/)?.[1];
  assert.ok(current?.includes('https://github.com/aisknab/pnp/tree/' + source), 'current source link');
  assert.ok(current?.includes('<code>' + source + '</code>'), 'current source label');
  assert.ok(verify.includes('git checkout ' + source), 'current reproduction command');
  const terms = readFileSync('docs/terminology_crosswalk.md', 'utf8');
  const introduction = terms.split(/^## /m)[0];
  const currentLinks = [...introduction.matchAll(/https:\/\/github\.com\/aisknab\/pnp\/blob\/([0-9a-f]{40})\//g)];
  assert.equal(currentLinks.length, 2);
  for (const match of currentLinks) assert.equal(match[1], source, 'current terminology source');
  if (latest.milestoneId !== M258_BATCH.milestones.at(-1).id) return;
  for (const phrase of ['Proper physical support', 'Zero/unary incoming boundary',
    'Full computational fields', 'Source-derived complete scoped search',
    'negative result is not global minimality or unconditional ZeroSlack',
    'Candidate-count bounds are not total encoded-input polynomial runtime']) {
    assert.ok(terms.includes(phrase), 'current term and non-claim: ' + phrase);
  }
  const review = readFileSync('review.html', 'utf8');
  assert.ok(review.includes('source-derived proper zero/unary support search'));
  assert.ok(review.includes('Scoped local search is not global minimization or a polynomial-time SAT algorithm'));
});

test('current publication workflows check the canonical published core commit', () => {
  const source = json('content/milestone-updates.json').entries[0].source.commit;
  for (const file of [".github/workflows/pnp-upstream-status-consistency.yml",".github/workflows/sync-public-access-report.yml"]) {
    const text = readFileSync(file, 'utf8');
    const pins = [...text.matchAll(/^  PNP_CORE_COMMIT: ([0-9a-f]{40})$/gm)];
    assert.equal(pins.length, 1, file + ': one explicit source pin');
    assert.equal(pins[0][1], source, file + ': canonical source pin');
    assert.ok(text.includes('node tools/check-cross-repo-targets.mjs --require-source'), file + ': source is required');
  }
});

test('current static ledger preserves exact reviewed interfaces and canonical historical snapshots', () => {
  const html = readFileSync('status.html', 'utf8');
  const updates = json('content/milestone-updates.json');
  let checked = 0;
  for (const row of status.formalPublicationMilestones) {
    const card = html.match(new RegExp('<article[^>]*data-milestone-id="' + row.id + '"[\\s\\S]*?<\\/article>'))?.[0];
    assert.ok(card, row.id + ': ledger card');
    if (row.earned) for (const name of row.requiredTheorems) {
      const encodedName = name.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
      assert.ok(card.includes(encodedName), row.id + ': reviewed theorem ' + name);
    }
    const entry = updates.entries.find(item => item.milestoneId === row.id);
    if (entry?.progressSnapshot?.modelId !== 'fixed-risk-weighted-checkpoints-v0') continue;
    assert.ok(card.includes('data-historical-progress-snapshot="' + entry.source.statusCoordinate + '"'), row.id + ': original review coordinate');
    assert.ok(card.includes(entry.progressSnapshot.formalArtefactCoverageEarnedRows + ' of ' + entry.progressSnapshot.formalArtefactCoverageTotalRows), row.id + ': original coverage');
    assert.ok(card.includes(entry.progressSnapshot.riskWeightedProofCompletionPercent + '%'), row.id + ': original estimate');
    assert.ok(card.includes('updates.html#' + entry.id), row.id + ': versioned update');
    checked++;
  }
  assert.equal(checked, updates.entries.filter(entry => entry.progressSnapshot?.modelId === 'fixed-risk-weighted-checkpoints-v0').length);
  const runtime = readFileSync('assets/main.js', 'utf8');
  assert.ok(runtime.includes('historicalSnapshot.cloneNode(true)'), 'browser retains generated historical annotations');
  assert.ok(runtime.includes('for (const name of milestone.requiredTheorems)'), 'browser lists all reviewed interfaces');
});
