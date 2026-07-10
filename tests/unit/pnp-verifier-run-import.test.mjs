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

test('historical record validator can still inspect the archived schema', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const out = ValidatePNPActivatedRunRecord0(record);
  assert.equal(out.tag, 'accept');
  assert.equal(out.recordId, 'example-source-checker-run-2026-07-06');
});

test('frozen historical registry validates but rejects all new imports', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const before = JSON.stringify(registry);
  const registryCheck = ValidatePNPVerificationRunRegistry0(registry);
  assert.equal(registryCheck.tag, 'accept');
  assert.equal(registryCheck.runCount, 1);
  const imported = ImportPNPActivatedRunRecord0(registry, record);
  assert.equal(imported.tag, 'reject');
  assert.equal(imported.coord, 'ImportRun.IntakeFrozen');
  assert.equal(JSON.stringify(registry), before, 'rejected import must not mutate registry');
});

test('registry validation rejects an unfrozen status', async () => {
  const registry = await readJson('public/pnp-verification-runs.json');
  registry.intakeFrozen = false;
  const out = ValidatePNPVerificationRunRegistry0(registry);
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'Registry.Status');
});

test('historical record validator still rejects malformed old records', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  record.commandsRun = ['npm test'];
  let out = ValidatePNPActivatedRunRecord0(record);
  assert.equal(out.coord, 'RunRecord.CommandsMissingVerifier');

  const record2 = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  record2.verdict.remainingBlockers = ['unexpected'];
  out = ValidatePNPActivatedRunRecord0(record2);
  assert.equal(out.coord, 'RunRecord.VerdictBlockers');
});
