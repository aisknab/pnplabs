# PNP Labs agent instructions

This repository concerns an extraordinary theoretical computer science claim. All changes must prioritize precision, auditability, reproducibility, and conservative wording.

## Public prose style

- Do not publish em dashes on the PNPLabs web surface. Use commas, colons,
  parentheses, or separate sentences instead. The unit test covers raw Unicode
  em dashes and common HTML entities across every public text file.
- The canonical PDF and TeX report aliases are exact synchronized evidence and
  are excluded from this style rewrite. Never alter their bytes merely to satisfy
  a site-copy preference.

## Remote builder policy

Treat the local workstation as an orchestration and source-editing harness, not
as a build or test machine.

- Run all repository processing on the configured remote builder, including
  every Node command, syntax check, test, validator, generator, dependency
  installation, report/PDF build, browser or server operation, deployment
  verification, and clean-clone reproduction. This applies even when a targeted
  command appears small. If a command's resource behaviour is uncertain, run it
  remotely.
- Run heavy remote jobs in a user-level `systemd-run` scope under the configured
  resource limits.
- Never silently fall back to local processing when the remote builder is
  unavailable. Diagnose the connection, notify the user when the stall is
  actionable, and wait or pursue only lightweight source work.
- Limit local commands to source edits and lightweight inspection, such as `rg`,
  `sed`, `git diff`, and `git status`. Do not execute repository source or run
  syntax checks, tests, generators, validators, builds, package-manager commands,
  renderers, or servers locally. Dispatch even targeted execution to the remote
  builder.
- Before starting or resuming a remote phase, confirm that no task-created local
  build, test, generator, renderer, server, or validator process remains active.
- Keep host, proxy, key, and network details in the user's SSH configuration; do
  not copy private connection data into this repository.

### SSH, package, and remote-job preflight

- Before a long remote run, probe the configured identity non-interactively using
  the operator's private SSH configuration. If the identity is
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

### Publication cadence: major milestones and batched updates

Continue verifying and merging core milestones without a website cycle between
smaller results. The agent owns the publish/defer decision. Publish a PNPLabs
update when at least one of these materially changes the public project status:

- A fixed risk-weighted checkpoint changes state.
- A global proof gate, eligible root theorem or publication gate changes state.
- A substantial end-to-end general capability changes the current bottom line,
  such as a complete all-input construction, rather than another local step.
- A previously published claim requires correction, qualification or revocation.

A local lemma, finite fixture, cursor step, conditional sidecar, added evidence
row, test improvement, refactor or accumulated milestone count alone is not a
site-publication trigger. Do not impose an arbitrary every-N-milestones cadence.
A major capability does not receive weighted credit unless a fixed checkpoint
was actually earned under the canonical progress policy.

Record publish/defer and its short rationale in the existing milestone plan or
release notes. Use the core ledger/history to identify pending earned milestones;
do not create a competing progress ledger. When publication is warranted, batch
all pending earned results into one sync from the latest exact verified core
merge, then perform one complete publication-surface audit and release cycle.
While deferring, preserve the coherent published source pin, as-of coordinate and
progress values; validate that release against its pin, not a newer unpublished
core HEAD. Do not mix newer figures into an older published snapshot.

Keep meaningful core milestone and verified submilestone notifications independent
of website cadence. Instructions-only repository changes do not by themselves
trigger site regeneration or deployment. Correct misleading public claims promptly
even when there is no new positive milestone.

Every publication batch requires a full PNPLabs surface audit. This is a
workflow invariant, not a milestone-specific cleanup. Before sealing a release,
reconcile the newest result and its boundary across the homepage (including the
current bottom line), formal status and complete milestone ledger, FAQ and
progress-tracker explanation, updates page/feed/progress graphic, paper and
architecture pages, README, reviewer and audit documentation, source links,
download metadata, browser-rendered status, and negative tests. Preserve the
original coordinates and progress estimates of historical milestone entries.
Current formal artefact coverage and risk-weighted proof completion are separate
measures and must never be presented as interchangeable.

