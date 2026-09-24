# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 6296c6e1130fbae674548ccbf949f6e608b996c7
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` checks the distinct verifier, regression, axiom, status, public-surface and archive contracts; `report:check` verifies derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The latest source-derived support-search result and its limitations are recorded in the current-publication section below. Reuse successful exact-core evidence when validating only the site mirror.

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


<!-- CURRENT_PUBLICATION:START -->
## M280 current publication

**Proving cost comparisons for nested completed supports**

For nested supports that have already been completed by the existing construction, the project now builds the comparison circuits needed to prove cost and positive-saving bounds. The bounds follow from those physical constructions instead of being assumptions.

This establishes the enlargement step for already-completed supports. It does not show that every raw local witness can be completed without losing its saving, and the complete admissibility and global routing arguments remain open.

Formal artefact coverage: 256 of 258 current scoped publication rows earned. Risk-weighted proof completion estimate: 40%. Uncertainty range: 20% to 40%. Global gates closed: 0 of 5.

### A verified limit on replacing parts of a circuit

The project has verified a counterexample to an unrestricted reading of the original report's replacement claim. The checked example has a smaller replacement for one part, but inserting it would create a circular dependency; the whole circuit was already minimal.

This does not invalidate the checked replacement results that enforce the necessary restrictions, and it does not settle P versus NP. It identifies a central obligation for the next research: derive the admissible replacements and show that the general method can use them without losing the required saving.

This correction adds no earned positive publication row or fixed checkpoint credit.

This batch changes no fixed weighted checkpoint. Added publication rows do not mechanically increase the proof-completion estimate, which is neither a probability of correctness nor a time estimate. Project-specific axioms remaining: 0. The eligible root `PNP.Main.p_eq_np` is absent and the publication gate is false.

Current source: [`f14cb7a87004ebedfa55351f6ba20d68a333cc18`](https://github.com/aisknab/pnp/tree/f14cb7a87004ebedfa55351f6ba20d68a333cc18), tree `1cbaf64d8a7303b154848ec73f38e85e406defca`. Original current review coordinate: `PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-20-280`. Inspect the [source-bound update](../updates.html#2026-09-24-computed-closed-support-nested-positivity), the [verified correction](../updates.html#unrestricted-compatible-support-slack-correction) and the [complete current milestone ledger](../status.html).

M230 and M231 close complete Cook-Levin emission/refinement and concrete CNF-SAT NP-completeness. NP-completeness is not a deterministic polynomial-time SAT algorithm. M243 consumes that checked hardness in the still-conditional report bridge; the complete minimization-loop certificate and its existence premise remain unconstructed. Earlier named component limitations describe those standalone components and do not negate later earned results.
<!-- CURRENT_PUBLICATION:END -->
