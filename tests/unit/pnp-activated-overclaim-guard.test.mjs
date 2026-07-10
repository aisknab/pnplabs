import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const CURRENT_SURFACES = [
  'README.md',
  'index.html',
  'status.html',
  'paper.html',
  'architecture.html',
  'verify.html',
  'faq.html',
  'review.html',
  'verification-runs.html',
  'verifier-run-digests.html',
  'assets/main.js',
  'public/pnp-status.json',
  'public/pnp-index.json',
];

test('current public surfaces do not publish the superseded activated boundary', async () => {
  const joined = (await Promise.all(CURRENT_SURFACES.map(readText))).join('\n');
  for (const forbidden of [
    'publicTheoremEmissionAllowed = true',
    'publicTheoremStatement = "P = NP"',
    'finalTheoremReady = true',
    'badge.state = passing',
    'public theorem emission is activated',
    'Public theorem emission is now enabled',
  ]) assert.equal(joined.includes(forbidden), false, `current surface contains superseded claim: ${forbidden}`);
});

test('current public surfaces consistently deny theorem establishment', async () => {
  const joined = (await Promise.all(CURRENT_SURFACES.map(readText))).join('\n');
  for (const required of [
    'formal-reconstruction-in-progress',
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
    'rootLeanTheoremPresent',
    'projectSpecificAxiomsRemaining',
    'does not currently establish P = NP',
  ]) assert.equal(joined.includes(required), true, `missing conservative wording: ${required}`);
});

test('historical checker evidence is never described as mathematical proof', async () => {
  const joined = (await Promise.all([
    readText('README.md'),
    readText('status.html'),
    readText('verification-runs.html'),
    readText('public/pnp-status.json'),
  ])).join('\n');
  assert.match(joined, /assertion[- ](?:bearing records|checker evidence)/i);
  assert.match(joined, /not (?:a )?(?:formal )?proof/i);
  assert.match(joined, /External review is optional audit evidence/i);
  assert.match(joined, /not a mathematical premise or release blocker/i);
});
