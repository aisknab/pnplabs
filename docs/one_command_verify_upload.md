# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout a3115c0e42924db4e9c400268d63b942360e71a0
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Source-derived PkgC/BN6 sparse BCEL route and checked conditional ZeroSlack**, composes M201's source-derived PkgC/BN6 cells with M200's checked sparse BCEL/Packet route. It retains exact cancellation, reflects the first nonempty proper singleton/pair activation mismatch to the original source ledger, or reaches conditional ZeroSlack under supplied checked selector silence. The terminal problem, checked finite BCEL-ready certificate, active source systems and cuts, positive payload atoms, typed restorer, realizer table, accepted claims, rank assignment, dependency table, checked HB closure, route-clear result, and selector silence remain explicit supplied inputs. A returned PkgC cancellation or source-ledger activation mismatch is exact proof-bearing evidence, not a verified gain or globally rank-decreasing transition. This does not construct the sources or downstream tables from every valid terminal input, construct upstream BN3 through BN5 data, prove complete PkgC through BN6 route integration, derive blocker semantics or semantic dependency completeness, prove manuscript-wide SaturatePositive or BCELReady, establish unconditional ZeroSlack, construct executable polynomial PCCMin, prove encoded-size polynomial construction, runtime, output-size, or certificate-size bounds, put CNFSAT in P, establish SAT hardness transport, create the eligible root theorem, close a global gate, or prove `P = NP`. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
