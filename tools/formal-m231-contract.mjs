// M231 validates reviewed compiled evidence, never recompiles the core proof.
import { createHash } from 'node:crypto';

export const M231 = Object.freeze({
  "id": "concrete-cnf-np-completeness",
  "title": "Concrete CNF-SAT NP-hardness and NP-completeness",
  "scope": "For every language in the concrete bounded-certificate NP class, M231 extracts its polynomial-time verifier from NP membership and applies the complete source-derived all-input Cook-Levin PolynomialReduction to CNFSAT. Together with the existing concrete CNFSAT verifier, the closed theorem proves NPComplete CNFSAT in the selected finite-machine model. No reduction, execution trace, finite-instance restriction or correctness certificate is supplied. Both complete theorem interfaces are root-built and axiom-audited; their closures contain only the Lean standard axioms Classical.choice, Quot.sound and propext.",
  "nonClaim": "NP-completeness is hardness plus NP membership, not a deterministic polynomial-time SAT algorithm. This closes only the fixed concrete NP-hardness checkpoint. It does not close the separate final complexity transport to P = NP, unconditional residual minimization or ZeroSlack, complete polynomial PCCMin construction and certificate bounds, deterministic CNFSAT in P, or the eligible root theorem. All five global proof gates and the publication gate remain open; P = NP is not proved.",
  "sourceCommit": "e4af115a66cd5a6715a9363abea7a2008238d401",
  "sourceTree": "28bf3e0bb8f4afccf308859c5f42f9c27b14edbb",
  "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-11-231",
  "module": "PNP.Concrete.CookLevinNPCompleteness",
  "fields": {
    "leanConcreteCNFNPCompletenessFormalized": true,
    "leanConcreteCNFNPCompletenessAxiomAuditPassed": true,
    "leanConcreteCNFNPCompletenessAuditedDeclarationCount": 2,
    "leanConcreteCNFNPCompletenessTheorem": "PNP.Concrete.CookLevin.cnfSAT_np_complete",
    "leanConcreteCNFNPCompletenessHardnessTheorem": "PNP.Concrete.CookLevin.cnfSAT_np_hard"
  },
  "releaseFields": {
    "cnfSATNPCompletenessFormalized": true,
    "cnfSATNPCompletenessAxiomAuditPassed": true,
    "cnfSATNPCompletenessAuditedDeclarationCount": 2
  },
  "theorems": {
    "PNP.Concrete.CookLevin.cnfSAT_np_hard": {
      "hash": "c2cae5f7ad14a81b32888e8405210b57552dea928200cc77e9ebb34099ec9909",
      "axioms": [
        "Classical.choice",
        "Quot.sound",
        "propext"
      ]
    },
    "PNP.Concrete.CookLevin.cnfSAT_np_complete": {
      "hash": "7b1c0556dde7066ebe7abc9706b400857b9dd41dc1d704930a1f1d6c423bbe35",
      "axioms": [
        "Classical.choice",
        "Quot.sound",
        "propext"
      ]
    }
  }
});
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const requireBoundary = (ok, layer, detail, kind = 'boundary') => {
  if (!ok) throw new Error(`${layer} M231 ${detail} ${kind} mismatch`);
};
const fingerprint = row => createHash('sha256').update(
  'PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n' +
  'milestone-theorem-type:' + row.name + '\n' + row.kernelType
).digest('hex');

function checkMilestone(row, layer) {
  requireBoundary(row && row.id === M231.id
    && row.classification === 'formalized-foundation-only'
    && row.scope === M231.scope && row.nonClaim === M231.nonClaim
    && same(row.requiredTheorems, Object.keys(M231.theorems)), layer, 'milestone');
}

export function assertM231PublicationMap(map) {
  const rows = map.milestones?.filter(row => row.id === M231.id);
  requireBoundary(rows?.length === 1, 'core publication map', 'milestone count');
  checkMilestone(rows[0], 'core publication map');
  for (const [name, evidence] of Object.entries(M231.theorems)) {
    requireBoundary(map.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash,
      'core publication map', name, 'fingerprint');
  }
}

export function assertM231Status(status) {
  const rows = status.formalPublicationMilestones?.filter(row => row.id === M231.id);
  requireBoundary(rows?.length === 1, 'status', 'milestone count');
  const row = rows[0];
  checkMilestone(row, 'status');
  requireBoundary(row.status === 'formalized-foundation-only' && row.earned === true
    && row.allPresent === true && row.allAssumptionFree === false
    && row.allKernelTypesMatch === true && row.axiomClosureUsesOnlyLeanStandardAllowlist === true
    && row.sourceClosureFingerprintMatches === true, 'status', 'milestone');
  for (const [key, value] of Object.entries(M231.fields)) {
    requireBoundary(same(status[key], value), 'status', key, 'evidence');
  }
  requireBoundary(same(row.theoremRows?.map(proof => proof.name), Object.keys(M231.theorems)),
    'status', 'theorem set');
  for (const proof of row.theoremRows) {
    const evidence = M231.theorems[proof.name];
    requireBoundary(proof.present === true && proof.kind === 'theorem'
      && same(proof.axioms, evidence.axioms)
      && proof.actualKernelTypeSha256 === evidence.hash
      && proof.expectedKernelTypeSha256 === evidence.hash
      && proof.kernelTypeFingerprintMatches === true, 'status', proof.name, 'theorem');
  }
}

export function assertM231Inventory(inventory) {
  for (const [name, evidence] of Object.entries(M231.theorems)) {
    const rows = inventory.milestoneCandidates?.filter(row => row.name === name);
    const row = rows?.[0];
    requireBoundary(rows?.length === 1 && row?.kind === 'theorem'
      && row.module === M231.module && same(row.axioms, evidence.axioms)
      && typeof row.kernelType === 'string' && fingerprint(row) === evidence.hash,
      'inventory', name, 'theorem');
  }
}

export function assertM231Manifest(manifest) {
  const earned = manifest.earnedBoundary ?? {};
  for (const [key, value] of Object.entries(M231.releaseFields)) {
    requireBoundary(same(earned[key], value), 'current manifest', key);
  }
  requireBoundary(same(earned.cnfSATNPCompletenessTheoremKernelTypeSha256,
    Object.fromEntries(Object.entries(M231.theorems).map(([name, evidence]) => [name, evidence.hash]))),
    'current manifest', 'theorem set', 'fingerprint');
  requireBoundary(earned.cnfSATNPCompletenessTheorem === M231.fields.leanConcreteCNFNPCompletenessTheorem
    && earned.cnfSATNPCompletenessHardnessTheorem === M231.fields.leanConcreteCNFNPCompletenessHardnessTheorem
    && same(earned.cnfSATNPCompletenessAxiomClosure, ['Classical.choice', 'Quot.sound', 'propext'])
    && same(earned.cnfSATNPCompletenessProjectAxiomClosure, [])
    && typeof earned.scope === 'string' && earned.scope.split('+plus-').includes(M231.id),
    'current manifest', 'theorem and axiom closure');
}
