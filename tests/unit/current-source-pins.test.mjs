import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CURRENT_SOURCE_PIN_PAGES, currentSourcePinOutputs } from '../../tools/render-current-publication.mjs';

const oldCommit = 'a'.repeat(40), currentCommit = 'b'.repeat(40), historicalCommit = 'c'.repeat(40);
const index = { sourceCommitRef: currentCommit };
const historical = 'Historical source: https://github.com/aisknab/pnp/tree/' + historicalCommit + '\nnpm ci\n';
const commands = 'npm run formal:progress\nnpm run formal:inventory:check\nnpm run validate\nnpm run report:check';
function fixture() {
  return new Map([
    ['README.md', '```bash\ngit clone https://github.com/aisknab/pnp.git\ncd pnp\ngit checkout '
      + oldCommit + '\nnpm ci\n' + commands + '\n```\n' + historical],
    ['verify.html', '<tr data-current-source><td>Current public source</td><td>' + oldCommit + '</td></tr>\n'
      + '<pre id="regen-code">git clone https://github.com/aisknab/pnp.git pnp-review\ncd pnp-review\ngit checkout '
      + oldCommit + '\nnpm ci\n' + commands + '</pre>\n' + historical],
    ['docs/terminology_crosswalk.md', ['status/FORMAL_RECONSTRUCTION_STATUS.json', 'docs/FORMAL_RECONSTRUCTION.md']
      .map(target => '> [' + String.fromCharCode(96) + target + String.fromCharCode(96)
        + '](https://github.com/aisknab/pnp/blob/' + oldCommit + '/' + target + ')').join('\n') + '\n' + historical],
  ]);
}

test('current source pins follow the release index and preserve history and commands', () => {
  const sources = fixture(), originals = new Map(sources);
  const outputs = currentSourcePinOutputs(sources, index);
  assert.deepEqual([...outputs.keys()], CURRENT_SOURCE_PIN_PAGES);
  assert.deepEqual(sources, originals, 'input sources must not be mutated');
  for (const [file, text] of outputs) {
    assert.ok(text.includes(currentCommit), file);
    assert.ok(!text.includes(oldCommit), file);
    assert.ok(text.endsWith(historical), file + ': preserve historical installs and source pins');
    assert.equal((text.match(/npm ci/gu) ?? []).length, 1, file + ': remove only the current obsolete install');
    if (file !== 'docs/terminology_crosswalk.md') assert.ok(text.includes(commands), file);
  }
  assert.equal((outputs.get('verify.html').match(new RegExp(currentCommit, 'gu')) ?? []).length, 3);
  assert.deepEqual(currentSourcePinOutputs(outputs, index), outputs, 'generation must be idempotent');
});

test('invalid release coordinates and missing current pages fail closed', () => {
  for (const value of [undefined, '', 'main', 'abc1234', 'A'.repeat(40), currentCommit + '\n']) {
    assert.throws(() => currentSourcePinOutputs(fixture(), { sourceCommitRef: value }), /full commit/u);
  }
  for (const file of CURRENT_SOURCE_PIN_PAGES) {
    const sources = fixture(); sources.delete(file);
    assert.throws(() => currentSourcePinOutputs(sources, index), /surface missing/u, file);
  }
});

test('missing or duplicated current pin regions fail closed', () => {
  for (const [file, pattern] of [
    ['README.md', /```bash\ngit clone[\s\S]*?npm run formal:progress\n/u],
    ['verify.html', /<tr data-current-source>[\s\S]*?<\/tr>/u],
    ['verify.html', /<pre id="regen-code">[\s\S]*?npm run formal:progress\n/u],
    ['docs/terminology_crosswalk.md', /> \[[^\n]+STATUS\.json\)/u],
    ['docs/terminology_crosswalk.md', /> \[[^\n]+RECONSTRUCTION\.md\)/u],
  ]) {
    const source = fixture().get(file), matched = source.match(pattern)?.[0];
    assert.ok(matched, file + ': test targets a real current region');
    for (const replacement of ['', matched + matched]) {
      const sources = fixture(); sources.set(file, source.replace(pattern, replacement));
      assert.throws(() => currentSourcePinOutputs(sources, index), /expected one current region/u, file);
    }
  }
});

test('checked-in current pin pages are generated from the active release pin', async () => {
  const root = new URL('../../', import.meta.url);
  const activeIndex = JSON.parse(await readFile(new URL('public/pnp-index.json', root), 'utf8'));
  const sources = new Map(await Promise.all(CURRENT_SOURCE_PIN_PAGES.map(async file =>
    [file, await readFile(new URL(file, root), 'utf8')])));
  assert.deepEqual(currentSourcePinOutputs(sources, activeIndex), sources);
});
