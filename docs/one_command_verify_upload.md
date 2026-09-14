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
## M262 current publication boundary

**Arbitrary-width circuit expansion with explicit copy costs**

The construction now compiles an actual replacement circuit for arbitrary finite supports and incoming-boundary widths. Given complete local open-function agreement, it preserves every ordinary output and tracked computational wire field. It derives the physical dependency order and compiler success from the source rather than requiring a supplied schedule or correctness certificate.

Every distinct retained physical producer pays for a complete replacement copy. The expanded circuit retains each exterior gate once and saves gates only when the total cost of all replacement copies is smaller than the selected support. A smaller local replacement alone is insufficient. This is not global circuit minimization or a theorem of total polynomial runtime; the full manuscript carrier and obligation calculus, unconditional ZeroSlack, exact general PCCMin and the eligible root remain open. No fixed weighted checkpoint or global gate changes.

Formal artefact coverage: 238 of 240 current scoped publication rows earned. Risk-weighted proof completion estimate: 40%. Uncertainty range: 20% to 40%. Global gates closed: 0 of 5.

This batch changes no fixed weighted checkpoint. Added publication rows do not mechanically increase the proof-completion estimate, which is neither a probability of correctness nor a time estimate. Project-specific axioms remaining: 0. The eligible root `PNP.Main.p_eq_np` is absent and the publication gate is false.

Current source: [`c3d4d9a115a357b44ee8104d129ee15e3174ec7f`](https://github.com/aisknab/pnp/tree/c3d4d9a115a357b44ee8104d129ee15e3174ec7f), tree `7bd3bc5854b0307330e9e405b5857de658eba54e`. Original current review coordinate: `PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-14-262`. Inspect the [exact compiled scope and non-claim](https://github.com/aisknab/pnp/blob/c3d4d9a115a357b44ee8104d129ee15e3174ec7f/docs/lean_wire_causal_expansion.md), the [source-bound update](../updates.html#2026-09-14-wire-causal-expansion) and the [complete current milestone ledger](../status.html).

M230 and M231 close complete Cook-Levin emission/refinement and concrete CNF-SAT NP-completeness. NP-completeness is not a deterministic polynomial-time SAT algorithm. M243 consumes that checked hardness in the still-conditional report bridge; the complete minimization-loop certificate and its existence premise remain unconstructed. Earlier named component limitations describe those standalone components and do not negate later earned results.
<!-- CURRENT_PUBLICATION:END -->
