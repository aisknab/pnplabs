# PNP Labs public review package

This repository contains the public website, bundled report, checksum manifest, reviewer documentation, minimal fixtures, and smoke tests for a claimed proof of `P = NP`. It is not evidence of external acceptance or consensus.

## Public source/checker repository

The full source/checker repository is public at https://github.com/aisknab/pnp. No access request is required.

Use the pinned release refs for their separate audit surfaces:

- source/checker: `final-pnp-proof-report-hardened-7072f8d`
- release documentation: `final-pnp-proof-report-docs-hardened-7072f8d-sealed`
- generated artefacts: `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed`

The pinned source commit is `7072f8d0bda6d44d240f9bb3fad624fd357e1278`. Public availability removes the access gate; it does not establish checker soundness, theorem correctness, or mathematical consensus.

## Review status

As of 18 June 2026, Edward Savage is the only contacted reviewer who provided substantive technical feedback. No contacted reviewer has independently confirmed, reproduced, validated, endorsed, or formally rejected the claimed result. See [EXTERNAL_REVIEW_STATUS.md](EXTERNAL_REVIEW_STATUS.md).

## Reviewer entry points

- [Reviewer guide](docs/reviewer_guide.md)
- [Source/checker map](docs/source_checker_map.md)
- [Trust model](docs/trust_model.md)
- [Terminology crosswalk](docs/terminology_crosswalk.md)
- [Reproducibility guide](docs/reproducibility.md)
- [Audit questions](docs/audit_questions.md)

## Local checks

Run `npm test`. These checks cover public file identity, educational fixtures, named negative fixtures, and documentation links. They do not verify the theorem, the mathematical reductions, checker soundness, or generated-package completeness.
