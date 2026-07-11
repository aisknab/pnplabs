#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  EXTENSIONLESS_REDIRECTS,
  SECURITY_HEADERS,
  cacheControlForPath
} from "../public-surface.mjs";
import {
  CONTENT_MANIFEST_PATH,
  PROVENANCE_PATH,
  assertCleanGit,
  assertManifestMatchesGit,
  createContentManifest,
  gitIdentity,
  readSafeRegularFile,
  serializeJson,
  sha256,
  validateContentManifest,
  validateProvenanceRecord
} from "./deployment-provenance.mjs";
import { verifyReleaseSeal } from "./verify-release-seal.mjs";

const DEFAULT_BASE_URL = "https://pnplabs.com.au";
const RELEASE_MANIFEST_PATH = "downloads/formal-publication-release.json";

const MIME_TYPES = Object.freeze({
  ".css": ["text/css"],
  ".html": ["text/html"],
  ".ico": ["image/x-icon", "image/vnd.microsoft.icon"],
  ".jpeg": ["image/jpeg"],
  ".jpg": ["image/jpeg"],
  ".js": ["application/javascript", "text/javascript"],
  ".json": ["application/json", "text/json"],
  ".pdf": ["application/pdf"],
  ".png": ["image/png"],
  ".svg": ["image/svg+xml"],
  ".tex": ["text/plain", "text/x-tex", "application/x-tex"],
  ".txt": ["text/plain"],
  ".webmanifest": ["application/manifest+json", "application/json"],
  ".webp": ["image/webp"],
  ".xml": ["application/xml", "text/xml"],
  ".zip": ["application/zip"]
});

const DENIED_PROBES = Object.freeze({
  "/.git/config": 403,
  "/Status": 404,
  "/_headers": 403,
  "/not-a-public-file": 404,
  "/package.json": 403,
  "/public/..%5Cserver.mjs": 403,
  "/report.html": 404,
  "/server.mjs": 403,
  "/status/": 404
});

class ProductionDeploymentError extends Error {
  constructor(failures, partialResult) {
    super(`production deployment check failed (${failures.length} finding${failures.length === 1 ? "" : "s"})`);
    this.name = "ProductionDeploymentError";
    this.failures = failures;
    this.partialResult = partialResult;
  }
}

function fail(message) {
  throw new Error(message);
}

function normalizeBaseUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    fail("base URL must be an absolute HTTP(S) URL");
  }
  if (!/^https?:$/.test(parsed.protocol)) fail("base URL must use HTTP or HTTPS");
  if (parsed.username || parsed.password) fail("base URL must not contain credentials");
  if (parsed.search || parsed.hash || parsed.pathname !== "/") {
    fail("base URL must be an origin without a path, query, or fragment");
  }
  return parsed.origin;
}

function contentTypeForPath(relativePath) {
  if (relativePath === "/") return ["text/html"];
  if (path.posix.basename(relativePath) === "SHA256SUMS") return ["text/plain"];
  if (path.posix.basename(relativePath) === "CNAME") return ["application/octet-stream", "text/plain"];
  return MIME_TYPES[path.posix.extname(relativePath).toLowerCase()] || ["application/octet-stream"];
}

function responseMediaType(response) {
  return (response.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
}

function inspectHeaders(response, urlPath, failures, { checkContentType = true } = {}) {
  for (const [name, expected] of Object.entries(SECURITY_HEADERS)) {
    const actual = response.headers.get(name);
    if (actual !== expected) failures.push(`${urlPath}: ${name} ${JSON.stringify(actual)} does not match ${JSON.stringify(expected)}`);
  }
  const expectedCache = cacheControlForPath(urlPath);
  const actualCache = response.headers.get("cache-control");
  if (actualCache !== expectedCache) {
    failures.push(`${urlPath}: Cache-Control ${JSON.stringify(actualCache)} does not match ${JSON.stringify(expectedCache)}`);
  }
  if (checkContentType) {
    const expectedTypes = contentTypeForPath(urlPath);
    const actualType = responseMediaType(response);
    if (!expectedTypes.includes(actualType)) {
      failures.push(`${urlPath}: Content-Type ${JSON.stringify(actualType)} is not one of ${expectedTypes.join(", ")}`);
    }
  }
}

async function fetchResponse(fetchImpl, baseUrl, urlPath, timeoutMs, method = "GET") {
  return fetchImpl(`${baseUrl}${urlPath}`, {
    method,
    redirect: "manual",
    headers: {
      "Accept-Encoding": "identity",
      "Cache-Control": "no-cache"
    },
    signal: AbortSignal.timeout(timeoutMs)
  });
}

function bodyLimitForExpected(expectedBytes) {
  return expectedBytes + Math.min(Math.max(expectedBytes, 64 * 1024), 1024 * 1024);
}

async function readBoundedBody(response, maxBytes, label) {
  const lengthHeader = response.headers.get("content-length");
  if (lengthHeader && /^\d+$/.test(lengthHeader) && Number(lengthHeader) > maxBytes) {
    await response.body?.cancel();
    throw new Error(`response exceeds ${maxBytes} byte limit (Content-Length ${lengthHeader})`);
  }
  if (!response.body) return Buffer.alloc(0);

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = Buffer.from(value);
      total += chunk.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new Error(`response exceeds ${maxBytes} byte limit`);
      }
      chunks.push(chunk);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, total);
}

