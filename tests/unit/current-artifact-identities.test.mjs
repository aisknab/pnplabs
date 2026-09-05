import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { renderCurrentCanonicalIdentities } from '../../tools/sync-public-access-docs.mjs';

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
