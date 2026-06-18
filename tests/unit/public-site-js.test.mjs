import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

for (const file of ['assets/main.js', 'assets/public-source-links.js']) {
  test(`${file} parses`, () => {
    const source = readFileSync(file, 'utf8');
    assert.doesNotThrow(() => new vm.Script(source));
  });
}