## Proof-progress tracking policy

The authoritative fixed-weight tracker is the core PNP
`status/PROOF_PROGRESS.json`; PNPLabs publishes its exact generated mirror at
`public/pnp-proof-progress.json`. Maintain it under these rules:

1. Call the earned publication-row ratio **formal artefact coverage**, never
   proof completion. New publication rows may change coverage without changing
   proof completion, and the coverage denominator may grow.
2. Every current public proof-completion percentage must be generated from the
   canonical fixed-weight ledger. Do not independently type percentages into
   active pages, reports, tests, or graphics.
3. Keep the checkpoint list and weights fixed. Do not expand or split them to
   award credit for new local milestones.
4. Change the score only when a named checkpoint changes state. Record the exact
   compiled theorem, declaration, status field, or inventory evidence; the source
   coordinate or commit; the load-bearing rationale; what remains open; the old
   and new score; and the uncertainty decision.
5. Finite, local, conditional, supplied-data, certificate-premised, or
   fixed-instance theorems do not earn unconditional checkpoint credit.
6. Award polynomial-runtime credit only for an encoded-input polynomial theorem
   covering the complete construction, its output, and its certificates. Finite
   termination or exhaustive enumeration is insufficient.
7. The score may decrease when an assumption returns, hidden exponential work is
   found, a dependency is invalidated or weakened, or a new load-bearing blocker
   appears.
8. Preserve historical entries and their original coordinates. Label old 98%
   references as superseded scoped-row/editorial estimates, not current proof
   completion, and do not rewrite immutable archives.
9. Reconcile generated active pages, feeds, graphics, documentation, release
   metadata, and tests from the canonical mirror. Keep independent literals only
   for fixed checkpoint contracts and hostile mutations.
10. Every current public update must report formal artefact coverage, the
    risk-weighted estimate, its uncertainty range, and global gates closed as
    separate fields. For every milestone after the tracker baseline, append a
    versioned history review and bind the update to that snapshot even when no
    checkpoint changes and the score stays fixed. Never rewrite the baseline to
    make a later milestone look like the original scoring review.
11. Never alter mathematical claims, theorem statements, proof code, or
    publication rows merely to improve the score.
12. External review may be reported as validation evidence, but it is not a
    mathematical premise and cannot substitute for a formal checkpoint.
13. The risk-weighted score is neither the probability that the route is correct
    nor a delivery or time-remaining estimate.

The current track table, all checkpoint definitions, evidence, limitations, and
score-change record requirements live in the canonical ledger. Validate the
mirror against the status and compiled inventory before generating any active
surface.

Core theorem compilation and formal-evidence generation belong to `pnp`.
PNPLabs must not execute `lean`, `lake`, or `elan`; it verifies exact imported
core bytes and the publication, site, provenance, and deployment contracts.

### Verification economy and evidence reuse

- Treat a green, exact core merge commit and its sealed generated artefacts as
  the proof-verification evidence for PNPLabs. Do not rebuild Lean or rerun the
  core PNP proof, regression, axiom-audit, or npm suites merely because the
  already-verified result is being published on the website.
- Limit PNPLabs checks to the layer this repository adds: exact source binding,
  generated-surface consistency, conservative wording, links, browser/report
  integrity, release provenance, notification transport, and production
  deployment behaviour.
- Match each rerun to the files or generated boundary that changed. Use focused
  syntax and targeted checks while editing, run the complete PNPLabs suite only
  after the publication surface stabilizes, and perform clean-clone reproduction
  once for the exact candidate commit. Do not repeat an unchanged successful
  layer simply as a ritual.
- If orchestration, stale expectations, or environment setup causes a failure,
  correct that boundary and rerun the smallest check that can establish it before
  returning to any broader required gate. A setup failure is not a reason to
  repeat already-green mathematical verification.
