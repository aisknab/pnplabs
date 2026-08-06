// Purpose: verify one published artefact against the current release seal.
// Inputs: release-seal JSON, an artefact path, and fetched artefact bytes.
// Outputs: a fail-closed identity result for browser and Node consumers.
// Invariants enforced: exact seal schema, unique safe paths, byte count, and SHA-256.
// Assumptions not checked: theorem correctness or authenticity beyond the served origin.

const RELEASE_SEAL_KIND = 'PNPLabsFormalPublicationSeal0';
const RELEASE_SEAL_VERSION = 0;
const SHA256_PATTERN = /^[0-9a-f]{64}$/u;

class ReportIntegrityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ReportIntegrityError';
  }
}

function fail(message) {
  throw new ReportIntegrityError(message);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertExactKeys(value, expected, label) {
  if (!isPlainObject(value)) fail(`${label}: expected an object`);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    fail(`${label}: unexpected fields`);
  }
}

function normalizeArtifactPath(value, label = 'artefact path') {
  if (typeof value !== 'string' || value.length === 0 || value.trim() !== value) {
    fail(`${label}: expected a non-empty trimmed string`);
  }
  if (value.startsWith('/') || value.includes('\\') || value.includes('?') || value.includes('#')) {
    fail(`${label}: expected a relative URL path without query or fragment`);
  }
  const segments = value.split('/');
  if (segments.some((segment) => segment.length === 0 || segment === '.' || segment === '..')) {
    fail(`${label}: unsafe path segment`);
  }
  return value;
}

function validateReleaseSeal(seal) {
  assertExactKeys(seal, [
    'kind',
    'version',
    'scope',
    'status',
    'generated_utc',
    'current_publication_coordinate',
    'current_core_commit',
    'current_core_tree',
    'theorem_gate_passed',
    'public_theorem_emission_allowed',
    'historical_metadata_status',
    'files'
  ], 'release seal');
  if (seal.kind !== RELEASE_SEAL_KIND || seal.version !== RELEASE_SEAL_VERSION) {
    fail('release seal: unsupported kind or version');
  }
  for (const field of [
    'scope',
    'status',
    'generated_utc',
    'current_publication_coordinate',
    'historical_metadata_status'
  ]) {
    if (typeof seal[field] !== 'string' || seal[field].length === 0) {
      fail(`release seal: ${field} must be a non-empty string`);
    }
  }
  for (const field of ['current_core_commit', 'current_core_tree']) {
    if (typeof seal[field] !== 'string' || !/^[0-9a-f]{40}$/u.test(seal[field])) {
      fail(`release seal: ${field} must be lowercase 40-hex`);
    }
  }
  for (const field of ['theorem_gate_passed', 'public_theorem_emission_allowed']) {
    if (typeof seal[field] !== 'boolean') fail(`release seal: ${field} must be boolean`);
  }
  if (!Array.isArray(seal.files) || seal.files.length === 0) {
    fail('release seal: files must be a non-empty array');
  }

  const paths = new Set();
  for (const [index, entry] of seal.files.entries()) {
    const label = `release seal entry ${index}`;
    assertExactKeys(entry, ['path', 'bytes', 'sha256', 'role'], label);
    normalizeArtifactPath(entry.path, `${label} path`);
    if (paths.has(entry.path)) fail(`${label}: duplicate path ${entry.path}`);
    paths.add(entry.path);
    if (!Number.isSafeInteger(entry.bytes) || entry.bytes < 0) {
      fail(`${label}: bytes must be a non-negative safe integer`);
    }
    if (typeof entry.sha256 !== 'string' || !SHA256_PATTERN.test(entry.sha256)) {
      fail(`${label}: sha256 must be lowercase 64-hex`);
    }
    if (typeof entry.role !== 'string' || entry.role.length === 0) {
      fail(`${label}: role must be a non-empty string`);
    }
  }
  return seal;
}

function findReleaseArtifact(seal, artifactPath) {
  const validated = validateReleaseSeal(seal);
  const normalizedPath = normalizeArtifactPath(artifactPath);
  const matches = validated.files.filter((entry) => entry.path === normalizedPath);
  if (matches.length !== 1) {
    fail(`${normalizedPath}: expected exactly one release-seal entry, found ${matches.length}`);
  }
  return matches[0];
}

