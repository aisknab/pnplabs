# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout e4af115a66cd5a6715a9363abea7a2008238d401
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **Concrete CNF-SAT NP-hardness and NP-completeness**, has this scope: For every language in the concrete bounded-certificate NP class, M231 extracts its polynomial-time verifier from NP membership and applies the complete source-derived all-input Cook-Levin PolynomialReduction to CNFSAT. Together with the existing concrete CNFSAT verifier, the closed theorem proves NPComplete CNFSAT in the selected finite-machine model. No reduction, execution trace, finite-instance restriction or correctness certificate is supplied. Both complete theorem interfaces are root-built and axiom-audited; their closures contain only the Lean standard axioms Classical.choice, Quot.sound and propext. NP-completeness is hardness plus NP membership, not a deterministic polynomial-time SAT algorithm. This closes only the fixed concrete NP-hardness checkpoint. It does not close the separate final complexity transport to P = NP, unconditional residual minimization or ZeroSlack, complete polynomial PCCMin construction and certificate bounds, deterministic CNFSAT in P, or the eligible root theorem. All five global proof gates and the publication gate remain open; P = NP is not proved. The fixed reductions-concrete-np-hardness checkpoint earns 2 points, raising the risk-weighted estimate from 38% to 40%. Formal artefact coverage is 207 of 209 current scoped publication rows earned. All five global gates remain open. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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


## M231 current publication boundary

M230 completes the all-input Cook-Levin formula builder. M231 combines its polynomial reduction with the concrete verifier to prove CNF-SAT NP-completeness in the finite-machine model. This is not a polynomial-time SAT algorithm. Risk-weighted proof completion estimate: 40%, with uncertainty 20% to 40%. Formal artefact coverage: 207 of 209 current scoped publication rows earned. Global gates closed: 0 of 5. Project-specific axioms remaining: 0. The eligible root theorem PNP.Main.p_eq_np remains absent and the publication gate is false.

Current source: [`e4af115a66cd5a6715a9363abea7a2008238d401`](https://github.com/aisknab/pnp/tree/e4af115a66cd5a6715a9363abea7a2008238d401). The exact compiled evidence and limitation are recorded in the [NP-completeness result note](https://github.com/aisknab/pnp/blob/e4af115a66cd5a6715a9363abea7a2008238d401/docs/lean_cook_levin_np_completeness.md). Earlier named component limitations describe those components, not the now-complete M230 builder.
