import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deriveMilestoneStatusStem, readBrowserInventoryCounts, decodePublishedHtml, assertCanonicalStaticMilestoneCards } from '../helpers/publication-status-fields.mjs';

test('publication fixture names derive from status without approving field values', () => {
  assert.equal(deriveMilestoneStatusStem({
    leanExampleFormalized: false,
    leanExampleAxiomAuditPassed: false,
  }, 'example'), 'leanExample');
});

test('concrete release prefixes resolve without a per-milestone name map', () => {
  const status = {
    leanConcreteCookLevinExampleFormalized: true,
    leanConcreteCookLevinExampleAxiomAuditPassed: true,
    leanConcreteCookLevinExampleAllInputsFormalized: false,
  };
  assert.equal(deriveMilestoneStatusStem(status, 'cookLevinExample'),
    'leanConcreteCookLevinExample');
  assert.equal(deriveMilestoneStatusStem(status, 'concreteCookLevinExample'),
    'leanConcreteCookLevinExample');
});

test('missing, inherited and ambiguous publication fixture stems fail closed', () => {
  assert.throws(() => deriveMilestoneStatusStem({}, 'example'), /expected one status stem/);
  assert.throws(() => deriveMilestoneStatusStem(Object.create({
    leanExampleFormalized: true,
    leanExampleAxiomAuditPassed: true,
  }), 'example'), /expected one status stem/);
  assert.throws(() => deriveMilestoneStatusStem({
    leanExampleFormalized: true,
    leanExampleAxiomAuditPassed: true,
    leanConcreteExampleFormalized: true,
    leanConcreteExampleAxiomAuditPassed: true,
  }, 'example'), /expected one status stem/);
});

test('publication fixture stems require a companion audit field and nonempty prefix', () => {
  assert.throws(() => deriveMilestoneStatusStem({
    leanExampleFormalized: true,
  }, 'example'), /missing status audit field/);
  assert.throws(() => deriveMilestoneStatusStem({}, ''), /must not be empty/);
});

test('all current publication fixture consumers use shared field derivation', () => {
  for (const file of [
    'tests/unit/formal-publication-artifacts.test.mjs',
    'tests/unit/formal-publication-ui.test.mjs',
    'tests/unit/pnp-public-payloads.test.mjs',
    'tests/unit/pnp-homepage-matrix-badge.test.mjs',
    'tests/audit-targets/cross-repo-targets.test.mjs',
  ]) {
    const source = readFileSync(file, 'utf8');
    const imports = source.match(/import\s*\{([^}]+)\}\s*from\s*['"][^'"]*publication-status-fields\.mjs['"]/);
    assert.ok(imports, file + ': shared fixture module import');
    const symbols = imports[1].split(',').map(name => name.trim());
    assert.ok(symbols.includes('deriveMilestoneStatusStem'), file + ': legacy field derivation');
    assert.ok(symbols.includes('deriveBatchMilestoneFields'), file + ': nested batch field derivation');
    assert.doesNotMatch(source,
      /STATUS_STEM_WITHOUT_SCOPE_BY_|RELEASE_BOUNDARY_STATUS_STEM_OVERRIDES|missing status-stem mapping/,
      file);
  }
});


test('browser inventory counts are decoded independently of object-key formatting', () => {
  assert.deepEqual(readBrowserInventoryCounts('const INVENTORY_COUNTS = Object.freeze({declarations: 5, axioms: 0,});'), {declarations:5,axioms:0});
  assert.deepEqual(readBrowserInventoryCounts('const INVENTORY_COUNTS = Object.freeze({"declarations":5, "axioms":0});'), {declarations:5,axioms:0});
  assert.throws(() => readBrowserInventoryCounts('const unrelated = {};'), /inventory-count object/);
});


test('published HTML field decoding preserves one-layer display semantics', () => {
  assert.equal(decodePublishedHtml('field = &quot;a &lt; b &amp; c&quot;'), 'field = "a < b & c"');
  assert.equal(decodePublishedHtml('&amp;quot;'), '&quot;');
  assert.equal(decodePublishedHtml('count = 36'), 'count = 36');
});


test('canonical static cards reject altered status, scope, limitations and theorem interfaces', () => {
  const row = {id:'example',earned:true,title:'Example & boundary',scope:'For a < b, the supplied case holds.',nonClaim:'This is not unconditional.',requiredTheorems:['PNP.Example.checked']};
  const encode = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const html = '<article data-milestone-id="example" data-earned="true"><h3>' + encode(row.title) + '</h3><p>' + encode(row.scope) + '</p><p>' + row.nonClaim + '</p><details data-reviewed-theorem-pins><summary>Interfaces</summary><ul><li><code>PNP.Example.checked</code></li></ul></details></article>';
  const status = {formalPublicationMilestones:[row]};
  assertCanonicalStaticMilestoneCards(html, status);
  for (const [from,to] of [
    ['data-milestone-id="example"','data-milestone-id="other"'],
    ['data-earned="true"','data-earned="false"'],
    ['Example &amp; boundary','Wrong title'],
    ['the supplied case holds.','all inputs hold.'],
    ['This is not unconditional.','This is unconditional.'],
    ['PNP.Example.checked','PNP.Example.unchecked'],
  ]) assert.throws(() => assertCanonicalStaticMilestoneCards(html.replace(from,to),status));
  assert.throws(() => assertCanonicalStaticMilestoneCards(html+html,status), /milestone order/);
});
