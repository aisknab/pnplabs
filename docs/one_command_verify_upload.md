# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 171a90983820e1c6bba2fcf85203843b4bd3f5da
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Computed PkgC ambient-BN4 extraction and checked source-route composition**, computes an exact ambient remainder for arbitrary finite supplied active PkgC sources and arbitrary finite supplied ambient BN4 ledgers tied to the same checked BCEL nucleus. Constructive remove-first recursion preserves duplicate occurrences in arbitrary ambient order. The route returns either that computed remainder with an exact multiset embedding and complete residual-ledger reduction, or a required generated cancellation cell with proof that no exact remainder embedding exists; it then constructs the candidate BN4 kernel internally and preserves M202's conditional ZeroSlack and source-activation mismatch branches. The terminal problem, checked finite BCEL-ready certificate, active source systems and cuts, positive payload atoms, typed restorer, ambient ledger, realizer table, accepted claims, rank assignment, dependency table, checked HB closure, route-clear result, and selector silence remain explicit supplied inputs. The computed residual reduction does not prove its remainder empty or contradict a surviving residual, and a no-embedding result is a compatibility failure rather than a verified gain or globally rank-decreasing transition. This does not derive the ambient ledger or sources from every valid terminal input, construct upstream BN3 through BN5 data, prove complete PkgC through BN6 route integration, derive blocker semantics or semantic dependency completeness, prove manuscript-wide SaturatePositive or BCELReady, establish unconditional ZeroSlack, construct executable polynomial PCCMin, prove encoded-size polynomial construction, runtime, output-size, or certificate-size bounds, put CNFSAT in P, establish SAT hardness transport, create the eligible root theorem, close a global gate, or prove `P = NP`. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
