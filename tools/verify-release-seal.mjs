#!/usr/bin/env node
import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CORE_COMMIT = "fb9674949679a137b7ce790c1522efaecbe240ce";
const CORE_TREE = "6134fcd3c007bbcb23d46f273e8cf7dca5172d1b";
const PROOF_COMMIT = "ec2cd21e3848c383c3e75ca9ba2caec27f6d616f";
const OLD_PDF_SHA256 = "53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d";
const OLD_TEX_SHA256 = "414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7";

const EXPECTED_FILES = [
  {
    path: "downloads/canonical_proof_report.pdf",
    bytes: 251451,
    sha256: "5aa36153000ef8ef99fa0060088b2d5c9d7ea5549d683517beda8abf7d1d72ac",
    role: "current inventory-derived ten-page formal-reconstruction report PDF"
  },
  {
    path: "downloads/canonical-proof-report.pdf",
    bytes: 251451,
    sha256: "5aa36153000ef8ef99fa0060088b2d5c9d7ea5549d683517beda8abf7d1d72ac",
    role: "exact hyphenated alias of current formal-reconstruction report PDF"
  },
  {
    path: "downloads/canonical_proof_report.tex",
    bytes: 19161,
    sha256: "4768beadfbb1fa922962d1879eb22ee1769a8e00da1db92db60501f78a4a1fe2",
    role: "current inventory-derived formal-reconstruction report TeX"
  },
  {
    path: "downloads/canonical-proof-report.tex",
    bytes: 19161,
    sha256: "4768beadfbb1fa922962d1879eb22ee1769a8e00da1db92db60501f78a4a1fe2",
    role: "exact hyphenated alias of current formal-reconstruction report TeX"
  },
  {
    path: "public/pnp-status.json",
    bytes: 129216,
    sha256: "1df549b65431dc1740ec9f6452a853951a41cffc5b16ce77961e71fb7f14268a",
    role: "exact current core formal-reconstruction status mirror"
  },
  {
    path: "public/pnp-theorem-inventory.json",
    bytes: 1205195,
    sha256: "fcc6b1b8133562a155455f29d9834910b58ef3584a49fb5ca2d428a2e9515121",
    role: "exact current compiled Lean theorem inventory mirror"
  },
  {
    path: "downloads/formal-publication-release.json",
    bytes: 12196,
    sha256: "490972b2fef9c75aa902c36478e81fe1eed85cc2d4555f468456af7a9ff816a2",
    role: "current formal-publication release identity and fail-closed boundary"
  },
  {
    path: "downloads/source-checker-release.json",
    bytes: 1272,
    sha256: "c601c9ab282b3d9f9c98c1680cbc8c5592726032a0d79785a3edd80ce1d76441",
    role: "quarantined historical 7072f8d coordinate; never current theorem evidence"
  }
];

function fail(message) {
  throw new Error(message);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function exactKeys(value, expected, label) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    fail(`${label}: keys ${actual.join(",")} do not match ${wanted.join(",")}`);
  }
}

function readCheckedFile(root, relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.includes("\\")) {
    fail(`${relativePath}: release path must be a portable relative path`);
  }
  const resolved = path.resolve(root, relativePath);
  if (!resolved.startsWith(`${path.resolve(root)}${path.sep}`)) {
    fail(`${relativePath}: release path escapes repository root`);
  }
  const info = lstatSync(resolved);
  if (!info.isFile() || info.isSymbolicLink()) {
    fail(`${relativePath}: release entry must be a regular non-symlink file`);
  }
  return { buffer: readFileSync(resolved), bytes: info.size };
}

function parseJson(buffer, label) {
  try {
    return JSON.parse(buffer.toString("utf8"));
  } catch (error) {
    fail(`${label}: invalid JSON: ${error.message}`);
  }
}

