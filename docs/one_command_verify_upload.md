# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 8529753cac12243c0a618facfca31e2287368469
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Uniform Cook-Levin arbitrary-slot header router**, has this scope: For every concrete polynomial-time verifier and every coordinate below its complete direct token schedule, one fixed 54-rule deterministic work machine compares the coordinate with the exact problem-derived first-body boundary. Its exact trace accepts precisely the header branch and rejects equality or the post-header branch. The semantic route is definitionally faithful to formulaTokenSlotDirect; the compiled execution is bounded by the verifier-derived polynomial 36 * terminalSlotPolynomial^2; one-step-short fuel and malformed symbols remain timeout. All 51 public declarations are axiom-audited with only the approved Lean-standard closure and no project axiom or Classical.choice. M209 is the first uniform arbitrary-coordinate raw routing layer, but it routes only the top-level header boundary. It does not decode the post-header quotient and remainder into a clause and within-clause token slot, emit a body token, complete the raw formula builder or its FunctionProgram.RawRefinement, package the concrete Cook-Levin PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 185 of 187. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
