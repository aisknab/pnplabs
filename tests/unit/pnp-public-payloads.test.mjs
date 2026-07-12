import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CORE_COMMIT = '36a65d294276659f964e0b75cf102be2089fe1de';
const STATUS_COORDINATE = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-12-23';
const INVENTORY_COORDINATE = 'PNP-LEAN-THEOREM-INVENTORY-2026-07-12-23';
const INVENTORY_SHA256 = '6f5d04356e86d2c775f7913d5e8e8a891a59559a9dbc533f34ebfa18b619d1fc';

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

async function readBytes(path) {
  return readFile(new URL(`../../${path}`, import.meta.url));
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

const siblingRepo = new URL('../../../pnp/', import.meta.url);
const siblingGit = new URL('.git', siblingRepo);
let siblingAvailable = true;
try {
  await access(siblingGit);
} catch {
  siblingAvailable = false;
}

test('status and inventory are byte-identical to the pinned merged core publication', { skip: siblingAvailable ? false : 'sibling pnp checkout unavailable; upstream-consistency CI performs the remote comparison' }, async () => {
  for (const path of ['public/pnp-status.json', 'public/pnp-theorem-inventory.json']) {
    const site = await readText(path);
    const { stdout: source } = await execFileAsync('git', [
      '-C', fileURLToPath(siblingRepo), 'show', `${CORE_COMMIT}:${path}`,
    ], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
    assert.equal(site, source, `${path} must match pinned merged core commit`);
  }
});

test('current status binds the compiled inventory and fails the concrete gate closed', async () => {
  const status = await readJson('public/pnp-status.json');
  const inventoryBytes = await readBytes('public/pnp-theorem-inventory.json');
  const inventory = JSON.parse(inventoryBytes);

  assert.equal(status.kind, 'PNPFormalReconstructionStatus0');
  assert.equal(status.coordinate, STATUS_COORDINATE);
  assert.equal(status.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-12-TERMINAL-OUTPUT-PACKER-23');
  assert.equal(status.status, 'formal-reconstruction-in-progress');
  assert.equal(status.currentStatusAuthority, true);
  assert.equal(status.leanToolchain, 'leanprover/lean4:v4.31.0');

  assert.equal(inventory.kind, 'PNPLeanTheoremInventory0');
  assert.equal(inventory.coordinate, INVENTORY_COORDINATE);
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), INVENTORY_SHA256);
  assert.equal(status.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(status.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(inventory.declarationCount, 5023);
  assert.equal(inventory.theoremCount, 2081);
  assert.equal(inventory.assumptionFreeTheoremCount, 1980);
  assert.equal(inventory.excludedPrivateDeclarationCount, 950);
  assert.equal(inventory.sourceClosureModuleCount, 45);
  assert.equal(inventory.axiomCount, 4);
  assert.deepEqual(inventory.projectAxioms, [
    'PNP.CheckPCCPackexp',
    'PNP.GeneratePCCPack',
    'PNP.LockedNANDThreshold',
    'PNP.ResidualBandExactMinimization',
  ]);

  const gate = status.concretePublicationGate;
  assert.equal(status.abstractPEqualsNPPublicationEligible, false);
  assert.equal(status.publicationStatusDerivedOnlyFromConcreteGate, true);
  assert.equal(gate.abstractPEqualsNPIsPublicationIneligible, true);
  assert.equal(gate.unsetFingerprintIsIntentionalFailClosedMigrationGate, true);
  assert.equal(gate.expectedConcreteTargetKernelTypeSha256, null);
  assert.equal(gate.expectedSourceClosureSha256, null);
  assert.equal(gate.subchecks.concreteTargetKernelTypeFingerprintConfigured, false);
  assert.equal(gate.subchecks.concreteTargetKernelTypeFingerprintMatches, false);
  assert.equal(gate.subchecks.sourceClosureFingerprintConfigured, false);
  assert.equal(gate.subchecks.sourceClosureFingerprintMatches, false);
  assert.equal(gate.subchecks.concreteTargetPresent, true);
  assert.equal(inventory.concreteTargetCandidate?.name, 'PNP.Main.ConcretePEqualsNP');
  assert.equal(inventory.concreteTargetCandidate?.kind, 'definition');
  assert.deepEqual(inventory.concreteTargetCandidate?.axioms, []);
  assert.equal(gate.subchecks.compatibilityRootPresent, false);
  assert.equal(gate.passed, false);

  for (const key of [
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
    'finalTheoremReady',
    'satInPConclusionAccepted',
    'pEqualsNPConclusionAccepted',
    'rootLeanTheoremPresent',
    'rootLeanTheoremBuilt',
    'rootLeanTheoremAxiomAuditPassed',
  ]) assert.equal(status[key], false, key);
  assert.equal(status.publicTheoremStatement, null);
  assert.equal(status.publicTheoremConclusion, null);
  assert.equal(status.projectSpecificAxiomsRemaining, true);
  assert.deepEqual(status.projectSpecificAxiomInventory, inventory.projectAxioms);
  assert.equal(status.remainingBlockers.length, 7);
  assert.equal(status.leanConcreteCNFSATMembershipFormalized, true);
  assert.equal(status.leanConcreteCNFSATMembershipTheorem, 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP');
  assert.equal(status.leanConcreteCNFVerifierCorrectnessFormalized, true);
  assert.equal(status.leanConcreteCNFVerifierNoTimeoutFormalized, true);
  assert.equal(status.leanConcreteCNFWorkAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCNFWorkAuditedDeclarationCount, 766);
  assert.equal(status.leanConcretePipelineTerminalOutputPackingFormalized, true);
  assert.equal(status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount, 69);
  assert.equal(status.leanConcretePipelineRawRefinementFormalized, false);
  assert.equal(status.leanConcretePipelineExternalInputSizePolynomialFormalized, false);
  assert.equal(status.leanConcreteCNFSATInPFormalized, false);
  assert.equal(status.leanConcreteCNFNPCompletenessFormalized, false);

  const membership = inventory.milestoneCandidates.find((candidate) => candidate.name === status.leanConcreteCNFSATMembershipTheorem);
  assert.equal(membership.kind, 'theorem');
  assert.equal(membership.module, 'PNP.Concrete.CNFWorkUniversalCorrectness');
  assert.deepEqual(membership.axioms, []);
  assert.equal(membership.kernelType, 'Lean.Expr.app (Lean.Expr.const `PNP.Concrete.InNP []) (Lean.Expr.const `PNP.Concrete.CNFSAT [])');

  const packer = inventory.milestoneCandidates.find((candidate) => candidate.name === 'PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq');
  assert.equal(packer.kind, 'theorem');
  assert.equal(packer.module, 'PNP.Concrete.TerminalOutputPacker');
  assert.deepEqual(packer.axioms, []);
  assert.equal(inventory.milestoneCandidates.length, 108);

  assert.equal(status.formalPublicationMilestones.length, 12);
  assert.deepEqual(status.formalPublicationMilestones.map((row) => row.earned), [true, true, true, true, true, true, true, true, true, false, false, false]);
  for (const row of status.formalPublicationMilestones.slice(0, 9)) {
    assert.equal(row.allPresent, true, row.id);
    assert.equal(row.allAssumptionFree, true, row.id);
    assert.equal(row.allKernelTypesMatch, true, row.id);
    assert.equal(row.sourceClosureFingerprintMatches, true, row.id);
  }
  assert.equal(status.formalPublicationMilestones.at(-1).nonClaim.includes('ineligible'), true);

  for (const command of [
    'lake build PNP',
    'node scripts/export-lean-theorem-inventory.mjs --check',
    'node scripts/generate-formal-publication.mjs --check',
    'npm run report:check',
  ]) assert.ok(status.verificationCommands.includes(command), command);
});

test('current status inventories publication workflows while PNPLabs operational audit remains separate', async () => {
  const status = await readJson('public/pnp-status.json');
  const operationalWorkflows = new Set(['production-deployment-consistency.yml']);
  const names = (await readdir(new URL('../../.github/workflows/', import.meta.url)))
    .filter((name) => name.endsWith('.yml'))
    .filter((name) => !operationalWorkflows.has(name))
    .sort()
    .map((name) => `.github/workflows/${name}`);
  assert.deepEqual([...status.activeCompanionWorkflows].sort(), names);
  assert.deepEqual([...operationalWorkflows], ['production-deployment-consistency.yml']);
});

test('payload index describes current inventory/report and quarantines legacy surfaces', async () => {
  const index = await readJson('public/pnp-index.json');
  assert.equal(index.version, 19);
  assert.equal(index.sourceCommitRef, CORE_COMMIT);
  assert.equal(index.sourceProofCommitRef, 'a9b3b993f576b9f0384b469c35d3bff1a0d16e87');
  assert.equal(index.sourceTree, '06edc0585afea27df4f310f2e7143f4dea1ba79b');
  assert.equal(index.statusCoordinate, STATUS_COORDINATE);
  assert.equal(index.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-07-12-TERMINAL-OUTPUT-PACKER-23');
  assert.equal(index.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(index.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(index.canonicalReportCoordinate, 'PNP-CANONICAL-FORMAL-RECONSTRUCTION-REPORT-2026-07-12-23');
  assert.equal(index.canonicalReportPages, 9);
  assert.equal(index.formalPublicationRelease, '/downloads/formal-publication-release.json');
  assert.equal(index.status, 'formal-reconstruction-current-gate-closed');
  assert.equal(index.claimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(index.claimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(index.claimBoundary.publicTheoremStatement, null);
  assert.equal(index.claimBoundary.abstractPEqualsNPPublicationEligible, false);
  assert.equal(index.claimBoundary.publicationStatusDerivedOnlyFromConcreteGate, true);
  assert.equal(index.claimBoundary.concretePublicationGatePassed, false);
  assert.equal(index.claimBoundary.leanTheoremInventoryDeclarationCount, 5023);
  assert.equal(index.claimBoundary.leanTheoremInventoryTheoremCount, 2081);
  assert.equal(index.claimBoundary.leanTheoremInventoryAssumptionFreeTheoremCount, 1980);
  assert.equal(index.claimBoundary.leanTheoremInventoryExcludedPrivateDeclarationCount, 950);
  assert.equal(index.claimBoundary.leanTheoremInventorySourceClosureModuleCount, 45);
  assert.equal(index.claimBoundary.leanConcreteCNFSATMembershipFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStateNamespaceFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStateNamespaceAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStateNamespaceAuditedDeclarationCount, 39);
  assert.equal(index.claimBoundary.leanConcretePipelineStageBridgesFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStageBridgesAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStageBridgesAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcretePipelineStageLaunchFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineVerdictPreservationFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineInternalOutputHandoffComposed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackingFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount, 69);
  assert.equal(index.claimBoundary.leanConcretePipelineRawRefinementFormalized, false);
  assert.equal(index.claimBoundary.leanConcretePipelineExternalInputSizePolynomialFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCNFSATInPFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCNFNPCompletenessFormalized, false);
  assert.equal(index.claimBoundary.remainingBlockers.length, 7);
  assert.deepEqual(index.formalPublicationMilestoneCounts, { earned: 9, notFormalized: 3, total: 12 });
  assert.equal(index.earnedMilestones.length, 9);
  assert.ok(index.earnedMilestones.includes('concrete-cnf-universal-verifier'));
  assert.deepEqual(index.unearnedMilestones, ['global-locked-nand-threshold', 'global-zeroslack-pccmin', 'concrete-publication-root']);
  assert.equal(index.payloads.find((entry) => entry.id === 'pnp-status').status, 'current');
  assert.equal(index.payloads.find((entry) => entry.id === 'pnp-theorem-inventory').status, 'current');
  for (const id of ['pnp-one-command-upload', 'pnp-verification-runs', 'pnp-verifier-run-comparison-matrix', 'pnp-verifier-run-matrix-summary']) {
    assert.equal(index.payloads.find((entry) => entry.id === id).status, 'historical-frozen');
  }
  for (const command of [
    'lake build PNP',
    'npm run pnp:verify -- --no-write',
    'npm run formal:inventory:check',
    'npm run formal:publication:check',
    'npm run report:check',
    'node --test audits/lean-concrete-machine0.test.mjs',
    'node --test audits/lean-concrete-complexity0.test.mjs',
    'node --test audits/lean-concrete-cnf0.test.mjs',
    'node --test audits/lean-concrete-terminal-output-packer0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteBitStringAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteMachineAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteComplexityAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteTerminalOutputPackerAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteTargetAxiomAudit.lean',
  ]) {
    assert.ok(index.verificationCommands.includes(command), command);
  }
});

test('status page has a conservative complete static fallback', async () => {
  const html = await readText('status.html');
  for (const fragment of [
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'publicTheoremStatement = null',
    'concretePublicationGate.passed = false',
    '5,023',
    '2,081',
    '1,980',
    'Nine scoped milestones',
    'PNP.Concrete.FinalUniversalDesign.cnfSATInNP',
    'This does not prove CNF-SAT in P, NP-completeness, or P = NP.',
    'three global milestones',
    'PNP.Main.ConcretePEqualsNP',
    'PNP.Main.p_eq_np',
    'null never matches null',
    'PNP.PEqualsNP',
    'Formal.ResidualBandMinimizer',
    'Formal.RootTheoremAndAxiomAudit',
    'PNP.CheckPCCPackexp',
    'Historical 56-page manuscript',
    '7072f8d0bda6d44d240f9bb3fad624fd357e1278',
  ]) assert.equal(html.includes(fragment), true, `missing status fragment: ${fragment}`);
  assert.equal((html.match(/data-earned="true"/g) || []).length, 9);
  assert.equal((html.match(/data-earned="false"/g) || []).length, 3);
});

test('older public-review payloads remain explicitly superseded and non-authoritative', async () => {
  for (const path of [
    'public/pnp-public-review.json',
    'public/pnp-theorem-emission-gate.json',
    'public/pnp-external-review-status.json',
  ]) {
    const payload = await readJson(path);
    assert.equal(payload.historical, true, `${path}: historical flag`);
    assert.equal(payload.currentStatusAuthority, false, `${path}: authority flag`);
    assert.equal(payload.currentClaimBoundary.mathematicalTheoremEstablished, false, `${path}: theorem boundary`);
    assert.equal(payload.currentClaimBoundary.publicTheoremEmissionAllowed, false, `${path}: emission boundary`);
  }
});
