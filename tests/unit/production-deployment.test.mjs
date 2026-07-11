import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStaticServer } from "../../server.mjs";
import {
  ProductionDeploymentError,
  checkProductionDeployment,
  contentTypeForPath,
  normalizeBaseUrl,
  parseArguments,
  readBoundedBody
} from "../../tools/check-production-deployment.mjs";
import { generateDeploymentProvenance } from "../../tools/deployment-provenance.mjs";
import {
  PUBLIC_DIRECTORY_PATHS,
  PUBLIC_EXACT_PATHS,
  PUBLIC_ROOT_PATHS
} from "../../public-surface.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SITE_COMMIT = "a".repeat(40);
const SITE_TREE = "b".repeat(40);

async function copyPublicFixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "pnplabs-production-check-"));
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
  await generateDeploymentProvenance({
    root,
    siteCommit: SITE_COMMIT,
    siteTree: SITE_TREE,
    deployedAtUtc: "2026-07-11T12:00:00Z",
    releaseId: "20260711T120000Z-aaaaaaaa",
    npmTestPassed: true,
    write: true
  });
  return root;
}

async function startFixtureServer(t, root) {
  const server = createStaticServer({ root });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => server.close());
  const { port } = server.address();
  return `http://127.0.0.1:${port}`;
}

test("production checker accepts exact bytes, provenance, headers, and routes from the real server", async (t) => {
  const root = await copyPublicFixture(t);
  const baseUrl = await startFixtureServer(t, root);
  const result = await checkProductionDeployment({
    root,
    baseUrl,
    expectedSiteCommit: SITE_COMMIT,
    expectedSiteTree: SITE_TREE,
    testOnlySkipGitIdentity: true
  });

  assert.equal(result.status, "production-deployment-current");
  assert.equal(result.publicFileCount > 40, true);
  assert.equal(result.checked, result.publicFileCount + 18);
  assert.equal(result.expectedSiteCommit, SITE_COMMIT);
  assert.equal(result.expectedSiteTree, SITE_TREE);
});

test("production checker aggregates exact remote byte drift diagnostics", async (t) => {
  const localRoot = await copyPublicFixture(t);
  const remoteRoot = await copyPublicFixture(t);
  await writeFile(path.join(remoteRoot, "public", "pnp-status.json"), "{\"stale\":true}\n");
  const baseUrl = await startFixtureServer(t, remoteRoot);

  await assert.rejects(
    checkProductionDeployment({
      root: localRoot,
      baseUrl,
      expectedSiteCommit: SITE_COMMIT,
      expectedSiteTree: SITE_TREE,
      testOnlySkipGitIdentity: true
    }),
    (error) => {
      assert.ok(error instanceof ProductionDeploymentError);
      const finding = error.failures.find((entry) => entry.includes("/public/pnp-status.json: bytes drifted"));
      assert.match(finding, /local \d+ bytes sha256=[0-9a-f]{64}, remote \d+ bytes sha256=[0-9a-f]{64}/);
      return true;
    }
  );
});

test("production checker rejects missing policy headers, wrong MIME, and route non-redirects", async (t) => {
  const root = await copyPublicFixture(t);
  const baseUrl = await startFixtureServer(t, root);

  const alteredFetch = async (url, options) => {
    const response = await fetch(url, options);
    let body = await response.arrayBuffer();
    const headers = new Headers(response.headers);
    const pathname = new URL(url).pathname;
    let status = response.status;
    if (pathname === "/status.html") {
      headers.delete("content-security-policy");
      headers.set("content-type", "application/octet-stream");
    }
    if (pathname === "/status") status = 200;
    if (pathname === "/") body = Buffer.from("stale homepage\n");
    return new Response(body, { status, headers });
  };

  await assert.rejects(
    checkProductionDeployment({
      root,
      baseUrl,
      fetchImpl: alteredFetch,
      expectedSiteCommit: SITE_COMMIT,
      expectedSiteTree: SITE_TREE,
      testOnlySkipGitIdentity: true
    }),
    (error) => {
      assert.ok(error instanceof ProductionDeploymentError);
      assert.ok(error.failures.some((entry) => entry.includes("/status.html: Content-Security-Policy")));
      assert.ok(error.failures.some((entry) => entry.includes("/status.html: Content-Type")));
      assert.ok(error.failures.some((entry) => entry.includes("/status: expected HTTP 308")));
      assert.ok(error.failures.some((entry) => entry.includes("/: bytes drifted")));
      return true;
    }
  );
});

test("production checker CLI parsing rejects ambiguous or unsafe base URLs", () => {
  assert.equal(normalizeBaseUrl("https://pnplabs.com.au/"), "https://pnplabs.com.au");
  assert.throws(() => normalizeBaseUrl("ftp://pnplabs.com.au"), /HTTP or HTTPS/);
  assert.throws(() => normalizeBaseUrl("https://user:secret@pnplabs.com.au"), /credentials/);
  assert.throws(() => normalizeBaseUrl("https://pnplabs.com.au/status"), /without a path/);
  assert.throws(() => parseArguments(["--unknown"]), /unknown argument/);
  assert.throws(() => parseArguments(["--timeout-ms", "NaN"]), /timeout/);
  const coordinates = parseArguments([
    "--expected-site-commit",
    SITE_COMMIT,
    "--expected-site-tree",
    SITE_TREE
  ]);
  assert.equal(coordinates.expectedSiteCommit, SITE_COMMIT);
  assert.equal(coordinates.expectedSiteTree, SITE_TREE);
  assert.throws(
    () => parseArguments(["--expected-site-commit", SITE_COMMIT]),
    /must be supplied together/
  );
  assert.throws(
    () => parseArguments(["--expected-site-commit", "not-a-sha", "--expected-site-tree", SITE_TREE]),
    /lowercase 40-hex/
  );
  assert.deepEqual(contentTypeForPath("/downloads/archive.zip"), ["application/zip"]);
});

test("production checker cancels response bodies that exceed their explicit limit", async () => {
  const declaredOversize = new Response("small", { headers: { "Content-Length": "999999" } });
  await assert.rejects(readBoundedBody(declaredOversize, 128, "/oversize"), /exceeds 128 byte limit/);

  const streamedOversize = new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(80));
      controller.enqueue(new Uint8Array(80));
      controller.close();
    }
  }));
  await assert.rejects(readBoundedBody(streamedOversize, 128, "/oversize"), /exceeds 128 byte limit/);
});
