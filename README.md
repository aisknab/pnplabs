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
leanResidualTerminalPacketSelectorFaithfulnessTableFormalized = true
leanResidualTerminalPacketSelectorFaithfulnessTableAxiomAuditPassed = true
leanResidualTerminalPacketSelectorFaithfulnessTableScope = "all-arbitrary-finite-canonical-packet-payload-faithfulness-table-construction-preserved-rank-claims-blocker-activity-binding-free-selector-silence-contradiction"
leanResidualTerminalPacketSelectorFirstRouteOutcomeFormalized = true
leanResidualTerminalPacketSelectorFirstRouteOutcomeAxiomAuditPassed = true
leanResidualTerminalPacketSelectorFirstRouteOutcomeScope = "all-arbitrary-finite-total-packet-first-route-classification-canonical-hb-selector-silence-without-route-clear-or-binding-premises"
leanResidualTerminalPacketSelectorFirstRouteSemanticsFormalized = true
leanResidualTerminalPacketSelectorFirstRouteSemanticsAxiomAuditPassed = true
leanResidualTerminalPacketSelectorFirstRouteSemanticsScope = "all-arbitrary-finite-exact-earliest-field-semantics-for-ten-packet-first-routes-canonical-hb-first-route-failure-without-route-clear-or-binding-premises"
leanResidualTerminalPacketDescentRouteReflectionFormalized = true
leanResidualTerminalPacketDescentRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketDescentRouteReflectionScope = "all-arbitrary-finite-rank-reflected-packet-descent-route-exact-rankwf-nondecrease-or-earlier-first-route-without-route-clear-or-descent-binding-premises"
leanResidualTerminalPacketRankRouteReflectionFormalized = true
leanResidualTerminalPacketRankRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketRankRouteReflectionScope = "all-arbitrary-finite-canonical-rank-tag-reflection-rank-route-excluded-exact-rankwf-nondecrease-or-earlier-route-without-route-clear-or-binding-premises"
leanResidualTerminalPacketExactRouteReflectionFormalized = true
leanResidualTerminalPacketExactRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketExactRouteReflectionScope = "all-arbitrary-finite-canonical-source-route-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-seven-earlier-semantic-routes-without-route-clear-or-binding-premises"
leanResidualTerminalPacketChargeRouteReflectionFormalized = true
leanResidualTerminalPacketChargeRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketChargeRouteReflectionScope = "all-arbitrary-finite-positive-source-charge-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-six-earlier-semantic-routes-without-route-clear-or-binding-premises"
leanResidualTerminalPacketColourRouteReflectionFormalized = true
leanResidualTerminalPacketColourRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketColourRouteReflectionScope = "all-arbitrary-finite-grouped-footprint-colour-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-five-earlier-semantic-routes-without-route-clear-or-binding-premises"
leanResidualTerminalPacketFrontierRouteReflectionFormalized = true
leanResidualTerminalPacketFrontierRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketFrontierRouteReflectionScope = "all-arbitrary-finite-typed-frontier-equality-frontier-route-reflected-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-four-earlier-semantic-routes-without-route-clear-or-binding-premises"
leanResidualTerminalPacketBN5ObligationRouteReflectionFormalized = true
leanResidualTerminalPacketBN5ObligationRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketBN5ObligationRouteReflectionScope = "all-arbitrary-finite-BN5-coordinate-frontier-obligation-routes-reflected-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-three-earlier-semantic-routes-without-route-clear-or-binding-premises"
leanResidualTerminalPacketBN4ActivationRouteReflectionFormalized = true
leanResidualTerminalPacketBN4ActivationRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketBN4ActivationRouteReflectionScope = "all-arbitrary-finite-BN4-activation-predicate-route-reflected-BN5-frontier-obligation-routes-reflected-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-two-earlier-semantic-routes-without-route-clear-or-binding-premises"
leanResidualTerminalPacketDirectionRouteReflectionFormalized = true
leanResidualTerminalPacketDirectionRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketDirectionRouteReflectionScope = "all-arbitrary-finite-typed-direction-equality-route-reflected-BN5-frontier-obligation-activation-routes-reflected-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-sole-remaining-budget-route-without-route-clear-or-binding-premises"
leanResidualTerminalPacketBudgetRouteReflectionFormalized = true
leanResidualTerminalPacketBudgetRouteReflectionAxiomAuditPassed = true
leanResidualTerminalPacketBudgetRouteReflectionScope = "all-arbitrary-finite-typed-budget-equality-all-packet-route-fields-reflected-colour-charge-exact-route-rank-excluded-exact-rankwf-nondecrease-without-route-clear-or-binding-premises"
leanResidualTerminalPacketBudgetHBActivityBindingFormalized = true
leanResidualTerminalPacketBudgetHBActivityBindingAxiomAuditPassed = true
leanResidualTerminalPacketBudgetHBActivityBindingScope = "all-arbitrary-finite-typed-budget-mismatch-to-HB-activity-checked-budget-route-excluded-under-checked-well-founded-HB-closure"
leanResidualTerminalPacketSemanticHNActivityBindingFormalized = true
leanResidualTerminalPacketSemanticHNActivityBindingAxiomAuditPassed = true
leanResidualTerminalPacketSemanticHNActivityBindingScope = "all-arbitrary-finite-frontier-obligation-activation-direction-mismatch-to-HN-activity-checked-sole-descent-route-under-checked-semantic-HN-budget-HB-and-well-founded-HB-closure"
leanResidualTerminalPacketDescentNoLowerBindingFormalized = true
leanResidualTerminalPacketDescentNoLowerBindingAxiomAuditPassed = true
leanResidualTerminalPacketDescentNoLowerBindingScope = "all-arbitrary-finite-canonical-packet-handles-exhaustive-local-descent-no-lower-row-rejected-under-checked-positive-packet-semantic-HN-budget-HB-selector-silence-and-HB-closure"
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

