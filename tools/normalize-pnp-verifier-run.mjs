#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';

const REQUIRED_PROOF_OUTPUT_KEYS = [
  'proof:activated-pnp-status',
  'proof:public-theorem-activation',
  'proof:unrestricted-final-soundness-release',
  'proof:uniform-complexity-conclusion',
];

export function NormalizeVerifierLogText0(text) {
  return String(text ?? '')
    .replace(/\u001b\[[0-9;]*m/gu, '')
    .replace(/\r\n?/gu, '\n')
    .split('\n')
    .map((line) => line
      .replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z\s+/u, '')
      .replace(/^\[[0-9:.]+\]\s*/u, '')
      .replace(/\s+$/u, ''))
    .filter((line) => line.length > 0)
    .join('\n');
}

export function NormalizePNPActivatedRunRecord0(record) {
  if (!plain0(record)) return reject0('NormalizeRun.RecordShape', [], 'record must be an object');
  const verdict = plain0(record.verdict) ? record.verdict : {};
  const status = plain0(record.activatedStatus) ? record.activatedStatus : {};
  const proofScriptOutputs = {};
  const proofSource = plain0(record.proofScriptOutputs) ? record.proofScriptOutputs : {};
  for (const key of REQUIRED_PROOF_OUTPUT_KEYS) proofScriptOutputs[key] = NormalizeVerifierLogText0(proofSource[key]);

  const artifactsOrLogs = Array.isArray(record.artifactsOrLogs)
    ? record.artifactsOrLogs.map((entry) => normalizeArtifactOrLog0(entry))
    : [];

  return {
    tag: 'accept',
    normalized: {
      kind: record.kind ?? null,
      recordId: record.recordId ?? null,
      recordClass: record.recordClass ?? null,
      runnerNameOrHandle: record.runnerNameOrHandle ?? null,
      dateUtc: record.dateUtc ?? null,
      pnpCommit: record.pnpCommit ?? null,
      pnplabsCommit: record.pnplabsCommit ?? null,
      commandsRun: Array.isArray(record.commandsRun) ? record.commandsRun.map((command) => String(command).trim()).filter(Boolean) : [],
      verdict: {
        tag: verdict.tag ?? null,
        claimStatus: verdict.claimStatus ?? null,
        publicTheoremEmissionAllowed: verdict.publicTheoremEmissionAllowed ?? null,
        publicTheoremStatement: verdict.publicTheoremStatement ?? null,
        publicTheoremConclusion: verdict.publicTheoremConclusion ?? null,
        finalTheoremReady: verdict.finalTheoremReady ?? null,
        unrestrictedFinalSoundnessDischarged: verdict.unrestrictedFinalSoundnessDischarged ?? null,
        remainingBlockers: Array.isArray(verdict.remainingBlockers) ? [...verdict.remainingBlockers] : [],
      },
      activatedStatus: {
        kind: status.kind ?? null,
        coordinate: status.coordinate ?? null,
        publicTheoremActivationCoordinate: status.publicTheoremActivationCoordinate ?? null,
        unrestrictedFinalSoundnessReleaseCoordinate: status.unrestrictedFinalSoundnessReleaseCoordinate ?? null,
        externalReviewIsMathematicalPremise: status.externalReviewIsMathematicalPremise ?? null,
      },
      statusPayloadSha256: record.statusPayloadSha256 ?? null,
      proofScriptOutputs,
      artifactsOrLogs,
    },
  };
}

export function ComputePNPActivatedRunRecordDigests0(record) {
  const normalized = NormalizePNPActivatedRunRecord0(record);
  if (normalized.tag === 'reject') return normalized;
  const n = normalized.normalized;
  return {
    tag: 'accept',
    policy: 'PNPActivatedRunDigestNormalization0',
    runRecordNormalizedSha256: sha256Text0(stableStringify0(n)),
    verdictNormalizedSha256: sha256Text0(stableStringify0(n.verdict)),
    activatedStatusNormalizedSha256: sha256Text0(stableStringify0(n.activatedStatus)),
    proofScriptOutputsNormalizedSha256: sha256Text0(stableStringify0(n.proofScriptOutputs)),
    artifactsOrLogsNormalizedSha256: sha256Text0(stableStringify0(n.artifactsOrLogs)),
  };
}

export function AttachPNPActivatedRunRecordDigests0(record) {
  const digests = ComputePNPActivatedRunRecordDigests0(record);
  if (digests.tag === 'reject') return digests;
  const next = structuredClone0(record);
  next.normalizedDigests = {
    policy: digests.policy,
    runRecordNormalizedSha256: digests.runRecordNormalizedSha256,
    verdictNormalizedSha256: digests.verdictNormalizedSha256,
    activatedStatusNormalizedSha256: digests.activatedStatusNormalizedSha256,
    proofScriptOutputsNormalizedSha256: digests.proofScriptOutputsNormalizedSha256,
    artifactsOrLogsNormalizedSha256: digests.artifactsOrLogsNormalizedSha256,
  };
  return { tag: 'accept', record: next, normalizedDigests: next.normalizedDigests };
}

function normalizeArtifactOrLog0(entry) {
  if (!plain0(entry)) return { kind: 'unknown', value: NormalizeVerifierLogText0(entry) };
  const out = {};
  for (const key of Object.keys(entry).sort()) {
    const value = entry[key];
    if (key === 'rawLog' || key === 'logText' || key === 'stdout' || key === 'stderr') out[key] = NormalizeVerifierLogText0(value);
    else if (Array.isArray(value)) out[key] = value.map((item) => plain0(item) ? normalizeArtifactOrLog0(item) : String(item));
    else if (plain0(value)) out[key] = normalizeArtifactOrLog0(value);
    else out[key] = value;
  }
  return out;
}

async function main0() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const json = args.includes('--json');
  const recordPath = args.find((arg) => !arg.startsWith('--'));
  if (!recordPath) {
    const out = reject0('NormalizeRun.Usage', [], 'usage: node tools/normalize-pnp-verifier-run.mjs [--json] [--write] <record.json>');
    console.error(JSON.stringify(out, null, 2));
    process.exit(2);
  }
  try {
    const record = JSON.parse(await readFile(recordPath, 'utf8'));
    const out = AttachPNPActivatedRunRecordDigests0(record);
    if (out.tag === 'accept' && write) await writeFile(recordPath, `${JSON.stringify(out.record, null, 2)}\n`, 'utf8');
    const rendered = JSON.stringify({ ...out, recordPath, write }, null, 2);
    if (json || out.tag === 'accept') console.log(rendered); else console.error(rendered);
    process.exit(out.tag === 'accept' ? 0 : 1);
  } catch (error) {
    const out = reject0('NormalizeRun.Exception', [], 'normalization command failed', normalizeError0(error));
    console.error(JSON.stringify(out, null, 2));
    process.exit(1);
  }
}

function reject0(coord, pathArray, reason, witness = {}) { return { tag: 'reject', kind: 'reject', checker: 'NormalizePNPActivatedRunRecord0', coord, path: pathArray, witness: { reason, ...witness } }; }
function plain0(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function stableStringify0(value) { if (Array.isArray(value)) return `[${value.map(stableStringify0).join(',')}]`; if (plain0(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify0(value[key])}`).join(',')}}`; return JSON.stringify(value); }
function sha256Text0(text) { return createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex'); }
function structuredClone0(value) { return JSON.parse(JSON.stringify(value)); }
function normalizeError0(error) { return { name: error?.name ?? 'Error', message: error?.message ?? String(error), code: error?.code ?? null }; }

if (import.meta.url === `file://${process.argv[1]}`) main0();
