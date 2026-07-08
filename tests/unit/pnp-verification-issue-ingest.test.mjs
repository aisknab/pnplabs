import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import {
  BuildPNPVerifierRunImportPath0,
  ExtractPNPActivatedRunRecordFromIssueBody0,
  ExtractPNPActivatedRunRecordFromIssueEvent0,
} from '../../tools/extract-pnp-verification-run-from-issue.mjs';
import { ValidatePNPActivatedRunRecord0 } from '../../tools/import-pnp-verifier-run.mjs';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

function issueBodyWithRecord(record) {
  return `## PNP activated verification run\n\nSome generated issue text.\n\n### Importable run record\n\n\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\`\n`;
}

test('issue ingest extracts an importable activated verifier run record from generated issue body', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const out = ExtractPNPActivatedRunRecordFromIssueBody0(issueBodyWithRecord(record));

  assert.equal(out.tag, 'accept');
  assert.equal(out.recordId, 'example-source-checker-run-2026-07-06');
  assert.equal(out.record.kind, 'PNPActivatedVerificationRunRecord0');
  assert.equal(ValidatePNPActivatedRunRecord0(out.record).tag, 'accept');
});

test('issue ingest extracts issue metadata with the verifier run record', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const event = {
    issue: {
      number: 123,
      title: 'PNP activated verification run: Example 2026-07-06',
      html_url: 'https://github.com/aisknab/pnplabs/issues/123',
      body: issueBodyWithRecord(record),
    },
  };

  const out = ExtractPNPActivatedRunRecordFromIssueEvent0(event);
  assert.equal(out.tag, 'accept');
  assert.equal(out.issueNumber, 123);
  assert.equal(out.issueUrl, 'https://github.com/aisknab/pnplabs/issues/123');
  assert.equal(out.recordId, 'example-source-checker-run-2026-07-06');
});

test('issue ingest builds safe import paths from record identifiers', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  const out = BuildPNPVerifierRunImportPath0(record, 'imports/pnp-verifier-runs');
  assert.equal(out.tag, 'accept');
  assert.equal(out.path, 'imports/pnp-verifier-runs/example-source-checker-run-2026-07-06.json');
});

test('issue ingest rejects unsafe record identifiers before writing import paths', async () => {
  const out = BuildPNPVerifierRunImportPath0({ recordId: '../bad' }, 'imports/pnp-verifier-runs');
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'ImportPath.UnsafeRecordId');
});

test('issue ingest rejects issue bodies without an importable verifier record', () => {
  const out = ExtractPNPActivatedRunRecordFromIssueBody0('```json\n{"kind":"Other"}\n```');
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'IssueBody.NoRunRecord');
});

test('issue ingest rejects malformed activated run records with validator details', async () => {
  const record = await readJson('tests/fixtures/pnp-activated-verifier-run.import.json');
  record.verdict.remainingBlockers = ['ExternalReview.Acceptance'];
  const out = ExtractPNPActivatedRunRecordFromIssueBody0(issueBodyWithRecord(record));
  assert.equal(out.tag, 'reject');
  assert.equal(out.coord, 'IssueBody.InvalidRunRecord');
  assert.equal(out.witness.validation.coord, 'RunRecord.VerdictBlockers');
});
