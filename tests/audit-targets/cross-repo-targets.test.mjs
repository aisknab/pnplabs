import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  AuditTargetValidationError,
  validateAuditTargets
} from "../../tools/check-cross-repo-targets.mjs";

const SOURCE_TAG = "final-pnp-proof-report-hardened-7072f8d";
const DOCS_TAG = "final-pnp-proof-report-docs-hardened-7072f8d-sealed";
const ARTIFACT_TAG = "final-pnp-proof-report-artifacts-hardened-7072f8d-sealed";
const BUNDLE = "proof-artifacts/final-pnp-proof-report-hardened-7072f8d";

function git(cwd, args) {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function write(root, relativePath, text) {
  const filePath = path.join(root, relativePath);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text);
}

function releaseManifest(sourceCommit) {
  return {
    kind: "PNPSourceCheckerReleaseReference",
    version: 1,
    sourceRepo: "aisknab/pnp",
    sourceTag: SOURCE_TAG,
    sourceCommit,
    artifactTag: ARTIFACT_TAG,
    docsTag: DOCS_TAG,
    artifactBundlePath: `${BUNDLE}/`,
    expectedValidation: {
      tests: 1121,
      pass: 1121,
      fail: 0,
      cancelled: 0
    }
  };
}

function releaseText(sourceCommit, stale = false) {
  return stale
    ? [
        "source commit: 8b45da4ed604a709d244c35acb886c5eee0889cd",
        "source tag: final-pnp-proof-report-hardened-8b45da4",
        "sealed artifact tag: final-pnp-proof-report-artifacts-hardened-8b45da4-sealed",
        "bundle path:",
        "proof-artifacts/final-pnp-proof-report-hardened-8b45da4/",
        "tests 1043",
        "pass 1043",
        "fail 0",
        "cancelled 0"
      ].join("\n")
    : [
        `source commit: ${sourceCommit}`,
        `source tag: ${SOURCE_TAG}`,
        `sealed artifact tag: ${ARTIFACT_TAG}`,
        "bundle path:",
        `${BUNDLE}/`,
        "tests 1121",
        "pass 1121",
        "fail 0",
        "cancelled 0"
      ].join("\n");
}

function validTargets() {
  return [
    {
      id: "public.release_manifest",
      kind: "pnplabs public-review file",
      refClass: "publicCheckout",
      path: "downloads/source-checker-release.json",
      scanReleaseIdentifiers: true
    },
    {
      id: "source.gpack",
      kind: "source/checker code",
      refClass: "sourceRef",
      path: "pcc-gpack0.mjs"
    },
    {
      id: "docs.reproduce",
      kind: "release documentation",
      refClass: "docsRef",
      path: "REPRODUCE.md",
      scanReleaseIdentifiers: true
    },
    {
      id: "artifact.release_seal",
      kind: "generated artefact",
      refClass: "artifactRef",
      path: `${BUNDLE}/release-seal.json`,
      scanReleaseIdentifiers: true
    }
  ];
}

function makeProject(t, targets, options = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "pnplabs-audit-targets-"));
  const sourceDir = path.join(root, "pnp");
  mkdirSync(sourceDir, { recursive: true });
  git(sourceDir, ["init"]);
  git(sourceDir, ["config", "user.email", "audit@example.invalid"]);
  git(sourceDir, ["config", "user.name", "Audit Test"]);

  write(sourceDir, "pcc-gpack0.mjs", "export const ok = true;\n");
  git(sourceDir, ["add", "."]);
  git(sourceDir, ["commit", "-m", "source"]);
  const sourceCommit = git(sourceDir, ["rev-parse", "HEAD"]);
  git(sourceDir, ["tag", SOURCE_TAG]);

  const manifest = releaseManifest(sourceCommit);
  const text = releaseText(sourceCommit, options.staleReleaseDoc);
  write(sourceDir, "REPRODUCE.md", text);
  write(sourceDir, "REVIEWER_MAP.md", text);
  write(
    sourceDir,
    `${BUNDLE}/release-seal.json`,
    JSON.stringify(
      {
        sourceCommit: manifest.sourceCommit,
        sourceTag: manifest.sourceTag,
        sealedArtifactTag: manifest.artifactTag,
        bundlePath: BUNDLE,
        validation: manifest.expectedValidation
      },
      null,
      2
    )
  );
  git(sourceDir, ["add", "."]);
  git(sourceDir, ["commit", "-m", "docs and artifacts"]);
  const docsCommit = git(sourceDir, ["rev-parse", "HEAD"]);
  git(sourceDir, ["tag", DOCS_TAG]);
  git(sourceDir, ["tag", ARTIFACT_TAG]);

  write(root, "downloads/source-checker-release.json", JSON.stringify(manifest, null, 2));
  write(
    root,
    "audit_targets.json",
    JSON.stringify(
      {
        version: 1,
        refs: {
          sourceRef: {
            ref: SOURCE_TAG,
            expectedCommit: sourceCommit,
            class: "source/checker code"
          },
          docsRef: {
            ref: DOCS_TAG,
            expectedCommit: docsCommit,
            class: "release documentation"
          },
          artifactRef: {
            ref: ARTIFACT_TAG,
            expectedCommit: docsCommit,
            class: "generated artefact"
          },
          publicCheckout: {
            ref: "working tree",
            class: "pnplabs public-review file"
          }
        },
        targets
      },
      null,
      2
    )
  );

  t.after(() => rmSync(root, { recursive: true, force: true }));
  return { root, sourceDir };
}

