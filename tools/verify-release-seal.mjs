#!/usr/bin/env node
import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CORE_COMMIT = "bd7e84a49e027020f2d6f6fc4c3cac1f7541aace";
const CORE_TREE = "50d5debda67073ab23caab45f89341b9a63e436c";
const OLD_PDF_SHA256 = "53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d";
const OLD_TEX_SHA256 = "414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7";

const EXPECTED_FILES = [
  {
    path: "downloads/canonical_proof_report.pdf",
    bytes: 241760,
    sha256: "2dfc1b6b6792947fdbce055c849e5b293d63d44892eb673f7c03559dcb2f238d",
    role: "current inventory-derived seven-page formal-reconstruction report PDF"
  },
  {
    path: "downloads/canonical-proof-report.pdf",
    bytes: 241760,
    sha256: "2dfc1b6b6792947fdbce055c849e5b293d63d44892eb673f7c03559dcb2f238d",
    role: "exact hyphenated alias of current formal-reconstruction report PDF"
  },
  {
    path: "downloads/canonical_proof_report.tex",
    bytes: 14950,
    sha256: "feeaaf482d597a0b6cb590abb01dd210707241ac22eef39c001e526b362df496",
    role: "current inventory-derived formal-reconstruction report TeX"
  },
  {
    path: "downloads/canonical-proof-report.tex",
    bytes: 14950,
    sha256: "feeaaf482d597a0b6cb590abb01dd210707241ac22eef39c001e526b362df496",
    role: "exact hyphenated alias of current formal-reconstruction report TeX"
  },
  {
    path: "public/pnp-status.json",
    bytes: 48322,
    sha256: "e40098829ed054bfbb1857c44a5d9795d44bfcf08c18f2a213ededa47a0ba2f0",
    role: "exact current core formal-reconstruction status mirror"
  },
  {
    path: "public/pnp-theorem-inventory.json",
    bytes: 410648,
    sha256: "91b4db358afb1156eb39f3d97f49a5bb85a97f0b65ff1a879a51a6552ae15663",
    role: "exact current compiled Lean theorem inventory mirror"
  },
  {
    path: "downloads/formal-publication-release.json",
    bytes: 3236,
    sha256: "2846eab9ce4ae853fd8a4ee654eb338b1a2384e602953c850fe2c86d555f296d",
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
  if (status.coordinate !== "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-12") fail("status coordinate mismatch");
  if (status.publicSurfaceBaselineCoordinate !== "PUBLIC-SURFACE-BASELINE-2026-07-10-CONCRETE-COMPLEXITY-12") fail("status public-surface coordinate mismatch");
  if (status.currentStatusAuthority !== true) fail("status must be current authority");
  if (status.publicationStatusDerivedOnlyFromConcreteGate !== true) fail("status must derive publication only from the concrete gate");
  if (status.concretePublicationGate?.passed !== false) fail("concrete publication gate must remain false");
  if (status.mathematicalTheoremEstablished !== false) fail("mathematical theorem must remain unestablished");
  if (status.publicTheoremEmissionAllowed !== false) fail("public theorem emission must remain denied");
  if (status.publicTheoremStatement !== null) fail("public theorem statement must remain null");
  if (status.rootLeanTheoremPresent !== false) fail("root Lean theorem must remain absent");
  if (status.projectSpecificAxiomsRemaining !== true) fail("project-specific axioms must remain disclosed");
  if (!Array.isArray(status.remainingBlockers) || status.remainingBlockers.length !== 7) fail("status must retain all seven formal blockers");
  if (status.leanTheoremInventorySha256 !== EXPECTED_FILES[5].sha256) fail("status inventory digest mismatch");
}

function assertInventory(inventory) {
  if (inventory.kind !== "PNPLeanTheoremInventory0") fail("inventory kind mismatch");
  if (inventory.coordinate !== "PNP-LEAN-THEOREM-INVENTORY-2026-07-10-12") fail("inventory coordinate mismatch");
  if (inventory.declarationCount !== 2484 || inventory.theoremCount !== 883) fail("inventory declaration counts mismatch");
  if (inventory.assumptionFreeTheoremCount !== 793 || inventory.axiomCount !== 5) fail("inventory theorem/axiom counts mismatch");
  if (inventory.compatibilityRootCandidate !== null || inventory.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("inventory publication boundary mismatch");
  if (!Array.isArray(inventory.projectAxioms) || inventory.projectAxioms.length !== 5) fail("inventory must disclose five project axioms");
}

function assertCurrentManifest(manifest) {
  if (manifest.kind !== "PNPFormalPublicationRelease0" || manifest.version !== 0) fail("current formal-publication manifest kind/version mismatch");
  if (manifest.coordinate !== "PNP-FORMAL-PUBLICATION-RELEASE-2026-07-10-12") fail("current formal-publication coordinate mismatch");
  if (manifest.status !== "current-formal-reconstruction-publication-theorem-gate-closed" || manifest.authority !== "current") fail("current formal-publication authority mismatch");
  if (manifest.source?.commit !== CORE_COMMIT || manifest.source?.tree !== CORE_TREE || manifest.source?.ref !== CORE_COMMIT) fail("current manifest is not pinned to the reviewed core merge");
  if (manifest.artifacts?.report?.pageCount !== 7) fail("current report must have seven pages");
  if (manifest.artifacts?.report?.pdf?.sha256 !== EXPECTED_FILES[0].sha256 || manifest.artifacts?.report?.tex?.sha256 !== EXPECTED_FILES[2].sha256) fail("current report manifest digest mismatch");
  if (manifest.artifacts?.status?.sha256 !== EXPECTED_FILES[4].sha256 || manifest.artifacts?.theoremInventory?.sha256 !== EXPECTED_FILES[5].sha256) fail("current JSON manifest digest mismatch");
  const boundary = manifest.publicationBoundary || {};
  if (boundary.derivedOnlyFromConcreteGate !== true || boundary.concreteGatePassed !== false) fail("current manifest concrete gate boundary mismatch");
  if (boundary.mathematicalTheoremEstablished !== false || boundary.publicTheoremEmissionAllowed !== false || boundary.publicTheoremStatement !== null) fail("current manifest must fail closed");
  if (boundary.compatibilityRootPresent !== false || boundary.concreteTargetPresent !== true || boundary.projectSpecificAxiomsRemaining !== true || boundary.remainingBlockerCount !== 7) fail("current manifest blocker boundary mismatch");
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
