# PNP Labs public status package

This checkout is the public website, current inventory-derived report bundle, checksum manifest, reviewer documentation, minimal fixture harness, and smoke-test package for the PNP project.

## Current status

**Formal reconstruction is in progress. The repository does not currently establish `P = NP`.**

The exact status mirror is [`public/pnp-status.json`](public/pnp-status.json), copied verbatim from `aisknab/pnp/public/pnp-status.json`. Its current boundary is:

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
leanConcretePipelineAllInputFramingFormalized = true
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
concretePublicationGate.passed = false
```

The pinned `leanprover/lean4:v4.31.0` toolchain compiles the explicit `PNP` library root. [`public/pnp-theorem-inventory.json`](public/pnp-theorem-inventory.json) is the exact public mirror of the compiled environment inventory: **7,746** exported public declarations across **70** modules, including **3,725** theorem-kind declarations and **2,865** assumption-free theorem-kind declarations. It excludes **2,286** private compiler auxiliaries and records **four** project axioms.

The inventory-derived publication map binds 549 reviewed theorem candidates to kernel-type fingerprints and binds the complete Lean source/configuration closure. Twenty-seven scoped milestones are earned. In addition to the concrete CNF-SAT verifier and raw-machine compilers, `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language` connects the generated formula exactly to the concrete verifier language, while `encodedFormula_size_le` bounds the actual canonical unary-indexed encoding by an explicit fixed-verifier polynomial in external input length. The answer-independent rectangular schedule has exact polynomial length, and `formulaBitSchedule_emit_eq_encodedFormula` proves that removing empty slots reproduces the canonical encoded formula. The direct formula cursor decodes any constraint, clause, token, or bit coordinate without first constructing the complete canonical objects. Fixed finite machines provide input framing, unary tallying, reusable two-bit token appending, the complete width header, and the separator that starts the body. The new `BuilderFirstClausePrefix.machine` composes the preceding first-literal machine, a structurally generated unary next-slot evaluator, and a fixed eight-token tail. Every raw bitstring emits `T^FormulaWidth F Sep T F T T F T T T F Finish`, the canonical prefix through the complete positive first clause on variables zero, one, and two; `firstClauseTokens_eq_canonical_formula_prefix` identifies the exact formula prefix, and `nextTokenSlot_eq_formulaVariableSlotBound_add_twelve` retains the following coordinate under an external `NatPolynomial` bound. Its table has exactly `1138 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)` rules. All 77 public declarations are completely audited, and the combined 78-declaration audit includes the predecessor halt-separation theorem; all 41 reviewed theorem types use only empty closure, `[propext]`, or `[Quot.sound, propext]`. The retained coordinate is data, not a dynamic cursor. The remaining formula body, complete raw builder, builder `FunctionProgram.RawRefinement`, and packaged `PolynomialReduction` are absent. Therefore CNF-SAT NP-completeness, CNF-SAT in P, and `P = NP` remain unproved. Three global milestones remain unearned: the global locked-NAND construction/threshold; global ZeroSlack, PCCMin and polynomial runtime; and the concrete standard P-versus-NP target/root.

The abstract string-handle `PNP.PEqualsNP` bridge is explicitly publication-ineligible. `PNP.Main.ConcretePEqualsNP` is present as an inactive axiom-free definition for the finite charged-pipeline model, while `PNP.Main.p_eq_np` remains absent. The concrete publication gate is a strict conjunction of concrete semantics, target/root fingerprints, axiom closure and source closure; null expected fingerprints are unconfigured and never match null. All theorem-establishment and theorem-emission fields derive only from that gate.

The active blockers are the six entries in `remainingFormalObligations` and `remainingBlockers`, covering concrete SAT, the locked-NAND threshold, residual-band minimisation, ZeroSlack, polynomial bounds, and the root theorem plus axiom audit.

Legacy JavaScript checker acceptance verifies assertion-bearing records under implemented predicates. It is historical assertion-checker evidence only and is not a formal proof of the named mathematical propositions. Earlier activated coordinates, verifier-run records, digest matrices, and badge summaries are preserved only as historical audit records. Their intake is frozen and they are not current theorem-emission surfaces.

External review remains welcome as audit and bug-finding evidence, but it is not a mathematical premise or release blocker.

## Authoritative verification

Use the source repository for the current formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout f5b7b31b549260c6366302e616c71565e8857112
npm ci
lake build PNP
node pcc-formal-reconstruction-status0.mjs --json --no-write
node pcc-formal-public-surface0.mjs --json --no-write
npm run pnp:verify -- --no-write
npm run formal:inventory:check
npm run formal:publication:check
npm run report:check
node --test audits/lean-root-target0.test.mjs
node --test audits/lean-concrete-machine0.test.mjs
node --test audits/lean-concrete-complexity0.test.mjs
node --test audits/lean-concrete-cnf0.test.mjs
node --test audits/lean-nand-semantics0.test.mjs
node --test audits/lean-nand-enumerator0.test.mjs
node --test audits/lean-nand-reference-minimum0.test.mjs
node --test audits/lean-locked-nand-baseline0.test.mjs
node --test audits/lean-locked-nand-threshold-boundary0.test.mjs
node --test audits/lean-residual-routes0.test.mjs
lake env lean -DwarningAsError=true lean-audit/PNPBridgeAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcreteBitStringAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcreteMachineAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcreteComplexityAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcreteTargetAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcreteCNFAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcreteCNFWorkInputAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcreteCNFVerifierAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcreteCNFWorkAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineInputFramerAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineStateNamespaceAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineStageBridgesAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcreteTerminalOutputPackerAxiomAudit.lean
node --test audits/lean-concrete-pipeline-state-namespace0.test.mjs
node --test audits/lean-concrete-pipeline-input-framer0.test.mjs
node --test audits/lean-concrete-pipeline-stage-bridges0.test.mjs
node --test audits/lean-concrete-terminal-output-packer0.test.mjs
node --test audits/lean-concrete-pipeline-terminal-bridge0.test.mjs
node --test audits/lean-concrete-pipeline-paired-compiler0.test.mjs
node --test audits/lean-concrete-pipeline-compiler0.test.mjs
node --test audits/lean-concrete-pipeline-sequential-state-namespace0.test.mjs
node --test audits/lean-concrete-pipeline-sequential-compiler0.test.mjs
lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineTerminalBridgeAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelinePairedCompilerAxiomAudit.lean
lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelinePairedCompiler.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineCompilerAxiomAudit.lean
lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelineCompiler.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineSequentialStateNamespaceAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineSequentialCompilerAxiomAudit.lean
lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelineSequentialCompiler.lean
lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineRefinementAxiomAudit.lean
lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelineRefinementRecursive.lean
lake env lean -DwarningAsError=true lean-regression/PNPConcreteCNFWorkCanonical.lean
lake env lean -DwarningAsError=true lean-regression/PNPConcreteWorkCompilerEdges.lean
lake env lean -DwarningAsError=true --run lean-regression/PNPConcreteCNFWorkCanonicalExtended.lean
lake env lean -DwarningAsError=true lean-regression/PNPConcreteCNFWorkExhaustive.lean
lake env lean -DwarningAsError=true lean-audit/PNPNANDSemanticsAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPNANDEnumeratorAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPNANDTruthTableAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPNANDMinimumAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPNANDCompositionAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPNANDSlackAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDDirectAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPDirectWireBaselineAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDBaselineAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDLocalBaselineAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPLockedNANDThresholdBoundaryAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPResidualRoutesAxiomAudit.lean
```

