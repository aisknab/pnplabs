# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 71199826f380c39fa59796f0d9025651e34e1fe0
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Full-classifier Cook-Levin Finish-request cell**, has this scope: For every concrete verifier problem and arbitrary protected builder workspace, the canonical Finish coordinate is derived internally. M220's full 711-rule classifier has its terminal verdict names swapped without changing transition semantics, then is chained through one fixed launch table to M219's one-cell writer as a collision-free 721-rule machine. The classifier reaches the end marker, the writer changes exactly that focused cell to M217's Finish request while preserving the rest of the tape, and exact work, six-for-one compiled execution, one-step-short nonhalting and one source-size polynomial bound are proved. All 36 public declarations are axiom-audited: nine have empty closure, three use only propext, and 24 use only propext and Quot.sound, with no project axiom or Classical.choice. This milestone connects only the unique canonical Finish terminal of the full physical classifier to one literal M217-compatible request cell. It does not derive body-token or padding request symbols, orient the preserved workspace for the dispatcher, run M217 from the M220 endpoint, iterate one literal raw-machine schedule loop, construct the complete raw formula builder or its FunctionProgram.RawRefinement, or package the concrete Cook-Levin PolynomialReduction. It does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a fixed checkpoint or global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 197 of 199. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
