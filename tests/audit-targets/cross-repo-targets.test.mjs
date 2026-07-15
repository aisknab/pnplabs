import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  AuditTargetValidationError,
  validateAuditTargets
} from "../../tools/check-cross-repo-targets.mjs";

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

const publishedInventory = JSON.parse(readFileSync(
  new URL("../../public/pnp-theorem-inventory.json", import.meta.url),
  "utf8"
));
const publishedRelease = JSON.parse(readFileSync(
  new URL("../../downloads/formal-publication-release.json", import.meta.url),
  "utf8"
));
const FORMULA_CURSOR_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinFormulaCursorTheoremKernelTypeSha256;
const FORMULA_CURSOR_THEOREM_NAMES = Object.keys(FORMULA_CURSOR_THEOREM_HASHES);
const FORMULA_CURSOR_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => FORMULA_CURSOR_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(FORMULA_CURSOR_THEOREM_NAMES.length, 13);
assert.equal(FORMULA_CURSOR_CANDIDATES.length, 13);
const BUILDER_INPUT_LENGTH_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderInputLengthTheoremKernelTypeSha256;
const BUILDER_INPUT_LENGTH_THEOREM_NAMES = Object.keys(BUILDER_INPUT_LENGTH_THEOREM_HASHES);
const BUILDER_INPUT_LENGTH_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_INPUT_LENGTH_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_INPUT_LENGTH_THEOREM_NAMES.length, 10);
assert.equal(BUILDER_INPUT_LENGTH_CANDIDATES.length, 10);

