import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import { PUBLIC_ROOT_PATHS } from '../../public-surface.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

test('every public HTML page offers one consistent audience-first navigation and update feed', async () => {
  const htmlPaths = PUBLIC_ROOT_PATHS.filter((relativePath) => relativePath.endsWith('.html'));
  const expectedNavigation = [
    ['index.html', 'Overview'],
    ['updates.html', 'Updates'],
    ['faq.html', 'FAQ'],
    ['status.html', 'Formal status'],
    ['review.html', 'Technical review'],
  ];

  for (const relativePath of htmlPaths) {
    const html = await read(relativePath);
    const navStart = html.indexOf('<nav id="nav"');
    const navEnd = html.indexOf('</nav>', navStart);
    assert.ok(navStart >= 0 && navEnd > navStart, `${relativePath}: main navigation`);
    const nav = html.slice(navStart, navEnd);
    let previous = -1;
    for (const [href, label] of expectedNavigation) {
      const position = nav.indexOf(`href="${href}">${label}</a>`);
      assert.ok(position > previous, `${relativePath}: ${label} is missing or out of order`);
      previous = position;
    }
    assert.match(html, /href="review\.html#contact">Contact<\/a>/u, relativePath);
    assert.match(html, /<link rel="alternate" type="application\/atom\+xml" title="PNP Labs milestone updates" href="https:\/\/pnplabs\.com\.au\/updates\.xml">/u, relativePath);
    assert.match(html, /href="updates\.xml"[^>]*>RSS\/Atom feed<\/a>/u, relativePath);
  }
});

test('plain-language orientation is static and available before technical depth', async () => {
  const [home, faq, review, paper, architecture, verify] = await Promise.all([
    read('index.html'), read('faq.html'), read('review.html'), read('paper.html'), read('architecture.html'), read('verify.html'),
  ]);

  assert.match(home, /Current result: P = NP is not established\./u);
  assert.match(home, /Latest machine-checked milestone/u);
  assert.match(home, /What does P versus NP ask\?/u);
  assert.match(home, /Start where the language suits you\./u);

  for (const question of [
    'Does this project prove that P equals NP?',
    'What is P versus NP?',
    'What does “machine-checked” mean?',
    'What does the 37% tracker mean?',
    'How can I follow new milestones?',
  ]) assert.ok(faq.includes(question), question);

  for (const route of ['Complexity theory and mathematics', 'Lean and formal methods', 'Reproducibility and artefacts']) {
    assert.ok(review.includes(route), route);
  }
  assert.match(paper, /The current 51-page report is generated from the compiled Lean inventory/u);
  assert.match(architecture, /See how Lean source becomes a public status report/u);
  assert.match(verify, /A quick browser check confirms that a report file matches its published hash/u);
  assert.match(verify, /id="reproduce"/u);
});

test('technical disclosures announce their controls and remain usable without JavaScript', async () => {
  const [home, status, updates, css] = await Promise.all([
    read('index.html'), read('status.html'), read('updates.html'), read('assets/styles.min.css'),
  ]);
  assert.match(home, /Show technical boundary/u);
  assert.match(home, /Hide technical boundary/u);
  assert.match(home, /<details class="boundary-panel"[^>]*>/u);
  assert.doesNotMatch(home, /<details class="boundary-panel"[^>]*\sopen(?:\s|=|>)/u);
  assert.match(status, /<details class="milestone-ledger">/u);
  assert.match(status, /Show all 54 formal milestone records/u);
  assert.match(updates, /<summary class="disclosure-summary"><span>Technical details<\/span>/u);
  assert.match(updates, /class="disclosure-chevron"/u);
  assert.match(css, /\.disclosure-summary\{[^}]*min-height:44px/u);
  assert.match(css, /summary:focus-visible/u);
  assert.match(css, /details\[open\]>summary \.disclosure-chevron\{transform:rotate\(180deg\)/u);
});

test('updates expose a provider-free feed and a clearly qualified progress estimate', async () => {
  const [updates, feed, svg] = await Promise.all([
    read('updates.html'), read('updates.xml'), read('assets/proof-progress.svg'),
  ]);
  assert.match(updates, /https:\/\/pnplabs\.com\.au\/updates\.xml/u);
  assert.match(updates, /data-copy="#feed-url"/u);
  assert.match(updates, /No email address or PNP Labs account is needed/u);
  assert.match(updates, /About 37% of the known formalisation work/u);
  assert.match(updates, /not a probability that the project is correct, a confidence score, or a mathematical claim/u);
  assert.match(feed, /<link rel="self" type="application\/atom\+xml" href="https:\/\/pnplabs\.com\.au\/updates\.xml"\/>/u);
  assert.match(svg, /37% ESTIMATED/u);
  assert.match(updates, /<progress[^>]+value="37"[^>]+aria-label="Estimated proof reconstruction progress: 37 percent"/u);
  assert.match(await read('index.html'), /alt="Estimated proof reconstruction progress: 37 percent"/u);
  assert.match(svg, /editorial · revisable/u);
});

test('shared JavaScript validates evidence but does not rewrite page meaning', async () => {
  const script = await read('assets/main.js');
  assert.match(script, /async function loadFormalPublication\(\)/u);
  for (const forbidden of [
    'ensureHomepageFormalReconstructionBoundary',
    'rewritePageHero',
    'insertAfterPageHero',
    'ensureStatusLink',
  ]) assert.doesNotMatch(script, new RegExp(forbidden, 'u'), forbidden);
});
