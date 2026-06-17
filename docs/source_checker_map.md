# Source/Checker Map

## Purpose

`pnplabs` is the public website, public artefact-identity, smoke-test, and reviewer-documentation checkout. It does not contain the full source/checker implementation named by the bundled report, and it cannot execute the theorem-level checker stack.

`pnp` is the source/checker repository named by the report. This file maps public-review terms in `pnplabs` to source/checker audit targets in `pnp`, without copying checker logic into this public website checkout.

Unless noted otherwise, every source/checker path below means:

```text
source/checker audit target: aisknab/pnp@final-pnp-proof-report-hardened-7072f8d:<path>
```

## Canonical Release Identifiers

These identifiers are populated from `../pnp/CURRENT_RELEASE.md`, `../pnp/REPRODUCE.md`, and `../pnp/REVIEWER_MAP.md`.

| Field | Value |
| --- | --- |
| Source repo | `aisknab/pnp` |
| Source tag | `final-pnp-proof-report-hardened-7072f8d` |
| Source commit | `7072f8d0bda6d44d240f9bb3fad624fd357e1278` |
| Artifact tag | `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed` |
| Docs tag | `final-pnp-proof-report-docs-hardened-7072f8d-sealed` |
| Artifact bundle path | `proof-artifacts/final-pnp-proof-report-hardened-7072f8d/` |
| Validation status | `1121 tests, 1121 pass, 0 fail, 0 cancelled` |
| Theorem boundary | `CheckPCCPackexp(GeneratePCCPack())=accept => P = NP` |

## Source/Checker Audit Map

