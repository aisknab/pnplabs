import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

test('former one-command activated-run upload is frozen', async () => {
  const payload = await readJson('public/pnp-one-command-upload.json');
  assert.equal(payload.kind, 'PNPOneCommandVerifierUpload0');
  assert.equal(payload.version, 2);
  assert.equal(payload.status, 'historical-activated-run-upload-frozen');
  assert.equal(payload.historical, true);
  assert.equal(payload.intakeFrozen, true);
  assert.equal(payload.automaticUploadEnabled, false);
  assert.equal(payload.issueIngestWorkflow.status, 'disabled-and-frozen');
  assert.equal(payload.issueIngestWorkflow.acceptsNewRecords, false);
  assert.equal(payload.issueIngestWorkflow.opensRegistryUpdatePullRequest, false);
  assert.equal(payload.currentClaimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(payload.currentClaimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(payload.currentClaimBoundary.publicTheoremStatement, null);
  assert.equal(payload.currentClaimBoundary.finalTheoremReady, false);
  assert.equal(payload.currentClaimBoundary.projectSpecificAxiomsRemaining, true);
});

test('activated verification-run issue template has been removed', async () => {
  await assert.rejects(
    access(new URL('../../.github/ISSUE_TEMPLATE/pnp-verification-run.yml', import.meta.url), constants.F_OK),
    { code: 'ENOENT' },
  );
});

test('issue-ingest workflow has no issue trigger and only confirms the freeze', async () => {
  const workflow = await readFile(new URL('../../.github/workflows/pnp-verification-run-issue-ingest.yml', import.meta.url), 'utf8');
  assert.doesNotMatch(workflow, /^\s*issues:/m);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /intakeFrozen/);
  assert.match(workflow, /automaticUploadEnabled/);
  assert.doesNotMatch(workflow, /peter-evans\/create-pull-request/);
});
