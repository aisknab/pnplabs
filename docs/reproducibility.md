# Reproducibility

This guide separates website-level checks from source/checker reproduction.

## Website checks

Run `npm test` with Node.js 20 or newer. These checks cover bundled file identity, educational fixtures, named negative fixtures, smoke behaviour, and local documentation links. They do not run the theorem-level checker stack.

A digest match verifies file identity only.

## Public source/checker

The source/checker repository is public at https://github.com/aisknab/pnp. No access request is required.

Pinned refs:

- `final-pnp-proof-report-hardened-7072f8d` for source/checker code;
- `final-pnp-proof-report-docs-hardened-7072f8d-sealed` for reproduction and reviewer docs;
- `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed` for generated records, seal, and checksums.

Clone the public repository, fetch tags, verify the artefact-tag checksum ledgers, then check out the source tag and run `npm ci` followed by `npm run validate`.

The result to compare is not merely a PDF hash. Reviewers should compare accepted theorem fields, package/replay/certificate linkage, and central canonical-byte digests.

A missing local `pnp` directory means the public repository has not been cloned locally; it is not an access restriction. Successful reproduction is implementation-level evidence only, not external mathematical acceptance.
