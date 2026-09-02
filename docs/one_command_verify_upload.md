# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout e792920a9ab18bdc22fae8cd090d792255889437
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Full-classifier Cook-Levin Finish-workspace orientation**, has this scope: For every concrete verifier problem, M222 prepends one blank sentinel to the canonical builder workspace, derives the complete M220/M221 classifier prefix, proves that prefix contains no blank, and chains M221 to one fixed ten-rule left scanner. The resulting collision-free 740-rule machine crosses exactly the classifier prefix and halts at the sentinel with a tape equal to the spatial mirror of M217's canonical Finish request entry, retaining classifier evidence as exterior data. Exact work, six-for-one compiled execution, one-step-short nonhalting, a derived prefix-size bound and one source-input-size polynomial bound are proved. All 57 public declarations are axiom-audited: 27 have empty closure and 30 use only propext and Quot.sound, with no project axiom or Classical.choice. This milestone closes only the physical workspace-orientation edge for the unique full-classifier Finish path. Equality with a spatial mirror of M217's canonical request entry does not prove that M217's existing machine executes on the mirrored representation. It does not derive body-token or padding requests, run a mirrored dispatcher, connect successive schedule configurations, implement one repeated raw-machine builder loop, prove builder FunctionProgram.RawRefinement, or package the Cook-Levin PolynomialReduction. It does not establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a fixed checkpoint or global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 198 of 200. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
