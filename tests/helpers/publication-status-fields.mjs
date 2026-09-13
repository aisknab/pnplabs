import assert from 'node:assert/strict';
import vm from 'node:vm';

// Derive fixture names only. Callers still check the values, reviewed theorem
// fingerprints and independent publication invariants.
export function deriveMilestoneStatusStem(status, releasePrefix) {
  assert.equal(typeof releasePrefix, 'string');
  assert.ok(releasePrefix.length > 0, 'release prefix must not be empty');
  // The release retains the CNFSAT spelling; the core field uses CNF.
  const prefix = releasePrefix.toLowerCase().replace(/^cnfsatnpcompleteness$/, "cnfnpcompleteness");
  const stems = Object.keys(status)
    .filter((key) => key.startsWith('lean') && key.endsWith('Formalized'))
    .map((key) => key.slice(0, -'Formalized'.length))
    .filter((stem) => stem.slice('lean'.length).toLowerCase() === prefix
      || (stem.startsWith('leanConcrete')
        && stem.slice('leanConcrete'.length).toLowerCase() === prefix));
  assert.equal(stems.length, 1, `expected one status stem for ${releasePrefix}`);
  const stem = stems[0];
  assert.ok(Object.hasOwn(status, `${stem}AxiomAuditPassed`),
    `missing status audit field for ${releasePrefix}`);
  return stem;
}

// Resolve reviewed batch field locations without manufacturing new theorem or
// progress expectations. Legacy flat records keep their existing lookup path.
export function deriveBatchMilestoneFields(status, release, milestone) {
  const matches = [];
  for (const [key, batch] of Object.entries(release.earnedBoundary ?? {})) {
    if (batch?.kind !== 'PNPLabsCompiledMilestoneBatch0') continue;
    assert.ok(Array.isArray(batch.milestones), 'batch milestones must be an array');
    for (const [index, row] of batch.milestones.entries())
      if (row.id === milestone.id) matches.push({key,index,row});
  }
  assert.ok(matches.length <= 1, 'ambiguous publication batch for ' + milestone.id);
  if (matches.length === 0) return null;
  const {key,index,row} = matches[0];
  assert.deepEqual(Object.keys(row.theoremKernelTypeSha256), milestone.requiredTheorems,
    'batch theorem-name interface differs from status');
  const fields = row.fields;
  assert.ok(fields && typeof fields === 'object' && !Array.isArray(fields));
  const auditSuffix = 'AxiomAuditPassed';
  const stems = Object.keys(fields)
    .filter(field => field.startsWith('lean') && field.endsWith(auditSuffix))
    .map(field => field.slice(0,-auditSuffix.length))
    .filter(stem => Object.hasOwn(fields, stem + 'Formalized'));
  assert.equal(stems.length,1,'expected one primary batch status stem for ' + milestone.id);
  const statusStem = stems[0];
  for (const [field,value] of Object.entries(fields))
    assert.deepEqual(status[field],value,'batch/status fixture field differs: ' + field);
  const base = [key,'milestones',index];
  return {
    statusStem,
    statusFields: {...fields},
    theoremAxioms: structuredClone(row.theoremAxioms),
    releaseFields: {
      Formalized: [...base,'fields',statusStem + 'Formalized'],
      AxiomAuditPassed: [...base,'fields',statusStem + 'AxiomAuditPassed'],
      Scope: Object.hasOwn(fields,statusStem + 'Scope')
        ? [...base,'fields',statusStem + 'Scope'] : undefined,
      TheoremKernelTypeSha256: [...base,'theoremKernelTypeSha256'],
    },
  };
}

export function readMilestoneReleaseField(release, field) {
  const keys = Array.isArray(field) ? field : [field];
  assert.ok(keys.length > 0);
  let value = release.earnedBoundary;
  for (const key of keys) {
    assert.ok(value && Object.hasOwn(value,key),'missing publication field location');
    value = value[key];
  }
  return value;
}

