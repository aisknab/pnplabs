#!/usr/bin/env node
import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CORE_COMMIT = "250f403ece79e6fb259a098fb784b79a10efc11e";
const CORE_TREE = "5d0c31f1cec0a97387b51cf16c30c3e46214b314";
const PROOF_COMMIT = "c6e7c4120735f8586f91185f944839ae2d14f06f";
const OLD_PDF_SHA256 = "53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d";
const OLD_TEX_SHA256 = "414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7";

const EXPECTED_FILES = [
  {
    path: "downloads/canonical_proof_report.pdf",
    bytes: 250930,
    sha256: "c5bb928abaed35831bbc80919989e491002b520c2852dd87f37eee1e128398d5",
    role: "current inventory-derived ten-page formal-reconstruction report PDF"
  },
  {
    path: "downloads/canonical-proof-report.pdf",
    bytes: 250930,
    sha256: "c5bb928abaed35831bbc80919989e491002b520c2852dd87f37eee1e128398d5",
    role: "exact hyphenated alias of current formal-reconstruction report PDF"
  },
  {
    path: "downloads/canonical_proof_report.tex",
    bytes: 19271,
    sha256: "f8245697aff109196c6529708476222b449c420ee741812d01d2fac5087ddb84",
    role: "current inventory-derived formal-reconstruction report TeX"
  },
  {
    path: "downloads/canonical-proof-report.tex",
    bytes: 19271,
    sha256: "f8245697aff109196c6529708476222b449c420ee741812d01d2fac5087ddb84",
    role: "exact hyphenated alias of current formal-reconstruction report TeX"
  },
  {
    path: "public/pnp-status.json",
    bytes: 109076,
    sha256: "372c0682e49be43fa1a05808b7bebbe8e609a0ec41365f4537958b5d3eb8b415",
    role: "exact current core formal-reconstruction status mirror"
  },
  {
    path: "public/pnp-theorem-inventory.json",
    bytes: 1037665,
    sha256: "305398f65fe313a765351da012c2d167433591f114856422a62866918f3abdf6",
    role: "exact current compiled Lean theorem inventory mirror"
  },
  {
    path: "downloads/formal-publication-release.json",
    bytes: 6298,
    sha256: "e72ff3c0b51088f8992674771d5cd55b68ec280253f0c699b9e79eb9ef634673",
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
  if (status.coordinate !== "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-12-24") fail("status coordinate mismatch");
  if (status.publicSurfaceBaselineCoordinate !== "PUBLIC-SURFACE-BASELINE-2026-07-12-PIPELINE-TERMINAL-BRIDGE-24") fail("status public-surface coordinate mismatch");
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
  if (status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized !== true || status.leanConcretePipelineTerminalBridgeAxiomAuditPassed !== true || status.leanConcretePipelineTerminalBridgeAuditedDeclarationCount !== 44) fail("status terminal-bridge suffix boundary mismatch");
  if (status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized !== false) fail("status overstates terminal-bridge prefix transport");
  if (status.leanConcretePipelineRawRefinementFormalized !== false || status.leanConcretePipelineExternalInputSizePolynomialFormalized !== false) fail("status overstates the pipeline compiler result");
  if (status.leanConcreteCNFSATInPFormalized !== false || status.leanConcreteCNFNPCompletenessFormalized !== false) fail("status overstates the CNF-SAT result");
  if (status.leanTheoremInventorySha256 !== EXPECTED_FILES[5].sha256) fail("status inventory digest mismatch");
}

function assertInventory(inventory) {
  if (inventory.kind !== "PNPLeanTheoremInventory0") fail("inventory kind mismatch");
  if (inventory.coordinate !== "PNP-LEAN-THEOREM-INVENTORY-2026-07-12-24") fail("inventory coordinate mismatch");
  if (inventory.declarationCount !== 5076 || inventory.theoremCount !== 2125) fail("inventory declaration counts mismatch");
  if (inventory.assumptionFreeTheoremCount !== 2024 || inventory.sourceClosureModuleCount !== 46 || inventory.axiomCount !== 4) fail("inventory theorem/module/axiom counts mismatch");
  if (inventory.compatibilityRootCandidate !== null || inventory.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("inventory publication boundary mismatch");
  if (!Array.isArray(inventory.projectAxioms) || inventory.projectAxioms.length !== 4) fail("inventory must disclose four project axioms");
  const membership = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.FinalUniversalDesign.cnfSATInNP");
  if (!membership || membership.kind !== "theorem" || membership.axioms?.length !== 0) fail("inventory CNF-SAT NP-membership theorem boundary mismatch");
  const packer = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
  if (!packer || packer.kind !== "theorem" || packer.module !== "PNP.Concrete.TerminalOutputPacker" || packer.axioms?.length !== 0) fail("inventory terminal-output packer theorem boundary mismatch");
  const terminalBridge = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
  if (!terminalBridge || terminalBridge.kind !== "theorem" || terminalBridge.module !== "PNP.Concrete.PipelineTerminalBridge" || terminalBridge.axioms?.length !== 0) fail("inventory terminal-bridge theorem boundary mismatch");
  if (inventory.milestoneCandidates?.length !== 124) fail("inventory reviewed theorem-candidate count mismatch");
}

function assertCurrentManifest(manifest) {
  if (manifest.kind !== "PNPFormalPublicationRelease0" || manifest.version !== 0) fail("current formal-publication manifest kind/version mismatch");
  if (manifest.coordinate !== "PNP-FORMAL-PUBLICATION-RELEASE-2026-07-13-16") fail("current formal-publication coordinate mismatch");
  if (manifest.status !== "current-formal-reconstruction-publication-theorem-gate-closed" || manifest.authority !== "current") fail("current formal-publication authority mismatch");
  if (manifest.source?.commit !== CORE_COMMIT || manifest.source?.proofCommit !== PROOF_COMMIT || manifest.source?.tree !== CORE_TREE || manifest.source?.ref !== CORE_COMMIT) fail("current manifest is not pinned to the reviewed core merge and proof commit");
  if (manifest.source?.coordinateAloneIsAuthority !== false || manifest.source?.identityRequiresCommitTreeAndArtifactHashes !== true) fail("current manifest identity policy mismatch");
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
  if (earned.pipelineWorkCost !== "inputFramerWorkSteps + 1 + 3 * sourceSteps + 1 + framedOutputHandoffWorkSteps" || earned.pipelineCompiledRawCostMultiplier !== 6) fail("current manifest pipeline cost boundary mismatch");
  if (earned.pipelineTargetTerminationFormalized !== false || earned.pipelineTerminalRawOutputPackingFormalized !== true) fail("current manifest terminal-output boundary mismatch");
  if (earned.pipelineTerminalOutputPackerAxiomAuditPassed !== true || earned.pipelineTerminalOutputPackerAuditedDeclarationCount !== 69 || earned.pipelineTerminalOutputPackerTheorem !== "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq" || earned.pipelineTerminalOutputPackerKernelTypeSha256 !== "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66" || earned.pipelineTerminalOutputPackerCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 6") fail("current manifest terminal-output packer evidence mismatch");
  if (!Array.isArray(earned.pipelineTerminalOutputPackerAxiomClosure) || earned.pipelineTerminalOutputPackerAxiomClosure.length !== 0 || earned.pipelineTerminalOutputPackerConnectedToBridge !== true) fail("current manifest terminal-output packer composition boundary mismatch");
  if (earned.pipelineTerminalBridgeAxiomAuditPassed !== true || earned.pipelineTerminalBridgeAuditedDeclarationCount !== 44 || earned.pipelineTerminalBridgeAcceptingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents" || earned.pipelineTerminalBridgeAcceptingOutputKernelTypeSha256 !== "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001") fail("current manifest accepting terminal-bridge evidence mismatch");
  if (earned.pipelineTerminalBridgeRejectingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents" || earned.pipelineTerminalBridgeRejectingOutputKernelTypeSha256 !== "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db" || earned.pipelineTerminalBridgeCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 12") fail("current manifest rejecting terminal-bridge evidence mismatch");
  if (!Array.isArray(earned.pipelineTerminalBridgeAxiomClosure) || earned.pipelineTerminalBridgeAxiomClosure.length !== 0 || earned.pipelinePriorTraceTransportToTerminalBridgeFormalized !== false) fail("current manifest terminal-bridge prefix boundary mismatch");
  if (earned.pipelineRawRefinementFormalized !== false || earned.pipelineExternalInputSizePolynomialFormalized !== false) fail("current manifest overstates pipeline completeness");
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
  if (seal.current_publication_coordinate !== "PNP-FORMAL-PUBLICATION-RELEASE-2026-07-13-16") fail("release seal publication coordinate mismatch");
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
