import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, linkSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { verifyReleaseSeal } from "../../tools/verify-release-seal.mjs";
import { writeMirrorFileAtomically } from "../../tools/sync-public-access-docs.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SEALED_PATHS = [
  "downloads/release-seal.json",
  "downloads/SHA256SUMS",
  "downloads/canonical_proof_report.pdf",
  "downloads/canonical-proof-report.pdf",
  "downloads/canonical_proof_report.tex",
  "downloads/canonical-proof-report.tex",
  "downloads/formal-publication-release.json",
  "downloads/source-checker-release.json",
  "public/pnp-status.json",
  "public/pnp-theorem-inventory.json"
];

function json(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

function copySealFixture(t) {
  const fixture = mkdtempSync(path.join(tmpdir(), "pnplabs-formal-seal-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  for (const relativePath of SEALED_PATHS) {
    const target = path.join(fixture, relativePath);
    mkdirSync(path.dirname(target), { recursive: true });
    cpSync(path.join(root, relativePath), target);
  }
  return fixture;
}

test("exact current artifact seal verifies eight reviewed files", () => {
  const result = verifyReleaseSeal({ root });
  assert.equal(result.checked, 8);
  assert.equal(result.coreCommit, "62c35edef4bb64f2c665051e61d07c7b17f70ad3");
});

test("current release is pinned, nineteen-page, exposes the complete width-header builder, and fails closed", () => {
  const release = json("downloads/formal-publication-release.json");
  assert.equal(release.source.commit, "62c35edef4bb64f2c665051e61d07c7b17f70ad3");
  assert.equal(release.source.proofCommit, "0c4aa7d345b202182c2f6d993fbc5d8f9f007e72");
  assert.equal(release.source.tree, "619759ec50764df68ea6b68ddbc84d0f8bd85448");
  assert.equal(release.source.coordinateAloneIsAuthority, false);
  assert.equal(release.source.identityRequiresCommitTreeAndArtifactHashes, true);
  assert.equal(release.artifacts.report.pageCount, 19);
  assert.equal(release.earnedBoundary.leanTheorem, "PNP.Concrete.FinalUniversalDesign.cnfSATInNP");
  assert.equal(release.earnedBoundary.kernelTypeSha256, "c9d66c135361cf8a8b25330d2558dfac209fde120e296140c7e7cb86bf1e1937");
  assert.deepEqual(release.earnedBoundary.axiomClosure, []);
  assert.equal(release.earnedBoundary.auditedDeclarationCount, 766);
  assert.equal(release.earnedBoundary.pipelineStateNamespacesFormalized, true);
  assert.equal(release.earnedBoundary.pipelineStateNamespaceAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineStateNamespaceAuditedDeclarationCount, 39);
  assert.equal(release.earnedBoundary.pipelineStageBridgesFormalized, true);
  assert.equal(release.earnedBoundary.pipelineStageBridgeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineStageBridgeAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.pipelineStageLaunchFormalized, true);
  assert.equal(release.earnedBoundary.pipelineVerdictPreservationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineInternalOutputHandoffComposed, true);
  assert.equal(release.earnedBoundary.pipelineCompiledRawCostMultiplier, 6);
  assert.equal(release.earnedBoundary.pipelineTargetTerminationFormalized, false);
  assert.equal(release.earnedBoundary.pipelineTerminalRawOutputPackingFormalized, true);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerAuditedDeclarationCount, 69);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerTheorem, "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerKernelTypeSha256, "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66");
  assert.deepEqual(release.earnedBoundary.pipelineTerminalOutputPackerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerCompiledRawTimeBound, "18 * outputLength^2 + 36 * outputLength + 6");
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerConnectedToBridge, true);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAuditedDeclarationCount, 59);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAcceptingOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAcceptingOutputKernelTypeSha256, "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001");
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeRejectingOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents");
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeRejectingOutputKernelTypeSha256, "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db");
  assert.deepEqual(release.earnedBoundary.pipelineTerminalBridgeAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeCompiledRawTimeBound, "18 * outputLength^2 + 36 * outputLength + 12");
  assert.equal(release.earnedBoundary.pipelineSuppliedAcceptTraceTheorem, "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSuppliedAcceptTraceKernelTypeSha256, "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29");
  assert.equal(release.earnedBoundary.pipelineSuppliedRejectTraceTheorem, "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSuppliedRejectTraceKernelTypeSha256, "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c");
  assert.equal(release.earnedBoundary.pipelineSuppliedAcceptMachineOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSuppliedRejectMachineOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelinePriorTraceTransportToTerminalBridgeFormalized, true);
  assert.equal(release.earnedBoundary.pipelineInputFramerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineInputFramerAuditedDeclarationCount, 70);
  assert.equal(release.earnedBoundary.pipelineAllInputFramingFormalized, true);
  assert.equal(release.earnedBoundary.pipelineInputFramerWorkTraceTheorem, "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact");
  assert.equal(release.earnedBoundary.pipelineInputFramerWorkTraceKernelTypeSha256, "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a");
  assert.equal(release.earnedBoundary.pipelineInputFramerRepresentedEndpointTheorem, "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents");
  assert.equal(release.earnedBoundary.pipelineInputFramerHaltedEndpointTheorem, "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted");
  assert.equal(release.earnedBoundary.pipelineInputFramerRawBoundTheorem, "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le");
  assert.equal(release.earnedBoundary.pipelineInputFramerOrdinaryStartTheorem, "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound");
  assert.equal(release.earnedBoundary.pipelineInputFramerBlankEquivalentTheorem, "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent");
  assert.equal(release.earnedBoundary.pipelineInputFramerAcceptTheorem, "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept");
  assert.equal(release.earnedBoundary.pipelineInputFramerNoTimeoutTheorem, "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout");
  assert.deepEqual(release.earnedBoundary.pipelineInputFramerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineInputFramerEmptyWorkSteps, "4");
  assert.equal(release.earnedBoundary.pipelineInputFramerCompleteCellsWorkSteps, "4 * k * k + 9 * k + 7");
  assert.equal(release.earnedBoundary.pipelineInputFramerPartialCellWorkSteps, "4 * k * k + 9 * k + 5");
  assert.equal(release.earnedBoundary.pipelineInputFramerRawTimePolynomial, "6 * m * m + 39 * m + 75");
  assert.equal(release.earnedBoundary.pipelinePairedCompilerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelinePairedCompilerAuditedDeclarationCount, 28);
  assert.equal(release.earnedBoundary.pipelineCanonicalPairCompilationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineMalformedInputBehaviorFormalized, true);
  assert.equal(release.earnedBoundary.pipelinePairedVerdictTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq");
  assert.equal(release.earnedBoundary.pipelinePairedVerdictKernelTypeSha256, "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731");
  assert.equal(release.earnedBoundary.pipelinePairedMachineOutputTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq");
  assert.equal(release.earnedBoundary.pipelinePairedMachineOutputKernelTypeSha256, "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267");
  assert.equal(release.earnedBoundary.pipelinePairedNoTimeoutTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout");
  assert.equal(release.earnedBoundary.pipelinePairedNoTimeoutKernelTypeSha256, "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab");
  assert.equal(release.earnedBoundary.pipelinePairedAcceptsTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff");
  assert.equal(release.earnedBoundary.pipelinePairedAcceptsKernelTypeSha256, "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9");
  assert.deepEqual(release.earnedBoundary.pipelinePairedCompilerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelinePairedOutputSizePolynomial, "B(m) = m + p(m) + 1");
  assert.equal(release.earnedBoundary.pipelinePairedRawTimePolynomial, "Rpair(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))");
  assert.equal(release.earnedBoundary.pipelineCompilerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineCompilerAuditedDeclarationCount, 29);
  assert.equal(release.earnedBoundary.pipelineAllInputCompilationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineCompilerCorrectTheorem, "PNP.Concrete.PipelineCompiler.pipeline_correct");
  assert.equal(release.earnedBoundary.pipelineCompilerCorrectKernelTypeSha256, "e1ccd198403d41933324af1c52048c865943947c5bbd40dd94e11827b08c2303");
  assert.equal(release.earnedBoundary.pipelineVerdictTheorem, "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq");
  assert.equal(release.earnedBoundary.pipelineVerdictKernelTypeSha256, "1bafe91bba94e65a7ad654f4624f305c0ae01b3e6d656af0dd2e752d373ce87e");
  assert.equal(release.earnedBoundary.pipelineMachineOutputTheorem, "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq");
  assert.equal(release.earnedBoundary.pipelineMachineOutputKernelTypeSha256, "45e02fa1e6e6b0bcbc422c3b4fd797608b875727d22b79d6f7814e1f4f0d3da7");
  assert.equal(release.earnedBoundary.pipelineNoTimeoutTheorem, "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout");
  assert.equal(release.earnedBoundary.pipelineNoTimeoutKernelTypeSha256, "ed95c33d4fa998d79057537cd2adf847548a79b7ee9a45020b01620868273b3a");
  assert.equal(release.earnedBoundary.pipelineAcceptsTheorem, "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff");
  assert.equal(release.earnedBoundary.pipelineAcceptsKernelTypeSha256, "94e43c664b4d185e48553ab25541925830fec7086fcbbab5215dacdcde1af6a6");
  assert.equal(release.earnedBoundary.pipelineAllInputStuckTimeoutTheorem, "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineAllInputStuckTimeoutKernelTypeSha256, "a6edef0532eb89036d0e6813cffb94b321f9160a08035671eb411c813ef0a3de");
  assert.deepEqual(release.earnedBoundary.pipelineCompilerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineOutputSizePolynomial, "B(m) = m + p(m) + 1");
  assert.equal(release.earnedBoundary.pipelineRawTimePolynomial, "R(m) = totalInputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))");
  assert.equal(release.earnedBoundary.pipelineRawRefinementFormalized, true);
  assert.equal(release.earnedBoundary.pipelineExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.pipelineSequentialNamespaceFormalized, true);
  assert.equal(release.earnedBoundary.pipelineSequentialNamespaceAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineSequentialNamespaceAuditedDeclarationCount, 26);
  assert.deepEqual(release.earnedBoundary.pipelineSequentialNamespaceAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineSequentialCompilationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineSequentialCompilerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineSequentialCompilerAuditedDeclarationCount, 31);
  assert.equal(release.earnedBoundary.pipelineSequentialCorrectTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_correct");
  assert.equal(release.earnedBoundary.pipelineSequentialCorrectKernelTypeSha256, "8943f2f2c396dfb2e6e8232244b9ecb386fe3a7259590ed96cedb82d1cc7b22a");
  assert.equal(release.earnedBoundary.pipelineSequentialVerdictTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq");
  assert.equal(release.earnedBoundary.pipelineSequentialMachineOutputTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq");
  assert.equal(release.earnedBoundary.pipelineSequentialNoTimeoutTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout");
  assert.equal(release.earnedBoundary.pipelineSequentialAcceptsTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff");
  assert.equal(release.earnedBoundary.pipelineSequentialStuckFirstTimeoutTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSequentialRawTimePolynomial, "Rseq(m) = PipelineRaw(p)(m) + 6 + PipelineRaw(q)(m + p(m) + 1)");
  assert.deepEqual(release.earnedBoundary.pipelineSequentialCompilerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineRefinementAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineRefinementAuditedDeclarationCount, 16);
  assert.deepEqual(release.earnedBoundary.pipelineRefinementAxiomClosure, []);
  assert.equal(release.earnedBoundary.functionProgramRecursiveCompilationFormalized, true);
  assert.equal(release.earnedBoundary.decisionProgramRecursiveCompilationFormalized, true);
  assert.equal(release.earnedBoundary.polynomialTimeDeciderRawCompilationFormalized, true);
  assert.equal(release.earnedBoundary.functionProgramCompileHaltsTheorem, "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin");
  assert.equal(release.earnedBoundary.functionProgramCompileOutputTheorem, "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq");
  assert.equal(release.earnedBoundary.decisionProgramCompileHaltsTheorem, "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin");
  assert.equal(release.earnedBoundary.decisionProgramCompileVerdictTheorem, "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq");
  assert.equal(release.earnedBoundary.polynomialTimeDeciderCompileAcceptsTheorem, "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff");
  assert.equal(release.earnedBoundary.standardComplexityModelFormalized, true);
  assert.equal(release.earnedBoundary.concreteComplexityMachineLinkDischarged, true);
  assert.equal(release.earnedBoundary.cookLevinRawTapeBridgeFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinRawTapeBridgeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinRawTapeBridgeAuditedDeclarationCount, 54);
  assert.equal(release.earnedBoundary.cookLevinSemanticReductionCorrectnessFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinSemanticTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language");
  assert.equal(release.earnedBoundary.cookLevinSemanticKernelTypeSha256, "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d");
  assert.deepEqual(release.earnedBoundary.cookLevinRawTapeBridgeAxiomClosure, ["Classical.choice", "Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinFormulaSizeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaSizeAuditedDeclarationCount, 108);
  assert.equal(release.earnedBoundary.cookLevinEncodedFormulaSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinEncodedFormulaSizeTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le");
  assert.equal(release.earnedBoundary.cookLevinEncodedFormulaSizeKernelTypeSha256, "c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699");
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaSizeAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaSizeProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleAuditedDeclarationCount, 79);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleAnswerIndependent, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleExactEmissionFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleExactLengthPolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleLengthTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length");
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleLengthKernelTypeSha256, "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4");
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleEmitTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula");
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleEmitKernelTypeSha256, "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943");
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaScheduleAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaScheduleProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleConstantTimeRawInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinRawFormulaBuilderFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleFunctionProgramRawRefinementFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorAuditedDeclarationCount, 129);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorDirectCoordinateLookupFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorNestedOptionSemanticsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorExactTraversalFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorExactLengthPolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorDirectBitTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorPolynomialTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorFullTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorOneStepShortTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorExcessTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorEmitTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinFormulaCursorTheoremKernelTypeSha256).length, 13);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorTheoremKernelTypeSha256[release.earnedBoundary.cookLevinFormulaCursorEmitTheorem], "2637f4e27b2a6e40a7e774b10fac91d379daebe9ff6930c72de43ee23bd054d0");
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaCursorAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaCursorProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorConstantTimeRawInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorRawBuilderFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorFunctionProgramRawRefinementFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthAuditedDeclarationCount, 39);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthRuleCount, 19);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthWorkTimePolynomial, "2 * inputLength^2 + 4 * inputLength + 2");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthRawTimePolynomial, "12 * inputLength^2 + 24 * inputLength + 12");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderInputLengthTheoremKernelTypeSha256).length, 10);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthFramerRunTheorem, "PNP.Concrete.CookLevin.BuilderInputLength.workRunExact_after_totalInputFramer");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthTheoremKernelTypeSha256[release.earnedBoundary.cookLevinBuilderInputLengthFramerRunTheorem], "3fdcf061036fc5b1c6caf667cda8718c9d738a7281d30be9785841b40f034c16");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderInputLengthAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderInputLengthProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixAuditedDeclarationCount, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixLiteralFramerLaunchFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixWorkTimePolynomial, "totalInputFramerWorkSteps(input) + 1 + 2 * inputLength^2 + 4 * inputLength + 2");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixRawTimePolynomial, "18 * inputLength^2 + 63 * inputLength + 93");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderInputPrefixTheoremKernelTypeSha256).length, 14);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixLaunchTheorem, "PNP.Concrete.CookLevin.BuilderInputPrefix.launch_workStep");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixMalformedTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderInputPrefix.malformedTallyScanSymbol_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixTheoremKernelTypeSha256[release.earnedBoundary.cookLevinBuilderInputPrefixExactWorkRunTheorem], "c4d91b64e983bc5a6713fa64ab86821edd442cc79cbf872b2fafe6f3194ab2b3");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderInputPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderInputPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixFormulaBitsEmittedFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixDirectCursorRawInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderAllTokensExactFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderFirstFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderInputPrefixComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderWorkTime, "2 * (max 1 inputLength + inputLength + priorTokenCount + 3)");
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderFirstTokenRawTimePolynomial, "24 * inputLength + 48");
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderRuleCount, 59);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderTokenAppenderTheoremKernelTypeSha256).length, 17);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderTokenAppender.appendToken_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderFormulaPrefixTheorem, "PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_bits_eq_encodedFormula_take_two");
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderTheoremKernelTypeSha256[release.earnedBoundary.cookLevinBuilderTokenAppenderExactWorkRunTheorem], "948f8fd82b0b7afb85ae562995bebfcf59e50896cb46765fd4fbb807dd6652ad");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderTokenAppenderAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderTokenAppenderProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderCompleteHeaderFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderDynamicCursorInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixAuditedDeclarationCount, 37);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixRawTimePolynomial, "18 * inputLength^2 + 87 * inputLength + 147");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixRuleCount, 184);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixTheoremKernelTypeSha256).length, 25);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixFormulaPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.finalTokenBits_eq_encodedFormula_take_two");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialAuditedDeclarationCount, 74);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialRuleCount, "9 * stateCount(widthPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderUnaryPolynomialTheoremKernelTypeSha256).length, 10);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderUnaryPolynomialAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderUnaryPolynomialProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderAuditedDeclarationCount, 83);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderRuleCount, "363 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderCompleteHeaderTheoremKernelTypeSha256).length, 38);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderCompleteHeader.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderFormulaHeaderTheorem, "PNP.Concrete.CookLevin.BuilderCompleteHeader.finalTokenBits_eq_encodedFormula_header");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderCompleteHeaderAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderCompleteHeaderProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicCursorInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderFormulaBitsEmittedFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDirectCursorRawInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinCompleteRawFormulaBuilderFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderFunctionProgramRawRefinementFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaConstructionRuntimePolynomialFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinPolynomialReductionFormalized, false);
  assert.equal(release.earnedBoundary.cnfSATInPFormalized, false);
  assert.equal(release.earnedBoundary.cnfSATNPCompletenessFormalized, false);
  assert.equal(release.earnedBoundary.pEqualsNPFormalized, false);
  assert.equal(release.publicationBoundary.derivedOnlyFromConcreteGate, true);
  assert.equal(release.publicationBoundary.concreteGatePassed, false);
  assert.equal(release.publicationBoundary.mathematicalTheoremEstablished, false);
  assert.equal(release.publicationBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(release.publicationBoundary.publicTheoremStatement, null);
  assert.equal(release.publicationBoundary.compatibilityRootPresent, false);
  assert.equal(release.publicationBoundary.concreteTargetPresent, true);
  assert.equal(release.publicationBoundary.projectSpecificAxiomsRemaining, true);
  assert.equal(release.publicationBoundary.remainingBlockerCount, 6);
});

