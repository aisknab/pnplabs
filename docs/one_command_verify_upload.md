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
## Current proof boundary

<!-- CURRENT_CORRECTIONS:SUMMARY:START -->
### Why expanding an exhaustive search does not fix its size problem

Correction, not an earned milestone. Published 2026-10-13.

A checked family of circuit examples shows a limit of expanding the existing exhaustive search. For these inputs, any accepted improvement needs a complete candidate list that eventually exceeds every polynomial bound in the encoded input length.

This rules out a polynomial-size guarantee for that fully materialized enumeration strategy, not every possible solver. It does not bound how many candidates a selective search must visit, rule out compressed or lazy methods, or claim that these examples arise from the SAT reduction. It does not settle P versus NP or earn additional proof-completion credit.

This correction adds no earned positive publication row or fixed checkpoint credit.

[Read the verified correction and its limits](../updates.html#growing-window-enumeration-size-correction).

### Why a complete local search can still miss a global improvement

Correction, not an earned milestone. Published 2026-09-30.

The project has verified a limit of the implemented circuit search: no fixed cap on the number of gates checked together makes it a complete test for global minimality. For every such cap, a circuit can be made smaller even though the complete bounded search finds no accepted improvement. Every proper selected part, including disconnected selections, is already minimal when its boundary inputs are treated as independent.

The result rules out using this fixed-size local search alone to certify that an entire circuit is minimal. It does not settle P versus NP or rule out growing windows or transformations that use the surrounding circuit. A corrected route must still prove global coverage and polynomial runtime for the complete construction. This correction does not earn a positive milestone or increase the proof-completion estimate.

This correction adds no earned positive publication row or fixed checkpoint credit.

[Read the verified correction and its limits](../updates.html#fixed-window-global-minimum-correction).

### A verified limit on replacing parts of a circuit

Correction, not an earned milestone. Published 2026-09-24.

The project has verified a counterexample to an unrestricted reading of the original report's replacement claim. The checked example has a smaller replacement for one part, but inserting it would create a circular dependency; the whole circuit was already minimal.

This does not invalidate the checked replacement results that enforce the necessary restrictions, and it does not settle P versus NP. It identifies a central obligation for the next research: derive the admissible replacements and show that the general method can use them without losing the required saving.

This correction adds no earned positive publication row or fixed checkpoint credit.

[Read the verified correction and its limits](../updates.html#unrestricted-compatible-support-slack-correction).
<!-- CURRENT_CORRECTIONS:SUMMARY:END -->

### Latest earned milestone: M282

**Safely simplifying the remaining problem**

The project now has a checked method that repeatedly simplifies the remaining problem without losing or inventing solutions. A solution of the reduced problem can be translated back into a valid answer for the original input; when the method returns yes or no, that answer is proved sound.

This is still a partial method: it can stop with an unknown result rather than decide every input. The proved bound counts reduction steps only, not their total running time. A complete polynomial-time solver and the remaining global proof obligations are still open.

Formal artefact coverage: 258 of 260 current scoped publication rows earned. Risk-weighted proof completion estimate: 40%. Uncertainty range: 20% to 40%. Global gates closed: 0 of 5.

This publication changes no fixed weighted checkpoint. Added publication rows do not mechanically increase the proof-completion estimate, which is neither a probability of correctness nor a time estimate. Project-specific axioms remaining: 0. The eligible root `PNP.Main.p_eq_np` is absent and the publication gate is false.

Current release source: [`7f57cbda41e5911970c838697e87d51706c79e3c`](https://github.com/aisknab/pnp/tree/7f57cbda41e5911970c838697e87d51706c79e3c), tree `2c61c88e30b8c32a7d7fce126fa4cb8036a9246f`.

Original latest-earned source: [`7f57cbda41e5911970c838697e87d51706c79e3c`](https://github.com/aisknab/pnp/tree/7f57cbda41e5911970c838697e87d51706c79e3c), tree `2c61c88e30b8c32a7d7fce126fa4cb8036a9246f`. Original latest-earned review coordinate: `PNP-FORMAL-RECONSTRUCTION-STATUS-2026-10-15-282`.

Inspect the [latest earned update](../updates.html#2026-10-15-source-bound-partial-residual-reducer) and the [complete current milestone ledger](../status.html). The separately labelled corrections above preserve their original publication records.
<!-- CURRENT_PUBLICATION:END -->