function git(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function write(root, relativePath, content) {
  const filePath = path.join(root, relativePath);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function makeProject(t) {
  const root = mkdtempSync(path.join(tmpdir(), "pnplabs-formal-targets-"));
  const sourceDir = path.join(root, "pnp");
  mkdirSync(sourceDir, { recursive: true });
  t.after(() => rmSync(root, { recursive: true, force: true }));

  const status = json({
    kind: "PNPFormalReconstructionStatus0",
    concretePublicationGate: { passed: false },
    publicationStatusDerivedOnlyFromConcreteGate: true,
    mathematicalTheoremEstablished: false,
    publicTheoremEmissionAllowed: false,
    publicTheoremStatement: null,
    leanConcreteCNFSATMembershipFormalized: true,
    leanConcreteCNFSATMembershipTheorem: "PNP.Concrete.FinalUniversalDesign.cnfSATInNP",
    leanConcreteCNFWorkAxiomAuditPassed: true,
    leanConcreteCNFWorkAuditedDeclarationCount: 766,
    leanConcretePipelineStateNamespaceFormalized: true,
    leanConcretePipelineStateNamespaceAxiomAuditPassed: true,
    leanConcretePipelineStateNamespaceAuditedDeclarationCount: 39,
    leanConcretePipelineStageBridgesFormalized: true,
    leanConcretePipelineStageBridgesAxiomAuditPassed: true,
    leanConcretePipelineStageBridgesAuditedDeclarationCount: 56,
    leanConcretePipelineStageLaunchFormalized: true,
    leanConcretePipelineVerdictPreservationFormalized: true,
    leanConcretePipelineInternalOutputHandoffComposed: true,
    leanConcretePipelineTerminalOutputPackingFormalized: true,
    leanConcretePipelineTerminalOutputPackerAxiomAuditPassed: true,
    leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount: 69,
    leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized: true,
    leanConcretePipelineTerminalBridgeAxiomAuditPassed: true,
    leanConcretePipelineTerminalBridgeAuditedDeclarationCount: 59,
    leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized: true,
    leanConcretePipelineInputFramerAxiomAuditPassed: true,
    leanConcretePipelineInputFramerAuditedDeclarationCount: 70,
    leanConcretePipelineAllInputFramingFormalized: true,
    leanConcretePipelinePairedCompilerAxiomAuditPassed: true,
    leanConcretePipelinePairedCompilerAuditedDeclarationCount: 28,
    leanConcretePipelineCanonicalPairCompilationFormalized: true,
    leanConcretePipelineCompilerAxiomAuditPassed: true,
    leanConcretePipelineCompilerAuditedDeclarationCount: 29,
    leanConcretePipelineAllInputCompilationFormalized: true,
    leanConcretePipelineMalformedInputBehaviorFormalized: true,
    leanConcretePipelineRawRefinementFormalized: true,
    leanConcretePipelineExternalInputSizePolynomialFormalized: true,
    leanConcretePipelineSequentialNamespaceFormalized: true,
    leanConcretePipelineSequentialNamespaceAxiomAuditPassed: true,
    leanConcretePipelineSequentialNamespaceAuditedDeclarationCount: 26,
    leanConcretePipelineSequentialCompilationFormalized: true,
    leanConcretePipelineSequentialCompilerAxiomAuditPassed: true,
    leanConcretePipelineSequentialCompilerAuditedDeclarationCount: 31,
    leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized: true,
    leanConcretePipelineSequentialExternalInputSizePolynomialFormalized: true,
    leanConcretePipelineSequentialStuckFirstTimeoutFormalized: true,
    leanConcretePipelineRefinementAxiomAuditPassed: true,
    leanConcretePipelineRefinementAuditedDeclarationCount: 16,
    leanConcreteFunctionProgramRecursiveCompilationFormalized: true,
    leanConcreteDecisionProgramRecursiveCompilationFormalized: true,
    leanConcretePolynomialTimeDeciderRawCompilationFormalized: true,
    standardComplexityModelFormalized: true,
    leanConcreteCookLevinBuilderInputLengthFormalized: true,
    leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount: 39,
    leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized: true,
    leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized: true,
    formalPublicationMilestones: [{
      id: "concrete-cook-levin-formula-size",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true
    }, {
      id: "concrete-cook-levin-formula-schedule",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true
    }, {
      id: "concrete-cook-levin-formula-cursor",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: FORMULA_CURSOR_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-input-length",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_INPUT_LENGTH_THEOREM_NAMES
    }],
    leanConcreteCNFSATInPFormalized: false,
    leanConcreteCNFNPCompletenessFormalized: false
  });
  const inventory = json({
    kind: "PNPLeanTheoremInventory0",
    declarationCount: 6849,
    theoremCount: 3104,
    assumptionFreeTheoremCount: 2560,
    excludedPrivateDeclarationCount: 1220,
    sourceClosureModuleCount: 62,
    axiomCount: 4,
    milestoneCandidates: [{
      name: "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language",
      module: "PNP.Concrete.CookLevinRawTapeBridge",
      kind: "theorem",
      axioms: ["Classical.choice", "Quot.sound", "propext"]
    }, {
      name: "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le",
      module: "PNP.Concrete.CookLevinFormulaSize",
      kind: "theorem",
      axioms: ["Quot.sound", "propext"]
    }, {
      name: "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length",
      module: "PNP.Concrete.CookLevinFormulaSchedule",
      kind: "theorem",
      axioms: ["Quot.sound", "propext"]
    }, {
      name: "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula",
      module: "PNP.Concrete.CookLevinFormulaSchedule",
      kind: "theorem",
      axioms: ["Quot.sound", "propext"]
    }, {
      name: "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq",
      module: "PNP.Concrete.TerminalOutputPacker",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents",
      module: "PNP.Concrete.PipelineTerminalBridge",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact",
      module: "PNP.Concrete.PipelineTerminalBridge",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact",
      module: "PNP.Concrete.PipelineTerminalBridge",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_correct",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_correct",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, ...FORMULA_CURSOR_CANDIDATES, ...BUILDER_INPUT_LENGTH_CANDIDATES, ...Array.from({ length: 249 }, (_, index) => ({
      name: `PNP.Test.Filler${index}`,
      module: "PNP.Test",
      kind: "theorem",
      axioms: []
    }))],
    compatibilityRootCandidate: null,
    concreteTargetCandidate: {
      name: "PNP.Main.ConcretePEqualsNP",
      kind: "definition",
      axioms: []
    }
  });
  const publicationMap = json({
    kind: "TestPublicationMap",
    coordinate: "TEST-PUBLICATION-MAP",
    milestoneSourceClosureSha256: "1".repeat(64),
    gate: { passed: false },
    earnedMilestoneTheoremKernelTypeSha256: {
      "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact": "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29",
      "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact": "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c",
      "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact": "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01",
      "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact": "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq": "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq": "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout": "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff": "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9",
      "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact": "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents": "8f1fa6f45f267d60eadad754d9c88e4ea58631b881152af0a51244f5f7d207af",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted": "beca62f878cccce7434d899512cf9aaea25b222d113ec60df90da0fde8801faa",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le": "bac4d4c78cb57e3ab70f752e2895a2f7ddd3c5356a6d1c457dd5832413d89eab",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound": "4efe0f62d185b7ac19d73aebb09008e97f00c96a8252e263c901f8a6add7c45b",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent": "1eaa31ea98226c202722a0e67aa796b7b461ccf5367f35fff194973bb609ce8a",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept": "3ef9f8377ec7ad7ebb70aa41b978cdb22f2c1c029b26e1e4c241ce00c20781d4",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout": "48b9ee1743a6881a663fb7a1cc59984c371ff853524f9b18bad58014c229f9fe",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_correct": "8943f2f2c396dfb2e6e8232244b9ecb386fe3a7259590ed96cedb82d1cc7b22a",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq": "dd282c364787b165c9be9ca80b712c3ebf61ac95d097218300a65433a690e386",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq": "8d954e0e65847ff071a3a79a7be1c7f7d5a2f1696e3f94be3a7288500598b9d7",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout": "116c522c8a64988fd815b32bad08df882534b94b87cfa42a705fd1d8158d45af",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff": "7a6d0d03c735c83a2fb0c764a174a79402ec196a98169614b15dbee442df099e",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact": "5f5f0889b807ea0ccefdfb911ba8b583de9999f2a627745bc9317c0c6ff21a34",
      "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin": "53bd33de652a55facc74179863672a789f40f9ba6dea293c2de29fcc866b5a3d",
      "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq": "e3bb23c7f245cb516803a91468e3a3b220338c36a11790ffa5045b8c41332a24",
      "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin": "4057fc9d48be85dd7f961ce7acf5bef68ddb4ed0c8b6798617b31deb9da8c7c5",
      "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq": "8b390dd6677d6e789499b7b713855652a5e1db2c64809ddf43d079deb4099965",
      "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff": "ebc638eb12e60d97a7d33b0cdce5a6322594342547f65128c0a3f11503fa35ba",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language": "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length": "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula": "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943",
      ...FORMULA_CURSOR_THEOREM_HASHES,
      ...BUILDER_INPUT_LENGTH_THEOREM_HASHES
    }
  });

  git(sourceDir, ["init"]);
  git(sourceDir, ["config", "user.email", "audit@example.invalid"]);
  git(sourceDir, ["config", "user.name", "Audit Test"]);
  write(sourceDir, "public/pnp-status.json", status);
  write(sourceDir, "public/pnp-theorem-inventory.json", inventory);
  write(sourceDir, "publication/FORMAL_PUBLICATION_MAP.json", publicationMap);
  git(sourceDir, ["add", "."]);
  git(sourceDir, ["commit", "-m", "fixture"]);
  const commit = git(sourceDir, ["rev-parse", "HEAD"]);
  const tree = git(sourceDir, ["rev-parse", "HEAD^{tree}"]);

  write(root, "public/pnp-status.json", status);
  write(root, "public/pnp-theorem-inventory.json", inventory);

  const release = {
    kind: "PNPFormalPublicationRelease0",
    version: 0,
    status: "current-formal-reconstruction-publication-theorem-gate-closed",
    authority: "current",
    source: {
      commit,
      proofCommit: commit,
      tree,
      ref: commit,
      formalPublicationMapCoordinate: "TEST-PUBLICATION-MAP",
      formalPublicationMapSha256: sha256(Buffer.from(publicationMap)),
      leanSourceClosureSha256: "1".repeat(64),
      coordinateAloneIsAuthority: false,
      identityRequiresCommitTreeAndArtifactHashes: true
    },
    artifacts: {
      status: {
        sourcePath: "public/pnp-status.json",
        publicPath: "public/pnp-status.json",
        bytes: Buffer.byteLength(status),
        sha256: sha256(Buffer.from(status))
      },
      theoremInventory: {
        sourcePath: "public/pnp-theorem-inventory.json",
        publicPath: "public/pnp-theorem-inventory.json",
        bytes: Buffer.byteLength(inventory),
        sha256: sha256(Buffer.from(inventory))
      },
      report: {
        pageCount: 14,
        pdf: { publicPaths: [] },
        tex: { publicPaths: [] }
      }
    },
    publicationBoundary: {
      derivedOnlyFromConcreteGate: true,
      concreteGatePassed: false,
      mathematicalTheoremEstablished: false,
      publicTheoremEmissionAllowed: false,
      publicTheoremStatement: null,
      compatibilityRootPresent: false,
      concreteTargetPresent: true,
      projectSpecificAxiomsRemaining: true,
      remainingBlockerCount: 6
    },
    earnedBoundary: {
      pipelineStateNamespacesFormalized: true,
      pipelineStateNamespaceAxiomAuditPassed: true,
      pipelineStateNamespaceAuditedDeclarationCount: 39,
      pipelineStageBridgesFormalized: true,
      pipelineStageBridgeAxiomAuditPassed: true,
      pipelineStageBridgeAuditedDeclarationCount: 56,
      pipelineStageLaunchFormalized: true,
      pipelineVerdictPreservationFormalized: true,
      pipelineInternalOutputHandoffComposed: true,
      pipelineTargetTerminationFormalized: false,
      pipelineTerminalRawOutputPackingFormalized: true,
      pipelineTerminalOutputPackerAxiomAuditPassed: true,
      pipelineTerminalOutputPackerAuditedDeclarationCount: 69,
      pipelineTerminalOutputPackerTheorem: "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq",
      pipelineTerminalOutputPackerKernelTypeSha256: "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66",
      pipelineTerminalOutputPackerAxiomClosure: [],
      pipelineTerminalOutputPackerCompiledRawTimeBound: "18 * outputLength^2 + 36 * outputLength + 6",
      pipelineTerminalOutputPackerConnectedToBridge: true,
      pipelineTerminalBridgeAxiomAuditPassed: true,
      pipelineTerminalBridgeAuditedDeclarationCount: 59,
      pipelineTerminalBridgeAcceptingOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents",
      pipelineTerminalBridgeAcceptingOutputKernelTypeSha256: "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001",
      pipelineTerminalBridgeRejectingOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents",
      pipelineTerminalBridgeRejectingOutputKernelTypeSha256: "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db",
      pipelineTerminalBridgeAxiomClosure: [],
      pipelineTerminalBridgeCompiledRawTimeBound: "18 * outputLength^2 + 36 * outputLength + 12",
      pipelineSuppliedTraceWorkCostTheorem: "PNP.Concrete.PipelineTerminalBridge.suppliedTraceTerminalWorkSteps_eq",
      pipelineSuppliedTraceWorkCostKernelTypeSha256: "7d9b5bf70b1675c1843f538e046030753b7e0be7c3bd50ec5d64ce9eb5b0869e",
      pipelineSuppliedAcceptTraceTheorem: "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact",
      pipelineSuppliedAcceptTraceKernelTypeSha256: "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29",
      pipelineSuppliedRejectTraceTheorem: "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact",
      pipelineSuppliedRejectTraceKernelTypeSha256: "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c",
      pipelineSuppliedAcceptVerdictTheorem: "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_accept_of_rawRunExact",
      pipelineSuppliedAcceptVerdictKernelTypeSha256: "bbc633544f84f156eef71f1aa488a359c35ecb46b1ba1d0dfaa393d1e045fde4",
      pipelineSuppliedRejectVerdictTheorem: "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_reject_of_rawRunExact",
      pipelineSuppliedRejectVerdictKernelTypeSha256: "a2cee1b6edc38318bd4b57c82bbc6f708b3c6e676f42128be00f787477a6fbfe",
      pipelineStuckTimeoutTheorem: "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_timeout_of_stuck_rawRunExact",
      pipelineStuckTimeoutKernelTypeSha256: "0ce3f2337117d81a1a25b923c5604dcd9b8235e69598390825caae68c93d9488",
      pipelineSuppliedAcceptMachineOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact",
      pipelineSuppliedAcceptMachineOutputKernelTypeSha256: "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01",
      pipelineSuppliedRejectMachineOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact",
      pipelineSuppliedRejectMachineOutputKernelTypeSha256: "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd",
      pipelinePriorTraceTransportToTerminalBridgeFormalized: true,
      pipelineInputFramerAxiomAuditPassed: true,
      pipelineInputFramerAuditedDeclarationCount: 70,
      pipelineAllInputFramingFormalized: true,
      pipelineInputFramerWorkTraceTheorem: "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact",
      pipelineInputFramerWorkTraceKernelTypeSha256: "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a",
      pipelineInputFramerRepresentedEndpointTheorem: "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents",
      pipelineInputFramerRepresentedEndpointKernelTypeSha256: "8f1fa6f45f267d60eadad754d9c88e4ea58631b881152af0a51244f5f7d207af",
      pipelineInputFramerHaltedEndpointTheorem: "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted",
      pipelineInputFramerHaltedEndpointKernelTypeSha256: "beca62f878cccce7434d899512cf9aaea25b222d113ec60df90da0fde8801faa",
      pipelineInputFramerRawBoundTheorem: "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le",
      pipelineInputFramerRawBoundKernelTypeSha256: "bac4d4c78cb57e3ab70f752e2895a2f7ddd3c5356a6d1c457dd5832413d89eab",
      pipelineInputFramerOrdinaryStartTheorem: "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound",
      pipelineInputFramerOrdinaryStartKernelTypeSha256: "4efe0f62d185b7ac19d73aebb09008e97f00c96a8252e263c901f8a6add7c45b",
      pipelineInputFramerBlankEquivalentTheorem: "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent",
      pipelineInputFramerBlankEquivalentKernelTypeSha256: "1eaa31ea98226c202722a0e67aa796b7b461ccf5367f35fff194973bb609ce8a",
      pipelineInputFramerAcceptTheorem: "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept",
      pipelineInputFramerAcceptKernelTypeSha256: "3ef9f8377ec7ad7ebb70aa41b978cdb22f2c1c029b26e1e4c241ce00c20781d4",
      pipelineInputFramerNoTimeoutTheorem: "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout",
      pipelineInputFramerNoTimeoutKernelTypeSha256: "48b9ee1743a6881a663fb7a1cc59984c371ff853524f9b18bad58014c229f9fe",
      pipelineInputFramerAxiomClosure: [],
      pipelineInputFramerEmptyWorkSteps: "4",
      pipelineInputFramerCompleteCellsWorkSteps: "4 * k * k + 9 * k + 7",
      pipelineInputFramerPartialCellWorkSteps: "4 * k * k + 9 * k + 5",
      pipelineInputFramerRawTimePolynomial: "6 * m * m + 39 * m + 75",
      pipelinePairedCompilerAxiomAuditPassed: true,
      pipelinePairedCompilerAuditedDeclarationCount: 28,
      pipelineCanonicalPairCompilationFormalized: true,
      pipelineMalformedInputBehaviorFormalized: false,
      pipelinePairedVerdictTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq",
      pipelinePairedVerdictKernelTypeSha256: "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731",
      pipelinePairedMachineOutputTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq",
      pipelinePairedMachineOutputKernelTypeSha256: "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267",
      pipelinePairedNoTimeoutTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout",
      pipelinePairedNoTimeoutKernelTypeSha256: "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab",
      pipelinePairedAcceptsTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff",
      pipelinePairedAcceptsKernelTypeSha256: "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9",
      pipelinePairedCompilerAxiomClosure: [],
      pipelinePairedOutputSizePolynomial: "B(m) = m + p(m) + 1",
      pipelinePairedRawTimePolynomial: "Rpair(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))",
      pipelineCompilerAxiomAuditPassed: true,
      pipelineCompilerAuditedDeclarationCount: 29,
      pipelineAllInputCompilationFormalized: true,
      pipelineCompilerCorrectTheorem: "PNP.Concrete.PipelineCompiler.pipeline_correct",
      pipelineCompilerCorrectKernelTypeSha256: "e1ccd198403d41933324af1c52048c865943947c5bbd40dd94e11827b08c2303",
      pipelineVerdictTheorem: "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq",
      pipelineVerdictKernelTypeSha256: "1bafe91bba94e65a7ad654f4624f305c0ae01b3e6d656af0dd2e752d373ce87e",
      pipelineMachineOutputTheorem: "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq",
      pipelineMachineOutputKernelTypeSha256: "45e02fa1e6e6b0bcbc422c3b4fd797608b875727d22b79d6f7814e1f4f0d3da7",
      pipelineNoTimeoutTheorem: "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout",
      pipelineNoTimeoutKernelTypeSha256: "ed95c33d4fa998d79057537cd2adf847548a79b7ee9a45020b01620868273b3a",
      pipelineAcceptsTheorem: "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff",
      pipelineAcceptsKernelTypeSha256: "94e43c664b4d185e48553ab25541925830fec7086fcbbab5215dacdcde1af6a6",
      pipelineAllInputStuckTimeoutTheorem: "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact",
      pipelineAllInputStuckTimeoutKernelTypeSha256: "a6edef0532eb89036d0e6813cffb94b321f9160a08035671eb411c813ef0a3de",
      pipelineCompilerAxiomClosure: [],
      pipelineOutputSizePolynomial: "B(m) = m + p(m) + 1",
      pipelineRawTimePolynomial: "R(m) = totalInputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))",
      pipelineMalformedInputBehaviorFormalized: true,
      pipelineRawRefinementFormalized: true,
      pipelineExternalInputSizePolynomialFormalized: true,
      pipelineSequentialNamespaceFormalized: true,
      pipelineSequentialNamespaceAxiomAuditPassed: true,
      pipelineSequentialNamespaceAuditedDeclarationCount: 26,
      pipelineSequentialNamespaceAxiomClosure: [],
      pipelineSequentialCompilationFormalized: true,
      pipelineSequentialCompilerAxiomAuditPassed: true,
      pipelineSequentialCompilerAuditedDeclarationCount: 31,
      pipelineSequentialVerdictAndOutputPreservationFormalized: true,
      pipelineSequentialExternalInputSizePolynomialFormalized: true,
      pipelineSequentialStuckFirstTimeoutFormalized: true,
      pipelineSequentialCorrectTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_correct",
      pipelineSequentialCorrectKernelTypeSha256: "8943f2f2c396dfb2e6e8232244b9ecb386fe3a7259590ed96cedb82d1cc7b22a",
      pipelineSequentialVerdictTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq",
      pipelineSequentialVerdictKernelTypeSha256: "dd282c364787b165c9be9ca80b712c3ebf61ac95d097218300a65433a690e386",
      pipelineSequentialMachineOutputTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq",
      pipelineSequentialMachineOutputKernelTypeSha256: "8d954e0e65847ff071a3a79a7be1c7f7d5a2f1696e3f94be3a7288500598b9d7",
      pipelineSequentialNoTimeoutTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout",
      pipelineSequentialNoTimeoutKernelTypeSha256: "116c522c8a64988fd815b32bad08df882534b94b87cfa42a705fd1d8158d45af",
      pipelineSequentialAcceptsTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff",
      pipelineSequentialAcceptsKernelTypeSha256: "7a6d0d03c735c83a2fb0c764a174a79402ec196a98169614b15dbee442df099e",
      pipelineSequentialStuckFirstTimeoutTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact",
      pipelineSequentialStuckFirstTimeoutKernelTypeSha256: "5f5f0889b807ea0ccefdfb911ba8b583de9999f2a627745bc9317c0c6ff21a34",
      pipelineSequentialCompilerAxiomClosure: [],
      pipelineSequentialOutputSizePolynomial: "Bseq(m) = m + p(m) + 1",
      pipelineSequentialRawTimePolynomial: "Rseq(m) = PipelineRaw(p)(m) + 6 + PipelineRaw(q)(m + p(m) + 1)",
      pipelineRefinementAxiomAuditPassed: true,
      pipelineRefinementAuditedDeclarationCount: 16,
      pipelineRefinementAxiomClosure: [],
      functionProgramRecursiveCompilationFormalized: true,
      decisionProgramRecursiveCompilationFormalized: true,
      polynomialTimeDeciderRawCompilationFormalized: true,
      functionProgramCompileHaltsTheorem: "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin",
      functionProgramCompileHaltsKernelTypeSha256: "53bd33de652a55facc74179863672a789f40f9ba6dea293c2de29fcc866b5a3d",
      functionProgramCompileOutputTheorem: "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq",
      functionProgramCompileOutputKernelTypeSha256: "e3bb23c7f245cb516803a91468e3a3b220338c36a11790ffa5045b8c41332a24",
      decisionProgramCompileHaltsTheorem: "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin",
      decisionProgramCompileHaltsKernelTypeSha256: "4057fc9d48be85dd7f961ce7acf5bef68ddb4ed0c8b6798617b31deb9da8c7c5",
      decisionProgramCompileVerdictTheorem: "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq",
      decisionProgramCompileVerdictKernelTypeSha256: "8b390dd6677d6e789499b7b713855652a5e1db2c64809ddf43d079deb4099965",
      polynomialTimeDeciderCompileAcceptsTheorem: "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff",
      polynomialTimeDeciderCompileAcceptsKernelTypeSha256: "ebc638eb12e60d97a7d33b0cdce5a6322594342547f65128c0a3f11503fa35ba",
      standardComplexityModelFormalized: true,
      concreteComplexityMachineLinkDischarged: true,
      cookLevinRawTapeBridgeFormalized: true,
      cookLevinRawTapeBridgeAxiomAuditPassed: true,
      cookLevinRawTapeBridgeAuditedDeclarationCount: 54,
      cookLevinSemanticReductionCorrectnessFormalized: true,
      cookLevinSemanticTheorem: "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language",
      cookLevinSemanticKernelTypeSha256: "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d",
      cookLevinRawTapeBridgeAxiomClosure: ["Classical.choice", "Quot.sound", "propext"],
      cookLevinProjectAxiomClosure: [],
      cookLevinFormulaSizeAxiomAuditPassed: true,
      cookLevinFormulaSizeAuditedDeclarationCount: 108,
      cookLevinEncodedFormulaSizePolynomialFormalized: true,
      cookLevinEncodedFormulaSizeTheorem: "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le",
      cookLevinEncodedFormulaSizeKernelTypeSha256: "c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699",
      cookLevinFormulaSizeAxiomClosure: ["Quot.sound", "propext"],
      cookLevinFormulaSizeProjectAxiomClosure: [],
      cookLevinFormulaScheduleFormalized: true,
      cookLevinFormulaScheduleAxiomAuditPassed: true,
      cookLevinFormulaScheduleAuditedDeclarationCount: 79,
      cookLevinFormulaScheduleAnswerIndependent: true,
      cookLevinFormulaScheduleExactEmissionFormalized: true,
      cookLevinFormulaScheduleExactLengthPolynomialFormalized: true,
      cookLevinFormulaScheduleLengthTheorem: "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length",
      cookLevinFormulaScheduleLengthKernelTypeSha256: "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4",
      cookLevinFormulaScheduleEmitTheorem: "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula",
      cookLevinFormulaScheduleEmitKernelTypeSha256: "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943",
      cookLevinFormulaScheduleAxiomClosure: ["Quot.sound", "propext"],
      cookLevinFormulaScheduleProjectAxiomClosure: [],
      cookLevinFormulaScheduleConstantTimeRawInterpretationFormalized: false,
      ...structuredClone(Object.fromEntries(Object.entries(publishedRelease.earnedBoundary).filter(
        ([name]) => name.startsWith("cookLevinFormulaCursor")
      ))),
      ...structuredClone(Object.fromEntries(Object.entries(publishedRelease.earnedBoundary).filter(
        ([name]) => name.startsWith("cookLevinBuilder") || name.startsWith("cookLevinCompleteRawFormulaBuilder")
      ))),
      cookLevinRawFormulaBuilderFormalized: false,
      cookLevinFormulaScheduleFunctionProgramRawRefinementFormalized: false,
      cookLevinFormulaConstructionRuntimePolynomialFormalized: false,
      cookLevinPolynomialReductionFormalized: false
    },
    historicalArchive: {
      status: "historical-quarantined-not-current-authority",
      currentArtifactEligible: false,
      mayActivateTheoremPublication: false
    }
  };
  write(root, "downloads/formal-publication-release.json", json(release));

  const targets = {
    kind: "PNPLabsCrossRepositoryAuditTargets0",
    version: 2,
    refs: {
      currentCoreRef: {
        repo: "test/pnp",
        ref: commit,
        expectedCommit: commit,
        expectedTree: tree,
        class: "current"
      },
      publicCheckout: { repo: "test/pnplabs", ref: "working tree", class: "public" }
    },
    targets: [
      { id: "core.status", kind: "current core publication file", refClass: "currentCoreRef", path: "public/pnp-status.json" },
      { id: "core.inventory", kind: "current core publication file", refClass: "currentCoreRef", path: "public/pnp-theorem-inventory.json" },
      { id: "core.publication_map", kind: "current core publication file", refClass: "currentCoreRef", path: "publication/FORMAL_PUBLICATION_MAP.json" },
      { id: "public.formal_publication_manifest", kind: "pnplabs current release metadata", refClass: "publicCheckout", path: "downloads/formal-publication-release.json" },
      { id: "public.status", kind: "pnplabs current core mirror", refClass: "publicCheckout", path: "public/pnp-status.json", mirrorOf: "core.status" },
      { id: "public.inventory", kind: "pnplabs current core mirror", refClass: "publicCheckout", path: "public/pnp-theorem-inventory.json", mirrorOf: "core.inventory" }
    ]
  };
  write(root, "docs/audit_targets.json", json(targets));

  return { root, sourceDir, commit, tree, release, targets };
}

function validate(project, overrides = {}) {
  return validateAuditTargets({
    root: project.root,
    sourceDir: project.sourceDir,
    expectedCoreIdentity: { commit: project.commit, proofCommit: project.commit, tree: project.tree },
    ...overrides
  });
}

function expectFailure(project, pattern, overrides = {}) {
  assert.throws(
    () => validate(project, overrides),
    (error) => {
      assert.ok(error instanceof AuditTargetValidationError);
      assert.match(error.failures.join("\n"), pattern);
      return true;
    }
  );
}

test("accepts exact current mirrors pinned to one core commit and tree", (t) => {
  const project = makeProject(t);
  const result = validate(project, { requireSource: true });
  assert.equal(result.skipped, false);
  assert.equal(result.mirroredTargets, 2);
  assert.equal(result.refs.currentCoreRef.commit, project.commit);
  assert.equal(result.refs.currentCoreRef.tree, project.tree);
});

test("rejects byte drift in a current public mirror", (t) => {
  const project = makeProject(t);
  write(project.root, "public/pnp-status.json", "{}\n");
  expectFailure(project, /release artifact identity mismatch: public\/pnp-status\.json/);
});

test("rejects a current core target assigned to the public checkout", (t) => {
  const project = makeProject(t);
  project.targets.targets[0].refClass = "publicCheckout";
  write(project.root, "docs/audit_targets.json", json(project.targets));
  expectFailure(project, /core\.status: current core publication file must use currentCoreRef/);
});

test("rejects historical refs that are not explicitly quarantined", (t) => {
  const project = makeProject(t);
  project.targets.refs.historicalSourceRef = {
    repo: "test/pnp",
    ref: project.commit,
    expectedCommit: project.commit,
    class: "historical",
    status: "current"
  };
  write(project.root, "docs/audit_targets.json", json(project.targets));
  expectFailure(project, /historicalSourceRef: historical ref is not explicitly quarantined/);
});

test("rejects a self-consistent manifest that opens theorem publication", (t) => {
  const project = makeProject(t);
  project.release.publicationBoundary.publicTheoremEmissionAllowed = true;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication manifest does not fail closed/);
});

test("rejects pipeline bridge publication without the compiled axiom audits", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineStageBridgeAxiomAuditPassed = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication pipeline stage-bridge boundary mismatch/);
});