These commands build the pinned Lean root, regenerate/check the compiled inventory and publication model, verify the report, and run the focused axiom audits. Their success does not fill the three unearned global milestones or establish the target theorem.

The public status page is [`status.html`](status.html).

## Public payloads

- [`public/pnp-index.json`](public/pnp-index.json) is the payload index and current conservative boundary summary.
- [`public/pnp-status.json`](public/pnp-status.json) is the exact authoritative status mirror.
- [`public/pnp-theorem-inventory.json`](public/pnp-theorem-inventory.json) is the exact compiled Lean declaration inventory mirror, hash-bound by the status payload.
- [`public/pnp-one-command-upload.json`](public/pnp-one-command-upload.json) records that the former activated-run upload path is frozen.
- [`public/pnp-verification-runs.json`](public/pnp-verification-runs.json) preserves the old run registry as a frozen historical snapshot.
- [`public/pnp-verifier-run-comparison-matrix.json`](public/pnp-verifier-run-comparison-matrix.json) and [`public/pnp-verifier-run-matrix-summary.json`](public/pnp-verifier-run-matrix-summary.json) are historical comparison records, not a current green status badge.
- [`public/pnp-public-review.json`](public/pnp-public-review.json), [`public/pnp-theorem-emission-gate.json`](public/pnp-theorem-emission-gate.json), and [`public/pnp-external-review-status.json`](public/pnp-external-review-status.json) are older audit payloads and do not override the current formal-reconstruction status.

