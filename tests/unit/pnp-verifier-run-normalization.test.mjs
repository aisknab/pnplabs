import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import {
  AttachPNPActivatedRunRecordDigests0,
  ComputePNPActivatedRunRecordDigests0,
  NormalizeVerifierLogText0,
} from '../../tools/normalize-pnp-verifier-run.mjs';
import { ImportPNPActivatedRunRecord0 } from '../../tools/import-pnp-verifier-run.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test('verifier log normalization strips timestamps, CRLF, blanks, and trailing whitespace', () => {
  const raw = '2026-07-06T10:00:00.000Z tag: accept  \r\n\r\n[00:01.23] activated = true   \n';
  assert.equal(NormalizeVerifierLogText0(raw), 'tag: accept\nactivated = true');
});

test('run digest normalization is stable across raw CI log formatting differences', async () => {
  const a = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const b = clone(a);

  a.artifactsOrLogs = [{ kind: 'raw-ci-log', rawLog: '2026-07-06T10:00:00.000Z tag: accept  \r\n[00:01.23] activated = true\n' }];
  b.artifactsOrLogs = [{ kind: 'raw-ci-log', rawLog: 'tag: accept\nactivated = true\n\n' }];

  const da = ComputePNPActivatedRunRecordDigests0(a);
  const db = ComputePNPActivatedRunRecordDigests0(b);

  assert.equal(da.tag, 'accept');
  assert.equal(db.tag, 'accept');
  assert.equal(da.artifactsOrLogsNormalizedSha256, db.artifactsOrLogsNormalizedSha256);
  assert.equal(da.runRecordNormalizedSha256, db.runRecordNormalizedSha256);
});

test('normalizer attaches all required digest fields to a source-checker verifier record', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const out = AttachPNPActivatedRunRecordDigests0(record);

  assert.equal(out.tag, 'accept');
  assert.equal(out.normalizedDigests.policy, 'PNPActivatedRunDigestNormalization0');
  for (const key of [
    'runRecordNormalizedSha256',
    'verdictNormalizedSha256',
    'activatedStatusNormalizedSha256',
    'proofScriptOutputsNormalizedSha256',
    'artifactsOrLogsNormalizedSha256',
  ]) {
    assert.match(out.normalizedDigests[key], /^[0-9a-f]{64}$/);
  }
});

test('import tool stores normalized digests on imported source-checker records', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const imported = ImportPNPActivatedRunRecord0(registry, record, { syncedOn: '2026-07-06' });

  assert.equal(imported.tag, 'accept');
  assert.equal(imported.normalizedDigests.policy, 'PNPActivatedRunDigestNormalization0');
  assert.match(imported.normalizedDigests.runRecordNormalizedSha256, /^[0-9a-f]{64}$/);
  assert.equal(imported.registry.runs.at(-1).recordId, record.recordId);
  assert.equal(imported.registry.runs.at(-1).normalizedDigests.policy, 'PNPActivatedRunDigestNormalization0');
  assert.match(imported.registry.runs.at(-1).normalizedDigests.artifactsOrLogsNormalizedSha256, /^[0-9a-f]{64}$/);
});