test("rejects a terminal bridge narrowed back to an unconnected packer", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineTerminalOutputPackerConnectedToBridge = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication terminal-output packer evidence mismatch/);
});

test("rejects removal of the supplied prior-trace transport", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelinePriorTraceTransportToTerminalBridgeFormalized = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication terminal-bridge supplied-trace boundary mismatch/);
});

test("rejects publication of the all-input framer without its compiled axiom audit", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineInputFramerAxiomAuditPassed = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication all-input framer audit boundary mismatch/);
});

test("rejects drift in the all-input framer polynomial or theorem fingerprint", (t) => {
  const polynomial = makeProject(t);
  polynomial.release.earnedBoundary.pipelineInputFramerRawTimePolynomial = "0";
  write(polynomial.root, "downloads/formal-publication-release.json", json(polynomial.release));
  expectFailure(polynomial, /formal-publication all-input framer polynomial evidence mismatch/);

  const fingerprint = makeProject(t);
  fingerprint.release.earnedBoundary.pipelineInputFramerNoTimeoutKernelTypeSha256 = "0".repeat(64);
  write(fingerprint.root, "downloads/formal-publication-release.json", json(fingerprint.release));
  expectFailure(fingerprint, /formal-publication all-input framer verdict evidence mismatch/);
});

