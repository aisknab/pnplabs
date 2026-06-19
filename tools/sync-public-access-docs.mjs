#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pnpDir = path.resolve(root, process.env.PNP_SOURCE_DIR || '../pnp');
const docsTag = 'final-pnp-proof-report-docs-hardened-7072f8d-public-access-sealed';
const oldDocsTag = 'final-pnp-proof-report-docs-hardened-7072f8d-sealed';
const sourceTag = 'final-pnp-proof-report-hardened-7072f8d';
const sourceCommit = '7072f8d0bda6d44d240f9bb3fad624fd357e1278';
const artifactTag = 'final-pnp-proof-report-artifacts-hardened-7072f8d-sealed';
const docsBundle = 'docs-release/public-access-7072f8d';
const repoUrl = 'https://github.com/aisknab/pnp';
const oldDocsCommit = '3ba356c79b545d2c734283bf10d85d0710de2b60';
const oldDocsTagObject = '9eeb4b85af1c04c43e6f086debcd3ac37d5d27d1';
const oldPdfSha = '53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d';
const oldTexSha = '414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7';
const fixedUtc = '2026-06-19T00:00:00Z';

function fail(message) {
  throw new Error(message);
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function json(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function git(...args) {
  return execFileSync('git', ['-C', pnpDir, ...args], { encoding: 'utf8' }).trim();
}

function replaceAllInFile(file, replacements) {
  let text = readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of replacements) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      changed = true;
    }
  }
  if (changed) writeFileSync(file, text);
  return changed;
}

function replaceRegex(file, expression, replacement, required = true) {
  const text = readFileSync(file, 'utf8');
  if (!expression.test(text)) {
    if (required) fail(`${file}: required pattern not found: ${expression}`);
    return false;
  }
  expression.lastIndex = 0;
  writeFileSync(file, text.replace(expression, replacement));
  return true;
}

function walk(dir, output = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else output.push(full);
  }
  return output;
}

if (!existsSync(path.join(pnpDir, '.git'))) fail(`PNP_SOURCE_DIR is not a git checkout: ${pnpDir}`);
git('fetch', '--tags', '--force');
const docsTagObject = git('rev-parse', docsTag);
const docsCommit = git('rev-parse', `${docsTag}^{commit}`);
const resolvedSourceCommit = git('rev-parse', `${sourceTag}^{commit}`);
if (resolvedSourceCommit !== sourceCommit) fail(`source tag resolves to ${resolvedSourceCommit}`);
if (git('rev-parse', `${artifactTag}^{commit}`) !== '9d1de19f827e5cb6880741352eb2349cbbb45994') {
  fail('sealed artefact tag commit changed');
}

const pnpSealPath = path.join(pnpDir, docsBundle, 'release-seal.json');
const pnpSeal = json(pnpSealPath);
if (pnpSeal.docsTag !== docsTag) fail('pnp documentation release seal has the wrong docs tag');
if (pnpSeal.sourceTag !== sourceTag || pnpSeal.sourceCommit !== sourceCommit) fail('pnp source identity mismatch');
if (pnpSeal.artifactTag !== artifactTag) fail('pnp artefact identity mismatch');

const pdfEntry = pnpSeal.files.find((entry) => entry.path === 'canonical_proof_report.pdf');
const texEntry = pnpSeal.files.find((entry) => entry.path === 'canonical_proof_report.tex');
if (!pdfEntry || !texEntry) fail('pnp documentation release seal is missing canonical report entries');

const pnpPdf = path.join(pnpDir, 'canonical_proof_report.pdf');
const pnpTex = path.join(pnpDir, 'canonical_proof_report.tex');
if (sha256(pnpPdf) !== pdfEntry.sha256 || statSync(pnpPdf).size !== pdfEntry.bytes) fail('pnp canonical PDF does not match its documentation release seal');
if (sha256(pnpTex) !== texEntry.sha256 || statSync(pnpTex).size !== texEntry.bytes) fail('pnp canonical TeX does not match its documentation release seal');

