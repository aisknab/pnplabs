# One-command verifier upload

The public reviewer flow is now intentionally short:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
npm ci
npm run verify
```

After the verifier completes, the CLI asks:

```text
Verify complete.
Upload verification run to PNP Labs? [y/N]
```

Type `y` or `yes` to submit the run report.

## Automatic upload

Automatic upload works when one of these is available in the verifier environment:

```text
PNPLABS_UPLOAD_TOKEN
GITHUB_TOKEN
GH_TOKEN
authenticated GitHub CLI `gh`
```

The token only needs permission to create issues in `aisknab/pnplabs`.

For non-interactive systems:

```bash
PNPLABS_UPLOAD_TOKEN=<github-token> npm run pnp:verify:upload
```

## Manual fallback

If no upload token or authenticated `gh` CLI is available, the verifier still writes:

```text
artifacts/pnplabs-upload/latest-run-record.json
artifacts/pnplabs-upload/latest-issue-body.md
```

It also prints a prefilled PNP Labs issue URL. Open the URL and paste the saved issue body.

## What gets submitted

The generated issue body contains an importable `PNPActivatedVerificationRunRecord0` with:

```text
pnpCommit
publicTheoremEmissionAllowed = true
publicTheoremStatement = P = NP
publicTheoremConclusion = P = NP
finalTheoremReady = true
unrestrictedFinalSoundnessDischarged = true
remainingBlockers = []
activatedStatusCoordinate
publicTheoremActivationCoordinate
statusPayloadSha256
environment
commandsRun
proofScriptOutputs
```

A run report is reproducibility evidence for the activated checker-trust verifier stack. It is not an external-consensus claim or peer-review acceptance.
