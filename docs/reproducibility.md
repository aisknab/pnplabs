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
| `downloads/canonical_proof_report.pdf` | 352,982 | `ac4c86c2d9658ed4d8b005f388739cbcd6a9931d9b2925af8535ac191ad83d34` |
| `downloads/canonical-proof-report.pdf` | 352,982 | `ac4c86c2d9658ed4d8b005f388739cbcd6a9931d9b2925af8535ac191ad83d34` |
| `downloads/canonical_proof_report.tex` | 98,064 | `6a22031e8a428a174dcfeb6b31a8a4e02ded30add67041f7dc750bd243669d3c` |
| `downloads/canonical-proof-report.tex` | 98,064 | `6a22031e8a428a174dcfeb6b31a8a4e02ded30add67041f7dc750bd243669d3c` |
| `public/pnp-status.json` | 1,042,874 | `f59c5a127e0e8d635d5a7283cbc1c5cd70fd9ed2401008cf2164e96b3dda01d6` |
| `public/pnp-theorem-inventory.json` | 6,972,658 | `6431a458dbb72513518ecb2b64fb9cd5813323130f49c281df18cd3933da4c16` |

The PDF must have forty-three A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 5377b99658a756f60a8b36d19896be579761d8cd
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

Expected compiled inventory counts are 9,906 public declarations, 5,367 theorem-kind declarations,
3,252 assumption-free theorem-kind declarations, 3,630 excluded private auxiliaries, 87 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the current Cook-Levin semantic theorem is `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language`, audited across 54 declarations with closure `[Classical.choice, Quot.sound, propext]` and no project axiom. `encodedFormula_size_le` bounds the actual canonical encoding in external input length. The rectangular schedule binds exact polynomial length to exact canonical emission. The direct cursor proves pointwise constraint/clause/token/bit lookup plus exact fuelled traversal. `PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workRunExact` proves one literal finite machine traverses all `FormulaTokensPerClause - 9` remaining clause-four padding opportunities without emitting a token, preserves bits equal to `encodedFormula.take (2 * (FormulaWidth + 36))`, advances the retained coordinate to `FormulaVariableSlotBound + 1 + 4 * FormulaTokensPerClause`, and proves the target is padding in the intentionally empty fifth clause rectangle. The table has `4328` plus twelve inherited/generated unary-evaluator rule counts, and the compiled run is bounded by `BuilderFourthClausePrefix.rawTimeBound + 18` plus six times the count-evaluator work, countdown bound, and target-evaluator work. The 68-declaration audit covers all 65 new public declarations and three reused countdown interfaces using only the approved Lean-standard closure, with no project axiom or `Classical.choice`. This is the remaining fourth-clause padding run, not traversal of the empty fifth rectangle or a general dynamic formula cursor. The remaining formula body, complete raw builder, builder `FunctionProgram.RawRefinement`, and packaged polynomial reduction must remain absent, as must CNF-SAT in P and NP-completeness.

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
