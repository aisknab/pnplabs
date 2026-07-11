#!/usr/bin/env node
import { createHash, randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { constants } from "node:fs";
import {
  lstat,
  mkdir,
  open,
  readdir,
  realpath,
  rename,
  rm,
  writeFile
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  PUBLIC_DIRECTORY_PATHS,
  PUBLIC_EXACT_PATHS,
  PUBLIC_ROOT_PATHS
} from "../public-surface.mjs";
import { verifyReleaseSeal } from "./verify-release-seal.mjs";

const SITE_REPOSITORY = "https://github.com/aisknab/pnplabs";
const PROOF_REPOSITORY = "https://github.com/aisknab/pnp";
const RELEASE_MANIFEST_PATH = "downloads/formal-publication-release.json";
const CONTENT_MANIFEST_PATH = "public/deployment-content-manifest.json";
const PROVENANCE_PATH = "public/deployment-provenance.json";
const EXCLUDED_RUNTIME_PATHS = Object.freeze([
  CONTENT_MANIFEST_PATH,
  PROVENANCE_PATH
]);

const CONTENT_MANIFEST_KEYS = Object.freeze([
  "kind",
  "version",
  "scope",
  "excludedRuntimePaths",
  "files"
]);

const PROVENANCE_KEYS = Object.freeze([
  "kind",
  "version",
  "scope",
  "siteSource",
  "proofPublication",
  "deployment",
  "servedContent",
  "checks",
  "nonClaims"
]);

function fail(message) {
  throw new Error(message);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function serializeJson(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
}

function assertExactKeys(value, expected, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label}: expected an object`);
  }
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    fail(`${label}: keys ${actual.join(",")} do not match ${wanted.join(",")}`);
  }
}

function assertSha(value, label) {
  if (typeof value !== "string" || !/^[0-9a-f]{40}$/.test(value)) {
    fail(`${label}: expected a lowercase 40-hex Git object ID`);
  }
}

function assertSha256(value, label) {
  if (typeof value !== "string" || !/^[0-9a-f]{64}$/.test(value)) {
    fail(`${label}: expected a lowercase 64-hex SHA-256 digest`);
  }
}

function assertUtcTimestamp(value, label) {
  if (typeof value !== "string"
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
    || Number.isNaN(Date.parse(value))) {
    fail(`${label}: expected an ISO-8601 UTC timestamp`);
  }
  const canonical = value.includes(".") ? value : value.replace("Z", ".000Z");
  if (new Date(value).toISOString() !== canonical) {
    fail(`${label}: expected a real canonical UTC date and time`);
  }
}

function assertSafeToken(value, label) {
  if (typeof value !== "string" || !/^[A-Za-z0-9._-]{1,128}$/.test(value)) {
    fail(`${label}: expected 1-128 letters, digits, dots, underscores, or hyphens`);
  }
}

function isContained(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

async function assertRealDirectory(directory, label) {
  const info = await lstat(directory);
  if (!info.isDirectory() || info.isSymbolicLink()) {
    fail(`${label}: expected a real directory`);
  }
}

async function readSafeRegularFile(root, relativePath) {
  if (typeof relativePath !== "string"
    || relativePath === ""
    || path.isAbsolute(relativePath)
    || relativePath.includes("\\")) {
    fail(`${relativePath}: expected a portable relative file path`);
  }

  const rootPath = path.resolve(root);
  const target = path.resolve(rootPath, relativePath);
  if (!isContained(rootPath, target) || target === rootPath) {
    fail(`${relativePath}: path escapes deployment root`);
  }

  let cursor = rootPath;
  for (const segment of path.relative(rootPath, target).split(path.sep)) {
    cursor = path.join(cursor, segment);
    const info = await lstat(cursor);
    if (info.isSymbolicLink()) fail(`${relativePath}: path contains a symbolic link`);
  }

  const [rootReal, targetReal] = await Promise.all([realpath(rootPath), realpath(target)]);
  if (!isContained(rootReal, targetReal)) fail(`${relativePath}: resolved path escapes deployment root`);
  const handle = await open(targetReal, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const info = await handle.stat();
    if (!info.isFile()) fail(`${relativePath}: expected a regular non-symlink file`);
    return await handle.readFile();
  } finally {
    await handle.close();
  }
}

async function walkPublicDirectory(root, relativeDirectory, output) {
  const absolute = path.join(root, relativeDirectory);
  await assertRealDirectory(absolute, relativeDirectory);
  const entries = await readdir(absolute, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (EXCLUDED_RUNTIME_PATHS.includes(relativePath)) continue;
    if (entry.isSymbolicLink()) fail(`${relativePath}: public surface contains a symbolic link`);
    if (entry.isDirectory()) {
      await walkPublicDirectory(root, relativePath, output);
    } else if (entry.isFile()) {
      output.push(relativePath);
    } else {
      fail(`${relativePath}: public surface entry is not a regular file or directory`);
    }
  }
}

async function listPublicFiles(root) {
  const rootPath = path.resolve(root);
  await assertRealDirectory(rootPath, "deployment root");
  const files = [...PUBLIC_ROOT_PATHS, ...PUBLIC_EXACT_PATHS];
  for (const directory of PUBLIC_DIRECTORY_PATHS) {
    await walkPublicDirectory(rootPath, directory, files);
  }
  files.sort();
  if (new Set(files).size !== files.length) fail("public surface contains duplicate paths");
  return files;
}

async function createContentManifest(root) {
  const rootPath = path.resolve(root);
  const files = [];
  for (const relativePath of await listPublicFiles(rootPath)) {
    const buffer = await readSafeRegularFile(rootPath, relativePath);
    files.push({
      path: relativePath,
      bytes: buffer.byteLength,
      sha256: sha256(buffer)
    });
  }

  return {
    kind: "PNPLabsDeploymentContentManifest0",
    version: 0,
    scope: "exact bytes of the allowlisted static site; file identity only, not theorem validation",
    excludedRuntimePaths: [...EXCLUDED_RUNTIME_PATHS],
    files
  };
}

function isPublicTrackedPath(relativePath) {
  return PUBLIC_ROOT_PATHS.includes(relativePath)
    || PUBLIC_EXACT_PATHS.includes(relativePath)
    || PUBLIC_DIRECTORY_PATHS.some((directory) => relativePath.startsWith(`${directory}/`));
}

function assertManifestMatchesGit(root, manifest) {
  const rootPath = path.resolve(root);
  const result = spawnSync(
    "git",
    ["-c", `safe.directory=${rootPath}`, "-c", "core.fsmonitor=false", "-C", rootPath, "ls-files", "-z"],
    {
      encoding: "buffer",
      env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
      maxBuffer: 16 * 1024 * 1024
    }
  );
  if (result.status !== 0) fail("unable to inspect tracked deployment files");
  const tracked = new Set(
    result.stdout
      .toString("utf8")
      .split("\0")
      .filter(Boolean)
      .filter(isPublicTrackedPath)
  );
  const manifested = new Set(manifest.files.map((entry) => entry.path));
  const untrackedPublic = [...manifested].filter((entry) => !tracked.has(entry)).sort();
  const missingTracked = [...tracked].filter((entry) => !manifested.has(entry)).sort();
  if (untrackedPublic.length > 0) {
    fail(`deployment public surface contains untracked or ignored files: ${untrackedPublic.join(", ")}`);
  }
  if (missingTracked.length > 0) {
    fail(`tracked public files are missing from the deployment manifest: ${missingTracked.join(", ")}`);
  }
}

function parseJson(buffer, label) {
  try {
    return JSON.parse(buffer.toString("utf8"));
  } catch (error) {
    fail(`${label}: invalid JSON: ${error.message}`);
  }
}

function validateContentManifest(manifest) {
  assertExactKeys(manifest, CONTENT_MANIFEST_KEYS, "content manifest");
  if (manifest.kind !== "PNPLabsDeploymentContentManifest0" || manifest.version !== 0) {
    fail("content manifest: unsupported kind or version");
  }
  if (manifest.scope !== "exact bytes of the allowlisted static site; file identity only, not theorem validation") {
    fail("content manifest: unexpected scope");
  }
  if (JSON.stringify(manifest.excludedRuntimePaths) !== JSON.stringify(EXCLUDED_RUNTIME_PATHS)) {
    fail("content manifest: runtime exclusions drifted");
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    fail("content manifest: expected at least one file");
  }

  const seen = new Set();
  let previous = "";
  for (const [index, entry] of manifest.files.entries()) {
    assertExactKeys(entry, ["path", "bytes", "sha256"], `content manifest file ${index}`);
    if (typeof entry.path !== "string"
      || entry.path === ""
      || path.isAbsolute(entry.path)
      || entry.path.includes("\\")
      || entry.path.split("/").includes("..")) {
      fail(`content manifest file ${index}: invalid path`);
    }
    if (EXCLUDED_RUNTIME_PATHS.includes(entry.path)) {
      fail(`content manifest file ${index}: runtime file included in its own content closure`);
    }
    if (entry.path <= previous) fail("content manifest: files must be unique and strictly sorted");
    previous = entry.path;
    if (seen.has(entry.path)) fail(`content manifest: duplicate path ${entry.path}`);
    seen.add(entry.path);
    if (!Number.isSafeInteger(entry.bytes) || entry.bytes < 0) {
      fail(`content manifest file ${index}: invalid byte count`);
    }
    assertSha256(entry.sha256, `content manifest file ${index} digest`);
  }
  return manifest;
}

function validateReleaseManifest(release) {
  if (!release || typeof release !== "object" || Array.isArray(release)) {
    fail("formal publication release: expected an object");
  }
  if (release.kind !== "PNPFormalPublicationRelease0"
    || release.version !== 0
    || release.authority !== "current") {
    fail("formal publication release: unsupported or non-current release");
  }
  assertSha(release.source?.commit, "formal publication release source commit");
  assertSha(release.source?.tree, "formal publication release source tree");
  return release;
}

function createProvenanceRecord({
  siteCommit,
  siteTree,
  release,
  releaseManifestSha256,
  deployedAtUtc,
  releaseId,
  method,
  contentManifestSha256,
  npmTestPassed
}) {
  assertSha(siteCommit, "site commit");
  assertSha(siteTree, "site tree");
  assertSha256(releaseManifestSha256, "formal publication release digest");
  assertSha256(contentManifestSha256, "content manifest digest");
  assertUtcTimestamp(deployedAtUtc, "deployment time");
  assertSafeToken(releaseId, "release ID");
  assertSafeToken(method, "deployment method");
  if (npmTestPassed !== true) fail("npm test must have passed before deployment provenance is generated");

  return {
    kind: "PNPLabsDeploymentProvenance0",
    version: 0,
    scope: "deployment and file identity only; not theorem validation",
    siteSource: {
      repository: SITE_REPOSITORY,
      commit: siteCommit,
      tree: siteTree
    },
    proofPublication: {
      repository: PROOF_REPOSITORY,
      commit: release.source.commit,
      tree: release.source.tree,
      releaseManifestPath: `/${RELEASE_MANIFEST_PATH}`,
      releaseManifestSha256
    },
    deployment: {
      releaseId,
      deployedAtUtc,
      method
    },
    servedContent: {
      manifestPath: `/${CONTENT_MANIFEST_PATH}`,
      manifestSha256: contentManifestSha256,
      excludedRuntimePaths: [...EXCLUDED_RUNTIME_PATHS]
    },
    checks: {
      npmTestPassed: true,
      releaseSealPassed: true
    },
    nonClaims: [
      "This record establishes deployment identity only.",
      "It does not establish theorem correctness.",
      "The runtime record is unsigned."
    ]
  };
}

function validateProvenanceRecord(record) {
  assertExactKeys(record, PROVENANCE_KEYS, "deployment provenance");
  if (record.kind !== "PNPLabsDeploymentProvenance0"
    || record.version !== 0
    || record.scope !== "deployment and file identity only; not theorem validation") {
    fail("deployment provenance: unsupported kind, version, or scope");
  }
  assertExactKeys(record.siteSource, ["repository", "commit", "tree"], "deployment provenance siteSource");
  if (record.siteSource.repository !== SITE_REPOSITORY) fail("deployment provenance: unexpected site repository");
  assertSha(record.siteSource.commit, "deployment provenance site commit");
  assertSha(record.siteSource.tree, "deployment provenance site tree");
  assertExactKeys(
    record.proofPublication,
    ["repository", "commit", "tree", "releaseManifestPath", "releaseManifestSha256"],
    "deployment provenance proofPublication"
  );
  if (record.proofPublication.repository !== PROOF_REPOSITORY
    || record.proofPublication.releaseManifestPath !== `/${RELEASE_MANIFEST_PATH}`) {
    fail("deployment provenance: unexpected proof publication locator");
  }
  assertSha(record.proofPublication.commit, "deployment provenance proof commit");
  assertSha(record.proofPublication.tree, "deployment provenance proof tree");
  assertSha256(record.proofPublication.releaseManifestSha256, "deployment provenance release digest");
  assertExactKeys(record.deployment, ["releaseId", "deployedAtUtc", "method"], "deployment provenance deployment");
  assertSafeToken(record.deployment.releaseId, "deployment provenance release ID");
  assertUtcTimestamp(record.deployment.deployedAtUtc, "deployment provenance time");
  assertSafeToken(record.deployment.method, "deployment provenance method");
  assertExactKeys(
    record.servedContent,
    ["manifestPath", "manifestSha256", "excludedRuntimePaths"],
    "deployment provenance servedContent"
  );
  if (record.servedContent.manifestPath !== `/${CONTENT_MANIFEST_PATH}`
    || JSON.stringify(record.servedContent.excludedRuntimePaths) !== JSON.stringify(EXCLUDED_RUNTIME_PATHS)) {
    fail("deployment provenance: unexpected content manifest locator or exclusions");
  }
  assertSha256(record.servedContent.manifestSha256, "deployment provenance content digest");
  assertExactKeys(record.checks, ["npmTestPassed", "releaseSealPassed"], "deployment provenance checks");
  if (record.checks.npmTestPassed !== true || record.checks.releaseSealPassed !== true) {
    fail("deployment provenance: pre-deployment checks are not both true");
  }
  if (JSON.stringify(record.nonClaims) !== JSON.stringify([
    "This record establishes deployment identity only.",
    "It does not establish theorem correctness.",
    "The runtime record is unsigned."
  ])) {
    fail("deployment provenance: non-claims drifted");
  }
  return record;
}

async function writeAtomically(root, relativePath, buffer) {
  const rootPath = path.resolve(root);
  const target = path.resolve(rootPath, relativePath);
  if (!isContained(rootPath, target) || target === rootPath) fail(`${relativePath}: target escapes deployment root`);
  const parent = path.dirname(target);
  await mkdir(parent, { recursive: true });
  await assertRealDirectory(parent, `${relativePath} parent`);
  try {
    const existing = await lstat(target);
    if (existing.isSymbolicLink() || !existing.isFile()) fail(`${relativePath}: target is not a regular file`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const temporary = `${target}.${process.pid}.${randomBytes(8).toString("hex")}.tmp`;
  try {
    await writeFile(temporary, buffer, { flag: "wx", mode: 0o644 });
    await rename(temporary, target);
  } finally {
    await rm(temporary, { force: true });
  }
}

async function generateDeploymentProvenance({
  root = process.cwd(),
  siteCommit,
  siteTree,
  deployedAtUtc,
  releaseId,
  method = "home-server-atomic-symlink-v1",
  npmTestPassed = false,
  requireGitTracked = false,
  write = false
}) {
  const rootPath = path.resolve(root);
  verifyReleaseSeal({ root: rootPath });
  const releaseBuffer = await readSafeRegularFile(rootPath, RELEASE_MANIFEST_PATH);
  const release = validateReleaseManifest(parseJson(releaseBuffer, RELEASE_MANIFEST_PATH));
  const contentManifest = validateContentManifest(await createContentManifest(rootPath));
  if (requireGitTracked) assertManifestMatchesGit(rootPath, contentManifest);
  const contentBuffer = serializeJson(contentManifest);
  const provenance = validateProvenanceRecord(createProvenanceRecord({
    siteCommit,
    siteTree,
    release,
    releaseManifestSha256: sha256(releaseBuffer),
    deployedAtUtc,
    releaseId,
    method,
    contentManifestSha256: sha256(contentBuffer),
    npmTestPassed
  }));
  const provenanceBuffer = serializeJson(provenance);

  if (write) {
    await writeAtomically(rootPath, CONTENT_MANIFEST_PATH, contentBuffer);
    await writeAtomically(rootPath, PROVENANCE_PATH, provenanceBuffer);
  }

  return {
    contentManifest,
    contentBuffer,
    provenance,
    provenanceBuffer
  };
}

async function verifyDeploymentProvenance({
  root = process.cwd(),
  expectedSiteCommit,
  expectedSiteTree,
  requireGitTracked = false
} = {}) {
  const rootPath = path.resolve(root);
  const [contentBuffer, provenanceBuffer, releaseBuffer] = await Promise.all([
    readSafeRegularFile(rootPath, CONTENT_MANIFEST_PATH),
    readSafeRegularFile(rootPath, PROVENANCE_PATH),
    readSafeRegularFile(rootPath, RELEASE_MANIFEST_PATH)
  ]);
  const contentManifest = validateContentManifest(parseJson(contentBuffer, CONTENT_MANIFEST_PATH));
  const provenance = validateProvenanceRecord(parseJson(provenanceBuffer, PROVENANCE_PATH));
  const release = validateReleaseManifest(parseJson(releaseBuffer, RELEASE_MANIFEST_PATH));
  const recomputed = validateContentManifest(await createContentManifest(rootPath));
  if (requireGitTracked) assertManifestMatchesGit(rootPath, recomputed);
  if (!contentBuffer.equals(serializeJson(recomputed))) fail("deployment content manifest does not match current public bytes");
  if (provenance.servedContent.manifestSha256 !== sha256(contentBuffer)) {
    fail("deployment provenance content-manifest digest does not match");
  }
  if (provenance.proofPublication.releaseManifestSha256 !== sha256(releaseBuffer)
    || provenance.proofPublication.commit !== release.source.commit
    || provenance.proofPublication.tree !== release.source.tree) {
    fail("deployment provenance proof-publication identity does not match the local release manifest");
  }
  if (expectedSiteCommit && provenance.siteSource.commit !== expectedSiteCommit) {
    fail(`deployment provenance site commit ${provenance.siteSource.commit} does not match ${expectedSiteCommit}`);
  }
  if (expectedSiteTree && provenance.siteSource.tree !== expectedSiteTree) {
    fail(`deployment provenance site tree ${provenance.siteSource.tree} does not match ${expectedSiteTree}`);
  }
  return { contentManifest, provenance };
}

function gitIdentity(root) {
  const rootPath = path.resolve(root);
  const run = (...args) => spawnSync(
    "git",
    ["-c", `safe.directory=${rootPath}`, "-c", "core.fsmonitor=false", "-C", rootPath, ...args],
    { encoding: "utf8", env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" } }
  );
  const commitResult = run("rev-parse", "HEAD");
  const treeResult = run("rev-parse", "HEAD^{tree}");
  if (commitResult.status !== 0 || treeResult.status !== 0) {
    fail("unable to resolve deployment Git commit and tree");
  }
  const commit = commitResult.stdout.trim();
  const tree = treeResult.stdout.trim();
  assertSha(commit, "resolved site commit");
  assertSha(tree, "resolved site tree");
  return { commit, tree };
}

function assertCleanGit(root) {
  const rootPath = path.resolve(root);
  const result = spawnSync(
    "git",
    [
      "-c",
      `safe.directory=${rootPath}`,
      "-c",
      "core.fsmonitor=false",
      "-C",
      rootPath,
      "status",
      "--porcelain",
      "--untracked-files=all"
    ],
    { encoding: "utf8", env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" } }
  );
  if (result.status !== 0) fail("unable to inspect deployment Git working tree");
  if (result.stdout !== "") {
    fail("deployment Git working tree must be clean before binding a commit and tree");
  }
}

function parseArguments(argv) {
  const options = {
    root: process.cwd(),
    method: "home-server-atomic-symlink-v1",
    npmTestPassed: false,
    check: false,
    json: false
  };
  const valueOptions = new Set([
    "--root",
    "--site-commit",
    "--site-tree",
    "--deployed-at",
    "--release-id",
    "--method"
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (valueOptions.has(argument)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) fail(`${argument}: expected a value`);
      index += 1;
      const key = {
        "--root": "root",
        "--site-commit": "siteCommit",
        "--site-tree": "siteTree",
        "--deployed-at": "deployedAtUtc",
        "--release-id": "releaseId",
        "--method": "method"
      }[argument];
      options[key] = value;
    } else if (argument === "--npm-test-passed") {
      options.npmTestPassed = true;
    } else if (argument === "--check") {
      options.check = true;
    } else if (argument === "--json") {
      options.json = true;
    } else {
      fail(`unknown argument: ${argument}`);
    }
  }
  return options;
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  const identity = gitIdentity(options.root);
  assertCleanGit(options.root);
  if (options.siteCommit && options.siteCommit !== identity.commit) {
    fail(`--site-commit ${options.siteCommit} does not match checked-out commit ${identity.commit}`);
  }
  if (options.siteTree && options.siteTree !== identity.tree) {
    fail(`--site-tree ${options.siteTree} does not match checked-out tree ${identity.tree}`);
  }
  const siteCommit = options.siteCommit || identity.commit;
  const siteTree = options.siteTree || identity.tree;
  if (options.check) {
    const result = await verifyDeploymentProvenance({
      root: options.root,
      expectedSiteCommit: siteCommit,
      expectedSiteTree: siteTree,
      requireGitTracked: true
    });
    const summary = {
      status: "deployment-provenance-valid",
      siteCommit,
      siteTree,
      files: result.contentManifest.files.length
    };
    process.stdout.write(options.json ? `${JSON.stringify(summary)}\n` : `${summary.status}: ${summary.files} files at ${siteCommit}\n`);
    return summary;
  }

  const deployedAtUtc = options.deployedAtUtc || new Date().toISOString();
  const releaseId = options.releaseId
    || `${deployedAtUtc.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}-${siteCommit.slice(0, 8)}`;
  const result = await generateDeploymentProvenance({
    root: options.root,
    siteCommit,
    siteTree,
    deployedAtUtc,
    releaseId,
    method: options.method,
    npmTestPassed: options.npmTestPassed,
    requireGitTracked: true,
    write: true
  });
  const summary = {
    status: "deployment-provenance-generated",
    siteCommit,
    siteTree,
    files: result.contentManifest.files.length,
    contentManifestSha256: result.provenance.servedContent.manifestSha256
  };
  process.stdout.write(options.json ? `${JSON.stringify(summary)}\n` : `${summary.status}: ${summary.files} files at ${siteCommit}\n`);
  return summary;
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

export {
  CONTENT_MANIFEST_PATH,
  EXCLUDED_RUNTIME_PATHS,
  PROVENANCE_PATH,
  assertCleanGit,
  assertManifestMatchesGit,
  createContentManifest,
  generateDeploymentProvenance,
  gitIdentity,
  main,
  parseArguments,
  readSafeRegularFile,
  serializeJson,
  sha256,
  validateContentManifest,
  validateProvenanceRecord,
  verifyDeploymentProvenance
};
