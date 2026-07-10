import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { createStaticServer } from '../../server.mjs';

test('local server exposes current status and compiled inventory without caching', async (t) => {
  const server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());

  const { port } = server.address();
  for (const pathname of ['/status.html', '/public/pnp-status.json', '/public/pnp-theorem-inventory.json']) {
    const response = await fetch(`http://127.0.0.1:${port}${pathname}`);
    assert.equal(response.status, 200, pathname);
    assert.equal(response.headers.get('cache-control'), 'no-cache', pathname);
    assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
    assert.ok((await response.arrayBuffer()).byteLength > 0, pathname);
  }
});

test('local server keeps non-public repository files unavailable', async (t) => {
  const server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/package.json`);
  assert.equal(response.status, 403);
});

test('local server rejects symlink escapes and decoded backslash traversal', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'pnplabs-server-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'public'));
  await writeFile(path.join(root, '404.html'), 'not found');
  await symlink('/etc/hostname', path.join(root, 'public', 'leak.txt'));

  const server = createStaticServer({ root });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());

  const { port } = server.address();
  const leak = await fetch(`http://127.0.0.1:${port}/public/leak.txt`);
  assert.equal(leak.status, 403);
  const backslash = await fetch(`http://127.0.0.1:${port}/public/..%5Cserver.mjs`);
  assert.equal(backslash.status, 403);
});

test('encoded current scripts retain no-cache policy', async (t) => {
  const server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/assets/%6dain.js`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-cache');
});
