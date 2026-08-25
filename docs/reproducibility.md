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
| `downloads/canonical_proof_report.pdf` | 573,801 | `484d654f65f44eea42eed2753dd9ecf495f9fe130c34ee7f64485ba4fd277560` |
| `downloads/canonical-proof-report.pdf` | 573,801 | `484d654f65f44eea42eed2753dd9ecf495f9fe130c34ee7f64485ba4fd277560` |
| `downloads/canonical_proof_report.tex` | 352,527 | `1e721889b6476969676d41eded0e56d8666ec41c496c6d2494ba7f98ad23a817` |
| `downloads/canonical-proof-report.tex` | 352,527 | `1e721889b6476969676d41eded0e56d8666ec41c496c6d2494ba7f98ad23a817` |
| `public/pnp-status.json` | 2,630,646 | `a711726030b1d59e6f951401ad5e66f0c64a597a8cde4cf775eeeb30dc7b72a5` |
| `public/pnp-theorem-inventory.json` | 33,174,205 | `22e70b47ef54ff3fe674087d429f1093491d4ba3b5d0fd167b1430e858e74557` |
| `public/pnp-proof-progress.json` | 52,620 | `4f43376e27272879f65416c491b5a73e80e4f1021b9dff8dcbd17514eef69ace` |

The PDF must have 134 A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 0dbad6e14d82bf1f6f1d7b315dc896bdceb325a6
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

Expected compiled inventory counts are 30,348 public declarations, 15,609 theorem-kind declarations,
7,688 assumption-free theorem-kind declarations, 15,145 excluded private auxiliaries, 307 modules, and
no project-specific axioms. The publication gate must remain false with five blockers. The concrete
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

The concrete report-facing locked-NAND compatibility milestone has 6 reviewed theorem pins.
It identifies the report-facing SAT and locked-NAND languages, verifier, decider, reduction, P/NP-class,
and P-equals-NP interfaces with the concrete finite-pipeline definitions and directly reuses the
checked all-bitstring polynomial reduction. Its focused 9-declaration audit records the wider compatibility
surface, while the six pinned milestone theorems close under the Lean-standard allowlist and its checked
endpoint has no project-specific axiom. This
removes the duplicate `PNP.LockedNANDThreshold` axiom and caller-supplied reduction edge; it does not
supply a target decider, prove SAT NP-hardness or CNFSAT NP-completeness transport, construct the
unconditional residual minimiser, prove ZeroSlack or exact polynomial PCCMin, create the eligible root
theorem, or open a global gate.

The concrete residual-band compatibility milestone has 7 reviewed theorem pins. It identifies
the report-facing residual-band endpoint with the concrete fail-closed encoded exact-minimum threshold
language, proves exact reference-minimum semantics for every intrinsically typed finite candidate, and
uses a compiled identity polynomial reduction for the active locked-to-residual edge. Its focused
10-declaration audit and the seven pinned theorems use only `propext`, with no project-specific axiom.
This removes `PNP.ResidualBandExactMinimization` and the caller-supplied compatibility edge from the
active route. Exhaustive reference minimisation is not a polynomial-time PCCMin algorithm, and this
milestone does not prove residual-band promise bounds, unconditional ZeroSlack, deterministic CNFSAT
in P, SAT hardness transport, the eligible root theorem, or a global-gate closure.

The M189 proof-bearing PCCMin total-oracle milestone has 1 reviewed theorem pin. For every finite
direct-wire implementation and explicit proof-bearing total oracle, transparent well-founded recursion
follows strict equivalent gains to exact-minimum or ZeroSlack evidence, preserves semantics, returns zero
residual slack, and bounds strict-gain iterations by the starting slack. Its focused 8-declaration audit
is axiom-free. The oracle remains supplied, and the regression fixture constructs it with exhaustive
reference minimisation: the milestone does not construct an executable terminal-derived oracle, establish
unconditional ZeroSlack, encode the loop as a raw machine, prove encoded-size polynomial construction or
runtime, put CNFSAT in P, establish SAT hardness transport, create the eligible root theorem, or close a
global gate. The fixed-weight score therefore remains 35%.

The M190 proof-bearing normalization and oracle composition milestone has 1 reviewed theorem pin.
For every finite direct-wire implementation, explicit proof-bearing total normalizer, and explicit
proof-bearing total oracle, non-increasing semantic normalization lifts later oracle gains to strict
gains from the original implementation and transports exact-minimum and ZeroSlack endpoints into the
checked terminating loop. Its focused 10-declaration audit is axiom-free. Both stages remain supplied,
and the regression fixtures use exhaustive reference minimisation: the milestone does not construct
either executable stage, derive terminal families or routes, establish unconditional ZeroSlack, encode
the stages as raw machines, prove encoded-size polynomial construction or runtime, put CNFSAT in P,
establish SAT hardness transport, create the eligible root theorem, or close a global gate. The
fixed-weight score therefore remains 35%.

The latest M191 rank-ordered proof-bearing PCCOracle orchestration milestone has 1 reviewed theorem pin.
For every finite direct-wire implementation, explicit proof-bearing normalizer, and explicit rank-ordered
oracle builder, HResolve precedes BudgetResolve, every selector in every canonical finite rank row is
scanned, gains return immediately, and complete typed silence is required before the supplied ZeroSlack
closure. The endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused 15-declaration audit
is free of project-specific axioms. The normalizer, resolvers, rows, realizer, blocker
semantics, ZeroSlack proof, and exhaustive reference fixture remain supplied: the milestone does not
construct executable PCCMin, derive terminal objects, prove unconditional ZeroSlack, establish encoded-size
polynomial construction or runtime, put CNFSAT in P, establish SAT hardness transport, create the eligible
root theorem, or close a global gate. The fixed-weight score therefore remains 35%.

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
NP-completeness. M186 now connects it to the exact report-facing concrete target and removes the
duplicate locked-NAND project axiom. The remaining Cook-Levin formula body, complete raw builder,
target decider, CNF-SAT in P, eligible root theorem, and `P = NP` must remain absent.

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