function parseLedger(buffer) {
  const entries = [];
  const seen = new Set();
  for (const line of buffer.toString("utf8").split(/\r?\n/)) {
    if (line === "") continue;
    const match = line.match(/^([0-9a-f]{64})  ([A-Za-z0-9_./-]+)$/);
    if (!match) fail(`malformed SHA256SUMS line: ${line}`);
    if (seen.has(match[2])) fail(`duplicate SHA256SUMS path: ${match[2]}`);
    seen.add(match[2]);
    entries.push({ sha256: match[1], path: match[2] });
  }
  return entries;
}

function assertFailClosedStatus(status) {
  if (status.kind !== "PNPFormalReconstructionStatus0") fail("status kind mismatch");
  if (status.coordinate !== "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-13-28") fail("status coordinate mismatch");
  if (status.publicSurfaceBaselineCoordinate !== "PUBLIC-SURFACE-BASELINE-2026-07-13-PIPELINE-ALL-INPUT-FRAMER-27") fail("status public-surface coordinate mismatch");
  if (status.currentStatusAuthority !== true) fail("status must be current authority");
  if (status.publicationStatusDerivedOnlyFromConcreteGate !== true) fail("status must derive publication only from the concrete gate");
  if (status.concretePublicationGate?.passed !== false) fail("concrete publication gate must remain false");
  if (status.mathematicalTheoremEstablished !== false) fail("mathematical theorem must remain unestablished");
  if (status.publicTheoremEmissionAllowed !== false) fail("public theorem emission must remain denied");
  if (status.publicTheoremStatement !== null) fail("public theorem statement must remain null");
  if (status.rootLeanTheoremPresent !== false) fail("root Lean theorem must remain absent");
  if (status.projectSpecificAxiomsRemaining !== true) fail("project-specific axioms must remain disclosed");
  if (!Array.isArray(status.remainingBlockers) || status.remainingBlockers.length !== 7) fail("status must retain all seven formal blockers");
  if (status.leanConcreteCNFSATMembershipFormalized !== true || status.leanConcreteCNFSATMembershipTheorem !== "PNP.Concrete.FinalUniversalDesign.cnfSATInNP") fail("status CNF-SAT NP-membership theorem mismatch");
  if (status.leanConcreteCNFWorkAxiomAuditPassed !== true || status.leanConcreteCNFWorkAuditedDeclarationCount !== 766) fail("status CNF work audit mismatch");
  if (status.leanConcretePipelineStateNamespaceFormalized !== true || status.leanConcretePipelineStateNamespaceAxiomAuditPassed !== true || status.leanConcretePipelineStateNamespaceAuditedDeclarationCount !== 39) fail("status pipeline state-namespace boundary mismatch");
  if (status.leanConcretePipelineStageBridgesFormalized !== true || status.leanConcretePipelineStageBridgesAxiomAuditPassed !== true || status.leanConcretePipelineStageBridgesAuditedDeclarationCount !== 56) fail("status pipeline stage-bridge boundary mismatch");
  if (status.leanConcretePipelineStageLaunchFormalized !== true || status.leanConcretePipelineVerdictPreservationFormalized !== true || status.leanConcretePipelineInternalOutputHandoffComposed !== true) fail("status pipeline bridge composition boundary mismatch");
  if (status.leanConcretePipelineTerminalOutputPackingFormalized !== true || status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed !== true || status.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount !== 69) fail("status terminal-output packer boundary mismatch");
  if (status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized !== true || status.leanConcretePipelineTerminalBridgeAxiomAuditPassed !== true || status.leanConcretePipelineTerminalBridgeAuditedDeclarationCount !== 59) fail("status terminal-bridge suffix boundary mismatch");
  if (status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized !== true) fail("status supplied-trace transport boundary mismatch");
  if (status.leanConcretePipelineInputFramerAxiomAuditPassed !== true || status.leanConcretePipelineInputFramerAuditedDeclarationCount !== 70 || status.leanConcretePipelineAllInputFramingFormalized !== true) fail("status all-input framer boundary mismatch");
  if (status.leanConcretePipelinePairedCompilerAxiomAuditPassed !== true || status.leanConcretePipelinePairedCompilerAuditedDeclarationCount !== 28) fail("status canonical-pair compiler audit boundary mismatch");
  if (status.leanConcretePipelineCanonicalPairCompilationFormalized !== true || status.leanConcretePipelineExternalInputSizePolynomialFormalized !== true) fail("status canonical-pair compiler boundary mismatch");
  if (status.leanConcretePipelineMalformedInputBehaviorFormalized !== false || status.leanConcretePipelineRawRefinementFormalized !== false) fail("status overstates the all-input pipeline compiler result");
  if (status.leanConcreteCNFSATInPFormalized !== false || status.leanConcreteCNFNPCompletenessFormalized !== false) fail("status overstates the CNF-SAT result");
  if (status.leanTheoremInventorySha256 !== EXPECTED_FILES[5].sha256) fail("status inventory digest mismatch");
}

