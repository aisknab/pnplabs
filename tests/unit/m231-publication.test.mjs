import { M258_BATCH_SCOPE_SUFFIX } from '../../tools/formal-m258-batch-contract.mjs';
import { replaceStatusLedgerMetadata } from "../../tools/generate-proof-progress-surfaces.mjs";
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  M231, assertM231Status, assertM231Inventory, assertM231Manifest,
  assertM231PublicationMap,
} from '../../tools/formal-m231-contract.mjs';

const json = file => JSON.parse(readFileSync(file, 'utf8'));
const status = json('public/pnp-status.json');
const inventory = json('public/pnp-theorem-inventory.json');
const release = json('downloads/formal-publication-release.json');
const index = json('public/pnp-index.json');
const progress = json('public/pnp-proof-progress.json');
const updates = json('content/milestone-updates.json');
const names = Object.keys(M231.theorems);
const row = status.formalPublicationMilestones.find(row => row.id === M231.id);
const minimalStatus = () => ({ ...M231.fields, formalPublicationMilestones: [structuredClone(row)] });
const minimalInventory = () => ({ milestoneCandidates: structuredClone(inventory.milestoneCandidates.filter(row => names.includes(row.name))) });
const minimalManifest = () => ({ earnedBoundary: structuredClone(Object.fromEntries(Object.entries(release.earnedBoundary).filter(([key]) =>
  key === 'scope' || key.startsWith('cnfSATNPCompleteness')))) });
const minimalMap = () => ({ milestones: [structuredClone(row)], earnedMilestoneTheoremKernelTypeSha256:
  Object.fromEntries(Object.entries(M231.theorems).map(([name, evidence]) => [name, evidence.hash])) });

test('M231 accepts exactly the reviewed NP-hardness and closed NP-completeness evidence', () => {
  assert.deepEqual(names, ['PNP.Concrete.CookLevin.cnfSAT_np_hard', 'PNP.Concrete.CookLevin.cnfSAT_np_complete']);
  assert.equal(Object.keys(M231.fields).length, 5);
  assertM231Status(status);
  assertM231Inventory(inventory);
  assertM231Manifest(release);
  assertM231PublicationMap(minimalMap());
  for (const [field, value] of Object.entries(M231.fields)) assert.equal(index.claimBoundary[field], value);
  if (updates.entries[0].milestoneId === M231.id) {
    assert.equal(release.source.commit, M231.sourceCommit);
    assert.equal(release.source.tree, M231.sourceTree);
  }
  assert.match(M231.scope, /For every language in the concrete bounded-certificate NP class/);
  assert.match(M231.scope, /closed theorem proves NPComplete CNFSAT/);
  assert.match(M231.nonClaim, /not a deterministic polynomial-time SAT algorithm/);
});

test('M231 rejects absent, duplicate, weakened, moved and assumption-backed theorem evidence', () => {
  for (const name of names) {
    for (const mutate of [
      payload => { payload.milestoneCandidates = payload.milestoneCandidates.filter(row => row.name !== name); },
      payload => { payload.milestoneCandidates.push(structuredClone(payload.milestoneCandidates.find(row => row.name === name))); },
      payload => { payload.milestoneCandidates.find(row => row.name === name).kernelType = 'True'; },
      payload => { payload.milestoneCandidates.find(row => row.name === name).kernelType += ' suppliedCorrectness'; },
      payload => { payload.milestoneCandidates.find(row => row.name === name).kind = 'axiom'; },
      payload => { payload.milestoneCandidates.find(row => row.name === name).module = 'PNP.Fixture'; },
      payload => { payload.milestoneCandidates.find(row => row.name === name).axioms.push('PNP.ForgedAssumption'); },
      payload => { payload.milestoneCandidates.find(row => row.name === name).axioms = []; },
    ]) {
      const payload = minimalInventory();
      mutate(payload);
      assert.throws(() => assertM231Inventory(payload), /^Error: inventory M231 .* theorem mismatch$/);
    }
  }
});

test('M231 rejects missing, stale and wrong-type status and manifest fields', () => {
  for (const [key, value] of Object.entries(M231.fields)) {
    for (const invalid of [undefined, null, typeof value === 'boolean' ? !value : typeof value === 'number' ? value + 1 : 'forged']) {
      const payload = minimalStatus();
      payload[key] = invalid;
      assert.throws(() => assertM231Status(payload), /^Error: status M231 .* evidence mismatch$/);
    }
  }
  for (const [key, value] of Object.entries(M231.releaseFields)) {
    for (const invalid of [undefined, null, typeof value === 'boolean' ? !value : 'forged']) {
      const payload = minimalManifest();
      payload.earnedBoundary[key] = invalid;
      assert.throws(() => assertM231Manifest(payload), /^Error: current manifest M231 .* boundary mismatch$/);
    }
  }
});

