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
leanConcretePipelineMalformedInputBehaviorFormalized = true
leanConcretePipelineSequentialCompilationFormalized = true
leanConcretePipelineRawRefinementFormalized = true
leanConcreteFunctionProgramRecursiveCompilationFormalized = true
leanConcreteDecisionProgramRecursiveCompilationFormalized = true
leanConcretePolynomialTimeDeciderRawCompilationFormalized = true
standardComplexityModelFormalized = true
leanConcreteCNFSATInPFormalized = false
leanConcreteCNFNPCompletenessFormalized = false
```

The short public statement is:

> Formal reconstruction is in progress. The repository does not currently establish P = NP.

The pinned `leanprover/lean4:v4.31.0` toolchain compiles the explicit `PNP` library root and exports a canonical theorem inventory. Eighteen narrowly scoped milestones are earned from reviewed theorem types, approved axiom closures, and the complete Lean-source digest. They include universal concrete CNF-SAT verifier correctness, exact accept/reject behavior, no timeout at a polynomial fuel bound, and `PNP.Concrete.FinalUniversalDesign.cnfSATInNP : InNP CNFSAT`. They also include literal raw-machine compilation, exact Cook-Levin semantics through `encodedFormula_mem_CNFSAT_iff_language`, the external encoded-size bound `encodedFormula_size_le`, and an answer-independent rectangular formula schedule. `formulaBitSchedule_length` proves the schedule length is exactly the existing external-input polynomial, while `formulaBitSchedule_emit_eq_encodedFormula` proves that removing empty slots reproduces the canonical encoding. The schedule milestone's reviewed closure is `[Quot.sound, propext]`, with no project or choice axiom. This is a pure schedule specification: it supplies no constant-time raw interpretation of a slot. A raw formula builder, construction-runtime polynomial, `FunctionProgram.RawRefinement`, and packaged polynomial reduction remain absent. The results do not prove CNF-SAT NP-completeness, CNF-SAT in P, or `P = NP`. Global locked-NAND construction, premise instantiation, candidate-universe completeness, ZeroSlack, PCCMin, the residual-band minimizer, polynomiality, and `PNP.Main.p_eq_np` remain unfinished. Four project-specific axioms and six formal blockers remain. The concrete target is present but inactive, the publication gate is false, and the abstract string-handle `PNP.PEqualsNP` bridge is publication-ineligible.

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

Every such surface must be labelled historical or superseded. The current canonical report is instead the thirteen-page inventory-derived non-claiming report. The activated-run intake is frozen. No green matrix badge is a current status signal.

## External review

External review is optional audit and bug-finding evidence. It is not a mathematical premise or release blocker. The formal result must stand or fail on its definitions, proofs, build, and axiom audit.

## Prohibited current wording

Current public surfaces must not say that theorem emission is enabled, that the final theorem is ready, that blockers are empty, or that the old checker stack emits an established `P = NP` theorem. Historical quotations or archived record fields must be explicitly marked as superseded data.
