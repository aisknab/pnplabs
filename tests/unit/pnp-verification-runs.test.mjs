import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
}

function assertActivatedBoundary(boundary, label) {
  assert.equal(boundary.publicTheoremEmissionAllowed, true, `${label}: theorem emission must be activated`);
  assert.equal(boundary.publicTheoremStatement, 'P = NP', `${label}: theorem statement mismatch`);
  assert.equal(boundary.publicTheoremConclusion, 'P = NP', `${label}: theorem conclusion mismatch`);
  assert.equal(boundary.publicTheoremUnderCheckerTrustModel, true, `${label}: checker-trust flag mismatch`);
  assert.equal(boundary.finalTheoremReady, true, `${label}: final theorem must be ready`);
  assert.equal(boundary.internalFinalTheoremReady, true, `${label}: internal theorem must be ready`);
  assert.equal(boundary.unrestrictedFinalSoundnessDischarged, true, `${label}: unrestricted final soundness must be discharged`);
  assert.equal(boundary.externalReviewIsMathematicalPremise, false, `${label}: external review must not be a theorem premise`);
  assert.deepEqual(boundary.remainingBlockers, [], `${label}: blockers must be empty`);
}

test('verification run registry is seeded, import-ready, and activated-status aware', async () => {
  const payload = await readJson('public/pnp-verification-runs.json');
  assert.equal(payload.kind, 'PNPLabsPNPVerificationRunRegistry0');
  assert.equal(payload.version, 3);
  assert.equal(payload.status, 'activated-verification-run-registry-import-ready');
  assert.equal(payload.sourceRepository, 'https://github.com/aisknab/pnp');
  assertActivatedBoundary(payload.claimBoundary, 'verification run registry');
  assert.equal(payload.runs.length, 1);
  assert.ok(payload.primaryCommand.includes('npm run pnp:verify'));
  assert.ok(payload.focusedActivationCommands.includes('npm run proof:activated-pnp-status'));
  assert.ok(payload.acceptedRunRecordFields.includes('pnpCommit'));
  assert.ok(payload.acceptedRunRecordFields.includes('verdictTag'));
  assert.ok(payload.acceptedRunRecordFields.includes('activatedStatusCoordinate'));
  assert.ok(payload.acceptedRunRecordFields.includes('proofScriptOutputs'));
  assert.equal(payload.statusPayload.coordinate, 'PNP-ACTIVATED-STATUS-2026-07-05-01');
  assert.equal(payload.statusPayload.publicTheoremActivationCoordinate, 'PNP-PUBLIC-THEOREM-ACTIVATION-2026-07-05-01');
  assert.equal(payload.importWorkflow.status, 'ready');
  assert.equal(payload.importWorkflow.tool, 'tools/import-pnp-verifier-run.mjs');
  assert.equal(payload.importWorkflow.ciWorkflow, '.github/workflows/pnp-verifier-run-import.yml');
  assert.ok(payload.importWorkflow.acceptedRecordClasses.includes('source-checker-verifier-run'));
  assert.equal(payload.importWorkflow.requiresFocusedProofScriptOutputs, true);
});

test('first-party CI run record binds successful site status workflows', async () => {
  const payload = await readJson('public/pnp-verification-runs.json');
  const run = payload.runs[0];

  assert.equal(run.kind, 'PNPActivatedVerificationRunRecord0');
  assert.equal(run.recordId, 'pnplabs-ci-pr16-2026-07-06');
  assert.equal(run.recordClass, 'first-party-site-ci-status-mirror');
  assert.equal(run.runnerNameOrHandle, 'PNP Labs GitHub Actions');
  assert.equal(run.pnpCommit, '42f66cce45f5db0cdb48e3d99d2aa2ae3d830ee8');
  assert.equal(run.pnplabsCommit, '615cbec06f2cb90408941815c4e2efe53b2a4a49');
  assert.equal(run.verdict.tag, 'accept');
  assert.equal(run.verdict.publicTheoremEmissionAllowed, true);
  assert.equal(run.verdict.publicTheoremStatement, 'P = NP');
  assert.deepEqual(run.verdict.remainingBlockers, []);
  assert.equal(run.activatedStatus.coordinate, 'PNP-ACTIVATED-STATUS-2026-07-05-01');
  assert.equal(run.activatedStatus.externalReviewIsMathematicalPremise, false);

  const successfulWorkflows = new Set(run.artifactsOrLogs.filter((entry) => entry.conclusion === 'success').map((entry) => entry.workflow));
  for (const workflow of ['review-smoke', 'pnp-public-payloads', 'pnp-upstream-status-consistency']) {
    assert.ok(successfulWorkflows.has(workflow), `missing successful workflow evidence: ${workflow}`);
  }

  assert.match(run.nonClaims.join('\n'), /not a clean-room source\/checker reproduction/);
  assert.match(run.nonClaims.join('\n'), /not an external-consensus claim/);
});

test('verification run page invites activated source checker runs, import workflow, and shows seed record', async () => {
  const html = await readFile(new URL('../../verification-runs.html', import.meta.url), 'utf8');
  for (const fragment of [
    'Activated verification run registry',
    'git clone https://github.com/aisknab/pnp.git',
    'npm run pnp:verify',
    'npm run proof:activated-pnp-status',
    'npm run pnp:import-run',
    'tools/import-pnp-verifier-run.mjs',
    'imports/pnp-verifier-runs/',
    'public/pnp-verification-runs.json',
    'publicTheoremEmissionAllowed = true',
    'publicTheoremStatement = "P = NP"',
    'unrestrictedFinalSoundnessDischarged = true',
    'remainingBlockers = []',
    'externalReviewIsMathematicalPremise = false',
    'pnplabs-ci-pr16-2026-07-06'
  ]) {
    assert.match(html, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing fragment: ${fragment}`);
  }
});

test('status page links the verification run registry', async () => {
  const html = await readFile(new URL('../../status.html', import.meta.url), 'utf8');
  assert.match(html, /verification-runs\.html/);
  assert.match(html, /public\/pnp-verification-runs\.json/);
});
