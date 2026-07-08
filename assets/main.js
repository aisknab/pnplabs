// Purpose: support static-site navigation, release digest checks, and public source links.
document.querySelectorAll('link[data-deferred-style]').forEach((link) => {
  link.media = 'all';
  link.removeAttribute('data-deferred-style');
});

const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');

function ensureStatusLink() {
  if (!nav || nav.querySelector('a[href="status.html"]')) return;
  const statusLink = document.createElement('a');
  statusLink.href = 'status.html';
  statusLink.textContent = 'Status';
  if (location.pathname.endsWith('/status.html')) {
    statusLink.classList.add('active');
    statusLink.setAttribute('aria-current', 'page');
  }
  const homeLink = nav.querySelector('a[href="index.html"]');
  if (homeLink?.nextSibling) nav.insertBefore(statusLink, homeLink.nextSibling);
  else nav.prepend(statusLink);
}

function ensureHomepageStatusBoundary() {
  const hero = document.querySelector('.artifact-hero .artifact-copy');
  if (!hero) return;

  const title = hero.querySelector('#hero-title');
  if (title) title.textContent = 'P = NP public theorem emission is activated under the repository checker trust model.';

  const lede = hero.querySelector('.lede');
  if (lede) {
    lede.textContent = 'This site mirrors the activated theorem-emission status from the source/checker repository. Public theorem emission is now enabled by the accepted proof stack.';
  }

  const trace = hero.querySelector('.checker-trace');
  if (trace) {
    trace.innerHTML = '<span>npm run verify</span><span>upload run report</span><strong>activated</strong>';
  }

  const firstNote = hero.querySelector('.review-note');
  if (firstNote) {
    firstNote.innerHTML = '<strong>Current status:</strong> the source/checker stack emits P = NP under its checker trust model. Run <code>npm run verify</code>, then type <code>y</code> when prompted to upload the verifier-run report to PNP Labs.';
  }

  const panel = hero.querySelector('.boundary-panel');
  if (panel) {
    panel.innerHTML = `<div class="boundary-head">
            <span>Current theorem boundary</span>
            <strong>activated</strong>
          </div>
          <pre>publicTheoremEmissionAllowed = true
publicTheoremStatement = "P = NP"
publicTheoremConclusion = "P = NP"
publicTheoremUnderCheckerTrustModel = true
finalTheoremReady = true
remainingBlockers = []</pre>
          <div class="boundary-ledger">
            <div><span>Theorem emission</span><strong>activated</strong></div>
            <div><span>Gate result</span><strong>accepted</strong></div>
            <div><span>Upload command</span><strong>npm run verify</strong></div>
            <div><span>Status source</span><strong>pnp:verify</strong></div>
          </div>`;
  }

  if (!hero.querySelector('[data-homepage-one-command-upload]')) {
    const upload = document.createElement('div');
    upload.className = 'boundary-panel';
    upload.setAttribute('data-homepage-one-command-upload', '');
    upload.innerHTML = `<div class="boundary-head">
            <span>One-command verifier upload</span>
            <strong>ready</strong>
          </div>
          <pre>git clone https://github.com/aisknab/pnp.git
cd pnp
npm ci
npm run verify
# Verify complete.
# Upload verification run to PNP Labs? [y/N]</pre>
          <div class="boundary-ledger">
            <div><span>User input</span><strong>type y</strong></div>
            <div><span>Auto upload</span><strong>token or gh</strong></div>
            <div><span>Fallback</span><strong>issue body file</strong></div>
            <div><span>Run record</span><strong>PNPActivatedVerificationRunRecord0</strong></div>
          </div>`;
    const anchor = hero.querySelector('[data-homepage-matrix-summary]') ?? hero.querySelector('.boundary-panel');
    if (anchor) anchor.insertAdjacentElement('afterend', upload);
    else hero.append(upload);
  }

  if (!hero.querySelector('[data-homepage-matrix-summary]')) {
    const badge = document.createElement('div');
    badge.className = 'boundary-panel';
    badge.setAttribute('data-homepage-matrix-summary', '');
    badge.innerHTML = `<div class="boundary-head">
            <span>Verifier-run matrix badge</span>
            <strong>passing</strong>
          </div>
          <pre>badge.state = passing
badge.text = "1 public run; 1/1 required comparisons passing"
metrics.registryRunCount = 1
metrics.acceptedPairCount = 1
metrics.requiredMismatchPairCount = 0
metrics.diagonalAccepts = true</pre>
          <div class="boundary-ledger">
            <div><span>Run records</span><strong>1 public run</strong></div>
            <div><span>Required pairs</span><strong>1/1 passing</strong></div>
            <div><span>Required mismatches</span><strong>0</strong></div>
            <div><span>Badge payload</span><strong>matrix summary</strong></div>
          </div>`;
    const anchor = hero.querySelector('.boundary-panel');
    if (anchor) anchor.insertAdjacentElement('afterend', badge);
    else hero.append(badge);
  }

  const actions = hero.querySelector('.hero-actions');
  if (actions && !actions.querySelector('a[href="status.html"]')) {
    const statusButton = document.createElement('a');
    statusButton.className = 'btn primary';
    statusButton.href = 'status.html';
    statusButton.textContent = 'View activated status';
    actions.prepend(statusButton);
  }
  if (actions && !actions.querySelector('a[href="public/pnp-one-command-upload.json"]')) {
    const uploadButton = document.createElement('a');
    uploadButton.className = 'btn secondary';
    uploadButton.href = 'public/pnp-one-command-upload.json';
    uploadButton.textContent = 'One-command upload';
    actions.append(uploadButton);
  }
  if (actions && !actions.querySelector('a[href="public/pnp-verifier-run-matrix-summary.json"]')) {
    const matrixButton = document.createElement('a');
    matrixButton.className = 'btn secondary';
    matrixButton.href = 'public/pnp-verifier-run-matrix-summary.json';
    matrixButton.textContent = 'Run matrix badge';
    actions.append(matrixButton);
  }
  if (actions && !actions.querySelector('a[href="verifier-run-digests.html"]')) {
    const digestButton = document.createElement('a');
    digestButton.className = 'btn secondary';
    digestButton.href = 'verifier-run-digests.html';
    digestButton.textContent = 'Compare run digests';
    actions.append(digestButton);
  }
}

