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
  assert.equal(result.coreCommit, "522c8da0f4add7b310659dd28c3dd3bd492d5337");
});

test("current release is pinned, thirty-nine-page, exposes the fourth-clause separator, and fails closed", () => {
  const release = json("downloads/formal-publication-release.json");
  assert.equal(release.coordinate, "PNP-FORMAL-PUBLICATION-RELEASE-2026-07-20-46");
  assert.equal(release.source.commit, "522c8da0f4add7b310659dd28c3dd3bd492d5337");
  assert.equal(release.source.proofCommit, "7eddd76481c73170a9cc43dd263f27de9f74de69");
  assert.equal(release.source.tree, "43ab837054ffd8dfb3d2bf34fa8458779c4ee4b0");
  assert.equal(release.source.coordinateAloneIsAuthority, false);
  assert.equal(release.source.identityRequiresCommitTreeAndArtifactHashes, true);
  assert.equal(release.artifacts.report.pageCount, 39);
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
  assert.equal(Object.keys(release.earnedBoundary.cookLevinFormulaCursorTheoremKernelTypeSha256).length, 16);
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
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderAuditedDeclarationCount, 84);
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
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixAuditedDeclarationCount, 60);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixRuleCount, "440 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderBodyStartPrefixTheoremKernelTypeSha256).length, 42);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.bodyStartTokens_eq_canonical_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixNextTokenCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_two");
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixSeparatorSlotTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.firstBodyTokenSlotDirect_eq_separator");
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTokenBits_eq_encodedFormula_bodyStart");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderBodyStartPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderBodyStartPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount, 74);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixRuleCount, "585 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixTheoremKernelTypeSha256).length, 52);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixCanonicalFormulaPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixNextTokenCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_four");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixSignSlotTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralSignSlotDirect_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixZeroTerminatorSlotTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralZeroTerminatorSlotDirect_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixAuditedDeclarationCount, 79);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCombinedAuditedDeclarationCount, 80);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixWorkTime, "BuilderFirstLiteralPrefix.workSteps(input) + 1 + BuilderUnaryPolynomial.workSteps(nextTokenSlotPolynomial verifier, input) + 1 + FirstClauseTailAppender.workSteps(input, firstLiteralTokens problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRawTimePolynomial, "BuilderFirstLiteralPrefix.rawTimeBound + 1158 + 6 * BuilderUnaryPolynomial.workTimePolynomial(nextTokenSlotPolynomial verifier) + 192 * inputLength + 96 * FormulaWidth");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRuleCount, "1138 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFirstClausePrefixTheoremKernelTypeSha256).length, 43);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCanonicalFormulaPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixNextTokenCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_twelve");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixTailRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixAcceptTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstClausePrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstClausePrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount, 47);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepWorkTime, "BuilderFirstClausePrefix.workSteps(input) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepRawTimePolynomial, "BuilderFirstClausePrefix.rawTimeBound + 48 + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepRuleCount, /^1192 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepTheoremKernelTypeSha256).length, 31);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.specification_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepDirectPaddingTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.directOutcome_is_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenSlot_eq_formulaVariableSlotBound_add_thirteen");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenBits_eq_encodedFormula_firstClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepMalformedScratchTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.malformedCursorScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount, 84);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunWorkTime, /PaddingCountdown\.loopSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunRawTimePolynomial, /countdownBoundPolynomial/);
  assert.match(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunRuleCount, /^1244 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunTheoremKernelTypeSha256).length, 48);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_padding_run");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunSecondClauseStartTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenSlot_eq_secondClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunSecondClauseSeparatorTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.secondClauseStart_direct_eq_sep");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunRemainingCountTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.remainingPaddingCount_eq");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunPredecessorTransportTheorem, "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepRuleCount, /^1366 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepSeparatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_separator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.nextTokenSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepPredecessorDeadStepTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixRuleCount, /^1610 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 58);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondClauseFirstLiteralTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseFirstLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_three");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixSignTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixRawTimePolynomial, "BuilderSecondClauseFirstLiteralPrefix.rawTimeBound + 1026 + 72 * inputLength + 36 * FormulaWidth + 36 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixRuleCount, /^1976 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 75);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondClauseSecondLiteralTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseSecondLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_six");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixSignTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralUnaryUnitSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixAuditedDeclarationCount, 57);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixClauseTerminatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixRawTimePolynomial, "BuilderSecondClauseSecondLiteralPrefix.rawTimeBound + 390 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClausePrefixRuleCount, /^2098 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.secondClauseTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenBits_eq_encodedFormula_secondClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenSlot_eq_secondClauseStart_add_seven");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.clauseTerminatorSlot_direct_eq_finish");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.nextTokenSlot_direct_eq_padding");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClausePrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClausePrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunWorkTime, /PaddingCountdown\.loopSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunRawTimePolynomial, /countEvaluator\.workSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunRuleCount, /^2150 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunPaddingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_padding_run");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunTargetSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_target_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenBits_eq_encodedFormula_secondClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunRemainingCountTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_seven");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunThirdClauseCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenSlot_eq_thirdClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunDirectPaddingTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.paddingSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunDirectSeparatorTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_direct_eq_sep");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_rawTimeBound");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepRawTimePolynomial, "BuilderSecondClausePaddingRun.rawTimeBound + 330 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepRuleCount, /^2272 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepSeparatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_separator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.thirdClauseStartTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenBits_eq_encodedFormula_thirdClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenSlot_eq_thirdClauseStart_add_one");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.nextTokenSlot_direct_eq_f");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixWorkTime, "BuilderThirdClauseSeparatorStep.workSteps(problem) + 1 + BuilderThirdClauseFirstLiteralPrefix.suffixWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixRawTimePolynomial, "BuilderThirdClauseSeparatorStep.rawTimeBound + 732 + 48 * inputLength + 24 * FormulaWidth + 24 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixRuleCount, /^2516 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 58);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_three");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixSignTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixSuffixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_length");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount, 145);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixWorkTime, "BuilderThirdClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderThirdClauseSecondLiteralPrefix.suffixWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixRawTimePolynomial, "BuilderThirdClauseFirstLiteralPrefix.rawTimeBound + 1752 + 96 * inputLength + 48 * FormulaWidth + 48 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixRuleCount, /^3004 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 92);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFirstUnarySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSecondUnarySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_seven");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSignTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFirstUnaryTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSecondUnaryTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTrueTokenCursorRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSecondLiteralSuffixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixAuditedDeclarationCount, 57);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixClauseTerminatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixWorkTime, "BuilderThirdClauseSecondLiteralPrefix.workSteps(problem) + 1 + appenderWorkSteps(problem) + 1 + cursorWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixRawTimePolynomial, "BuilderThirdClauseSecondLiteralPrefix.rawTimeBound + 498 + 24 * inputLength + 12 * FormulaWidth + 12 * BuilderThirdClauseSeparatorStep.cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClausePrefixRuleCount, /^3126 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.thirdClauseTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenBits_eq_encodedFormula_thirdClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenSlot_eq_thirdClauseStart_add_eight");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixClauseTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.clauseTerminatorSlot_direct_eq_finish");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.nextTokenSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixFinishTokenCursorRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rules_length");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClausePrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClausePrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunWorkTime, /PaddingCountdown\.loopSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunRawTimePolynomial, /countEvaluator\.workSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunRuleCount, /^3178 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunPaddingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_padding_run");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunTargetSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_target_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenBits_eq_encodedFormula_thirdClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunRemainingCountTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_eight");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFourthClauseCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenSlot_eq_fourthClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunDirectPaddingTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.paddingSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunDirectSeparatorTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_direct_eq_sep");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_rawTimeBound");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepWorkTime, "BuilderThirdClausePaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, thirdClauseTokens problem) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepRawTimePolynomial, "BuilderThirdClausePaddingRun.rawTimeBound + 426 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepRuleCount, /^3300 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepSeparatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_separator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.fourthClauseStartTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenBits_eq_encodedFormula_fourthClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenSlot_eq_fourthClauseStart_add_one");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.nextTokenSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepSuffixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepPredecessorDeadStepTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepProjectAxiomClosure, []);
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
    assert.match(workflow, /actions\/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0/, name);
    assert.match(workflow, /actions\/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e/, name);
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