export function setMilestoneReleaseField(release, field, value) {
  const keys = Array.isArray(field) ? field : [field];
  assert.ok(keys.length > 0);
  let parent = release.earnedBoundary;
  for (const key of keys.slice(0,-1)) {
    assert.ok(parent && Object.hasOwn(parent,key),'missing publication field parent');
    parent = parent[key];
  }
  assert.ok(parent && Object.hasOwn(parent,keys.at(-1)),'missing publication field target');
  parent[keys.at(-1)] = value;
}


// Read the existing nested record. This adapter does not create a second
// manifest, approve values or turn optional omitted fields into earned evidence.
export function readBatchMilestoneBoundaryValue(release, batch, suffix, required = true) {
  assert.ok(batch && typeof batch === 'object');
  const field = batch.statusStem + suffix;
  let value;
  if (Object.hasOwn(batch.statusFields, field)) value = batch.statusFields[field];
  else if (batch.releaseFields[suffix]) value = readMilestoneReleaseField(release, batch.releaseFields[suffix]);
  else if (suffix === 'AxiomClosure' || suffix === 'ProjectAxiomClosure') {
    assert.ok(batch.theoremAxioms && typeof batch.theoremAxioms === 'object');
    const lists = Object.values(batch.theoremAxioms);
    assert.ok(lists.every(list => Array.isArray(list) && list.every(name => typeof name === 'string')));
    value = [...new Set(lists.flat())].sort();
    if (suffix === 'ProjectAxiomClosure') value = value.filter(name => !['Classical.choice','Quot.sound','propext'].includes(name));
  }
  if (required) assert.notEqual(value, undefined, 'missing batch release field: ' + suffix);
  return value;
}

// Formatting is not evidence. Callers compare the resulting actual values with
// the independent canonical inventory and retain their own schema assertions.
export function readBrowserInventoryCounts(source) {
  const object = source.match(/const INVENTORY_COUNTS = Object\.freeze\((\{[\s\S]*?\})\);/)?.[1];
  assert.ok(object, 'browser inventory-count object is present');
  return Object.fromEntries(Object.entries(vm.runInNewContext('(' + object + ')', {}, {timeout:1000})));
}


// Decode one layer of the entities emitted by the publication HTML encoder.
// Tests compare logical field text, never require unsafe unescaped HTML.
export function decodePublishedHtml(source) {
  return source.replaceAll('&quot;', '"').replaceAll('&#39;', "'")
    .replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;', '&');
}


// The static fallback is a rendering of the complete canonical ledger, not a
// collection of obsolete per-release prose fragments or retired audit counters.
export function assertCanonicalStaticMilestoneCards(html, status) {
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const display = value => normalize(decodePublishedHtml(value.replace(/<[^>]*>/g, ' ')));
  const cards = [...html.matchAll(/<article\b[^>]*\bdata-milestone-id="([^"]+)"[^>]*>[\s\S]*?<\/article>/g)];
  assert.deepEqual(cards.map(card => card[1]), status.formalPublicationMilestones.map(row => row.id), 'canonical static milestone order');
  for (const [index, row] of status.formalPublicationMilestones.entries()) {
    const card = cards[index][0];
    assert.ok(card.includes('data-earned="' + row.earned + '"'), row.id + ': earned state');
    const title = card.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1];
    assert.equal(display(title ?? ''), normalize(row.title), row.id + ': canonical title');
    const paragraphs = [...card.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(match => display(match[1]));
    assert.ok(paragraphs.includes(normalize(row.scope)), row.id + ': canonical scope');
    assert.ok(paragraphs.includes(normalize(row.nonClaim)), row.id + ': canonical non-claim');
    const pins = card.match(/<details\b[^>]*\bdata-reviewed-theorem-pins[^>]*>([\s\S]*?)<\/details>/)?.[1] ?? '';
    const names = [...pins.matchAll(/<code>([\s\S]*?)<\/code>/g)].map(match => decodePublishedHtml(match[1]));
    assert.deepEqual(names, row.earned ? row.requiredTheorems : [], row.id + ': exact reviewed theorem interfaces');
  }
}
