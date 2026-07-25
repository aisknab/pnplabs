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
| `downloads/canonical_proof_report.pdf` | 402,257 | `c1a1d5367c8c0760a09cd5ad2a124d920e8739bc33c8f146eed626bc1a4fbdaa` |
| `downloads/canonical-proof-report.pdf` | 402,257 | `c1a1d5367c8c0760a09cd5ad2a124d920e8739bc33c8f146eed626bc1a4fbdaa` |
| `downloads/canonical_proof_report.tex` | 150,465 | `e5678e9f60ff781dfaf2b8b5d6c192e0132c012e9cebc98d9e5ff0eb4188c332` |
| `downloads/canonical-proof-report.tex` | 150,465 | `e5678e9f60ff781dfaf2b8b5d6c192e0132c012e9cebc98d9e5ff0eb4188c332` |
| `public/pnp-status.json` | 1,565,360 | `8d345785cb4bfeb200779eace1c787aa9885123123b5572b3f61dd9e7c6c1bce` |
| `public/pnp-theorem-inventory.json` | 11,074,060 | `da77e1663fdbb70c0796ef006e66e68636dd45e3c33c350262bd9d0b2a0a0524` |

The PDF must have sixty-two A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout f1ebb93c5683592eaa70e0b77ed1969a1def6180
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
npm run formal:inventory:check
npm run formal:publication:check
npm run report:check
npm test
npm run pnp:verify -- --no-write
```

Expected compiled inventory counts are 12,138 public declarations, 7,074 theorem-kind declarations,
3,654 assumption-free theorem-kind declarations, 4,532 excluded private auxiliaries, 104 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete
NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`, and the current bounded
Cook-Levin prefix still stops after the seventh padding-or-unary opportunity in the second scheduled
constraint. The newest milestone is `PNP.DirectWire.LockedNANDTrace.traceEquivalence`: for every
finite topologically ordered NAND circuit, the exact `X/T/O/R/L/z` carrier has
`inputs + 6 * gates + 1` coordinates and exactly three distinguished checks per gate. Completeness
constructs a coherent trace from ordinary evaluation; soundness recovers that evaluation from any
accepted trace; and satisfiability is equivalent to the existence of a coherent trace. Its
71-declaration audit has no project axiom or `Classical.choice` and closes only over `propext` and
`Quot.sound`. It does not assemble complete exposed candidates, prove cross-instance
`BaselineDistinct` or final-output laws, construct the uniform polynomial locked-NAND builder, or
establish the threshold. The remaining Cook-Levin formula body, complete raw builder, builder
`FunctionProgram.RawRefinement`, packaged polynomial reduction, CNF-SAT in P, and NP-completeness
must also remain absent.

`report:check` performs a same-environment deterministic double build, exact byte comparison, PDF
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
