import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_TARGETS = "docs/audit_targets.json";
const DEFAULT_RELEASE_MANIFEST = "downloads/source-checker-release.json";
const DEFAULT_SOURCE_DIR = "../pnp";

const KIND_TO_REF = new Map([
  ["source/checker code", "sourceRef"],
  ["release documentation", "docsRef"],
  ["generated artefact", "artifactRef"],
  ["pnplabs public-review file", "publicCheckout"]
]);

export class AuditTargetValidationError extends Error {
  constructor(failures, result = {}) {
    super(`audit target validation failed with ${failures.length} failure(s)`);
    this.name = "AuditTargetValidationError";
    this.failures = failures;
    this.result = result;
  }
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function normalizeBundlePath(value) {
  return String(value || "").replace(/\/+$/, "");
}

function runGit(sourceDir, args) {
  const result = spawnSync("git", ["-C", sourceDir, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
}

function gitOutputOrFailure(failures, label, sourceDir, args) {
  const result = runGit(sourceDir, args);
  if (!result.ok) {
    failures.push(`${label}: git ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
    return null;
  }
  return result.stdout;
}

function inferRequiredRefClass(target) {
  const targetPath = target.path || "";
  if (targetPath.startsWith("proof-artifacts/")) return "artifactRef";
  if (targetPath === "REPRODUCE.md" || targetPath === "REVIEWER_MAP.md") return "docsRef";
  if (targetPath.startsWith("review/")) return "docsRef";
  if (targetPath.startsWith("downloads/")) return "publicCheckout";
  if (targetPath.endsWith(".mjs") || targetPath.startsWith("test/")) return "sourceRef";
  return KIND_TO_REF.get(target.kind);
}

function validateTargetClasses(targets, refs, failures) {
  for (const target of targets) {
    if (!target.id) {
      failures.push("target is missing id");
    }
    if (!KIND_TO_REF.has(target.kind)) {
      failures.push(`${target.id || "<unknown>"}: unsupported target kind ${target.kind}`);
      continue;
    }
    if (!refs[target.refClass]) {
      failures.push(`${target.id}: unknown refClass ${target.refClass}`);
      continue;
    }

    const kindRef = KIND_TO_REF.get(target.kind);
    if (target.refClass !== kindRef) {
      failures.push(`${target.id}: ${target.kind} must use ${kindRef}, not ${target.refClass}`);
    }

    const pathRef = inferRequiredRefClass(target);
    if (pathRef && target.refClass !== pathRef) {
      failures.push(`${target.id}: path ${target.path} must use ${pathRef}, not ${target.refClass}`);
    }
  }
}

function compareValue(failures, context, field, actual, expected) {
  if (actual === undefined || actual === null || actual === "") return;
  const normalizedActual =
    field === "artifactBundlePath" || field === "bundlePath"
      ? normalizeBundlePath(actual)
      : String(actual);
  const normalizedExpected =
    field === "artifactBundlePath" || field === "bundlePath"
      ? normalizeBundlePath(expected)
      : String(expected);
  if (normalizedActual !== normalizedExpected) {
    failures.push(`${context}: ${field} is ${normalizedActual}, expected ${normalizedExpected}`);
  }
}

function expectedFromReleaseManifest(releaseManifest) {
  return {
    sourceCommit: releaseManifest.sourceCommit,
    sourceTag: releaseManifest.sourceTag,
    docsTag: releaseManifest.docsTag,
    artifactTag: releaseManifest.artifactTag,
    artifactBundlePath: normalizeBundlePath(releaseManifest.artifactBundlePath),
    validation: {
      tests: releaseManifest.expectedValidation?.tests,
      pass: releaseManifest.expectedValidation?.pass,
      fail: releaseManifest.expectedValidation?.fail,
      cancelled: releaseManifest.expectedValidation?.cancelled
    }
  };
}

function collectMatches(text, regex) {
  const found = new Set();
  regex.lastIndex = 0;
  for (const match of text.matchAll(regex)) {
    found.add(match[1]);
  }
  return [...found];
}

function compareTokenMatches(failures, context, field, text, regex, expected) {
  for (const actual of collectMatches(text, regex)) {
    if (String(actual) !== String(expected)) {
      failures.push(`${context}: ${field} token ${actual} differs from expected ${expected}`);
    }
  }
}

function compareCountMatches(failures, context, field, text, expected) {
  if (expected === undefined) return;
  const patterns = [
    new RegExp(`\\b${field}[ \\t]*[=:]?[ \\t]*(\\d+)\\b`, "gi"),
    new RegExp(`\\b(\\d+)[ \\t]+${field}\\b`, "gi")
  ];
  for (const pattern of patterns) {
    for (const actual of collectMatches(text, pattern)) {
      if (Number(actual) !== Number(expected)) {
        failures.push(`${context}: validation ${field} is ${actual}, expected ${expected}`);
      }
    }
  }
}

function validateReleaseText(text, context, expected, failures) {
  compareTokenMatches(
    failures,
    context,
    "sourceTag",
    text,
    /\b(final-pnp-proof-report-hardened-[0-9a-f]{7,40})\b/g,
    expected.sourceTag
  );
  compareTokenMatches(
    failures,
    context,
    "docsTag",
    text,
    /\b(final-pnp-proof-report-docs-hardened-[0-9a-f]{7,40}(?:-[A-Za-z0-9]+)?)\b/g,
    expected.docsTag
  );
  compareTokenMatches(
    failures,
    context,
    "artifactTag",
    text,
    /\b(final-pnp-proof-report-artifacts-hardened-[0-9a-f]{7,40}-sealed)\b/g,
    expected.artifactTag
  );
  compareTokenMatches(
    failures,
    context,
    "artifactBundlePath",
    text,
    /\b(proof-artifacts\/final-pnp-proof-report-hardened-[0-9a-f]{7,40})\/?\b/g,
    expected.artifactBundlePath
  );

  const sourceCommitPatterns = [
    /source commit:\s*([0-9a-f]{40})/gi,
    /source commit:\s*\n\s*([0-9a-f]{40})/gi,
    /Expected source commit:\s*\n\s*([0-9a-f]{40})/gi
  ];
  for (const pattern of sourceCommitPatterns) {
    compareTokenMatches(failures, context, "sourceCommit", text, pattern, expected.sourceCommit);
  }

  for (const field of ["tests", "pass", "fail", "cancelled"]) {
    compareCountMatches(failures, context, field, text, expected.validation[field]);
  }
}

function compareJsonFields(json, context, expected, failures) {
  compareValue(failures, context, "sourceCommit", json.sourceCommit, expected.sourceCommit);
  compareValue(failures, context, "sourceTag", json.sourceTag, expected.sourceTag);
  compareValue(failures, context, "docsTag", json.docsTag, expected.docsTag);
  compareValue(failures, context, "artifactTag", json.artifactTag, expected.artifactTag);
  compareValue(failures, context, "artifactTag", json.sealedArtifactTag, expected.artifactTag);
  compareValue(failures, context, "artifactBundlePath", json.artifactBundlePath, expected.artifactBundlePath);
  compareValue(failures, context, "bundlePath", json.bundlePath, expected.artifactBundlePath);

  const validation = json.expectedValidation || json.validation || json;
  for (const field of ["tests", "pass", "fail", "cancelled"]) {
    if (validation[field] !== undefined && Number(validation[field]) !== Number(expected.validation[field])) {
      failures.push(`${context}: validation ${field} is ${validation[field]}, expected ${expected.validation[field]}`);
    }
  }
}

function validateReleaseIdentifiers(content, context, expected, failures) {
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) {
    try {
      compareJsonFields(JSON.parse(trimmed), context, expected, failures);
      return;
    } catch (error) {
      failures.push(`${context}: JSON parse failed while scanning release identifiers: ${error.message}`);
      return;
    }
  }
  validateReleaseText(content, context, expected, failures);
}

function readPnpTarget(sourceDir, ref, targetPath, failures, context) {
  const content = gitOutputOrFailure(
    failures,
    context,
    sourceDir,
    ["show", `${ref}:${targetPath}`]
  );
  return content;
}

export function validateAuditTargets(options = {}) {
  const root = options.root || process.cwd();
  const targetsPath = path.resolve(root, options.targetsPath || DEFAULT_TARGETS);
  const releaseManifestPath = path.resolve(root, options.releaseManifestPath || DEFAULT_RELEASE_MANIFEST);
  const sourceDir = path.resolve(root, options.sourceDir || process.env.PNP_SOURCE_DIR || DEFAULT_SOURCE_DIR);
  const requireSource = Boolean(options.requireSource);

  const targetManifest = readJson(targetsPath);
  const releaseManifest = readJson(releaseManifestPath);
  const expected = expectedFromReleaseManifest(releaseManifest);
  const failures = [];
  const result = {
    skipped: false,
    sourceDir,
    checkedTargets: 0,
    scannedReleaseDocuments: 0,
    refs: {}
  };

  validateTargetClasses(targetManifest.targets || [], targetManifest.refs || {}, failures);

  for (const target of targetManifest.targets || []) {
    if (target.refClass !== "publicCheckout") continue;
    const localPath = path.resolve(root, target.path);
    if (!existsSync(localPath)) {
      failures.push(`${target.id}: missing public-review file ${target.path}`);
      continue;
    }
    result.checkedTargets += 1;
    if (target.scanReleaseIdentifiers) {
      validateReleaseIdentifiers(
        readFileSync(localPath, "utf8"),
        `${target.id} ${target.path}`,
        expected,
        failures
      );
      result.scannedReleaseDocuments += 1;
    }
  }

  if (failures.length > 0) {
    throw new AuditTargetValidationError(failures, result);
  }

  if (!existsSync(path.join(sourceDir, ".git"))) {
    const message = `cross-repo target check skipped: ${sourceDir} is not a git checkout`;
    if (requireSource) {
      throw new AuditTargetValidationError([message], result);
    }
    return { ...result, skipped: true, skipReason: message };
  }

  const refsToCheck = new Set(
    (targetManifest.targets || [])
      .filter((target) => target.refClass !== "publicCheckout")
      .map((target) => target.refClass)
  );

  for (const refClass of refsToCheck) {
    const refInfo = targetManifest.refs?.[refClass];
    if (!refInfo) continue;
    const tagObject = gitOutputOrFailure(failures, `${refClass} ${refInfo.ref}`, sourceDir, ["rev-parse", refInfo.ref]);
    const commit = gitOutputOrFailure(
      failures,
      `${refClass} ${refInfo.ref}`,
      sourceDir,
      ["rev-parse", `${refInfo.ref}^{commit}`]
    );
    if (tagObject && commit) {
      result.refs[refClass] = {
        ref: refInfo.ref,
        tagObject,
        commit
      };
      if (refInfo.expectedCommit && commit !== refInfo.expectedCommit) {
        failures.push(`${refClass}: ${refInfo.ref} resolves to ${commit}, expected ${refInfo.expectedCommit}`);
      }
    }
  }

  for (const target of targetManifest.targets || []) {
    if (target.refClass === "publicCheckout") continue;
    const refInfo = targetManifest.refs[target.refClass];
    const context = `${target.id} ${refInfo.ref}:${target.path}`;
    const exists = runGit(sourceDir, ["cat-file", "-e", `${refInfo.ref}:${target.path}`]);
    if (!exists.ok) {
      failures.push(`${target.id}: missing path ${refInfo.ref}:${target.path}`);
      continue;
    }
    result.checkedTargets += 1;
    if (target.scanReleaseIdentifiers) {
      const content = readPnpTarget(sourceDir, refInfo.ref, target.path, failures, context);
      if (content !== null) {
        validateReleaseIdentifiers(content, context, expected, failures);
        result.scannedReleaseDocuments += 1;
      }
    }
  }

  if (failures.length > 0) {
    throw new AuditTargetValidationError(failures, result);
  }

  return result;
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--targets") {
      options.targetsPath = argv[index + 1];
      index += 1;
    } else if (arg === "--release-manifest") {
      options.releaseManifestPath = argv[index + 1];
      index += 1;
    } else if (arg === "--source-dir") {
      options.sourceDir = argv[index + 1];
      index += 1;
    } else if (arg === "--require-source") {
      options.requireSource = true;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return options;
}

function main() {
  let result;
  try {
    result = validateAuditTargets(parseArgs(process.argv.slice(2)));
  } catch (error) {
    if (error instanceof AuditTargetValidationError) {
      for (const failure of error.failures) {
        console.error(`FAIL ${failure}`);
      }
      process.exit(1);
    }
    console.error(error.stack || String(error));
    process.exit(2);
  }

  if (result.skipped) {
    console.log(`SKIP ${result.skipReason}`);
    return;
  }

  for (const [refClass, info] of Object.entries(result.refs)) {
    console.log(`ok ${refClass} ${info.ref} tag=${info.tagObject} commit=${info.commit}`);
  }
  console.log(
    `checked ${result.checkedTargets} audit target(s); scanned ${result.scannedReleaseDocuments} release document(s)`
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
