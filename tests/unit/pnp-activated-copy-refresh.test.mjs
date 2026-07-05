import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('shared site script refreshes verify, FAQ, and review pages for activated theorem status', async () => {
  const script = await readText('assets/main.js');

  for (const fragment of [
    'function ensureActivatedVerificationCopy()',
    'Verify the activated P = NP theorem-emission status.',
    'Open activated status JSON',
    'Submit a verifier run',
    'npm run proof:public-theorem-activation',
    'function ensureActivatedFAQCopy()',
    'Activated theorem-status FAQ.',
    'Does the site now permit the theorem statement?',
    'externalReviewIsMathematicalPremise = false',
    'function ensureActivatedReviewCopy()',
    'Reviewer and verifier roles after activation.',
    'External review remains audit evidence.',
    'externalReviewAcceptanceRequiredForEmission = false',
    'function ensureActivatedPageCopy()',
    'ensureActivatedPageCopy();'
  ]) {
    assert.match(script, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing activated-copy fragment: ${fragment}`);
  }
});

test('verify, FAQ, and review pages load the shared activated-copy script', async () => {
  for (const page of ['verify.html', 'faq.html', 'review.html']) {
    const html = await readText(page);
    assert.match(html, /<script src="assets\/main\.js" defer><\/script>/, `${page} must load assets/main.js`);
  }
});

test('activated copy keeps external review as audit evidence rather than theorem premise', async () => {
  const script = await readText('assets/main.js');
  assert.match(script, /External review remains audit evidence and reproducibility evidence, not a theorem premise\./);
  assert.match(script, /independent review remains an audit layer/);
  assert.match(script, /rather than serve as a theorem premise/);
});
