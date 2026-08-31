# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 5278e27d3ecbfde4ef6d635552ab687c08a9b12d
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Physical Cook-Levin optional-token dispatch**, has this scope: For every raw input, arbitrary exterior workspace, emitted prefix, and optional token request, one fixed collision-free 64-rule machine reads one of five physical request symbols, restores the canonical builder left boundary, and either accepts without changing padding output or enters the existing renamed 59-rule token appender. Exact work and six-for-one compiled traces, one-step-short nonhalting, malformed blank-request timeout, canonical scheduleEntry specialization at every post-header coordinate, and one verifier-derived source-size polynomial are proved. All 49 public declarations are axiom-audited: 23 have empty closure, 13 use only propext, and 13 use only propext and Quot.sound, with no project axiom or Classical.choice. M217 physically dispatches a supplied tape-resident padding or CNF-token request into the existing fixed appender. It does not derive that request from M214's raw coordinate classifier, connect the classifier output directly to this request cell, iterate one physical selector/dispatcher loop through the complete token schedule, construct the complete raw formula builder or its FunctionProgram.RawRefinement, or package the concrete Cook-Levin PolynomialReduction. It does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a fixed checkpoint or global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 193 of 195. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
