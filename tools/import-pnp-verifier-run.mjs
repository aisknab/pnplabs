#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { AttachPNPActivatedRunRecordDigests0 } from './normalize-pnp-verifier-run.mjs';

const REGISTRY_PATH = 'public/pnp-verification-runs.json';
const ACTIVATED_STATUS_COORDINATE = 'PNP-ACTIVATED-STATUS-2026-07-05-01';
const PUBLIC_ACTIVATION_COORDINATE = 'PNP-PUBLIC-THEOREM-ACTIVATION-2026-07-05-01';
const RELEASE_COORDINATE = 'PNP-UNRESTRICTED-FINAL-SOUNDNESS-RELEASE-2026-07-05-01';
const REQUIRED_PROOF_OUTPUT_KEYS = [
  'proof:activated-pnp-status',
  'proof:public-theorem-activation',
  'proof:unrestricted-final-soundness-release',
  'proof:uniform-complexity-conclusion',
];
const ALLOWED_RECORD_CLASSES = new Set([
  'source-checker-verifier-run',
  'external-source-checker-verifier-run',
  'first-party-source-checker-ci',
]);

export function ValidatePNPActivatedRunRecord0(record) {
  if (!plain0(record)) return reject0('RunRecord.Shape', [], 'run record must be an object');
  const exact = {
    kind: 'PNPActivatedVerificationRunRecord0',
  };
  for (const [key, expected] of Object.entries(exact)) {
    if (record[key] !== expected) return reject0('RunRecord.Field', [key], 'run record field mismatch', { expected, actual: record[key] });
  }
  for (const key of ['recordId', 'recordClass', 'runnerNameOrHandle', 'dateUtc', 'pnpCommit']) {
    if (typeof record[key] !== 'string' || record[key].trim().length === 0) return reject0('RunRecord.RequiredString', [key], 'required string field missing');
  }
  if (!ALLOWED_RECORD_CLASSES.has(record.recordClass)) return reject0('RunRecord.RecordClass', ['recordClass'], 'record class must be a source-checker verifier run class', { allowed: [...ALLOWED_RECORD_CLASSES], actual: record.recordClass });
  if (!plain0(record.environment)) return reject0('RunRecord.Environment', ['environment'], 'environment must be an object');
  if (!Array.isArray(record.commandsRun) || record.commandsRun.length === 0) return reject0('RunRecord.Commands', ['commandsRun'], 'commandsRun must be a non-empty array');
  if (!record.commandsRun.some((command) => command === 'npm run pnp:verify')) return reject0('RunRecord.CommandsMissingVerifier', ['commandsRun'], 'commands must include npm run pnp:verify');
  for (const command of record.commandsRun) if (typeof command !== 'string' || command.trim().length === 0) return reject0('RunRecord.CommandEntry', ['commandsRun'], 'command entries must be non-empty strings');

  const verdictCheck = validateVerdict0(record.verdict);
  if (verdictCheck.tag === 'reject') return verdictCheck;
  const activatedCheck = validateActivatedStatus0(record.activatedStatus);
  if (activatedCheck.tag === 'reject') return activatedCheck;
  if (typeof record.statusPayloadSha256 !== 'string' || !/^[0-9a-f]{64}$/u.test(record.statusPayloadSha256)) return reject0('RunRecord.StatusPayloadDigest', ['statusPayloadSha256'], 'status payload digest must be a lowercase SHA-256 hex string', { actual: record.statusPayloadSha256 });
  if (!plain0(record.proofScriptOutputs)) return reject0('RunRecord.ProofScriptOutputs', ['proofScriptOutputs'], 'proofScriptOutputs must be an object');
  for (const key of REQUIRED_PROOF_OUTPUT_KEYS) {
    const value = record.proofScriptOutputs[key];
    if (typeof value !== 'string' || value.trim().length === 0) return reject0('RunRecord.ProofScriptOutputKey', ['proofScriptOutputs', key], 'focused proof-script output key missing');
  }
  if (!Array.isArray(record.artifactsOrLogs) || record.artifactsOrLogs.length === 0) return reject0('RunRecord.Artifacts', ['artifactsOrLogs'], 'artifactsOrLogs must be a non-empty array');
  if (!Array.isArray(record.nonClaims) || record.nonClaims.length < 2) return reject0('RunRecord.NonClaims', ['nonClaims'], 'nonClaims must document record scope');
  const nonClaimText = record.nonClaims.join('\n');
  if (!/not an external-consensus claim/i.test(nonClaimText)) return reject0('RunRecord.NonClaimsExternalConsensus', ['nonClaims'], 'nonClaims must state the record is not an external-consensus claim');
  if (record.normalizedDigests !== undefined) {
    const digestCheck = validateNormalizedDigests0(record.normalizedDigests);
    if (digestCheck.tag === 'reject') return digestCheck;
  }
  return { tag: 'accept', recordId: record.recordId, statusPayloadSha256: record.statusPayloadSha256 };
}

