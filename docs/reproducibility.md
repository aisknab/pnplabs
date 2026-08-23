# Reproducibility

This document separates current formal-publication reproduction from historical assertion-checker
replay. Neither route by itself establishes theorem correctness.

## Companion Website Checkout

Requirements:

- Node.js 20 or newer;
- npm bundled with Node 20 or newer;
- Poppler utilities for independent PDF page/text inspection;
- a local `aisknab/pnp` checkout only for the optional exact cross-repository check.

Run the complete local suite:

```bash
npm test
```

The suite checks public status/inventory consistency, strict fail-closed rendering, local HTTP
routes, report aliases, the release seal and checksum ledger, educational fixtures, and local
documentation links. These are companion-package checks, not Lean proof checks.

Current canonical identities:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `downloads/canonical_proof_report.pdf` | 566,763 | `2efd2ef77c689d9341b557516235b3a8c170bb2ee3668309ea21247fd8aca2cc` |
| `downloads/canonical-proof-report.pdf` | 566,763 | `2efd2ef77c689d9341b557516235b3a8c170bb2ee3668309ea21247fd8aca2cc` |
| `downloads/canonical_proof_report.tex` | 343,445 | `40ba52d00a4cc12413d2b6839a94e788eb873d9ba9de59b03e58a4747369905c` |
| `downloads/canonical-proof-report.tex` | 343,445 | `40ba52d00a4cc12413d2b6839a94e788eb873d9ba9de59b03e58a4747369905c` |
| `public/pnp-status.json` | 2,603,129 | `867e2609f544f1aec18c0855cd921e4991d66f82450d955be9d39a7f4ceefa8d` |
| `public/pnp-theorem-inventory.json` | 33,072,487 | `d26de4965373fa55ee89c14e0884fb271efa3f6305b13fca429b316f5540ab78` |
| `public/pnp-proof-progress.json` | 33,117 | `a0484c0fcfe186f012b595392d4ed90d271c4c090602ae67adabdd2612377c0e` |

The PDF must have 132 A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout edcf84c74280b455ca656ee57653d6fb07cfcc30
PNP_SOURCE_DIR=../pnp node tools/sync-public-access-docs.mjs --check
PNP_SOURCE_DIR=../pnp npm run test:audit-targets
```

The sync command is read-only by default. A deliberate local refresh requires explicit `--write`;
the GitHub workflow never writes, commits, or pushes. The checker compares current status,
inventory, the fixed-weight proof-progress ledger, TeX, PDF, all aliases, source/report coordinates,
page count, forbidden historical
hashes, and companion release metadata. PNPLabs consumes the exact proof artifacts already verified
at the pinned core commit; this publication check does not invoke Lean, Lake, or Elan.

## Core Lean Inventory Reproduction

At the same exact core commit, install the pinned toolchain and run:

```bash
npm run formal:inventory:check
npm run validate
npm run report:check
```

The inventory check owns the Lean build. The validation and report phases exercise distinct
contracts without a second standalone `lake build`.

Expected compiled inventory counts are 30,056 public declarations, 15,507 theorem-kind declarations,
7,617 assumption-free theorem-kind declarations, 15,141 excluded private auxiliaries, 302 modules, and
four project axioms. The publication gate must remain false with five blockers. The concrete
NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`, and the current bounded
Cook-Levin prefix still stops after the seventh padding-or-unary opportunity in the second scheduled
constraint. The strict-v0 source parser, target emitter, and concrete `EncodedNANDSAT`-to-`EncodedLockedNANDThreshold`
polynomial reduction remain exact and fail closed on malformed source bytes. The semantic layer supplies
a total compiler from strict canonical CNF formulas to intrinsically topological NAND circuits. Its
18 reviewed theorem pins prove codec canonicality, well-formed topological output, exact assignment
and satisfiability semantics including empty edge cases, exact gate count, a quadratic serialized-output
bound, malformed-input failure, all-bitstring language equivalence, and semantic composition with
`buildLockedNANDInstance`. The expanded 68-declaration semantic audit has 28 empty, 19 `propext`-only,
and 21 `propext` plus `Quot.sound` closures, with no project axiom or `Classical.choice`.

The latest finite BCEL and Packet activation-coherence obstruction milestone has 6 reviewed theorem
pins. Its focused 12-declaration audit uses only `Quot.sound` and `propext`, with no project axiom or
`Classical.choice`. For every accepted M184 carrier-coherence certificate, the theorem rows compute
the selected nucleus defect and exhaustively check the Packet cut value plus every canonical nonempty
proper-cut activation. Acceptance reconstructs full finite activation coherence, while the existing
same-family Packet exclusion proves acceptance impossible. A deterministic classifier returns either
the total cut-value mismatch or a proof-bearing proper-cut mismatch. The terminal problem, positive
full-slack premise, family, map, activation data, and downstream data remain supplied, and exhaustive
cut enumeration may be exponential. This diagnostic does not construct or repair activation
coherence, complete the no-lower ledger or global routing, establish unconditional ZeroSlack, or prove
polynomial PCCMin.
The exact core merge owns Lean compilation and axiom evidence; PNPLabs verifies the pinned source
identity and byte-exact publication artifacts and does not rebuild Lean.