function assertInventory(inventory) {
  if (inventory.kind !== "PNPLeanTheoremInventory0") fail("inventory kind mismatch");
  if (inventory.coordinate !== "PNP-LEAN-THEOREM-INVENTORY-2026-07-13-28") fail("inventory coordinate mismatch");
  if (inventory.declarationCount !== 5197 || inventory.theoremCount !== 2197) fail("inventory declaration counts mismatch");
  if (inventory.assumptionFreeTheoremCount !== 2096 || inventory.sourceClosureModuleCount !== 48 || inventory.axiomCount !== 4) fail("inventory theorem/module/axiom counts mismatch");
  if (inventory.compatibilityRootCandidate !== null || inventory.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("inventory publication boundary mismatch");
  if (!Array.isArray(inventory.projectAxioms) || inventory.projectAxioms.length !== 4) fail("inventory must disclose four project axioms");
  const membership = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.FinalUniversalDesign.cnfSATInNP");
  if (!membership || membership.kind !== "theorem" || membership.axioms?.length !== 0) fail("inventory CNF-SAT NP-membership theorem boundary mismatch");
  const packer = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
  if (!packer || packer.kind !== "theorem" || packer.module !== "PNP.Concrete.TerminalOutputPacker" || packer.axioms?.length !== 0) fail("inventory terminal-output packer theorem boundary mismatch");
  const terminalBridge = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
  if (!terminalBridge || terminalBridge.kind !== "theorem" || terminalBridge.module !== "PNP.Concrete.PipelineTerminalBridge" || terminalBridge.axioms?.length !== 0) fail("inventory terminal-bridge theorem boundary mismatch");
  const suppliedTrace = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact");
  const suppliedOutput = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact");
  if (!suppliedTrace || suppliedTrace.kind !== "theorem" || suppliedTrace.axioms?.length !== 0 || !suppliedOutput || suppliedOutput.kind !== "theorem" || suppliedOutput.axioms?.length !== 0) fail("inventory supplied terminal-trace boundary mismatch");
  const pairedVerdict = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq");
  const pairedOutput = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq");
  const pairedTimeout = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout");
  const pairedAccepts = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff");
  if (!pairedVerdict || pairedVerdict.kind !== "theorem" || pairedVerdict.axioms?.length !== 0 || !pairedOutput || pairedOutput.kind !== "theorem" || pairedOutput.axioms?.length !== 0 || !pairedTimeout || pairedTimeout.kind !== "theorem" || pairedTimeout.axioms?.length !== 0 || !pairedAccepts || pairedAccepts.kind !== "theorem" || pairedAccepts.axioms?.length !== 0) fail("inventory canonical-pair compiler boundary mismatch");
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
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineInputFramer" || theorem.axioms?.length !== 0) fail(`inventory all-input framer theorem mismatch: ${name}`);
  }
  if (inventory.milestoneCandidates?.length !== 157) fail("inventory reviewed theorem-candidate count mismatch");
}

