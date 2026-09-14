# Trust Model

The current publication is an evidence-indexed formal-reconstruction status, not a proof of
`P = NP`. Reviewers should keep six layers separate: Lean kernel evidence, publication derivation,
public mirrors, file identity, historical checker replay, and mathematical correctness.

The practical rules are:

- An exact Lean declaration supports only its exact kernel type and axiom closure.
- A milestone is earned only when its reviewed theorem types and complete source digest match.
- The concrete publication gate is the sole authority for theorem-emission fields.
- JSON, HTML, hashes, checker Booleans, and historical records are never theorem premises.
- A SHA-256 match verifies byte identity only.
- Historical replay reproduces implementation behavior only.
- Mathematical correctness still requires the missing concrete definitions and theorems.

## Current Formal Evidence

| Evidence | Trusted component | What is checked | Residual risk or non-claim |
| --- | --- | --- | --- |
| Compiled inventory | Lean 4.31.0 kernel/environment and the small export probe | Name/module/kind/axiom closure for every public declaration; raw type for each reviewed milestone candidate | Toolchain/kernel trust; no widening beyond reviewed exact types |
| Source closure | SHA-256 implementation and complete tracked path set | Every Lean source plus pinned build configuration | Hash identity is not semantics |
| Milestone map | Reviewed theorem-name/type pins and fixed source digest | Presence, theorem kind, exact type and approved axiom closure with no project axiom, source match | Formal artefact coverage: 234 of 236 current scoped publication rows earned. Risk-weighted proof completion estimate: 40%. Uncertainty range: 20% to 40%. Global gates closed: 0 of 5. Completeness covers proper physical supports with zero or one actual incoming wire. It does not cover all boundary widths, prove global minimality or unconditional ZeroSlack, or establish total polynomial encoded-input runtime, output size or certificate size. The full manuscript carrier, general obligation calculus and complete global routes remain open. This batch changes no fixed weighted checkpoint. Added publication rows do not mechanically increase the proof-completion estimate, which is neither a probability of correctness nor a time estimate. |
| Concrete gate | Fixed gate logic, reviewed non-null fingerprints, immutable axiom allowlist | Exact concrete target/root/value/type/source/axiom conditions | Gate is false in this release |
| Generated status/report | Deterministic generator and template | Publication output is a function of inventory/map/gate | Publication is downstream evidence presentation |
| Companion mirror | Exact cross-repository byte comparison without proof-tool invocation | Status, inventory, TeX, PDF, aliases, manifest, seal | Mirroring does not add theorem evidence or repeat the core Lean build |

`PNP.PEqualsNP` now aliases the concrete finite charged-pipeline mutual-inclusion proposition.
That definitional compatibility is not a proof and cannot replace the exact eligible root theorem.
The concrete target remains inactive, `PNP.Main.p_eq_np` is absent, and unset expected fingerprints
remain unconfigured rather than matching null actual values.

## What This Checkout Can Verify

| Command or surface | What it verifies | What it does not verify |
| --- | --- | --- |
| `npm run verify:seal` | Exact file set, path uniqueness, byte counts, SHA-256 digests, and ledger agreement | Theorem correctness or semantic equality |
| `npm test` | Site payload consistency, fail-closed rendering, server routes, seal, fixtures, and docs | Lean kernel correctness or `P = NP` |
| Cross-repository check | Exact current files and merged-core commit | Independent mathematical correctness |
| Browser status renderer | Status/inventory digest binding and conservative gate rendering | New evidence beyond the payloads |
| Minimal fixtures | Named educational accept/reject cases | Real historical checker soundness or formal theorem evidence |

## Publication Gate Boundary

The concrete gate passes only if every recorded subcheck is true. At minimum it requires a concrete
standard complexity model, a definition at `PNP.Main.ConcretePEqualsNP`, a theorem at
`PNP.Main.p_eq_np` of the exact concrete type, reviewed non-null type/value/source/axiom
fingerprints, and an axiom closure contained in the fixed Lean-standard allowlist.

The browser recomputes the conjunction for display, but the browser is not an authority. Missing,
malformed, stale, or inconsistent status/inventory data always renders a non-claiming failure state.
Historical activation or checker-acceptance fields cannot override the gate.

## Current Claim-Critical Gaps

