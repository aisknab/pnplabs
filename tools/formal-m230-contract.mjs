// M230 publication contract, reviewed against the exact merged core source.
// This validates compiled evidence and claim boundaries; it does not compile Lean.
import { createHash } from 'node:crypto';

export const M230 = Object.freeze({
  "id": "concrete-cook-levin-complete-builder",
  "title": "Complete all-input Cook-Levin formula builder and reduction",
  "scope": "For every concrete polynomial verifier and every ordinary raw bitstring, including empty and odd-length inputs, M230 runs the complete source-derived formula loop and physical output finalizer in one finite raw machine. Its exact ordinary output is the original canonical encoded Cook-Levin CNF formula, with total halting, runtime and output-size bounds polynomial in the original input length. The concrete PolynomialTimeFunction is a machine leaf; recursive FunctionProgram.RawRefinement preserves its output. The packaged PolynomialReduction to CNFSAT uses the already checked original formula semantics. No accepting certificate, execution trace, route, finite family, rank map or correctness certificate is supplied by the caller.",
  "nonClaim": "This completes the fixed all-input builder checkpoint, not a deterministic SAT algorithm. The separate named concrete NP-hardness or NP-completeness transport remains to be published. Unconditional residual minimization and ZeroSlack, complete polynomial PCCMin construction and certificate bounds, deterministic CNFSAT in P, and the eligible root theorem remain open. No global gate closes and P = NP is not proved. Execution theorem closures use only propext and Quot.sound; reduction-facing semantic closures additionally use the already allowed Lean standard axiom Classical.choice, never a project-specific axiom.",
  "sourceCommit": "a5e6b44e1345b5b1ca124391a5e57f02f95742dd",
  "sourceTree": "48938071581c3242c612573da1f0eb2f2e3f967e",
  "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-10-230",
  "module": "PNP.Concrete.CookLevinCompleteBuilder",
  "checkedCompleteTheorem": "PNP.Concrete.CookLevin.cook_levin_formula_builder_checked_complete",
  "fields": {
    "leanConcreteCookLevinBuilderDynamicCursorFormalized": true,
    "leanConcreteCookLevinFormulaBuilderFormalized": true,
    "leanConcreteCookLevinBuilderRawRefinementFormalized": true,
    "leanConcreteCookLevinBuilderPolynomialReductionFormalized": true
  },
  "releaseFields": {
    "cookLevinBuilderDynamicCursorInterpretationFormalized": true,
    "cookLevinBuilderDirectCursorRawInterpretationFormalized": true,
    "cookLevinCompleteRawFormulaBuilderFormalized": true,
    "cookLevinBuilderFunctionProgramRawRefinementFormalized": true,
    "cookLevinPolynomialReductionFormalized": true,
    "cookLevinCompleteBuilderFormalized": true,
    "cookLevinCompleteBuilderAxiomAuditPassed": true
  },
  "theorems": {
    "PNP.Concrete.CookLevin.formulaBuilderMachine_accept": {
      "hash": "f78cfac94de5b6d1c2e461b4542527ddb8490796f83741389238daf13c48f048",
      "axioms": [
        "Quot.sound",
        "propext"
      ]
    },
    "PNP.Concrete.CookLevin.formulaBuilderMachine_output": {
      "hash": "51f7ea88d2b8333cb5bfefd5d7c6b122c895e90b13508d7b48a5b00952d440f3",
      "axioms": [
        "Quot.sound",
        "propext"
      ]
    },
    "PNP.Concrete.CookLevin.formulaBuilder_output": {
      "hash": "9517c55b7e470350cfec99950cd933ddc6455e7d158c94f8b85eece418e28293",
      "axioms": [
        "Quot.sound",
        "propext"
      ]
    },
    "PNP.Concrete.CookLevin.formulaBuilder_rawRefinement_output": {
      "hash": "5afca0de879c1ff185aab5093c5622d7bc606404c2f05361c7bfa1231aa1b06e",
      "axioms": [
        "Quot.sound",
        "propext"
      ]
    },
    "PNP.Concrete.CookLevin.polynomialReduction_output": {
      "hash": "5957ea8d28eb75362bba1cfb0dba94d3840d139b2904899c2c8a61b2423698ed",
      "axioms": [
        "Classical.choice",
        "Quot.sound",
        "propext"
      ]
    },
    "PNP.Concrete.CookLevin.cook_levin_formula_builder_checked_complete": {
      "hash": "7c319be45d775041419206e62eec233cda9c000839b697d43f7e2bc25423b35c",
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
  if (!ok) throw new Error(`${layer} M230 ${detail} ${kind} mismatch`);
};
const fingerprint = row => createHash('sha256').update(
  'PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n' +
  'milestone-theorem-type:' + row.name + '\n' + row.kernelType
).digest('hex');

function checkMilestone(row, layer) {
  requireBoundary(row && row.id === M230.id
    && row.classification === 'formalized-foundation-only'
    && row.scope === M230.scope && row.nonClaim === M230.nonClaim
    && same(row.requiredTheorems, Object.keys(M230.theorems)), layer, 'milestone');
}

export function assertM230PublicationMap(map) {
  const rows = map.milestones?.filter(row => row.id === M230.id);
  requireBoundary(rows?.length === 1, 'core publication map', 'milestone count');
  checkMilestone(rows[0], 'core publication map');
  for (const [name, evidence] of Object.entries(M230.theorems)) {
    requireBoundary(map.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash,
      'core publication map', name, 'fingerprint');
  }
}

export function assertM230Status(status) {
  const rows = status.formalPublicationMilestones?.filter(row => row.id === M230.id);
  requireBoundary(rows?.length === 1, 'status', 'milestone count');
  const row = rows[0];
  checkMilestone(row, 'status');
  requireBoundary(row.status === 'formalized-foundation-only' && row.earned === true
    && row.allPresent === true && row.allAssumptionFree === false
    && row.allKernelTypesMatch === true && row.axiomClosureUsesOnlyLeanStandardAllowlist === true
    && row.sourceClosureFingerprintMatches === true, 'status', 'milestone');
  for (const [key, value] of Object.entries(M230.fields)) {
    requireBoundary(status[key] === value, 'status', key, 'evidence');
  }
  requireBoundary(same(row.theoremRows?.map(proof => proof.name), Object.keys(M230.theorems)),
    'status', 'theorem set');
  for (const proof of row.theoremRows) {
    const evidence = M230.theorems[proof.name];
    requireBoundary(proof.present === true && proof.kind === 'theorem'
      && same(proof.axioms, evidence.axioms)
      && proof.actualKernelTypeSha256 === evidence.hash
      && proof.expectedKernelTypeSha256 === evidence.hash
      && proof.kernelTypeFingerprintMatches === true, 'status', proof.name, 'theorem');
  }
}

export function assertM230Inventory(inventory) {
  for (const [name, evidence] of Object.entries(M230.theorems)) {
    const rows = inventory.milestoneCandidates?.filter(row => row.name === name);
    const row = rows?.[0];
    requireBoundary(rows?.length === 1 && row?.kind === 'theorem'
      && row.module === M230.module && same(row.axioms, evidence.axioms)
      && fingerprint(row) === evidence.hash, 'inventory', name, 'theorem');
  }
}

export function assertM230Manifest(manifest) {
  const earned = manifest.earnedBoundary ?? {};
  for (const [key, value] of Object.entries(M230.releaseFields)) {
    requireBoundary(same(earned[key], value), 'current manifest', key);
  }
  requireBoundary(same(earned.cookLevinCompleteBuilderTheoremKernelTypeSha256,
    Object.fromEntries(Object.entries(M230.theorems).map(([name, evidence]) => [name, evidence.hash]))),
    'current manifest', 'theorem set', 'fingerprint');
  requireBoundary(earned.cookLevinCompleteBuilderCheckedCompleteTheorem === M230.checkedCompleteTheorem
    && same(earned.cookLevinCompleteBuilderExecutionAxiomClosure, ['Quot.sound', 'propext'])
    && same(earned.cookLevinCompleteBuilderAxiomClosure, ['Classical.choice', 'Quot.sound', 'propext'])
    && same(earned.cookLevinCompleteBuilderProjectAxiomClosure, [])
    && typeof earned.scope === 'string' && earned.scope.split('+plus-').includes(M230.id),
    'current manifest', 'release evidence');
}
