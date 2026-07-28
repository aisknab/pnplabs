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
| `downloads/canonical_proof_report.pdf` | 404,422 | `40e93415f0ce334d53ac8ee0c691df828b8ea5ddaeb45d3c22d2faec6d88d9eb` |
| `downloads/canonical-proof-report.pdf` | 404,422 | `40e93415f0ce334d53ac8ee0c691df828b8ea5ddaeb45d3c22d2faec6d88d9eb` |
| `downloads/canonical_proof_report.tex` | 154,275 | `4fef9bd1525e1f700b8eb98f5a9c54396b39013e1619fe803df8c1a047588fad` |
| `downloads/canonical-proof-report.tex` | 154,275 | `4fef9bd1525e1f700b8eb98f5a9c54396b39013e1619fe803df8c1a047588fad` |
| `public/pnp-status.json` | 1,597,898 | `c5f375d6a2fe9cae42901997357ab626ae69481f6a81f7217a889937c8d26ed5` |
| `public/pnp-theorem-inventory.json` | 11,367,243 | `bc9f93749d14dd5d646ee37540f365d9c712f599a4aadd45262bb1ab063146c5` |

The PDF must have sixty-four A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout a20c99f035eeb6bc3cafc7184bec6c40f9cbda22
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

Expected compiled inventory counts are 13,731 public declarations, 7,827 theorem-kind declarations,
4,012 assumption-free theorem-kind declarations, 6,908 excluded private auxiliaries, 117 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete
NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`, and the current bounded
Cook-Levin prefix still stops after the seventh padding-or-unary opportunity in the second scheduled
constraint. The newest milestone gives normalized source circuits and complete locked-NAND
candidates a strict version-zero bit grammar. The exact round-trip theorem
`PNP.Concrete.LockedNAND.decodeLockedInstance_encodeLockedInstance` preserves every valid encoded
instance. The pure all-bitstring transformation is fail-closed on malformed input, and
`PNP.Concrete.LockedNAND.buildLockedNANDInstance_correct` proves that valid source bytes cross the
locked-circuit threshold exactly when the decoded source circuit is satisfiable. The eleven audited
pins use only `propext` and `Quot.sound`, with no project axiom or `Classical.choice`.

The newest milestone adds a literal 228-state, 2,052-rule source parser. Its all-input theorem accepts
exactly valid strict-v0 circuits, preserves valid bytes, clears invalid bytes, and its compiled machine
cannot time out within `6 * 4096 * (n + 1)^3`. Its polynomial-time machine/function witnesses and
validator-leaf `FunctionProgram.RawRefinement` are formalized. This boundary does not provide a
bounded target emitter, parser/emitter composition, source-to-target `PolynomialReduction`, emitter
construction-runtime or output-size bounds, discharge the abstract locked-NAND threshold axiom, or
transport the result to NP-hardness. The
remaining Cook-Levin formula body, complete raw builder, packaged polynomial reduction, CNF-SAT in P,
and NP-completeness must also remain absent.

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
