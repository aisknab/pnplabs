# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 385df6cc15cf963a19c2ec5ea96b2e22fcbe76b9
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Family-level PkgC restoration coverage and exact BN6 ledger cellization**, has this scope: For every arbitrary finite supplied active PkgC source ledger with per-source restoration and ambient BN4 data, the list-order classifier either proves all source systems singletonized and constructs the complete BN6 positive-cell ledger with exact length, payload order and all-cut activation conservation, or retains the first exact source-member Hall deficit, computed ambient reduction, or no-embedding witness. The active PkgC source cells and cuts, positive payload atoms, per-source restoration-coordinate universes and maps, full-restoration coordinate lists, and ambient BN4 ledgers remain explicit supplied inputs. Complete coordinate coverage does not materialize semantic full candidates or derive restoration adequacy. A Hall deficit is not a verified gain or globally rank-decreasing transition, the computed remainder is not proved empty, and no-embedding is not a complete global route. This milestone does not derive the source ledger or restoration and ambient data from every valid terminal input, complete PkgC/BN3--BN6 integration, derive blocker semantics or semantic dependency completeness, prove manuscript-wide SaturatePositive or BCELReady, establish unconditional ZeroSlack, construct executable polynomial PCCMin, prove complete encoded-size polynomial bounds, put CNFSAT in P, open a global gate, create the eligible root theorem, or prove P = NP. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
