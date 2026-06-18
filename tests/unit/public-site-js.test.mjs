import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('public source enhancement parses', () => {
  const source = readFileSync('assets/public-source-links.js', 'utf8');
  assert.doesNotThrow(() => new vm.Script(source));
});