async function inspectFile({
  fetchImpl,
  baseUrl,
  urlPath,
  expectedBuffer,
  timeoutMs,
  failures
}) {
  let response;
  try {
    response = await fetchResponse(fetchImpl, baseUrl, urlPath, timeoutMs);
  } catch (error) {
    failures.push(`${urlPath}: request failed: ${error.message}`);
    return null;
  }
  if (response.status !== 200) failures.push(`${urlPath}: expected HTTP 200, received ${response.status}`);
  inspectHeaders(response, urlPath, failures);
  let actualBuffer;
  try {
    actualBuffer = await readBoundedBody(response, bodyLimitForExpected(expectedBuffer.byteLength), urlPath);
  } catch (error) {
    failures.push(`${urlPath}: response body failed: ${error.message}`);
    return null;
  }
  if (!actualBuffer.equals(expectedBuffer)) {
    failures.push(
      `${urlPath}: bytes drifted; local ${expectedBuffer.byteLength} bytes sha256=${sha256(expectedBuffer)}, `
      + `remote ${actualBuffer.byteLength} bytes sha256=${sha256(actualBuffer)}`
    );
  }
  return { response, buffer: actualBuffer };
}

async function mapWithConcurrency(values, limit, operation) {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      await operation(values[index], index);
    }
  });
  await Promise.all(workers);
}

