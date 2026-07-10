# Reviewer Guide

## Executive Summary

This checkout publishes the current formal-reconstruction status of the PNP project. It does not
establish `P = NP`.

The canonical report downloads are now a seven-page, non-claiming report generated from a compiled
Lean theorem inventory. The inventory contains 2,484 public declarations across 26 modules,
including 883 theorem-kind declarations, 793 assumption-free theorem-kind declarations, and five
disclosed project axioms. Thirty-six private compiler auxiliaries are excluded explicitly.

The concrete publication gate is false. Its concrete target and compatibility-root theorem are
absent, its reviewed activation fingerprints are intentionally unset, all seven formal blockers
remain, and no JSON field, Boolean, string, hash, historical checker verdict, or website state can
substitute for the missing Lean evidence.

Start with these current-authority files:

- [`public/pnp-status.json`](../public/pnp-status.json): generated status, milestones, blockers, and gate;
- [`public/pnp-theorem-inventory.json`](../public/pnp-theorem-inventory.json): byte-mirrored compiled inventory;
- [`downloads/canonical_proof_report.pdf`](../downloads/canonical_proof_report.pdf): current seven-page report;
- [`downloads/formal-publication-release.json`](../downloads/formal-publication-release.json): exact merged-core provenance and file identities.

The older 56-page direct-claim manuscript remains a historical audit target only. It is located at
source tag `final-pnp-proof-report-hardened-7072f8d`, commit
`7072f8d0bda6d44d240f9bb3fad624fd357e1278`, and is indexed by
`archive/legacy-v0/ARCHIVE.json` in the source repository. It is not served through the canonical
download aliases.

## Evidence Layers

| Layer | Current evidence | What it supports | What it cannot support |
| --- | --- | --- | --- |
| Compiled Lean inventory | Environment constants and `collectAxioms`, exported under the pinned Lean toolchain | Names, modules, kinds, and axiom dependencies for all public declarations; raw kernel types for the 34 reviewed milestone candidates | A theorem broader than a reviewed candidate's exact type |
| Earned milestones | Thirty-four reviewed theorem-type fingerprints, empty axiom closures, and the complete Lean-source digest | Eight narrowly scoped formal milestones | Global locked-NAND construction, complete residual search, SAT in P, or `P = NP` |
| Concrete publication gate | Exact target/root kinds and types, non-null reviewed fingerprints, fixed Lean-standard axiom allowlist, and source closure | A fail-closed activation boundary for a future concrete theorem | Activation while any subcheck is false or unconfigured |
| Status and report generation | Deterministic derivation from the canonical inventory and publication map | Current public wording and exact report bytes | Independent theorem evidence |
| Public seal | SHA-256, byte counts, exact ledger agreement, and alias equality | File identity | Theorem correctness, checker soundness, or semantic equality |
| Historical checker archive | Pinned 7072f8d tags, files, and replay route | Historical implementation and assertion-checker auditability | Current theorem authority or mathematical proof |
| Minimal examples | Small local educational fixtures | Named toy accept/reject behavior | Real package soundness or any theorem conclusion |

## Current Dependency Boundary

```mermaid
flowchart TD
  LEAN[Compiled Lean environment] --> INV[Canonical theorem inventory]
  INV --> MILE[Scoped milestone ledger]
  INV --> GATE[Concrete publication gate]
  MILE --> STATUS[Generated status and report]
  GATE --> STATUS
  GATE -. false .-> BLOCK[No theorem emission]
```

The status and report are consumers of formal evidence, not premises for it. Publication output is
allowed only when every concrete-gate subcheck passes. In this release every output field remains
non-claiming because the gate is false.

## Audit Path: Formal Methods

1. Reproduce the pinned Lean build in `aisknab/pnp` at merged commit
   `bd7e84a49e027020f2d6f6fc4c3cac1f7541aace`.
2. Re-export the inventory and compare it byte-for-byte with
   `public/pnp-theorem-inventory.json`.
3. Inspect every one of the 34 reviewed milestone declarations at its exact kernel type.
4. Confirm that each earned milestone has an empty axiom closure and matches the pinned complete
   Lean-source digest.
5. Mutate a theorem type or source file and confirm that the corresponding milestone is revoked.
6. Inspect the gate's fixed standard-axiom allowlist and verify that unknown, project, and `sorryAx`
   dependencies reject.
7. Confirm that null expected fingerprints never compare equal to null actual fingerprints.

## Audit Path: Complexity Theory

The formal inventory earns seven foundation, local, or conditional milestones: the concrete
bitstring/machine/cost kernel, typed direct-wire semantics, finite reference enumeration/minimum,
concrete framed replacement/slack, five local locked-NAND baselines, a six-premise conditional
threshold boundary, and explicit-list residual-route soundness.

Review the gaps between those scopes and the target theorem:

1. No concrete standard complexity model or concrete SAT theorem is formalized.
2. The six locked-NAND threshold premises are not instantiated by a uniform polynomial builder.
3. Local baseline minima do not establish global `BaselineDistinct`, carrier layout, trace
   equivalence, or the report threshold.
4. The residual scanner searches only a caller-supplied finite list. `unresolved` excludes no
   unlisted gain and cannot imply `ZeroSlack`.
5. PCCMin exactness, the residual-band minimizer, and polynomial runtime/certificate bounds remain
   unproved.
6. The concrete root theorem `PNP.Main.p_eq_np` is absent.

Any proof of the final claim must close those gaps with concrete definitions and checked Lean
theorems; historical package acceptance does not close them.

## Audit Path: Reproducibility And Security

1. Run `npm test` in this checkout.
2. Run `npm run verify:seal` and compare the four report aliases.
3. Verify the inventory SHA-256 against `public/pnp-status.json`.
4. Confirm that the local server exposes both `/public/pnp-status.json` and
   `/public/pnp-theorem-inventory.json` with no-cache headers.
5. Run the cross-repository check against the exact merged core commit.
6. Inspect the report-sync workflow and verify that it is read-only and cannot commit or restore
   historical report bytes.
7. Treat every digest match as byte-identity evidence only.

## Historical Audit Path

The source/checker, documentation, and generated-artifact refs for 7072f8d are preserved separately
in [source_checker_map.md](source_checker_map.md). Use them only to inspect or replay the historical
assertion-checker release. References to numbered report sections in historical worksheets refer to
the manuscript at the pinned 7072f8d source tag, never to the current seven-page report.

A historical replay can show that a named implementation produced the recorded acceptance fields.
It cannot establish the mathematical implications encoded by those fields and cannot activate the
current publication gate.

## Fast Falsification Checklist

- Change one inventory byte without changing status and confirm rejection.
- Replace a milestone theorem with a same-name theorem of weaker type and confirm it is unearned.
- Add a project or unknown axiom to a milestone/root closure and confirm rejection.
- Set an expected gate fingerprint to null and confirm that it remains unconfigured and nonmatching.
- Insert the abstract string-handle `PNP.PEqualsNP` type and confirm that it is publication-ineligible.
- Forge a historical accepted flag or checker Boolean and confirm that theorem output remains false.
- Remove one blocker or project axiom from public status and confirm rejection.
- Serve a stale or missing inventory and confirm that the browser remains fail-closed.
- Replace the canonical PDF with the historical 56-page hash and confirm seal/sync rejection.

## Not Claimed

This checkout does not claim external acceptance, journal validation, checker soundness, a complete
candidate universe, polynomial exact minimization, SAT in P, or `P = NP`. The local checks establish
only their explicitly named file-identity, consistency, rendering, and toy-fixture properties.
