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
| `downloads/canonical_proof_report.pdf` | 338,355 | `92a782f234597457a50fbc9c9f319b1a202d743f4320c9d9e10a508fac50895a` |
| `downloads/canonical-proof-report.pdf` | 338,355 | `92a782f234597457a50fbc9c9f319b1a202d743f4320c9d9e10a508fac50895a` |
| `downloads/canonical_proof_report.tex` | 84,207 | `333f2cd48175ad2e50850f2bb61b144b826b2c2b4f262e664c9dcd2ed9ae29ee` |
| `downloads/canonical-proof-report.tex` | 84,207 | `333f2cd48175ad2e50850f2bb61b144b826b2c2b4f262e664c9dcd2ed9ae29ee` |
| `public/pnp-status.json` | 838,142 | `30d1c9c9dca12e13da089f312b9df023001ecdf3687850da64a6ef797c4a1057` |
| `public/pnp-theorem-inventory.json` | 5,678,091 | `be49e777c8d5fe6ca74fe4bcb808e67157091fc9c2f15502da7649e64e7287c4` |

The PDF must have thirty-seven A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 783941d428aa43cc2fb6763ed5f58fd9dab9ec44
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

Expected compiled inventory counts are 9,251 public declarations, 4,864 theorem-kind declarations,
3,140 assumption-free theorem-kind declarations, 3,205 excluded private auxiliaries, 82 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the current Cook-Levin semantic theorem is `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language`, audited across 54 declarations with closure `[Classical.choice, Quot.sound, propext]` and no project axiom. `encodedFormula_size_le` bounds the actual canonical encoding in external input length. The rectangular schedule binds exact polynomial length to exact canonical emission. The direct cursor proves pointwise constraint/clause/token/bit lookup plus exact fuelled traversal. `PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact` proves one literal finite machine traverses all `FormulaTokensPerClause - 8` remaining third-clause padding coordinates without emission, preserves bits equal to `encodedFormula.take (2 * (FormulaWidth + 27))`, and reaches the fourth-clause coordinate where direct lookup is `Sep`. The table has `3178` plus ten inherited/generated unary-evaluator rule counts, and the compiled run is bounded by `BuilderThirdClausePrefix.rawTimeBound + 18 + 6*countEvaluator.workSteps + 6*(D*(2*countRootPrefixLength + 8) + D*D) + 6*targetEvaluator.workSteps`. The 68-declaration audit has 26 empty closures, 9 using only `[propext]`, and 33 using only `[Quot.sound, propext]`. This is the complete remaining third-clause padding run, not emission of the fourth-clause separator or a general dynamic formula cursor. The remaining formula body, complete raw builder, builder `FunctionProgram.RawRefinement`, and packaged polynomial reduction must remain absent, as must CNF-SAT in P and NP-completeness.

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
