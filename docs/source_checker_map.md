# Source/Checker Map

## Purpose

`pnplabs` is the public website, exact current-formal-publication mirror, artefact-identity,
smoke-test, and reviewer-documentation checkout. The current release is pinned by
[`downloads/formal-publication-release.json`](../downloads/formal-publication-release.json) to merged
core commit `2869924b3f5b7f4cea1b27d40ccebb91ee36a5ec`. Its generated status payload is current
publication-status authority. The compiled theorem inventory is the exact evidence mirror, while
the fifty-two-page TeX/PDF report is derived presentation of the same fail-closed gate.

`pnp` is also the source repository for the current Lean formalization. Reproduce the current build
at the merged commit above and compare the inventory/report bytes through the current-release
manifest.

The remainder of this map preserves the older 7072f8d source/checker, documentation, and generated
artefact coordinates. Those refs belong only to the historical 56-page assertion-checker release.
They are not current theorem authority and are not inputs to the current canonical report.

There is no default `pnp` ref for all paths. A path existing at one tag does not establish that the same path existed, had the same contents, or carried the same release identifiers at another tag.

## Current Formal Source Map

| Review area | Exact current target | What it supports |
| --- | --- | --- |
| Merged formalization | `aisknab/pnp` commit `2869924b3f5b7f4cea1b27d40ccebb91ee36a5ec` | Exact source tree reviewed and merged through concrete CNF-SAT NP membership, raw-machine compilation, Cook-Levin semantic/size/schedule results, four complete fixed clauses, first-constraint padding traversal, the second-constraint separator and sign, and the complete first literal of its second scheduled constraint |
| Compiled declaration evidence | `public/pnp-theorem-inventory.json` in that commit | Names, modules, kinds, and axiom closures for all public declarations; raw kernel types for 1649 reviewed milestone candidates; canonical counts |
| Publication derivation | `publication/FORMAL_PUBLICATION_MAP.json` and `formal-publication0.mjs` | Type/source-pinned milestones and fail-closed concrete gate logic |
| Generated status | `public/pnp-status.json` | Fifty-two earned scoped milestones, three unearned global milestones, four project axioms, and six blockers |
| Generated report | root `canonical_proof_report.tex` and `.pdf` | Current fifty-two-page non-claiming report; mirrored by this site |

The cross-repository checker compares the companion copies to these exact current targets. It does
not treat equality as independent theorem evidence.

## Reference Classes

The historical manifest for the coordinates in this section is
[downloads/source-checker-release.json](../downloads/source-checker-release.json). It is explicitly
historical and non-authoritative. It does not establish theorem correctness.

| Reference class | Role | Pinned ref | Resolved tag object | Resolved commit | Path class |
| --- | --- | --- | --- | --- | --- |
| `sourceRef` | Source/checker implementation and source tests. | `final-pnp-proof-report-hardened-7072f8d` | `9b69c4f8d8d6d62eb359af759288e5794d1c81c2` | `7072f8d0bda6d44d240f9bb3fad624fd357e1278` | Source/checker code. |
| `docsRef` | Correct 7072f8d release documentation and review handoff files. | `final-pnp-proof-report-docs-hardened-7072f8d-sealed` | `9eeb4b85af1c04c43e6f086debcd3ac37d5d27d1` | `3ba356c79b545d2c734283bf10d85d0710de2b60` | Release documentation. |
| `artifactRef` | Generated proof-report artefact bundle. | `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed` | `e7ea459c907ed9e334af8c0bd5f3bb117348992d` | `9d1de19f827e5cb6880741352eb2349cbbb45994` | Generated artefacts under `proof-artifacts/final-pnp-proof-report-hardened-7072f8d/`. |
| `publicCheckout` | Historical review mappings retained in this `pnplabs` checkout. | working tree | not applicable | not applicable | Historical audit-coordinate files only. |

`CURRENT_RELEASE.md` is not listed as an immutable audit target because it is absent at `sourceRef`, `docsRef`, and `artifactRef` in the sibling checkout inspected for this map. Use [downloads/source-checker-release.json](../downloads/source-checker-release.json) as the canonical public release-reference manifest.

## Coordinate Corrections From This Audit

The previous map incorrectly treated all `pnp` paths as if they belonged to `sourceRef`.