The pinned `leanprover/lean4:v4.31.0` toolchain compiles the explicit `PNP` library root. [`public/pnp-theorem-inventory.json`](public/pnp-theorem-inventory.json) is the exact public mirror of the compiled environment inventory: **29,908** exported public declarations across **295** modules, including **15,437** theorem-kind declarations and **7,623** assumption-free theorem-kind declarations. It excludes **15,135** private compiler auxiliaries and records **four** project axioms.

The inventory-derived publication map binds 3,076 reviewed theorem candidates to kernel-type fingerprints and binds the complete Lean source/configuration closure. Exactly 154 of 156 scoped milestone rows are earned. They cover the concrete machine model, Cook-Levin semantics and bounded formula-builder prefix, typed locked-NAND semantics and concrete reductions, verified residual and terminal chains, the finite BN3 through BN6 and PkgC construction, the complete finite Packet selector pipeline, checked realizer and HB dependency layers, exact earliest-route semantics, successive computation of every local Packet classifier field, checked budget/HB and semantic/HN bindings, executable selector silence, the local descent/no-lower row and composed Packet ledger, the finite supplied HResolve route classifier and coverage sidecar, the terminal-derived support resolver, the finite terminal budget-envelope and budget no-lower ledgers, their same-candidate composition with the Packet no-lower ledger, a deterministic maximal pairwise H-disjoint subfamily over eight supplied footprint-interference domains, an exact four-coordinate minimum over a supplied certified-path family, a maximal H-disjoint family over supplied proof-bearing candidates, a proof-bearing HResolve ZeroSlack sidecar, and now a proof-bearing Budget ZeroSlack sidecar. The newest sidecar records the failed exhaustive search over the complete canonical terminal support universe, excludes every budget-feasible support, and separately binds exact and gain routes to semantic minimum and strict equivalent gain propositions. Its natural caps remain supplied, and enumeration, saturation, and reference minimization may be exponential. This is not the B0-B4 Budget grammar or blocker semantics, full or polynomial BudgetResolve, the complete no-lower ledger, unconditional ZeroSlack, PCCMin, polynomial runtime, SAT in P, or `P = NP`.

**Lean makes the Budget ZeroSlack sidecar proof-bearing**

For arbitrary finite direct-wire candidates and supplied natural gate and record caps, the report-facing ZeroSlack boundary now consumes a checked proof-bearing NoBudget sidecar. Lean records the exact failed exhaustive terminal-envelope search, excludes every budget-feasible canonical support, and separately binds exact and gain routes to semantic minimum and strict equivalent gain propositions.

The caps remain supplied, and support enumeration, saturation, and reference minimization may be exponential. This milestone does not formalize the B0-B4 Budget grammar or blocker semantics, implement full or polynomial BudgetResolve, prove the complete no-lower ledger, establish unconditional ZeroSlack, prove PCCMin or polynomial runtime, put SAT in P, remove a project assumption, or prove P = NP. The 98 percent figure remains a revisable editorial estimate, separate from the 154 of 156 scoped publication rows.

Its 5 reviewed theorem pins use only `Quot.sound` plus `propext`. The focused 6-declaration audit has six `Quot.sound` plus `propext` closures, with no project axiom or `Classical.choice`.

These are finite kernels over explicit caller-supplied inputs. They do not derive the BN4 ledger or BN5 payload and shadow universe from the four-corner bases; derive the ambient BN4 ledger, typed restorer, exact embedding, explicit remainder, successful candidate kernel, PkgC consumer antichain, typed restoration operation, coordinate maps, BN6 packet conclusion, survivor grouping, payloads, constant-cut equation, grouped family, gain-coverage certificate, replacement blueprints, occurrence pairings, unmatched lists, finite rank assignment, payload-route fields, route-clear acceptance, exhaustive realizer claims, blocker-activity tables, dependency rows, active-dependency premise, or exact-rank mapping from terminal candidates; prove that every terminal-derived claim is a typed bottom or passes the route-clear checks; prove that the remainder is empty or route-producing; derive blocker semantics or semantic dependency completeness; build the manuscript's encoded or polynomial selector universe; prove full external selector compatibility; construct a complete realizer or global typed blocker route; establish complete or unconditional global selector silence, polynomial enumeration, size bounds, generation, or runtime; establish the full historical BN4, BN5, PkgC, BN6, Packet selector and realizer, or HB negative-closure results; map the current finite terminal routes into a decreasing complete global outcome system; establish route completeness or Package E; prove manuscript-wide SaturatePositive or BCELReady; establish unconditional global `ZeroSlack` or PCCMin; prove SAT NP-hardness or CNF-SAT NP-completeness; place CNF-SAT in P; activate the legacy string-handle bridge; or prove `P = NP`. Two global milestones remain unearned: unconditional global ZeroSlack, PCCMin and polynomial runtime; and the concrete standard P-versus-NP target/root.