| Review area | Public term | Source/checker files in `pnp` | Tests in `pnp` | What the checker appears to check | What still requires mathematical review | `pnplabs` local status |
| --- | --- | --- | --- | --- | --- | --- |
| Public theorem boundary | `CheckPCCPackexp(GeneratePCCPack())=accept => P = NP` | `CURRENT_RELEASE.md`; `REPRODUCE.md`; `REVIEWER_MAP.md`; `pcc-check-pcc-pack-exp0.mjs`; `pcc-runall0.mjs`; `pcc-final-proof-report0.mjs` | `test/pcc-check-pcc-pack-exp0.test.mjs`; `test/pcc-runall0.test.mjs` | The source/checker path appears to check that the public conclusion is conditional on accepted `CheckPCCPackexp0` output, that `RunAll0` includes and executes `CheckPCCPackexp0`, and that final public fields match the stated antecedent and consequent. It does not by itself check that the mathematical implication is sound. | Whether accepted package sufficiency really entails `P = NP`; whether the final theorem extraction uses standard complexity-theory assumptions correctly; whether the public boundary is mathematically valid rather than only consistently represented. | Not executable from this checkout. Local docs and smoke tests only preserve the public boundary wording. |
| Locked NAND | Locked NAND threshold construction | `pcc-gpack0.mjs`; `pcc-global-proof-dag0.mjs`; `REVIEWER_MAP.md`; `review/locked_nand_threshold_hostile_review_round1.md` | `test/pcc-gpack0.test.mjs`; `test/pcc-global-proof-dag0.test.mjs` | The source/checker path appears to check code-level fields and proof references including `CheckGPack0`, `CheckRowFamG0`, `BaselineDerivation0`, `TraceDerivation0`, `ThresholdDerivation0`, `G.BaselineCert.proof`, `G.TraceCert.proof`, and `G.ThresholdCert.proof`, including linkage from `Package.G.LockedNANDThreshold` to the threshold proof node. It does not independently establish that the locked construction is a correct SAT-hard reduction. | Correctness of the locked NAND threshold theorem, baseline and trace derivations, satisfiability preservation, polynomial-size construction, and size/minimum convention alignment. | Only toy locked-NAND fixture checks are local; they do not validate `GPack` or the threshold theorem. |
| Residual slack / ZeroSlack / residual-band minimization | Residual-band exact minimization and terminal ZeroSlack closure | `pcc-local-packages0.mjs`; `pcc-global-proof-dag0.mjs`; `REVIEWER_MAP.md`; `review/residual_band_zeroslack_hostile_review_round1.md`; `review/hostile_review_checklist_7072f8d.md` | `test/pcc-local-packages0.test.mjs`; `test/pcc-global-proof-dag0.test.mjs` | The source/checker path appears to expose audit targets for `O.ZeroSlackOracle`, `ResidualBandExactMinimization`, `Package.O.ZeroSlackOracle`, `NormalizeOrGain`, `PCCOracle`, `HResolve`, `BudgetResolve`, and `ZeroSlack`. It appears to check named package/DAG obligations and closure fields, but it does not by itself prove that every positive-residual case is covered. | Soundness of the residual-band minimization theorem; whether `ZeroSlack` excludes all positive residual slack; whether the oracle route is complete and polynomial without hidden exact minimization. | Local residual-slack and ZeroSlack fixtures check only small arithmetic and closure flags. |
| No-hidden minimization | No executable exact-minimization oracle in checked artefacts | `pcc-gpack0.mjs`; `pcc-local-packages0.mjs`; `pcc-global-proof-dag0.mjs`; `pcc-check-pcc-pack-exp0.mjs` | `test/pcc-gpack0.test.mjs`; `test/pcc-local-packages0.test.mjs`; `test/pcc-global-proof-dag0.test.mjs`; `test/pcc-check-pcc-pack-exp0.test.mjs` | The source/checker path appears to check forbidden executable-symbol ledgers and scans using `GPACK_FORBIDDEN_EXEC_SYMBOLS0`, `LOCAL_PACKAGE_FORBIDDEN_EXEC_SYMBOLS0`, `GLOBAL_DAG_FORBIDDEN_EXEC_SYMBOLS0`, and `validateNoHiddenExecutableMin0`; `CheckNoHiddenMin0` is also named in source/checker code. It does not prove that the symbol policy captures every mathematically equivalent hidden minimization route. | Whether macro, alias, template, import, and proof-ref expansion is complete; whether any exact minimization is smuggled through terminology, proof assumptions, or non-executable certificates. | Local negative fixtures use an illustrative regex-style toy scan only. |
| Mode firewall | Quotient equality is not full constructive replacement | `pcc-global-proof-dag0.mjs`; `pcc-local-packages0.mjs`; `review/hostile_review_checklist_7072f8d.md` | `test/pcc-global-proof-dag0.test.mjs`; `test/pcc-local-packages0.test.mjs` | The source/checker path appears to check `Mode.Firewall`, `ModeLedger`, `quotientNotReplacement`, and `constructiveFirewall` fields, rejecting records where quotient-mode information is used as full constructive replacement without the required firewall discipline. It does not prove that the mathematical quotient/full-mode relation is sound. | Whether every constructive replacement has a valid full-mode lift and discharged obligations; whether quotient abstractions preserve the exact information needed for the theorem. | Local mode-firewall fixtures check only small flags and obligation counts. |
| PCCPack / CheckPCCPackexp | Generated package acceptance boundary | `pcc-pack-concrete-materialized0.mjs`; `pcc-final-integration-concrete-materialized0.mjs`; `pcc-check-pcc-pack-exp0.mjs`; `pcc-runall0.mjs` | `test/pcc-pack-concrete-materialized0.test.mjs`; `test/pcc-final-integration-concrete-materialized0.test.mjs`; `test/pcc-check-pcc-pack-exp0.test.mjs`; `test/pcc-runall0.test.mjs` | The source/checker path appears to check `CHECK_PCC_PACK_EXP_REQUIRED_COVERAGE_FIELDS0`, `CheckPCCPackexp0`, `CheckConcreteMaterializedPCCPack0`, `publicConclusionOnlyAfterAcceptRun`, `finalTheoremGLinkageComplete`, `finalIntegrationGlobalGLinkageComplete`, and `globalProofDAGHasGThresholdProofNode`. It checks concrete coverage/linkage fields according to the implementation; it does not prove the linked mathematical lemmas are true. | Whether concrete coverage fields correspond to sound proof obligations; whether generated-package acceptance is sufficient for the claimed theorem; whether checker coverage can be independently formalized. | No theorem-level `PCCPack` checker is local. The local fixture `pccpack` object is educational only. |
| Reproduction | Sealed artefact identity and source/checker validation run | `REPRODUCE.md`; `proof-artifacts/final-pnp-proof-report-hardened-7072f8d/release-seal.json`; `proof-artifacts/final-pnp-proof-report-hardened-7072f8d/SHA256SUMS`; `proof-artifacts/final-pnp-proof-report-hardened-7072f8d/SHA256SUMS.sha256` | Commands: `git checkout final-pnp-proof-report-artifacts-hardened-7072f8d-sealed`; `sha256sum -c "$BUNDLE/SHA256SUMS"`; `sha256sum -c "$BUNDLE/SHA256SUMS.sha256"`; `git checkout final-pnp-proof-report-hardened-7072f8d`; `npm ci`; `npm run validate` | The checksum commands verify artefact identity only, not theorem correctness. `npm run validate` checks the source/checker package according to the implementation and reported test suite; it is not external mathematical acceptance. | Independent reproduction from a clean clone; checker soundness; mathematical validity of the reduction, minimization route, proof references, and public theorem boundary. | Local `npm test` is a website smoke test and does not run the source/checker validation suite. |

## Reviewer Warning

- `pnplabs` local checks remain smoke tests only.
- `pnp` source/checker validation is still not mathematical acceptance.
- Hashes and seals verify artefact identity only, not theorem correctness.
- The key mathematical review targets remain locked NAND threshold correctness, residual-band exact minimization, no-hidden-minimization discipline, proof-ref soundness, and public theorem boundary discipline.
