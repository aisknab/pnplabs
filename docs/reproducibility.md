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
| `downloads/canonical_proof_report.pdf` | 402,257 | `3e1e2a6ed161f4d886abb3957bf69b6bcf8ec2aba96731903e0950f1fcb7afd2` |
| `downloads/canonical-proof-report.pdf` | 402,257 | `3e1e2a6ed161f4d886abb3957bf69b6bcf8ec2aba96731903e0950f1fcb7afd2` |
| `downloads/canonical_proof_report.tex` | 150,465 | `aab2c1f23f08dbc2a5cd2073e45c9755abdc27f49d9578394bbedd1a1569b6ea` |
| `downloads/canonical-proof-report.tex` | 150,465 | `aab2c1f23f08dbc2a5cd2073e45c9755abdc27f49d9578394bbedd1a1569b6ea` |
| `public/pnp-status.json` | 1,565,360 | `a1bb49bb850ec6032b1e6ccff8aee14e040acb69ccb911f7f4db24407b4300aa` |
| `public/pnp-theorem-inventory.json` | 11,074,060 | `72261ed03643251129b75a87b8248c861d96a0d9badfd9d8783f90de7221fca9` |

The PDF must have sixty-two A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout a8916280a02c3d2357f5b81917baa17926e51047
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

Expected compiled inventory counts are 12,233 public declarations, 7,146 theorem-kind declarations,
3,669 assumption-free theorem-kind declarations, 4,738 excluded private auxiliaries, 105 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete
NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`, and the current bounded
Cook-Levin prefix still stops after the seventh padding-or-unary opportunity in the second scheduled
constraint. The newest milestone includes
`PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_semantics`: for every finite
topologically ordered NAND circuit, the source-derived baseline candidate has `B` gates and `B`
outputs, while the extension has `B + 4` gates and `B + 1` outputs. The eleven pinned theorems prove
the size equations, source and conjunction semantics, absence of internal constants, and
independence of baseline outputs from the fresh final lock. The 59-declaration audit has no project
axiom or `Classical.choice` and closes only over `propext` and `Quot.sound`. It does not prove
cross-instance `BaselineDistinct`, either conditional final-output branch law, residual slack at
most four, the uniform polynomial locked-NAND builder, or the threshold. The
remaining Cook-Levin formula body, complete raw builder, builder
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
