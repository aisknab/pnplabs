# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout ab5ed194e1420eb801dfdbf98b27a5fcc4fd4b98
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The newest row, **PkgC restoration coverage and exact ambient charge-coordinate descent**, has this scope: For every arbitrary finite exact ambient embedding returned by M206, unsigned BN4 charge is computed as the sum of cell masses. Exact permutation decomposes ambient charge into a strictly positive coverage-derived cancellation charge plus remainder charge. The remainder therefore strictly decreases the eighth chargeSize coordinate of the exact ten-coordinate TerminalResidualRank for every fixed surrounding context while preserving the complete canonical residual ledger. All other M206 outcomes remain explicit. The terminal problem, checked BCEL-ready certificate, active PkgC source cells and cuts, restoration-coordinate universes and maps, ambient BN4 ledgers, semantic full candidates, Packet ranks and claims, dependency table, checked HB closure, route-clear result, and selector silence remain explicit supplied inputs. M207 proves exact charge-coordinate descent only for M206's successful ambient embedding. It does not prove the computed remainder is empty or turn Hall deficits, ambient incompatibility, or activation mismatches into complete global routes. This milestone does not finish terminal-input derivation, complete PkgC/BN3--BN6 integration, HN/BUD/HB semantic completeness, manuscript-wide SaturatePositive or BCELReady, unconditional ZeroSlack, executable polynomial PCCMin, complete encoded-size polynomial bounds, CNFSAT in P, a global gate, the eligible root theorem, or P = NP. `PNP.Main.p_eq_np` is absent; no project-specific axioms remain and five blockers remain.

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
