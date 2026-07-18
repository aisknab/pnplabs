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
| `downloads/canonical_proof_report.pdf` | 317,210 | `961a0bb61fc5e69bb28250f8fd265023aa2a949093ff6c6abd46707ba822c74b` |
| `downloads/canonical-proof-report.pdf` | 317,210 | `961a0bb61fc5e69bb28250f8fd265023aa2a949093ff6c6abd46707ba822c74b` |
| `downloads/canonical_proof_report.tex` | 58,797 | `21fbcfd4746d5bbdd64c3a33227f5e0748690c4285e681d25cc9448b3a1b612e` |
| `downloads/canonical-proof-report.tex` | 58,797 | `21fbcfd4746d5bbdd64c3a33227f5e0748690c4285e681d25cc9448b3a1b612e` |
| `public/pnp-status.json` | 533,222 | `3e0ff0851a3140c20f8ca8ec2eaa51e1dc99c8f45af82f54bb67115201f1fe6b` |
| `public/pnp-theorem-inventory.json` | 3,786,875 | `6c63d3f093aa136560154ce1340abc75884da199dee1867c14550e95f6a3c268` |

The PDF must have twenty-eight A4 pages. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout bcabe7b58b7d72e738471f036f1c44b905b949eb
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

Expected compiled inventory counts are 8,229 public declarations, 4,080 theorem-kind declarations,
2,964 assumption-free theorem-kind declarations, 2,585 excluded private auxiliaries, 74 modules, and
four project axioms. The publication gate must remain false with six blockers. The concrete NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`; the current Cook-Levin semantic theorem is `PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language`, audited across 54 declarations with closure `[Classical.choice, Quot.sound, propext]` and no project axiom. `encodedFormula_size_le` bounds the actual canonical encoding in external input length. The rectangular schedule binds exact polynomial length to exact canonical emission. The direct cursor proves pointwise constraint/clause/token/bit lookup plus exact fuelled traversal. `PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workRunExact` proves one literal finite machine emits the complete negative literal on variable zero in clause two and advances to `secondClauseStart + 3`. The emitted bits equal `encodedFormula.take (2 * (FormulaWidth + 15))`. The table has `1610` plus six inherited/generated unary-evaluator rule counts and compiled bound `BuilderSecondClauseSeparatorStep.rawTimeBound + 564 + 48*n + 24*FormulaWidth + 24*cursorWord.length`. The combined audit covers 85 new public declarations and two reviewed cursor dead-loop facts; 25 declarations have empty closure, 18 use `[propext]`, and 44 use `[Quot.sound, propext]`. This is one fixed literal prefix, not a general dynamic formula cursor, and it does not complete clause two. The remaining formula body, complete raw builder, builder `FunctionProgram.RawRefinement`, and packaged polynomial reduction must remain absent, as must CNF-SAT in P and NP-completeness.

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
