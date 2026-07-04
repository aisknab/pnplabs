import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const publicSurfaces = [
  'index.html',
  'status.html',
  'paper.html',
  'architecture.html',
  'verify.html',
  'faq.html',
  'review.html',
  'assets/main.js',
  'public/pnp-index.json',
  'public/pnp-status.json',
  'public/pnp-public-review.json',
  'public/pnp-theorem-emission-gate.json',
  'public/pnp-external-review-status.json'
];

const forbiddenPatterns = [
  {
    id: 'direct-this-paper-proves-pnp',
    pattern: /This paper proves\s+P\s*=\s*NP/i
  },
  {
    id: 'solved-language',
    pattern: /P\s*=\s*NP\s+is\s+solved/i
  },
  {
    id: 'public-emission-text-true',
    pattern: /publicTheoremEmissionAllowed\s*=\s*true/i
  },
  {
    id: 'public-emission-json-true',
    pattern: /"publicTheoremEmissionAllowed"\s*:\s*true/i
  },
  {
    id: 'final-theorem-ready-text-true',
    pattern: /finalTheoremReady\s*=\s*true/i
  },
  {
    id: 'final-theorem-ready-json-true',
    pattern: /"finalTheoremReady"\s*:\s*true/i
  },
  {
    id: 'external-review-accepted-json-true',
    pattern: /"externalReviewAcceptanceClaimed"\s*:\s*true/i
  },
  {
    id: 'independent-review-confirmed-json-true',
    pattern: /"independentReviewAcceptanceConfirmed"\s*:\s*true/i
  },
  {
    id: 'gate-passed-json-true',
    pattern: /"publicTheoremEmissionGatePassed"\s*:\s*true/i
  },
  {
    id: 'historical-accepted-boundary-prose',
    pattern: /Accepted proof-report boundary/i
  }
];

const requiredBoundaryFragments = [
  'publicTheoremEmissionAllowed = false',
  'finalTheoremReady = false',
  'Release.UnrestrictedFinalSoundness',
  'ExternalReview.Acceptance'
];

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('public site surfaces avoid direct theorem-emission overclaims', async () => {
  for (const path of publicSurfaces) {
    const text = await readText(path);
    for (const { id, pattern } of forbiddenPatterns) {
      assert.doesNotMatch(text, pattern, `${path}: forbidden public overclaim pattern ${id}`);
    }
  }
});

test('status-bearing public surfaces retain the non-activation boundary', async () => {
  const statusBearingPaths = [
    'status.html',
    'assets/main.js',
    'public/pnp-index.json',
    'public/pnp-status.json',
    'public/pnp-public-review.json',
    'public/pnp-theorem-emission-gate.json',
    'public/pnp-external-review-status.json'
  ];

  for (const path of statusBearingPaths) {
    const text = await readText(path);
    for (const fragment of requiredBoundaryFragments) {
      assert.match(text, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${path}: missing boundary fragment ${fragment}`);
    }
  }
});

test('historical report artifacts are deliberately excluded from this public-surface guard', () => {
  const excludedExamples = [
    'downloads/canonical_proof_report.pdf',
    'downloads/canonical_proof_report.tex',
    'downloads/canonical-proof-report.tex'
  ];

  for (const excluded of excludedExamples) {
    assert.equal(publicSurfaces.includes(excluded), false, `${excluded} must remain outside the active public-surface scan`);
  }
});