function byteLengthOf(bytes) {
  if (bytes instanceof ArrayBuffer) return bytes.byteLength;
  if (ArrayBuffer.isView(bytes)) return bytes.byteLength;
  fail('artefact bytes: expected an ArrayBuffer or typed-array view');
}

function toDigestInput(bytes) {
  if (bytes instanceof ArrayBuffer) return bytes;
  if (ArrayBuffer.isView(bytes)) {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  }
  fail('artefact bytes: expected an ArrayBuffer or typed-array view');
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256Hex(bytes, subtle = globalThis.crypto?.subtle) {
  if (!subtle || typeof subtle.digest !== 'function') {
    fail('Web Crypto SHA-256 is unavailable in this context');
  }
  return toHex(await subtle.digest('SHA-256', toDigestInput(bytes)));
}

function verifyArtifactIdentity({ seal, artifactPath, bytes, sha256 }) {
  const entry = findReleaseArtifact(seal, artifactPath);
  const actualBytes = byteLengthOf(bytes);
  if (typeof sha256 !== 'string' || !SHA256_PATTERN.test(sha256)) {
    fail(`${entry.path}: computed SHA-256 must be lowercase 64-hex`);
  }
  if (actualBytes !== entry.bytes) {
    fail(`${entry.path}: received ${actualBytes} bytes; release seal requires ${entry.bytes}`);
  }
  if (sha256 !== entry.sha256) {
    fail(`${entry.path}: computed SHA-256 does not match the release seal`);
  }
  return Object.freeze({
    status: 'matched',
    path: entry.path,
    bytes: entry.bytes,
    sha256: entry.sha256,
    role: entry.role
  });
}

async function verifyArtifactBytes({ seal, artifactPath, bytes, subtle }) {
  const digest = await sha256Hex(bytes, subtle);
  return verifyArtifactIdentity({ seal, artifactPath, bytes, sha256: digest });
}

async function fetchJson(response, label) {
  if (!response || response.ok !== true) {
    const status = response && Number.isInteger(response.status) ? `HTTP ${response.status}` : 'request failed';
    fail(`${label}: ${status}`);
  }
  try {
    return await response.json();
  } catch (error) {
    fail(`${label}: invalid JSON (${error instanceof Error ? error.message : 'parse failure'})`);
  }
}

async function fetchPublishedArtifactIdentity({
  sealUrl,
  artifactPath,
  fetchImpl = globalThis.fetch,
  subtle = globalThis.crypto?.subtle,
  onPhase = () => {}
}) {
  if (typeof fetchImpl !== 'function') fail('fetch implementation is unavailable');
  const normalizedSealUrl = normalizeArtifactPath(sealUrl, 'release-seal URL');
  const normalizedArtifactPath = normalizeArtifactPath(artifactPath);

  onPhase('seal-request', normalizedSealUrl);
  const sealResponse = await fetchImpl(normalizedSealUrl, {
    cache: 'no-store',
    credentials: 'same-origin'
  });
  const seal = validateReleaseSeal(await fetchJson(sealResponse, normalizedSealUrl));
  const entry = findReleaseArtifact(seal, normalizedArtifactPath);
  onPhase('seal-loaded', entry);

  onPhase('artifact-request', entry.path);
  const artifactResponse = await fetchImpl(entry.path, {
    cache: 'no-store',
    credentials: 'same-origin'
  });
  if (!artifactResponse || artifactResponse.ok !== true) {
    const status = artifactResponse && Number.isInteger(artifactResponse.status)
      ? `HTTP ${artifactResponse.status}`
      : 'request failed';
    fail(`${entry.path}: ${status}`);
  }
  const lengthHeader = artifactResponse.headers?.get?.('content-length');
  if (lengthHeader !== null && lengthHeader !== undefined && /^\d+$/u.test(lengthHeader)
      && Number(lengthHeader) !== entry.bytes) {
    fail(`${entry.path}: Content-Length ${lengthHeader} does not match release seal ${entry.bytes}`);
  }
  const bytes = await artifactResponse.arrayBuffer();
  onPhase('artifact-loaded', { path: entry.path, bytes: bytes.byteLength });
  const result = await verifyArtifactBytes({ seal, artifactPath: entry.path, bytes, subtle });
  onPhase('matched', result);
  return result;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return 'unknown size';
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function installReportIntegrityConsole(consoleRoot) {
  if (!consoleRoot || consoleRoot.dataset.reportIntegrityInstalled === 'true') return;
  consoleRoot.dataset.reportIntegrityInstalled = 'true';
  const runButton = consoleRoot.querySelector('[data-seal-run]');
  const resetButton = consoleRoot.querySelector('[data-seal-reset]');
  const status = consoleRoot.querySelector('[data-seal-status]');
  const output = consoleRoot.querySelector('[data-seal-output]');
  const expected = consoleRoot.querySelector('[data-seal-expected]');
  const computed = consoleRoot.querySelector('[data-seal-computed]');
  const result = consoleRoot.querySelector('[data-seal-result]');
  const sealUrl = consoleRoot.getAttribute('data-seal');
  const artifactPath = consoleRoot.getAttribute('data-artifact');
  const artifactLabel = consoleRoot.getAttribute('data-label') || artifactPath;

  const setState = (state, text) => {
    consoleRoot.dataset.state = state;
    if (status) status.textContent = text;
  };

  const addLine = (kind, text) => {
    if (!output) return;
    const item = document.createElement('li');
    if (kind) item.classList.add(kind);
    const label = document.createElement('span');
    label.textContent = kind || 'info';
    const code = document.createElement('code');
    code.textContent = text;
    item.append(label, code);
    output.append(item);
  };

  const resetConsole = () => {
    setState('idle', 'idle');
    if (expected) expected.textContent = 'loaded from release seal';
    if (computed) computed.textContent = 'not run';
    if (result) result.textContent = 'Awaiting browser check.';
    if (output) {
      output.replaceChildren();
      addLine('seal', sealUrl || 'release seal not configured');
      addLine('target', artifactLabel || 'artefact not configured');
      addLine('ready', 'press Run check to load the seal, fetch the file, and compare');
    }
  };

  const runSealCheck = async () => {
    if (!sealUrl || !artifactPath) {
      setState('failed', 'configuration error');
      if (result) result.textContent = 'The browser check is missing its release-seal or artefact path.';
      return;
    }
    setState('running', 'running');
    if (runButton) runButton.disabled = true;
    if (expected) expected.textContent = 'loading...';
    if (computed) computed.textContent = 'computing...';
    if (result) result.textContent = 'Checking the release seal and bundled report file...';
    if (output) output.replaceChildren();

    try {
      const match = await fetchPublishedArtifactIdentity({
        sealUrl,
        artifactPath,
        onPhase(phase, detail) {
          if (phase === 'seal-request') addLine('pending', `GET ${detail}`);
          if (phase === 'seal-loaded') {
            if (expected) expected.textContent = detail.sha256;
            addLine('ok', `release seal requires ${detail.sha256}`);
          }
          if (phase === 'artifact-request') addLine('pending', `GET ${detail}`);
          if (phase === 'artifact-loaded') addLine('ok', `received ${artifactLabel} · ${formatBytes(detail.bytes)}`);
          if (phase === 'matched') addLine('ok', 'byte count and computed digest match the current release seal');
        }
      });
      if (computed) computed.textContent = match.sha256;
      setState('verified', 'matched');
      if (result) {
        result.textContent = 'Match: the bundled canonical report has the byte count and SHA-256 published in the current release seal. This confirms file identity only.';
      }
    } catch (error) {
      addLine('fail', error instanceof Error ? error.message : 'release seal check failed');
      setState('failed', 'failed');
      if (computed) computed.textContent = 'not available';
      if (result) {
        result.textContent = 'The browser check did not match. Do not rely on this bundled artefact without further investigation.';
      }
    } finally {
      if (runButton) runButton.disabled = false;
    }
  };

  resetButton?.addEventListener('click', resetConsole);
  runButton?.addEventListener('click', runSealCheck);
  resetConsole();
}

function installReportIntegrityConsoles(root = document) {
  root.querySelectorAll('[data-seal-console]').forEach(installReportIntegrityConsole);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => installReportIntegrityConsoles(), { once: true });
  } else {
    installReportIntegrityConsoles();
  }
}

export {
  RELEASE_SEAL_KIND,
  RELEASE_SEAL_VERSION,
  ReportIntegrityError,
  fetchPublishedArtifactIdentity,
  findReleaseArtifact,
  installReportIntegrityConsole,
  installReportIntegrityConsoles,
  normalizeArtifactPath,
  sha256Hex,
  validateReleaseSeal,
  verifyArtifactBytes,
  verifyArtifactIdentity
};
