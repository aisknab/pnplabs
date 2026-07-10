# Historical verifier-run import directory

This directory is retained for auditability. New `PNPActivatedVerificationRunRecord0` records are not accepted while the project is in formal reconstruction.

The former activated record schema asserted a theorem-emission boundary that has been superseded. The current status records:

```text
mathematicalTheoremEstablished = false
publicTheoremEmissionAllowed = false
publicTheoremStatement = null
finalTheoremReady = false
projectSpecificAxiomsRemaining = true
```

The normalization and comparison utilities may still inspect archived records. Import into `public/pnp-verification-runs.json` fails with `ImportRun.IntakeFrozen`, and the issue-ingest workflow cannot open registry-update pull requests.

Do not add new files here unless a future schema and current-status intake process are introduced in a separate reviewed change.
