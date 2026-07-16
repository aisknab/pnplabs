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
    'PNP-LEAN-THEOREM-INVENTORY-2026-07-16-47',
    '7,418 exported public declarations',
    '3,473 theorem-kind declarations',
    '2,764 assumption-free theorem-kind declarations',
    'PNP.Concrete.FinalUniversalDesign.cnfSATInNP',
    'formulaBitSchedule_emit_eq_encodedFormula',
    'formulaBitSlotDirect_eq',
    'FormulaBitCursor.run_full_emit_eq_encodedFormula',
    'BuilderCompleteHeader.workRunExact',
    'FormulaWidth',
    'finalTokenBits_eq_encodedFormula_header',
    'external <code>NatPolynomial</code>',
    'formula body',
    'complete raw builder',
    'packaged polynomial reduction, CNF-SAT NP-completeness, CNF-SAT in P, and P = NP remain absent',
    'concretePublicationGate.passed = false',
    'Current nineteen-page report',
    '6 active',
    'Legacy JavaScript checker acceptance is historical assertion-record evidence only.',
    'View current status',
  ]) assert.equal(html.includes(fragment), true, `missing homepage fragment: ${fragment}`);
  assert.doesNotMatch(html, />Historical report</);
});

test('homepage enhancement removes stale upload and matrix badge elements', async () => {
  const script = await readText('assets/main.js');
  assert.match(script, /querySelectorAll\('\[data-homepage-matrix-summary\], \[data-homepage-one-command-upload\]'\)/);
  assert.match(script, /public\/pnp-verifier-run-matrix-summary\.json/);
  assert.match(script, /public\/pnp-one-command-upload\.json/);
  assert.doesNotMatch(script, /badge\.state = passing/);
  assert.doesNotMatch(script, /1 public run; 1\/1 required comparisons passing/);
});
