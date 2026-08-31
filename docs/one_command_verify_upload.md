# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 1f749eec50cb57c0595b1fa1e8dfc8ccd497c2e8
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Literal Cook-Levin post-divider raw route classifier**, has this scope: For every concrete verifier tableau problem, arbitrary safe exterior prefix and builder workspace, and in-range coordinate, one fixed collision-free 180-rule bridge consumes the exact M213 equality or greater-than divider-terminal tape, copies the exact problem-derived clause count from a restored sidecar, preserves the complete exterior and remainder ledger, and constructs a shielded M209 comparison input from the literal quotient marks. Exact bridge and comparator traces cannot cross their boundaries, compile at six raw steps per work step, time out one step short, agree with every M210 body or Finish route, and fit one verifier-derived source-size polynomial. All 85 public declarations are axiom-audited with only the approved Lean-standard closure and no project axiom or Classical.choice. M214 closes the literal post-divider body-versus-Finish route-classification handoff only. It does not inspect, select, emit, or append a Cook-Levin token, iterate the complete token schedule, complete the raw formula builder or its FunctionProgram.RawRefinement, or package the concrete Cook-Levin PolynomialReduction. It does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a fixed checkpoint or global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 190 of 192. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
