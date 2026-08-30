# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 3d2cc2eda40f6dcaa7758e96af14b203f69c55cb
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **All-coordinate Cook-Levin post-header raw launch**, has this scope: For every concrete verifier tableau problem and every natural coordinate, executable Lean orchestration reads the exact shifted remainder from M209's checked raw terminal configuration and conditionally launches M211's fixed positive-width divider. The exact M209 and M211 traces are retained; every M210 body, Finish, and out-of-range result is recovered; every coordinate inside the complete token schedule excludes the out-of-range post-header branch; and the summed compiled work is bounded by one verifier-derived polynomial in the source-input length. All 24 public declarations are axiom-audited with only the approved Lean-standard closure and no project axiom or Classical.choice. M212 adds executable all-coordinate orchestration over the checked reader and divider. It is not a literal raw tape-to-tape bridge, does not preserve the complete builder workspace through such a rewrite, emit or append a Cook-Levin body or Finish token, or complete the raw formula builder or its FunctionProgram.RawRefinement. It does not package the concrete Cook-Levin PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 188 of 190. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