async function checkProductionDeployment({
  root = process.cwd(),
  baseUrl = DEFAULT_BASE_URL,
  fetchImpl = globalThis.fetch,
  timeoutMs = 15_000,
  expectedSiteCommit,
  expectedSiteTree,
  concurrency = 6,
  testOnlySkipGitIdentity = false
} = {}) {
  if (typeof fetchImpl !== "function") fail("a fetch implementation is required");
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 120_000) {
    fail("timeout must be an integer from 100 to 120000 milliseconds");
  }
  if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 32) {
    fail("concurrency must be an integer from 1 to 32");
  }
  if ((expectedSiteCommit === undefined) !== (expectedSiteTree === undefined)) {
    fail("expected site commit and tree must be supplied together");
  }
  const rootPath = path.resolve(root);
  const origin = normalizeBaseUrl(baseUrl);
  verifyReleaseSeal({ root: rootPath });
  const identity = testOnlySkipGitIdentity
    ? { commit: expectedSiteCommit, tree: expectedSiteTree }
    : gitIdentity(rootPath);
  if (!testOnlySkipGitIdentity) assertCleanGit(rootPath);
  if (!/^[0-9a-f]{40}$/.test(identity.commit) || !/^[0-9a-f]{40}$/.test(identity.tree)) {
    fail("expected site commit and tree must be lowercase 40-hex Git object IDs");
  }
  if (!testOnlySkipGitIdentity && expectedSiteCommit && expectedSiteCommit !== identity.commit) {
    fail(`expected site commit ${expectedSiteCommit} does not match checked-out commit ${identity.commit}`);
  }
  if (!testOnlySkipGitIdentity && expectedSiteTree && expectedSiteTree !== identity.tree) {
    fail(`expected site tree ${expectedSiteTree} does not match checked-out tree ${identity.tree}`);
  }

  const localManifest = validateContentManifest(await createContentManifest(rootPath));
  if (!testOnlySkipGitIdentity) assertManifestMatchesGit(rootPath, localManifest);
  const localManifestBuffer = serializeJson(localManifest);
  const releaseBuffer = await readSafeRegularFile(rootPath, RELEASE_MANIFEST_PATH);
  const release = JSON.parse(releaseBuffer.toString("utf8"));
  const failures = [];
  let checked = 0;
  let bytes = 0;

  const runtimeResults = new Map();
  for (const relativePath of [CONTENT_MANIFEST_PATH, PROVENANCE_PATH]) {
    const urlPath = `/${relativePath}`;
    const expectedBuffer = relativePath === CONTENT_MANIFEST_PATH ? localManifestBuffer : Buffer.alloc(0);
    let response;
    try {
      response = await fetchResponse(fetchImpl, origin, urlPath, timeoutMs);
    } catch (error) {
      failures.push(`${urlPath}: request failed: ${error.message}`);
      continue;
    }
    checked += 1;
    if (response.status !== 200) failures.push(`${urlPath}: expected HTTP 200, received ${response.status}`);
    inspectHeaders(response, urlPath, failures);
    let buffer;
    try {
      const maxBytes = relativePath === CONTENT_MANIFEST_PATH
        ? bodyLimitForExpected(localManifestBuffer.byteLength)
        : 256 * 1024;
      buffer = await readBoundedBody(response, maxBytes, urlPath);
      bytes += buffer.byteLength;
      runtimeResults.set(relativePath, buffer);
      if (relativePath === CONTENT_MANIFEST_PATH && !buffer.equals(expectedBuffer)) {
        failures.push(
          `${urlPath}: bytes drifted; local ${expectedBuffer.byteLength} bytes sha256=${sha256(expectedBuffer)}, `
          + `remote ${buffer.byteLength} bytes sha256=${sha256(buffer)}`
        );
      }
    } catch (error) {
      failures.push(`${urlPath}: response body failed: ${error.message}`);
    }
  }

  const remoteManifestBuffer = runtimeResults.get(CONTENT_MANIFEST_PATH);
  if (remoteManifestBuffer) {
    try {
      validateContentManifest(JSON.parse(remoteManifestBuffer.toString("utf8")));
    } catch (error) {
      failures.push(`/${CONTENT_MANIFEST_PATH}: ${error.message}`);
    }
  }

  const remoteProvenanceBuffer = runtimeResults.get(PROVENANCE_PATH);
  if (remoteProvenanceBuffer) {
    try {
      const provenance = validateProvenanceRecord(JSON.parse(remoteProvenanceBuffer.toString("utf8")));
      if (provenance.siteSource.commit !== identity.commit) {
        failures.push(`/${PROVENANCE_PATH}: deployed commit ${provenance.siteSource.commit} does not match ${identity.commit}`);
      }
      if (provenance.siteSource.tree !== identity.tree) {
        failures.push(`/${PROVENANCE_PATH}: deployed tree ${provenance.siteSource.tree} does not match ${identity.tree}`);
      }
      if (provenance.servedContent.manifestSha256 !== sha256(localManifestBuffer)) {
        failures.push(`/${PROVENANCE_PATH}: content-manifest digest does not match local public bytes`);
      }
      if (provenance.proofPublication.releaseManifestSha256 !== sha256(releaseBuffer)
        || provenance.proofPublication.commit !== release.source?.commit
        || provenance.proofPublication.tree !== release.source?.tree) {
        failures.push(`/${PROVENANCE_PATH}: proof-publication identity does not match local release metadata`);
      }
    } catch (error) {
      failures.push(`/${PROVENANCE_PATH}: ${error.message}`);
    }
  }

  await mapWithConcurrency(localManifest.files, concurrency, async (entry) => {
    const expectedBuffer = await readSafeRegularFile(rootPath, entry.path);
    if (expectedBuffer.byteLength !== entry.bytes || sha256(expectedBuffer) !== entry.sha256) {
      failures.push(`/${entry.path}: local public bytes changed after manifest construction`);
    }
    const result = await inspectFile({
      fetchImpl,
      baseUrl: origin,
      urlPath: `/${entry.path}`,
      expectedBuffer,
      timeoutMs,
      failures
    });
    checked += 1;
    if (result) bytes += result.buffer.byteLength;
  });

  const indexBuffer = await readSafeRegularFile(rootPath, "index.html");
  const rootResult = await inspectFile({
    fetchImpl,
    baseUrl: origin,
    urlPath: "/",
    expectedBuffer: indexBuffer,
    timeoutMs,
    failures
  });
  checked += 1;
  if (rootResult) bytes += rootResult.buffer.byteLength;

  for (const [alias, canonical] of Object.entries(EXTENSIONLESS_REDIRECTS)) {
    const urlPath = `${alias}?deployment-audit=1`;
    let response;
    try {
      response = await fetchResponse(fetchImpl, origin, urlPath, timeoutMs);
    } catch (error) {
      failures.push(`${alias}: request failed: ${error.message}`);
      continue;
    }
    checked += 1;
    if (response.status !== 308) failures.push(`${alias}: expected HTTP 308, received ${response.status}`);
    if (response.headers.get("location") !== `${canonical}?deployment-audit=1`) {
      failures.push(`${alias}: Location ${JSON.stringify(response.headers.get("location"))} does not match ${canonical}?deployment-audit=1`);
    }
    inspectHeaders(response, alias, failures, { checkContentType: false });
    try {
      bytes += (await readBoundedBody(response, 64 * 1024, alias)).byteLength;
    } catch (error) {
      failures.push(`${alias}: response body failed: ${error.message}`);
    }
  }

  for (const [urlPath, expectedStatus] of Object.entries(DENIED_PROBES)) {
    let response;
    try {
      response = await fetchResponse(fetchImpl, origin, urlPath, timeoutMs);
    } catch (error) {
      failures.push(`${urlPath}: request failed: ${error.message}`);
      continue;
    }
    checked += 1;
    if (response.status !== expectedStatus) {
      failures.push(`${urlPath}: expected HTTP ${expectedStatus}, received ${response.status}`);
    }
    inspectHeaders(response, urlPath, failures, { checkContentType: false });
    try {
      bytes += (await readBoundedBody(response, 64 * 1024, urlPath)).byteLength;
    } catch (error) {
      failures.push(`${urlPath}: response body failed: ${error.message}`);
    }
  }

  for (const method of ["HEAD", "POST"]) {
    const urlPath = method === "HEAD" ? "/status?deployment-audit=1" : "/status";
    let response;
    try {
      response = await fetchResponse(fetchImpl, origin, urlPath, timeoutMs, method);
    } catch (error) {
      failures.push(`${method} /status: request failed: ${error.message}`);
      continue;
    }
    checked += 1;
    const expectedStatus = method === "HEAD" ? 308 : 405;
    if (response.status !== expectedStatus) {
      failures.push(`${method} /status: expected HTTP ${expectedStatus}, received ${response.status}`);
    }
    if (method === "HEAD" && response.headers.get("location") !== "/status.html?deployment-audit=1") {
      failures.push(`HEAD /status: redirect location drifted`);
    }
    if (method === "POST" && response.headers.get("allow") !== "GET, HEAD") {
      failures.push(`POST /status: Allow header drifted`);
    }
    inspectHeaders(response, "/status", failures, { checkContentType: false });
    try {
      bytes += (await readBoundedBody(response, 64 * 1024, `${method} /status`)).byteLength;
    } catch (error) {
      failures.push(`${method} /status: response body failed: ${error.message}`);
    }
  }

  const result = {
    status: failures.length === 0 ? "production-deployment-current" : "production-deployment-drifted",
    baseUrl: origin,
    expectedSiteCommit: identity.commit,
    expectedSiteTree: identity.tree,
    checked,
    bytes,
    publicFileCount: localManifest.files.length
  };
  if (failures.length > 0) throw new ProductionDeploymentError(failures.sort(), result);
  return result;
}