test("7072f8d report metadata is historical-only and cannot reactivate publication", () => {
  const historical = json("downloads/source-checker-release.json");
  assert.equal(historical.status, "historical-quarantined-not-current-authority");
  assert.equal(historical.authority, "historical-only");
  assert.equal(historical.currentArtifactEligible, false);
  assert.equal(historical.currentStatusAuthority, false);
  assert.equal(historical.mayActivateTheoremPublication, false);
  assert.equal(historical.historicalCanonicalReport.pageCount, 56);
  assert.notEqual(
    json("downloads/formal-publication-release.json").artifacts.report.pdf.sha256,
    historical.historicalCanonicalReport.pdfSha256
  );
});

test("seal rejects canonical artifact drift even when the file remains readable", (t) => {
  const fixture = copySealFixture(t);
  writeFileSync(path.join(fixture, "downloads/canonical_proof_report.tex"), "drift\n");
  assert.throws(
    () => verifyReleaseSeal({ root: fixture }),
    /byte count .* does not match/
  );
});

test("seal rejects extra or reordered manifest entries", (t) => {
  const fixture = copySealFixture(t);
  const sealPath = path.join(fixture, "downloads/release-seal.json");
  const seal = JSON.parse(readFileSync(sealPath, "utf8"));
  seal.files.reverse();
  writeFileSync(sealPath, `${JSON.stringify(seal, null, 2)}\n`);
  assert.throws(
    () => verifyReleaseSeal({ root: fixture }),
    /release seal entry drifted/
  );
});

