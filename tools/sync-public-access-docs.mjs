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

const CORE_COMMIT = "5617c95037b14dde93c5d21caaf09de873491210";
const CORE_TREE = "7485f76ad676da796ef378d5c2223a216d175c22";
const OLD_PDF_SHA256 = "53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d";
const OLD_TEX_SHA256 = "414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7";

const BUILDER_INPUT_LENGTH_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderInputLength.finalTape_represents": { hash: "824e9a4f2785da71c1b5810e4995984e220b131bf643bd4f0271ed53628970dd", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputLength.inputTape_eq_totalInputFramerFinalTape": { hash: "59e20384fa787f70aabd8222780edaa8660715675d896e71c763e6549520ab2b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputLength.malformedScanSymbol_timeout": { hash: "d8ec5d9a5ff569cacf7daef576030f255222680883e9b4159e6e72b624dca031", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputLength.rawTimeBound_exact": { hash: "e81660fecf035c3c8a89eeb0a6e6a77c717152d3d452689d173b69b648fbcd9f", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.run_compile": { hash: "629c5a35979a7aadb823a0adbd06a2728d3fbc22f569906c986d377a205cc1f9", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.tallySizeBound_exact": { hash: "194c981ca92498b47b4396539cdb8f8221a7b944a7144bd5e54d8ed98e4a8d13", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputLength.workBoundedDecide_accept": { hash: "0b5a2b65a9a4aa8e4c361a003bd34e79f8c914f2b4b0aa6e5f58eb9450ba44d7", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.workRunExact": { hash: "ca6d55f38eae1850bd532a9cfbb86bf6fa2bc45edf9acc34537e7793b1c75f98", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.workRunExact_after_totalInputFramer": { hash: "3fdcf061036fc5b1c6caf667cda8718c9d738a7281d30be9785841b40f034c16", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.work_one_step_short_timeout": { hash: "9a70e81fe0f85ea22e9fd2b41166dc4f7281245501f8cd70bbac7895936bfa4d", axioms: ["Quot.sound", "propext"] }
};

const BUILDER_INPUT_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderInputPrefix.boundedDecide_compile_accept": { hash: "6fbd596723b2a97d405d1d8129e20901d51008c773af5d80b4633a819fead57d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.finalTape_represents": { hash: "14cba9d7647fcef8f062c2ab6e3d16e84eed233e1ec53491382991421795e2cc", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.finalTape_tally_length": { hash: "92f992615d4bde8569d585f54ec0d7963cb5ec043e81b410433c1d3f6e190dfe", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.findWorkRule_framer_of_some": { hash: "3e82d88005087443565389d5dda84a673b4eaecf637e60eff5cc4cb414679b18", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.findWorkRule_tally_of_some": { hash: "e88f5a2d04ae75d874e6be87f837e3eb73a70aaad095ef44c8bc40383ac90dab", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.framerState_ne_tallyState": { hash: "b37cc329b82a3489b6cbbf59f49d6f85494e1cba3b6d74afd111177f882691f0", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.launch_workStep": { hash: "7ddf442477605b69a2a48fa9de34c9d3e231fc125fb2ffbe2f862464c0646bd9", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.malformedTallyScanSymbol_timeout": { hash: "e6799395b2907abc1740c4fd7d96fc9ac8f1ee24670e4b7aceb39a0927fbdd66", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.rawTimeBound_eval": { hash: "d875640901af586ab3e6ab4507d62c25b94e34ef8c87082fb35fcf58c757dc1c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.rawTimeBound_le": { hash: "0bb31c2ccec14489cb58eef73d58cd55053f684ece8105a311c516723178fd1d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.run_compile_exact": { hash: "963473ed4426824bdbf27defba1524964c2a5b245c428a885c4207eb76f48ee6", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.run_compile_rawTimeBound": { hash: "7a9d88bb8b61f9d4629a16f11b0bb0e54c61845d2e9a2775aa8b5c7998ce58c9", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact": { hash: "c4d91b64e983bc5a6713fa64ab86821edd442cc79cbf872b2fafe6f3194ab2b3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.work_one_step_short_timeout": { hash: "a395f5f859d7689faa0236d2660746c52e438e6e174aa34b698725f7eae40538", axioms: ["Quot.sound", "propext"] }
};

const CORE_FILES = [
  {
    sourcePath: "canonical_proof_report.pdf",
    targets: ["downloads/canonical_proof_report.pdf", "downloads/canonical-proof-report.pdf"],
    bytes: 288374,
    sha256: "bd3b519b292bdb69831e14d4a1e95db80199c58e0f0476031fc6c895db7abfcd"
  },
  {
    sourcePath: "canonical_proof_report.tex",
    targets: ["downloads/canonical_proof_report.tex", "downloads/canonical-proof-report.tex"],
    bytes: 33406,
    sha256: "438f19f4b452193cae3e26d772815f035902710a27178ce2743cbfa3f121d7a9"
  },
  {
    sourcePath: "public/pnp-status.json",
    targets: ["public/pnp-status.json"],
    bytes: 245415,
    sha256: "54062cee2423cda8010511621d1bb7c4066b91104924555e1455a48d1d58c3fa"
  },
  {
    sourcePath: "public/pnp-theorem-inventory.json",
    targets: ["public/pnp-theorem-inventory.json"],
    bytes: 2125549,
    sha256: "32f224f98afff60f9ab8d8a789648431976242313562758a66036946bbfde6fd"
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
  if (sha256(map) !== "b86963591d9bed41c6c75892a3af9c19e62179c518f034d5a7f4a96156304f5c") {
    fail("pinned formal-publication map digest mismatch");
  }
  const publicationMap = JSON.parse(map.toString("utf8"));
  const rawTapeTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language";
  const formulaSizeTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le";
  const formulaScheduleLengthTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length";
  const formulaScheduleEmitTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula";
  const formulaCursorTheorems = {
    "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaConstraintSlotDirect_eq": "46a46409172b2443dcc6eb4dccf939737ce3fb25583a957acfdfb34dde7c0edc",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaClauseSlotDirect_eq": "0ed670f82237e1984c35dec8edbc2b3ad392759310b5ba0b12311fc799531a98",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaTokenSlotDirect_eq": "4675f18d3c1f1fa7fb16c2dec7b1e370589ef6977367eb8e4da97b2a03452d1a",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq": "6a3c74f3924ed7defe38713b118e0fecc8a1e71f50b20d2ac1dc0c6535bf6e2c",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial": "d052a795eb5e0222326ef849c5e75ced764d2a5b74578da3e8ffdb290d731744",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_prefix": "5672cb875db23988aaf749a0890d3f08128b2e9276a969572dbf5b3e404b25a4",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_to_end": "2690d352f8f9072a49db1ba6e585ea5fd68b7952a96296938f44118747e06963",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full": "d54831f37ccf2283f0ad8fe79a413232964587f85fdbc983983a17f64c9c6f7d",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_at_end": "624fcdaccb799650b10aa88c54da820c3de33c67600f1207d5a7d540717d7288",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short": "699d81f19687395eaa6c82629cceb0c27fa58b1da009ffe2317e8b1840a309f1",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_after_one_step_short": "e6b99c99d82e9edce84ecafe5584d4dcb310221adf0ab171013479c90fe61807",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess": "9bdcf90c8a8628fcb4c49d6b358f5d19d7cf6e88a2bedf8e532b577d2fc5f063",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula": "2637f4e27b2a6e40a7e774b10fac91d379daebe9ff6930c72de43ee23bd054d0"
  };
  if (publicationMap.coordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-15-44"
      || publicationMap.milestoneSourceClosureSha256 !== "fb3ecdea2590b6a65ae8de5ebd9e1b86c1e36f2ae9659de7febb817f4306ce3d"
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
  const formulaScheduleMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-schedule");
  if (!formulaScheduleMilestone
      || formulaScheduleMilestone.classification !== "formalized-foundation-only"
      || !formulaScheduleMilestone.requiredTheorems?.includes(formulaScheduleLengthTheorem)
      || !formulaScheduleMilestone.requiredTheorems?.includes(formulaScheduleEmitTheorem)
      || publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[formulaScheduleLengthTheorem] !== "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4"
      || publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[formulaScheduleEmitTheorem] !== "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943"
      || !formulaScheduleMilestone.nonClaim?.includes("does not interpret a slot as a constant-time raw-machine action")) {
    fail("pinned formal-publication map Cook-Levin formula-schedule identity mismatch");
  }
  const formulaCursorMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-cursor");
  if (!formulaCursorMilestone
      || formulaCursorMilestone.classification !== "formalized-foundation-only"
      || !Object.keys(formulaCursorTheorems).every((name) => formulaCursorMilestone.requiredTheorems?.includes(name))
      || !Object.entries(formulaCursorTheorems).every(([name, hash]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === hash)
      || !formulaCursorMilestone.nonClaim?.includes("does not prove constant-time raw slot interpretation")) {
    fail("pinned formal-publication map Cook-Levin formula-cursor identity mismatch");
  }
  const builderMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-length");
  if (!builderMilestone
      || builderMilestone.classification !== "formalized-foundation-only"
      || !Object.keys(BUILDER_INPUT_LENGTH_THEOREMS).every((name) => builderMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_INPUT_LENGTH_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !builderMilestone.nonClaim?.includes("does not emit formula bits")) {
    fail("pinned formal-publication map Cook-Levin builder input-length identity mismatch");
  }
  const builderPrefixMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-prefix");
  if (!builderPrefixMilestone
      || builderPrefixMilestone.classification !== "formalized-foundation-only"
      || !Object.keys(BUILDER_INPUT_PREFIX_THEOREMS).every((name) => builderPrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_INPUT_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !builderPrefixMilestone.nonClaim?.includes("emits no formula bit")) {
    fail("pinned formal-publication map Cook-Levin builder input-prefix identity mismatch");
  }
}

function checkPdfPageCount(pdfPath) {
  const result = spawnSync("pdfinfo", [pdfPath], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.status !== 0) fail(`pdfinfo failed for ${pdfPath}: ${(result.stderr || result.stdout || "pdfinfo unavailable").trim()}`);
  const match = result.stdout.match(/^Pages:\s+(\d+)\s*$/m);
  if (!match || Number(match[1]) !== 16) fail(`${pdfPath}: expected exactly sixteen pages`);
}

function assertCorePayloadBoundary(sourcePath, buffer) {
  if (!sourcePath.endsWith(".json")) return;
  const payload = JSON.parse(buffer.toString("utf8"));
  if (sourcePath === "public/pnp-status.json") {
    if (payload.coordinate !== "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-15-44" || payload.publicSurfaceBaselineCoordinate !== "PUBLIC-SURFACE-BASELINE-2026-07-15-COOK-LEVIN-BUILDER-INPUT-PREFIX-43") fail("core status coordinate mismatch");
    if (payload.formalPublicationMapCoordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-15-44" || payload.formalPublicationMapSha256 !== "b86963591d9bed41c6c75892a3af9c19e62179c518f034d5a7f4a96156304f5c" || payload.leanSourceClosureSha256 !== "fb3ecdea2590b6a65ae8de5ebd9e1b86c1e36f2ae9659de7febb817f4306ce3d") fail("core status source identity mismatch");
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
    const formulaScheduleMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-schedule");
    if (!formulaScheduleMilestone || formulaScheduleMilestone.earned !== true || formulaScheduleMilestone.allPresent !== true || formulaScheduleMilestone.allKernelTypesMatch !== true || formulaScheduleMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true) fail("core status Cook-Levin formula-schedule boundary mismatch");
    const formulaCursorMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-cursor");
    if (!formulaCursorMilestone || formulaCursorMilestone.earned !== true || formulaCursorMilestone.allPresent !== true || formulaCursorMilestone.allKernelTypesMatch !== true || formulaCursorMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || formulaCursorMilestone.requiredTheorems?.length !== 13) fail("core status Cook-Levin formula-cursor boundary mismatch");
    const builderMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-length");
    if (!builderMilestone || builderMilestone.earned !== true || builderMilestone.allPresent !== true || builderMilestone.allKernelTypesMatch !== true || builderMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderMilestone.requiredTheorems?.length !== 10) fail("core status Cook-Levin builder input-length boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderInputLengthFormalized !== true || payload.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount !== 39 || payload.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized !== true) fail("core status Cook-Levin builder input-length evidence mismatch");
    const builderPrefixMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-prefix");
    if (!builderPrefixMilestone || builderPrefixMilestone.earned !== true || builderPrefixMilestone.allPresent !== true || builderPrefixMilestone.allKernelTypesMatch !== true || builderPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderPrefixMilestone.requiredTheorems?.length !== 14) fail("core status Cook-Levin builder input-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderInputPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount !== 40 || payload.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized !== true) fail("core status Cook-Levin builder input-prefix evidence mismatch");
    if (payload.leanConcreteCNFSATInPFormalized !== false || payload.leanConcreteCNFNPCompletenessFormalized !== false) fail("core status overstates the CNF-SAT result");
  } else if (sourcePath === "public/pnp-theorem-inventory.json") {
    if (payload.coordinate !== "PNP-LEAN-THEOREM-INVENTORY-2026-07-15-44") fail("core inventory coordinate mismatch");
    if (payload.compatibilityRootCandidate !== null || payload.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("core inventory publication boundary mismatch");
    if (payload.declarationCount !== 6901 || payload.theoremCount !== 3143 || payload.assumptionFreeTheoremCount !== 2585 || payload.excludedPrivateDeclarationCount !== 1228 || payload.sourceClosureModuleCount !== 63 || payload.axiomCount !== 4) fail("core inventory counts mismatch");
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
    for (const name of [
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinFormulaSchedule" || JSON.stringify(theorem.axioms) !== JSON.stringify(["Quot.sound", "propext"])) {
        fail(`core inventory Cook-Levin formula-schedule theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_INPUT_LENGTH_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderInputLength" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder input-length theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_INPUT_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderInputPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder input-prefix theorem mismatch: ${name}`);
      }
    }
    for (const name of [
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaConstraintSlotDirect_eq",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaClauseSlotDirect_eq",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaTokenSlotDirect_eq",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_prefix",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_to_end",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_at_end",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_after_one_step_short",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinFormulaCursor" || JSON.stringify(theorem.axioms) !== JSON.stringify(["Quot.sound", "propext"])) {
        fail(`core inventory Cook-Levin formula-cursor theorem mismatch: ${name}`);
      }
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
    if (payload.milestoneCandidates?.length !== 323) fail("core inventory reviewed theorem-candidate count mismatch");
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
