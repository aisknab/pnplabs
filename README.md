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
leanConcreteLockedNANDEmitterAxiomAuditPassed = true
leanConcreteLockedNANDEmitterAuditedDeclarationCount = 3295
leanConcreteLockedNANDEmitterAllInputExactFormalized = true
leanConcreteLockedNANDEmitterExactTargetBytesFormalized = true
leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized = true
leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized = true
leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized = true
leanConcreteLockedNANDEmitterRawRefinementFormalized = true
leanConcreteLockedNANDEmitterStrictParserCompositionFormalized = true
leanConcreteLockedNANDEmitterOutputSizeBoundFormalized = true
leanConcreteLockedNANDPolynomialReductionFormalized = true
leanConcreteCNFSATInPFormalized = false
leanConcreteCNFNPCompletenessFormalized = false
leanResidualTerminalConsumerAntichainNormalFormFormalized = true
leanResidualTerminalConstantCutHypergraphRigidityFormalized = true
leanResidualTerminalConstantCutHypergraphRigidityAxiomAuditPassed = true
leanResidualTerminalBN6HypergraphPacketFormalized = true
leanResidualTerminalBN6HypergraphPacketAxiomAuditPassed = true
leanResidualTerminalPacketSelectorSeedsFormalized = true
leanResidualTerminalPacketSelectorSeedsAxiomAuditPassed = true
leanResidualTerminalPacketSelectorUniverseFormalized = true
leanResidualTerminalPacketSelectorUniverseAxiomAuditPassed = true
leanResidualTerminalPacketSelectorHandlesFormalized = true
leanResidualTerminalPacketSelectorHandlesAxiomAuditPassed = true
leanResidualTerminalPacketSelectorCodecFormalized = true
leanResidualTerminalPacketSelectorCodecAxiomAuditPassed = true
leanResidualTerminalPacketSelectorPayloadRealizationFormalized = true
leanResidualTerminalPacketSelectorPayloadRealizationAxiomAuditPassed = true
leanResidualTerminalPacketSelectorGainScanFormalized = true
leanResidualTerminalPacketSelectorGainScanAxiomAuditPassed = true
leanResidualTerminalPacketSelectorUniverseGainScanFormalized = true
leanResidualTerminalPacketSelectorUniverseGainScanAxiomAuditPassed = true
leanResidualTerminalPacketSelectorGainCoverageFormalized = true
leanResidualTerminalPacketSelectorGainCoverageAxiomAuditPassed = true
leanResidualTerminalPacketChargeSurplusFormalized = true
leanResidualTerminalPacketChargeSurplusAxiomAuditPassed = true
leanResidualTerminalPacketUnitChargeBlueprintRealizerFormalized = true
leanResidualTerminalPacketUnitChargeBlueprintRealizerAxiomAuditPassed = true
leanResidualTerminalPacketTypedRealizerContractFormalized = true
leanResidualTerminalPacketTypedRealizerContractAxiomAuditPassed = true
leanResidualTerminalHBBlockerGraphAcyclicityFormalized = true
leanResidualTerminalHBBlockerGraphAcyclicityAxiomAuditPassed = true
leanResidualTerminalHBBlockerGraphAcyclicityScope = "all-arbitrary-finite-hn-budget-data-edge-graphs-exhaustive-finite-to-exact-rank-embedding-strict-edge-descent-well-foundedness-and-no-directed-cycle"
leanResidualTerminalHBDependencyTableClosureFormalized = true
leanResidualTerminalHBDependencyTableClosureAxiomAuditPassed = true
leanResidualTerminalHBDependencyTableClosureScope = "all-arbitrary-finite-hn-budget-total-dependency-tables-exact-row-to-edge-coverage-strict-exact-rank-descent-well-founded-induction-and-no-directed-cycle"
leanResidualTerminalHBActiveDependencyClosureFormalized = true
leanResidualTerminalHBActiveDependencyClosureAxiomAuditPassed = true
leanResidualTerminalHBActiveDependencyClosureScope = "all-arbitrary-finite-hn-budget-total-tables-exhaustive-active-dependency-local-closure-exact-rank-induction-all-node-blocker-silence-and-gain-or-lower-seed-composition"
leanResidualTerminalHBSelectorSilenceClosureFormalized = true
leanResidualTerminalHBSelectorSilenceClosureAxiomAuditPassed = true
leanResidualTerminalHBSelectorSilenceClosureScope = "all-arbitrary-finite-canonical-selector-tables-explicit-global-semantic-gain-exclusion-checked-hn-budget-inactivity-strong-rank-induction-and-rank-complete-selector-silence"
leanResidualTerminalHBExecutableSelectorSilenceInductionFormalized = true
leanResidualTerminalHBExecutableSelectorSilenceInductionAxiomAuditPassed = true
leanResidualTerminalHBExecutableSelectorSilenceInductionScope = "all-arbitrary-finite-canonical-selector-tables-executable-all-row-selector-silence-checked-hn-budget-inactivity-strong-rank-induction-without-global-semantic-no-gain"
leanResidualTerminalPacketSelectorFaithfulnessRoutingFormalized = true
leanResidualTerminalPacketSelectorFaithfulnessRoutingAxiomAuditPassed = true
leanResidualTerminalPacketSelectorFaithfulnessRoutingScope = "all-arbitrary-finite-positive-bn6-packets-executable-canonical-payload-route-clearance-exact-hb-faithfulness-binding-and-selector-silence-contradiction"
leanZeroSlackPositiveSlackContradictionFormalized = false
leanResidualTerminalPkgCSeparatingConsumersFormalized = true
leanResidualTerminalPkgCSeparatingConsumersAxiomAuditPassed = true
leanResidualTerminalPkgCTypedRestorationFormalized = true
leanResidualTerminalPkgCTypedRestorationAxiomAuditPassed = true
leanResidualTerminalPkgCSameKeyCancellationFormalized = true
leanResidualTerminalPkgCSameKeyCancellationAxiomAuditPassed = true
leanResidualTerminalPkgCAmbientBN4LedgerFormalized = true
leanResidualTerminalPkgCAmbientBN4LedgerAxiomAuditPassed = true
leanResidualTerminalPkgCAmbientBN4ResidualReductionFormalized = true
leanResidualTerminalPkgCAmbientBN4ResidualReductionAxiomAuditPassed = true
concretePublicationGate.passed = false
```

The pinned `leanprover/lean4:v4.31.0` toolchain compiles the explicit `PNP` library root. [`public/pnp-theorem-inventory.json`](public/pnp-theorem-inventory.json) is the exact public mirror of the compiled environment inventory: **28,865** exported public declarations across **268** modules, including **14,874** theorem-kind declarations and **7,492** assumption-free theorem-kind declarations. It excludes **15,047** private compiler auxiliaries and records **four** project axioms.

The inventory-derived publication map binds 2,741 reviewed theorem candidates to kernel-type fingerprints and binds the complete Lean source/configuration closure. Exactly 127 of 129 scoped milestone rows are earned. They cover the concrete machine model, Cook-Levin semantics and the bounded formula-builder prefix, the typed locked-NAND threshold, strict codecs, fixed parsers and emitters, concrete polynomial reductions, verified residual-gain chains, the global semantic stopping specification, terminal carriers and support construction through computed BN2 square legitimacy, the computed terminal BCEL anchor nucleus with fail-closed proper-cut classification, the terminal saturation-positivity firewall, candidate-derived terminal saturation cost balance, finite interface-exposure routing, exact origin/kernel/obligation closure routing, the finite terminal positive-saturation composition, the fixed ten-coordinate residual RankWF, the report-facing concrete locked-NAND threshold theorem, the candidate-derived finite BN3 request envelope, the finite BN4 activation-exact same-key cancellation kernel, the finite BN5 full-shadow localization kernel, the finite PkgC separating-consumer restoration dichotomy, typed restoration realization, typed-restoration same-key cancellation, exact ambient-BN4-ledger embedding, exact ambient residual reduction, the arbitrary-finite V54 consumer-antichain normal form, the finite V53 constant-cut hypergraph rigidity classification, the finite BN6 grouped hypergraph-packet bridge, finite Packet selector-seed extraction, exact membership in the finite grouped-footprint payload-selector universe, canonical unique handles for those selectors, a fail-closed unary codec for those handles, total fail-closed recovery of the original source payload behind every accepted code, a checked scan of every original payload candidate in one selected source cell, an exhaustive scan across every canonical selector in the supplied explicit grouped family, a conditional source-gain-or-ZeroSlack bridge under an explicit proof-bearing global gain-coverage certificate, a generic finite Packet charge-surplus kernel, a constructive checked unit-charge blueprint realizer, a checked finite Packet typed-realizer contract, exact-rank acyclicity and total-table coverage for a supplied finite HN and budget dependency system, checked active-dependency closure for all supplied HN and budget activity bits, conditional selector silence under explicit global semantic gain exclusion, executable selector silence from an exhaustive all-row typed-bottom check plus strong finite-rank induction, and checked selector-faithfulness routing from positive Packets to a contradiction with that executable silence.

**Lean now routes positive Packets to a selector-silence contradiction**

For every explicit finite grouped BN6 family, Lean now checks ten canonical payload conditions and exact agreement with the supplied HB faithfulness table. A positive Packet conclusion then yields a faithful canonical handle, while the accepted executable selector-silence result proves that same handle nonfaithful. Those accepted inputs therefore produce a contradiction with selector silence.

The grouped family, payload fields, finite rank tags, route-clear checks, HB table, realizer claims, blocker activity, dependencies, and finite-to-exact rank map remain supplied inputs rather than constructions from terminal data. This is not positive slack, SaturatePositive, BCELReady, unconditional HB negative closure, unconditional ZeroSlack, PCCMin, polynomial runtime, SAT in P, removal of an assumption, or P = NP. The 98 percent figure remains a revisable editorial estimate, separate from the 127 of 129 scoped publication rows.

Its 11 reviewed theorem pins have five `propext`-only closures and six using `Quot.sound` with `propext`. The focused 20-declaration audit has five empty closures, nine `propext`-only closures, and six `Quot.sound` plus `propext` closures, with no project axiom or `Classical.choice`.

These are finite kernels over explicit caller-supplied inputs. They do not derive the BN4 ledger or BN5 payload and shadow universe from the four-corner bases; derive the ambient BN4 ledger, typed restorer, exact embedding, explicit remainder, successful candidate kernel, PkgC consumer antichain, typed restoration operation, coordinate maps, BN6 packet conclusion, survivor grouping, payloads, constant-cut equation, grouped family, gain-coverage certificate, replacement blueprints, occurrence pairings, unmatched lists, finite rank assignment, payload-route fields, faithfulness predicate and exact HB binding, exhaustive realizer claims, blocker-activity tables, dependency rows, active-dependency premise, or exact-rank mapping from terminal candidates; prove that every terminal-derived claim is a typed bottom or passes the route-clear checks; prove that the remainder is empty or route-producing; derive blocker semantics or semantic dependency completeness; build the manuscript's encoded or polynomial selector universe; prove selector compatibility; construct a complete realizer or global typed blocker route; establish unconditional global selector silence, polynomial enumeration, size bounds, generation, or runtime; establish the full historical BN4, BN5, PkgC, BN6, Packet selector and realizer, or HB negative-closure results; map the current finite terminal routes into a decreasing complete global outcome system; establish route completeness or Package E; prove manuscript-wide SaturatePositive or BCELReady; establish unconditional global `ZeroSlack` or PCCMin; prove SAT NP-hardness or CNF-SAT NP-completeness; place CNF-SAT in P; activate the legacy string-handle bridge; or prove `P = NP`. Two global milestones remain unearned: unconditional global ZeroSlack, PCCMin and polynomial runtime; and the concrete standard P-versus-NP target/root.

The abstract string-handle `PNP.PEqualsNP` bridge is explicitly publication-ineligible. `PNP.Main.ConcretePEqualsNP` is present as an inactive axiom-free definition for the finite charged-pipeline model, while `PNP.Main.p_eq_np` remains absent. The concrete publication gate is a strict conjunction of concrete semantics, target/root fingerprints, axiom closure and source closure; null expected fingerprints are unconfigured and never match null. All theorem-establishment and theorem-emission fields derive only from that gate.

The active blockers are the five entries in `remainingFormalObligations` and `remainingBlockers`, covering concrete SAT, residual-band minimisation, ZeroSlack, polynomial runtime and certificate bounds, and the root theorem plus axiom audit.

Legacy JavaScript checker acceptance verifies assertion-bearing records under implemented predicates. It is historical assertion-checker evidence only and is not a formal proof of the named mathematical propositions. Earlier activated coordinates, verifier-run records, digest matrices, and badge summaries are preserved only as historical audit records. Their intake is frozen and they are not current theorem-emission surfaces.

External review remains welcome as audit and bug-finding evidence, but it is not a mathematical premise or release blocker.

## Authoritative verification

Use the source repository for the current formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout b2e0b1e97744e365528b7c1a06e208a6481d7d1a
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

These commands build the pinned Lean root, regenerate/check the compiled inventory and publication model, verify the report, and run the focused axiom audits. Their success does not fill the two unearned global milestones or establish the target theorem.

The public status page is [`status.html`](status.html).

## Milestone updates

[`updates.html`](updates.html) publishes one plain-language update for every formal
milestone earned after the 39-milestone tracking baseline. Each entry has a
collapsed technical section generated from the canonical milestone record rather
than independently maintained prose. [`updates.xml`](updates.xml) is the Atom/RSS
subscription feed; following it requires no account or email address.

The editorial source is [`content/milestone-updates.json`](content/milestone-updates.json).
Its baseline set and entries must exactly cover the currently earned milestones,
so a formal-publication sync fails closed if it earns a milestone without adding
an update. Each entry binds to the exact merged core commit, tree, status, and
publication coordinate. It deliberately does not repeat the containing site
commit or deployment ID: those would be circular before the entry is committed.
The release seal and deployment-provenance record bind those identities
independently.

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
- The bundled canonical PDF and TeX are the current 102-page inventory-derived formal status report. They report `CNFSAT ∈ NP`, raw-machine compilation, exact Cook-Levin semantic equivalence, the bounded formula-building prefix, global locked-NAND baseline output conditions, strict encoding and concrete reductions, the verified residual and terminal-support chain through computed BN2 square legitimacy, candidate-derived saturation and finite routing, the fixed residual RankWF, the finite BN3 through BN6 and PkgC chain, the complete finite Packet selector pipeline through conditional gain coverage, the generic finite charge-surplus strict-gain kernel, the checked unit-charge blueprint realizer, the checked finite Packet typed-realizer contract, exact-rank acyclicity and total-table coverage for a supplied finite HN and budget dependency system, checked active-dependency closure, conditional selector silence under explicit global semantic gain exclusion, executable selector silence from an all-row typed-bottom check plus strong finite-rank induction, and selector-faithfulness routing from every positive Packet to a contradiction with that silence. They retain the axiom-free logical boundary witness showing that arbitrary per-cut BN2 realizability alone cannot imply a stable family.

  The report explicitly discloses that the BN3 repair enumerates all subsets; the BN4 ledger, BN5 payload and shadow universe, PkgC consumer antichain, typed restoration operation and coordinate maps, BN6 packet and grouped family data, candidate implementations, gain-coverage certificate, replacement blueprints, occurrence pairings, unmatched lists, semantic equivalence, finite rank assignment, payload-route data, faithfulness predicate and HB table, exhaustive realizer claims, blocker-activity tables, dependency rows, active-dependency premise, and exact-rank mapping remain explicit inputs. None of those inputs is derived from terminal data, and the executable checks do not prove every terminal-derived claim is a typed bottom or passes the route-clear predicate. Selector compatibility, complete replacement construction or polynomial enumeration, blocker semantics, semantic dependency completeness, unconditional selector silence, the full HB negative closure, a complete decreasing global route system, manuscript-wide SaturatePositive, Package E, BCELReady, unconditional global `ZeroSlack`, PCCMin exactness and polynomial runtime, the rest of the Cook-Levin formula body, SAT NP-hardness or CNF-SAT NP-completeness transport, CNF-SAT in P, and P = NP remain outside the earned scope.
- A partial Lean bridge or a successful build of supporting modules is not the target theorem. The root theorem must exist, build, and pass an axiom audit without project-specific assumptions.
- The historical 57-page claim manuscript remains at tag `final-pnp-proof-report-hardened-7072f8d`, commit `7072f8d0bda6d44d240f9bb3fad624fd357e1278`, with provenance in `archive/legacy-v0/ARCHIVE.json`; it is never current authority.

## Reviewer starting points

- [status.html](status.html)
- [docs/audience_and_usability.md](docs/audience_and_usability.md)
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
npm run verify:browser-report # browser checker and current seal agree
npm run deployment:check  # staged runtime provenance and content closure
npm run verify:production # compare live production with this exact commit/tree
npm run examples:minimal   # educational pass/fail fixtures
npm run test:negative      # named negative fixture tests
npm run test:audit-targets # optional cross-repo provenance check; skips if ../pnp is unavailable
npm run repro:smoke        # public reproducibility smoke test
npm run test:docs          # local documentation link check
npm run updates:generate   # regenerate the milestone page and Atom feed
npm run updates:check      # reject missing entries or stale generated bytes
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

The first viewport also uses an inline critical CSS block in each HTML page. If that block changes, update the matching `style-src` SHA-256 hash in `_headers` and `public-surface.mjs`.

## Deployment boundary

Public hosting should serve only the static pages, `assets/`, `downloads/`, `robots.txt`, `sitemap.xml`, `security.txt`, `.well-known/security.txt`, `CNAME`, and public status material. Do not present this website checkout as a substitute for the source repository or its Lean source.

The atomic home-server procedure, runtime deployment provenance, Nginx boundary, rollback behavior,
and manual post-deployment audit are documented in
[`docs/deployment_verification.md`](docs/deployment_verification.md). Deployment coordinates and
hashes establish file identity only; they do not establish theorem correctness.
