// M229 publication contract, reviewed against core 3676a3f291193221e4ee3537aaf6023fba95ace0.
// These checks consume compiled evidence; they do not compile or prove Lean theorems.
import { createHash } from 'node:crypto';

export const M229 = Object.freeze({
  "id": "concrete-cook-levin-builder-physical-classifier-all-route-body-remainder-split",
  "title": "All-route physical body-remainder split",
  "scope": "For every concrete verifier problem and every coordinate in its complete post-header schedule, M229 runs M228 without a staged request, route, remainder or success certificate. It preserves the completed Finish endpoint and sends every body route through one fixed 36-rule physical scanner. The scanner crosses the retained clause-count and exterior boundaries, skips consumed-dividend marks, and distinguishes zero from positive remainder by the actual separator or unit symbol. The physical remainder equals the canonical body token coordinate. The collision-free 895-rule graph has exact work, six-for-one compiled execution, one-step-short nonhalting, and a verifier-input-size polynomial bound. All 71 public declarations are axiom-audited: 39 have empty closure, nine use only propext, and 23 use only propext and Quot.sound, with no project axiom or Classical.choice.",
  "nonClaim": "This milestone reads the physical body remainder but leaves clause occupancy and body-token and padding request synthesis open. Both body outcomes remain incomplete terminal configurations, distinguished by tape content. It does not connect successive schedule configurations, implement the repeated builder loop, prove builder FunctionProgram.RawRefinement, or package the Cook-Levin PolynomialReduction. It does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a fixed checkpoint or global gate, create the eligible root theorem, or prove P = NP.",
  "theoremName": "PNP.Concrete.CookLevin.BuilderPhysicalClassifierAllRouteBodyRemainderSplit.cook_levin_builder_physical_classifier_all_route_body_remainder_split_checked_complete",
  "module": "PNP.Concrete.CookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplit",
  "kernelTypeSha256": "5cb01b3ff8e154613151d8d131f576ce86bdc33e2d24d355793a3ca55ce7208f",
  "axioms": [
    "Quot.sound",
    "propext"
  ],
  "statusPrefix": "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplit",
  "releasePrefix": "cookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplit",
  "fields": {
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitFormalized": true,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitAxiomAuditPassed": true,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitAuditedDeclarationCount": 71,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitFixedSplitterRuleCount": 36,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitFixedComposedMachineRuleCount": 895,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitAllPostHeaderCoordinatesFormalized": true,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitCanonicalRequestStagedOnProtectedTape": false,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitPhysicalBodyRemainderSplitFormalized": true,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitFinishEndpointPreservedFormalized": true,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitClauseOccupancyFormalized": false,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitBodyRequestSynthesisFormalized": false,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitPaddingRequestSynthesisFormalized": false,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitSuccessiveConfigurationsFormalized": false,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitRepeatedBuilderLoopFormalized": false,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitExactWorkTraceFormalized": true,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitCompiledRawMachineFormalized": true,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitOneStepShortNonhaltingFormalized": true,
    "leanConcreteCookLevinBuilderPhysicalClassifierAllRouteBodyRemainderSplitExternalInputSizePolynomialFormalized": true
  }
});

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// Keep trust-layer diagnostics stable for the shared publication mutation tests.
const requireBoundary = (ok, layer, detail, kind = 'boundary') => {
  if (!ok) throw new Error(`${layer} M229 ${detail} ${kind} mismatch`);
};
const fingerprint = row => createHash('sha256').update(
  'PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n' +
  'milestone-theorem-type:' + row.name + '\n' + row.kernelType
).digest('hex');

function checkMilestone(row, layer) {
  requireBoundary(row && row.classification === 'formalized-foundation-only'
    && row.scope === M229.scope && row.nonClaim === M229.nonClaim
    && same(row.requiredTheorems, [M229.theoremName]), layer, 'milestone');
}

export function assertM229PublicationMap(map) {
  checkMilestone(map.milestones?.find(row => row.id === M229.id), 'core publication map');
  requireBoundary(map.earnedMilestoneTheoremKernelTypeSha256?.[M229.theoremName] === M229.kernelTypeSha256, 'core publication map', 'theorem', 'fingerprint');
}

export function assertM229Status(status) {
  const row = status.formalPublicationMilestones?.find(row => row.id === M229.id);
  checkMilestone(row, 'status');
  requireBoundary(row.status === 'formalized-foundation-only' && row.earned === true
    && row.allPresent === true && row.allAssumptionFree === false
    && row.allKernelTypesMatch === true && row.axiomClosureUsesOnlyLeanStandardAllowlist === true
    && row.sourceClosureFingerprintMatches === true, 'status', 'milestone');
  for (const [key, value] of Object.entries(M229.fields)) requireBoundary(status[key] === value, 'status', key, 'evidence');
  const proof = row.theoremRows?.[0];
  requireBoundary(row.theoremRows?.length === 1 && proof?.name === M229.theoremName
    && proof.present === true && proof.kind === 'theorem' && same(proof.axioms, M229.axioms)
    && proof.actualKernelTypeSha256 === M229.kernelTypeSha256
    && proof.expectedKernelTypeSha256 === M229.kernelTypeSha256
    && proof.kernelTypeFingerprintMatches === true, 'status', 'theorem');
}

export function assertM229Inventory(inventory) {
  const rows = inventory.milestoneCandidates?.filter(row => row.name === M229.theoremName);
  const row = rows?.[0];
  requireBoundary(rows?.length === 1 && row?.kind === 'theorem' && row.module === M229.module
    && same(row.axioms, M229.axioms) && fingerprint(row) === M229.kernelTypeSha256, 'inventory', 'compiled declaration', 'theorem');
}

export function assertM229Manifest(manifest) {
  const earned = manifest.earnedBoundary ?? {};
  for (const [key, value] of Object.entries(M229.fields)) {
    requireBoundary(earned[key.replace(M229.statusPrefix, M229.releasePrefix)] === value, 'current manifest', key);
  }
  requireBoundary(same(earned[M229.releasePrefix + 'TheoremKernelTypeSha256'],
    { [M229.theoremName]: M229.kernelTypeSha256 }), 'current manifest', 'theorem', 'fingerprint');
  requireBoundary(earned[M229.releasePrefix + 'CheckedCompleteTheorem'] === M229.theoremName
    && same(earned[M229.releasePrefix + 'AxiomClosure'], M229.axioms)
    && same(earned[M229.releasePrefix + 'ProjectAxiomClosure'], [])
    && typeof earned.scope === 'string' && earned.scope.split('+plus-').includes(M229.id), 'current manifest', 'release evidence');
}
