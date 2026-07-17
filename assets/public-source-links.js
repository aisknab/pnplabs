// Purpose: add public source links while keeping the current formal inventory
// separate from the historical 56-page claim manuscript.
const repository = 'https://github.com/aisknab/pnp';
const currentCommit = 'a23dd28052c4bbeee281ed0ce691ef7350ef2215';
const currentSource = `${repository}/tree/${currentCommit}`;
const historicalTag = 'final-pnp-proof-report-hardened-7072f8d';
const historicalCommit = '7072f8d0bda6d44d240f9bb3fad624fd357e1278';
const historicalSource = `${repository}/tree/${historicalTag}`;
const historicalArchive = `${repository}/blob/${currentCommit}/archive/legacy-v0/ARCHIVE.json`;
const page = location.pathname.split('/').filter(Boolean).pop() || 'index.html';

function makeLink(text, href, className = '') {
  const anchor = document.createElement('a');
  anchor.textContent = text;
  anchor.href = href;
  if (className) anchor.className = className;
  return anchor;
}

document.querySelectorAll('.footer-links').forEach((footer) => {
  if (!footer.querySelector(`a[href="${repository}"]`)) {
    footer.prepend(makeLink('Current source', repository));
  }
});

if (page === 'index.html') {
  const actions = document.querySelector('.artifact-copy .hero-actions');
  if (actions && !actions.querySelector(`a[href="${currentSource}"]`)) {
    actions.append(makeLink('Browse current Lean source', currentSource, 'btn secondary'));
  }
}

if (page === 'review.html' && !document.querySelector('#public-source')) {
  const contact = document.querySelector('#contact');
  if (contact) {
    const section = document.createElement('section');
    section.id = 'public-source';
    section.className = 'section compact';
    section.innerHTML = `<div class="section-head"><div><div class="section-label">Public source</div><h2>Inspect current and historical surfaces separately.</h2></div><p>The generated status payload is current publication-status authority. The compiled inventory is its exact evidence mirror and the twenty-page report is derived presentation; the old claim manuscript is historical audit material only.</p></div><div class="grid three"><article class="card"><h3>Current source</h3><p>Lean source, compiled inventory generator, publication map, and gate at merged commit <code>${currentCommit}</code>.</p><p><a class="btn ghost" href="${currentSource}">Open current source</a></p></article><article class="card"><h3>Current inventory</h3><p>Exact public mirror of the compiled Lean declaration inventory.</p><p><a class="btn ghost" href="public/pnp-theorem-inventory.json">Open inventory</a></p></article><article class="card"><h3>Historical manuscript</h3><p>56 pages at tag <code>${historicalTag}</code>, commit <code>${historicalCommit}</code>. It is not current authority.</p><p><a class="btn ghost" href="${historicalSource}">Open historical tag</a> <a class="btn ghost" href="${historicalArchive}">Open archive record</a></p></article></div>`;
    contact.before(section);
  }
}

if (page === 'verify.html') {
  const actions = document.querySelector('.page-hero .hero-actions');
  if (actions && !actions.querySelector(`a[href="${currentSource}"]`)) {
    actions.append(makeLink('Browse current source', currentSource, 'btn secondary'));
  }
}

if (page === 'faq.html') {
  const list = document.querySelector('.faq-list');
  if (list && !document.querySelector('#historical-report-faq')) {
    const details = document.createElement('details');
    details.id = 'historical-report-faq';
    details.innerHTML = `<summary>Where is the historical 56-page manuscript?</summary><p>It remains at source tag <a href="${historicalSource}"><code>${historicalTag}</code></a>, commit <code>${historicalCommit}</code>, with provenance in <a href="${historicalArchive}"><code>archive/legacy-v0/ARCHIVE.json</code></a>. It is audit material and never current theorem authority.</p>`;
    list.append(details);
  }
}
