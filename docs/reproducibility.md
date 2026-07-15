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
| `downloads/canonical_proof_report.pdf` | 290,464 | `276c01a4eb16c3807c52fa2ee2be371cba20f3c2b1dfa898a89e89973519b951` |
| `downloads/canonical-proof-report.pdf` | 290,464 | `276c01a4eb16c3807c52fa2ee2be371cba20f3c2b1dfa898a89e89973519b951` |
| `downloads/canonical_proof_report.tex` | 35,646 | `c84780e2146a200f2dbdb39a818e0a304caf1caa496c4ac60056aebe1d5143f9` |
| `downloads/canonical-proof-report.tex` | 35,646 | `c84780e2146a200f2dbdb39a818e0a304caf1caa496c4ac60056aebe1d5143f9` |
| `public/pnp-status.json` | 258,968 | `beffd9c5f6ac31f559ed13b997a2ad73b855c2df71ba89ef6da0241f97e30e14` |
| `public/pnp-theorem-inventory.json` | 2,190,097 | `2f8280035717c4223b465ca64ffe4c10c7fd4bc973c28d4a79a92ab2e78851a5` |

The PDF must have sixteen A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 359dcb1bf645ef15dddbfb42cd1ec789e4f5a5b7
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

Expected compiled inventory counts are 7,006 public declarations, 3,213 theorem-kind declarations,
2,620 assumption-free theorem-kind declarations, 1,333 excluded private auxiliaries, 64 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the current Cook-Levin semantic theorem is `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language`, audited across 54 declarations with closure `[Classical.choice, Quot.sound, propext]` and no project axiom. `encodedFormula_size_le` bounds the actual canonical encoding in external input length. The rectangular schedule binds exact polynomial length to exact canonical emission. The direct cursor proves pointwise constraint/clause/token/bit lookup plus exact fuelled traversal. `PNP.Concrete.CookLevin.BuilderInputLength.workRunExact_after_totalInputFramer` proves the local fixed 19-rule input-length tally. `PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact` proves that one literal finite machine runs the total framer, takes an explicit launch step, preserves the source bits, and completes the tally after exactly `totalInputFramerWorkSteps(input) + 1 + 2*n*n + 4*n + 2` work steps. The separate theorem `PNP.Concrete.CookLevin.BuilderTokenAppender.appendToken_workRunExact` proves exact fixed-token appending on arbitrary represented workspace, and `firstHeaderToken_bits_eq_encodedFormula_take_two` identifies its first-header output with the first two direct formula bits. The compiled first-token bound is `24*n + 48`; all 68 public appender declarations are audited and its seventeen reviewed theorem types have empty closure, `[propext]`, or `[Quot.sound, propext]`. Prefix-to-appender rule-table composition, a complete raw formula builder, `FunctionProgram.RawRefinement`, and packaged polynomial reduction must remain absent, as must CNF-SAT in P and NP-completeness.

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