test('M231 rejects altered scope, theorem fingerprints and publication claims at every boundary', () => {
  for (const field of ['scope', 'nonClaim', 'classification', 'requiredTheorems']) {
    const map = minimalMap();
    map.milestones[0][field] = 'unconditional-complete-proof';
    assert.throws(() => assertM231PublicationMap(map), /^Error: core publication map M231 .* boundary mismatch$/);
    const payload = minimalStatus();
    payload.formalPublicationMilestones[0][field] = 'unconditional-complete-proof';
    assert.throws(() => assertM231Status(payload), /^Error: status M231 .* boundary mismatch$/);
  }
  for (const name of names) {
    const map = minimalMap();
    map.earnedMilestoneTheoremKernelTypeSha256[name] = '0'.repeat(64);
    assert.throws(() => assertM231PublicationMap(map), /M231 .* fingerprint mismatch/);
    const manifest = minimalManifest();
    manifest.earnedBoundary.cnfSATNPCompletenessTheoremKernelTypeSha256[name] = '0'.repeat(64);
    assert.throws(() => assertM231Manifest(manifest), /M231 .* fingerprint mismatch/);
    const payload = minimalStatus();
    payload.formalPublicationMilestones[0].theoremRows.find(row => row.name === name).actualKernelTypeSha256 = '0'.repeat(64);
    assert.throws(() => assertM231Status(payload), /M231 .* theorem mismatch/);
  }
  for (const field of ['earned', 'allPresent', 'allKernelTypesMatch', 'axiomClosureUsesOnlyLeanStandardAllowlist', 'sourceClosureFingerprintMatches']) {
    const payload = minimalStatus();
    payload.formalPublicationMilestones[0][field] = false;
    assert.throws(() => assertM231Status(payload), /M231/);
  }
  for (const [field, value] of [
    ['scope', 'unrelated'],
    ['cnfSATNPCompletenessTheorem', 'PNP.Main.p_eq_np'],
    ['cnfSATNPCompletenessHardnessTheorem', 'PNP.Main.p_eq_np'],
    ['cnfSATNPCompletenessAxiomClosure', []],
    ['cnfSATNPCompletenessProjectAxiomClosure', ['PNP.ForgedAssumption']],
  ]) {
    const manifest = minimalManifest();
    manifest.earnedBoundary[field] = value;
    assert.throws(() => assertM231Manifest(manifest), /M231/);
  }
});

test('M231 earns only the fixed two-point checkpoint and preserves the M230 review', () => {
  const history = progress.history.find(row => row.asOfCoordinate === M231.coordinate);
  assert.ok(history);
  assert.equal(history.scoreChanged, true);
  assert.deepEqual(history.changedCheckpointIds, ['reductions-concrete-np-hardness']);
  assert.equal(history.riskWeightedProofCompletionPercent, 40);
  assert.deepEqual(history.formalArtefactCoverage, { earnedRows: 207, totalRows: 209 });
  assert.equal(history.uncertaintyLowPercent, 20);
  assert.equal(history.uncertaintyHighPercent, 40);
  assert.equal(history.globalGatesClosed, 0);
  assert.equal(history.globalGatesAvailable, 5);
  const previous = progress.history[progress.history.indexOf(history) - 1];
  assert.deepEqual(previous.changedCheckpointIds, ['reductions-complete-cook-levin-builder']);
  assert.equal(previous.riskWeightedProofCompletionPercent, 38);
  const update = updates.entries.find(row => row.milestoneId === M231.id);
  assert.equal(update.source.statusCoordinate, history.asOfCoordinate);
  assert.equal(update.progressSnapshot.riskWeightedProofCompletionPercent, history.riskWeightedProofCompletionPercent);
  assert.equal(update.progressSnapshot.formalArtefactCoverageEarnedRows, history.formalArtefactCoverage.earnedRows);
  assert.equal(update.progressSnapshot.formalArtefactCoverageTotalRows, history.formalArtefactCoverage.totalRows);
  if (progress.asOfCoordinate === M231.coordinate) {
    assert.equal(status.leanConcreteCNFSATInPFormalized, false);
    assert.equal(status.rootLeanTheoremPresent, false);
    assert.deepEqual(status.projectSpecificAxiomInventory, []);
    assert.equal(status.concretePublicationGate.passed, false);
    assert.equal(progress.tracks.flatMap(track => track.checkpoints).find(row => row.id === 'root-complexity-transport').status, 'open');
  }
});

