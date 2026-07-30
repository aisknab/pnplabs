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
| `downloads/canonical_proof_report.pdf` | 413,228 | `11473c09eaff4e1cb6f2f4d7a8c36441564376dab59904ceb10d76f011a2b7fa` |
| `downloads/canonical-proof-report.pdf` | 413,228 | `11473c09eaff4e1cb6f2f4d7a8c36441564376dab59904ceb10d76f011a2b7fa` |
| `downloads/canonical_proof_report.tex` | 169,293 | `19c7dccef85be8c534821d7a8839fe27f6790bb3770dfa8e4749ff29ab52dcc7` |
| `downloads/canonical-proof-report.tex` | 169,293 | `19c7dccef85be8c534821d7a8839fe27f6790bb3770dfa8e4749ff29ab52dcc7` |
| `public/pnp-status.json` | 1,634,055 | `8bd1642ce803a8482921db9ae42ae623cc5cf760e4830050f9622624bce6ad51` |
| `public/pnp-theorem-inventory.json` | 12,889,740 | `3413510e8712416cdb1b5d846053e5c886bbc1cd550fe7533411573e5f88bf64` |

The PDF must have sixty-six A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 03f62a5465c1eacd399671121123a3891d8b3e67
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

Expected compiled inventory counts are 20,965 public declarations, 11,430 theorem-kind declarations,
5,968 assumption-free theorem-kind declarations, 11,692 excluded private auxiliaries, 185 modules, and
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

The literal 1,387,921-rule, nine-symbol target emitter emits the exact
direct locked-NAND target for every grammar-decoded circuit, rejects malformed grammar with empty
output, cannot time out within `6 * allInputWorkBound(n)` compiled steps, and has the explicit quadratic
output-size bound recorded in the release manifest. Compiled polynomial-time machine/function
witnesses, exact leaf `RawRefinement`, and strict parser/emitter composition computing
`buildLockedNANDInstance` are formalized. The newest milestone packages that composition as a
concrete polynomial many-one reduction from `EncodedNANDSAT` to
`EncodedLockedNANDThreshold`. Exact function identity, exact output, all-bitstring language
equivalence, the `ReducesTo` witness, and recursive raw-machine refinement are all checked. This
boundary does not identify the source language with ordinary CNF-SAT, establish NP-hardness,
discharge the abstract locked-NAND threshold axiom, or solve the target language in polynomial
time. The remaining Cook-Levin formula body, complete raw builder, CNF-SAT in P, and
NP-completeness must also remain absent.

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
