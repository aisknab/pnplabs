#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';

const DEFAULT_MATRIX_PATH = 'public/pnp-verifier-run-comparison-matrix.json';
const DEFAULT_SUMMARY_PATH = 'public/pnp-verifier-run-matrix-summary.json';

export function BuildPNPVerifierRunMatrixSummary0(matrix, options = {}) {
  if (!plain0(matrix)) return reject0('MatrixSummary.Shape', [], 'matrix must be an object');
  if (matrix.kind !== 'PNPVerifierRunComparisonMatrix0') return reject0('MatrixSummary.Kind', ['kind'], 'matrix kind mismatch', { actual: matrix.kind });
  if (matrix.status !== 'verifier-run-comparison-matrix-ready') return reject0('MatrixSummary.Status', ['status'], 'matrix status mismatch', { actual: matrix.status });
  const numericFields = ['registryRunCount', 'pairCount', 'acceptedPairCount', 'rejectedPairCount', 'requiredMismatchPairCount'];
  for (const field of numericFields) {
    if (!Number.isSafeInteger(matrix[field]) || matrix[field] < 0) return reject0('MatrixSummary.NumericField', [field], 'matrix numeric field must be a non-negative safe integer', { actual: matrix[field] });
  }
  const passing = matrix.allRequiredPairsAccept === true && matrix.allRequiredPairsMatch === true && matrix.diagonalAccepts === true && matrix.requiredMismatchPairCount === 0 && matrix.rejectedPairCount === 0;
  const state = passing ? 'passing' : 'attention';
  const recordLabel = matrix.registryRunCount === 1 ? '1 public run' : `${matrix.registryRunCount} public runs`;
  const pairLabel = `${matrix.acceptedPairCount}/${matrix.pairCount} required comparisons passing`;
  const summaryCore = {
    kind: 'PNPVerifierRunMatrixBadgeSummary0',
    version: 0,
    status: 'verifier-run-matrix-badge-summary-ready',
    sourceMatrix: options.sourceMatrix ?? DEFAULT_MATRIX_PATH,
    sourceRegistry: matrix.sourceRegistry ?? 'public/pnp-verification-runs.json',
    generatedBy: 'tools/generate-pnp-verifier-run-summary.mjs',
    badge: {
      label: 'Verifier-run matrix',
      state,
      tone: passing ? 'success' : 'warning',
      text: `${recordLabel}; ${pairLabel}`,
      shortText: passing ? `${matrix.registryRunCount} run / matrix passing` : `${matrix.registryRunCount} run / matrix attention`,
    },
    metrics: {
      registryRunCount: matrix.registryRunCount,
      pairCount: matrix.pairCount,
      acceptedPairCount: matrix.acceptedPairCount,
      rejectedPairCount: matrix.rejectedPairCount,
      requiredMismatchPairCount: matrix.requiredMismatchPairCount,
      allRequiredPairsAccept: matrix.allRequiredPairsAccept === true,
      allRequiredPairsMatch: matrix.allRequiredPairsMatch === true,
      diagonalAccepts: matrix.diagonalAccepts === true,
    },
    requiredDigestKeys: Array.isArray(matrix.requiredDigestKeys) ? [...matrix.requiredDigestKeys] : [],
    recordIds: Array.isArray(matrix.recordIds) ? [...matrix.recordIds] : [],
    links: {
      registry: 'public/pnp-verification-runs.json',
      matrix: options.sourceMatrix ?? DEFAULT_MATRIX_PATH,
      comparisonPolicy: matrix.comparisonPolicyPayload ?? 'public/pnp-verifier-run-digest-comparison.json',
      page: 'verifier-run-digests.html',
    },
    boundary: {
      publicTheoremEmissionAllowed: true,
      publicTheoremStatement: 'P = NP',
      remainingBlockers: [],
      externalReviewIsMathematicalPremise: false,
    },
    nonClaims: [
      'The matrix badge is a compact reproducibility summary for activated checker-trust verifier runs.',
      'A passing badge is not an external-consensus claim or peer-review acceptance.',
      'A warning badge is a triage signal for the run-evidence layer, not a direct proof-stack refutation.',
    ],
  };
  return { tag: 'accept', summary: { ...summaryCore, summarySha256: sha256Text0(stableStringify0(summaryCore)) } };
}

async function main0() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const write = args.includes('--write');
  const compactArgs = args.filter((arg) => !arg.startsWith('--'));
  const matrixPath = compactArgs[0] ?? DEFAULT_MATRIX_PATH;
  const summaryPath = compactArgs[1] ?? DEFAULT_SUMMARY_PATH;
  try {
    const matrix = JSON.parse(await readFile(matrixPath, 'utf8'));
    const out = BuildPNPVerifierRunMatrixSummary0(matrix, { sourceMatrix: matrixPath });
    if (out.tag === 'accept' && write) await writeFile(summaryPath, `${JSON.stringify(out.summary, null, 2)}\n`, 'utf8');
    const rendered = JSON.stringify({ ...out, matrixPath, summaryPath, write }, null, 2);
    if (json || out.tag === 'accept') console.log(rendered); else console.error(rendered);
    process.exit(out.tag === 'accept' ? 0 : 1);
  } catch (error) {
    const out = reject0('MatrixSummary.Exception', [], 'summary command failed', normalizeError0(error));
    console.error(JSON.stringify(out, null, 2));
    process.exit(1);
  }
}

function reject0(coord, pathArray, reason, witness = {}) { return { tag: 'reject', checker: 'BuildPNPVerifierRunMatrixSummary0', coord, path: pathArray, witness: { reason, ...witness } }; }
function plain0(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function stableStringify0(value) { if (Array.isArray(value)) return `[${value.map(stableStringify0).join(',')}]`; if (plain0(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify0(value[key])}`).join(',')}}`; return JSON.stringify(value); }
function sha256Text0(text) { return createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex'); }
function normalizeError0(error) { return { name: error?.name ?? 'Error', message: error?.message ?? String(error), code: error?.code ?? null }; }

if (import.meta.url === `file://${process.argv[1]}`) main0();
