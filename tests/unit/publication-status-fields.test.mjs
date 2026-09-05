import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deriveMilestoneStatusStem } from '../helpers/publication-status-fields.mjs';

test('publication fixture names derive from status without approving field values', () => {
  assert.equal(deriveMilestoneStatusStem({
    leanExampleFormalized: false,
    leanExampleAxiomAuditPassed: false,
  }, 'example'), 'leanExample');
});

test('concrete release prefixes resolve without a per-milestone name map', () => {
  const status = {
    leanConcreteCookLevinExampleFormalized: true,
    leanConcreteCookLevinExampleAxiomAuditPassed: true,
    leanConcreteCookLevinExampleAllInputsFormalized: false,
  };
  assert.equal(deriveMilestoneStatusStem(status, 'cookLevinExample'),
    'leanConcreteCookLevinExample');
  assert.equal(deriveMilestoneStatusStem(status, 'concreteCookLevinExample'),
    'leanConcreteCookLevinExample');
});

test('missing, inherited and ambiguous publication fixture stems fail closed', () => {
  assert.throws(() => deriveMilestoneStatusStem({}, 'example'), /expected one status stem/);
  assert.throws(() => deriveMilestoneStatusStem(Object.create({
    leanExampleFormalized: true,
    leanExampleAxiomAuditPassed: true,
  }), 'example'), /expected one status stem/);
  assert.throws(() => deriveMilestoneStatusStem({
    leanExampleFormalized: true,
    leanExampleAxiomAuditPassed: true,
    leanConcreteExampleFormalized: true,
    leanConcreteExampleAxiomAuditPassed: true,
  }, 'example'), /expected one status stem/);
});

test('publication fixture stems require a companion audit field and nonempty prefix', () => {
  assert.throws(() => deriveMilestoneStatusStem({
    leanExampleFormalized: true,
  }, 'example'), /missing status audit field/);
  assert.throws(() => deriveMilestoneStatusStem({}, ''), /must not be empty/);
});
