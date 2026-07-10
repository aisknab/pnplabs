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
    && payload.coordinate === 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-10-08'
    && payload.status === 'formal-reconstruction-in-progress'
    && payload.currentStatusAuthority === true
    && payload.mathematicalTheoremEstablished === false
    && payload.publicTheoremEmissionAllowed === false
    && payload.publicTheoremStatement === null
    && payload.publicTheoremConclusion === null
    && payload.finalTheoremReady === false
    && payload.satInPConclusionAccepted === false
    && payload.pEqualsNPConclusionAccepted === false
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
    && payload.leanNANDEnumeratorFormalized === true
    && payload.leanNANDEnumeratorAxiomAuditPassed === true
    && payload.leanNANDExactWidthEnumerationComplete === true
    && payload.leanNANDEnumeratorUsesOrderedGatePairs === true
    && payload.leanNANDEnumeratorIncludesUniqueEmptyOutputTuple === true
    && payload.leanNANDEnumeratorDeduplicated === false
    && payload.leanNANDTruthTableFormalized === true
    && payload.leanNANDTruthTableAxiomAuditPassed === true
    && payload.leanNANDSemanticEquivalenceDecidable === true
    && payload.leanNANDMinimumAndSlackFormalized === true
    && payload.leanNANDReferenceMinimumFormalized === true
    && payload.leanNANDReferenceMinimumAxiomAuditPassed === true
    && payload.leanNANDReferenceMinimumExhaustive === true
    && payload.leanNANDReferenceMinimumScope === 'finite-boolean-direct-wire-empty-profile'
    && payload.leanNANDReferenceMinimumPolynomialRuntimeProved === false
    && payload.leanNANDResidualSlackZeroIffMinimumFormalized === true
    && payload.leanNANDCompositionFormalized === true
    && payload.leanNANDCompositionAxiomAuditPassed === true
    && payload.leanNANDFramedReplacementFormalized === true
    && payload.leanNANDFramedGlobalSlackLawFormalized === true
    && payload.leanNANDFramedSlackAxiomAuditPassed === true
    && payload.leanNANDReplacementScope === 'concrete-serial-framed-context'
    && payload.leanLockedNANDDirectCandidatesFormalized === true
    && payload.leanLockedNANDDirectAxiomAuditPassed === true
    && payload.leanLockedNANDInternalMacroConstantsAbsent === true
    && payload.leanDirectWireOutputLowerBoundFormalized === true
    && payload.leanDirectWireBaselineAxiomAuditPassed === true
    && payload.leanLockedNANDSourceDerivedCountsFormalized === true
    && payload.leanLockedNANDBaselineAccountingFormalized === true
    && payload.leanLockedNANDBaselineAxiomAuditPassed === true
    && payload.leanLockedNANDConditionalSquareBaselineExactnessFormalized === true
    && payload.leanLockedNANDLocalBaselineConditionsFormalized === true
    && payload.leanLockedNANDLocalSquareBaselineExactnessFormalized === true
    && payload.leanLockedNANDLocalBaselineAxiomAuditPassed === true
    && payload.leanLockedNANDProofScope === 'typed-local-macros-source-derived-counts-and-five-local-square-baselines'
    && payload.leanLockedNANDConditionalThresholdBoundaryFormalized === true
    && payload.leanLockedNANDConditionalResidualSlackAtMostFourFormalized === true
    && payload.leanLockedNANDThresholdBoundaryAxiomAuditPassed === true
    && payload.leanLockedNANDThresholdBoundaryScope === 'proof-bearing-typed-candidate-and-semantic-premises-only'
    && payload.leanLockedNANDThresholdBoundaryPremisesInstantiated === false
    && payload.leanLockedNANDGlobalBaselineDistinctFormalized === false
    && payload.leanLockedNANDCarrierLayoutFormalized === false
    && payload.leanLockedNANDTraceEquivalenceFormalized === false
    && payload.leanLockedNANDDerivedFinalOutputLawsFormalized === false
    && payload.leanLockedNANDResidualSlackAtMostFourFormalized === false
    && payload.leanLockedNANDPolynomialBuilderFormalized === false
    && payload.leanCompatibleReplacementFormalized === false
    && payload.leanGlobalSlackLawFormalized === false
    && payload.leanLockedNANDBuilderFormalized === false
    && payload.leanLockedNANDThresholdFormalized === false
    && payload.lockedNANDOutputConvention === 'ordered-multi-output-baseline-coordinates-plus-final-coordinate'
    && payload.legacySyntheticLockedNANDM2FixtureStatus === 'quarantined-internally-inconsistent'
    && payload.legacySyntheticLockedNANDM2HonestBaseline === 86
    && payload.legacySyntheticLockedNANDM2MetadataConsistentBaseline === 95
    && payload.legacySyntheticLockedNANDM2StoredBaseline === 91
    && payload.legacySyntheticLockedNANDM2HonestDisplayedGateCount === 90
    && payload.legacySyntheticLockedNANDM2MetadataConsistentDisplayedGateCount === 99
    && payload.legacySyntheticLockedNANDM2StoredDisplayedGateCount === 95
    && JSON.stringify(payload.lockedNANDThresholdHostileReviewLemmaInventory) === JSON.stringify([
      'DirectWireOutputLowerBound',
      'MacroDistinct',
      'TraceEquivalence',
      'ZeroOutputConvention',
      'FinalLockSeparation',
    ])
    && JSON.stringify(payload.leanLockedNANDThresholdPremiseInventory) === JSON.stringify([
      'baselineCandidate',
      'fullCandidate',
      'baselineConditions',
      'initialOutputsPreserved',
      'unsatisfiableFinalZero',
      'satisfiableFinalConditions',
    ])
    && JSON.stringify(payload.leanLockedNANDThresholdMissingInstantiationInventory) === JSON.stringify([
      'baselineCandidate',
      'fullCandidate',
      'baselineConditions',
      'initialOutputsPreserved',
      'unsatisfiableFinalZero',
      'satisfiableFinalConditions',
    ])
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
      'node --test audits/lean-nand-enumerator0.test.mjs',
      'node --test audits/lean-nand-reference-minimum0.test.mjs',
      'node --test audits/lean-locked-nand-baseline0.test.mjs',
      'node --test audits/lean-locked-nand-threshold-boundary0.test.mjs',
      'lake build PNP',
      'lake env lean -DwarningAsError=true lean-audit/PNPBridgeAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPNANDSemanticsAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPNANDEnumeratorAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPNANDTruthTableAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPNANDMinimumAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPNANDCompositionAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPNANDSlackAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDDirectAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPDirectWireBaselineAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDBaselineAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDLocalBaselineAxiomAudit.lean',
      'lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDThresholdBoundaryAxiomAudit.lean',
    ])
    && payload.publicSurfaceBaselineCoordinate === 'PUBLIC-SURFACE-BASELINE-2026-07-10-LOCKED-NAND-CONDITIONAL-THRESHOLD-BOUNDARY-08'
    && payload.nonClaims?.includes('The formalized direct-wire NAND semantics layer does not by itself prove enumeration, minimum size, replacement/slack, the locked NAND builder, its threshold, SAT, or P = NP.')
    && payload.nonClaims?.includes('The exact-width syntactic NAND enumeration remains intentionally noncanonical and may contain duplicates.')
    && payload.nonClaims?.includes("The exhaustive direct-wire truth-table and reference-minimum computation has no polynomial-runtime claim and does not formalize the report's residual-band minimizer.")
    && payload.nonClaims?.includes("Replacement and global slack are proved only for the concrete serial framed-context construction, not arbitrary support profiles or the report's locked-NAND family.")
    && payload.nonClaims?.includes('The typed local locked-NAND candidates, source-derived accounting, conditional square-baseline theorem, and five discharged local square baselines do not prove global cross-instance BaselineDistinct, a locked builder or threshold, residual slack at most four, or polynomial runtime.')
    && payload.nonClaims?.includes('The report threshold word is multi-output: its baseline coordinates remain present alongside one final coordinate; a legacy single-output seed is not that construction.')
    && payload.nonClaims?.includes('The legacy synthetic m=2 fixture is quarantined as internally inconsistent: honest source-derived baseline/displayed counts are 86/90, metadata-consistent counts are 95/99, and stored hybrid counts are 91/95.')
    && payload.nonClaims?.includes('The proof-bearing conditional locked-NAND semantic boundary is not the report threshold theorem: it assumes typed baseline and full candidates, baseline output conditions, preservation of the first outputs, an unsatisfiable final-zero law, and satisfiable final-output laws instead of constructing them for arbitrary circuits.')
    && payload.nonClaims?.includes('The residual-slack-at-most-four result is conditional on that six-field premise package; it is not an unconditional result for the report locked-NAND family.')
    && payload.nonClaims?.includes('Against the hostile-review inventory, DirectWireOutputLowerBound and the model-level ZeroOutputConvention are now discharged, while global MacroDistinct, TraceEquivalence, FinalLockSeparation, carrier layout, and uniform polynomial premise construction remain missing.')
    && payload.nonClaims?.includes('The conditional module quantifies an arbitrary satisfiable proposition and baseline natural number; it does not identify them with source-circuit SAT and lockedBaselineCount, enforce answer-independent uniform construction, or connect the candidate boundary to the abstract PNP.LockedNANDThreshold language.');
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
    lede.textContent = 'Lean now derives the locked-NAND unsat/sat minimum boundary and residual slack at most four from six explicit typed semantic premises. Those premises are not instantiated for source circuits, so the report threshold, root theorem, and five project-specific axioms remain unresolved.';
  }

  const trace = hero.querySelector('.checker-trace');
  if (trace) {
    trace.innerHTML = '<span>conditional threshold deduction checked</span><span>six global premises uninstantiated</span><strong>in progress</strong>';
  }

  const firstNote = hero.querySelector('.review-note');
  if (firstNote) {
    firstNote.innerHTML = '<strong>Current status:</strong> the new theorem is proof-bearing but conditional. It assumes typed baseline/full candidates, global baseline conditions, initial-output preservation, an unsatisfiable final-zero law, and satisfiable final-output laws. Carrier layout, <code>BaselineDistinct</code>, <code>TraceEquivalence</code>, derived final laws, the answer-independent polynomial builder, report threshold, unconditional slack bound, SAT conclusion, and <code>PNP.Main.p_eq_np</code> remain unfinished.';
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
        <article class="card"><h3>Build and audit Lean</h3><p>Run <code>lake build PNP</code> and the NAND semantics, enumerator, minimum, slack, four local-baseline, and conditional threshold-boundary axiom audits. The 32-declaration boundary transcript is clean, but its six semantic premises remain uninstantiated.</p></article>
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
        <article class="card"><h3>What is missing?</h3><p>The conditional boundary does not build its six-field package. Carrier layout, global baseline distinctness, <code>TraceEquivalence</code>, derived final-output laws, answer-independent polynomial construction, the locked builder/report threshold, unconditional slack at most four, concrete SAT, and the root theorem remain unfinished.</p></article>
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
      <div class="callout"><div><h2>Challenge the six missing instantiations.</h2><p>The conditional threshold deduction is formalized and axiom-audited, but its baseline/full candidates and four semantic laws are premises. Review global <code>BaselineDistinct</code>, <code>TraceEquivalence</code>, final-output laws, answer-independent polynomial construction, and the absent connection to the report threshold. No <code>PNP.Main.p_eq_np</code> theorem exists, five project-specific axioms remain, and seven formal blockers are active.</p></div><a class="btn primary" href="status.html">Inspect blockers</a></div>
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
