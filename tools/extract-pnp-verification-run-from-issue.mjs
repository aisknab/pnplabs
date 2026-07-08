#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { ValidatePNPActivatedRunRecord0 } from './import-pnp-verifier-run.mjs';

const DEFAULT_OUTPUT_DIR0 = 'imports/pnp-verifier-runs';

export function ExtractPNPActivatedRunRecordFromIssueBody0(body) {
  if (typeof body !== 'string' || body.trim().length === 0) return reject0('IssueBody.Empty', [], 'issue body must be a non-empty string');
  const candidates = [];
  for (const match of body.matchAll(/```(?:json)?\s*\n([\s\S]*?)\n```/gu)) candidates.push(match[1]);
  if (candidates.length === 0) return reject0('IssueBody.NoFencedBlocks', [], 'issue body contains no fenced blocks');
  const parseErrors = [];
  for (let i = 0; i < candidates.length; i += 1) {
    const text = candidates[i].trim();
    if (!text.includes('PNPActivatedVerificationRunRecord0')) continue;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.kind !== 'PNPActivatedVerificationRunRecord0') continue;
      const validated = ValidatePNPActivatedRunRecord0(parsed);
      if (validated.tag === 'accept') return { tag: 'accept', record: parsed, recordId: parsed.recordId, blockIndex: i };
      return reject0('IssueBody.InvalidRunRecord', ['fencedBlocks', i], 'found run record JSON but validation rejected it', { validation: validated });
    } catch (error) {
      parseErrors.push({ blockIndex: i, message: error?.message ?? String(error) });
    }
  }
  return reject0('IssueBody.NoRunRecord', [], 'no valid PNPActivatedVerificationRunRecord0 JSON block found', { parseErrors });
}

export function ExtractPNPActivatedRunRecordFromIssueEvent0(event) {
  if (!plain0(event)) return reject0('IssueEvent.Shape', [], 'issue event must be an object');
  const body = event.issue?.body;
  const out = ExtractPNPActivatedRunRecordFromIssueBody0(body);
  if (out.tag === 'reject') return out;
  return {
    ...out,
    issueNumber: event.issue?.number ?? null,
    issueUrl: event.issue?.html_url ?? null,
    issueTitle: event.issue?.title ?? null,
  };
}

export function BuildPNPVerifierRunImportPath0(record, outputDir = DEFAULT_OUTPUT_DIR0) {
  if (!plain0(record) || typeof record.recordId !== 'string') return reject0('ImportPath.RecordShape', ['recordId'], 'record must have recordId');
  const safe = record.recordId
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
  if (!safe || safe !== record.recordId.toLowerCase()) return reject0('ImportPath.UnsafeRecordId', ['recordId'], 'recordId must already be safe for a filename', { recordId: record.recordId, safe });
  return { tag: 'accept', path: path.posix.join(outputDir.replace(/\\/gu, '/').replace(/\/+$/u, ''), `${safe}.json`) };
}

export async function WritePNPVerifierRunImportCandidate0(record, outputDir = DEFAULT_OUTPUT_DIR0) {
  const importPath = BuildPNPVerifierRunImportPath0(record, outputDir);
  if (importPath.tag === 'reject') return importPath;
  await mkdir(path.dirname(importPath.path), { recursive: true });
  await writeFile(importPath.path, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  return { tag: 'accept', recordId: record.recordId, path: importPath.path };
}

async function main0() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const compactArgs = args.filter((arg) => !arg.startsWith('--'));
  const eventPath = compactArgs[0];
  const outputDir = compactArgs[1] ?? DEFAULT_OUTPUT_DIR0;
  if (!eventPath) {
    const out = reject0('Cli.Usage', [], 'usage: node tools/extract-pnp-verification-run-from-issue.mjs [--json] <github-event.json> [output-dir]');
    console.error(JSON.stringify(out, null, 2));
    process.exit(2);
  }
  try {
    const event = JSON.parse(await readFile(eventPath, 'utf8'));
    const extracted = ExtractPNPActivatedRunRecordFromIssueEvent0(event);
    if (extracted.tag === 'reject') throw new Error(JSON.stringify(extracted));
    const written = await WritePNPVerifierRunImportCandidate0(extracted.record, outputDir);
    if (written.tag === 'reject') throw new Error(JSON.stringify(written));
    await writeGitHubOutput0({ record_id: written.recordId, record_path: written.path, issue_number: String(extracted.issueNumber ?? '') });
    const result = { tag: 'accept', ...written, issueNumber: extracted.issueNumber, issueUrl: extracted.issueUrl };
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    const out = reject0('Cli.Exception', [], 'issue import extraction failed', { message: error?.message ?? String(error) });
    if (json) console.error(JSON.stringify(out, null, 2)); else console.error(out.witness.reason, out.witness.message);
    process.exit(1);
  }
}

async function writeGitHubOutput0(values) {
  if (!process.env.GITHUB_OUTPUT) return;
  const lines = Object.entries(values).map(([key, value]) => `${key}=${String(value).replace(/\n/gu, ' ')}`);
  await writeFile(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`, { flag: 'a' });
}

function reject0(coord, pathArray, reason, witness = {}) { return { tag: 'reject', checker: 'ExtractPNPVerificationRunFromIssue0', coord, path: pathArray, witness: { reason, ...witness } }; }
function plain0(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }

if (import.meta.url === `file://${process.argv[1]}`) main0();
