#!/usr/bin/env node
import { createHash, randomBytes } from "node:crypto";
import {
  closeSync,
  existsSync,
  fsyncSync,
  lstatSync,
  openSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { verifyReleaseSeal } from "./verify-release-seal.mjs";

const CORE_COMMIT = "d335c29ce499acddb16c5fc50afa622a6ea9075f";
const CORE_TREE = "1ae0cb8569bdfb16c3d166c0445ba319ef591095";
const OLD_PDF_SHA256 = "53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d";
const OLD_TEX_SHA256 = "414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7";

const CORE_FILES = [
  {
    sourcePath: "canonical_proof_report.pdf",
    targets: ["downloads/canonical_proof_report.pdf", "downloads/canonical-proof-report.pdf"],
    bytes: 259717,
    sha256: "fa21b3c8a12d488f34aa2d1342d6d924df801c94a357f208a719ea63da42a834"
  },
  {
    sourcePath: "canonical_proof_report.tex",
    targets: ["downloads/canonical_proof_report.tex", "downloads/canonical-proof-report.tex"],
    bytes: 26828,
    sha256: "687fc093579d6d041434b3f54507cec3c3bec30ef0b485d4f172f5c7aea24933"
  },
  {
    sourcePath: "public/pnp-status.json",
    targets: ["public/pnp-status.json"],
    bytes: 208534,
    sha256: "cb49ed1b2d90742f5e8d9ef0e5f1b1e8e5a7d8fe97afdc555bb7e7aa2eb3bc99"
  },
  {
    sourcePath: "public/pnp-theorem-inventory.json",
    targets: ["public/pnp-theorem-inventory.json"],
    bytes: 1877392,
    sha256: "ba12bb915845d6c2e75605b205f0229e4e58f6c6ec751eebc4fd7c6bebbc868d"
  }
];

function fail(message) {
  throw new Error(message);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function isContained(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function assertSafeMirrorTarget(root, targetPath, mustExist) {
  const relative = path.relative(root, targetPath);
  if (path.isAbsolute(relative) || relative === ".." || relative.startsWith(`..${path.sep}`)) {
    fail(`${targetPath}: target escapes repository root`);
  }
  const rootInfo = lstatSync(root);
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) fail(`${root}: repository root must be a real directory`);
  const rootReal = realpathSync(root);
  const parent = path.dirname(targetPath);
  const parentRelative = path.relative(root, parent);
  let cursor = root;
  for (const segment of parentRelative.split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, segment);
    if (!existsSync(cursor)) fail(`${cursor}: target parent is missing`);
    const info = lstatSync(cursor);
    if (!info.isDirectory() || info.isSymbolicLink()) fail(`${cursor}: target parent must be a real directory`);
  }
  const parentReal = realpathSync(parent);
  if (!isContained(rootReal, parentReal)) fail(`${targetPath}: resolved target parent escapes repository root`);
  if (!existsSync(targetPath)) {
    if (mustExist) fail(`${targetPath}: mirror target is missing`);
    return;
  }
  const targetInfo = lstatSync(targetPath);
  if (!targetInfo.isFile() || targetInfo.isSymbolicLink()) fail(`${targetPath}: mirror target must be a regular non-symlink file`);
}

export function writeMirrorFileAtomically(rootInput, targetInput, bytes) {
  const root = path.resolve(rootInput);
  const targetPath = path.resolve(targetInput);
  assertSafeMirrorTarget(root, targetPath, false);
  const parent = path.dirname(targetPath);
  const temporary = path.join(
    parent,
    `.${path.basename(targetPath)}.tmp-${process.pid}-${randomBytes(12).toString("hex")}`
  );
  let descriptor = null;
  try {
    descriptor = openSync(temporary, "wx", 0o644);
    writeFileSync(descriptor, bytes);
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = null;
    assertSafeMirrorTarget(root, targetPath, false);
    renameSync(temporary, targetPath);
  } finally {
    if (descriptor !== null) closeSync(descriptor);
    rmSync(temporary, { force: true });
  }
}

function git(sourceDir, args, encoding = "utf8") {
  const result = spawnSync("git", ["-C", sourceDir, ...args], {
    encoding,
    maxBuffer: 16 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.status !== 0) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString("utf8") : result.stderr;
    const stdout = Buffer.isBuffer(result.stdout) ? result.stdout.toString("utf8") : result.stdout;
    fail(`git ${args.join(" ")} failed: ${(stderr || stdout || "unknown failure").trim()}`);
  }
  return encoding === null ? result.stdout : result.stdout.trim();
}

function coreBlob(sourceDir, sourcePath) {
  return git(sourceDir, ["show", `${CORE_COMMIT}:${sourcePath}`], null);
}

function assertPinnedCore(sourceDir) {
  if (!existsSync(path.join(sourceDir, ".git"))) fail(`PNP_SOURCE_DIR is not a git checkout: ${sourceDir}`);
  if (git(sourceDir, ["cat-file", "-t", CORE_COMMIT]) !== "commit") fail("pinned core object is not a commit");
  if (git(sourceDir, ["rev-parse", `${CORE_COMMIT}^{commit}`]) !== CORE_COMMIT) fail("pinned core commit cannot be resolved exactly");
  if (git(sourceDir, ["rev-parse", `${CORE_COMMIT}^{tree}`]) !== CORE_TREE) fail("pinned core tree does not match the reviewed merge");

  const map = coreBlob(sourceDir, "publication/FORMAL_PUBLICATION_MAP.json");
  if (sha256(map) !== "db60b698d0d2fa0db0a1cd309d8d8c84483ca13e892e9fd887b96b7cc27faffa") {
    fail("pinned formal-publication map digest mismatch");
  }
  const publicationMap = JSON.parse(map.toString("utf8"));
  const rawTapeTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language";
  const formulaSizeTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le";
  if (publicationMap.coordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-15-40"
      || publicationMap.milestoneSourceClosureSha256 !== "79da4cdee30162ef20a69b8a3592ea5ed2c59ed5ad692c2015f6a16add3adc02"
      || publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[rawTapeTheorem] !== "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d") {
    fail("pinned formal-publication map Cook-Levin identity mismatch");
  }
  const rawTapeMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-raw-tape-bridge");
  if (!rawTapeMilestone
      || rawTapeMilestone.classification !== "formalized-foundation-only"
      || !rawTapeMilestone.requiredTheorems?.includes(rawTapeTheorem)
      || !rawTapeMilestone.nonClaim?.includes("does not yet prove external encoded-formula-size or formula-construction-runtime polynomials")) {
    fail("pinned formal-publication map Cook-Levin nonclaim mismatch");
  }
  const formulaSizeMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-size");
  if (!formulaSizeMilestone
      || formulaSizeMilestone.classification !== "formalized-foundation-only"
      || !formulaSizeMilestone.requiredTheorems?.includes(formulaSizeTheorem)
      || publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[formulaSizeTheorem] !== "c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699"
      || !formulaSizeMilestone.nonClaim?.includes("does not implement or time a raw finite formula builder")) {
    fail("pinned formal-publication map Cook-Levin formula-size identity mismatch");
  }
}

function checkPdfPageCount(pdfPath) {
  const result = spawnSync("pdfinfo", [pdfPath], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.status !== 0) fail(`pdfinfo failed for ${pdfPath}: ${(result.stderr || result.stdout || "pdfinfo unavailable").trim()}`);
  const match = result.stdout.match(/^Pages:\s+(\d+)\s*$/m);
  if (!match || Number(match[1]) !== 13) fail(`${pdfPath}: expected exactly thirteen pages`);
}

function assertCorePayloadBoundary(sourcePath, buffer) {
  if (!sourcePath.endsWith(".json")) return;
  const payload = JSON.parse(buffer.toString("utf8"));
  if (sourcePath === "public/pnp-status.json") {
    if (payload.coordinate !== "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-15-40" || payload.publicSurfaceBaselineCoordinate !== "PUBLIC-SURFACE-BASELINE-2026-07-15-COOK-LEVIN-FORMULA-SIZE-39") fail("core status coordinate mismatch");
    if (payload.formalPublicationMapCoordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-15-40" || payload.formalPublicationMapSha256 !== "db60b698d0d2fa0db0a1cd309d8d8c84483ca13e892e9fd887b96b7cc27faffa" || payload.leanSourceClosureSha256 !== "79da4cdee30162ef20a69b8a3592ea5ed2c59ed5ad692c2015f6a16add3adc02") fail("core status source identity mismatch");
    if (payload.concretePublicationGate?.passed !== false || payload.publicationStatusDerivedOnlyFromConcreteGate !== true) fail("core status concrete publication boundary mismatch");
    if (payload.mathematicalTheoremEstablished !== false || payload.publicTheoremEmissionAllowed !== false || payload.publicTheoremStatement !== null) fail("core status does not fail closed");
    if (payload.rootLeanTheoremPresent !== false || payload.projectSpecificAxiomsRemaining !== true || payload.remainingBlockers?.length !== 6) fail("core status blocker boundary mismatch");
    if (payload.leanConcreteCNFSATMembershipFormalized !== true || payload.leanConcreteCNFSATMembershipTheorem !== "PNP.Concrete.FinalUniversalDesign.cnfSATInNP") fail("core status CNF-SAT NP-membership boundary mismatch");
    if (payload.leanConcreteCNFWorkAxiomAuditPassed !== true || payload.leanConcreteCNFWorkAuditedDeclarationCount !== 766) fail("core status CNF work audit boundary mismatch");
    if (payload.leanConcretePipelineStateNamespaceFormalized !== true || payload.leanConcretePipelineStateNamespaceAxiomAuditPassed !== true || payload.leanConcretePipelineStateNamespaceAuditedDeclarationCount !== 39) fail("core status pipeline namespace boundary mismatch");
    if (payload.leanConcretePipelineStageBridgesFormalized !== true || payload.leanConcretePipelineStageBridgesAxiomAuditPassed !== true || payload.leanConcretePipelineStageBridgesAuditedDeclarationCount !== 56) fail("core status pipeline stage-bridge boundary mismatch");
    if (payload.leanConcretePipelineStageLaunchFormalized !== true || payload.leanConcretePipelineVerdictPreservationFormalized !== true || payload.leanConcretePipelineInternalOutputHandoffComposed !== true) fail("core status pipeline bridge composition boundary mismatch");
    if (payload.leanConcretePipelineTerminalOutputPackingFormalized !== true || payload.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed !== true || payload.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount !== 69) fail("core status terminal-output packer boundary mismatch");
    if (payload.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized !== true || payload.leanConcretePipelineTerminalBridgeAxiomAuditPassed !== true || payload.leanConcretePipelineTerminalBridgeAuditedDeclarationCount !== 59) fail("core status terminal-bridge suffix boundary mismatch");
    if (payload.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized !== true) fail("core status supplied-trace transport boundary mismatch");
    if (payload.leanConcretePipelineInputFramerAxiomAuditPassed !== true || payload.leanConcretePipelineInputFramerAuditedDeclarationCount !== 70 || payload.leanConcretePipelineAllInputFramingFormalized !== true) fail("core status all-input framer boundary mismatch");
    if (payload.leanConcretePipelinePairedCompilerAxiomAuditPassed !== true || payload.leanConcretePipelinePairedCompilerAuditedDeclarationCount !== 28) fail("core status canonical-pair compiler audit boundary mismatch");
    if (payload.leanConcretePipelineCanonicalPairCompilationFormalized !== true || payload.leanConcretePipelineExternalInputSizePolynomialFormalized !== true) fail("core status canonical-pair compiler boundary mismatch");
    if (payload.leanConcretePipelineCompilerAxiomAuditPassed !== true || payload.leanConcretePipelineCompilerAuditedDeclarationCount !== 29 || payload.leanConcretePipelineAllInputCompilationFormalized !== true) fail("core status all-input compiler audit boundary mismatch");
    if (payload.leanConcretePipelineMalformedInputBehaviorFormalized !== true || payload.leanConcretePipelineRawRefinementFormalized !== true) fail("core status all-input compiler boundary mismatch");
    if (payload.leanConcretePipelineSequentialNamespaceFormalized !== true || payload.leanConcretePipelineSequentialNamespaceAxiomAuditPassed !== true || payload.leanConcretePipelineSequentialNamespaceAuditedDeclarationCount !== 26) fail("core status sequential namespace boundary mismatch");
    if (payload.leanConcretePipelineSequentialCompilationFormalized !== true || payload.leanConcretePipelineSequentialCompilerAxiomAuditPassed !== true || payload.leanConcretePipelineSequentialCompilerAuditedDeclarationCount !== 31 || payload.leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized !== true || payload.leanConcretePipelineSequentialExternalInputSizePolynomialFormalized !== true || payload.leanConcretePipelineSequentialStuckFirstTimeoutFormalized !== true) fail("core status sequential compiler boundary mismatch");
    if (payload.leanConcretePipelineRefinementAxiomAuditPassed !== true || payload.leanConcretePipelineRefinementAuditedDeclarationCount !== 16 || payload.leanConcreteFunctionProgramRecursiveCompilationFormalized !== true || payload.leanConcreteDecisionProgramRecursiveCompilationFormalized !== true || payload.leanConcretePolynomialTimeDeciderRawCompilationFormalized !== true || payload.standardComplexityModelFormalized !== true) fail("core status recursive refinement boundary mismatch");
    const formulaSizeMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-size");
    if (!formulaSizeMilestone || formulaSizeMilestone.earned !== true || formulaSizeMilestone.allPresent !== true || formulaSizeMilestone.allKernelTypesMatch !== true || formulaSizeMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true) fail("core status Cook-Levin formula-size boundary mismatch");
    if (payload.leanConcreteCNFSATInPFormalized !== false || payload.leanConcreteCNFNPCompletenessFormalized !== false) fail("core status overstates the CNF-SAT result");
  } else if (sourcePath === "public/pnp-theorem-inventory.json") {
    if (payload.coordinate !== "PNP-LEAN-THEOREM-INVENTORY-2026-07-15-40") fail("core inventory coordinate mismatch");
    if (payload.compatibilityRootCandidate !== null || payload.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("core inventory publication boundary mismatch");
    if (payload.declarationCount !== 6459 || payload.theoremCount !== 2883 || payload.assumptionFreeTheoremCount !== 2495 || payload.excludedPrivateDeclarationCount !== 1077 || payload.sourceClosureModuleCount !== 59 || payload.axiomCount !== 4) fail("core inventory counts mismatch");
    const cookLevinBridge = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language");
    if (!cookLevinBridge
        || cookLevinBridge.kind !== "theorem"
        || cookLevinBridge.module !== "PNP.Concrete.CookLevinRawTapeBridge"
        || JSON.stringify(cookLevinBridge.axioms) !== JSON.stringify(["Classical.choice", "Quot.sound", "propext"])) {
      fail("core inventory Cook-Levin raw-tape theorem boundary mismatch");
    }
    const formulaSize = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le");
    if (!formulaSize
        || formulaSize.kind !== "theorem"
        || formulaSize.module !== "PNP.Concrete.CookLevinFormulaSize"
        || JSON.stringify(formulaSize.axioms) !== JSON.stringify(["Quot.sound", "propext"])) {
      fail("core inventory Cook-Levin formula-size theorem boundary mismatch");
    }
    if (payload.milestoneCandidates?.some((candidate) => candidate.name === "PNP.Concrete.cnfSATNPComplete" || candidate.name === "PNP.Concrete.cnfSATInP" || candidate.name === "PNP.Main.p_eq_np")) fail("core inventory overstates the Cook-Levin milestone");
    const packer = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
    if (!packer || packer.kind !== "theorem" || packer.module !== "PNP.Concrete.TerminalOutputPacker" || packer.axioms?.length !== 0) fail("core inventory terminal-output packer theorem boundary mismatch");
    const terminalBridge = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
    if (!terminalBridge || terminalBridge.kind !== "theorem" || terminalBridge.module !== "PNP.Concrete.PipelineTerminalBridge" || terminalBridge.axioms?.length !== 0) fail("core inventory terminal-bridge theorem boundary mismatch");
    const suppliedTrace = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact");
    const suppliedOutput = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact");
    if (!suppliedTrace || suppliedTrace.kind !== "theorem" || suppliedTrace.axioms?.length !== 0 || !suppliedOutput || suppliedOutput.kind !== "theorem" || suppliedOutput.axioms?.length !== 0) fail("core inventory supplied terminal-trace boundary mismatch");
    const pairedVerdict = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq");
    const pairedOutput = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq");
    const pairedTimeout = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout");
    const pairedAccepts = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff");
    if (!pairedVerdict || pairedVerdict.kind !== "theorem" || pairedVerdict.axioms?.length !== 0 || !pairedOutput || pairedOutput.kind !== "theorem" || pairedOutput.axioms?.length !== 0 || !pairedTimeout || pairedTimeout.kind !== "theorem" || pairedTimeout.axioms?.length !== 0 || !pairedAccepts || pairedAccepts.kind !== "theorem" || pairedAccepts.axioms?.length !== 0) fail("core inventory canonical-pair compiler boundary mismatch");
    for (const name of [
      "PNP.Concrete.PipelineCompiler.pipeline_correct",
      "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq",
      "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq",
      "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout",
      "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff",
      "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineCompiler" || theorem.axioms?.length !== 0) fail(`core inventory all-input compiler theorem mismatch: ${name}`);
    }
    for (const name of [
      "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineInputFramer" || theorem.axioms?.length !== 0) fail(`core inventory all-input framer theorem mismatch: ${name}`);
    }
    for (const name of [
      "PNP.Concrete.PipelineSequentialCompiler.sequential_correct",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineSequentialCompiler" || theorem.axioms?.length !== 0) fail(`core inventory sequential compiler theorem mismatch: ${name}`);
    }
    for (const name of [
      "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin",
      "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq",
      "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin",
      "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq",
      "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineRefinement" || theorem.axioms?.length !== 0) fail(`core inventory recursive refinement theorem mismatch: ${name}`);
    }
    if (payload.milestoneCandidates?.length !== 278) fail("core inventory reviewed theorem-candidate count mismatch");
  }
}

export function synchronizeFormalPublication(options = {}) {
  const root = path.resolve(options.root || process.cwd());
  const sourceDir = path.resolve(root, options.sourceDir || process.env.PNP_SOURCE_DIR || "../pnp");
  const write = options.write === true;
  const log = options.log || (() => {});
  assertPinnedCore(sourceDir);

  const mirrors = [];

  for (const artifact of CORE_FILES) {
    const blob = coreBlob(sourceDir, artifact.sourcePath);
    if (blob.length !== artifact.bytes || sha256(blob) !== artifact.sha256) fail(`${artifact.sourcePath}: pinned core bytes differ from reviewed identity`);
    assertCorePayloadBoundary(artifact.sourcePath, blob);
    for (const target of artifact.targets) {
      const targetPath = path.resolve(root, target);
      if (!targetPath.startsWith(`${root}${path.sep}`)) fail(`${target}: target escapes repository root`);
      assertSafeMirrorTarget(root, targetPath, !write);
      mirrors.push({ artifact, blob, target, targetPath });
    }
  }

  if (write) {
    for (const mirror of mirrors) writeMirrorFileAtomically(root, mirror.targetPath, mirror.blob);
  }

  for (const { artifact, blob, target, targetPath } of mirrors) {
      assertSafeMirrorTarget(root, targetPath, true);
      const local = readFileSync(targetPath);
      if (!local.equals(blob)) fail(`${target}: drifted from ${CORE_COMMIT}:${artifact.sourcePath}${write ? " after write" : ""}`);
      log(`ok ${target} = ${CORE_COMMIT}:${artifact.sourcePath}`);
  }

  if (sha256(readFileSync(path.join(root, CORE_FILES[0].targets[0]))) === OLD_PDF_SHA256) fail("historical 56-page PDF was restored into the current report");
  if (sha256(readFileSync(path.join(root, CORE_FILES[1].targets[0]))) === OLD_TEX_SHA256) fail("historical TeX was restored into the current report");
  checkPdfPageCount(path.join(root, CORE_FILES[0].targets[0]));
  verifyReleaseSeal({ root });

  return { status: write ? "written-and-verified" : "verified-read-only", coreCommit: CORE_COMMIT, coreTree: CORE_TREE };
}

function parseArgs(argv) {
  const options = {};
  let mode = null;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--write") {
      if (mode) fail(`cannot combine --${mode} with --write`);
      mode = "write";
      options.write = true;
    } else if (argv[index] === "--check") {
      if (mode) fail(`cannot combine --${mode} with --check`);
      mode = "check";
      options.write = false;
    } else if (argv[index] === "--source-dir") {
      if (!argv[index + 1]) fail("--source-dir requires a path");
      options.sourceDir = argv[index + 1];
      index += 1;
    } else {
      fail(`unknown argument: ${argv[index]}`);
    }
  }
  return options;
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  try {
    const result = synchronizeFormalPublication({ ...parseArgs(process.argv.slice(2)), log: console.log });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.stack || String(error));
    process.exit(1);
  }
}
