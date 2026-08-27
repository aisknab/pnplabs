# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout e0d08b9d0f294b64d41035125ce0dab1ee6188d8
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **PkgC same-key cancellation or derived BN6 positive cellization**, classifies every finite list of supplied active V54 consumer systems over one carrier into the first exact same-key PkgC cancellation realization or an all-singletonized branch. That branch derives the raw BN6 supports and support-size facts from the active consumer data, preserves payload order, and proves exact activation-weight conservation on every cut. The terminal problem, source systems, active cuts, positive payload atoms, typed restorer, upstream BN3 through BN5 construction, checked BCEL/Packet integration, and complete encoded-size bounds remain supplied or open. A returned cancellation is proof-bearing local PkgC evidence, not a verified gain or globally decreasing transition. This does not prove manuscript-wide SaturatePositive or BCELReady, complete PkgC through BN6 integration, construct executable PCCMin, prove unconditional ZeroSlack or encoded-size polynomial runtime, supply a target decider or SAT NP-hardness transport, or create the root theorem. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
