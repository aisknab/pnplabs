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

### SSH, package, and remote-job preflight

- Before a long remote run, probe the configured identity non-interactively with
  `ssh -o BatchMode=yes -o ConnectTimeout=10 pnpbuilder true`. If the identity is
  missing or locked, ask the user to unlock or add the already-configured key in
  their own terminal. Do not create a KDE Wallet, generate a replacement key,
  rewrite SSH configuration, or repeatedly trigger GUI askpass dialogs.
- Inspect `package.json` and available lockfiles before installing anything. Run
  `npm ci` only when the required lockfile exists and repository documentation
  calls for it. Do not generate a lockfile or install dependencies merely as a
  ritual before the repository's dependency-free verification scripts.
- Use one named remote temporary checkout per verification run. Print the path,
  commit, tree, exit status, and final `systemd-run` resource summary. For verbose
  jobs, retain a full log in that directory and return concise phase markers or a
  useful failure tail so truncated terminal output does not force a rerun.

## Formal-publication sync and deployment sequence

1. Merge the corresponding core `pnp` PR first. Fetch its `origin/main`, then
   synchronize from a clean checkout of the exact core merge commit and tree—not
   from the feature-branch tip.
2. Treat theorem pins, non-claim text, counts, coordinates, page and byte counts,
   and digests as exact generated data. Do not paraphrase or independently retype
   them in fixtures. Stabilize the source, run the generators, and record the
   values they actually emit rather than preselecting expected values.
   Never use an unscoped global replacement for short counts, ordinals, or digest
   fragments: update named structured fields or anchored phrases, then compare
   every changed SHA-256 token with the clean baseline or generated authority.
   When a test reads a complete generated artifact through a child process, size
   its output buffer from the current sealed byte count (or compare files
   directly); inventories grow and stale fixed buffers create false failures.
3. Run source-bound tests with `PNP_SOURCE_DIR` set to that exact core checkout.
   A cross-repository test skipped because `PNP_SOURCE_DIR` is absent is not
   evidence that the source binding passed.
4. Verify in increasing cost order: syntax and targeted tests, source-bound tests,
   the complete remote suite and hostile audits, then a fresh clean-clone
   reproduction. Regenerate the release seal and cover only after the synchronized
   public bytes have stabilized.
   Before the first targeted test, reconcile every generated boundary change
   against the tests and durable workflow assertions that consume it. Compare
   structured fields rather than waiting for a broad test to reveal stale literal
   counts, coordinates, hashes, page totals, or schema keys. Update those expected
   values first, then run the cheapest affected test before escalating to a larger
   suite.
5. Open or update the PR only with the intended durable files. Merge only after
   the normal read-only checks are green. Fetch PNPLabs `origin/main` afterward
   and record its merge commit and tree; the feature tip is not the deployment
   coordinate even when both commits have the same tree.
6. Keep the privileged one-line production deployment user-owned unless the user
   explicitly authorizes otherwise. After deployment, independently run the
   read-only production verifier from a clean checkout of the exact PNPLabs merge
   commit. Confirm provenance, complete public bytes, routes, redirects, headers,
   MIME types, cache policy, denial probes, and release identity.

### Cheap-failure-first publication preflight

- Start from the authoritative generated payload and enumerate every changed
  structured field. Reuse those emitted values in source, documentation, tests,
  and workflow shell assertions; do not independently guess what a consumer
  expects.
- Search both checked-in tests and `.github/workflows/` for every superseded exact
  value before running a broad suite. A renamed workflow step does not update an
  embedded numeric assertion.
- Run syntax checks and the directly affected unit tests immediately after
  updating their fixtures. A mismatch such as 43 expected records versus 44
  generated records belongs in this phase, not at the end of a full audit.
- Treat formatting-only differences in generated prose semantically where the
  contract permits it: normalize line endings and insignificant trailing
  whitespace before comparison. Keep byte-exact checks for sealed artefacts,
  hashes, and generated files whose identity is the contract.
- Before a source-bound audit, enumerate every current and historical ref named
  by `docs/audit_targets.json` and verify it resolves in `PNP_SOURCE_DIR`. Prefer
  a fresh checkout of the exact core merge; stale branch-specific fetch refspecs
  and missing historical tags are preflight failures.
- If any follow-up changes the PR head—even a test or workflow-only correction—
  repeat the exact-head clean-clone reproduction. Earlier clean-clone evidence
  applies only to the commit it checked.
- With a proxy or jump host, probe the complete configured route in batch mode.
  Loading the destination key alone does not prove that the proxy-hop identity is
  available. Never diagnose this by repeatedly opening interactive askpass or
  wallet prompts.

Before switching branches, staging, or committing, inspect `git status`. Treat
pre-existing untracked files as user-owned and exclude them unless the user
explicitly places them in scope. After a PR has merged, fetch `origin/main` and
start follow-up work on a new branch from that merge; do not stack unrelated work
on the already-merged feature branch.

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
