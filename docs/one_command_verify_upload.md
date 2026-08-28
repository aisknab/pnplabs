# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout a08ab544b3d609ffd1793227635a9ac7a18394a4
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **PkgC restoration coverage, exact Hall route, and computed ambient BN4 reduction**, removes the always-total supplied typed-restorer premise at this local consumer boundary. For every arbitrary finite supplied consumer system, restoration-coordinate universe, quotient map, full-restoration coordinate lists, and ambient BN4 ledger, the exact-coordinate classifier returns singletonization, the first proof-bearing Hall deficit with its qRestorationHall route, or complete coordinate coverage. In the coverage branch it constructs one balanced opposite-sign BN4 unit pair for every canonical quotient unit, then uses M203's arbitrary-order exact extractor to return the computed ambient remainder and complete residual-ledger equality or prove that no exact embedding exists. The consumer system, finite restoration-coordinate universe, quotient coordinate map, full-restoration coordinate lists, and ambient BN4 ledger remain explicit supplied inputs. Complete coordinate coverage is equality-fibre multiplicity evidence and does not materialize semantic full candidates or prove restoration adequacy. A Hall deficit is an exact local qRestorationHall route, not a verified gain or globally rank-decreasing transition. The computed residual reduction does not prove that the remainder is empty, and no-embedding is a compatibility failure rather than a complete global route. This milestone does not derive the restoration universe or ambient ledger from every valid terminal input, complete PkgC/BN3 through BN6 integration, derive blocker semantics or semantic dependency completeness, prove manuscript-wide SaturatePositive or BCELReady, establish unconditional ZeroSlack, construct executable polynomial PCCMin, prove complete encoded-size polynomial bounds, put CNFSAT in P, open a global gate, create the eligible root theorem, or prove `P = NP`. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