The composed all-input CNF parser, NAND compiler, and locked-NAND emitter are published as
`PNP.Main.locked_nand_threshold : ReducesTo CNFSAT EncodedLockedNANDThreshold`. Its one reviewed pin
uses only `Quot.sound` and `propext`. This is a polynomial many-one reduction, not a target decider,
an NP-hardness or NP-completeness theorem, a ZeroSlack or PCCMin result, or the root theorem.

The fixed all-input compiler milestone realizes that semantic function with one fixed 135,070-rule three-node finite
work graph. Its 28 reviewed theorem pins cover exact all-bitstring execution, exact compiled output, non-timeout
execution under one external polynomial, `PolynomialTimeFunction`, literal `RawRefinement`, the direct
`CNFSAT`-to-`EncodedNANDSAT` `PolynomialReduction` (`cnfSAT_reducesTo_encodedNANDSAT`), and composition to
`EncodedLockedNANDThreshold`. The complete 1,316-declaration audit has 864 empty, 151
`propext`-only, and 301 `propext` plus `Quot.sound` closures. It contains no project axiom or
`Classical.choice`.

This finite compiler is not a CNF-SAT decider and does not establish SAT NP-hardness or CNF-SAT
NP-completeness. The abstract locked-NAND threshold axiom, remaining Cook-Levin formula body,
complete raw builder, CNF-SAT in P, and `P = NP` must remain absent.

The earlier typed-budget reflection milestone adds 30 reviewed theorem pins. For every arbitrary finite grouped BN6 family,
selector-rank carrier, and domain of typed budget values with decidable equality, Lean computes
Packet budget acceptance from exact equality of the explicit source and selector budget values
while retaining the computed frontier, obligation, activation, and direction fields, grouped colour,
positive charge, the internal source route, authoritative handle rank, and exact descent computation.
A budget first route is prior frontier, obligation, activation, and direction equality together with
typed-budget inequality. The classifier also cannot return colour, charge, exactRoute, or rank, a final
descent route carries actual nondecrease, and the positive Packet/HB endpoint carries exact failure
evidence without route-clear or binding premises. Twelve reviewed pins use only `propext`, and 18 use
`Quot.sound` plus `propext`. The focused 37-declaration audit has two empty, 17 `propext`-only, and 18
`Quot.sound` plus `propext` closures; none uses a project axiom or `Classical.choice`. Every local
Packet classifier field is now computed, but the coordinates, direction and budget values, finite rank
map, before/after residual ranks, grouped family, realizer claims, HN/BUD activity, dependency rows,
and finite-to-exact rank map remain proof-bearing inputs. Lean does not construct them from terminal
data or prove the manuscript's complete BN5, Dir(u), Bud(u), or Packet adequacy bridge. It does not
identify local Packet budget coherence with BudgetResolve or HB budget activity, prove a decreasing
transition, or complete the non-Packet rows of the no-lower ledger. Full external selector compatibility, complete route
silence, unconditional HB negative closure, positive slack, SaturatePositive, BCELReady, unconditional
`ZeroSlack`, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P, removal of an assumption,
and `P = NP` remain outside the earned scope.

The authority verifier runs its current regression, axiom-audit, status, public-surface, and legacy-archive checks once. `report:check` includes the formal-publication check, then performs a same-environment deterministic double build, exact byte comparison, PDF
metadata/text checks, and full-page rendering. This is not a promise of identical PDF bytes under
arbitrary TeX distributions or operating systems.

## Seal Verification

Run:

```bash
npm run verify:seal
sha256sum downloads/canonical_proof_report.pdf \
  downloads/canonical_proof_report.tex \
  public/pnp-status.json \
  public/pnp-theorem-inventory.json \
  public/pnp-proof-progress.json
pdfinfo downloads/canonical_proof_report.pdf
```

The seal rejects duplicate paths, missing or extra ledger entries, malformed hashes, byte-count
mismatches, and digest mismatches. A successful seal confirms file identity only.

## Historical 7072f8d Replay

The former 57-page direct-claim manuscript and assertion-checker release are preserved separately:

- source tag `final-pnp-proof-report-hardened-7072f8d`;
- source commit `7072f8d0bda6d44d240f9bb3fad624fd357e1278`;
- documentation tag `final-pnp-proof-report-docs-hardened-7072f8d-sealed`;
- artefact tag `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed`;
- archive locator `archive/legacy-v0/ARCHIVE.json`.

Use the source repository's designated legacy replay command only if historical behavior is the
audit target. Historical accepted fields are implementation evidence, not current theorem authority,
and cannot satisfy the concrete publication gate.

## Troubleshooting

| Symptom | Likely cause | Action |
| --- | --- | --- |
| `node: command not found` | Node.js is absent | Install Node.js 20 or newer |
| Seal failure | A sealed file, manifest, or ledger drifted | Inspect the exact path and regenerate only from the pinned current core commit |
| Cross-repo mismatch | Wrong core commit or stale companion copy | Check out the manifest's exact merged commit and rerun `--check` |
| PDF page/hash mismatch | Wrong report generation environment or historical bytes returned | Reject the artefact; do not repair by copying from a historical tag |
| Browser status is unavailable | `/public/` route or payload problem | Verify the local server routes and keep the UI fail-closed |
| Inventory mismatch | Stale or modified compiled evidence | Re-export under the pinned Lean toolchain and investigate before publishing |
