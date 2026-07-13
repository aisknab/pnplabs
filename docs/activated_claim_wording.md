# Formal-reconstruction wording guard

This file supersedes its former activated-status wording. It remains at the same path so old links resolve, but its rules now enforce the current conservative boundary.

## Current required wording

Public surfaces must make these facts unambiguous:

```text
status = "formal-reconstruction-in-progress"
mathematicalTheoremEstablished = false
publicTheoremEmissionAllowed = false
publicTheoremStatement = null
finalTheoremReady = false
rootLeanTheoremPresent = false
rootLeanTheoremBuilt = false
rootLeanTheoremAxiomAuditPassed = false
projectSpecificAxiomsRemaining = true
leanConcreteCNFSATMembershipFormalized = true
leanConcretePipelineCanonicalPairCompilationFormalized = true
leanConcretePipelineExternalInputSizePolynomialFormalized = true
leanConcretePipelineMalformedInputBehaviorFormalized = false
leanConcretePipelineRawRefinementFormalized = false
leanConcreteCNFSATInPFormalized = false
leanConcreteCNFNPCompletenessFormalized = false
```

The short public statement is:

> Formal reconstruction is in progress. The repository does not currently establish P = NP.

The pinned `leanprover/lean4:v4.31.0` toolchain compiles the explicit `PNP` library root and exports a canonical theorem inventory. Nine narrowly scoped milestones are earned from reviewed theorem types, empty axiom closures, and the complete Lean-source digest. They prove universal concrete CNF-SAT verifier correctness, exact accept/reject behavior, no timeout at a polynomial fuel bound, and `PNP.Concrete.FinalUniversalDesign.cnfSATInNP : InNP CNFSAT`. They also prove a literal finite framer that accepts every raw bitstring—including empty and odd-length inputs—within `6 * m * m + 39 * m + 75` raw steps, and one literal four-stage raw compiler that, for every proof-bearing polynomial-time target and canonical `BitString.pair`, preserves exact verdict and `machineOutput`, cannot time out, and has explicit external output and runtime polynomials. No theorem transports arbitrary non-pair inputs from the local framer endpoint through simulation, handoff, and terminal packing, so full-pipeline malformed-input behavior and uniform all-input raw refinement remain absent. The results do not prove CNF-SAT in P, NP-completeness, or `P = NP`. Global locked-NAND construction, premise instantiation, candidate-universe completeness, ZeroSlack, PCCMin, the residual-band minimizer, polynomiality, and `PNP.Main.p_eq_np` remain unfinished. Four project-specific axioms and seven formal blockers remain. The concrete target is present but inactive, the publication gate is false, and the abstract string-handle `PNP.PEqualsNP` bridge is publication-ineligible.

## Checker wording

Use this boundary when describing the old JavaScript stack:

> Legacy JavaScript checker acceptance verifies assertion-bearing records under implemented predicates. It is historical assertion-checker evidence only and is not a formal proof of the named mathematical propositions.

Do not describe a passing legacy record, digest match, matrix cell, or site CI run as proof of the assertions stored in that record.

## Historical surfaces

The following are preserved only for auditability:

- `PNP-ACTIVATED-STATUS-2026-07-05-01` and related activation coordinates;
- the activated verifier-run registry and record schema;
- digest comparison matrices and summaries;
- the 56-page manuscript at source tag `final-pnp-proof-report-hardened-7072f8d`.

Every such surface must be labelled historical or superseded. The current canonical report is instead the ten-page inventory-derived non-claiming report. The activated-run intake is frozen. No green matrix badge is a current status signal.

## External review

External review is optional audit and bug-finding evidence. It is not a mathematical premise or release blocker. The formal result must stand or fail on its definitions, proofs, build, and axiom audit.

## Prohibited current wording

Current public surfaces must not say that theorem emission is enabled, that the final theorem is ready, that blockers are empty, or that the old checker stack emits an established `P = NP` theorem. Historical quotations or archived record fields must be explicitly marked as superseded data.