function assertCurrentManifest(manifest) {
  if (manifest.kind !== "PNPFormalPublicationRelease0" || manifest.version !== 0) fail("current formal-publication manifest kind/version mismatch");
  if (manifest.coordinate !== "PNP-FORMAL-PUBLICATION-RELEASE-2026-07-13-19") fail("current formal-publication coordinate mismatch");
  if (manifest.status !== "current-formal-reconstruction-publication-theorem-gate-closed" || manifest.authority !== "current") fail("current formal-publication authority mismatch");
  if (manifest.source?.commit !== CORE_COMMIT || manifest.source?.proofCommit !== PROOF_COMMIT || manifest.source?.tree !== CORE_TREE || manifest.source?.ref !== CORE_COMMIT) fail("current manifest is not pinned to the reviewed core merge and proof commit");
  if (manifest.source?.coordinateAloneIsAuthority !== false || manifest.source?.identityRequiresCommitTreeAndArtifactHashes !== true) fail("current manifest identity policy mismatch");
  if (manifest.source?.formalPublicationMapCoordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-13-28" || manifest.source?.formalPublicationMapSha256 !== "835f9677f165c6104b0f57f59017cb55254e6b048a5aceb1f7afc7eb664cbd38" || manifest.source?.leanSourceClosureSha256 !== "6b6558134e01809a69181416bf121cf3250dee4e468e6bb0efd7351cb5e5b1a6") fail("current manifest publication-map identity mismatch");
  if (manifest.artifacts?.report?.pageCount !== 10) fail("current report must have ten pages");
  if (manifest.artifacts?.report?.pdf?.sha256 !== EXPECTED_FILES[0].sha256 || manifest.artifacts?.report?.tex?.sha256 !== EXPECTED_FILES[2].sha256) fail("current report manifest digest mismatch");
  if (manifest.artifacts?.status?.sha256 !== EXPECTED_FILES[4].sha256 || manifest.artifacts?.theoremInventory?.sha256 !== EXPECTED_FILES[5].sha256) fail("current JSON manifest digest mismatch");
  const boundary = manifest.publicationBoundary || {};
  if (boundary.derivedOnlyFromConcreteGate !== true || boundary.concreteGatePassed !== false) fail("current manifest concrete gate boundary mismatch");
  if (boundary.mathematicalTheoremEstablished !== false || boundary.publicTheoremEmissionAllowed !== false || boundary.publicTheoremStatement !== null) fail("current manifest must fail closed");
  if (boundary.compatibilityRootPresent !== false || boundary.concreteTargetPresent !== true || boundary.projectSpecificAxiomsRemaining !== true || boundary.remainingBlockerCount !== 7) fail("current manifest blocker boundary mismatch");
  const earned = manifest.earnedBoundary || {};
  if (earned.leanTheorem !== "PNP.Concrete.FinalUniversalDesign.cnfSATInNP" || earned.kernelTypeSha256 !== "c9d66c135361cf8a8b25330d2558dfac209fde120e296140c7e7cb86bf1e1937" || earned.auditedDeclarationCount !== 766) fail("current manifest earned CNF-SAT boundary mismatch");
  if (!Array.isArray(earned.axiomClosure) || earned.axiomClosure.length !== 0 || earned.cnfSATInPFormalized !== false || earned.cnfSATNPCompletenessFormalized !== false || earned.pEqualsNPFormalized !== false) fail("current manifest CNF-SAT nonclaim boundary mismatch");
  if (earned.pipelineStateNamespacesFormalized !== true || earned.pipelineStateNamespaceAxiomAuditPassed !== true || earned.pipelineStateNamespaceAuditedDeclarationCount !== 39) fail("current manifest pipeline namespace boundary mismatch");
  if (earned.pipelineStageBridgesFormalized !== true || earned.pipelineStageBridgeAxiomAuditPassed !== true || earned.pipelineStageBridgeAuditedDeclarationCount !== 56 || earned.pipelineStageLaunchFormalized !== true || earned.pipelineVerdictPreservationFormalized !== true || earned.pipelineInternalOutputHandoffComposed !== true) fail("current manifest pipeline bridge boundary mismatch");
  if (earned.pipelineWorkCost !== "inputFramerWorkSteps + 1 + 3 * sourceSteps + 1 + framedOutputHandoffWorkSteps + 1 + terminalOutputPackerWorkSteps" || earned.pipelineCompiledRawCostMultiplier !== 6) fail("current manifest pipeline cost boundary mismatch");
  if (earned.pipelineTargetTerminationFormalized !== false || earned.pipelineTerminalRawOutputPackingFormalized !== true) fail("current manifest terminal-output boundary mismatch");
  if (earned.pipelineTerminalOutputPackerAxiomAuditPassed !== true || earned.pipelineTerminalOutputPackerAuditedDeclarationCount !== 69 || earned.pipelineTerminalOutputPackerTheorem !== "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq" || earned.pipelineTerminalOutputPackerKernelTypeSha256 !== "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66" || earned.pipelineTerminalOutputPackerCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 6") fail("current manifest terminal-output packer evidence mismatch");
  if (!Array.isArray(earned.pipelineTerminalOutputPackerAxiomClosure) || earned.pipelineTerminalOutputPackerAxiomClosure.length !== 0 || earned.pipelineTerminalOutputPackerConnectedToBridge !== true) fail("current manifest terminal-output packer composition boundary mismatch");
  if (earned.pipelineTerminalBridgeAxiomAuditPassed !== true || earned.pipelineTerminalBridgeAuditedDeclarationCount !== 59 || earned.pipelineTerminalBridgeAcceptingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents" || earned.pipelineTerminalBridgeAcceptingOutputKernelTypeSha256 !== "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001") fail("current manifest accepting terminal-bridge evidence mismatch");
  if (earned.pipelineTerminalBridgeRejectingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents" || earned.pipelineTerminalBridgeRejectingOutputKernelTypeSha256 !== "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db" || earned.pipelineTerminalBridgeCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 12") fail("current manifest rejecting terminal-bridge evidence mismatch");
  if (earned.pipelineSuppliedTraceWorkCostTheorem !== "PNP.Concrete.PipelineTerminalBridge.suppliedTraceTerminalWorkSteps_eq" || earned.pipelineSuppliedTraceWorkCostKernelTypeSha256 !== "7d9b5bf70b1675c1843f538e046030753b7e0be7c3bd50ec5d64ce9eb5b0869e") fail("current manifest supplied-trace cost evidence mismatch");
  if (earned.pipelineSuppliedAcceptTraceTheorem !== "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact" || earned.pipelineSuppliedAcceptTraceKernelTypeSha256 !== "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29") fail("current manifest supplied accepting-trace evidence mismatch");
  if (earned.pipelineSuppliedRejectTraceTheorem !== "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact" || earned.pipelineSuppliedRejectTraceKernelTypeSha256 !== "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c") fail("current manifest supplied rejecting-trace evidence mismatch");
  if (earned.pipelineSuppliedAcceptVerdictTheorem !== "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_accept_of_rawRunExact" || earned.pipelineSuppliedAcceptVerdictKernelTypeSha256 !== "bbc633544f84f156eef71f1aa488a359c35ecb46b1ba1d0dfaa393d1e045fde4") fail("current manifest accepting-verdict evidence mismatch");
  if (earned.pipelineSuppliedRejectVerdictTheorem !== "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_reject_of_rawRunExact" || earned.pipelineSuppliedRejectVerdictKernelTypeSha256 !== "a2cee1b6edc38318bd4b57c82bbc6f708b3c6e676f42128be00f787477a6fbfe") fail("current manifest rejecting-verdict evidence mismatch");
  if (earned.pipelineStuckTimeoutTheorem !== "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_timeout_of_stuck_rawRunExact" || earned.pipelineStuckTimeoutKernelTypeSha256 !== "0ce3f2337117d81a1a25b923c5604dcd9b8235e69598390825caae68c93d9488") fail("current manifest stuck-timeout evidence mismatch");
  if (earned.pipelineSuppliedAcceptMachineOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact" || earned.pipelineSuppliedAcceptMachineOutputKernelTypeSha256 !== "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01") fail("current manifest accepting-output evidence mismatch");
  if (earned.pipelineSuppliedRejectMachineOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact" || earned.pipelineSuppliedRejectMachineOutputKernelTypeSha256 !== "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd") fail("current manifest rejecting-output evidence mismatch");
  if (!Array.isArray(earned.pipelineTerminalBridgeAxiomClosure) || earned.pipelineTerminalBridgeAxiomClosure.length !== 0 || earned.pipelinePriorTraceTransportToTerminalBridgeFormalized !== true) fail("current manifest terminal-bridge supplied-trace boundary mismatch");
  if (earned.pipelineInputFramerAxiomAuditPassed !== true || earned.pipelineInputFramerAuditedDeclarationCount !== 70 || earned.pipelineAllInputFramingFormalized !== true || !Array.isArray(earned.pipelineInputFramerAxiomClosure) || earned.pipelineInputFramerAxiomClosure.length !== 0) fail("current manifest all-input framer audit boundary mismatch");
  if (earned.pipelineInputFramerWorkTraceTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact" || earned.pipelineInputFramerWorkTraceKernelTypeSha256 !== "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a") fail("current manifest all-input framer trace evidence mismatch");
  if (earned.pipelineInputFramerRepresentedEndpointTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents" || earned.pipelineInputFramerRepresentedEndpointKernelTypeSha256 !== "8f1fa6f45f267d60eadad754d9c88e4ea58631b881152af0a51244f5f7d207af" || earned.pipelineInputFramerHaltedEndpointTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted" || earned.pipelineInputFramerHaltedEndpointKernelTypeSha256 !== "beca62f878cccce7434d899512cf9aaea25b222d113ec60df90da0fde8801faa") fail("current manifest all-input framer endpoint evidence mismatch");
  if (earned.pipelineInputFramerRawBoundTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le" || earned.pipelineInputFramerRawBoundKernelTypeSha256 !== "bac4d4c78cb57e3ab70f752e2895a2f7ddd3c5356a6d1c457dd5832413d89eab" || earned.pipelineInputFramerRawTimePolynomial !== "6 * m * m + 39 * m + 75") fail("current manifest all-input framer polynomial evidence mismatch");
  if (earned.pipelineInputFramerOrdinaryStartTheorem !== "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound" || earned.pipelineInputFramerOrdinaryStartKernelTypeSha256 !== "4efe0f62d185b7ac19d73aebb09008e97f00c96a8252e263c901f8a6add7c45b" || earned.pipelineInputFramerBlankEquivalentTheorem !== "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent" || earned.pipelineInputFramerBlankEquivalentKernelTypeSha256 !== "1eaa31ea98226c202722a0e67aa796b7b461ccf5367f35fff194973bb609ce8a") fail("current manifest all-input framer ordinary-start evidence mismatch");
  if (earned.pipelineInputFramerAcceptTheorem !== "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept" || earned.pipelineInputFramerAcceptKernelTypeSha256 !== "3ef9f8377ec7ad7ebb70aa41b978cdb22f2c1c029b26e1e4c241ce00c20781d4" || earned.pipelineInputFramerNoTimeoutTheorem !== "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout" || earned.pipelineInputFramerNoTimeoutKernelTypeSha256 !== "48b9ee1743a6881a663fb7a1cc59984c371ff853524f9b18bad58014c229f9fe") fail("current manifest all-input framer verdict evidence mismatch");
  if (earned.pipelineInputFramerEmptyWorkSteps !== "4" || earned.pipelineInputFramerCompleteCellsWorkSteps !== "4 * k * k + 9 * k + 7" || earned.pipelineInputFramerPartialCellWorkSteps !== "4 * k * k + 9 * k + 5") fail("current manifest all-input framer branch-cost evidence mismatch");
  if (earned.pipelinePairedCompilerAxiomAuditPassed !== true || earned.pipelinePairedCompilerAuditedDeclarationCount !== 28 || earned.pipelineCanonicalPairCompilationFormalized !== true) fail("current manifest canonical-pair compiler boundary mismatch");
  if (earned.pipelinePairedVerdictTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq" || earned.pipelinePairedVerdictKernelTypeSha256 !== "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731") fail("current manifest canonical-pair verdict evidence mismatch");
  if (earned.pipelinePairedMachineOutputTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq" || earned.pipelinePairedMachineOutputKernelTypeSha256 !== "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267") fail("current manifest canonical-pair output evidence mismatch");
  if (earned.pipelinePairedNoTimeoutTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout" || earned.pipelinePairedNoTimeoutKernelTypeSha256 !== "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab") fail("current manifest canonical-pair timeout evidence mismatch");
  if (earned.pipelinePairedAcceptsTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff" || earned.pipelinePairedAcceptsKernelTypeSha256 !== "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9") fail("current manifest canonical-pair language evidence mismatch");
  if (!Array.isArray(earned.pipelinePairedCompilerAxiomClosure) || earned.pipelinePairedCompilerAxiomClosure.length !== 0 || earned.pipelineOutputSizePolynomial !== "B(m) = m + p(m) + 1" || earned.pipelineRawTimePolynomial !== "R(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))") fail("current manifest canonical-pair polynomial evidence mismatch");
  if (earned.pipelineExternalInputSizePolynomialFormalized !== true || earned.pipelineMalformedInputBehaviorFormalized !== false || earned.pipelineRawRefinementFormalized !== false) fail("current manifest overstates all-input pipeline completeness");
  if (manifest.historicalArchive?.status !== "historical-quarantined-not-current-authority" || manifest.historicalArchive?.currentArtifactEligible !== false || manifest.historicalArchive?.mayActivateTheoremPublication !== false) fail("historical archive is not quarantined");
}

function assertHistoricalManifest(manifest) {
  if (manifest.kind !== "PNPHistoricalSourceCheckerReleaseReference0" || manifest.version !== 0) fail("historical manifest kind/version mismatch");
  if (manifest.status !== "historical-quarantined-not-current-authority" || manifest.authority !== "historical-only") fail("historical manifest authority mismatch");
  if (manifest.sourceCommit !== "7072f8d0bda6d44d240f9bb3fad624fd357e1278") fail("historical source coordinate mismatch");
  if (manifest.historicalCanonicalReport?.pdfSha256 !== OLD_PDF_SHA256 || manifest.historicalCanonicalReport?.texSha256 !== OLD_TEX_SHA256 || manifest.historicalCanonicalReport?.pageCount !== 56) fail("historical report coordinate mismatch");
  if (manifest.currentArtifactEligible !== false || manifest.currentStatusAuthority !== false || manifest.mayActivateTheoremPublication !== false) fail("historical metadata can influence current publication");
}

export function verifyReleaseSeal(options = {}) {
  const root = path.resolve(options.root || process.cwd());
  const log = options.log || (() => {});
  const sealFile = readCheckedFile(root, "downloads/release-seal.json");
  const ledgerFile = readCheckedFile(root, "downloads/SHA256SUMS");
  const seal = parseJson(sealFile.buffer, "downloads/release-seal.json");
  const ledger = parseLedger(ledgerFile.buffer);

  exactKeys(seal, [
    "kind", "version", "scope", "status", "generated_utc",
    "current_publication_coordinate", "current_core_commit", "current_core_tree",
    "theorem_gate_passed", "public_theorem_emission_allowed",
    "historical_metadata_status", "files"
  ], "release seal");
  if (seal.kind !== "PNPLabsFormalPublicationSeal0" || seal.version !== 0) fail("release seal kind/version mismatch");
  if (seal.status !== "file identity only; not theorem validation") fail("release seal must deny theorem validation");
  if (seal.current_publication_coordinate !== "PNP-FORMAL-PUBLICATION-RELEASE-2026-07-13-19") fail("release seal publication coordinate mismatch");
  if (seal.current_core_commit !== CORE_COMMIT || seal.current_core_tree !== CORE_TREE) fail("release seal core identity mismatch");
  if (seal.theorem_gate_passed !== false || seal.public_theorem_emission_allowed !== false) fail("release seal must fail closed");
  if (seal.historical_metadata_status !== "historical-quarantined-not-current-authority") fail("release seal historical status mismatch");
  if (!Array.isArray(seal.files) || seal.files.length !== EXPECTED_FILES.length) fail("release seal file set is not exact");
  if (ledger.length !== EXPECTED_FILES.length) fail("SHA256SUMS file set is not exact");

  const buffers = new Map();
  for (let index = 0; index < EXPECTED_FILES.length; index += 1) {
    const expected = EXPECTED_FILES[index];
    const entry = seal.files[index];
    exactKeys(entry, ["path", "bytes", "sha256", "role"], `release seal entry ${index}`);
    if (JSON.stringify(entry) !== JSON.stringify(expected)) fail(`${expected.path}: release seal entry drifted`);
    const ledgerEntry = ledger[index];
    if (ledgerEntry.path !== expected.path || ledgerEntry.sha256 !== expected.sha256) fail(`${expected.path}: SHA256SUMS ordering or digest drifted`);
    const file = readCheckedFile(root, expected.path);
    const actual = sha256(file.buffer);
    if (file.bytes !== expected.bytes) fail(`${expected.path}: byte count ${file.bytes} does not match ${expected.bytes}`);
    if (actual !== expected.sha256) fail(`${expected.path}: SHA-256 ${actual} does not match ${expected.sha256}`);
    buffers.set(expected.path, file.buffer);
    log(`ok ${expected.path} ${actual}`);
  }

  if (!buffers.get(EXPECTED_FILES[0].path).equals(buffers.get(EXPECTED_FILES[1].path))) fail("PDF aliases are not byte-identical");
  if (!buffers.get(EXPECTED_FILES[2].path).equals(buffers.get(EXPECTED_FILES[3].path))) fail("TeX aliases are not byte-identical");
  if (sha256(buffers.get(EXPECTED_FILES[0].path)) === OLD_PDF_SHA256 || sha256(buffers.get(EXPECTED_FILES[2].path)) === OLD_TEX_SHA256) fail("historical report bytes were restored into a current alias");

  assertFailClosedStatus(parseJson(buffers.get("public/pnp-status.json"), "public/pnp-status.json"));
  assertInventory(parseJson(buffers.get("public/pnp-theorem-inventory.json"), "public/pnp-theorem-inventory.json"));
  assertCurrentManifest(parseJson(buffers.get("downloads/formal-publication-release.json"), "downloads/formal-publication-release.json"));
  assertHistoricalManifest(parseJson(buffers.get("downloads/source-checker-release.json"), "downloads/source-checker-release.json"));

  return { checked: EXPECTED_FILES.length, coreCommit: CORE_COMMIT };
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  try {
    const result = verifyReleaseSeal({ log: console.log });
    console.log(`verified ${result.checked} exact public artefact files; this confirms file identity only`);
  } catch (error) {
    console.error(error.stack || String(error));
    process.exit(1);
  }
}
