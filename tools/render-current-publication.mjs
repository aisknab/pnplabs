// Render current editorial and static evidence surfaces from validated inputs.
// Historical updates and their original source bindings remain untouched.
import vm from 'node:vm';

export const CURRENT_PUBLICATION_PAGES = Object.freeze([
  'index.html', 'status.html', 'faq.html', 'paper.html', 'architecture.html',
  'README.md', ...['activated_claim_wording', 'audit_questions', 'one_command_verify_upload',
    'proof_pipeline', 'reproducibility', 'reviewer_guide', 'source_checker_map', 'trust_model']
    .map(name => 'docs/' + name + '.md'),
]);

const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const escapeMarkdown = value => String(value).replaceAll('&', '&amp;')
  .replace(/([\\`*_[\]<>~])/gu, character => '\\' + character).replace(/\r\n?|\n/gu, ' ');
const paragraphs = values => values.map(value => '<p>' + escapeHtml(value) + '</p>').join('');
const fail = message => { throw new Error('current publication: ' + message); };

function replaceOne(source, pattern, rendered, label) {
  if ([...source.matchAll(pattern)].length !== 1) fail(label + ': expected one current region');
  return source.replace(pattern, () => rendered);
}

function correctionRegion(source, region, label) {
  const start = '<!-- CURRENT_CORRECTIONS:' + region + ':START -->';
  const end = '<!-- CURRENT_CORRECTIONS:' + region + ':END -->';
  const from = source.indexOf(start), to = source.indexOf(end);
  if (from < 0 || to < from || source.indexOf(start, from + start.length) !== -1
      || source.indexOf(end, to + end.length) !== -1) fail(label + ': correction markers invalid');
  return source.slice(from, to + end.length);
}

function currentMetrics(model) {
  const p = model.proofProgress, coverage = p.formalArtefactCoverage;
  return 'Risk-weighted proof completion estimate: ' + p.percent + '%, with uncertainty '
    + p.uncertaintyLowPercent + '% to ' + p.uncertaintyHighPercent + '%. Formal artefact coverage: '
    + coverage.earnedRows + ' of ' + coverage.totalRows + ' current scoped publication rows earned. '
    + 'Global gates closed: ' + p.globalGatesClosed + ' of ' + p.globalGatesAvailable + '. '
    + 'Project-specific axioms remaining: ' + p.projectSpecificAxiomsRemaining.length + '. '
    + 'The eligible root theorem ' + p.rootTheorem.name + (p.rootTheorem.present ? ' is present' : ' remains absent')
    + ' and the publication gate is ' + p.publicationGate.passed + '.';
}

function renderSummary(model, source, { bottom = false } = {}) {
  const latest = model.entries[0], number = latest.source.statusCoordinate.split('-').at(-1);
  const attribute = bottom ? 'data-current-milestone="' + escapeHtml(latest.milestoneId) + '"'
    : 'data-current-publication-summary';
  const region = bottom ? 'BOTTOM_LINE' : 'SUMMARY';
  return '<section class="section compact" ' + attribute + '><div class="callout"><div>'
    + '<div class="section-label">' + (bottom ? 'Current bottom line' : 'Current proof boundary')
    + '</div><h2>Current findings and proof limits</h2>\n'
    + correctionRegion(source, region, 'summary') + '\n'
    + '<p><strong>Latest earned milestone: M' + escapeHtml(number) + '.</strong></p>'
    + '<h3>' + escapeHtml(latest.title) + '</h3>' + paragraphs(latest.plainLanguage)
    + '<p>' + escapeHtml(currentMetrics(model)) + '</p>'
    + (model.proofProgress.publicationGate.passed ? '' : '<p>P = NP is not established.</p>')
    + '<p><a href="updates.html#' + escapeHtml(latest.id)
    + '">Read the source-bound milestone and limitations</a></p></div></div></section>';
}

function renderDocument(model, source, file, index, progress) {
  const latest = model.entries[0], p = model.proofProgress, coverage = p.formalArtefactCoverage;
  const relative = file === 'README.md' ? '' : '../';
  const review = progress.history.find(row => row.asOfCoordinate === latest.source.statusCoordinate);
  if (!review) fail('latest milestone has no canonical checkpoint review');
  const credit = review.scoreChanged
    ? 'This publication changes the fixed weighted checkpoints recorded in the canonical progress ledger.'
    : 'This publication changes no fixed weighted checkpoint.';
  return '<!-- CURRENT_PUBLICATION:START -->\n## Current proof boundary\n\n'
    + correctionRegion(source, 'SUMMARY', file) + '\n\n'
    + '### Latest earned milestone: M' + latest.source.statusCoordinate.split('-').at(-1) + '\n\n'
    + '**' + escapeMarkdown(latest.title) + '**\n\n'
    + latest.plainLanguage.map(escapeMarkdown).join('\n\n') + '\n\n'
    + 'Formal artefact coverage: ' + coverage.earnedRows + ' of ' + coverage.totalRows
    + ' current scoped publication rows earned. Risk-weighted proof completion estimate: ' + p.percent
    + '%. Uncertainty range: ' + p.uncertaintyLowPercent + '% to ' + p.uncertaintyHighPercent
    + '%. Global gates closed: ' + p.globalGatesClosed + ' of ' + p.globalGatesAvailable + '.\n\n'
    + credit + ' Added publication rows do not mechanically increase the proof-completion estimate, '
    + 'which is neither a probability of correctness nor a time estimate. Project-specific axioms remaining: '
    + p.projectSpecificAxiomsRemaining.length + '. The eligible root `' + p.rootTheorem.name + '` is '
    + (p.rootTheorem.present ? 'present' : 'absent') + ' and the publication gate is ' + p.publicationGate.passed + '.\n\n'
    + 'Current release source: [`' + index.sourceCommitRef + '`](https://github.com/aisknab/pnp/tree/'
    + index.sourceCommitRef + '), tree `' + index.sourceTree + '`.\n\n'
    + 'Original latest-earned source: [`' + latest.source.commit + '`](https://github.com/aisknab/pnp/tree/'
    + latest.source.commit + '), tree `' + latest.source.tree + '`. Original latest-earned review coordinate: `'
    + latest.source.statusCoordinate + '`.\n\n'
    + 'Inspect the [latest earned update](' + relative + 'updates.html#' + latest.id + ') and the '
    + '[complete current milestone ledger](' + relative + 'status.html). The separately labelled corrections '
    + 'above preserve their original publication records.\n<!-- CURRENT_PUBLICATION:END -->';
}

export function renderStaticMilestoneCards(status, previousHtml, entries = []) {
  const annotations = new Map();
  for (const card of previousHtml.matchAll(/<article\b[^>]*\bdata-milestone-id="([^"]+)"[^>]*>[\s\S]*?<\/article>/gu)) {
    if (annotations.has(card[1])) fail('duplicate static milestone card');
    const historical = card[0].match(/<p\b[^>]*\bdata-historical-progress-snapshot="[^"]+"[^>]*>[\s\S]*?<\/p>/u)?.[0] ?? '';
    annotations.set(card[1], historical);
  }
  for (const entry of entries) {
    const snapshot = entry.progressSnapshot;
    if (annotations.get(entry.milestoneId)
        || snapshot?.modelId !== 'fixed-risk-weighted-checkpoints-v0') continue;
    const coordinate = escapeHtml(entry.source.statusCoordinate);
    annotations.set(entry.milestoneId, '<p class="muted" data-historical-progress-snapshot="'
      + coordinate + '">Original formal-review snapshot at ' + coordinate
      + ': formal artefact coverage was ' + snapshot.formalArtefactCoverageEarnedRows + ' of '
      + snapshot.formalArtefactCoverageTotalRows + '; risk-weighted estimate was '
      + snapshot.riskWeightedProofCompletionPercent + '%. Uncertainty range: '
      + snapshot.uncertaintyLowPercent + '% to ' + snapshot.uncertaintyHighPercent
      + '%. Global gates: ' + snapshot.globalGatesClosed + ' of ' + snapshot.globalGatesAvailable
      + ' closed. This records the original review, not a live project total. <a href="updates.html#'
      + escapeHtml(entry.id) + '">Original milestone record</a>.</p>');
  }
  return status.formalPublicationMilestones.map(row => {
    const pins = row.earned ? '<details data-reviewed-theorem-pins><summary>Reviewed theorem interfaces ('
      + row.requiredTheorems.length + ')</summary><ul>'
      + row.requiredTheorems.map(name => '<li><code>' + escapeHtml(name) + '</code></li>').join('')
      + '</ul></details>' : '';
    return '        <article class="' + (row.earned ? 'card' : 'card accent')
      + '" data-milestone-id="' + escapeHtml(row.id) + '" data-earned="' + row.earned + '"><h3>'
      + escapeHtml(row.title) + '</h3>' + paragraphs([row.scope, row.nonClaim])
      + pins + (annotations.get(row.id) ?? '') + '</article>';
  }).join('\n');
}

function formalStatusText(browserSource, status) {
  const start = browserSource.indexOf('const STATUS_COORDINATE'), end = browserSource.indexOf('function renderFormalStatus');
  if (start < 0 || end <= start) fail('browser status renderer boundary is missing');
  const context = vm.createContext({ payload: status });
  new vm.Script(browserSource.slice(start, end) + '\nglobalThis.rendered = formalStatusFields(payload);')
    .runInContext(context, { timeout: 2000 });
  if (typeof context.rendered !== 'string') fail('browser status renderer did not return text');
  return context.rendered;
}

export function currentPublicationOutputs(model, sources, { status, index, progress, inventory }) {
  const latest = model.entries[0];
  if (!latest?.milestone || !model.proofProgress) fail('validated latest update is required');
  const browser = sources.get('assets/main.js');
  if (typeof browser !== 'string') fail('browser source is required for matching static status fields');
  const fields = '<pre data-formal-status-fields>' + escapeHtml(formalStatusText(browser, status)) + '</pre>';
  const coverage = model.proofProgress.formalArtefactCoverage;
  const outputs = new Map();
  for (const file of CURRENT_PUBLICATION_PAGES) {
    let source = sources.get(file);
    if (typeof source !== 'string') fail(file + ': current surface is missing');
    if (file.endsWith('.md')) {
      source = replaceOne(source, /<!-- CURRENT_PUBLICATION:START -->[\s\S]*?<!-- CURRENT_PUBLICATION:END -->/gu,
        renderDocument(model, source, file, index, progress), file);
    } else {
      source = replaceOne(source, /<section class="section compact" data-current-publication-summary>[\s\S]*?<\/section>/gu,
        renderSummary(model, source), file);
    }
    if (file === 'index.html') {
      source = replaceOne(source, /<section class="section compact" data-current-milestone="[^"]+">[\s\S]*?<\/section>/gu,
        renderSummary(model, source, { bottom: true }), file + ': bottom line');
      source = replaceOne(source, /<article class="latest-milestone"[\s\S]*?<\/article>/gu,
        '<article class="latest-milestone" aria-labelledby="latest-milestone-title"><div class="section-label">Latest machine-checked milestone</div>'
        + '<h2 id="latest-milestone-title">' + escapeHtml(latest.title) + '</h2>' + paragraphs(latest.plainLanguage)
        + '<a href="updates.html#' + escapeHtml(latest.id) + '">Read the plain-language and technical update →</a>'
        + (model.proofProgress.publicationGate.passed ? '' : '<p class="boundary-copy">P = NP is not established.</p>')
        + '</article>', file + ': latest milestone');
      source = source.replace(/(<details\b[^>]*\bdata-current-milestone=")[^"]+("[^>]*>)/gu,
        (_match, before, after) => before + escapeHtml(latest.milestoneId) + after);
      source = replaceOne(source, /<p class="boundary-copy"><strong>Latest earned step:<\/strong>[\s\S]*?<\/p>/gu,
        '<p class="boundary-copy"><strong>Latest earned step:</strong> ' + escapeHtml(latest.milestone.title)
        + '. ' + escapeHtml(latest.milestone.scope) + ' <strong>Remaining boundary:</strong> '
        + escapeHtml(latest.milestone.nonClaim) + '</p>', file + ': technical boundary');
    }
    if (file === 'index.html' || file === 'status.html') {
      source = replaceOne(source, /<pre data-formal-status-fields>[\s\S]*?<\/pre>/gu, fields, file + ': status fields');
    }
    if (file === 'status.html') {
      const cards = renderStaticMilestoneCards(status, source, model.entries);
      source = replaceOne(source, /<div class="grid three path" data-formal-milestones>[\s\S]*?<\/div>/gu,
        '<div class="grid three path" data-formal-milestones>\n' + cards + '\n      </div>', file + ': ledger');
      const countLabels = [['declarationCount', 'public declarations'], ['theoremCount', 'theorems'],
        ['assumptionFreeTheoremCount', 'assumption-free theorems'], ['excludedPrivateDeclarationCount', 'private compiler auxiliaries excluded'],
        ['sourceClosureModuleCount', 'modules'], ['axiomCount', 'project-specific axioms']];
      source = replaceOne(source, /<p data-formal-inventory-counts>[\s\S]*?<\/p>/gu,
        '<p data-formal-inventory-counts>' + countLabels.map(([key, label]) => '<strong>'
          + inventory[key].toLocaleString('en-AU') + '</strong> ' + label).join('; ') + '.</p>', file + ': inventory counts');
      source = replaceOne(source, /<article class="card"><h3>Current formal report<\/h3>[\s\S]*?<\/article>/gu,
        '<article class="card"><h3>Current formal report</h3><p>The <a href="downloads/canonical_proof_report.pdf">canonical download</a> '
        + 'is generated from the verified core inventory and retains the complete earned milestone ledger.</p>'
        + paragraphs(latest.plainLanguage) + '</article>', file + ': report');
    }
    if (file === 'faq.html') {
      const pattern = /<details><summary class="disclosure-summary"><span>What did the latest milestone add\?<\/span>[\s\S]*?<\/summary>[\s\S]*?<\/details>/gu;
      const original = [...source.matchAll(pattern)];
      if (original.length !== 1) fail(file + ': latest milestone question is missing or duplicated');
      const heading = original[0][0].split('</summary>')[0] + '</summary>';
      source = replaceOne(source, pattern, heading + paragraphs(latest.plainLanguage)
        + '<p><strong>Exact formal scope:</strong> ' + escapeHtml(latest.milestone.scope) + '</p>'
        + '<p><strong>Remaining boundary:</strong> ' + escapeHtml(latest.milestone.nonClaim) + '</p>'
        + '<p><a href="updates.html#' + escapeHtml(latest.id) + '">Read the source-bound update</a>.</p></details>', file + ': latest question');
    }
    if (file === 'architecture.html') {
      source = replaceOne(source, /<article class="card"><h3>Scoped milestone classifier<\/h3>[\s\S]*?<\/article>/gu,
        '<article class="card"><h3>Scoped milestone classifier</h3><p>Formal artefact coverage is '
        + coverage.earnedRows + ' of ' + coverage.totalRows + ' scoped rows, earned only when theorem presence, theorem kind, '
        + 'approved axiom closure with no project axiom, exact type pins and source-closure identity all agree. '
        + 'This evidence-ledger ratio is not proof completion. The separate <a href="status.html#proof-progress">fixed-weight tracker</a> is '
        + model.proofProgress.percent + '% and comes from the canonical progress ledger.</p>'
        + paragraphs(latest.plainLanguage) + '</article>', file + ': classifier');
    }
    if (file === 'paper.html') {
      source = replaceOne(source, /<div class="section-head"><div><div class="section-label">Current formal artefact coverage<\/div>[\s\S]*?This row count measures the evidence ledger, not proof completion\.<\/p><\/div>/gu,
        '<div class="section-head"><div><div class="section-label">Current formal artefact coverage</div><h2>'
        + coverage.earnedRows + ' earned scoped milestones; ' + (coverage.totalRows - coverage.earnedRows)
        + ' missing global milestones</h2></div><p>' + escapeHtml(currentMetrics(model))
        + ' This row count measures the evidence ledger, not proof completion.</p></div>', file + ': coverage');
      source = replaceOne(source, /<article class="card"><h3>Earned scoped results<\/h3>[\s\S]*?<\/article>/gu,
        '<article class="card"><h3>Earned scoped results</h3><p>The report retains the complete canonical evidence ledger, '
        + 'including earlier constructions and their original limitations.</p>' + paragraphs(latest.plainLanguage)
        + '</article>', file + ': report');
    }
    outputs.set(file, source);
  }
  return outputs;
}
