#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';

import { ComparePNPActivatedRunRecords0 } from './compare-pnp-verifier-runs.mjs';

const DEFAULT_REGISTRY_PATH = 'public/pnp-verification-runs.json';
const DEFAULT_MATRIX_PATH = 'public/pnp-verifier-run-comparison-matrix.json';
const DEFAULT_REQUIRED_KEYS = [
  'verdictNormalizedSha256',
  'activatedStatusNormalizedSha256',
  'proofScriptOutputsNormalizedSha256',
];

export function BuildPNPVerifierRunComparisonMatrix0(registry, options = {}) {
  if (!plain0(registry)) return reject0('Matrix.RegistryShape', [], 'registry must be an object');
  if (registry.kind !== 'PNPLabsPNPVerificationRunRegistry0') return reject0('Matrix.RegistryKind', ['kind'], 'registry kind mismatch', { actual: registry.kind });
  if (!Array.isArray(registry.runs)) return reject0('Matrix.RunsShape', ['runs'], 'registry runs must be an array');
  if (!plain0(registry.claimBoundary) || registry.claimBoundary.publicTheoremEmissionAllowed !== true || registry.claimBoundary.publicTheoremStatement !== 'P = NP') return reject0('Matrix.ClaimBoundary', ['claimBoundary'], 'registry must use the activated theorem-emission boundary');
  if (Array.isArray(registry.claimBoundary.remainingBlockers) && registry.claimBoundary.remainingBlockers.length !== 0) return reject0('Matrix.RemainingBlockers', ['claimBoundary', 'remainingBlockers'], 'remaining blockers must be empty');

  const requiredKeys = options.requiredKeys ?? registry.comparisonWorkflow?.defaultRequiredDigestKeys ?? DEFAULT_REQUIRED_KEYS;
  if (!Array.isArray(requiredKeys) || requiredKeys.length === 0) return reject0('Matrix.RequiredKeys', ['requiredKeys'], 'required digest keys must be a non-empty array');
  const ids = registry.runs.map((run, index) => {
    if (!plain0(run) || typeof run.recordId !== 'string' || run.recordId.length === 0) throw new Error(`run ${index} missing recordId`);
    return run.recordId;
  });
  if (new Set(ids).size !== ids.length) return reject0('Matrix.DuplicateRecordIds', ['runs'], 'run record IDs must be unique', { ids });

  const cells = [];
  const rows = [];
  let acceptedPairCount = 0;
  let rejectedPairCount = 0;
  let requiredMismatchPairCount = 0;
  for (let i = 0; i < registry.runs.length; i += 1) {
    const row = { recordId: ids[i], cells: [] };
    for (let j = 0; j < registry.runs.length; j += 1) {
      const comparison = ComparePNPActivatedRunRecords0(registry.runs[i], registry.runs[j], { requiredKeys });
      const cell = summarizeComparison0(i, j, ids[i], ids[j], comparison);
      row.cells.push(cell);
      cells.push(cell);
      if (cell.tag === 'accept') acceptedPairCount += 1;
      else rejectedPairCount += 1;
      if (cell.requiredMismatches.length > 0) requiredMismatchPairCount += 1;
    }
    rows.push(row);
  }

  const matrixCore = {
    kind: 'PNPVerifierRunComparisonMatrix0',
    version: 0,
    status: 'verifier-run-comparison-matrix-ready',
    sourceRegistry: options.sourceRegistry ?? DEFAULT_REGISTRY_PATH,
    comparisonPolicyPayload: 'public/pnp-verifier-run-digest-comparison.json',
    generatedBy: 'tools/generate-pnp-verifier-run-matrix.mjs',
    generatedFromRegistryStatus: registry.status,
    registryRunCount: registry.runs.length,
    pairCount: cells.length,
    acceptedPairCount,
    rejectedPairCount,
    requiredMismatchPairCount,
    requiredDigestKeys: requiredKeys,
    allRequiredPairsAccept: rejectedPairCount === 0,
    allRequiredPairsMatch: requiredMismatchPairCount === 0,
    diagonalAccepts: rows.every((row, index) => row.cells[index]?.tag === 'accept'),
    recordIds: ids,
    records: registry.runs.map((run) => summarizeRun0(run)),
    rows,
    nonClaims: [
      'The comparison matrix is reproducibility metadata for activated checker-trust verifier runs.',
      'A matrix accept cell is not an external-consensus claim or peer-review acceptance.',
      'A matrix reject cell is a triage signal; it does not by itself refute the source/checker proof stack.',
      'The source/checker verifier remains the proof-stack reproduction target.'
    ],
  };
  return { tag: 'accept', matrix: { ...matrixCore, matrixSha256: sha256Text0(stableStringify0(matrixCore)) } };
}

