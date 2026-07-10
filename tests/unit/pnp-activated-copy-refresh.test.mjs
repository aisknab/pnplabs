import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('shared site script applies conservative formal-reconstruction copy', async () => {
  const script = await readText('assets/main.js');
  for (const fragment of [
    'FAIL_CLOSED_FORMAL_STATUS',
    'function isConservativeFormalStatus(payload)',
    'function ensureHomepageFormalReconstructionBoundary()',
    'The repository does not currently establish P = NP.',
    'function ensureFormalVerificationCopy()',
    'function ensureFormalFAQCopy()',
    'function ensureFormalReviewCopy()',
    'publicTheoremEmissionAllowed = false',
    'rootLeanTheoremPresent = false',
    'projectSpecificAxiomsRemaining = true',
    'activated verifier-run registry and automated submission workflow are frozen',
    'loadFormalReconstructionStatus();',
  ]) {
    assert.equal(script.includes(fragment), true, `missing formal-copy fragment: ${fragment}`);
  }
});

test('verify, FAQ, review, home, and status pages load the conservative shared script', async () => {
  for (const page of ['verify.html', 'faq.html', 'review.html', 'index.html', 'status.html']) {
    const html = await readText(page);
    assert.match(html, /<script src="assets\/main\.js" defer><\/script>/, `${page} must load assets/main.js`);
  }
});

test('status fetch fails closed before any request or validation succeeds', async () => {
  const script = await readText('assets/main.js');
  const initialFailClosed = script.indexOf("renderFormalStatus(root, FAIL_CLOSED_FORMAL_STATUS, 'fail-closed')");
  const fetchCall = script.indexOf("fetch('public/pnp-status.json'");
  assert.ok(initialFailClosed >= 0 && initialFailClosed < fetchCall, 'fail-closed state must render before fetch');
  assert.match(script, /if \(!response\.ok\) throw new Error/);
  assert.match(script, /if \(!isConservativeFormalStatus\(payload\)\) throw new Error/);
  assert.match(script, /PNP status load failed closed/);
});