for (const target of ['downloads/canonical_proof_report.pdf', 'downloads/canonical-proof-report.pdf']) {
  copyFileSync(pnpPdf, target);
}
for (const target of ['downloads/canonical_proof_report.tex', 'downloads/canonical-proof-report.tex']) {
  copyFileSync(pnpTex, target);
}
copyFileSync(pnpSealPath, 'downloads/canonical-report-release.json');

const sourceManifestPath = 'downloads/source-checker-release.json';
const sourceManifest = json(sourceManifestPath);
sourceManifest.docsTag = docsTag;
sourceManifest.docsCommit = docsCommit;
sourceManifest.docsTagObject = docsTagObject;
sourceManifest.documentationRelease = {
  scope: pnpSeal.scope,
  path: `${docsBundle}/`,
  publicRepository: repoUrl,
  accessRequired: false,
  pdf: { path: 'canonical_proof_report.pdf', bytes: pdfEntry.bytes, sha256: pdfEntry.sha256 },
  tex: { path: 'canonical_proof_report.tex', bytes: texEntry.bytes, sha256: texEntry.sha256 },
};
writeJson(sourceManifestPath, sourceManifest);
const sourceManifestSha = sha256(sourceManifestPath);
const sourceManifestBytes = statSync(sourceManifestPath).size;

const auditTargetsPath = 'docs/audit_targets.json';
const auditTargets = json(auditTargetsPath);
if (!auditTargets.refs?.docsRef) fail('docs/audit_targets.json has no docsRef');
auditTargets.refs.docsRef.ref = docsTag;
auditTargets.refs.docsRef.expectedCommit = docsCommit;
auditTargets.refs.docsRef.expectedTagObject = docsTagObject;
writeJson(auditTargetsPath, auditTargets);

const replacements = [
  [oldDocsTag, docsTag],
  [oldDocsCommit, docsCommit],
  [oldDocsTagObject, docsTagObject],
  [oldPdfSha, pdfEntry.sha256],
  [oldTexSha, texEntry.sha256],
  ['If `aisknab/pnp` is private or unavailable to a reviewer, they cannot independently retrieve or run the source/checker validation until access is granted.', 'The source/checker repository is public and can be retrieved without an access request. Public availability does not establish checker soundness or theorem correctness.'],
  ['When an authorized sibling source/checker checkout exists', 'When a local sibling source/checker checkout exists'],
  ['when an authorized checkout is available', 'from a public clone at the pinned ref'],
  ['or source access for reviewers without repository access', 'or mathematical consensus'],
  ['The sibling `pnp` repository may be private or unavailable to an external reviewer.', 'The `pnp` repository is public; a local checkout may still be absent from a reviewer\'s machine.'],
  ['Request or locate the source/checker release named above.', 'Clone the public `aisknab/pnp` repository and check out the pinned source tag named above.'],
  ['Obtain and inspect the source/checker revision.', 'Clone and inspect the public pinned source/checker revision.'],
  ['Obtain the source/checker revision named in the report.', 'Clone `https://github.com/aisknab/pnp.git`, fetch tags, and check out the source/checker revision named in the report.'],
  ['Request the source/checker tag, release-documentation tag, and sealed artefact tag', 'Inspect the public source/checker tag, release-documentation tag, and sealed artefact tag'],
];

const textExtensions = new Set(['.md', '.html', '.js', '.mjs', '.json', '.yml', '.yaml', '.txt', '.xml']);
for (const file of walk(root)) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  if (relative.startsWith('downloads/canonical_proof_report.') || relative.startsWith('downloads/canonical-proof-report.')) continue;
  if (relative === 'downloads/release-seal.json' || relative === 'downloads/SHA256SUMS') continue;
  if (!textExtensions.has(path.extname(file)) && path.basename(file) !== 'SHA256SUMS') continue;
  replaceAllInFile(file, replacements);
}

