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
| `downloads/canonical_proof_report.pdf` | 520,497 | `22db0464c47ce8ebdb8415a6b6f2004b20f5c30326055e2f7846da94fb223f98` |
| `downloads/canonical-proof-report.pdf` | 520,497 | `22db0464c47ce8ebdb8415a6b6f2004b20f5c30326055e2f7846da94fb223f98` |
| `downloads/canonical_proof_report.tex` | 290,219 | `8a59463099249cadaba84f2f8e3c9d319a384c8fd2fbcb6f7cd4b85db951626c` |
| `downloads/canonical-proof-report.tex` | 290,219 | `8a59463099249cadaba84f2f8e3c9d319a384c8fd2fbcb6f7cd4b85db951626c` |
| `public/pnp-status.json` | 2,388,794 | `143d289e56aa567e7e4167dbd36e481c69536334e7835e84920e3199000533c7` |
| `public/pnp-theorem-inventory.json` | 22,067,074 | `bf78bfe81ea3f813cb23b5ea07766612ffd1621689696f7c535334bfa3694d58` |

The PDF must have 113 A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 97ca87c3588deab60b8126c204d4d63b10dc2c85
PNP_SOURCE_DIR=../pnp node tools/sync-public-access-docs.mjs --check
PNP_SOURCE_DIR=../pnp npm run test:audit-targets
```

The sync command is read-only by default. A deliberate local refresh requires explicit `--write`;
the GitHub workflow never writes, commits, or pushes. The checker compares current status,
inventory, TeX, PDF, all aliases, source/report coordinates, page count, forbidden historical
hashes, and companion release metadata.

## Core Lean Inventory Reproduction

At the same exact core commit, install the pinned toolchain and run:

```bash
lake build PNP
npm run check
npm run pnp:verify -- --no-write
npm run formal:inventory:check
npm run report:check
```

Expected compiled inventory counts are 29,164 public declarations, 15,081 theorem-kind declarations,
7,519 assumption-free theorem-kind declarations, 15,058 excluded private auxiliaries, 278 modules, and
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

The newest milestone adds 26 reviewed theorem pins. For every arbitrary finite grouped BN6 family,
selector-rank carrier, and typed terminal BN5 coordinate, Lean computes canonical Packet frontier and
obligation acceptance from exact equality of the corresponding source and selector BN5 fields while
retaining grouped colour, positive charge, the internal source route, authoritative handle rank, and
exact descent computation from the ten-coordinate `RankWF` comparison. A frontier first route is exactly
frontier inequality; an obligation first route is prior frontier equality together with obligation
inequality. The classifier also cannot return colour, charge, exactRoute, or rank, a final descent route
carries actual nondecrease, and the positive Packet/HB endpoint carries exact failure evidence without
route-clear or binding premises. Fourteen reviewed pins use only `propext`, and 12 use `Quot.sound` plus
`propext`. The focused 36-declaration audit has five empty, 19 `propext`-only, and 12 `Quot.sound` plus
`propext` closures; none uses a project axiom or `Classical.choice`. The source and selector terminal BN5
coordinates, finite rank map, before/after residual ranks, activation, direction, budget, grouped family,
realizer claims, HN/BUD activity, dependency rows, and finite-to-exact rank map remain proof-bearing
inputs. Lean does not construct the coordinates from terminal data or prove the manuscript's complete BN5
or Packet adequacy bridge. It does not construct the grouped family or rank map from terminal data, prove
external manuscript semantics for the three remaining routes, map those routes into the complete global
outcome system, prove that a decreasing transition exists, or construct the no-lower ledger. Full external
selector compatibility, complete route silence, unconditional HB negative closure, positive slack,
SaturatePositive, BCELReady, unconditional `ZeroSlack`, PCCMin, encoded-size or polynomial-runtime bounds,
SAT in P, removal of an assumption, and `P = NP` remain outside the earned scope.

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
  public/pnp-theorem-inventory.json
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
