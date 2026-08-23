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

async function readJson(relativePath) {
  return JSON.parse(await read(relativePath));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

async function currentPublication() {
  const [updates, index, release, status, proofProgress] = await Promise.all([
    readJson('content/milestone-updates.json'),
    readJson('public/pnp-index.json'),
    readJson('downloads/formal-publication-release.json'),
    readJson('public/pnp-status.json'),
    readJson('public/pnp-proof-progress.json'),
  ]);
  return {
    historicalProgress: updates.entries.find((entry) => Number.isSafeInteger(entry.progressEstimatePercent)).progressEstimatePercent,
    proofProgress,
    counts: index.formalPublicationMilestoneCounts,
    milestoneRecordCount: status.formalPublicationMilestones.length,
    reportPages: release.artifacts.report.pageCount,
  };
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
  const { proofProgress, counts, reportPages } = await currentPublication();
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
    `Why did the progress figure change from 98% to about ${proofProgress.proofCompletion.percent}%?`,
    'How can I follow new milestones?',
  ]) assert.ok(faq.includes(question), question);
  assert.match(faq, /narrower scoped-row\/editorial measure/u);
  assert.match(faq, new RegExp(`${counts.earned} of ${counts.total} scoped publication rows earned`, 'u'));
  assert.match(faq, new RegExp(`risk-weighted proof completion estimate is ${proofProgress.proofCompletion.percent}%`, 'u'));
  assert.match(faq, /Neither 30% nor 98\.8% is confidence that P=NP is true/u);

  for (const route of ['Complexity theory and mathematics', 'Lean and formal methods', 'Reproducibility and artefacts']) {
    assert.ok(review.includes(route), route);
  }
  assert.match(paper, new RegExp(`The current ${reportPages}-page report is generated from the compiled Lean inventory`, 'u'));
  assert.match(paper, new RegExp(`${counts.earned} earned scoped milestones; ${counts.unearned} missing global milestones`, 'u'));
  assert.match(architecture, /See how Lean source becomes a public status report/u);
  assert.match(architecture, new RegExp(`Formal artefact coverage is ${counts.earned} of ${counts.total} scoped rows`, 'u'));
  assert.match(verify, /A quick browser check confirms that a report file matches its published hash/u);
  assert.match(verify, /id="reproduce"/u);
});