Corrected coordinates:

- `REPRODUCE.md` and `REVIEWER_MAP.md` are release documentation and must be read at `docsRef`; the copies at `sourceRef` contain 8b45da4 release identifiers.
- `proof-artifacts/final-pnp-proof-report-hardened-7072f8d/**` belongs to `artifactRef`; the bundle is absent at `sourceRef`.
- The root `REPRODUCE.md` and `REVIEWER_MAP.md` at `artifactRef` contain 8b45da4 release identifiers and are not used as 7072f8d release-document targets.
- `review/hostile_review_checklist_7072f8d.md` was not found at the pinned refs inspected here; it is not listed as an audit target.
- `review/external_review_handoff_7072f8d.md` exists at `docsRef` and contains the 7072f8d release identifiers.

Validate the machine-readable coordinate list with:

```bash
PNP_SOURCE_DIR=../pnp npm run test:audit-targets
```

If `PNP_SOURCE_DIR` is unavailable, the cross-repo portion reports an explicit skip. A skip is not evidence that coordinates are valid.

## Canonical Release Identifiers

These historical provenance values are preserved in
[downloads/source-checker-release.json](../downloads/source-checker-release.json), not in the
current formal-publication manifest.

| Field | Value |
| --- | --- |
| Source repo | `aisknab/pnp` |
| Source tag | `final-pnp-proof-report-hardened-7072f8d` |
| Source commit | `7072f8d0bda6d44d240f9bb3fad624fd357e1278` |
| Docs tag | `final-pnp-proof-report-docs-hardened-7072f8d-sealed` |
| Artefact tag | `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed` |
| Artefact bundle path | `proof-artifacts/final-pnp-proof-report-hardened-7072f8d/` |
## Source/Checker Audit Map

