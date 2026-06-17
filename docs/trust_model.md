# Trust Model

This repository is not a single trust decision. It is a public website, report, checksum manifest, reviewer documentation, minimal fixture harness, and smoke-test package for a claimed proof of `P = NP`. A reviewer should separate file identity, local fixture behavior, source/checker reproduction, checker soundness, and mathematical correctness.

The practical rule is:

- A local hash check verifies artefact identity only. It does not verify theorem correctness.
- A local fixture check verifies only the small JSON invariant it names. It does not verify the real generated package.
- A report-stated checker claim is an audit target unless the reviewer obtains and runs the source/checker revision named by the report.

## What This Checkout Can Verify

| Local command or file | Inputs | What it verifies | What it does not verify | Main failure mode |
| --- | --- | --- | --- | --- |
| `npm run verify:seal` | [downloads/release-seal.json](../downloads/release-seal.json), [downloads/SHA256SUMS](../downloads/SHA256SUMS), listed public files | File byte counts, SHA-256 digests, and manifest/ledger agreement for public artefacts. | Theorem correctness, PDF truth, source/checker execution, checker soundness, or semantic equivalence of digest-labelled objects. | Missing file, changed bytes, digest mismatch, malformed ledger, or manifest status no longer saying file identity only. |
| `npm run examples:minimal` | [examples/minimal/*.json](../examples/minimal/) | The educational fixtures accept or reject according to filename intent. | Real `PCCPack` acceptance, the report's checker stack, generated-package completeness, or `P = NP`. | A fixture unexpectedly accepts or rejects. |
| `npm run test:negative` | Negative fixture list in [tests/negative/reviewer-fixtures.test.mjs](../tests/negative/reviewer-fixtures.test.mjs) | Each named negative fixture rejects with the expected local reason. | Completeness of the real checker or correctness of the theorem. | A negative fixture accepts or rejects for the wrong local reason. |
| `npm run test:unit` | Unit tests in [tests/unit/reviewer-fixture-checker.test.mjs](../tests/unit/reviewer-fixture-checker.test.mjs) | A few schema-level local fixture edge cases. | Broad fixture coverage or theorem-level behavior. | Malformed/unknown fixture cases are mishandled. |
| `npm run test:docs` | Markdown and HTML local links | Local link targets exist on disk. | Semantic accuracy, mathematical accuracy, or external URL validity. | A local link target is missing. |
| `npm test` | The commands above plus `npm run repro:smoke` | Aggregated public-checkout smoke status. | Full proof/checker validation. | Any local smoke check fails. |

## External Source/Checker Repository

| Repository | Role | What it verifies | What it does not verify | Audit target |
| --- | --- | --- | --- | --- |
| `pnplabs` | Public website, public file-identity checks, toy fixtures, reviewer documentation, and local smoke tests. | Public report file identity, toy fixture pass/fail behavior, negative fixture rejection reasons, and local documentation links. Hashes verify artefact identity only, not theorem correctness. | Theorem correctness, source/checker soundness, full generated-package acceptance, or mathematical consensus. | This checkout. |
| `pnp` | Source/checker audit target named by the release. | `npm run validate` checks the source/checker package according to its implementation and reported test suite. | External mathematical acceptance, checker soundness beyond what the implementation and tests establish, or community consensus. | `aisknab/pnp@final-pnp-proof-report-hardened-7072f8d:<path>`; see [source_checker_map.md](source_checker_map.md). |

Neither repository by itself establishes external mathematical consensus. A successful `pnp` validation run is an implementation-level reproduction target, not a substitute for reviewing the locked NAND threshold theorem, residual-band minimization route, proof-reference soundness, and public theorem boundary.

## Claim-Critical Boundaries

| Boundary | What must be true for the claim route | Evidence in this checkout | Required external verification | Failure mode |
| --- | --- | --- | --- | --- |
| Mathematical definitions | The formal objects in the report must match the intended complexity-theory objects and not hide stronger assumptions. | Definitions in [downloads/canonical_proof_report.tex](../downloads/canonical_proof_report.tex); crosswalk in [docs/terminology_crosswalk.md](terminology_crosswalk.md). | Independent mathematical review or formalization. | Ambiguous definition, nonstandard size/minimum convention, or definition too strong for the claimed conclusion. |
| SAT-to-locked-NAND reduction | The construction must be polynomial and satisfiability-preserving, and the threshold rule must use the same size/minimum notion as the minimizer. | Report "Locked NAND SAT embedding" and Appendix A; local toy locked-NAND fixture. | Reconstruct the reduction; audit `GPack`, `CheckSATDecision`, and `CheckSATBounds` in the source/checker release. | Incorrect macro, non-polynomial construction, invalid threshold, or framework mismatch. |
| Residual-band minimization | The package must justify polynomial exact minimization for the stated residual band without executable exact search. | Report Package O/PACK sections and [docs/proof_pipeline.md](proof_pipeline.md). | Audit generated rows, bounds, no-hidden-minimization expansion, and package sufficiency in the source/checker release. | Exponential enumeration, hidden minimization, incomplete route coverage, or unsound ZeroSlack closure. |
| Generated package | `GeneratePCCPack()` output must be the same object checked and replayed; the generator itself must not be trusted. | Report names generator and final acceptance/replay fields. | Re-run the named source/checker revision and compare canonical bytes or accepted theorem fields. | Stale package, generator drift, selective output, or replay not tied to generated bytes. |
| Checker implementation | The checker must reject malformed, unsound, cyclic, hash-dependent, mode-unsafe, or hidden-minimization artefacts. | Only the local educational fixture checker is present. | Read and test the full source/checker implementation; build independent checkers where feasible. | Unsound accept, unchecked proof blob, invalid reflection, import cycle, or nondeterministic checker output. |
| Parser and canonical codec | Accepted bytes must have unique typed parses and unique canonical encodings; all top-level parses must consume all bytes. | Report "Concrete Codec_0 and Digest_0"; toy parser digest check in fixtures. | Fuzz and audit `Parse0`, `Encode0`, `NFSerialize0`, and digest use in the source/checker release. | Multiple parses, multiple encodings, trailing bytes, noncanonical integers/names, or digest-labelled semantic equality. |
| Hash and seal discipline | Hashes must identify bytes only and must not be used as theorem evidence or object equality. | Local seal verifier and manifest status explicitly say file identity only. | Audit every source/checker digest lookup for full-key or canonical-byte comparison after lookup. | Digest equality is treated as semantic equality, or docs imply hash match proves theorem correctness. |
| Final certificate and release gate | Accepted package, acceptance run, replay, final certificate, release audit, release gate, and public theorem fields must be linked by checked records. | Report final proof-report section lists accepted fields and digests. | Trace final certificate and release-gate records in the source/checker artefacts. | Public theorem emitted without linked accepted records, or accepted fields differ from the report. |
| Reproducibility environment | The named source/checker revision must be obtainable and runnable in a controlled environment. | [docs/reproducibility.md](reproducibility.md) records public-checkout and source/checker boundaries. | Fresh clone of the source/checker release; run documented validation; compare accepted fields and central digests. | Source unavailable, build non-deterministic without explanation, validation fails, or theorem fields change. |
| Public website and report wording | The site must not imply external acceptance, consensus, or theorem validation by local hash/fixture checks. | README and docs in this checkout. | Skeptical wording review. | Promotional wording, stronger claim than report boundary, or omitted trust limitations. |

## Checker Claims And Non-Claims

Local checker claims in this checkout:

- [tools/verify-release-seal.mjs](../tools/verify-release-seal.mjs) verifies byte count, SHA-256 digest, and manifest/ledger agreement for listed public files. It does not verify theorem correctness, PDF contents, or source/checker regeneration.
- [tools/reviewer-fixture-checker.mjs](../tools/reviewer-fixture-checker.mjs) verifies toy JSON fixture invariants: fixture schema/version, NAND truth table shape, residual-slack arithmetic, forbidden minimization tokens in toy executable rows, mode-firewall flags, ZeroSlack closure flag, SHA-256 payload identity, and source/certificate digest linkage. It does not verify the mathematical proof, PCC-K soundness, generated package completeness, or the real `CheckPCCPackexp0` implementation.
- [tools/check-doc-links.mjs](../tools/check-doc-links.mjs) verifies that local Markdown/HTML link targets exist. It does not verify external links or document truth.

Report-stated checker claims that are not executable from this checkout:

- `CheckPCCPackexp0` is reported to validate the generated `PCCPack0`, package coverage, final integration coverage, public-claim boundary, and package linkage.
- `CheckAcceptRun0` and `ReplayAcceptRun0` are reported to validate and replay the acceptance run using canonical bytes.
- `CheckFinalPNPCertificate0`, `CheckFinalPNPReleaseGate0`, and `CheckFinalPNPProofReport0` are reported to link the accepted package, replay, certificate, release audit, release gate, and public theorem fields.
- `CheckGPack`, `CheckFinalFrameworkMatch_exp`, `CheckNoHiddenMin0`, `CheckModeUse0`, `CheckHashProtocol`, `CheckGlobalProofDAG`, and related package checkers are audit targets described by the report; their full implementations are not present in this repository.

## Hashes And Seals

A SHA-256 match confirms only that local bytes match a named digest in the relevant manifest. It does not confirm:

- that the theorem is correct;
- that the checker is sound;
- that the PDF faithfully reports source/checker records;
- that the source/checker revision was run;
- that a digest-labelled object has the expected semantics.

The report states a stronger internal hash discipline for source/checker artefacts: digest lookup must be followed by full-key or canonical-byte comparison. This checkout can check only the public file-identity seal, so the source/checker hash discipline remains a high-priority external audit target.

## Reviewer Posture

Treat the public report as a claim requiring expert audit. A useful review can refute or weaken the claim at any layer: mathematics, reduction, residual-band minimization, checker implementation, parser/codec, hash discipline, replay linkage, reproducibility, or public wording. The local smoke tests improve audit hygiene, but they are not proof evidence for `P = NP`.
