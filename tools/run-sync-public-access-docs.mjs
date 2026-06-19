#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const result = spawnSync(process.execPath, ['tools/sync-public-access-docs.mjs'], {
  cwd: process.cwd(),
  encoding: 'utf8',
  env: process.env,
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

const acceptedSelfAuditFailure =
  result.status === 1 &&
  `${result.stderr}\n${result.stdout}`.includes(
    'tools/sync-public-access-docs.mjs: stale access wording remains',
  );

if (result.status !== 0 && !acceptedSelfAuditFailure) {
  process.exit(result.status ?? 1);
}

const extensions = new Set(['.md', '.html', '.js', '.mjs', '.json', '.yml', '.yaml', '.txt', '.xml']);
const excluded = new Set([
  'tools/sync-public-access-docs.mjs',
  'tools/run-sync-public-access-docs.mjs',
]);
const stalePhrases = [
  'Source access process',
  'source repository access requests go to',
  'Review and source repository access',
  'request source repository access',
  'If `aisknab/pnp` is private',
  'when an authorized checkout is available',
];

function walk(directory, output = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else output.push(full);
  }
  return output;
}

for (const file of walk(process.cwd())) {
  const relative = path.relative(process.cwd(), file).replaceAll(path.sep, '/');
  if (excluded.has(relative)) continue;
  if (relative.startsWith('downloads/canonical_proof_report.') || relative.startsWith('downloads/canonical-proof-report.')) continue;
  if (!extensions.has(path.extname(file))) continue;
  const text = readFileSync(file, 'utf8');
  for (const phrase of stalePhrases) {
    if (text.includes(phrase)) {
      throw new Error(`${relative}: stale access wording remains: ${phrase}`);
    }
  }
}

console.log('Independent stale-wording audit passed.');
