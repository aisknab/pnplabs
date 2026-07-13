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
| `downloads/canonical_proof_report.pdf` | 248,792 | `3e42f0cdca41740417d33f29afbd5035549d32ebd5bcab3d25aaa6aff7e3c84e` |
| `downloads/canonical-proof-report.pdf` | 248,792 | `3e42f0cdca41740417d33f29afbd5035549d32ebd5bcab3d25aaa6aff7e3c84e` |
| `downloads/canonical_proof_report.tex` | 18,664 | `abe7a4cfde0bfb194c520209273f3f5ad0c68e4ad7f15c02fd0c7315196b7b8d` |
| `downloads/canonical-proof-report.tex` | 18,664 | `abe7a4cfde0bfb194c520209273f3f5ad0c68e4ad7f15c02fd0c7315196b7b8d` |
| `public/pnp-status.json` | 123,435 | `382e6d66a2ca0f6bb46e94a7e57f7bbd682763057045dc16d274f0a84822fe8b` |
| `public/pnp-theorem-inventory.json` | 1,184,322 | `ed67c989a5e6955d30d2a9f8d121e102c08de43a429c5238bb5b4944119f49b6` |

The PDF must have nine A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout cc3c004f3498a0f28b8afda688802d322b9e5c21
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

Expected compiled inventory counts are 5,125 public declarations, 2,168 theorem-kind declarations,
2,067 assumption-free theorem-kind declarations, 961 excluded private auxiliaries, 47 modules, and
four project axioms. The publication gate must remain false with seven blockers. The exact earned theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the namespace, stage-bridge, terminal-packer, terminal-bridge, and paired-compiler audits must cover 39, 56, 69, 59, and 28 declarations respectively with empty axiom closure. For every proof-bearing polynomial-time target and canonical `BitString.pair`, the literal pipeline has exact verdict and `machineOutput`, cannot time out, and uses `B(m) = m + p(m) + 1` plus the explicit external runtime polynomial `R(m)`. Malformed-input behavior and uniform all-input raw refinement must remain false; CNF-SAT in P and NP-completeness must remain false.

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