export function ValidatePNPVerificationRunRegistry0(registry) {
  if (!plain0(registry)) return reject0('Registry.Shape', [], 'registry must be an object');
  if (registry.kind !== 'PNPLabsPNPVerificationRunRegistry0') return reject0('Registry.Kind', ['kind'], 'registry kind mismatch', { actual: registry.kind });
  if (!plain0(registry.claimBoundary)) return reject0('Registry.ClaimBoundary', ['claimBoundary'], 'registry claim boundary missing');
  if (registry.claimBoundary.publicTheoremEmissionAllowed !== true) return reject0('Registry.BoundaryEmission', ['claimBoundary', 'publicTheoremEmissionAllowed'], 'registry must use activated theorem boundary');
  if (registry.claimBoundary.publicTheoremStatement !== 'P = NP') return reject0('Registry.BoundaryTheorem', ['claimBoundary', 'publicTheoremStatement'], 'registry theorem statement mismatch');
  if (!sameArray0(registry.claimBoundary.remainingBlockers, [])) return reject0('Registry.BoundaryBlockers', ['claimBoundary', 'remainingBlockers'], 'registry remaining blockers must be empty');
  if (!Array.isArray(registry.runs)) return reject0('Registry.Runs', ['runs'], 'registry runs must be an array');
  const seen = new Set();
  for (let i = 0; i < registry.runs.length; i += 1) {
    const run = registry.runs[i];
    if (!plain0(run) || typeof run.recordId !== 'string') return reject0('Registry.RunShape', ['runs', i], 'run must have recordId');
    if (seen.has(run.recordId)) return reject0('Registry.DuplicateRun', ['runs', i, 'recordId'], 'duplicate run record id', { recordId: run.recordId });
    seen.add(run.recordId);
  }
  return { tag: 'accept', runCount: registry.runs.length };
}

export function ImportPNPActivatedRunRecord0(registry, record, options = {}) {
  const registryCheck = ValidatePNPVerificationRunRegistry0(registry);
  if (registryCheck.tag === 'reject') return registryCheck;
  const recordCheck = ValidatePNPActivatedRunRecord0(record);
  if (recordCheck.tag === 'reject') return recordCheck;
  if (registry.runs.some((existing) => existing.recordId === record.recordId)) return reject0('ImportRun.DuplicateRecordId', ['runs', record.recordId], 'run record already exists');
  const attach = AttachPNPActivatedRunRecordDigests0(record);
  if (attach.tag === 'reject') return attach;
  const next = structuredClone0(registry);
  next.version = Number.isSafeInteger(next.version) ? next.version + 1 : 1;
  next.status = 'activated-verification-run-registry-imported';
  next.syncedOn = options.syncedOn ?? next.syncedOn;
  next.runs.push(attach.record);
  return {
    tag: 'accept',
    registry: next,
    importedRecordId: record.recordId,
    runCount: next.runs.length,
    normalizedDigests: attach.normalizedDigests,
    registrySha256: sha256Text0(stableStringify0(next)),
  };
}