The abstract string-handle `PNP.PEqualsNP` bridge is explicitly publication-ineligible. `PNP.Main.ConcretePEqualsNP` is present as an inactive axiom-free definition for the finite charged-pipeline model, while `PNP.Main.p_eq_np` remains absent. The concrete publication gate is a strict conjunction of concrete semantics, target/root fingerprints, axiom closure and source closure; null expected fingerprints are unconfigured and never match null. All theorem-establishment and theorem-emission fields derive only from that gate.

The active blockers are the five entries in `remainingFormalObligations` and `remainingBlockers`, covering concrete SAT, residual-band minimisation, ZeroSlack, polynomial runtime and certificate bounds, and the root theorem plus axiom audit.

Legacy JavaScript checker acceptance verifies assertion-bearing records under implemented predicates. It is historical assertion-checker evidence only and is not a formal proof of the named mathematical propositions. Earlier activated coordinates, verifier-run records, digest matrices, and badge summaries are preserved only as historical audit records. Their intake is frozen and they are not current theorem-emission surfaces.

External review remains welcome as audit and bug-finding evidence, but it is not a mathematical premise or release blocker.

## Authoritative verification

Use the source repository for the current formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 98da0c0ad5614d69f5f5b50f629a759dc5c29fb9
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build. The later commands validate distinct authority and
report contracts without repeating a standalone whole-library build.

These commands build the pinned Lean root once, run the complete current-authority verifier once, check the compiled inventory, and verify the report. The report check already validates the formal-publication output, and the authority verifier already runs its listed regression and axiom-audit targets. Their success does not fill the two unearned global milestones or establish the target theorem.

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
- The bundled canonical PDF and TeX are the current 128-page inventory-derived formal status report. They report `CNFSAT ∈ NP`, raw-machine compilation, exact Cook-Levin semantic equivalence, the bounded formula-building prefix, strict encoding and concrete reductions, the verified residual and terminal-support chain, the finite BN3 through BN6 and PkgC chain, the complete finite Packet selector pipeline, checked realizer and dependency layers, exact earliest-route semantics, reflected local Packet fields, checked budget/HB and semantic/HN bindings, the Packet no-lower ledger, supplied-family HResolve routing, terminal-derived support and budget resolvers, their same-candidate Packet composition, a maximal H-disjoint subfamily over supplied footprints, an exact certified-path minimum, the maximal H-disjoint certified-path family, and the proof-bearing HResolve ZeroSlack sidecar. Newest, it adds a checked proof-bearing NoBudget sidecar: the failed exhaustive terminal-envelope search excludes every budget-feasible canonical support, while exact and gain routes are separately bound to semantic minimum and strict equivalent gain propositions. The natural caps remain supplied and the search may be exponential. It does not formalize B0-B4 blocker semantics, implement full or polynomial BudgetResolve, complete the no-lower ledger, or prove unconditional ZeroSlack or another global result. The report retains the axiom-free logical boundary witness showing that arbitrary per-cut BN2 realizability alone cannot imply a stable family.

  The report explicitly discloses that the BN3 repair enumerates all subsets; the BN4 ledger, BN5 payload and shadow universe, PkgC consumer antichain, typed restoration operation and coordinate maps, BN6 packet and grouped family data, candidate implementations, gain-coverage certificate, replacement blueprints, occurrence pairings, unmatched lists, semantic equivalence, finite rank assignment, payload-route data and checks, source and selector terminal BN5 coordinates, direction values, budget values, the Packet-to-HN and Packet-to-HB activity bindings, exhaustive realizer claims, blocker-activity tables, dependency rows, active-dependency premise, and exact-rank mapping remain explicit inputs. The coordinates, direction values, budget values, and Packet-to-HB activity binding are not constructed from terminal data, the complete BN4, BN5, Dir(u), Bud(u), or Packet adequacy bridge is not proved, and computing every local classifier field does not establish complete external semantics or global route exclusion. The executable checks do not prove every terminal-derived claim is a typed bottom or passes the route-clear predicate. Full external selector compatibility, complete replacement construction or polynomial enumeration, blocker semantics, semantic dependency completeness, unconditional selector silence, the full HB negative closure, a complete decreasing global route system, manuscript-wide SaturatePositive, Package E, BCELReady, unconditional global `ZeroSlack`, PCCMin exactness and polynomial runtime, the rest of the Cook-Levin formula body, SAT NP-hardness or CNF-SAT NP-completeness transport, CNF-SAT in P, and P = NP remain outside the earned scope.
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
