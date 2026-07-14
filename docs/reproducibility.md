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
| `downloads/canonical_proof_report.pdf` | 249,982 | `e043a966e60e21c6d05f15a4eba24a915c27de4d73281acc2aaa50428c4e626e` |
| `downloads/canonical-proof-report.pdf` | 249,982 | `e043a966e60e21c6d05f15a4eba24a915c27de4d73281acc2aaa50428c4e626e` |
| `downloads/canonical_proof_report.tex` | 18,509 | `03570c7d153580293c3bd9acbbb1691d3747bca8363fa05e6b43ef601f66463a` |
| `downloads/canonical-proof-report.tex` | 18,509 | `03570c7d153580293c3bd9acbbb1691d3747bca8363fa05e6b43ef601f66463a` |
| `public/pnp-status.json` | 152,196 | `0c515fbbe0e18a96f306acb82a6d1852b4106a0a47e0e85724b1c8d049d48bf6` |
| `public/pnp-theorem-inventory.json` | 1,456,364 | `f9bbb4c9aa21a72221d20e9327b900dd37a6cc62ea2919b5fc1a20dee1776921` |

The PDF must have nine A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 0c52c984aa03f4ce40f6d64fd6fb5c1678db9045
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

Expected compiled inventory counts are 5,323 public declarations, 2,282 theorem-kind declarations,
2,181 assumption-free theorem-kind declarations, 1,042 excluded private auxiliaries, 51 modules, and
four project axioms. The publication gate must remain false with six blockers. The exact earned theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the input-framer, pipeline namespace, stage-bridge, terminal-packer, terminal-bridge, paired-compiler, all-input-compiler, sequential namespace, sequential-compiler, and recursive-refinement audits must cover 70, 39, 56, 69, 59, 28, 29, 26, 31, and 16 declarations respectively with empty axiom closure. Every proof-bearing function or decision program tree recursively compiles to one literal raw machine; sequential composition uses `Rseq(m) = PipelineRaw(p)(m) + 6 + PipelineRaw(q)(m + p(m) + 1)`. CNF-SAT in P and NP-completeness must remain false.

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
