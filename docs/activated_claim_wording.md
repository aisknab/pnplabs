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

The pinned `leanprover/lean4:v4.31.0` toolchain compiles the explicit `PNP` library root and exports a canonical theorem inventory. Thirty-four narrowly scoped milestones are earned from reviewed theorem types, approved axiom closures, and the complete Lean-source digest. They include universal concrete CNF-SAT verifier correctness, exact accept/reject behavior, no timeout at a polynomial fuel bound, and `PNP.Concrete.FinalUniversalDesign.cnfSATInNP : InNP CNFSAT`. They also include literal raw-machine compilation, exact Cook-Levin semantics through `encodedFormula_mem_CNFSAT_iff_language`, the external encoded-size bound `encodedFormula_size_le`, an answer-independent rectangular formula schedule, and a direct formula cursor. Fixed finite machines reach the complete first and second clauses, traverse every remaining second-clause padding coordinate without emitting a token, and retain the third-clause separator coordinate. `BuilderSecondClausePaddingRun.machine` composes the complete second-clause prefix with generated unary evaluators for the remaining-padding count and third-clause coordinate, the reused fixed 25-rule padding countdown controller, and three total symbol-preserving bridges. Every raw bitstring preserves the complete second-clause output, traverses `FormulaTokensPerClause - 7` padding coordinates, reaches `FormulaVariableSlotBound + 1 + 2 * FormulaTokensPerClause`, proves direct schedule lookup there is `Sep`, and retains bits equal to `encodedFormula.take (2 * (FormulaWidth + 19))`. Its literal table has `2150` plus the six inherited/generated predecessor evaluator rule counts and two new evaluator rule counts; its external compiled bound is `BuilderSecondClausePrefix.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps`. The 68-declaration audit covers 65 new public declarations and three reviewed reused-countdown declarations: 26 have empty closure, 9 use only `[propext]`, and 33 use only `[Quot.sound, propext]`, with no project or choice axiom. This reaches clause three only as a retained coordinate. It does not emit the third-clause separator or remaining formula body, implement a general dynamic formula cursor, supply the complete raw builder or builder `FunctionProgram.RawRefinement`, or package a polynomial reduction. The results do not prove CNF-SAT NP-completeness, CNF-SAT in P, or `P = NP`. Global locked-NAND construction, premise instantiation, candidate-universe completeness, ZeroSlack, PCCMin, the residual-band minimizer, polynomiality, and `PNP.Main.p_eq_np` remain unfinished. Four project-specific axioms and six formal blockers remain. The concrete target is present but inactive, the publication gate is false, and the abstract string-handle `PNP.PEqualsNP` bridge is publication-ineligible.

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

Every such surface must be labelled historical or superseded. The current canonical report is instead the thirty-two-page inventory-derived non-claiming report. The activated-run intake is frozen. No green matrix badge is a current status signal.

## External review

External review is optional audit and bug-finding evidence. It is not a mathematical premise or release blocker. The formal result must stand or fail on its definitions, proofs, build, and axiom audit.

## Prohibited current wording

Current public surfaces must not say that theorem emission is enabled, that the final theorem is ready, that blockers are empty, or that the old checker stack emits an established `P = NP` theorem. Historical quotations or archived record fields must be explicitly marked as superseded data.
