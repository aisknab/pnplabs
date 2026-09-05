import assert from 'node:assert/strict';

// Derive fixture names only. Callers still check the values, reviewed theorem
// fingerprints and independent publication invariants.
export function deriveMilestoneStatusStem(status, releasePrefix) {
  assert.equal(typeof releasePrefix, 'string');
  assert.ok(releasePrefix.length > 0, 'release prefix must not be empty');
  const prefix = releasePrefix.toLowerCase();
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