const repoSourceUrl = `${repoUrl}/tree/${sourceTag}`;
const repoDocsUrl = `${repoUrl}/tree/${docsTag}`;
const repoArtifactUrl = `${repoUrl}/tree/${artifactTag}/proof-artifacts/final-pnp-proof-report-hardened-7072f8d`;

for (const page of ['index.html', 'paper.html', 'architecture.html', 'verify.html', 'faq.html', 'review.html']) {
  let text = readFileSync(page, 'utf8');
  if (!text.includes(`href="${repoUrl}"`)) {
    text = text.replace(
      '        <a href="verify.html">Verify</a>\n        <a href="review.html#contact">Review contact</a>',
      `        <a href="verify.html">Verify</a>\n        <a href="${repoUrl}">Source/checker</a>\n        <a href="review.html#contact">Review contact</a>`,
    );
  }
  writeFileSync(page, text);
}

let index = readFileSync('index.html', 'utf8');
if (!index.includes('Browse source/checker')) {
  index = index.replace(
    '<a class="btn primary" href="verify.html#seal-console">Check release files</a><a class="btn secondary" href="paper.html">Read the review guide</a>',
    `<a class="btn primary" href="verify.html#seal-console">Check release files</a><a class="btn secondary" href="${repoUrl}">Browse source/checker</a><a class="btn secondary" href="paper.html">Read the review guide</a>`,
  );
}
index = index.replace('Review contact and source repository access', 'Public source repository and pinned release tags');
index = index.replace('<a class="btn primary" href="review.html#contact">Request review packet</a>', `<a class="btn primary" href="${repoUrl}">Open public source</a>`);
writeFileSync('index.html', index);

let review = readFileSync('review.html', 'utf8');
review = review
  .replaceAll('Contact channels for independent technical review, current-status questions, source repository access, and security disclosure.', 'Public source links and contact channels for independent technical review, reproduction questions, current-status questions, and security disclosure.')
  .replace('Use these channels for technical review, source repository access, institutional coordination, current-status questions, and responsible security disclosure. External community verification has not yet been established.', 'The source/checker repository and pinned release tags are public. Use the links below for direct inspection, and use the contact channels for technical questions, institutional coordination, current-status questions, and responsible security disclosure. External community verification has not yet been established.')
  .replace('Current status, internal acceptance record, external verification status, review packet access, and public citation language.', 'Current status, internal acceptance record, external verification status, public source and release availability, and public citation language.')
  .replace('<h3>Review and source repository access</h3><p>For mathematical review, source repository access, reproduction help, or institutional review coordination.</p>', '<h3>Review questions and reproduction support</h3><p>For mathematical findings, checker questions, reproduction help, or institutional review coordination. Source access is public and requires no email approval.</p>');
if (!review.includes('id="public-source"')) {
  const section = `  <section id="public-source" class="section compact">\n    <div class="section-head"><div><div class="section-label">Public source</div><h2>Inspect the pinned release directly.</h2></div><p>No access request is required. Code, release documentation, and generated artefacts are published as separate immutable refs.</p></div>\n    <div class="grid three">\n      <article class="card"><h3>Source/checker</h3><p>Executable code and tests at the pinned source tag.</p><p><a class="btn ghost" href="${repoSourceUrl}">Open source tag</a></p></article>\n      <article class="card"><h3>Release documentation</h3><p>The revised canonical report, release seal, checksum ledger, and review handoff documents.</p><p><a class="btn ghost" href="${repoDocsUrl}">Open docs tag</a></p></article>\n      <article class="card"><h3>Generated artefacts</h3><p>Sealed checker records, release seal, and checksums for the unchanged generated bundle.</p><p><a class="btn ghost" href="${repoArtifactUrl}">Open artefact bundle</a></p></article>\n    </div>\n  </section>\n`;
  review = review.replace('  <section id="contact" class="section compact anchor-card">', `${section}  <section id="contact" class="section compact anchor-card">`);
}
review = review.replace(/<pre id="request-template">[\s\S]*?<\/pre>/, `<pre id="request-template">Subject: PNP Labs technical review or status question\n\nHello PNP Labs,\n\nI am reviewing the public PNP Labs P versus NP claim.\n\nPublic source: ${repoUrl}\nPinned ref or file: [source tag / docs tag / artefact tag / exact path]\nPurpose: [technical review / institutional assessment / status clarification / security]\nFinding or question: [include the exact theorem, checker, file, or reproduction step]\n\nPlease respond to the specific finding or question and identify any additional public audit coordinate that is relevant.\n\nRegards,\n[Name]</pre>`);
writeFileSync('review.html', review);

