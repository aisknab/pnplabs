# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 79d36936abf796a3f306cede1b762aabc6907cd2
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **All-route derived-Finish physical request split**, has this scope: For every concrete verifier problem and every coordinate in its complete post-header schedule, M228 runs M226's terminal-joined classifier without a staged request cell. A fixed 20-rule relay reads the physical body-or-Finish terminal, crosses the exact blank-free classifier prefix, writes a collision-free body-pending marker for every body route, and writes the canonical Finish request only for the unique Finish route. A fixed 65-rule conditional reflected dispatcher rejects the body-pending marker and sends Finish to the exact next canonical emitted prefix. The collision-free 823-rule composition has exact work, six-for-one compiled, one-step-short and source-input-size polynomial evidence. All 91 public declarations are axiom-audited: 50 have empty closure, 18 use only propext, and 23 use only propext and Quot.sound, with no project axiom or Classical.choice. This milestone derives only the unique Finish request. Every body route halts at an explicit non-request pending marker; body-token and padding request synthesis remain open. It does not connect successive schedule configurations, implement one repeated raw-machine builder loop, prove builder FunctionProgram.RawRefinement, or package the Cook-Levin PolynomialReduction. It does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a fixed checkpoint or global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 204 of 206. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
