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
| `downloads/canonical_proof_report.pdf` | 347,311 | `d502b676564e34d7dbc84ca49b90398dbec7d48ee9b54051db2f67e57e7971bf` |
| `downloads/canonical-proof-report.pdf` | 347,311 | `d502b676564e34d7dbc84ca49b90398dbec7d48ee9b54051db2f67e57e7971bf` |
| `downloads/canonical_proof_report.tex` | 90,040 | `676541e58c89068d7ba3a98b4ee8c0c0d998979c4f8f2eb09ced7e2d8c9b779c` |
| `downloads/canonical-proof-report.tex` | 90,040 | `676541e58c89068d7ba3a98b4ee8c0c0d998979c4f8f2eb09ced7e2d8c9b779c` |
| `public/pnp-status.json` | 920,227 | `39a70a771b2a4ac3df1aba9a348d94144db1721c1a18270c85dbe6b7634c9901` |
| `public/pnp-theorem-inventory.json` | 6,198,052 | `db345c0483274feeb05ed3fd30c973ea8c3dfa06688b2a4b1f3dc5b991ef6406` |

The PDF must have forty A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 3112ca90d74d58116dc53ea5300082d0caa63c0e
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

Expected compiled inventory counts are 9,474 public declarations, 5,036 theorem-kind declarations,
3,178 assumption-free theorem-kind declarations, 3,398 excluded private auxiliaries, 84 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the current Cook-Levin semantic theorem is `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language`, audited across 54 declarations with closure `[Classical.choice, Quot.sound, propext]` and no project axiom. `encodedFormula_size_le` bounds the actual canonical encoding in external input length. The rectangular schedule binds exact polynomial length to exact canonical emission. The direct cursor proves pointwise constraint/clause/token/bit lookup plus exact fuelled traversal. `PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workRunExact` proves one literal finite machine emits the complete first negative literal `F T F` in clause four, preserves bits equal to `encodedFormula.take (2 * (FormulaWidth + 31))`, advances the retained coordinate to `FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause + 4`, and proves the following direct token is `F`. The table has `3666` plus ten inherited/generated unary-evaluator rule counts, and the compiled run is bounded by `BuilderFourthClauseSeparatorStep.rawTimeBound + 1422 + 72*n + 36*FormulaWidth + 36*cursorWord.length`. The combined 115-declaration audit covers all 97 new public declarations, 16 reviewed reused suffix interfaces, and two cursor dead-state facts using only the approved Lean-standard closure, with no project axiom or `Classical.choice`. This is one complete fixed literal, not emission of the following `F`, completion of clause four, or a general dynamic formula cursor. The remaining formula body, complete raw builder, builder `FunctionProgram.RawRefinement`, and packaged polynomial reduction must remain absent, as must CNF-SAT in P and NP-completeness.

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