function summarizeComparison0(leftIndex, rightIndex, leftRecordId, rightRecordId, comparison) {
  if (!plain0(comparison)) {
    return { leftIndex, rightIndex, leftRecordId, rightRecordId, tag: 'reject', coord: 'Matrix.ComparisonShape', requiredMismatches: ['comparison-shape'], allDigestKeysMatch: false, statusPayloadDigestMatch: false, pnpCommitMatch: false };
  }
  return {
    leftIndex,
    rightIndex,
    leftRecordId,
    rightRecordId,
    tag: comparison.tag,
    requiredMismatches: Array.isArray(comparison.requiredMismatches) ? comparison.requiredMismatches : [],
    allDigestKeysMatch: comparison.allDigestKeysMatch === true,
    statusPayloadDigestMatch: comparison.statusPayloadDigestMatch === true,
    pnpCommitMatch: comparison.pnpCommitMatch === true,
    comparisonSha256: comparison.comparisonSha256 ?? null,
    digestMatches: Object.fromEntries(Object.entries(comparison.comparisons ?? {}).map(([key, value]) => [key, value?.match === true])),
  };
}

function summarizeRun0(run) {
  return {
    recordId: run.recordId,
    recordClass: run.recordClass ?? null,
    runnerNameOrHandle: run.runnerNameOrHandle ?? null,
    dateUtc: run.dateUtc ?? null,
    pnpCommit: run.pnpCommit ?? null,
    publicTheoremEmissionAllowed: run.verdict?.publicTheoremEmissionAllowed ?? null,
    publicTheoremStatement: run.verdict?.publicTheoremStatement ?? null,
    remainingBlockers: Array.isArray(run.verdict?.remainingBlockers) ? run.verdict.remainingBlockers : null,
    hasNormalizedDigests: plain0(run.normalizedDigests),
  };
}

async function main0() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const write = args.includes('--write');
  const requiredArg = args.find((arg) => arg.startsWith('--required='));
  const compactArgs = args.filter((arg) => !arg.startsWith('--'));
  const registryPath = compactArgs[0] ?? DEFAULT_REGISTRY_PATH;
  const matrixPath = compactArgs[1] ?? DEFAULT_MATRIX_PATH;
  const requiredKeys = requiredArg ? requiredArg.slice('--required='.length).split(',').filter(Boolean) : undefined;
  try {
    const registry = JSON.parse(await readFile(registryPath, 'utf8'));
    const out = BuildPNPVerifierRunComparisonMatrix0(registry, { sourceRegistry: registryPath, requiredKeys });
    if (out.tag === 'accept' && write) await writeFile(matrixPath, `${JSON.stringify(out.matrix, null, 2)}\n`, 'utf8');
    const rendered = JSON.stringify({ ...out, registryPath, matrixPath, write }, null, 2);
    if (json || out.tag === 'accept') console.log(rendered); else console.error(rendered);
    process.exit(out.tag === 'accept' ? 0 : 1);
  } catch (error) {
    const out = reject0('Matrix.Exception', [], 'matrix command failed', normalizeError0(error));
    console.error(JSON.stringify(out, null, 2));
    process.exit(1);
  }
}

function reject0(coord, pathArray, reason, witness = {}) { return { tag: 'reject', checker: 'BuildPNPVerifierRunComparisonMatrix0', coord, path: pathArray, witness: { reason, ...witness } }; }
function plain0(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function stableStringify0(value) { if (Array.isArray(value)) return `[${value.map(stableStringify0).join(',')}]`; if (plain0(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify0(value[key])}`).join(',')}}`; return JSON.stringify(value); }
function sha256Text0(text) { return createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex'); }
function normalizeError0(error) { return { name: error?.name ?? 'Error', message: error?.message ?? String(error), code: error?.code ?? null }; }

if (import.meta.url === `file://${process.argv[1]}`) main0();
