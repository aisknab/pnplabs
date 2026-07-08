import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('one-command upload payload exposes the simple verifier flow and issue ingest workflow', async () => {
  const payload = await readJson('public/pnp-one-command-upload.json');

  assert.equal(payload.kind, 'PNPOneCommandVerifierUpload0');
  assert.equal(payload.version, 1);
  assert.equal(payload.status, 'one-command-verifier-upload-and-issue-ingest-ready');
  assert.ok(payload.primaryCommand.includes('npm run verify'));
  assert.equal(payload.interactivePrompt, 'Upload verification run to PNP Labs? [y/N]');
  assert.deepEqual(payload.yesAnswers, ['y', 'yes']);
  assert.equal(payload.nonInteractiveCommand, 'PNPLABS_UPLOAD_TOKEN=<github-token> npm run pnp:verify:upload');
  assert.ok(payload.automaticUploadCredentials.includes('PNPLABS_UPLOAD_TOKEN'));
  assert.ok(payload.automaticUploadCredentials.includes('authenticated GitHub CLI gh'));
  assert.ok(payload.manualFallbackOutputs.includes('artifacts/pnplabs-upload/latest-issue-body.md'));
  assert.equal(payload.issueIngestWorkflow.status, 'ready');
  assert.equal(payload.issueIngestWorkflow.workflow, '.github/workflows/pnp-verification-run-issue-ingest.yml');
  assert.equal(payload.issueIngestWorkflow.extractor, 'tools/extract-pnp-verification-run-from-issue.mjs');
  assert.equal(payload.issueIngestWorkflow.opensRegistryUpdatePullRequest, true);
  assert.equal(payload.issueIngestWorkflow.importsRegistryRecord, true);
  assert.equal(payload.issueIngestWorkflow.regeneratesComparisonMatrix, true);
  assert.equal(payload.submittedRecordKind, 'PNPActivatedVerificationRunRecord0');
  assert.equal(payload.claimBoundary.publicTheoremEmissionAllowed, true);
  assert.equal(payload.claimBoundary.publicTheoremStatement, 'P = NP');
  assert.deepEqual(payload.claimBoundary.remainingBlockers, []);
  assert.equal(payload.claimBoundary.externalReviewIsMathematicalPremise, false);
});

test('payload index advertises one-command upload as the default verifier command', async () => {
  const index = await readJson('public/pnp-index.json');
  assert.equal(index.version, 5);
  assert.equal(index.verificationCommand, 'npm run verify');
  assert.equal(index.uploadPrompt, 'Upload verification run to PNP Labs? [y/N]');
  assert.equal(index.oneCommandUploadPayload, '/public/pnp-one-command-upload.json');
  assert.ok(index.payloads.some((entry) => entry.path === '/public/pnp-one-command-upload.json'));
});

test('public pages and issue template surface the one-command upload and registry PR flow', async () => {
  const joined = [
    await readText('README.md'),
    await readText('status.html'),
    await readText('verification-runs.html'),
    await readText('assets/main.js'),
    await readText('.github/ISSUE_TEMPLATE/pnp-verification-run.yml'),
    await readText('docs/one_command_verify_upload.md'),
  ].join('\n');

  for (const fragment of [
    'git clone https://github.com/aisknab/pnp.git',
    'npm ci',
    'npm run verify',
    'Upload verification run to PNP Labs? [y/N]',
    'Type `y` or `yes`',
    'PNPLABS_UPLOAD_TOKEN',
    'artifacts/pnplabs-upload/latest-issue-body.md',
    'public/pnp-one-command-upload.json',
    'PNPActivatedVerificationRunRecord0',
    'issue created -> registry PR opened',
    'tools/extract-pnp-verification-run-from-issue.mjs'
  ]) {
    assert.equal(joined.includes(fragment), true, `missing one-command upload fragment: ${fragment}`);
  }
});

test('one-command upload copy keeps run evidence separate from external consensus', async () => {
  const joined = [
    await readText('public/pnp-one-command-upload.json'),
    await readText('docs/one_command_verify_upload.md'),
    await readText('.github/ISSUE_TEMPLATE/pnp-verification-run.yml'),
  ].join('\n');

  assert.match(joined, /not an external-consensus claim or peer-review acceptance/);
  assert.match(joined, /External review remains audit evidence and not a mathematical premise/);
  assert.doesNotMatch(joined, /external\s+review\s+is\s+(a\s+)?(mathematical\s+)?premise/i);
});
