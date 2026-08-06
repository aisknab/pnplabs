#!/usr/bin/env node
// Purpose: enforce that the browser report checker is bound to the current seal.
// Inputs: verify.html, the shared browser module, release-seal JSON, and report bytes.
// Outputs: one deterministic fail-closed browser-integrity validation result.
// Invariants enforced: no embedded digest, one configured console, and exact identity.
// Assumptions not checked: theorem correctness or trust in the served origin.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  normalizeArtifactPath,
  verifyArtifactIdentity
} from '../assets/report-integrity.js';

const DEFAULT_SEAL_PATH = 'downloads/release-seal.json';
const DEFAULT_ARTIFACT_PATH = 'downloads/canonical_proof_report.pdf';

class BrowserReportIntegrityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BrowserReportIntegrityError';
  }
}

function fail(message) {
  throw new BrowserReportIntegrityError(message);
}

function readRepositoryFile(root, relativePath, encoding = null) {
  const normalized = normalizeArtifactPath(relativePath);
  const target = path.resolve(root, normalized);
  if (!target.startsWith(`${root}${path.sep}`)) fail(`${relativePath}: path escapes repository root`);
  try {
    return readFileSync(target, encoding === null ? undefined : encoding);
  } catch (error) {
    fail(`${relativePath}: ${error.message}`);
  }
}

function attributeFromTag(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const match = tag.match(new RegExp(`\\s${escapedName}="([^"]*)"`, 'u'));
  return match?.[1] ?? null;
}

function readConsoleConfiguration(html) {
  if (/\bdata-expected\s*=/u.test(html)) {
    fail('verify.html: embedded data-expected digest is forbidden');
  }
  const tags = html.match(/<[^>]+\sdata-seal-console(?:\s|=|>)[^>]*>/gu) || [];
  if (tags.length !== 1) fail(`verify.html: expected one seal console, found ${tags.length}`);
  const sealPath = attributeFromTag(tags[0], 'data-seal');
  const artifactPath = attributeFromTag(tags[0], 'data-artifact');
  if (!sealPath || !artifactPath) fail('verify.html: seal console must name data-seal and data-artifact');
  if (!html.includes('data-seal-expected')) fail('verify.html: expected digest readout is not seal-driven');
  return {
    sealPath: normalizeArtifactPath(sealPath, 'verify.html data-seal'),
    artifactPath: normalizeArtifactPath(artifactPath, 'verify.html data-artifact')
  };
}

function checkBrowserReportIntegrity({ root = process.cwd() } = {}) {
  const rootPath = path.resolve(root);
  const html = readRepositoryFile(rootPath, 'verify.html', 'utf8');
  const main = readRepositoryFile(rootPath, 'assets/main.js', 'utf8');
  const moduleSource = readRepositoryFile(rootPath, 'assets/report-integrity.js', 'utf8');
  if (!main.includes("import('./report-integrity.js')")) {
    fail('assets/main.js: shared report-integrity module is not loaded');
  }
  if (!moduleSource.includes("querySelectorAll('[data-seal-console]')")) {
    fail('assets/report-integrity.js: browser console installer is missing');
  }

  const configuration = readConsoleConfiguration(html);
  if (configuration.sealPath !== DEFAULT_SEAL_PATH) {
    fail(`verify.html: expected data-seal ${DEFAULT_SEAL_PATH}`);
  }
  if (configuration.artifactPath !== DEFAULT_ARTIFACT_PATH) {
    fail(`verify.html: expected data-artifact ${DEFAULT_ARTIFACT_PATH}`);
  }

  let seal;
  try {
    seal = JSON.parse(readRepositoryFile(rootPath, configuration.sealPath, 'utf8'));
  } catch (error) {
    fail(`${configuration.sealPath}: ${error.message}`);
  }
  const bytes = readRepositoryFile(rootPath, configuration.artifactPath);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const identity = verifyArtifactIdentity({
    seal,
    artifactPath: configuration.artifactPath,
    bytes,
    sha256
  });
  return Object.freeze({
    ...identity,
    status: 'browser-report-integrity-valid',
    sealPath: configuration.sealPath
  });
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  try {
    const result = checkBrowserReportIntegrity();
    process.stdout.write(`${result.status}: ${result.path}, ${result.bytes} bytes, ${result.sha256}\n`);
  } catch (error) {
    process.stderr.write(`${error.name || 'Error'}: ${error.message}\n`);
    process.exitCode = 1;
  }
}

export {
  BrowserReportIntegrityError,
  DEFAULT_ARTIFACT_PATH,
  DEFAULT_SEAL_PATH,
  checkBrowserReportIntegrity,
  readConsoleConfiguration
};