test("rejects removal of all-input malformed-input behavior", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineMalformedInputBehaviorFormalized = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication all-input compiler boundary mismatch/);
});

test("rejects removal of the all-input external polynomial", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineExternalInputSizePolynomialFormalized = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication all-input compiler boundary mismatch/);
});

test("rejects drift in the all-input runtime polynomial", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineRawTimePolynomial = "R(m) = 0";
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication all-input compiler polynomial evidence mismatch/);
});

test("rejects all-input compiler audit, theorem fingerprint, or RawRefinement removal drift", (t) => {
  const audit = makeProject(t);
  audit.release.earnedBoundary.pipelineCompilerAxiomAuditPassed = false;
  write(audit.root, "downloads/formal-publication-release.json", json(audit.release));
  expectFailure(audit, /formal-publication all-input compiler audit boundary mismatch/);

  const fingerprint = makeProject(t);
  fingerprint.release.earnedBoundary.pipelineVerdictKernelTypeSha256 = "0".repeat(64);
  write(fingerprint.root, "downloads/formal-publication-release.json", json(fingerprint.release));
  expectFailure(fingerprint, /all-input compiler verdict evidence mismatch/);

  const removed = makeProject(t);
  removed.release.earnedBoundary.pipelineRawRefinementFormalized = false;
  write(removed.root, "downloads/formal-publication-release.json", json(removed.release));
  expectFailure(removed, /formal-publication all-input compiler boundary mismatch/);
});

