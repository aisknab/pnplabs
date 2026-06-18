# Trust Model

This project has several distinct trust boundaries. Reviewers should separate file identity, local fixture behaviour, source/checker reproduction, checker soundness, and mathematical correctness.

## Practical rules

- A SHA-256 match verifies artefact identity only. It does not verify theorem correctness.
- A local fixture check verifies only the small invariant it names. It does not verify the real generated package.
- A successful source/checker run verifies what that implementation checks. It does not prove that the checker is sound.
- Author clarification may resolve ambiguity, but it is not verification evidence.
- Source, release-documentation, and generated-artefact refs are separate provenance boundaries.

## Public repositories

| Repository | Role | What it supports | What it does not establish |
| --- | --- | --- | --- |
| `pnplabs` | Website, bundled report, local file-identity checks, reviewer docs, and educational fixtures. | Public report identity, local fixture behaviour, and audit guidance. | Theorem correctness, full checker execution, or external consensus. |
| [`aisknab/pnp`](https://github.com/aisknab/pnp) | Public source/checker code, release documentation, and sealed generated artefacts. | Independent retrieval, source inspection, pinned-ref reproduction, and implementation-level testing. | Checker soundness, mathematical validity, or community acceptance. |

No access request is required for `aisknab/pnp`. A reviewer can clone it and inspect the pinned refs directly. A local validation command may still skip when no local clone is configured; that is a local-environment condition, not a repository-access restriction.

## Reference boundaries

| Boundary | Ref | Contents |
| --- | --- | --- |
| `sourceRef` | `final-pnp-proof-report-hardened-7072f8d` at `7072f8d0bda6d44d240f9bb3fad624fd357e1278` | Source/checker implementation and source tests. |
| `docsRef` | `final-pnp-proof-report-docs-hardened-7072f8d-sealed` | Reproduction instructions, reviewer map, and release handoff docs. |
| `artifactRef` | `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed` | Generated proof-report bundle, release seal, checksum ledgers, and accepted records. |
| `publicCheckout` | This `pnplabs` checkout | Website files, bundled report, public manifest, docs, fixtures, and smoke tests. |

A file existing at one ref does not prove that it existed, had the same bytes, or carried the same release identifiers at another ref.

## What this checkout can verify

- `npm run verify:seal`: public file byte counts, SHA-256 digests, and manifest/ledger agreement.
- `npm run examples:minimal`: educational fixture pass/fail behaviour.
- `npm run test:negative`: named negative fixture rejection reasons.
- `npm run test:docs`: local Markdown and HTML link targets.
- `npm run test:audit-targets`: pinned cross-repository coordinates when a local `pnp` clone is available.

None of those checks verifies the theorem.

## Claim-critical review boundaries

A serious external review still needs to examine:

1. the SAT-to-locked-NAND reduction and threshold theorem;
2. the residual-slack definition and claimed constant bound;
3. residual-band exact minimisation and ZeroSlack closure;
4. no-hidden-minimisation coverage after expansion;
5. mode-firewall and proof-obligation discipline;
6. parser and canonical-codec uniqueness;
7. digest lookups followed by full-key or canonical-byte comparison;
8. proof-DAG typing, acyclicity, and import boundaries;
9. generated-package, replay, certificate, and release-gate linkage;
10. the final implication from accepted package boundary to `P = NP`.

## Reviewer posture

Treat the report as a claim requiring expert audit. Public source availability improves inspectability and reproducibility, but it is not evidence that the mathematics or checker is correct.
