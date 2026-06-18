# Reviewer Guide

This repository is the website and public review package for a claimed proof that `P = NP`. It contains the bundled report, public manifest, checksum ledger, reviewer docs, educational fixtures, and smoke tests.

The complete source/checker repository and pinned release tags are public at https://github.com/aisknab/pnp. No access request is required.

## What local checks establish

Local checks can confirm bundled file identity, educational fixture behaviour, named negative-fixture rejection reasons, and local documentation links. They do not establish theorem correctness.

## Recommended audit order

1. Read the claim boundary and [proof pipeline](proof_pipeline.md).
2. Use the [terminology crosswalk](terminology_crosswalk.md) to map internal names to conventional concepts.
3. Read the [trust model](trust_model.md).
4. Clone the public `pnp` repository, fetch tags, and use the [source/checker map](source_checker_map.md).
5. Audit the SAT-to-locked-NAND reduction and threshold theorem.
6. Audit residual slack, residual-band exact minimisation, and ZeroSlack closure.
7. Audit parser and canonical encoding before relying on later checker records.
8. Audit no-hidden-minimisation coverage, mode-firewall discipline, proof-DAG typing, and import acyclicity.
9. Re-run the pinned source/checker validation and compare accepted theorem fields and central digests.
10. Trace package acceptance through replay, final certificate, release gate, and public theorem output.

## Fast falsification targets

Try to find a reduction failure, a residual-slack counterexample, hidden exact minimisation, an invalid quotient-to-full transfer, parser ambiguity, digest equality used as semantic equality, a proof-DAG cycle, an import cycle, stale package linkage, or a mismatch between accepted records and the public theorem statement.

## Not claimed

Public source availability does not establish mathematical correctness, checker soundness, external consensus, journal acceptance, or theorem validity from hashes or educational fixtures.
