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
leanLockedNANDUnsatisfiableFinalZeroFormalized = true
leanLockedNANDGlobalSemanticThresholdFormalized = true
leanLockedNANDResidualSlackAtMostFourFormalized = true
leanConcreteLockedNANDCanonicalEncodingFormalized = true
leanConcreteLockedNANDCompleteCandidateCodecFormalized = true
leanConcreteLockedNANDEncodedSemanticReductionFormalized = true
leanConcreteLockedNANDParserMachineFormalized = true
leanConcreteLockedNANDParserAxiomAuditPassed = true
leanConcreteLockedNANDParserAuditedDeclarationCount = 380
leanConcreteLockedNANDParserAllInputExactFormalized = true
leanConcreteLockedNANDParserCompiledNonTimeoutFormalized = true
leanConcreteLockedNANDParserRawRefinementFormalized = true
leanConcreteLockedNANDEmitterMachineFormalized = true
leanConcreteLockedNANDPolynomialReductionFormalized = true
leanConcreteCNFSATInPFormalized = false
leanConcreteCNFNPCompletenessFormalized = false
```

The short public statement is:

> Formal reconstruction is in progress. The repository does not currently establish P = NP.

The pinned `leanprover/lean4:v4.31.0` toolchain compiles the explicit `PNP` library root and exports a canonical theorem inventory. Seventy-six narrowly scoped milestones are earned from reviewed theorem types, approved axiom closures, and the complete Lean-source digest. They include universal concrete CNF-SAT verifier correctness and NP membership, literal raw-machine compilation, exact Cook-Levin semantics and a bounded formula-building prefix, arbitrary-circuit locked-NAND carrier/trace equivalence, exact candidate assembly, both whole-carrier final-output branches, the typed semantic threshold, strict version-zero encoding round trips, a pure encoded semantic construction, one literal 228-state, 2,052-rule source parser, and one literal 1,387,921-rule target emitter. For every grammar-decoded circuit the emitter produces the exact direct locked-NAND target; malformed grammar yields empty output. Lean proves an explicit all-input polynomial runtime, a quadratic output-size bound, compiled polynomial-time machine/function witnesses, exact leaf `RawRefinement`, and strict parser/emitter composition computing `buildLockedNANDInstance`. That composition is packaged as a concrete polynomial many-one reduction from `EncodedNANDSAT` to `EncodedLockedNANDThreshold`, with exact function identity, exact output, all-bitstring language equivalence, a `ReducesTo` witness, and recursive raw-machine refinement. A semantic compiler transforms every strict canonical CNF formula into an intrinsically topological NAND circuit with exact satisfiability preservation, exact gate count, a quadratic serialized-output bound, malformed-input failure, and semantic locked-threshold composition. A fixed 135,070-rule three-node finite work graph implements that compiler, proves exact output and non-timeout execution under one external polynomial, supplies a `PolynomialTimeFunction` and literal `RawRefinement`, packages a direct `PolynomialReduction` from `CNFSAT` to `EncodedNANDSAT`, and composes it to `EncodedLockedNANDThreshold`. A preceding milestone proves a universal length bound for every finite proof-bearing or executably verified strict equivalent-gain chain, preserves semantics and the exhaustive reference minimum, and specializes to at most four verified steps for the complete locked-NAND candidate. The terminal full-carrier milestone preserves the exact direct-wire circuit, gate count, and complete multi-output semantics, equates its terminal minimum with the exhaustive reference minimum, and characterizes positive slack by cheaper whole-span full realizations. A terminal mode firewall adds a computed ten-role profile and an explicit forgetful projection that preserves exact implementation, gate count, and complete semantics; a selected-coordinate comparison lifts to the full profile exactly when every omitted coordinate agrees. The newest projection-minimum milestone exhaustively computes attained full-profile and quotient-profile minima through the supplied implementation size, proves projection monotonicity and an exact nonnegative defect decomposition, and characterizes zero defect by a checked full lift at an attained quotient minimum. Proper or governed supports, arbitrary manuscript quotient construction, saturation, ZeroSlack, PCCMin exactness, and polynomial runtime remain unformalized. It does not discover gains, prove completeness or stopping, construct `ZeroSlack`, provide polynomial minimum search, establish polynomial checker or PCCMin runtime, decide CNF-SAT, discharge an assumption, or prove `P = NP`. Four project-specific axioms and six formal blockers remain. The concrete target is present but inactive, the publication gate is false, and the abstract string-handle `PNP.PEqualsNP` bridge is publication-ineligible.

## Checker wording

Use this boundary when describing the old JavaScript stack:

> Legacy JavaScript checker acceptance verifies assertion-bearing records under implemented predicates. It is historical assertion-checker evidence only and is not a formal proof of the named mathematical propositions.

Do not describe a passing legacy record, digest match, matrix cell, or site CI run as proof of the assertions stored in that record.

## Historical surfaces

The following are preserved only for auditability:

- `PNP-ACTIVATED-STATUS-2026-07-05-01` and related activation coordinates;
- the activated verifier-run registry and record schema;
- digest comparison matrices and summaries;
- the 57-page manuscript at source tag `final-pnp-proof-report-hardened-7072f8d`.

Every such surface must be labelled historical or superseded. The current canonical report is instead the seventy-two-page inventory-derived non-claiming report. The activated-run intake is frozen. No green matrix badge is a current status signal.

## External review

External review is optional audit and bug-finding evidence. It is not a mathematical premise or release blocker. The formal result must stand or fail on its definitions, proofs, build, and axiom audit.

## Prohibited current wording

Current public surfaces must not say that theorem emission is enabled, that the final theorem is ready, that blockers are empty, or that the old checker stack emits an established `P = NP` theorem. Historical quotations or archived record fields must be explicitly marked as superseded data.
