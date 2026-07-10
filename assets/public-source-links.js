const repo = 'https://github.com/aisknab/pnp';
const sourceTag = 'final-pnp-proof-report-hardened-7072f8d';
const docsTag = 'final-pnp-proof-report-docs-hardened-7072f8d-sealed';
const artifactTag = 'final-pnp-proof-report-artifacts-hardened-7072f8d-sealed';
const bundle = 'proof-artifacts/final-pnp-proof-report-hardened-7072f8d';
const source = `${repo}/tree/${sourceTag}`;
const docs = `${repo}/tree/${docsTag}`;
const artifacts = `${repo}/tree/${artifactTag}/${bundle}`;
const page = location.pathname.split('/').pop() || 'index.html';

function link(text, href, className = '') {
  const anchor = document.createElement('a');
  anchor.textContent = text;
  anchor.href = href;
  if (className) anchor.className = className;
  return anchor;
}

function byText(selector, text) {
  return [...document.querySelectorAll(selector)]
    .find((element) => element.textContent.trim() === text);
}

const footer = document.querySelector('.footer-links');
if (footer && !footer.querySelector(`a[href="${repo}"]`)) {
  const contact = footer.querySelector('a[href="review.html#contact"]');
  footer.insertBefore(link('Source/checker', repo), contact);
}

if (page === 'index.html') {
  const actions = document.querySelector('.artifact-copy .hero-actions');
  if (actions && !actions.querySelector(`a[href="${repo}"]`)) {
    actions.insertBefore(link('Browse source/checker', repo, 'btn secondary'), actions.children[1]);
  }
  const item = byText('li', 'Review contact and source repository access');
  if (item) item.textContent = 'Public source repository and pinned release tags';
  const request = byText('a', 'Request review packet');
  if (request) {
    request.textContent = 'Open public source';
    request.href = repo;
  }
}

if (page === 'review.html') {
  const description = 'Public source links and contact channels for independent technical review, reproduction questions, current-status questions, and security disclosure.';
  document.querySelectorAll('meta[name="description"], meta[property="og:description"]')
    .forEach((meta) => { meta.content = description; });

  const lede = document.querySelector('.page-hero .lede');
  if (lede) {
    lede.textContent = 'The source/checker repository and pinned release tags are public. Use the links below for direct inspection, and use the contact channels for technical questions, institutional coordination, current-status questions, and responsible security disclosure.';
  }

  const access = byText('h3', 'Review and source repository access');
  if (access) {
    access.textContent = 'Review questions and reproduction support';
    if (access.nextElementSibling) {
      access.nextElementSibling.textContent = 'For mathematical findings, checker questions, reproduction help, or institutional review coordination. Source access is public and does not require email approval.';
    }
  }

  const institutional = byText('h3', 'Institutional review');
  if (institutional?.nextElementSibling) {
    institutional.nextElementSibling.textContent = 'Current formal-reconstruction status, historical checker records, public source and release availability, open obligations, and conservative citation language.';
  }

  const contact = document.querySelector('#contact');
  if (contact && !document.querySelector('#public-source')) {
    const section = document.createElement('section');
    section.id = 'public-source';
    section.className = 'section compact';
    section.innerHTML = `<div class="section-head"><div><div class="section-label">Public source</div><h2>Inspect the pinned release directly.</h2></div><p>No access request is required. Code, release documentation, and generated artefacts are published as separate immutable refs.</p></div><div class="grid three"><article class="card"><h3>Source/checker</h3><p>Executable code and tests at the pinned source tag.</p><p><a class="btn ghost" href="${source}">Open source tag</a></p></article><article class="card"><h3>Release documentation</h3><p>Reproduction instructions and reviewer handoff files.</p><p><a class="btn ghost" href="${docs}">Open docs tag</a></p></article><article class="card"><h3>Generated artefacts</h3><p>Sealed report records, release seal, and checksums.</p><p><a class="btn ghost" href="${artifacts}">Open artefact bundle</a></p></article></div>`;
    contact.before(section);
  }

  const template = document.querySelector('#request-template');
  if (template) {
    template.textContent = `Subject: PNP Labs technical review or status question\n\nHello PNP Labs,\n\nI am reviewing the PNP Labs P versus NP formal reconstruction. I understand that the repository does not currently establish P = NP.\n\nPublic source: ${repo}\nPinned ref or file: [source tag / docs tag / artefact tag / exact path]\nPurpose: [technical review / institutional assessment / status clarification / security]\nFinding or question: [include the exact theorem, checker, file, obligation, or reproduction step]\n\nPlease respond to the specific finding or question and identify any additional public audit coordinate that is relevant.\n\nRegards,\n[Name]`;
  }
}

if (page === 'verify.html') {
  const actions = document.querySelector('.page-hero .hero-actions');
  if (actions && !actions.querySelector(`a[href="${repo}"]`)) {
    actions.insertBefore(link('Browse source/checker', repo, 'btn secondary'), actions.lastElementChild);
  }

  const row = [...document.querySelectorAll('tbody tr')]
    .find((candidate) => candidate.textContent.includes('Source access process'));
  if (row) {
    row.innerHTML = `<td><strong>Public source repository</strong></td><td><a href="${repo}"><code>github.com/aisknab/pnp</code></a></td>`;
  }

  const pills = document.querySelector('.file-links');
  if (pills && !pills.querySelector(`a[href="${repo}"]`)) {
    pills.prepend(link('public source/checker', repo, 'pill'));
  }

  const code = document.querySelector('#regen-code');
  if (code) {
    code.textContent = `git clone ${repo}.git pnp-review\ncd pnp-review\ngit fetch --tags --force\n\ngit checkout ${artifactTag}\nB=${bundle}\nsha256sum -c "$B/SHA256SUMS"\nsha256sum -c "$B/SHA256SUMS.sha256"\n\ngit checkout ${sourceTag}\nnpm ci\nnpm run validate`;
  }
}

if (page === 'faq.html') {
  const list = document.querySelector('.faq-list');
  if (list && !document.querySelector('#public-source-faq')) {
    const details = document.createElement('details');
    details.id = 'public-source-faq';
    details.innerHTML = `<summary>Where is the source/checker repository?</summary><p>The repository is public at <a href="${repo}">github.com/aisknab/pnp</a>. Use the <a href="${source}">source tag</a>, <a href="${docs}">documentation tag</a>, and <a href="${artifacts}">artefact tag</a> for their separate audit surfaces. No access request is required.</p>`;

    const contact = [...list.querySelectorAll('details')]
      .find((candidate) => candidate.textContent.includes('source repository access requests'));
    list.insertBefore(details, contact || null);

    if (contact) {
      contact.querySelector('summary').textContent = 'Where do technical findings and security disclosures go?';
      contact.querySelector('p').innerHTML = 'Source access is public and requires no approval. Technical findings, reproduction questions, and review coordination go to <a href="mailto:review@pnplabs.com.au">review@pnplabs.com.au</a>. Security issues go to <a href="mailto:security@pnplabs.com.au">security@pnplabs.com.au</a>.';
    }
  }
}