let verify = readFileSync('verify.html', 'utf8');
if (!verify.includes('Browse source/checker')) {
  verify = verify.replace('<a class="btn primary" href="#seal-console">Run browser file check</a><a class="btn secondary" href="downloads/canonical_proof_report.pdf">Download report</a>', `<a class="btn primary" href="#seal-console">Run browser file check</a><a class="btn secondary" href="${repoUrl}">Browse source/checker</a><a class="btn secondary" href="downloads/canonical_proof_report.pdf">Download report</a>`);
}
verify = verify.replace(/<tr><td><strong>Source access process<\/strong><\/td><td>[\s\S]*?<\/tr>/, `<tr><td><strong>Public source repository</strong></td><td><a href="${repoUrl}"><code>github.com/aisknab/pnp</code></a></td></tr>`);
if (!verify.includes('<strong>Release-documentation tag</strong>')) {
  verify = verify.replace(`<tr><td><strong>Source/checker commit</strong></td><td><code>${sourceCommit}</code></td></tr>`, `<tr><td><strong>Source/checker commit</strong></td><td><code>${sourceCommit}</code></td></tr>\n          <tr><td><strong>Release-documentation tag</strong></td><td><a href="${repoDocsUrl}"><code>${docsTag}</code></a></td></tr>`);
}
verify = verify.replace(/<pre id="regen-code">[\s\S]*?<\/pre>/, `<pre id="regen-code">git clone ${repoUrl}.git pnp-review\ncd pnp-review\ngit fetch --tags --force\n\ngit checkout ${docsTag}\nD=${docsBundle}\nsha256sum -c "$D/SHA256SUMS"\n\ngit checkout ${artifactTag}\nB=proof-artifacts/final-pnp-proof-report-hardened-7072f8d\nsha256sum -c "$B/SHA256SUMS"\nsha256sum -c "$B/SHA256SUMS.sha256"\n\ngit checkout ${sourceTag}\nnpm ci\nnpm run validate</pre>`);
if (!verify.includes('canonical-report-release.json')) {
  verify = verify.replace('<a class="pill" href="downloads/release-seal.json">release-seal.json</a>', '<a class="pill" href="downloads/canonical-report-release.json">canonical report release</a>\n      <a class="pill" href="downloads/release-seal.json">release-seal.json</a>');
}
writeFileSync('verify.html', verify);

let faq = readFileSync('faq.html', 'utf8');
if (!faq.includes('id="public-source-faq"')) {
  const details = `      <details id="public-source-faq"><summary>Where is the source/checker repository?</summary><p>The repository is public at <a href="${repoUrl}">github.com/aisknab/pnp</a>. Use the <a href="${repoSourceUrl}">source tag</a>, <a href="${repoDocsUrl}">documentation tag</a>, and <a href="${repoArtifactUrl}">artefact tag</a> for their separate audit surfaces. No access request is required.</p></details>\n`;
  faq = faq.replace('      <details><summary>Where do review requests and security disclosures go?</summary>', `${details}      <details><summary>Where do technical findings and security disclosures go?</summary>`);
}
faq = faq.replace('Technical review and source repository access requests go to <a href="mailto:review@pnplabs.com.au">review@pnplabs.com.au</a>.', 'Source access is public and requires no approval. Technical findings, reproduction questions, and review coordination go to <a href="mailto:review@pnplabs.com.au">review@pnplabs.com.au</a>.');
writeFileSync('faq.html', faq);

