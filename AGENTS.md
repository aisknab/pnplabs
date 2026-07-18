# PNP Labs agent instructions

This repository concerns an extraordinary theoretical computer science claim. All changes must prioritize precision, auditability, reproducibility, and conservative wording.

## Remote builder policy

The local workstation is memory-constrained. Treat it as an edit-and-inspection
host, not as a build host.

- Run full or clean builds, test suites, broad audits, report/PDF generation,
  deployment verification, and clean-clone reproduction on the configured SSH
  host alias `pnpbuilder`.
- Run heavy remote jobs under the `pnp-builder` account's user-level
  `systemd-run` resource limits.
- Never silently fall back to a heavyweight local command when the remote builder
  is unavailable. Stop and report the connection problem instead.
- Limit local commands to source edits and lightweight inspection, such as `rg`,
  `sed`, `git diff`, `git status`, and targeted syntax checks.
- Keep host, proxy, key, and network details in the user's SSH configuration; do
  not copy private connection data into this repository.

Rules:

1. Do not strengthen the mathematical claim.
2. Do not imply external acceptance or consensus.
3. Do not use promotional language.
4. Prefer standard complexity-theory and formal-methods terminology before internal terminology.
5. When using internal terminology, define it precisely and link to its canonical definition.
6. Every checker claim must say exactly what the checker verifies and what it does not verify.
7. Every hash/seal claim must state that hashes verify artefact identity only, not theorem correctness.
8. Every new proof-system term needs:
   - formal definition,
   - minimal example,
   - enforcing code path,
   - failure mode,
   - relation to standard concepts.
9. Add negative tests for every invariant whenever possible.
10. When modifying docs, preserve a skeptical reviewer’s viewpoint.
11. When modifying code, preserve semantics unless a concrete bug is found.
12. At the end of each task, report:
   - files changed,
   - tests run,
   - commands used,
   - assumptions discovered,
   - remaining risks.
