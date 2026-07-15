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
| `downloads/canonical_proof_report.pdf` | 260,862 | `bd3b519b292bdb69831e14d4a1e95db80199c58e0f0476031fc6c895db7abfcd` |
| `downloads/canonical-proof-report.pdf` | 260,862 | `bd3b519b292bdb69831e14d4a1e95db80199c58e0f0476031fc6c895db7abfcd` |
| `downloads/canonical_proof_report.tex` | 28,392 | `438f19f4b452193cae3e26d772815f035902710a27178ce2743cbfa3f121d7a9` |
| `downloads/canonical-proof-report.tex` | 28,392 | `438f19f4b452193cae3e26d772815f035902710a27178ce2743cbfa3f121d7a9` |
| `public/pnp-status.json` | 215,764 | `54062cee2423cda8010511621d1bb7c4066b91104924555e1455a48d1d58c3fa` |
| `public/pnp-theorem-inventory.json` | 1,913,868 | `32f224f98afff60f9ab8d8a789648431976242313562758a66036946bbfde6fd` |

The PDF must have thirteen A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 5617c95037b14dde93c5d21caaf09de873491210
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

Expected compiled inventory counts are 6,901 public declarations, 3,143 theorem-kind declarations,
2,585 assumption-free theorem-kind declarations, 1,228 excluded private auxiliaries, 63 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the current Cook-Levin semantic theorem is `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language`, audited across 54 declarations with closure `[Classical.choice, Quot.sound, propext]` and no project axiom. `encodedFormula_size_le` bounds the actual canonical encoding in external input length. The rectangular schedule binds exact polynomial length to exact canonical emission. The direct cursor proves pointwise constraint/clause/token/bit lookup plus exact fuelled traversal. `PNP.Concrete.CookLevin.BuilderInputLength.workRunExact_after_totalInputFramer` proves the local fixed 19-rule input-length tally. `PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact` then proves that one literal finite machine runs the total framer, takes an explicit launch step, preserves the source bits, and completes the tally after exactly `totalInputFramerWorkSteps(input) + 1 + 2*n*n + 4*n + 2` work steps. Its compiled raw bound is `18*n*n + 63*n + 93`; its fourteen reviewed publication theorem types have empty closure, `[propext]`, or `[Quot.sound, propext]`. Formula-bit emission, direct cursor interpretation by raw transitions, a complete raw formula builder, `FunctionProgram.RawRefinement`, and packaged polynomial reduction must remain absent, as must CNF-SAT in P and NP-completeness.

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

The former 56-page direct-claim manuscript and assertion-checker release are preserved separately:

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
