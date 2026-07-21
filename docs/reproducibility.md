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
| `downloads/canonical_proof_report.pdf` | 348,387 | `09ffb5a9569b3fc42d6ab84e69717b819f3a415b8f029b3de1c3a9fb24eee035` |
| `downloads/canonical-proof-report.pdf` | 348,387 | `09ffb5a9569b3fc42d6ab84e69717b819f3a415b8f029b3de1c3a9fb24eee035` |
| `downloads/canonical_proof_report.tex` | 93,070 | `b0befcc14f61ca42179362b7e369b0611f7a5084a575ba788ce95a860403d0d7` |
| `downloads/canonical-proof-report.tex` | 93,070 | `b0befcc14f61ca42179362b7e369b0611f7a5084a575ba788ce95a860403d0d7` |
| `public/pnp-status.json` | 984,156 | `7822370f79876d4c62b4f70a624bfc43efd9dc0f2bd0dafc5e8d1e1032882666` |
| `public/pnp-theorem-inventory.json` | 6,615,591 | `84ba24b2779664619022bc89cacedbd030f3a1cbfebe944ad2ed81351c7191c5` |

The PDF must have forty-one A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 3a56b27add47f7991b670e6e0fb9bb302d78cd04
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

Expected compiled inventory counts are 9,661 public declarations, 5,173 theorem-kind declarations,
3,215 assumption-free theorem-kind declarations, 3,509 excluded private auxiliaries, 85 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the current Cook-Levin semantic theorem is `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language`, audited across 54 declarations with closure `[Classical.choice, Quot.sound, propext]` and no project axiom. `encodedFormula_size_le` bounds the actual canonical encoding in external input length. The rectangular schedule binds exact polynomial length to exact canonical emission. The direct cursor proves pointwise constraint/clause/token/bit lookup plus exact fuelled traversal. `PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workRunExact` proves one literal finite machine emits the complete second negative literal `F T T F` in clause four, preserves bits equal to `encodedFormula.take (2 * (FormulaWidth + 35))`, advances the retained coordinate to `FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause + 8`, and proves the following direct token is `Finish`. The table has `4154` plus ten inherited/generated unary-evaluator rule counts, and the compiled run is bounded by `BuilderFourthClauseFirstLiteralPrefix.rawTimeBound + 2232 + 96*n + 48*FormulaWidth + 48*cursorWord.length`. The combined 147-declaration audit covers all 124 new public declarations, 21 reviewed reused suffix interfaces, and two cursor dead-state facts using only the approved Lean-standard closure, with no project axiom or `Classical.choice`. This is one complete fixed second literal, not emission of the following `Finish`, completion of clause four, or a general dynamic formula cursor. The remaining formula body, complete raw builder, builder `FunctionProgram.RawRefinement`, and packaged polynomial reduction must remain absent, as must CNF-SAT in P and NP-completeness.

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
