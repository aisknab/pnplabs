import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {deriveBatchMilestoneFields, readMilestoneReleaseField, setMilestoneReleaseField, assertCanonicalStaticMilestoneCards, decodePublishedHtml, readBrowserInventoryCounts} from '../helpers/publication-status-fields.mjs';
import {
  M262_BATCH, M262_BATCH_FIELDS, M262_BATCH_THEOREMS, M262_BATCH_SCOPE_SUFFIX,
  assertM262BatchPublicationMap, assertM262BatchStatus,
  assertM262BatchInventory, assertM262BatchManifest,
  m262BatchManifestBoundary, renderM262BrowserDescriptor,
  assertM262BrowserDescriptor,
} from '../../tools/formal-m262-batch-contract.mjs';

const json = file => JSON.parse(readFileSync(file, 'utf8'));
// An explicit core checkout permits isolated contract feedback before sync.
// The active-mirror test below always reads the actual site artifacts.
const core = process.env.PNP_SOURCE_DIR;
const status = json(core ? path.join(core, 'status/FORMAL_RECONSTRUCTION_STATUS.json') : 'public/pnp-status.json');
const inventory = json(core ? path.join(core, 'status/LEAN_THEOREM_INVENTORY.json') : 'public/pnp-theorem-inventory.json');
const progress = json(core ? path.join(core, 'status/PROOF_PROGRESS.json') : 'public/pnp-proof-progress.json');
const ids = new Set(M262_BATCH.milestones.map(row => row.id));
const names = Object.keys(M262_BATCH_THEOREMS);
const rows = status.formalPublicationMilestones.filter(row => ids.has(row.id));
const candidates = inventory.milestoneCandidates.filter(row => Object.hasOwn(M262_BATCH_THEOREMS, row.name));
const minimalStatus = () => ({...M262_BATCH_FIELDS, formalPublicationMilestones: rows});
const minimalInventory = () => ({milestoneCandidates: candidates});
const minimalMap = () => ({milestones: rows, earnedMilestoneTheoremKernelTypeSha256:
  Object.fromEntries(names.map(name => [name, M262_BATCH_THEOREMS[name].hash]))});
const minimalManifest = () => ({earnedBoundary: {
  scope: [...ids].join('+plus-'), milestoneBatchM259M262: m262BatchManifestBoundary(),
}});
const rejection = /^Error: (?:status|inventory|core publication map|current manifest) M\d+ .* mismatch$/;

test('M262 batch contract accepts the exact reviewed 4-row compiled batch', () => {
  assert.deepEqual(M262_BATCH.milestones.map(row => row.number), Array.from({length:4}, (_, i) => 259 + i));
  assert.equal(M262_BATCH.reviewedSource.commit, 'c3d4d9a115a357b44ee8104d129ee15e3174ec7f');
  assert.equal(M262_BATCH.reviewedSource.tree, '7bd3bc5854b0307330e9e405b5857de658eba54e');
  assert.equal(names.length, 93);
  assert.equal(Object.keys(M262_BATCH_FIELDS).length, 197);
  assert.ok(Object.isFrozen(M262_BATCH.milestones[0].theorems));
  assertM262BatchStatus(status);
  assertM262BatchInventory(inventory);
  assertM262BatchPublicationMap(minimalMap());
  if (core) assertM262BatchPublicationMap(json(path.join(core, 'publication/FORMAL_PUBLICATION_MAP.json')));
  assertM262BatchManifest(minimalManifest());
});

test('M262 batch contract rejects every absent, stale or wrong-type status field', () => {
  for (const [key, value] of Object.entries(M262_BATCH_FIELDS)) {
    const wrong = typeof value === 'boolean' ? !value : typeof value === 'number' ? value + 1 : 'forged';
    for (const invalid of [undefined, null, wrong, {supplied: value}]) {
      if (JSON.stringify(value) === JSON.stringify(invalid)) continue;
      assert.throws(() => assertM262BatchStatus({...minimalStatus(), [key]: invalid}), rejection, key);
    }
  }
});

