#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import process from 'node:process';

import { AttachPNPActivatedRunRecordDigests0 } from './normalize-pnp-verifier-run.mjs';

const DIGEST_KEYS = [
  'runRecordNormalizedSha256',
  'verdictNormalizedSha256',
  'activatedStatusNormalizedSha256',
  'proofScriptOutputsNormalizedSha256',
  'artifactsOrLogsNormalizedSha256',
];
const REQUIRED_VERDICT = {
  tag: 'accept',
  publicTheoremEmissionAllowed: true,
  publicTheoremStatement: 'P = NP',
  publicTheoremConclusion: 'P = NP',
  finalTheoremReady: true,
  unrestrictedFinalSoundnessDischarged: true,
};

export function ComparePNPActivatedRunRecords0(leftRecord, rightRecord, options = {}) {
  const left = prepareRecord0(leftRecord, 'left');
  if (left.tag === 'reject') return left;
  const right = prepareRecord0(rightRecord, 'right');
  if (right.tag === 'reject') return right;

  const required = validateActivatedVerdict0(left.record, 'left');
  if (required.tag === 'reject') return required;
  const requiredRight = validateActivatedVerdict0(right.record, 'right');
  if (requiredRight.tag === 'reject') return requiredRight;

  const comparisons = Object.fromEntries(DIGEST_KEYS.map((key) => [key, {
    left: left.digests[key],
    right: right.digests[key],
    match: left.digests[key] === right.digests[key],
  }]));
  const requiredKeys = options.requiredKeys ?? [
    'verdictNormalizedSha256',
    'activatedStatusNormalizedSha256',
    'proofScriptOutputsNormalizedSha256',
  ];
  for (const key of requiredKeys) {
    if (!DIGEST_KEYS.includes(key)) return reject0('CompareRun.UnknownRequiredDigestKey', ['requiredKeys', key], 'unknown digest key', { key });
  }
  const requiredMismatches = requiredKeys.filter((key) => comparisons[key].match !== true);
  const statusPayloadDigestMatch = left.record.statusPayloadSha256 === right.record.statusPayloadSha256;
  const pnpCommitMatch = left.record.pnpCommit === right.record.pnpCommit;

  return {
    tag: requiredMismatches.length === 0 ? 'accept' : 'reject',
    checker: 'ComparePNPActivatedRunRecords0',
    policy: 'PNPVerifierRunDigestComparison0',
    comparedRecordIds: [left.record.recordId, right.record.recordId],
    requiredKeys,
    requiredMismatches,
    allDigestKeysMatch: DIGEST_KEYS.every((key) => comparisons[key].match === true),
    statusPayloadDigestMatch,
    pnpCommitMatch,
    comparisons,
    left: summarizeRecord0(left.record),
    right: summarizeRecord0(right.record),
    comparisonSha256: sha256Text0(stableStringify0({ comparisons, requiredKeys, statusPayloadDigestMatch, pnpCommitMatch })),
  };
}

function prepareRecord0(record, side) {
  if (!plain0(record)) return reject0('CompareRun.RecordShape', [side], 'run record must be an object');
  if (plain0(record.normalizedDigests)) return { tag: 'accept', record, digests: record.normalizedDigests };
  const attached = AttachPNPActivatedRunRecordDigests0(record);
  if (attached.tag === 'reject') return reject0('CompareRun.NormalizeFailed', [side], 'could not normalize run record', { normalizeReject: attached });
  return { tag: 'accept', record: attached.record, digests: attached.normalizedDigests };
}

function validateActivatedVerdict0(record, side) {
  if (!plain0(record.verdict)) return reject0('CompareRun.VerdictShape', [side, 'verdict'], 'verdict must be an object');
  for (const [key, expected] of Object.entries(REQUIRED_VERDICT)) {
    if (record.verdict[key] !== expected) return reject0('CompareRun.VerdictField', [side, 'verdict', key], 'activated verdict field mismatch', { expected, actual: record.verdict[key] });
  }
  if (!Array.isArray(record.verdict.remainingBlockers) || record.verdict.remainingBlockers.length !== 0) return reject0('CompareRun.VerdictBlockers', [side, 'verdict', 'remainingBlockers'], 'remaining blockers must be empty', { actual: record.verdict.remainingBlockers });
  if (!plain0(record.activatedStatus) || record.activatedStatus.externalReviewIsMathematicalPremise !== false) return reject0('CompareRun.ActivatedStatusPremise', [side, 'activatedStatus', 'externalReviewIsMathematicalPremise'], 'external review must not be a theorem premise');
  return { tag: 'accept' };
}

function summarizeRecord0(record) {
  return {
    recordId: record.recordId ?? null,
    recordClass: record.recordClass ?? null,
    runnerNameOrHandle: record.runnerNameOrHandle ?? null,
    dateUtc: record.dateUtc ?? null,
    pnpCommit: record.pnpCommit ?? null,
    publicTheoremEmissionAllowed: record.verdict?.publicTheoremEmissionAllowed ?? null,
    publicTheoremStatement: record.verdict?.publicTheoremStatement ?? null,
    remainingBlockers: record.verdict?.remainingBlockers ?? null,
    statusPayloadSha256: record.statusPayloadSha256 ?? null,
  };
}

async function main0() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const requiredArg = args.find((arg) => arg.startsWith('--required='));
  const files = args.filter((arg) => !arg.startsWith('--'));
  const requiredKeys = requiredArg ? requiredArg.slice('--required='.length).split(',').filter(Boolean) : undefined;
  if (files.length !== 2) {
    const out = reject0('CompareRun.Usage', [], 'usage: node tools/compare-pnp-verifier-runs.mjs [--json] [--required=verdictNormalizedSha256,...] <left.json> <right.json>');
    console.error(JSON.stringify(out, null, 2));
    process.exit(2);
  }
  try {
    const [left, right] = await Promise.all(files.map(readJsonFile0));
    const out = ComparePNPActivatedRunRecords0(left, right, requiredKeys ? { requiredKeys } : {});
    const rendered = JSON.stringify(out, null, 2);
    if (json || out.tag === 'accept') console.log(rendered); else console.error(rendered);
    process.exit(out.tag === 'accept' ? 0 : 1);
  } catch (error) {
    const out = reject0('CompareRun.Exception', [], 'comparison command failed', normalizeError0(error));
    console.error(JSON.stringify(out, null, 2));
    process.exit(1);
  }
}

async function readJsonFile0(filePath) { return JSON.parse(await readFile(filePath, 'utf8')); }
function reject0(coord, pathArray, reason, witness = {}) { return { tag: 'reject', checker: 'ComparePNPActivatedRunRecords0', coord, path: pathArray, witness: { reason, ...witness } }; }
function plain0(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function stableStringify0(value) { if (Array.isArray(value)) return `[${value.map(stableStringify0).join(',')}]`; if (plain0(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify0(value[key])}`).join(',')}}`; return JSON.stringify(value); }
function sha256Text0(text) { return createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex'); }
function normalizeError0(error) { return { name: error?.name ?? 'Error', message: error?.message ?? String(error), code: error?.code ?? null }; }

if (import.meta.url === `file://${process.argv[1]}`) main0();