## Trust boundaries

- A SHA-256 match verifies artefact identity only. It does not verify theorem correctness.
- The local minimal fixtures demonstrate named educational invariants only. They are not proof evidence.
- The historical JavaScript checker stack evaluates assertion-bearing records under its implemented predicates. It does not formalise or prove those asserted mathematical propositions.
- The bundled canonical PDF and TeX are the current twenty-two-page inventory-derived formal status report. They report `CNFSAT ∈ NP`, raw-machine compilation, exact Cook-Levin semantic equivalence, the actual encoded-formula size polynomial, the exact answer-independent rectangular schedule, direct coordinate decoders with exact fuelled formula traversal, the literal input preparation and token-appender machines, the complete width header, and the composed first-clause prefix `T^FormulaWidth F Sep T F T T F T T T F Finish` with its retained next coordinate. They explicitly withhold a dynamic cursor controller, remaining formula-body emission, a complete raw formula builder, `FunctionProgram.RawRefinement`, a packaged polynomial reduction, CNF-SAT NP-completeness, CNF-SAT in P, and P = NP.
- A partial Lean bridge or a successful build of supporting modules is not the target theorem. The root theorem must exist, build, and pass an axiom audit without project-specific assumptions.
- The historical 56-page claim manuscript remains at tag `final-pnp-proof-report-hardened-7072f8d`, commit `7072f8d0bda6d44d240f9bb3fad624fd357e1278`, with provenance in `archive/legacy-v0/ARCHIVE.json`; it is never current authority.

## Reviewer starting points

- [status.html](status.html)
- [docs/reviewer_guide.md](docs/reviewer_guide.md)
- [docs/proof_pipeline.md](docs/proof_pipeline.md)
- [docs/trust_model.md](docs/trust_model.md)
- [docs/terminology_crosswalk.md](docs/terminology_crosswalk.md)
- [docs/audit_questions.md](docs/audit_questions.md)
- [docs/reproducibility.md](docs/reproducibility.md)
- [examples/minimal/README.md](examples/minimal/README.md)

## Local commands

```bash
npm run test:unit          # site and fixture-checker unit tests
npm run verify:seal        # public file identity only
npm run deployment:check  # staged runtime provenance and content closure
npm run verify:production # compare live production with this exact commit/tree
npm run examples:minimal   # educational pass/fail fixtures
npm run test:negative      # named negative fixture tests
npm run test:audit-targets # optional cross-repo provenance check; skips if ../pnp is unavailable
npm run repro:smoke        # public reproducibility smoke test
npm run test:docs          # local documentation link check
npm test                   # all local checks
```

## Website development

There is no build step for the static site. Run it locally with:

```bash
npm start
```

The pages load `assets/styles.min.css`. If CSS changes, regenerate it from `assets/styles.css` with:

```bash
npx clean-css-cli -o assets/styles.min.css assets/styles.css
```

The first viewport also uses an inline critical CSS block in each HTML page. If that block changes, update the matching `style-src` SHA-256 hash in `_headers` and `server.mjs`.

## Deployment boundary

Public hosting should serve only the static pages, `assets/`, `downloads/`, `robots.txt`, `sitemap.xml`, `security.txt`, `.well-known/security.txt`, `CNAME`, and public status material. Do not present this website checkout as a substitute for the source repository or its Lean source.

The atomic home-server procedure, runtime deployment provenance, Nginx boundary, rollback behavior,
and manual post-deployment audit are documented in
[`docs/deployment_verification.md`](docs/deployment_verification.md). Deployment coordinates and
hashes establish file identity only; they do not establish theorem correctness.
