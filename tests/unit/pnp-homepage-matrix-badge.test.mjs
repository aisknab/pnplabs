import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('homepage script injects verifier-run matrix badge summary', async () => {
  const script = await readText('assets/main.js');

  for (const fragment of [
    'data-homepage-matrix-summary',
    'Verifier-run matrix badge',
    'badge.state = passing',
    'badge.text = "1 public run; 1/1 required comparisons passing"',
    'metrics.registryRunCount = 1',
    'metrics.acceptedPairCount = 1',
    'metrics.requiredMismatchPairCount = 0',
    'metrics.diagonalAccepts = true',
    'Run records</span><strong>1 public run</strong>',
    'Required pairs</span><strong>1/1 passing</strong>',
    'Required mismatches</span><strong>0</strong>',
    'public/pnp-verifier-run-matrix-summary.json',
    'verifier-run-digests.html',
    'Run matrix badge',
    'Compare run digests'
  ]) {
    assert.equal(script.includes(fragment), true, `missing homepage matrix badge script fragment: ${fragment}`);
  }
});

test('homepage page still loads the shared dynamic status script', async () => {
  const html = await readText('index.html');
  assert.match(html, /<script src="assets\/main\.js" defer><\/script>/);
});

test('homepage badge wording keeps reproducibility status separate from theorem premise status', async () => {
  const script = await readText('assets/main.js');
  assert.match(script, /P = NP public theorem emission is activated under the repository checker trust model\./);
  assert.match(script, /External review remains audit evidence and reproducibility evidence, not a theorem premise\./);
  assert.match(script, /badge\.state = passing/);
  assert.doesNotMatch(script, /external\s+review\s+is\s+(a\s+)?(mathematical\s+)?premise/i);
});