async function main0() {
  const args = process.argv.slice(2);
  const mode = args.includes('--write') ? 'write' : 'check';
  const json = args.includes('--json');
  const compactArgs = args.filter((arg) => arg !== '--write' && arg !== '--check' && arg !== '--json');
  const recordPath = compactArgs[0];
  const registryPath = compactArgs[1] ?? REGISTRY_PATH;
  if (!recordPath) {
    const out = reject0('Cli.Usage', [], 'usage: node tools/import-pnp-verifier-run.mjs [--check|--write] [--json] <record.json> [registry.json]');
    console.error(JSON.stringify(out, null, 2));
    process.exit(2);
  }
  try {
    const [record, registry] = await Promise.all([readJsonFile0(recordPath), readJsonFile0(registryPath)]);
    const result = ImportPNPActivatedRunRecord0(registry, record);
    if (result.tag === 'accept' && mode === 'write') await writeFile(registryPath, `${JSON.stringify(result.registry, null, 2)}\n`, 'utf8');
    const rendered = JSON.stringify({ ...result, mode, recordPath, registryPath }, null, 2);
    if (json || result.tag === 'accept') console.log(rendered); else console.error(rendered);
    process.exit(result.tag === 'accept' ? 0 : 1);
  } catch (error) {
    const out = reject0('Cli.Exception', [], 'import command failed', normalizeError0(error));
    console.error(JSON.stringify(out, null, 2));
    process.exit(1);
  }
}

async function readJsonFile0(filePath) {
  const text = await readFile(filePath, 'utf8');
  return JSON.parse(text);
}
function reject0(coord, pathArray, reason, witness = {}) { return { tag: 'reject', kind: 'reject', checker: 'ImportPNPActivatedRunRecord0', coord, path: pathArray, witness: { reason, ...witness } }; }
function plain0(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function sameArray0(a, b) { return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => x === b[i]); }
function stableStringify0(value) { if (Array.isArray(value)) return `[${value.map(stableStringify0).join(',')}]`; if (plain0(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify0(value[key])}`).join(',')}}`; return JSON.stringify(value); }
function sha256Text0(text) { return createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex'); }
function structuredClone0(value) { return JSON.parse(JSON.stringify(value)); }
function normalizeError0(error) { return { name: error?.name ?? 'Error', message: error?.message ?? String(error), code: error?.code ?? null }; }
function validateVerdict0(verdict) { if (!plain0(verdict)) return reject0('RunRecord.VerdictShape', ['verdict'], 'verdict must be an object'); const exact = { tag: 'accept', publicTheoremEmissionAllowed: true, publicTheoremStatement: 'P = NP', publicTheoremConclusion: 'P = NP', finalTheoremReady: true, unrestrictedFinalSoundnessDischarged: true }; for (const [key, expected] of Object.entries(exact)) if (verdict[key] !== expected) return reject0('RunRecord.VerdictField', ['verdict', key], 'verdict field mismatch', { expected, actual: verdict[key] }); if (!sameArray0(verdict.remainingBlockers, [])) return reject0('RunRecord.VerdictBlockers', ['verdict', 'remainingBlockers'], 'verdict remaining blockers must be empty', { actual: verdict.remainingBlockers }); return { tag: 'accept' }; }
function validateActivatedStatus0(status) { if (!plain0(status)) return reject0('RunRecord.ActivatedStatusShape', ['activatedStatus'], 'activated status must be an object'); const exact = { kind: 'PNPActivatedStatus0', coordinate: ACTIVATED_STATUS_COORDINATE, publicTheoremActivationCoordinate: PUBLIC_ACTIVATION_COORDINATE, unrestrictedFinalSoundnessReleaseCoordinate: RELEASE_COORDINATE, externalReviewIsMathematicalPremise: false }; for (const [key, expected] of Object.entries(exact)) if (status[key] !== expected) return reject0('RunRecord.ActivatedStatusField', ['activatedStatus', key], 'activated status field mismatch', { expected, actual: status[key] }); return { tag: 'accept' }; }
function validateNormalizedDigests0(value) { if (!plain0(value)) return reject0('RunRecord.NormalizedDigestShape', ['normalizedDigests'], 'normalizedDigests must be an object'); if (value.policy !== 'PNPActivatedRunDigestNormalization0') return reject0('RunRecord.NormalizedDigestPolicy', ['normalizedDigests', 'policy'], 'normalized digest policy mismatch', { actual: value.policy }); for (const key of ['runRecordNormalizedSha256', 'verdictNormalizedSha256', 'activatedStatusNormalizedSha256', 'proofScriptOutputsNormalizedSha256', 'artifactsOrLogsNormalizedSha256']) if (typeof value[key] !== 'string' || !/^[0-9a-f]{64}$/u.test(value[key])) return reject0('RunRecord.NormalizedDigestHex', ['normalizedDigests', key], 'normalized digest must be lowercase SHA-256 hex', { actual: value[key] }); return { tag: 'accept' }; }

if (import.meta.url === `file://${process.argv[1]}`) main0();
