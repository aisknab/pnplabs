import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const TEXT_EXTENSIONS = new Set(['.html', '.js', '.json', '.md']);
const SKIP_DIRS = new Set(['.git', 'node_modules']);
const SKIP_FILES = new Set([
  'downloads/canonical_proof_report.tex',
  'downloads/SHA256SUMS',
  'downloads/SHA256SUMS.sha256',
  'docs/activated_claim_wording.md',
  'tests/unit/pnp-activated-overclaim-guard.test.mjs',
]);

const REQUIRED_ACTIVATED_FRAGMENTS = [
  'publicTheoremEmissionAllowed = true',
  'publicTheoremStatement = "P = NP"',
  'remainingBlockers = []',
  'externalReviewIsMathematicalPremise = false',
  'checker trust model',
];

const FORBIDDEN_POSITIVE_CLAIMS = [
  /independent\s+(external\s+)?consensus\s+(has\s+)?(accepted|verified|confirmed|proved|ratified)/i,
  /peer[-\s]?review(ed)?\s+(proof|acceptance|validation|confirmation)\s+(has\s+)?(accepted|verified|confirmed|proved)/i,
  /external\s+review\s+(proves|proved|confirms|confirmed|validates|validated)\s+(the\s+)?(theorem|proof|claim)/i,
  /external\s+review\s+is\s+(a\s+)?(mathematical\s+)?premise/i,
  /external\s+review\s+is\s+required\s+for\s+(theorem\s+)?emission/i,
  /reviewers?\s+are\s+vanity/i,
  /external\s+review\s+is\s+vanity/i,
  /ignore\s+external\s+reviewers?/i,
  /Clay\s+Prize\s+(awarded|won|secured|claimed)/i,
  /cures?\s+cancer/i,
  /guarantees?\s+(drug\s+discovery|protein\s+design|optimization\s+breakthroughs?)/i,
];

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    const rel = path.relative(root, abs).replaceAll(path.sep, '/');
    if (entry.isDirectory()) {
      out.push(...await collectFiles(abs));
      continue;
    }
    if (!entry.isFile()) continue;
    if (SKIP_FILES.has(rel)) continue;
    if (!TEXT_EXTENSIONS.has(path.extname(entry.name))) continue;
    const info = await stat(abs);
    if (info.size > 2_000_000) continue;
    out.push(rel);
  }
  return out.sort();
}

async function readText(rel) {
  return readFile(path.join(root, rel), 'utf8');
}

test('activated public surfaces keep checker-trust theorem wording and active status fragments', async () => {
  const surfaces = ['status.html', 'verify.html', 'faq.html', 'review.html', 'assets/main.js', 'README.md', 'docs/activated_claim_wording.md'];
  const joined = (await Promise.all(surfaces.map(readText))).join('\n');

  for (const fragment of REQUIRED_ACTIVATED_FRAGMENTS) {
    assert.match(joined, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing activated public wording fragment: ${fragment}`);
  }

  assert.match(joined, /External review remains audit evidence/i);
  assert.match(joined, /not a theorem premise/i);
});

test('machine-readable activated status does not use external review or historical prose as premises', async () => {
  const status = JSON.parse(await readText('public/pnp-status.json'));
  const index = JSON.parse(await readText('public/pnp-index.json'));

  assert.equal(status.kind, 'PNPActivatedStatus0');
  assert.equal(status.publicTheoremEmissionAllowed, true);
  assert.equal(status.publicTheoremStatement, 'P = NP');
  assert.equal(status.publicTheoremUnderCheckerTrustModel, true);
  assert.equal(status.externalReviewAcceptanceRequiredForEmission, false);
  assert.equal(status.externalReviewIsMathematicalPremise, false);
  assert.equal(status.historicalReportProseIsMathematicalPremise, false);
  assert.equal(status.publicSiteWordingIsMathematicalPremise, false);
  assert.deepEqual(status.remainingBlockers, []);

  assert.equal(index.claimBoundary.publicTheoremEmissionAllowed, true);
  assert.deepEqual(index.claimBoundary.remainingBlockers, []);
});

test('public text does not introduce forbidden activated-status overclaims', async () => {
  const files = await collectFiles(root);
  const failures = [];

  for (const rel of files) {
    const text = await readText(rel);
    for (const pattern of FORBIDDEN_POSITIVE_CLAIMS) {
      if (pattern.test(text)) failures.push(`${rel}: ${pattern}`);
    }
  }

  assert.deepEqual(failures, []);
});

test('legacy public-review blocker payloads are clearly separated from the activated status payload', async () => {
  const status = JSON.parse(await readText('public/pnp-status.json'));
  const legacyGate = JSON.parse(await readText('public/pnp-theorem-emission-gate.json'));
  const legacyReview = JSON.parse(await readText('public/pnp-external-review-status.json'));

  assert.equal(status.publicTheoremEmissionAllowed, true);
  assert.deepEqual(status.remainingBlockers, []);

  assert.equal(legacyGate.gate.gateIsActivationSurface, false);
  assert.equal(legacyGate.gate.publicTheoremEmissionAllowedByGate, false);
  assert.equal(legacyReview.externalReview.externalReviewAcceptanceClaimed, false);
  assert.equal(legacyReview.externalReview.publicTheoremEmissionAllowedByExternalReview, false);
});
