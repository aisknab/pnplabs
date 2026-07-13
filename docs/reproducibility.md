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
| `downloads/canonical_proof_report.pdf` | 251,451 | `5aa36153000ef8ef99fa0060088b2d5c9d7ea5549d683517beda8abf7d1d72ac` |
| `downloads/canonical-proof-report.pdf` | 251,451 | `5aa36153000ef8ef99fa0060088b2d5c9d7ea5549d683517beda8abf7d1d72ac` |
| `downloads/canonical_proof_report.tex` | 19,161 | `4768beadfbb1fa922962d1879eb22ee1769a8e00da1db92db60501f78a4a1fe2` |
| `downloads/canonical-proof-report.tex` | 19,161 | `4768beadfbb1fa922962d1879eb22ee1769a8e00da1db92db60501f78a4a1fe2` |
| `public/pnp-status.json` | 129,216 | `1df549b65431dc1740ec9f6452a853951a41cffc5b16ce77961e71fb7f14268a` |
| `public/pnp-theorem-inventory.json` | 1,205,195 | `fcc6b1b8133562a155455f29d9834910b58ef3584a49fb5ca2d428a2e9515121` |

The PDF must have ten A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout fb9674949679a137b7ce790c1522efaecbe240ce
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

Expected compiled inventory counts are 5,197 public declarations, 2,197 theorem-kind declarations,
2,096 assumption-free theorem-kind declarations, 1,032 excluded private auxiliaries, 48 modules, and
four project axioms. The publication gate must remain false with seven blockers. The exact earned theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the input-framer, namespace, stage-bridge, terminal-packer, terminal-bridge, and paired-compiler audits must cover 70, 39, 56, 69, 59, and 28 declarations respectively with empty axiom closure. The literal input framer accepts every raw bitstring and is bounded by `6 * m * m + 39 * m + 75`. For every proof-bearing polynomial-time target and canonical `BitString.pair`, the complete literal pipeline has exact verdict and `machineOutput`, cannot time out, and uses `B(m) = m + p(m) + 1` plus the explicit external runtime polynomial `R(m)`. Full-pipeline malformed-input behavior and uniform all-input raw refinement must remain false; CNF-SAT in P and NP-completeness must remain false.

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
