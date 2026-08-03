import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('homepage leads with a plain, conservative result and the latest milestone', async () => {
  const html = await readText('index.html');
  for (const fragment of [
    'A machine-checked reconstruction of a proposed route to P = NP.',
    'Current result: P = NP is not established.',
    '<strong>P versus NP</strong> asks whether problems with answers that can be checked efficiently can also be solved efficiently.',
    '<strong>Lean</strong> is software that checks each stated mathematical step.',
    'one fixed, inspectable machine that performs that translation for every possible input',
    'malformed inputs stop safely and produce no result',
    'compiledMachineOutput_eq_compileEncodedCNFToNAND',
    'cnfToNANDPolynomialTimeFunction_output',
    'cnfSAT_reducesTo_encodedNANDSAT',
    'cnfSAT_reducesTo_encodedLockedNANDThreshold',
    'work grows at a polynomial rate with the input size',
    'no deterministic polynomial-time CNF-SAT decider',
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'rootLeanTheoremPresent = false',
    'projectSpecificAxiomsRemaining = true',
    'leanLockedNANDCarrierLayoutFormalized = true',
    'leanLockedNANDGlobalCandidateAssemblyFormalized = true',
    'leanLockedNANDGlobalBaselineDistinctFormalized = true',
    'leanLockedNANDUnsatisfiableFinalZeroFormalized = true',
    'leanLockedNANDGlobalSemanticThresholdFormalized = true',
    'leanConcreteLockedNANDEncodedSemanticReductionFormalized = true',
    'leanConcreteLockedNANDParserMachineFormalized = true',
    'leanConcreteLockedNANDParserAxiomAuditPassed = true',
    'leanConcreteLockedNANDParserAuditedDeclarationCount = 380',
    'leanConcreteLockedNANDParserAllInputExactFormalized = true',
    'leanConcreteLockedNANDParserExactOutputFormalized = true',
    'leanConcreteLockedNANDParserCompiledNonTimeoutFormalized = true',
    'leanConcreteLockedNANDParserPolynomialTimeMachineFormalized = true',
    'leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized = true',
    'leanConcreteLockedNANDParserRawRefinementFormalized = true',
    'leanConcreteLockedNANDEmitterMachineFormalized = true',
    'leanConcreteLockedNANDEmitterAxiomAuditPassed = true',
    'leanConcreteLockedNANDEmitterAuditedDeclarationCount = 3295',
    'leanConcreteLockedNANDEmitterAllInputExactFormalized = true',
    'leanConcreteLockedNANDEmitterExactTargetBytesFormalized = true',
    'leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized = true',
    'leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized = true',
    'leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized = true',
    'leanConcreteLockedNANDEmitterRawRefinementFormalized = true',
    'leanConcreteLockedNANDEmitterStrictParserCompositionFormalized = true',
    'leanConcreteLockedNANDEmitterOutputSizeBoundFormalized = true',
    'leanConcreteLockedNANDPolynomialReductionFormalized = true',
    'leanConcreteCNFToNANDSemanticCompilerFormalized = true',
    'leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount = 68',
    'leanConcreteCNFToNANDExactSemanticsFormalized = true',
    'leanConcreteCNFToNANDPolynomialOutputSizeBoundFormalized = true',
    'leanConcreteCNFToNANDFiniteMachineFormalized = true',
    'leanConcreteCNFToNANDPolynomialTimeFunctionFormalized = true',
    'leanConcreteCNFToNANDPolynomialReductionFormalized = true',
    'leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount = 1316',
    'leanConcreteCNFToNANDAllInputExactFormalized = true',
    'leanConcreteCNFToNANDExactMachineOutputFormalized = true',
    'leanConcreteCNFToNANDCompiledNonTimeoutFormalized = true',
    'leanConcreteCNFToNANDRawRefinementFormalized = true',
    'leanConcreteCNFToNANDDirectReductionFormalized = true',
    'leanConcreteCNFToNANDLockedReductionCompositionFormalized = true',
    'concretePublicationGate.passed = false',
    'PNP-LEAN-THEOREM-INVENTORY-2026-08-03-95',
    'About 58% of the known formalisation work',
    'not a probability that the claim is correct, a confidence score, or a mathematical result',
    'P: problems we can solve efficiently',
    'NP: answers we can check efficiently',
    'The CNF-to-NAND translation now runs as a checked efficient process',
    'EncodedNANDSAT',
    'EncodedLockedNANDThreshold',
  ]) assert.equal(html.includes(fragment), true, `missing homepage fragment: ${fragment}`);
  assert.doesNotMatch(html, />Historical report</u);
});

test('homepage technical boundary and release identifiers are visibly discoverable but collapsed by default', async () => {
  const html = await readText('index.html');
  assert.match(html, /<details class="boundary-panel" data-formal-status-root data-status-state="fail-closed">/u);
  assert.match(html, /Show technical boundary/u);
  assert.match(html, /Hide technical boundary/u);
  assert.match(html, /class="disclosure-chevron"/u);
  assert.match(html, /<details class="release-details">/u);
  assert.match(html, /Source and release identifiers/u);
  assert.doesNotMatch(html, /<details class="(?:boundary-panel|release-details)"[^>]*\sopen(?:\s|=|>)/u);
  assert.match(html, /data-formal-status-fields[\s\S]*data-formal-status-note[\s\S]*<\/details>/u);
});

test('homepage content is authoritative without JavaScript copy rewriting', async () => {
  const script = await readText('assets/main.js');
  for (const forbidden of [
    'ensureHomepageFormalReconstructionBoundary',
    'rewritePageHero',
    'insertAfterPageHero',
    'ensureStatusLink',
    'data-homepage-matrix-summary',
    'data-homepage-one-command-upload',
  ]) assert.doesNotMatch(script, new RegExp(forbidden, 'u'), forbidden);
  assert.match(script, /async function loadFormalPublication\(\)/u);
  assert.match(script, /loadFormalPublication\(\);/u);
});