test('M231 current surfaces separate NP-completeness, SAT decision and evidence coverage', () => {
  if (updates.entries[0].milestoneId !== M231.id) return;
  for (const file of ['README.md', 'index.html', 'status.html', 'faq.html', 'paper.html', 'architecture.html']) {
    const surface = readFileSync(file, 'utf8');
    assert.ok(surface.includes(`${progress.proofCompletion.percent}%`), file + ': proof estimate');
    assert.ok(surface.includes(`${progress.formalArtefactCoverage.earnedRows} of ${progress.formalArtefactCoverage.totalRows}`), file + ': separate coverage');
    assert.match(surface, /NP-completeness/);
    assert.match(surface, /not a (?:deterministic )?polynomial-time SAT algorithm|SAT decision remains open/);
  }
  const homepage = readFileSync('index.html', 'utf8');
  const bottom = homepage.split('Current bottom line</div>')[1]?.split('</section>')[0];
  assert.ok(bottom?.includes('NP-completeness is formalized'));
  assert.ok(bottom.includes('SAT decision remains open'));
  const readme = readFileSync('README.md', 'utf8');
  assert.ok(readme.includes('Its ' + names.length + ' reviewed theorem pins are free of project-specific axioms.'));
  assert.ok(readme.includes('Both M231 theorem closures use only the existing Lean standard axioms'));
  for (const file of ['index.html', 'status.html']) {
    const surface = readFileSync(file, 'utf8');
    for (const [key, value] of Object.entries(M231.fields)) {
      assert.ok(surface.includes(key + ' = ' + JSON.stringify(value)), file + ': ' + key);
    }
  }
  assert.ok(readFileSync('status.html', 'utf8').includes(`data-milestone-id="${M231.id}"`));
});

test('current scope suffix contracts include every newly published milestone', () => {
  for (const file of ['tools/verify-release-seal.mjs', 'tools/check-cross-repo-targets.mjs']) {
    const source = readFileSync(file, 'utf8');
    const suffixes = [...source.matchAll(/earned\.scope\.endsWith\(("[^"]+")(\s*\+\s*M258_BATCH_SCOPE_SUFFIX)?\)/g)];
    assert.ok(suffixes.length > 0, file + ': scope contract family');
    for (const [, literal, batchSuffix] of suffixes) {
      const suffix = JSON.parse(literal) + (batchSuffix ? M258_BATCH_SCOPE_SUFFIX : "");
      assert.ok(release.earnedBoundary.scope.endsWith(suffix), file + ': stale current scope suffix');
    }
  }
  const sums = readFileSync('downloads/SHA256SUMS', 'utf8');
  const seal = json('downloads/release-seal.json');
  assert.equal(sums, seal.files.map(row => row.sha256 + '  ' + row.path + '\n').join(''));
});

test('current reviewer copy avoids duplicated inventory counts and obsolete completed blockers', () => {
  if (updates.entries[0].milestoneId !== M231.id) return;
  const files = ['architecture.html', 'paper.html', 'docs/audit_questions.md', 'docs/proof_pipeline.md', 'docs/reviewer_guide.md', 'docs/source_checker_map.md'];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /\b\d[\d,]* (?:reviewed )?(?:milestone candidates|theorem candidates|theorem kinds|theorem-type fingerprints|milestone declarations)\b/, file + ': duplicated inventory count');
    assert.doesNotMatch(text, /\bThe \d+ earned formal artefact scopes are:/, file + ': duplicated scope count');
  }
  const guide = readFileSync('docs/reviewer_guide.md', 'utf8');
  assert.ok(guide.includes('M231 combines the complete Cook-Levin reduction with the concrete verifier'));
  assert.ok(!guide.includes('NP-completeness transport still needs its own theorem'));
  assert.ok(!readFileSync('README.md', 'utf8').includes('named SAT hardness transport, CNFSAT in P'));
  assert.ok(!readFileSync('architecture.html', 'utf8').includes('named SAT hardness transport and the root theorem remain open'));
  assert.ok(readFileSync('docs/source_checker_map.md', 'utf8').includes('M230 and M231 close complete Cook-Levin emission/refinement and concrete CNF-SAT NP-completeness.'));
  const reproduction = readFileSync('docs/reproducibility.md', 'utf8');
  assert.ok(reproduction.includes('focused ' + M231.fields.leanConcreteCNFNPCompletenessAuditedDeclarationCount + '-declaration audit'));
  assert.ok(!reproduction.includes('The remaining Cook-Levin formula body, complete raw builder,'));
});

test('status metadata is generated from the canonical coordinate and evidence ledger', () => {
  const model = { coordinate: progress.asOfCoordinate, formalArtefactCoverage: progress.formalArtefactCoverage };
  const source = '<span class="eyebrow">Formal status · 2000-01-01</span> Show all 1 formal milestone records';
  const rendered = replaceStatusLedgerMetadata(source, model);
  assert.ok(rendered.includes(progress.asOfCoordinate.match(/\d{4}-\d{2}-\d{2}/u)[0]));
  assert.ok(rendered.includes('Show all ' + progress.formalArtefactCoverage.totalRows + ' formal milestone records'));
  assert.equal(replaceStatusLedgerMetadata(rendered, model), rendered);
  for (const invalid of [source + source, source.replace('Show all 1 formal milestone records', ''), source.replace('<span class="eyebrow">', '<span>')]) {
    assert.throws(() => replaceStatusLedgerMetadata(invalid, model), /exactly one/);
  }
  assert.throws(() => replaceStatusLedgerMetadata(source, { ...model, coordinate: 'invalid' }), /invalid canonical/);
  assert.throws(() => replaceStatusLedgerMetadata(source, { ...model, formalArtefactCoverage: { totalRows: 0 } }), /invalid canonical/);
  const current = readFileSync('status.html', 'utf8');
  assert.equal(replaceStatusLedgerMetadata(current, model), current);
});
