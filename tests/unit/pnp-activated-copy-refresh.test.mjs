import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('shared site script applies the compiled-inventory publication boundary', async () => {
  const script = await readText('assets/main.js');
  for (const fragment of [
    'FAIL_CLOSED_FORMAL_STATUS',
    'function isConservativeFormalStatus(status, inventory)',
    'function validateInventory(inventory)',
    'function validateConcreteGate(status, inventory)',
    'function validateMilestones(status)',
    'function validateStatus(status, inventory)',
    'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-16-47',
    'PNP-LEAN-THEOREM-INVENTORY-2026-07-16-47',
    'a27adf2ab77140e0e8b9c41429f0178ba97a2a76738669f6d6175e416bce2b28',
    'declarations: 7418',
    'theorems: 3473',
    'assumptionFreeTheorems: 2764',
    'excludedPrivateDeclarations: 2032',
    'modules: 67',
    'axioms: 4',
    'PNP.Concrete.FinalUniversalDesign.cnfSATInNP',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula',
    'PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact',
    'PNP.Concrete.CookLevin.BuilderInputPrefix.malformedTallyScanSymbol_timeout',
    'status.leanConcreteCookLevinBuilderInputPrefixFormalized === true',
    'status.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed === true',
    'status.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized === true',
    'PNP.Concrete.CookLevin.BuilderTokenAppender.appendToken_workRunExact',
    'PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_bits_eq_encodedFormula_take_two',
    'status.leanConcreteCookLevinBuilderTokenAppenderFormalized === true',
    'status.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed === true',
    'status.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized === true',
    'status.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed === true',
    'status.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized === true',
    'status.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed === true',
    'status.leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized === true',
    'status.leanConcreteCookLevinBuilderUnaryPolynomialFormalized === true',
    'status.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed === true',
    'status.leanConcreteCookLevinBuilderCompleteHeaderFormalized === true',
    'status.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed === true',
    'status.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized === true',
    'status.leanConcreteCookLevinBuilderDynamicCursorFormalized === false',
    'status.leanConcreteCookLevinFormulaBuilderFormalized === false',
    'PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq',
    'status.leanConcretePipelineTerminalOutputPackingFormalized === true',
    'status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed === true',
    'status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized === true',
    'status.leanConcretePipelineTerminalBridgeAxiomAuditPassed === true',
    'status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized === true',
    'PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact',
    'PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound',
    'status.leanConcretePipelineInputFramerAxiomAuditPassed === true',
    'status.leanConcretePipelineAllInputFramingFormalized === true',
    'PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff',
    'status.leanConcretePipelinePairedCompilerAxiomAuditPassed === true',
    'status.leanConcretePipelineCanonicalPairCompilationFormalized === true',
    'PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_ne_timeout',
    'PNP.Concrete.PipelineCompiler.pipeline_accepts_iff',
    'status.leanConcretePipelineCompilerAxiomAuditPassed === true',
    'status.leanConcretePipelineAllInputCompilationFormalized === true',
    'status.leanConcretePipelineMalformedInputBehaviorFormalized === true',
    'status.leanConcretePipelineRawRefinementFormalized === true',
    'status.leanConcretePipelineSequentialCompilerAxiomAuditPassed === true',
    'status.leanConcretePipelineRefinementAxiomAuditPassed === true',
    'status.leanConcreteFunctionProgramRecursiveCompilationFormalized === true',
    'status.leanConcretePipelineExternalInputSizePolynomialFormalized === true',
    'status.leanConcreteCNFSATInPFormalized === false',
    'status.leanConcreteCNFNPCompletenessFormalized === false',
    'PNP.Main.ConcretePEqualsNP',
    'PNP.Main.p_eq_np',
    'abstractPEqualsNPPublicationEligible === false',
    'publicationStatusDerivedOnlyFromConcreteGate === true',
    'const strictConjunction = GATE_SUBCHECK_KEYS.every',
    'typeConfigured && gate.actualConcreteTargetKernelTypeSha256',
    'sourceConfigured && gate.actualSourceClosureSha256',
    'status.mathematicalTheoremEstablished === gatePassed',
    'status.publicTheoremEmissionAllowed === gatePassed',
    'status.formalPublicationMilestones',
    "fetch('public/pnp-status.json'",
    "fetch('public/pnp-theorem-inventory.json'",
    'Promise.all([',
    'compiled Lean inventory digest mismatch',
    'renderMilestones(status.formalPublicationMilestones)',
    'loadFormalPublication();',
  ]) {
    assert.equal(script.includes(fragment), true, `missing formal-publication fragment: ${fragment}`);
  }
});

test('verify, FAQ, review, home, and status pages load the conservative shared script', async () => {
  for (const page of ['verify.html', 'faq.html', 'review.html', 'index.html', 'status.html']) {
    const html = await readText(page);
    assert.match(html, /<script src="assets\/main\.js" defer><\/script>/, `${page} must load assets/main.js`);
  }
});

test('status and inventory loading fails closed before either request validates', async () => {
  const script = await readText('assets/main.js');
  const initialFailClosed = script.indexOf("renderFormalStatus(root, FAIL_CLOSED_FORMAL_STATUS, 'fail-closed')");
  const fetchCall = script.indexOf("fetch('public/pnp-status.json'");
  assert.ok(initialFailClosed >= 0 && initialFailClosed < fetchCall, 'fail-closed state must render before fetch');
  assert.match(script, /if \(!statusResponse\.ok \|\| !inventoryResponse\.ok\) throw new Error/);
  assert.match(script, /if \(inventoryDigest !== INVENTORY_SHA256\) throw new Error/);
  assert.match(script, /if \(!isConservativeFormalStatus\(status, inventory\)\) throw new Error/);
  assert.match(script, /PNP formal-publication load failed closed/);
});
