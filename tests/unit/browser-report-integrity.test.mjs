import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import {
  ReportIntegrityError,
  fetchPublishedArtifactIdentity,
  findReleaseArtifact,
  normalizeArtifactPath,
  validateReleaseSeal,
  verifyArtifactBytes,
  verifyArtifactIdentity
} from '../../assets/report-integrity.js';
import {
  BrowserReportIntegrityError,
  checkBrowserReportIntegrity,
  readConsoleConfiguration
} from '../../tools/check-browser-report-integrity.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const artifactPath = 'downloads/canonical_proof_report.pdf';
const bytes = new TextEncoder().encode('current report bytes');
const digest = createHash('sha256').update(bytes).digest('hex');

function releaseSeal(overrides = {}) {
  return {
    kind: 'PNPLabsFormalPublicationSeal0',
    version: 0,
    scope: 'test release files',
    status: 'file identity only; not theorem validation',
    generated_utc: '2026-08-06T00:00:00Z',
    current_publication_coordinate: 'TEST-RELEASE-0',
    current_core_commit: 'a'.repeat(40),
    current_core_tree: 'b'.repeat(40),
    theorem_gate_passed: false,
    public_theorem_emission_allowed: false,
    historical_metadata_status: 'historical-quarantined-not-current-authority',
    files: [{
      path: artifactPath,
      bytes: bytes.byteLength,
      sha256: digest,
      role: 'test report bytes'
    }],
    ...overrides
  };
}

test('shared release-seal validator accepts one exact current artefact', async () => {
  const seal = releaseSeal();
  assert.equal(validateReleaseSeal(seal), seal);
  assert.equal(findReleaseArtifact(seal, artifactPath).sha256, digest);
  assert.deepEqual(
    verifyArtifactIdentity({ seal, artifactPath, bytes, sha256: digest }),
    {
      status: 'matched',
      path: artifactPath,
      bytes: bytes.byteLength,
      sha256: digest,
      role: 'test report bytes'
    }
  );
  assert.equal(
    (await verifyArtifactBytes({ seal, artifactPath, bytes, subtle: webcrypto.subtle })).sha256,
    digest
  );
});

test('shared validator rejects malformed, missing, duplicate, and unsafe seal entries', () => {
  assert.throws(
    () => validateReleaseSeal({ ...releaseSeal(), version: 1 }),
    ReportIntegrityError
  );
  assert.throws(
    () => findReleaseArtifact(releaseSeal({ files: [] }), artifactPath),
    /files must be a non-empty array/u
  );
  assert.throws(
    () => findReleaseArtifact(releaseSeal(), 'downloads/missing.pdf'),
    /expected exactly one release-seal entry/u
  );
  const duplicate = releaseSeal();
  duplicate.files.push({ ...duplicate.files[0] });
  assert.throws(() => validateReleaseSeal(duplicate), /duplicate path/u);
  const traversal = releaseSeal();
  traversal.files[0].path = '../canonical_proof_report.pdf';
  assert.throws(() => validateReleaseSeal(traversal), /unsafe path segment/u);
  for (const unsafe of ['/report.pdf', 'downloads\\report.pdf', 'downloads/../report.pdf', 'report.pdf?v=1']) {
    assert.throws(() => normalizeArtifactPath(unsafe), ReportIntegrityError);
  }
});

test('shared validator fails closed on byte-count and digest drift', () => {
  const seal = releaseSeal();
  assert.throws(
    () => verifyArtifactIdentity({ seal, artifactPath, bytes: new Uint8Array([1]), sha256: digest }),
    /received 1 bytes/u
  );
  assert.throws(
    () => verifyArtifactIdentity({ seal, artifactPath, bytes, sha256: '0'.repeat(64) }),
    /does not match the release seal/u
  );
  assert.throws(
    () => verifyArtifactIdentity({ seal, artifactPath, bytes, sha256: 'not-a-digest' }),
    /must be lowercase 64-hex/u
  );
});

test('browser fetch path loads the seal before deriving and checking the artefact digest', async () => {
  const seal = releaseSeal();
  const requests = [];
  const phases = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    if (url === 'downloads/release-seal.json') {
      return new Response(JSON.stringify(seal), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (url === artifactPath) {
      return new Response(bytes, {
        status: 200,
        headers: { 'Content-Length': String(bytes.byteLength) }
      });
    }
    return new Response('', { status: 404 });
  };
  const result = await fetchPublishedArtifactIdentity({
    sealUrl: 'downloads/release-seal.json',
    artifactPath,
    fetchImpl,
    subtle: webcrypto.subtle,
    onPhase: (phase) => phases.push(phase)
  });
  assert.equal(result.status, 'matched');
  assert.deepEqual(requests.map(({ url }) => url), [
    'downloads/release-seal.json',
    artifactPath
  ]);
  assert.ok(requests.every(({ options }) => options.cache === 'no-store'));
  assert.deepEqual(phases, [
    'seal-request',
    'seal-loaded',
    'artifact-request',
    'artifact-loaded',
    'matched'
  ]);
});

test('browser fetch path rejects an altered length before reporting a match', async () => {
  const seal = releaseSeal();
  let call = 0;
  await assert.rejects(
    fetchPublishedArtifactIdentity({
      sealUrl: 'downloads/release-seal.json',
      artifactPath,
      subtle: webcrypto.subtle,
      fetchImpl: async () => {
        call += 1;
        if (call === 1) return new Response(JSON.stringify(seal), { status: 200 });
        return new Response(bytes, {
          status: 200,
          headers: { 'Content-Length': String(bytes.byteLength + 1) }
        });
      }
    }),
    /Content-Length/u
  );
});

test('verify page derives its expected digest from the seal and contains no digest copy', () => {
  const html = '<div data-seal-console data-seal="downloads/release-seal.json" data-artifact="downloads/canonical_proof_report.pdf"><code data-seal-expected></code></div>';
  assert.deepEqual(readConsoleConfiguration(html), {
    sealPath: 'downloads/release-seal.json',
    artifactPath
  });
  assert.throws(
    () => readConsoleConfiguration(html.replace('data-seal-console', 'data-seal-console data-expected="deadbeef"')),
    BrowserReportIntegrityError
  );
  assert.throws(
    () => readConsoleConfiguration(html.replace('data-seal="downloads/release-seal.json" ', '')),
    /must name data-seal/u
  );
});

test('repository browser checker matches the current sealed report', () => {
  const result = checkBrowserReportIntegrity({ root });
  assert.equal(result.status, 'browser-report-integrity-valid');
  assert.equal(result.path, artifactPath);
  assert.match(result.sha256, /^[0-9a-f]{64}$/u);
});