test('M262 batch contract rejects missing, duplicate and altered milestone rows', () => {
  for (const row of rows) {
    assert.throws(() => assertM262BatchStatus({...minimalStatus(),
      formalPublicationMilestones: rows.filter(other => other.id !== row.id)}), rejection);
    assert.throws(() => assertM262BatchStatus({...minimalStatus(), formalPublicationMilestones: [...rows, row]}), rejection);
    for (const key of ['title', 'classification', 'scope', 'nonClaim', 'requiredTheorems']) {
      const changed = {...row, [key]: 'unconditional-complete-proof'};
      const altered = rows.map(other => other.id === row.id ? changed : other);
      assert.throws(() => assertM262BatchStatus({...minimalStatus(), formalPublicationMilestones: altered}), rejection);
      assert.throws(() => assertM262BatchPublicationMap({...minimalMap(), milestones: altered}), rejection);
    }
    for (const [key, value] of Object.entries(M262_BATCH.milestones.find(item => item.id === row.id).verification)) {
      const changed = {...row, [key]: typeof value === 'boolean' ? !value : 'forged'};
      assert.throws(() => assertM262BatchStatus({...minimalStatus(),
        formalPublicationMilestones: rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M262 batch contract rejects absent, duplicated, moved and assumed declarations', () => {
  for (const row of candidates) {
    const without = candidates.filter(other => other.name !== row.name);
    assert.throws(() => assertM262BatchInventory({milestoneCandidates: without}), rejection, row.name);
    assert.throws(() => assertM262BatchInventory({milestoneCandidates: [...candidates, row]}), rejection, row.name);
    for (const changed of [
      {...row, kind:'axiom'}, {...row, module:'PNP.Fixture'},
      {...row, axioms:[...row.axioms, 'PNP.ForgedAssumption']},
      {...row, axioms:row.axioms.length ? [] : ['propext']},
      {...row, kernelType:null},
    ]) assert.throws(() => assertM262BatchInventory({milestoneCandidates:
      candidates.map(other => other.name === row.name ? changed : other)}), rejection, row.name);
  }
});

test('M262 batch contract hashes raw kernel types for every milestone', () => {
  for (const milestone of M262_BATCH.milestones) {
    const name = Object.keys(milestone.theorems).at(-1);
    const row = candidates.find(candidate => candidate.name === name);
    for (const kernelType of ['True', row.kernelType + ' suppliedCorrectness']) {
      assert.throws(() => assertM262BatchInventory({milestoneCandidates:
        candidates.map(other => other.name === name ? {...row, kernelType} : other)}), rejection);
    }
  }
});

test('M262 batch contract rejects forged publication and status fingerprints', () => {
  for (const name of names) {
    const map = minimalMap();
    map.earnedMilestoneTheoremKernelTypeSha256[name] = '0'.repeat(64);
    assert.throws(() => assertM262BatchPublicationMap(map), rejection);
  }
  for (const row of rows) for (const proof of row.theoremRows) {
    for (const invalid of [
      {...proof, present:false}, {...proof, kind:'axiom'},
      {...proof, actualKernelTypeSha256:'0'.repeat(64)},
      {...proof, expectedKernelTypeSha256:'0'.repeat(64)},
      {...proof, axioms:[...proof.axioms, 'PNP.ForgedAssumption']},
    ]) {
      const changed = {...row, theoremRows:row.theoremRows.map(other => other.name === proof.name ? invalid : other)};
      assert.throws(() => assertM262BatchStatus({...minimalStatus(),
        formalPublicationMilestones:rows.map(other => other.id === row.id ? changed : other)}), rejection);
    }
  }
});

test('M262 batch contract binds every release field and theorem to the reviewed batch', () => {
  for (const milestone of M262_BATCH.milestones) {
    const manifest = minimalManifest();
    const row = manifest.earnedBoundary.milestoneBatchM259M262.milestones.find(row => row.id === milestone.id);
    const field = Object.keys(row.fields)[0];
    row.fields[field] = 'forged';
    assert.throws(() => assertM262BatchManifest(manifest), rejection);
    const dropped = minimalManifest();
    dropped.earnedBoundary.scope = [...ids].filter(id => id !== milestone.id).join('+plus-');
    assert.throws(() => assertM262BatchManifest(dropped), rejection);
    for (const kind of ['theoremKernelTypeSha256', 'theoremAxioms']) {
      const changed = minimalManifest();
      const target = changed.earnedBoundary.milestoneBatchM259M262.milestones.find(row => row.id === milestone.id);
      target[kind][Object.keys(target[kind])[0]] = 'forged';
      assert.throws(() => assertM262BatchManifest(changed), rejection);
    }
  }
  const stale = minimalManifest();
  stale.earnedBoundary.milestoneBatchM259M262.reviewedSource.commit = '0'.repeat(40);
  assert.throws(() => assertM262BatchManifest(stale), rejection);
});

test('M262 batch contract generates the exact same metadata validators for the browser', () => {
  const descriptor = renderM262BrowserDescriptor();
  assertM262BrowserDescriptor(descriptor);
  assert.throws(() => assertM262BrowserDescriptor(descriptor + '\n' + descriptor), /browser M262/);
  assert.throws(() => assertM262BrowserDescriptor(descriptor.replace(M262_BATCH.reviewedSource.commit, '0'.repeat(40))), /browser M262/);
  const context = vm.createContext({});
  vm.runInContext(descriptor + '\nglobalThis.checks = FORMAL_M259_M262_VALIDATORS;', context);
  context.checks.status(minimalStatus());
  context.checks.inventory(minimalInventory());
  for (const milestone of M262_BATCH.milestones) {
    const key = Object.keys(milestone.fields)[0];
    assert.throws(() => context.checks.status({...minimalStatus(), [key]:undefined}), rejection);
    const name = Object.keys(milestone.theorems)[0];
    assert.throws(() => context.checks.inventory({milestoneCandidates:
      candidates.filter(row => row.name !== name)}), rejection);
  }
});

test('M262 batch contract preserves historical risk reviews without awarding row-count credit', () => {
  for (const milestone of M262_BATCH.milestones) {
    const review = progress.history.find(row => row.asOfCoordinate === milestone.coordinate);
    assert.ok(review, milestone.coordinate);
    assert.equal(review.scoreChanged, false);
    assert.deepEqual(review.changedCheckpointIds, []);
    assert.equal(review.riskWeightedProofCompletionPercent, 40);
    assert.equal(review.globalGatesClosed, 0);
  }
  const latest = progress.history.find(row => row.asOfCoordinate === M262_BATCH.reviewedSource.statusCoordinate);
  assert.deepEqual(latest.formalArtefactCoverage, {earnedRows:238,totalRows:240});
  assert.equal(latest.uncertaintyLowPercent, 20);
  assert.equal(latest.uncertaintyHighPercent, 40);
});

test('M262 batch contract is wired alongside the retained M258 evidence', () => {
  for (const [file, kinds] of [
    ['tools/sync-public-access-docs.mjs', ['PublicationMap', 'Status', 'Inventory']],
    ['tools/verify-release-seal.mjs', ['Status', 'Inventory', 'Manifest']],
    ['tools/check-cross-repo-targets.mjs', ['PublicationMap', 'Status', 'Inventory', 'Manifest']],
  ]) {
    const source = readFileSync(file, 'utf8');
    for (const batch of [258, 262]) {
      assert.ok(source.includes("from './formal-m" + batch + "-batch-contract.mjs'"), file);
      for (const kind of kinds) assert.match(source, new RegExp('assertM' + batch + 'Batch' + kind + '\\(\\w+\\);'), file);
    }
    if (kinds.includes('Manifest')) assert.equal(source.split(' + M258_BATCH_SCOPE_SUFFIX + M262_BATCH_SCOPE_SUFFIX)').length - 1, 6, file);
  }
  const browser = readFileSync('assets/main.js', 'utf8');
  assertM262BrowserDescriptor(browser);
  for (const kind of ['inventory', 'status']) {
    const guard = 'try { FORMAL_M259_M262_VALIDATORS.' + kind + '(' + kind + '); } catch { return false; }';
    assert.ok(browser.includes(guard), kind + ': fail-closed browser validator');
  }
  assert.ok(browser.includes('[FORMAL_M232_M258_BATCH, FORMAL_M259_M262_BATCH].flatMap(batch => batch.milestones)'));
});

test('M262 current mirrors and manifest bind the exact reviewed source and independent progress fields', () => {
  const publishedStatus = json('public/pnp-status.json');
  const publishedInventory = json('public/pnp-theorem-inventory.json');
  const publishedProgress = json('public/pnp-proof-progress.json');
  const release = json('downloads/formal-publication-release.json');
  const index = json('public/pnp-index.json');
  assertM262BatchStatus(publishedStatus);
  assertM262BatchInventory(publishedInventory);
  assertM262BatchManifest(release);
  assert.equal(release.source.commit, M262_BATCH.reviewedSource.commit);
  assert.equal(release.source.tree, M262_BATCH.reviewedSource.tree);
  assert.equal(index.sourceCommitRef, release.source.commit);
  assert.equal(index.sourceTree, release.source.tree);
  assert.equal(publishedStatus.coordinate, M262_BATCH.reviewedSource.statusCoordinate);
  assert.equal(publishedProgress.asOfCoordinate, publishedStatus.coordinate);
  assert.equal(index.formalArtefactCoverageEarnedRows, publishedProgress.formalArtefactCoverage.earnedRows);
  assert.equal(index.formalArtefactCoverageTotalRows, publishedProgress.formalArtefactCoverage.totalRows);
  assert.equal(index.proofProgressPointsEarned, publishedProgress.proofCompletion.pointsEarned);
  assert.equal(publishedProgress.proofCompletion.percent, 40);
  assert.equal(publishedProgress.rootTheorem.present, false);
  assert.equal(publishedProgress.projectSpecificAxiomsRemaining.length, 0);
  for (const [field,value] of Object.entries(M262_BATCH_FIELDS)) assert.deepEqual(index.claimBoundary[field], value, field);
});

test('M262 batch mutation paths retain exact fields and fingerprint diagnostics for all four milestones', () => {
  for (const milestone of rows) {
    const release = json('downloads/formal-publication-release.json');
    const derived = deriveBatchMilestoneFields(status, release, milestone);
    assert.deepEqual(derived.statusFields, M262_BATCH.milestones.find(row => row.id === milestone.id).fields);
    assert.equal(readMilestoneReleaseField(release, derived.releaseFields.Formalized), true);
    setMilestoneReleaseField(release, derived.releaseFields.Formalized, false);
    assert.throws(() => assertM262BatchManifest(release), /current manifest .* boundary mismatch/);
    const altered = json('downloads/formal-publication-release.json');
    readMilestoneReleaseField(altered, derived.releaseFields.TheoremKernelTypeSha256)[milestone.requiredTheorems[0]] = '0'.repeat(64);
    assert.throws(() => assertM262BatchManifest(altered), /current manifest .* fingerprint mismatch/);
  }
});

// The M259-M262 source-bound inventory comparison found these five inherited
// closures changed, with every existing raw theorem type and module preserved.
const M262_INHERITED_STANDARD_AXIOM_UPDATES = Object.freeze([
  {
    "name": "PNP.DirectWire.TerminalSaturatedSupportSquare.physically_compatible",
    "hash": "2a19ccf8594f3749b91d263b915e1d2156a90ad2681ca6ed527f124de4b564f3",
    "module": "PNP.ResidualTerminalSupportSquareClosure",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  {
    "name": "PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_compatible",
    "hash": "831f8ce697624f2e413d5da6a56fde592b2157793a1dd1f4f85060154faafc58",
    "module": "PNP.ResidualTerminalPhysicalSupportCompletion",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  {
    "name": "PNP.DirectWire.completeTerminalPhysicalSupport_compatible",
    "hash": "54f14acec8c40024eb7982e02373e24a80e864b0478a7815105f94362601b1fd",
    "module": "PNP.ResidualTerminalPhysicalSupportCompletion",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  {
    "name": "PNP.DirectWire.completeTerminalPhysicalSupport_incoming_complete",
    "hash": "e541fac972a4f9402aab6b47c6aa6164cdf54d5a490beb750a8ddf498719e789",
    "module": "PNP.ResidualTerminalPhysicalSupportCompletion",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  {
    "name": "PNP.DirectWire.mem_terminalBoundaryPorts_iff",
    "hash": "96d01f7650e0584503501f4278dc196e1b1a2ea658abf237e99978715d942ef0",
    "module": "PNP.ResidualTerminalPhysicalSupportCompletion",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  }
]);

test('M262 inherited standard-axiom updates preserve exact theorem types and all consumer expectations', () => {
  const inheritedNames = new Set(M262_INHERITED_STANDARD_AXIOM_UPDATES.map(row => row.name));
  for (const expected of M262_INHERITED_STANDARD_AXIOM_UPDATES) {
    const row = inventory.milestoneCandidates.find(row => row.name === expected.name);
    assert.ok(row, expected.name);
    assert.equal(row.kind, 'theorem');
    assert.equal(row.module, expected.module);
    assert.deepEqual(row.axioms, expected.axioms);
    assert.deepEqual(expected.axioms, ['Quot.sound', 'propext']);
    const hash = createHash('sha256').update('PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\nmilestone-theorem-type:' + row.name + '\n' + row.kernelType).digest('hex');
    assert.equal(hash, expected.hash, expected.name + ': unchanged kernel type');
  }
  for (const file of ["tools/sync-public-access-docs.mjs","tools/verify-release-seal.mjs","tools/check-cross-repo-targets.mjs","assets/main.js","tests/unit/formal-publication-artifacts.test.mjs","tests/unit/pnp-public-payloads.test.mjs"]) {
    let checked = 0;
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const name = line.trim().match(/^(?:\[\s*)?"([^"]+)"\s*(?::\s*\{|,\s*\[)/)?.[1];
      const expected = M262_INHERITED_STANDARD_AXIOM_UPDATES.find(row => row.name === name);
      if (!expected) continue;
      const objectAxioms = line.match(/axioms:\s*(\[[^\]]*\])/)?.[1];
      const actual = objectAxioms ? JSON.parse(objectAxioms) : JSON.parse(line.trim().replace(/,$/, ''))[1];
      assert.deepEqual(actual, expected.axioms, file + ': ' + expected.name);
      checked++;
    }
    assert.ok(checked > 0, file + ': inherited expectations checked');
  }
  assert.equal(inheritedNames.size, 5);
});

test('M262 batch history preserves original scoring coordinates and every earlier public update', () => {
  const updates = json('content/milestone-updates.json');
  const entries = updates.entries.filter(entry => ids.has(entry.milestoneId));
  assert.deepEqual(entries.map(entry => entry.milestoneId), M262_BATCH.milestones.toReversed().map(row => row.id));
  assert.equal(new Set(entries.map(entry => entry.publishedAt)).size, 1);
  for (const entry of entries) {
    const row = M262_BATCH.milestones.find(row => row.id === entry.milestoneId);
    const history = progress.history.find(item => item.asOfCoordinate === row.coordinate);
    assert.deepEqual(entry.source, {...M262_BATCH.reviewedSource, statusCoordinate: row.coordinate,
      publicationCoordinate: json('public/pnp-index.json').publicSurfaceBaselineCoordinate});
    assert.deepEqual(entry.progressSnapshot, {
      modelId: progress.modelId,
      formalArtefactCoverageEarnedRows: history.formalArtefactCoverage.earnedRows,
      formalArtefactCoverageTotalRows: history.formalArtefactCoverage.totalRows,
      riskWeightedProofCompletionPercent: history.riskWeightedProofCompletionPercent,
      uncertaintyLowPercent: history.uncertaintyLowPercent, uncertaintyHighPercent: history.uncertaintyHighPercent,
      globalGatesClosed: history.globalGatesClosed, globalGatesAvailable: history.globalGatesAvailable,
    });
    assert.equal(entry.plainLanguage.length, 2);
  }
  const earlier = updates.entries.filter(entry => !ids.has(entry.milestoneId));
  assert.equal(createHash('sha256').update(JSON.stringify(earlier)).digest('hex'), 'c740e4af91c4354b48ba3aefd291a6bdb82ab139a015ed555df0b02d7ded4e10');
});

test('M262 primary summaries preserve paid-copy, semantic and open global boundaries', () => {
  const latest = json('content/milestone-updates.json').entries[0];
  if (latest.milestoneId !== M262_BATCH.milestones.at(-1).id) return;
  for (const file of ['index.html','status.html','faq.html','paper.html','architecture.html']) {
    const html = readFileSync(file, 'utf8');
    const summary = html.match(/<section class="section compact" data-m262-publication-summary>[\s\S]*?<\/section>/)?.[0];
    assert.ok(summary, file);
    for (const phrase of ['arbitrary finite support and incoming-boundary widths', 'complete local open-function agreement',
      'all tracked computational wire fields', 'Every distinct retained physical producer pays',
      'a smaller local replacement alone is insufficient', 'not global circuit minimization or a theorem of total polynomial runtime',
      'M230 and M231 retain the complete Cook-Levin builder and concrete CNF-SAT NP-completeness',
      'root theorem PNP.Main.p_eq_np remains absent', 'publication gate is false']) assert.ok(summary.includes(phrase), file + ': ' + phrase);
    assert.ok(summary.includes('updates.html#' + latest.id));
    assert.ok(summary.includes(progress.formalArtefactCoverage.earnedRows + ' of ' + progress.formalArtefactCoverage.totalRows));
    assert.ok(summary.includes('estimate: ' + progress.proofCompletion.percent + '%'));
    assert.ok(summary.includes('uncertainty ' + progress.proofCompletion.uncertaintyLowPercent + '% to ' + progress.proofCompletion.uncertaintyHighPercent + '%'));
    assert.ok(summary.includes('Global gates closed: ' + progress.globalGates.filter(gate => gate.status === 'closed').length + ' of ' + progress.globalGates.length));
    assert.doesNotMatch(html, /data-m258-publication-summary/);
  }
  const home = readFileSync('index.html', 'utf8');
  const bottom = home.match(/<section class="section compact" data-current-milestone="wire-causal-expansion">[\s\S]*?<\/section>/)?.[0];
  assert.ok(bottom?.includes('Current bottom line'));
  for (const paragraph of latest.plainLanguage) assert.ok(decodePublishedHtml(bottom).includes(paragraph));
  const faq = readFileSync('faq.html', 'utf8');
  assert.ok(decodePublishedHtml(faq).includes(rows.at(-1).scope));
  assert.ok(decodePublishedHtml(faq).includes(rows.at(-1).nonClaim));
  for (const phrase of ['E + K * R', 'K * R < S', 'A smaller local replacement alone is insufficient'])
    assert.ok(decodePublishedHtml(bottom).includes(phrase), phrase);
});

test('M262 current static fields, inventory and complete ledger follow canonical payloads', () => {
  const latest = json('content/milestone-updates.json').entries[0];
  if (latest.milestoneId !== M262_BATCH.milestones.at(-1).id) return;
  for (const file of ['index.html','status.html']) {
    const html = readFileSync(file, 'utf8');
    const pre = decodePublishedHtml(html.match(/<pre data-formal-status-fields>([\s\S]*?)<\/pre>/)?.[1] ?? '');
    for (const [key,value] of Object.entries(M262_BATCH_FIELDS)) assert.ok(pre.includes(key + ' = ' + JSON.stringify(value)), file + ': ' + key);
    assert.ok(pre.includes('concretePublicationGate.passed = false'));
  }
  const formal = readFileSync('status.html', 'utf8');
  assertCanonicalStaticMilestoneCards(formal, status);
  assert.ok(formal.includes('concrete CNF-SAT NP-completeness are established'));
  assert.ok(formal.includes('a deterministic polynomial-time CNF-SAT algorithm remains unproved'));
  const countText = formal.match(/<p data-formal-inventory-counts>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(countText);
  for (const key of ['declarationCount','theoremCount','assumptionFreeTheoremCount','excludedPrivateDeclarationCount','sourceClosureModuleCount','axiomCount'])
    assert.ok(countText.includes('<strong>' + inventory[key].toLocaleString('en-AU') + '</strong>'), key);
  const browser = readBrowserInventoryCounts(readFileSync('assets/main.js', 'utf8'));
  assert.deepEqual(browser, {declarations: inventory.declarationCount, theorems: inventory.theoremCount,
    assumptionFreeTheorems: inventory.assumptionFreeTheoremCount, excludedPrivateDeclarations: inventory.excludedPrivateDeclarationCount,
    modules: inventory.sourceClosureModuleCount, axioms: inventory.axiomCount});
  const missing = readFileSync('paper.html','utf8').split('<h3>Not earned</h3>')[1]?.split('</article>')[0];
  assert.ok(missing);
  assert.doesNotMatch(missing, /SAT NP-hardness|CNF-SAT NP-completeness|complete Cook-Levin formula builder/);
  assert.match(missing, /deterministic polynomial-time SAT algorithm/);
  assert.match(missing, /unconditional residual minimization and global ZeroSlack/);
});

test('M262 reviewer documentation and overview preserve current provenance and proof limits', () => {
  const latest = json('content/milestone-updates.json').entries[0];
  if (latest.milestoneId !== M262_BATCH.milestones.at(-1).id) return;
  for (const file of ["docs/activated_claim_wording.md","docs/audit_questions.md","docs/one_command_verify_upload.md","docs/proof_pipeline.md","docs/reproducibility.md","docs/reviewer_guide.md","docs/source_checker_map.md","docs/trust_model.md"]) {
    const text = readFileSync(file, 'utf8');
    const block = text.split('<!-- CURRENT_PUBLICATION:START -->')[1]?.split('<!-- CURRENT_PUBLICATION:END -->')[0];
    assert.ok(block, file);
    for (const value of [latest.title, ...latest.plainLanguage, latest.source.commit, latest.source.tree, latest.source.statusCoordinate]) assert.ok(block.includes(value), file + ': current source and account');
    for (const value of ['changes no fixed weighted checkpoint', 'M230 and M231 close complete Cook-Levin emission/refinement and concrete CNF-SAT NP-completeness',
      'M243 consumes that checked hardness in the still-conditional report bridge', 'publication gate is false']) assert.ok(block.includes(value), file + ': boundary');
    assert.ok(block.includes(progress.formalArtefactCoverage.earnedRows + ' of ' + progress.formalArtefactCoverage.totalRows));
    assert.ok(block.includes('estimate: ' + progress.proofCompletion.percent + '%'));
    assert.doesNotMatch(block, /M258 current publication|\b\d+[- ]page\b/);
  }
  const readme = readFileSync('README.md', 'utf8');
  assert.ok(readme.includes('## M262 current publication'));
  assert.ok(readme.includes(latest.title));
  for (const paragraph of latest.plainLanguage) assert.ok(readme.includes(paragraph));
  assert.ok(readme.includes(progress.asOfCoordinate));
  assert.ok(readme.includes('estimate: **' + progress.proofCompletion.percent + '%**'));
  assert.ok(readme.includes('changes no fixed weighted checkpoint'));
  const terms = readFileSync('docs/terminology_crosswalk.md', 'utf8').split('## Current computational support search')[1]?.split('\n## ')[0];
  assert.ok(terms);
  for (const phrase of ['Complete local open-function agreement', 'Paid physical producer copies', 'Full computational-field preservation',
    'E + K * R', 'K * R < S', 'R < S', 'compile_success', 'global CompatibleReplacement/SlackLaw']) assert.ok(terms.includes(phrase), phrase);
  const review = readFileSync('review.html', 'utf8');
  assert.ok(review.includes('arbitrary-width causal circuit expansion'));
  assert.ok(review.includes('A smaller replacement alone does not imply global savings'));
});

test('M262 complete browser inventory boundary accepts current evidence before rejecting each stale inherited closure', () => {
  const source = readFileSync('assets/main.js', 'utf8');
  const validationSource = source.slice(source.indexOf('const STATUS_COORDINATE'), source.indexOf('function renderFormalStatus'));
  const context = vm.createContext({structuredClone});
  new vm.Script(validationSource + '\nglobalThis.validation = {validateInventory,validateMilestones,validateConcreteGate,validateStatus};').runInContext(context);
  const validate = context.validation;
  const currentInventory = json('public/pnp-theorem-inventory.json');
  const currentStatus = json('public/pnp-status.json');
  assert.equal(validate.validateInventory(currentInventory), true, 'positive inventory baseline');
  assert.equal(validate.validateMilestones(currentStatus,currentInventory), true);
  assert.equal(validate.validateConcreteGate(currentStatus,currentInventory), true);
  assert.equal(validate.validateStatus(currentStatus,currentInventory), true);
  for (const expected of M262_INHERITED_STANDARD_AXIOM_UPDATES) {
    const row = currentInventory.milestoneCandidates.find(row => row.name === expected.name);
    const originalAxioms = row.axioms;
    try {
      row.axioms = ['propext'];
      assert.equal(validate.validateInventory(currentInventory), false, expected.name + ': stale inherited closure');
    } finally { row.axioms = originalAxioms; }
    assert.equal(validate.validateInventory(currentInventory), true, expected.name + ': restored exact closure');
  }
});