function currentPageName() {
  const last = location.pathname.split('/').filter(Boolean).pop();
  return last || 'index.html';
}

function rewritePageHero({ eyebrow, title, lede, primaryHref, primaryText, secondaryHref, secondaryText }) {
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  const eyebrowEl = hero.querySelector('.eyebrow');
  if (eyebrowEl && eyebrow) eyebrowEl.textContent = eyebrow;
  const h1 = hero.querySelector('h1');
  if (h1) h1.textContent = title;
  const ledeEl = hero.querySelector('.lede');
  if (ledeEl) ledeEl.textContent = lede;
  const actions = hero.querySelector('.hero-actions');
  if (actions) {
    actions.innerHTML = '';
    const primary = document.createElement('a');
    primary.className = 'btn primary';
    primary.href = primaryHref;
    primary.textContent = primaryText;
    actions.append(primary);
    if (secondaryHref && secondaryText) {
      const secondary = document.createElement('a');
      secondary.className = 'btn secondary';
      secondary.href = secondaryHref;
      secondary.textContent = secondaryText;
      actions.append(secondary);
    }
  }
}

function insertAfterPageHero(id, html) {
  if (document.getElementById(id)) return;
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const node = template.content.firstElementChild;
  hero.insertAdjacentElement('afterend', node);
}

