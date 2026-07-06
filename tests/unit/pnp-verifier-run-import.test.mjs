import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import {
  ImportPNPActivatedRunRecord0,
  ValidatePNPActivatedRunRecord0,
  ValidatePNPVerificationRunRegistry0,
} from '../../tools/import-pnp-verifier-run.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

test('import tool validates the sample source-checker verifier run record', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const out = ValidatePNPActivatedRunRecord0(record);
  assert.equal(out.tag, 'accept');
  assert.equal(out.recordId, 'example-source-checker-run-2026-07-06');
  assert.equal(out.statusPayloadSha256, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
});

test('import tool validates current badge-ready registry and imports a new source-checker run with normalized digests', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');

  const registryCheck = ValidatePNPVerificationRunRegistry0(registry);
  assert.equal(registryCheck.tag, 'accept');
  assert.equal(registryCheck.runCount, 1);
  assert.equal(registry.version, 7);

  const imported = ImportPNPActivatedRunRecord0(registry, record, { syncedOn: '2026-07-06' });
  assert.equal(imported.tag, 'accept');
  assert.equal(imported.importedRecordId, 'example-source-checker-run-2026-07-06');
  assert.equal(imported.runCount, 2);
  assert.equal(imported.registry.version, 8);
  assert.equal(imported.registry.status, 'activated-verification-run-registry-imported');
  assert.equal(imported.registry.runs.at(-1).recordClass, 'source-checker-verifier-run');
  assert.equal(imported.registry.runs.at(-1).normalizedDigests.policy, 'PNPActivatedRunDigestNormalization0');
  assert.match(imported.registry.runs.at(-1).normalizedDigests.runRecordNormalizedSha256, /^[0-9a-f]{64}$/);
  assert.match(imported.normalizedDigests.artifactsOrLogsNormalizedSha256, /^[0-9a-f]{64}$/);
  assert.match(imported.registrySha256, /^[0-9a-f]{64}$/);
});

test('import tool rejects duplicate record identifiers', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const imported = ImportPNPActivatedRunRecord0(registry, record);
  assert.equal(imported.tag, 'accept');

  const duplicate = ImportPNPActivatedRunRecord0(imported.registry, record);
  assert.equal(duplicate.tag, 'reject');
  assert.equal(duplicate.coord, 'ImportRun.DuplicateRecordId');
});

test('import tool rejects records that do not run the source-checker verifier', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  record.commandsRun = ['npm test'];
  const out = ValidatePNPActivatedRunRecord0(record);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'RunRecord.CommandsMissingVerifier');
});

test('import tool rejects records with disabled theorem emission or non-empty blockers', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  record.verdict.publicTheoremEmissionAllowed = false;
  let out = ValidatePNPActivatedRunRecord0(record);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'RunRecord.VerdictField');

  record.verdict.publicTheoremEmissionAllowed = true;
  record.verdict.remainingBlockers = ['ExternalReview.Acceptance'];
  out = ValidatePNPActivatedRunRecord0(record);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'RunRecord.VerdictBlockers');
});

test('import tool rejects missing focused activation proof-script outputs', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  delete record.proofScriptOutputs['proof:public-theorem-activation'];
  const out = ValidatePNPActivatedRunRecord0(record);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'RunRecord.ProofScriptOutputKey');
});
