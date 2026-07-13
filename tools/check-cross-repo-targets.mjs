#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_TARGETS = "docs/audit_targets.json";
const DEFAULT_RELEASE_MANIFEST = "downloads/formal-publication-release.json";
const DEFAULT_SOURCE_DIR = "../pnp";
const REVIEWED_CORE_COMMIT = "305443db5a3954be42d1d56912c7f64232efff2a";
const REVIEWED_CORE_TREE = "c4f9d18b843986a8d964f35c9e13461cf57337a0";
const REVIEWED_PROOF_COMMIT = "80192df1874c4a0dc82141944b5d289c7577a2e4";

const KIND_TO_REF = new Map([
  ["current core publication file", "currentCoreRef"],
  ["pnplabs current core mirror", "publicCheckout"],
  ["pnplabs current release metadata", "publicCheckout"],
  ["pnplabs quarantined historical metadata", "publicCheckout"],
  ["historical source snapshot", "historicalSourceRef"],
  ["historical documentation snapshot", "historicalDocsRef"],
  ["historical generated-artifact snapshot", "historicalArtifactRef"]
]);

export class AuditTargetValidationError extends Error {
  constructor(failures, result = {}) {
    super(`audit target validation failed with ${failures.length} failure(s)`);
    this.name = "AuditTargetValidationError";
    this.failures = failures;
    this.result = result;
  }
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function safeRelativePath(value, label, failures) {
  if (typeof value !== "string" || value === "" || path.isAbsolute(value) || value.includes("\\") || value.split("/").includes("..")) {
    failures.push(`${label}: unsafe relative path ${String(value)}`);
    return false;
  }
  return true;
}

function runGit(sourceDir, args, encoding = "utf8") {
  const result = spawnSync("git", ["-C", sourceDir, ...args], {
    encoding,
    maxBuffer: 16 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"]
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

function gitText(sourceDir, args, label, failures) {
  const result = runGit(sourceDir, args, "utf8");
  if (!result.ok) {
    failures.push(`${label}: git ${args.join(" ")} failed: ${(result.stderr || result.stdout || "unknown failure").trim()}`);
    return null;
  }
  return result.stdout.trim();
}

function gitBlob(sourceDir, ref, targetPath, label, failures) {
  const result = runGit(sourceDir, ["show", `${ref}:${targetPath}`], null);
  if (!result.ok) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString("utf8") : result.stderr;
    failures.push(`${label}: missing path ${ref}:${targetPath}: ${(stderr || "git show failed").trim()}`);
    return null;
  }
  return result.stdout;
}

function validateTargetManifest(manifest, failures) {
  if (manifest.kind !== "PNPLabsCrossRepositoryAuditTargets0" || manifest.version !== 2) {
    failures.push("audit target manifest kind/version mismatch");
  }
  const ids = new Set();
  for (const target of manifest.targets || []) {
    if (!target.id || ids.has(target.id)) failures.push(`duplicate or missing target id: ${target.id || "<missing>"}`);
    ids.add(target.id);
    const requiredRef = KIND_TO_REF.get(target.kind);
    if (!requiredRef) failures.push(`${target.id || "<unknown>"}: unsupported target kind ${target.kind}`);
    else if (target.refClass !== requiredRef) failures.push(`${target.id}: ${target.kind} must use ${requiredRef}, not ${target.refClass}`);
    if (!manifest.refs?.[target.refClass]) failures.push(`${target.id}: unknown refClass ${target.refClass}`);
    safeRelativePath(target.path, target.id || "target", failures);
    if (target.mirrorOf && target.refClass !== "publicCheckout") failures.push(`${target.id}: only public-checkout targets may declare mirrorOf`);
  }
  for (const target of manifest.targets || []) {
    if (target.mirrorOf && !ids.has(target.mirrorOf)) failures.push(`${target.id}: unknown mirrorOf target ${target.mirrorOf}`);
  }
  for (const [refClass, ref] of Object.entries(manifest.refs || {})) {
    if (refClass.startsWith("historical") && ref.status !== "historical-quarantined-not-current-authority") {
      failures.push(`${refClass}: historical ref is not explicitly quarantined`);
    }
  }
}

function validateReleaseManifest(manifest, expectedIdentity, failures) {
  if (manifest.kind !== "PNPFormalPublicationRelease0" || manifest.version !== 0) failures.push("formal-publication manifest kind/version mismatch");
  if (manifest.status !== "current-formal-reconstruction-publication-theorem-gate-closed" || manifest.authority !== "current") failures.push("formal-publication manifest authority mismatch");
  if (manifest.source?.commit !== expectedIdentity.commit || manifest.source?.proofCommit !== expectedIdentity.proofCommit || manifest.source?.tree !== expectedIdentity.tree || manifest.source?.ref !== expectedIdentity.commit) failures.push("formal-publication manifest core/proof pin mismatch");
  if (manifest.source?.coordinateAloneIsAuthority !== false || manifest.source?.identityRequiresCommitTreeAndArtifactHashes !== true) failures.push("formal-publication manifest identity policy mismatch");
  if (typeof manifest.source?.formalPublicationMapCoordinate !== "string" || !/^[0-9a-f]{64}$/.test(manifest.source?.formalPublicationMapSha256 || "") || !/^[0-9a-f]{64}$/.test(manifest.source?.leanSourceClosureSha256 || "")) failures.push("formal-publication manifest publication-map identity mismatch");
  const boundary = manifest.publicationBoundary || {};
  if (boundary.derivedOnlyFromConcreteGate !== true || boundary.concreteGatePassed !== false || boundary.mathematicalTheoremEstablished !== false || boundary.publicTheoremEmissionAllowed !== false || boundary.publicTheoremStatement !== null) failures.push("formal-publication manifest does not fail closed");
  if (boundary.compatibilityRootPresent !== false || boundary.concreteTargetPresent !== true || boundary.projectSpecificAxiomsRemaining !== true || boundary.remainingBlockerCount !== 7) failures.push("formal-publication manifest blocker boundary mismatch");
  if (manifest.artifacts?.report?.pageCount !== 9) failures.push("formal-publication report must have exactly nine pages");
  const earned = manifest.earnedBoundary || {};
  if (earned.pipelineStateNamespacesFormalized !== true || earned.pipelineStateNamespaceAxiomAuditPassed !== true || earned.pipelineStateNamespaceAuditedDeclarationCount !== 39) failures.push("formal-publication pipeline namespace boundary mismatch");
  if (earned.pipelineStageBridgesFormalized !== true || earned.pipelineStageBridgeAxiomAuditPassed !== true || earned.pipelineStageBridgeAuditedDeclarationCount !== 56 || earned.pipelineStageLaunchFormalized !== true || earned.pipelineVerdictPreservationFormalized !== true || earned.pipelineInternalOutputHandoffComposed !== true) failures.push("formal-publication pipeline stage-bridge boundary mismatch");
  if (earned.pipelineTargetTerminationFormalized !== false || earned.pipelineTerminalRawOutputPackingFormalized !== true || earned.pipelineTerminalOutputPackerAxiomAuditPassed !== true || earned.pipelineTerminalOutputPackerAuditedDeclarationCount !== 69) failures.push("formal-publication terminal-output packer boundary mismatch");
  if (earned.pipelineTerminalOutputPackerTheorem !== "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq" || earned.pipelineTerminalOutputPackerKernelTypeSha256 !== "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66" || earned.pipelineTerminalOutputPackerCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 6" || earned.pipelineTerminalOutputPackerConnectedToBridge !== true || !Array.isArray(earned.pipelineTerminalOutputPackerAxiomClosure) || earned.pipelineTerminalOutputPackerAxiomClosure.length !== 0) failures.push("formal-publication terminal-output packer evidence mismatch");
  if (earned.pipelineTerminalBridgeAxiomAuditPassed !== true || earned.pipelineTerminalBridgeAuditedDeclarationCount !== 59 || earned.pipelineTerminalBridgeAcceptingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents" || earned.pipelineTerminalBridgeAcceptingOutputKernelTypeSha256 !== "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001") failures.push("formal-publication accepting terminal-bridge evidence mismatch");
  if (earned.pipelineTerminalBridgeRejectingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents" || earned.pipelineTerminalBridgeRejectingOutputKernelTypeSha256 !== "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db" || earned.pipelineTerminalBridgeCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 12") failures.push("formal-publication rejecting terminal-bridge evidence mismatch");
  if (earned.pipelineSuppliedAcceptTraceTheorem !== "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact" || earned.pipelineSuppliedAcceptTraceKernelTypeSha256 !== "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29" || earned.pipelineSuppliedRejectTraceTheorem !== "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact" || earned.pipelineSuppliedRejectTraceKernelTypeSha256 !== "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c") failures.push("formal-publication supplied trace evidence mismatch");
  if (earned.pipelineSuppliedAcceptMachineOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact" || earned.pipelineSuppliedAcceptMachineOutputKernelTypeSha256 !== "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01" || earned.pipelineSuppliedRejectMachineOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact" || earned.pipelineSuppliedRejectMachineOutputKernelTypeSha256 !== "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd") failures.push("formal-publication supplied output evidence mismatch");
  if (!Array.isArray(earned.pipelineTerminalBridgeAxiomClosure) || earned.pipelineTerminalBridgeAxiomClosure.length !== 0 || earned.pipelinePriorTraceTransportToTerminalBridgeFormalized !== true) failures.push("formal-publication terminal-bridge supplied-trace boundary mismatch");
  if (earned.pipelineInputFramerAxiomAuditPassed !== true || earned.pipelineInputFramerAuditedDeclarationCount !== 70 || earned.pipelineAllInputFramingFormalized !== true || !Array.isArray(earned.pipelineInputFramerAxiomClosure) || earned.pipelineInputFramerAxiomClosure.length !== 0) failures.push("formal-publication all-input framer audit boundary mismatch");
  if (earned.pipelineInputFramerWorkTraceTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact" || earned.pipelineInputFramerWorkTraceKernelTypeSha256 !== "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a") failures.push("formal-publication all-input framer trace evidence mismatch");
  if (earned.pipelineInputFramerRepresentedEndpointTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents" || earned.pipelineInputFramerRepresentedEndpointKernelTypeSha256 !== "8f1fa6f45f267d60eadad754d9c88e4ea58631b881152af0a51244f5f7d207af" || earned.pipelineInputFramerHaltedEndpointTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted" || earned.pipelineInputFramerHaltedEndpointKernelTypeSha256 !== "beca62f878cccce7434d899512cf9aaea25b222d113ec60df90da0fde8801faa") failures.push("formal-publication all-input framer endpoint evidence mismatch");
  if (earned.pipelineInputFramerRawBoundTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le" || earned.pipelineInputFramerRawBoundKernelTypeSha256 !== "bac4d4c78cb57e3ab70f752e2895a2f7ddd3c5356a6d1c457dd5832413d89eab" || earned.pipelineInputFramerRawTimePolynomial !== "6 * m * m + 39 * m + 75") failures.push("formal-publication all-input framer polynomial evidence mismatch");
  if (earned.pipelineInputFramerOrdinaryStartTheorem !== "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound" || earned.pipelineInputFramerOrdinaryStartKernelTypeSha256 !== "4efe0f62d185b7ac19d73aebb09008e97f00c96a8252e263c901f8a6add7c45b" || earned.pipelineInputFramerBlankEquivalentTheorem !== "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent" || earned.pipelineInputFramerBlankEquivalentKernelTypeSha256 !== "1eaa31ea98226c202722a0e67aa796b7b461ccf5367f35fff194973bb609ce8a") failures.push("formal-publication all-input framer ordinary-start evidence mismatch");
  if (earned.pipelineInputFramerAcceptTheorem !== "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept" || earned.pipelineInputFramerAcceptKernelTypeSha256 !== "3ef9f8377ec7ad7ebb70aa41b978cdb22f2c1c029b26e1e4c241ce00c20781d4" || earned.pipelineInputFramerNoTimeoutTheorem !== "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout" || earned.pipelineInputFramerNoTimeoutKernelTypeSha256 !== "48b9ee1743a6881a663fb7a1cc59984c371ff853524f9b18bad58014c229f9fe") failures.push("formal-publication all-input framer verdict evidence mismatch");
  if (earned.pipelineInputFramerEmptyWorkSteps !== "4" || earned.pipelineInputFramerCompleteCellsWorkSteps !== "4 * k * k + 9 * k + 7" || earned.pipelineInputFramerPartialCellWorkSteps !== "4 * k * k + 9 * k + 5") failures.push("formal-publication all-input framer branch-cost evidence mismatch");
  if (earned.pipelinePairedCompilerAxiomAuditPassed !== true || earned.pipelinePairedCompilerAuditedDeclarationCount !== 28 || earned.pipelineCanonicalPairCompilationFormalized !== true) failures.push("formal-publication canonical-pair compiler boundary mismatch");
  if (earned.pipelinePairedVerdictTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq" || earned.pipelinePairedVerdictKernelTypeSha256 !== "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731") failures.push("formal-publication canonical-pair verdict evidence mismatch");
  if (earned.pipelinePairedMachineOutputTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq" || earned.pipelinePairedMachineOutputKernelTypeSha256 !== "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267") failures.push("formal-publication canonical-pair output evidence mismatch");
  if (earned.pipelinePairedNoTimeoutTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout" || earned.pipelinePairedNoTimeoutKernelTypeSha256 !== "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab") failures.push("formal-publication canonical-pair timeout evidence mismatch");
  if (earned.pipelinePairedAcceptsTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff" || earned.pipelinePairedAcceptsKernelTypeSha256 !== "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9") failures.push("formal-publication canonical-pair language evidence mismatch");
  if (!Array.isArray(earned.pipelinePairedCompilerAxiomClosure) || earned.pipelinePairedCompilerAxiomClosure.length !== 0 || earned.pipelinePairedOutputSizePolynomial !== "B(m) = m + p(m) + 1" || earned.pipelinePairedRawTimePolynomial !== "Rpair(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))") failures.push("formal-publication canonical-pair polynomial evidence mismatch");
  if (earned.pipelineCompilerAxiomAuditPassed !== true || earned.pipelineCompilerAuditedDeclarationCount !== 29 || earned.pipelineAllInputCompilationFormalized !== true || !Array.isArray(earned.pipelineCompilerAxiomClosure) || earned.pipelineCompilerAxiomClosure.length !== 0) failures.push("formal-publication all-input compiler audit boundary mismatch");
  if (earned.pipelineCompilerCorrectTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_correct" || earned.pipelineCompilerCorrectKernelTypeSha256 !== "e1ccd198403d41933324af1c52048c865943947c5bbd40dd94e11827b08c2303") failures.push("formal-publication all-input compiler correctness evidence mismatch");
  if (earned.pipelineVerdictTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq" || earned.pipelineVerdictKernelTypeSha256 !== "1bafe91bba94e65a7ad654f4624f305c0ae01b3e6d656af0dd2e752d373ce87e") failures.push("formal-publication all-input compiler verdict evidence mismatch");
  if (earned.pipelineMachineOutputTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq" || earned.pipelineMachineOutputKernelTypeSha256 !== "45e02fa1e6e6b0bcbc422c3b4fd797608b875727d22b79d6f7814e1f4f0d3da7") failures.push("formal-publication all-input compiler output evidence mismatch");
  if (earned.pipelineNoTimeoutTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout" || earned.pipelineNoTimeoutKernelTypeSha256 !== "ed95c33d4fa998d79057537cd2adf847548a79b7ee9a45020b01620868273b3a") failures.push("formal-publication all-input compiler timeout evidence mismatch");
  if (earned.pipelineAcceptsTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff" || earned.pipelineAcceptsKernelTypeSha256 !== "94e43c664b4d185e48553ab25541925830fec7086fcbbab5215dacdcde1af6a6") failures.push("formal-publication all-input compiler language evidence mismatch");
  if (earned.pipelineAllInputStuckTimeoutTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact" || earned.pipelineAllInputStuckTimeoutKernelTypeSha256 !== "a6edef0532eb89036d0e6813cffb94b321f9160a08035671eb411c813ef0a3de") failures.push("formal-publication all-input compiler stuck-timeout evidence mismatch");
  if (earned.pipelineOutputSizePolynomial !== "B(m) = m + p(m) + 1" || earned.pipelineRawTimePolynomial !== "R(m) = totalInputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))") failures.push("formal-publication all-input compiler polynomial evidence mismatch");
  if (earned.pipelineExternalInputSizePolynomialFormalized !== true || earned.pipelineMalformedInputBehaviorFormalized !== true || earned.pipelineRawRefinementFormalized !== false) failures.push("formal-publication all-input compiler boundary mismatch");
  if (manifest.historicalArchive?.status !== "historical-quarantined-not-current-authority" || manifest.historicalArchive?.currentArtifactEligible !== false || manifest.historicalArchive?.mayActivateTheoremPublication !== false) failures.push("formal-publication historical archive is not quarantined");
}

function validateLocalArtifactHashes(root, release, failures) {
  const expected = [];
  const artifacts = release.artifacts || {};
  if (artifacts.status) expected.push({ path: artifacts.status.publicPath, ...artifacts.status });
  if (artifacts.theoremInventory) expected.push({ path: artifacts.theoremInventory.publicPath, ...artifacts.theoremInventory });
  for (const type of ["pdf", "tex"]) {
    const report = artifacts.report?.[type];
    for (const publicPath of report?.publicPaths || []) expected.push({ path: publicPath, bytes: report.bytes, sha256: report.sha256 });
  }
  for (const item of expected) {
    if (!safeRelativePath(item.path, "release artifact", failures)) continue;
    const filePath = path.resolve(root, item.path);
    if (!existsSync(filePath)) {
      failures.push(`release artifact missing: ${item.path}`);
      continue;
    }
    const info = lstatSync(filePath);
    if (!info.isFile() || info.isSymbolicLink()) {
      failures.push(`release artifact must be a regular non-symlink file: ${item.path}`);
      continue;
    }
    const content = readFileSync(filePath);
    if (content.length !== item.bytes || sha256(content) !== item.sha256) failures.push(`release artifact identity mismatch: ${item.path}`);
  }
}

function validateCurrentPayloads(contents, failures) {
  const statusBuffer = contents.get("public.status");
  const inventoryBuffer = contents.get("public.inventory");
  if (statusBuffer) {
    const status = JSON.parse(statusBuffer.toString("utf8"));
    if (status.concretePublicationGate?.passed !== false || status.publicationStatusDerivedOnlyFromConcreteGate !== true || status.mathematicalTheoremEstablished !== false || status.publicTheoremEmissionAllowed !== false || status.publicTheoremStatement !== null) failures.push("public status does not fail closed");
    if (status.leanConcreteCNFSATMembershipFormalized !== true || status.leanConcreteCNFSATMembershipTheorem !== "PNP.Concrete.FinalUniversalDesign.cnfSATInNP") failures.push("public status does not expose the earned CNF-SAT NP-membership theorem");
    if (status.leanConcreteCNFWorkAxiomAuditPassed !== true || status.leanConcreteCNFWorkAuditedDeclarationCount !== 766) failures.push("public status CNF work audit mismatch");
    if (status.leanConcretePipelineStateNamespaceFormalized !== true || status.leanConcretePipelineStateNamespaceAxiomAuditPassed !== true || status.leanConcretePipelineStateNamespaceAuditedDeclarationCount !== 39) failures.push("public status pipeline namespace mismatch");
    if (status.leanConcretePipelineStageBridgesFormalized !== true || status.leanConcretePipelineStageBridgesAxiomAuditPassed !== true || status.leanConcretePipelineStageBridgesAuditedDeclarationCount !== 56 || status.leanConcretePipelineStageLaunchFormalized !== true || status.leanConcretePipelineVerdictPreservationFormalized !== true || status.leanConcretePipelineInternalOutputHandoffComposed !== true) failures.push("public status pipeline stage-bridge mismatch");
    if (status.leanConcretePipelineTerminalOutputPackingFormalized !== true || status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed !== true || status.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount !== 69) failures.push("public status terminal-output packer mismatch");
    if (status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized !== true || status.leanConcretePipelineTerminalBridgeAxiomAuditPassed !== true || status.leanConcretePipelineTerminalBridgeAuditedDeclarationCount !== 59) failures.push("public status terminal-bridge suffix mismatch");
    if (status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized !== true) failures.push("public status supplied-trace transport mismatch");
    if (status.leanConcretePipelineInputFramerAxiomAuditPassed !== true || status.leanConcretePipelineInputFramerAuditedDeclarationCount !== 70 || status.leanConcretePipelineAllInputFramingFormalized !== true) failures.push("public status all-input framer mismatch");
    if (status.leanConcretePipelinePairedCompilerAxiomAuditPassed !== true || status.leanConcretePipelinePairedCompilerAuditedDeclarationCount !== 28 || status.leanConcretePipelineCanonicalPairCompilationFormalized !== true) failures.push("public status canonical-pair compiler mismatch");
    if (status.leanConcretePipelineCompilerAxiomAuditPassed !== true || status.leanConcretePipelineCompilerAuditedDeclarationCount !== 29 || status.leanConcretePipelineAllInputCompilationFormalized !== true) failures.push("public status all-input compiler audit mismatch");
    if (status.leanConcretePipelineExternalInputSizePolynomialFormalized !== true || status.leanConcretePipelineMalformedInputBehaviorFormalized !== true || status.leanConcretePipelineRawRefinementFormalized !== false) failures.push("public status all-input compiler boundary mismatch");
    if (status.leanConcreteCNFSATInPFormalized !== false || status.leanConcreteCNFNPCompletenessFormalized !== false) failures.push("public status overstates the CNF-SAT result");
  }
  if (inventoryBuffer) {
    const inventory = JSON.parse(inventoryBuffer.toString("utf8"));
    if (inventory.compatibilityRootCandidate !== null || inventory.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") failures.push("public inventory publication boundary mismatch");
    if (inventory.declarationCount !== 5235 || inventory.theoremCount !== 2224 || inventory.assumptionFreeTheoremCount !== 2123 || inventory.sourceClosureModuleCount !== 49 || inventory.axiomCount !== 4) failures.push("public inventory count boundary mismatch");
    const packer = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
    if (!packer || packer.kind !== "theorem" || packer.module !== "PNP.Concrete.TerminalOutputPacker" || packer.axioms?.length !== 0) failures.push("public inventory terminal-output packer theorem mismatch");
    const terminalBridge = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
    if (!terminalBridge || terminalBridge.kind !== "theorem" || terminalBridge.module !== "PNP.Concrete.PipelineTerminalBridge" || terminalBridge.axioms?.length !== 0) failures.push("public inventory terminal-bridge theorem mismatch");
    const suppliedTrace = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact");
    const suppliedOutput = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact");
    if (!suppliedTrace || suppliedTrace.kind !== "theorem" || suppliedTrace.axioms?.length !== 0 || !suppliedOutput || suppliedOutput.kind !== "theorem" || suppliedOutput.axioms?.length !== 0) failures.push("public inventory supplied terminal-trace mismatch");
    const pairedVerdict = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq");
    const pairedOutput = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq");
    const pairedTimeout = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout");
    const pairedAccepts = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff");
    if (!pairedVerdict || pairedVerdict.kind !== "theorem" || pairedVerdict.axioms?.length !== 0 || !pairedOutput || pairedOutput.kind !== "theorem" || pairedOutput.axioms?.length !== 0 || !pairedTimeout || pairedTimeout.kind !== "theorem" || pairedTimeout.axioms?.length !== 0 || !pairedAccepts || pairedAccepts.kind !== "theorem" || pairedAccepts.axioms?.length !== 0) failures.push("public inventory canonical-pair compiler mismatch");
    for (const name of [
      "PNP.Concrete.PipelineCompiler.pipeline_correct",
      "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq",
      "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq",
      "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout",
      "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff",
      "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact"
    ]) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineCompiler" || theorem.axioms?.length !== 0) failures.push(`public inventory all-input compiler mismatch: ${name}`);
    }
    for (const name of [
      "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout"
    ]) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineInputFramer" || theorem.axioms?.length !== 0) failures.push(`public inventory all-input framer mismatch: ${name}`);
    }
    if (inventory.milestoneCandidates?.length !== 172) failures.push("public inventory reviewed theorem-candidate count mismatch");
  }
}

export function validateAuditTargets(options = {}) {
  const root = path.resolve(options.root || process.cwd());
  const targetsPath = path.resolve(root, options.targetsPath || DEFAULT_TARGETS);
  const releaseManifestPath = path.resolve(root, options.releaseManifestPath || DEFAULT_RELEASE_MANIFEST);
  const sourceDir = path.resolve(root, options.sourceDir || process.env.PNP_SOURCE_DIR || DEFAULT_SOURCE_DIR);
  const requireSource = options.requireSource === true;
  const expectedIdentity = options.expectedCoreIdentity || { commit: REVIEWED_CORE_COMMIT, proofCommit: REVIEWED_PROOF_COMMIT, tree: REVIEWED_CORE_TREE };
  const targetManifest = readJson(targetsPath);
  const releaseManifest = readJson(releaseManifestPath);
  const failures = [];
  const result = { skipped: false, sourceDir, checkedTargets: 0, mirroredTargets: 0, refs: {} };
  const contents = new Map();

  validateTargetManifest(targetManifest, failures);
  validateReleaseManifest(releaseManifest, expectedIdentity, failures);
  validateLocalArtifactHashes(root, releaseManifest, failures);

  for (const target of targetManifest.targets || []) {
    if (target.refClass !== "publicCheckout" || !safeRelativePath(target.path, target.id, failures)) continue;
    const localPath = path.resolve(root, target.path);
    if (!existsSync(localPath)) {
      failures.push(`${target.id}: missing public file ${target.path}`);
      continue;
    }
    const info = lstatSync(localPath);
    if (!info.isFile() || info.isSymbolicLink()) {
      failures.push(`${target.id}: public target must be a regular non-symlink file`);
      continue;
    }
    contents.set(target.id, readFileSync(localPath));
    result.checkedTargets += 1;
  }

  validateCurrentPayloads(contents, failures);
  if (failures.length > 0) throw new AuditTargetValidationError(failures, result);

  if (!existsSync(path.join(sourceDir, ".git"))) {
    const message = `cross-repo target check skipped: ${sourceDir} is not a git checkout`;
    if (requireSource) throw new AuditTargetValidationError([message], result);
    return { ...result, skipped: true, skipReason: message };
  }

  const usedRefs = new Set((targetManifest.targets || []).filter((target) => target.refClass !== "publicCheckout").map((target) => target.refClass));
  for (const refClass of usedRefs) {
    const refInfo = targetManifest.refs?.[refClass];
    if (!refInfo) continue;
    const tagObject = gitText(sourceDir, ["rev-parse", refInfo.ref], `${refClass} ${refInfo.ref}`, failures);
    const commit = gitText(sourceDir, ["rev-parse", `${refInfo.ref}^{commit}`], `${refClass} ${refInfo.ref}`, failures);
    const tree = gitText(sourceDir, ["rev-parse", `${refInfo.ref}^{tree}`], `${refClass} ${refInfo.ref}`, failures);
    if (tagObject && commit && tree) {
      result.refs[refClass] = { ref: refInfo.ref, tagObject, commit, tree };
      if (commit !== refInfo.expectedCommit) failures.push(`${refClass}: commit ${commit} differs from ${refInfo.expectedCommit}`);
      if (refInfo.expectedTagObject && tagObject !== refInfo.expectedTagObject) failures.push(`${refClass}: tag object ${tagObject} differs from ${refInfo.expectedTagObject}`);
      if (refInfo.expectedTree && tree !== refInfo.expectedTree) failures.push(`${refClass}: tree ${tree} differs from ${refInfo.expectedTree}`);
    }
  }

  const currentRef = targetManifest.refs?.currentCoreRef;
  if (currentRef?.expectedCommit !== expectedIdentity.commit || currentRef?.expectedTree !== expectedIdentity.tree) failures.push("audit target current core ref differs from reviewed identity");

  for (const target of targetManifest.targets || []) {
    if (target.refClass === "publicCheckout") continue;
    const refInfo = targetManifest.refs[target.refClass];
    const blob = gitBlob(sourceDir, refInfo.ref, target.path, target.id, failures);
    if (blob !== null) {
      contents.set(target.id, blob);
      result.checkedTargets += 1;
    }
  }

  for (const target of targetManifest.targets || []) {
    if (!target.mirrorOf) continue;
    const local = contents.get(target.id);
    const upstream = contents.get(target.mirrorOf);
    if (!local || !upstream) continue;
    if (!local.equals(upstream)) failures.push(`${target.id}: ${target.path} drifted from ${target.mirrorOf}`);
    else result.mirroredTargets += 1;
  }

  const map = contents.get("core.publication_map");
  if (map && sha256(map) !== releaseManifest.source?.formalPublicationMapSha256) failures.push("core publication map digest differs from release manifest");
  if (map) {
    const publicationMap = JSON.parse(map.toString("utf8"));
    if (publicationMap.coordinate !== releaseManifest.source?.formalPublicationMapCoordinate) failures.push("core publication map coordinate differs from release manifest");
    if (publicationMap.milestoneSourceClosureSha256 !== releaseManifest.source?.leanSourceClosureSha256) failures.push("core publication source closure differs from release manifest");
    const pins = publicationMap.earnedMilestoneTheoremKernelTypeSha256 || {};
    const earned = releaseManifest.earnedBoundary || {};
    for (const [field, theoremField] of [
      ["pipelineSuppliedAcceptTraceKernelTypeSha256", "pipelineSuppliedAcceptTraceTheorem"],
      ["pipelineSuppliedRejectTraceKernelTypeSha256", "pipelineSuppliedRejectTraceTheorem"],
      ["pipelineSuppliedAcceptMachineOutputKernelTypeSha256", "pipelineSuppliedAcceptMachineOutputTheorem"],
      ["pipelineSuppliedRejectMachineOutputKernelTypeSha256", "pipelineSuppliedRejectMachineOutputTheorem"],
      ["pipelinePairedVerdictKernelTypeSha256", "pipelinePairedVerdictTheorem"],
      ["pipelinePairedMachineOutputKernelTypeSha256", "pipelinePairedMachineOutputTheorem"],
      ["pipelinePairedNoTimeoutKernelTypeSha256", "pipelinePairedNoTimeoutTheorem"],
      ["pipelinePairedAcceptsKernelTypeSha256", "pipelinePairedAcceptsTheorem"],
      ["pipelineInputFramerWorkTraceKernelTypeSha256", "pipelineInputFramerWorkTraceTheorem"],
      ["pipelineInputFramerRepresentedEndpointKernelTypeSha256", "pipelineInputFramerRepresentedEndpointTheorem"],
      ["pipelineInputFramerHaltedEndpointKernelTypeSha256", "pipelineInputFramerHaltedEndpointTheorem"],
      ["pipelineInputFramerRawBoundKernelTypeSha256", "pipelineInputFramerRawBoundTheorem"],
      ["pipelineInputFramerOrdinaryStartKernelTypeSha256", "pipelineInputFramerOrdinaryStartTheorem"],
      ["pipelineInputFramerBlankEquivalentKernelTypeSha256", "pipelineInputFramerBlankEquivalentTheorem"],
      ["pipelineInputFramerAcceptKernelTypeSha256", "pipelineInputFramerAcceptTheorem"],
      ["pipelineInputFramerNoTimeoutKernelTypeSha256", "pipelineInputFramerNoTimeoutTheorem"],
    ]) {
      if (pins[earned[theoremField]] !== earned[field]) failures.push(`core publication map fingerprint mismatch: ${field}`);
    }
  }

  if (failures.length > 0) throw new AuditTargetValidationError(failures, result);
  return result;
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--targets") {
      options.targetsPath = argv[++index];
    } else if (arg === "--release-manifest") {
      options.releaseManifestPath = argv[++index];
    } else if (arg === "--source-dir") {
      options.sourceDir = argv[++index];
    } else if (arg === "--require-source") {
      options.requireSource = true;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return options;
}

function main() {
  try {
    const result = validateAuditTargets(parseArgs(process.argv.slice(2)));
    if (result.skipped) {
      console.log(`SKIP ${result.skipReason}`);
      return;
    }
    for (const [refClass, info] of Object.entries(result.refs)) {
      console.log(`ok ${refClass} ${info.ref} object=${info.tagObject} commit=${info.commit}`);
    }
    console.log(`checked ${result.checkedTargets} audit target(s); verified ${result.mirroredTargets} exact mirror(s)`);
  } catch (error) {
    if (error instanceof AuditTargetValidationError) {
      for (const failure of error.failures) console.error(`FAIL ${failure}`);
      process.exit(1);
    }
    console.error(error.stack || String(error));
    process.exit(2);
  }
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) main();
