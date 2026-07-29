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
| `downloads/canonical_proof_report.pdf` | 411,556 | `52e455c3cae86c2ae9b797fde18535035460bac4dc90c72c9c508a817a4c4beb` |
| `downloads/canonical-proof-report.pdf` | 411,556 | `52e455c3cae86c2ae9b797fde18535035460bac4dc90c72c9c508a817a4c4beb` |
| `downloads/canonical_proof_report.tex` | 167,716 | `49c9df4b981fa87b378fac3ac5b70b257c3fac1166732f9221478fcdf30fbe58` |
| `downloads/canonical-proof-report.tex` | 167,716 | `49c9df4b981fa87b378fac3ac5b70b257c3fac1166732f9221478fcdf30fbe58` |
| `public/pnp-status.json` | 1,628,650 | `e246e54524b5ef8d6a94a33ebe0888020e607be90e49362df33222d792a9e929` |
| `public/pnp-theorem-inventory.json` | 12,883,572 | `7d9f871badb77f300b36425e99ecb906d94fb73120e95a62a774c618fe48d100` |

The PDF must have sixty-five A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 23f53b6efccee3ff50987cf55338b8b01ddad343
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

Expected compiled inventory counts are 20,957 public declarations, 11,424 theorem-kind declarations,
5,968 assumption-free theorem-kind declarations, 11,692 excluded private auxiliaries, 184 modules, and
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

The newest milestone adds a literal 1,387,921-rule, nine-symbol target emitter. It emits the exact
direct locked-NAND target for every grammar-decoded circuit, rejects malformed grammar with empty
output, cannot time out within `6 * allInputWorkBound(n)` compiled steps, and has the explicit quadratic
output-size bound recorded in the release manifest. Compiled polynomial-time machine/function
witnesses, exact leaf `RawRefinement`, and strict parser/emitter composition computing
`buildLockedNANDInstance` are formalized. This boundary does not package the source-to-target
language equivalence as `PolynomialReduction`, discharge the abstract locked-NAND threshold axiom,
or transport the result to NP-hardness. The
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
