# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 3676a3f291193221e4ee3537aaf6023fba95ace0
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **All-route physical body-remainder split**, has this scope: For every concrete verifier problem and every coordinate in its complete post-header schedule, M229 runs M228 without a staged request, route, remainder or success certificate. It preserves the completed Finish endpoint and sends every body route through one fixed 36-rule physical scanner. The scanner crosses the retained clause-count and exterior boundaries, skips consumed-dividend marks, and distinguishes zero from positive remainder by the actual separator or unit symbol. The physical remainder equals the canonical body token coordinate. The collision-free 895-rule graph has exact work, six-for-one compiled execution, one-step-short nonhalting, and a verifier-input-size polynomial bound. All 71 public declarations are axiom-audited: 39 have empty closure, nine use only propext, and 23 use only propext and Quot.sound, with no project axiom or Classical.choice. This milestone reads the physical body remainder but leaves clause occupancy and body-token and padding request synthesis open. Both body outcomes remain incomplete terminal configurations, distinguished by tape content. It does not connect successive schedule configurations, implement the repeated builder loop, prove builder FunctionProgram.RawRefinement, or package the Cook-Levin PolynomialReduction. It does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a fixed checkpoint or global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 205 of 207. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