function runProject(project) {
  return validateAuditTargets({
    root: project.root,
    sourceDir: project.sourceDir,
    targetsPath: "audit_targets.json",
    releaseManifestPath: "downloads/source-checker-release.json",
    requireSource: true
  });
}

function expectFailure(t, targets, pattern, options = {}) {
  const project = makeProject(t, targets, options);
  let error = null;
  try {
    runProject(project);
  } catch (caught) {
    error = caught;
  }
  assert.ok(error instanceof AuditTargetValidationError);
  assert.match(error.failures.join("\n"), pattern);
}

test("valid audit target fixture passes", (t) => {
  const project = makeProject(t, validTargets());
  const result = runProject(project);
  assert.equal(result.skipped, false);
  assert.equal(result.checkedTargets, 4);
});

test("reports an explicit skip when the sibling source checkout is unavailable", (t) => {
  const root = mkdtempSync(path.join(tmpdir(), "pnplabs-audit-targets-missing-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const sourceCommit = "7072f8d0bda6d44d240f9bb3fad624fd357e1278";
  write(root, "downloads/source-checker-release.json", JSON.stringify(releaseManifest(sourceCommit), null, 2));
  write(
    root,
    "audit_targets.json",
    JSON.stringify(
      {
        version: 1,
        refs: {
          sourceRef: {
            ref: SOURCE_TAG,
            expectedCommit: sourceCommit,
            class: "source/checker code"
          },
          publicCheckout: {
            ref: "working tree",
            class: "pnplabs public-review file"
          }
        },
        targets: [
          validTargets()[0],
          {
            id: "source.gpack",
            kind: "source/checker code",
            refClass: "sourceRef",
            path: "pcc-gpack0.mjs"
          }
        ]
      },
      null,
      2
    )
  );

  const result = validateAuditTargets({
    root,
    sourceDir: path.join(root, "missing-pnp"),
    targetsPath: "audit_targets.json",
    releaseManifestPath: "downloads/source-checker-release.json"
  });
  assert.equal(result.skipped, true);
  assert.match(result.skipReason, /cross-repo target check skipped/);
});

test("rejects a source path assigned to docsRef", (t) => {
  const targets = validTargets();
  targets[1] = {
    ...targets[1],
    refClass: "docsRef"
  };
  expectFailure(t, targets, /source\.gpack: source\/checker code must use sourceRef/);
});

test("rejects a docs file assigned to sourceRef", (t) => {
  const targets = validTargets();
  targets[2] = {
    ...targets[2],
    refClass: "sourceRef"
  };
  expectFailure(t, targets, /docs\.reproduce: release documentation must use docsRef/);
});

test("rejects a missing path", (t) => {
  const targets = validTargets();
  targets[1] = {
    ...targets[1],
    path: "missing-source-file.mjs"
  };
  expectFailure(t, targets, /source\.gpack: missing path/);
});

test("rejects a stale release identifier", (t) => {
  expectFailure(
    t,
    validTargets(),
    /docs\.reproduce .*sourceTag token final-pnp-proof-report-hardened-8b45da4/,
    { staleReleaseDoc: true }
  );
});

test("rejects an artefact path assigned to sourceRef", (t) => {
  const targets = validTargets();
  targets[3] = {
    ...targets[3],
    refClass: "sourceRef"
  };
  expectFailure(t, targets, /artifact\.release_seal: generated artefact must use artifactRef/);
});