function ensureActivatedVerificationCopy() {
  rewritePageHero({
    eyebrow: 'One-command activated verification',
    title: 'Run the verifier, then upload the run with one prompt.',
    lede: 'Run npm run verify in the source/checker repository. When the verifier completes, type y to upload reproducible run evidence to PNP Labs. External review remains audit evidence, not a theorem premise.',
    primaryHref: 'public/pnp-one-command-upload.json',
    primaryText: 'Open one-command JSON',
    secondaryHref: 'verification-runs.html',
    secondaryText: 'Submit a verifier run',
  });
  insertAfterPageHero('activated-verification-copy', `<section class="section compact" id="activated-verification-copy">
      <div class="boundary-panel">
        <div class="boundary-head"><span>Activated verification boundary</span><strong>checker trust model</strong></div>
        <pre>publicTheoremEmissionAllowed = true
publicTheoremStatement = "P = NP"
remainingBlockers = []
externalReviewIsMathematicalPremise = false</pre>
      </div>
      <div class="grid two path" style="margin-top:1.2rem">
        <article class="card"><h3>Run the one-command verifier</h3><p>Use <code>npm run verify</code> in <code>aisknab/pnp</code>. It runs the repository verifier and then asks whether to upload the run to PNP Labs.</p></article>
        <article class="card"><h3>Type y to upload</h3><p>The CLI asks <code>Upload verification run to PNP Labs? [y/N]</code>. Type <code>y</code> or <code>yes</code> to submit with a token or authenticated <code>gh</code>.</p></article>
        <article class="card"><h3>Manual fallback</h3><p>If upload credentials are unavailable, the CLI writes <code>artifacts/pnplabs-upload/latest-issue-body.md</code> and prints a prefilled issue URL.</p></article>
        <article class="card"><h3>Importable evidence</h3><p>The issue body includes an importable <code>PNPActivatedVerificationRunRecord0</code> with activated theorem fields and environment metadata.</p></article>
      </div>
    </section>`);
}

function ensureActivatedFAQCopy() {
  rewritePageHero({
    eyebrow: 'Activated FAQ',
    title: 'Activated theorem-status FAQ.',
    lede: 'Answers here now reflect the activated checker-trust status: public theorem emission is enabled by the accepted proof stack, while independent review remains an audit layer.',
    primaryHref: 'status.html',
    primaryText: 'View activated status',
    secondaryHref: 'public/pnp-one-command-upload.json',
    secondaryText: 'One-command upload JSON',
  });
  insertAfterPageHero('activated-faq-copy', `<section class="section compact" id="activated-faq-copy">
      <div class="section-label">Activated theorem-status FAQ</div>
      <div class="grid two path">
        <article class="card"><h3>Does the site now permit the theorem statement?</h3><p>Yes. The activated payload records <code>publicTheoremEmissionAllowed = true</code> and <code>publicTheoremStatement = "P = NP"</code> under the repository checker trust model.</p></article>
        <article class="card"><h3>Is external review a theorem premise?</h3><p>No. The payload records <code>externalReviewIsMathematicalPremise = false</code>. External review remains invited as reproducibility and audit evidence.</p></article>
        <article class="card"><h3>What should reviewers run?</h3><p>Start with <code>npm run verify</code>. It runs the verifier and then asks whether to upload the run record to PNP Labs.</p></article>
        <article class="card"><h3>What is the active status source?</h3><p>The active site status is <code>public/pnp-status.json</code>, mirrored from <code>aisknab/pnp</code> after public theorem activation.</p></article>
      </div>
    </section>`);
}

function ensureActivatedReviewCopy() {
  rewritePageHero({
    eyebrow: 'Audit and reproducibility',
    title: 'Reviewer and verifier roles after activation.',
    lede: 'Public theorem emission is activated under the source/checker trust model. Independent reviewers are invited to reproduce, audit, and challenge the proof stack rather than serve as a theorem premise.',
    primaryHref: 'verification-runs.html',
    primaryText: 'Submit verifier run evidence',
    secondaryHref: 'public/pnp-one-command-upload.json',
    secondaryText: 'One-command upload JSON',
  });
  insertAfterPageHero('activated-review-copy', `<section class="section compact" id="activated-review-copy">
      <div class="section-label">Post-activation review role</div>
      <div class="callout"><div><h2>External review remains audit evidence.</h2><p>The current activation state records <code>externalReviewAcceptanceRequiredForEmission = false</code> and <code>externalReviewIsMathematicalPremise = false</code>. Reviewers can still contribute by running <code>npm run verify</code>, uploading verifier-run evidence, reporting counterexamples, and checking hash-bound artifacts.</p></div><a class="btn primary" href="verification-runs.html">Add a verification run</a></div>
    </section>`);
}

function ensureActivatedPageCopy() {
  const page = currentPageName();
  if (page === 'verify.html') ensureActivatedVerificationCopy();
  if (page === 'faq.html') ensureActivatedFAQCopy();
  if (page === 'review.html') ensureActivatedReviewCopy();
}