| Boundary | Current formal evidence | What remains |
| --- | --- | --- |
| Direct-wire model | Typed NAND semantics, finite enumeration/reference minimum, framed replacement/slack | Connection to a standard complexity reduction |
| Locked-NAND | Typed local candidates, five local minima, global carrier/trace equivalence, exact `B/B` and `B+4/B+1` candidate assembly, global `BaselineDistinct`, both whole-carrier final-output branches, all six typed semantic premises, the exact satisfiable/reference-minimum threshold, residual slack at most four, strict-v0 normalized-circuit and complete-instance round trips, a pure fail-closed encoded semantic transformation, the literal polynomial-time parser and emitter, their concrete `EncodedNANDSAT`-to-`EncodedLockedNANDThreshold` polynomial reduction, a fixed all-input CNF-to-NAND compiler with direct and composed polynomial reductions, direct report-facing compatibility, and the universal verified strict-gain-chain length bound with its four-step locked specialization | A gain generator and completeness theorem, a justified stopping rule and `ZeroSlack`, an exact polynomial-time minimizer, a target decider, SAT NP-hardness or CNF-SAT NP-completeness, CNF-SAT in P, and `P = NP` |
| Residual routes | Sound strict gain from one explicit supplied list; proof-bearing exact/zero outcomes; every supplied proof-bearing or executably verified finite strict-gain chain preserves semantics and the reference minimum and is bounded by starting slack | Gain generation, candidate-universe/global completeness, justified stopping, ZeroSlack contradiction, exact minimization, and polynomial PCCMin/runtime |
| Complexity | Concrete charged-pipeline P/NP/reduction definitions, `CNFSAT ∈ NP`, all-input and sequential raw compilers, recursive function/decision refinement into one literal raw machine, exact Cook-Levin semantics/size/schedule/cursor results, the formula-emitting prefix through the seventh padding-or-unary opportunity, M208's separate uniform polynomial raw controller that consumes the complete schedule count and reaches its exact terminal coordinate, and M209's fixed 54-rule arbitrary-slot header router, M210's all-coordinate semantic post-header decoder, M211's fixed 99-rule raw unary quotient/remainder divider, M212's all-coordinate checked-reader/divider orchestration, M213's fixed 351-rule literal tape bridge preserving arbitrary exterior workspace, and M214's fixed 180-rule post-divider route classifier preserving the exterior and remainder ledger | Emitting every selected body and Finish token in the uniform raw loop, iterating the complete schedule, exact full-formula output refinement, the complete raw Cook-Levin builder, builder `FunctionProgram.RawRefinement`, a packaged polynomial reduction, CNF-SAT NP-completeness, and a deterministic polynomial-time CNF-SAT decider |
| Root theorem | No compatibility-root theorem | Exact concrete root, build, and acceptable axiom audit |

No project-specific axioms remain, while five formal blockers remain disclosed in `public/pnp-status.json`.

## File Identity And Reproducibility

`downloads/formal-publication-release.json` pins the exact merged core commit and current report,
status, inventory, publication-map, and source-closure identities. `downloads/release-seal.json` and
`downloads/SHA256SUMS` bind the companion copies and aliases.

A same-environment double PDF build and exact byte comparison provides useful determinism evidence
for the pinned environment. It is not universal reproducibility across arbitrary TeX distributions,
operating systems, fonts, or tool versions.

## Historical Boundary

The former 57-page manuscript and checker release are historical audit material only:

- source tag `final-pnp-proof-report-hardened-7072f8d`;
- source commit `7072f8d0bda6d44d240f9bb3fad624fd357e1278`;
- archive locator `archive/legacy-v0/ARCHIVE.json`;
- separate documentation and generated-artifact refs listed in
  [source_checker_map.md](source_checker_map.md).

The current canonical aliases do not contain those historical bytes. Historical replay can test
whether the old implementation reproduces recorded assertion fields; it cannot establish their
mathematical sufficiency or activate current theorem publication.

## Reviewer Posture

Try to falsify each boundary independently: inventory completeness, type pins, source closure,
axiom classification, gate conjunction, output derivation, mirror identity, server fail-closed
behavior, and historical/current separation. A successful local or CI check supports only its named
property and must never be summarized as proof of the target theorem.


<!-- CURRENT_PUBLICATION:START -->
## M262 current publication boundary

**Arbitrary-width circuit expansion with explicit copy costs**

The construction now compiles an actual replacement circuit for arbitrary finite supports and incoming-boundary widths. Given complete local open-function agreement, it preserves every ordinary output and tracked computational wire field. It derives the physical dependency order and compiler success from the source rather than requiring a supplied schedule or correctness certificate.

Every distinct retained physical producer pays for a complete replacement copy. The expanded circuit retains each exterior gate once and saves gates only when the total cost of all replacement copies is smaller than the selected support. A smaller local replacement alone is insufficient. This is not global circuit minimization or a theorem of total polynomial runtime; the full manuscript carrier and obligation calculus, unconditional ZeroSlack, exact general PCCMin and the eligible root remain open. No fixed weighted checkpoint or global gate changes.

Formal artefact coverage: 238 of 240 current scoped publication rows earned. Risk-weighted proof completion estimate: 40%. Uncertainty range: 20% to 40%. Global gates closed: 0 of 5.

This batch changes no fixed weighted checkpoint. Added publication rows do not mechanically increase the proof-completion estimate, which is neither a probability of correctness nor a time estimate. Project-specific axioms remaining: 0. The eligible root `PNP.Main.p_eq_np` is absent and the publication gate is false.

Current source: [`c3d4d9a115a357b44ee8104d129ee15e3174ec7f`](https://github.com/aisknab/pnp/tree/c3d4d9a115a357b44ee8104d129ee15e3174ec7f), tree `7bd3bc5854b0307330e9e405b5857de658eba54e`. Original current review coordinate: `PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-14-262`. Inspect the [exact compiled scope and non-claim](https://github.com/aisknab/pnp/blob/c3d4d9a115a357b44ee8104d129ee15e3174ec7f/docs/lean_wire_causal_expansion.md), the [source-bound update](../updates.html#2026-09-14-wire-causal-expansion) and the [complete current milestone ledger](../status.html).

M230 and M231 close complete Cook-Levin emission/refinement and concrete CNF-SAT NP-completeness. NP-completeness is not a deterministic polynomial-time SAT algorithm. M243 consumes that checked hardness in the still-conditional report bridge; the complete minimization-loop certificate and its existence premise remain unconstructed. Earlier named component limitations describe those standalone components and do not negate later earned results.
<!-- CURRENT_PUBLICATION:END -->
