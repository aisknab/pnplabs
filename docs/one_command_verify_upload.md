# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 2a2c3bdab876d430f462bd357b76d0f2e21fc023
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Candidate-bound PkgC restoration coverage and checked BN6/BCEL route**, has this scope: For every arbitrary finite M205 restoration-coverage source ledger tied to one computed BCEL nucleus, the total classifier preserves the first exact Hall deficit, ambient residual reduction, or no-embedding witness. Only the all-singletonized branch constructs the source-derived BN6 ledger and enters the checked sparse BN6/BCEL Packet/HB classifier, yielding conditional ZeroSlack or one exact small-cut mismatch reflected to the original enriched source activation ledger. The terminal problem, checked BCEL-ready certificate, active PkgC source cells and cuts, restoration-coordinate universes and maps, ambient BN4 ledgers, ranks, claims, dependency table, checked HB closure, route-clear result, and selector silence remain explicit supplied inputs. The candidate binding does not materialize semantically adequate full candidates or derive these objects from every valid terminal input. A Hall deficit is not a verified global gain or rank-decreasing transition, the computed ambient remainder is not proved empty, and ambient incompatibility or source activation mismatch is not a complete global route. This milestone does not finish PkgC/BN3--BN6 integration, derive blocker semantics or semantic dependency completeness, prove manuscript-wide SaturatePositive or BCELReady, establish unconditional ZeroSlack, construct executable polynomial PCCMin, prove complete encoded-size polynomial bounds, put CNFSAT in P, open a global gate, create the eligible root theorem, or prove P = NP. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