- Reopen core verification only when the pinned core commit or relevant core
  artefact bytes changed, the prior evidence is missing, or an identity or
  integrity check exposes a genuine conflict.

### Verification ownership matrix

| Change or boundary | Evidence to run | Evidence to reuse |
| --- | --- | --- |
| PNP proof or dependency change | Changed dependency chain, root, axiom/type inventory, relevant regressions and required core release checks | Checks whose source, inputs, toolchain and boundary are unchanged |
| PNPLabs sync of a verified PNP commit | Exact source binding, mirrored bytes, publication contracts, links, downloads and site behavior | The core Lean build, theorem and axiom audits, and generated proof report |
| PNPLabs presentation or documentation change | Affected site checks and required release checks | Unchanged proof and publication artifacts |
| Verified PR and merge have the same tree | Required checks for the merge, clean checkout identity, source binding and release seals | Expensive checks of the identical tree and unchanged inputs, where the release policy permits |
| Deployment and production | Mandatory launcher checks and independent verification of the exact production release | Prior proof compilation and unchanged development checks |

Record the boundary a repeated check establishes. An unchanged check does not
gain evidence merely by running again; a changed input or deployment environment
can require a new check even when the source tree is identical.

1. Merge the corresponding core `pnp` PR first. Fetch its `origin/main`, then
   synchronize from a clean checkout of the exact core merge commit and tree, not
   from the feature-branch tip.
2. Treat theorem pins, non-claim text, counts, coordinates, page and byte counts,
   and digests as exact generated data. Do not paraphrase or independently retype
   them in fixtures. Stabilize the source, run the generators, and record the
   values they actually emit rather than preselecting expected values.
   Keep the current PDF page total as machine-readable release-integrity
   metadata, not as milestone or progress copy. Do not repeat a literal current
   page total in active website pages, README, or reviewer documentation; verify
   the actual PDF against the canonical release manifest instead. Milestone-facing
   numbers should be decision-relevant: formal artefact coverage, risk-weighted
   progress and uncertainty, global gates, axioms, and publication state.
   Before running affected tests, update the publication-surface contracts to
   consume those stabilized values. Where a current value already has one
   checked-in canonical payload, derive test expectations from that payload
   instead of copying its literal into another fixture. Keep independent literals
   only for invariants and hostile mutations whose purpose is to challenge the
   canonical payload rather than mirror it.
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
   Do not use GitHub auto-merge as a waiting mechanism unless branch protection
   has first been confirmed to require every durable check: with advisory checks,
   auto-merge can merge immediately. Manually wait for every normal check to
   succeed, confirm the head SHA is unchanged, and then merge.
6. Keep the privileged one-line production deployment user-owned unless the user
   explicitly authorizes otherwise. After deployment, independently run the
   read-only production verifier from a clean checkout of the exact PNPLabs merge
   commit. Confirm provenance, complete public bytes, routes, redirects, headers,
   MIME types, cache policy, denial probes, and release identity.
   The reviewed repository deployment policy records the narrow authorization
   expected on the production host. Use only the exact noninteractive command
   emitted by the deployment notification, with the literal verified merge
   commit. If the installed rule is absent or differs, fail closed and request the
   documented one-time installation; never request, retain, or transmit a sudo
   password.

### Progress notifications

- The active notification transport is UnifiedPush. Read its capability URL only
  from `UNIFIEDPUSH_ENDPOINT`; never commit, print, publish, or log that value.
- Send a direct HTTP `POST` to the unchanged configured URL. Put the complete
  notification text in the raw request body and set `Content-Type` to
  `text/plain; charset=utf-8`. Do not send `Content-Encoding`, title/message form
  fields, JSON, ntfy topic paths, ntfy headers, credentials, or fallback delivery.
