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
| `downloads/canonical_proof_report.pdf` | 401,311 | `829716176063a0ab6b9ccb07bfe59aa9906aaceee20ff10c3edad31114a1367e` |
| `downloads/canonical-proof-report.pdf` | 401,311 | `829716176063a0ab6b9ccb07bfe59aa9906aaceee20ff10c3edad31114a1367e` |
| `downloads/canonical_proof_report.tex` | 149,920 | `59825734e578bd02212f30faf6ea64ef0bf31a131dff128cf1e722ec374ff622` |
| `downloads/canonical-proof-report.tex` | 149,920 | `59825734e578bd02212f30faf6ea64ef0bf31a131dff128cf1e722ec374ff622` |
| `public/pnp-status.json` | 1,559,103 | `0127bc63e11364312db37bcdbd50e672911d62edc5555ecccbefce6534aa65e5` |
| `public/pnp-theorem-inventory.json` | 11,002,266 | `b5a96357624ad63fd3815db8be685ebb5a3d52cf8859d3621d392e966df18940` |

The PDF must have sixty-two A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 655d767f486a8ef64ee841b24ba853c4e0414658
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

Expected compiled inventory counts are 11,811 public declarations, 6,873 theorem-kind declarations,
3,574 assumption-free theorem-kind declarations, 4,511 excluded private auxiliaries, 103 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the current Cook-Levin semantic theorem is `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language`, audited across 54 declarations with closure `[Classical.choice, Quot.sound, propext]` and no project axiom. `encodedFormula_size_le` bounds the actual canonical encoding in external input length. The rectangular schedule binds exact polynomial length to exact canonical emission. The direct cursor proves pointwise constraint/clause/token/bit lookup plus exact fuelled traversal. `PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.workRunExact` proves one literal finite machine consumes a seventh padding slot without emission at width one or emits the first unary-index `T` of the following literal at wider widths, preserves bits equal to `encodedFormula.take (2 * (FormulaWidth + 43 + if tapeWidth = 1 then 0 else 7))`, advances the retained coordinate to `FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 14`, and proves the following opportunity is padding at width one or the second unary-index `T` of that literal at wider widths. The table has `6124` plus thirty-two inherited/generated unary-evaluator rule counts, and the compiled run is bounded by `BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rawTimeBound + 684 + 24 * n + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps`. The 82-declaration audit covers 66 new public outer declarations, fourteen reused optional-appender interfaces, and two strengthened schedule lemmas using only the approved Lean-standard closure, with no project axiom or `Classical.choice`. This handles only one additional width-dependent opportunity and does not consume the following padding or second unary-index `T` opportunity, complete the following literal, or traverse the remaining second constraint; it does not implement a general dynamic formula cursor. The remaining formula body, complete raw builder, builder `FunctionProgram.RawRefinement`, and packaged polynomial reduction must remain absent, as must CNF-SAT in P and NP-completeness.

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