test('technical disclosures announce their controls and remain usable without JavaScript', async () => {
  const { milestoneRecordCount } = await currentPublication();
  const [home, status, updates, css] = await Promise.all([
    read('index.html'), read('status.html'), read('updates.html'), read('assets/styles.min.css'),
  ]);
  assert.match(home, /Show technical boundary/u);
  assert.match(home, /Hide technical boundary/u);
  assert.match(home, /<details class="boundary-panel"[^>]*>/u);
  assert.doesNotMatch(home, /<details class="boundary-panel"[^>]*\sopen(?:\s|=|>)/u);
  assert.match(status, /<details class="milestone-ledger">/u);
  assert.match(status, new RegExp(`Show all ${milestoneRecordCount} formal milestone records`, 'u'));
  assert.match(updates, /<summary class="disclosure-summary"><span>Technical details<\/span>/u);
  assert.match(updates, /class="disclosure-chevron"/u);
  assert.match(css, /\.disclosure-summary\{[^}]*min-height:44px/u);
  assert.match(css, /summary:focus-visible/u);
  assert.match(css, /details\[open\]>summary \.disclosure-chevron\{transform:rotate\(180deg\)/u);
});

test('updates expose a provider-free feed and two clearly separated progress metrics', async () => {
  const { historicalProgress, proofProgress } = await currentPublication();
  const progress = proofProgress.proofCompletion;
  const coverage = proofProgress.formalArtefactCoverage;
  const [home, updates, feed, svg, css, minCss] = await Promise.all([
    read('index.html'), read('updates.html'), read('updates.xml'), read('assets/proof-progress.svg'), read('assets/styles.css'), read('assets/styles.min.css'),
  ]);
  assert.match(updates, /https:\/\/pnplabs\.com\.au\/updates\.xml/u);
  assert.match(updates, /data-copy="#feed-url"/u);
  assert.match(updates, /No email address or PNP Labs account is needed/u);
  assert.match(updates, /Risk-weighted proof completion estimate/u);
  assert.match(updates, new RegExp(`${progress.percent}%`, 'u'));
  assert.match(updates, new RegExp(`Current uncertainty range:<\/strong> ${progress.uncertaintyLowPercent}% to ${progress.uncertaintyHighPercent}%`, 'u'));
  assert.match(updates, new RegExp(`${coverage.earnedRows} of ${coverage.totalRows}`, 'u'));
  assert.match(updates, /It is not proof completion/u);
  assert.match(updates, /not confidence that P=NP is true, a probability of success, or a time estimate/u);
  assert.match(feed, /<link rel="self" type="application\/atom\+xml" href="https:\/\/pnplabs\.com\.au\/updates\.xml"\/>/u);
  assert.match(svg, new RegExp(`${progress.percent}% ESTIMATE`, 'u'));
  assert.match(updates, new RegExp(`<progress[^>]+value="${progress.percent}"[^>]+aria-label="Risk-weighted proof completion estimate: ${progress.percent} percent; uncertainty ${progress.uncertaintyLowPercent} to ${progress.uncertaintyHighPercent} percent"`, 'u'));
  assert.match(svg, new RegExp(`uncertainty ${progress.uncertaintyLowPercent}% to ${progress.uncertaintyHighPercent}%`, 'u'));
  assert.match(home, /<aside class="home-progress-rail" aria-labelledby="home-progress-title" data-proof-progress-model=/u);
  assert.match(home, new RegExp(`role="img" aria-label="Risk-weighted proof completion estimate ${progress.percent} percent, with uncertainty from ${progress.uncertaintyLowPercent} to ${progress.uncertaintyHighPercent} percent"`, 'u'));
  assert.match(home, new RegExp(`data-proof-progress="${progress.percent}"`, 'u'));
  assert.doesNotMatch(home, /style="--proof-progress:/u);
  assert.match(home, /This is evidence-ledger coverage, not proof completion/u);
  assert.equal((home.match(/>Inspect the tracker<\/a>/gu) || []).length, 1);
  assert.doesNotMatch(home, /proof-progress-section/u);
  assert.match(css, /\.home-hero \.artifact-grid \{\s*grid-template-columns: minmax\(0, 880px\) minmax\(250px, 292px\)/u);
  assert.match(css, new RegExp(`\\.proof-tape-graphic \\{\\s*--proof-progress: ${progress.percent}%;\\s*--proof-progress-low: ${progress.uncertaintyLowPercent}%;\\s*--proof-progress-high: ${progress.uncertaintyHighPercent}%;`, 'u'));
  assert.match(minCss, new RegExp(`\\.proof-tape-graphic\\{--proof-progress:${progress.percent}%;--proof-progress-low:${progress.uncertaintyLowPercent}%;--proof-progress-high:${progress.uncertaintyHighPercent}%`, 'u'));
  assert.match(updates, new RegExp(`Superseded scoped-row/editorial estimate at publication:<\/strong> ${historicalProgress}%`, 'u'));
  assert.match(css, /\.proof-tape-scale span:nth-child\(2\) \{\s*bottom: var\(--proof-progress\)/u);
  assert.match(css, /@media \(max-width: 980px\)[\s\S]*\.proof-tape-fill \{[\s\S]*width: var\(--proof-progress\)/u);
  assert.match(css, /@media \(max-width: 980px\)[\s\S]*\.proof-tape-scale span:nth-child\(2\) \{[\s\S]*left: var\(--proof-progress\)/u);
  assert.match(css, /@media \(max-width: 520px\)[\s\S]*\.boundary-head \{[\s\S]*flex-direction: column/u);
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

test('browser report check derives the expected digest from the current release seal', async () => {
  const [verify, main, integrity] = await Promise.all([
    read('verify.html'),
    read('assets/main.js'),
    read('assets/report-integrity.js'),
  ]);
  assert.match(verify, /data-seal="downloads\/release-seal\.json"/u);
  assert.match(verify, /data-artifact="downloads\/canonical_proof_report\.pdf"/u);
  assert.match(verify, /data-seal-expected/u);
  assert.doesNotMatch(verify, /\bdata-expected=/u);
  assert.match(main, /import\('\.\/report-integrity\.js'\)/u);
  assert.match(integrity, /fetchPublishedArtifactIdentity/u);
  assert.match(integrity, /findReleaseArtifact/u);
  assert.match(integrity, /entry\.bytes/u);
  assert.match(integrity, /entry\.sha256/u);
});
