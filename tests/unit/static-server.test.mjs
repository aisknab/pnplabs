import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createStaticServer } from '../../server.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

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

test('exact extensionless review routes redirect permanently to canonical HTML', async (t) => {
  const server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());

  const { port } = server.address();
  const aliases = new Map([
    ['/paper', '/paper.html'],
    ['/report', '/paper.html'],
    ['/status', '/status.html'],
    ['/verify', '/verify.html']
  ]);

  for (const [alias, canonical] of aliases) {
    const response = await fetch(`http://127.0.0.1:${port}${alias}?audit=1`, { redirect: 'manual' });
    assert.equal(response.status, 308, alias);
    assert.equal(response.headers.get('location'), `${canonical}?audit=1`, alias);
    assert.equal(response.headers.get('cache-control'), 'no-cache', alias);
    assert.match(response.headers.get('content-security-policy'), /default-src 'self'/, alias);

    const followed = await fetch(`http://127.0.0.1:${port}${alias}`);
    assert.equal(followed.status, 200, alias);
    assert.match(followed.headers.get('x-content-type-options'), /nosniff/, alias);
    assert.match(followed.headers.get('content-type'), /^text\/html/, alias);
  }
});

test('extensionless redirects remain exact and GET-or-HEAD only', async (t) => {
  const server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());

  const { port } = server.address();
  for (const pathname of ['/status/', '/Status', '/package']) {
    const response = await fetch(`http://127.0.0.1:${port}${pathname}`, { redirect: 'manual' });
    assert.equal(response.status, 404, pathname);
  }
  const canonical = await fetch(`http://127.0.0.1:${port}/report.html`, { redirect: 'manual' });
  assert.equal(canonical.status, 404);

  const post = await fetch(`http://127.0.0.1:${port}/status`, { method: 'POST', redirect: 'manual' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');

  const head = await fetch(`http://127.0.0.1:${port}/status?audit=1`, { method: 'HEAD', redirect: 'manual' });
  assert.equal(head.status, 308);
  assert.equal(head.headers.get('location'), '/status.html?audit=1');
  assert.equal(await head.text(), '');
});

test('server entry point starts when invoked through the deployment current symlink', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'pnplabs-server-main-symlink-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const current = path.join(root, 'current');
  await symlink(repositoryRoot, current, 'dir');

  const child = spawn(process.execPath, [path.join(current, 'server.mjs')], {
    cwd: root,
    env: { ...process.env, HOST: '127.0.0.1', PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  t.after(() => {
    if (child.exitCode === null) child.kill('SIGTERM');
  });

  const outcome = await Promise.race([
    once(child.stdout, 'data').then(([chunk]) => ({ output: chunk.toString('utf8') })),
    once(child, 'exit').then(([code]) => ({ exit: code })),
    new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), 3000))
  ]);
  assert.equal(outcome.timeout, undefined, 'symlinked server invocation timed out');
  assert.equal(outcome.exit, undefined, `symlinked server exited before listening with code ${outcome.exit}`);
  assert.match(outcome.output, /PNP Labs static site serving .* on http:\/\/127\.0\.0\.1:0/);
  child.kill('SIGTERM');
  await once(child, 'exit');
});

test('stable origin launcher can restart a legacy symlink-sensitive release during rollback', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'pnplabs-legacy-launcher-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const release = path.join(root, 'release');
  const current = path.join(root, 'current');
  await mkdir(release);
  await writeFile(path.join(release, 'server.mjs'), [
    "import { createServer } from 'node:http';",
    "import path from 'node:path';",
    "import { fileURLToPath } from 'node:url';",
    "const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);",
    "if (isMain) createServer((_req, res) => res.end('ok')).listen(0, '127.0.0.1', () => console.log('legacy listening'));",
    ''
  ].join('\n'));
  await symlink(release, current, 'dir');

  const direct = spawn(process.execPath, [path.join(current, 'server.mjs')], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let directOutput = '';
  direct.stdout.on('data', (chunk) => { directOutput += chunk.toString('utf8'); });
  const [directCode] = await once(direct, 'exit');
  assert.equal(directCode, 0);
  assert.equal(directOutput, '', 'legacy direct symlink invocation should reproduce the old no-listen bug');

  const launcher = path.join(repositoryRoot, 'deploy', 'pnplabs-origin-launcher');
  const launched = spawn(launcher, [current, process.execPath], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
  t.after(() => {
    if (launched.exitCode === null) launched.kill('SIGTERM');
  });
  const outcome = await Promise.race([
    once(launched.stdout, 'data').then(([chunk]) => ({ output: chunk.toString('utf8') })),
    once(launched, 'exit').then(([code]) => ({ exit: code })),
    new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), 3000))
  ]);
  assert.equal(outcome.timeout, undefined, 'legacy launcher timed out');
  assert.equal(outcome.exit, undefined, `legacy launcher exited before listening with code ${outcome.exit}`);
  assert.match(outcome.output, /legacy listening/);
  launched.kill('SIGTERM');
  await once(launched, 'exit');
});
