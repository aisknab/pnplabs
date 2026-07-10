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

const CORE_COMMIT = "bd7e84a49e027020f2d6f6fc4c3cac1f7541aace";
const CORE_TREE = "50d5debda67073ab23caab45f89341b9a63e436c";
const OLD_PDF_SHA256 = "53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d";
const OLD_TEX_SHA256 = "414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7";

const CORE_FILES = [
  {
    sourcePath: "canonical_proof_report.pdf",
    targets: ["downloads/canonical_proof_report.pdf", "downloads/canonical-proof-report.pdf"],
    bytes: 241760,
    sha256: "2dfc1b6b6792947fdbce055c849e5b293d63d44892eb673f7c03559dcb2f238d"
  },
  {
    sourcePath: "canonical_proof_report.tex",
    targets: ["downloads/canonical_proof_report.tex", "downloads/canonical-proof-report.tex"],
    bytes: 14950,
    sha256: "feeaaf482d597a0b6cb590abb01dd210707241ac22eef39c001e526b362df496"
  },
  {
    sourcePath: "public/pnp-status.json",
    targets: ["public/pnp-status.json"],
    bytes: 48322,
    sha256: "e40098829ed054bfbb1857c44a5d9795d44bfcf08c18f2a213ededa47a0ba2f0"
  },
  {
    sourcePath: "public/pnp-theorem-inventory.json",
    targets: ["public/pnp-theorem-inventory.json"],
    bytes: 410648,
    sha256: "91b4db358afb1156eb39f3d97f49a5bb85a97f0b65ff1a879a51a6552ae15663"
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
  if (sha256(map) !== "3f99368d729fb278339da66abca283cdaae823c5a614ddfaa893becab1014b6a") {
    fail("pinned formal-publication map digest mismatch");
  }
}

function checkPdfPageCount(pdfPath) {
  const result = spawnSync("pdfinfo", [pdfPath], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.status !== 0) fail(`pdfinfo failed for ${pdfPath}: ${(result.stderr || result.stdout || "pdfinfo unavailable").trim()}`);
  const match = result.stdout.match(/^Pages:\s+(\d+)\s*$/m);
  if (!match || Number(match[1]) !== 7) fail(`${pdfPath}: expected exactly seven pages`);
}

function assertCorePayloadBoundary(sourcePath, buffer) {
  if (!sourcePath.endsWith(".json")) return;
  const payload = JSON.parse(buffer.toString("utf8"));
  if (sourcePath === "public/pnp-status.json") {
    if (payload.concretePublicationGate?.passed !== false || payload.publicationStatusDerivedOnlyFromConcreteGate !== true) fail("core status concrete publication boundary mismatch");
    if (payload.mathematicalTheoremEstablished !== false || payload.publicTheoremEmissionAllowed !== false || payload.publicTheoremStatement !== null) fail("core status does not fail closed");
    if (payload.rootLeanTheoremPresent !== false || payload.projectSpecificAxiomsRemaining !== true || payload.remainingBlockers?.length !== 7) fail("core status blocker boundary mismatch");
  } else if (sourcePath === "public/pnp-theorem-inventory.json") {
    if (payload.compatibilityRootCandidate !== null || payload.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("core inventory publication boundary mismatch");
    if (payload.declarationCount !== 2484 || payload.theoremCount !== 883 || payload.assumptionFreeTheoremCount !== 793 || payload.axiomCount !== 5) fail("core inventory counts mismatch");
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
