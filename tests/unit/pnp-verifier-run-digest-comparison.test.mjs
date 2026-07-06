import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { ComparePNPActivatedRunRecords0 } from '../../tools/compare-pnp-verifier-runs.mjs';
import { AttachPNPActivatedRunRecordDigests0 } from '../../tools/normalize-pnp-verifier-run.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test('digest comparison payload exposes normalized comparison policy', async () => {
  const payload = await readJson('public/pnp-verifier-run-digest-comparison.json');

  assert.equal(payload.kind, 'PNPVerifierRunDigestComparison0');
  assert.equal(payload.status, 'verifier-run-digest-comparison-ready');
  assert.equal(payload.page, 'verifier-run-digests.html');
  assert.equal(payload.tool, 'tools/compare-pnp-verifier-runs.mjs');
  assert.ok(payload.defaultRequiredDigestKeys.includes('verdictNormalizedSha256'));
  assert.ok(payload.defaultRequiredDigestKeys.includes('activatedStatusNormalizedSha256'));
  assert.ok(payload.defaultRequiredDigestKeys.includes('proofScriptOutputsNormalizedSha256'));
  assert.equal(payload.claimBoundaryRequiredValues.publicTheoremEmissionAllowed, true);
  assert.equal(payload.claimBoundaryRequiredValues.publicTheoremStatement, 'P = NP');
  assert.deepEqual(payload.claimBoundaryRequiredValues.remainingBlockers, []);
  assert.equal(payload.claimBoundaryRequiredValues.externalReviewIsMathematicalPremise, false);
});

test('digest comparison accepts identical activated source-checker run records', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const left = AttachPNPActivatedRunRecordDigests0(record).record;
  const right = AttachPNPActivatedRunRecordDigests0(clone(record)).record;

  const out = ComparePNPActivatedRunRecords0(left, right);
  assert.equal(out.tag, 'accept');
  assert.equal(out.policy, 'PNPVerifierRunDigestComparison0');
  assert.deepEqual(out.requiredMismatches, []);
  assert.equal(out.allDigestKeysMatch, true);
  assert.equal(out.comparisons.verdictNormalizedSha256.match, true);
  assert.equal(out.comparisons.activatedStatusNormalizedSha256.match, true);
  assert.equal(out.comparisons.proofScriptOutputsNormalizedSha256.match, true);
  assert.match(out.comparisonSha256, /^[0-9a-f]{64}$/);
});

test('digest comparison rejects mismatched activated proof-script outputs by default', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const left = AttachPNPActivatedRunRecordDigests0(record).record;
  const changed = clone(record);
  changed.proofScriptOutputs['proof:public-theorem-activation'] = 'accept: changed coordinate for test';
  const right = AttachPNPActivatedRunRecordDigests0(changed).record;

  const out = ComparePNPActivatedRunRecords0(left, right);
  assert.equal(out.tag, 'reject');
  assert.deepEqual(out.requiredMismatches, ['proofScriptOutputsNormalizedSha256']);
  assert.equal(out.comparisons.proofScriptOutputsNormalizedSha256.match, false);
});

test('digest comparison rejects disabled theorem emission before comparing digests', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const bad = clone(record);
  bad.verdict.publicTheoremEmissionAllowed = false;

  const out = ComparePNPActivatedRunRecords0(record, bad);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'CompareRun.VerdictField');
});

test('registry exposes the digest comparison workflow and page', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  assert.equal(registry.version, 5);
  assert.equal(registry.status, 'activated-verification-run-registry-comparison-ready');
  assert.equal(registry.comparisonWorkflow.status, 'ready');
  assert.equal(registry.comparisonWorkflow.tool, 'tools/compare-pnp-verifier-runs.mjs');
  assert.equal(registry.comparisonWorkflow.page, 'verifier-run-digests.html');
  assert.equal(registry.comparisonWorkflow.payload, 'public/pnp-verifier-run-digest-comparison.json');
  assert.equal(registry.comparisonWorkflow.externalReviewIsMathematicalPremise, false);
});

test('verifier-run digest comparison page documents the comparison command and boundary', async () => {
  const html = await readText('verifier-run-digests.html');
  for (const fragment of [
    'Compare activated verifier runs by normalized digest.',
    'npm run pnp:compare-runs -- --json',
    'verdictNormalizedSha256',
    'activatedStatusNormalizedSha256',
    'proofScriptOutputsNormalizedSha256',
    'artifactsOrLogsNormalizedSha256',
    'runRecordNormalizedSha256',
    'publicTheoremEmissionAllowed = true',
    'publicTheoremStatement = "P = NP"',
    'remainingBlockers = []',
    'externalReviewIsMathematicalPremise = false',
    'public/pnp-verifier-run-digest-comparison.json',
    'tools/compare-pnp-verifier-runs.mjs'
  ]) {
    assert.equal(html.includes(fragment), true, `missing digest page fragment: ${fragment}`);
  }
});
