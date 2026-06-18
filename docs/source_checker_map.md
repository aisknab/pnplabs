# Source/Checker Map

The source/checker repository is public at https://github.com/aisknab/pnp. No access request is required.

Use the ref matching the audit surface:

| Class | Ref | Commit | Purpose |
| --- | --- | --- | --- |
| `sourceRef` | `final-pnp-proof-report-hardened-7072f8d` | `7072f8d0bda6d44d240f9bb3fad624fd357e1278` | Source/checker code and tests. |
| `docsRef` | `final-pnp-proof-report-docs-hardened-7072f8d-sealed` | `3ba356c79b545d2c734283bf10d85d0710de2b60` | Reproduction and reviewer docs. |
| `artifactRef` | `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed` | `9d1de19f827e5cb6880741352eb2349cbbb45994` | Generated records, seal, and checksums. |
| `publicCheckout` | this `pnplabs` tree | current checkout | Website, bundled report, manifest, docs, and fixtures. |

The canonical coordinate manifest is [`downloads/source-checker-release.json`](../downloads/source-checker-release.json). It identifies the release but does not verify the theorem.

Clone the public repository, fetch tags, and set `PNP_SOURCE_DIR` to the local clone before running `npm run test:audit-targets`. A local skip means the clone was not configured; it does not mean permission is required.

Primary review targets remain the locked-NAND threshold, residual-band exact minimisation, no-hidden-minimisation coverage, parser and digest discipline, proof-DAG soundness, package acceptance, final replay/certificate linkage, and the final mathematical implication.

Public source disclosure removes an access barrier. It does not establish checker soundness, mathematical validity, or external consensus.
