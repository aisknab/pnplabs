# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 9f009edfa7588f47df90a338880bbdd9ce25ac93
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Fixed Cook-Levin post-header raw quotient/remainder divider**, has this scope: For every natural dividend and positive unary width, one fixed 99-rule deterministic work machine reaches the exact natural quotient and strict remainder tape, reconstructs the dividend, compiles with exactly six raw transitions per certified work step, times out one step short, and satisfies an explicit quadratic bound in the complete unary encoded input length. The zero-width dispatcher returns none. M210 body coordinates instantiate the same decoded quotient and remainder. All 55 public declarations are axiom-audited with only the approved Lean-standard closure and no project axiom or Classical.choice. M211 adds a standalone raw quotient/remainder kernel with an exact compiled trace and unary encoded-size quadratic bound. It is not spliced onto M209's checked raw result, does not classify Finish or out-of-range routes, does not emit or append a Cook-Levin body token, and does not complete the raw formula builder or its FunctionProgram.RawRefinement. It does not package the concrete Cook-Levin PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness transport or CNFSAT in P, close a global gate, create the eligible root theorem, or prove P = NP. No fixed weighted checkpoint changes, so the risk-weighted estimate remains 35% while formal artefact coverage becomes 187 of 189. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
