# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout c674c21b994284cdf6df40b43bf1a22920d0ec98
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **All-coordinate physical Cook-Levin classifier pipeline**, has this scope: For every concrete verifier problem, every canonical post-header coordinate and arbitrary protected builder workspace, one fixed collision-free 711-rule machine composes M213's router-to-divider bridge, M211's divider, M214's divider-to-comparator bridge and comparator, and three fixed launch transitions. Three exact physical tape handoffs preserve the workspace suffix, the final raw state agrees with M214's typed body-or-Finish semantics, and exact work, six-for-one compiled execution, one-step-short nonhalting, component decomposition and one source-size polynomial bound are proved. All 63 public declarations are axiom-audited: 44 have empty closure, four use only propext, and 15 use only propext and Quot.sound, with no project axiom or Classical.choice. This milestone physically composes the complete suffix-preserving classifier pipeline for every canonical post-header coordinate. It does not derive body-token or padding request symbols, connect the resulting body or Finish classification to M217's request dispatcher, iterate one literal raw-machine schedule loop, construct the complete raw formula builder or its FunctionProgram.RawRefinement, or package the concrete Cook-Levin PolynomialReduction. It does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a fixed checkpoint or global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 196 of 198. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
