import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function section(text, heading) {
  const start = text.indexOf(heading);
  assert.notEqual(start, -1, `missing section: ${heading}`);
  const next = text.indexOf('\n## ', start + heading.length);
  return text.slice(start, next === -1 ? undefined : next);
}

function assertNonduplicatingCoreCommands(text, label) {
  const blocks = [...text.matchAll(/```bash\n([\s\S]*?)```/gu)].map((match) => match[1]);
  assert.equal(blocks.length, 1, `${label} must have one core command block`);
  const lines = blocks[0].split('\n').map((line) => line.trim()).filter(Boolean);
  for (const command of [
    'lake build PNP',
    'npm run check',
    'npm run pnp:verify -- --no-write',
    'npm run formal:inventory:check',
    'npm run report:check',
  ]) {
    assert.equal(lines.filter((line) => line === command).length, 1, `${label}: ${command}`);
  }
  for (const redundant of [
    'npm run validate',
    'npm test',
    'npm run formal:publication:check',
    'npm run legacy:v0:check',
  ]) {
    assert.equal(lines.includes(redundant), false, `${label}: ${redundant}`);
  }
  assert.equal(lines.some((line) => line.startsWith('node --test audits/')), false, label);
  assert.equal(lines.some((line) => line.startsWith('lake env lean ')), false, label);
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

test('current reviewer commands cover each core trust boundary without duplicate subtests', async () => {
  const [readme, currentCommands, reproducibility, packageJson] = await Promise.all([
    readText('README.md'),
    readText('docs/one_command_verify_upload.md'),
    readText('docs/reproducibility.md'),
    readJson('package.json'),
  ]);
  assertNonduplicatingCoreCommands(section(readme, '## Authoritative verification'), 'README');
  assertNonduplicatingCoreCommands(section(currentCommands, '## Current commands'), 'current commands');
  assertNonduplicatingCoreCommands(
    section(reproducibility, '## Core Lean Inventory Reproduction'),
    'reproducibility',
  );
  assert.equal(packageJson.scripts.test.includes('npm run verify:seal'), false);
  assert.equal(packageJson.scripts.test.includes('npm run examples:minimal'), false);
  assert.equal(packageJson.scripts.test.includes('test:audit-targets'), false);
  assert.equal(packageJson.scripts['repro:smoke'], 'npm run verify:seal && npm run examples:minimal');
});

test('review smoke runs once for pull requests and again only after merging to main', async () => {
  const workflow = await readText('.github/workflows/ci.yml');
  assert.match(
    workflow,
    /on:\n  push:\n    branches:\n      - main\n  pull_request:/u,
  );
  assert.doesNotMatch(workflow, /push:\n  pull_request:/u);
});

test('normal CI gives each publication contract one owning workflow', async () => {
  const [reviewSmoke, publicPayloads, exactPublication, upstreamStatus] = await Promise.all([
    readText('.github/workflows/ci.yml'),
    readText('.github/workflows/pnp-public-payloads.yml'),
    readText('.github/workflows/sync-public-access-report.yml'),
    readText('.github/workflows/pnp-upstream-status-consistency.yml'),
  ]);

  assert.doesNotMatch(reviewSmoke, /node --test tests\/unit\/pnp-public-payloads\.test\.mjs/u);
  assert.match(reviewSmoke, /tests\/unit\/pnp-public-payloads\.test\.mjs\|tests\/unit\/formal-publication-artifacts\*\.test\.mjs/u);
  assert.doesNotMatch(reviewSmoke, /npm run repro:smoke|npm run verify:seal/u);
  assert.match(reviewSmoke, /npm run examples:minimal/u);

  assert.match(publicPayloads, /node --test tests\/unit\/pnp-public-payloads\.test\.mjs/u);
  assert.match(exactPublication, /node tools\/sync-public-access-docs\.mjs --check/u);
  assert.match(exactPublication, /node --test tests\/unit\/formal-publication-artifacts\*\.test\.mjs/u);
  assert.doesNotMatch(exactPublication, /node tools\/verify-release-seal\.mjs|actual_pages=|sha256sum/u);

  assert.match(upstreamStatus, /on:\n  workflow_dispatch:/u);
  assert.doesNotMatch(upstreamStatus, /^  (?:pull_request|push):/mu);
});
