import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../../', import.meta.url);
const proofExecutables = /(?:^|[;&|]\s*)(?:lake|lean|elan)(?:\s|$)/u;

test('PNPLabs reuses the exact core proof evidence instead of rebuilding Lean', async () => {
  const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  for (const [name, command] of Object.entries(packageJson.scripts ?? {})) {
    assert.doesNotMatch(command, proofExecutables, `package script ${name}`);
  }

  const workflowDirectory = new URL('.github/workflows/', root);
  for (const entry of await readdir(workflowDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.ya?ml$/u.test(entry.name)) continue;
    const workflow = await readFile(new URL(entry.name, workflowDirectory), 'utf8');
    assert.doesNotMatch(workflow, /(?:^|\n)\s*(?:run:\s*)?(?:lake|lean|elan)\b/u, entry.name);
  }

  const toolDirectory = new URL('tools/', root);
  for (const entry of await readdir(toolDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(?:c?js|mjs)$/u.test(entry.name)) continue;
    const source = await readFile(new URL(entry.name, toolDirectory), 'utf8');
    assert.doesNotMatch(
      source,
      /(?:execFile|execFileSync|execSync|spawn|spawnSync)\s*\(\s*['"](?:lake|lean|elan)['"]/u,
      entry.name,
    );
  }

  const reproducibility = await readFile(new URL('docs/reproducibility.md', root), 'utf8');
  const reproducibilityProse = reproducibility.replace(/\s+/gu, ' ');
  assert.match(reproducibilityProse, /exact core merge owns Lean compilation and axiom evidence/u);
  assert.match(reproducibilityProse, /PNPLabs verifies the pinned source identity and byte-exact publication artifacts and does not rebuild Lean/u);
});
