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
| `downloads/canonical_proof_report.pdf` | 249,333 | `39cd8007df8f92a9a1ae31a2ff153bd249bc5cce8d06f202e796d5f1c67cd90b` |
| `downloads/canonical-proof-report.pdf` | 249,333 | `39cd8007df8f92a9a1ae31a2ff153bd249bc5cce8d06f202e796d5f1c67cd90b` |
| `downloads/canonical_proof_report.tex` | 19,013 | `d2c92cac2bbeab90e81ba6fd8c7c3abf4097fa9b32339a4f5a6cc90b3f764109` |
| `downloads/canonical-proof-report.tex` | 19,013 | `d2c92cac2bbeab90e81ba6fd8c7c3abf4097fa9b32339a4f5a6cc90b3f764109` |
| `public/pnp-status.json` | 115,857 | `8679a9c871804296ff7d783b610803e18c7d3c93a6d2427a4b2b2cee813bf774` |
| `public/pnp-theorem-inventory.json` | 1,122,815 | `0a41a771cff082c64c4afd96025a59b66b82b8110b5a6781fe45ae47544a6a97` |

The PDF must have ten A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 6459cb433a2c788e16a8da05f6487e23728875ff
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

Expected compiled inventory counts are 5,096 public declarations, 2,143 theorem-kind declarations,
2,042 assumption-free theorem-kind declarations, 957 excluded private auxiliaries, 46 modules, and
four project axioms. The publication gate must remain false with seven blockers. The exact earned theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the namespace, stage-bridge, terminal-packer, and terminal-bridge audits must cover 39, 56, 69, and 59 declarations respectively with empty axiom closure. For a caller-supplied exact target execution, the ordinary paired-input trace is transported through the terminal machine at exact compiled cost six times `inputFramerWorkSteps + 1 + 3 * sourceSteps + 1 + framedOutputHandoffWorkSteps + 1 + terminalOutputPackerWorkSteps`; a supplied stuck nonhalting endpoint remains timeout. Target termination, uniform all-input raw refinement, the external input-size polynomial, CNF-SAT in P, and NP-completeness must remain false.

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
