# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 752be777ca2c366aa16bb8ff4bf9120a984f25b6
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **First-body separator physical dispatch**, has this scope: For every concrete verifier problem, M224 derives first-body coordinate zero and its canonical separator entry, runs the complete 711-rule classifier through the populated-body terminal, crosses the positive unary clause-count suffix with a fixed two-rule request writer, reorients the protected builder workspace with a fixed ten-rule scanner, and executes M223's reflected 64-rule dispatcher. One collision-free 814-rule machine reaches the exact canonical prefix ending in the first clause separator, with exact work, six-for-one compiled execution, one-step-short nonhalting and one source-input-size polynomial bound. All 121 public declarations are axiom-audited: 53 have empty closure, one uses only propext, and 67 use only propext and Quot.sound, with no project axiom or Classical.choice. This milestone closes only the first populated full-classifier body route. It does not select arbitrary body tokens, derive padding requests, connect every classifier outcome, connect successive schedule configurations, implement one repeated raw-machine builder loop, prove builder FunctionProgram.RawRefinement, or package the Cook-Levin PolynomialReduction. It does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a fixed checkpoint or global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 200 of 202. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