function parseArguments(argv) {
  const options = {
    root: process.cwd(),
    baseUrl: DEFAULT_BASE_URL,
    timeoutMs: 15_000,
    json: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if ([
      "--root",
      "--base-url",
      "--timeout-ms",
      "--expected-site-commit",
      "--expected-site-tree"
    ].includes(argument)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) fail(`${argument}: expected a value`);
      index += 1;
      if (argument === "--root") options.root = value;
      if (argument === "--base-url") options.baseUrl = value;
      if (argument === "--timeout-ms") options.timeoutMs = Number(value);
      if (argument === "--expected-site-commit") options.expectedSiteCommit = value;
      if (argument === "--expected-site-tree") options.expectedSiteTree = value;
    } else if (argument === "--json") {
      options.json = true;
    } else {
      fail(`unknown argument: ${argument}`);
    }
  }
  normalizeBaseUrl(options.baseUrl);
  if (!Number.isSafeInteger(options.timeoutMs)
    || options.timeoutMs < 100
    || options.timeoutMs > 120_000) {
    fail("timeout must be an integer from 100 to 120000 milliseconds");
  }
  if ((options.expectedSiteCommit === undefined) !== (options.expectedSiteTree === undefined)) {
    fail("expected site commit and tree must be supplied together");
  }
  for (const [label, value] of [
    ["expected site commit", options.expectedSiteCommit],
    ["expected site tree", options.expectedSiteTree]
  ]) {
    if (value !== undefined && !/^[0-9a-f]{40}$/.test(value)) {
      fail(`${label} must be a lowercase 40-hex Git object ID`);
    }
  }
  return options;
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  try {
    const result = await checkProductionDeployment(options);
    process.stdout.write(options.json ? `${JSON.stringify(result)}\n` : `${result.status}: ${result.checked} responses, ${result.bytes} bytes\n`);
    return result;
  } catch (error) {
    if (error instanceof ProductionDeploymentError) {
      if (options.json) {
        process.stderr.write(`${JSON.stringify({ ...error.partialResult, failures: error.failures })}\n`);
      } else {
        process.stderr.write(`${error.message}\n${error.failures.map((entry) => `- ${entry}`).join("\n")}\n`);
      }
    }
    throw error;
  }
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  main().catch((error) => {
    if (!(error instanceof ProductionDeploymentError)) console.error(error.message);
    process.exitCode = 1;
  });
}

export {
  DEFAULT_BASE_URL,
  ProductionDeploymentError,
  checkProductionDeployment,
  contentTypeForPath,
  readBoundedBody,
  main,
  normalizeBaseUrl,
  parseArguments
};
