import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import { renderCurrentCanonicalIdentities, renderCurrentInventoryIdentity } from '../../tools/sync-public-access-docs.mjs';

const document = readFileSync('docs/reproducibility.md', 'utf8');
const release = JSON.parse(readFileSync('downloads/formal-publication-release.json', 'utf8'));

test('current documentation identities are generated from the canonical release', () => {
  assert.equal(document, renderCurrentCanonicalIdentities(document, release));
});

test('stale documentation byte counts and digests are corrected from the manifest', () => {
  const changed = structuredClone(release);
  changed.artifacts.status.bytes += 1;
  changed.artifacts.status.sha256 = '0'.repeat(64);
  const stale = renderCurrentCanonicalIdentities(document, changed);
  assert.notEqual(stale, document);
  assert.equal(renderCurrentCanonicalIdentities(stale, release), document);
});

test('identity generation preserves text and historical examples outside its current table', () => {
  const surrounding = `Historical example: 98%, 57-page report.\n\n${document}\nHistorical appendix unchanged.\n`;
  assert.equal(renderCurrentCanonicalIdentities(surrounding, release), surrounding);
});

test('identity generation rejects missing or duplicated regions and malformed identities', () => {
  assert.throws(() => renderCurrentCanonicalIdentities('', release), /expected one current canonical identity table/);
  assert.throws(() => renderCurrentCanonicalIdentities(document + document, release), /expected one current canonical identity table/);
  const changed = structuredClone(release);
  changed.artifacts.status.bytes = -1;
  assert.throws(() => renderCurrentCanonicalIdentities(document, changed), /invalid canonical identity/);
});

test('current page inventory identities are generated from the byte-checked canonical release', () => {
  const digest = createHash('sha256').update(readFileSync('public/pnp-theorem-inventory.json')).digest('hex');
  assert.equal(release.artifacts.theoremInventory.sha256, digest);
  for (const file of ['index.html', 'status.html']) {
    const page = readFileSync(file, 'utf8');
    assert.equal(renderCurrentInventoryIdentity(page, release), page, file);
    const stale = page.replace(/<p class="boundary-copy" data-current-inventory-identity>[\s\S]*?<\/p>/,
      region => region.replace(digest, '0'.repeat(64)));
    assert.notEqual(stale, page);
    assert.equal(renderCurrentInventoryIdentity(stale, release), page);
    const historical = 'Historical checksum: ' + 'f'.repeat(64) + '\n' + page;
    assert.equal(renderCurrentInventoryIdentity(historical, release), historical);
  }
});

test('inventory identity generation rejects missing, duplicate and malformed inputs', () => {
  const page = readFileSync('index.html', 'utf8');
  assert.throws(() => renderCurrentInventoryIdentity('', release), /expected one current inventory identity/);
  assert.throws(() => renderCurrentInventoryIdentity(page + page, release), /expected one current inventory identity/);
  const changed = structuredClone(release);
  changed.artifacts.theoremInventory.sha256 = 'not-a-digest';
  assert.throws(() => renderCurrentInventoryIdentity(page, changed), /invalid canonical inventory identity/);
});


function assertCurrentInventoryReference(page, label) {
  const references = [...page.matchAll(/<(div|p)\b[^>]*data-current-inventory-reference[^>]*>[\s\S]*?<\/\1>/g)];
  assert.equal(references.length, 1, label + ': one current manifest reference');
  assert.match(references[0][0], /href="downloads\/formal-publication-release\.json"/);
  assert.doesNotMatch(references[0][0], /\b[0-9a-f]{64}\b/i, label + ': no hand-maintained digest');
  assert.doesNotMatch(page, /<span>Inventory SHA-256<\/span>/, label + ': no duplicate inventory digest label');
  assert.doesNotMatch(page, /<p>Coordinate <code>PNP-LEAN-THEOREM-INVENTORY-[^<]+<\/code>;\s*SHA-256/,
    label + ': no ungenerated current inventory identity');
}

test('secondary current inventory labels link to the canonical manifest without copying its digest', () => {
  for (const file of ['index.html', 'status.html']) {
    const page = readFileSync(file, 'utf8');
    assertCurrentInventoryReference(page, file);
    assert.equal(renderCurrentInventoryIdentity(page, release), page);
    assertCurrentInventoryReference('Historical checksum: ' + 'f'.repeat(64) + '\n' + page, file);
  }
});

test('current inventory references reject missing links, copied digests and duplicate legacy labels', () => {
  const page = readFileSync('index.html', 'utf8');
  assert.throws(() => assertCurrentInventoryReference(page.replace('data-current-inventory-reference', 'data-old-inventory-reference'), 'missing'), /one current manifest reference/);
  assert.throws(() => assertCurrentInventoryReference(page + page, 'duplicate'), /one current manifest reference/);
  assert.throws(() => assertCurrentInventoryReference(page.replace('<div data-current-inventory-reference>', '<div data-current-inventory-reference>' + '0'.repeat(64)), 'digest'), /no hand-maintained digest/);
  assert.throws(() => assertCurrentInventoryReference(page + '<span>Inventory SHA-256</span>', 'legacy'), /no duplicate inventory digest label/);
  assert.throws(() => assertCurrentInventoryReference(page + '<p>Coordinate <code>PNP-LEAN-THEOREM-INVENTORY-example</code>; SHA-256</p>', 'legacy-coordinate'), /no ungenerated current inventory identity/);
});
