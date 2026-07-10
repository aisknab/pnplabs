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

const FAIL_CLOSED_FORMAL_STATUS = Object.freeze({
  status: 'formal-reconstruction-in-progress',
  mathematicalTheoremEstablished: false,
  publicTheoremEmissionAllowed: false,
  publicTheoremStatement: null,
  finalTheoremReady: false,
  rootLeanTheoremPresent: false,
  rootLeanTheoremBuilt: false,
  rootLeanTheoremAxiomAuditPassed: false,
  projectSpecificAxiomsRemaining: true,
});

function formalStatusFields(payload) {
  return `status = "${payload.status}"
mathematicalTheoremEstablished = ${payload.mathematicalTheoremEstablished}
publicTheoremEmissionAllowed = ${payload.publicTheoremEmissionAllowed}
publicTheoremStatement = ${payload.publicTheoremStatement === null ? 'null' : JSON.stringify(payload.publicTheoremStatement)}
finalTheoremReady = ${payload.finalTheoremReady}
rootLeanTheoremPresent = ${payload.rootLeanTheoremPresent}
rootLeanTheoremBuilt = ${payload.rootLeanTheoremBuilt}
rootLeanTheoremAxiomAuditPassed = ${payload.rootLeanTheoremAxiomAuditPassed}
projectSpecificAxiomsRemaining = ${payload.projectSpecificAxiomsRemaining}`;
}

function isConservativeFormalStatus(payload) {
  return payload?.kind === 'PNPFormalReconstructionStatus0'
    && payload.coordinate === 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-04'
    && payload.status === 'formal-reconstruction-in-progress'
    && payload.currentStatusAuthority === true
    && payload.mathematicalTheoremEstablished === false
    && payload.publicTheoremEmissionAllowed === false
    && payload.publicTheoremStatement === null
    && payload.publicTheoremConclusion === null
    && payload.finalTheoremReady === false
    && payload.rootLeanTheoremPresent === false
    && payload.rootLeanTheoremBuilt === false
    && payload.rootLeanTheoremAxiomAuditPassed === false
    && payload.projectSpecificAxiomsRemaining === true
    && payload.leanToolchain === 'leanprover/lean4:v4.31.0'
    && payload.leanCompilerVersion === '4.31.0'
    && payload.leanCompilerCommit === '68218e876d2a38b1985b8590fff244a83c321783'
    && payload.lakeVersion === '5.0.0-src+68218e8'
    && payload.elanVersion === '4.2.3'
    && payload.elanReleaseCommit === 'b6cec7e10fe4965a605aaf60d1cb4a5837f0462b'
    && payload.elanArchiveSha256 === 'df0b2b3a439961ffcbb3985214365ffe40f49bc871df04dff268c7d8e21ca8b2'
    && payload.leanBuildTarget === 'PNP'
    && payload.leanRootModule === 'PNP'
    && payload.leanRootStatusDeclaration === 'PNP.Main.rootTheoremStatus'
    && payload.leanBuildConfigurationPinned === true
    && payload.explicitLeanRootTargetPresent === true
    && payload.leanLibraryTargetBuilt === true
    && payload.leanSourcePlaceholderAuditPassed === true
    && payload.leanNANDDirectWireCoreFormalized === true
    && payload.leanNANDDirectWireCoreAxiomAuditPassed === true
    && payload.leanNANDEnumeratorFormalized === false
    && payload.leanNANDMinimumAndSlackFormalized === false
    && payload.leanCompatibleReplacementFormalized === false
    && payload.leanGlobalSlackLawFormalized === false
    && payload.leanLockedNANDBuilderFormalized === false
    && payload.leanLockedNANDThresholdFormalized === false
    && payload.sorryOrAdmitInRootDependencyClosure === null
    && JSON.stringify(payload.projectSpecificAxiomInventory) === JSON.stringify([
      'PNP.SAT',
      'PNP.LockedNANDThreshold',
      'PNP.ResidualBandExactMinimization',
      'PNP.GeneratePCCPack',
      'PNP.CheckPCCPackexp',
    ])
    && JSON.stringify(payload.remainingBlockers) === JSON.stringify([
      'Formal.ConcreteComplexityModel',
      'Formal.ConcreteSAT',
      'Formal.LockedNANDThreshold',
      'Formal.ResidualBandMinimizer',
      'Formal.ZeroSlack',
      'Formal.PolynomialRuntimeAndCertificateBounds',
      'Formal.RootTheoremAndAxiomAudit',
    ])
    && JSON.stringify(payload.verificationCommands) === JSON.stringify([
      'node pcc-formal-reconstruction-status0.mjs --json',
      'node pcc-formal-public-surface0.mjs --json',
      'npm run legacy:v0:check',
      'npm run pnp:verify -- --no-write',
      'node --test audits/lean-root-target0.test.mjs',
      'node --test audits/lean-nand-semantics0.test.mjs',
      'lake build PNP',
      'lake env lean -DwarningAsError=true lean-audit/PNPBridgeAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPNANDSemanticsAxiomAudit.lean',
    ])
    && payload.publicSurfaceBaselineCoordinate === 'PUBLIC-SURFACE-BASELINE-2026-07-10-NAND-SEMANTICS-04'
    && payload.nonClaims?.includes('The formalized direct-wire NAND semantics does not prove enumeration, minimum size, replacement/slack, the locked NAND builder, its threshold, SAT, or P = NP.');
}