const siteSealPath = 'downloads/release-seal.json';
const siteSeal = json(siteSealPath);
siteSeal.generated_utc = fixedUtc;
siteSeal.documentation_tag = docsTag;
siteSeal.documentation_commit = docsCommit;
siteSeal.documentation_tag_object = docsTagObject;
siteSeal.public_source_repository = repoUrl;
siteSeal.source_access_required = false;
siteSeal.documentation_scope = pnpSeal.scope;

const canonicalFiles = new Map([
  ['downloads/canonical_proof_report.pdf', { bytes: pdfEntry.bytes, sha256: pdfEntry.sha256, role: 'canonical documentation-only revised report PDF' }],
  ['downloads/canonical-proof-report.pdf', { bytes: pdfEntry.bytes, sha256: pdfEntry.sha256, role: 'hyphenated alias for canonical documentation-only revised report PDF' }],
  ['downloads/canonical_proof_report.tex', { bytes: texEntry.bytes, sha256: texEntry.sha256, role: 'canonical documentation-only revised report TeX source' }],
  ['downloads/canonical-proof-report.tex', { bytes: texEntry.bytes, sha256: texEntry.sha256, role: 'hyphenated alias for canonical documentation-only revised report TeX source' }],
  [sourceManifestPath, { bytes: sourceManifestBytes, sha256: sourceManifestSha, role: 'source/checker and documentation release audit-target reference; file identity only' }],
  ['downloads/canonical-report-release.json', { bytes: statSync('downloads/canonical-report-release.json').size, sha256: sha256('downloads/canonical-report-release.json'), role: 'canonical report documentation release seal; provenance and file identity only' }],
]);

const existingByPath = new Map((siteSeal.files || []).map((entry) => [entry.path, entry]));
siteSeal.files = [];
for (const [file, data] of canonicalFiles) {
  siteSeal.files.push({ path: file, ...data });
  existingByPath.delete(file);
}
for (const entry of existingByPath.values()) siteSeal.files.push(entry);
writeJson(siteSealPath, siteSeal);
writeFileSync('downloads/SHA256SUMS', siteSeal.files.map((entry) => `${entry.sha256}  ${entry.path}`).join('\n') + '\n');

const newSourceManifestSha = sha256(sourceManifestPath);
if (newSourceManifestSha !== sourceManifestSha) fail('source manifest changed after site seal generation');

const expectedHashes = [
  ['downloads/canonical_proof_report.pdf', pdfEntry.sha256],
  ['downloads/canonical-proof-report.pdf', pdfEntry.sha256],
  ['downloads/canonical_proof_report.tex', texEntry.sha256],
  ['downloads/canonical-proof-report.tex', texEntry.sha256],
];
for (const [file, expected] of expectedHashes) {
  if (sha256(file) !== expected) fail(`${file}: copied hash mismatch`);
}

const stalePhrases = [
  'Source access process',
  'source repository access requests go to',
  'Review and source repository access',
  'request source repository access',
  'If `aisknab/pnp` is private',
  'when an authorized checkout is available',
];
for (const file of walk(root)) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  if (relative.startsWith('downloads/canonical_proof_report.') || relative.startsWith('downloads/canonical-proof-report.')) continue;
  if (!textExtensions.has(path.extname(file))) continue;
  const text = readFileSync(file, 'utf8');
  for (const phrase of stalePhrases) {
    if (text.includes(phrase)) fail(`${relative}: stale access wording remains: ${phrase}`);
  }
}

console.log(JSON.stringify({
  status: 'synced',
  docsTag,
  docsCommit,
  docsTagObject,
  pdfSha256: pdfEntry.sha256,
  pdfBytes: pdfEntry.bytes,
  texSha256: texEntry.sha256,
  texBytes: texEntry.bytes,
  sourceManifestSha256: sourceManifestSha,
  siteSealSha256: sha256(siteSealPath),
}, null, 2));
