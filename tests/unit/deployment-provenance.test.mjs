import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { once } from "node:events";
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CONTENT_MANIFEST_PATH,
  PROVENANCE_PATH,
  assertCleanGit,
  assertManifestMatchesGit,
  createContentManifest,
  generateDeploymentProvenance,
  verifyDeploymentProvenance
} from "../../tools/deployment-provenance.mjs";
import {
  PUBLIC_DIRECTORY_PATHS,
  PUBLIC_EXACT_PATHS,
  PUBLIC_ROOT_PATHS
} from "../../public-surface.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SITE_COMMIT = "a".repeat(40);
const SITE_TREE = "b".repeat(40);

async function copyPublicFixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "pnplabs-deployment-provenance-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const relativePath of PUBLIC_ROOT_PATHS) {
    await cp(path.join(repositoryRoot, relativePath), path.join(root, relativePath));
  }
  for (const relativePath of PUBLIC_EXACT_PATHS) {
    await mkdir(path.dirname(path.join(root, relativePath)), { recursive: true });
    await cp(path.join(repositoryRoot, relativePath), path.join(root, relativePath));
  }
  for (const relativePath of PUBLIC_DIRECTORY_PATHS) {
    await cp(path.join(repositoryRoot, relativePath), path.join(root, relativePath), { recursive: true });
  }
  return root;
}

async function generate(root) {
  return generateDeploymentProvenance({
    root,
    siteCommit: SITE_COMMIT,
    siteTree: SITE_TREE,
    deployedAtUtc: "2026-07-11T12:00:00Z",
    releaseId: "20260711T120000Z-aaaaaaaa",
    npmTestPassed: true,
    write: true
  });
}

test("deployment provenance deterministically binds the complete public surface without self-inclusion", async (t) => {
  const root = await copyPublicFixture(t);
  const generated = await generate(root);
  const verified = await verifyDeploymentProvenance({
    root,
    expectedSiteCommit: SITE_COMMIT,
    expectedSiteTree: SITE_TREE
  });

  assert.deepEqual(verified.contentManifest, generated.contentManifest);
  assert.equal(verified.provenance.siteSource.commit, SITE_COMMIT);
  assert.equal(verified.provenance.siteSource.tree, SITE_TREE);
  assert.equal(verified.provenance.checks.npmTestPassed, true);
  assert.equal(verified.provenance.checks.releaseSealPassed, true);
  assert.equal(verified.provenance.scope, "deployment and file identity only; not theorem validation");
  assert.ok(!verified.contentManifest.files.some((entry) => [CONTENT_MANIFEST_PATH, PROVENANCE_PATH].includes(entry.path)));

  const firstBytes = await readFile(path.join(root, CONTENT_MANIFEST_PATH));
  const regenerated = await createContentManifest(root);
  assert.deepEqual(regenerated, generated.contentManifest);
  assert.deepEqual(firstBytes, generated.contentBuffer);
});

test("deployment provenance rejects public-byte drift and mismatched expected identity", async (t) => {
  const root = await copyPublicFixture(t);
  await generate(root);
  await writeFile(path.join(root, "status.html"), "drift\n");

  await assert.rejects(
    verifyDeploymentProvenance({ root, expectedSiteCommit: SITE_COMMIT, expectedSiteTree: SITE_TREE }),
    /content manifest does not match current public bytes/
  );

  await generate(root);
  await assert.rejects(
    verifyDeploymentProvenance({ root, expectedSiteCommit: "c".repeat(40), expectedSiteTree: SITE_TREE }),
    /site commit .* does not match/
  );
});

test("deployment manifest rejects symlinks anywhere on the public surface", async (t) => {
  const root = await copyPublicFixture(t);
  await symlink("../status.html", path.join(root, "public", "status-link.html"));
  await assert.rejects(createContentManifest(root), /symbolic link/);
});

test("deployment identity refuses a dirty Git working tree", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "pnplabs-deployment-git-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = (...args) => spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  assert.equal(git("init", "--quiet").status, 0);
  assert.equal(git("config", "user.name", "PNPLabs test").status, 0);
  assert.equal(git("config", "user.email", "test@pnplabs.invalid").status, 0);
  await writeFile(path.join(root, "tracked.txt"), "clean\n");
  assert.equal(git("add", "tracked.txt").status, 0);
  assert.equal(git("commit", "--quiet", "-m", "fixture").status, 0);
  assert.doesNotThrow(() => assertCleanGit(root));
  await writeFile(path.join(root, "tracked.txt"), "dirty\n");
  assert.throws(() => assertCleanGit(root), /must be clean/);
});

test("deployment manifest refuses ignored public files outside the Git tree", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "pnplabs-deployment-git-surface-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = (...args) => spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  assert.equal(git("init", "--quiet").status, 0);
  assert.equal(git("config", "user.name", "PNPLabs test").status, 0);
  assert.equal(git("config", "user.email", "test@pnplabs.invalid").status, 0);
  await mkdir(path.join(root, "public"));
  await writeFile(path.join(root, ".gitignore"), "public/ignored.json\n");
  await writeFile(path.join(root, "public", "tracked.json"), "{}\n");
  assert.equal(git("add", ".gitignore", "public/tracked.json").status, 0);
  assert.equal(git("commit", "--quiet", "-m", "fixture").status, 0);

  const trackedManifest = { files: [{ path: "public/tracked.json" }] };
  assert.doesNotThrow(() => assertManifestMatchesGit(root, trackedManifest));
  await writeFile(path.join(root, "public", "ignored.json"), "{}\n");
  const unsafeManifest = {
    files: [
      { path: "public/ignored.json" },
      { path: "public/tracked.json" }
    ]
  };
  assert.throws(() => assertManifestMatchesGit(root, unsafeManifest), /untracked or ignored files/);
});