test("rejects sequential compiler or recursive refinement evidence drift", (t) => {
  const sequential = makeProject(t);
  sequential.release.earnedBoundary.pipelineSequentialRawTimePolynomial = "Rseq(m) = 0";
  write(sequential.root, "downloads/formal-publication-release.json", json(sequential.release));
  expectFailure(sequential, /formal-publication sequential polynomial evidence mismatch/);

  const refinement = makeProject(t);
  refinement.release.earnedBoundary.pipelineRefinementAxiomAuditPassed = false;
  write(refinement.root, "downloads/formal-publication-release.json", json(refinement.release));
  expectFailure(refinement, /formal-publication recursive refinement boundary mismatch/);

  const fingerprint = makeProject(t);
  fingerprint.release.earnedBoundary.polynomialTimeDeciderCompileAcceptsKernelTypeSha256 = "0".repeat(64);
  write(fingerprint.root, "downloads/formal-publication-release.json", json(fingerprint.release));
  expectFailure(fingerprint, /formal-publication polynomial-time decider compilation evidence mismatch/);
});

test("rejects Cook-Levin formula-size/schedule identity, axiom, or construction overclaim drift", (t) => {
  const fingerprint = makeProject(t);
  fingerprint.release.earnedBoundary.cookLevinEncodedFormulaSizeKernelTypeSha256 = "0".repeat(64);
  write(fingerprint.root, "downloads/formal-publication-release.json", json(fingerprint.release));
  expectFailure(fingerprint, /formal-publication Cook-Levin formula-size identity mismatch/);

  const axiom = makeProject(t);
  axiom.release.earnedBoundary.cookLevinFormulaSizeProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(axiom.root, "downloads/formal-publication-release.json", json(axiom.release));
  expectFailure(axiom, /formal-publication Cook-Levin formula-size axiom closure mismatch/);

  const scheduleFingerprint = makeProject(t);
  scheduleFingerprint.release.earnedBoundary.cookLevinFormulaScheduleLengthKernelTypeSha256 = "0".repeat(64);
  write(scheduleFingerprint.root, "downloads/formal-publication-release.json", json(scheduleFingerprint.release));
  expectFailure(scheduleFingerprint, /formal-publication Cook-Levin formula-schedule length identity mismatch/);

  const scheduleAxiom = makeProject(t);
  scheduleAxiom.release.earnedBoundary.cookLevinFormulaScheduleProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(scheduleAxiom.root, "downloads/formal-publication-release.json", json(scheduleAxiom.release));
  expectFailure(scheduleAxiom, /formal-publication Cook-Levin formula-schedule axiom closure mismatch/);

  const cursorFingerprint = makeProject(t);
  cursorFingerprint.release.earnedBoundary.cookLevinFormulaCursorTheoremKernelTypeSha256[
    FORMULA_CURSOR_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(cursorFingerprint.root, "downloads/formal-publication-release.json", json(cursorFingerprint.release));
  expectFailure(cursorFingerprint, /formal-publication Cook-Levin formula-cursor fingerprint mismatch/);

  const cursorAxiom = makeProject(t);
  cursorAxiom.release.earnedBoundary.cookLevinFormulaCursorProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(cursorAxiom.root, "downloads/formal-publication-release.json", json(cursorAxiom.release));
  expectFailure(cursorAxiom, /formal-publication Cook-Levin formula-cursor axiom closure mismatch/);

  const cursorRawInterpreter = makeProject(t);
  cursorRawInterpreter.release.earnedBoundary.cookLevinFormulaCursorConstantTimeRawInterpretationFormalized = true;
  write(cursorRawInterpreter.root, "downloads/formal-publication-release.json", json(cursorRawInterpreter.release));
  expectFailure(cursorRawInterpreter, /formal-publication overstates the Cook-Levin formula cursor/);

  const builderFingerprint = makeProject(t);
  builderFingerprint.release.earnedBoundary.cookLevinBuilderInputLengthTheoremKernelTypeSha256[
    BUILDER_INPUT_LENGTH_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(builderFingerprint.root, "downloads/formal-publication-release.json", json(builderFingerprint.release));
  expectFailure(builderFingerprint, /formal-publication Cook-Levin builder input-length fingerprint mismatch/);

  const builderAxiom = makeProject(t);
  builderAxiom.release.earnedBoundary.cookLevinBuilderInputLengthProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(builderAxiom.root, "downloads/formal-publication-release.json", json(builderAxiom.release));
  expectFailure(builderAxiom, /formal-publication Cook-Levin builder input-length axiom closure mismatch/);

  const builderOverclaim = makeProject(t);
  builderOverclaim.release.earnedBoundary.cookLevinBuilderFormulaBitsEmittedFormalized = true;
  write(builderOverclaim.root, "downloads/formal-publication-release.json", json(builderOverclaim.release));
  expectFailure(builderOverclaim, /formal-publication overstates the Cook-Levin builder/);

  const rawBuilder = makeProject(t);
  rawBuilder.release.earnedBoundary.cookLevinRawFormulaBuilderFormalized = true;
  write(rawBuilder.root, "downloads/formal-publication-release.json", json(rawBuilder.release));
  expectFailure(rawBuilder, /formal-publication overstates Cook-Levin construction complexity/);

  const runtime = makeProject(t);
  runtime.release.earnedBoundary.cookLevinFormulaConstructionRuntimePolynomialFormalized = true;
  write(runtime.root, "downloads/formal-publication-release.json", json(runtime.release));
  expectFailure(runtime, /formal-publication overstates Cook-Levin construction complexity/);
});

test("rejects drift in the retained canonical-pair runtime polynomial", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelinePairedRawTimePolynomial = "Rpair(m) = 0";
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication canonical-pair polynomial evidence mismatch/);
});

test("rejects a drifted canonical-pair theorem fingerprint", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelinePairedVerdictKernelTypeSha256 = "0".repeat(64);
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /canonical-pair verdict evidence mismatch/);
});

test("skips only the cross-repository phase when a source checkout is optional", (t) => {
  const project = makeProject(t);
  const result = validate(project, { sourceDir: path.join(project.root, "missing-pnp") });
  assert.equal(result.skipped, true);
  assert.match(result.skipReason, /not a git checkout/);
});

test("fails when the exact source checkout is required but absent", (t) => {
  const project = makeProject(t);
  expectFailure(project, /not a git checkout/, {
    sourceDir: path.join(project.root, "missing-pnp"),
    requireSource: true
  });
});
