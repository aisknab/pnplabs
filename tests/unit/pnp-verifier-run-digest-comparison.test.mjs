import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { ComparePNPActivatedRunRecords0 } from '../../tools/compare-pnp-verifier-runs.mjs';
import { AttachPNPActivatedRunRecordDigests0 } from '../../tools/normalize-pnp-verifier-run.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test('digest policy is labelled frozen historical metadata', async () => {
  const payload = await readJson('public/pnp-verifier-run-digest-comparison.json');
  assert.equal(payload.kind, 'PNPVerifierRunDigestComparison0');
  assert.equal(payload.status, 'historical-verifier-run-digest-comparison-frozen');
  assert.equal(payload.historical, true);
  assert.equal(payload.intakeFrozen, true);
  assert.equal(payload.historicalClaimBoundaryRequiredValues.publicTheoremEmissionAllowed, true);
  assert.equal(payload.currentClaimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(payload.currentClaimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(payload.currentClaimBoundary.publicTheoremStatement, null);
  assert.equal(payload.currentClaimBoundary.finalTheoremReady, false);
  assert.match(payload.nonClaims.join('\n'), /not current theorem-status evidence/);
});

test('historical digest utility still compares identical archived records', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const left = AttachPNPActivatedRunRecordDigests0(record).record;
  const right = AttachPNPActivatedRunRecordDigests0(clone(record)).record;
  const out = ComparePNPActivatedRunRecords0(left, right);
  assert.equal(out.tag, 'accept');
  assert.deepEqual(out.requiredMismatches, []);
  assert.equal(out.allDigestKeysMatch, true);
});

test('historical digest utility rejects changed archived checker output', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const changed = clone(record);
  changed.proofScriptOutputs['proof:public-theorem-activation'] = 'changed historical output';
  const out = ComparePNPActivatedRunRecords0(
    AttachPNPActivatedRunRecordDigests0(record).record,
    AttachPNPActivatedRunRecordDigests0(changed).record,
  );
  assert.equal(out.tag, 'reject');
  assert.deepEqual(out.requiredMismatches, ['proofScriptOutputsNormalizedSha256']);
});

test('digest page states that comparison cannot establish the theorem', async () => {
  const html = await readFile(new URL('../../verifier-run-digests.html', import.meta.url), 'utf8');
  for (const fragment of [
    'Verifier-run digest comparisons are frozen.',
    'publicTheoremEmissionAllowed = false',
    'badge.state = "historical"',
    'badge.tone = "neutral"',
    'currentStatusBadge = false',
    'It does not verify the truth of an assertion',
  ]) assert.equal(html.includes(fragment), true, `missing historical digest fragment: ${fragment}`);
});