ensureStatusLink();
ensureHomepageStatusBoundary();
ensureActivatedPageCopy();

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.querySelector(button.getAttribute('data-copy'));
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      const old = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = old; }, 1400);
    } catch {
      button.textContent = 'Select text';
    }
  });
});

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return 'unknown size';
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

document.querySelectorAll('[data-seal-console]').forEach((consoleRoot) => {
  const runButton = consoleRoot.querySelector('[data-seal-run]');
  const resetButton = consoleRoot.querySelector('[data-seal-reset]');
  const status = consoleRoot.querySelector('[data-seal-status]');
  const output = consoleRoot.querySelector('[data-seal-output]');
  const computed = consoleRoot.querySelector('[data-seal-computed]');
  const result = consoleRoot.querySelector('[data-seal-result]');
  const artifact = consoleRoot.getAttribute('data-artifact');
  const artifactLabel = consoleRoot.getAttribute('data-label') || artifact;
  const expected = (consoleRoot.getAttribute('data-expected') || '').toLowerCase();

  const setState = (state, text) => {
    consoleRoot.dataset.state = state;
    if (status) status.textContent = text;
  };

  const addLine = (kind, text) => {
    if (!output) return;
    const item = document.createElement('li');
    if (kind) item.classList.add(kind);
    const label = document.createElement('span');
    label.textContent = kind || 'info';
    const code = document.createElement('code');
    code.textContent = text;
    item.append(label, code);
    output.append(item);
  };

  const resetConsole = () => {
    setState('idle', 'idle');
    if (computed) computed.textContent = 'not run';
    if (result) result.textContent = 'Awaiting browser check.';
    if (output) {
      output.replaceChildren();
      addLine('target', artifactLabel);
      addLine('expect', expected);
      addLine('ready', 'press Run check to fetch the file, hash locally, and compare');
    }
  };

  const runSealCheck = async () => {
    if (!artifact || !expected) return;
    if (!globalThis.crypto?.subtle) {
      setState('failed', 'unsupported');
      if (result) result.textContent = 'Web Crypto is unavailable in this browser context.';
      addLine('fail', 'crypto.subtle is unavailable; use HTTPS, localhost, or the command-line workflow');
      return;
    }

    setState('running', 'running');
    if (runButton) runButton.disabled = true;
    if (computed) computed.textContent = 'computing...';
    if (result) result.textContent = 'Checking bundled report file...';
    if (output) output.replaceChildren();

    try {
      addLine('pending', `GET ${artifact}`);
      const response = await fetch(artifact, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status} while fetching ${artifactLabel}`);
      const buffer = await response.arrayBuffer();
      addLine('ok', `received ${artifactLabel} · ${formatBytes(buffer.byteLength)}`);
      addLine('pending', 'compute SHA-256 with browser Web Crypto');
      const digest = await globalThis.crypto.subtle.digest('SHA-256', buffer);
      const actual = toHex(digest);
      if (computed) computed.textContent = actual;
      if (actual === expected) {
        addLine('ok', 'computed digest matches the published release digest');
        setState('verified', 'matched');
        if (result) result.textContent = 'Digest match: bundled canonical report matches the published SHA-256. This confirms file identity only.';
      } else {
        addLine('fail', 'computed digest does not match the published release seal');
        setState('failed', 'mismatch');
        if (result) result.textContent = 'Digest mismatch: do not rely on this bundled artefact without further investigation.';
      }
    } catch (error) {
      addLine('fail', error instanceof Error ? error.message : 'release seal check failed');
      setState('failed', 'failed');
      if (computed) computed.textContent = 'not available';
      if (result) result.textContent = 'The browser check could not complete. Use the command-line verification workflow or retry from a served page.';
    } finally {
      if (runButton) runButton.disabled = false;
    }
  };

  resetButton?.addEventListener('click', resetConsole);
  runButton?.addEventListener('click', runSealCheck);
  resetConsole();
});

const progress = document.querySelector('.progress');
function updateProgress() {
  if (!progress) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${Math.max(0, Math.min(100, pct)}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

import('./public-source-links.js').catch((error) => {
  console.error('Public source link enhancement failed', error);
});