| Review area | Public term | Target class | Pinned ref | Paths | What the target can support | What still requires review |
| --- | --- | --- | --- | --- | --- | --- |
| Release-reference manifest | Historical release metadata | `pnplabs public-review file` | `publicCheckout` | `downloads/source-checker-release.json` | Names the quarantined source, docs, artefact refs, bundle path, historical report hashes, and archive locator. | It does not verify theorem correctness, checker soundness, or current status. |
| Public theorem boundary | `CheckPCCPackexp(GeneratePCCPack())=accept => P = NP` | `release documentation` | `docsRef` | `REPRODUCE.md`; `REVIEWER_MAP.md`; `review/external_review_handoff_7072f8d.md` | Documents the 7072f8d release coordinates and reviewer route. | Documentation is not verification evidence; inspect source and generated artefacts independently. |
| Public theorem boundary | `CheckPCCPackexp(GeneratePCCPack())=accept => P = NP` | `source/checker code` | `sourceRef` | `pcc-check-pcc-pack-exp0.mjs`; `pcc-runall0.mjs`; `pcc-final-proof-report0.mjs`; `test/pcc-check-pcc-pack-exp0.test.mjs`; `test/pcc-runall0.test.mjs` | Lets reviewers inspect implementation surfaces that reportedly check package acceptance, run-all inclusion, final public fields, and tests according to the source/checker implementation. | Whether the checked implication is mathematically sound and whether the checker implementation is sound. |
| Locked NAND | Locked NAND threshold construction | `source/checker code` | `sourceRef` | `pcc-gpack0.mjs`; `pcc-global-proof-dag0.mjs`; `test/pcc-gpack0.test.mjs`; `test/pcc-global-proof-dag0.test.mjs` | Lets reviewers inspect code-level fields, proof references, and tests for the locked NAND surfaces. | Correctness of the locked NAND threshold theorem, satisfiability preservation, polynomial size, and size/minimum convention alignment. |
| Locked NAND | Hostile review note | `release documentation` | `docsRef` | `review/locked_nand_threshold_hostile_review_round1.md` | Provides a pinned review document for the locked NAND threshold audit. | Author/reviewer prose is not verification evidence; mathematical reconstruction is still required. |
| Residual slack / ZeroSlack / residual-band minimization | Residual-band exact minimization and terminal ZeroSlack closure | `source/checker code` | `sourceRef` | `pcc-local-packages0.mjs`; `pcc-global-proof-dag0.mjs`; `test/pcc-local-packages0.test.mjs`; `test/pcc-global-proof-dag0.test.mjs` | Lets reviewers inspect implementation surfaces for Package O, global proof-DAG linkage, and tests according to the source/checker implementation. | Completeness and soundness of the residual-band minimization theorem and ZeroSlack closure. |
| Residual slack / ZeroSlack / residual-band minimization | Hostile review note | `release documentation` | `docsRef` | `review/residual_band_zeroslack_hostile_review_round1.md` | Provides a pinned review document for residual-band and ZeroSlack questions. | Author/reviewer prose is not verification evidence; formal source evidence and mathematical review remain required. |
| No-hidden minimization | No executable exact-minimization oracle in checked artefacts | `source/checker code` | `sourceRef` | `pcc-gpack0.mjs`; `pcc-local-packages0.mjs`; `pcc-global-proof-dag0.mjs`; `pcc-check-pcc-pack-exp0.mjs`; related tests listed above | Lets reviewers inspect forbidden executable-symbol ledgers and scans according to the source/checker implementation. | Whether macro, alias, template, import, and proof-ref expansion captures every hidden exact-minimization route. |
| Mode firewall | Quotient equality is not full constructive replacement | `source/checker code` | `sourceRef` | `pcc-global-proof-dag0.mjs`; `pcc-local-packages0.mjs`; `test/pcc-global-proof-dag0.test.mjs`; `test/pcc-local-packages0.test.mjs` | Lets reviewers inspect mode-ledger and constructive-firewall implementation surfaces. | Whether every quotient-to-full transfer is mathematically sound and fully covered. |
| PCCPack / `CheckPCCPackexp` | Generated package acceptance boundary | `source/checker code` | `sourceRef` | `pcc-pack-concrete-materialized0.mjs`; `pcc-final-integration-concrete-materialized0.mjs`; `pcc-check-pcc-pack-exp0.mjs`; `pcc-runall0.mjs`; `test/pcc-pack-concrete-materialized0.test.mjs`; `test/pcc-final-integration-concrete-materialized0.test.mjs`; `test/pcc-check-pcc-pack-exp0.test.mjs`; `test/pcc-runall0.test.mjs` | Lets reviewers inspect package coverage, final integration coverage, public-claim boundary, and linkage checks according to the implementation. | Whether the concrete coverage fields correspond to sound proof obligations. |
| Parser, codec, and digest discipline | Canonical bytes and hash-as-index discipline | `source/checker code` | `sourceRef` | `pcc-core.mjs`; `pcc-check-pcc-pack-exp0.mjs` | Lets reviewers inspect core codec/digest surfaces and their use in package checking. | Parser uniqueness, canonical encoding, and digest discipline still require source audit and adversarial testing. Hashes verify byte identity only, not theorem correctness. |
| Final certificate and release gate | Final certificate, release gate, and replay linkage | `source/checker code` | `sourceRef` | `pcc-final-pnp-certificate0.mjs`; `pcc-final-pnp-release-gate0.mjs`; `pcc-final-acceptance-replay0.mjs`; `pcc-final-proof-report0.mjs` | Lets reviewers inspect final-certificate, replay, release-gate, and final-report linkage according to the implementation. | Linkage soundness, checker soundness, and mathematical adequacy remain review tasks. |
| Generated artefact bundle | Proof-report artefact files | `generated artefact` | `artifactRef` | `proof-artifacts/final-pnp-proof-report-hardened-7072f8d/README.md`; `release-seal.json`; `SHA256SUMS`; `SHA256SUMS.sha256`; `validation-summary.json`; `final-pnp-proof-report.summary.json`; `final-pnp-proof-report.full.json` under the bundle path | Provides immutable generated artefact coordinates and file-identity material for the 7072f8d bundle. | Artefact identity does not prove theorem correctness, checker soundness, or mathematical soundness. |

## Reviewer Warning

- `pnplabs` local checks remain smoke tests only.
- `pnp` source/checker validation is still not mathematical acceptance.
- Hashes and seals verify artefact identity only, not theorem correctness.
- Source disclosure and independent inspection are required for source/checker claims.
- The key mathematical review targets remain locked NAND threshold correctness, residual-band exact minimization, no-hidden-minimization discipline, proof-ref soundness, and public theorem boundary discipline.
