import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('homepage publishes the conservative current theorem boundary', async () => {
  const html = await readText('index.html');
  for (const fragment of [
    'The repository does not currently establish P = NP.',
    'data-formal-status-root',
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'finalTheoremReady = false',
    'rootLeanTheoremAxiomAuditPassed = false',
    'projectSpecificAxiomsRemaining = true',
    'Four project axioms and six blockers remain',
    'PNP-LEAN-THEOREM-INVENTORY-2026-07-22-69',
    '10,207 exported public declarations',
    '5,600 theorem-kind declarations',
    '3,294 assumption-free theorem-kind declarations',
    'PNP.Concrete.FinalUniversalDesign.cnfSATInNP',
    'BuilderFirstConstraintPaddingRun.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 36))',
    'remaining empty token opportunities in the first scheduled constraint without emitting a token',
    'Sep</code> beginning the second scheduled constraint',
    'remaining formula body',
    'complete raw builder',
    'packaged polynomial reduction, CNF-SAT NP-completeness, CNF-SAT in P, and P = NP remain absent',
    'concretePublicationGate.passed = false',
    'Current forty-five-page report',
    '6 active',
    'Legacy JavaScript checker acceptance is historical assertion-record evidence only.',
    'View current status',
  ]) assert.equal(html.includes(fragment), true, `missing homepage fragment: ${fragment}`);
  assert.doesNotMatch(html, />Historical report</);
});

test('homepage keeps the full theorem boundary collapsed by default', async () => {
  const html = await readText('index.html');
  assert.match(html,
    /<details class="boundary-panel" data-formal-status-root data-status-state="fail-closed">/u);
  assert.match(html,
    /<summary class="boundary-head">\s*<span>Current theorem boundary · gate closed · 6 blockers<\/span>/u);
  assert.doesNotMatch(html,
    /<details class="boundary-panel"[^>]*\sopen(?:\s|=|>)/u);
  assert.match(html,
    /data-formal-status-fields[\s\S]*data-formal-status-note[\s\S]*<\/details>/u);
});

test('homepage enhancement removes stale upload and matrix badge elements', async () => {
  const script = await readText('assets/main.js');
  assert.match(script, /querySelectorAll\('\[data-homepage-matrix-summary\], \[data-homepage-one-command-upload\]'\)/);
  assert.match(script, /public\/pnp-verifier-run-matrix-summary\.json/);
  assert.match(script, /public\/pnp-one-command-upload\.json/);
  assert.doesNotMatch(script, /badge\.state = passing/);
  assert.doesNotMatch(script, /1 public run; 1\/1 required comparisons passing/);
});