- A send succeeds only when the receiver returns HTTP 201.
- Delivery is bounded and best effort. Use an approximately ten-second request
  timeout and at most two total attempts, retrying a transient network failure,
  HTTP 429, or HTTP 5xx once with short jittered backoff. A notification failure
  must not invalidate formal work, publication evidence, or a verified release.
- Send only for a fully earned and merged milestone, a fixed checkpoint or global
  gate state change, a revoked result, an actionable blocker, a meaningful long
  validation or release outcome, a verified submilestone that meaningfully
  advances the active plan, or exact root-theorem publication. Coalesce
  related work and deduplicate in the sending workflow.
- Notification wording must obtain the risk-weighted proof estimate from the
  canonical fixed-checkpoint ledger and report formal artefact coverage separately.
  Never claim a score increase unless a named checkpoint changed state. The root
  theorem title is reserved for the exact eligible theorem and passing publication
  gate.
- Sanitise notification text, omit secrets and large diagnostics, and keep the
  final raw UTF-8 body below 3,900 bytes.
- Send the deployment-ready notification only after the PNPLabs PR is merged,
  every durable check is green, the exact merge has passed source-bound and
  clean-clone verification, and `origin/main` resolves to the same commit. Run
  `npm run notify:deployment-ready -- --commit <exact-merge-commit>` from that
  clean checkout with `UNIFIEDPUSH_ENDPOINT` supplied only to the process.
- The deployment-ready message includes the canonical proof estimate, formal
  artefact coverage, global-gate count, exact merge commit and tree, and pinned
  narrow deployment command. A dry run checks message shape only. The separate
  `npm run notify:test:live` command is the only live transport integration test
  and must never run in the normal test suite.

### Source and expectation changes are one changeset

- Before changing a producer, list each affected contract, its test/fixture and
  workflow consumers, and the cheapest positive and negative check. Record this
  in the existing milestone plan or review notes; do not wait for a broad failure
  to discover consumers. Include schema fields, names, diagnostics, claim flags,
  generated values, helper maps, shell assertions, and current public copy.
- Update the producer and every affected expectation in the same patch. Derive
  current values and name mappings from canonical data where possible; preserve
  independent theorem, security, historical, and hostile-mutation invariants.
- When a publication validator changes, reconcile all of the latest-milestone
  mutation cases together: release flags and fingerprints, status flags and
  claims, inventory axioms, and publication-map claims and fingerprints. Keep
  diagnostic categories stable; do not weaken a rejection test to hide drift.
- Run those focused positive and negative cases before the complete suite or
  expensive cross-repository audit. A publication sync is not preflight-ready
  until its latest-milestone mutation test passes. If a broad run reveals a stale
  expectation, audit the entire consumer family before another broad attempt.

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
- For synthetic audit inventories padded to an exact generated candidate count,
  measure the fully assembled fixture before choosing the filler length. Do not
  subtract a milestone's raw pin count: reused theorem names can already occur in
  earlier fixture arrays, so raw pins and globally new candidates can differ.
- Treat formatting-only differences in generated prose semantically where the
  contract permits it: normalize line endings and insignificant trailing
  whitespace before comparison. Keep byte-exact checks for sealed artefacts,
  hashes, and generated files whose identity is the contract.
- Before a source-bound audit, enumerate every current and historical ref named
  by `docs/audit_targets.json` and verify it resolves in `PNP_SOURCE_DIR`. Prefer
  a fresh checkout of the exact core merge; stale branch-specific fetch refspecs
  and missing historical tags are preflight failures.
- If any follow-up changes the PR head, including a test or workflow-only correction,
  repeat the exact-head clean-clone reproduction. Earlier clean-clone evidence
  applies only to the commit it checked.
- Never expand, pad, or transcribe an abbreviated Git SHA by hand. Immediately
  after every commit and push, read the full value with `git rev-parse HEAD` and
  pass that exact captured value to remote checkout and verification commands.
  Make remote setup print and compare the checked commit before any test phase;
  a checkout mismatch is a setup failure, not verification evidence.
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
