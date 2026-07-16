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
| `downloads/canonical_proof_report.pdf` | 295,278 | `afc2edd421ad3e4c04d1ade5a019dd63ba0c6fd75ecfc813dcb1effab528d063` |
| `downloads/canonical-proof-report.pdf` | 295,278 | `afc2edd421ad3e4c04d1ade5a019dd63ba0c6fd75ecfc813dcb1effab528d063` |
| `downloads/canonical_proof_report.tex` | 39,265 | `f33296d44b1c0bbb5d24525f101eac3307211714bb73de309eb42e727e33cd71` |
| `downloads/canonical-proof-report.tex` | 39,265 | `f33296d44b1c0bbb5d24525f101eac3307211714bb73de309eb42e727e33cd71` |
| `public/pnp-status.json` | 309,501 | `763756907512ae8321635720fd0f72487dfd7cd05a013d4a134f7276ca551643` |
| `public/pnp-theorem-inventory.json` | 2,459,012 | `a27adf2ab77140e0e8b9c41429f0178ba97a2a76738669f6d6175e416bce2b28` |

The PDF must have nineteen A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 62c35edef4bb64f2c665051e61d07c7b17f70ad3
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

Expected compiled inventory counts are 7,418 public declarations, 3,473 theorem-kind declarations,
2,764 assumption-free theorem-kind declarations, 2,032 excluded private auxiliaries, 67 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the current Cook-Levin semantic theorem is `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language`, audited across 54 declarations with closure `[Classical.choice, Quot.sound, propext]` and no project axiom. `encodedFormula_size_le` bounds the actual canonical encoding in external input length. The rectangular schedule binds exact polynomial length to exact canonical emission. The direct cursor proves pointwise constraint/clause/token/bit lookup plus exact fuelled traversal. `PNP.Concrete.CookLevin.BuilderCompleteHeader.workRunExact` proves one literal finite machine composes the 184-rule input/first-token prefix, unary polynomial evaluator, finite controller, two appender copies, and total bridges. Its output is exactly `FormulaWidth` copies of `T` followed by `F`; `finalTokenBits_eq_encodedFormula_header` identifies those bits with `encodedFormula.take (2 * (FormulaWidth + 1))`, and `run_compile_rawTimeBound` supplies an external `NatPolynomial` bound. The evaluator's 74 and composition's 83 public declarations are completely audited, and the 48 reviewed theorem types have empty closure, `[propext]`, or `[Quot.sound, propext]`. The dynamic cursor controller, formula body, complete raw builder, builder `FunctionProgram.RawRefinement`, and packaged polynomial reduction must remain absent, as must CNF-SAT in P and NP-completeness.

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
