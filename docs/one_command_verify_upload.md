# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout b69c7419158154187c2adc6991ebe31aef6538f9
npm ci
lake build PNP
npm run check
npm run pnp:verify -- --no-write
npm run formal:inventory:check
npm run report:check
```

These commands expose current status, rebuild the compiled inventory and generated report, build the pinned Lean `PNP` library root, and audit supporting declarations without separately repeating the authority verifier's regression, axiom-audit, status, public-surface, or legacy-archive checks. `report:check` already checks the formal-publication output. They reproduce the earned concrete `CNFSAT ∈ NP` theorem, literal all-input and sequential compilers, recursive raw-machine refinement, the typed locked-NAND semantic threshold, exact strict codecs, concrete parser/emitter machines and polynomial reductions, the finite residual sequence through typed PkgC restoration, same-key cancellation, exact ambient-BN4-ledger embedding and residual reduction, the finite BN6 packet bridge, the complete finite Packet selector pipeline through conditional gain coverage, the generic finite Packet charge-surplus kernel, the checked unit-charge blueprint realizer, the checked finite Packet typed-realizer contract, exact-rank acyclicity and total-table coverage for a supplied finite HN and budget dependency system, checked active-dependency closure, conditional and executable selector silence, selector-faithfulness routing, canonical faithfulness-table construction, and total acceptance-or-earliest-route classification for every canonical payload. The locked-NAND theorem `PNP.Main.locked_nand_threshold : ReducesTo CNFSAT EncodedLockedNANDThreshold` remains a polynomial many-one reduction, not a polynomial-time target decider or an NP-hardness or NP-completeness result. The newest result proves the canonical payload classifier returns no route exactly on acceptance and an earliest typed route exactly on rejection. Every positive Packet under the canonicalized HB table and accepted executable selector silence exposes a first route without route-clear or binding premises. The grouped family, payload fields, finite rank tags and assignment, exhaustive realizer claims, blocker activity, dependency rows, and rank map remain proof-bearing inputs and are not derived from terminal data. The result does not prove route semantics or decreasing global coverage, positive slack, full external selector compatibility, blocker semantics, semantic dependency completeness, unconditional HB negative closure, encoded-size or runtime bounds, global PkgC, unconditional `ZeroSlack`, PCCMin, or the root theorem. `PNP.Main.p_eq_np` is absent; four project-specific axioms and five blockers remain.

## Freeze controls

- `.github/ISSUE_TEMPLATE/pnp-verification-run.yml` has been removed.
- `.github/workflows/pnp-verification-run-issue-ingest.yml` no longer listens to issue events and has read-only permissions.
- `public/pnp-verification-runs.json` has `intakeFrozen = true`.
- The import tool rejects with `ImportRun.IntakeFrozen` before adding a record.
- The old comparison matrix and summary are labelled historical.
- The summary exposes `currentStatusBadge = false`, a neutral tone, and no current green pass state.

## Historical record boundary

The old prompt, schema, coordinates, and one site-CI seed record are preserved only so previous public behaviour can be audited. Their assertion-bearing content is not current theorem-status evidence or mathematical proof.

External review remains optional audit evidence and is not a mathematical premise or release blocker.
