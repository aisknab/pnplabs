# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 1d4e562bef4d03c54f22a01983a3842198aef0ae
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Uniform Cook-Levin full-schedule cursor controller**, has this scope: For every concrete polynomial-time verifier and raw input, the exact polynomial body-opportunity count equals the complete token schedule after the padded unary header. A semantic cursor returns the full canonical schedule and emitted formula. One deterministic finite raw machine composes the complete header, generated count and terminal-coordinate evaluators, and a fixed positive countdown table. It consumes the arbitrary body count exactly, materializes the unique terminal coordinate, accepts within an explicit input-size polynomial bound, and remains fail-closed for malformed countdown geometry, the unlaunched header endpoint, and one-step-short fuel. The semantic cursor exposes the full canonical schedule and emitted formula, but the raw countdown loop does not decode or emit the body entries it traverses. M208 is therefore a uniform control scaffold, not the complete raw Cook-Levin formula builder or its FunctionProgram.RawRefinement, and it does not package the concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness transport, put CNFSAT in P, close a global gate, create the eligible root theorem, or prove P = NP. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
