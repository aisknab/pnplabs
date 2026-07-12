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
| `downloads/canonical_proof_report.pdf` | 248,583 | `87599b382fe49e94b79cc2012b13ad09f53c6b17956d429e53ae737c20d38fa4` |
| `downloads/canonical-proof-report.pdf` | 248,583 | `87599b382fe49e94b79cc2012b13ad09f53c6b17956d429e53ae737c20d38fa4` |
| `downloads/canonical_proof_report.tex` | 18,879 | `cd6b1901ea5340a7252cb2207aaaab7895c55d9ba79b4db578e8eea695d002c0` |
| `downloads/canonical-proof-report.tex` | 18,879 | `cd6b1901ea5340a7252cb2207aaaab7895c55d9ba79b4db578e8eea695d002c0` |
| `public/pnp-status.json` | 98,627 | `4f4f448aca30f9cb5861256433c1d9299c816a4193a1803ddc3ea2dd8f872e95` |
| `public/pnp-theorem-inventory.json` | 973,743 | `6f5d04356e86d2c775f7913d5e8e8a891a59559a9dbc533f34ebfa18b619d1fc` |

The PDF must have nine A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 36a65d294276659f964e0b75cf102be2089fe1de
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

Expected compiled inventory counts are 5,023 public declarations, 2,081 theorem-kind declarations,
1,980 assumption-free theorem-kind declarations, 950 excluded private auxiliaries, 45 modules, and
four project axioms. The publication gate must remain false with seven blockers. The exact earned theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the namespace, stage-bridge, and terminal-packer audits must cover 39, 56, and 69 declarations respectively with empty axiom closure. The separate packer has compiled raw bound `18*m^2 + 36*m + 6`. Its connection to the bridge, target termination, complete raw refinement, the external input-size polynomial, CNF-SAT in P, and NP-completeness must remain false.

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