function renderFormalStatus(root, payload, sourceState) {
  root.dataset.statusState = sourceState;
  const label = root.querySelector('[data-formal-status-label]');
  const fields = root.querySelector('[data-formal-status-fields]');
  const note = root.querySelector('[data-formal-status-note]');
  if (label) label.textContent = 'not established';
  if (fields) fields.textContent = formalStatusFields(payload);
  if (note) {
    note.innerHTML = sourceState === 'authoritative-mirror'
      ? '<strong>Status loaded:</strong> the exact conservative mirror is available. The target theorem remains unestablished and theorem emission remains disabled.'
      : '<strong>Status unavailable:</strong> the page remains fail closed. It does not infer theorem establishment or theorem-emission permission from missing, malformed, or stale data.';
  }
}

async function loadFormalReconstructionStatus() {
  const roots = [...document.querySelectorAll('[data-formal-status-root]')];
  if (roots.length === 0) return;
  roots.forEach((root) => renderFormalStatus(root, FAIL_CLOSED_FORMAL_STATUS, 'fail-closed'));
  try {
    const response = await fetch('public/pnp-status.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status} while fetching current PNP status`);
    const payload = await response.json();
    if (!isConservativeFormalStatus(payload)) throw new Error('current PNP status failed conservative boundary validation');
    roots.forEach((root) => renderFormalStatus(root, payload, 'authoritative-mirror'));
  } catch (error) {
    console.error('PNP status load failed closed', error);
  }
}

function ensureHomepageFormalReconstructionBoundary() {
  const hero = document.querySelector('.artifact-hero .artifact-copy');
  if (!hero) return;

  const title = hero.querySelector('#hero-title');
  if (title) title.textContent = 'The repository does not currently establish P = NP.';

  const lede = hero.querySelector('.lede');
  if (lede) {
    lede.textContent = 'The pinned Lean PNP library root now includes an axiom-free typed direct-wire NAND semantics core. Enumeration and the proof route remain unfinished; the concrete root theorem does not exist, and five project-specific axioms remain.';
  }

  const trace = hero.querySelector('.checker-trace');
  if (trace) {
    trace.innerHTML = '<span>NAND semantics checked</span><span>enumeration and proof route</span><strong>in progress</strong>';
  }

  const firstNote = hero.querySelector('.review-note');
  if (firstNote) {
    firstNote.innerHTML = '<strong>Current status:</strong> the typed direct-wire NAND syntax, evaluation, output wiring, and small examples are axiom-free. This does not provide the enumerator, minimum, replacement/slack route, locked builder or threshold, SAT, or <code>PNP.Main.p_eq_np</code>; five project-specific axioms remain.';
  }

  hero.querySelectorAll('[data-homepage-matrix-summary], [data-homepage-one-command-upload]').forEach((element) => element.remove());
  const actions = hero.querySelector('.hero-actions');
  if (actions) {
    actions.querySelectorAll('a[href="public/pnp-one-command-upload.json"], a[href="public/pnp-verifier-run-matrix-summary.json"], a[href="verifier-run-digests.html"]').forEach((link) => link.remove());
    if (!actions.querySelector('a[href="status.html"]')) {
      const statusButton = document.createElement('a');
      statusButton.className = 'btn primary';
      statusButton.href = 'status.html';
      statusButton.textContent = 'View current status';
      actions.prepend(statusButton);
    }
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

function ensureFormalVerificationCopy() {
  rewritePageHero({
    eyebrow: 'Formal reconstruction verification',
    title: 'Inspect the current status and verify historical file identity.',
    lede: 'The target theorem is not currently established. Status checks expose remaining formal obligations; hash checks verify historical artefact identity only.',
    primaryHref: 'public/pnp-status.json',
    primaryText: 'Open current status JSON',
    secondaryHref: 'status.html',
    secondaryText: 'View status explanation',
  });
  insertAfterPageHero('formal-verification-copy', `<section class="section compact" id="formal-verification-copy">
      <div class="boundary-panel">
        <div class="boundary-head"><span>Current verification boundary</span><strong>not established</strong></div>
        <pre>mathematicalTheoremEstablished = false
publicTheoremEmissionAllowed = false
finalTheoremReady = false
rootLeanTheoremPresent = false
projectSpecificAxiomsRemaining = true</pre>
      </div>
      <div class="grid two path" style="margin-top:1.2rem">
        <article class="card"><h3>Check formal status and public surface</h3><p>Run <code>node pcc-formal-reconstruction-status0.mjs --json</code> and <code>node pcc-formal-public-surface0.mjs --json</code>, then inspect every remaining obligation and superseded surface.</p></article>
        <article class="card"><h3>Build and audit Lean</h3><p>Run <code>lake build PNP</code> and the direct-wire NAND axiom audit. The foundational semantics are assumption-free, but that milestone is not the absent <code>PNP.Main.p_eq_np</code> theorem or a project-axiom-free bridge.</p></article>
        <article class="card"><h3>Check file identity</h3><p>Release hashes can identify historical report bytes. They do not verify theorem correctness.</p></article>
        <article class="card"><h3>Historical run intake</h3><p>The former activated verifier-run registry and automated submission workflow are frozen.</p></article>
      </div>
    </section>`);
}

function ensureFormalFAQCopy() {
  rewritePageHero({
    eyebrow: 'Formal reconstruction FAQ',
    title: 'Current theorem-status FAQ.',
    lede: 'The repository does not currently establish P = NP. These answers distinguish the unfinished Lean reconstruction from historical checker and report records.',
    primaryHref: 'status.html',
    primaryText: 'View current status',
    secondaryHref: 'public/pnp-status.json',
    secondaryText: 'Open status JSON',
  });
  insertAfterPageHero('formal-faq-copy', `<section class="section compact" id="formal-faq-copy">
      <div class="section-label">Current theorem-status FAQ</div>
      <div class="grid two path">
        <article class="card"><h3>Does the repository establish P = NP?</h3><p>No. <code>mathematicalTheoremEstablished = false</code> and <code>publicTheoremEmissionAllowed = false</code>.</p></article>
        <article class="card"><h3>What is missing?</h3><p>The bounded enumerator, exact minimum, compatible replacement and slack laws, locked-NAND builder and threshold, concrete complexity and SAT definitions, residual-band arguments, polynomial bounds, the root theorem, and its axiom audit remain unfinished.</p></article>
        <article class="card"><h3>What does legacy checker acceptance mean?</h3><p>It is historical evidence that assertion-bearing records passed implemented predicates. It is not a proof of the asserted propositions.</p></article>
        <article class="card"><h3>Is external review a theorem premise?</h3><p>No. External review is optional audit evidence and is not a mathematical premise or release blocker.</p></article>
      </div>
    </section>`);
}

function ensureFormalReviewCopy() {
  rewritePageHero({
    eyebrow: 'Audit and formal reconstruction',
    title: 'Review an unfinished formal reconstruction.',
    lede: 'Reviewers can identify counterexamples, missing definitions, hidden assumptions, invalid reductions, or Lean gaps. Review is valuable audit evidence but not a mathematical premise.',
    primaryHref: 'status.html',
    primaryText: 'View current blockers',
    secondaryHref: 'public/pnp-status.json',
    secondaryText: 'Open status JSON',
  });
  insertAfterPageHero('formal-review-copy', `<section class="section compact" id="formal-review-copy">
      <div class="section-label">Current review role</div>
      <div class="callout"><div><h2>Challenge the unfinished formal route.</h2><p>The typed direct-wire NAND semantics core is formalized and axiom-free. Its enumerator, minimum, replacement/slack route, locked builder and threshold remain unfinished; no <code>PNP.Main.p_eq_np</code> theorem exists, five project-specific axioms remain, and seven formal blockers are active.</p></div><a class="btn primary" href="status.html">Inspect blockers</a></div>
    </section>`);
}

function ensureFormalPageCopy() {
  const page = currentPageName();
  if (page === 'verify.html') ensureFormalVerificationCopy();
  if (page === 'faq.html') ensureFormalFAQCopy();
  if (page === 'review.html') ensureFormalReviewCopy();
}

ensureStatusLink();
ensureHomepageFormalReconstructionBoundary();
ensureFormalPageCopy();
loadFormalReconstructionStatus();

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
  progress.style.width = `${Math.max(0, Math.min(100, pct))}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

import('./public-source-links.js').catch((error) => {
  console.error('Public source link enhancement failed', error);
});
