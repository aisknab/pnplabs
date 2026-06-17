import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";

// Purpose: verify the public website's bundled public files against the local
// release-seal manifest and SHA256SUMS ledger.
// Inputs: downloads/release-seal.json, downloads/SHA256SUMS, and listed files.
// Outputs: per-file digest confirmations and a final file-identity-only summary.
// Invariants enforced: byte count, SHA-256 digest, and ledger/manifest agreement.
// Assumptions not checked: theorem correctness, PDF contents, or source-checker
// regeneration; a digest match only identifies bytes.
// Failure modes: missing file, malformed ledger, byte mismatch, or digest mismatch.
function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function readSeal() {
  return JSON.parse(readFileSync("downloads/release-seal.json", "utf8"));
}

function readLedger() {
  const ledger = new Map();
  for (const line of readFileSync("downloads/SHA256SUMS", "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = line.match(/^([0-9a-f]{64})\s+(.+)$/i);
    if (!match) {
      throw new Error(`malformed SHA256SUMS line: ${line}`);
    }
    ledger.set(match[2], match[1].toLowerCase());
  }
  return ledger;
}

const seal = readSeal();
const ledger = readLedger();
let checked = 0;

if (seal.status !== "file identity only; not theorem validation") {
  throw new Error("release seal status must state that it is not theorem validation");
}

for (const file of seal.files || []) {
  const info = statSync(file.path);
  const actual = sha256File(file.path);
  if (info.size !== file.bytes) {
    throw new Error(`${file.path}: byte count ${info.size} does not match ${file.bytes}`);
  }
  if (actual !== file.sha256.toLowerCase()) {
    throw new Error(`${file.path}: SHA-256 ${actual} does not match ${file.sha256}`);
  }
  if (ledger.get(file.path) !== actual) {
    throw new Error(`${file.path}: SHA256SUMS entry does not match release-seal.json`);
  }
  checked += 1;
  console.log(`ok ${file.path} ${actual}`);
}

if (checked === 0) {
  throw new Error("release-seal.json did not list any files");
}

console.log(`verified ${checked} public artefact files; this confirms file identity only`);
