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
| Milestone map | Reviewed theorem-name/type pins and fixed source digest | Presence, theorem kind, type match, exact approved axiom closure with no project axiom, source match | One hundred and twelve earned scopes only, through the terminal chain and exact finite grouped-footprint payload-selector-universe membership. The grouped BN6 family and upstream PkgC, BN5, grouping, payload, and constant-cut data remain explicit inputs. The finite universe is not the manuscript's encoded or polynomial selector universe. The result does not prove selector faithfulness or compatibility, construct a realizer or route, derive the family from terminal data, establish polynomial enumeration or size bounds, complete PkgC, a decreasing complete global system, Package E, BCELReady, global ZeroSlack, polynomial PCCMin, CNF-SAT in P, or a final conclusion. |
| Concrete gate | Fixed gate logic, reviewed non-null fingerprints, immutable axiom allowlist | Exact concrete target/root/value/type/source/axiom conditions | Gate is false in this release |
| Generated status/report | Deterministic generator and template | Publication output is a function of inventory/map/gate | Publication is downstream evidence presentation |
| Companion mirror | Exact cross-repository byte comparison | Status, inventory, TeX, PDF, aliases, manifest, seal | Mirroring does not add theorem evidence |

The abstract `PNP.PEqualsNP` type uses string-handle witnesses and is not a standard concrete
complexity statement. It is categorically publication-ineligible. The concrete target exists only
as an inactive definition, the compatibility root is absent, and unset expected fingerprints remain unconfigured rather than
matching null actual values.

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
| Locked-NAND | Typed local candidates, five local minima, global carrier/trace equivalence, exact `B/B` and `B+4/B+1` candidate assembly, global `BaselineDistinct`, both whole-carrier final-output branches, all six typed semantic premises, the exact satisfiable/reference-minimum threshold, residual slack at most four, strict-v0 normalized-circuit and complete-instance round trips, a pure fail-closed encoded semantic transformation, the literal polynomial-time parser and emitter, their concrete `EncodedNANDSAT`-to-`EncodedLockedNANDThreshold` polynomial reduction, a fixed all-input CNF-to-NAND compiler with direct and composed polynomial reductions, and the universal verified strict-gain-chain length bound with its four-step locked specialization | A gain generator and completeness theorem, a justified stopping rule and `ZeroSlack`, an exact polynomial-time minimizer, a CNF-SAT decider, SAT NP-hardness or CNF-SAT NP-completeness, the abstract threshold-axiom discharge, CNF-SAT in P, and `P = NP` |
| Residual routes | Sound strict gain from one explicit supplied list; proof-bearing exact/zero outcomes; every supplied proof-bearing or executably verified finite strict-gain chain preserves semantics and the reference minimum and is bounded by starting slack | Gain generation, candidate-universe/global completeness, justified stopping, ZeroSlack contradiction, exact minimization, and polynomial PCCMin/runtime |
| Complexity | Concrete charged-pipeline P/NP/reduction definitions, `CNFSAT ∈ NP`, all-input and sequential raw compilers, recursive function/decision refinement into one literal raw machine, exact Cook-Levin semantics/size/schedule/cursor results, four complete fixed clauses, traversal through the remaining first-constraint padding, the complete first literal of the second scheduled constraint, its width-selected successor token, its first six width-selected opportunities, and the seventh padding-or-unary opportunity under an external polynomial bound | The following padding or second unary-index `T` opportunity, completion or traversal of the second constraint, a general dynamic formula cursor, remaining formula body, complete raw Cook-Levin builder, builder `FunctionProgram.RawRefinement`, a packaged polynomial reduction, CNF-SAT NP-completeness, and a deterministic polynomial-time CNF-SAT decider |
| Root theorem | No compatibility-root theorem | Exact concrete root, build, and acceptable axiom audit |

Four project axioms and five formal blockers remain disclosed in `public/pnp-status.json`.

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