test("sync mode rejects combining explicit read-only and write modes", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/sync-public-access-docs.mjs", "--check", "--write"],
    { cwd: root, encoding: "utf8" }
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /cannot combine --check with --write/);
});

test("exported verification helpers import without a script argv path", () => {
  const modules = [
    "./tools/verify-release-seal.mjs",
    "./tools/check-cross-repo-targets.mjs",
    "./tools/sync-public-access-docs.mjs",
    "./tools/reviewer-fixture-checker.mjs"
  ];
  const expression = `await Promise.all(${JSON.stringify(modules)}.map((name) => import(name)))`;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", expression],
    { cwd: root, encoding: "utf8" }
  );
  assert.equal(result.status, 0, result.stderr);
});

test("automation invokes read-only sync and contains no commit or push step", () => {
  const workflow = readFileSync(path.join(root, ".github/workflows/sync-public-access-report.yml"), "utf8");
  assert.match(workflow, /permissions:\n  contents: read/);
  assert.match(workflow, /sync-public-access-docs\.mjs --check/);
  assert.doesNotMatch(workflow, /git (?:commit|push)/);
  assert.doesNotMatch(workflow, /contents: write/);
});

test("production audit is manual and deployment remains fail-closed outside GitHub Actions", () => {
  const workflow = readFileSync(
    path.join(root, ".github/workflows/production-deployment-consistency.yml"),
    "utf8"
  );
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /inputs:|\$\{\{\s*inputs\./);
  assert.match(workflow, /PRODUCTION_BASE_URL: https:\/\/pnplabs\.com\.au/);
  assert.match(workflow, /ref: refs\/heads\/main/);
  assert.doesNotMatch(workflow, /^\s+(?:push|pull_request|schedule):/m);
  assert.match(workflow, /npm run verify:production/);
  assert.doesNotMatch(workflow, /contents: write|git (?:commit|push)|systemctl|deploy-pnp/);

  const deploy = readFileSync(path.join(root, "deploy/deploy-pnp"), "utf8");
  assert.match(deploy, /merge-base --is-ancestor/);
  assert.match(deploy, /REPOSITORY_URL="https:\/\/github\.com\/aisknab\/pnplabs\.git"/);
  assert.doesNotMatch(deploy, /PNPLABS_REPOSITORY_URL/);
  assert.match(deploy, /LOCK_DIR="\/run\/pnplabs"/);
  assert.match(deploy, /install -d -m 0755 -o root -g root "\$LOCK_DIR"/);
  assert.match(deploy, /umask 077\nexec 9>"\$LOCK_FILE"\numask 022/);
  assert.match(deploy, /flock -n 9/);
  assert.match(deploy, /"\$@" 9>&-/);
  assert.match(deploy, /runuser -u "\$DEPLOY_USER"/);
  assert.match(deploy, /trap 'rollback 130' INT/);
  assert.match(deploy, /trap 'rollback 143' TERM/);
  assert.match(deploy, /for \(\(attempt = 1; attempt <= 30;/);
  assert.match(deploy, /as_deploy npm --prefix "\$release_dir" test/);
  assert.match(deploy, /npm --prefix "\$release_dir" run deployment:generate/);
  assert.match(deploy, /npm --prefix "\$release_dir" run deployment:check/);
  assert.match(deploy, /as_deploy node "\$release_dir\/tools\/check-production-deployment\.mjs"/);
  assert.match(deploy, /--expected-site-commit "\$resolved_commit"/);
  assert.match(deploy, /restored the previous release/);
  assert.match(deploy, /wait_for_origin "\/index\.html"/);
  assert.match(deploy, /systemctl stop "\$ORIGIN_SERVICE"/);
  assert.match(deploy, /as_origin \/usr\/bin\/test -r "\$previous_target\/server\.mjs"/);
  const freezeIndex = deploy.indexOf('chown -R -h root:root "$release_dir"');
  const activationIndex = deploy.lastIndexOf('mv -Tf "$next_link" "$CURRENT_LINK"');
  assert.ok(freezeIndex >= 0 && freezeIndex < activationIndex, "release must become root-owned before activation");
  assert.match(deploy, /chmod -R a-w,u\+rwX,go\+rX "\$release_dir"/);
  assert.match(deploy, /as_origin \/usr\/bin\/test -r "\$release_dir\/server\.mjs"/);

  const service = readFileSync(path.join(root, "deploy/pnplabs-origin.service"), "utf8");
  assert.match(service, /^User=pnplabs-origin$/m);
  assert.match(service, /^Environment=HOST=127\.0\.0\.1$/m);
  assert.match(service, /^NoNewPrivileges=true$/m);
  assert.match(service, /^ProtectSystem=strict$/m);
  assert.match(service, /^ReadOnlyPaths=\/srv\/pnplabs$/m);
  assert.match(service, /^ExecStart=\/usr\/local\/libexec\/pnplabs-origin-launcher$/m);
  const launcher = readFileSync(path.join(root, "deploy/pnplabs-origin-launcher"), "utf8");
  assert.match(launcher, /^#!\/bin\/bash/);
  assert.match(launcher, /readlink -f -- "\$\{current_link\}\/server\.mjs"/);
  assert.match(launcher, /exec \/usr\/bin\/env node "\$server_path"/);

  const staticHeaders = readFileSync(path.join(root, "_headers"), "utf8");
  assert.match(staticHeaders, /\/\*\n(?:  .+\n)*  Cache-Control: no-cache/);
  assert.doesNotMatch(staticHeaders, /immutable|max-age=31536000/);
});

test("every active workflow is read-only and pins credential-free actions", () => {
  for (const name of [
    "ci.yml",
    "pnp-public-payloads.yml",
    "pnp-upstream-status-consistency.yml",
    "pnp-verification-run-issue-ingest.yml",
    "pnp-verifier-run-import.yml",
    "production-deployment-consistency.yml",
    "sync-public-access-report.yml"
  ]) {
    const workflow = readFileSync(path.join(root, ".github/workflows", name), "utf8");
    assert.match(workflow, /permissions:\n  contents: read/, name);
    assert.doesNotMatch(workflow, /actions\/(?:checkout|setup-node)@v\d/, name);
    assert.match(workflow, /actions\/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5/, name);
    assert.match(workflow, /actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/, name);
    const checkoutCount = (workflow.match(/actions\/checkout@/g) || []).length;
    const credentialCount = (workflow.match(/persist-credentials: false/g) || []).length;
    assert.equal(credentialCount, checkoutCount, `${name}: every checkout must drop credentials`);
  }
});

test("explicit write rejects a symlinked parent without touching the outside target", (t) => {
  const fixture = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-root-"));
  const outside = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-outside-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  writeFileSync(path.join(outside, "sentinel.json"), "outside\n");
  symlinkSync(outside, path.join(fixture, "public"));

  assert.throws(
    () => writeMirrorFileAtomically(
      fixture,
      path.join(fixture, "public", "sentinel.json"),
      Buffer.from("overwritten\n")
    ),
    /target parent must be a real directory/
  );
  assert.equal(readFileSync(path.join(outside, "sentinel.json"), "utf8"), "outside\n");
});

test("atomic replacement does not mutate an outside hardlink", (t) => {
  const fixture = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-hardlink-root-"));
  const outside = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-hardlink-outside-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  mkdirSync(path.join(fixture, "public"));
  const sentinel = path.join(outside, "sentinel.json");
  const mirror = path.join(fixture, "public", "mirror.json");
  writeFileSync(sentinel, "outside\n");
  linkSync(sentinel, mirror);

  writeMirrorFileAtomically(fixture, mirror, Buffer.from("current mirror\n"));
  assert.equal(readFileSync(sentinel, "utf8"), "outside\n");
  assert.equal(readFileSync(mirror, "utf8"), "current mirror\n");
});
