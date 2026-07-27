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
| `downloads/canonical_proof_report.pdf` | 402,956 | `9d0743f86dd9da269d6244a543a1c4a21a2ede2b7cfdc5508875b17c7ae8f4ad` |
| `downloads/canonical-proof-report.pdf` | 402,956 | `9d0743f86dd9da269d6244a543a1c4a21a2ede2b7cfdc5508875b17c7ae8f4ad` |
| `downloads/canonical_proof_report.tex` | 152,171 | `f0dd87b5b3799b7651eb0a3a321d9054c7acce1f815e86f473bac25467006a71` |
| `downloads/canonical-proof-report.tex` | 152,171 | `f0dd87b5b3799b7651eb0a3a321d9054c7acce1f815e86f473bac25467006a71` |
| `public/pnp-status.json` | 1,582,057 | `c0bb68c8c353d034294e7377cc43d5146a1c84723c11029b909ba6cbb22192bd` |
| `public/pnp-theorem-inventory.json` | 11,197,669 | `6c77607a6c03fd4136c31d62517d7773ec3989dbfd95188f28995c10f32f44fd` |

The PDF must have sixty-three A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 764c4ccc3795a32b183c6ee4fa1e347720562483
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

Expected compiled inventory counts are 12,247 public declarations, 7,160 theorem-kind declarations,
3,676 assumption-free theorem-kind declarations, 5,000 excluded private auxiliaries, 106 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete
NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`, and the current bounded
Cook-Levin prefix still stops after the seventh padding-or-unary opportunity in the second scheduled
constraint. The newest milestone includes
`PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_eq_false_of_unsatisfiable`: for every
finite topologically ordered NAND circuit, unsatisfiability forces the full final coordinate false
on the whole carrier. Its companion theorem
`fullCandidate_referenceMinimum_eq_baseline_of_unsatisfiable` fixes the exhaustive reference
minimum at `B`. Both pinned theorems use only `propext` and `Quot.sound`, with no project axiom or
`Classical.choice`. It does not prove the satisfiable whole-carrier final-output conditions,
residual slack at most four, the uniform polynomial locked-NAND builder, or the threshold. The
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
